import { Menu, Bell, Settings } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-gray-100 shadow-sm border-b h-16">
      {/* Left Section */}
      <div>
        <Menu className="w-5 h-5 cursor-pointer text-gray-600" />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
        <span className="text-gray-500 text-sm font-medium">VN</span>
      </div>
    </nav>
  );
};

export default Navbar;
