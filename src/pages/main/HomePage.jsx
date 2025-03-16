import React, {useState} from "react";
import {Button} from "@/components/ui/button"
import toast from 'react-hot-toast';

const HomePage = () => {

    const [token, setToken_] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(localStorage.getItem("user"));

    return (
        <div className="flex justify-between items-center p-2">
            This is a home page.
            {user}

            <Button onClick={() => toast.success('Here is your toast.')} className="text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2">Make me a toast</Button>
        </div>
    );
};

export default HomePage;
