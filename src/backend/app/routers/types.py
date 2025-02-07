from pydantic import BaseModel

class NewUser(BaseModel):
    name: str
    email: str
    password: str

class NewTeam(BaseModel):
    team_name: str
    password: str

class sendData(BaseModel):
    email: str