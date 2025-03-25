from fastapi import APIRouter
from .types import NewArchivedTeam, ArchivedTeam, NewArchivedPlayer, ArchivedTeamID
from ..db.queries.archived_team_queries import insert_archived_team, get_all_archived_teams, get_archived_team
from ..db.queries.archived_player_queries import insert_archived_player, get_archived_players_by_team


router = APIRouter(tags=["archive"])

@router.post("/create_archived_team", response_model=None)
async def create_archived_team(data: NewArchivedTeam):
    insert_archived_team(data.name, data.division_name, data.standing, data.year)
    return True

@router.get("/get_all_archived_teams", response_model=list)
async def get_archived_teams():
    teams = get_all_archived_teams()
    teams = [dict(row) for row in teams]
    return teams

@router.post("/get_archived_team", response_model=list)
async def get_archived_team_by_year(data: ArchivedTeam):
    team = dict(get_archived_team(data.name, data.year))
    return team

@router.post("/create_archived_player", response_model=None)
async def create_archived_player(data: NewArchivedPlayer):
    insert_archived_player(data.archived_team_id, data.first_name, data.last_name)
    return True

@router.post("get_archived_players_by_team", response_model=list)
async def get_archived_players(data: ArchivedTeamID):
    players = get_archived_players_by_team(data.archived_team_id)
    players = [dict(row) for row in players]
    return players