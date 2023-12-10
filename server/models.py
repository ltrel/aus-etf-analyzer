from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class EtfBase(SQLModel):
    date_updated: datetime
    etf_symbol: str = Field(index=True)
    etf_name: str
    market_price: float


class Etf(EtfBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    basic_materials_weight: float
    consumer_cyclical_weight: float
    financial_services_weight: float
    real_estate_weight: float
    consumer_defensive_weight: float
    healthcare_weight: float
    utilities_weight: float
    communication_services_weight: float
    energy_weight: float
    industrials_weight: float
    technology_weight: float


class EtfRead(EtfBase):
    id: int
    sector_weights: dict[str, float]
