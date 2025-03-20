import React from "react";
import {
  Clock3,
  UserRoundCog,
  Package,
  ShoppingCart,
  Book,
  BookText,
  Banknote,
  Tags,
  Users,
  Warehouse,
  ChevronRight,
  ChevronDown, Gift,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "@/components/ui/sidebar.jsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { Link, useNavigate } from "react-router-dom";
import { checkUserRole } from "@/utils/checkUserRole.jsx";

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
        icon: UserRoundCog,
        title: "Người dùng",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "/admin/users",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: Package,
        title: "Hàng hóa",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "/admin/products",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: ShoppingCart,
        title: "Đơn hàng",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "/admin/orders",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
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
            url: "#",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: Tags,
        title: "Loại hàng hóa",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "/admin/category",
          },
          {
            title: "Chi tiết",
            url: "/admin/category/add",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: Users,
        title: "Vai trò",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "/admin/role",
          },
          {
            title: "Chi tiết",
            url: "/admin/role/add",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: Warehouse,
        title: "Kho",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "#",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
            url: "#",
          },
        ],
      },
      {
        icon: Gift,
        title: "Khuyến mại",
        url: "#",
        items: [
          {
            title: "Danh sách",
            url: "#",
          },
          {
            title: "Chi tiết",
            url: "#",
          },
          {
            title: "Sửa",
            url: "#",
          },
          {
            title: "Thêm mới",
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
          <SidebarMenu>
            {data.navMain.map((item, index) => (
              <Collapsible
                key={item.title}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <item.icon />
                      {item.url !== "#" ? (
                        <Link to={item.url}>{item.title}</Link>
                      ) : (
                        <span>{item.title}</span>
                      )}
                      <ChevronRight className="ml-auto group-data-[state=open]/collapsible:hidden" />
                      <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={item.isActive}
                            >
                              <Link to={item.url}>{item.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Thông tin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="">
                    <Book />
                    <span>Tài liệu hướng dẫn</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="">
                    <BookText />
                    <span>Điều khoản dịch vụ</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="">
                    <BookText />
                    <span>Chính sách bải mật</span>
                  </a>
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
