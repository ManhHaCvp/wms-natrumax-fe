import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Ban} from "lucide-react";
import React from "react";

const DisableDialog = ({item}) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive"><Ban/>Vô hiệu hóa</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Xác nhận vô hiệu {item} này</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Bạn có chắc chắn muốn vô hiệu hóa {item} này?<br/>
                    Hành động này có thể được hoàn tác sau.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                    <AlertDialogAction>Vô hiệu hóa</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DisableDialog;