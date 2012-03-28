import os
import os.path
import inspect
import logging
import tornado.ioloop
import tornado.web
import service


# ------------------------------------------------------------ 
# application
# ------------------------------------------------------------ 
class SpeleoApplication(tornado.web.Application):

    def __init__(self):
        # ---------------------------------------------------- 
        # service settings
        # ---------------------------------------------------- 
        root_path    = os.path.dirname(__file__)
        self.options = service.get_options(root_path)
        settings     = {
            'static_path': os.path.join(root_path, 'static'),
            'template_path': os.path.join(root_path, 'templates'),
            'login_url':'/auth/login',
            'cookie_secret':'something random should go here',
            'xsrf_cookies':False,
            'debug': self.options.debug,
        }

        # ---------------------------------------------------- 
        # route handlers
        # ---------------------------------------------------- 
        search = inspect.getmembers(service.handlers)
        routes = [(h.RoutePath, h) for n, h in search if 'Handler' in n]

        # ---------------------------------------------------- 
        # authentication systems
        # ---------------------------------------------------- 
        remove = []
        logins = ['logout'] + self.options.allowed_auth
        for path, handler in routes:
            if path.startswith('/auth/') and path.split('/')[2] not in logins:
                logging.debug('removing %s authentication service' % path)
                remove.append((path, handler))
        for route in remove: routes.remove(route)

        # ---------------------------------------------------- 
        # shared resources
        # ---------------------------------------------------- 
        self.assets   = service.get_assets(self.options)
        self.security = service.get_security(self.options)
        self.database = service.get_database(self.options)

        # ---------------------------------------------------- 
        # initialize service
        # ---------------------------------------------------- 
        tornado.web.Application.__init__(self, routes, **settings)
        logging.debug('Installed Routes')
        for route in sorted(routes): logging.debug(route)
        logging.debug('Service started on port %d' % self.options.port)

    def start(self):
        ''' A helper method to start the service
        '''
        self.listen(self.options.port)
        tornado.ioloop.IOLoop.instance().start()

# ------------------------------------------------------------ 
# service runner
# ------------------------------------------------------------ 
if __name__ == "__main__":
    SpeleoApplication().start()
