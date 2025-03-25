from fastapi import APIRouter
from .types import NewAnnouncement, AnnouncementData, AnnouncementID
from ..db.queries.announcement_queries import get_all_announcements, insert_announcement, update_announcement, delete_announcement


router = APIRouter(tags=["announcement"])

@router.get("/get_announcements", response_model=list)
async def get_announcements():
    announcements = get_all_announcements()
    announcements = [dict(row) for row in announcements]
    return announcements

@router.post("/create_announcement", response_model=None)
async def create_announcement(data: NewAnnouncement):
    insert_announcement(data.date, data.title, data.body)
    return True

@router.post("/update_announcement", response_model=None)
async def edit_announcement(data: AnnouncementData):
    update_announcement(data.id, data.date, data.title, data.body)
    return True

@router.post("/delete_announcement", response_model=None)
async def remove_announcement(data: AnnouncementID):
    delete_announcement(data.announcement_id)
    return True