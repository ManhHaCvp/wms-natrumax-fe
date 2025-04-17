import React from "react";
import { Clock3, Users, Package, ShoppingCart, CalendarCheck, Book, BookText, Banknote, ChevronRight, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar.jsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Link, useNavigate } from "react-router-dom";

const AppSidebar = () => {
  const navigate = useNavigate();

  const data = {
    navMain: [
      {
        icon: Clock3,
        title: "Tổng quan",
        url: "/dashboard",
        items: [],
      },
      {
        icon: Users,
        title: "Đối tượng",
        url: "#",
        items: [
          {
            title: "Người dùng",
            url: "/admin/users",
          },
          {
            title: "Vai trò",
            url: "/admin/roles",
          },
        ],
      },
      {
        icon: Package,
        title: "Hàng hóa",
        url: "#",
        items: [
          {
            title: "Hàng hóa",
            url: "/admin/products",
          },
          {
            title: "Nhóm hàng",
            url: "/admin/categories",
          },
          {
            title: "Kho",
            url: "/admin/warehouses",
          },
        ],
      },
      {
        icon: ShoppingCart,
        title: "Đơn hàng",
        url: "#",
        items: [
          {
            title: "Đơn hàng",
            url: "/admin/orders",
          },
          {
            title: "Giảm giá",
            url: "/admin/discounts",
          },
        ],
      },
      {
        icon: Banknote,
        title: "Hoa hồng",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "admin/commissions",
          },
          {
            title: "Chính sách",
            url: "#",
          },
          {
            title: "Lịch sử",
            url: "#",
          },
        ],
      },
      {
        icon: CalendarCheck,
        title: "Sự kiện",
        url: "#",
        items: [
          {
            title: "Khách hàng",
            url: "#",
          },
          {
            title: "Vé quay thưởng",
            url: "#",
          },
          {
            title: "Phần thưởng",
            url: "#",
          },
          {
            title: "Quay thưởng",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/home">
                <img src="/logos/light/sm.svg" alt="Logo" className="aspect-square h-[32px]" />
                <img src="/logos/light/sm-only-name.svg" alt="Logo" className="h-[24px]" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Phân hệ</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) =>
              item.url !== "#" ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                <Collapsible key={item.title} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton asChild isActive={item.isActive}>
                                <Link to={item.url}>{item.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ),
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Thông tin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="#">
                    <Book />
                    <span>Tài liệu hướng dẫn</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="">
                    <BookText />
                    <span>Điều khoản dịch vụ</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="">
                    <BookText />
                    <span>Chính sách bải mật</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
