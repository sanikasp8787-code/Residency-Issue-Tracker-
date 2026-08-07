from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Issue(Base):
    __tablename__ = "issues"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    issue_type = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Pending")
    flat_number = Column(String)
    priority = Column(String, default="Medium")