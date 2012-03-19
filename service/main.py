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
define("port", default=8888, help="run on the given port", type=int)

# ------------------------------------------------------------ 
# settings
# ------------------------------------------------------------ 
settings = {
    'static_path': os.path.join(os.path.dirname(__file__), 'static'),
    'template_path': os.path.join(os.path.dirname(__file__), 'templates'),
    'login_url':'/auth/login',
    'debug': True,
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
    tornado.options.parse_command_line()
    application = tornado.web.Application(routes, **settings)
    logging.debug('Installed Handlers')
    for route in routes: logging.debug(route)
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
