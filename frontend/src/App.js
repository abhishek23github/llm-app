import React, { useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import HistoryPane from "./components/HistoryPane";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("gpt-3.5-turbo");
  const [provider, setProvider] = useState("openai");
  const [history, setHistory] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [animatedMessage, setAnimatedMessage] = useState("");
  const [typingDot, setTypingDot] = useState("⠋");
  const [currentChatId, setCurrentChatId] = useState(null);

  const MODELS = {
    openai: [
      { label: "GPT-3.5 Turbo (Fast, 4K tokens)", value: "gpt-3.5-turbo" },
      { label: "GPT-4 (Slow, High Quality)", value: "gpt-4" },
      { label: "GPT-4 Turbo (Faster, 128K tokens)", value: "gpt-4-turbo" },
    ],
    huggingface: [
      { label: "Flan-T5 Small (Fast, Tiny)", value: "google/flan-t5-small" },
      { label: "Falcon RW 1B (Slow, Stronger)", value: "tiiuae/falcon-rw-1b" },
      { label: "GPT2 (Old, Fast)", value: "gpt2" },
    ],
    local: [{ label: "Mock Local Model (Fast, offline)", value: "local-mock" }],
  };

  useEffect(() => {
    const saved = localStorage.getItem("chatHistory");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveCurrentChat = (newMessages) => {
    let updated = [...history];

    if (currentChatId) {
      updated = updated.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat
      );
    } else {
      const summary = newMessages
        .find((m) => m.role === "user")
        ?.content?.slice(0, 50);
      const newChat = {
        id: uuidv4(),
        title: summary || "New Chat",
        timestamp: Date.now(),
        messages: newMessages,
      };
      updated = [newChat, ...history];
      setCurrentChatId(newChat.id);
    }

    setHistory(updated);
    localStorage.setItem("chatHistory", JSON.stringify(updated));
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    // Typing Dots Spinner
    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;
    const dotInterval = setInterval(() => {
      setTypingDot(frames[i % frames.length]);
      i++;
    }, 100);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          provider,
          model,
        }),
      });
      const data = await res.json();

      let currentText = "";
      const finalText = data.response;
      let j = 0;

      const animate = () => {
        if (j < finalText.length) {
          currentText += finalText[j];
          setAnimatedMessage(currentText);
          j++;
          setTimeout(animate, 15);
        } else {
          const newMessages = [
            ...updatedMessages,
            { role: "assistant", content: finalText, model },
          ];
          setMessages(newMessages);
          setAnimatedMessage("");
          saveCurrentChat(newMessages);
          clearInterval(dotInterval);
        }
      };
      animate();
    } catch (err) {
      clearInterval(dotInterval);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Error: Could not reach backend.",
          model,
        },
      ]);
    }

    setLoading(false);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
    setMessages([]);
  };

  const startNewChat = () => {
    setMessages([]);
    setInput("");
    setAnimatedMessage("");
    setCurrentChatId(null);
  };

  const loadChat = (chatId) => {
    const found = history.find((c) => c.id === chatId);
    if (found) {
      setMessages(found.messages);
      setCurrentChatId(chatId);
    }
  };

  const deleteChat = (chatId) => {
    const filtered = history.filter((c) => c.id !== chatId);
    setHistory(filtered);
    localStorage.setItem("chatHistory", JSON.stringify(filtered));
  };

  return (
    <div className="flex h-screen font-sans bg-gray-100 overflow-hidden">
      {showSidebar && (
        <HistoryPane
          history={history}
          loadChat={loadChat}
          deleteChat={deleteChat}
        />
      )}

      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        <div className="p-4 bg-white shadow flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              {showSidebar ? "Hide" : "Show"} History
            </button>
            <button
              onClick={startNewChat}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              + New Chat
            </button>
          </div>

          <label className="text-sm">
            <b>Provider:</b>&nbsp;
            <select
              value={provider}
              onChange={(e) => {
                const selectedProvider = e.target.value;
                setProvider(selectedProvider);
                setModel(MODELS[selectedProvider][0].value);
              }}
              className="border px-2 py-1 ml-1 mr-4 rounded text-black"
            >
              <option value="openai">OpenAI</option>
              <option value="huggingface">Hugging Face</option>
              <option value="local">Local</option>
            </select>
            <b>Model:</b>&nbsp;
            <select
              value={model}
              onChange={handleModelChange}
              className="border px-2 py-1 ml-1 rounded text-black"
            >
              {MODELS[provider].map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ChatWindow
          messages={messages}
          input={input}
          loading={loading}
          setInput={setInput}
          sendMessage={sendMessage}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          animatedMessage={animatedMessage}
          typingDot={typingDot}
        />
      </div>
    </div>
  );
};

export default App;
