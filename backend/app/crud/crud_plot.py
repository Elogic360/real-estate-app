from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from app.db.models import Plot, Council, District, Region, PlotStatus
from app.schemas.plot import PlotCreate, PlotUpdate, PlotSearch

def get_plot(db: Session, plot_id: str) -> Optional[Plot]:
    """Get plot by ID with location details."""
    return db.query(Plot).options(
        joinedload(Plot.council).joinedload(Council.district).joinedload(District.region)
    ).filter(Plot.id == plot_id).first()

def get_plots(db: Session, skip: int = 0, limit: int = 100) -> List[Plot]:
    """Get all plots with pagination."""
    return db.query(Plot).options(
        joinedload(Plot.council).joinedload(Council.district).joinedload(District.region)
    ).offset(skip).limit(limit).all()

def search_plots(db: Session, search_params: PlotSearch, skip: int = 0, limit: int = 100) -> List[Plot]:
    """Search plots with filters."""
    query = db.query(Plot).options(
        joinedload(Plot.council).joinedload(Council.district).joinedload(District.region)
    )
    
    # Apply filters
    if search_params.search:
        search_term = f"%{search_params.search}%"
        query = query.filter(
            or_(
                Plot.title.ilike(search_term),
                Plot.description.ilike(search_term)
            )
        )
    
    if search_params.min_price is not None:
        query = query.filter(Plot.price >= search_params.min_price)
    
    if search_params.max_price is not None:
        query = query.filter(Plot.price <= search_params.max_price)
    
    if search_params.min_area is not None:
        query = query.filter(Plot.area_sqm >= search_params.min_area)
    
    if search_params.max_area is not None:
        query = query.filter(Plot.area_sqm <= search_params.max_area)
    
    if search_params.council_id:
        query = query.filter(Plot.council_id == search_params.council_id)
    elif search_params.district_id:
        query = query.join(Council).filter(Council.district_id == search_params.district_id)
    elif search_params.region_id:
        query = query.join(Council).join(District).filter(District.region_id == search_params.region_id)
    
    if search_params.usage_type:
        query = query.filter(Plot.usage_type == search_params.usage_type)
    
    if search_params.status:
        query = query.filter(Plot.status == search_params.status)
    
    return query.offset(skip).limit(limit).all()

def create_plot(db: Session, plot: PlotCreate, user_id: str) -> Plot:
    """Create new plot."""
    db_plot = Plot(
        **plot.dict(),
        uploaded_by_id=user_id
    )
    db.add(db_plot)
    db.commit()
    db.refresh(db_plot)
    return db_plot

def update_plot(db: Session, plot_id: str, plot_update: PlotUpdate) -> Optional[Plot]:
    """Update plot."""
    db_plot = get_plot(db, plot_id)
    if not db_plot:
        return None
    
    update_data = plot_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_plot, field, value)
    
    db.commit()
    db.refresh(db_plot)
    return db_plot

def update_plot_status(db: Session, plot_id: str, status: PlotStatus) -> Optional[Plot]:
    """Update plot status."""
    db_plot = get_plot(db, plot_id)
    if not db_plot:
        return None
    
    db_plot.status = status
    db.commit()
    db.refresh(db_plot)
    return db_plot

def delete_plot(db: Session, plot_id: str) -> bool:
    """Delete plot."""
    db_plot = get_plot(db, plot_id)
    if not db_plot:
        return False
    
    db.delete(db_plot)
    db.commit()
    return True