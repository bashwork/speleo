import tornado.web;
from service.handlers.common import BaseHandler

class AboutHandler(BaseHandler):

    RoutePath = r'/about/?'

    def get(self):
        self.render('about.html')

class AnalyzeHandler(BaseHandler):

    RoutePath = r'/analyze/?'

    @tornado.web.authenticated
    def get(self):
        self.render('analyze.html')

class QueryHandler(BaseHandler):

    RoutePath = r'/query/?'

    @tornado.web.authenticated
    def get(self):
        self.render('query.html')

class HealthHandler(BaseHandler):

    RoutePath = r'/health/?'

    @tornado.web.authenticated
    def get(self):
        self.render('health.html')

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['QueryHandler', 'HealthHandler', 'AnalyzeHandler', 'AboutHandler']
