import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login.jsx";
import { Register } from "./components/Register.jsx";
import { ChatArea } from "./components/ChatArea.jsx";
import { Chatroom } from "./components/Chatroom.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chatarea" element={<ChatArea />} />
        <Route path="/chatarea/chats/:id" element={<Chatroom />} />
      </Routes>
    </Router>
  );
}

export default App;
