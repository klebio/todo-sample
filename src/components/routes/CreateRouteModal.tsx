import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const CreateRouteModal = ({ onRouteCreated }: { onRouteCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    ponto_encontro: '',
    destino: '',
    data_saida: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('routes').insert([formData]);

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Nova rota traçada! Avise a irmandade.');
      setOpen(false);
      onRouteCreated();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold rounded-xl">
          <Plus className="mr-2" size={18} /> Nova Rota
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase italic">Traçar Nova Rota</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Título da Missão</Label>
            <Input 
              required
              value={formData.titulo}
              onChange={e => setFormData({...formData, titulo: e.target.value})}
              className="bg-zinc-800 border-zinc-700 rounded-xl"
              placeholder="Ex: Bate e Volta Paranapiacaba"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ponto de Encontro</Label>
              <Input 
                required
                value={formData.ponto_encontro}
                onChange={e => setFormData({...formData, ponto_encontro: e.target.value})}
                className="bg-zinc-800 border-zinc-700 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input 
                required
                value={formData.destino}
                onChange={e => setFormData({...formData, destino: e.target.value})}
                className="bg-zinc-800 border-zinc-700 rounded-xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data e Hora de Saída</Label>
            <Input 
              type="datetime-local"
              required
              value={formData.data_saida}
              onChange={e => setFormData({...formData, data_saida: e.target.value})}
              className="bg-zinc-800 border-zinc-700 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Briefing (Descrição)</Label>
            <Textarea 
              value={formData.descricao}
              onChange={e => setFormData({...formData, descricao: e.target.value})}
              className="bg-zinc-800 border-zinc-700 rounded-xl min-h-[100px]"
              placeholder="Detalhes sobre paradas, ritmo e requisitos..."
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#4B5320] py-6 font-bold rounded-xl">
            {loading ? "Publicando..." : "Confirmar Rota"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRouteModal;