import tornado.web

# ------------------------------------------------------------
# page handlers
# ------------------------------------------------------------
class LoginHandler(tornado.web.RequestHandler):

    RoutePath = r'/auth/login'

    def get(self):
       self.render('login.html')

    def post(self):
        pass

class LogoutHandler(tornado.web.RequestHandler):

    RoutePath = r'/auth/logout'

    def get(self):
       self.render('login.html')

# ------------------------------------------------------------
# api handlers
# ------------------------------------------------------------

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['LogoutHandler', 'LoginHandler']
