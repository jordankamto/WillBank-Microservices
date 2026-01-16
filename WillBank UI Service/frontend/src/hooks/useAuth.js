import { useSelector, useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/authSlice';
import { DEMO_EMPLOYEES } from '../constants/users';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  const login = (email, password) => {
    const employee = DEMO_EMPLOYEES.find(
      emp => emp.email === email && emp.password === password
    );
    
    if (employee) {
      dispatch(loginAction(employee));
      toast.success(`Bienvenue ${employee.firstName} !`);
      return true;
    } else {
      toast.error('Email ou mot de passe incorrect');
      return false;
    }
  };
  
  const logout = () => {
    dispatch(logoutAction());
    toast.success('Déconnexion réussie');
  };
  
  return { user, isAuthenticated, login, logout };
};