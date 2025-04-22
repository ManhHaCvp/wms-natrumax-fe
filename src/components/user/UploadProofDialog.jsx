import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadProofDialog({ open, onOpenChange, onUpload }) {
  const [file, setFile] = useState(null);

  const handleUploadClick = () => {
    if (file) onUpload(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload bằng chứng thanh toán</DialogTitle>
        </DialogHeader>
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button className="ml-2" onClick={handleUploadClick}>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
