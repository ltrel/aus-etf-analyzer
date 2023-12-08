from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session
from .models import Etf, EtfRead
from .scraper import scrape_etf_data


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)


@app.get('/etfs/{etf_symbol}', response_model=EtfRead)
def get_etf_info(*, session: Session = Depends(get_session), etf_symbol: str):
    etf = session.exec(select(Etf).where(Etf.etf_symbol == etf_symbol)).first()
    if not etf or etf.date_updated.date() < date.today():
        try:
            etf = scrape_etf_data(etf_symbol)
        except:
            raise HTTPException(
                status_code=404, detail='Data scraping failed for the requested ETF')
        session.add(etf)
        session.commit()
        session.refresh(etf)
    return etf
