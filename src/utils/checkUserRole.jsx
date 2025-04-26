import userApi from "@/api/userApi";
import {useAuth} from "@/providers/authProvider.jsx";
import userService from "@/services/userService";
import { useEffect, useState } from "react";

export const checkUserRole = (...requiredRoles) => {
    const { user } = useAuth();
    return user?.roles.some(role => requiredRoles.includes(role));
};

export const checkUserRoleByUser = (user, ...requiredRoles) => {
    console.log(user);
    return user?.role?.name && requiredRoles.includes(user.role.name);
};
export const checkUserRoleById = (userLogin,userOrder)=>{
    return userLogin.id == userOrder.id;
}
