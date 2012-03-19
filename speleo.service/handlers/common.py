import tornado.web
import tornado.escape

class BaseHandler(tornado.web.RequestHandler):

    @property
    def db(self):
        return self.application.database

    @property
    def cache(self):
        return self.application.cache

    def get_current_user(self):
        user_json = self.get_secure_cooke("user")
        if not user_json: return None
        return tornado.escape.json_decode(user_json)
