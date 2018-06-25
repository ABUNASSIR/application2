import React from 'react';
import Tilt from 'react-tilt';
import './logo.css';
import brain from './brain.png'
const Logo = () => {
    return (

        <div className='ma4 mt0'>
        	<Tilt className="Tilt" options={{ max : 180 }} style={{ height: 150, width: 150 }} >
			 	<div className="Tilt-inner pa3 Tilt"><img src={brain} alt="logo" /></div>
			</Tilt>
        </div>

    );

}
export default Logo;