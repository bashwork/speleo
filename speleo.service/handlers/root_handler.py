import common

class RootHandler(common.BaseHandler):

    RoutePath = r'/'

    def get(self):
        self.redirect('/search')
