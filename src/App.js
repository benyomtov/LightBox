import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import TitleScreen from './components/TitleScreen';

function App() {

  const [color, setColor] = useState('#7fff87');
    const [alternateColor, setAlternateColor] = useState('#FF6775');
    const [shadowColor, setShadowColor] = useState('#fd11ff');
    const [highlightColor, setHighlightColor] = useState('#ff09ff');

    useEffect(() => {
    const onMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setColor(`rgb(${(x/2) * 255}, ${1 * 255}, ${((x + y)/2) * 255})`);
      setShadowColor(`rgb(${x * 255}, ${y * 255}, ${1 * 255})`);
      setAlternateColor(`rgb(${1 * 255}, ${(x/2) * 255}, ${((x + y)/2) * 255})`);
      setHighlightColor(`rgb(${(x/y) * 255}, ${(y/2) * 255}, ${(2 * x) * 255})`);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
    }, []);

  return (
    <div className="container-fluid p-0">
      <TitleScreen color={color} alternateColor={alternateColor} shadowColor={shadowColor} highlightColor={highlightColor}/>
    </div>
  );
}

export default App;
