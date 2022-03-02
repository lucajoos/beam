import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../Store';
import TextField from './TextField';
import { Share as ShareIcon, Link2, Clipboard, ArrowLeft } from 'react-feather';
import QRCode from 'react-qr-code';
import Header from './Header';
import Button from './Button';

const Share = () => {
    const snap = useSnapshot(Store);
    const urlRef = useRef(null);

    const handleClickCopy = useCallback(async () => {
        urlRef.current.focus();
        urlRef.current.select();
        await navigator.clipboard.writeText(urlRef.current.value);
    }, []);

    const handleClickDelete = useCallback(() => {
        Store.files = {};
        Store.url = '';
        Store.isUploading = false;
    }, []);

    useEffect(() => {
        if(snap.url.length < 0) {
            urlRef.current.focus();
        }
    }, [snap.url]);

    return (
        <>
            <Header icon={<ShareIcon size={24}/>}>Share Archive</Header>
            <div className={'rounded overflow-hidden'}>
                <QRCode value={snap.url} />
            </div>
            <TextField icon={<Link2 size={18} />} value={snap.url} nativeRef={urlRef}/>
            <div className={'flex gap-2'}>
                <Button icon={<ArrowLeft size={18}/>} onClick={() => handleClickDelete()} isPrimary={false}>Back</Button>
                <Button icon={<Clipboard size={18}/>} onClick={() => handleClickCopy()}>Copy</Button>
            </div>
        </>
    );
};

export default Share;