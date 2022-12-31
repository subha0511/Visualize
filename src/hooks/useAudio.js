import { useEffect, useReducer } from "react";

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const audioReducer = (state, action) => {
  switch (action.type) {
    case "PLAY":
      return { ...state, isPlaying: true };
    case "PAUSE":
      return { ...state, isPlaying: false };
    case "SET_ANALYSER":
      return { ...state, analyser: action.payload };
    case "SET_SOURCE":
      return { ...state, audioElementSource: action.payload };
    default:
      return state;
  }
};

const getInitialState = ({ src, options }) => {
  const audio = new Audio(src);
  const audioElementSource = audioContext.createMediaElementSource(audio);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = options.fftSize;
  analyser.smoothingTimeConstant = options.smoothingTimeConstant;

  audioElementSource.connect(analyser);
  audioElementSource.connect(audioContext.destination);

  return {
    audio,
    analyser,
    audioElementSource,
    audioContext: audioContext,
    isPlaying: false,
  };
};

function useAudio(
  src,
  options = {
    fftSize: 1024,
    smoothingTimeConstant: 0.8,
  }
) {
  const [state, dispatch] = useReducer(
    audioReducer,
    { src, options },
    getInitialState
  );

  useEffect(() => {
    state.analyser.fftSize = options.fftSize;
    state.analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  }, [options]);

  const play = () => {
    if (state.audioContext.state === "suspended") {
      audioContext.resume();
    }
    state.audio.play();
    dispatch({ type: "PLAY" });
  };

  const pause = () => {
    state.audio.pause();
    dispatch({ type: "PAUSE" });
  };

  return {
    play,
    pause,
    ...state,
    bufferLength: options.fftSize / 2,
  };
}

export default useAudio;
