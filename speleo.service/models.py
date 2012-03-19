from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

# ------------------------------------------------------------ 
# utility methods
# ------------------------------------------------------------ 
Base = declarative_base()

def get_database(connection, debug=False):
    ''' Retrieve a database instance from the given config

    :param connection: The connection string to the database
    :param debug: Set to true to debug the operations
    '''
    engine = create_engine(connection, convert_unicode=True, echo=debug)
    Base.metadata.create_all(engine)
    models.init_db(engine)
    return scoped_session(sessionmaker(bind=engine))


# ------------------------------------------------------------ 
# models
# ------------------------------------------------------------ 
class User(Base):

    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(30), nullable=False)
    first_name = Column(String(30), nullable=False)
    last_name = Column(String(30), nullable=False)
    email = Column(String(75), nullable=False)
    password = Column(String(128), nullable=False)

    def __repr__(self):
        return "<User(%s)>" % (self.username)
