import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div>
            <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-[#182F73] text-9xl leading-none font-extrabold">404</p>
                    <h1 className="text-gray-900 text-5xl leading-none font-extrabold mt-5">Không tìm thấy trang</h1>
                    <p className="text-gray-700 text-base leading-none mt-5">Xin lỗi, chúng tôi không thể tìm thấy trang mà bạn đang tìm kiếm.</p>
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

const InternalServerErrorPage = () => {
    return (
        <div>
            <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-[#182F73] text-9xl leading-none font-extrabold">500</p>
                    <h1 className="text-gray-900 text-5xl leading-none font-extrabold mt-5">Lỗi máy chủ</h1>
                    <p className="text-gray-700 text-base leading-none mt-5">Xin lỗi, đã xảy ra lỗi máy chủ nội bộ.</p>
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

const UnauthorizedPage = () => {
    return (
        <div>
            <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
                <div className="text-center">
                    <p className="text-[#182F73] text-9xl leading-none font-extrabold">401</p>
                    <h1 className="text-gray-900 text-5xl leading-none font-extrabold mt-5">Truy cập bị từ chối</h1>
                    <p className="text-gray-700 text-base leading-none mt-5">Bạn không có quyền truy cập vào trang này.</p>
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

export { NotFoundPage, InternalServerErrorPage, UnauthorizedPage };
