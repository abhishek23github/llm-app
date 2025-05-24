import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatWindow = ({
  messages,
  input,
  loading,
  setInput,
  sendMessage,
  onKeyDown,
  animatedMessage,
  typingDot,
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl whitespace-pre-wrap text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-100 text-blue-900 self-end rounded-br-none"
                  : "bg-green-100 text-green-900 self-start rounded-bl-none"
              }`}
            >
              <div className="font-semibold mb-1">
                {msg.role === "user" ? "You" : "AI"}:
              </div>
              <ReactMarkdown
                children={msg.content}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeContent = String(children).replace(/\n$/, "");

                    if (!inline && match) {
                      return (
                        <div className="relative group">
                          <button
                            className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() =>
                              navigator.clipboard.writeText(codeContent)
                            }
                          >
                            Copy
                          </button>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              />
              {msg.role === "assistant" && msg.model && (
                <div className="text-xs text-gray-500 mt-2">
                  Model: {msg.model}
                </div>
              )}
            </div>
          </div>
        ))}

        {animatedMessage && (
          <div className="flex justify-start">
            <div className="bg-green-100 text-green-900 max-w-[75%] px-4 py-3 rounded-xl rounded-bl-none text-sm shadow-sm">
              <div className="font-semibold mb-1">AI:</div>
              <div className="whitespace-pre-wrap">{animatedMessage}</div>
            </div>
          </div>
        )}

        {loading && !animatedMessage && (
          <div className="text-green-500 font-mono text-lg animate-pulse">
            {typingDot}
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white dark:bg-gray-800 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 px-4 py-2 border rounded-l-md dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
