import App from '../App';
import Header from '../components/Header';
import Button from '../components/Button';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const Invalid = () => {
    const navigate = useNavigate();

    const handleClickBack = useCallback(() => {
        navigate('/');
    }, []);

    return (
        <App>
            <Header>404 - Not Found</Header>
            <p>The requested path could not be resolved.</p>
            <Button icon={<ArrowLeft size={18} />} onClick={() => handleClickBack()}>Back</Button>
        </App>
    )
};

export default Invalid;