import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./components/HomePage.jsx";
import SignUpPage from "./components/SignupPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import ChatPage from "./components/ChatPage.jsx";
import CallPage from "./components/CallPage.jsx";
import LayOut from "./components/Layout.jsx";
import NotificationPage from "./components/NotificationPage.jsx";

const App = () => {
  const { authUser, authCheck, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    authCheck();
  }, [authCheck]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={true}>
                <HomePage showRecommendFriend={true} />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/friends"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={true}>
                <HomePage showRecommendFriend={false} />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />


        <Route
          path="/notifications"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={true}>
                <NotificationPage />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/friend"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={true}>
                <HomePage showRecommendFriend={false} />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={true}>
                <ChatPage />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            authUser && !isCheckingAuth ? (
              <LayOut showSidebar={false}>
                <CallPage />
              </LayOut>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>



      <Toaster />
    </div>
  );
};

export default App;
