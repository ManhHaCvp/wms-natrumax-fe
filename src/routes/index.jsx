import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {useAuth} from "../provider/authProvider";
import {ProtectedRoute} from "./ProtectedRoute";
import AuthPage from "../pages/auth/AuthPage.jsx";
import HomePage from "../pages/main/HomePage.jsx";

const Routes = () => {
    const {token} = useAuth();

    // Define public routes accessible to all users
    const routesForPublic = [
        {
            path: "/service",
            element: <div>Service Page</div>,
        },
        {
            path: "/about-us",
            element: <div>About Us</div>,
        },
    ];

    // Define routes accessible only to authenticated users
    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute/>, // Wrap the component in ProtectedRoute
            children: [
                {
                    path: "/",
                    element: <HomePage/>,
                },
                {
                    path: "/home",
                    element: <HomePage/>,
                },
                {
                    path: "/profile",
                    element: <div>User Profile</div>,
                },
            ],
        },
    ];

    // Define routes accessible only to non-authenticated users
    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <AuthPage/>,
        },
        {
            path: "/login",
            element: <AuthPage/>,
        },
    ];

    // Combine and conditionally include routes based on authentication status
    const router = createBrowserRouter(
        [
            ...routesForPublic,
            ...(!token ? routesForNotAuthenticatedOnly : []),
            ...routesForAuthenticatedOnly,
        ]
    );

    // Provide the router configuration using RouterProvider
    return <RouterProvider router={router}/>;
};

export default Routes;