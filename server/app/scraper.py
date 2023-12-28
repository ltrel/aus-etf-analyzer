from datetime import datetime

from aiohttp import ClientSession
from bs4 import BeautifulSoup

from .models import Etf
from .httpsession import HttpSession

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
}


async def scrape_etf_data(symbol):
    symbol = symbol.upper()

    url = f'https://finance.yahoo.com/quote/{symbol}.AX/holdings?p={symbol}.AX'

    async with HttpSession.limited_get(url, headers=HEADERS) as res:
        content = await res.read()

        soup = BeautifulSoup(content, 'html.parser')

        quote_header = soup.find(id='quote-header-info')
        etf_name = quote_header.select_one(
            'div>div>div>h1').text.split('(')[0][:-1]
        market_price = float(quote_header.select_one('fin-streamer').text)

        holdings_root = soup.find(id='Col1-0-Holdings-Proxy')
        sector_weight_rows = list(
            holdings_root.select('h3~div')[1].children)[1:]

        weights_dict = {}
        for row in sector_weight_rows:
            sector_name = row.select_one(
                'span>span>span').text.lower().replace(' ', '_') + '_weight'
            sector_weight = float(row.select_one(
                ':nth-child(3)').text.strip('%'))
            weights_dict[sector_name] = sector_weight

        etf_data = Etf(
            date_updated=datetime.now(),
            etf_symbol=symbol,
            etf_name=etf_name,
            market_price=market_price,
            **weights_dict
        )
        return etf_data
