import React, { useState } from 'react';
import BodyContainer from './BodyContainer';

export default function TitleScreen({ color, alternateColor, shadowColor, highlightColor}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const enterLightbox = () => {
    setLightboxOpen(true);
    const titleFontElement = document.querySelector('.titleFont');
    titleFontElement.className = 'invisible';

    
  };

  const styles = {
    background: {
      backgroundColor: alternateColor,
      boxShadow: `5px 5px 10px ${shadowColor}`,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1,
    },
    titleFont: {
      fontFamily: 'Rampart One',
      fontSize: '1000%',
      color: `${color}`,
      backgroundColor: highlightColor,
      textShadow: `5px 5px 10px ${shadowColor}`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '100px',
      border: `10px solid ${color}`,
      boxShadow: `5px 5px 100px ${shadowColor}`,
    },
    buttonFont: {
      fontFamily: 'Rampart One',
      fontSize: '100%',
      color: `${color}`,
      textShadow: `5px 5px 10px ${shadowColor}`,
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    button: {
      backgroundColor: highlightColor,
      color: color,
      textShadow: `5px 5px 10px ${shadowColor}`,
      fontFamily: 'Azeret Mono',
      boxShadow: `5px 5px 10px ${shadowColor}`,
      position: 'absolute',
      top: '75%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  return (
    <div className="container-fluid p-0" style={styles.background}>
      <h1 className='titleFont p-5 text-center' style={styles.titleFont}>LightBox</h1>
      {!lightboxOpen && (
        <button className='btn btn-lg' style={styles.button} onClick={enterLightbox}>
          Enter the lightbox...
        </button>
      )}
      {lightboxOpen && (
        <div>
          <BodyContainer color={color} alternateColor={alternateColor} shadowColor={shadowColor} highlightColor={highlightColor}/>
        </div>
      )}
    </div>
  );
}