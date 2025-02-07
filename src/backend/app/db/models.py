from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from .create_engine import create_connection

engine = create_connection()

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "player"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(30))
    email: Mapped[Optional[str]] = mapped_column(String(50))
    password: Mapped[Optional[str]] = mapped_column(String(50))
    phone_number: Mapped[Optional[str]] = mapped_column(String(15))
    gender: Mapped[Optional[str]] = mapped_column(String(30))
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))

class Team(Base):
    __tablename__ = "team"
    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[Optional[str]] = mapped_column(String(50)) # don't know what string limits we should use; also should prolly use constants
    captain: Mapped[Optional["Player"]] = mapped_column(ForeignKey("player.id"))
    #cocaptains: Mapped["Player"] = mapped_column()
    #player_list: Mapped["Player"] = mapped_column()
    standing: Mapped[Optional[str]] = mapped_column(String(50))
    password: Mapped[Optional[str]] = mapped_column(String(50))
    division: Mapped[Optional[int]] = mapped_column()
    offday: Mapped[Optional[str]] = mapped_column(String(50))
    preferred_times: Mapped[Optional[str]] = mapped_column(String(50), default="balanced")
    
class Game(Base):
    __tablename__ = "game"
    id: Mapped[int] = mapped_column(primary_key=True)
    email_address: Mapped[Optional[str]] = mapped_column(String(50))
    home_team: Mapped[Optional[str]] = mapped_column(String(50))
    away_team: Mapped[Optional[str]] = mapped_column(String(50))
    date: Mapped[Optional[str]] = mapped_column(String(50))
    time: Mapped[Optional[str]] = mapped_column(String(50))
    field: Mapped[Optional[str]] = mapped_column(String(50))
    home_team_score: Mapped[Optional[str]] = mapped_column(String(50))
    away_team_score: Mapped[Optional[str]] = mapped_column(String(50))
    played: Mapped[Optional[bool]] = mapped_column(String(50))

# used for creating tables in DB, don't uncomment unless you want to reinitalize DB tables    
#Base.metadata.create_all(engine)