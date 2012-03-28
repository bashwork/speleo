from tornado.options import define, options

def dict_to_options(**kwargs):
    ''' A helper method to quickly convert a dict to options

    :param kwargs: The arguments to convert to options
    '''
    for key, value in kwargs.items():
        define(key, default=value, type=type(value))
    return options

