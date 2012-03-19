import tornado.web

class SearchHandler(tornado.web.RequestHandler):

    RoutePath = r'/search'

    def get(self):
        self.render('search.html')

    def post(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['SearchHandler']
