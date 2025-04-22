import React, { useState } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const HomePage = () => {

  const [token, setToken_] = useState(localStorage.getItem("token"));

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const detail = user?.detail ? JSON.parse(user.detail) : null;

  return (
    <div className="w-full overflow-clip space-y-3 p-5">
      <div className="flex justify-between items-center w-full overflow-clip">
        <p>This is a home page.</p>
        <Button onClick={() => toast.success("Here is your toast.")}
                className="text-primary-foreground bg-[#182F73] hover:bg-[#12245C] ms-3">
          Make me a toast
        </Button>
      </div>
      <div className="flex justify-between items-center w-full overflow-clip">
        <p className="overflow-auto">Token: {token}</p>
        <Button variant="outline" onClick={() => navigator.clipboard.writeText(token)}><Copy /></Button>
      </div>
      <p>User: {JSON.stringify(user, null, 2)}</p>
      <p>Warehouse: {user.id}</p>
    </div>
  );
};

export default HomePage;
