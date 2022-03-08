import React, { useCallback, useEffect, useRef } from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../Store';
import TextField from './TextField';
import { Share as ShareIcon, Link2, Clipboard, Share2, Users, UploadCloud } from 'react-feather';
import QRCode from 'react-qr-code';
import Header from './Header';
import Button from './Button';
import supabase from '../modules/supabase';

const Share = () => {
    const snap = useSnapshot(Store);
    const urlRef = useRef(null);

    const handleClickCopy = useCallback(async () => {
        urlRef.current.focus();
        urlRef.current.select();
        await navigator.clipboard.writeText(urlRef.current.value);
    }, []);

    const handleClickShare = useCallback(async () => {
        await navigator.share({
            url: snap.url
        });
    }, []);

    useEffect(() => {
        if(snap.url.length < 0) {
            urlRef.current.focus();
        }
    }, [snap.url]);

    return (
        <>
            <Header icon={<UploadCloud size={24}/>}>Share Archive</Header>
            <div className={'rounded overflow-hidden'}>
                <QRCode value={snap.url} />
            </div>
            <TextField icon={<Link2 size={18} />} value={snap.url} nativeRef={urlRef}/>
            <div className={'flex gap-2'}>
                <Button icon={<Clipboard size={18}/>} onClick={() => handleClickCopy()} isPrimary={typeof navigator.share !== 'function'}>Copy</Button>
                {typeof navigator.share === 'function' && (
                    <Button icon={<ShareIcon size={18}/>} onClick={() => handleClickShare()}>Share</Button>
                )}
            </div>
        </>
    );
};

export default Share;