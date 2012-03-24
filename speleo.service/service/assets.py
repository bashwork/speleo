from webassets import Environment, Bundle

arguments   = {
  'directory': './static',
  'url': '/static',
  'debug': False,
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
__all__ = ['Environment']

if __name__ == "__main__":
    print "Compiled stylesheets: ", environment['stylesheet'].urls()
    print "Compiled javascripts: ", environment['javascript'].urls()
    print "Compiled templates: ",   environment['template'].urls()
