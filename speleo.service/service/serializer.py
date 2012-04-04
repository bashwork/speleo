from tornado.escape import json_encode

# ------------------------------------------------------------ 
# supported mime types
# ------------------------------------------------------------ 
__mime_types = {
    'application/json': json_encode,
    'application/xml':  json_encode,
    'application/text': json_encode,
}

# ------------------------------------------------------------ 
# serializer
# ------------------------------------------------------------ 
def serialize(request, response):
    ''' serialize the response based on the content-type

    :param request: The request to choose the content with
    :param response: The response to serialize
    :returns: The serialized response
    '''
    header  = request.headers.get('content-type', 'application/json')
    encoder = __mime_types[header]
    return encoder({ 'data': response })

# ------------------------------------------------------------ 
# exports
# ------------------------------------------------------------ 
__all__ = ['serialize']
