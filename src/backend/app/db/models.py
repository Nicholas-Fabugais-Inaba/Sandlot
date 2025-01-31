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
    name: Mapped[str] = mapped_column(String(30))
    fullname: Mapped[Optional[str]]
    addresses: Mapped[List["Address"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r})"

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
    preferred_times: Mapped[str] = mapped_column(default="balanced")
    
class Game(Base):
    __tablename__ = "game"
    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str]
    home_team: Mapped[None] = mapped_column()
    away_team: Mapped[None] = mapped_column()
    date: Mapped[None] = mapped_column()
    time: Mapped[None] = mapped_column()
    field: Mapped[None] = mapped_column()
    home_team_score: Mapped[None] = mapped_column()
    away_team_score: Mapped[None] = mapped_column()
    played: Mapped[bool] = mapped_column()
    
Base.metadata.create_all(engine)