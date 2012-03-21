import logging
import common
import tornado.escape

# ------------------------------------------------------------
# page handlers
# ------------------------------------------------------------
class LoginHandler(common.BaseHandler):

    RoutePath = r'/auth/login'

    def get(self):
        self.render('login.html', next=self.get_argument('next', '/'))

    def post(self):
        username = self.get_argument('username', '')
        password = self.get_argument('password', '')
        session  = self.security.authenticate(username, password)
        if session:
            self.set_secure_cookie('user', tornado.escape.json_encode(session))
            self.redirect(self.get_argument('next', '/'))
        else: self.redirect('/auth/login')

class LogoutHandler(common.BaseHandler):

    RoutePath = r'/auth/logout'

    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/auth/login"))

# ------------------------------------------------------------
# api handlers
# ------------------------------------------------------------

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['LogoutHandler', 'LoginHandler']
