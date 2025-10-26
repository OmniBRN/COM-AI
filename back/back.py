import uuid
from fastapi import FastAPI
from sqlalchemy import create_engine, select, Integer, String, Boolean, CHAR, Date, Sequence, Text, Float, Uuid, func, desc, text, extract
from sqlalchemy.orm import Session, DeclarativeBase, Mapped, mapped_column
from datetime import date
from pydantic import BaseModel
import json

# Makes objected resulted from sqlalchemy statement execution into a dictionary
def model_to_dict(obj):
    return {c.key: getattr(obj, c.key) for c in obj.__mapper__.columns}

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

class TransactionCreate(BaseModel):
    transaction_id : uuid.UUID
    first: str
    last: str
    gender: str
    state: str
    lat: float
    long: float
    job: str
    dob: date
    trans_date: date
    unix_time: int
    category: str
    amt: float
    merchant: str
    merch_lat: float
    merch_long: float
    is_fraud: bool

app = FastAPI()
database_url = "postgresql://dvloperhackdb:dvloperdbpass@0.0.0.0/dvloperhackdb"
engine = create_engine(database_url)

@app.get("/transactions")
async def get_transactions():
    with Session(engine) as session:
        objs = session.scalars(select(POS_LOG)).all()
        data = [model_to_dict(o) for o in objs]
    return data

@app.get("/transactions/{n}")
async def get_transactions_n(n:int):
    with Session(engine) as session:
        stmt = select(POS_LOG).order_by(text("ctid DESC")).limit(n) 
        result = session.scalars(stmt).all()
        return [model_to_dict(o) for o in result]

        
@app.post("/addTransaction")
async def add_transaction(transaction: TransactionCreate):
    with Session(engine) as session:
        new_transaction = POS_LOG(
            transaction_id = transaction.transaction_id,
            first=transaction.first,
            last=transaction.last,
            gender=transaction.gender,
            state=transaction.state,
            lat=transaction.lat,
            long=transaction.long,
            job=transaction.job,
            dob=transaction.dob,
            trans_date=transaction.trans_date,
            unix_time=transaction.unix_time,
            category=transaction.category,
            amt=transaction.amt,
            merchant=transaction.merchant,
            merch_lat=transaction.merch_lat,
            merch_long=transaction.merch_long,
            is_fraud=transaction.is_fraud
        )
        session.add(new_transaction)
        session.commit()
        session.refresh(new_transaction)
        return model_to_dict(new_transaction)

@app.get("/numberOfTransactions")
async def get_number_transactions():
    with Session(engine) as session:
        stmt = select(func.count()).select_from(POS_LOG)
        total_transactions = session.scalar(stmt)
    return {"total_transactions": total_transactions}

@app.get("/numberOfCleanTransactions")
async def get_number_transactions():
    with Session(engine) as session:
        stmt = select(func.count()).select_from(POS_LOG).where(POS_LOG.is_fraud == False)
        total_clean_transactions = session.scalar(stmt)
    return {"total_clean_transactions": total_clean_transactions}

@app.get("/numberOfFraudulentTransactions")
async def get_number_transactions():
    with Session(engine) as session:
        stmt = select(func.count()).select_from(POS_LOG).where(POS_LOG.is_fraud == True)
        total_fraudulent_transactions = session.scalar(stmt)
    return {"total_fraudulent_transactions": total_fraudulent_transactions}

@app.get("/numberOfDollarsStolen")
async def get_number_of_money_stolen():
    with Session(engine) as session:
        stmt = select(func.sum(POS_LOG.amt)).where(POS_LOG.is_fraud.is_(True))
        number_of_money_stolen = session.scalar(stmt)
    return {"number_of_money_stolen": number_of_money_stolen}

@app.get("/getFirstNMostFradulousStates/{n}")
async def get_first_N_mostFradulousStates(n: int):
    with Session(engine) as session:
        stmt =  (select(POS_LOG.state, func.count().label("occurrences")).group_by(POS_LOG.state).order_by(desc("occurrences"))).limit(n)
        result = session.execute(stmt).all()
    response = [{"state": state, "occurrences": count} for state, count in result]
    return response

@app.get("/getFirstNAges/{n}")
async def get_first_N_ages(n: int):
    with Session(engine) as session:
        stmt = (
        select(
            func.floor(
                extract("year", func.age(func.current_date(), POS_LOG.dob))
            ).label("age"),
            func.count().label("count")
        )
        .group_by("age")
        .order_by("age").limit(n)
        )
        result = session.execute(stmt).all()
    response = [{"age": age, "count": count} for age, count in result]
    return response