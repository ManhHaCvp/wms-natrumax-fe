import React, { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";

const ApiConnection = ({detail}) => {
  const [apiConnection] = useState(JSON.parse(detail));
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
      <div className="text-base font-semibold m-5 space-y-3">
        <div className="flex items-center">
          <p className="w-32 text-muted-foreground">Retailer</p>
          <p className="font-medium">{apiConnection.retailer}</p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => copyToClipboard(apiConnection.retailer)}
          >
            <Copy size={16} />
          </Button>
        </div>
        <div className="flex items-center">
          <p className="w-32 text-muted-foreground">Client ID</p>
          <p className="font-medium">{apiConnection.client_id}</p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() =>
              copyToClipboard(apiConnection.client_secret)
            }
          >
            <Copy size={16} />
          </Button>
        </div>
        <div className="flex items-center">
          <p className="w-32 text-muted-foreground">Client Secret</p>
          <p className="font-medium">
            {isSecretVisible
              ? apiConnection.client_secret
              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
          >
            {isSecretVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() =>
              copyToClipboard(apiConnection.client_secret)
            }
          >
            <Copy size={16} />
          </Button>
        </div>
      </div>
  );
};

export default ApiConnection;
