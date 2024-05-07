import { defineStore } from 'pinia';

export const useAudioStore = defineStore({
  id: 'audio',
  state: () => ({
    currentlyPlaying: null,
  }),
});
