import React, { useState } from "react";
import { Bell, Settings } from "lucide-react";
import toast from "react-hot-toast";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar.jsx";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { useAuth } from "@/providers/authProvider.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { setAuthData } = useAuth();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Logout function
  const handleLogout = () => {
    setAuthData();
    toast.success("Đăng xuất thành công!");
    window.location.href = "/login";
  };
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log(user);
    if (user.id) {
      navigate(`/profile`);
    }
    
  };

  return (
    <nav className="flex items-center justify-between h-[60px] px-[20px] bg-[#f8fafc] shadow-sm border-b">
      {/* Left Section */}
      <div>
        <SidebarTrigger />
        {/*<AlignLeft size={24} className="text-sidebar-foreground cursor-pointer"/>*/}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-[20px]">
        <Bell size={24} className="text-sidebar-foreground cursor-pointer" />
        <Settings size={24} className="text-sidebar-foreground cursor-pointer" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-[32px] w-[32px] cursor-pointer">
              <AvatarImage src="https://avatars.githubusercontent.com/u/144993791?v=4" />
              <AvatarFallback>VN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52">
            <DropdownMenuLabel>{user ? user.accountName : "Tài khoản"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleProfileClick}>
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem>
                Cài đặt
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </nav>
  );
};

export default Navbar;
