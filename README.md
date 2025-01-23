# Realtime-Chat: MERN-Stack APP.

This project is a real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js).

---

### TOOLS

- VSCODE: https://code.visualstudio.com
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

- zustand: https://zustand.docs.pmnd.rs/getting-started/introduction

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
    node_modules/
    .env
    .env.sample
    .gitignore
    .http
    .http.sample
    package-lock.json
    package.json
frontend/
    node_modules/
    public/
    src/
        assets/
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

### Examples

##### API Endpoints

**GET**
`GET` `/api/messages`: Retrieves **_all messages_**
`GET` `/api/messages/:id`: Retrieves a **_specific_** message by ID
`GET` `/api/messages/unread`: Retrieves **_all unread_** messages
`GET` `/api/messages/user/:userId`: Retrieves all messages from a **_specific user_**

**POST**
`POST` `/api/messages/:personId`: Sends a new message to a **_specific person_**
`POST` `/api/messages/:groupChatId`: Sends a new message to a **_specific group-chat_**
`POST` `/api/messages/:id/read`: Marks a specific message **_as read_**

**UPDATE**
`PUT` `/api/messages/:id`: **_Updates_** a message by ID
`PATCH` `/api/messages/:id`: **_Partially updates_** a message by ID

**DELETE**
`DELETE` `/api/messages/:id`: Deletes a message **_by ID_**
`DELETE` `/api/messages/user/:userId`: Deletes **_all messages from a specific user_**

---
