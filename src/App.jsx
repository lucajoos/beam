import React, { useCallback, useEffect } from 'react';
import supabase from './modules/supabase';
import Store from '../Store';
import Modal from '../src/components/Modal';
import Header from '../src/components/Header';
import { Grid, LogOut, Rss, Home, Archive } from 'react-feather';
import './index.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';

const App = ({ children }) => {
    const snap = useSnapshot(Store);
    const location = useLocation();
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

    const handleAction = useCallback(async () => {
        Store.files = {};
        Store.url = '';
        Store.isUploading = false;
        navigate(location.pathname.length > 1 ? '/' : '/archives');
    }, [location]);

    useEffect(() => {
        Store.modal.isVisible = !snap.session;

        if(!snap.session) {
            Store.modal.content = 'Authentication';
        }
    }, [ snap.session ]);

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

            <div className={ 'absolute top-0 right-0 cursor-pointer flex gap-2 m-4' }>
                <div className={'p-2 bg-gray-200 rounded'} onClick={ () => handleAction() }>
                    {location.pathname.length > 1 ? <Home size={24} /> : <Archive size={ 24 }/>}
                </div>
                <div className={'p-2 bg-gray-200 rounded'} onClick={ () => handleSignOut() }>
                    <LogOut size={ 24 }/>
                </div>
            </div>

            <div className={ 'flex items-center justify-center h-screen w-screen' }>
                <div className={ 'flex flex-col gap-8 justify-center items-center max-w-[calc(100vw-2rem)]' }>
                    { children }
                </div>
            </div>
        </div>
    );
};

export default App;