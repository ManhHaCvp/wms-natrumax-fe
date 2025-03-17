import {User, Bell, Settings, AlignLeft, CreditCard} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";
import React from "react";
import {useAuth} from "@/providers/authProvider.jsx";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {Avatar} from "@/components/ui/avatar.jsx";
import {AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-[32px] w-[32px] cursor-pointer">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/144993791?v=4"/>
                            <AvatarFallback>VN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </nav>
    );
};

export default Navbar;
