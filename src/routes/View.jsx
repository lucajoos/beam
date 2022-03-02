import App from '../App';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import Store from '../../Store';
import { useSnapshot } from 'valtio';
import { Download, Loader, Package } from 'react-feather';
import supabase from '../modules/supabase';
import Entry from '../components/Entry';
import Header from '../components/Header';
import Button from '../components/Button';
import JSZip from 'jszip';
import helpers from '../modules/helpers';

const View = () => {
    const snap = useSnapshot(Store);
    const params = useParams();

    const handleDownload = useCallback(async file => {
        const { signedURL, error } = await supabase
            .storage
            .from('files')
            .createSignedUrl(`${file.user}/${file.archive}/${file.id}`, 60);

        if(error) console.error(error);
        const blob = await helpers.URLToBlob(signedURL);
        helpers.download(URL.createObjectURL(blob), file.name);
    }, []);

    const handleDownloadAll = useCallback(async () => {
        const { data, error } = await supabase
            .storage
            .from('files')
            .createSignedUrls(Object.values(snap.files).map(file => `${file.user}/${file.archive}/${file.id}`), 60);

        if(error) console.error(error);
        const zip = new JSZip();

        Promise.all(data.map(({ signedURL }) => helpers.URLToBlob(signedURL))).then(results => {
            results.forEach((blob, index) => {
                zip.file(Object.values(snap.files)[index].name, blob);
            });

            zip.generateAsync({type: 'blob'})
                .then(blob => {
                    helpers.download(URL.createObjectURL(blob), `${Object.values(snap.files)[0]?.archive || 'archive'}.zip`);
                });
        });
    }, [snap.files, snap.archive]);

    useEffect(async () => {
        Store.isLoading = true;

        if(params.id ? params.id.length > 0 : false) {
            const { data, error } = await supabase
                .from('archives')
                .select('*')
                .eq('id', params.id)
                .single()

            if(error) console.error(error);

            let files = {};

            data.files.forEach((id, index) => {
                files[id] = {
                    id,
                    name: data.names[index],
                    archive: data.id,
                    user: data.user_id
                };
            });

            Store.files = files;
            Store.isLoading = false;
        }
    }, []);

    return (
        <App>
            {snap.isLoading ? (
                <>
                    <div className={'flex flex-col gap-6 justify-center items-center'}>
                        <div className={'justify-self-center animate-spin-slow'}>
                            <Loader size={32} />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <Header icon={<Package size={24} />}>View Files</Header>
                    <p>Someone shared some files with you.<br />Access them individually or download them as an archive.</p>
                    <div className={'flex flex-col gap-2'}>
                        {Object.values(snap.files).map(file => {
                            return <Entry name={file.name.length > 30 ? `${file.name.slice(0, 30)}...` : file.name} key={file.id} onClick={() => handleDownload(file)} />
                        })}
                    </div>
                    <Button onClick={() => handleDownloadAll()} icon={<Download size={18} />}>Download All</Button>
                </>
            )}
        </App>
    )
};

export default View;