import {Menu, Bell, Settings} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import React from "react";
import {useAuth} from "@/provider/authProvider.jsx";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.jsx";

const Navbar = () => {
    const {setToken} = useAuth();
    const navigate = useNavigate();

    // Logout function
    const handleLogout = () => {
        setToken();
        toast.success("Đăng xuất thành công!");
        window.location.href = "/login";
    };

    return (
        <nav className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-sm border-b h-16">
            {/* Left Section */}
            <div>
                <SidebarProvider>
                    <SidebarTrigger />
                </SidebarProvider>
                <Menu className="w-5 h-5 cursor-pointer text-gray-600"/>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
                <Bell className="w-5 h-5 text-gray-600 cursor-pointer"/>
                <Settings className="w-5 h-5 text-gray-600 cursor-pointer"/>
                <span className="text-gray-500 text-sm font-medium">VN</span>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </nav>
    );
};

export default Navbar;
