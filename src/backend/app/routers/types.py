from pydantic import BaseModel

class user(BaseModel):
    name: str
    email: str
    password: str

class team(BaseModel):
    team_name: str
    username: str
    password: str
    preferred_division: int
    preferred_offday: int
    preferred_time: int
