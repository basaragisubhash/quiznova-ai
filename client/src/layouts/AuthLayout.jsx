import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-400/20 blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px] animate-blob animation-delay-2000"></div>
      
      <div className="w-full max-w-6xl p-4 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
