import os
import os.path
import inspect
import logging
import tornado.ioloop
import tornado.web
from tornado.options import define, options
import handlers
import models
import security

# ------------------------------------------------------------ 
# options
# ------------------------------------------------------------ 
define('debug', default=False, help="Set to true to enable debugging", type=bool)
define('port', default=8888, help="The port to run the service on", type=int)
define('elastic', default='127.0.0.1:9200', help="The list of elastic search hosts to balance", type=str)
define('security', default='none', help='none|ldap', type=str)
define('database', default='sqlite:////tmp/example.db', help="The database connection string to use", type=str)
define('ldap_host', default='ldap://127.0.0.1', help='The ldap service to authenticate against', type=str)
define('ldap_domain', default='', help='The domain to authenticate users under', type=str)
define('ldap_basedn', default='', help='The base dn to search for users under', type=str)
define('ldap_binddn', default=None, help='A priviledged user to perform ldap binds', type=str)
define('ldap_bind_password', default=None, help='The priviledged user password', type=str)
define('allowed_auth', default=['login'], help='The login systems allowed', type=list)


# ------------------------------------------------------------ 
# application
# ------------------------------------------------------------ 
class SpeleoApplication(tornado.web.Application):

    def __init__(self):
        # ---------------------------------------------------- 
        # settings
        # ---------------------------------------------------- 
        root_path = os.path.dirname(__file__)
        settings = {
            'static_path': os.path.join(root_path, 'static'),
            'template_path': os.path.join(root_path, 'templates'),
            'login_url':'/auth/login',
            'cookie_secret':'something random should go here',
            'xsrf_cookies':False,
            'debug': options.debug,
        }

        # ---------------------------------------------------- 
        # handlers
        # ---------------------------------------------------- 
        search = inspect.getmembers(handlers)
        routes = [(h.RoutePath, h) for n, h in search if 'Handler' in n]

        # ---------------------------------------------------- 
        # authentication systems
        # ---------------------------------------------------- 
        remove = []
        logins = ['logout'] + options.allowed_auth
        for path, handler in routes:
            if path.startswith('/auth/') and path.split('/')[2] not in logins:
                logging.debug('removing %s authentication service' % path)
                remove.append((path, handler))
        for route in remove: routes.remove(route)

        # ---------------------------------------------------- 
        # shared
        # ---------------------------------------------------- 
        self.security = security.get_security(options.security, options)
        self.database = models.get_database(options.database, options.debug)
        #self.cache = memcache.Client([options.cache], debug=options.debug)

        # ---------------------------------------------------- 
        # initialize
        # ---------------------------------------------------- 
        tornado.web.Application.__init__(self, routes, **settings)
        logging.debug('Installed Routes')
        for route in sorted(routes): logging.debug(route)
        logging.debug('Service started on port %d' % options.port)

# ------------------------------------------------------------ 
# service
# ------------------------------------------------------------ 
if __name__ == "__main__":
    tornado.options.parse_config_file('settings.py')
    tornado.options.parse_command_line()
    SpeleoApplication().listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
