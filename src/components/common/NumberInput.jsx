import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const NumberInput = ({ value, min, max, onChange }) => {
    const [numberInput, setNumberInput] = useState(value);

    useEffect(() => {
        setNumberInput(value);
    }, [value]);

    const handleDecrease = () => {
        if (numberInput > min) {
            const newValue = numberInput - 1;
            setNumberInput(newValue);
            onChange?.(newValue);
        }
    };

    const handleIncrease = () => {
        if (numberInput < max) {
            const newValue = numberInput + 1;
            setNumberInput(newValue);
            onChange?.(newValue);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <Button onClick={handleDecrease} className="p-1 h-fit" disabled={numberInput <= min} variant="outline">
                <Minus />
            </Button>
            <span className="bg-white px-4 py-2 border rounded-lg">{numberInput}</span>
            <Button onClick={handleIncrease} className="p-1 h-fit" disabled={numberInput >= max} variant="outline">
                <Plus />
            </Button>
        </div>
    );
};

export default NumberInput;