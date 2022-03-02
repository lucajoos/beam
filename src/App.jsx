import React, { useCallback, useEffect } from 'react';
import supabase from './modules/supabase';
import Store from '../Store';
import { useSnapshot } from 'valtio';
import Modal from '../src/components/Modal';
import Header from '../src/components/Header';
import { LogOut, Rss } from 'react-feather';
import './index.css';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';

const App = ({ children }) => {
    const snap = useSnapshot(Store);
    const navigate = useNavigate();

    const handleSignOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const handleClickHome = useCallback(async () => {
        Store.files = {};
        Store.url = '';
        Store.isUploading = false;
        navigate('/');
    }, []);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            Store.session = session;
        });
    }, []);

    return (
        <div className={ 'w-full h-full relative select-none overflow-hidden text-center' }>
            <Modal/>

            <div className={ 'absolute top-6 left-6' }>
                <Header icon={ <Rss size={ 24 }/> } onClick={() => handleClickHome()} className={'cursor-pointer'}>Beam</Header>
            </div>

            {snap.session && (
                <div className={ 'absolute p-6 top-0 right-0 cursor-pointer' } onClick={ () => handleSignOut() }>
                    <LogOut size={ 24 }/>
                </div>
            )}

            <div className={ 'flex items-center justify-center h-screen w-screen' }>
                <div className={ 'flex flex-col gap-8 justify-center items-center' }>
                    { children }
                </div>
            </div>
        </div>
    );
};

export default App;