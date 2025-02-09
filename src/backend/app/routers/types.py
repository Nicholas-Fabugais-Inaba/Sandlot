from pydantic import BaseModel

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
