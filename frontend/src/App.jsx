import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login.jsx";
import { Register } from "./components/Register.jsx";
import { ChatArea } from "./components/ChatArea.jsx";
import { Chatroom } from "./components/Chatroom.jsx";
import { NewChatroom } from "./components/NewChatroom.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatarea" element={<ChatArea />} />
        <Route path="/chatarea/chats/:id" element={<Chatroom />} />
        <Route
          path="/chatarea/chats/new-chatroom/:id"
          element={<NewChatroom />}
        />
      </Routes>
    </Router>
  );
}

export default App;
