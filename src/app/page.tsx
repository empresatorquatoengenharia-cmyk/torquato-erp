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
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  LayoutDashboard,
  X
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function KoperStyleDashboard() {
  const [activeModule, setActiveModule] = useState('financeiro');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);

  // Formulário Compras
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [urgency, setUrgency] = useState('media');
  const [observation, setObservation] = useState('');
  const [items, setItems] = useState([{ item_name: '', quantity: 1, unit: 'un' }]);

  // Formulário Financeiro Completo
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');

  useEffect(() => {
    fetchProjects();
    fetchRequests();
    fetchFinancials();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*');
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      setProjects([
        { id: '1', name: 'Obra Residencial Alphaville' },
        { id: '2', name: 'Pavimentação Buenópolis' },
        { id: '3', name: 'Sede Administrativa - Torquato' }
      ]);
    }
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
    if (!finDesc || !finProject || !finValue || !finDueDate) return alert('Preencha todos os campos obrigatórios!');
    setLoading(true);

    const { error } = await supabase.from('financeiro_lancamentos').insert([
      {
        descricao: finDesc,
        obra_id: finProject,
        tipo: finType,
        valor: parseFloat(finValue),
        data_vencimento: finDueDate,
        fornecedor_nome: finSupplier || null,
        status: 'pendente'
      }
    ]);

    if (!error) {
      setFinDesc('');
      setFinValue('');
      setFinProject('');
      setFinSupplier('');
      setShowFinModal(false);
      fetchFinancials();
    } else {
      alert('Erro ao salvar no Supabase: ' + error.message);
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
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
        {/* HEADER TOPO FIXO KOPER */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-7 h-7 text-amber-500" />
              <div>
                <span className="font-bold text-base text-white tracking-wide">TORQUATO</span>
                <span className="text-xs font-semibold text-amber-500 block -mt-1">ERP ENGENHARIA</span>
              </div>
            </div>

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
          {/* SIDEBAR KOPER */}
          <aside className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Módulos Principais
              </div>

              <button
                onClick={() => setActiveModule('overview')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeModule === 'overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
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
                  activeModule === 'compras' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" /> Suprimentos / Compras
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('financeiro')}
                className={`w-full flex items-center justify-between px-3 py-2
