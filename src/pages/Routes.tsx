import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import CreateRouteModal from '@/components/routes/CreateRouteModal';
import { MapPin, Calendar, Users, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { showSuccess, showError } from '@/utils/toast';

interface Route {
  id: string;
  titulo: string;
  ponto_encontro: string;
  destino: string;
  data_saida: string;
  status: string;
  descricao: string;
  participants: { profile_id: string }[];
}

const Routes = () => {
  const { user } = useAuth();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('routes')
      .select('*, participants:route_participants(profile_id)')
      .order('data_saida', { ascending: true });
    
    if (data) setRoutes(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const toggleParticipation = async (routeId: string, isParticipating: boolean) => {
    if (!user) return;

    if (isParticipating) {
      const { error } = await supabase
        .from('route_participants')
        .delete()
        .eq('route_id', routeId)
        .eq('profile_id', user.id);
      
      if (!error) {
        showSuccess('Inscrição cancelada.');
        fetchRoutes();
      }
    } else {
      const { error } = await supabase
        .from('route_participants')
        .insert([{ route_id: routeId, profile_id: user.id }]);
      
      if (error) showError('Erro ao confirmar presença.');
      else {
        showSuccess('Presença confirmada! Nos vemos no asfalto.');
        fetchRoutes();
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white italic">Próximas Rotas</h2>
            <p className="text-zinc-500 mt-2">Prepare sua máquina. O asfalto nos espera.</p>
          </div>
          <CreateRouteModal onRouteCreated={fetchRoutes} />
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {routes.map((route) => {
            const isParticipating = route.participants?.some(p => p.profile_id === user?.id);
            const participantCount = route.participants?.length || 0;

            return (
              <div key={route.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl hover:border-[#4B5320]/50 transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="px-2 py-1 bg-[#4B5320]/20 text-[#4B5320] text-[10px] font-black uppercase rounded tracking-widest">
                      {route.status}
                    </span>
                    <h3 className="text-2xl font-bold text-white">{route.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 bg-zinc-800/50 px-3 py-1 rounded-full text-xs font-bold">
                    <Users size={14} /> {participantCount} Pilotos
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[#4B5320]">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-zinc-600">Trajeto</p>
                      <p className="text-sm font-medium">{route.ponto_encontro} → {route.destino}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[#4B5320]">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-zinc-600">Partida</p>
                      <p className="text-sm font-medium">
                        {format(new Date(route.data_saida), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => toggleParticipation(route.id, isParticipating)}
                  className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest transition-all ${
                    isParticipating 
                    ? "bg-zinc-800 text-zinc-400 hover:bg-red-500/10 hover:text-red-500" 
                    : "bg-[#4B5320] text-white hover:bg-[#3a4119] shadow-lg shadow-[#4B5320]/20"
                  }`}
                >
                  {isParticipating ? (
                    <><CheckCircle2 className="mr-2" size={18} /> Confirmado</>
                  ) : (
                    "Confirmar Presença"
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Routes;