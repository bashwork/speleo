import os
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

def command_options(options):
    ''' Prints the current system options '''
    print_banner('Current Service Settings')
    for name, option in options.items():
        print "%20s :: %s" % (name, option.value())

def command_runserver(options):
    ''' Starts the speleo service '''
    from main import SpeleoApplication
    print_banner('Starting Speleo Service')

    try:
        SpeleoApplication().start()
    except Exception, ex:
        print "Experienced error with service, shutting down"
        print ex

def command_build_assets(options):
    ''' Compiles and builds the speleo web assets '''
    print_banner('Building Service Assets')
    options.debug = False
    assets = service.get_assets(options)

    print assets.javascripts
    print assets.stylesheets

# ------------------------------------------------------------ 
# utility methods
# ------------------------------------------------------------ 
def print_cmd_help():
    pass

def parse_cmd_arguments():
    pass

def print_banner(message):
    # pull docstring and print
    print "-"*50
    print message
    print "-"*50


# ------------------------------------------------------------ 
# main runner
# ------------------------------------------------------------ 
if __name__ == '__main__':
    root_path = os.path.dirname(__file__)
    options = service.get_options(root_path)
    #command_shell(options)
    #command_options(options)
    #command_runserver(options)
    #command_build_assets(options)
    command_dbshell(options)
