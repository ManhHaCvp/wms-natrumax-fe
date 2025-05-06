import React, {useState} from "react";
import {
    Clock3,
    Users,
    Package,
    ShoppingCart,
    CalendarCheck,
    Book,
    BookText,
    Banknote,
    ChevronRight,
    ChevronDown,
} from "lucide-react";
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
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import {Link, useNavigate} from "react-router-dom";
import {Misa} from "@/assets/icons/Misa.jsx";
import {KiotViet} from "@/assets/icons/KiotViet.jsx";
import {checkUserRole} from "@/utils/checkUserRole.jsx";
import {useAuth} from "@/providers/authProvider.jsx";

const AppSidebar = () => {
    const { user } = useAuth();

    const hasRole = (allowedRoles) => {
        if (!allowedRoles) return true;
        return user?.roles?.some((r) => allowedRoles.includes(r));
    };

    const data = {
        navMain: [
            {
                icon: Clock3,
                title: "Tổng quan",
                url: "/dashboard",
                roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                items: [],
            },
            {
                icon: Users,
                title: "Đối tượng",
                url: "#",
                roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT"],
                items: [
                    {
                        title: "Người dùng",
                        url: "/users",
                    },
                    {
                        title: "Vai trò",
                        url: "/roles",
                        roles: ["ROLE_ADMIN"],
                    }
                ],
            },
            {
                icon: Package,
                title: "Hàng hóa",
                url: "#",
                roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                items: [
                    {
                        title: "Hàng hóa",
                        url: "/products",
                        roles: ["ROLE_ADMIN", "ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                    },
                    {
                        title: "Nhóm hàng",
                        url: "/categories",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                    },
                    {
                        title: "Kho",
                        url: "/warehouses",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                    },
                ],
            },
            {
                icon: ShoppingCart,
                title: "Đơn hàng",
                url: "#",
                roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                items: [
                    {
                        title: "Đơn hàng",
                        url: "/orders",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                    },
                    {
                        title: "Giao dịch",
                        url: "/transactions",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                    },
                    {
                        title: "Giảm giá",
                        url: "/discounts",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                    },
                ],
            },
            {
                icon: Banknote,
                title: "Hoa hồng",
                url: "/commissions",
                roles: ["ROLE_ACCOUNTANT"],
            },
            {
                icon: CalendarCheck,
                title: "Sự kiện",
                url: "#",
                roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                items: [
                    {
                        title: "Vé quay thưởng",
                        url: "/lottery-codes",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER"],
                    },
                    {
                        title: "Phần thưởng",
                        url: "/rewards",
                        roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                    }
                ],
            },
            {
                icon: Misa,
                title: "MISA Kế toán",
                url: "#",
                roles: ["ROLE_ACCOUNTANT", "ROLE_DISTRIBUTOR"],
                items: [
                    {
                        title: "Phiếu bán hàng",
                        url: "/misa/sales",
                    },
                    {
                        title: "Phiếu xuất kho",
                        url: "/misa/inventory-outs",
                    },
                    {
                        title: "Phiếu gửi tiền",
                        url: "/misa/receipts",
                    },
                    {
                        title: "Phiếu nhập kho",
                        url: "/misa/inventory-ins",
                    },
                ],
            },
            {
                icon: KiotViet,
                title: "KiotViet",
                url: "/kiotviet/purchase-orders",
                roles: ["ROLE_BRANCH_OWNER"],
            }
        ],
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link to="/dashboard">
                                <img src="/logos/light/sm.svg" alt="Logo" className="aspect-square h-[32px]"/>
                                <img src="/logos/light/sm-only-name.svg" alt="Logo" className="h-[24px]"/>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Phân hệ</SidebarGroupLabel>
                    <SidebarMenu>
                        {data.navMain
                            .filter((item) => hasRole(item.roles))
                            .map((item) => (
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
                                                        {item.items
                                                            .filter((sub) => hasRole(sub.roles))
                                                            .map((sub) => (
                                                            <SidebarMenuSubItem key={sub.title}>
                                                                <SidebarMenuSubButton asChild>
                                                                    <Link to={sub.url}>{sub.title}</Link>
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        ))}
                                                    </SidebarMenuSub>
                                                </CollapsibleContent>
                                            ) : null}
                                        </SidebarMenuItem>
                                    </Collapsible>
                                )
                            ))}
                    </SidebarMenu>
                </SidebarGroup>
                {/*<SidebarGroup>*/}
                {/*    <SidebarGroupLabel>Thông tin</SidebarGroupLabel>*/}
                {/*    <SidebarGroupContent>*/}
                {/*        <SidebarMenu>*/}
                {/*            <SidebarMenuItem>*/}
                {/*                <SidebarMenuButton asChild>*/}
                {/*                    <Link to="#">*/}
                {/*                        <Book/>*/}
                {/*                        <span>Tài liệu hướng dẫn</span>*/}
                {/*                    </Link>*/}
                {/*                </SidebarMenuButton>*/}
                {/*            </SidebarMenuItem>*/}
                {/*            <SidebarMenuItem>*/}
                {/*                <SidebarMenuButton asChild>*/}
                {/*                    <Link to="">*/}
                {/*                        <BookText/>*/}
                {/*                        <span>Điều khoản dịch vụ</span>*/}
                {/*                    </Link>*/}
                {/*                </SidebarMenuButton>*/}
                {/*            </SidebarMenuItem>*/}
                {/*            <SidebarMenuItem>*/}
                {/*                <SidebarMenuButton asChild>*/}
                {/*                    <Link to="">*/}
                {/*                        <BookText/>*/}
                {/*                        <span>Chính sách bảo mật</span>*/}
                {/*                    </Link>*/}
                {/*                </SidebarMenuButton>*/}
                {/*            </SidebarMenuItem>*/}
                {/*        </SidebarMenu>*/}
                {/*    </SidebarGroupContent>*/}
                {/*</SidebarGroup>*/}
            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
