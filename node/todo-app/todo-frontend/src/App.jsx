import Home from "./components/Home"; 
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ErrorPage from "./components/Error"; 
import Header from "./components/Header";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminTodoManager from "./components/Admin"; 
import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { TodoItemsContext } from "./store/todo-items-store";

function App() {
  const { isLoggedIn, loadingAuth } = useContext(TodoItemsContext);

  return (
    <center>
      <Header /> 

      {loadingAuth ? (
        <div className="flex h-screen w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Routes>
          {/* Student Protected Feed */}
          <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
          
          {/* Auth Gate Pipelines */}
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!isLoggedIn ? <SignUp /> : <Navigate to="/" replace />} />
          
          {/* Admin Control Dashboard Route */}
          <Route path="/admin" element={<AdminTodoManager />} />

          {/* Fallback Catch-All Error boundary */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      )}
    </center>
  );
}

export default App;