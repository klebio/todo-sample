import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      showError(error.message);
      setLoading(false);
    } else {
      showSuccess('Bem-vindo de volta!');
      navigate('/');
    }
  };

  return (
    <AuthLayout title="Entrar na sua conta" subtitle="Acesse suas tarefas e projetos">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-700">Email</Label>
          <Input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-blue-500"
            placeholder="seu@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-slate-700">Senha</Label>
          <Input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border-slate-200 focus:ring-blue-500"
            placeholder="••••••••"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl transition-all"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2" size={18} /> Entrar</>}
        </Button>

        <p className="text-center text-slate-500 text-sm mt-6">
          Não tem uma conta? <Link to="/register" className="text-blue-600 font-bold hover:underline">Criar conta</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;