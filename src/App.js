import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import NoPage from "./pages/nopage";
import Layout from "./pages/layout";
import AuthRoutes from "./pages/PrivateRoutes";
import SignUp from "./pages/signup";
import PublicRoutes from "./pages/PublicRoutes";
import Logout from "./pages/logout";
import { createContext, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ModelContext = createContext();
function App() {
  const [model, setModel] = useState({
    modelName: "book",
    updateById:false,
    updateByName:false,
    updateByAuthor:false,
    inputName: false,
    inputId: false,
    name: false,
    modelNumber:0,
    inputAuthor: false,
    inputDescription: false,
    inputCategory:false,
    inputNoOfPages:false,
    inputPrice: false,
    inputReleaseDate: false,
    sortValues:null,
  });

  return (
    <>
      <ModelContext.Provider value={[model,setModel]}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route element={<PublicRoutes />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Route>
              <Route path="/" element={<AuthRoutes />}>
                <Route index element={<Home />} />
                <Route path="/logout" element={<Logout />} />
              </Route>
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModelContext.Provider >
      <ToastContainer />
    </>
  );
}

export default App;
