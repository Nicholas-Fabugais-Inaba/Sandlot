from fastapi import APIRouter


router = APIRouter(tags=["schedule"])

# temporary types and function
@router.get("/schedule", response_model=int)
async def get_schedule(inputData: int):
    # we would call the helper functions to generate the schedule here and return the output back to the website
    return 5