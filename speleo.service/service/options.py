import os
import tornado
from tornado.options import define


# ------------------------------------------------------------ 
# global options
# ------------------------------------------------------------ 
define('debug', default=False, help="Set to true to enable debugging", type=bool)
define('port', default=8888, help="The port to run the service on", type=int)
define('asset_url', default='/static', help='The url used for static assets', type=str)
define('elastic', default='127.0.0.1:9200', help="The list of elastic search hosts to balance", type=str)
define('security', default='disabled', help='disabled|unix|ldap', type=str)
define('database', default='sqlite:////tmp/example.db', help="The database connection string to use", type=str)
define('ldap_host', default='ldap://127.0.0.1', help='The ldap service to authenticate against', type=str)
define('ldap_domain', default='', help='The domain to authenticate users under', type=str)
define('ldap_basedn', default='', help='The base dn to search for users under', type=str)
define('ldap_binddn', default=None, help='A priviledged user to perform ldap binds', type=str)
define('ldap_bind_password', default=None, help='The priviledged user password', type=str)
define('allowed_auth', default=['login'], help='The login systems allowed', type=list)


# ------------------------------------------------------------ 
# exported method
# ------------------------------------------------------------ 
def get_options(path):
    ''' Retrieve the service options
    '''
    path = os.path.join(path, 'settings.py')
    if os.path.exists(path):
        tornado.options.parse_config_file(path)
    tornado.options.parse_command_line()
    return tornado.options.options
