import React from 'react';
import { useSnapshot } from 'valtio';
import Store from '../../../Store';
import Content from './Content';

const Modal = () => {
    const snap = useSnapshot(Store);
    const ModalContent = Content[snap.modal.content];

    return (
        <div className={`fixed top-0 right-0 left-0 bottom-0 z-10 grid transition-all ${snap.modal.isVisible ? 'opacity-100 pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
            <div className={`transition-all absolute top-0 right-0 left-0 bottom-0 bg-black opacity-30`} />

            <div className={`absolute z-20 rounded-md bg-white justify-self-center self-center p-10 inline-block w-[420px] max-w-screen`}>
                <div className={'flex flex-col'}>
                    {
                        snap.modal.content.length > 0 ? <ModalContent /> : null
                    }
                </div>
            </div>
        </div>
    )
};

export default Modal;