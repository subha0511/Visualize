import create from "zustand";
import usePlaylistStore from "./playlistStore";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 1024;

const blob = window.URL || window.webkitURL;

const useAudioStore = create((set, get) => ({
  audio: null,
  audioSource: null,
  audioContext: audioContext,
  analyser: analyser,

  playerOptions: {
    isPlaying: false,
    duration: 0,
    currentTime: 0,
    name: "",
    playbackRate: 1,
    volume: 1,
  },

  analyserOptions: {
    fftSize: 1024,
    smoothingTimeConstant: 0.8,
    bufferLength: 512,
  },

  audioActions: {
    setFftSize: (value) => {
      const analyser = get().analyser;
      analyser.fftSize = value;
      set((state) => ({
        ...state,
        analyserOptions: {
          ...state.analyserOptions,
          fftSize: value,
          bufferLength: value / 2,
        },
      }));
    },

    setSmoothingTimeConstant: (value) => {
      const analyser = get().analyser;
      analyser.smoothingTimeConstant = value;
      set((state) => ({
        ...state,
        analyserOptions: {
          ...state.analyserOptions,
          smoothingTimeConstant: value,
        },
      }));
    },

    onAudioChange: () => {
      const audioSource = get().audioSource;
      if (audioSource) {
        audioSource.disconnect();
      }
    },

    onAudioTimeUpdate: () => {
      const audio = get().audio;
      set((state) => ({
        ...state,
        playerOptions: {
          ...state.playerOptions,
          currentTime: audio.currentTime,
        },
      }));
    },

    setAudioTime: (time) => {
      const audio = get().audio;
      if (audio && Number.isInteger(time)) {
        audio.currentTime = time;
      }
    },

    onAudioLoad: () => {
      const audio = get().audio;
      set((state) => ({
        ...state,
        playerOptions: {
          ...state.playerOptions,
          duration: audio.duration,
        },
      }));
    },

    setAudioFile: async (file) => {
      get().audioActions.pause();

      set((state) => ({
        ...state,
        playerOptions: { ...state.playerOptions, name: file.name },
      }));

      const audioContext = get().audioContext;
      const audio = new Audio();
      const audioSource = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();

      const analyserOptions = get().analyserOptions;
      analyser.fftSize = analyserOptions.fftSize;
      analyser.smoothingTimeConstant = analyserOptions.smoothingTimeConstant;

      audioSource.connect(audioContext.destination);
      audioSource.connect(analyser);

      audio.addEventListener("loadedmetadata", get().audioActions.onAudioLoad);
      audio.addEventListener(
        "ended",
        usePlaylistStore.getState().playlistActions.playNext
      );
      audio.addEventListener(
        "timeupdate",
        get().audioActions.onAudioTimeUpdate
      );

      const fileURL = blob.createObjectURL(file);
      audio.src = fileURL;

      set((state) => ({
        ...state,
        audio,
        audioSource,
        analyser,
      }));

      get().audioActions.play();
    },

    setAudioFromPath: (src, name) => {
      get().audioActions.pause();

      set((state) => ({
        ...state,
        playerOptions: { ...state.playerOptions, name: name },
      }));

      const audioContext = get().audioContext;
      const audio = new Audio();
      const audioSource = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();

      const analyserOptions = get().analyserOptions;
      analyser.fftSize = analyserOptions.fftSize;
      analyser.smoothingTimeConstant = analyserOptions.smoothingTimeConstant;

      audioSource.connect(audioContext.destination);
      audioSource.connect(analyser);

      audio.addEventListener("loadedmetadata", get().audioActions.onAudioLoad);
      audio.addEventListener(
        "ended",
        usePlaylistStore.getState().playlistActions.playNext
      );
      audio.addEventListener(
        "timeupdate",
        get().audioActions.onAudioTimeUpdate
      );

      audio.src = src;

      set((state) => ({
        ...state,
        audio,
        audioSource,
        analyser,
      }));
    },

    play: () => {
      const audio = get().audio;
      const audioContext = get().audioContext;
      audioContext.resume();
      if (audio) {
        audio.play();
        set((state) => ({
          ...state,
          playerOptions: { ...state.playerOptions, isPlaying: true },
        }));
      }
    },

    pause: () => {
      const audio = get().audio;

      if (audio) {
        audio.pause();
        set((state) => ({
          ...state,
          playerOptions: { ...state.playerOptions, isPlaying: false },
        }));
      }
    },
  },
}));

export default useAudioStore;
