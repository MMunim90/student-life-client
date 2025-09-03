import React from 'react';

const Footer = () => {
    return (
        <div className="text-center text-sm md:text-md lg:text-lg text-white py-8 bg-gray-800 fixed bottom-0 w-full mx-auto z-50">
        &copy; {new Date().getFullYear()} BrainBox. All rights reserved by MMunim.
      </div>
    );
};

export default Footer;