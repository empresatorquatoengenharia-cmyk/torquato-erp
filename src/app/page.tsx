'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  HardHat, 
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

  const [showFinModal, setShowFinModal] = useState(false);

  // Formulário Financeiro
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

  async function handleSubmitFinancial(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finValue || !finDueDate) return alert('Preencha os campos obrigatórios!');
    setLoading(true);

    const { error } = await supabase.from('financeiro_lancamentos').insert([
      {
        descricao: finDesc,
        obra_id: finProject || null,
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
        {/* HEADER TOPO FIXO */}
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
          {/* SIDEBAR NAVEGAÇÃO */}
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4" /> Financeiro & Obras
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Torquato v1.0</span>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-slate-900 overflow-y-auto p-6 text-slate-200">
            {activeModule === 'overview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">Painel de Controle — Torquato ERP</h1>
                    <p className="text-xs text-slate-400 mt-1">Visão consolidada das obras, compras e fluxo financeiro</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400">OBRAS EM ANDAMENTO</span>
                      <HardHat className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{projects.length}</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400">COTAÇÕES DE COMPRA</span>
                      <ShoppingCart className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">{requests.length}</p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400">CONTAS A PAGAR</span>
                      <Clock className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-400">TOTAL QUITADO</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-2xl font-bold text-white mt-2">
                      R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeModule === 'financeiro' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">Financeiro & Contas a Pagar</h1>
                    <p className="text-xs text-slate-400 mt-1">Lançamento e baixa de custos por centro de custo/obra</p>
                  </div>
                  <button
                    onClick={() => setShowFinModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition text-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Novo Lançamento
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-4">Descrição</th>
                        <th className="p-4">Obra</th>
                        <th className="p-4">Vencimento</th>
                        <th className="p-4">Valor (R$)</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {financials.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-500">
                            Nenhum lançamento financeiro registrado.
                          </td>
                        </tr>
                      ) : (
                        financials.map((f) => (
                          <tr key={f.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-4 font-semibold text-white">
                              {f.descricao}
                              {f.fornecedor_nome && <span className="block text-[10px] text-slate-400 font-normal">Forn: {f.fornecedor_nome}</span>}
                            </td>
                            <td className="p-4 text-slate-400">{f.projects?.name || 'Geral / ADM'}</td>
                            <td className="p-4 text-slate-300 font-medium">
                              {f.data_vencimento ? new Date(f.data_vencimento).toLocaleDateString('pt-BR') : '-'}
                            </td>
                            <td className="p-4 font-bold text-white">
                              R$ {Number(f.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                f.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              }`}>
                                {f.status === 'pago' ? 'PAGO' : 'PENDENTE'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleToggleStatus(f.id, f.status)}
                                className={`px-3 py-1 rounded text-[10px] font-bold transition ${
                                  f.status === 'pago' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                                }`}
                              >
                                {f.status === 'pago' ? 'Desfazer' : 'Baixar'}
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
          </main>
        </div>

        {/* MODAL FINANCEIRO */}
        {showFinModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Novo Lançamento Financeiro</h3>
                <button onClick={() => setShowFinModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitFinancial} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cimento - Concreto laje 1"
                    value={finDesc}
                    onChange={(e) => setFinDesc(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Obra / Centro de Custo</label>
                  <select
                    value={finProject}
                    onChange={(e) => setFinProject(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">Geral / Sem obra associada</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fornecedor / Razão Social</label>
                  <input
                    type="text"
                    placeholder="Ex: Votorantim Cimentos Ltda"
                    value={finSupplier}
                    onChange={(e) => setFinSupplier(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipo</label>
                    <select
                      value={finType}
                      onChange={(e) => setFinType(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="despesa">Despesa / Custo</option>
                      <option value="receita">Receita / Medição</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Data de Vencimento</label>
                    <input
                      type="date"
                      required
                      value={finDueDate}
                      onChange={(e) => setFinDueDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={finValue}
                    onChange={(e) => setFinValue(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowFinModal(false)}
                    className="px-4 py-2 border border-slate-800 text-slate-400 rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold hover:bg-amber-400 transition"
                  >
                    {loading ? 'Salvar...' : 'Salvar Lançamento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
