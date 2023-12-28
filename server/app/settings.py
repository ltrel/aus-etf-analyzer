from typing import Literal
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    cors_allowed_origin: str = 'http://localhost:5173'
    server_mode: Literal['DEVELOPMENT', 'PRODUCTION'] = 'DEVELOPMENT'

settings = Settings()