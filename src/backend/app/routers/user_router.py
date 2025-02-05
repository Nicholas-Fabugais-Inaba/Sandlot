from fastapi import APIRouter
from ..db.queries import insert_player


router = APIRouter(tags=["user"])

# TODO: move this to it's own types file
from pydantic import BaseModel
class user(BaseModel):
    name: str
    email: str
    password: str

# temporary types and function
@router.post("/create_player", response_model=None)
async def create_player_account(newUser: user):
    response = insert_player(newUser.name, newUser.email, newUser.password)
    return response