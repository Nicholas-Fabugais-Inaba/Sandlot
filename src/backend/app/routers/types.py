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
    home_score: int
    home_name: str
    away_score: int
    away_name: str
    forfeit: int

class PlayerID(BaseModel):
    player_id: Optional[int]

class NewAnnouncement(BaseModel):
    date: str
    title: str
    body: str

class AnnouncementData(BaseModel):
    id: int
    date: str
    title: str
    body: str

class AnnouncementID(BaseModel):
    announcement_id: int

class UpdatePassword(BaseModel):
    player_id: int
    new_password: str

class UpdateEmail(BaseModel):
    player_id: int
    new_email: str

class UpdateName(BaseModel):
    player_id: int
    first_name: str
    last_name: str

class UpdateTeamPassword(BaseModel):
    team_id: int
    new_password: str

class UpdateTeamUsername(BaseModel):
    team_id: int
    new_username: str

class UpdateTeamName(BaseModel):
    team_id: int
    new_team_name: str
class JoinRequest(BaseModel):
    email: str
    team_id: int

class JRAccept(BaseModel):
    jr_id: int
    player_id: int
    team_id: int

class JRDecline(BaseModel):
    jr_id: int

class Division(BaseModel):
    division_id: int
    division_name: str