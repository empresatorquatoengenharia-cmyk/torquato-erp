'use client';
import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  HardHat, 
  Users, 
  Boxes, 
  ShieldCheck, 
  LogOut,
  PlusCircle,
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [userRole, setUserRole] = useState('admin');

  const modules = [
    { id: 'admin', name: 'Painel Administrativo', icon: ShieldCheck, roles: ['admin'] },
    { id: 'compras', name: 'Setor de Compras', icon: ShoppingCart, roles: ['admin', 'compras'] },
    { id: 'financeiro', name: 'Setor Financeiro', icon: DollarSign, roles: ['admin', 'financeiro'] },
    { id: 'engenharia', name: 'Setor de Engenharia', icon: HardHat, roles: ['admin', 'engenharia'] },
    { id: 'rh', name: 'Recursos Humanos', icon: Users, roles: ['admin', 'rh'] },
    { id: 'almoxarifado', name: 'Almoxarifado & Estoque', icon: Boxes, roles: ['admin', 'almoxarifado', 'engenharia'] },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar Lateral */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
            <Building2 className="w-8 h-8 text-amber-500" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Torquato ERP</h1>
              <p className="text-xs text-slate-400">Engenharia & Gestão</p>
            </div>
          </div>

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Selecione o Perfil:
          </div>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 p-2 rounded border border-slate-700 mb-6 focus:outline-none"
          >
            <option value="admin">Administrador (Acesso Total)</option>
            <option value="compras">Setor Compras</option>
            <option value="financeiro">Setor Financeiro</option>
            <option value="engenharia">Engenharia / Obras</option>
            <option value="rh">Recursos Humanos</option>
            <option value="almoxarifado">Almoxarife</option>
          </select>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveModule('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeModule === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" /> Visão Geral
            </button>

            {modules
              .filter(m => m.roles.includes(userRole))
              .map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeModule === m.id ? 'bg-slate-800 text-white font-semibold border-l-4 border-amber-500' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400" /> {m.name}
                  </button>
                );
              })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Perfil: <strong className="text-white uppercase">{userRole}</strong></span>
          <LogOut className="w-4 h-4 cursor-pointer hover:text-red-400 transition" />
        </div>
      </aside>

      {/* Área Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {activeModule === 'overview' ? 'Visão Geral da Empresa' : modules.find(m => m.id === activeModule)?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Torquato Engenharia Ltda — Sistema Interno de Gestão</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">Sistema Conectado</span>
          </div>
        </header>

        {/* Visão Geral / Dashboard */}
        {activeModule === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-500">Obras em Andamento</h3>
                  <HardHat className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">4</p>
                <p className="text-xs text-emerald-600 mt-2 font-medium">100% no prazo cronológico</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-500">Solicitações de Compra</h3>
                  <ShoppingCart className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">7</p>
                <p className="text-xs text-amber-600 mt-2 font-medium">Aguardando cotação / aprovação</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-slate-500">Estoque Crítico</h3>
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">2</p>
                <p className="text-xs text-rose-600 mt-2 font-medium">Insumos abaixo do estoque mínimo</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-md font-bold text-slate-800 mb-4">Ações Rápidas</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => setActiveModule('compras')} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-semibold rounded-lg hover:bg-amber-400 transition text-sm">
                  <PlusCircle className="w-4 h-4" /> Nova Cotação de Compra
                </button>
                <button onClick={() => setActiveModule('engenharia')} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-700 transition text-sm">
                  <FileText className="w-4 h-4" /> Diário de Obra (RDO)
                </button>
                <button onClick={() => setActiveModule('financeiro')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition text-sm border border-slate-300">
                  <TrendingUp className="w-4 h-4" /> Relatório Financeiro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visão de Módulos Específicos */}
        {activeModule !== 'overview' && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Módulo: {modules.find(m => m.id === activeModule)?.name}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Gestão operacional do setor para a empresa Torquato Engenharia Ltda.
            </p>
            <div className="p-6 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-center text-sm text-slate-500">
              Painel interativo em execução no ambiente oficial. <br />
              <span className="text-xs text-slate-400 mt-2 block">Nível de permissão ativo: <strong className="uppercase text-slate-700">{userRole}</strong></span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
