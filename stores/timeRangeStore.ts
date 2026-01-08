import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subMinutes, subHours, subDays } from 'date-fns';

export type TimeRangePreset = '15m' | '1h' | '6h' | '24h' | '7d' | '30d' | 'custom';

interface TimeRangeState {
  preset: TimeRangePreset;
  from: Date;
  to: Date;
  refreshInterval: number; // in milliseconds, 0 = off

  // Actions
  setPreset: (preset: TimeRangePreset) => void;
  setCustomRange: (from: Date, to: Date) => void;
  setRefreshInterval: (interval: number) => void;
  refresh: () => void;
  getRange: () => { from: Date; to: Date };
}

function getPresetRange(preset: TimeRangePreset): { from: Date; to: Date } {
  const now = new Date();

  switch (preset) {
    case '15m':
      return { from: subMinutes(now, 15), to: now };
    case '1h':
      return { from: subHours(now, 1), to: now };
    case '6h':
      return { from: subHours(now, 6), to: now };
    case '24h':
      return { from: subDays(now, 1), to: now };
    case '7d':
      return { from: subDays(now, 7), to: now };
    case '30d':
      return { from: subDays(now, 30), to: now };
    default:
      return { from: subHours(now, 1), to: now };
  }
}

export const useTimeRangeStore = create<TimeRangeState>()(
  persist(
    (set, get) => ({
      preset: '1h',
      from: subHours(new Date(), 1),
      to: new Date(),
      refreshInterval: 30000, // 30 seconds default

      setPreset: (preset) => {
        if (preset === 'custom') {
          set({ preset });
        } else {
          const { from, to } = getPresetRange(preset);
          set({ preset, from, to });
        }
      },

      setCustomRange: (from, to) => {
        set({ preset: 'custom', from, to });
      },

      setRefreshInterval: (interval) => {
        set({ refreshInterval: interval });
      },

      refresh: () => {
        const { preset } = get();
        if (preset !== 'custom') {
          const { from, to } = getPresetRange(preset);
          set({ from, to });
        }
      },

      getRange: () => {
        const { preset, from, to } = get();
        if (preset !== 'custom') {
          return getPresetRange(preset);
        }
        return { from, to };
      },
    }),
    {
      name: 'infra-observatory-time-range',
      partialize: (state) => ({
        preset: state.preset,
        refreshInterval: state.refreshInterval,
      }),
    }
  )
);
