import React from "react";
import {useNavigate} from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer>
        <div className="m-[20px] flex justify-between items-center">
          <p className="text-muted-foreground text-sm">Copyright © 2025 Natrumax All rights reserved.</p>
          <p className="text-muted-foreground text-sm cursor-pointer">
            <a onClick={() => navigate("*")}>Điều khoản dịch vụ </a>|<a onClick={() => navigate("*")}> Chính sách bảo mật</a>
          </p>
        </div>
    </footer>
  );
};

export default Footer;
