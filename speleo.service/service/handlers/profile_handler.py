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

    RoutePath = r'/api/v1/user/query/([0-9]*)/?'

    @tornado.web.authenticated
    def get(self, qid=None):
        queries = self.get_current_user().queries
        if qid: 
            qid = int(qid)
            data = next((q.serialized for q in queries if q.id == qid), None)
        else: data = [q.serialized for q in queries]
        self.write({ 'data' : data })

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
                self.db.commit()
        self.write(self.serialize({ 'data': 'OK' }))

    put = post

class UserApiHandler(BaseHandler):
 
    RoutePath = r'/api/v1/user/([0-9]*)/?'
 
    @tornado.web.authenticated
    def get(self, uid=None):
        if uid:
            user = User.query.get(int(uid))
        else: user = self.get_current_user()
        self.write(self.serialize(user))
 
    @tornado.web.authenticated
    def post(self, qid):
        # create or update
        pass
 
    @tornado.web.authenticated
    def delete(self, uid=None):
        if uid:
            User.query.delete(uid)
            self.db.commit()
        self.write(self.serialize({ 'data': 'OK' }))

    put = post

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = ['ProfileHandler', 'UserApiHandler', 'QueryApiHandler']
