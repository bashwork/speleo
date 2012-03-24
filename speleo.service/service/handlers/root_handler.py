from service.handlers.common import BaseHandler

class RootHandler(BaseHandler):

    RoutePath = r'/'

    def get(self):
        self.redirect('/search')

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['RootHandler']
