import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
    MessageSquare,
    ShoppingCart,
    Package,
    BarChart3,
    CloudDownload
} from "lucide-react";
import {API_KEY, DEEPSEEK_V3_TURBO} from "@/utils/constants.jsx";
import toast from "react-hot-toast";
import productService from "@/services/productService.jsx";
import orderService from "@/services/orderService.jsx";
import reportService from "@/services/reportService.jsx";
import commissionService from "@/services/commissionService.jsx";
import LoadingOverlay from "@/components/common/LoadingOverlay.jsx";

const ChatInterface = ({userId, warehouseId}) => {
    const sampleQueries = [
        {
            text: "Kiểm tra tồn kho",
            icon: <Package className="w-5 h-5 text-blue-500"/>,
            apiEndpoint: "check-inventory",
        },
        {
            text: "Thống kê doanh số xuất kho tháng này",
            icon: <BarChart3 className="w-5 h-5 text-green-500"/>,
            apiEndpoint: "sales-statistics",
        },
        {
            text: "Danh sách đơn hàng",
            icon: <ShoppingCart className="w-5 h-5 text-red-500"/>,
            apiEndpoint: "unprocessed-orders",
        },
        {
            text: "Dự báo nhu cầu nhập hàng tháng sau",
            icon: <MessageSquare className="w-5 h-5 text-purple-500"/>,
            apiEndpoint: "forecast-demand",
        },
    ];

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const queryHandlers = {
        "check-inventory": () => productService.getByWarehouseId(warehouseId),
        "sales-statistics": () => reportService.getByUserId(userId, currentMonth, currentYear),
        "unprocessed-orders": () => orderService.getByUserId(userId),
        "forecast-demand": () => reportService.getSold(currentMonth, currentYear)
    };

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedQuery, setSelectedQuery] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    const buildPrompt = (question, apiData) => `
        Bạn là một trợ lý kho thông minh. Người dùng vừa hỏi: "${question}".
        Hãy sử dụng dữ liệu sau để trả lời ngắn gọn, chính xác và thân thiện.
        ❗ Tuyệt đối không viết mã code hoặc trả lời dưới dạng ngôn ngữ lập trình.
        Dữ liệu: ${JSON.stringify(apiData, null, 2)}.
    `;

    const handleQuerySelection = async (query) => {
        setSelectedQuery(query);
        setMessages([]);
        setLoading(true);

        try {
            const handler = queryHandlers[query.apiEndpoint];
            if (!handler) throw new Error("Không tìm thấy dịch vụ xử lý truy vấn này");

            const apiData = await handler();
            const prompt = buildPrompt(query.text, apiData);

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
                        {role: "user", content: prompt},
                    ],
                    stream: false,
                }),
            });

            const data = await response.json();
            const botReply = formatBotReply(data.choices?.[0]?.message?.content || "Không có phản hồi từ AI.");
            setMessages([{role: "assistant", content: botReply}]);
        } catch (error) {
            console.error("Lỗi gửi truy vấn:", error);
            toast.error("Lỗi xử lý truy vấn.");
            setMessages([{role: "assistant", content: "❌ Lỗi xử lý truy vấn."}]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedQuery) return;

        const userMessage = {role: "user", content: input};
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const handler = queryHandlers[selectedQuery.apiEndpoint];
            if (!handler) throw new Error("Không tìm thấy dịch vụ xử lý truy vấn này");

            const apiData = await handler();
            const prompt = buildPrompt(input, apiData);

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
                        {role: "user", content: prompt},
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
        } finally {
            setLoading(false);
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

    const handleFetchReport = async () => {
        setFetchLoading(true);
        try {
            await commissionService.createReport(currentMonth, currentYear);
        } catch (error) {
            toast.error("Failed to fetch report");
        } finally {
            setFetchLoading(false);
        }
    }

    return (
        <>
            {fetchLoading && <LoadingOverlay/>}
            <Card className="w-full p-5 space-y-5 rounded-lg max-w-full mx-auto">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        <span className="text-[#182F73]">Xin chào</span>, bạn cần hỗ trợ gì?
                    </h1>
                    <Button variant="outline" onClick={handleFetchReport}>
                        <CloudDownload/>
                        Đồng bộ
                    </Button>
                </div>

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
                                <div key={idx}
                                     className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
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
                            {loading && <div className="text-sm text-gray-500">⏳ Đang xử lý...</div>}
                        </div>

                        <div className="flex items-center border rounded-lg px-2 py-1 mt-3 bg-white">
                            <Input
                                className="flex-1 border-none focus:ring-0"
                                placeholder="Nhập câu hỏi của bạn..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <Button className="ml-2" variant="primary" onClick={sendMessage} disabled={loading}>
                                Gửi
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </>
    );
};

export default ChatInterface;