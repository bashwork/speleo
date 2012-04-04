import logging
import tornado.escape
import tornado.auth
import tornado.web
from service.handlers.common import BaseHandler
from service.models import User


# ------------------------------------------------------------
# helper methods
# ------------------------------------------------------------
def save_user(database, attributes):
    ''' Given a user, save if the user doesn't exist
    otherwise update its data.

    :param database: The database to save to
    :param attributes: The attributes to update with
    :returns: The user identifier
    '''
    user = User.query.filter_by(
        username=attributes['username']).first()
    if not user:
        user = User(**attributes)
        database.add(user)
        database.commit()
        logging.debug('saved new user %s' % user.id)
    return u"%s" % user.id


# ------------------------------------------------------------
# page handlers
# ------------------------------------------------------------
class LoginHandler(BaseHandler):

    RoutePath = r'/auth/login'

    def get(self):
        self.render('login.html', next=self.get_argument('next', '/'))

    def post(self):
        username = self.get_argument('username', '')
        password = self.get_argument('password', '')
        session  = self.security.authenticate(username, password)
        if session:
            self.set_secure_cookie('user', save_user(self.db, session))
            self.redirect(self.get_argument('next', '/'))
        else: self.redirect('/auth/login')


class GoogleAuthHandler(BaseHandler, tornado.auth.GoogleMixin):

    RoutePath = r'/auth/google'

    @tornado.web.asynchronous 
    def get(self):
        if self.get_argument("openid.mode", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))
            return
        self.authenticate_redirect()

    def _on_auth(self, user):
        if not user:
            raise tornado.web.HTTPError(500, "Google authentication failed")
        self.set_secure_cookie('user', save_user(self.db, session))
        self.redirect(self.get_argument("next", "/"))


class TwitterAuthHandler(BaseHandler, tornado.auth.TwitterMixin):

    RoutePath = r'/auth/twitter'

    @tornado.web.asynchronous 
    def get(self):
        if self.get_argument("oauth_token", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))
            return
        self.authenticate_redirect()

    def _on_auth(self, user):
        if not user:
            raise tornado.web.HTTPError(500, "Twitter authentication failed")
        self.set_secure_cookie('user', save_user(self.db, session))
        self.redirect(self.get_argument("next", "/"))


class FacebookAuthHandler(BaseHandler, tornado.auth.FacebookMixin):

    RoutePath = r'/auth/facebook'

    @tornado.web.asynchronous 
    def get(self):
        if self.get_argument("session", None):
            self.get_authenticated_user(self.async_callback(self._on_auth))
            return
        self.authenticate_redirect()

    def _on_auth(self, user):
        if not user:
            raise tornado.web.HTTPError(500, "Facebook authentication failed")
        self.set_secure_cookie('user', save_user(self.db, session))
        self.redirect(self.get_argument("next", "/"))


class LogoutHandler(BaseHandler):

    RoutePath = r'/auth/logout'

    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/auth/login"))


# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = [
    'LogoutHandler', 'LoginHandler',
    'GoogleAuthHandler', 'TwitterAuthHandler', 'FacebookAuthHandler'
]
