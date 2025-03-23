import { Input } from "@/components/ui/input.jsx";

const InputField = ({ label, placeholder, value, disabled, className, onChange }) => {
  return (
    <div className={className}>
      <label className="text-muted-foreground text-sm font-semibold">{label}</label>
      <Input placeholder={placeholder} value={value} disabled={disabled} className="w-full text-foreground text-sm font-semibold" onChange={onChange} />
    </div>
  );
}

export default InputField;