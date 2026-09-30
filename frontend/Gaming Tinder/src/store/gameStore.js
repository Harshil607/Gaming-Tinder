import { create } from "zustand";

export const useGameStore = create((set) => ({
  games: [],
  setGames: (games) => set({ games }),
  getGames: async () => {
    const res = await fetch("/api/games");
    if (!res.ok) {
      return { success: false, message: "Failed to fetch games" };
    }
    const data = await res.json();
    set({ games: data.data });
    return { success: true, message: "Games received" };
  },
  recordSwipe: async (swipe) => {
    const res = await fetch("/api/swipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(swipe),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: "Failed to record swipe" };
    }
    return { success: true, data: data.data };
  },
}));
