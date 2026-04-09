import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Shield, Map, Users } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <nav className="border-b border-zinc-800 p-4 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-xl font-black tracking-tighter uppercase italic">
          Los Motokas <span className="text-[#4B5320]">MC</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-xs text-zinc-500 hidden md:block">{user?.email}</span>
          <Button 
            variant="ghost" 
            onClick={signOut}
            className="text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-full"
          >
            <LogOut size={18} />
          </Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="py-12 text-center space-y-4">
          <div className="inline-block p-3 bg-[#4B5320]/20 rounded-full mb-4">
            <Shield className="text-[#4B5320]" size={48} />
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight">Bem-vindo ao QG, Irmão.</h2>
          <p className="text-zinc-500 max-w-md mx-auto">Você está em solo seguro. Aqui o respeito e a irmandade são a nossa única lei.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <Map />, title: "Rotas", desc: "Próximos destinos do clube" },
            { icon: <Users />, title: "Irmandade", desc: "Lista de membros ativos" },
            { icon: <Shield />, title: "Estatuto", desc: "Regras e conduta do MC" }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-[#4B5320] transition-all group cursor-pointer">
              <div className="text-[#4B5320] mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;