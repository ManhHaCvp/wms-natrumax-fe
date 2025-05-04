import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    MessageSquare,
    ShoppingCart,
    Package,
    BarChart3,
} from "lucide-react";
import {API_KEY, DEEPSEEK_V3_TURBO} from "@/utils/constants.jsx";

const sampleQueries = [
    {
        text: "Kiểm tra tồn kho sản phẩm sữa hộp",
        icon: <Package className="w-5 h-5 text-blue-500"/>,
        apiEndpoint: "/api/check-inventory",
    },
    {
        text: "Thống kê doanh số xuất kho tháng này",
        icon: <BarChart3 className="w-5 h-5 text-green-500"/>,
        apiEndpoint: "/api/sales-statistics",
    },
    {
        text: "Danh sách đơn hàng chưa xử lý",
        icon: <ShoppingCart className="w-5 h-5 text-red-500"/>,
        apiEndpoint: "/api/unprocessed-orders",
    },
    {
        text: "Dự báo nhu cầu nhập hàng tháng sau",
        icon: <MessageSquare className="w-5 h-5 text-purple-500"/>,
        apiEndpoint: "/api/forecast-demand",
    },
];

export default function ChatInterface() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedQuery, setSelectedQuery] = useState(null);

    const handleQuerySelection = async (query) => {
        setSelectedQuery(query);
    }

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage = {role: "user", content: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");

        try {
            const res = await fetch(`http://localhost:8080/api/v1/warehouses/1/products`);
            const apiData = await res.json();

            const prompt = `
                Bạn là một trợ lý kho thông minh. Người dùng vừa hỏi: "${input}".
                Hãy sử dụng dữ liệu sau để trả lời ngắn gọn, chính xác và thân thiện.
                ❗ Tuyệt đối không viết mã code hoặc trả lời dưới dạng ngôn ngữ lập trình.
                Dữ liệu: ${JSON.stringify(apiData, null, 2)}.
            `;

            const response = await fetch("https://api.novita.ai/v3/openai/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
                body: JSON.stringify({
                    model: DEEPSEEK_V3_TURBO,
                    messages: [
                        {role: "system", content: "Act like you are a helpful assistant."},
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    stream: false,
                }),
            });

            const data = await response.json();
            const botReply = formatBotReply(data.choices?.[0]?.message?.content || "Không có phản hồi từ AI.");
            setMessages((prev) => [...prev, {role: "assistant", content: botReply}]);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
            setMessages((prev) => [...prev, {role: "assistant", content: "❌ Không thể gửi tin nhắn đến AI."}]);
        }
    };

    const formatBotReply = (text) => {
        return text
            .trim()
            .replace(/^### (.*?)$/gm, "<h3>$1</h3>")
            .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
            .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
            .replace(/\n{2,}/g, "<br/><br/>")
            .replace(/\n/g, "<br/>")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.*?)\*/g, "<em>$1</em>");
    };

    return (
        <Card className="w-full p-5 space-y-5 rounded-lg max-w-full mx-auto">
            <h1 className="text-3xl font-bold text-gray-800">
                <span className="text-[#182F73]">Xin chào</span>, bạn cần hỗ trợ gì?
            </h1>

            <div className="grid grid-cols-2 gap-4">
                {sampleQueries.map((query, index) => (
                    <Card
                        key={index}
                        className="p-3 flex items-center space-x-3 cursor-pointer bg-white hover:bg-gray-100"
                        onClick={() => handleQuerySelection(query)}
                    >
                        {query.icon}
                        <span>{query.text}</span>
                    </Card>
                ))}
            </div>

            {selectedQuery && (
                <>
                    <div className="text-lg font-semibold text-gray-700 mb-2">🗨️ Chat với hệ thống</div>
                    <div className="bg-white p-3 border rounded-lg mb-3">
                        <p className="text-gray-600">🖥️ Hệ thống: Bạn đã chọn "{selectedQuery.text}".</p>
                    </div>

                    <div className="border p-3 bg-white rounded-lg space-y-3"
                         style={{height: 400, overflowY: "scroll"}}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`p-3 rounded-lg max-w-xs whitespace-pre-line text-sm leading-relaxed ${
                                        msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
                                    }`}
                                >
                                    <strong>{msg.role === "user" ? "Bạn" : "Bot"}:</strong>{" "}
                                    <div dangerouslySetInnerHTML={{__html: msg.content}}/>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center border rounded-lg px-2 py-1 mt-3 bg-white">
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
                </>
            )}
        </Card>
    );
}