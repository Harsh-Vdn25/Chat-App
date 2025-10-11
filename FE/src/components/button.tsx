
export interface ButtonType{
    type:string;
    text:string;
    onClick:()=>void;
}

export default function Button({type,text,onClick}:ButtonType){
  return (
    <button
    type='button'
    className=""
    onClick={onClick}>
        {text}
    </button>
  )
}
