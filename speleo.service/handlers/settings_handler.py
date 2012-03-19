import tornado.web

class SettingsHandler(tornado.web.RequestHandler):

    RoutePath = r'/settings'

    def get(self):
        self.render('settings.html')

    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['SettingsHandler']
