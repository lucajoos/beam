import React, { useCallback, useEffect, useRef } from 'react';
import supabase from '../../../modules/supabase'
import { useSnapshot } from 'valtio';
import Store from '../../../../Store';
import Button from '../../Button';
import TextField from '../../TextField';
import { Inbox, LogIn, Mail, User } from 'react-feather';
import Header from '../../Header';

export default function Authentication() {
    const snap = useSnapshot(Store);
    const emailRef = useRef(null);

    const handleAuthentication = useCallback( () => {
        try {
            Store.authentication.isLoading = true;

            supabase.auth.signIn({
                email: Store.authentication.email
            }, {
                redirectTo: import.meta.env.VITE_APP_BASE_URL
            }).then(({error}) => {
                if (error) console.error(error);
            });
        } catch (error) {
            console.error(error);
        }
    }, [snap.authentication.email]);

    const handleChangeEmail = useCallback(event => {
        Store.authentication.email = event.target.value;
    }, []);

    const handleKeyDown = useCallback(async event => {
        if(event.keyCode === 13) {
            await handleAuthentication();
        }
    }, []);

    useEffect(() => {
        if(snap.modal.isVisible && snap.modal.content === 'Authentication') {
            emailRef.current.focus();
        }
    }, [snap.modal.isVisible, snap.modal.content]);

    return snap.authentication.isLoading ? (
        <div className={'flex flex-col gap-6 justify-center items-center'}>
            <div className={'justify-self-center'}>
                <Inbox size={32} />
            </div>
            <p>We sent a magic link to your email inbox.</p>
        </div>
    ) : (
        <div className={'flex flex-col gap-6 items-center'}>
            <Header icon={<User size={24} />}>Authentication</Header>
            <p className={'max-w-[85%] text-gray-600'}>We need your email address to send you a magic link.</p>

            <TextField
                value={snap.authentication.email}
                icon={<Mail size={18} />}
                placeholder={'Email'}
                nativeRef={emailRef}
                type={'email'}
                onChange={event => handleChangeEmail(event)}
                onKeyDown={event => handleKeyDown(event)}
            />

            <Button onClick={() => handleAuthentication()} icon={<LogIn size={18}/>}>Authenticate</Button>
        </div>
    );
}