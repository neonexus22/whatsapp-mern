import React from "react";
import "./ChatMessage.css";

function ChatMessage({ name, message, date, receiver }) {
  return (
    <div>
      <p className={`chat__message ${receiver}`}>
        <span className="chat__name">{name}</span>
        {message}
        <span className="chat__timestamp">{date}</span>
      </p>
    </div>
  );
}

export default ChatMessage;
