import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      showSuccess('Bem-vindo de volta, irmão!');
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) showError(error.message);
  };

  return (
    <AuthLayout title="Acesso ao QG">
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label className="text-zinc-400">Email</Label>
          <Input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white focus:ring-[#4B5320] focus:border-[#4B5320] rounded-xl"
            placeholder="seu@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-zinc-400">Senha</Label>
            <Link to="/forgot-password" class="text-xs text-[#4B5320] hover:underline">Esqueceu?</Link>
          </div>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white pr-10 rounded-xl"
              placeholder="••••••••"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold py-6 rounded-xl transition-all active:scale-95"
        >
          {loading ? "Autenticando..." : <><LogIn className="mr-2" size={18} /> Entrar</>}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Ou continue com</span></div>
        </div>

        <Button 
          type="button"
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 rounded-xl py-6"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-2" />
          Google
        </Button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Novo por aqui? <Link to="/register" className="text-[#4B5320] font-bold hover:underline">Recrute-se</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;