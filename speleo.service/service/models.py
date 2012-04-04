import logging
from sqlalchemy import create_engine
from sqlalchemy import Column, ForeignKey, Table
from sqlalchemy import Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.orm import relationship, backref

# ------------------------------------------------------------ 
# utility methods
# ------------------------------------------------------------ 
Base = declarative_base()

def get_database(options):
    ''' Retrieve a database instance from the given config

    :param options.connection: The connection string to the database
    :param options.debug: Set to true to debug the operations
    '''
    logging.debug("Initializing database: %s" % options.database)
    engine = create_engine(options.database, convert_unicode=True, echo=options.debug)
    session = scoped_session(sessionmaker(bind=engine))
    Base.metadata.create_all(engine)
    Base.query = session.query_property()
    return session

# ------------------------------------------------------------ 
# Base Model
# ------------------------------------------------------------ 
class BaseMixin(object):
 
    __private__ = []

    # --------------------------------------------------------
    # default columns
    # --------------------------------------------------------
    id      = Column(Integer, primary_key=True)
    created = Column(DateTime)
    updated = Column(DateTime)

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()
 
    #def __init__(self, **kwargs):
    #    Base.__init__()
    #    names = set(c.name for c in in self.__table__.columns)
    #    for key, value in kwargs.items():
    #        if key in names:
    #            setattr(self, key, value)
              
    @property 
    def serialized():
        result = {}
        columns = [c for c in self.__table__.columns
            if c.name not in self.__private__]

        for column in columns:
            value = getattr(self, column.name)
            if column.type == 'datetime':
                result[column.name] = value
            elif column.type == 'group':
                result[column.name] = [v.serialize for v in value]
            elif value is None:
                result = str()
            else: result[column.name] = value
        return result


# ------------------------------------------------------------ 
# associative tables
# ------------------------------------------------------------ 
user_roles = Table('user_roles', Base.metadata,
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('role_id', Integer, ForeignKey('role.id')))


# ------------------------------------------------------------ 
# models
# ------------------------------------------------------------ 
class User(BaseMixin, Base):
    '''
    Represents a single user for the speleo system
    '''

    name = Column(String(60), nullable=False)
    username = Column(String(30), nullable=False)
    email = Column(String(75), nullable=True)
    queries = relationship("Query", backref=backref('user', order_by="User.id"), cascade='all, delete, delete-orphan')
    roles = relationship("Role", backref='user', secondary=user_roles)

    def __repr__(self):
        return "<User(%d, %s)>" % (self.id, self.username)


class Role(BaseMixin, Base):
    '''
    Represents a single role assignable to a user

    :param name: The name of the role
    :param description: A description of the role's ability
    '''

    name = Column(String(50), nullable=False)
    description = Column(String(100), nullable=False)

    def __repr__(self):
        return "<Role(%d, %s)>" % (self.id, self.name)


class Query(BaseMixin, Base):
    '''
    Represents a single saved query for a given user

    :param title: The title of the query
    :param display: The lucene style displayable query
    :param compiled: The json compiled query
    :param user: The user this query belongs to
    '''

    title = Column(String(50), nullable=False)
    display = Column(String(200), nullable=False)
    compiled = Column(String(200), nullable=True)
    user_id = Column(Integer, ForeignKey('user.id'))

    def __repr__(self):
        return "<Query(%d, %s, %s)>" % (self.id, self.user.username, self.title)

# ------------------------------------------------------------ 
# exports
# ------------------------------------------------------------ 
__all__ = ['get_database', 'User', 'Query', 'Role']
