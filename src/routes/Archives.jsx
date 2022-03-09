import App from '../App';
import React, { useCallback, useEffect } from 'react';
import supabase from '../modules/supabase';
import Header from '../components/Header';
import { Archive, ExternalLink, Package, Wind, X } from 'react-feather';
import Store from '../../Store';
import { useSnapshot } from 'valtio';
import Entry from '../components/Entry';
import { useNavigate } from 'react-router-dom';

const Archives = () => {
    const snap = useSnapshot(Store);
    const navigate = useNavigate();

    const handleClickIcon = useCallback(async (index, archive) => {
        if(index === 0) {
            window.open(`/s/${archive.id}`, '_blank');
        } else if(index === 1) {
            Store.archives.splice(archive.index, 1);

            Promise.all([
                supabase
                    .from('archives')
                    .delete()
                    .match({ id: archive.id }),
                supabase
                    .storage
                    .from('files')
                    .remove(archive.files.map(file => `${supabase.auth.user().id}/${archive.id}/${file}`))
            ]).catch(error => {
                console.error(error);
            })
        }
    }, [snap.archives]);

    const handleClick = useCallback(id => {
        Store.url = `${import.meta.env.VITE_APP_BASE_URL}/s/${id}`;
        navigate('/');
    }, []);

    useEffect(async () => {
        const { data, error } = await supabase
            .from('archives')
            .select('*')
            .eq('user_id', supabase.auth.user().id);

        if(error) console.error(error);
        Store.archives = data;
    }, []);

    return (
        <App>
            <Header icon={<Archive size={24} />}>Archives</Header>
            {snap.archives.length > 0 ? (
                <>
                    <p>If you don't need an archive anymore, you can delete it here.</p>
                    <div className={'flex flex-col gap-2'}>
                        {
                            snap.archives.map((archive, index) => (
                                <Entry
                                    name={ `Archive ${index + 1}` }
                                    key={ archive.id }

                                    icons={ [ <Package size={ 18 }/>, <ExternalLink size={ 18 }/>, <X size={ 18 }/> ] }
                                    onClick={ () => handleClick(archive.id) }
                                    onClickIcon={ icon => handleClickIcon(icon, { ...archive, index }) }/>
                            ))
                        }
                    </div>
                </>
            ) : (
                <div className={'flex flex-col gap-6 justify-center items-center text-gray-500 mt-4'}>
                    <div className={'justify-self-center'}>
                        <Wind size={32} />
                    </div>
                    <p>There's nothing here.</p>
                </div>
            )}
        </App>
    )
};

export default Archives;