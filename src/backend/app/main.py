from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers.schedule_router import router as schedule_router
from .routers.user_router import router as user_rotuer
from .routers.standings_router import router as standings_router
from .routers.commissioner_router import router as commissioner_router


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
app.include_router(user_rotuer, prefix="/user")
app.include_router(standings_router, prefix="/standings")
app.include_router(commissioner_router, prefix="/commissioner")

@app.get("/")
def read_root():
    return {"Hello": "World"}