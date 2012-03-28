import tornado.web
from service.handlers.common import BaseHandler

class ProfileHandler(BaseHandler):

    RoutePath = r'/profile/?'

    def get(self):
        self.render('profile.html')

    def post(self):
        pass


# ------------------------------------------------------------
# api methods
# ------------------------------------------------------------
class QueryApiHandler(BaseHandler):

    RoutePath = r'/api/v1/user/query/(.*)'

    @tornado.web.authenticated
    def get(self, qid):
        queries = self.get_current_user().queries
        if query: 
            queries = [q for q in queries if q.id == qid]
        self.write({ 'data' : queries })

    @tornado.web.authenticated
    def post(self, qid):
        # create or update
        pass

    @tornado.web.authenticated
    def delete(self, qid):
        queries = self.get_current_user().queries
        for query in queries:
            if query.id == qid:
                queries.remove(query)
        if self.db.is_dirty(): self.db.commit()
        self.write({ 'data': 'OK' })

    put = post

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['ProfileHandler']
