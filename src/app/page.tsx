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
  FileText,
  TrendingUp,
  X,
  PackageCheck
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoERP() {
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Dados Globais
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
  const [showEstoqueModal, setShowEstoqueModal] = useState(false);

  // Forms Financeiro Pagar
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');

  // Forms Financeiro Receber
  const [recClient, setRecClient] = useState('');
  const [recDesc, setRecDesc] = useState('');
  const [recProject, setRecProject] = useState('');
  const [recValue, setRecValue] = useState('');
  const [recDueDate, setRecDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Forms RDO
  const [rdoProject, setRdoProject] = useState('');
  const [rdoClimaM, setRdoClimaM] = useState('Ensolarado');
  const [rdoClimaT, setRdoClimaT] = useState('Ensolarado');
  const [rdoEfetivoProprio, setRdoEfetivoProprio] = useState('0');
  const [rdoEfetivoTerceiro, setRdoEfetivoTerceiro] = useState('0');
  const [rdoAtividades, setRdoAtividades] = useState('');
  const [rdoOcorrencias, setRdoOcorrencias] = useState('');

  // Forms Estoque
  const [estProject, setEstProject] = useState('');
  const [estProduto, setEstProduto] = useState('');
  const [estQtd, setEstQtd] = useState('');
  const [estUnidade, setEstUnidade] = useState('un');
  const [estTipo, setEstTipo] = useState('entrada');

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    
    // Obras
    const { data: projData } = await supabase.from('projects').select('*');
    if (projData) setProjects(projData);
    const projMap = new Map((projData || []).map((p: any) => [p.id, p.name]));

    // Compras
    const { data: reqData } = await supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
    if (reqData) setRequests(reqData);

    // Contas a Pagar
    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('created_at', { ascending: false });
    if (pagData) {
      setFinancialsPagar(pagData.map((item: any) => ({
        ...item,
        projectName: item.obra_id ? projMap.get(item.obra_id) || 'Geral / ADM' : 'Geral / ADM'
      })));
    }

    // Contas a Receber
    const { data: recData } = await supabase.from('financeiro_receber').select('*').order('created_at', { ascending: false });
    if (recData) {
      setFinancialsReceber(recData.map((item: any) => ({
        ...item,
        projectName: item.obra_id ? projMap.get(item.obra_id) || 'Geral / ADM' : 'Geral / ADM'
      })));
    }

    // RDOs
    const { data: rdoData } = await supabase.from('rdo_registros').select('*').order('created_at', { ascending: false });
    if (rdoData) {
      setRdos(rdoData.map((item: any) => ({
        ...item,
        projectName: item.obra_id ? projMap.get(item.obra_id) || 'Obra não informada' : 'Obra não informada'
      })));
    }

    // Estoque
    const { data: estData } = await supabase.from('movimentacoes_estoque').select('*').order('created_at', { ascending: false });
    if (estData) {
      setEstoque(estData.map((item: any) => ({
        ...item,
        projectName: item.obra_id ? projMap.get(item.obra_id) || 'Geral / ADM' : 'Geral / ADM'
      })));
    }

    setLoading(false);
  }

  // Submit Lançamento Pagar
  async function handleSubmitPagar(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finValue || !finDueDate) return alert('Preencha os campos obrigatórios!');
    const { error } = await supabase.from('financeiro_lancamentos').insert([{
      descricao: finDesc,
      obra_id: finProject || null,
      tipo: finType,
      valor: parseFloat(finValue),
      data_vencimento: finDueDate,
      fornecedor_nome: finSupplier || null,
      status: 'pendente'
    }]);

    if (!error) {
      setShowFinPagarModal(false);
      setFinDesc(''); setFinValue(''); setFinProject(''); setFinSupplier('');
      fetchAllData();
    } else {
      alert('Erro ao salvar: ' + error.message);
    }
  }

  // Submit Lançamento Receber
  async function handleSubmitReceber(e: React.FormEvent) {
    e.preventDefault();
    if (!recClient || !recDesc || !recValue || !recDueDate) return alert('Preencha os campos!');
    const { error } = await supabase.from('financeiro_receber').insert([{
      cliente_nome: recClient,
      descricao: recDesc,
      obra_id: recProject || null,
      valor: parseFloat(recValue),
      data_vencimento: recDueDate,
      status: 'pendente'
    }]);

    if (!error) {
      setShowFinReceberModal(false);
      setRecClient(''); setRecDesc(''); setRecValue(''); setRecProject('');
      fetchAllData();
    } else {
      alert('Erro ao salvar: ' + error.message);
    }
  }

  // Submit RDO
  async function handleSubmitRDO(e: React.FormEvent) {
    e.preventDefault();
    if (!rdoProject || !rdoAtividades) return alert('Selecione a obra e descreva as atividades!');
    const { error } = await supabase.from('rdo_registros').insert([{
      obra_id: rdoProject,
      clima_manha: rdoClimaM,
      clima_tarde: rdoClimaT,
      efetivo_proprio: parseInt(rdoEfetivoProprio || '0'),
      efetivo_terceiro: parseInt(rdoEfetivoTerceiro || '0'),
      atividades_realizadas: rdoAtividades,
      ocorrencias: rdoOcorrencias
    }]);

    if (!error) {
      setShowRdoModal(false);
      setRdoAtividades(''); setRdoOcorrencias('');
      fetchAllData();
    } else {
      alert('Erro ao salvar RDO: ' + error.message);
    }
  }

  // Submit Movimentação Estoque
  async function handleSubmitEstoque(e: React.FormEvent) {
    e.preventDefault();
    if (!estProduto || !estQtd) return alert('Preencha produto e quantidade!');
    const { error } = await supabase.from('movimentacoes_estoque').insert([{
      obra_id: estProject || null,
      produto_nome: estProduto,
      quantidade: parseFloat(estQtd),
      unidade: estUnidade,
      tipo: estTipo
    }]);

    if (!error) {
      setShowEstoqueModal(false);
      setEstProduto(''); setEstQtd('');
      fetchAllData();
    } else {
      alert('Erro ao salvar estoque: ' + error.message);
    }
  }

  // Baixa Financeira
  async function toggleStatusPagar(id: string, currentStatus: string) {
    await supabase.from('financeiro_lancamentos').update({ status: currentStatus === 'pago' ? 'pendente' : 'pago' }).eq('id', id);
    fetchAllData();
  }

  async function toggleStatusReceber(id: string, currentStatus: string) {
    await supabase.from('financeiro_receber').update({ status: currentStatus === 'recebido' ? 'pendente' : 'recebido' }).eq('id', id);
    fetchAllData();
  }

  // Totais
  const totalPendentePagar = financialsPagar.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalPendenteReceber = financialsReceber.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
        {/* HEADER CORPORATIVO */}
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
                placeholder="Buscar contrato, insumo, RDO ou lançamento..."
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
          {/* MENU LATERAL NAVEGAÇÃO KOPER */}
          <aside className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-3">
            <nav className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Módulos do Sistema
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
                onClick={() => setActiveModule('engenharia')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeModule === 'engenharia' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HardHat className="w-4 h-4" /> Engenharia & RDO
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
                  <DollarSign className="w-4 h-4" /> Financeiro (Pagar / Receber)
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('estoque')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                  activeModule === 'estoque' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4" /> Almoxarifado & Estoque
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span>Torquato ERP v2.0</span>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 bg-slate-900 overflow-y-auto p-6 text-slate-200">
            
            {/* OVERVIEW */}
            {activeModule === 'overview' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h1 className="text-xl font-bold text-white">Painel Corporativo — Torquato ERP</h1>
                  <p className="text-xs text-slate-400 mt-1">Gestão centralizada de obras, suprimentos e controle financeiro</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">OBRAS CADASTRADAS</span>
                    <p className="text-2xl font-bold text-white mt-2">{projects.length}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">RDOs REGISTRADOS</span>
                    <p className="text-2xl font-bold text-amber-500 mt-2">{rdos.length}</p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">CONTAS A PAGAR</span>
                    <p className="text-2xl font-bold text-rose-400 mt-2">
                      R$ {totalPendentePagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <span className="text-xs font-semibold text-slate-400">CONTAS A RECEBER</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">
                      R$ {totalPendenteReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ENGENHARIA & RDO */}
            {activeModule === 'engenharia' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">Engenharia & Registro Diário de Obra (RDO)</h1>
                    <p className="text-xs text-slate-400 mt-1">Acompanhamento diário de avanço, clima e mão de obra de campo</p>
                  </div>
                  <button
                    onClick={() => setShowRdoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition text-xs"
                  >
                    <Plus className="w-4 h-4" /> Novo RDO
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-4">Data</th>
                        <th className="p-4">Obra</th>
                        <th className="p-4">Clima (M/T)</th>
                        <th className="p-4">Efetivo (Próprio/Terceiro)</th>
                        <th className="p-4">Atividades Realizadas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {rdos.length === 0 ? (
                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum RDO registrado.</td></tr>
                      ) : (
                        rdos.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-4 font-semibold text-white">{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4 text-slate-400">{r.projectName}</td>
                            <td className="p-4 text-slate-300">{r.clima_manha} / {r.clima_tarde}</td>
                            <td className="p-4 font-bold text-amber-500">{r.efetivo_proprio} P / {r.efetivo_terceiro} T</td>
                            <td className="p-4 text-slate-300 max-w-xs truncate">{r.atividades_realizadas}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FINANCEIRO (PAGAR / RECEBER) */}
            {activeModule === 'financeiro' && (
              <div className="space-y-8">
                {/* CONTAS A PAGAR */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">Contas a Pagar / Custo de Obras</h2>
                      <p className="text-xs text-slate-400">Fluxo de saídas e despesas pendentes</p>
                    </div>
                    <button
                      onClick={() => setShowFinPagarModal(true)}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition text-xs"
                    >
                      <Plus className="w-4 h-4" /> Nova Conta a Pagar
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
                        {financialsPagar.length === 0 ? (
                          <tr><td colSpan={6} className="p-6 text-center text-slate-500">Nenhuma conta a pagar.</td></tr>
                        ) : (
                          financialsPagar.map((f) => (
                            <tr key={f.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-4 font-semibold text-white">{f.descricao}</td>
                              <td className="p-4 text-slate-400">{f.projectName}</td>
                              <td className="p-4">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4 font-bold text-white">R$ {Number(f.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  f.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                }`}>{f.status === 'pago' ? 'PAGO' : 'PENDENTE'}</span>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => toggleStatusPagar(f.id, f.status)}
                                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold"
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

                {/* CONTAS A RECEBER */}
                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">Contas a Receber / Medições</h2>
                      <p className="text-xs text-slate-400">Entradas financeiras por contrato/cliente</p>
                    </div>
                    <button
                      onClick={() => setShowFinReceberModal(true)}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition text-xs"
                    >
                      <Plus className="w-4 h-4" /> Novo Recebimento
                    </button>
                  </div>

                  <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                        <tr>
                          <th className="p-4">Cliente / Contrato</th>
                          <th className="p-4">Descrição</th>
                          <th className="p-4">Obra</th>
                          <th className="p-4">Vencimento</th>
                          <th className="p-4">Valor (R$)</th>
                          <th className="p-4 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {financialsReceber.length === 0 ? (
                          <tr><td colSpan={6} className="p-6 text-center text-slate-500">Nenhum recebimento cadastrado.</td></tr>
                        ) : (
                          financialsReceber.map((r) => (
                            <tr key={r.id} className="hover:bg-slate-900/50 transition">
                              <td className="p-4 font-semibold text-emerald-400">{r.cliente_nome}</td>
                              <td className="p-4 text-white">{r.descricao}</td>
                              <td className="p-4 text-slate-400">{r.projectName}</td>
                              <td className="p-4">{new Date(r.data_vencimento).toLocaleDateString('pt-BR')}</td>
                              <td className="p-4 font-bold text-white">R$ {Number(r.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => toggleStatusReceber(r.id, r.status)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                                >
                                  {r.status === 'recebido' ? 'Recebido' : 'Confirmar'}
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ESTOQUE */}
            {activeModule === 'estoque' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-white">Almoxarifado & Controle de Insumos</h1>
                    <p className="text-xs text-slate-400 mt-1">Entrada, saída e movimentação de materiais por obra</p>
                  </div>
                  <button
                    onClick={() => setShowEstoqueModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition text-xs"
                  >
                    <Plus className="w-4 h-4" /> Nova Movimentação
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase">
                      <tr>
                        <th className="p-4">Insumo / Material</th>
                        <th className="p-4">Obra / Local</th>
                        <th className="p-4">Quantidade</th>
                        <th className="p-4">Tipo Movimentação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {estoque.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-500">Nenhum registro de estoque.</td></tr>
                      ) : (
                        estoque.map((e) => (
                          <tr key={e.id} className="hover:bg-slate-900/50 transition">
                            <td className="p-4 font-semibold text-white">{e.produto_nome}</td>
                            <td className="p-4 text-slate-400">{e.projectName}</td>
                            <td className="p-4 font-bold text-white">{e.quantidade} {e.unidade}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                e.tipo === 'entrada' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}>{e.tipo}</span>
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

        {/* MODAL RDO */}
        {showRdoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-slate-800 text-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Novo Registro Diário de Obra (RDO)</h3>
                <button onClick={() => setShowRdoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSubmitRDO} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Obra</label>
                  <select required value={rdoProject} onChange={(e) => setRdoProject(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white">
                    <option value="">Selecione a Obra...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Efetivo Próprio</label>
                    <input type="number" value={rdoEfetivoProprio} onChange={(e) => setRdoEfetivoProprio(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Efetivo Terceirizado</label>
                    <input type="number" value={rdoEfetivoTerceiro} onChange={(e) => setRdoEfetivoTerceiro(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Atividades Executadas</label>
                  <textarea rows={3} required value={rdoAtividades} onChange={(e) => setRdoAtividades(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" placeholder="Descreva os serviços realizados no dia..."></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setShowRdoModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-lg text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold">Salvar RDO</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FIN PAGAR */}
        {showFinPagarModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">Nova Conta a Pagar</h3>
                <button onClick={() => setShowFinPagarModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSubmitPagar} className="space-y-4">
                <input type="text" required placeholder="Descrição da Despesa" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                <select value={finProject} onChange={(e) => setFinProject(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white">
                  <option value="">Geral / Sem obra associada</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" required value={finDueDate} onChange={(e) => setFinDueDate(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white" />
                  <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValue} onChange={(e) => setFinValue(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-bold" />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button type="button" onClick={() => setShowFinPagarModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-lg text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold">Salvar Conta</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
