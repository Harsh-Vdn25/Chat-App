
export interface ButtonType{
    type:string;
    text:string;
    onClick:()=>void;
    className:string;
}

export default function Button({type,text,onClick,className}:ButtonType){
  return (
    <button
    type='button'
    className={`${className} m-2 p-2 transition ease-in-out duration-200 cursor-pointer`}
    onClick={onClick}>
        {text}
    </button>
  )
}
