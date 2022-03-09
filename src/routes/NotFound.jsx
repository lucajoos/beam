import App from '../App';
import Header from '../components/Header';
import Button from '../components/Button';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const NotFound = () => {
    const navigate = useNavigate();

    const handleClickBack = useCallback(() => {
        navigate('/');
    }, []);

    return (
        <App isRequiringAuthentication={false}>
            <Header>404 - Not Found</Header>
            <p className={'text-gray-600'}>The requested path could not be resolved.</p>
            <Button icon={<ArrowLeft size={18} />} onClick={() => handleClickBack()}>Back</Button>
        </App>
    )
};

export default NotFound;