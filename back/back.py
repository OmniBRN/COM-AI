from fastapi import FastAPI
from sqlalchemy import create_engine, Integer, String, Boolean, CHAR, Date, Sequence, Text, Float, Uuid
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column
from datetime import date

class Base(DeclarativeBase):
    pass

class POS_LOG(Base):
    __tablename__ = "POS_LOG"
    __table_args__ = {"schema": "public"}  

    transaction_id: Mapped[str] = mapped_column(
        "transaction-id",
        Uuid(as_uuid=False),
        primary_key=True,
        nullable=False,
        key="transaction_id",  
    )
    first: Mapped[str] = mapped_column(Text, nullable=False)
    last: Mapped[str] = mapped_column(Text, nullable=False)
    gender: Mapped[str] = mapped_column(CHAR(1), nullable=False)
    state: Mapped[str] = mapped_column(Text, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)   
    long: Mapped[float] = mapped_column(Float, nullable=False)  
    job: Mapped[str] = mapped_column(Text, nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    trans_date: Mapped[date] = mapped_column(
        "trans-date", Date, nullable=False, key="trans_date"
    )
    unix_time: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str] = mapped_column(Text, nullable=False)
    amt: Mapped[float] = mapped_column(Float, nullable=False)   
    merchant: Mapped[str] = mapped_column(Text, nullable=False)
    merch_lat: Mapped[float] = mapped_column(Float, nullable=False) 
    merch_long: Mapped[float] = mapped_column(Float, nullable=False)
    is_fraud: Mapped[bool] = mapped_column(Boolean, nullable=False) 


app = FastAPI()
database_url = "postgresql://dvloperhackdb:dvloperdbpass@0.0.0.0/dvloperhackdb"
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



