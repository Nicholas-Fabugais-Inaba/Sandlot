from pydantic import BaseModel
from typing import Optional

class NewPlayer(BaseModel):
    name: str
    email: str
    password: str

class NewTeam(BaseModel):
    team_name: str
    username: str
    password: str
    preferred_division: int
    preferred_offday: int
    preferred_time: int

class PlayerLoginData(BaseModel):
    email: str

class TeamLoginData(BaseModel):
    username: str

class RescheduleRequest(BaseModel):
    requester_id: int
    receiver_id: int
    game_id: int
    option1: str
    option2: Optional[str]
    option3: Optional[str]
    option4: Optional[str]
    option5: Optional[str]
    option1_field: str
    option2_field: Optional[str]
    option3_field: Optional[str]
    option4_field: Optional[str]
    option5_field: Optional[str]

class TeamID(BaseModel):
    team_id: Optional[int]

class GameID(BaseModel):
    game_id: Optional[int]

class Score(BaseModel):
    game_id: int
    home_score: int
    home_name: str
    away_score: int
    away_name: str

class RRAccept(BaseModel):
    rr_id: int
    old_game_id: int
    home_team_id: int
    away_team_id: int
    date: str
    time: str
    field: str

class SchedParams(BaseModel):
    num_games: int

class SeasonSettings(BaseModel):
    start_date: str
    end_date: str
    games_per_team: int

class FieldName(BaseModel):
    field_name: str

class FieldID(BaseModel):
    field_id: int

class TimeslotData(BaseModel):
    start: str
    end: str
    field_id: int

class TimeslotID(BaseModel):
    timeslot_id: int

class DivisionData(BaseModel):
    team_id: int
    division: int

class ScoreData(BaseModel):
    game_id: int
    home_team_score: int
    away_team_score: int
    forfeit: int

class PlayerID(BaseModel):
    player_id: Optional[int]

class NewAnnouncement(BaseModel):
    date: str
    title: str
    body: str

class AnnouncementData(BaseModel):
    announcement_id: int
    new_date: str
    new_title: str
    new_body: str

class AnnouncementID(BaseModel):
    announcement_id: int

