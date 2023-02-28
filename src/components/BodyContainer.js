import React, { useRef, useState, useEffect } from "react";

function DrawOnDiv({ color, alternateColor, shadowColor, highlightColor }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lineColor, setLineColor] = useState("#000000");
  const [glowColor, setGlowColor] = useState("#000000");
  const [lineThickness, setLineThickness] = useState(50);
  const [glowBlur, setGlowBlur] = useState(15);
  const [paused, setPaused] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [brushShape, setBrushShape] = useState("round");
    const [previousFile, setPreviousFile] = useState(null);

    const handleDownload = () => {

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = dataURL;
    link.click();

    };

  const handleImageUpload = (e) => {
    console.log("handleImageUpload");
    var file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext('2d');
          context.drawImage(img, 0, 0, canvas.width, canvas.height); // draw the image onto the canvas
        };
        img.src = e.target.result;
        console.log(img.src);
    };
  
    reader.readAsDataURL(file);
    e.target.value = null;
  };


  useEffect(() => {
    let interval = null;

    if (!paused) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const alpha = 0.1;

      interval = setInterval(() => {
        context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }, 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = lineColor;
    context.lineWidth = lineThickness;
    context.lineCap = brushShape;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = glowBlur;
    context.shadowColor = glowColor;

    function draw(e) {
      if (!isDrawing) return;
      if (
        e.type === "mousemove" ||
        e.type === "mouseenter" ||
        e.type === "mousedown"
      ) {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      }
    }

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseOut);

    function handleMouseEnter(e) {
      if (!drawMode) {
        setIsDrawing(true);
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      } else return;
    }

    function handleMouseMove(e) {
      draw(e);
    }

    function handleMouseDown(e) {
      if (drawMode) {
        setIsDrawing(true);
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      } else return;
    }

    function handleMouseUp() {
      if (drawMode) setIsDrawing(false);
    }

    function handleMouseOut() {
      setIsDrawing(false);
    }

    return () => {
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseOut);
    };
  }, [
    lineColor,
    glowColor,
    lineThickness,
    glowBlur,
    isDrawing,
    lastX,
    lastY,
    drawMode,
    brushShape,
  ]);

  // canvas.addEventListener("mouseenter", (e) => {
  //   setIsDrawing(true);
  //   setLastX(e.offsetX);
  //   setLastY(e.offsetY);
  // });

  // canvas.addEventListener("mousemove", draw);

  // return () => {
  //   canvas.removeEventListener("mouseenter", (e) => {
  //     setIsDrawing(true);
  //     setLastX(e.offsetX);
  //     setLastY(e.offsetY);
  //   });

  //     canvas.removeEventListener("mousemove", draw);
  // };

  //   useEffect(() => {
  //     const canvas = canvasRef.current;
  //     const context = canvas.getContext("2d");

  //     function draw(e) {
  //       if (!isDrawing) return;
  //       if (e.type === "mousemove") {
  //         context.beginPath();
  //         context.moveTo(lastX, lastY);
  //         context.lineTo(e.offsetX, e.offsetY);
  //         context.stroke();
  //         setLastX(e.offsetX);
  //         setLastY(e.offsetY);
  //       }
  //     }

  //     canvas.addEventListener("mousemove", draw);

  //     return () => {
  //       canvas.removeEventListener("mousemove", draw);
  //     };
  //   }, [isDrawing, lastX, lastY]);

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
          <div className="m-3 row" style={{ overflowY: "scroll", height: "100%"}}>
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
            <div className="row">
              <p className="text-center" style={styles.font}>
                Brush Shape:{" "}
                <select
                  id="brush-shape"
                  style={styles.colorPicker}
                  className="m-2 w-75"
                  onChange={(e) => {
                    setBrushShape(e.target.value);
                    console.log(e.target.value);
                  }}
                >
                  <option value="round">Round</option>
                  <option value="square">Square</option>
                  <option value="butt">Butt</option>
                </select>
              </p>
            </div>
            <div className="row">
              <p className="text-center" style={styles.font}>
                Pause:{" "}
                <input
                  id="pause"
                  type="checkbox"
                  style={styles.colorPicker}
                  className="m-2 w-75"
                  onChange={(e) => {
                    setPaused(e.target.checked);
                    console.log(e.target.checked);
                  }}
                />
              </p>
            </div>
            <div className="row">
              <p className="text-center" style={styles.font}>
                Draw Mode:{" "}
                <input
                  id="draw-mode"
                  type="checkbox"
                  style={styles.colorPicker}
                  className="m-2 w-75"
                  onChange={(e) => {
                    setDrawMode(e.target.checked);
                    console.log(e.target.checked);
                  }}
                />
              </p>
            </div>
            <div className="row">
              <p className="text-center" style={styles.font}>
                <button className="btn btn-primary m-2 border-0" style={{ backgroundColor: color, boxShadow: `0 0 10px ${shadowColor}`, textShadow: "1px 1px 3px #000000" }} onClick={handleDownload}>
                    Download Image
                </button>
              </p>
            </div>
            <div className="row">
                <p className="text-center" style={styles.font}>
                    <input id="files" type="file" name="image-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                    <label htmlFor="files" className="btn btn-primary m-2 border-0" style={{ backgroundColor: color, boxShadow: `0 0 10px ${shadowColor}`, textShadow: "1px 1px 3px #000000" }}>Upload Background</label>
                </p>
            </div>      

          </div>
        </div>

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{
          backgroundColor: "#000000",
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
