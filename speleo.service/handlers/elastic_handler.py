import logging
from collections import defaultdict
import tornado.web
import tornado.escape
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
        search = QueryParser(self.request.body).build()
        client = tornado.httpclient.AsyncHTTPClient()
        client.fetch('http://localhost:9200/_all/_search',
            method='POST', body=search, callback=self.callback)

    def callback(self, request):
        self.finish(request.body)

# ------------------------------------------------------------
# query parser
# ------------------------------------------------------------
class QueryParser(object):

    def __init__(self, request=None):
        self.filters = defaultdict(dict)
        self.base    = defaultdict(dict)
        self.queries = defaultdict(dict)
        if request and '=' in request:
            self.complex_parse(request)
        else: self.simple_parse(request)

    def build(self):
        query = dict(self.base)
        if len(self.filters) > 0:
            query['filter'] = dict(self.filters)
        if len(self.queries) > 0:
            query['query'] = dict(self.queries)
        else:
            query['query'] = { 'match_all': {} }
        return tornado.escape.json_encode(query)

    def simple_parse(self, request):
        self.queries['query_string'] = {
            'query': request,
            'default_operator': 'AND',
        }

    def complex_parse(self, request):
        for piece in request.split(' '):
            if 'size' in piece:
                field, value = piece.split('=')
                self.base['size'] = value
            elif 'from' in piece:
                field, value = piece.split('=')
                self.base['from'] = value
            elif 'filter_' in piece:
                field, value = piece.split('=')
                field = field.split('filter_')[1]
                self.filters['term'][field] = value
            elif '=' in piece:
                field, value = piece.split('=')
                self.queries['term'][field] = value
            else:
                self.base['text']['_all'] = piece


# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['ElasticProxyHandler', 'ElasticSearchHandler']
