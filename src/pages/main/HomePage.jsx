import React from "react";
import {Button} from "@/components/ui/button"
import toast, { Toaster } from 'react-hot-toast';
import {useAuth} from "@/provider/authProvider.jsx";
import {replace, useNavigate} from "react-router-dom";

const HomePage = () => {

    return (
        <div className="flex justify-between items-center p-2">
            This is a home page.

            <Button onClick={() => toast.success('Here is your toast.')}>Make me a toast</Button>
        </div>
    );
};

export default HomePage;
