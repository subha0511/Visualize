import React, { useEffect } from "react";
import useAudioStore from "./store/audioStore";
import { FiChevronRight, FiChevronLeft, FiPlay, FiPause } from "react-icons/fi";
import CustomSlider from "./components/CustomSlider";
import usePlaylistStore from "./store/playlistStore";

const formatSecond = (seconds) => {
  if (seconds === null) return "00:00";
  let secs = Math.round(seconds);
  const mins = Math.floor(secs / 60);
  secs %= 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

function Player() {
  const audio = useAudioStore((state) => state.audio);
  const audioFiles = usePlaylistStore((state) => state.audioFiles);
  const playerOptions = useAudioStore((state) => state.playerOptions);
  const audioActions = useAudioStore((state) => state.audioActions);
  const { playNext, playPrev } = usePlaylistStore(
    (state) => state.playlistActions
  );

  const onPlayStart = () => {
    audioActions.play();
  };

  const onPlayStop = () => {
    audioActions.pause();
  };

  return (
    <div className="grid grid-cols-12 w-full items-stretch text-white/60 h-12 shrink-0">
      {audio === null ? (
        <div className="w-full px-5 grid place-items-center h-full col-span-12 text-sm ">
          {audioFiles.length === 0
            ? "No files found!!! Please load some local audio files..."
            : "Select a song from the sidebar..."}
        </div>
      ) : (
        <>
          <div className="py-3 px-5 col-span-3 flex items-center max-h-full">
            <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {playerOptions.name}
            </p>
          </div>

          <div className="h-full col-span-6 flex items-center border-l border-gray-600 overflow-hidden">
            <span className="text-sm mx-5">
              {formatSecond(playerOptions.currentTime)}
            </span>
            <div className="grow">
              <CustomSlider />
            </div>
            <span className="text-sm mx-5">
              {formatSecond(playerOptions.duration)}
            </span>
          </div>

          <button
            className="py-3 col-span-1 relative flex text-gray-400 border-l border-gray-600 overflow-hidden"
            onClick={playPrev}
          >
            <div className="absolute inset-0 translate-x-0 duration-300 grid place-items-center">
              <div>previous</div>
            </div>
          </button>

          <button
            className="py-3 col-span-1 relative flex text-red-400 border-l border-gray-600 overflow-hidden"
            onClick={playerOptions.isPlaying ? onPlayStop : onPlayStart}
          >
            <div
              className={`absolute inset-0 scale-100 opacity-100 grid place-items-center ${
                !playerOptions.isPlaying
                  ? "text-green-400/80"
                  : "text-red-400/80"
              }`}
            >
              <div>{playerOptions.isPlaying ? "pause" : "play"}</div>
            </div>
          </button>

          <button
            className="py-3 col-span-1 relative flex text-gray-400 border-l border-gray-600 overflow-hidden"
            onClick={playNext}
          >
            <div className="absolute inset-0 translate-x-0 duration-300 grid place-items-center">
              <div>next</div>
            </div>
          </button>
        </>
      )}
    </div>
  );
}

export default Player;
