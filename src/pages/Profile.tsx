import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bike, User, Phone, Save } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    nome: '',
    telefone: '',
    moto_modelo: '',
    moto_ano: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('nome, telefone, moto_modelo, moto_ano')
        .eq('id', user.id)
        .single();
      
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user?.id);

    if (error) showError(error.message);
    else showSuccess('Ficha de piloto atualizada!');
    setSaving(false);
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Minha Ficha</h2>
          <p className="text-zinc-500">Mantenha seus dados e os de sua máquina atualizados.</p>
        </header>

        <div className="max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  <User size={14} /> Nome de Guerra
                </Label>
                <Input 
                  value={profile.nome}
                  onChange={e => setProfile({...profile, nome: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-400 flex items-center gap-2">
                  <Phone size={14} /> Telefone de Emergência
                </Label>
                <Input 
                  value={profile.telefone}
                  onChange={e => setProfile({...profile, telefone: e.target.value})}
                  className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-[#4B5320] font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                <Bike size={16} /> Dados da Máquina
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Modelo da Moto</Label>
                  <Input 
                    value={profile.moto_modelo}
                    onChange={e => setProfile({...profile, moto_modelo: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
                    placeholder="Ex: Harley Davidson Fat Boy"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Ano</Label>
                  <Input 
                    value={profile.moto_ano}
                    onChange={e => setProfile({...profile, moto_ano: e.target.value})}
                    className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
                    placeholder="Ex: 2023"
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={saving}
              className="w-full bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold py-6 rounded-xl"
            >
              {saving ? "Salvando..." : <><Save className="mr-2" size={18} /> Atualizar Ficha</>}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;