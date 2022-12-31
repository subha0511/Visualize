import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import useRect from "../hooks/useRect";
import useInterval from "../hooks/useInterval";
import useAudioStore from "../store/audioStore";
import usePlaylistStore from "./../store/playlistStore";

const defaultOptions = {
  strokeWidth: 3,
  amplitude: 6,
  wavelength: 6,
  phase: 0.25,
};

const createSquigglyPath = (
  strokeWidth,
  amplitude,
  wavelength,
  phase,
  width
) => {
  if (!wavelength) return "";
  const y = amplitude + strokeWidth / 2;
  let path = `M ${strokeWidth} ${y + amplitude * Math.sin(phase / wavelength)}`;
  for (let i = 0; i <= width; i++) {
    path += ` L ${strokeWidth + i} ${
      y + amplitude * Math.sin((i + phase) / wavelength)
    }`;
  }
  return path;
};

function CustomSlider({ svgOptions }) {
  const audio = useAudioStore((state) => state.audio);
  const { setAudioTime } = useAudioStore((state) => state.audioActions);
  const { isPlaying, duration, currentTime } = useAudioStore(
    (state) => state.playerOptions
  );
  const currentIndex = usePlaylistStore((state) => state.currentIndex);

  //SVG dimension refs
  const lineRef = useRef();
  const thumbRef = useRef();
  const { width } = useRect(lineRef);
  const { width: thumbWidth } = useRect(thumbRef);

  //SVG Render Options
  const options = { ...defaultOptions, ...svgOptions };
  const y = options.amplitude + options.strokeWidth / 2;
  const svgHeight = 2 * options.amplitude + options.strokeWidth;

  const sliderWidth = width - thumbWidth;

  //Path and Path update refs
  const isPlayingRef = useRef(isPlaying);
  const phaseRef = useRef(0);
  const pathRef = useRef();
  const pathWidthRef = useRef(width - 2 * options.strokeWidth - thumbWidth / 2);

  //Motion Values for controlling path offset and translation
  const currentValue = useMotionValue(currentTime);

  const x = useTransform(currentValue, [0, duration], [0, sliderWidth]);
  const progress = useTransform(currentValue, [0, duration], [0, 1]);
  const reverseProgress = useTransform(currentValue, [0, duration], [1, 0]);

  //Interval for updating motion value controlling path offset and translation
  useInterval(
    () => {
      if (currentValue.get() < duration) {
        currentValue.set(audio.currentTime);
      }
    },
    isPlaying ? 200 : null
  );

  const updatePath = () => {
    if (!isPlayingRef.current) return;
    pathRef.current.setAttribute(
      "d",
      createSquigglyPath(
        options.strokeWidth,
        options.amplitude,
        options.wavelength,
        phaseRef.current,
        pathWidthRef.current
      )
    );
    phaseRef.current = phaseRef.current + options.phase;
    requestAnimationFrame(updatePath);
  };

  //Reset motion value controlling path offset and translation when audioFileChanges changes
  useEffect(() => {
    currentValue.set(0);
  }, [currentIndex]);

  //Play and Pause animation for wiggly path
  useEffect(() => {
    if (isPlaying) {
      const requestId = requestAnimationFrame(updatePath);
      return () => cancelAnimationFrame(requestId);
    }
  }, [isPlaying]);

  //Ref to stop animation in requestAnimationFrame
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  //Update path width ref
  //Reason -> Causing negetive pathWidth on initial render due to width being 0
  useEffect(() => {
    pathWidthRef.current = width - 2 * options.strokeWidth - thumbWidth / 2;
  }, [width, options.strokeWidth, thumbWidth]);

  const handleDrag = () => {
    let containerBounds = lineRef.current.getBoundingClientRect();
    let thumbBounds = thumbRef.current.getBoundingClientRect();
    let widthCovered = Math.max(0, thumbBounds.x - containerBounds.x);
    let newValue = Math.floor((duration * widthCovered) / sliderWidth);
    currentValue.set(newValue);
    setAudioTime(newValue);
  };

  const handleTap = (e) => {
    let containerBounds = lineRef.current.getBoundingClientRect();
    let widthCovered = clamp(e.x - containerBounds.x, 0, sliderWidth);
    let newValue = Math.floor((duration * widthCovered) / sliderWidth);
    currentValue.set(newValue);
    setAudioTime(newValue);
  };

  return (
    <div className="grid items-center h-full">
      <motion.div
        className={`relative text-white h-[${svgHeight + 2}] grid items-center`}
        ref={lineRef}
        onTap={handleTap}
      >
        <motion.div
          className={`z-10 h-[15px] aspect-square bg-white rounded-full cursor-pointer bg-red-500 cursor-grab `}
          ref={thumbRef}
          style={{ x }}
          drag="x"
          dragConstraints={lineRef}
          dragMomentum={false}
          dragElastic={0}
          onDrag={handleDrag}
        ></motion.div>

        <motion.svg
          width={width}
          height={svgHeight}
          xmlns="http://www.w3.org/2000/svg"
          className={"absolute"}
        >
          <motion.path
            style={{ pathLength: progress }}
            ref={pathRef}
            d={createSquigglyPath(
              options.strokeWidth,
              options.amplitude,
              options.wavelength,
              options.phase,
              pathWidthRef.current
            )}
            strokeWidth={options.strokeWidth}
            stroke="rgba(255,255,255,0.6)"
            fill="transparent"
            strokeLinecap="round"
          />
          <motion.path
            style={{ pathLength: reverseProgress }}
            d={`M ${width - options.strokeWidth} ${y} L ${
              options.strokeWidth
            } ${y}`}
            strokeWidth={options.strokeWidth}
            stroke="rgba(255,255,255,0.25)"
            fill="transparent"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

export default CustomSlider;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function roundTo(number, decimals = 0) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
