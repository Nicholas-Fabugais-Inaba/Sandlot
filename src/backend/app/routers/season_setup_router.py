from fastapi import APIRouter
from .types import SeasonSettings, FieldName, FieldID, TimeslotData, TimeslotID, DivisionData, DivisionTeamData, Division, SeasonState, SettingsID, SeasonPreset, EndSeasonData
from ..db.queries.season_settings_queries import insert_season_settings, get_season_settings, update_season_settings, update_season_state, delete_season_settings, get_season_state, get_all_season_settings
from ..db.queries.field_queries import insert_field, get_all_fields, delete_field
from ..db.queries.timeslot_queries import insert_timeslot, get_all_timeslots, delete_timeslot
from ..db.queries.team_queries import update_division, get_all_teams, get_teams_season_setup, deactivate_all_teams, activate_all_teams
from ..db.queries.game_queries import insert_game, delete_all_games
from ..db.queries.division_queries import insert_division_with_id, delete_all_divisions_except_team_bank, get_divisions_season_setup
from ..db.queries.reschedule_request_queries import delete_all_reschedule_requests


router = APIRouter(tags=["season-setup"])

@router.post("/create_schedule", response_model=None)
async def create_schedule(schedule: dict):
    # Clear previous data
    delete_all_reschedule_requests()
    delete_all_games()

    teams = {}
    Teams = get_all_teams()
    for i in range(len(Teams)):
        teams[Teams[i]["id"]] = {"id": Teams[i]["id"], "name": Teams[i]["team_name"], "offday": Teams[i]["offday"]}
    for gameslot, game in schedule.items():
        gameslot = gameslot.split(",")
        insert_game(int(teams[game[0]]["id"]), int(teams[game[1]]["id"]), gameslot[2], gameslot[1], gameslot[0])

@router.get("/get_season_state", response_model=dict)
async def get_season_state_route():
    state = get_season_state()
    return {"state": state}

@router.post("/create_season_preset", response_model=dict)
async def create_season_preset(settings: SeasonPreset):
    insert_season_settings(settings.name, settings.start_date, settings.end_date, settings.games_per_team)
    return True

@router.get("/get_season_settings", response_model=dict)
async def get_SS():
    settings = get_season_settings()
    return settings

@router.get("/get_all_season_settings", response_model=dict)
async def get_all_SS():
    settings = get_all_season_settings()
    settings = [dict(row) for row in settings]
    return settings

@router.put("/update_season_settings", response_model=None)
async def update_SS(settings: SeasonSettings):
    update_season_settings(settings.start_date, settings.end_date, settings.games_per_team)
    return True

@router.put("/change_season_state", response_model=None)
async def change_season_state(season_state: SeasonState):
    update_season_state(season_state.state)
    return True

@router.post("/delete_season_preset", response_model=None)
async def delete_season_preset(data: SettingsID):
    delete_season_settings(data.settings_id)
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

@router.put("/update_divisions_and_teams", response_model=None)
async def update_divisions_and_teams_route(data: list[DivisionTeamData]):
    print("Division data: ", data)
    # Delete all divisions except team bank
    delete_all_divisions_except_team_bank()

    # Collect unique divisions
    unique_divisions = {}
    for division in data:
        if division.division not in unique_divisions:
            unique_divisions[division.division] = division.division_name
    print("Divisions to insert: ", unique_divisions)

    # Insert all unique divisions
    for division_id, division_name in unique_divisions.items():
        if division_id != 0:
            insert_division_with_id(division_id, division_name)

    # Update team divisions
    for division in data:
        if division.team_id != 0:
            update_division(division.team_id, division.division)

    return True

@router.post("/end_season", response_model=None)
async def end_season_route(data: EndSeasonData):
    # Archive all active team and player data
    if data.archiveTeams:
        print("archive teams")
    # Deactivate all active teams and players
    deactivate_all_teams()
    # Switch season state in database to offseason
    update_season_state("offseason")
    return True

@router.get("/offseason_to_preseason", response_model=None)
async def offseason_to_preseason_route():
    # Switch season state in database to preseason
    update_season_state("preseason")
    return True

@router.get("/preseason_to_season", response_model=None)
async def preseason_to_season_route():
    # DEV PURPOSES ONLY TODO REMOVE THIS
    activate_all_teams()
    # Switch season state in database to season
    update_season_state("season")
    return True
