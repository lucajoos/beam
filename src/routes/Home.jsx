import Upload from '../components/Upload';
import Share from '../components/Share';
import { useSnapshot } from 'valtio';
import Store from '../../Store';
import App from '../App';
import { v4 as uuid } from 'uuid';
import supabase from '../modules/supabase';
import { useEffect } from 'react';

const Home = () => {
    const snap = useSnapshot(Store);

    useEffect(async () => {
        if(Object.values(snap.files).filter(file => file.status !== 2).length === 0 && Object.keys(snap.files).length > 0) {
            const { error } = await supabase
                .from('archives')
                .insert([ {
                    id: snap.archive,
                    files: Object.values(snap.files).map(file => file.id),
                    names: Object.values(snap.files).map(file => file.name),
                    views_max: 0,
                } ]);

            if(error) console.error(error);
            Store.url = `${ import.meta.env.VITE_APP_BASE_URL }/s/${ snap.archive }`;
        }
    }, [ snap.files, snap.archive ]);

    return (
        <App>
            {snap.url.length === 0 ? <Upload /> : <Share />}
        </App>
    );
};

export default Home;