import { useRef, useEffect } from "react";
import useRect from "./hooks/useRect";
import {
  visualiserBezierLine,
  visualiserSpiral,
  visualiserBar,
} from "./utils/visualizers";
import useAudioStore from "./store/audioStore";
import useVisualizerStore from "./store/visualizerStore";
import shallow from "zustand/shallow";

function Visualiser({ parentRef }) {
  const { isPlaying } = useAudioStore((state) => state.playerOptions);
  const { bufferLength } = useAudioStore((state) => state.analyserOptions);
  const analyser = useAudioStore((state) => state.analyser);

  const canvasRef = useRef();
  const { width, height } = useRect(parentRef);

  const analyserRef = useRef(analyser);
  const bufferLengthRef = useRef(bufferLength);
  const pauseCanvasRef = useRef(isPlaying);
  const dataArray = useRef(new Uint8Array(bufferLengthRef.current));

  //Ref to get the latest state of the visualizer options in recursive animation
  const visualizerOptions = useVisualizerStore(
    (state) => ({
      barVisualizer: state.barVisualizer,
      spiralVisualizer: state.spiralVisualizer,
      bezierVisualizer: state.bezierVisualizer,
    }),
    shallow
  );
  const visualizerOptionsRef = useRef(visualizerOptions);

  useEffect(() => {
    analyserRef.current = analyser;
  }, [analyser]);

  useEffect(() => {
    visualizerOptionsRef.current = visualizerOptions;
  }, [visualizerOptions]);

  useEffect(() => {
    bufferLengthRef.current = bufferLength;
    dataArray.current = new Uint8Array(bufferLengthRef.current);
  }, [bufferLength]);

  const draw = () => {
    if (!canvasRef || pauseCanvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const canvasHeight = canvasRef.current.height;
    const canvasWidth = canvasRef.current.width;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (visualizerOptionsRef.current.barVisualizer.show.value) {
      visualiserBar(
        ctx,
        canvasWidth,
        canvasHeight,
        bufferLengthRef.current,
        dataArray.current,
        visualizerOptionsRef.current.barVisualizer
      );
    }
    if (visualizerOptionsRef.current.bezierVisualizer.show.value) {
      visualiserBezierLine(
        ctx,
        canvasWidth,
        canvasHeight,
        bufferLengthRef.current,
        dataArray.current,
        visualizerOptionsRef.current.bezierVisualizer
      );
    }
    if (visualizerOptionsRef.current.spiralVisualizer.show.value) {
      visualiserSpiral(
        ctx,
        canvasWidth,
        canvasHeight,
        bufferLengthRef.current,
        dataArray.current,
        visualizerOptionsRef.current.spiralVisualizer
      );
    }
  };

  const loopingAnimation = () => {
    if (isPlaying && analyser) {
      requestAnimationFrame(loopingAnimation);
      analyserRef.current.getByteFrequencyData(dataArray.current);
      draw(dataArray.current);
    }
  };

  useEffect(() => {
    pauseCanvasRef.current = !isPlaying;
    if (isPlaying) {
      loopingAnimation();
    }
  }, [isPlaying]);

  return <canvas ref={canvasRef} height={height} width={width} />;
}

export default Visualiser;
