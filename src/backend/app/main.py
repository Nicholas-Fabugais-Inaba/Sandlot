from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.schedule_router import router as schedule_router
from .routers.team_router import router as team_router 
from .routers.user_router import router as user_router
from .routers.standings_router import router as standings_router
from .routers.season_setup_router import router as season_setup_router
from .routers.announcement_router import router as announcement_router


app = FastAPI()

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(schedule_router, prefix="/schedule")
app.include_router(user_router, prefix="/user")
app.include_router(standings_router, prefix="/standings")
app.include_router(team_router, prefix="/team")
app.include_router(season_setup_router, prefix="/season-setup")
app.include_router(announcement_router, prefix="/announcement")

@app.get("/")
def read_root():
    return {"Hello": "World"}