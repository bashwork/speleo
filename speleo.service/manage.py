#!/usr/bin/env python
import os
import sys
import tornado.options
import service

# ------------------------------------------------------------ 
# commands
# ------------------------------------------------------------ 
def command_shell(options):
    ''' Drops into a service command shell '''
    from IPython.Shell import IPShellEmbed

    print_banner('Starting Service Shell')
    db = service.get_database(tornado.options.options)
    models = service.models

    ipshell = IPShellEmbed()
    ipshell()
    sys.exit(0)

def command_dbshell(options):
    ''' Drops into a database command shell '''
    print_banner('Starting Database Shell')
    database, path = options.database.split('://', 1)
    command = {
        'sqlite':'sqlite3',
        'mysql':'mysql',
        'postgresql':'psql',
    }[database]
    args = [ 
        path[:1] if path[0] == '/' else path
    ]
    os.execvp(command, args)
    sys.exit(0)

def command_options(options):
    ''' Prints the current system options '''
    print_banner('Current Service Settings')
    for name, option in options.items():
        print "%20s :: %s" % (name, option.value())
    sys.exit(0)

def command_runserver(options):
    ''' Starts the speleo service '''
    from service.main import SpeleoApplication
    print_banner('Starting Speleo Service')

    try:
        SpeleoApplication().start()
    except Exception, ex:
        print "Experienced error with service, shutting down"
        print ex
    sys.exit(0)

def command_build_assets(options):
    ''' Compiles and builds the speleo web assets '''
    print_banner('Building Service Assets')
    options.debug = False
    assets = service.get_assets(options)

    print assets.javascripts
    print assets.stylesheets
    sys.exit(0)

def command_help(options):
    ''' Print the management help commands '''
    print_banner('Available Management Commands')
    for command in get_manage_cmds():
        name = command.__name__.replace('command_', '')
        print "%s\t\t%s" % (name, command.__doc__)
    print
    sys.exit(0)

# ------------------------------------------------------------ 
# utility methods
# ------------------------------------------------------------ 
def get_manage_cmds():
    '''
    '''
    for key, command in globals().items():
        if 'command_' in key:
            yield command

def call_manage_cmd():
    '''
    '''
    root = os.path.dirname(__file__)
    opts = service.get_options(root)
    name = sys.argv[1]
    for key, command in globals().items():
        if name in key: command(opts)
    else: print "invalid command requested"

def print_banner(message):
    '''
    '''
    print "-"*50
    print message
    print "-"*50


# ------------------------------------------------------------ 
# main runner
# ------------------------------------------------------------ 
if __name__ == '__main__':
    call_manage_cmd()
