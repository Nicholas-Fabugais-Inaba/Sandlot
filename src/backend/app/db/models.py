from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

from .create_engine import create_connection
#from create_engine import create_connection

engine = create_connection()

class Base(DeclarativeBase):
    pass

class Player(Base):
    __tablename__ = "player"
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(30))
    email: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    password: Mapped[Optional[str]] = mapped_column(String(50))
    phone_number: Mapped[Optional[str]] = mapped_column(String(15))
    gender: Mapped[Optional[str]] = mapped_column(String(30))
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    is_commissioner: Mapped[bool] = mapped_column(default=False)
    active: Mapped[bool] = mapped_column(default=True)

class Team(Base):
    __tablename__ = "team"
    id: Mapped[int] = mapped_column(primary_key=True)
    team_name: Mapped[Optional[str]] = mapped_column(String(50)) # don't know what string limits we should use; also should prolly use constants
    captain_id: Mapped[Optional[int]] = mapped_column(ForeignKey("player.id"))
    #cocaptains: Mapped["Player"] = mapped_column()
    #player_list: Mapped["Player"] = mapped_column()
    standing: Mapped[Optional[str]] = mapped_column(String(50))
    username: Mapped[Optional[str]] = mapped_column(String(50), unique=True)
    password: Mapped[Optional[str]] = mapped_column(String(50))
    division: Mapped[Optional[int]] = mapped_column(ForeignKey("division.id", ondelete="SET NULL"), nullable=True) # 0 = A
    preferred_division: Mapped[Optional[int]] = mapped_column() # 0 = A
    offday: Mapped[Optional[int]] = mapped_column() # 0 = Monday
    preferred_time: Mapped[Optional[int]] = mapped_column() # 0 = balanced, 1 = early, 2 = late
    active: Mapped[bool] = mapped_column(default=True)

class Game(Base):
    __tablename__ = "game"
    id: Mapped[int] = mapped_column(primary_key=True)
    home_team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    away_team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    date: Mapped[Optional[str]] = mapped_column(String(50)) # should be datetime eventually
    time: Mapped[Optional[str]] = mapped_column(String(50))
    field: Mapped[Optional[str]] = mapped_column(String(50))
    home_team_score: Mapped[Optional[int]] = mapped_column()
    away_team_score: Mapped[Optional[int]] = mapped_column()
    played: Mapped[Optional[bool]] = mapped_column(default=False)
    forfeit: Mapped[Optional[int]] = mapped_column(default=0) # 0 = no forfeit, 1 = 9-1 soft forfeit, 2 = 9-0 hard forfeit
    home_team = relationship("Team", foreign_keys=[home_team_id], backref="home_games")
    away_team = relationship("Team", foreign_keys=[away_team_id], backref="away_games")

class RescheduleRequest(Base):
    __tablename__ = "reschedule_request"
    id: Mapped[int] = mapped_column(primary_key=True)
    requester_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    receiver_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    game_id: Mapped[Optional[int]] = mapped_column(ForeignKey("game.id"))
    option1: Mapped[Optional[str]] = mapped_column(String(50))
    option1_field: Mapped[Optional[str]] = mapped_column(String(50))
    option2: Mapped[Optional[str]] = mapped_column(String(50))
    option2_field: Mapped[Optional[str]] = mapped_column(String(50))
    option3: Mapped[Optional[str]] = mapped_column(String(50))
    option3_field: Mapped[Optional[str]] = mapped_column(String(50))
    option4: Mapped[Optional[str]] = mapped_column(String(50))
    option4_field: Mapped[Optional[str]] = mapped_column(String(50))
    option5: Mapped[Optional[str]] = mapped_column(String(50))
    option5_field: Mapped[Optional[str]] = mapped_column(String(50))
    accepted: Mapped[Optional[bool]] = mapped_column()

class JoinRequest(Base):
    __tablename__ = "join_request"
    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("team.id"))
    accepted: Mapped[Optional[bool]] = mapped_column()

class SeasonSettings(Base):
    __tablename__ = "season_settings"
    id: Mapped[int] = mapped_column(primary_key=True)
    start_date: Mapped[Optional[str]] = mapped_column(String(50))
    end_date: Mapped[Optional[str]] = mapped_column(String(50))
    games_per_team: Mapped[Optional[int]] = mapped_column()
    state: Mapped[String] = mapped_column(String(50), default="preseason")

class Field(Base):
    __tablename__ = "field"
    id: Mapped[int] = mapped_column(primary_key=True)
    field_name: Mapped[Optional[str]] = mapped_column(String(50))

class TimeSlot(Base):
    __tablename__ = "time_slot"
    id: Mapped[int] = mapped_column(primary_key=True)
    start: Mapped[Optional[str]] = mapped_column(String(50))
    end: Mapped[Optional[str]] = mapped_column(String(50))
    field_id: Mapped[Optional[int]] = mapped_column(ForeignKey("field.id"))

class Announcement(Base):
    __tablename__ = "announcement"
    id: Mapped[int] = mapped_column(primary_key=True)
    date: Mapped[Optional[str]] = mapped_column(String(50))
    title: Mapped[Optional[str]] = mapped_column(String(100))
    body: Mapped[Optional[str]] = mapped_column(String(500))

class Division(Base):
    __tablename__ = "division"
    id: Mapped[int] = mapped_column(primary_key=True)
    division_name: Mapped[Optional[str]] = mapped_column(String(50))

class Waiver(Base):
    __tablename__ = "waiver"
    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[Optional[int]] = mapped_column(ForeignKey("player.id"))
    signature: Mapped[Optional[String]] = mapped_column(String(50))
    date: Mapped[Optional[String]] = mapped_column(String(50))

class ArchivedTeam(Base):
    __tablename__ = "archived_team"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[Optional[String]] = mapped_column(String(50))
    division_name: Mapped[Optional[String]] = mapped_column(String(50))
    standing: Mapped[Optional[str]] = mapped_column(String(50))
    year: Mapped[Optional[str]] = mapped_column(String(50))

class ArchivedPlayer(Base):
    __tablename__ = "archived_player"
    id: Mapped[int] = mapped_column(primary_key=True)
    archived_team_id: Mapped[Optional[int]] = mapped_column(ForeignKey("archived_team.id"))
    first_name: Mapped[Optional[str]] = mapped_column(String(30))
    last_name: Mapped[Optional[str]] = mapped_column(String(30))


# function which creates defined models as tables in DB
def create_tables():
    Base.metadata.create_all(engine)

#create_tables()