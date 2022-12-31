import create from "zustand";

const useVisualizerStore = create((set, get) => ({
  barVisualizer: {
    show: {
      type: "boolean",
      value: false,
      label: "Show",
    },
    hue: {
      type: "range",
      value: 70,
      range: [0, 255, 1],
      label: "Hue",
    },
    saturation: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Saturation",
    },
    lightness: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Lightness",
    },
    alpha: {
      type: "range",
      value: 0.5,
      range: [0, 1, 0.01],
      label: "Alpha",
    },
    scale: {
      type: "range",
      value: 1.0,
      range: [0.5, 5.0, 0.1],
      label: "Scale",
    },
  },

  spiralVisualizer: {
    show: {
      type: "boolean",
      value: false,
      label: "Show",
    },
    rotation: {
      type: "range",
      value: 8,
      range: [1, 50],
      label: "Rotation",
    },
    hue: {
      type: "range",
      value: 70,
      range: [0, 255, 1],
      label: "Hue",
    },
    saturation: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Saturation",
    },
    lightness: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Lightness",
    },
    alpha: {
      type: "range",
      value: 0.5,
      range: [0, 1, 0.01],
      label: "Alpha",
    },
    scale: {
      type: "range",
      value: 1.0,
      range: [0.5, 5.0, 0.1],
      label: "Scale",
    },
  },

  bezierVisualizer: {
    show: {
      type: "boolean",
      value: true,
      label: "Show",
    },
    rotation: {
      type: "range",
      value: 8,
      range: [1, 50],
      label: "Rotation",
    },
    hue: {
      type: "range",
      value: 70,
      range: [0, 255, 1],
      label: "Hue",
    },
    saturation: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Saturation",
    },
    lightness: {
      type: "range",
      value: 50,
      range: [0, 100, 1],
      label: "Lightness",
    },
    alpha: {
      type: "range",
      value: 1,
      range: [0, 1, 0.01],
      label: "Alpha",
    },
    scale: {
      type: "range",
      value: 1.2,
      range: [0.5, 5.0, 0.1],
      label: "Scale",
    },
  },

  visualizerActions: {
    setBarVisualizerField: (field, value) => {
      set((state) => ({
        ...state,
        barVisualizer: {
          ...state.barVisualizer,
          [field]: {
            ...state.barVisualizer[field],
            value: value,
          },
        },
      }));
    },

    setSpiralVisualizerField: (field, value) => {
      set((state) => ({
        ...state,
        spiralVisualizer: {
          ...state.spiralVisualizer,
          [field]: {
            ...state.spiralVisualizer[field],
            value: value,
          },
        },
      }));
    },

    setBezierVisualizerField: (field, value) => {
      set((state) => ({
        ...state,
        bezierVisualizer: {
          ...state.bezierVisualizer,
          [field]: {
            ...state.bezierVisualizer[field],
            value: value,
          },
        },
      }));
    },
  },
}));

export default useVisualizerStore;
