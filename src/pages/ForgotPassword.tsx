import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Se o email existir, enviamos as instruções!');
    }
    setLoading(false);
  };

  return (
    <AuthLayout title="Recuperar Acesso">
      <form onSubmit={handleReset} className="space-y-4">
        <p className="text-zinc-500 text-sm text-center mb-6">
          Enviaremos um link de resgate para o seu email cadastrado.
        </p>
        
        <div className="space-y-2">
          <Label className="text-zinc-400">Email</Label>
          <Input 
            type="email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white rounded-xl"
            placeholder="seu@email.com"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-[#4B5320] hover:bg-[#3a4119] text-white font-bold py-6 rounded-xl"
        >
          {loading ? "Enviando..." : <><Mail className="mr-2" size={18} /> Enviar Link</>}
        </Button>

        <Link to="/login" className="flex items-center justify-center text-zinc-500 text-sm hover:text-white transition-colors mt-6">
          <ArrowLeft size={14} className="mr-2" /> Voltar para o login
        </Link>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;