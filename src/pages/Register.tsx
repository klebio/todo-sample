import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({ nome: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
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
      showSuccess('Conta criada com sucesso!');
      navigate('/');
    }
  };

  return (
    <AuthLayout title="Criar nova conta" subtitle="Comece a organizar sua rotina hoje">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Nome Completo</Label>
          <Input 
            required 
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            className="rounded-xl border-slate-200"
            placeholder="João Silva"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700">Email</Label>
          <Input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="rounded-xl border-slate-200"
            placeholder="seu@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-700">Senha</Label>
          <Input 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="rounded-xl border-slate-200"
            placeholder="••••••••"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl mt-4"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><UserPlus className="mr-2" size={18} /> Cadastrar</>}
        </Button>

        <p className="text-center text-slate-500 text-sm mt-6">
          Já tem uma conta? <Link to="/login" className="text-blue-600 font-bold hover:underline">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;