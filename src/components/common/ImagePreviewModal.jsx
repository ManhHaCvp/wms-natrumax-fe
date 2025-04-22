import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function ImagePreviewModal({ open, onOpenChange, imageUrl }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
        />
      </DialogContent>
    </Dialog>
  );
}
