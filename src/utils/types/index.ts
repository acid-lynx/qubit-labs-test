export interface Horse {
  id: number;
  name: string;
  color: string;
  condition: number;
}

export interface RaceHorse extends Horse {
  progress: number;
  finished?: boolean;
}

export interface RaceResult {
  horseName: string;
}

export interface Round {
  lap: number;
  distance: number;
  horsesPerRound: RaceHorse[];
  isFinished: boolean;
  results: RaceResult[];
}

export interface HorsesState {
  horsesList: Horse[];
}

export interface RaceState {
  rounds: Round[];
  currentRoundIndex: number;
  isRacing: boolean;
}

export interface RootState {
  horses: HorsesState;
  race: RaceState;
}
