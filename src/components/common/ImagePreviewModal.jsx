import React from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog";

export default function ImagePreviewModal({open, onOpenChange, imageUrl}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <img
                    src={imageUrl}
                    alt="Proof"
                />
            </DialogContent>
        </Dialog>
    );
}
