import logging
from webassets import Environment, Bundle

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
        filters='cssutils', output='asset/speleo.css')
    environment.register('stylesheet', stylesheet)
    
    # ------------------------------------------------------------ 
    # javascript bundle
    # ------------------------------------------------------------ 
    javascript = Bundle('js/lib/*.js', 'js/*.js',
        filters='closure_js', output='asset/speleo.js')
    environment.register('javascript', javascript)
    
    # ------------------------------------------------------------ 
    # template bundle
    # ------------------------------------------------------------ 
    template = Bundle('tmpl/*.tmpl',
        filters='jst', output='asset/speleo.jst.js')
    environment.register('template', template)
    environment.config['jst_compiler'] = '_.template'

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

    environment = get_assets(Options())
    print "Compiled stylesheets: ", environment['stylesheet'].urls()
    print "Compiled javascripts: ", environment['javascript'].urls()
    print "Compiled templates: ",   environment['template'].urls()
