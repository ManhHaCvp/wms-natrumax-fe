import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";

const InputField = ({ label, placeholder, value, disabled, className, onChange }) => {
  return (
    <div className={className}>
      <Label className="text-muted-foreground">{label}</Label>
      <Input placeholder={placeholder} value={value} disabled={disabled} className="w-full text-foreground font-semibold" onChange={onChange} />
    </div>
  );
}

export default InputField;