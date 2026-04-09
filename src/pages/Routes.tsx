import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/layout/Sidebar';
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Route {
  id: string;
  titulo: string;
  ponto_encontro: string;
  destino: string;
  data_saida: string;
  status: string;
}

const Routes = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const { data } = await supabase.from('routes').select('*').order('data_saida', { ascending: true });
      if (data) setRoutes(data);
    };
    fetchRoutes();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Próximas Rotas</h2>
          <p className="text-zinc-500">Prepare sua máquina. O asfalto nos espera.</p>
        </header>

        <div className="space-y-4">
          {routes.map((route) => (
            <div key={route.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-[#4B5320] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#4B5320]/20 text-[#4B5320] text-[10px] font-black uppercase rounded">
                    {route.status}
                  </span>
                  <h3 className="text-xl font-bold text-white">{route.titulo}</h3>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-[#4B5320]" />
                    {route.ponto_encontro} → {route.destino}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-[#4B5320]" />
                    {format(new Date(route.data_saida), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                  </div>
                </div>
              </div>
              <button className="bg-zinc-800 hover:bg-[#4B5320] text-white p-3 rounded-xl transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Routes;