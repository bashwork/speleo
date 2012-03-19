import tornado.web

class AboutHandler(tornado.web.RequestHandler):

    RoutePath = r'/about'

    def get(self):
        self.render('about.html')

class AnalyzeHandler(tornado.web.RequestHandler):

    RoutePath = r'/analyze'

    def get(self):
        self.render('analyze.html')

class QueryHandler(tornado.web.RequestHandler):

    RoutePath = r'/query'

    def get(self):
        self.render('query.html')

class HealthHandler(tornado.web.RequestHandler):

    RoutePath = r'/health'

    def get(self):
        self.render('health.html')
