import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Routes } from 'react-router-dom'
import CryptoContext from './CryptoContext.jsx'
import CoinInfo from './pages/CoinInfo.jsx'
import Layout from './layout/Layout.jsx'
import Home from './pages/Home.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(<>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} /> {/* This means default route "/" */}
      <Route path="coin-info/:id" element={<CoinInfo />} />
    </Route>
  </>)
)

createRoot(document.getElementById('root')).render(
    <CryptoContext>
      <RouterProvider router={router} />
    {/* <App /> */}
    </CryptoContext>
 
)
