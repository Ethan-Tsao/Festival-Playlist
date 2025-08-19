'use client';

import { create } from 'zustand';

type ArtistsState = {
  lineupArtists: string[];
  playlistArtists: string[];
  setLineupArtists: (artists: string[]) => void;
  setPlaylistArtists: (artists: string[]) => void;
};

export const useArtistsStore = create<ArtistsState>()((set) => ({
  lineupArtists: [],
  playlistArtists: [],
  setLineupArtists: (artists) => set({ lineupArtists: artists }),
  setPlaylistArtists: (artists) => set({ playlistArtists: artists }),
}));
