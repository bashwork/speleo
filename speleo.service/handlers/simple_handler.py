import common
import tornado.web;

class AboutHandler(common.BaseHandler):

    RoutePath = r'/about'

    def get(self):
        self.render('about.html')

class AnalyzeHandler(common.BaseHandler):

    RoutePath = r'/analyze'

    @tornado.web.authenticated
    def get(self):
        self.render('analyze.html')

class QueryHandler(common.BaseHandler):

    RoutePath = r'/query'

    @tornado.web.authenticated
    def get(self):
        self.render('query.html')

class HealthHandler(common.BaseHandler):

    RoutePath = r'/health'

    @tornado.web.authenticated
    def get(self):
        self.render('health.html')

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['QueryHandler', 'HealthHandler', 'AnalyzeHandler', 'AboutHandler']
