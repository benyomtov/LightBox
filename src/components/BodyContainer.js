import React, { useRef, useState, useEffect } from "react";

function DrawOnDiv({ color, alternateColor, shadowColor, highlightColor }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lineColor, setLineColor] = useState("black");
  const [glowColor, setGlowColor] = useState("black");

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
    context.lineWidth = 50;
    context.lineCap = "round";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 15;
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
  }, [lineColor, glowColor]);

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
      fontFamily: "Rampart One, cursive",
      fontSize: "3vw",
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
      width: "4vw",
      height: "3vw",
      borderRadius: "10px",
    },
  };
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "black",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />

      <div className="row" style={styles.background}>
        <div className="m-3 col-4">
          <p className="text-center" style={styles.font}>
            Choose a color:{" "}
            <input
              id="color-picker"
              type="color"
              value={lineColor}
              style={styles.colorPicker}
              className="m-2"
              onChange={(e) => setLineColor(e.target.value)}
            />
          </p>
        </div>
        <div className="m-3 col-4">
          <p className="text-center" style={styles.font}>
            Choose a glow color:{" "}
            <input
              id="glow-picker"
              type="color"
              value={glowColor}
              style={styles.colorPicker}
              className="m-2"
              onChange={(e) => setGlowColor(e.target.value)}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

export default DrawOnDiv;
