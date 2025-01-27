import { create } from "zustand";
import useAudioStore from "./audioStore";

const usePlaylistStore = create((set, get) => ({
  audioFiles: [],
  fileIds: new Set(),
  currentIndex: null,

  playlistActions: {
    playNext: () => {
      const audioFiles = get().audioFiles;
      if (!audioFiles) {
        return;
      }
      const nextIndex = (get().currentIndex + 1) % audioFiles.length;
      set((state) => ({ ...state, currentIndex: nextIndex }));
    },

    playPrev: () => {
      const audioFiles = get().audioFiles;
      if (!audioFiles) return;
      const prevIndex = (get().currentIndex + 1) % audioFiles.length;
      set((state) => ({ ...state, currentIndex: prevIndex }));
    },

    addAudioFiles: (files) => {
      const audioFiles = get().audioFiles;
      const fileIds = get().fileIds;
      const newAudioFiles = [...files].filter((item) => {
        const currentId = item.type + item.size + item.lastModified;
        if (fileIds.has(currentId)) {
          return false;
        }
        fileIds.add(currentId);
        return true;
      });

      set((state) => ({
        ...state,
        audioFiles: [...audioFiles, ...newAudioFiles],
        fileIds: fileIds,
        currentIndex: state.currentIndex === null ? state.currentIndex : 0,
      }));
    },

    setCurrentIndex: (idx) => {
      set((state) => ({ ...state, currentIndex: idx }));
    },

    // removeFile: (idx) => {
    //   const audioFiles = get().audioFiles;
    //   audioFiles.splice(idx, 1);
    //   set((state) => ({ ...state, audioFiles }));
    // },
  },
}));

export default usePlaylistStore;
