from fastapi import APIRouter
from .types import NewWaiver, PlayerID, Year, WaiverFormat
from ..db.queries.waiver_queries import insert_waiver, insert_waiver_format, get_all_waivers, get_player_waivers, get_waiver_format_by_year, delete_waiver_formats_by_year


router = APIRouter(tags=["waiver"])

@router.post("/create_waiver", response_model=None)
async def create_waiver(data: NewWaiver):
    insert_waiver(data.player_id, data.signature, data.initials, data.year)
    return True

@router.get("/get_all_waivers", response_model=list)
async def get_all_waivers_router():
    waivers = get_all_waivers()
    waivers = [dict(row) for row in waivers]
    return waivers

@router.post("/get_player_waivers", response_model=list)
async def get_all_player_waivers(data: PlayerID):
    waivers = get_player_waivers(data.player_id)
    waivers = [dict(row) for row in waivers]
    return waivers

@router.post("/get_waiver_format_by_year", response_model=list)
async def get_all_waiver_format_by_year(data: Year):
    waiver_formats = get_waiver_format_by_year(data.year)
    waiver_formats = [dict(row) for row in waiver_formats]
    return waiver_formats

@router.post("/delete_waiver_format_by_year", response_model=None)
async def remove_waiver_formats_by_year(data: Year):
    delete_waiver_formats_by_year(data.year)
    return True

@router.post("/insert_waiver_format", response_model=None)
async def create_waiver_format_(data: list):
    for item in data:
        insert_waiver_format(item["year"], item["index"], item["text"])
    return True