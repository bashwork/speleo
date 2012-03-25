import crypt
import pwd, spwd
import logging

try:
    import ldap
except ImportError: pass

class DisabledSecurity(object):
    ''' Authentication is disabled completely '''

    def __init__(self):
        ''' Initializes a new instance of the disabled security
        '''
        logging.error("Running the service without security!")

    def authenticate(self, username, password):
        ''' Authenticate the supplied user

        :param username: The username to authenticate
        :param password: The password to validate the user with
        :returns: The authenticated user or None
        '''
        logging.info("user %s logged in" % username)
        return {
            'name':     username,
            'username': username,
        }


class LdapSecurity(object):
    ''' Use an ldap system as the security managment backend
    '''
    __fields = {
        'email':        { 'group': False, 'field': 'mail', },
        'name':         { 'group': False, 'field': 'sAMAccountName', },
        'username':     { 'group': False, 'field': 'sAMAccountName', },
        'first_name':   { 'group': False, 'field': 'givenName', },
        'last_name':    { 'group': False, 'field': 'sn', },
        #'roles':        { 'group': True,  'field': 'memberOf', },
        #'dn':           { 'group': False, 'field': 'distinguishedName', },
        #'last_logon':   { 'group': False, 'field': 'lastLogonTimestamp', },
        #'created':      { 'group': False, 'field': 'whenCreated', },
        #'title':        { 'group': False, 'field': 'title', },
        #'manager':      { 'group': False, 'field': 'manager', },
        #'department':   { 'group': False, 'field': 'department', },
        #'company':      { 'group': False, 'field': 'company', },
        #'address':      { 'group': False, 'field': 'streetAddress', },
        #'city':         { 'group': False, 'field': 'l', },
        #'state':        { 'group': False, 'field': 'st', },
        #'zipcode':      { 'group': False, 'field': 'postalCode', },
        #'telephone':    { 'group': False, 'field': 'telephoneNumber', },
    }
    __attrs = [m['field'] for m in __fields.values()]

    def __init__(self, options):
        ''' Initialize a new instance of the the ldap security

        :param options.ldap_host: The ldap host to authentiate with
        :param options.ldap_basedn: The basedn to search for users in
        :param options.ldap_binddn: If needed, a dn to bind as
        :param options.ldap_bind_password: If needed, the password for the dn to bind as
        :param options.ldap_domain: The domain to validate usernames under
        '''
        self.host    = options.ldap_host
        self.basedn  = options.ldap_basedn
        self.bind_dn = options.ldap_binddn
        self.bind_pw = options.ldap_bind_password
        self.domain  = options.ldap_domain
        logging.info("Authenticating with %s" % self.host)

    def authenticate(self, username, password):
        ''' Authenticate the supplied user

        :param username: The username to authenticate
        :param password: The password to validate the user with
        :returns: The authenticated user or None
        '''
        if not self._is_valid(username, password):
            return None

        scope  = ldap.SCOPE_SUBTREE
        search = "(&(objectCategory=user)(sAMAccountName=%s))" % username
        attrs  = self.__attrs
        binddn = "%s@%s" % (username, self.domain)

        try:
            logging.debug('authenticating user(%s)' % (username))
            l = ldap.initialize(self.host)
            l.protocol_version = ldap.VERSION3
            l.set_option(ldap.OPT_REFERRALS, 0)
            l.simple_bind(self.bind_dn or binddn, self.bind_pw or password)
            results = l.search_ext_s(self.basedn, scope, search, attrs)
            l.unbind_s()
            return [self._parse_fields(user[1]) for user in results][0]
        except ldap.LDAPError, e:
            logging.error(e)
        return None

    def _is_valid(self, username, password, domain=None):
        ''' Check if the supplied user is valid

        :param username: The username to validate
        :param password: The password to validate the user with
        :param domain: The domain to validate the user under
        :returns: True if valid False otherwise
        '''
        binddn = "%s@%s" % (username, domain or self.domain)

        try:
            logging.debug('performing user(%s) validation' % (binddn))
            l = ldap.initialize(self.host)
            l.protocol_version = ldap.VERSION3
            l.set_option(ldap.OPT_REFERRALS, 0)
            l.simple_bind_s(binddn, password)
            l.unbind_s()
            return True
        except ldap.LDAPError, e: return False

    def _parse_fields(self, user):
        result = {}
        for key, meta in self.__fields.items():
            value = user[meta['field']]
            result[key] = value if meta['group'] else value[0]
        return result

class UnixSecurity(object):
    ''' Use an unix password system as the security managment backend
    '''
    __fields = {
        'name':     { 'group': False, 'field': 'pw_name',  },
        'username': { 'group': False, 'field': 'pw_name',  },
        'uid':      { 'group': False, 'field': 'pw_uid',   },
        'gid':      { 'group': False, 'field': 'pw_gid',   },
        'comment':  { 'group': False, 'field': 'pw_gecos', },
    }
    __attrs = [m['field'] for m in __fields.values()]

    def __init__(self, option):
        ''' Initialize a new instance of the unix security

        :param options: The configuration options
        '''
        pass

    def authenticate(self, username, password):
        ''' Authenticate the supplied user

        :param username: The username to authenticate
        :param password: The password to validate the user with
        :returns: The authenticated user or None
        '''
        try:
            attributes = pwd.getpwnam(username)
            crpassword = attributes.pw_passwd
            if crpassword == 'x' or crpassword == '*':
                crpassword = spwd.getspnam(username).sp_pwd
            salt = crpassword.find('$', 3)
            if crypt.crypt(password, crpassword[:salt]) == crpassword:
                return self._parse_fields(attributes)
        except Exception, e:
            logging.error(e)
        return None

    def _parse_fields(self, attrs):
        result = {}
        for key, meta in self.__fields.items():
            result[key] = getattr(attrs, meta['field'])
        return result

def get_security(options):
    ''' Factory for the security implementations

    :param options: The security options to use
    :returns: An initialized security implementation
    '''
    security = options.security.lower()
    if security == 'ldap':
        return LdapSecurity(options)
    elif security == 'unix':
        return UnixSecurity(options)
    else: return DisabledSecurity()
