import { Container } from "@chakra-ui/layout";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import UpdateProfilePage from "./pages/UpdateProfilePage";

import Header from "./components/Header";
import getUserState from "./utils/getUserState";
import LogoutButton from "./components/LogoutButton";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { Box } from "@chakra-ui/react";

function App() {
  const user = getUserState();
  const {pathname} = useLocation();
  return (
    <Box position={"relative"} w="full">
      <Container maxW={pathname === "/" ? "900px" : "620px"}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/auth"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/update"
            element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
          />
          <Route
            path="/:username"
            element={
              user ? (
                <>
                  <UserPage /> <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route
            path="/chat"
            element={user ? <ChatPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
