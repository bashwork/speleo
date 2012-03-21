import common
import tornado.web

class BlockboardHandler(common.BaseHandler):

    RoutePath = r'/blockboard'

    @tornado.web.authenticated
    def get(self):
        self.render('blockboard.html')

    @tornado.web.authenticated
    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['BlockboardHandler']
