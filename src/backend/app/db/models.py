from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
import urllib.parse

load_dotenv()
params = urllib.parse.quote_plus(os.getenv('CONN_STRING'))
conn_str = 'mssql+pyodbc:///?odbc_connect={}'.format(params)
engine = create_engine(conn_str,echo=True)

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "player"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(30))
    last_name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(50))
    phone_number: Mapped[str] = mapped_column(String(15))
    gender: Mapped[str] = mapped_column(String(30))
    team_id: Mapped[int] = mapped_column(ForeignKey("team.id"))

class Team(Base):
    __tablename__ = "team"
    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(String(50)) # don't know what string limits we should use; also should prolly use constants
    captain: Mapped[None] = mapped_column()
    cocaptains: Mapped["Player"] = mapped_column()
    player_list: Mapped["Player"] = mapped_column()
    standing: Mapped[None] = mapped_column()
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(50))
    division: Mapped[None] = mapped_column()
    offday: Mapped[None] = mapped_column()
    preferred_times: Mapped[None] = mapped_column()
    
class Game(Base):
    __tablename__ = "game"
    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str]
    user_id: Mapped[int] = mapped_column(ForeignKey("user_account.id"))
    user: Mapped["User"] = relationship(back_populates="addresses")
    def __repr__(self) -> str:
        return f"Address(id={self.id!r}, email_address={self.email_address!r})"
    
Base.metadata.create_all(engine)