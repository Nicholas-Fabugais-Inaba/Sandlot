from fastapi import APIRouter
from .types import CaptainStatus
from ..db.queries.team_players_queries import update_team_player


router = APIRouter(tags=["team-players"])

@router.post("/update_captain_status", response_model=None)
async def update_captain_status(data: CaptainStatus):
    update_team_player(data.team_id, data.player_id, data.captain)
    return True