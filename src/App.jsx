import { useRef, useEffect } from "react";
import Visualiser from "./Visualiser";
import Sidebar from "./Sidebar";
import useAudioStore from "./store/audioStore";
import Player from "./Player";
import usePlaylistStore from "./store/playlistStore";

function App() {
  const audioFiles = usePlaylistStore((state) => state.audioFiles);
  const { setAudioFile } = useAudioStore((state) => state.audioActions);
  const currentIndex = usePlaylistStore((state) => state.currentIndex);

  useEffect(() => {
    if (currentIndex !== null) {
      setAudioFile(audioFiles[currentIndex]);
    }
  }, [currentIndex]);

  const parentRef = useRef();

  return (
    <div className="bg-black h-screen flex flex-col">
      <div className="grid grid-cols-12 grow w-full max-h-min overflow-y-hidden">
        <div className={`grow col-span-9 bg-white/5`} ref={parentRef}>
          <Visualiser parentRef={parentRef} />
        </div>
        <div
          className={`col-span-3 border-l border-slate-600 text-white scroll overflow-y-scroll`}
        >
          <Sidebar />
        </div>
      </div>
      <div className="bg-white/5 border-t border-slate-600 ">
        <Player />
        {/* <div className="grow bg-white/25">
          <CustomSlider />
        </div> */}
        {/* <button
          className="py-3 px-8 text-red-400"
          onClick={isPlaying ? onPlayStop : onPlayStart}
        >
          {isPlaying ? "Pause" : "Play"}
        </button> */}
      </div>
    </div>
  );
}

export default App;
