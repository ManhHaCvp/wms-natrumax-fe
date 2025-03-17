import React from "react";
import {Outlet} from "react-router-dom";
import SideBar from "./SideBar.jsx";
import Navbar from "./NavBar.jsx";
import Footer from "./Footer.jsx";

const Layout = () => {
    return (
        <div className="flex h-screen w-screen">
            <SideBar/>
            <div className="flex flex-col flex-1">
                <Navbar/>
                <div className="flex-1 overflow-auto">
                    <div className="flex flex-col justify-between h-full">
                        <Outlet/>
                        <Footer/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;