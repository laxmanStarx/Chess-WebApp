import { useEffect, useState } from "react";

const Chatt = ({ isEnabled }: { isEnabled: boolean }) => {
  const [socket, setSocket] = useState<any>(null);
  const [latestMessage, setLatestMessage] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    socket.onopen = () => {
      console.log("connected");
      setSocket(socket);
    };
    socket.onmessage = (message) => {
      console.log("Received message:", message.data);
      setLatestMessage(message.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  if (!socket) {
    return <div>Connecting to socket server...</div>;
  }

  return (
    <>
      <input
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isEnabled} // Disable input if game hasn't started
        placeholder={isEnabled ? "Type a message" : ""}
      />
      <button
        onClick={() => {
          if (isEnabled) {
            socket.send(message);
          }
        }}
        disabled={!isEnabled} // Disable button if game hasn't started
      >
        Send
      </button>
      <div className="text-white">{latestMessage}</div>
    </>
  );
};

export default Chatt;
