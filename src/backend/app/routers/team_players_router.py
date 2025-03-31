from fastapi import APIRouter
import sqlalchemy
from .types import CaptainStatus, LeaveTeamData
from ..db.queries.team_players_queries import update_team_player, delete_team_player
from ..db.queries.player_queries import update_player_active_team


router = APIRouter(tags=["team-players"])

@router.post("/leave_team", response_model=None)
async def leave_team(data: LeaveTeamData):
    delete_team_player(data.team_id, data.player_id)
    # check to see if team being left is active team
    if(data.new_active_team_required):
        # if the player is part of another team, set that team to their new active team
        if(data.new_active_team != None):
            update_player_active_team(data.player_id, data.new_active_team)
        # if not, set NULL
        else:
            update_player_active_team(data.player_id, sqlalchemy.null())

@router.post("/update_captain_status", response_model=None)
async def update_captain_status(data: CaptainStatus):
    update_team_player(data.team_id, data.player_id, data.captain)
    return True