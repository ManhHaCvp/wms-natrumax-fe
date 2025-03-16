import {User, Bell, Settings, AlignLeft, CreditCard} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import React from "react";
import {useAuth} from "@/providers/authProvider.jsx";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Avatar} from "@/components/ui/avatar.jsx";
import {AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";

const Navbar = () => {
    const {setAuthData} = useAuth();

    // Logout function
    const handleLogout = () => {
        setAuthData();
        toast.success("Đăng xuất thành công!");
        window.location.href = "/login";
    };

    return (
        <nav className="flex items-center justify-between h-[60px] px-[20px] bg-[#f8fafc] shadow-sm border-b">
            {/* Left Section */}
            <div>
                <AlignLeft size={24} className="text-sidebar-foreground cursor-pointer"/>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-[20px]">
                <Bell size={24} className="text-sidebar-foreground cursor-pointer"/>
                <Settings size={24} className="text-sidebar-foreground cursor-pointer"/>
                <Avatar className="h-[32px] w-[32px] cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png"/>
                    <AvatarFallback>VN</AvatarFallback>
                </Avatar>
                <Button onClick={handleLogout} className="w-full text-primary-foreground bg-[#182F73] hover:bg-[#12245C] rounded-md px-3 py-2">Logout</Button>
            </div>
        </nav>
    );
};

export default Navbar;
