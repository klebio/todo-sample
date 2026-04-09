import React from 'react';

const AuthLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] p-4 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=2000" 
          alt="Motorcycle background" 
          className="w-full h-full object-cover grayscale"
        />
      </div>
      
      <div className="w-full max-w-md z-10">
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              Los Motokas <span className="text-[#4B5320]">MC</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-2 font-medium uppercase tracking-widest">{title}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;