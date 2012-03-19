import os
import os.path
import inspect
import logging
import handlers
import tornado.ioloop
import tornado.web
from tornado.options import define, options

# ------------------------------------------------------------ 
# options
# ------------------------------------------------------------ 
define("debug", default=False, help="Set to true to enable debugging", type=bool)
define("port", default=8888, help="The port to run the service on", type=int)
define('security', default='none', help='none|ldap', type=str)
define('ldap_host', default='ldap://127.0.0.1', help='The ldap service to authenticate against', type=str)
define('ldap_domain', default='', help='The domain to authenticate users under', type=str)
define('ldap_basedn', default='', help='The base dn to search for users under', type=str)
define('ldap_bind_dn', default=None, help='A priviledged user to perform ldap binds', type=str)
define('ldap_bind_password', default=None, help='The priviledged user password', type=str)

# ------------------------------------------------------------ 
# settings
# ------------------------------------------------------------ 
settings = {
    'static_path': os.path.join(os.path.dirname(__file__), 'static'),
    'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
    'login_url':'/auth/login',
    'cookie_secret':'something random should go here',
    'xsrf_cookies':True,
    'debug': options.debug,
}

# ------------------------------------------------------------ 
# handlers
# ------------------------------------------------------------ 
search = inspect.getmembers(handlers)
routes = [(h.RoutePath, h) for n,h in search if 'Handler' in n]

# ------------------------------------------------------------ 
# main service
# ------------------------------------------------------------ 
if __name__ == "__main__":
    tornado.options.parse_config_file('settings.py')
    tornado.options.parse_command_line()
    application = tornado.web.Application(routes, **settings)
    logging.debug('Installed Handlers')
    for route in routes: logging.debug(route)
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
