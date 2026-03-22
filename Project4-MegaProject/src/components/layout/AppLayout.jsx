import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import LoginModal from '../LoginModal';
import { useLoginModal } from '../../context/LoginModalContext';

function AppLayout() {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Outlet />
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default AppLayout;