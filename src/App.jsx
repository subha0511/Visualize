import { useRef, useEffect } from "react";
import Visualiser from "./Visualiser";
import Sidebar from "./Sidebar";
import useAudioStore from "./store/audioStore";
import Player from "./Player";
import usePlaylistStore from "./store/playlistStore";

function App() {
  const parentRef = useRef();

  return (
    <div className="bg-black h-screen flex flex-col divide-y divide-slate-600 font-mono">
      <div className="grid grid-cols-12 w-full flex-1 min-h-0">
        <div
          className={`col-span-9 bg-white/5 overflow-hidden`}
          ref={parentRef}
        >
          <Visualiser parentRef={parentRef} />
        </div>
        <div
          className={`col-span-3 border-l border-slate-600 text-white overflow-y-auto scrollbar-hide`}
        >
          <Sidebar />
        </div>
      </div>
      <div className="shrink-0">
        <Player />
      </div>
      <SyncAudioFile />
    </div>
  );
}

const SyncAudioFile = () => {
  const audioFiles = usePlaylistStore((state) => state.audioFiles);
  const { setAudioFile } = useAudioStore((state) => state.audioActions);
  const currentIndex = usePlaylistStore((state) => state.currentIndex);

  useEffect(() => {
    if (currentIndex !== null) {
      setAudioFile(audioFiles[currentIndex]);
    }
  }, [currentIndex]);

  return null;
};

export default App;
