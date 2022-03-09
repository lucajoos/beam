import React from 'react';

const TextField = ({ type='text', nativeRef=null, placeholder='', value='', icon=null, onChange=()=>{}, onKeyDown=()=>{}, className='' }) => {
    return (
        <div className={`w-full bg-gray-200 rounded p-1 transition-all w-full${className.length > 0 ? ` ${className}` : ''}`}>
            <label className={'flex items-center mx-2'}>
                {icon && (
                    <div className={'text-gray-600'}>
                        {icon}
                    </div>
                )}
                <input
                    onChange={event => onChange(event)}
                    onKeyDown={event => onKeyDown(event)}
                    spellCheck={false}
                    ref={nativeRef}
                    className={`${icon ? 'ml-2 ' : ''}text-black w-full py-2 placeholder-gray-600 focus:border-text-default bg-gray-200`}
                    {...{type, value, placeholder}}
                />
            </label>
        </div>
    )
};

export default TextField;