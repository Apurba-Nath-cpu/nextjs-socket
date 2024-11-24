import { useEffect, useState, FC, ChangeEvent, KeyboardEvent } from "react";
import io, { Socket } from "socket.io-client";

let socket: typeof Socket;

const Chat: FC = () => {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Array<[string, string, string]>>([]);
    const [userName, setuserName] = useState<string>("Unknown");

    useEffect(() => {
        const hasPrompted = localStorage.getItem("userName");

        if (!hasPrompted) {
            let localUserName = "Unknown";
            while (localUserName === "Unknown" || localUserName.trim() === "") {
                // Show the prompt until the user enters valid input
                const userInput = prompt("Please enter your name:")?.trim();
                if (userInput) {
                    localUserName = userInput;
                }
            }
    
            // Save the input to localStorage and update the state
            localStorage.setItem("userName", localUserName);
            setuserName(localUserName);
            alert(`Your name: "${localUserName}" has been saved!`);
        } else {
            // Load the username from localStorage if it exists
            setuserName(hasPrompted);
        }

        socket = io();

        socket.on("message", (payload) => {
            console.log("payload: ", payload);
            setMessages((prevMessages) => [[payload[0], payload[1], payload[2]], ...prevMessages]);
        });

        return () => {
            socket.disconnect();
        };
    }, [userName, messages]);

    const sendMessage = (): void => {
        if (message.trim() === "") return; // Prevent sending empty messages
        socket.emit("message", [message, userName, new Date().toLocaleTimeString()]);
        setMessages((prev) => [...prev, [message, "You", new Date().toLocaleTimeString()]]);
        setMessage("");
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setMessage(e.target.value);
    };

    const logOut = (): void => {
        localStorage.removeItem("userName");
        setuserName("Unknown");
        window.location.reload();
    };

    return (
        <div className="flex flex-col items-center" style={{ padding: "20px", border: "1px solid black" }}>
            <h2 className="flex flex-row justify-center my-4 text-[30px] font-bold">Live Chat</h2>
            <div className="flex flex-col">
                <input className="p-4 w-[250px] h-[40px] rounded-[20px]"
                    type="text"
                    value={message}
                    onChange={handleChange}
                    placeholder="Type a message"
                    onKeyDown={handleKeyDown}
                />
                <div className="my-2 w-[250px] flex flex-row justify-between">
                    <button className="w-[100px] px-4 h-[40px] rounded-[20px] bg-red-500 text-white" onClick={logOut}>
                        Logout
                    </button>
                    <button className="w-[140px] px-4 h-[40px] rounded-[20px] bg-blue-500 text-white" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
            <div className="mb-4 mt-16 text-[30px] font-bold">Messages</div>
            <div style={{ overflowY: "auto", marginBottom: "10px" }}>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <div className="text-lg my-4 flex flex-row">
                            <span>from </span>
                            <p className="ml-2 font-bold">{msg[1]}</p>
                        </div>
                        <div className="mt-2 px-8 w-min flex flex-row justify-space-between items-end py-4 rounded-[40px] bg-[#409a86] text-black gap-12">
                            <div className="text-lg">{msg[0]}</div>
                            <div className="text-xs sm:max-w-[200px] sm:overflow-x-auto sm:whitespace-nowrap">
                                {msg[2]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;
