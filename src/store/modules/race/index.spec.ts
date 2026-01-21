import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Mutations, Getters, Actions } from '../../types';
import type { RaceState, Round } from './raceTypes';
import type { RaceHorse, Horse } from '../horses/horsesTypes';
import { RACE_DISTANCES, HORSES_PER_ROUND } from '@/utils/constants';
import { raceModule } from './index';

vi.mock('@/utils/services', () => ({
  calculateDistanceFactor: vi.fn(() => 1),
  simulateRaceTick: vi.fn(() => ({
    updatedHorses: [],
    updatedResults: [],
    isRaceFinished: true,
  })),
}));

function createMockRound(lap = 1, distance = 1200): Round {
  return {
    lap,
    distance,
    horsesPerRound: [createMockRaceHorse(), createMockRaceHorse()],
    isFinished: false,
    results: [{ horseName: '' }, { horseName: '' }],
  };
}

function createMockRaceHorse(finished = false, progress = 0): RaceHorse {
  return {
    id: Math.floor(Math.random() * 1000),
    name: 'Test Horse',
    color: '#000000',
    condition: 50,
    progress,
    finished,
  };
}

function createMockHorsesList(count: number): Horse[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: `Horse ${ index }`,
    color: '#000000',
    condition: 50,
  }));
}

describe('test raceModule', () => {
  let state: RaceState;

  beforeEach(() => {
    state = raceModule.state!() as RaceState;
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('state', () => {
    it('should have initial empty rounds', () => {
      expect(state.rounds).toEqual([]);
    });

    it('should have initial currentRoundIndex of 0', () => {
      expect(state.currentRoundIndex).toBe(0);
    });

    it('should have initial isRacing as false', () => {
      expect(state.isRacing).toBe(false);
    });
  });

  describe('IS_START_DISABLED', () => {
    it('should return true when isRacing is true', () => {
      state.isRacing = true;
      state.rounds = [createMockRound()];

      const getter = raceModule.getters![Getters.IS_START_DISABLED];
      const result = getter(state, {}, {} as any, {});
      expect(result).toBe(true);
    });

    it('should return false when not racing and not on last finished round', () => {
      state.isRacing = false;
      state.currentRoundIndex = 0;
      state.rounds = [createMockRound(), createMockRound()];

      const getter = raceModule.getters![Getters.IS_START_DISABLED];
      const result = getter(state, {}, {} as any, {});
      expect(result).toBe(false);
    });

    it('should return true when on last round and all horses finished', () => {
      state.isRacing = false;
      state.currentRoundIndex = 0;
      state.rounds = [
        {
          ...createMockRound(),
          horsesPerRound: [
            createMockRaceHorse(true),
            createMockRaceHorse(true),
          ],
        },
      ];

      const getter = raceModule.getters![Getters.IS_START_DISABLED];
      const result = getter(state, {}, {} as any, {});
      expect(result).toBe(true);
    });

    it('should return false when on last round but not all horses finished', () => {
      state.isRacing = false;
      state.currentRoundIndex = 0;
      state.rounds = [
        {
          ...createMockRound(),
          horsesPerRound: [
            createMockRaceHorse(true),
            createMockRaceHorse(false),
          ],
        },
      ];

      const getter = raceModule.getters![Getters.IS_START_DISABLED];
      const result = getter(state, {}, {} as any, {});
      expect(result).toBe(false);
    });
  });

  describe('GET_CURRENT_ROUND', () => {
    it('should return undefined when no rounds', () => {
      const getter = raceModule.getters![Getters.GET_CURRENT_ROUND];
      const result = getter(state, {}, {} as any, {});
      expect(result).toBeUndefined();
    });

    it('should return current round by index', () => {
      const round1 = createMockRound(1, 1200);
      const round2 = createMockRound(2, 1400);
      state.rounds = [round1, round2];
      state.currentRoundIndex = 1;

      const getter = raceModule.getters![Getters.GET_CURRENT_ROUND];
      const result = getter(state, {}, {} as any, {});
      expect(result).toEqual(round2);
    });
  });

  describe('SET_ROUNDS', () => {
    it('should set rounds', () => {
      const rounds = [createMockRound(1), createMockRound(2)];

      const mutation = raceModule.mutations![Mutations.SET_ROUNDS];
      mutation(state, rounds);

      expect(state.rounds).toEqual(rounds);
    });
  });

  describe('SET_CURRENT_ROUND', () => {
    it('should set currentRoundIndex', () => {
      const mutation = raceModule.mutations![Mutations.SET_CURRENT_ROUND];
      mutation(state, 3);

      expect(state.currentRoundIndex).toBe(3);
    });
  });

  describe('SET_ROUND_RESULT', () => {
    it('should set results for specific round', () => {
      state.rounds = [createMockRound(1), createMockRound(2)];
      const newResults = [{ horseName: 'Winner' }, { horseName: 'Second' }];

      const mutation = raceModule.mutations![Mutations.SET_ROUND_RESULT];
      mutation(state, { roundIndex: 1, result: newResults });

      expect(state.rounds[1].results).toEqual(newResults);
      expect(state.rounds[0].results).not.toEqual(newResults);
    });
  });

  describe('SET_ROUND_PROGRESS', () => {
    it('should update horses for specific round', () => {
      state.rounds = [createMockRound(1), createMockRound(2)];
      const updatedHorses = [
        createMockRaceHorse(false, 50),
        createMockRaceHorse(true, 100),
      ];

      const mutation = raceModule.mutations![Mutations.SET_ROUND_PROGRESS];
      mutation(state, { roundIndex: 0, updatedHorses });

      expect(state.rounds[0].horsesPerRound).toEqual(updatedHorses);
    });
  });

  describe('SET_IS_RACING', () => {
    it('should set isRacing to true', () => {
      const mutation = raceModule.mutations![Mutations.SET_IS_RACING];
      mutation(state, true);

      expect(state.isRacing).toBe(true);
    });

    it('should set isRacing to false', () => {
      state.isRacing = true;

      const mutation = raceModule.mutations![Mutations.SET_IS_RACING];
      mutation(state, false);

      expect(state.isRacing).toBe(false);
    });
  });

  describe('GENERATE_PROGRAM', () => {
    it('should dispatch generateHorses and generateRounds', () => {
      const commit = vi.fn();
      const dispatch = vi.fn();
      const context = { commit, dispatch } as any;

      const action = raceModule.actions![Actions.GENERATE_PROGRAM] as Function;
      action(context);

      expect(dispatch).toHaveBeenCalledWith(
        `horses/${ Actions.GENERATE_HORSES }`,
        null,
        { root: true }
      );
      expect(dispatch).toHaveBeenCalledWith(Actions.GENERATE_ROUNDS);
    });

    it('should reset currentRound to 0 and isRacing to false', () => {
      const commit = vi.fn();
      const dispatch = vi.fn();
      const context = { commit, dispatch } as any;

      const action = raceModule.actions![Actions.GENERATE_PROGRAM] as Function;
      action(context);

      expect(commit).toHaveBeenCalledWith(Mutations.SET_CURRENT_ROUND, 0);
      expect(commit).toHaveBeenCalledWith(Mutations.SET_IS_RACING, false);
    });
  });

  describe('GENERATE_ROUNDS', () => {
    it('should generate rounds for each race distance', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_ROUNDS,
        expect.any(Array)
      );

      const rounds = commit.mock.calls[0][1] as Round[];
      expect(rounds.length).toBe(RACE_DISTANCES.length);
    });

    it('should create rounds with correct lap numbers', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round, index) => {
        expect(round.lap).toBe(index + 1);
      });
    });

    it('should create rounds with correct distances', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round, index) => {
        expect(round.distance).toBe(RACE_DISTANCES[index]);
      });
    });

    it('should select correct number of horses per round', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round) => {
        expect(round.horsesPerRound.length).toBe(HORSES_PER_ROUND);
      });
    });

    it('should initialize horses with progress 0', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round) => {
        round.horsesPerRound.forEach((horse) => {
          expect(horse.progress).toBe(0);
        });
      });
    });

    it('should initialize rounds as not finished', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round) => {
        expect(round.isFinished).toBe(false);
      });
    });

    it('should initialize empty results array', () => {
      const commit = vi.fn();
      const horses = createMockHorsesList(20);
      const rootState = { horses: { horsesList: horses } };
      const context = { commit, rootState } as any;

      const action = raceModule.actions![Actions.GENERATE_ROUNDS] as Function;
      action(context);

      const rounds = commit.mock.calls[0][1] as Round[];
      rounds.forEach((round) => {
        expect(round.results.length).toBe(round.horsesPerRound.length);
        round.results.forEach((result) => {
          expect(result.horseName).toBe('');
        });
      });
    });
  });

  describe('START_RACE', () => {
    it('should not start if round does not exist', () => {
      const commit = vi.fn();
      state.rounds = [];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      expect(commit).not.toHaveBeenCalled();
    });

    it('should not start if already racing', () => {
      const commit = vi.fn();
      state.isRacing = true;
      state.rounds = [createMockRound()];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      expect(commit).not.toHaveBeenCalled();
    });

    it('should set isRacing to true when starting', () => {
      const commit = vi.fn();
      state.isRacing = false;
      state.rounds = [createMockRound()];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      expect(commit).toHaveBeenCalledWith(Mutations.SET_IS_RACING, true);
    });

    it('should call simulateRaceTick on interval', async () => {
      const { simulateRaceTick } = await import('@/utils/services');
      const commit = vi.fn();
      state.isRacing = false;
      state.rounds = [createMockRound()];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      vi.advanceTimersByTime(100);

      expect(simulateRaceTick).toHaveBeenCalled();
    });

    it('should commit progress and results on each tick', async () => {
      const { simulateRaceTick } = await import('@/utils/services');
      vi.mocked(simulateRaceTick).mockReturnValue({
        updatedHorses: [createMockRaceHorse(false, 50)],
        updatedResults: [{ horseName: '' }],
        isRaceFinished: false,
      });

      const commit = vi.fn();
      state.isRacing = false;
      state.rounds = [createMockRound()];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      vi.advanceTimersByTime(100);

      expect(commit).toHaveBeenCalledWith(Mutations.SET_ROUND_PROGRESS, {
        roundIndex: 0,
        updatedHorses: expect.any(Array),
      });
      expect(commit).toHaveBeenCalledWith(Mutations.SET_ROUND_RESULT, {
        roundIndex: 0,
        result: expect.any(Array),
      });
    });

    it('should advance to next round when race finishes and more rounds exist', async () => {
      const { simulateRaceTick } = await import('@/utils/services');
      vi.mocked(simulateRaceTick).mockReturnValue({
        updatedHorses: [createMockRaceHorse(true, 100)],
        updatedResults: [{ horseName: 'Winner' }],
        isRaceFinished: true,
      });

      const commit = vi.fn();
      state.isRacing = false;
      state.rounds = [createMockRound(1), createMockRound(2)];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      vi.advanceTimersByTime(100);

      expect(commit).toHaveBeenCalledWith(Mutations.SET_CURRENT_ROUND, 1);
      expect(commit).toHaveBeenCalledWith(Mutations.SET_IS_RACING, false);
    });

    it('should not advance round when on last round', async () => {
      const { simulateRaceTick } = await import('@/utils/services');
      vi.mocked(simulateRaceTick).mockReturnValue({
        updatedHorses: [createMockRaceHorse(true, 100)],
        updatedResults: [{ horseName: 'Winner' }],
        isRaceFinished: true,
      });

      const commit = vi.fn();
      state.isRacing = false;
      state.rounds = [createMockRound(1)];
      const context = { commit, state } as any;

      const action = raceModule.actions![Actions.START_RACE] as Function;
      action(context, 0);

      vi.advanceTimersByTime(100);

      const setCurrentRoundCalls = commit.mock.calls.filter(
        (call) => call[0] === Mutations.SET_CURRENT_ROUND
      );
      expect(setCurrentRoundCalls.length).toBe(0);
      expect(commit).toHaveBeenCalledWith(Mutations.SET_IS_RACING, false);
    });
  });
});

describe('module configuration', () => {
  it('should be namespaced', () => {
    expect(raceModule.namespaced).toBe(true);
  });
});