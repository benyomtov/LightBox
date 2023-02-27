import React from 'react';
import './App.css';
import Header from './components/Header'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import BodyContainer from './components/BodyContainer';

function App() {

  const [color, setColor] = useState('#000000');
    const [alternateColor, setAlternateColor] = useState('#FFFFFF');
    const [shadowColor, setShadowColor] = useState('#000000');
    const [highlightColor, setHighlightColor] = useState('#FFFFFF');

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
      {/* <Header color={color} alternateColor={alternateColor} shadowColor={shadowColor}/> */}
      <BodyContainer color={color} alternateColor={alternateColor} shadowColor={shadowColor} highlightColor={highlightColor}/>
      {/* <Footer color={color} alternateColor={alternateColor} shadowColor={shadowColor}/> */}
    </div>
  );
}

export default App;
