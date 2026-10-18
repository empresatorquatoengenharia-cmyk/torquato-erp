'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  HardHat, 
  Users, 
  Boxes, 
  ShieldCheck, 
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  TrendingDown,
  ChevronRight,
  Search,
  Bell,
  SlidersHorizontal,
  LayoutDashboard,
  FileSpreadsheet
} from 'lucide-react';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function KoperStyleDashboard() {
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados do Supabase
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados dos Modais
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);

  // Formulário Compras
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [urgency, setUrgency] = useState('media');
  const [observation, setObservation] = useState('');
  const [items, setItems] = useState([{ item_name: '', quantity: 1, unit: 'un' }]);

  // Formulário Financeiro
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchRequests();
    fetchFinancials();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*');
    if (data) setProjects(data);
  }

  async function fetchRequests() {
    const { data } = await supabase
      .from('purchase_requests')
      .select('*, projects(name), purchase_request_items(*)')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
  }

  async function fetchFinancials() {
    setLoading(true);
    const { data } = await supabase
      .from('financeiro_lancamentos')
      .select('*, projects!obra_id(name)')
      .order('created_at', { ascending: false });
    if (data) setFinancials(data);
    setLoading(false);
  }

  // Ações de formulários
  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !projectId) return alert('Preencha título e obra!');
    setLoading(true);
    const { data, error } = await supabase.from('purchase_requests').insert([
      { title, project_id: projectId, urgency, observation, status: 'pendente' }
    ]).select();

    if (!error && data) {
      const requestId = data[0].id;
      const formattedItems = items
        .filter(i => i.item_name.trim() !== '')
        .map(i => ({ request_id: requestId, item_name: i.item_name, quantity: i.quantity, unit: i.unit }));
      if (formattedItems.length > 0) {
        await supabase.from('purchase_request_items').insert(formattedItems);
      }
      setTitle('');
      setObservation('');
      setItems([{ item_name: '', quantity: 1, unit: 'un' }]);
      setShowPurchaseModal(false);
      fetchRequests();
    }
    setLoading(false);
  }

  async function handleSubmitFinancial(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finProject || !finValue) return alert('Preencha os campos obrigatórios!');
    setLoading(true);

    const { error } = await supabase.from('financeiro_lancamentos').insert([
      {
        descricao: finDesc,
        obra_id: finProject,
        tipo: finType,
        valor: parseFloat(finValue),
        status: 'pendente'
      }
    ]);

    if (!error) {
      setFinDesc('');
      setFinValue('');
      setShowFinModal(false);
      fetchFinancials();
    }
    setLoading(false);
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const nextStatus = currentStatus === 'pago' ? 'pendente' : 'pago';
    await supabase.from('financeiro_lancamentos').update({ status: nextStatus }).eq('id', id);
    fetchFinancials();
  }

  const totalPendente = financials
    .filter(f => f.status === 'pendente')
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  const totalPago = financials
    .filter(f => f.status === 'pago')
    .reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      {/* 1. HEADER TOPO FIXO (ESTILO KOPER ERP) */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-7 h-7 text-amber-500" />
            <div>
              <span className="font-bold text-base text-white tracking-wide">TORQUATO</span>
              <span className="text-xs font-semibold text-amber-500 block -mt-1">ERP ENGENHARIA</span>
            </div>
          </div>

          {/* Filtro de Obra Ativa no Topo */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <HardHat className="w-4 h-4 text-amber-500" />
            <span className="text-slate-400">Obra Ativa:</span>
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="todas" className="bg-slate-900">Todas as Obras (Visão Geral)</option>
              {projects.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Busca Global e Usuário */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Buscar contrato, insumo ou lançamento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <div className="relative">
            <Bell className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
          </div>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              TE
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-semibold text-white leading-tight">Torquato Engenharia</p>
              <p className="text-slate-400 text-[10px]">Administrador</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. SIDEBAR LATERAL DE NAVEGAÇÃO KOPER */}
        <aside className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3">
          <nav className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Módulos Principais
            </div>

            <button
              onClick={() => setActiveModule('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeModule === 'overview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" /> Visão Geral
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveModule('compras')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeModule === 'compras' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" /> Suprimentos / Compras
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveModule('financeiro')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-4 h-4" /> Financeiro & Obras
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveModule('engenharia')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeModule === 'engenharia' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <HardHat className="w-4 h-4" /> Engenharia & RDO
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setActiveModule('almoxarifado')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                activeModule === 'almoxarifado' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Boxes className="w-4 h-4" /> Estoque & Insumos
              </div>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </nav>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Torquato v1.0</span>
            <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
          </div>
        </aside>

        {/* 3. ÁREA DE CONTEÚDO PAINEL KOPER */}
        <main className="flex-1 bg-slate-900 overflow-y-auto p-6 text-slate-200">
          
          {/* MÓDULO VISÃO GERAL */}
          {activeModule === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Painel de Controle — Torquato ERP</h1>
                  <p className="text-xs text-slate-400 mt-1">Visão consolidada das obras, compras e fluxo financeiro</p>
                </div>
              </div>

              {/* CARDS ESTILO KOPER */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">OBRAS EM ANDAMENTO</span>
                    <HardHat className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{projects.length}</p>
                  <span className="text-[10px] text-emerald-400 font-medium">Controle de Cronograma</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">COTAÇÕES DE COMPRA</span>
                    <ShoppingCart className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">{requests.length}</p>
                  <span className="text-[10px] text-amber-400 font-medium">Aguardando Fornecedor</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">CONTAS A PAGAR</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">
                    R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-slate-400">Lançamentos em aberto</span>
                </div>

                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400">TOTAL QUITADO</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-2xl font-bold text-white mt-2">
                    R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-emerald-400 font-medium">Baixas realizadas</span>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO DE COMPRAS */}
          {activeModule === 'compras' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h1 className="text-xl font-bold text-white">Gestão de Suprimentos & Compras</h1>
                  <p className="text-xs text-slate-400 mt-1">Solicitações de cotação e compras para obras (Padrão Koper)</p>
                </div>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="
