from fastapi import APIRouter
from .types import NewDirectory, DirectoryData, DirectoryID
from ..db.queries.directory_queries import insert_directory, get_all_directories, update_directory, delete_directory


router = APIRouter(tags=["home"])

@router.get("/get_directories", response_model=list)
async def get_directories():
    directories = get_all_directories()
    directories = [dict(row) for row in directories]
    return directories

@router.post("/create_directory", response_model=None)
async def create_directory(data: NewDirectory):
    insert_directory(data.name, data.content)
    return True

@router.post("/update_directory", response_model=None)
async def edit_directory(data: DirectoryData):
    update_directory(data.directory_id, data.name, data.content)
    return True

@router.post("/delete_directory", response_model=None)
async def remove_directory(data: DirectoryID):
    delete_directory(data.directory_id)
    return True