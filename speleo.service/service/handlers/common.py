import tornado.web
import tornado.escape
from service.models import User
from service.serializer import serialize

class BaseHandler(tornado.web.RequestHandler):

    @property
    def assets(self):
        return self.application.assets

    @property
    def security(self):
        return self.application.security

    @property
    def db(self):
        return self.application.database

    @property
    def cache(self):
        return self.application.cache

    def serialize(self, response):
        return serialize(self.request, response)

    def get_current_user(self):
        user_id = self.get_secure_cookie("user")
        if not user_id: return None
        return self.db.query(User).get(user_id)
