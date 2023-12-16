from typing import Optional
import aiohttp

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
    