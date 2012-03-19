import common

class BlockboardHandler(common.BaseHandler):

    RoutePath = r'/blockboard'

    def get(self):
        self.render('blockboard.html')

    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['BlockboardHandler']
