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
  ArrowDownLeft,
  ArrowUpRight
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('suprimentos');
  const [selectedCompany, setSelectedCompany] = useState('Torquato Engenharia Ltda');

  // Estados Globais - Admin & Financeiro
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [tributos, setTributos] = useState<any[]>([]);

  // Módulo Suprimentos (Sub-abas Koper)
  const [supSubTab, setSupSubTab] = useState('produtos'); // 'produtos', 'locais', 'balancos', 'epis', 'entradas', 'equipamentos', 'consumo'
  const [produtosSup, setProdutosSup] = useState<any[]>([]);
  const [locaisSup, setLocaisSup] = useState<any[]>([]);
  const [episSup, setEpisSup] = useState<any[]>([]);
  const [entregasEpi, setEntregasEpi] = useState<any[]>([]);
  const [balancosSup, setBalancosSup] = useState<any[]>([]);
  const [entradasSup, setEntradasSup] = useState<any[]>([]);
  const [equipamentosSup, setEquipamentosSup] = useState<any[]>([]);
  const [consumosSup, setConsumosSup] = useState<any[]>([]);
  
  const [visaoLocais, setVisaoLocais] = useState<'lista' | 'controle'>('lista');
  const [epiDetalhe, setEpiDetalhe] = useState<any>(null);
  const [equipDetalhe, setEquipDetalhe] = useState<any>(null);
  const [consumoDetalhe, setConsumoDetalhe] = useState<any>(null);

  // Visões de Formulário Duplo (Entradas e Consumos)
  const [showNovaEntradaForm, setShowNovaEntradaForm] = useState(false);
  const [showNovoConsumoForm, setShowNovoConsumoForm] = useState(false);

  // Busca e Filtros Suprimentos
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatusProduto, setFiltroStatusProduto] = useState('Ativo');
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const [filtroLocalConsumo, setFiltroLocalConsumo] = useState('Todos');

  // Modais de Suprimentos
  const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
  const [showNovoLocalModal, setShowNovoLocalModal] = useState(false);
  const [showNovoEpiModal, setShowNovoEpiModal] = useState(false);
  const [showGerarContratoEpiModal, setShowGerarContratoEpiModal] = useState(false);
  const [showNovoEquipamentoModal, setShowNovoEquipamentoModal] = useState(false);

  // Sub-abas Financeiro e Filtros Dashboard
  const [finSubTab, setFinSubTab] = useState('pagar');
  const [dashFiltroStatus, setDashFiltroStatus] = useState('todos');
  const [dashFiltroCategoria, setDashFiltroCategoria] = useState('todas');
  const [dashFiltroCentroCusto, setDashFiltroCentroCusto] = useState('todos');
  const [dashFiltroPrazo, setDashFiltroPrazo] = useState('30');
  const [dashDataInicio, setDashDataInicio] = useState('');
  const [dashDataFim, setDashDataFim] = useState('');

  // Modais Financeiro / Admin
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [showTributoModal, setShowTributoModal] = useState(false);

  // Forms Suprimentos
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

  // Form Equipamento
  const [equipNome, setEquipNome] = useState('');
  const [equipProdutoAssociado, setEquipProdutoAssociado] = useState('');
  const [equipEspec, setEquipEspec] = useState('');
  const [equipAnoFab, setEquipAnoFab] = useState('2024');
  const [equipAnoMod, setEquipAnoMod] = useState('2024');
  const [equipDataAquisicao, setEquipDataAquisicao] = useState('');
  const [equipLocalAlocado, setEquipLocalAlocado] = useState('Casa da Andreia');
  const [equipPrazoManutencao, setEquipPrazoManutencao] = useState('30');
  const [equipObs, setEquipObs] = useState('');

  // Form Consumo
  const [consLocal, setConsLocal] = useState('Casa Diário');
  const [consRetiradoPor, setConsRetiradoPor] = useState('Maria Eduarda Pereira Martins');
  const [consComentarios, setConsComentarios] = useState('');
  const [consItensSelecionados, setConsItensSelecionados] = useState<any[]>([
    { produto: 'Abraçadeira De pressão', setor: 'Geral', disponivel: '10,00 un', uso: '1,00', valor: 15.00 }
  ]);

  // Forms Financeiro & Admin
  const [finDescricao, setFinDescricao] = useState('');
  const [finValor, setFinValor] = useState('');
  const [finTipo, setFinTipo] = useState('pagar');
  const [finVencimento, setFinVencimento] = useState('');
  const [finCategoria, setFinCategoria] = useState('Material de Obra');
  const [finCentroCusto, setFinCentroCusto] = useState('Geral / Sede');
  const [finStatus, setFinStatus] = useState('Pendente');
  const [finNfNome, setFinNfNome] = useState('');
  const [finNfUrl, setFinNfUrl] = useState('');
  const [finCompNome, setFinCompNome] = useState('');
  const [finCompUrl, setFinCompUrl] = useState('');

  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');
  const [bancoNome, setBancoNome] = useState('');
  const [bancoAgencia, setBancoAgencia] = useState('');
  const [bancoConta, setBancoConta] = useState('');
  const [bancoSaldo, setBancoSaldo] = useState('');
  const [tribImposto, setTribImposto] = useState('DAS (Simples Nacional)');
  const [tribCompetencia, setTribCompetencia] = useState('');
  const [tribValor, setTribValor] = useState('');
  const [tribVencimento, setTribVencimento] = useState('');

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

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  // Handlers do Módulo Suprimentos
  async function handleSaveProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!prodNome) return;
    await supabase.from('suprimentos_produtos').insert([{
      nome: prodNome, especificacao: prodEspecificacao, apelido: prodApelido || '-', tipo: prodTipo,
      unidade: prodUnidade, marca: prodMarca, categoria: prodCategoria, subcategoria: prodSubcategoria,
      valor_estimado: parseFloat(prodValorEstimado || '0'), observacoes: prodObservacoes, status: 'Ativo', empresa: selectedCompany
    }]);
    setShowNovoProdutoModal(false);
    setProdNome(''); setProdEspecificacao(''); loadAllData();
  }

  async function handleSaveLocal(e: React.FormEvent) {
    e.preventDefault();
    if (!localNome) return;
    await supabase.from('suprimentos_locais').insert([{
      nome: localNome, cidade: localCidade || 'Belo Horizonte', status: 'Ativo', status_balanco: 'Sem balanço', empresa: selectedCompany
    }]);
    setShowNovoLocalModal(false); setLocalNome(''); loadAllData();
  }

  async function handleSaveEquipamento(e: React.FormEvent) {
    e.preventDefault();
    if (!equipNome) return;
    await supabase.from('suprimentos_equipamentos').insert([{
      nome: equipNome, produto_associado: equipProdutoAssociado || equipNome, especificacao: equipEspec,
      ano_fabricacao: equipAnoFab, ano_modelo: equipAnoMod, data_aquisicao: equipDataAquisicao || new Date().toISOString().split('T')[0],
      local_alocado: equipLocalAlocado, prazo_manutencao: parseInt(equipPrazoManutencao || '30'), status: 'Disponível', observacoes: equipObs, empresa: selectedCompany
    }]);
    setShowNovoEquipamentoModal(false); setEquipNome(''); loadAllData();
  }

  async function handleSaveConsumo(e: React.FormEvent) {
    e.preventDefault();
    const totalVal = consItensSelecionados.reduce((a, b) => a + Number(b.valor || 0), 0);
    await supabase.from('suprimentos_consumos').insert([{
      local_consumo: consLocal, retirado_por: consRetiradoPor, tipo_consumo: 'Entrega',
      quantidade_itens: consItensSelecionados.length, valor_total: totalVal, comentarios: consComentarios, empresa: selectedCompany
    }]);
    setShowNovoConsumoForm(false); loadAllData();
  }

  // Handlers Financeiros & Admin
  async function handleSaveFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!finDescricao || !finValor) return;
    const tableTarget = finTipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).insert([{
      descricao: finDescricao, valor: parseFloat(finValor || '0'), vencimento: finVencimento || new Date().toISOString().split('T')[0],
      categoria: finCategoria, centro_custo: finCentroCusto, status: finStatus, empresa: selectedCompany,
      nf_nome: finNfNome || null, nf_url: finNfUrl || null, comprovante_nome: finCompNome || null, comprovante_url: finCompUrl || null
    }]);
    setShowFinanceiroModal(false); setFinDescricao(''); setFinValor(''); loadAllData();
  }

  // Filtros Globais
  const filteredPagar = financialsPagar.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredReceber = financialsReceber.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredBancos = contasBancarias.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredTributos = tributos.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);

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
            
            {/* 1. DASHBOARD EXECUTIVO */}
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

            {/* 3. MÓDULO SUPRIMENTOS COMPLETO KOPER */}
            {activeModule === 'suprimentos' && (
              <div className="space-y-6">
                {/* SUB-NAVEGAÇÃO COMPLETA DAS TELAS KOPER */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <button onClick={() => { setSupSubTab('produtos'); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'produtos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Produtos</button>
                    <button onClick={() => { setSupSubTab('locais'); setVisaoLocais('lista'); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'locais' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Locais de Estoque</button>
                    <button onClick={() => { setSupSubTab('entradas'); setShowNovaEntradaForm(false); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'entradas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Entradas</button>
                    <button onClick={() => { setSupSubTab('equipamentos'); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'equipamentos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Equipamentos</button>
                    <button onClick={() => { setSupSubTab('consumo'); setShowNovoConsumoForm(false); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'consumo' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Consumo</button>
                    <button onClick={() => { setSupSubTab('epis'); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'epis' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>EPIs</button>
                    <button onClick={() => { setSupSubTab('balancos'); setEpiDetalhe(null); setEquipDetalhe(null); setConsumoDetalhe(null); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'balancos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Balanços</button>
                  </div>

                  {/* AÇÕES DE CADA ABA */}
                  <div className="flex items-center gap-2">
                    {supSubTab === 'produtos' && (
                      <button onClick={() => setShowNovoProdutoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"><Plus className="w-4 h-4" /> + Produto</button>
                    )}
                    {supSubTab === 'entradas' && !showNovaEntradaForm && (
                      <>
                        <button onClick={() => setShowNovaEntradaForm(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ ENTRADA</button>
                        <button className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/10 cursor-pointer">VER FINALIZADAS</button>
                      </>
                    )}
                    {supSubTab === 'equipamentos' && !equipDetalhe && (
                      <button onClick={() => setShowNovoEquipamentoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ EQUIPAMENTO</button>
                    )}
                    {supSubTab === 'consumo' && !showNovoConsumoForm && !consumoDetalhe && (
                      <button onClick={() => setShowNovoConsumoForm(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ CONSUMO</button>
                    )}
                  </div>
                </div>

                {/* 3.1 TELA DE ENTRADAS DE ESTOQUE (ESPELHO KOPER) */}
                {supSubTab === 'entradas' && !showNovaEntradaForm && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><ArrowDownLeft className="w-4 h-4 text-amber-500" /> ENTRADAS PENDENTES</h3>
                      <button className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs">Entradas aguardando NFe/Recibo</button>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Origem</th><th className="p-3">Local De Entrada</th><th className="p-3">Quantidade De Itens</th><th className="p-3">NFe/Recibo</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {entradasSup.length === 0 ? (
                          <>
                            <tr className="bg-amber-500/10 text-amber-300"><td className="p-3 font-bold">⚠️ 5926</td><td className="p-3">Casas d' agua - Biguaçu</td><td className="p-3">Vila real</td><td className="p-3">1 item</td><td className="p-3 font-mono">#7322</td></tr>
                            <tr className="bg-amber-500/10 text-amber-300"><td className="p-3 font-bold">⚠️ 6684</td><td className="p-3">Casas d' agua - Biguaçu</td><td className="p-3">Vila real</td><td className="p-3">1 item</td><td className="p-3 font-mono">1963</td></tr>
                            <tr className="hover:bg-slate-950/50"><td className="p-3 font-bold text-amber-400">10680</td><td className="p-3 text-white">Casa da Andreia</td><td className="p-3 text-slate-300">Casa da Andreia</td><td className="p-3">1 item</td><td className="p-3 text-slate-500">-</td></tr>
                          </>
                        ) : (
                          entradasSup.map((ent: any) => (
                            <tr key={ent.id} className="hover:bg-slate-950/50">
                              <td className="p-3 font-bold text-amber-400">{ent.codigo}</td>
                              <td className="p-3 font-bold text-white">{ent.origem}</td>
                              <td className="p-3 text-slate-300">{ent.local_entrada}</td>
                              <td className="p-3">{ent.qtd_itens} item(s)</td>
                              <td className="p-3 font-mono text-amber-400">{ent.nfe_recibo}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.1.1 FORMULARIO DUPLO DE NOVA ENTRADA (INTEGRAÇÃO & DRAG) */}
                {supSubTab === 'entradas' && showNovaEntradaForm && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <button onClick={() => setShowNovaEntradaForm(false)} className="text-xs text-amber-400 hover:underline font-bold">← Voltar para Entradas</button>
                      <h3 className="font-bold text-base text-white">Registrar Entrada no Estoque</h3>
                      <button onClick={() => setShowNovaEntradaForm(false)} className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Entrada</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* PAINEL ESQUERDO: SELEÇÃO DE PRODUTOS */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <p className="font-bold text-xs uppercase text-amber-400">Catálogo de Produtos</p>
                        <input type="text" placeholder="Pesquisar em produtos..." className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" />
                        <div className="max-h-80 overflow-y-auto space-y-1">
                          {produtosSup.map((p, i) => (
                            <div key={i} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                              <div><p className="font-bold text-white">{p.nome}</p><p className="text-[10px] text-slate-400">{p.subcategoria || 'Geral'}</p></div>
                              <button className="px-2 py-1 bg-amber-500/20 text-amber-400 font-bold rounded text-[10px]">Adicionar →</button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* PAINEL DIREITO: DESTINO DA ENTRADA */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
                        <p className="font-bold text-xs uppercase text-emerald-400">Destino & Origem da Entrada</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-[10px] text-slate-400">Local de Destino</label><select className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"><option>1201 - Obra Res. Pôr do Sol</option></select></div>
                          <div><label className="block text-[10px] text-slate-400">Tipo de Entrada</label><select className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"><option>Devolução para estoque</option><option>Compra de Fornecedor</option></select></div>
                        </div>

                        <div className="p-6 border-2 border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                          Segure e arraste os itens para dentro da tabela para integrar
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3.2 TELA DE EQUIPAMENTOS (ESPELHO KOPER) */}
                {supSubTab === 'equipamentos' && !equipDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Wrench className="w-4 h-4 text-amber-500" /> Equipamentos & Máquinas</h3>
                      <button className="px-3.5 py-2 border border-slate-700 text-slate-300 font-bold rounded-xl text-xs">VER BAIXADOS</button>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Equipamento</th><th className="p-3">Data Aquisição</th><th className="p-3">Últ. Manutenção</th><th className="p-3">Alocado Em</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {equipamentosSup.length === 0 ? (
                          <>
                            <tr onClick={() => setEquipDetalhe({ codigo: 832, nome: 'Betoneira 01', produto: 'betoneira', status: 'Disponível', alocado: 'Casa da Andreia' })} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">832</td><td className="p-3 font-bold text-white underline">Betoneira 01</td><td className="p-3 text-slate-400">05/05/2026</td><td className="p-3 text-slate-500">-</td><td className="p-3 text-slate-300">Casa da Andreia</td><td className="p-3"><span className="text-emerald-400 font-bold">Disponível</span></td>
                            </tr>
                            <tr className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">833</td><td className="p-3 font-bold text-white underline">Betoneira 02</td><td className="p-3 text-slate-400">05/05/2026</td><td className="p-3 text-slate-500">-</td><td className="p-3 text-slate-300">Matriz</td><td className="p-3"><span className="text-emerald-400 font-bold">Disponível</span></td>
                            </tr>
                          </>
                        ) : (
                          equipamentosSup.map((eq: any) => (
                            <tr key={eq.id} onClick={() => setEquipDetalhe(eq)} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">{eq.codigo}</td>
                              <td className="p-3 font-bold text-white underline">{eq.nome}</td>
                              <td className="p-3 text-slate-400">{eq.data_aquisicao}</td>
                              <td className="p-3 text-slate-400">{eq.ultima_manutencao || '-'}</td>
                              <td className="p-3 text-slate-300">{eq.local_alocado}</td>
                              <td className="p-3"><span className="text-emerald-400 font-bold">{eq.status}</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.2.1 FICHA DETALHADA DO EQUIPAMENTO */}
                {supSubTab === 'equipamentos' && equipDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <button onClick={() => setEquipDetalhe(null)} className="text-xs text-amber-400 font-bold mb-1 block">← Voltar para Equipamentos</button>
                        <h3 className="font-bold text-lg text-white">{equipDetalhe.nome}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3.5 py-1.5 bg-slate-800 text-slate-200 font-bold rounded-xl text-xs">EDITAR</button>
                        <button className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl text-xs">DAR BAIXA</button>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-4 gap-4 text-xs">
                      <div><p className="text-slate-500">Código</p><p className="font-bold text-amber-400">{equipDetalhe.codigo || 832}</p></div>
                      <div><p className="text-slate-500">Produto Relacionado</p><p className="font-bold text-white">{equipDetalhe.produto || 'betoneira'}</p></div>
                      <div><p className="text-slate-500">Status</p><p className="font-bold text-emerald-400">{equipDetalhe.status || 'Disponível'}</p></div>
                      <div><p className="text-slate-500">Nota Manual</p><p className="font-bold text-slate-300">13926</p></div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center"><h4 className="font-bold text-xs uppercase text-amber-400">Histórico de Alocações</h4><button className="px-3 py-1.5 bg-slate-800 text-slate-200 font-bold rounded-lg text-xs">+ TRANSFERÊNCIA</button></div>
                      <table className="w-full text-left text-xs bg-slate-950 rounded-xl">
                        <thead className="text-slate-400 uppercase"><tr><th className="p-3">Local</th><th className="p-3">Data Entrada</th><th className="p-3">Data Saída</th></tr></thead>
                        <tbody><tr className="border-t border-slate-800"><td className="p-3 font-bold text-white">Casa da Andreia</td><td className="p-3 text-slate-400">05/05/2026</td><td className="p-3 text-slate-500">-</td></tr></tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 3.3 TELA DE CONSUMO (ESPELHO KOPER) */}
                {supSubTab === 'consumo' && !showNovoConsumoForm && !consumoDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><MinusCircle className="w-4 h-4 text-amber-500" /> Histórico de Consumo de Materiais</h3>
                      <button className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs">RELATÓRIOS</button>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Local Consumo</th><th className="p-3">Retirado Por</th><th className="p-3">Quant.</th><th className="p-3">Valor Total</th><th className="p-3">Data De Consumo</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {consumosSup.length === 0 ? (
                          <>
                            <tr onClick={() => setConsumoDetalhe({ codigo: 10765, local: 'Casa Diário', retirado: 'Maria Eduarda Pereira Martins', valor: 15.00 })} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">10765</td><td className="p-3 font-bold text-white">Casa Diário</td><td className="p-3 text-slate-300">Maria Eduarda Pereira Martins</td><td className="p-3 font-mono">1 item</td><td className="p-3 font-bold text-emerald-400">R$ 15,00</td><td className="p-3 text-slate-400">18/05/2026 - 11:25:58</td>
                            </tr>
                            <tr className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">10763</td><td className="p-3 font-bold text-white">Vila real</td><td className="p-3 text-slate-300">Maria Eduarda Pereira Martins</td><td className="p-3 font-mono">1 item</td><td className="p-3 font-bold text-emerald-400">R$ 20,00</td><td className="p-3 text-slate-400">18/05/2026 - 11:09:26</td>
                            </tr>
                          </>
                        ) : (
                          consumosSup.map((c: any) => (
                            <tr key={c.id} onClick={() => setConsumoDetalhe(c)} className="hover:bg-slate-950/50 cursor-pointer">
                              <td className="p-3 font-bold text-amber-400">{c.codigo}</td><td className="p-3 font-bold text-white">{c.local_consumo}</td><td className="p-3 text-slate-300">{c.retirado_por}</td><td className="p-3 font-mono">{c.quantidade_itens} item(s)</td><td className="p-3 font-bold text-emerald-400">R$ {Number(c.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td><td className="p-3 text-slate-400">{new Date(c.data_consumo).toLocaleString('pt-BR')}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3.3.1 FORMULÁRIO DE NOVO CONSUMO */}
                {supSubTab === 'consumo' && showNovoConsumoForm && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-6 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <button onClick={() => setShowNovoConsumoForm(false)} className="text-xs text-amber-400 font-bold">← Cancelar Consumo</button>
                      <h3 className="font-bold text-base text-white">+ Consumo de Insumo no Canteiro</h3>
                      <button onClick={handleSaveConsumo} className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Consumo</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <p className="font-bold text-xs uppercase text-amber-400">Disponíveis no Estoque do Local</p>
                        <select value={consLocal} onChange={(e) => setConsLocal(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white">
                          <option value="Casa Diário">1201 - Casa Diário</option>
                          <option value="Vila real">Vila real</option>
                        </select>
                        <table className="w-full text-left text-xs">
                          <thead className="text-slate-400 uppercase"><tr><th className="p-2">Produto</th><th className="p-2">Disponível</th><th className="p-2">Ação</th></tr></thead>
                          <tbody>
                            <tr className="border-t border-slate-800"><td className="p-2 font-bold text-white">Abraçadeira De pressão</td><td className="p-2 font-mono text-amber-400">10,00 un</td><td className="p-2"><button className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]">+</button></td></tr>
                            <tr className="border-t border-slate-800"><td className="p-2 font-bold text-white">Aço Ca-50 10Mm 1</td><td className="p-2 font-mono text-amber-400">8,00 kg</td><td className="p-2"><button className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded text-[10px]">+</button></td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                        <p className="font-bold text-xs uppercase text-emerald-400">Itens Selecionados para Uso / Baixa</p>
                        <textarea placeholder="Comentários / Observações de Saída..." value={consComentarios} onChange={(e) => setConsComentarios(e.target.value)} className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white" rows={2} />
                        <div className="p-4 border border-slate-800 rounded-xl space-y-2">
                          <div className="flex justify-between text-xs"><span className="font-bold text-white">Abraçadeira De pressão</span><input type="text" value="1,00" className="w-16 p-1 bg-slate-900 border border-slate-800 text-center font-mono rounded text-xs text-amber-400" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* DEMAIS ABAS SUPRIMENTOS (PRODUTOS, LOCAIS, EPIS, BALAÇOS) PERMANECEM NO CÓDIGO */}
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

            {/* ADMINISTRAÇÃO */}
            {activeModule === 'administracao' && (
              <div className="p-6 text-slate-300">Painel de Governança e Administração.</div>
            )}
          </main>
        </div>

        {/* MODAL NOVO EQUIPAMENTO (KOPER) */}
        {showNovoEquipamentoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-800 space-y-4 text-slate-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white">Adicionar novo equipamento</h3>
                <button onClick={() => setShowNovoEquipamentoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveEquipamento} className="space-y-3">
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Nome: *</label><input type="text" required placeholder="Insira um nome para o equipamento" value={equipNome} onChange={(e) => setEquipNome(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Ano fabricação:</label><input type="text" value={equipAnoFab} onChange={(e) => setEquipAnoFab(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Ano modelo:</label><input type="text" value={equipAnoMod} onChange={(e) => setEquipAnoMod(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Data de aquisição: *</label><input type="date" value={equipDataAquisicao} onChange={(e) => setEquipDataAquisicao(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Local alocado: *</label><select value={equipLocalAlocado} onChange={(e) => setEquipLocalAlocado(e.target.value)} className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"><option value="Casa da Andreia">Casa da Andreia</option><option value="Matriz">Matriz</option></select></div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowNovoEquipamentoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">CANCELAR</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">SALVAR</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
