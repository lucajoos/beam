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

    const handleAuthentication = useCallback(async () => {
        try {
            Store.authentication.isLoading = true;

            const { error } = await supabase.auth.signIn({
                email: snap.authentication.email
            });

            if (error) console.error(error);
        } catch (error) {
            console.error(error);
        }
    }, [snap.authentication.email]);

    const handleChangeEmail = useCallback(event => {
        Store.authentication.email = event.target.value;
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
            <p>We've sent a magic link to your inbox.</p>
        </div>
    ) : (
        <div className={'flex flex-col gap-6'}>
            <Header icon={<User size={24} />}>Authentication</Header>
            <p>Please enter your email in order to authenticate via a magic link.</p>

            <TextField
                value={snap.authentication.email}
                icon={<Mail size={18} />}
                placeholder={'Email'}
                nativeRef={emailRef}
                onChange={event => handleChangeEmail(event)}
            />

            <Button onClick={() => handleAuthentication()} icon={<LogIn size={18}/>}>Authenticate</Button>
        </div>
    );
}