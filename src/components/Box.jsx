import { Loader, X } from 'react-feather';
import React, { useCallback } from 'react';
import Store from '../../Store';
import { useSnapshot } from 'valtio';

const Box = ({ id=null, title='', icon=null, onClick=()=>{}, isFile=true, className='' }) => {
    const snap = useSnapshot(Store);

    const handleClickRemove = useCallback(() => {
        let files = Object.assign({}, Store.files);
        delete files[id];
        Store.files = files;
    }, []);

    return (
        <div className={`box relative p-10 bg-gray-100 rounded w-[250px] h-[150px] flex flex-col items-center gap-4 justify-center${className.length > 0 ? ` ${className}` : ''}`} onClick={() => onClick()}>
            {isFile && (
                <div className={'box-close opacity-0 transition-all cursor-pointer absolute pointer-events-auto p-4 top-0 right-0'} onClick={() => handleClickRemove()}>
                    <X size={18} />
                </div>
            )}
            {icon}
            {title.length > 0 && <p className={'font-bold'}>{title}</p>}
            {snap.isUploading && isFile && (
                <div className={'flex gap-2 items-center'}>
                    <div className={'animate-spin-slow'}><Loader size={18} /></div>
                    <span>Uploading</span>
                </div>
            )}
        </div>
    )
};

export default Box;