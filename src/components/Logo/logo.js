import React from 'react';
import Tilt from 'react-parallax-tilt';
import { CSSProperties } from './logo.css';
import brain from './brain.png';

const Logo = () => {
    return(
        <div className='ma4 mt0'>
            <Tilt className='br2 shadow-2 tilt'>
                <div className='pa3'>
                <img alt='logo' src={brain}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;

