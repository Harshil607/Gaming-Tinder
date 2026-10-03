import { create } from "zustand";

export const useGameStore = create((set) => ({
  games: [],
  recommendedGames: [],
  setGames: (games) => set({ games }),
  getGames: async () => {
    const res = await fetch("/api/games");
    if (!res.ok) {
      return { success: false, message: "Failed to fetch games" };
    }
    const data = await res.json();
    set({ games: data.data });
    return { success: true, data: data.data };
  },
  recordSwipe: async (swipe) => {
    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(swipe),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: "Couldn't complete the request" };
    }
  },
  getSwipes: async (userId) => {
    try {
      const res = await fetch(`/api/swipes/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }
      return { success: true, data: data.data };
    } catch (error) {
      return { success: false, message: "Failed to fetch swipes" };
    }
  },
  getRecommendedGames: async (userId) => {
    try {
      const res = await fetch(`/api/recommendations/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message };
      }
      set({ recommendedGames: data.recommendations });
      return { success: true, data: data.recommendations };
    } catch (error) {
      return { success: false, message: "Failed to fetch recommendations" };
    }
  },
}));
