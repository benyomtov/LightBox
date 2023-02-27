import React, { useRef, useState, useEffect } from "react";

function DrawOnDiv({ color, alternateColor, shadowColor, highlightColor }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lineColor, setLineColor] = useState("black");
  const [glowColor, setGlowColor] = useState("black");
  const [lineThickness, setLineThickness] = useState(50);
  const [glowBlur, setGlowBlur] = useState(15);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let alpha = 0.1;

    const interval = setInterval(() => {
      context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }, 200);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = lineColor;
    context.lineWidth = lineThickness;
    context.lineCap = "round";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = glowBlur;
    context.shadowColor = glowColor;

    function draw(e) {
      if (!isDrawing) return;
      if (e.type === "mousemove" || e.type === "mouseenter") {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      }
    }

    canvas.addEventListener("mouseenter", (e) => {
      setIsDrawing(true);
      setLastX(e.offsetX);
      setLastY(e.offsetY);
    });

    return () => {
      canvas.removeEventListener("mouseenter", (e) => {
        setIsDrawing(true);
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      });
    };
  }, [lineColor, glowColor, lineThickness, glowBlur]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    function draw(e) {
      if (!isDrawing) return;
      if (e.type === "mousemove") {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      }
    }

    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousemove", draw);
    };
  }, [isDrawing, lastX, lastY]);

  const styles = {
    font: {
      fontFamily: "Azeret Mono, monospace",
      fontSize: "1vw",
      color: `${color}`,
      textShadow: `5px 5px 10px ${shadowColor}`,
      border: `3px solid ${color}`,
      boxShadow: `5px 5px 10px ${shadowColor}`,
      backgroundColor: highlightColor,
      borderRadius: "10px",
    },
    background: {
      backgroundColor: alternateColor,
    },

    colorPicker: {
      border: `3px solid ${color}`,
    //   width: "10vw",
      height: "3vw",

      borderRadius: "10px",
    },
  };
  return (
    <div>
      <div className="fixed-top col-2 h-100" style={styles.background}>
        <div className="m-3 row">
          <div className="row">
            <p className="text-center" style={styles.font}>
              Line Color:{" "}
              <input
                id="color-picker"
                type="color"
                value={lineColor}
                style={styles.colorPicker}
                className="m-2 w-75"
                onChange={(e) => setLineColor(e.target.value)}
              />
            </p>
          </div>
          <div className="row">
            <p className="text-center" style={styles.font}>
              Line Thickness:{" "}
              <input
                id="thickness-picker"
                type="range"
                value={lineThickness}
                style={styles.colorPicker}
                className="m-2 w-75"
                onChange={(e) => setLineThickness(e.target.value)}
              />
            </p>
          </div>
          <div className="row">
            <p className="text-center" style={styles.font}>
              Glow Color:{" "}
              <input
                id="glow-picker"
                type="color"
                value={glowColor}
                style={styles.colorPicker}
                className="m-2 w-75"
                onChange={(e) => setGlowColor(e.target.value)}
              />
            </p>
          </div>
          <div className="row">
            <p className="text-center" style={styles.font}>
              Glow Blur:{" "}
              <input
                id="-glow-blur-picker"
                type="range"
                value={glowBlur}
                style={styles.colorPicker}
                className="m-2 w-75"
                onChange={(e) => setGlowBlur(e.target.value)}
              />
            </p>
          </div>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "black",
          top: 0,
          left: 0,
          zIndex: -1,
          position: "absolute",
        }}
      />
    </div>
  );
}

export default DrawOnDiv;
