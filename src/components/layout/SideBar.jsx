import React from "react";
import { Clock3, UserRoundCog, Package, ShoppingCart, Book, BookText, Banknote, Tags, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion.jsx";
import { Link, useNavigate } from "react-router-dom";
import { checkUserRole } from "@/utils/checkUserRole.jsx";

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] border-r border-sidebar-border w-[15vw]">
      <div className="sidebar-container sticky top-0">
        <div className="text-center p-2 flex flex-row cursor-pointer" onClick={() => navigate("/home")}>
          <img src="/logos/light/sm-name.svg" alt="Logo" className="h-[32px]" />
        </div>

        <Accordion type="single" collapsible className="w-full p-2">
          <div className="flex items-center px-2 py-1.5">
            <p className="text-sidebar-foreground text-xs leading-5 font-medium">Phân hệ</p>
          </div>
          {checkUserRole("ROLE_ADMIN", "ROLE_ACCOUNTANT") && (
            <AccordionItem value="overview">
              <Link to="/dashboard" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <Clock3 size={16} className="mr-2" /> Tổng quan
              </Link>
            </AccordionItem>
          )}
          <>
            <AccordionItem value="manage-user">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <UserRoundCog size={16} className="mr-2" /> Người dùng
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Chi tiết
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Sửa
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="manage-product">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <Package size={16} className="mr-2" /> Hàng hóa
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/products" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Chi tiết
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Sửa
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="manage-order">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <ShoppingCart size={16} className="mr-2" /> Đơn hàng
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Chi tiết
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Sửa
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="manage-commission">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <Banknote size={16} className="mr-2" /> Hoa hồng
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/users" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Chi tiết
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/types" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Sửa
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/tags" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crud-category">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <Tags size={16} className="mr-2" /> Loại hàng hóa
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/category" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/category/add" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="crud-role">
              <AccordionTrigger className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                <Users size={16} className="mr-2" /> Vai trò
              </AccordionTrigger>
              <AccordionContent>
                <ul className="px-2.5 py-0.5 mx-[14px] border-l border-gray-300">
                  <li>
                    <Link to="/admin/role" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Danh sách
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/role/add" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
                      Thêm mới
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </>
        </Accordion>
        <Accordion type="single" collapsible className="w-full p-2">
          <div className="flex items-center px-2 py-1.5">
            <p className="text-sidebar-foreground text-xs leading-5 font-medium">Thông tin</p>
          </div>
          <AccordionItem value="guide-ocuments">
            <Link to="/" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
              <Book size={16} className="mr-2" /> Tài liệu hướng dẫn
            </Link>
          </AccordionItem>
          <AccordionItem value="terms-of-service">
            <Link to="/" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
              <BookText size={16} className="mr-2" /> Điều khoản dịch vụ
            </Link>
          </AccordionItem>
          <AccordionItem value="privacy-policy">
            <Link to="/" className="flex items-center text-sidebar-foreground hover:bg-border text-sm leading-5 font-normal px-2 py-1.5 rounded">
              <BookText size={16} className="mr-2" /> Chính sách bảo mật
            </Link>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SideBar;
