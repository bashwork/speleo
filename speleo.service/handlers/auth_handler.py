import common

# ------------------------------------------------------------
# page handlers
# ------------------------------------------------------------
class LoginHandler(common.BaseHandler):

    RoutePath = r'/auth/login'

    def get(self):
        self.render('login.html')

    def post(self):
        pass

class LogoutHandler(common.BaseHandler):

    RoutePath = r'/auth/logout'

    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/"))

# ------------------------------------------------------------
# api handlers
# ------------------------------------------------------------

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['LogoutHandler', 'LoginHandler']
