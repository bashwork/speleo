import tornado.web

class RootHandler(tornado.web.RequestHandler):

    RoutePath = r'/'

    def get(self, **kwargs):
       self.render('index.html')
