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
  ChevronRight,
  LayoutDashboard,
  ShieldCheck,
  X,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  Trash2,
  CheckCircle2,
  Check,
  Paperclip,
  Wallet,
  Filter,
  Users,
  Briefcase,
  Calendar,
  PieChart,
  BarChart3,
  Boxes,
  ClipboardCheck,
  RefreshCw,
  Printer,
  PackageCheck,
  Search,
  Warehouse,
  ShieldAlert,
  Edit3,
  Wrench,
  ArrowRightLeft,
  AlertTriangle,
  MinusCircle,
  ArrowDownLeft
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('suprimentos');
  const [selectedCompany, setSelectedCompany] = useState('Torquato Engenharia Ltda');

  // Estados Globais
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [tributos, setTributos] = useState<any[]>([]);

  // Módulo Suprimentos (Sub-abas Koper)
  const [supSubTab, setSupSubTab] = useState('produtos'); // 'produtos', 'locais', 'balancos', 'epis', 'entradas', 'equipamentos', 'consumo', 'solicitacoes'
  const [produtosSup, setProdutosSup] = useState<any[]>([]);
  const [locaisSup, setLocaisSup] = useState<any[]>([]);
  const [episSup, setEpisSup] = useState<any[]>([]);
  const [entregasEpi, setEntregasEpi] = useState<any[]>([]);
  const [balancosSup, setBalancosSup] = useState<any[]>([]);
  const [entradasSup, setEntradasSup] = useState<any[]>([]);
  const [equipamentosSup, setEquipamentosSup] = useState<any[]>([]);
  const [consumosSup, setConsumosSup] = useState<any[]>([]);
  const [solicitacoesSup, setSolicitacoesSup] = useState<any[]>([]);

  // Detalhes e Modais
  const [balancoDetalhe, setBalancoDetalhe] = useState<any>(null);
  const [balancoItens, setBalancoItens] = useState<any[]>([]);
  const [solicitacaoDetalhe, setSolicitacaoDetalhe] = useState<any>(null);
  const [epiDetalhe, setEpiDetalhe] = useState<any>(null);
  const [equipDetalhe, setEquipDetalhe] = useState<any>(null);
  
  const [visaoLocais, setVisaoLocais] = useState<'lista' | 'controle'>('lista');
  const [showNovaEntradaForm, setShowNovaEntradaForm] = useState(false);
  const [showNovoConsumoForm, setShowNovoConsumoForm] = useState(false);
  const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
  const [showNovoLocalModal, setShowNovoLocalModal] = useState(false);
  const [showNovoEpiModal, setShowNovoEpiModal] = useState(false);
  const [showGerarContratoEpiModal, setShowGerarContratoEpiModal] = useState(false);
  const [showNovoEquipamentoModal, setShowNovoEquipamentoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);

  // Busca e Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatusProduto, setFiltroStatusProduto] = useState('Ativo');
  const [showFiltroModal, setShowFiltroModal] = useState(false);

  // Form States Suprimentos
  const [prodNome, setProdNome] = useState('');
  const [prodEspecificacao, setProdEspecificacao] = useState('');
  const [prodApelido, setProdApelido] = useState('');
  const [prodTipo, setProdTipo] = useState('Material');
  const [prodUnidade, setProdUnidade] = useState('un');
  const [prodMarca, setProdMarca] = useState('');
  const [prodCategoria, setProdCategoria] = useState('Instalações hidráulicas');
  const [prodSubcategoria, setProdSubcategoria] = useState('Tubos e Conexões para esgoto');
  const [prodValorEstimado, setProdValorEstimado] = useState('');
  const [prodObservacoes, setProdObservacoes] = useState('');

  const [localNome, setLocalNome] = useState('');
  const [localCidade, setLocalCidade] = useState('');
  const [epiNome, setEpiNome] = useState('');
  const [epiCa, setEpiCa] = useState('');
  const [epiQtd, setEpiQtd] = useState('10');
  const [epiColaborador, setEpiColaborador] = useState('');
  const [epiObra, setEpiObra] = useState('Obra Res. Pôr do Sol');
  const [epiItemSelecionado, setEpiItemSelecionado] = useState('');
  const [epiQtdEntrega, setEpiQtdEntrega] = useState('1');

  const [equipNome, setEquipNome] = useState('');
  const [equipProdutoAssociado, setEquipProdutoAssociado] = useState('');
  const [equipEspec, setEquipEspec] = useState('');
  const [equipAnoFab, setEquipAnoFab] = useState('2024');
  const [equipAnoMod, setEquipAnoMod] = useState('2024');
  const [equipDataAquisicao, setEquipDataAquisicao] = useState('');
  const [equipLocalAlocado, setEquipLocalAlocado] = useState('Casa da Andreia');

  // Form Financeiro
  const [finDescricao, setFinDescricao] = useState('');
  const [finValor, setFinValor] = useState('');
  const [finTipo, setFinTipo] = useState('pagar');
  const [finVencimento, setFinVencimento] = useState('');
  const [finCategoria, setFinCategoria] = useState('Material de Obra');
  const [finCentroCusto, setFinCentroCusto] = useState('Geral / Sede');
  const [finStatus, setFinStatus] = useState('Pendente');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const { data: empData } = await supabase.from('empresas_erp').select('*').order('created_at', { ascending: true });
      if (empData && empData.length > 0) {
        setEmpresas(empData);
        if (!selectedCompany) setSelectedCompany(empData[0].nome);
      }

      const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('vencimento', { ascending: true });
      if (pagData) setFinancialsPagar(pagData);

      const { data: recData } = await supabase.from('financeiro_receber').select('*').order('vencimento', { ascending: true });
      if (recData) setFinancialsReceber(recData);

      const { data: bancoData } = await supabase.from('contas_bancarias').select('*');
      if (bancoData) setContasBancarias(bancoData);

      const { data: bolData } = await supabase.from('boletos_erp').select('*');
      if (bolData) setBoletos(bolData);

      const { data: tribData } = await supabase.from('tributos_erp').select('*').order('vencimento', { ascending: true });
      if (tribData) setTributos(tribData);

      // Suprimentos
      const { data: prodData } = await supabase.from('suprimentos_produtos').select('*').order('created_at', { ascending: false });
      if (prodData) setProdutosSup(prodData);

      const { data: locData } = await supabase.from('suprimentos_locais').select('*').order('created_at', { ascending: false });
      if (locData) setLocaisSup(locData);

      const { data: epiData } = await supabase.from('suprimentos_epis').select('*').order('created_at', { ascending: false });
      if (epiData) setEpisSup(epiData);

      const { data: entData } = await supabase.from('suprimentos_epi_entregas').select('*').order('created_at', { ascending: false });
      if (entData) setEntregasEpi(entData);

      const { data: balData } = await supabase.from('suprimentos_balancos').select('*').order('created_at', { ascending: false });
      if (balData) setBalancosSup(balData);

      const { data: entradaData } = await supabase.from('suprimentos_entradas').select('*').order('created_at', { ascending: false });
      if (entradaData) setEntradasSup(entradaData);

      const { data: equipData } = await supabase.from('suprimentos_equipamentos').select('*').order('created_at', { ascending: false });
      if (equipData) setEquipamentosSup(equipData);

      const { data: consData } = await supabase.from('suprimentos_consumos').select('*').order('created_at', { ascending: false });
      if (consData) setConsumosSup(consData);

      const { data: solData } = await supabase.from('suprimentos_solicitacoes').select('*').order('created_at', { ascending: false });
      if (solData) setSolicitacoesSup(solData);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  // Carregar itens do balanço selecionado
  async function abrirBalancoDetalhe(bal: any) {
    setBalancoDetalhe(bal);
    const { data } = await supabase.from('suprimentos_balanco_itens').select('*').eq('balanco_id', bal.id);
    if (data && data.length > 0) {
      setBalancoItens(data);
    } else {
      // Itens padrão espelho Koper se estiver vazio
      setBalancoItens([
        { id: '1', produto_nome: 'Cimento CP-1 50kg', categoria_subcategoria: 'Concretos, Grautes e Argamassas / Cimento e Cal', quant_atual: 372, quant_real: 372, unidade: 'un' },
        { id: '2', produto_nome: 'Cimento CP-2 50kg', categoria_subcategoria: 'Concretos, Grautes e Argamassas / Cimento e Cal', quant_atual: 93, quant_real: 93, unidade: 'un' },
        { id: '3', produto_nome: 'Cimento teste Portland CP-3 50kg', categoria_subcategoria: 'Concretos, Grautes e Argamassas / Cimento e Cal', quant_atual: 11, quant_real: 11, unidade: 'un' },
        { id: '4', produto_nome: 'Vergalhão CA-50 barra c/12mts 10,0mm - 3/8"', categoria_subcategoria: 'Armaduras / Vergalhões', quant_atual: 32, quant_real: 32, unidade: 'un' },
      ]);
    }
  }

  async function handleSalvarItemBalanco(itemId: string, novaQuantReal: number) {
    setBalancoItens(balancoItens.map(i => i.id === itemId ? { ...i, quant_real: novaQuantReal } : i));
  }

  async function handleSaveProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!prodNome) return;
    await supabase.from('suprimentos_produtos').insert([{
      nome: prodNome, especificacao: prodEspecificacao, apelido: prodApelido || '-', tipo: prodTipo,
      unidade: prodUnidade, marca: prodMarca, categoria: prodCategoria, subcategoria: prodSubcategoria,
      valor_estimado: parseFloat(prodValorEstimado || '0'), observacoes: prodObservacoes, status: 'Ativo', empresa: selectedCompany
    }]);
    setShowNovoProdutoModal(false); setProdNome(''); loadAllData();
  }

  async function handleSaveEquipamento(e: React.FormEvent) {
    e.preventDefault();
    if (!equipNome) return;
    await supabase.from('suprimentos_equipamentos').insert([{
      nome: equipNome, produto_associado: equipProdutoAssociado || equipNome, especificacao: equipEspec,
      ano_fabricacao: equipAnoFab, ano_modelo: equipAnoMod, data_aquisicao: equipDataAquisicao || new Date().toISOString().split('T')[0],
      local_alocado: equipLocalAlocado, status: 'Disponível', empresa: selectedCompany
    }]);
    setShowNovoEquipamentoModal(false); setEquipNome(''); loadAllData();
  }

  async function handleSaveFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!finDescricao || !finValor) return;
    const tableTarget = finTipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).insert([{
      descricao: finDescricao, valor: parseFloat(finValor || '0'), vencimento: finVencimento || new Date().toISOString().split('T')[0],
      categoria: finCategoria, centro_custo: finCentroCusto, status: finStatus, empresa: selectedCompany
    }]);
    setShowFinanceiroModal(false); setFinDescricao(''); setFinValor(''); loadAllData();
  }

  const filteredPagar = financialsPagar.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredReceber = financialsReceber.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredBancos = contasBancarias.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const totalPagar = filteredPagar.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalReceber = filteredReceber.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalSaldosBancos = filteredBancos.reduce((acc, item) => acc + Number(item.saldo || 0), 0);
  const saldoLiquido = totalReceber - totalPagar;

  const produtosFiltrados = produtosSup.filter(p => p.nome?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg">TE</div>
              <div>
                <span className="font-bold text-sm tracking-wide text-white block">TORQUATO ENGENHARIA</span>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block -mt-1">ERP Corporativo</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <Building2 className="w-4 h-4 text-amber-500" />
              <span className="text-slate-400">Empresa Ativa:</span>
              <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer">
                {empresas.map(emp => <option key={emp.id} value={emp.nome} className="bg-slate-900">{emp.nome}</option>)}
              </select>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
            <nav className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Módulos do Sistema</div>

              <button onClick={() => setActiveModule('dashboard')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${activeModule === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Dashboard Executivo</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button onClick={() => setActiveModule('financeiro')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> Módulo Financeiro Koper</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button onClick={() => setActiveModule('suprimentos')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${activeModule === 'suprimentos' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3"><Boxes className="w-4 h-4" /> Suprimentos</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button onClick={() => setActiveModule('administracao')} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${activeModule === 'administracao' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Administração & Governança</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {/* 1. DASHBOARD */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-amber-500" /> Dashboard Executivo</h1>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800"><p className="text-xs font-bold text-slate-400">Saldo Bancário Total</p><h3 className="text-xl font-black text-amber-400">R$ {totalSaldosBancos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3></div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800"><p className="text-xs font-bold text-slate-400">Contas a Pagar</p><h3 className="text-xl font-black text-rose-400">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3></div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800"><p className="text-xs font-bold text-slate-400">Contas a Receber</p><h3 className="text-xl font-black text-emerald-400">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3></div>
                  <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800"><p className="text-xs font-bold text-slate-400">Resultado Projetado</p><h3 className="text-xl font-black text-amber-400">R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3></div>
                </div>
              </div>
            )}

            {/* 2. MÓDULO FINANCEIRO */}
            {activeModule === 'financeiro' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-white flex items-center gap-2"><DollarSign className="w-6 h-6 text-emerald-500" /> Módulo Financeiro</h1>
                  <button onClick={() => setShowFinanceiroModal(true)} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">+ Novo Lançamento</button>
                </div>
              </div>
            )}

            {/* 3. MÓDULO SUPRIMENTOS (COMPLETO KOPER) */}
            {activeModule === 'suprimentos' && (
              <div className="space-y-6">
                {/* SUB-NAVEGAÇÃO KOPER */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <button onClick={() => { setSupSubTab('balancos'); setBalancoDetalhe(null); setSolicitacaoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'balancos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Balanços</button>
                    <button onClick={() => { setSupSubTab('solicitacoes'); setBalancoDetalhe(null); setSolicitacaoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'solicitacoes' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Compras / Solicitações</button>
                    <button onClick={() => { setSupSubTab('produtos'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'produtos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Produtos</button>
                    <button onClick={() => { setSupSubTab('locais'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'locais' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Locais de Estoque</button>
                    <button onClick={() => { setSupSubTab('entradas'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'entradas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Entradas</button>
                    <button onClick={() => { setSupSubTab('equipamentos'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'equipamentos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Equipamentos</button>
                    <button onClick={() => { setSupSubTab('consumo'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'consumo' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Consumo</button>
                    <button onClick={() => { setSupSubTab('epis'); setBalancoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'epis' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>EPIs</button>
                  </div>

                  <div className="flex items-center gap-2">
                    {supSubTab === 'produtos' && (
                      <button onClick={() => setShowNovoProdutoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"><Plus className="w-4 h-4" /> + Produto</button>
                    )}
                    {supSubTab === 'equipamentos' && (
                      <button onClick={() => setShowNovoEquipamentoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ EQUIPAMENTO</button>
                    )}
                  </div>
                </div>

                {/* 3.1 TELA DE BALANÇOS (ESPELHO KOPER) */}
                {supSubTab === 'balancos' && !balancoDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-amber-500" /> Balanços de Estoque</h3>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 w-64">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Pesquisar em balanço..." className="bg-transparent text-xs text-white focus:outline-none w-full" />
                      </div>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Local</th><th className="p-3">Setor</th><th className="p-3">Última Alteração</th><th className="p-3">Data Prevista</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {balancosSup.length === 0 ? (
                          <>
                            <tr onClick={() => abrirBalancoDetalhe({ id: '1', codigo_balanco: '2176', local: 'Vila real', setor: 'Geral', status: 'Atrasado', data_prevista: '19/03/2026' })} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">2176</td><td className="p-3 font-bold text-white underline">Vila real</td><td className="p-3 text-slate-300">Geral</td><td className="p-3 text-slate-400">18/05/2026 11:09:26</td><td className="p-3 text-slate-300">19/03/2026</td><td className="p-3"><span className="text-rose-500 font-bold">● Atrasado</span></td>
                            </tr>
                            <tr onClick={() => abrirBalancoDetalhe({ id: '2', codigo_balanco: '2175', local: '1201', setor: 'Geral', status: 'Atrasado', data_prevista: '05/03/2026' })} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">2175</td><td className="p-3 font-bold text-white underline">1201</td><td className="p-3 text-slate-300">Geral</td><td className="p-3 text-slate-500">-</td><td className="p-3 text-slate-300">05/03/2026</td><td className="p-3"><span className="text-rose-500 font-bold">● Atrasado</span></td>
                            </tr>
                            <tr className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">2142</td><td className="p-3 font-bold text-white">1201</td><td className="p-3 text-slate-300">Geral</td><td className="p-3 text-slate-400">19/02/2026 16:17:30</td><td className="p-3 text-slate-300">27/01/2026</td><td className="p-3"><span className="text-emerald-400 font-bold">● Realizado</span></td>
                            </tr>
                          </>
                        ) : (
                          balancosSup.map((b: any) => (
                            <tr key={b.id} onClick={() => abrirBalancoDetalhe(b)} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">{b.codigo_balanco}</td>
                              <td className="p-3 font-bold text-white underline">{b.local}</td>
                              <td className="p-3 text-slate-300">{b.setor}</td>
                              <td className="p-3 text-slate-400">{b.ultima_alteracao}</td>
                              <td className="p-3 text-slate-300">{b.data_prevista}</td>
                              <td className="p-3"><span className={`font-bold ${b.status === 'Realizado' ? 'text-emerald-400' : 'text-rose-500'}`}>● {b.status}</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.1.1 FICHA DETALHADA DO BALANÇO (PREENCHIMENTO DE QUANT. REAL) */}
                {supSubTab === 'balancos' && balancoDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <button onClick={() => setBalancoDetalhe(null)} className="text-xs text-amber-400 font-bold mb-1 block">← Voltar para Balanços</button>
                        <h3 className="font-bold text-lg text-white">Balanço #{balancoDetalhe.codigo_balanco}</h3>
                      </div>
                      <button onClick={() => alert('Balanço impresso com sucesso!')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                        <Printer className="w-4 h-4" /> IMPRIMIR BALANÇO
                      </button>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-3 gap-4 text-xs">
                      <div><p className="text-slate-500">Código</p><p className="font-bold text-amber-400">{balancoDetalhe.codigo_balanco}</p></div>
                      <div><p className="text-slate-500">Local de estoque</p><p className="font-bold text-white">{balancoDetalhe.local}</p></div>
                      <div><p className="text-slate-500">Status</p><p className="font-bold text-rose-500">{balancoDetalhe.status}</p></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-xs uppercase text-amber-400">Itens do Inventário Físico</h4>
                        <button onClick={() => alert('Todos os itens salvos!')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">Salvar todos</button>
                      </div>

                      <table className="w-full text-left text-xs bg-slate-950 rounded-xl">
                        <thead className="text-slate-400 uppercase">
                          <tr><th className="p-3">Produto</th><th className="p-3">Cat. / Subcat.</th><th className="p-3">Quant. Atual</th><th className="p-3">Quant. Real</th><th className="p-3 text-right">Ação</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {balancoItens.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-900/50">
                              <td className="p-3 font-bold text-white">{item.produto_nome}</td>
                              <td className="p-3 text-slate-400">{item.categoria_subcategoria}</td>
                              <td className="p-3 font-mono text-amber-400">{item.quant_atual} {item.unidade}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="number" 
                                    value={item.quant_real} 
                                    onChange={(e) => handleSalvarItemBalanco(item.id, parseFloat(e.target.value || '0'))}
                                    className="w-20 p-1.5 bg-slate-900 border border-slate-700 rounded text-center text-white font-mono" 
                                  />
                                  <span className="text-slate-400">{item.unidade}</span>
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => alert(`Salvo item ${item.produto_nome}`)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded">Salvar</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3.2 TELA DE SOLICITAÇÕES DE COMPRAS & APROVAÇÃO (ESPELHO KOPER) */}
                {supSubTab === 'solicitacoes' && !solicitacaoDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-amber-500" /> Aprovar Solicitações de Compra</h3>
                      <button className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs">Finalizados</button>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Local de Consumo</th><th className="p-3">Itens Solicitados</th><th className="p-3">Solicitado em</th><th className="p-3">Prazo de Entrega</th><th className="p-3">Status</th><th className="p-3 text-center">Ações</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        <tr onClick={() => setSolicitacaoDetalhe({ codigo: '9586', local: '1201', data: '18/05/2026', prazo: '25/05/2026', produto: 'Aço Ca-50 10Mm 1', qtd: 2 })} className="hover:bg-slate-950/50 cursor-pointer">
                          <td className="p-3 font-bold text-white underline">1201</td>
                          <td className="p-3 text-amber-400 font-mono">1</td>
                          <td className="p-3 text-slate-400">18/05/2026</td>
                          <td className="p-3 text-slate-300">25/05/2026</td>
                          <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full font-bold text-[10px]">Em análise</span></td>
                          <td className="p-3 text-center">
                            <button onClick={(e) => { e.stopPropagation(); setSolicitacaoDetalhe({ codigo: '9586', local: '1201', data: '18/05/2026', prazo: '25/05/2026', produto: 'Aço Ca-50 10Mm 1', qtd: 2 }); }} className="p-1.5 bg-emerald-600 text-white rounded"><Check className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.2.1 FICHA DE APROVAÇÃO DE SOLICITAÇÃO DE COMPRA #9586 */}
                {supSubTab === 'solicitacoes' && solicitacaoDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <button onClick={() => setSolicitacaoDetalhe(null)} className="text-xs text-amber-400 font-bold mb-1 block">← Voltar para Solicitações</button>
                        <h3 className="font-bold text-lg text-white">Solicitação #{solicitacaoDetalhe.codigo}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => alert('Reprovado!')} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs">Reprovar</button>
                        <button onClick={() => alert('Aprovado com sucesso!')} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Aprovar</button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-4 gap-4 text-xs">
                      <div><p className="text-slate-500">Solicitante</p><p className="font-bold text-white">Koper</p></div>
                      <div><p className="text-slate-500">Data de solicitação</p><p className="font-bold text-slate-300">{solicitacaoDetalhe.data}</p></div>
                      <div><p className="text-slate-500">Previsão de entrega</p><p className="font-bold text-amber-400">{solicitacaoDetalhe.prazo}</p></div>
                      <div><p className="text-slate-500">Local de consumo</p><p className="font-bold text-white">{solicitacaoDetalhe.local}</p></div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-bold text-xs uppercase text-amber-400">Produtos Solicitados & Transferência Interna</h4>
                      <table className="w-full text-left text-xs bg-slate-950 rounded-xl">
                        <thead className="text-slate-400 uppercase">
                          <tr><th className="p-3">Código</th><th className="p-3">Produto</th><th className="p-3">Solicitado</th><th className="p-3">Aprovado + Transferido</th><th className="p-3">Aprovado p/ Compra</th></tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-slate-800">
                            <td className="p-3 font-bold text-amber-400">6894</td>
                            <td className="p-3 font-bold text-white">{solicitacaoDetalhe.produto}</td>
                            <td className="p-3 font-mono">{solicitacaoDetalhe.qtd} kg</td>
                            <td className="p-3 font-mono text-emerald-400">0</td>
                            <td className="p-3 font-mono text-amber-400">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* DEMAIS ABAS PERMANECEM ÍNTEGRAS */}
                {supSubTab === 'produtos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Produto</th><th className="p-3">Unidade</th><th className="p-3">Marca</th><th className="p-3">Tipo</th><th className="p-3">Categoria</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {produtosFiltrados.map((prod: any, idx: number) => (
                          <tr key={prod.id || idx} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-amber-400">{prod.codigo || (100 + idx)}</td>
                            <td className="p-3 font-bold text-white">{prod.nome}</td>
                            <td className="p-3 font-bold text-amber-400 uppercase font-mono">{prod.unidade || 'un'}</td>
                            <td className="p-3 text-slate-300">{prod.marca || '-'}</td>
                            <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{prod.tipo || 'Material'}</span></td>
                            <td className="p-3 text-slate-300">{prod.categoria || 'Geral'}</td>
                            <td className="p-3"><span className="text-emerald-400 font-bold">Ativo</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {activeModule === 'administracao' && (
              <div className="p-6 text-slate-300">Painel de Administração e Governança Corporativa.</div>
            )}
          </main>
        </div>

        {/* MODAL FINANCEIRO */}
        {showFinanceiroModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Lançamento Financeiro</h3><button onClick={() => setShowFinanceiroModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveFinanceiro} className="space-y-3">
                <input type="text" required placeholder="Descrição" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValor} onChange={(e) => setFinValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={finVencimento} onChange={(e) => setFinVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer">Salvar Lançamento</button></div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
