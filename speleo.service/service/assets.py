import os
import os.path
import logging
from webassets import Environment, Bundle

class Assets(object):

    def __init__(self, assets):
        self.javascripts = assets['javascript'].urls()
        self.stylesheets = assets['stylesheet'].urls()

def get_assets(options):
    ''' A helper to build the assets for the service

    :param options: The options to initialize with
    :returns: The initialized assets
    '''
    arguments   = {
      'directory': './static',
      'url': options.asset_url,
      'debug': options.debug,
      'updater': 'timestamp',
      'expire': 'querystring',
      'cache': True,
    }
    environment = Environment(**arguments)
    
    # ------------------------------------------------------------ 
    # stylesheet bundle
    # ------------------------------------------------------------ 
    stylesheet = Bundle('css/*.css',
        filters='cssutils', output='cache/speleo.css')
    environment.register('stylesheet', stylesheet)
    
    # ------------------------------------------------------------ 
    # template bundle
    # ------------------------------------------------------------ 
    template = Bundle('tmpl/*.tmpl',
        filters='jst', output='cache/speleo.jst.js', debug=False)
    environment.config['jst_compiler'] = '_.template'
    
    # ------------------------------------------------------------ 
    # javascript bundle
    # ------------------------------------------------------------ 
    javascript = Bundle(
        Bundle('js/lib/core/jquery.js', 'js/lib/core/underscore.js'),
        template, # needs underscore
        Bundle('js/lib/ace/ace.js', 'js/lib/ace/mode-javascript.js'),
        Bundle('js/lib/*.js', 'js/speleo.js'),
        filters='closure_js', output='cache/speleo.js')
    environment.register('javascript', javascript)

    # ------------------------------------------------------------ 
    # output cache
    # ------------------------------------------------------------ 
    if not os.path.exists(os.path.join('./static', 'cache')):
        os.mkdir(os.path.join('./static', 'cache'))

    # ------------------------------------------------------------ 
    # initialized
    # ------------------------------------------------------------ 
    return Assets(environment)

# ------------------------------------------------------------ 
# exports
# ------------------------------------------------------------ 
__all__ = ['get_assets']

# ------------------------------------------------------------ 
# manual command
# ------------------------------------------------------------ 
if __name__ == "__main__":
    class Options(object):
        debug = True

    assets = get_assets(Options())
    print "Compiled stylesheets: ", assets.stylesheets
    print "Compiled javascripts: ", assets.javascripts
