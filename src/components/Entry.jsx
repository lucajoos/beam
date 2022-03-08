const Entry = ({ name, icons=[null, null], onClick=()=>{}, onClickIcon=()=>{}, className='' }) => {
    return (
        <div className={`w-[420px] max-w-[calc(100vw-2rem)] cursor-pointer flex justify-between gap-8 items-center bg-gray-200 rounded${className.length > 0 ? ` ${className}` : ''}`} onClick={() => onClick()}>
            <div className={'flex gap-2 items-center p-4'}>
                {icons[0]}
                <span>{name}</span>
            </div>
            <div className={'flex gap-2 items-center p-4'}>
                {icons.slice(1).map((icon, index) => {
                    return <div className={'cursor-pointer'} key={index} onClick={() => onClickIcon(index)}>{ icon }</div>;
                })}
            </div>
        </div>
    )
};

export default Entry;