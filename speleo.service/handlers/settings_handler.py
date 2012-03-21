import common
import tornado.web;

class SettingsHandler(common.BaseHandler):

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
