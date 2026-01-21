import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Mutations, Getters, Actions } from '../../types';
import type { HorsesState, Horse } from './horsesTypes';
import { TOTAL_HORSES } from '@/utils/constants';
import { horsesModule } from './index';

vi.mock('@/utils/constants', async () => {
  const actual = await vi.importActual('@/utils/constants');
  return {
    ...actual,
    generateHorseName: vi.fn(() => 'Test Horse'),
    generateColor: vi.fn(() => '#ff0000'),
    generateCondition: vi.fn(() => 50),
  };
});

describe('test horsesModule', () => {
  let state: HorsesState;

  beforeEach(() => {
    state = horsesModule.state!() as HorsesState;
  });

  describe('state', () => {
    it('should have initial empty horsesList', () => {
      expect(state.horsesList).toEqual([]);
    });
  });

  describe('HORSES_LIST', () => {
    it('should return empty array when no horses', () => {
      const getter = horsesModule.getters![Getters.HORSES_LIST];
      const result = getter(state, {}, {} as any, {});
      expect(result).toEqual([]);
    });

    it('should return horsesList from state', () => {
      const horses: Horse[] = [
        { id: 0, name: 'Horse 1', color: '#000', condition: 50 },
        { id: 1, name: 'Horse 2', color: '#fff', condition: 75 },
      ];
      state.horsesList = horses;

      const getter = horsesModule.getters![Getters.HORSES_LIST];
      const result = getter(state, {}, {} as any, {});
      expect(result).toEqual(horses);
    });
  });

  describe('SET_HORSES', () => {
    it('should set horses list', () => {
      const horses: Horse[] = [
        { id: 0, name: 'Horse 1', color: '#000', condition: 50 },
        { id: 1, name: 'Horse 2', color: '#fff', condition: 75 },
      ];

      const mutation = horsesModule.mutations![Mutations.SET_HORSES];
      mutation(state, horses);

      expect(state.horsesList).toEqual(horses);
    });

    it('should replace existing horses', () => {
      state.horsesList = [
        { id: 0, name: 'Old Horse', color: '#123', condition: 30 },
      ];

      const newHorses: Horse[] = [
        { id: 0, name: 'New Horse 1', color: '#000', condition: 50 },
        { id: 1, name: 'New Horse 2', color: '#fff', condition: 75 },
      ];

      const mutation = horsesModule.mutations![Mutations.SET_HORSES];
      mutation(state, newHorses);

      expect(state.horsesList).toEqual(newHorses);
      expect(state.horsesList.length).toBe(2);
    });

    it('should handle empty array', () => {
      state.horsesList = [
        { id: 0, name: 'Horse', color: '#000', condition: 50 },
      ];

      const mutation = horsesModule.mutations![Mutations.SET_HORSES];
      mutation(state, []);

      expect(state.horsesList).toEqual([]);
    });
  });

  describe('GENERATE_HORSES', () => {
    it('should generate correct number of horses', () => {
      const commit = vi.fn();
      const context = { commit } as any;

      const action = horsesModule.actions![Actions.GENERATE_HORSES] as Function;
      action(context);

      expect(commit).toHaveBeenCalledTimes(1);
      expect(commit).toHaveBeenCalledWith(
        Mutations.SET_HORSES,
        expect.any(Array)
      );

      const horses = commit.mock.calls[0][1] as Horse[];
      expect(horses.length).toBe(TOTAL_HORSES);
    });

    it('should generate horses with sequential ids', () => {
      const commit = vi.fn();
      const context = { commit } as any;

      const action = horsesModule.actions![Actions.GENERATE_HORSES] as Function;
      action(context);

      const horses = commit.mock.calls[0][1] as Horse[];
      horses.forEach((horse, index) => {
        expect(horse.id).toBe(index);
      });
    });

    it('should generate horses with name, color, condition', () => {
      const commit = vi.fn();
      const context = { commit } as any;

      const action = horsesModule.actions![Actions.GENERATE_HORSES] as Function;
      action(context);

      const horses = commit.mock.calls[0][1] as Horse[];
      horses.forEach((horse) => {
        expect(horse).toHaveProperty('id');
        expect(horse).toHaveProperty('name');
        expect(horse).toHaveProperty('color');
        expect(horse).toHaveProperty('condition');
        expect(typeof horse.id).toBe('number');
        expect(typeof horse.name).toBe('string');
        expect(typeof horse.color).toBe('string');
        expect(typeof horse.condition).toBe('number');
      });
    });
  });
});