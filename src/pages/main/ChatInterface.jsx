// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { MessageSquare, ShoppingCart, Package, BarChart3 } from "lucide-react";

// const sampleQueries = [
//   { text: "Kiểm tra tồn kho sản phẩm sữa hộp", icon: <Package className="w-5 h-5 text-blue-500" /> },
//   { text: "Thống kê doanh số xuất kho tháng này", icon: <BarChart3 className="w-5 h-5 text-green-500" /> },
//   { text: "Danh sách đơn hàng chưa xử lý", icon: <ShoppingCart className="w-5 h-5 text-red-500" /> },
//   { text: "Dự báo nhu cầu nhập hàng tháng sau", icon: <MessageSquare className="w-5 h-5 text-purple-500" /> },
// ];

// export default function ChatInterface() {
//   const [input, setInput] = useState("");
//   const [selectedQuery, setSelectedQuery] = useState(null);

//   return (
//     <div className="w-full p-6 space-y-4 bg-white shadow-lg rounded-2xl">
//       <h1 className="text-3xl font-bold text-gray-800">
//         <span className="text-purple-600">Xin chào</span>, bạn cần hỗ trợ gì?
//       </h1>

//       {/* List cau hoihoi */}
//       <div className="grid grid-cols-2 gap-4">
//         {sampleQueries.map((query, index) => (
//           <Card key={index} className="p-4 flex items-center space-x-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedQuery(query)}>
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

//       {/* Chat window */}
//       {selectedQuery && (
//         <div className="border rounded-lg p-4 mt-4 bg-gray-50 shadow-md">
//           <div className="text-lg font-semibold text-gray-700 mb-2">🗨️ Chat với hệ thống</div>
//           <div className="bg-white p-3 rounded-md shadow-sm">
//             <p className="text-gray-600">🖥️ Hệ thống: Bạn đã chọn "{selectedQuery.text}". Trên đây là dữ liệu liên quan đến câu hỏi </p>
//           </div>
//           <div className="mt-3 flex items-center border rounded-lg px-3 py-2 bg-white">
//             <Input className="flex-1 border-none focus:ring-0" placeholder="Nhập câu hỏi của bạn..." value={input} onChange={(e) => setInput(e.target.value)} />
//             <Button className="ml-2" variant="primary">
//               Gửi
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState } from "react";

// function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");

//     try {
//       const response = await fetch("http://localhost:3001/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });

//       const data = await response.json();
//       const botMessage = { role: "assistant", content: data.reply };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       console.error("Error talking to backend:", err);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
//       <h2>🧠 Novita Chatbot</h2>
//       <div
//         style={{
//           border: "1px solid #ccc",
//           padding: 20,
//           height: 400,
//           overflowY: "scroll",
//         }}
//       >
//         {messages.map((msg, idx) => (
//           <div key={idx} style={{ marginBottom: 10 }}>
//             <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
//           </div>
//         ))}
//       </div>
//       <div style={{ display: "flex", marginTop: 10 }}>
//         <input style={{ flex: 1, padding: 10 }} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder="Type a message..." />
//         <button style={{ padding: "10px 20px" }} onClick={sendMessage}>
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Chat;

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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedQuery, setSelectedQuery] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Error talking to backend:", err);
    }
  };

  return (
    <div className="w-full p-6 space-y-4 bg-white shadow-lg rounded-2xl max-w-full mx-auto ">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        <span className="text-purple-600">Xin chào</span>, bạn cần hỗ trợ gì?
      </h1>

      {/* List of sample queries */}
      <div className="grid grid-cols-2 gap-4">
        {sampleQueries.map((query, index) => (
          <Card key={index} className="p-4 flex items-center space-x-2 cursor-pointer hover:bg-gray-100" onClick={() => setSelectedQuery(query)}>
            {query.icon}
            <span>{query.text}</span>
          </Card>
        ))}
      </div>

      {/* Chat window */}
      {selectedQuery && (
        <div className="border rounded-lg p-4 mt-4 bg-gray-50 shadow-md">
          <div className="text-lg font-semibold text-gray-700 mb-2">🗨️ Chat với hệ thống</div>
          <div className="bg-white p-3 rounded-md shadow-sm mb-4">
            <p className="text-gray-600">🖥️ Hệ thống: Bạn đã chọn "{selectedQuery.text}".</p>
          </div>

          {/* Messages area */}
          <div className="border p-4 bg-white rounded-md shadow-sm space-y-4" style={{ height: 400, overflowY: "scroll" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  <strong>{msg.role === "user" ? "Bạn" : "Bot"}:</strong> {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input and Send button */}
          <div className="flex items-center border rounded-lg px-3 py-2 mt-4 bg-white">
            <Input
              className="flex-1 border-none focus:ring-0"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button className="ml-2" variant="primary" onClick={sendMessage}>
              Gửi
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
