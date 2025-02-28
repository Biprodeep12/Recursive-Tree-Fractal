import { useEffect, useRef, useState } from 'react';

const FractalTree = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [depth, setDepth] = useState(10);
  const [angle, setAngle] = useState(25);
  const [growthSpeed, setGrowthSpeed] = useState(5);
  const [randomFactor, setRandomFactor] = useState(5);
  const [colorShift, setColorShift] = useState(0);

  const generateNewTree = () => {
    setDepth(Math.floor(Math.random() * 10) + 5);
    setAngle(Math.floor(Math.random() * 30) + 15);
    setRandomFactor(Math.floor(Math.random() * 10) + 5);
    setColorShift(Math.floor(Math.random() * 360));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 500;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let animationFrame: number;
    const maxSteps = 20;

    const drawBranch = (
      x: number,
      y: number,
      fullLength: number,
      branchAngle: number,
      currentDepth: number,
      step: number,
      hue: number,
    ) => {
      if (currentDepth === 0) return;

      const radianAngle = (branchAngle * Math.PI) / 180;
      const currentLength = (fullLength * step) / maxSteps;

      const xEnd = x + currentLength * Math.cos(radianAngle);
      const yEnd = y + currentLength * Math.sin(radianAngle);

      const newHue = (hue + colorShift) % 360;
      ctx.strokeStyle = `hsl(${newHue}, 70%, 50%)`;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();

      if (step < maxSteps) {
        animationFrame = requestAnimationFrame(() =>
          drawBranch(
            x,
            y,
            fullLength,
            branchAngle,
            currentDepth,
            step + 1,
            hue,
          ),
        );
      } else {
        const randomLeft = angle + (Math.random() * 2 - 1) * randomFactor;
        const randomRight = angle + (Math.random() * 2 - 1) * randomFactor;

        setTimeout(() => {
          drawBranch(
            xEnd,
            yEnd,
            fullLength * 0.7,
            branchAngle - randomLeft,
            currentDepth - 1,
            0,
            newHue + 10,
          );
          drawBranch(
            xEnd,
            yEnd,
            fullLength * 0.7,
            branchAngle + randomRight,
            currentDepth - 1,
            0,
            newHue - 10,
          );
        }, growthSpeed * 10);
      }
    };

    drawBranch(canvas.width / 2, canvas.height - 50, 100, -90, depth, 0, 30);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [depth, angle, growthSpeed, randomFactor, colorShift]);

  return (
    <div className='relative bg-black p-5'>
      <canvas
        ref={canvasRef}
        className='border border-gray-500 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
      />
      <div className='flex gap-4 flex-col fixed top-1/2 -translate-y-1/2'>
        <label className='text-white flex flex-col'>
          Depth: {depth}
          <input
            type='range'
            min='1'
            max='15'
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
          />
        </label>
        <label className='text-white flex flex-col'>
          Angle: {angle}°
          <input
            type='range'
            min='10'
            max='45'
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
          />
        </label>
        <label className='text-white flex flex-col'>
          Speed: {growthSpeed}
          <input
            type='range'
            min='1'
            max='10'
            value={growthSpeed}
            onChange={(e) => setGrowthSpeed(Number(e.target.value))}
          />
        </label>
        <label className='text-white flex flex-col'>
          Branch Randomness: {randomFactor}
          <input
            type='range'
            min='0'
            max='15'
            value={randomFactor}
            onChange={(e) => setRandomFactor(Number(e.target.value))}
          />
        </label>
        <button
          className=' bg-blue-500 text-white px-4 py-2 rounded-lg w-[200px] cursor-pointer'
          onClick={() => setColorShift((prev) => prev + 30)}>
          Change Tree Color
        </button>
        <button
          className=' bg-yellow-500 text-white px-4 py-2 rounded-lg w-[200px] cursor-pointer'
          onClick={generateNewTree}>
          Random New Tree
        </button>
        <button
          className=' bg-green-500 text-white px-4 py-2 rounded-lg w-[200px] cursor-pointer'
          onClick={() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const dataUrl = canvas.toDataURL('image/png');
            const newTab = window.open();
            if (newTab) {
              newTab.document.write(
                `<img src="${dataUrl}" onload="window.print(); window.close();" />`,
              );
              newTab.document.close();
            }
          }}>
          Print Tree
        </button>
      </div>
    </div>
  );
};

export default FractalTree;
