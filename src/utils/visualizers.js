//Bar Visualizer
export const visualiserBar = (
  ctx,
  canvasWidth,
  canvasHeight,
  bufferLength,
  data,
  options
) => {
  let x = 0;
  let barWidth = canvasWidth / bufferLength;
  ctx.fillStyle = `hsla(${options.hue.value},${options.saturation.value}%,${options.lightness.value}%,${options.alpha.value})`;
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = data[i] * options.scale.value;
    ctx.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
    x += barWidth;
  }
};

//Spiral Visualizer
export const visualiserSpiral = (
  ctx,
  canvasWidth,
  canvasHeight,
  bufferLength,
  data,
  options
) => {
  let barWidth = canvasWidth / bufferLength;
  ctx.fillStyle = `hsla(${options.hue.value},${options.saturation.value}%,${options.lightness.value}%,${options.alpha.value})`;
  for (let i = 0; i < bufferLength; i++) {
    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((i * Math.PI * 2 * options.rotation.value) / bufferLength);
    const barHeight = data[i] * options.scale.value;
    ctx.fillRect(1, 1, barWidth, barHeight);
    ctx.restore();
  }
};

//Line Visualizer
export const visualiserLine = (
  ctx,
  canvasWidth,
  canvasHeight,
  bufferLength,
  data
) => {
  let x = 0;
  let barWidth = canvasWidth / bufferLength;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineJoin = "round";
  for (let i = 0; i < bufferLength; i++) {
    const barHeight = data[i] * 2;
    ctx.lineTo(x, canvasHeight - barHeight);
    x += barWidth;
  }
  ctx.stroke();
};

//Circular Line Visualizer

export const visualiserCircularLine = (
  ctx,
  canvasWidth,
  canvasHeight,
  bufferLength,
  data
) => {
  const roundedData = getRoundCoordinate(data, bufferLength, 12, 1.1);
  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.beginPath();
  ctx.moveTo(roundedData[0].x, roundedData[0].y);
  for (let i = 0; i < bufferLength; i++) {
    const { x, y } = roundedData[i];
    ctx.lineTo(x, y);
  }
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.stroke();
  ctx.restore();
};

//Bezier Line Visualizer

export const visualiserBezierLine = (
  ctx,
  canvasWidth,
  canvasHeight,
  bufferLength,
  data,
  options
) => {
  const roundedData = getRoundCoordinate(
    data,
    bufferLength,
    options.rotation.value,
    options.scale.value
  );
  ctx.save();
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  ctx.beginPath();
  ctx.moveTo(roundedData[0].x, roundedData[0].y);
  let i;
  for (i = 1; i < bufferLength - 2; i++) {
    let xc = (roundedData[i].x + roundedData[i + 1].x) / 2;
    let yc = (roundedData[i].y + roundedData[i + 1].y) / 2;
    ctx.quadraticCurveTo(roundedData[i].x, roundedData[i].y, xc, yc);
  }
  ctx.quadraticCurveTo(
    roundedData[i].x,
    roundedData[i].y,
    roundedData[i + 1].x,
    roundedData[i + 1].y
  );
  ctx.strokeStyle = `hsla(${options.hue.value},${options.saturation.value}%,${options.lightness.value}%,${options.alpha.value})`;
  ctx.stroke();
  ctx.restore();
};

//Utility Functions

export const lastNonzeroIndex = (data) => {
  let n = data.length - 1;
  while (n >= 0 && data[n] === 0) {
    n -= 1;
  }
  return n + 1;
};

export const getControlPoints = (data, tangentLength = 0.4) => {
  let controlPoints = [];
  for (let i = 1; i < data.length - 1; i++) {
    const dx = data[i + 1].x - data[i - 1].x;
    const dy = data[i + 1].y - data[i - 1].y;
    controlPoints.push({
      x: data[i].x - dx * tangentLength,
      y: data[i].y - dy * tangentLength,
    });
    controlPoints.push({
      x: data[i].x + dx * tangentLength,
      y: data[i].y + dy * tangentLength,
    });
  }
  return controlPoints;
};

export const getBeizerPath = (data, tangentLength = 0.4) => {
  let bezeirPath = [];
  for (let i = 1; i < data.length - 1; i++) {
    const { x, y } = data[i];
    const dx = data[i + 1].x - data[i - 1].x;
    const dy = data[i + 1].y - data[i - 1].y;
    bezeirPath.push([
      data[i].x - dx * tangentLength,
      data[i].y - dy * tangentLength,
      data[i].x + dx * tangentLength,
      data[i].y + dy * tangentLength,
      x,
      y,
    ]);
  }
  return bezeirPath;
};

export const getBeizerCurve = (data) => {
  const controlPoints = getControlPoints(data);
  let curvePath = `M${data[0].x},${data[0].y} Q${controlPoints[1][1].x},${controlPoints[1][1].y}, ${data[1].x},${data[1].y} `;
  if (data.length > 2) {
    // central curves are cubic Bezier
    for (let i = 1; i < data.length - 2; i++) {
      curvePath += `C${controlPoints[i][0].x}, ${controlPoints[i][0].y}, ${
        controlPoints[i + 1][1].x
      }, ${controlPoints[i + 1][1].y}, ${data[i + 1].x},${data[i + 1].y}`;
    }
    // the first & the last curve are quadratic Bezier
    let n = data.length - 1;
    curvePath += `Q${controlPoints[n - 1][0].x}, ${
      controlPoints[n - 1][0].y
    }, ${data[n].x}, ${data[n].y}`;
  }
  return curvePath;
};

export const getRoundCoordinate = (
  data,
  bufferLength,
  rotation = 1,
  scale = 1
) => {
  const newArray = [];
  for (let i = 0; i < bufferLength; i++) {
    const deg = (i * rotation * Math.PI * 2) / bufferLength;
    const x = data[i] * scale * Math.cos(deg);
    const y = data[i] * scale * Math.sin(deg);
    newArray.push({ x, y });
  }
  return newArray;
};
