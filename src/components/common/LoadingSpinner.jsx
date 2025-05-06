import { motion } from "framer-motion";

export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
            <motion.div
                className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
        </div>
    );
}
