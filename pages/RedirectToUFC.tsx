import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function RedirectToUFC() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to UFC homepage
    navigate('/ufc');
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to UFC Fight Predictor...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
      </div>
    </div>
  );
}