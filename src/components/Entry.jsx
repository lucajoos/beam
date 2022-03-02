import { Download, File } from 'react-feather';

const Entry = ({ name, onClick=()=>{} }) => {
    return (
        <div className={'flex justify-between gap-8 items-center bg-gray-200 rounded cursor-pointer'} onClick={() => onClick()}>
            <div className={'flex gap-2 items-center m-4'}>
                <File size={18} />
                <span>{name}</span>
            </div>
            <div className={'p-4'}>
                <Download size={18} />
            </div>
        </div>
    )
};

export default Entry;