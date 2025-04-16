import React, { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";

const ApiConnection = ({retailer, clientId, clientSecret}) => {
  const [isSecretVisible, setIsSecretVisible] = useState(false);
  console.log(retailer, clientId, clientSecret);
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
      <div className="text-base font-semibold m-5">
        <div className="flex items-center text-muted-foreground mb-3">
          <p className="w-32">Retailer</p>
          <p className="font-medium">{retailer}</p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => copyToClipboard(retailer)}
          >
            <Copy size={16} />
          </Button>
        </div>
        <div className="flex items-center mb-3">
          <p className="w-32 text-muted-foreground">Client ID</p>
          <p className="font-medium">{clientId}</p>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() =>
              copyToClipboard(clientSecret)
            }
          >
            <Copy size={16} />
          </Button>
        </div>
        <div className="flex items-center">
          <p className="w-32 text-muted-foreground">Client Secret</p>
          <p className="font-medium">
            {isSecretVisible
              ? clientSecret
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
              copyToClipboard(clientSecret)
            }
          >
            <Copy size={16} />
          </Button>
        </div>
      </div>
  );
};

export default ApiConnection;
