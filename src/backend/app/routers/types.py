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

class ScoreData(BaseModel):
    game_id: int
    home_team_score: int
    away_team_score: int
