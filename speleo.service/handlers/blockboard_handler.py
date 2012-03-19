import tornado.web

class BlockboardHandler(tornado.web.RequestHandler):

    RoutePath = r'/blockboard'

    def get(self):
        self.render('blockboard.html')

    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['BlockboardHandler']
