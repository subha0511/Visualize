import React from "react";
import { FaPlay } from "react-icons/fa";
import usePlaylistStore from "./store/playlistStore";

function AudioList() {
  const audioFiles = usePlaylistStore((state) => state.audioFiles);
  const { setCurrentIndex } = usePlaylistStore(
    (state) => state.playlistActions
  );

  return (
    <>
      {audioFiles.length > 0 && (
        <div className="overflow-y-scroll max-h-1/2 scroll divide-y divide-gray-300 pl-2">
          {audioFiles.map((item, idx) => (
            <div
              key={item.name}
              className="px-2 py-2.5 text-sm text-white/70 last:border-b-0 group cursor-pointer inline-flex w-full items-center justify-between overflow-hidden"
              onClick={() => setCurrentIndex(idx)}
            >
              <p className="text-ellipsis overflow-hidden grow">{item.name}</p>
              <FaPlay className="translate-x-[100px] duration-200 group-hover:translate-x-0 shrink-0 text-white/70" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AudioList;
