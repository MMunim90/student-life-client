import React from 'react';
import icon from '../assets/logo.png'

const Logo = () => {
    return (
        <div className='flex gap-3 items-center justify-center mb-8'>
            <img src={icon} className='w-12 h-14' alt="icon" />
            <p className='font-semibold text-3xl'>BrainBox</p>
        </div>
    );
};

export default Logo;