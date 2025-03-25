from fastapi import APIRouter
from .types import NewWaiver, PlayerID
from ..db.queries.waiver_queries import insert_waiver, get_all_waivers, get_player_waivers


router = APIRouter(tags=["waiver"])

@router.post("/create_waiver", response_model=None)
async def create_waiver(data: NewWaiver):
    insert_waiver(data.player_id, data.signature, data.date)
    return True

@router.get("/get_all_waivers", response_model=list)
async def get_all_waivers():
    waivers = get_all_waivers()
    waivers = [dict(row) for row in waivers]
    return waivers

@router.post("/get_player_waivers", response_model=list)
async def get_all_player_waivers(data: PlayerID):
    waivers = get_player_waivers(data.player_id)
    waivers = [dict(row) for row in waivers]
    return waivers