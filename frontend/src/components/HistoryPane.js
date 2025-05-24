import React from "react";

const HistoryPane = ({ history, loadChat, deleteChat }) => {
  return (
    <div className="w-64 bg-gray-100 p-4 border-r shadow-md overflow-y-auto h-screen">
      <h2 className="text-lg font-semibold mb-4">Chat History</h2>
      {history.length === 0 && (
        <p className="text-sm text-gray-500">No saved chats yet.</p>
      )}
      {history.map((chat, idx) => (
        <div
          key={idx}
          className="flex flex-col mb-3 bg-white p-3 rounded shadow-sm hover:bg-gray-200 cursor-pointer w-full break-words"
        >
          <div
            onClick={() => loadChat(chat.id)}
            className="text-sm font-medium text-gray-900 break-words w-full"
          >
            <div className="text-sm font-medium truncate">
              {chat.title || "Untitled Chat"}
            </div>
            <div className="text-xs text-gray-500">
              {new Date(chat.timestamp).toLocaleString()}
            </div>
          </div>

          <button
            onClick={() => deleteChat(chat.id)}
            className="ml-2 text-red-500 text-sm hover:underline"
            title="Delete chat"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryPane;
