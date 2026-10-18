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
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedCompany, setSelectedCompany] = useState('Torquato Engenharia Ltda');

  // Estados Globais
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [tributos, setTributos] = useState<any[]>([]);

  // Sub-abas Suprimentos
  const [supSubTab, setSupSubTab] = useState('produtos');
  const [produtosSup, setProdutosSup] = useState<any[]>([]);
  const [locaisSup, setLocaisSup] = useState<any[]>([]);
  const [episSup, setEpisSup] = useState<any[]>([]);
  const [balancosSup, setBalancosSup] = useState<any[]>([]);
  const [entradasSup, setEntradasSup] = useState<any[]>([]);
  const [equipamentosSup, setEquipamentosSup] = useState<any[]>([]);
  const [consumosSup, setConsumosSup] = useState<any[]>([]);
  const [solicitacoesSup, setSolicitacoesSup] = useState<any[]>([]);

  // Detalhes e Modais Suprimentos
  const [balancoDetalhe, setBalancoDetalhe] = useState<any>(null);
  const [balancoItens, setBalancoItens] = useState<any[]>([]);
  const [solicitacaoDetalhe, setSolicitacaoDetalhe] = useState<any>(null);
  const [equipDetalhe, setEquipDetalhe] = useState<any>(null);
  const [visaoLocais, setVisaoLocais] = useState<'lista' | 'controle'>('lista');
  const [showNovaEntradaForm, setShowNovaEntradaForm] = useState(false);
  const [showNovoConsumoForm, setShowNovoConsumoForm] = useState(false);

  // Filtros Dashboard & Financeiro
  const [finSubTab, setFinSubTab] = useState('pagar');
  const [dashFiltroStatus, setDashFiltroStatus] = useState('todos');
  const [dashFiltroCategoria, setDashFiltroCategoria] = useState('todas');
  const [dashFiltroCentroCusto, setDashFiltroCentroCusto] = useState('todos');
  const [dashFiltroPrazo, setDashFiltroPrazo] = useState('30');
  const [dashDataInicio, setDashDataInicio] = useState('');
  const [dashDataFim, setDashDataFim] = useState('');

  // Busca Suprimentos
  const [searchTerm, setSearchTerm] = useState('');

  // Modais Gerais
  const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
  const [showNovoLocalModal, setShowNovoLocalModal] = useState(false);
  const [showNovoEquipamentoModal, setShowNovoEquipamentoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [showTributoModal, setShowTributoModal] = useState(false);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);

  // Form Produto
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

  // Form Local & Equipamento
  const [localNome, setLocalNome] = useState('');
  const [localCidade, setLocalCidade] = useState('');
  const [equipNome, setEquipNome] = useState('');
  const [equipProdutoAssociado, setEquipProdutoAssociado] = useState('');
  const [equipEspec, setEquipEspec] = useState('');
  const [equipAnoFab, setEquipAnoFab] = useState('2024');
  const [equipAnoMod, setEquipAnoMod] = useState('2024');
  const [equipDataAquisicao, setEquipDataAquisicao] = useState('');
  const [equipLocalAlocado, setEquipLocalAlocado] = useState('Casa da Andreia');

  // Form Consumo & Financeiro
  const [consLocal, setConsLocal] = useState('1201');
  const [consRetiradoPor, setConsRetiradoPor] = useState('Maria Eduarda Pereira Martins');
  const [consComentarios, setConsComentarios] = useState('');

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

  const [bancoNome, setBancoNome] = useState('');
  const [bancoAgencia, setBancoAgencia] = useState('');
  const [bancoConta, setBancoConta] = useState('');
  const [bancoSaldo, setBancoSaldo] = useState('');

  const [tribImposto, setTribImposto] = useState('DAS (Simples Nacional)');
  const [tribCompetencia, setTribCompetencia] = useState('');
  const [tribValor, setTribValor] = useState('');
  const [tribVencimento, setTribVencimento] = useState('');

  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');

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

  // Anexo de Arquivos no Financeiro
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipoArquivo: 'nf' | 'comprovante') {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (tipoArquivo === 'nf') {
      setFinNfNome(file.name);
      setFinNfUrl(url);
    } else {
      setFinCompNome(file.name);
      setFinCompUrl(url);
    }
  }

  // Handlers de Salvamento
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

  async function handleSaveBanco(e: React.FormEvent) {
    e.preventDefault();
    if (!bancoNome) return;
    await supabase.from('contas_bancarias').insert([{ banco: bancoNome, agencia: bancoAgencia, conta: bancoConta, saldo: parseFloat(bancoSaldo || '0'), empresa: selectedCompany }]);
    setShowBancoModal(false); setBancoNome(''); setBancoAgencia(''); setBancoConta(''); setBancoSaldo(''); loadAllData();
  }

  async function handleSaveTributo(e: React.FormEvent) {
    e.preventDefault();
    if (!tribImposto || !tribValor) return;
    await supabase.from('tributos_erp').insert([{
      imposto: tribImposto, competencia: tribCompetencia || 'Atual', valor: parseFloat(tribValor || '0'),
      vencimento: tribVencimento || new Date().toISOString().split('T')[0], status: 'Previsto', empresa: selectedCompany
    }]);
    setShowTributoModal(false); setTribCompetencia(''); setTribValor(''); loadAllData();
  }

  async function handleSaveEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empNome) return;
    await supabase.from('empresas_erp').insert([{ nome: empNome, cnpj: empCnpj || '00.000.000/0001-00' }]);
    setShowEmpresaModal(false); setEmpNome(''); setEmpCnpj(''); loadAllData();
  }

  async function handleToggleQuitar(item: any, tipo: 'pagar' | 'receber') {
    const novoStatus = item.status === 'Pago' || item.status === 'Recebido' ? 'Pendente' : (tipo === 'pagar' ? 'Pago' : 'Recebido');
    const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).update({ status: novoStatus }).eq('id', item.id);
    loadAllData();
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

  // Filtros do Dashboard
  const listaCentrosCusto = Array.from(new Set(['Geral / Sede', 'Obra Res. Pôr do Sol', 'Pavimentação Buenópolis', ...filteredPagar.map(i => i.centro_custo).filter(Boolean)]));
  
  const dashboardPagarFiltrado = filteredPagar.filter(item => {
    if (dashFiltroStatus !== 'todos') {
      const match = dashFiltroStatus === 'pagos' ? item.status === 'Pago' : item.status !== 'Pago';
      if (!match) return false;
    }
    if (dashFiltroCategoria !== 'todas' && item.categoria !== dashFiltroCategoria) return false;
    if (dashFiltroCentroCusto !== 'todos' && (item.centro_custo || 'Geral / Sede') !== dashFiltroCentroCusto) return false;
    return true;
  });

  const gastosPorCentroCusto = dashboardPagarFiltrado.reduce((acc: any, item: any) => {
    const cc = item.centro_custo || 'Geral / Sede';
    acc[cc] = (acc[cc] || 0) + Number(item.valor || 0);
    return acc;
  }, {});
  const totalGastosFiltrados = Object.values(gastosPorCentroCusto).reduce((a: any, b: any) => a + b, 0) as number;

  const produtosFiltrados = produtosSup.filter(p => p.nome?.toLowerCase().includes(searchTerm.toLowerCase()));

  function resetDetalhes() {
    setBalancoDetalhe(null);
    setSolicitacaoDetalhe(null);
    setEquipDetalhe(null);
    setShowNovaEntradaForm(false);
    setShowNovoConsumoForm(false);
  }

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
            
            {/* 1. DASHBOARD EXECUTIVO COMPLETO */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><LayoutDashboard className="w-6 h-6 text-amber-500" /> Dashboard Executivo & Métricas (Koper ERP)</h1>
                    <p className="text-xs text-slate-400 mt-1">Visão estratégica e financeira da empresa: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                  <button onClick={() => setActiveModule('financeiro')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                    <DollarSign className="w-4 h-4" /> Ir para Financeiro
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Saldo Bancário Total</p>
                    <h3 className="text-xl font-black text-amber-400 mt-1">R$ {totalSaldosBancos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contas a Pagar</p>
                    <h3 className="text-xl font-black text-rose-400 mt-1">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Contas a Receber</p>
                    <h3 className="text-xl font-black text-emerald-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase">Resultado Projetado</p>
                    <h3 className={`text-xl font-black mt-1 ${saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                </div>

                {/* FILTROS E GRÁFICOS DO DASHBOARD */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-500" />
                      <h3 className="font-bold text-sm text-white uppercase">Filtros Combináveis & Centro de Custo</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <select value={dashFiltroStatus} onChange={(e) => setDashFiltroStatus(e.target.value)} className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer">
                        <option value="todos">Status: Todos</option>
                        <option value="pagos">Status: Pagos</option>
                        <option value="pendentes">Status: Pendentes</option>
                      </select>

                      <select value={dashFiltroCentroCusto} onChange={(e) => setDashFiltroCentroCusto(e.target.value)} className="bg-slate-950 text-amber-400 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer">
                        <option value="todos">Centro de Custo: Todos</option>
                        {listaCentrosCusto.map((cc, i) => <option key={i} value={cc}>{cc}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-500" /> Custos por Obra / Centro de Custo
                      </h4>
                      {Object.entries(gastosPorCentroCusto).map(([centro, valor]: [string, any], index) => {
                        const percentual = totalGastosFiltrados > 0 ? (valor / totalGastosFiltrados) * 100 : 0;
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-300">{centro}</span>
                              <span className="text-amber-400">R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentual.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${percentual}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-emerald-400" /> Fluxo Geral no Período
                      </h4>
                      <div className="space-y-3 pt-2">
                        <div className="flex justify-between text-xs"><span className="text-emerald-400">Recebimentos</span><span className="font-bold text-emerald-400">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-rose-400">Contas a Pagar</span><span className="font-bold text-rose-400">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MÓDULO FINANCEIRO COMPLETO */}
            {activeModule === 'financeiro' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><DollarSign className="w-6 h-6 text-emerald-500" /> Módulo Financeiro Corporativo (Koper ERP)</h1>
                    <p className="text-xs text-slate-400 mt-1">Empresa ativa: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowBancoModal(true)} className="px-3 py-2 bg-slate-800 text-amber-400 font-bold rounded-xl text-xs border border-slate-700 cursor-pointer">+ Conta Bancária</button>
                    <button onClick={() => setShowFinanceiroModal(true)} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer">+ Novo Lançamento</button>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-slate-800 pb-2">
                  <button onClick={() => setFinSubTab('pagar')} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${finSubTab === 'pagar' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Pagar ({filteredPagar.length})</button>
                  <button onClick={() => setFinSubTab('receber')} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${finSubTab === 'receber' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Receber ({filteredReceber.length})</button>
                  <button onClick={() => setFinSubTab('bancos')} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${finSubTab === 'bancos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas Bancárias ({filteredBancos.length})</button>
                  <button onClick={() => setFinSubTab('tributos')} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${finSubTab === 'tributos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Tributos & Impostos ({filteredTributos.length})</button>
                </div>

                {finSubTab === 'pagar' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-400" /> Contas a Pagar & Anexos Separados (NF / Comprovante)</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Descrição</th><th className="p-3">Categoria</th><th className="p-3">Centro de Custo</th><th className="p-3">Vencimento</th><th className="p-3">Valor</th><th className="p-3">Nota Fiscal</th><th className="p-3">Comprovante</th><th className="p-3">Status</th><th className="p-3 text-center">Ações</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPagar.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-white">{item.descricao}</td>
                            <td className="p-3 text-slate-400">{item.categoria}</td>
                            <td className="p-3 text-amber-400 font-bold">{item.centro_custo || 'Geral'}</td>
                            <td className="p-3 text-slate-300">{item.vencimento}</td>
                            <td className="p-3 font-bold text-rose-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3">{item.nf_url ? <a href={item.nf_url} target="_blank" rel="noreferrer" className="text-amber-400 font-bold underline flex items-center gap-1"><Paperclip className="w-3 h-3" /> Ver NF</a> : <span className="text-slate-500">Sem NF</span>}</td>
                            <td className="p-3">{item.comprovante_url ? <a href={item.comprovante_url} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold underline flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ver Comp.</a> : <span className="text-slate-500">Sem Comp.</span>}</td>
                            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{item.status || 'Pendente'}</span></td>
                            <td className="p-3 text-center"><button onClick={() => handleToggleQuitar(item, 'pagar')} className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${item.status === 'Pago' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'}`}>{item.status === 'Pago' ? 'Estornar' : 'Pagar'}</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {finSubTab === 'bancos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase flex items-center gap-2"><Wallet className="w-4 h-4 text-amber-500" /> Contas Bancárias</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBancos.map((b: any) => (
                        <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div><p className="font-bold text-white text-sm">{b.banco}</p><p className="text-xs text-slate-400">Ag: {b.agencia} • CC: {b.conta}</p></div>
                          <p className="font-black text-amber-400 text-sm">R$ {Number(b.saldo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. MÓDULO SUPRIMENTOS COMPLETO (8 SUB-ABAS) */}
            {activeModule === 'suprimentos' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <button onClick={() => { setSupSubTab('produtos'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'produtos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Produtos</button>
                    <button onClick={() => { setSupSubTab('locais'); setVisaoLocais('lista'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'locais' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Locais de estoque</button>
                    <button onClick={() => { setSupSubTab('entradas'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'entradas' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Entradas</button>
                    <button onClick={() => { setSupSubTab('equipamentos'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'equipamentos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Equipamentos</button>
                    <button onClick={() => { setSupSubTab('consumo'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'consumo' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Consumo</button>
                    <button onClick={() => { setSupSubTab('epis'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'epis' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>EPIs</button>
                    <button onClick={() => { setSupSubTab('balancos'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'balancos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Balanços</button>
                    <button onClick={() => { setSupSubTab('solicitacoes'); resetDetalhes(); }} className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'solicitacoes' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Solicitações / Compras</button>
                  </div>

                  <div className="flex items-center gap-2">
                    {supSubTab === 'produtos' && (
                      <button onClick={() => setShowNovoProdutoModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"><Plus className="w-4 h-4" /> + Produto</button>
                    )}
                  </div>
                </div>

                {supSubTab === 'produtos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase flex items-center gap-2"><Boxes className="w-4 h-4 text-amber-500" /> Produtos Cadastrados</h3>
                      <input type="text" placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white w-64" />
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">Produto</th><th className="p-3">Unidade</th><th className="p-3">Marca</th><th className="p-3">Tipo</th><th className="p-3">Categoria</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {produtosFiltrados.map((prod: any, idx: number) => (
                          <tr key={prod.id || idx} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-amber-400">{prod.codigo || (100 + idx)}</td>
                            <td className="p-3 font-bold text-white">{prod.nome}</td>
                            <td className="p-3 font-bold text-amber-400 uppercase">{prod.unidade || 'un'}</td>
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

        {/* MODAL NOVO PRODUTO */}
        {showNovoProdutoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-800 space-y-4 text-slate-200">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white">Cadastrar Novo Produto</h3>
                <button onClick={() => setShowNovoProdutoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveProduto} className="space-y-3">
                <input type="text" required placeholder="Nome do Produto *" value={prodNome} onChange={(e) => setProdNome(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">Salvar Produto</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOVO LANÇAMENTO FINANCEIRO */}
        {showFinanceiroModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Lançamento Financeiro</h3><button onClick={() => setShowFinanceiroModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveFinanceiro} className="space-y-3">
                <input type="text" required placeholder="Descrição" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValor} onChange={(e) => setFinValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={finVencimento} onChange={(e) => setFinVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-amber-400">Nota Fiscal (XML/PDF)</label>
                  <input type="file" accept=".xml,.pdf" onChange={(e) => handleFileChange(e, 'nf')} className="w-full text-xs text-slate-400" />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-emerald-400">Comprovante de Pagamento</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'comprovante')} className="w-full text-xs text-slate-400" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer">Salvar Lançamento</button></div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
