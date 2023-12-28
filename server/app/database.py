from sqlmodel import SQLModel, create_engine, Session
from .settings import settings

DEVELOPMENT_PATH = 'sqlite:///database.db'
PRODUCTION_PATH = 'sqlite:////database.db'

sqlite_url = DEVELOPMENT_PATH if settings.server_mode == 'DEVELOPMENT' else PRODUCTION_PATH

connect_args = {'check_same_thread': False}
engine = create_engine(sqlite_url, echo=False, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def close_db():
    engine.dispose()
