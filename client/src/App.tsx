import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import { Toaster } from 'sonner';


const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={<Auth />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
        
              
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;