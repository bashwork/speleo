import tornado.web

class ElasticProxyHandler(tornado.web.RequestHandler):

    RoutePath = r'/api/v1/elastic'

    def get(self):
        pass

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['ElasticProxyHandler']
