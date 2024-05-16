import { useNavigate } from "react-router-dom";

const useToken = () => {
    const navigate = useNavigate();
    
    const tokenInfo =  localStorage.getItem('authToken');
    if (!tokenInfo) return null;
    const { Token, expiry } =  JSON.parse(tokenInfo); 
    const tokenIsExpired = new Date().getTime() > expiry;
    
    if (tokenIsExpired) {
        localStorage.removeItem('authToken'); 
        navigate('/login');
        return null;
    }
    
    return Token;
};

export default useToken;