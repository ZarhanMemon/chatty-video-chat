
# 🗨️ Chatty - Real-Time Chat App (Using GetStream.io)

**Chatty** is a full-stack real-time chat application built using **GetStream.io** on the frontend and **Node.js/Express** on the backend. It allows users to communicate instantly in a clean, responsive UI — similar to WhatsApp or Messenger.

---

## ✅ Features (Current Version)

- 🔐 **User Authentication** – Login & Logout  
- 🧑‍🤝‍🧑 **Friend System**
  - Send Friend Requests  
  - Accept/Reject Requests  
  - Follow Other Users  
  - Get Notifications for Incoming Requests  
- 🟢 **User Presence**
  - See Online/Offline Status  
  - Typing Indicators  
- 💬 **1-on-1 Real-Time Chat**
  - Built with GetStream.io (no manual socket setup)  
  - Read Receipts & Timestamps  
- 👤 **User Profile Management**
  - Edit Profile Picture  
  - Edit Display Name  
- 📱 **Fully Responsive UI** – Mobile and Desktop friendly  

---

## 🚀 Upcoming Features (Coming Soon)

- 👥 Group Chat Support  
- 🌙 Theme Changing (Light/Dark Mode)  

---

## 📁 Folder Structure

```

chatty/
├── frontend/               # Frontend (React + Stream)
│   ├── components/         # Main UI components (ChatBox, Sidebar, etc.)
│   ├── sub\_components/     # Reusable smaller UI elements
│   ├── lib/                # Utility functions or helpers
│   ├── store/              # State management (Zustand)
│   └── App.jsx             # Root React component
│
├── backend/                # Backend (Node.js/Express)
│   ├── controllers/        # Route logic (e.g., user or chat controllers)
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, error handling, etc.
│   ├── models/             # MongoDB Mongoose models
│   └── index.js            # Entry point for backend server

````

---

## 🛠 Tech Stack

| Part         | Technology                              |
|--------------|-----------------------------------------|
| Frontend     | React, Tailwind CSS                     |
| Chat API     | GetStream.io (stream, stream-chat)      |
| Backend      | Node.js, Express                        |
| Database     | MongoDB (Mongoose)                      |
| State Mgmt   | Zustand                                 |
| Auth         | JWT / Custom Middleware                 |
| API Mgmt     | Axios                                   |
| Other npm    | toaster, bcryptjs, cors, cloudinary, cookie-parser |

---

## ⚙️ How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ZarhanMemon/chatty-video-chat.git
cd chatty-video-chat
````

### 2. Set Up Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_STREAM_API_KEY=your_stream_key
VITE_STREAM_APP_ID=your_app_id
```

Then run:

```bash
npm run dev
```

### 3. Set Up Backend

```bash
cd ../backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
```

Then run:

```bash
node index.js
```

Visit [http://localhost:5173](http://localhost:5173) to see the frontend.

---

## 📸 Screenshots

### 💬 Desktop Chat View

![Desktop Chat](./screenshots/chat-desktop.png)

### 📱 Mobile Chat View

![Mobile Chat](./screenshots/chat-mobile.png)

> Add your images in the `screenshots/` folder in root.

---

## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

> Upload your demo to YouTube and replace `YOUR_VIDEO_ID` with the actual video ID.

---

## 🙏 Credits

Thanks to:

* [GetStream.io](https://getstream.io/)
* [MongoDB](https://www.mongodb.com/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## 📄 License

This project is licensed under the **MIT License**.

