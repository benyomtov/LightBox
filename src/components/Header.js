import React from 'react';
import { useState, useEffect } from 'react';

export default function Header() {

    const [color, setColor] = useState('#000000');
    const [alternateColor, setAlternateColor] = useState('#FFFFFF');
    const [shadowColor, setShadowColor] = useState('#000000');

    useEffect(() => {
    const onMouseMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setColor(`rgb(${(x/2) * 255}, ${1 * 255}, ${((x + y)/2) * 255})`);
      setShadowColor(`rgb(${x * 255}, ${y * 255}, ${1 * 255})`);
      setAlternateColor(`rgb(${1 * 255}, ${(x/2) * 255}, ${((x + y)/2) * 255})`);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
    }, []);

    const styles = {
        background: {
            backgroundColor: alternateColor,
            borderBottom: `10px solid ${color}`,
            boxShadow: `5px 5px 10px ${shadowColor}`,
        },
        titleFont: {
            fontFamily: 'Rampart One',
            fontSize: '1000%',
            color: `${color}`,
            textShadow: `5px 5px 10px ${shadowColor}`,

        },
    };

  return (
    <header className="" style={styles.background}>
      <h1 className='p-3 text-center' style={styles.titleFont}>Ben Yomtov</h1>
    </header>
  );
}