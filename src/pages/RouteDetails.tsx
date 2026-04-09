import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Users, MessageSquare, ArrowLeft, Send, Bike } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { showSuccess, showError } from '@/utils/toast';

interface RouteDetail {
  id: string;
  titulo: string;
  descricao: string;
  ponto_encontro: string;
  destino: string;
  data_saida: string;
  status: string;
}

interface Participant {
  profile: {
    nome: string;
    moto_modelo: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profile: {
    nome: string;
  };
}

const RouteDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [route, setRoute] = useState<RouteDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;

    const [routeRes, partRes, commRes] = await Promise.all([
      supabase.from('routes').select('*').eq('id', id).single(),
      supabase.from('route_participants').select('profile:profiles(nome, moto_modelo)').eq('route_id', id),
      supabase.from('route_comments').select('*, profile:profiles(nome)').eq('route_id', id).order('created_at', { ascending: true })
    ]);

    if (routeRes.data) setRoute(routeRes.data);
    if (partRes.data) setParticipants(partRes.data as any);
    if (commRes.data) setComments(commRes.data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !id) return;

    const { error } = await supabase.from('route_comments').insert([
      { route_id: id, profile_id: user.id, content: newComment }
    ]);

    if (error) showError('Erro ao enviar mensagem.');
    else {
      setNewComment('');
      fetchData();
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-[#4B5320] font-black">CARREGANDO MISSÃO...</div>;
  if (!route) return <div>Rota não encontrada.</div>;

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <button onClick={() => navigate('/routes')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors uppercase text-xs font-black tracking-widest">
          <ArrowLeft size={16} /> Voltar para Rotas
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal: Briefing e Chat */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
              <span className="px-2 py-1 bg-[#4B5320]/20 text-[#4B5320] text-[10px] font-black uppercase rounded tracking-widest mb-4 inline-block">
                {route.status}
              </span>
              <h2 className="text-4xl font-black text-white uppercase italic mb-6">{route.titulo}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-center gap-4 text-zinc-400">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#4B5320]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-zinc-600">Trajeto</p>
                    <p className="text-lg font-bold text-white">{route.ponto_encontro} → {route.destino}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-zinc-400">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-[#4B5320]">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-zinc-600">Partida</p>
                    <p className="text-lg font-bold text-white">
                      {format(new Date(route.data_saida), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-6">
                <h3 className="text-[#4B5320] font-black uppercase text-xs tracking-widest mb-4">Briefing da Missão</h3>
                <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">{route.descricao || 'Sem descrição detalhada.'}</p>
              </div>
            </section>

            {/* Mural de Coordenação */}
            <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center gap-2 text-white font-bold uppercase text-sm">
                <MessageSquare size={18} className="text-[#4B5320]" /> Mural de Coordenação
              </div>
              <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-zinc-800/50 p-4 rounded-2xl border border-zinc-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#4B5320] font-black text-[10px] uppercase">{comment.profile.nome}</span>
                      <span className="text-[10px] text-zinc-600">{format(new Date(comment.created_at), "HH:mm")}</span>
                    </div>
                    <p className="text-zinc-300 text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendComment} className="p-4 bg-zinc-950 border-t border-zinc-800 flex gap-2">
                <Input 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escreva para a irmandade..."
                  className="bg-zinc-900 border-zinc-800 rounded-xl"
                />
                <Button type="submit" className="bg-[#4B5320] hover:bg-[#3a4119] rounded-xl px-6">
                  <Send size={18} />
                </Button>
              </form>
            </section>
          </div>

          {/* Coluna Lateral: Pilotos Confirmados */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
              <h3 className="text-white font-black uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                <Users size={16} className="text-[#4B5320]" /> Comboio ({participants.length})
              </h3>
              <div className="space-y-4">
                {participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-xl border border-zinc-800">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-[#4B5320]">
                      <Bike size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.profile.nome}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-medium">{p.profile.moto_modelo || 'Sem moto cadastrada'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RouteDetails;