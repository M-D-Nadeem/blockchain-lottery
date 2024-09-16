import React from 'react'
import App from './App.jsx'
import './index.css'
import { MoralisProvider } from "react-moralis"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import ReactDOM from 'react-dom/client'
import {NotificationProvider} from "web3uikit"
const appRouter=createBrowserRouter([
   {
    path:"/",
    element:
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
    <App />
    </NotificationProvider>
     </MoralisProvider>
   }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={appRouter} />
)
