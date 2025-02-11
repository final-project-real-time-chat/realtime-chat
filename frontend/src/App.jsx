import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Register } from "./components/Register.jsx";
import { RegisterVerify } from "./components/RegisterVerify.jsx";
import { Login } from "./components/Login.jsx";
import { ChatArea } from "./components/ChatArea.jsx";
import { ExistChatroom } from "./components/ExistChatroom.jsx";
import { NewChatroom } from "./components/NewChatroom.jsx";
import { Chatroom } from "./components/Chatroom.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/register/verify"
          element={<RegisterVerify />}
        />
        <Route path="/chatarea" element={<ChatArea />} />
        <Route path="/chatarea/exist" element={<ExistChatroom />} />
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
