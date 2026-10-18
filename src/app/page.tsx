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
  Trash2,
  Clock,
  CheckCircle2,
  TrendingDown
} from 'lucide-react';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('financeiro');
  const [userRole, setUserRole] = useState('admin');

  // Estados de Dados do Supabase
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [financials, setFinancials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados do Modal de Compras
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [urgency, setUrgency] = useState('media');
  const [observation, setObservation] = useState('');
  const [items, setItems] = useState([{ item_name: '', quantity: 1, unit: 'un' }]);

  // Estados do Modal Financeiro (Contas a Pagar / Koper)
  const [showFinModal, setShowFinModal] = useState(false);
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finCategory, setFinCategory] = useState('Material');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState('');
  const [finSupplier, setFinSupplier] = useState('');
  const [finPaymentMethod, setFinPaymentMethod] = useState('pix');
  const [finObs, setFinObs] = useState('');

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

  // --- COMPRAS ---
  const handleAddItem = () => setItems([...items, { item_name: '', quantity: 1, unit: 'un' }]);
  const handleRemoveItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !projectId) return alert('Preencha o título e selecione a obra!');
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

  // --- FINANCEIRO (COMPATÍVEL COM SUPABASE DA IMAGEM) ---
  async function handleSubmitFinancial(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finProject || !finValue) {
      alert('Por favor, preencha a Descrição, Obra e o Valor!');
      return;
    }
    setLoading(true);

    const { error } = await supabase.from('financeiro_lancamentos').insert([
      {
        descricao: finDesc,
        obra_id: finProject,
        tipo: finType,
        valor: parseFloat(finValue),
        status: 'pendente',
        created_at: new Date().toISOString()
      }
    ]);

    if (error) {
      alert('Erro ao salvar lançamento: ' + error.message);
    } else {
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
      {/* Sidebar */}
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
            Perfil do Usuário:
          </div>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 p-2 rounded border border-slate-700 mb-6 focus:outline-none"
          >
            <option value="admin">Administrador (Acesso Total)</option>
            <option value="financeiro">Setor Financeiro</option>
            <option value="compras">Setor Compras</option>
            <option value="engenharia">Engenharia / Obras</option>
          </select>

          <nav className="space-y-1">
            {modules
              .filter(m => m.roles.includes(userRole))
              .map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeModule === m.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {m.name}
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
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Torquato Engenharia Ltda — Gestão Integrada de Obras</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">Supabase Conectado</span>
          </div>
        </header>

        {/* MÓDULO FINANCEIRO */}
        {activeModule === 'financeiro' && (
          <div className="space-y-6">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">A Pagar (Pendente)</h3>
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-amber-600 mt-2 font-medium">Lançamentos em aberto</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">Total Quitado (Pago)</h3>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">
                  R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-emerald-600 mt-2 font-medium">Lançamentos baixados</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-500 uppercase">Total de Registros</h3>
                  <TrendingDown className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2">{financials.length}</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">Lançamentos por Obra/ADM</p>
              </div>
            </div>

            {/* Cabeçalho da Lista e Botão Adicionar */}
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Contas a Pagar / Despesas por Obra</h3>
                <p className="text-xs text-slate-500">Fluxo financeiro conectado à tabela `financeiro_lancamentos`</p>
              </div>
              <button
                onClick={() => setShowFinModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" /> Novo Lançamento
              </button>
            </div>

            {/* Tabela de Lançamentos Financeiros */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Obra / Centro de Custo</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Valor (R$)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {financials.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Nenhum lançamento financeiro registrado no Supabase. Clique em "Novo Lançamento".
                      </td>
                    </tr>
                  ) : (
                    financials.map((fin) => (
                      <tr key={fin.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-semibold text-slate-800">{fin.descricao}</td>
                        <td className="p-4 text-slate-600">{fin.projects?.name || 'Geral / ADM'}</td>
                        <td className="p-4 text-xs font-medium text-slate-500 uppercase">{fin.tipo || 'Despesa'}</td>
                        <td className="p-4 font-bold text-slate-900">
                          R$ {Number(fin.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            fin.status === 'pago' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {fin.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(fin.id, fin.status)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition ${
                              fin.status === 'pago' ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                            }`}
                          >
                            {fin.status === 'pago' ? 'Desfazer' : 'Dar Baixa (Pagar)'}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL NOVO LANÇAMENTO FINANCEIRO */}
        {showFinModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Novo Lançamento Financeiro</h3>
              <p className="text-xs text-slate-500 mb-6">Gravação direta na tabela `financeiro_lancamentos` do Supabase</p>

              <form onSubmit={handleSubmitFinancial} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição da Despesa</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nota Fiscal Cimento ou Fatura Cemig"
                    value={finDesc}
                    onChange={(e) => setFinDesc(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Obra / Centro de Custo</label>
                    <select
                      required
                      value={finProject}
                      onChange={(e) => setFinProject(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Selecione a Obra...</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Lançamento</label>
                    <select
                      value={finType}
                      onChange={(e) => setFinType(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="despesa">Despesa / Custo de Obra</option>
                      <option value="receita">Receita / Medição</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={finValue}
                    onChange={(e) => setFinValue(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500 font-bold text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowFinModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-amber-500 text-slate-950 rounded-lg text-sm font-bold hover:bg-amber-400 transition shadow-sm"
                  >
                    {loading ? 'Salvar...' : 'Salvar Lançamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
