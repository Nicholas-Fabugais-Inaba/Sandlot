export type Event = {
  start: Date;
  end: Date;
  field1?: {
    id: number;
    home: string;
    home_id: number;
    away: string;
    away_id: number;
  };
  field2?: {
    id: number;
    home: string;
    home_id: number;
    away: string;
    away_id: number;
  };
  field3?: {
    id: number;
    home: string;
    home_id: number;
    away: string;
    away_id: number;
  };
};

export type GenSchedResponse = {
  events: Event[];
  schedule: any;
  score: number;
};

export type Game = {
  id: number;
  home_team: string;
  away_team: string;
  date: string;
  time: string;
  field: string;
  home_team_score: string;
  away_team_score: string;
  played: boolean;
};

export type Standings = {
  team_name: string;
  wins: number;
  losses: number;
  ties: number;
  forfeits: number;
  differential: number;
  division: string;
};
