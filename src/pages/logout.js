
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    localStorage.removeItem('authToken');
    const navigate = useNavigate();
    navigate('/login');
}

export default Logout;