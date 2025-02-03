from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from create_engine import create_connection

engine = create_connection()

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
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))

class Team(Base):
    __tablename__ = "team"
    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[str] = mapped_column(String(50)) # don't know what string limits we should use; also should prolly use constants
    captain: Mapped["Player"] = mapped_column(ForeignKey("player.id"))
    #cocaptains: Mapped["Player"] = mapped_column()
    #player_list: Mapped["Player"] = mapped_column()
    standing: Mapped[str] = mapped_column(String(50))
    email: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(50))
    division: Mapped[int] = mapped_column()
    offday: Mapped[str] = mapped_column(String(50))
    preferred_times: Mapped[str] = mapped_column(String(50), default="balanced")
    
class Game(Base):
    __tablename__ = "game"
    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[str] = mapped_column(String(50))
    home_team: Mapped[str] = mapped_column(String(50))
    away_team: Mapped[str] = mapped_column(String(50))
    date: Mapped[str] = mapped_column(String(50))
    time: Mapped[str] = mapped_column(String(50))
    field: Mapped[str] = mapped_column(String(50))
    home_team_score: Mapped[str] = mapped_column(String(50))
    away_team_score: Mapped[str] = mapped_column(String(50))
    played: Mapped[bool] = mapped_column(String(50))
    
Base.metadata.create_all(engine)