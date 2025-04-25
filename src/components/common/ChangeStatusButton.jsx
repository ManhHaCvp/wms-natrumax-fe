import { Button } from "@/components/ui/button";
import { Check, Ban } from "lucide-react";

const ChangeStatusButton = ({ user, handleChangeStatus }) => {
    if (!user) return null;

    const isActive = user.status;

    return (
        <Button
            variant={isActive ? "destructive" : "default"}
            className="ms-3"
            onClick={handleChangeStatus}
        >
            {isActive ? (
                <>
                    <Ban/>Vô hiệu hóa
                </>
            ) : (
                <>
                    <Check/>Kích hoạt
                </>
            )}
        </Button>
    );
};

export default ChangeStatusButton;