import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return showError('As senhas não coincidem!');
    }

    if (!/\d/.test(formData.password)) {
      return showError('A senha deve conter pelo menos 1 número!');
    }

    setLoading(true);
    
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { nome: formData.nome }
      }
    });
    
    if (error) {
      showError(error.message);
      setLoading(false);
    } else {
      showSuccess('Recrutamento concluído! Bem-vindo ao clube.');
      navigate('/');
    }
  };

  return (
    <AuthLayout title="Ficha de Recrutamento">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-400">Nome Completo</Label>
          <Input 
            required 
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
            placeholder="Ex: João Silva"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-400">Email</Label>
          <Input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
            placeholder="seu@email.com"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-zinc-400">Senha</Label>
            <Input 
              type="password" 
              required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-400">Confirmar</Label>
            <Input 
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold py-6 rounded-xl mt-4"
        >
          {loading ? "Processando..." : <><UserPlus className="mr-2" size={18} /> Recrutar-se</>}
        </Button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Já é da irmandade? <Link to="/login" className="text-[#4B5320] font-bold hover:underline">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;