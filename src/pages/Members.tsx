import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import Sidebar from '@/components/layout/Sidebar';
import { Shield, User as UserIcon } from 'lucide-react';

interface Member {
  id: string;
  nome: string;
  email: string;
  roles: { nome: string } | null;
}

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, nome, email, roles(nome)');
      
      if (!error && data) {
        setMembers(data as any);
      }
      setLoading(false);
    };
    fetchMembers();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Irmandade</h2>
          <p className="text-zinc-500">Membros ativos do Los Motokas MC.</p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-[#4B5320]">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">{member.nome}</h3>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-black text-[#4B5320]">
                    <Shield size={10} />
                    {member.roles?.nome || 'Prospect'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Members;