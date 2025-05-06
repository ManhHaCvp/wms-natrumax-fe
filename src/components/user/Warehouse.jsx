import React from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {SelectItem} from "@/components/ui/select.jsx";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {UpdateWarehouse} from "@/pages/warehouse/WarehouseSheet.jsx";
import {Link} from "react-router-dom";
import {Pencil} from "lucide-react";
import {Button} from "@/components/ui/button.jsx";

const Warehouse = ({warehouses}) => {
    return (
        <div className="space-y-5">
            {warehouses.map((warehouse) => (
                <Card className="" key={warehouse.userWarehouseId}>
                    <CardHeader>
                        <div className="flex justify-between">
                            <CardTitle>{warehouse.roleInWarehouse === "Owner" ? "Kho quản lý" : "Kho nhập hàng"}</CardTitle>
                            {/*<Sheet>*/}
                            {/*    <SheetTrigger asChild>*/}
                            {/*        <Button variant="outline"><Pencil/>Sửa</Button>*/}
                            {/*    </SheetTrigger>*/}
                            {/*    <SheetContent>*/}
                            {/*        <SheetHeader>*/}
                            {/*            <SheetTitle>Sửa kho</SheetTitle>*/}
                            {/*            <SheetDescription>Chỉnh sửa thông tin kho.</SheetDescription>*/}
                            {/*        </SheetHeader>*/}
                            {/*        <UpdateWarehouse warehouseId={warehouse.warehouseId} />*/}
                            {/*    </SheetContent>*/}
                            {/*</Sheet>*/}
                        </div>
                    </CardHeader>
                    <CardContent className="text-base font-semibold space-y-2">
                        <div className="flex items-center">
                            <p className="w-32 text-muted-foreground">Tên kho</p>
                            <p className="font-medium">{warehouse.warehouse.warehouseName}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="w-32 text-muted-foreground">Mô tả</p>
                            <p className="font-medium">{warehouse.warehouse.description}</p>
                        </div>
                        <div className="flex items-center">
                            <p className="w-32 text-muted-foreground">Khu vực</p>
                            <p className="font-medium">{warehouse.warehouse.province.name}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Warehouse;