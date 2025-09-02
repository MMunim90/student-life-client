import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router";
import { router } from './router/router.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthContext/Authprovider.jsx';
import "aos/dist/aos.css";
import Aos from "aos";

Aos.init();

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <div className="font-lexend">
            <RouterProvider router={router} />
          </div>
        </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
