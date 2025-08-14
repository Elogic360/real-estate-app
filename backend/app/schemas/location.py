from pydantic import BaseModel
from typing import Optional, List

class RegionBase(BaseModel):
    name: str

class Region(RegionBase):
    id: int
    
    class Config:
        from_attributes = True

class DistrictBase(BaseModel):
    name: str
    region_id: int

class District(DistrictBase):
    id: int
    region: Optional[Region] = None
    
    class Config:
        from_attributes = True

class CouncilBase(BaseModel):
    name: str
    district_id: int

class Council(CouncilBase):
    id: int
    district: Optional[District] = None
    
    class Config:
        from_attributes = True