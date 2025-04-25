import userApi from "@/api/userApi";
import {useAuth} from "@/providers/authProvider.jsx";
import userService from "@/services/userService";
import {useEffect, useState} from "react";

export const checkUserRole = (...requiredRoles) => {
    const {user} = useAuth();
    return user?.roles.some(role => requiredRoles.includes(role));
};

export const checkUserRoleByUser = (user, ...requiredRoles) => {
    return user?.role?.name && requiredRoles.includes(user.role.name);
};

export const exceptUserRole = (...excludedRoles) => {
    const { user } = useAuth();
    return user?.roles?.every(role => !excludedRoles.includes(role));
};

export const exceptUserRoleByUser = (user, ...excludedRoles) => {
    return user?.role?.name && !excludedRoles.includes(user.role.name);
};