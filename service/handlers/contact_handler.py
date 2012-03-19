import tornado.web

class ContactHandler(tornado.web.RequestHandler):

    RoutePath = r'/contact'

    def get(self):
        self.render('contact.html')

    def post(self):
        subject = self.get_argument('subject', '')
        email = self.get_argument('email', '')
        message = self.get_argument('message', '')
        self.write(subject + ' ' + email + ' ' + message)

