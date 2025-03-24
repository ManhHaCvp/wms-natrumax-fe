import { useState } from "react";
import { Minus, Plus } from "lucide-react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const QuantityInput = ({ item, onChange }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onChange(item.id, newQuantity);
    }
  };

  const handleIncrease = () => {
    if (quantity < item.max) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onChange(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button onClick={handleDecrease} className="p-1 h-fit" disabled={quantity <= 1} variant="outline">
        <Minus />
      </Button>
      <span className="px-4 py-2 border rounded-lg">{quantity}</span>
      <Button onClick={handleIncrease} className="p-1 h-fit" disabled={quantity >= item.max} variant="outline">
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityInput;
