const Label = ({ children, isActive=false, onClick=()=>{} }) => {
   return (
       <span className={`w-6 h-6 transition-colors text-sm rounded-full cursor-pointer items-center flex justify-center ${isActive ? 'font-bold bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-400'}`} onClick={() => onClick()}>
           {children}
       </span>
   )
};

export default Label;