'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { inputCls, ErrorBox } from './ui';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [entrando, setEntrando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setEntrando(true);
    setErro('');
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) setErro('E-mail ou senha incorretos.');
    setEntrando(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 pb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
            TE
          </div>
          <div>
            <p className="font-bold text-white text-sm">TORQUATO ENGENHARIA</p>
            <p className="text-[11px] text-amber-500 font-bold">ERP Corporativo</p>
          </div>
        </div>

        <input
          type="email"
          required
          autoComplete="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
        <input
          type="password"
          required
          autoComplete="current-password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className={inputCls}
        />

        <ErrorBox message={erro} />

        <button
          type="submit"
          disabled={entrando}
          className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer disabled:opacity-60"
        >
          {entrando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
