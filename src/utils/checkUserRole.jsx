import {useAuth} from "@/providers/authProvider.jsx";

export const checkUserRole = (...requiredRoles) => {
    const { user } = useAuth();
    return user?.roles.some(role => requiredRoles.includes(role));
};