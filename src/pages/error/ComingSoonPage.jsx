import React from "react";
import {Link} from "react-router-dom";

const ComingSoonPage = () => {
    return (
        <div>
            <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-[#182F73] text-7xl leading-none font-extrabold">Coming Soon!</p>
                    <p className="text-gray-900 text-1xl leading-none mt-10">This feature will be developed soon in the future!</p>
                    <div className="flex items-center justify-center gap-x-6 mt-10">
                        <Link
                            to={"/dashboard"}
                            className="text-primary-foreground bg-[#182F73] hover:bg-[#12245C] text-sm font-semibold rounded-md px-3.5 py-2.5"
                        >
                            Quay lại trang chủ
                        </Link>
                        <Link to={"/"} className="text-gray-900 leading-6 font-medium">
                            Liên hệ hỗ trợ <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ComingSoonPage;
