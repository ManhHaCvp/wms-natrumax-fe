import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import roleService from "@/services/roleService.jsx";
import warehouseService from "@/services/warehouseService.jsx";
import userService from "@/services/userService.jsx";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Plus } from "lucide-react";

const CreateNewUser = ({ setUserList, setIsOpen }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {
      misaCode: "",
      warehouseId: "",
      roleId: "",
    },
  });

  const [roleOptions, setRoleOptions] = useState([]);
  const [warehouseOptions, setWarehouseOptions] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          roleService.getAll(setRoleOptions),
          warehouseService.getAll(setWarehouseOptions),
        ]);
      } catch (error) {
        console.error("Failed to fetch dropdown data:", error);
      }
    };

    loadInitialData();
  }, []);

  const onSubmit = async (newUserData) => {
    try {
      await userService.create({
        misaCode: newUserData.misaCode,
        warehouseId: Number(newUserData.warehouseId),
        roleId: Number(newUserData.roleId),
      });
      toast.success("Tạo người dùng thành công!");
      reset();
      await userService.getAll(setUserList).catch((err) =>
        console.error("Failed to fetch user list:", err),
      );
      setIsOpen(false);
    } catch (error) {
      toast.error("Tạo người dùng không thành công!");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium">Mã MISA</label>
        <Input {...register("misaCode")} placeholder="Nhập mã MISA" />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Vai trò</label>
        <Controller
          control={control}
          name="roleId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((role) => (
                  <SelectItem
                    key={role.roleId}
                    value={String(role.roleId)}
                  >
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Kho</label>
        <Controller
          control={control}
          name="warehouseId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn kho" />
              </SelectTrigger>
              <SelectContent>
                {warehouseOptions.map((wh) => (
                  <SelectItem
                    key={wh.warehouseId}
                    value={String(wh.warehouseId)}
                  >
                    {wh.warehouseName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <Button type="submit">
        <Plus /> Thêm mới
      </Button>
    </form>
  );
};

export default CreateNewUser;