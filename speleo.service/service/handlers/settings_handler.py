import tornado.web;
from service.handlers.common import BaseHandler

class SettingsHandler(BaseHandler):

    RoutePath = r'/settings'

    @tornado.web.authenticated
    def get(self):
        self.render('settings.html')

    @tornado.web.authenticated
    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['SettingsHandler']
