'use client';
import React, { useCallback, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Building2, ChevronRight, DollarSign, Boxes, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';
import Financeiro from '@/components/Financeiro';
import Suprimentos from '@/components/Suprimentos';
import Administracao from '@/components/Administracao';

const MODULOS = [
  { id: 'dashboard', label: 'Dashboard Executivo', icon: LayoutDashboard },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'suprimentos', label: 'Suprimentos', icon: Boxes },
  { id: 'administracao', label: 'Administração e Governança', icon: ShieldCheck },
];

export default function TorquatoERP() {
  const [session, setSession] = useState<Session | null>(null);
  const [verificando, setVerificando] = useState(true);

  const [modulo, setModulo] = useState('dashboard');
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [empresa, setEmpresa] = useState('');
  const [erroEmpresas, setErroEmpresas] = useState('');

  // Sessão do usuário
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setVerificando(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  // Empresas (só depois de logar)
  const carregarEmpresas = useCallback(async () => {
    const { data, error } = await supabase.from('empresas_erp').select('*').order('created_at', { ascending: true });
    if (error) {
      setErroEmpresas(error.message);
      return;
    }
    setErroEmpresas('');
    const lista = data || [];
    setEmpresas(lista);
    setEmpresa((atual) => (lista.some((e) => e.nome === atual) ? atual : lista[0]?.nome || ''));
  }, []);

  useEffect(() => {
    if (session) carregarEmpresas();
  }, [session, carregarEmpresas]);

  if (verificando) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs">Carregando...</div>;
  }
  if (!session) return <Login />;

  const semEmpresa = !empresa;

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      {/* HEADER */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg">TE</div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white block">TORQUATO ENGENHARIA</span>
              <span className="text-[10px] font-bold text-amber-500 block -mt-1">ERP Corporativo</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span className="text-slate-400">Empresa ativa:</span>
            <select
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
            >
              {empresas.length === 0 && <option value="">Nenhuma empresa</option>}
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.nome} className="bg-slate-900">
                  {emp.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden md:block text-slate-400">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 text-slate-200 rounded-xl font-bold cursor-pointer hover:bg-slate-700"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4">
          <nav className="space-y-1.5">
            <div className="px-3 py-1 text-[11px] font-bold text-slate-500">Módulos</div>
            {MODULOS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setModulo(id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  modulo === id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" /> {label}
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
          {erroEmpresas && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl p-3">
              Não foi possível carregar as empresas: {erroEmpresas}. Confira se rodou o arquivo supabase/schema.sql.
            </div>
          )}

          {semEmpresa && modulo !== 'administracao' ? (
            <div className="max-w-md mx-auto text-center space-y-3 pt-16">
              <p className="text-white font-bold">Nenhuma empresa cadastrada</p>
              <p className="text-xs text-slate-400">Cadastre a primeira empresa em Administração para liberar os módulos.</p>
              <button onClick={() => setModulo('administracao')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
                Ir para Administração
              </button>
            </div>
          ) : (
            <>
              {modulo === 'dashboard' && <Dashboard empresa={empresa} onIrFinanceiro={() => setModulo('financeiro')} />}
              {modulo === 'financeiro' && <Financeiro key={empresa} empresa={empresa} />}
              {modulo === 'suprimentos' && <Suprimentos key={empresa} empresa={empresa} />}
              {modulo === 'administracao' && (
                <Administracao empresas={empresas} email={session.user.email || ''} onAtualizar={carregarEmpresas} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
