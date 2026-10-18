'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  HardHat, 
  Boxes, 
  LogOut,
  Plus,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  X,
  Activity,
  ShieldCheck,
  FileSpreadsheet
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoKoperDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [rdos, setRdos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showFinPagarModal, setShowFinPagarModal] = useState(false);
  const [showFinReceberModal, setShowFinReceberModal] = useState(false);
  const [showRdoModal, setShowRdoModal] = useState(false);

  // Forms
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');

  const [recClient, setRecClient] = useState('');
  const [recDesc, setRecDesc] = useState('');
  const [recProject, setRecProject] = useState('');
  const [recValue, setRecValue] = useState('');
  const [recDueDate, setRecDueDate] = useState(new Date().toISOString().split('T')[0]);

  const [rdoProject, setRdoProject] = useState('');
  const [rdoAtividades, setRdoAtividades] = useState('');
  const [rdoEfetivoProprio, setRdoEfetivoProprio] = useState('0');
  const [rdoEfetivoTerceiro, setRdoEfetivoTerceiro] = useState('0');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    const { data: projData } = await supabase.from('projects').select('*');
    if (projData) setProjects(projData);
    const projMap = new Map((projData || []).map((p: any) => [p.id, p.name]));

    const { data: reqData } = await supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
    if (reqData) setRequests(reqData);

    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('created_at', { ascending: false });
    if (pagData) {
      setFinancialsPagar(pagData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral' })));
    }

    const { data: recData } = await supabase.from('financeiro_receber').select('*').order('created_at', { ascending: false });
    if (recData) {
      setFinancialsReceber(recData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral' })));
    }

    const { data: rdoData } = await supabase.from('rdo_registros').select('*').order('created_at', { ascending: false });
    if (rdoData) {
      setRdos(rdoData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Obra' : 'Obra' })));
    }

    const { data: estData } = await supabase.from('movimentacoes_estoque').select('*').order('created_at', { ascending: false });
    if (estData) {
      setEstoque(estData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral' })));
    }
    setLoading(false);
  }

  // Ações de inserção
  async function handleSavePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finValue) return;
    await supabase.from('financeiro_lancamentos').insert([{
      descricao: finDesc, obra_id: finProject || null, tipo: finType, valor: parseFloat(finValue), data_vencimento: finDueDate, fornecedor_nome: finSupplier || null, status: 'pendente'
    }]);
    setShowFinPagarModal(false);
    setFinDesc(''); setFinValue(''); setFinSupplier('');
    loadAllData();
  }

  async function handleSaveReceber(e: React.FormEvent) {
    e.preventDefault();
    if (!recClient || !recValue) return;
    await supabase.from('financeiro_receber').insert([{
      cliente_nome: recClient, descricao: recDesc, obra_id: recProject || null, valor: parseFloat(recValue), data_vencimento: recDueDate, status: 'pendente'
    }]);
    setShowFinReceberModal(false);
    setRecClient(''); setRecDesc(''); setRecValue('');
    loadAllData();
  }

  async function handleSaveRdo(e: React.FormEvent) {
    e.preventDefault();
    if (!rdoProject || !rdoAtividades) return;
    await supabase.from('rdo_registros').insert([{
      obra_id: rdoProject, atividades_realizadas: rdoAtividades, efetivo_proprio: parseInt(rdoEfetivoProprio), efetivo_terceiro: parseInt(rdoEfetivoTerceiro)
    }]);
    setShowRdoModal(false);
    setRdoAtividades('');
    loadAllData();
  }

  // Totais Executivos
  const totalPagar = financialsPagar.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalReceber = financialsReceber.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const saldoCaixa = totalReceber - totalPagar;

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER EXECUTIVO KOPER */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg">
                TE
              </div>
              <div>
                <span className="font-bold text-sm tracking-wide text-white block">TORQUATO ENGENHARIA</span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block -mt-1">ERP Corporativo</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <HardHat className="w-4 h-4 text-amber-500" />
              <span className="text-slate-400">Obra Selecionada:</span>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="todas" className="bg-slate-900">Visão Consolidada (Todas as Obras)</option>
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
                placeholder="Busca rápida por insumo, obra ou cliente..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 w-72 transition"
              />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR NAVEGAÇÃO KOPER */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
            <nav className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Módulos Principais
              </div>

              <button
                onClick={() => setActiveModule('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard Executivo
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('engenharia')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'engenharia' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HardHat className="w-4 h-4" /> Engenharia & RDO
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('compras')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'compras' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4" /> Compras & Suprimentos
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('financeiro')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4" /> Financeiro Completo
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('estoque')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'estoque' ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4" /> Almoxarifado / Estoque
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Torquato ERP</p>
                <p className="text-[10px] text-slate-500">Licença Corporativa A1</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL (DASHBOARD ESTILO KOPER) */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {activeModule === 'dashboard' && (
              <div className="space-y-8">
                {/* Cabeçalho do Dashboard */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Executivo</h1>
                    <p className="text-xs text-slate-400 mt-1">Acompanhe os principais indicadores, obras e fluxo financeiro em tempo real</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowFinPagarModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg shadow-amber-500/10 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Novo Lançamento
                    </button>
                  </div>
                </div>

                {/* Cards de Métricas Principais (Padrão Koper Dashboard) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Obras em Execução</span>
                      <HardHat className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black text-white mt-3">{projects.length}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                      <Activity className="w-3.5 h-3.5" /> Cronograma Ativo
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contas a Receber</span>
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <p className="text-3xl font-black text-white mt-3">
                      R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-3 text-[11px] text-slate-400 font-medium">
                      Medições e contratos pendentes
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contas a Pagar</span>
                      <TrendingDown className="w-5 h-5 text-rose-400" />
                    </div>
                    <p className="text-3xl font-black text-white mt-3">
                      R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <div className="mt-3 text-[11px] text-slate-400 font-medium">
                      Insumos e despesas em aberto
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cotações / Compras</span>
                      <ShoppingCart className="w-5 h-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-black text-white mt-3">{requests.length}</p>
                    <div className="mt-3 text-[11px] text-blue-400 font-medium">
                      Pedidos em andamento
                    </div>
                  </div>
                </div>

                {/* Seção Inferior: Últimos Registros do RDO e Fluxo Recente */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Resumo RDO */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Últimos Registros Diários (RDO)</h2>
                      <button onClick={() => setActiveModule('engenharia')} className="text-xs text-amber-500 hover:underline font-semibold">Ver todos</button>
                    </div>
                    <div className="space-y-3">
                      {rdos.slice(0, 3).map((r: any) => (
                        <div key={r.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-xs text-white">{r.projectName}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">{r.atividades_realizadas}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">
                            {r.efetivo_proprio + r.efetivo_terceiro} Colaboradores
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Resumo Financeiro Recente */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Lançamentos Financeiros Recentes</h2>
                      <button onClick={() => setActiveModule('financeiro')} className="text-xs text-amber-500 hover:underline font-semibold">Ver extrato</button>
                    </div>
                    <div className="space-y-3">
                      {financialsPagar.slice(0, 3).map((f: any) => (
                        <div key={f.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-xs text-white">{f.descricao}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">{f.projectName} • Venc: {new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <p className="font-black text-xs text-rose-400">R$ {Number(f.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Outros módulos conforme ativo */}
            {activeModule !== 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white capitalize">{activeModule}</h1>
                    <p className="text-xs text-slate-400 mt-1">Gerenciamento completo do módulo {activeModule} da Torquato Engenharia</p>
                  </div>
                  {activeModule === 'engenharia' && (
                    <button onClick={() => setShowRdoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Novo RDO</button>
                  )}
                  {activeModule === 'financeiro' && (
                    <div className="flex gap-2">
                      <button onClick={() => setShowFinPagarModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Nova Conta Pagar</button>
                      <button onClick={() => setShowFinReceberModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Novo Recebimento</button>
                    </div>
                  )}
                </div>

                {/* Listagem Dinâmica por Módulo */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6">
                  {activeModule === 'engenharia' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm text-white">Diário de Obras (RDO)</h3>
                      <div className="space-y-2">
                        {rdos.map((r: any) => (
                          <div key={r.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-white text-sm">{r.projectName}</p>
                              <p className="text-slate-400 mt-1">{r.atividades_realizadas}</p>
                            </div>
                            <span className="text-amber-500 font-bold">{r.efetivo_proprio + r.efetivo_terceiro} Pessoas em campo</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModule === 'financeiro' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-sm text-white mb-3">Contas a Pagar</h3>
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-950 text-slate-400 uppercase">
                            <tr>
                              <th className="p-3">Descrição</th>
                              <th className="p-3">Obra</th>
                              <th className="p-3">Vencimento</th>
                              <th className="p-3">Valor</th>
                              <th className="p-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                            {financialsPagar.map((f: any) => (
                              <tr key={f.id}>
                                <td className="p-3 font-semibold text-white">{f.descricao}</td>
                                <td className="p-3 text-slate-400">{f.projectName}</td>
                                <td className="p-3">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                                <td className="p-3 font-bold">R$ {Number(f.valor).toFixed(2)}</td>
                                <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500">{f.status}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeModule === 'compras' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm text-white">Solicitações de Compras & Cotações</h3>
                      <div className="space-y-2">
                        {requests.map((req: any) => (
                          <div key={req.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                            <span className="font-bold text-white">{req.title}</span>
                            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded font-bold uppercase">{req.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeModule === 'estoque' && (
                    <div className="space-y-4">
                      <h3 className="font-bold text-sm text-white">Movimentação de Almoxarifado</h3>
                      <div className="space-y-2">
                        {estoque.map((est: any) => (
                          <div key={est.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                            <span className="font-bold text-white">{est.produto_nome} ({est.quantidade} {est.unidade})</span>
                            <span className="text-slate-400">{est.projectName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>

        {/* MODAL FIN PAGAR */}
        {showFinPagarModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Novo Lançamento (Contas a Pagar)</h3>
                <button onClick={() => setShowFinPagarModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSavePagar} className="space-y-3">
                <input type="text" required placeholder="Descrição da Despesa" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={finProject} onChange={(e) => setFinProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Geral / Sem obra</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={finDueDate} onChange={(e) => setFinDueDate(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="number" step="0.01" required placeholder="Valor R$" value={finValue} onChange={(e) => setFinValue(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowFinPagarModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL RDO */}
        {showRdoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Registrar RDO</h3>
                <button onClick={() => setShowRdoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveRdo} className="space-y-3">
                <select required value={rdoProject} onChange={(e) => setRdoProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Selecione a Obra...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <textarea rows={3} required placeholder="Atividades realizadas..." value={rdoAtividades} onChange={(e) => setRdoAtividades(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"></textarea>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowRdoModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar RDO</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
