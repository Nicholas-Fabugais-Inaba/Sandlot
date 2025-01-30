from fastapi import APIRouter
from ..functions.gen_sched_input import create_schedule


router = APIRouter(tags=["schedule"])

# temporary types and function
@router.get("/schedule", response_model=list)
async def get_schedule():
    # we would call the helper functions to generate the schedule here and return the output back to the website
    schedule: list = create_schedule()
    print(schedule)
    return schedule