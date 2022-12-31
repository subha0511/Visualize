import React from "react";
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
    <div className="grid grid-cols-12 w-full items-stretch text-white/60 h-12">
      {audio === null ? (
        <div className="w-full px-5 grid place-items-center h-full col-span-12 ">
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
            {/* <div className="w-14 border-r border-gray-600 overflow-y-scroll h-full no-scrollbar snap-y snap-mandatory">
          <AnimatePresence>
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                className="w-full h-full grid place-items-center snap-center snap-always"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div> */}
            <span className="text-sm mx-5">
              {formatSecond(playerOptions.currentTime)}
            </span>
            <div className="grow">
              <CustomSlider />
            </div>
            <span className="text-sm mx-5">
              {formatSecond(playerOptions.duration)}
            </span>
            {/* <div className="w-14 border-r border-gray-600 overflow-y-scroll h-full no-scrollbar snap-y ">
          <AnimatePresence>
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                className="w-full h-full grid place-items-center snap-start snap-always"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div> */}
          </div>

          <button
            className="py-3 col-span-1 relative flex text-red-400 border-l border-gray-600 group overflow-hidden"
            onClick={playPrev}
          >
            <div className="absolute inset-0 translate-x-0 group-hover:-translate-x-[100px] duration-300 grid place-items-center">
              <div>Previous</div>
            </div>
            <div className="absolute inset-0 translate-x-[100px] group-hover:translate-x-0 duration-300 grid place-items-center">
              <FiChevronLeft
                size={20}
                className="scale-100 group-hover:scale-150 duration-200 delay-200"
              />
            </div>
          </button>

          <button
            className="py-3 col-span-1 relative flex text-red-400 border-l border-gray-600 group overflow-hidden"
            onClick={playerOptions.isPlaying ? onPlayStop : onPlayStart}
          >
            <div className="absolute inset-0 scale-100 opacity-100 group-hover:scale-0 group-hover:opacity-0 duration-300 grid place-items-center">
              <div>{playerOptions.isPlaying ? "Pause" : "Play"}</div>
            </div>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 duration-300 grid place-items-center">
              {playerOptions.isPlaying ? (
                <FiPause
                  size={24}
                  className="scale-0 group-hover:scale-125 duration-200 delay-200"
                />
              ) : (
                <FiPlay
                  size={24}
                  className="scale-0 group-hover:scale-125 duration-200 delay-200"
                />
              )}
            </div>
          </button>

          <button
            className="py-3 col-span-1 relative flex text-red-400 border-l border-gray-600 group overflow-hidden"
            onClick={playNext}
          >
            <div className="absolute inset-0 translate-x-0 group-hover:translate-x-[100px] duration-300 grid place-items-center">
              <div>Next</div>
            </div>
            <div className="absolute inset-0 -translate-x-[100px] group-hover:translate-x-0 duration-300 grid place-items-center">
              <FiChevronRight
                size={20}
                className="scale-100 group-hover:scale-150 duration-200 delay-200"
              />
            </div>
          </button>
        </>
      )}
    </div>
  );
}

export default Player;
