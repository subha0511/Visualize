import React from "react";
import { FaPlay } from "react-icons/fa";
import usePlaylistStore from "./store/playlistStore";

function FileUpload() {
  const audioFiles = usePlaylistStore((state) => state.audioFiles);
  const { setCurrentIndex, addAudioFiles } = usePlaylistStore(
    (state) => state.playlistActions
  );

  const changeHandler = (event) => {
    addAudioFiles(Array(...event.target.files));
  };

  return (
    <>
      <div className="overflow-y-scroll max-h-1/2 scroll">
        {audioFiles.length > 0 &&
          audioFiles.map((item, idx) => (
            <div
              key={item.name}
              className="px-2 py-2.5 text-sm text-white/70 border-b border-gray-700 last:border-b-0 group cursor-pointer inline-flex w-full items-center justify-between overflow-hidden"
              onClick={() => setCurrentIndex(idx)}
            >
              <p className="text-ellipsis overflow-hidden grow">{item.name}</p>
              <FaPlay className="translate-x-[100px] duration-200 group-hover:translate-x-0 shrink-0 text-white/70" />
            </div>
          ))}
      </div>
      <div>
        <label
          htmlFor="file-upload"
          className="block text-center text-sm py-2 text-white/70 bg-white/25 border-b border-gray-600 hover:text-white/90 duration-200 cursor-pointer"
        >
          Load Local Files
        </label>
        <input
          type="file"
          name="file"
          id="file-upload"
          multiple
          accept=".mp3, .wav"
          onChange={changeHandler}
          className="hidden"
        />
      </div>
    </>
  );
}

export default FileUpload;
