from contextlib import asynccontextmanager
from datetime import date, datetime

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session, close_db
from .models import Etf, EtfRead, FailedRequest
from .scraper import scrape_etf_data

FAIL_MESSAGE = 'Data scraping failed for the requested ETF'


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    close_db()

app = FastAPI(lifespan=lifespan)


origins = [
    'http://localhost:5173',
    'http://localhost:8000',
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/etfs/{etf_symbol}', response_model=EtfRead)
def get_etf_info(*, session: Session = Depends(get_session), etf_symbol: str):
    # Has scraping this symbol failed in the past
    historic_fail = session.exec(select(FailedRequest).where(
        FailedRequest.etf_symbol == etf_symbol.upper())).first()
    if historic_fail:
        raise HTTPException(
            status_code=404, detail=FAIL_MESSAGE)

    etf = session.exec(select(Etf).where(
        Etf.etf_symbol == etf_symbol.upper())).first()
    if not etf or etf.date_updated.date() < date.today():
        try:
            newEtf = scrape_etf_data(etf_symbol)
        except:
            fail = FailedRequest(date_attempted=datetime.now(),
                                 etf_symbol=etf_symbol.upper())
            session.add(fail)
            session.commit()
            raise HTTPException(
                status_code=404, detail=FAIL_MESSAGE)
        if etf:
            for key, value in newEtf.model_dump(exclude_unset=True).items():
                setattr(etf, key, value)
        else:
            etf = newEtf

        session.add(etf)
        session.commit()
        session.refresh(etf)

    sector_weights = {
        'Basic Materials': etf.basic_materials_weight,
        'Consumer Cyclical': etf.consumer_cyclical_weight,
        'Financial Services': etf.financial_services_weight,
        'Real Estate': etf.real_estate_weight,
        'Consumer Defensive': etf.consumer_defensive_weight,
        'Healthcare': etf.healthcare_weight,
        'Utilities': etf.utilities_weight,
        'Communication Services': etf.communication_services_weight,
        'Energy': etf.energy_weight,
        'Industrials': etf.industrials_weight,
        'Technology': etf.technology_weight,
    }
    etfRead = EtfRead(sector_weights=sector_weights, **etf.model_dump())
    return etfRead
