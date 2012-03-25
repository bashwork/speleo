import logging
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
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
# models
# ------------------------------------------------------------ 
class User(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(60), nullable=False)
    username = Column(String(30), nullable=False)
    first_name = Column(String(30), nullable=True)
    last_name = Column(String(30), nullable=True)
    email = Column(String(75), nullable=True)

    def __repr__(self):
        return "<User(%s)>" % (self.username)

class Query(Base):

    __tablename__ = 'queries'

    id = Column(Integer, primary_key=True)
    display = Column(String(250), nullable=False)
    compiled = Column(String(250), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", backref=backref('queries', order_by=id))

    def __repr__(self):
        return "<Query(%s, %s)>" % (self.user.username, self.query)
