import React from "react";

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="relative w-[54px] h-[54px]">
                <img
                    src="/logos/dark/sm.svg"
                    alt="Loading"
                    className="absolute inset-0 w-12 h-12 m-auto object-contain z-10"
                />
                <div className="w-full h-full border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );
}
