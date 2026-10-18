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
  ChevronRight,
  Search,
  LayoutDashboard,
  ShieldCheck,
  Users,
  X,
  FileText,
  Truck,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  PieChart,
  Upload,
  CheckCircle2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('financeiro');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados Globais
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [rdos, setRdos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showFinPagarModal, setShowFinPagarModal] = useState(false);
  const [showFinReceberModal, setShowFinReceberModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showRdoModal, setShowRdoModal] = useState(false);
  const [showEstoqueModal, setShowEstoqueModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Modal de Baixa com Comprovante
  const [showBaixaPagarModal, setShowBaixaPagarModal] = useState(false);
  const [selectedTituloPagar, setSelectedTituloPagar] = useState<any>(null);
  const [compPagarFile, setCompPagarFile] = useState<File | null>(null);

  const [showBaixaReceberModal, setShowBaixaReceberModal] = useState(false);
  const [selectedTituloReceber, setSelectedTituloReceber] = useState<any>(null);
  const [compReceberFile, setCompReceberFile] = useState<File | null>(null);

  // Forms Conta a Pagar (com Nota Fiscal HTML/PDF)
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');
  const [finNfFile, setFinNfFile] = useState<File | null>(null);

  // Forms Conta a Receber (com Nota Fiscal HTML/PDF)
  const [recClient, setRecClient] = useState('');
  const [recDesc, setRecDesc] = useState('');
  const [recProject, setRecProject] = useState('');
  const [recValue, setRecValue] = useState('');
  const [recDueDate, setRecDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [recNfFile, setRecNfFile] = useState<File | null>(null);

  const [reqTitle, setReqTitle] = useState('');
  const [reqProject, setReqProject] = useState('');
  const [reqUrgency, setReqUrgency] = useState('media');
  const [reqObs, setReqObs] = useState('');

  const [supName, setSupName] = useState('');
  const [supCnpj, setSupCnpj] = useState('');
  const [supPhone, setSupPhone] = useState('');

  const [rdoProject, setRdoProject] = useState('');
  const [rdoAtividades, setRdoAtividades] = useState('');
  const [rdoEfetivoProprio, setRdoEfetivoProprio] = useState('0');
  const [rdoEfetivoTerceiro, setRdoEfetivoTerceiro] = useState('0');

  const [estProject, setEstProject] = useState('');
  const [estProduto, setEstProduto] = useState('');
  const [estQtd, setEstQtd] = useState('');
  const [estUnidade, setEstUnidade] = useState('un');
  const [estTipo, setEstTipo] = useState('entrada');

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCargo, setUserCargo] = useState('Engenheiro');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    const { data: projData } = await supabase.from('projects').select('*');
    if (projData) setProjects(projData);
    const projMap = new Map((projData || []).map((p: any) => [p.id, p.name]));

    const { data: reqData } = await supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
    if (reqData) {
      setRequests(reqData.map((i: any) => ({ ...i, projectName: i.project_id ? projMap.get(i.project_id) || 'Geral' : 'Geral' })));
    }

    const { data: supData } = await supabase.from('fornecedores').select('*').order('created_at', { ascending: false });
    if (supData) setFornecedores(supData);

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

    const { data: userData } = await supabase.from('usuarios_erp').select('*').order('created_at', { ascending: false });
    if (userData) setUsuarios(userData);

    setLoading(false);
  }

  // Salvamento Conta a Pagar com NF (HTML/PDF)
  async function handleSavePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!finDesc || !finValue) return;
    await supabase.from('financeiro_lancamentos').insert([{
      descricao: finDesc, 
      obra_id: finProject || null, 
      tipo: finType, 
      valor: parseFloat(finValue), 
      data_vencimento: finDueDate, 
      fornecedor_nome: finSupplier || null, 
      status: 'pendente',
      nf_arquivo: finNfFile ? finNfFile.name : null
    }]);
    setShowFinPagarModal(false);
    setFinDesc(''); setFinValue(''); setFinSupplier(''); setFinNfFile(null);
    loadAllData();
  }

  // Salvamento Conta a Receber com NF (HTML/PDF)
  async function handleSaveReceber(e: React.FormEvent) {
    e.preventDefault();
    if (!recClient || !recValue) return;
    await supabase.from('financeiro_receber').insert([{
      cliente_nome: recClient, 
      descricao: recDesc, 
      obra_id: recProject || null, 
      valor: parseFloat(recValue), 
      data_vencimento: recDueDate, 
      status: 'pendente',
      nf_arquivo: recNfFile ? recNfFile.name : null
    }]);
    setShowFinReceberModal(false);
    setRecClient(''); setRecDesc(''); setRecValue(''); setRecNfFile(null);
    loadAllData();
  }

  // Baixa Conta a Pagar com Comprovante (PDF/Imagem)
  async function handleBaixaPagar(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTituloPagar) return;
    await supabase.from('financeiro_lancamentos').update({ 
      status: 'pago',
      comprovante_arquivo: compPagarFile ? compPagarFile.name : 'comprovante_anexado.pdf'
    }).eq('id', selectedTituloPagar.id);
    
    setShowBaixaPagarModal(false);
    setSelectedTituloPagar(null);
    setCompPagarFile(null);
    loadAllData();
  }

  // Baixa Conta a Receber com Comprovante (PDF/Imagem)
  async function handleBaixaReceber(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTituloReceber) return;
    await supabase.from('financeiro_receber').update({ 
      status: 'recebido',
      comprovante_arquivo: compReceberFile ? compReceberFile.name : 'comprovante_recebimento.pdf'
    }).eq('id', selectedTituloReceber.id);
    
    setShowBaixaReceberModal(false);
    setSelectedTituloReceber(null);
    setCompReceberFile(null);
    loadAllData();
  }

  async function handleSaveRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!reqTitle || !reqProject) return;
    await supabase.from('purchase_requests').insert([{
      title: reqTitle, project_id: reqProject, urgency: reqUrgency, observation: reqObs, status: 'pendente'
    }]);
    setShowRequestModal(false);
    setReqTitle(''); setReqObs('');
    loadAllData();
  }

  async function handleSaveSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!supName) return;
    await supabase.from('fornecedores').insert([{
      razao_social: supName, cnpj: supCnpj, telefone: supPhone
    }]);
    setShowSupplierModal(false);
    setSupName(''); setSupCnpj(''); setSupPhone('');
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

  async function handleSaveEstoque(e: React.FormEvent) {
    e.preventDefault();
    if (!estProduto || !estQtd) return;
    await supabase.from('movimentacoes_estoque').insert([{
      obra_id: estProject || null, produto_nome: estProduto, quantidade: parseFloat(estQtd), unidade: estUnidade, tipo: estTipo
    }]);
    setShowEstoqueModal(false);
    setEstProduto(''); setEstQtd('');
    loadAllData();
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    await supabase.from('usuarios_erp').insert([{
      nome: userName, email: userEmail, cargo: userCargo, status: 'ativo'
    }]);
    setShowUserModal(false);
    setUserName(''); setUserEmail('');
    loadAllData();
  }

  async function approveRequest(id: string) {
    await supabase.from('purchase_requests').update({ status: 'aprovado' }).eq('id', id);
    loadAllData();
  }

  // Filtragem por Centro de Custo / Obra Selecionada
  const filteredPagar = selectedProject === 'todas' 
    ? financialsPagar 
    : financialsPagar.filter(f => f.obra_id === selectedProject);

  const filteredReceber = selectedProject === 'todas' 
    ? financialsReceber 
    : financialsReceber.filter(f => f.obra_id === selectedProject);

  const totalPagar = filteredPagar.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalPago = filteredPagar.filter(f => f.status === 'pago').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalReceber = filteredReceber.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalRecebido = filteredReceber.filter(f => f.status === 'recebido').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  const maxPagar = Math.max(totalPagar, totalPago, 1);
  const percentPagar = Math.round((totalPagar / (totalPagar + totalPago || 1)) * 100);

  const maxReceber = Math.max(totalReceber, totalRecebido, 1);
  const percentReceber = Math.round((totalRecebido / (totalReceber + totalRecebido || 1)) * 100);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER EXECUTIVO CORPORATIVO */}
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
              <span className="text-slate-400">Centro de Custo / Obra:</span>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
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
                placeholder="Busca corporativa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 text-xs text-slate-200 pl-9 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 w-64 transition"
              />
            </div>
            <div className="flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR NAVEGAÇÃO COMPLETA KOPER */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
            <nav className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Módulos do Sistema
              </div>

              <button
                onClick={() => setActiveModule('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard Executivo
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('administracao')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'administracao' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" /> Administração & Usuários
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('engenharia')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'engenharia' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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
                  activeModule === 'compras' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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
                  activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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
                  activeModule === 'estoque' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Boxes className="w-4 h-4" /> Almoxarifado / Estoque
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Torquato ERP</p>
                <p className="text-[10px] text-slate-500">Versão Consolidada</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL DINÂMICO */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {/* 1. DASHBOARD EXECUTIVO */}
            {activeModule === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-amber-500" /> Dashboard Executivo & Gráficos por Centro de Custo
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Análise financeira e orçamentária filtrada pela obra selecionada no topo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Pagar (Pendente)</span>
                    <p className="text-3xl font-black text-rose-400 mt-3">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Pagar (Quitado)</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Receber (Pendente)</span>
                    <p className="text-3xl font-black text-amber-400 mt-3">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Receber (Recebido)</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Demais módulos preservados */}
            {activeModule === 'administracao' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-amber-500" /> Administração & Governança
                </h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Colaboradores Cadastrados</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Nome</th><th className="p-3">E-mail</th><th className="p-3">Cargo</th><th className="p-3">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {usuarios.map((u: any) => (
                        <tr key={u.id}>
                          <td className="p-3 font-bold text-white">{u.nome}</td>
                          <td className="p-3 text-slate-400">{u.email}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-bold">{u.cargo}</span></td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">{u.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeModule === 'engenharia' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <HardHat className="w-6 h-6 text-amber-500" /> Engenharia & RDO
                  </h1>
                  <button onClick={() => setShowRdoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Novo RDO</button>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Data</th><th className="p-3">Obra</th><th className="p-3">Efetivo</th><th className="p-3">Atividades</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {rdos.map((r: any) => (
                        <tr key={r.id}>
                          <td className="p-3">{new Date(r.data).toLocaleDateString('pt-BR')}</td>
                          <td className="p-3 font-bold text-white">{r.projectName}</td>
                          <td className="p-3 text-amber-500 font-bold">{r.efetivo_proprio + r.efetivo_terceiro} Pessoas</td>
                          <td className="p-3 text-slate-300">{r.atividades_realizadas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeModule === 'compras' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-amber-500" /> Compras & Suprimentos
                  </h1>
                  <div className="flex gap-2">
                    <button onClick={() => setShowSupplierModal(true)} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs">Novo Fornecedor</button>
                    <button onClick={() => setShowRequestModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Solicitar Material</button>
                  </div>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Solicitações de Campo</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Título</th><th className="p-3">Obra</th><th className="p-3">Urgência</th><th className="p-3 text-center">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {requests.map((req: any) => (
                        <tr key={req.id}>
                          <td className="p-3 font-bold text-white">{req.title}</td>
                          <td className="p-3 text-slate-400">{req.projectName}</td>
                          <td className="p-3 uppercase text-amber-500 font-bold">{req.urgency}</td>
                          <td className="p-3 text-center">
                            {req.status !== 'aprovado' ? (
                              <button onClick={() => approveRequest(req.id)} className="px-3 py-1 bg-emerald-600 text-white rounded font-bold">Aprovar</button>
                            ) : (
                              <span className="text-emerald-400 font-bold uppercase">Aprovado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MÓDULO FINANCEIRO COM ANEXO DE NF E COMPROVANTE */}
            {activeModule === 'financeiro' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-amber-500" /> Gestão Financeira Completa
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Lançamento de contas com nota fiscal (HTML/PDF) e baixa com comprovante</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowFinPagarModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">+ Nova Conta a Pagar</button>
                    <button onClick={() => setShowFinReceberModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">+ Novo Recebimento</button>
                  </div>
                </div>

                {/* Tabela Contas a Pagar */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Contas a Pagar (Custos / Despesas)</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Descrição</th>
                        <th className="p-3">Obra</th>
                        <th className="p-3">Vencimento</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Nota Fiscal</th>
                        <th className="p-3">Comprovante</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredPagar.map((f: any) => (
                        <tr key={f.id}>
                          <td className="p-3 font-bold text-white">{f.descricao}</td>
                          <td className="p-3 text-slate-400">{f.projectName}</td>
                          <td className="p-3">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                          <td className="p-3 font-bold text-rose-400">R$ {Number(f.valor).toFixed(2)}</td>
                          <td className="p-3">
                            {f.nf_arquivo ? <span className="text-blue-400 font-semibold">📄 {f.nf_arquivo}</span> : <span className="text-slate-500">Sem NF</span>}
                          </td>
                          <td className="p-3">
                            {f.comprovante_arquivo ? <span className="text-emerald-400 font-semibold">📎 {f.comprovante_arquivo}</span> : <span className="text-slate-500">Pendente</span>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>{f.status}</span>
                          </td>
                          <td className="p-3 text-center">
                            {f.status !== 'pago' ? (
                              <button onClick={() => { setSelectedTituloPagar(f); setShowBaixaPagarModal(true); }} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px]">
                                Pagar / Anexar Recibo
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Quitado</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Tabela Contas a Receber */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Contas a Receber (Medições / Clientes)</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Cliente</th>
                        <th className="p-3">Descrição</th>
                        <th className="p-3">Obra</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Nota Fiscal</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredReceber.map((r: any) => (
                        <tr key={r.id}>
                          <td className="p-3 font-bold text-emerald-400">{r.cliente_nome}</td>
                          <td className="p-3 text-white">{r.descricao}</td>
                          <td className="p-3 text-slate-400">{r.projectName}</td>
                          <td className="p-3 font-bold text-emerald-400">R$ {Number(r.valor).toFixed(2)}</td>
                          <td className="p-3">
                            {r.nf_arquivo ? <span className="text-blue-400 font-semibold">📄 {r.nf_arquivo}</span> : <span className="text-slate-500">Sem NF</span>}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${r.status === 'recebido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>{r.status}</span>
                          </td>
                          <td className="p-3 text-center">
                            {r.status !== 'recebido' ? (
                              <button onClick={() => { setSelectedTituloReceber(r); setShowBaixaReceberModal(true); }} className="px-3 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold text-[10px]">
                                Receber / Comprovante
                              </button>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Recebido</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeModule === 'estoque' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Boxes className="w-6 h-6 text-amber-500" /> Almoxarifado & Estoque
                  </h1>
                  <button onClick={() => setShowEstoqueModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Nova Movimentação</button>
                </div>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Insumo</th><th className="p-3">Obra</th><th className="p-3">Quantidade</th><th className="p-3">Tipo</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {estoque.map((e: any) => (
                        <tr key={e.id}>
                          <td className="p-3 font-bold text-white">{e.produto_nome}</td>
                          <td className="p-3 text-slate-400">{e.projectName}</td>
                          <td className="p-3 font-bold">{e.quantidade} {e.unidade}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold uppercase">{e.tipo}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL: NOVA CONTA A PAGAR COM NOTA FISCAL (HTML/PDF) */}
        {showFinPagarModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Nova Conta a Pagar</h3><button onClick={() => setShowFinPagarModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSavePagar} className="space-y-3">
                <input type="text" required placeholder="Descrição da Despesa" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={finProject} onChange={(e) => setFinProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Geral / Sem Obra</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={finDueDate} onChange={(e) => setFinDueDate(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="number" step="0.01" required placeholder="Valor R$" value={finValue} onChange={(e) => setFinValue(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nota Fiscal (Arquivo HTML ou PDF)</label>
                  <input type="file" accept=".html,.pdf" onChange={(e) => setFinNfFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Lançamento</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: NOVO RECEBIMENTO COM NOTA FISCAL (HTML/PDF) */}
        {showFinReceberModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Recebimento (Contas a Receber)</h3><button onClick={() => setShowFinReceberModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveReceber} className="space-y-3">
                <input type="text" required placeholder="Cliente / Contratante" value={recClient} onChange={(e) => setRecClient(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" required placeholder="Descrição da Medição / Parcela" value={recDesc} onChange={(e) => setRecDesc(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={recProject} onChange={(e) => setRecProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Geral / Sem Obra</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={recDueDate} onChange={(e) => setRecDueDate(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="number" step="0.01" required placeholder="Valor R$" value={recValue} onChange={(e) => setRecValue(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nota Fiscal Faturamento (HTML ou PDF)</label>
                  <input type="file" accept=".html,.pdf" onChange={(e) => setRecNfFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Recebimento</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: BAIXA CONTA A PAGAR COM COMPROVANTE (PDF/IMAGEM) */}
        {showBaixaPagarModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Baixar Título & Anexar Comprovante</h3><button onClick={() => setShowBaixaPagarModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleBaixaPagar} className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1">
                  <p className="text-slate-400">Título: <strong className="text-white">{selectedTituloPagar?.descricao}</strong></p>
                  <p className="text-slate-400">Valor: <strong className="text-rose-400">R$ {Number(selectedTituloPagar?.valor || 0).toFixed(2)}</strong></p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Comprovante de Pagamento (PDF ou Imagem)</label>
                  <input type="file" accept=".pdf,image/*" required onChange={(e) => setCompPagarFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowBaixaPagarModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Confirmar Pagamento e Anexar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: BAIXA CONTA A RECEBER COM COMPROVANTE (PDF/IMAGEM) */}
        {showBaixaReceberModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Confirmar Recebimento & Comprovante</h3><button onClick={() => setShowBaixaReceberModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleBaixaReceber} className="space-y-3">
                <div className="p-3 bg-slate-950 rounded-xl text-xs space-y-1">
                  <p className="text-slate-400">Cliente: <strong className="text-white">{selectedTituloReceber?.cliente_nome}</strong></p>
                  <p className="text-slate-400">Valor: <strong className="text-emerald-400">R$ {Number(selectedTituloReceber?.valor || 0).toFixed(2)}</strong></p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Comprovante Bancário (PDF ou Imagem)</label>
                  <input type="file" accept=".pdf,image/*" required onChange={(e) => setCompReceberFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowBaixaReceberModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Confirmar Recebimento</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRdoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Registrar RDO</h3><button onClick={() => setShowRdoModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveRdo} className="space-y-3">
                <select required value={rdoProject} onChange={(e) => setRdoProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Selecione a Obra...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <textarea rows={3} required placeholder="Atividades realizadas..." value={rdoAtividades} onChange={(e) => setRdoAtividades(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"></textarea>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar RDO</button></div>
              </form>
            </div>
          </div>
        )}

        {showRequestModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Solicitar Material</h3><button onClick={() => setShowRequestModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveRequest} className="space-y-3">
                <input type="text" required placeholder="Título / Insumo" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select required value={reqProject} onChange={(e) => setReqProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Selecione a Obra...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Enviar</button></div>
              </form>
            </div>
          </div>
        )}

        {showSupplierModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Fornecedor</h3><button onClick={() => setShowSupplierModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveSupplier} className="space-y-3">
                <input type="text" required placeholder="Razão Social" value={supName} onChange={(e) => setSupName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="CNPJ" value={supCnpj} onChange={(e) => setSupCnpj(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}

        {showEstoqueModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Movimentação Estoque</h3><button onClick={() => setShowEstoqueModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveEstoque} className="space-y-3">
                <input type="text" required placeholder="Nome do Produto / Insumo" value={estProduto} onChange={(e) => setEstProduto(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Quantidade" value={estQtd} onChange={(e) => setEstQtd(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
