import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Sidebar from '@/components/layout/Sidebar';
import { Shield, Map, Users, Zap, Bell, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Announcement {
  id: string;
  titulo: string;
  conteudo: string;
  prioridade: string;
  created_at: string;
}

const Dashboard = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setAnnouncements(data);
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-white italic">
            Quartel General
          </h2>
          <p className="text-zinc-500 mt-2 text-lg">Status operacional do Los Motokas MC.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Mural */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 text-[#4B5320] font-black uppercase text-xs tracking-widest mb-2">
              <Bell size={16} /> Mural de Avisos
            </div>
            
            {announcements.map((ann) => (
              <div key={ann.id} className="bg-zinc-900 border-l-4 border-[#4B5320] p-6 rounded-r-2xl border-y border-r border-zinc-800">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {ann.prioridade === 'urgente' && <AlertTriangle size={18} className="text-red-500" />}
                    {ann.titulo}
                  </h3>
                  <span className="text-[10px] text-zinc-600 uppercase font-bold">
                    {format(new Date(ann.created_at), "dd MMM", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{ann.conteudo}</p>
              </div>
            ))}
          </div>

          {/* Coluna Lateral: Stats Rápidos */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-blue-500 mb-4"><Users /></div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Irmandade</p>
              <p className="text-2xl font-black text-white mt-1">42 Membros</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
              <div className="text-orange-500 mb-4"><Map /></div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Km Rodados</p>
              <p className="text-2xl font-black text-white mt-1">12.400 km</p>
            </div>
            <div className="bg-[#4B5320]/10 border border-[#4B5320]/30 p-6 rounded-2xl">
              <div className="text-[#4B5320] mb-4"><Shield /></div>
              <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">Status QG</p>
              <p className="text-2xl font-black text-white mt-1">Seguro</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;