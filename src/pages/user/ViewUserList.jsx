import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "../../components/user/UserList.jsx";

const ViewUserList = () => {
    return (
        <div>
            <UserList />
        </div>
    );
};

export default ViewUserList;