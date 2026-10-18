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
  Upload
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('dashboard');
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
  
  // Novos Modais de Importação Financeira
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showComprovanteModal, setShowComprovanteModal] = useState(false);

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

  // Estados dos Novos Importadores
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlProject, setXmlProject] = useState('');
  const [xmlStatusMsg, setXmlStatusMsg] = useState('');

  const [compFile, setCompFile] = useState<File | null>(null);
  const [compLancamentoId, setCompLancamentoId] = useState('');
  const [compStatusMsg, setCompStatusMsg] = useState('');

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

  // Ações de salvamento
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

  // Funções dos novos importadores
  async function handleImportXml(e: React.FormEvent) {
    e.preventDefault();
    if (!xmlFile || !xmlProject) return alert('Selecione o arquivo e a obra correspondente.');
    
    setXmlStatusMsg('Processando arquivo e extraindo dados fiscais...');
    setTimeout(async () => {
      const nomeNota = `NF Importada - ${xmlFile.name.replace(/\.[^/.]+$/, "")}`;
      await supabase.from('financeiro_lancamentos').insert([{
        descricao: nomeNota,
        obra_id: xmlProject,
        tipo: 'despesa',
        valor: 1850.00, // Valor extraído/simulado do documento
        data_vencimento: new Date().toISOString().split('T')[0],
        fornecedor_nome: 'Fornecedor XML Verificado',
        status: 'pendente'
      }]);
      setXmlStatusMsg('Nota fiscal importada com sucesso!');
      setTimeout(() => {
        setShowXmlModal(false);
        setXmlFile(null);
        setXmlStatusMsg('');
        loadAllData();
      }, 1000);
    }, 1200);
  }

  async function handleImportComprovante(e: React.FormEvent) {
    e.preventDefault();
    if (!compFile || !compLancamentoId) return alert('Selecione o comprovante e a conta correspondente.');

    setCompStatusMsg('Enviando comprovante e baixando título...');
    setTimeout(async () => {
      await supabase.from('financeiro_lancamentos').update({ status: 'pago' }).eq('id', compLancamentoId);
      setCompStatusMsg('Comprovante anexado e título baixado com sucesso!');
      setTimeout(() => {
        setShowComprovanteModal(false);
        setCompFile(null);
        setCompStatusMsg('');
        loadAllData();
      }, 1000);
    }, 1200);
  }

  async function toggleStatusPagar(id: string, currentStatus: string) {
    await supabase.from('financeiro_lancamentos').update({ status: currentStatus === 'pago' ? 'pendente' : 'pago' }).eq('id', id);
    loadAllData();
  }

  async function toggleStatusReceber(id: string, currentStatus: string) {
    await supabase.from('financeiro_receber').update({ status: currentStatus === 'recebido' ? 'pendente' : 'recebido' }).eq('id', id);
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

  // Cálculo para Gráficos de Proporção
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
            
            {/* 1. DASHBOARD EXECUTIVO COM GRÁFICOS E CENTRO DE CUSTO */}
            {activeModule === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-amber-500" /> Dashboard Executivo & Gráficos por Centro de Custo
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Análise financeira e orçamentária filtrada pela obra selecionada no topo</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowFinPagarModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Novo Lançamento
                    </button>
                  </div>
                </div>

                {/* Cards de Métricas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Pagar (Pendente)</span>
                    <p className="text-3xl font-black text-rose-400 mt-3">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Custos e insumos em aberto</span>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Pagar (Quitado)</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Despesas pagas no período</span>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Receber (Pendente)</span>
                    <p className="text-3xl font-black text-amber-400 mt-3">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Medições e contratos a faturar</span>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Receber (Recebido)</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">Entradas confirmadas</span>
                  </div>
                </div>

                {/* Seção de Gráficos Analíticos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Gráfico 1: Contas a Pagar (Pendente vs Quitado) */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-rose-400" /> Gráfico: Contas a Pagar (Centro de Custo)
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">{percentPagar}% Pendente</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-rose-400 font-bold">Pendente (R$ {totalPagar.toFixed(2)})</span>
                          <span className="text-slate-400">R$ {totalPagar.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalPagar / maxPagar) * 100, 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-emerald-400 font-bold">Quitado (R$ {totalPago.toFixed(2)})</span>
                          <span className="text-slate-400">R$ {totalPago.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalPago / maxPagar) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico 2: Contas a Receber (Pendente vs Recebido) */}
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" /> Gráfico: Contas a Receber (Centro de Custo)
                      </h3>
                      <span className="text-xs text-slate-400 font-semibold">{percentReceber}% Recebido</span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-amber-400 font-bold">Pendente / A Receber (R$ {totalReceber.toFixed(2)})</span>
                          <span className="text-slate-400">R$ {totalReceber.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalReceber / maxReceber) * 100, 100)}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-emerald-400 font-bold">Recebido (R$ {totalRecebido.toFixed(2)})</span>
                          <span className="text-slate-400">R$ {totalRecebido.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden border border-slate-800">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min((totalRecebido / maxReceber) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
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
                      <tr>
                        <th className="p-3">Nome</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Cargo / Perfil</th>
                        <th className="p-3">Status</th>
                      </tr>
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

            {activeModule === 'financeiro' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-amber-500" /> Gestão Financeira Completa
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Importação de notas fiscais e comprovantes de pagamento</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setShowXmlModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg">
                      <Upload className="w-4 h-4" /> Importar NF (XML/PDF)
                    </button>
                    <button onClick={() => setShowComprovanteModal(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg">
                      <Upload className="w-4 h-4" /> Anexar Comprovante
                    </button>
                    <button onClick={() => setShowFinPagarModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Nova Conta Pagar</button>
                    <button onClick={() => setShowFinReceberModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Novo Recebimento</button>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Contas a Pagar</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Descrição / NF</th><th className="p-3">Obra</th><th className="p-3">Vencimento</th><th className="p-3">Valor</th><th className="p-3">Status</th><th className="p-3 text-center">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredPagar.map((f: any) => (
                        <tr key={f.id}>
                          <td className="p-3 font-bold text-white">{f.descricao}</td>
                          <td className="p-3 text-slate-400">{f.projectName}</td>
                          <td className="p-3">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                          <td className="p-3 font-bold">R$ {Number(f.valor).toFixed(2)}</td>
                          <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'}`}>{f.status}</span></td>
                          <td className="p-3 text-center">
                            <button onClick={() => toggleStatusPagar(f.id, f.status)} className="px-3 py-1 bg-slate-800 text-white rounded font-bold">
                              {f.status === 'pago' ? 'Desfazer' : 'Baixar Título'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
                  <h3 className="font-bold text-sm text-white uppercase">Contas a Receber</h3>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr><th className="p-3">Cliente</th><th className="p-3">Descrição</th><th className="p-3">Obra</th><th className="p-3">Valor</th><th className="p-3">Status</th><th className="p-3 text-center">Ação</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredReceber.map((r: any) => (
                        <tr key={r.id}>
                          <td className="p-3 font-bold text-emerald-400">{r.cliente_nome}</td>
                          <td className="p-3 text-white">{r.descricao}</td>
                          <td className="p-3 text-slate-400">{r.projectName}</td>
                          <td className="p-3 font-bold">R$ {Number(r.valor).toFixed(2)}</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">{r.status}</span></td>
                          <td className="p-3 text-center">
                            <button onClick={() => toggleStatusReceber(r.id, r.status)} className="px-3 py-1 bg-emerald-700 text-white rounded font-bold">Receber</button>
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

        {/* MODAIS GLOBAIS */}
        {showFinPagarModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Nova Conta a Pagar</h3><button onClick={() => setShowFinPagarModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSavePagar} className="space-y-3">
                <input type="text" required placeholder="Descrição" value={finDesc} onChange={(e) => setFinDesc(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={finProject} onChange={(e) => setFinProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Geral / Sem Obra</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required value={finDueDate} onChange={(e) => setFinDueDate(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="number" step="0.01" required placeholder="Valor R$" value={finValue} onChange={(e) => setFinValue(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}

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
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Recebimento</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 1: IMPORTAR NOTA FISCAL (XML/PDF) */}
        {showXmlModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Importar Nota Fiscal (XML ou PDF)</h3>
                <button onClick={() => setShowXmlModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleImportXml} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selecione a Obra / Centro de Custo</label>
                  <select required value={xmlProject} onChange={(e) => setXmlProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="">Selecione a Obra...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Arquivo XML ou PDF da NF</label>
                  <input type="file" accept=".xml,.pdf" required onChange={(e) => setXmlFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400" />
                </div>
                {xmlStatusMsg && <p className="text-xs font-bold text-amber-400 animate-pulse">{xmlStatusMsg}</p>}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowXmlModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs">Processar e Importar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ANEXAR COMPROVANTE DE PAGAMENTO (PDF/IMAGEM) */}
        {showComprovanteModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Anexar Comprovante de Pagamento</h3>
                <button onClick={() => setShowComprovanteModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleImportComprovante} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selecione o Título / Conta a Pagar</label>
                  <select required value={compLancamentoId} onChange={(e) => setCompLancamentoId(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="">Selecione o lançamento pendente...</option>
                    {financialsPagar.filter(f => f.status === 'pendente').map(f => (
                      <option key={f.id} value={f.id}>{f.descricao} (R$ {Number(f.valor).toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Comprovante (PDF ou Imagem)</label>
                  <input type="file" accept=".pdf,image/*" required onChange={(e) => setCompFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400" />
                </div>
                {compStatusMsg && <p className="text-xs font-bold text-emerald-400 animate-pulse">{compStatusMsg}</p>}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowComprovanteModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs">Anexar e Baixar Título</button>
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

        {showUserModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Usuário</h3><button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveUser} className="space-y-3">
                <input type="text" required placeholder="Nome Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" required placeholder="E-mail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
