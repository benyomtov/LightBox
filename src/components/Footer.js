import React from 'react';
import { useState, useEffect } from 'react';

export default function Footer({ color, alternateColor, shadowColor}) {
    const styles = {
        background: {
            backgroundColor: alternateColor,
            borderTop: `10px solid ${color}`,
            boxShadow: `-5px -5px 10px ${shadowColor}`,
            position: 'fixed',
            bottom: 0,
            
        }, 
    };
    
    return (
        <footer className="footer w-100" style={styles.background}>
            <div className="container">
                <h1>footer</h1>
            </div>
        </footer>
    );
}