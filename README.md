# Realtime-Chat: MERN-Stack APP.

This project is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).

###### Estimated read time: 3 minutes

---

### TOOLS

- VSCODE: https://code.visualstudio.com
  - **Team members: synchronize ALL extensions**
- GITHUB: https://github.com
- GOOGLE-MEET: https://meet.google.com
- TRELLO: https://trello.com
- SLACK: https://slack.com

---

### USED TECHNOLOGIES

##### FRONTEND

- VITE - react.js: https://vite.dev/guide

```bash
npm create vite@latest
```

```bash
npm i zustand socket.io-client
```

- zustand: https://zustand.docs.pmnd.rs/getting-started/introduction
- socket.io-client: https://socket.io/docs/v4/client-installation/

##### CSS - STYLES

- tailwind: https://tailwindcss.com/docs/installation/using-vite
- daisyUI: https://daisyui.com
- react-toastUI: https://react-hot-toast.com

##### BACKEND - node.js:

```bash
npm i express cors dotenv mongoose bcrypt jsonwebtoken cookie-parser cloudinary socket.io && npm i -D nodemon
```

- express: https://expressjs.com
- cors: https://www.npmjs.com/package/cors
- dotenv: https://www.npmjs.com/package/dotenv
- mongoose: https://mongoosejs.com
- bcrypt: https://www.npmjs.com/package/bcrypt
- jwt: https://www.npmjs.com/package/jsonwebtoken
- cookie-parser: https://www.npmjs.com/package/cookie-parser
- cloudinary: https://cloudinary.com
- socket.io: https://socket.io
- nodemon: https://www.npmjs.com/package/nodemon

##### DATABASE - mongoDB: https://cloud.mongodb.com

---

### Installation

##### Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm run dev
```

### Frontend

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

---

### Directory Structure

```plaintext
backend/
    node_modules/...
    .env
    .env.sample
    .gitignore
    .http
    .http.sample
    middlewares/
        authMiddleware.js
    models/
        userModel.js
        messageModel.js
    routes/
        userRouter.js
        messageRouter.js
    schemas/
        userSchema.js
        messageSchema.js
    services/
        userService.js
    utils/
        logger.js
    package-lock.json
    package.json
    server.js

frontend/
    node_modules/...
    public/
        favicon.ico
    src/
        assets/
            avatar.png
        components/
            Chat/
                ChatBox.jsx
                ChatInput.jsx
            Auth/
                Login.jsx
                Register.jsx
        contexts/
            AuthContext.jsx
        hooks/
            useAuth.js
            useChat.js
        pages/
            Home.jsx
            ChatRoom.jsx
        services/
            api.js
        App.css
        App.jsx
        index.css
        main.jsx
    .env
    .env.sample
    .gitignore
    eslint.config.js
    index.html
    package-lock.json
    package.json
    vite.config.js

README.md
```

---

### Environment Variables

Create a `.env` file in both the **backend** and **frontend** directories based on the `.env.sample` files and add the necessary environment variables.

---

### Usage

After installing and starting the application, you can access the chat application in your browser **(Frontend)** at

```bash
http://localhost:3000
```

and **(Backend)** at

```bash
http://localhost:5000
```

---

##### API Endpoints for Frontend

**GET**
`GET` `/messages`: Retrieves **_all messages_**
`GET` `/messages/:id`: Retrieves a **_specific_** message by ID
`GET` `/messages/unread`: Retrieves **_all unread_** messages
`GET` `/messages/user/:userId`: Retrieves all messages from a **_specific user_**

**POST**
`POST` `/messages/:personId`: Sends a new message to a **_specific person_**
`POST` `/messages/:groupChatId`: Sends a new message to a **_specific group-chat_**
`POST` `/messages/:id/read`: Marks a specific message **_as read_**

**UPDATE**
`PUT` `/messages/:id`: **_Updates_** a message by ID
`PATCH` `/messages/:id`: **_Partially updates_** a message by ID

**DELETE**
`DELETE` `/messages/:id`: Deletes a message **_by ID_**
`DELETE` `/messages/user/:userId`: Deletes **_all messages from a specific user_**

---

##### API Endpoints for Backend

**GET**
`GET` `/api/messages`: Retrieves **_all messages_**
`GET` `/api/messages/user/:userId`: Retrieves all messages from a **_specific user_**
*** FEATURE ***
`GET` `/api/messages/unread`: Retrieves **_all unread_** messages

**POST**
`POST` `/api/messages/:chatId`: Sends a new message to a **_specific person_**
*** FEATURE ***
`POST` `/api/messages/:groupChatId`: Sends a new message to a **_specific group-chat_**
`POST` `/api/messages/:id/read`: Marks a specific message **_as read_**

**UPDATE**
`PATCH` `/api/messages/:id`: **_Partially updates_** a message by ID

**DELETE**
`DELETE` `/api/users/:id`: Deletes user account **_by ID_**
*** FEATURE ***
`DELETE` `/api/messages/:id`: Deletes a message **_by ID_**
`DELETE` `/api/messages/user/:userId`: Deletes **_all messages from a specific user_**

---
