import React from 'react';
import icon from '../assets/logo.png'

const Logo = () => {
    return (
        <div className='flex gap-3 items-center justify-center mb-8'>
            <img src={icon} className='w-10 h-12' alt="icon" />
            <p className='font-semibold text-2xl'>BrainBox</p>
        </div>
    );
};

export default Logo;