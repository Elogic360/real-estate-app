from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.db.models import PlotStatus

class PlotBase(BaseModel):
    title: str
    description: Optional[str] = None
    area_sqm: Decimal
    price: Decimal
    usage_type: Optional[str] = "Residential"
    plot_number: Optional[str] = None
    council_id: Optional[int] = None
    image_urls: Optional[List[str]] = []

class PlotCreate(PlotBase):
    pass

class PlotUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    area_sqm: Optional[Decimal] = None
    price: Optional[Decimal] = None
    usage_type: Optional[str] = None
    plot_number: Optional[str] = None
    council_id: Optional[int] = None
    image_urls: Optional[List[str]] = None
    status: Optional[PlotStatus] = None

class PlotInDB(PlotBase):
    id: str
    status: PlotStatus
    uploaded_by_id: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Plot(PlotInDB):
    pass

class PlotWithLocation(Plot):
    council: Optional[dict] = None

class PlotSearch(BaseModel):
    search: Optional[str] = None
    min_price: Optional[Decimal] = None
    max_price: Optional[Decimal] = None
    min_area: Optional[Decimal] = None
    max_area: Optional[Decimal] = None
    region_id: Optional[int] = None
    district_id: Optional[int] = None
    council_id: Optional[int] = None
    usage_type: Optional[str] = None
    status: Optional[PlotStatus] = PlotStatus.AVAILABLE