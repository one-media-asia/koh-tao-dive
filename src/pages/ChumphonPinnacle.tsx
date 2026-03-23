import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Redirects /ChumphonPinnacle to /dive-sites/chumphon-pinnacle
export default function RedirectChumphonPinnacle() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dive-sites/chumphon-pinnacle', { replace: true });
  }, [navigate]);
  return null;
}
