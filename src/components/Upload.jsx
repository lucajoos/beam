import Header from './Header';
import { Archive, File, Plus, Share } from 'react-feather';
import Box from './Box';
import Button from './Button';
import { useSnapshot } from 'valtio';
import Store from '../../Store';
import { v4 as uuid } from 'uuid';
import supabase from '../modules/supabase';
import React, { useCallback, useRef } from 'react';

const Upload = () => {
    const snap = useSnapshot(Store);
    const fileRef = useRef(null);

    const handleOnUpload = useCallback(async event => {
        for(let file of event.target.files) {
            const id = uuid();

            Store.files[id] = {
                id,
                name: file.name,
                status: 0,
                data: await file.arrayBuffer()
            };
        }
    }, []);

    const handleOnConfirm = useCallback(async () => {
        const archive = uuid();

        Store.isUploading = true;
        Store.archive = archive;

        for(let file of Object.values(snap.files)) {
            Store.files[file.id].status = 1;

            supabase
                .storage
                .from('files')
                .upload(`${ supabase.auth.user().id }/${archive}/${file.id}`, file.data, {
                    cacheControl: '3600',
                    upsert: false
                })
                .catch(error => {
                    console.log(error);
                })
                .then(() => {
                    Store.files[file.id].status = 2;
                });
        }
    }, [ snap.files ]);

    return (
        <>
            <Header icon={ <Archive size={ 24 }/> }>Select Files</Header>

            <p>We'll create a link to your files so you can share them temporarily.</p>

            <input type={ 'file' } ref={ fileRef } onChange={ event => handleOnUpload(event) } multiple={ true }
                   className={ 'hidden' }/>

            <div className={ 'flex flex-wrap gap-2 items-center justify-center max-w-[calc(750px+1rem)] max-h-[calc(300px+4rem)] overflow-y-scroll' }>
                {
                    Object.values(snap.files).map((file, index) => {
                        return (
                            <Box title={ file.name.length > 16 ? `${ file.name.slice(0, 16) }...` : file.name }
                                 className={ 'cursor-default' } id={ file.id } key={ index }
                                 icon={<File size={24} />}
                                 status={ file.status }/>
                        );
                    })
                }
                <Box icon={ <Plus size={ 32 }/> } isFile={ false } className={ 'cursor-pointer' }
                     onClick={ () => fileRef.current.click() }/>
            </div>

            <Button
                onClick={ () => handleOnConfirm() }
                icon={ <Share size={ 18 }/> }
                isEnabled={!snap.isUploading && Object.keys(snap.files).length > 0}>
                Share
            </Button>
        </>
    );
};

export default Upload;