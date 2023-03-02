import React, { useRef, useState, useEffect } from "react";
import { FiHome } from "react-icons/fi";
import TitleScreen from "./TitleScreen";
import Draggable, { DraggableCore } from "react-draggable";

function DrawOnDiv({ color, alternateColor, shadowColor, highlightColor, lightboxOpen, exitLightbox }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [lineColor, setLineColor] = useState("#FF71FF");
  const [glowColor, setGlowColor] = useState("#000000");
  const [lineThickness, setLineThickness] = useState(50);
  const [glowBlur, setGlowBlur] = useState(15);
  const [paused, setPaused] = useState(false);
  const [drawMode, setDrawMode] = useState(false);
  const [brushShape, setBrushShape] = useState("round");
  const [isClosed, setIsClosed] = useState(false);
  const [closeButton, setCloseButton] = useState("Close");
  const [isDisabled, setIsDisabled] = useState(false);
  const [mobileMode, setMobileMode] = useState(false);

  const handleRangeClick = (e) => {
    e.stopPropagation();
    setIsDisabled(true);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    setIsDisabled(false);
  };

  const goBack = () => {
    exitLightbox();
  }

    const handleClose = (event) => {
        event.stopPropagation();
        setIsClosed(!isClosed);
        setCloseButton(!isClosed ? "Open" : "Close");
        //const toolbarDivElement = document.querySelector('.toolbarDiv');
        //toolbarDivElement.className = !isClosed ? 'toolbarDiv fixed-top col-6 col-xl-2 col-xxl-2 col-lg-3 col-md-4 col-sm-5 col-7 h-100 shadow-lg invisible invisible' : 'toolbarDiv fixed-top col-6 col-xl-2 col-xxl-2 col-lg-3 col-md-4 col-sm-5 col-7 h-100 shadow-lg visible visible';
        //toolbarDivElement.style.display = !isClosed ? 'block !important' : 'none !important';
        //const closeBtn = document.querySelector('.closeBtn');
        //closeBtn.className =!isClosed ? 'closeBtn m-3 btn btn-primary visible' : 'closeBtn text-center pb-2 visible';
        //closeBtn.style.visibility = !isClosed ? 'visible !important' : 'visible !important';
      }

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
    if (isClosed) {
        const toolbar = document.querySelector('.toolbar');
        toolbar.className = 'toolbar flex-grow-1 invisible  m-3 row shadow-lg';
        const toolbarDivElement = document.querySelector('.toolbarDiv');
        toolbarDivElement.className = 'toolbarDiv d-flex flex-column invisible';
        const closeBtn = document.querySelector('.closeBtn');
        closeBtn.className = "closeBtn m-3 btn btn-primary visible";
        const toolResize = document.querySelector('.toolResize');
        toolResize.style.height = '230px';
        const toolBorder = document.getElementById('toolsTab');
        toolBorder.style.border= `5px solid ${color}`;
    } else {
        const toolbar = document.querySelector('.toolbar');
        toolbar.className = 'toolbar flex-grow-1 visible m-3 row shadow-lg';
        const toolbarDivElement = document.querySelector('.toolbarDiv');
        toolbarDivElement.className = 'toolbarDiv d-flex flex-column visible';
        const closeBtn = document.querySelector('.closeBtn');
        closeBtn.className = "closeBtn text-center pb-2 visible";
        const toolResize = document.querySelector('.toolResize');
        toolResize.style.height = '90%';
        const toolBorder = document.getElementById('toolsTab');
        toolBorder.style.border= 'none';
        toolBorder.style.borderBottom=`5px solid ${color}`;
    }
    }, [isClosed]);

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
        (e.type === "mousemove") && (!mobileMode)
      ) {
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(e.offsetX, e.offsetY);
        context.stroke();
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      } else if (
        (e.type === "touchmove") && (mobileMode)
      ) {
        var touches = e.changedTouches;
        for (var i = 0; i < touches.length; i++) {
          var touch = touches[i];
          context.beginPath();
          context.moveTo(lastX, lastY);
          context.lineTo(touch.clientX, touch.clientY);
          context.stroke();
          setLastX(touch.clientX);
          setLastY(touch.clientY);
        }
      }  
    }

    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mousemove", handleMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseout", handleMouseOut);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleMove);

    function handleMouseEnter(e) {
      if (!drawMode) {
        setIsDrawing(true);
        setLastX(e.offsetX);
        setLastY(e.offsetY);
      } else return;
    }

    function handleMove(e) {
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

    function handleTouchStart(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      for (var i = 0; i < touches.length; i++) {
        var touch = touches[i];
        if (drawMode) {
          setIsDrawing(true);
          setLastX(touch.clientX);
          setLastY(touch.clientY);
        } else return;
      }
    }

    function handleTouchEnd() {
      if (mobileMode) setIsDrawing(false);
    }

    return () => {
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mousemove", handleMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseout", handleMouseOut);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleMove);
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

  const styles = {
    font: {
        paddingTop: "10px",
      fontFamily: "Azeret Mono, monospace",
      fontSize: "16px",
      color: `${color}`,
      textShadow: `5px 5px 10px ${shadowColor}`,
      border: `3px solid ${color}`,
      boxShadow: `5px 5px 10px ${shadowColor}`,
      backgroundColor: highlightColor,
      borderRadius: "10px",
    },
    fontAlt: {
        paddingTop: "10px",
      fontFamily: "Azeret Mono, monospace",
      fontSize: "16px",
      color: `${color}`,
      textShadow: `5px 5px 10px ${shadowColor}`,
      border: `3px solid ${color}`,
      boxShadow: `5px 5px 10px ${shadowColor}`,
      backgroundColor: alternateColor,
      borderRadius: "10px",
    },
    background: {
      backgroundColor: alternateColor,
      height: "100%",
      borderRadius: "15px",
    },

    colorPicker: {
      border: `3px solid ${color}`,
      //   width: "10vw",
      height: "60px",

      borderRadius: "10px",
    },
  };
  return (
    <div className="lightbox">
      <h1 onClick={goBack} style={{position: "absolute", right: "5%", top: "5%", color: color, fontSize: "84px" }}><FiHome /></h1>
      <Draggable handle=".handle" disabled={isDisabled}>
        <div style= {{ height: "90%", borderRadius: "15px", backgroundColor: alternateColor }} className="toolResize fixed-top col-6 col-xl-2 col-xxl-2 col-lg-3 col-md-4 col-sm-5 col-7 shadow-lg">
          <div className="toolbarDiv d-flex flex-column" style={styles.background}>
              <h1 id="toolsTab" className="closeBtn text-center pb-2" style={{fontFamily: "Rampart One", color: color, textShadow: `5px 5px 10px ${shadowColor}`, fontSize: "56px", borderBottom: `5px solid ${color}`, boxShadow: `0 0 10px ${shadowColor}`, backgroundColor: highlightColor, borderTopLeftRadius: "10px", borderTopRightRadius: "10px", }}>
                Tools:
              <button style={styles.fontAlt} className="closeBtn col-5 m-2 btn btn-primary" onClick={handleClose}>
                  {closeButton}
                  </button>
                  <button className="handle btn btn-primary" style={ styles.fontAlt }>Drag
                  </button>
                  </h1>
            <div className="toolbar m-2 row shadow-lg flex-grow-1" style={{ overflowY: "scroll" }}>
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
                    className="range m-2 w-75"
                    onChange={(e) => setLineThickness(e.target.value)}
                    onMouseDown={handleRangeClick}
                    onMouseUp={handleMouseUp}
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
                    className="range m-2 w-75"
                    onChange={(e) => setGlowBlur(e.target.value)}
                    onMouseDown={handleRangeClick}
                    onMouseUp={handleMouseUp}
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
                  Mobile Mode:{" "}
                  <input
                    id="mobile-mode"
                    type="checkbox"
                    style={styles.colorPicker}
                    className="m-2 w-75"
                    onChange={(e) => {
                      setMobileMode(e.target.checked);
                      console.log(e.target.checked);
                    }}
                  />
                </p>
              </div>
              <div className="row">
                <p className="text-center" style={styles.font}>
                  <button className="btn btn-primary container-fluid my-3 border-0" style={{ backgroundColor: color, boxShadow: `0 0 10px ${shadowColor}`, textShadow: "1px 1px 3px #000000" }} onClick={handleDownload}>
                      Download Image
                  </button>
                </p>
              </div>
              <div className="row">
                  <p className="text-center" style={styles.font}>
                      <input id="files" type="file" name="image-upload" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                      <label htmlFor="files" className="btn btn-primary container-fluid my-3 border-0" style={{ backgroundColor: color, boxShadow: `0 0 10px ${shadowColor}`, textShadow: "1px 1px 3px #000000" }}>Upload Background</label>
                  </p>
              </div>      
            </div>
          </div>
        </div>  
      </Draggable>
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
