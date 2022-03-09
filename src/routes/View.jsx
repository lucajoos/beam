import App from '../App';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import Store from '../../Store';
import { useSnapshot } from 'valtio';
import {
    ArrowLeft,
    Download,
    DownloadCloud,
    File,
    Link2,
    Loader
} from 'react-feather';
import supabase from '../modules/supabase';
import Entry from '../components/Entry';
import Header from '../components/Header';
import Button from '../components/Button';
import JSZip from 'jszip';
import helpers from '../modules/helpers';
const View = () => {
    const snap = useSnapshot(Store);
    const navigate = useNavigate();
    const params = useParams();

    const handleClickBack = useCallback(() => {
        navigate('/');
    }, []);

    const handleDownload = useCallback(async file => {
        Store.fetching[file.id] = true;

        const { signedURL, error } = await supabase
            .storage
            .from('files')
            .createSignedUrl(`${file.user}/${file.archive}/${file.id}`, 60);

        if(error) console.error(error);

        const blob = new Blob([await helpers.URLToBlob(signedURL)], {
            type: file.type
        });

        Store.fetching[file.id] = false;

        await helpers.download(URL.createObjectURL(blob), file.name);
    }, []);

    const handleCompress = useCallback(async () => {
        Store.isCompressing = true;

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
                    Store.isCompressing = false;
                    helpers.download(URL.createObjectURL(blob), 'beam-archive.zip');
                });
        });
    }, [snap.files, snap.archive]);

    useEffect(async () => {
        Store.isLoading = true;

        if(params.id ? params.id.length > 0 : false) {
            let { data, error } = await supabase
                .rpc('get_archive', { id: params.id });

            if (error) {
                console.error(error);
                Store.isError = true;
            }

            Store.fetching = {};
            let files = {};

            data.files.forEach((id, index) => {
                files[id] = {
                    id,
                    name: data.names[index],
                    type: data.types[index],
                    archive: data.id,
                    user: data.user_id,
                    isFetching: false
                };

                Store.fetching[id] = false;
            });

            Store.files = files;
            Store.isLoading = false;
        }
    }, []);

    return (
        <App isRequiringAuthentication={false}>
            {snap.isError ? (
                <div className={'flex flex-col gap-6 justify-center items-center text-gray-600 mt-4'}>
                    <div className={'justify-self-center'}>
                        <Link2 size={32} />
                    </div>
                    <p className={'max-w-[400px]'}>Unfortunately, we could not find your requested archive. It may have been deleted automatically.</p>
                    <Button icon={<ArrowLeft size={18} />} onClick={() => handleClickBack()}>Back</Button>
                </div>
            )  : (
                snap.isLoading ? (
                    <>
                        <div className={'flex flex-col gap-6 justify-center items-center'}>
                            <div className={'justify-self-center animate-spin-slow'}>
                                <Loader size={32} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <Header icon={<DownloadCloud size={24} />}>View Archive</Header>
                        <p className={'max-w-[400px] text-gray-600'}>These files were found in the archive. You can download them either separately or together.</p>
                        <div className={'flex flex-col gap-2'}>
                            {Object.values(snap.files).map(file => {
                                return <Entry
                                    name={file.name.length > 30 ? `${file.name.slice(0, 30)}...` : file.name}
                                    key={file.id}
                                    onClick={() => handleDownload(file)}
                                    isEnabled={!snap.fetching[file.id]}
                                    icons={[<File size={18} />, <Download size={18} />]}
                                />
                            })}
                        </div>
                        <Button onClick={() => handleCompress()} icon={<Download size={18} />} isEnabled={!snap.isCompressing}>Compress</Button>
                    </>
                )
            )}
        </App>
    )
};

export default View;