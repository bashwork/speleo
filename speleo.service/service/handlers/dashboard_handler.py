import tornado.web;
from service.handlers.common import BaseHandler

class DashboardHandler(BaseHandler):

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
