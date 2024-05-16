import { Outlet , useNavigate } from "react-router-dom";
import {  useEffect } from "react";
const PublicRoutes =()=>{
    
   
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem('authToken')
  
      if (token) {
        navigate('/');
      } else {
        <Outlet />;
      } 
    }, [navigate]); 
  
    return <Outlet />;
}

export default PublicRoutes;