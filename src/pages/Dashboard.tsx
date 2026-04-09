import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Shield, Map, Users, Zap } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="py-12 border-b border-zinc-800 mb-12">
          <div className="inline-block p-3 bg-[#4B5320]/20 rounded-full mb-6">
            <Shield className="text-[#4B5320]" size={48} />
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic">
            Quartel General
          </h2>
          <p className="text-zinc-500 mt-4 max-w-xl text-lg">
            Bem-vindo ao centro de comando do Los Motokas MC. Honra, Lealdade e Respeito.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Membros Ativos', value: '42', icon: <Users />, color: 'text-blue-500' },
            { label: 'Km Rodados', value: '12.400', icon: <Map />, color: 'text-orange-500' },
            { label: 'Próxima Rota', value: 'Em 5 dias', icon: <Zap />, color: 'text-yellow-500' },
            { label: 'Status do QG', value: 'Seguro', icon: <Shield />, color: 'text-[#4B5320]' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className={stat.color + " mb-4"}>{stat.icon}</div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">{stat.label}</p>
              <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;