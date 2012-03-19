import tornado.web

class DashboardHandler(tornado.web.RequestHandler):

    RoutePath = r'/dashboard'

    def get(self):
        self.render('dashboard.html')

    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['DashboardHandler']
