from fastapi import APIRouter
from ..functions.gen_sched_input import create_schedule
from ..db.queries import get_all_games, get_team_games


router = APIRouter(tags=["schedule"])

# temporary types and function
@router.get("/get", response_model=list)
async def get_schedule():
    # we would call the helper functions to generate the schedule here and return the output back to the website
    schedule: list = create_schedule()
    return schedule

@router.get("/get_all_games", response_model=list)
async def get_scheduled_games():
    games = list(get_all_games())
    return games

@router.post("/get_team_games", response_model=list)
async def team_games(team_id: str):
    games = list(get_team_games(team_id))
    return games