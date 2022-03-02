const Button = ({ onClick=()=>{}, icon=null, isPrimary=true, isEnabled=true, children }) => {
    return (
        <div
            className={`px-10 py-3 flex gap-2 items-center rounded text-center cursor-pointer self-center transition-colors${isPrimary ? ` text-white ${isEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-300 cursor-not-allowed'}` : ' bg-gray-200 hover:bg-gray-300'}`}
            onClick={event => isEnabled ? onClick(event) : () => {}}
        >
            <span>{children}</span>
            {icon}
        </div>
    );
};

export default Button;