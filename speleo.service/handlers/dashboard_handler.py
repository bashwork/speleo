import common
import tornado.web;

class DashboardHandler(common.BaseHandler):

    RoutePath = r'/dashboard'

    @tornado.web.authenticated
    def get(self):
        self.render('dashboard.html')

    @tornado.web.authenticated
    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['DashboardHandler']
