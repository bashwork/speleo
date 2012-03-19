import tornado.web

class RootHandler(tornado.web.RequestHandler):

    RoutePath = r'/'

    def get(self):
       self.render('index.html')
