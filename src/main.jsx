import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login.jsx'
// import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import Chart from './Chart.jsx';
import Employee from './Employee.jsx';
import Adduser from './Adduser.jsx';
import Edituser from './Edituser.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // {
  //   path: "/Navbar",
  //   element: <Navbar />,
  // },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Chart",
    element: <Chart />,
  },
  {
    path: "/Employee",
    element: <Employee />,
  },
  {
    path: "/Adduser",
    element: <Adduser />,
  },
  {
    path: "/Edituser",
    element: <Edituser />,
  }
  


]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
