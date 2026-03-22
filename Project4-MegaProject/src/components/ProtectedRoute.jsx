import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { openLoginModal } = useLoginModal();
  const hasOpenedModal = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasOpenedModal.current) {
      openLoginModal();
      hasOpenedModal.current = true;
    }
  }, [isAuthenticated, openLoginModal]);

  if (!isAuthenticated) {
    return null;
  }

  // Reset the modal flag when user authenticates
  if (isAuthenticated) {
    hasOpenedModal.current = false;
  }

  return children;
}