import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut, CheckSquare, User } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 text-blue-600">
          <CheckSquare size={28} strokeWidth={2.5} />
          <h1 className="text-xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <User size={20} className="text-slate-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut} className="rounded-full text-slate-400 hover:text-red-500">
            <LogOut size={20} />
          </Button>
        </div>
      </header>
      <main className="flex-1 container max-w-5xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;