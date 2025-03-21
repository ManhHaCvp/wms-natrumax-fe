import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "../../components/user/UserList.jsx";

const ViewUserList = () => {
    const [loginTypes, setLoginTypes] = useState([]); // Giả sử bạn có một API để lấy loại đăng nhập nếu cần thiết

    return (
        <div>
            <UserList />
        </div>
    );
};

export default ViewUserList;