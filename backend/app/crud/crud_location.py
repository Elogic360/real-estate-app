from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.db.models import Region, District, Council

def get_regions(db: Session) -> List[Region]:
    """Get all regions."""
    return db.query(Region).order_by(Region.name).all()

def get_districts(db: Session, region_id: Optional[int] = None) -> List[District]:
    """Get districts, optionally filtered by region."""
    query = db.query(District).options(joinedload(District.region))
    
    if region_id:
        query = query.filter(District.region_id == region_id)
    
    return query.order_by(District.name).all()

def get_councils(db: Session, district_id: Optional[int] = None) -> List[Council]:
    """Get councils, optionally filtered by district."""
    query = db.query(Council).options(
        joinedload(Council.district).joinedload(District.region)
    )
    
    if district_id:
        query = query.filter(Council.district_id == district_id)
    
    return query.order_by(Council.name).all()