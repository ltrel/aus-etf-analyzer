from contextlib import asynccontextmanager
from typing import Optional
from datetime import datetime
import aiohttp
from aiolimiter import AsyncLimiter

_limiter = AsyncLimiter(1, 1)


class HttpSession():
    _session: Optional[aiohttp.ClientSession] = None

    @classmethod
    def get_session(cls):
        if cls._session == None:
            cls._session = aiohttp.ClientSession()

        return cls._session

    @classmethod
    async def close_session(cls):
        if cls._session:
            await cls._session.close()
            cls._session = None

    @classmethod
    @asynccontextmanager
    async def limited_get(cls, url, **kwargs):
        session = cls.get_session()
        async with _limiter:
            print(f"initiating request at {datetime.now()}")
            async with session.get(url, **kwargs) as res:
                yield res
