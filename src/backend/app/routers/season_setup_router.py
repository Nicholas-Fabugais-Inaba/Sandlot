from fastapi import APIRouter
from .types import SeasonSettings, FieldName, FieldID, TimeslotData, TimeslotID, DivisionData
from ..db.queries.season_settings_queries import update_season_settings, get_season_settings
from ..db.queries.field_queries import insert_field, get_all_fields, delete_field
from ..db.queries.timeslot_queries import insert_timeslot, get_all_timeslots, delete_timeslot
from ..db.queries.team_queries import update_division, get_all_teams
from ..db.queries.game_queries import insert_game


router = APIRouter(tags=["season-setup"])

@router.post("/create_schedule", response_model=None)
async def create_schedule(schedule: dict):
    teams = {}
    Teams = get_all_teams()
    for i in range(len(Teams)):
        teams[Teams[i]["id"]] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"]}
    for gameslot, game in schedule.items():
        gameslot = gameslot.split(",")
        insert_game(int(teams[game[0]]["id"]), int(teams[game[1]]["id"]), gameslot[2], gameslot[1], gameslot[0])

@router.get("/get_season_settings", response_model=dict)
async def get_SS():
    settings = get_season_settings()
    return settings

@router.put("/update_season_settings", response_model=None)
async def update_SS(settings: SeasonSettings):
    update_season_settings(settings.start_date, settings.end_date, settings.games_per_team)
    return True

@router.post("/insert_field", response_model=None)
async def add_field(data: FieldName):
    insert_field(data.field_name)
    return True

@router.get("/get_fields", response_model=list)
async def get_fields():
    fields = get_all_fields()
    return fields

@router.post("/delete_field", response_model=None)
async def remove_field(data: FieldID):
    delete_field(data.field_id)
    return True

@router.post("/insert_timeslot", response_model=None)
async def add_timeslot(data: TimeslotData):
    insert_timeslot(data.start, data.end, data.field_id)
    return True

@router.get("/get_timeslots", response_model=list)
async def get_timeslots():
    timeslots = get_all_timeslots()
    return timeslots

@router.post("/delete_timeslot", response_model=None)
async def remove_timeslot(data: TimeslotID):
    delete_timeslot(data.timeslot_id)
    return True

@router.post("/update_team_division", response_model=None)
async def update_team_division(data: DivisionData):
    update_division(data.team_id, data.division)
    return True

@router.put("/update_team_divisions", response_model=None)
async def update_team_divisions(data: list[DivisionData]):
    for division_data in data:
        update_division(division_data.team_id, division_data.division)
    return True

@router.get("/get_teams", response_model=list)
async def get_teams():
    teams = get_teams_season_setup()
    teams = [dict(row) for row in teams]
    return teams

@router.get("/get_divisions", response_model=list)
async def get_divisions():
    divisions = get_divisions_season_setup()
    divisions = [dict(row) for row in divisions]
    return divisions

@router.put("/update_divisions", response_model=None)
async def update_divisions(data: list[Division]):
    # Delete all divisions except team bank
    delete_all_divisions_except_team_bank()
    # Insert all updated divisions
    for division in data:
        insert_division_with_id(division.division_id, division.division_name)
    return True
