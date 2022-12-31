import React, { useState, useId } from "react";
import useAudioStore from "./store/audioStore";
import { FiChevronRight } from "react-icons/fi";
import FileUpload from "./FileUpload";
import useVisualizerStore from "./store/visualizerStore";

function Sidebar() {
  const [toggleShow, setToggleShow] = useState({
    playlist: true,
    audioSettings: false,
    visualizerSettings: false,
  });

  const toggleShowPlaylist = () => {
    setToggleShow((prev) => ({ ...prev, playlist: !prev.playlist }));
  };

  const toggleShowAudioSettings = () => {
    setToggleShow((prev) => ({ ...prev, audioSettings: !prev.audioSettings }));
  };

  const toggleShowVisualizerSettings = () => {
    setToggleShow((prev) => ({
      ...prev,
      visualizerSettings: !prev.visualizerSettings,
    }));
  };

  return (
    <>
      <div className="p-3 text-lg font-medium text-white/75 border-b border-gray-600">
        Audio Files
      </div>
      <FileUpload />
      <div
        className="p-3 text-lg font-medium text-white/75 border-b border-gray-600 inline-flex justify-between items-center w-full cursor-pointer"
        onClick={toggleShowAudioSettings}
      >
        Audio Analyser Setting
        <FiChevronRight
          size={24}
          className={` duration-200 ${
            toggleShow.audioSettings ? "transform rotate-90" : ""
          }`}
        />
      </div>
      {toggleShow.audioSettings && (
        <div className=" border-b border-gray-600">
          <AudioOptions />
        </div>
      )}
      <div
        className="p-3 text-lg font-medium text-white/75 border-b border-gray-600 inline-flex justify-between items-center w-full cursor-pointer"
        onClick={toggleShowVisualizerSettings}
      >
        Visualizer Setting
        <FiChevronRight
          size={24}
          className={` duration-200 ${
            toggleShow.visualizerSettings ? "transform rotate-90" : ""
          }`}
        />
      </div>
      {toggleShow.visualizerSettings && (
        <>
          <BarVisualizerOptions />
          <BezierVisualizerOptions />
          <SpiralVisualizerOptions />
        </>
      )}
    </>
  );
}

const AudioOptions = () => {
  const analyserOptions = useAudioStore((state) => state.analyserOptions);
  const { setFftSize, setSmoothingTimeConstant } = useAudioStore(
    (state) => state.audioActions
  );

  return (
    <div className="p-3 text-sm flex flex-col text-white/70 gap-2">
      <div className="flex gap-x-5 items-center justify-between">
        <label className="" htmlFor="fftSize">
          Sample Size
        </label>
        <input
          type="range"
          id="fftSize"
          name="fftSize"
          min="5"
          max="15"
          step="1"
          list="tickmarks"
          className="w-56"
          value={Math.log2(analyserOptions.fftSize)}
          onInput={(e) => setFftSize(Math.pow(2, e.target.value))}
        />
        <datalist id="tickmarks">
          <option value="5"></option>
          <option value="6"></option>
          <option value="7"></option>
          <option value="8"></option>
          <option value="9"></option>
          <option value="10"></option>
          <option value="11"></option>
          <option value="12"></option>
          <option value="13"></option>
          <option value="14"></option>
          <option value="15"></option>
        </datalist>
      </div>
      <div className="flex gap-x-5 items-center justify-between">
        <label className="" htmlFor="smoothing">
          Smoothing
        </label>
        <input
          type="range"
          id="smoothing"
          name="smoothing"
          className="w-56"
          min="0.1"
          max="0.99"
          step="0.01"
          value={analyserOptions.smoothingTimeConstant}
          onChange={(e) => setSmoothingTimeConstant(e.target.value)}
        />
      </div>
    </div>
  );
};

const BarVisualizerOptions = () => {
  const [open, setOpen] = useState(false);
  const barVisualizer = useVisualizerStore((state) => state.barVisualizer);
  const { setBarVisualizerField } = useVisualizerStore(
    (state) => state.visualizerActions
  );

  return (
    <div className="w-full">
      <div
        className="px-3 py-1.5 font-medium text-white/75 border-b border-gray-600 cursor-pointer inline-flex justify-between items-center w-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        Bar Visualizer
        <FiChevronRight
          size={20}
          className={`duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        />
      </div>
      {open && (
        <div className="border-b border-gray-600 px-3 py-2 text-white/70 flex flex-col gap-2">
          {Object.keys(barVisualizer).map((key) => (
            <OptionItems
              key={key}
              keyName={key}
              item={barVisualizer[key]}
              onChangeCallback={setBarVisualizerField}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SpiralVisualizerOptions = () => {
  const [open, setOpen] = useState(false);
  const spiralVisualizer = useVisualizerStore(
    (state) => state.spiralVisualizer
  );
  const { setSpiralVisualizerField } = useVisualizerStore(
    (state) => state.visualizerActions
  );

  return (
    <div className="w-full">
      <div
        className="px-3 py-1.5 font-medium text-white/75 border-b border-gray-600 cursor-pointer inline-flex justify-between items-center w-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        Spiral Visualizer
        <FiChevronRight
          size={20}
          className={`duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        />
      </div>
      {open && (
        <div className="border-b border-gray-600 px-3 py-2 text-white/70 flex flex-col gap-2">
          {Object.keys(spiralVisualizer).map((key) => (
            <OptionItems
              key={key}
              keyName={key}
              item={spiralVisualizer[key]}
              onChangeCallback={setSpiralVisualizerField}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BezierVisualizerOptions = () => {
  const [open, setOpen] = useState(true);
  const bezierVisualizer = useVisualizerStore(
    (state) => state.bezierVisualizer
  );
  const { setBezierVisualizerField } = useVisualizerStore(
    (state) => state.visualizerActions
  );
  return (
    <div className="w-full">
      <div
        className="px-3 py-1.5 font-medium text-white/75 border-b border-gray-600 cursor-pointer inline-flex justify-between items-center w-full"
        onClick={() => setOpen((prev) => !prev)}
      >
        Bezier Visualizer
        <FiChevronRight
          size={20}
          className={`duration-200 ${open ? "rotate-90" : "rotate-0"}`}
        />
      </div>
      {open && (
        <div className="border-b border-gray-600 px-3 py-2 text-white/70 flex flex-col gap-2">
          {Object.keys(bezierVisualizer).map((key) => (
            <OptionItems
              key={key}
              keyName={key}
              item={bezierVisualizer[key]}
              onChangeCallback={setBezierVisualizerField}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OptionItems = ({ keyName, item, onChangeCallback }) => {
  const id = useId();
  return (
    <div className="flex gap-x-5 items-center justify-between">
      <label className="text-sm" htmlFor={id + keyName}>
        {item.label}
      </label>
      {item.type === "boolean" && (
        <input
          type="checkbox"
          id={id + keyName}
          name={id + keyName}
          checked={item.value}
          onChange={(e) => onChangeCallback(keyName, e.target.checked)}
        />
      )}
      {item.type === "range" && (
        <input
          type="range"
          id={id + keyName}
          name={id + keyName}
          className="w-56"
          min={item.range[0]}
          max={item.range[1]}
          step={item.range.length === 3 ? item.range[2] : null}
          value={item.value}
          onChange={(e) => onChangeCallback(keyName, e.target.value)}
        />
      )}
    </div>
  );
};

export default Sidebar;
