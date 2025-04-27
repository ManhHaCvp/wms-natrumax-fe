import React, {useState, useEffect} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Ban, Pencil} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card, CardDescription} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import PaymentHistory from "@/components/user/OrderHistory";
import Wallet from "@/components/user/Wallet";
import Commission from "@/components/user/Commission";
import Promotion from "@/components/user/Promotion";
import Warehouse from "@/components/user/Warehouse";

import ApiConnection from "@/components/user/ApiConnection";
import userService from "@/services/userService";
import {checkUserRoleByUser} from "@/utils/checkUserRole";
import ChangeStatusButton from "@/components/common/ChangeStatusButton.jsx";
import toast from "react-hot-toast";

const ViewUserDetail = () => {
    const {id} = useParams();
    const [user, setUser] = useState({});

    const fetchUserData = async () => {
        try {
            const data = await userService.getById(id);
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
        }
    };

    useEffect(() => {
        fetchUserData().catch(console.error);
    }, [id]);

    const handleChangeStatus = async () => {
        try {
            await userService.changeStatus(user.id);
            toast.success("Cập nhật thành công!");
            fetchUserData();
        } catch (error) {
            console.error("Failed to update user", error);
            toast.error("Cập nhật thất bại. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex flex-col m-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-[#182F73] text-3xl font-bold">Thông tin người dùng</h1>
                <div>
                    <Button asChild><Link to={`/admin/user/update/${user.id}`}><Pencil/>Sửa</Link></Button>
                    <ChangeStatusButton user={user} handleChangeStatus={handleChangeStatus}/>
                </div>
            </div>
            <div className="flex">
                <Card className="w-2/6 h-fit p-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-3xl font-semibold">{user.accountName}</div>
                            <CardDescription>{user.role?.name}</CardDescription>
                        </div>
                        <Button variant="outline" asChild><Link
                            to={`/admin/user/update/${user.id}`}><Pencil/></Link></Button>
                    </div>
                    <div className="font-semibold grid grid-cols-1 gap-5 mt-7">
                        <div>
                            <p className="text-muted-foreground">Số điện thoại</p>{user.phoneNumber}
                        </div>
                        <div>
                            <p className="text-muted-foreground">Email</p>{user.email}
                        </div>
                        <div>
                            <p className="text-muted-foreground">Địa chỉ</p>{user.address}
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-muted-foreground">Mật khẩu</p>*******
                            </div>
                            <Link to="/admin/user/change-password" className="text-[#182F73] hover:text-[#12245C]">Thay
                                đổi</Link>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Trạng thái</p>
                            {user.status ? (
                                <Badge>Hoạt động</Badge>
                            ) : (
                                <Badge variant="destructive">Bị khóa</Badge>
                            )}
                        </div>
                    </div>
                </Card>
                <Tabs defaultValue="order-history" className="w-full ms-5">
                    <TabsList className="grid w-full grid-cols-6 ">
                        {checkUserRoleByUser(user, "ROLE_DISTRIBUTOR", "ROLE_BRANCH_OWNER") && (
                            <>
                                <TabsTrigger value="order-history">Lịch sử đặt hàng</TabsTrigger>
                                <TabsTrigger value="wallet">Ví</TabsTrigger>
                                <TabsTrigger value="promotion">Khuyến mại</TabsTrigger>
                            </>
                        )}
                        <TabsTrigger value="commission">Hoa hồng</TabsTrigger>
                        <TabsTrigger value="warehouse">Kho</TabsTrigger>
                        {checkUserRoleByUser(user, "ROLE_BRANCH_OWNER") && (
                            <TabsTrigger value="api-connection">Kết nối API</TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="order-history">
                        <PaymentHistory userId={user.id}/>
                    </TabsContent>
                    <TabsContent value="wallet">
                        <Card>
                            <Wallet userId={user.id} bank={user.bank}/>
                        </Card>
                    </TabsContent>
                    <TabsContent value="commission">
                        <Card className="p-5">
                            <Commission userId={user.id}/>
                        </Card>
                    </TabsContent>
                    <TabsContent value="promotion">
                        <Card>
                            <Promotion promotion={user.promotion}/>
                        </Card>
                    </TabsContent>
                    <TabsContent value="api-connection">
                        <Card>
                            <ApiConnection detail={user.detail}/>
                        </Card>
                    </TabsContent>
                    <TabsContent value="warehouse">
                        <Warehouse warehouses={user.userWarehouses}/>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}

export default ViewUserDetail;