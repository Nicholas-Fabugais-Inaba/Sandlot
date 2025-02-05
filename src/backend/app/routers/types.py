from pydantic import BaseModel

class user(BaseModel):
    name: str
    email: str
    password: str

class team(BaseModel):
    team_name: str
    email: str
    password: str