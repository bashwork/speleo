import os
import httplib
import tornado.web

class ErrorHandler(tornado.web.RequestHandler):

    _template = """
<html>
  <head>
  <title>%(code)d %(message)s</title>
  <style>
body  { background: #fff; color: #000; }
#main { padding: 10em; }
#main h1 { font-size:40px; }
#main img { opacity: 0.3; position:absolute; top:10em; left:30em; -webkit-transform:scale(1.5); }
  </style>
  </head>
  <body><div id='main'>
    <h1>%(code)d %(message)s</h1>
    <p>Not much else to see here...</p>
    <a href="/">Let's get you home</a>
    <img src='/static/img/helmet.png' />
  </div></body>
</html>
"""

    def __init__(self, application, request, status_code):
        tornado.web.RequestHandler.__init__(self, application, request)
        self.set_status(status_code)
    
    def get_error_html(self, status_code, **kwargs):
        return self._template % {
            "code":    status_code,
            "message": httplib.responses[status_code],
        }
    
    def prepare(self):
        raise tornado.web.HTTPError(self._status_code)

## override the tornado.web.ErrorHandler with our default ErrorHandler
tornado.web.ErrorHandler = ErrorHandler

# ------------------------------------------------------------
# exports
# ------------------------------------------------------------
__all__ = []
