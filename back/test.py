from fastapi import FastAPI
from sqlalchemy import create_engine, Integer, String
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass

class Test(Base):
    __tablename__ = "test"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String)

app = FastAPI()
database_url = "postgresql://dvloperhackdb:dvloperdbpass@0.0.0.0/dvloperhackdb"
engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/test/{testid}")
async def get_user(testid: int):
    db = SessionLocal()
    test = db.query(Test).filter(Test.id == testid).first()
    db.close()
    return {"name": test}

