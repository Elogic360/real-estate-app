from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, Text, ForeignKey, Enum, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from geoalchemy2 import Geometry
import uuid
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    MASTER_ADMIN = "master_admin"
    ADMIN = "admin"
    PARTNER = "partner"
    USER = "user"

class PlotStatus(str, enum.Enum):
    AVAILABLE = "available"
    LOCKED = "locked"
    PENDING_PAYMENT = "pending_payment"
    SOLD = "sold"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone_number = Column(String(20), unique=True)
    hashed_password = Column(Text, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    uploaded_plots = relationship("Plot", back_populates="uploaded_by")
    orders = relationship("Order", back_populates="user")

class Region(Base):
    __tablename__ = "regions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    
    # Relationships
    districts = relationship("District", back_populates="region")

class District(Base):
    __tablename__ = "districts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    region_id = Column(Integer, ForeignKey("regions.id", ondelete="CASCADE"))
    
    # Relationships
    region = relationship("Region", back_populates="districts")
    councils = relationship("Council", back_populates="district")

class Council(Base):
    __tablename__ = "councils"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    district_id = Column(Integer, ForeignKey("districts.id", ondelete="CASCADE"))
    
    # Relationships
    district = relationship("District", back_populates="councils")
    plots = relationship("Plot", back_populates="council")

class Plot(Base):
    __tablename__ = "plots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    plot_number = Column(String(50), unique=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    area_sqm = Column(Numeric(10, 2), nullable=False)
    price = Column(Numeric(12, 2), nullable=False)
    image_urls = Column(ARRAY(Text))
    usage_type = Column(String(100), default="Residential")
    status = Column(Enum(PlotStatus), default=PlotStatus.AVAILABLE, nullable=False)
    council_id = Column(Integer, ForeignKey("councils.id"))
    geom = Column(Geometry("POLYGON", srid=4326))
    uploaded_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    council = relationship("Council", back_populates="plots")
    uploaded_by = relationship("User", back_populates="uploaded_plots")
    orders = relationship("Order", back_populates="plot")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    plot_id = Column(UUID(as_uuid=True), ForeignKey("plots.id"), nullable=False)
    order_status = Column(String(50), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="orders")
    plot = relationship("Plot", back_populates="orders")