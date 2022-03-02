import React from 'react';

const Header = ({icon=null, onClick=()=>{}, className='', children}) => (
    <h1
        className={`text-2xl font-bold flex gap-2 items-center${className.length > 0 ? ` ${className}` : ''}`}
        onClick={() => onClick()}
    >{icon}<span>{children}</span></h1>
);

export default Header;