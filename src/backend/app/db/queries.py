from sqlalchemy.orm import Session, aliased
from sqlalchemy import select, or_, delete, update
from .create_engine import create_connection
from .models import Player, Team, Game, RescheduleRequest, Field, TimeSlot, SeasonSettings, JoinRequest


# creating account insert query
def insert_player(name, email, password):
    engine = create_connection()
    with Session(engine) as session:
        account = Player(
            first_name=name,
            email=email,
            password=password,
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def insert_team(team_name, username, password, division, preferred_division, preferred_offday, preferred_time):
    engine = create_connection()
    with Session(engine) as session:
        account = Team(
            team_name=team_name,
            username=username,
            password=password,
            division=division,
            preferred_division=preferred_division,
            offday=preferred_offday, 
            preferred_time=preferred_time
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_player(login_email):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Player.id, Player.first_name, Player.last_name, Player.email, Player.password, Player.phone_number, Player.gender, Player.team_id).where(Player.email == login_email)
        result = session.execute(stmt).mappings().first()
        return result
    
def get_team(login_username):
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.username, Team.password, Team.division, Team.offday, Team.preferred_division, Team.preferred_time).where(Team.username == login_username)
        result = session.execute(stmt).mappings().first()
        return result

# currently a special query specifically for the scheduler, not to be used from frontend yet  
def get_all_teams():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(Team.id, Team.team_name, Team.division, Team.offday)
        result = session.execute(stmt).mappings().all()
        return result
    
def insert_game(home_team, away_team, date, time, field):
    engine = create_connection()
    with Session(engine) as session:
        game = Game(
            home_team_id=home_team,
            away_team_id=away_team,
            date=date,
            time=time,
            field=field, 
        )
        try:
            session.add_all([game])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_games():
    engine = create_connection()
    with Session(engine) as session:
        home_team_alias = aliased(Team, name="home_team")
        away_team_alias = aliased(Team, name="away_team")

        stmt = (
            select(
                Game.id,
                Game.date,
                Game.time,
                Game.field,
                Game.home_team_score,
                Game.away_team_score,
                Game.played,
                home_team_alias.id.label("home_team_id"),
                home_team_alias.team_name.label("home_team_name"),
                away_team_alias.id.label("away_team_id"),
                away_team_alias.team_name.label("away_team_name")
            )
            .join(home_team_alias, Game.home_team_id == home_team_alias.id)
            .join(away_team_alias, Game.away_team_id == away_team_alias.id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def get_team_games(team_id):
    engine = create_connection()
    with Session(engine) as session:
        home_team_alias = aliased(Team, name="home_team")
        away_team_alias = aliased(Team, name="away_team")

        stmt = (
            select(
                Game.id,
                Game.date,
                Game.time,
                Game.field,
                Game.home_team_score,
                Game.away_team_score,
                Game.played,
                home_team_alias.id.label("home_team_id"),
                home_team_alias.team_name.label("home_team_name"),
                away_team_alias.id.label("away_team_id"),
                away_team_alias.team_name.label("away_team_name")
            )
            .join(home_team_alias, Game.home_team_id == home_team_alias.id)
            .join(away_team_alias, Game.away_team_id == away_team_alias.id)
            .where(or_(Game.home_team_id == team_id, Game.away_team_id == team_id))
        )
        result = session.execute(stmt).mappings().all()
        return result

# temporary query
def insert_mock_player(first_name, last_name, email, password, phone_number, gender, team_id):
    engine = create_connection()
    with Session(engine) as session:
        account = Player(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
            phone_number=phone_number,
            gender=gender,
            team_id=team_id,
        )
        try:
            session.add_all([account])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def insert_mock_game(home_team, away_team, date, time, field, home_team_score, away_team_score, played):
    engine = create_connection()
    with Session(engine) as session:
        game = Game(
            home_team_id=home_team,
            away_team_id=away_team,
            date=date,
            time=time,
            field=field,
            home_team_score=home_team_score,
            away_team_score=away_team_score,
            played=played
        )
        try:
            session.add_all([game])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

###### RESCHEDULE REQUEST QUERIES ######
def insert_reschedule_request(requester_id, receiver_id, game_id, option1, option2, option3, option4, option5, option1_field, option2_field, option3_field, option4_field, option5_field):
    engine = create_connection()
    with Session(engine) as session:
        request = RescheduleRequest(
            requester_id=requester_id,
            receiver_id=receiver_id,
            game_id=game_id,
            option1=option1,
            option2=option2,
            option3=option3,
            option4=option4,
            option5=option5,
            option1_field=option1_field,
            option2_field=option2_field,
            option3_field=option3_field,
            option4_field=option4_field,
            option5_field=option5_field
        )
        try:
            session.add_all([request])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_reschedule_requests(team_id):
    engine = create_connection()
    with Session(engine) as session:
        requester_alias = aliased(Team, name="requesting_team")
        reciever_alias = aliased(Team, name="recieving_team")

        stmt = (
            select(
                RescheduleRequest.id, 
                RescheduleRequest.game_id, 
                RescheduleRequest.option1,
                RescheduleRequest.option1_field, 
                RescheduleRequest.option2,
                RescheduleRequest.option2_field, 
                RescheduleRequest.option3, 
                RescheduleRequest.option3_field, 
                RescheduleRequest.option4, 
                RescheduleRequest.option4_field, 
                RescheduleRequest.option5,
                RescheduleRequest.option5_field, 
                requester_alias.id.label("requester_id"),
                requester_alias.team_name.label("requester_team_name"),
                reciever_alias.id.label("reciever_id"),
                reciever_alias.team_name.label("reciever_team_name"),
                Game.date,
                Game.time,
                Game.field
            )
            .select_from(RescheduleRequest)
            .join(requester_alias, RescheduleRequest.requester_id == requester_alias.id)
            .join(reciever_alias, RescheduleRequest.receiver_id == reciever_alias.id)
            .join(Game, Game.id == RescheduleRequest.game_id)
            .where(or_(requester_alias.id == team_id, reciever_alias.id == team_id))
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_reschedule_request(request_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(RescheduleRequest).where(RescheduleRequest.id == request_id)
        session.execute(stmt)
        session.commit()
    
def update_game(game_id, new_date, new_time, new_field):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Game).where(Game.id == game_id).values(date=new_date, time=new_time, field=new_field)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()

###### STANDINGS / SCORE QUERIES ######
def get_standings():
    engine = create_connection()
    with Session(engine) as session:
        team1 = aliased(Team)
        team2 = aliased(Team)
        
        stmt = (
            select(
                Game.home_team_id,
                team1.team_name.label('home_team_name'),
                Game.home_team_score,
                team1.division.label('home_division'),
                Game.away_team_id,
                team2.team_name.label('away_team_name'),
                Game.away_team_score,
                team2.division.label('away_division')
            )
            .select_from(Game)
            .join(team1, Game.home_team_id == team1.id)
            .join(team2, Game.away_team_id == team2.id)
        )
        
        result = session.execute(stmt).mappings().all()
        return result
    
def update_score(game_id, home_team_score, away_team_score):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Game).where(Game.id == game_id).values(home_team_score=home_team_score, away_team_score=away_team_score, played=1)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

###### COMMISSIONER PAGE QUERIES ######  
def update_season_settings(start_date, end_date, games_per_team):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(SeasonSettings).values(start_date=start_date, end_date=end_date, games_per_team=games_per_team)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_season_settings():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            SeasonSettings.start_date, 
            SeasonSettings.end_date, 
            SeasonSettings.games_per_team
        )
        result = session.execute(stmt).mappings().first()
        return result
    
def insert_field(field_name):
    engine = create_connection()
    with Session(engine) as session:
        field = Field(
            field_name = field_name
        )
        try:
            session.add_all([field])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_fields():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            Field.id,
            Field.field_name
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_field(field_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(Field).where(Field.id == field_id)
        session.execute(stmt)
        session.commit()
    
def insert_timeslot(start, end, field_id):
    engine = create_connection()
    with Session(engine) as session:
        timeslot = TimeSlot(
            start = start,
            end = end,
            field_id = field_id
        )
        try:
            session.add_all([timeslot])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_all_timeslots():
    engine = create_connection()
    with Session(engine) as session:
        stmt = select(
            TimeSlot.id,
            TimeSlot.start,
            TimeSlot.end,
            TimeSlot.field_id
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_timeslot(timeslot_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(TimeSlot).where(TimeSlot.id == timeslot_id)
        session.execute(stmt)
        session.commit()

def update_division(team_id, division):
    engine = create_connection()
    with Session(engine) as session:
        stmt = update(Team).where(Team.id == team_id).values(division = division)
        try:
            session.execute(stmt)
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

###### JOIN REQUEST QUERIES ######
def insert_join_request(player_id, team_id):
    engine = create_connection()
    with Session(engine) as session:
        request = JoinRequest(
            player_id=player_id,
            team_id=team_id
        )
        try:
            session.add_all([request])
        except:
            session.rollback()
            raise
        else:
            session.commit()
    return True

def get_join_requests(team_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = (
            select(
                JoinRequest.id,
                Player.id,
                Player.first_name,
                Player.last_name,
                Player.email,
                Player.phone_number,
                Player.gender
            )
            .select_from(JoinRequest)
            .join(Player, JoinRequest.id == Player.id)
            .where(JoinRequest.team_id == team_id)
        )
        result = session.execute(stmt).mappings().all()
        return result
    
def delete_join_request(request_id):
    engine = create_connection()
    with Session(engine) as session:
        stmt = delete(JoinRequest).where(JoinRequest.id == request_id)
        session.execute(stmt)
        session.commit()