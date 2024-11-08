from fastapi import FastAPI
from .routers import schedule


app = FastAPI()
app.include_router(schedule.router)


@app.get("/")
def read_root():
    return {"Hello": "World"}