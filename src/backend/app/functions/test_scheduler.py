
import unittest
from datetime import date
from parameterized import parameterized
from gen_sched_input import gen_schedule_repeated

tigers = {"name": "Tigers", "offday": 0}
cardinals = {"name": "Cardinals", "offday": 2}
orioles = {"name": "Orioles", "offday": 4}
jays = {"name": "Blue Jays", "offday": 2}
dodgers = {"name": "Dodgers", "offday": 3}
rangers = {"name": "Rangers", "offday": 1}
astros = {"name": "Astros", "offday": 0}
angels = {"name": "Angels", "offday": 4}
rockies = {"name": "Rockies", "offday": 2}
royals = {"name": "Royals", "offday": 0}
cubs = {"name": "Cubs", "offday": 3}
padres = {"name": "Padres", "offday": 3}
white_sox = {"name": "White Sox", "offday": 1}
guardians = {"name": "Guardians", "offday": 2}
braves = {"name": "Braves", "offday": 1}
giants = {"name": "Giants", "offday": 0}
brewers = {"name": "Brewers", "offday": 4}
nationals = {"name": "Nationals", "offday": 3}
rays = {"name": "Rays", "offday": 4}
marlins = {"name": "Marlins", "offday": 2}
yankees = {"name": "Yankees", "offday": 1}
red_sox = {"name": "Red Sox", "offday": 2}
diamondbacks = {"name": "Diamondbacks", "offday": 3}
mets = {"name": "Mets", "offday": 4}
reds = {"name": "Reds", "offday": 0}
phillies = {"name": "Phillies", "offday": 1}
pirates = {"name": "Pirates", "offday": 2}
mariners = {"name": "Mariners", "offday": 3}

teams = {0: tigers, 1: cardinals, 2: orioles, 3: jays, 4: dodgers, 5: rangers, 6: astros, 7: angels, 8: rockies, 9: royals, 10: cubs, 11: padres, 12: white_sox, 13: guardians, 14: braves, 15: giants, 16: brewers, 17: nationals, 18: rays, 19: marlins, 20: yankees, 21: red_sox, 22: diamondbacks, 23: mets, 24: reds, 25: phillies, 26: pirates, 27: mariners}
div_a = {0: tigers, 1: cardinals, 2: orioles, 3: jays, 4: dodgers, 5: rangers, 6: astros}
div_b = {7: angels, 8: rockies, 9: royals, 10: cubs, 11: padres, 12: white_sox, 13: guardians}
div_c = {14: braves, 15: giants, 16: brewers, 17: nationals, 18: rays, 19: marlins, 20: yankees}
div_d = {21: red_sox, 22: diamondbacks, 23: mets, 24: reds, 25: phillies, 26: pirates, 27: mariners}

divs = [div_a, div_b, div_c, div_d]

class TestGenScheduleRepeated(unittest.TestCase):

    @parameterized.expand([
        (date(2025, 5, 5), date(2025, 8, 20), 25, teams, divs),
        (date(2025, 6, 1), date(2025, 9, 1), 20, teams, divs),
        (date(2025, 4, 1), date(2025, 7, 15), 30, teams, divs),
        (date(2025, 5, 15), date(2025, 8, 30), 18, teams, divs),
        (date(2025, 6, 10), date(2025, 9, 10), 22, teams, divs)
    ])

    def test_gen_schedule_repeated(self, start_date: date, end_date: date, games_per_team, teams, divs):
        fields = 3
        timeslots = 3

        schedule, score, t = gen_schedule_repeated(fields, timeslots, games_per_team, start_date, end_date, teams, divs)
        # print(schedule)

        # Validate the number of games per team
        games_count = {team_id: 0 for team_id in teams.keys()}
        for game in schedule.values():
            home_team = game[0]
            away_team = game[1]
            games_count[home_team] += 1
            games_count[away_team] += 1

        for team, count in games_count.items(): # INCORRECT CURRENTLY
            self.assertTrue(count <= games_per_team, f"{teams[team]["name"]} does not have {games_per_team} games")

        # Validate that all games fall within the start and end dates
        for game_slot in schedule.keys():
            game_date = game_slot[2]
            self.assertTrue(start_date <= game_date <= end_date, f"Game on {game_date} is out of the date range")

if __name__ == "__main__":
    unittest.main()
