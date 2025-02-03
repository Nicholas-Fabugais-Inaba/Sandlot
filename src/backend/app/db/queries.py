from sqlalchemy.orm import Session
from sqlalchemy import select
from .create_engine import create_connection
from .models import Player

# example insert query to use as reference
def example_insert_query():
    engine = create_connection()
    with Session(engine) as session:
        example_player = Player(
            first_name="John",
            last_name="Doe",
            email="johndoe@gmail.com",
            password="mypassword11",
            phone_number="111-111-1111",
            gender="Male",
        )
        session.add_all([example_player])
        session.commit()

# example select query to use as reference
def example_select_query():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Player).where(Player.first_name.in_(["John", "Bob"]))
        result = session.execute(stmt).all()
        # would return result to whatever route called it in practice
        print(result)