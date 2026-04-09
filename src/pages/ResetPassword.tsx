import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\d/.test(password)) return showError('A senha deve conter pelo menos 1 número!');
    
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      showError(error.message);
      setLoading(false);
    } else {
      showSuccess('Senha atualizada com sucesso!');
      navigate('/login');
    }
  };

  return (
    <AuthLayout title="Nova Senha">
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-400">Nova Senha</Label>
          <Input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
            placeholder="••••••••"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold py-6 rounded-xl"
        >
          {loading ? "Atualizando..." : <><Key className="mr-2" size={18} /> Definir Senha</>}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;