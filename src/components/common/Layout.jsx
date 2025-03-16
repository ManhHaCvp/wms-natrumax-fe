import React from "react";
import {Outlet} from "react-router-dom";
import SideBar from "./SideBar";
import Navbar from "./NavBar";
import Footer from "./Footer";

const Layout = () => {

    return (
        <div className="flex h-screen w-screen">
            <SideBar/>

            <div className="flex flex-col flex-1">
                <Navbar />
                <main className="flex-1 overflow-auto">
                    <div className="flex flex-col flex-1 justify-between h-full">
                        <Outlet />
                        <Footer />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;