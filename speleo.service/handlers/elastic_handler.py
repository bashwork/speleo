import logging
from collections import defaultdict
import tornado.web
import tornado.httpclient

class ElasticProxyHandler(tornado.web.RequestHandler):

    RoutePath = r'/api/v1/elastic/proxy/(.*)'

    @tornado.web.asynchronous
    def forward(self, path):
        body   = None if self.request.body == '' else self.request.body
        path   = self.request.uri.split('proxy/')[1]
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch('http://localhost:9200/' + path,
            method=self.request.method,
            body=body,
            headers=self.request.headers,
            follow_redirects=False,
            callback=self.callback)

    # aliases
    get    = forward
    put    = forward
    post   = forward
    delete = forward

    def callback(self, request):
        self.finish(request.body)


class ElasticSearchHandler(tornado.web.RequestHandler):

    RoutePath = r'/api/v1/elastic/search'

    @tornado.web.asynchronous
    def post(self):
        search = QueryParser.parse(self.request.body)
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch('http://localhost:9200/' + path,
            method='POST', body=search, callback=self.callback)

    def callback(self, request):
        self.finish(request.body)

# ------------------------------------------------------------
# query parser
# ------------------------------------------------------------
class QueryParser(object):

    @staticmethod
    def parse(request):
        query = {}
        for piece in request.split(' '):
            if 'size' in piece:
                field, value = piece.split('=')
                query['size'] = value
            if 'from' in piece:
                field, value = piece.split('=')
                query['from'] = value
            elif 'filter_' in piece:
                field, value = piece.split('=')
                field = field.split('filter_')[1]
                query['filter']['term'][field] = value
            elif '=' in piece:
                field, value = piece.split('=')
                query['query']['term'][field] = value
            else:
                query['text']['_all'] = 


# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['ElasticProxyHandler']
