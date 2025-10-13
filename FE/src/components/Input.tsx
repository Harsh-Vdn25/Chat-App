
interface LabelledInputType {
  label: string;
  placeholder: string;
  type?: string;
  value:string;
  labelclassName?:string;
  inputclassName?:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}

export default function LabelledInput({ label, placeholder, type ,value,onChange,labelclassName,inputclassName }: LabelledInputType) {
  return (
    <div>
      <label className={`block mb-2 text-sm text-black font-semibold pt-4 ${labelclassName}`}>
        {label}
      </label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-2.5 ${inputclassName}`}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
