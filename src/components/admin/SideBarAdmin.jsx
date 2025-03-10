import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Adjust this import according to your project structure
import {
  Gauge,
  FolderKanban,
  Settings,
  PackageSearch,
  ClipboardType,
  BadgeCheck,
  PackageOpen,
  PaintBucket,
  UsersRound,
  NotebookText,
  BaggageClaim,
  Home,
  Tags,
  Clock,
  Clock1,
  Clock3,
  UserRoundCog,
  Package,
  ShoppingCart,
  Book,
  BookText,
} from "lucide-react";
import { UserContext } from "@/App"; // Adjust this import according to your project structure

const SideBarAdmin = () => {
  const { userAuth } = useContext(UserContext);
  const userRole = userAuth?.user?.role;

  return (
    <div className=" w-64 p-4 transition-all duration-300">
      <div className="sidebar-container sticky top-0">
        <div className="text-center mb-4">
          <img src="/icon.svg" alt="Profile" className="w-12 h-12 mx-auto mb-2" />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <div className="ml-3 flex items-center mb-1  ">
            <p className="text-xs text-gray-500 font-semibold">Dashboard</p>
          </div>
          <AccordionItem value="overview">
            <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded ">
              <Clock3 size={20} className="mr-3" /> Overview
            </Link>
          </AccordionItem>
          <>
            <AccordionItem value="crud">
              <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-normal">
                <UserRoundCog size={20} className="mr-3" /> User
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-4 border-l border-gray-300 ml-4 ">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      List
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Details
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Create
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="crud-product">
              <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-normal">
                <Package size={20} className="mr-3" /> Product
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-4 border-l border-gray-300 ml-4 ">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      List
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Details
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Create
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="crud-cart">
              <AccordionTrigger className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded font-normal">
                <ShoppingCart size={20} className="mr-3" /> Order
              </AccordionTrigger>
              <AccordionContent>
                <ul className="pl-4 border-l border-gray-300 ml-4 ">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      List
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Details
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded">
                      Create
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="overview">
              <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded ">
                <Clock3 size={20} className="mr-3" /> Commission
              </Link>
            </AccordionItem>
          </>
          <div className="mt-8">
            <div className="ml-3 flex items-center mb-2  ">
              <p className="text-xs text-gray-500 font-semibold">More Information</p>
            </div>
            <AccordionItem value="overview">
              <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded ">
                <Book size={20} className="mr-3" /> Guide Documents
              </Link>
            </AccordionItem>
            <AccordionItem value="overview">
              <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded ">
                <BookText size={20} className="mr-3" /> Terms of Service
              </Link>
            </AccordionItem>
            <AccordionItem value="overview">
              <Link to="/" className="flex items-center text-gray-700 hover:bg-gray-200 p-2 rounded ">
                <BookText size={20} className="mr-3" /> Privacy Policy
              </Link>
            </AccordionItem>
          </div>
        </Accordion>
      </div>
    </div>
  );
};

export default SideBarAdmin;
