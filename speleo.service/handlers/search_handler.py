import common
import tornado.web;

class SearchHandler(common.BaseHandler):

    RoutePath = r'/search'

    @tornado.web.authenticated
    def get(self):
        self.render('search.html')

    @tornado.web.authenticated
    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['SearchHandler']
