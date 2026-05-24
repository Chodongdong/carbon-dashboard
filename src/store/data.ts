"use client";

import { create } from "zustand";
import type { Activity, EmissionFactor } from "@/types";
import {
  fetchActivities,
  fetchEmissionFactors,
  createActivity,
  bulkCreateActivities,
  updateActivity,
  deleteActivity,
  updateEmissionFactor,
} from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

type DataStore = {
  activities: Activity[];
  emissionFactors: EmissionFactor[];
  activitiesStatus: Status;
  factorsStatus: Status;
  activitiesError: string | null;
  factorsError: string | null;

  loadActivities: () => Promise<void>;
  loadEmissionFactors: () => Promise<void>;
  addActivity: (input: Omit<Activity, "id">) => Promise<void>;
  bulkAddActivities: (inputs: Omit<Activity, "id">[]) => Promise<void>;
  editActivity: (input: Activity) => Promise<void>;
  removeActivity: (id: string) => Promise<void>;
  editEmissionFactor: (input: EmissionFactor) => Promise<void>;
};

export const useDataStore = create<DataStore>((set, get) => ({
  activities: [],
  emissionFactors: [],
  activitiesStatus: "idle",
  factorsStatus: "idle",
  activitiesError: null,
  factorsError: null,

  loadActivities: async () => {
    set({ activitiesStatus: "loading", activitiesError: null });
    try {
      const data = await fetchActivities();
      set({ activities: data, activitiesStatus: "success" });
    } catch {
      set({ activitiesStatus: "error", activitiesError: "데이터를 불러오지 못했습니다." });
    }
  },

  loadEmissionFactors: async () => {
    set({ factorsStatus: "loading", factorsError: null });
    try {
      const data = await fetchEmissionFactors();
      set({ emissionFactors: data, factorsStatus: "success" });
    } catch {
      set({ factorsStatus: "error", factorsError: "배출계수를 불러오지 못했습니다." });
    }
  },

  addActivity: async (input) => {
    const created = await createActivity(input);
    set((s) => ({ activities: [...s.activities, created] }));
  },

  bulkAddActivities: async (inputs) => {
    const created = await bulkCreateActivities(inputs);
    set((s) => ({ activities: [...s.activities, ...created] }));
  },

  editActivity: async (input) => {
    const prev = get().activities;
    // 낙관적 업데이트
    set((s) => ({ activities: s.activities.map((a) => (a.id === input.id ? input : a)) }));
    try {
      await updateActivity(input);
    } catch (e) {
      // 롤백
      set({ activities: prev });
      throw e;
    }
  },

  removeActivity: async (id) => {
    const prev = get().activities;
    set((s) => ({ activities: s.activities.filter((a) => a.id !== id) }));
    try {
      await deleteActivity(id);
    } catch (e) {
      set({ activities: prev });
      throw e;
    }
  },

  editEmissionFactor: async (input) => {
    const updated = await updateEmissionFactor(input);
    set((s) => ({
      emissionFactors: s.emissionFactors.map((f) => (f.id === updated.id ? updated : f)),
    }));
  },
}));
