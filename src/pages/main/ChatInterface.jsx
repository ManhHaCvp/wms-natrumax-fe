// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { MessageSquare, ShoppingCart, Package, BarChart3 } from "lucide-react";

// const sampleQueries = [
//   { text: "Kiểm tra tồn kho sản phẩm sữa hộphộp", icon: <Package className="w-5 h-5 text-blue-500" /> },
//   { text: "Thống kê doanh số xuất khokho tháng này", icon: <BarChart3 className="w-5 h-5 text-green-500" /> },
//   { text: "Danh sách đơn hàng chưa xử lý", icon: <ShoppingCart className="w-5 h-5 text-red-500" /> },
//   { text: "Dự báo nhu cầu nhập hàng tháng sau", icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
// ];

// export default function ChatInterface() {
//   const [input, setInput] = useState("");

//   return (
//     <div className="w-full p-6 space-y-4 bg-white shadow-lg rounded-2xl">
//       <h1 className="text-3xl font-bold text-gray-800">
//         <span className="text-purple-600">Xin chào</span>, bạn cần hỗ trợ gì?
//       </h1>
//       <div className="grid grid-cols-2 gap-4">
//         {sampleQueries.map((query, index) => (
//           <Card key={index} className="p-4 flex items-center space-x-2 cursor-pointer hover:bg-gray-100">
//             {query.icon}
//             <span>{query.text}</span>
//           </Card>
//         ))}
//       </div>
//       <div className="flex items-center border rounded-lg px-3 py-2">
//         <Input className="flex-1 border-none focus:ring-0" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} />
//         <Button className="ml-2" variant="primary">
//           Gửi
//         </Button>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ShoppingCart, Package, BarChart3 } from "lucide-react";

const sampleQueries = [
  { text: "Kiểm tra tồn kho sản phẩm sữa hộp", icon: <Package className="w-5 h-5 text-blue-500" /> },
  { text: "Thống kê doanh số xuất kho tháng này", icon: <BarChart3 className="w-5 h-5 text-green-500" /> },
  { text: "Danh sách đơn hàng chưa xử lý", icon: <ShoppingCart className="w-5 h-5 text-red-500" /> },
  { text: "Dự báo nhu cầu nhập hàng tháng sau", icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
];

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);

  return (
    <div className="w-full p-6 space-y-4 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-gray-800">
        <span className="text-purple-600">Xin chào</span>, bạn cần hỗ trợ gì?
      </h1>

      {/* List cau hoihoi */}
      <div className="grid grid-cols-2 gap-4">
        {sampleQueries.map((query, index) => (
          <Card key={index} className="p-4 flex items-center space-x-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedQuery(query)}>
            {query.icon}
            <span>{query.text}</span>
          </Card>
        ))}
      </div>

      <div className="flex items-center border rounded-lg px-3 py-2">
        <Input className="flex-1 border-none focus:ring-0" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} />
        <Button className="ml-2" variant="primary">
          Gửi
        </Button>
      </div>

      {/* Chat window */}
      {selectedQuery && (
        <div className="border rounded-lg p-4 mt-4 bg-gray-50 shadow-md">
          <div className="text-lg font-semibold text-gray-700 mb-2">🗨️ Chat với hệ thống</div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-gray-600">🖥️ Hệ thống: Bạn đã chọn "{selectedQuery.text}". Trên đây là dữ liệu liên quan đến câu hỏi </p>
          </div>
          <div className="mt-3 flex items-center border rounded-lg px-3 py-2 bg-white">
            <Input className="flex-1 border-none focus:ring-0" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} />
            <Button className="ml-2" variant="primary">
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
