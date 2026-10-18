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
  Edit3
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('dashboard');
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

  // Estados Módulo Suprimentos
  const [supSubTab, setSupSubTab] = useState('produtos'); // 'produtos', 'locais', 'balancos', 'epis'
  const [produtosSup, setProdutosSup] = useState<any[]>([]);
  const [locaisSup, setLocaisSup] = useState<any[]>([]);
  const [episSup, setEpisSup] = useState<any[]>([]);
  const [entregasEpi, setEntregasEpi] = useState<any[]>([]);
  const [balancosSup, setBalancosSup] = useState<any[]>([]);
  const [balancoSelecionado, setBalancoSelecionado] = useState<any>(null);
  const [itensBalanco, setItensBalanco] = useState<any[]>([]);
  
  const [visaoLocais, setVisaoLocais] = useState<'lista' | 'controle'>('lista');
  const [epiDetalhe, setEpiDetalhe] = useState<any>(null);

  // Busca e Filtros de Suprimentos
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatusProduto, setFiltroStatusProduto] = useState('Ativo');
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const [periodicidadeBalanço, setPeriodicidadeBalanço] = useState('Mensal');

  // Modais do Módulo Suprimentos
  const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
  const [showNovoLocalModal, setShowNovoLocalModal] = useState(false);
  const [showNovoEpiModal, setShowNovoEpiModal] = useState(false);
  const [showGerarContratoEpiModal, setShowGerarContratoEpiModal] = useState(false);
  const [showNovoBalancoModal, setShowNovoBalancoModal] = useState(false);

  // Sub-abas Financeiro e Filtros do Dashboard
  const [finSubTab, setFinSubTab] = useState('pagar');
  const [dashFiltroStatus, setDashFiltroStatus] = useState('todos');
  const [dashFiltroCategoria, setDashFiltroCategoria] = useState('todas');
  const [dashFiltroCentroCusto, setDashFiltroCentroCusto] = useState('todos');
  const [dashFiltroPrazo, setDashFiltroPrazo] = useState('30');
  const [dashDataInicio, setDashDataInicio] = useState('');
  const [dashDataFim, setDashDataFim] = useState('');

  // Modais Financeiro e Admin
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [showTributoModal, setShowTributoModal] = useState(false);

  // Formulário Completo de Produto (Koper)
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

  // Forms Outros
  const [localNome, setLocalNome] = useState('');
  const [localCidade, setLocalCidade] = useState('');
  const [epiNome, setEpiNome] = useState('');
  const [epiCa, setEpiCa] = useState('');
  const [epiQtd, setEpiQtd] = useState('10');
  const [epiColaborador, setEpiColaborador] = useState('');
  const [epiObra, setEpiObra] = useState('Obra Res. Pôr do Sol');
  const [epiItemSelecionado, setEpiItemSelecionado] = useState('');
  const [epiQtdEntrega, setEpiQtdEntrega] = useState('1');
  const [balCentroCusto, setBalCentroCusto] = useState('Obra Res. Pôr do Sol');

  // Forms Financeiro
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

  // Forms Admin
  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCargo, setUserCargo] = useState('Engenheiro');
  const [userLimite, setUserLimite] = useState('5000');
  const [contTitulo, setContTitulo] = useState('');
  const [contFornecedor, setContFornecedor] = useState('');
  const [contValor, setContValor] = useState('');
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

      const { data: userData } = await supabase.from('usuarios_erp').select('*').order('created_at', { ascending: false });
      if (userData) setUsuarios(userData);

      const { data: contData } = await supabase.from('contratos_empresa').select('*').order('created_at', { ascending: false });
      if (contData) setContratos(contData);

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
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  }

  // Anexo de Arquivos
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipoArquivo: 'nf' | 'comprovante') {
    const file = e.target.files?.[0];
    if (!file) return;
    const nomeFicheiro = file.name;
    const urlFicheiro = URL.createObjectURL(file);

    if (tipoArquivo === 'nf') { 
      setFinNfNome(nomeFicheiro); 
      setFinNfUrl(urlFicheiro); 
    } else { 
      setFinCompNome(nomeFicheiro); 
      setFinCompUrl(urlFicheiro); 
    }
  }

  // Actions Suprimentos
  async function handleSaveProduto(e: React.FormEvent) {
    e.preventDefault();
    if (!prodNome) return;
    try {
      await supabase.from('suprimentos_produtos').insert([{
        nome: prodNome,
        especificacao: prodEspecificacao,
        apelido: prodApelido || '-',
        tipo: prodTipo,
        unidade: prodUnidade,
        marca: prodMarca,
        categoria: prodCategoria,
        subcategoria: prodSubcategoria,
        valor_estimado: parseFloat(prodValorEstimado || '0'),
        observacoes: prodObservacoes,
        status: 'Ativo',
        empresa: selectedCompany
      }]);

      setShowNovoProdutoModal(false);
      setProdNome(''); setProdEspecificacao(''); setProdApelido(''); setProdMarca(''); setProdValorEstimado(''); setProdObservacoes('');
      loadAllData();
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
    }
  }

  async function handleSaveLocal(e: React.FormEvent) {
    e.preventDefault();
    if (!localNome) return;
    await supabase.from('suprimentos_locais').insert([{
      nome: localNome,
      cidade: localCidade || 'Belo Horizonte',
      status: 'Ativo',
      status_balanco: 'Sem balanço',
      empresa: selectedCompany
    }]);
    setShowNovoLocalModal(false);
    setLocalNome(''); setLocalCidade('');
    loadAllData();
  }

  async function handleSaveEpi(e: React.FormEvent) {
    e.preventDefault();
    if (!epiNome) return;
    await supabase.from('suprimentos_epis').insert([{
      nome: epiNome,
      ca: epiCa || 'N/A',
      quantidade: parseInt(epiQtd || '0'),
      empresa: selectedCompany
    }]);
    setShowNovoEpiModal(false);
    setEpiNome(''); setEpiCa('');
    loadAllData();
  }

  async function handleGerarContratoEpi(e: React.FormEvent) {
    e.preventDefault();
    if (!epiColaborador || !epiItemSelecionado) return;
    const cod = `CTR-EPI-${Math.floor(1000 + Math.random() * 9000)}`;
    await supabase.from('suprimentos_epi_entregas').insert([{
      codigo_contrato: cod,
      colaborador: epiColaborador,
      obra: epiObra,
      epi_nome: epiItemSelecionado,
      quantidade: parseInt(epiQtdEntrega || '1'),
      status: 'Entregue',
      empresa: selectedCompany
    }]);
    setShowGerarContratoEpiModal(false);
    setEpiColaborador('');
    loadAllData();
  }

  async function handleGerarNovoBalanco(e: React.FormEvent) {
    e.preventDefault();
    const codigo = `BAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const { data: novoBal } = await supabase.from('suprimentos_balancos').insert([{
      codigo_balanco: codigo,
      centro_custo: balCentroCusto,
      periodicidade: periodicidadeBalanço,
      status: 'Pendente',
      empresa: selectedCompany
    }]).select().single();

    if (novoBal) {
      const itensIniciais = [
        { balanco_id: novoBal.id, produto_nome: 'Cimento CP-II 50kg', qtd_sistema: 250, qtd_fisica: 250, diferenca: 0, tipo_ajuste: 'Nenhum', empresa: selectedCompany },
        { balanco_id: novoBal.id, produto_nome: 'Aço CA-50 10mm (Barra)', qtd_sistema: 120, qtd_fisica: 115, diferenca: -5, tipo_ajuste: 'Consumo (Ajuste -)', empresa: selectedCompany }
      ];
      await supabase.from('suprimentos_balanco_itens').insert(itensIniciais);
    }
    setShowNovoBalancoModal(false);
    loadAllData();
  }

  // Handlers Financeiro & Admin
  async function handleSaveEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empNome) return;
    await supabase.from('empresas_erp').insert([{ nome: empNome, cnpj: empCnpj || '00.000.000/0001-00' }]);
    setShowEmpresaModal(false); setEmpNome(''); setEmpCnpj(''); loadAllData();
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    await supabase.from('usuarios_erp').insert([{ nome: userName, email: userEmail, cargo: userCargo, limite_aprovacao: parseFloat(userLimite || '0'), status: 'ativo' }]);
    setShowUserModal(false); setUserName(''); setUserEmail(''); loadAllData();
  }

  async function handleSaveContrato(e: React.FormEvent) {
    e.preventDefault();
    if (!contTitulo || !contValor) return;
    await supabase.from('contratos_empresa').insert([{ titulo: contTitulo, fornecedor: contFornecedor, valor: parseFloat(contValor || '0'), status: 'Ativo' }]);
    setShowContratoModal(false); setContTitulo(''); setContFornecedor(''); setContValor(''); loadAllData();
  }

  async function handleSaveFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!finDescricao || !finValor) return;
    const tableTarget = finTipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).insert([{
      descricao: finDescricao,
      valor: parseFloat(finValor || '0'),
      vencimento: finVencimento || new Date().toISOString().split('T')[0],
      categoria: finCategoria,
      centro_custo: finCentroCusto,
      status: finStatus,
      empresa: selectedCompany,
      nf_nome: finNfNome || null,
      nf_url: finNfUrl || null,
      comprovante_nome: finCompNome || null,
      comprovante_url: finCompUrl || null
    }]);
    setShowFinanceiroModal(false);
    setFinDescricao(''); setFinValor(''); setFinNfNome(''); setFinNfUrl(''); setFinCompNome(''); setFinCompUrl('');
    loadAllData();
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
      imposto: tribImposto,
      competencia: tribCompetencia || 'Atual',
      valor: parseFloat(tribValor || '0'),
      vencimento: tribVencimento || new Date().toISOString().split('T')[0],
      status: 'Previsto',
      empresa: selectedCompany
    }]);
    setShowTributoModal(false);
    setTribImposto('DAS (Simples Nacional)'); setTribCompetencia(''); setTribValor(''); setTribVencimento('');
    loadAllData();
  }

  async function handleToggleQuitar(item: any, tipo: 'pagar' | 'receber') {
    const novoStatus = item.status === 'Pago' || item.status === 'Recebido' ? 'Pendente' : (tipo === 'pagar' ? 'Pago' : 'Recebido');
    const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).update({ status: novoStatus }).eq('id', item.id);
    loadAllData();
  }

  async function handleToggleQuitarTributo(item: any) {
    const novoStatus = item.status === 'Pago' ? 'Previsto' : 'Pago';
    await supabase.from('tributos_erp').update({ status: novoStatus }).eq('id', item.id);
    loadAllData();
  }

  async function handleDeleteFinanceiro(id: string, tipo: 'pagar' | 'receber') {
    if (confirm('Excluir lançamento?')) {
      const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
      await supabase.from(tableTarget).delete().eq('id', id);
      loadAllData();
    }
  }

  // Filtros Globais por Empresa
  const filteredPagar = financialsPagar.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredReceber = financialsReceber.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredBancos = contasBancarias.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredTributos = tributos.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);

  // Filtro de Busca de Produtos
  const produtosFiltrados = produtosSup.filter(p => {
    const matchesSearch = p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.apelido?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroStatusProduto === 'Todos' || p.status === filtroStatusProduto;
    return matchesSearch && matchesStatus;
  });

  // Lista de Centros de Custo
  const listaCentrosCusto = Array.from(
    new Set([
      'Geral / Sede',
      'Obra Res. Pôr do Sol',
      'Pavimentação Buenópolis',
      'Loteamento Alto da Serra',
      ...filteredPagar.map(i => i.centro_custo).filter(Boolean)
    ])
  );

  // Lógica do Filtro de Prazo/Data do Dashboard Executivo
  const dashboardPagarFiltrado = filteredPagar.filter(item => {
    if (dashFiltroStatus !== 'todos') {
      const statusMatch = dashFiltroStatus === 'pagos' ? item.status === 'Pago' : item.status !== 'Pago';
      if (!statusMatch) return false;
    }
    if (dashFiltroCategoria !== 'todas' && item.categoria !== dashFiltroCategoria) return false;
    if (dashFiltroCentroCusto !== 'todos') {
      const ccItem = item.centro_custo || 'Geral / Sede';
      if (ccItem !== dashFiltroCentroCusto) return false;
    }
    if (item.vencimento) {
      const dataVenc = new Date(item.vencimento);
      const hoje = new Date();
      if (dashFiltroPrazo === '7') {
        const limite = new Date(); limite.setDate(hoje.getDate() + 7);
        if (dataVenc < hoje || dataVenc > limite) return false;
      } else if (dashFiltroPrazo === '30') {
        const limite = new Date(); limite.setDate(hoje.getDate() + 30);
        if (dataVenc < hoje || dataVenc > limite) return false;
      } else if (dashFiltroPrazo === '60') {
        const limite = new Date(); limite.setDate(hoje.getDate() + 60);
        if (dataVenc < hoje || dataVenc > limite) return false;
      } else if (dashFiltroPrazo === 'ano') {
        if (dataVenc.getFullYear() !== hoje.getFullYear()) return false;
      } else if (dashFiltroPrazo === 'personalizado') {
        if (dashDataInicio && new Date(dashDataInicio) > dataVenc) return false;
        if (dashDataFim && new Date(dashDataFim) < dataVenc) return false;
      }
    }
    return true;
  });

  const totalPagar = filteredPagar.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalReceber = filteredReceber.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalSaldosBancos = filteredBancos.reduce((acc, item) => acc + Number(item.saldo || 0), 0);
  const saldoLiquido = totalReceber - totalPagar;

  const gastosPorCentroCusto = dashboardPagarFiltrado.reduce((acc: any, item: any) => {
    const cc = item.centro_custo || 'Geral / Sede';
    acc[cc] = (acc[cc] || 0) + Number(item.valor || 0);
    return acc;
  }, {});

  const totalGastosFiltrados = Object.values(gastosPorCentroCusto).reduce((a: any, b: any) => a + b, 0) as number;

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
              <select 
                value={selectedCompany} 
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                {empresas.length === 0 ? (
                  <option value="Torquato Engenharia Ltda" className="bg-slate-900">Torquato Engenharia Ltda</option>
                ) : (
                  empresas.map(emp => (
                    <option key={emp.id} value={emp.nome} className="bg-slate-900">{emp.nome}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Online (Multiempresa Sincronizada)</span>
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* SIDEBAR */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
            <nav className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Módulos do Sistema</div>

              <button
                onClick={() => setActiveModule('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Dashboard Executivo</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('financeiro')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'financeiro' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> Módulo Financeiro Koper</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('suprimentos')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'suprimentos' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><Boxes className="w-4 h-4" /> Suprimentos</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('administracao')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'administracao' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Administração & Governança</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveModule('engenharia')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'engenharia' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><HardHat className="w-4 h-4" /> Engenharia & RDO</div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Torquato ERP</p>
                <p className="text-[10px] text-slate-500">Módulo Ativo</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {/* 1. DASHBOARD EXECUTIVO */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <LayoutDashboard className="w-6 h-6 text-amber-500" /> Dashboard Executivo & Métricas (Koper ERP)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Acompanhe os principais indicadores das suas obras e visão estratégica: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                  <button onClick={() => setActiveModule('financeiro')} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2 cursor-pointer">
                    <DollarSign className="w-4 h-4" /> Gerenciar Financeiro
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Bancário Total</p>
                    <h3 className="text-xl font-black text-amber-400 mt-1">R$ {totalSaldosBancos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1"><Activity className="w-3 h-3" /> Conciliado</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Pagar</p>
                    <h3 className="text-xl font-black text-rose-400 mt-1">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-slate-400 mt-2">{filteredPagar.length} lançamentos</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Receber</p>
                    <h3 className="text-xl font-black text-emerald-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-slate-400 mt-2">{filteredReceber.length} recebimentos</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultado Projetado</p>
                    <h3 className={`text-xl font-black mt-1 ${saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    <p className="text-[10px] text-slate-400 mt-2">Balanço do período</p>
                  </div>
                </div>

                {/* FILTROS E GRÁFICOS DO DASHBOARD */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-amber-500" />
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider">Filtros Combináveis, Prazo & Centro de Custo</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <select value={dashFiltroStatus} onChange={(e) => setDashFiltroStatus(e.target.value)} className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer focus:outline-none">
                        <option value="todos">Status: Todos</option>
                        <option value="pagos">Status: Pagos / Recebidos</option>
                        <option value="pendentes">Status: Pendentes / Em Aberto</option>
                      </select>

                      <select value={dashFiltroCategoria} onChange={(e) => setDashFiltroCategoria(e.target.value)} className="bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer focus:outline-none">
                        <option value="todas">Categoria: Todas</option>
                        <option value="Material de Obra">Material de Obra</option>
                        <option value="Mão de Obra">Mão de Obra</option>
                        <option value="Equipamentos">Equipamentos</option>
                        <option value="Despesas Administrativas">Despesas Administrativas</option>
                      </select>

                      <select value={dashFiltroCentroCusto} onChange={(e) => setDashFiltroCentroCusto(e.target.value)} className="bg-slate-950 text-amber-400 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer focus:outline-none">
                        <option value="todos">Centro de Custo: Todos</option>
                        {listaCentrosCusto.map((cc, idx) => (
                          <option key={idx} value={cc}>{cc}</option>
                        ))}
                      </select>

                      <select value={dashFiltroPrazo} onChange={(e) => setDashFiltroPrazo(e.target.value)} className="bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl px-3 py-2 font-bold cursor-pointer focus:outline-none">
                        <option value="todos">Prazo: Todo o Histórico</option>
                        <option value="7">Prazo: Próximos 7 dias</option>
                        <option value="30">Prazo: Próximos 30 dias</option>
                        <option value="60">Prazo: Próximos 60 dias</option>
                        <option value="ano">Prazo: Este Ano</option>
                        <option value="personalizado">Prazo: Personalizado</option>
                      </select>
                    </div>
                  </div>

                  {dashFiltroPrazo === 'personalizado' && (
                    <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span>Início:</span>
                      <input type="date" value={dashDataInicio} onChange={(e) => setDashDataInicio(e.target.value)} className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1" />
                      <span>Fim:</span>
                      <input type="date" value={dashDataFim} onChange={(e) => setDashDataFim(e.target.value)} className="bg-slate-900 border border-slate-800 text-white rounded-lg px-2 py-1" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-amber-500" /> Custos por Obra / Centro de Custo
                      </h4>
                      {Object.keys(gastosPorCentroCusto).length === 0 ? (
                        <p className="text-slate-500 text-xs py-4 text-center">Nenhum valor para os filtros selecionados.</p>
                      ) : (
                        Object.entries(gastosPorCentroCusto).map(([centro, valor]: [string, any], index) => {
                          const percentual = totalGastosFiltrados > 0 ? (valor / totalGastosFiltrados) * 100 : 0;
                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-slate-300">{centro}</span>
                                <span className="text-amber-400">R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({percentual.toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentual}%` }}></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="font-bold text-xs uppercase text-slate-300 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-emerald-400" /> Visão Geral de Fluxo no Período
                      </h4>
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-400" /> Recebimentos Previstos</span>
                            <span className="text-emerald-400">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${totalReceber + totalPagar > 0 ? (totalReceber / (totalReceber + totalPagar)) * 100 : 0}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300 flex items-center gap-1"><TrendingDown className="w-3 h-3 text-rose-400" /> Lançamentos Filtrados</span>
                            <span className="text-rose-400">R$ {totalGastosFiltrados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${totalReceber + totalPagar > 0 ? (totalGastosFiltrados / (totalReceber + totalPagar)) * 100 : 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MÓDULO FINANCEIRO */}
            {activeModule === 'financeiro' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-emerald-500" /> Módulo Financeiro Corporativo (Koper ERP)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Empresa ativa: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowBancoModal(true)} className="px-3 py-2 bg-slate-800 text-amber-400 font-bold rounded-xl text-xs border border-slate-700 cursor-pointer">+ Conta Bancária</button>
                    <button onClick={() => setShowFinanceiroModal(true)} className="px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-2 cursor-pointer">
                      <Plus className="w-4 h-4" /> Novo Lançamento
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 border-b border-slate-800 pb-2">
                  <button onClick={() => setFinSubTab('pagar')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${finSubTab === 'pagar' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Pagar ({filteredPagar.length})</button>
                  <button onClick={() => setFinSubTab('receber')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${finSubTab === 'receber' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Receber ({filteredReceber.length})</button>
                  <button onClick={() => setFinSubTab('bancos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${finSubTab === 'bancos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas Bancárias ({filteredBancos.length})</button>
                  <button onClick={() => setFinSubTab('boletos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${finSubTab === 'boletos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Boletos ({boletos.length})</button>
                  <button onClick={() => setFinSubTab('tributos')} className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${finSubTab === 'tributos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Tributos & Impostos ({filteredTributos.length})</button>
                </div>

                {finSubTab === 'pagar' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-400" /> Contas a Pagar & Anexos Separados</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Descrição</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Centro de Custo</th>
                          <th className="p-3">Vencimento</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Nota Fiscal (XML/PDF)</th>
                          <th className="p-3">Comprovante</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPagar.map((item: any) => (
                          <tr key={item.id} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-white">{item.descricao}</td>
                            <td className="p-3 text-slate-400">{item.categoria}</td>
                            <td className="p-3 text-amber-400 font-bold">{item.centro_custo || 'Geral / Sede'}</td>
                            <td className="p-3 text-slate-300">{item.vencimento}</td>
                            <td className="p-3 font-bold text-rose-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3">
                              {item.nf_url ? (
                                <a href={item.nf_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-400 font-bold underline"><Paperclip className="w-3 h-3" /> {item.nf_nome || 'Ver NF'}</a>
                              ) : <span className="text-slate-500">Sem NF</span>}
                            </td>
                            <td className="p-3">
                              {item.comprovante_url ? (
                                <a href={item.comprovante_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-400 font-bold underline"><CheckCircle2 className="w-3 h-3" /> {item.comprovante_nome || 'Ver Comp.'}</a>
                              ) : <span className="text-slate-500">Sem Comprovante</span>}
                            </td>
                            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{item.status || 'Pendente'}</span></td>
                            <td className="p-3 text-center flex items-center justify-center gap-1.5">
                              <button onClick={() => handleToggleQuitar(item, 'pagar')} className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${item.status === 'Pago' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'}`}><Check className="w-3 h-3" /> {item.status === 'Pago' ? 'Estornar' : 'Pagar'}</button>
                              <button onClick={() => handleDeleteFinanceiro(item.id, 'pagar')} className="p-1 bg-slate-800 text-rose-400 rounded cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {finSubTab === 'bancos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Wallet className="w-4 h-4 text-amber-500" /> Contas Bancárias Cadastradas</h3>
                      <button onClick={() => setShowBancoModal(true)} className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ Nova Conta</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBancos.map((b: any) => (
                        <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div><p className="font-bold text-white text-sm">{b.banco}</p><p className="text-xs text-slate-400">Ag: {b.agencia} • CC: {b.conta}</p></div>
                          <div className="text-right"><p className="font-black text-amber-400 text-sm">R$ {Number(b.saldo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {finSubTab === 'tributos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><FileText className="w-4 h-4 text-rose-400" /> Guia de Tributos & Impostos</h3>
                      <button onClick={() => setShowTributoModal(true)} className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer">+ Gerar Guia de Tributo</button>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {filteredTributos.map((trib: any) => (
                        <div key={trib.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div><p className="font-bold text-white text-sm">{trib.imposto}</p><p className="text-slate-400">Competência: <span className="text-amber-400 font-bold">{trib.competencia}</span> • Vencimento: {trib.vencimento}</p></div>
                          <div className="text-right flex items-center gap-3">
                            <p className="font-black text-rose-400 text-sm">R$ {Number(trib.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <button onClick={() => handleToggleQuitarTributo(trib)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${trib.status === 'Pago' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'}`}><Check className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. MÓDULO SUPRIMENTOS */}
            {activeModule === 'suprimentos' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setSupSubTab('produtos'); setEpiDetalhe(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'produtos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Produtos</button>
                    <button onClick={() => { setSupSubTab('locais'); setVisaoLocais('lista'); setEpiDetalhe(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'locais' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Locais de Estoque</button>
                    <button onClick={() => { setSupSubTab('balancos'); setEpiDetalhe(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'balancos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>Balanços</button>
                    <button onClick={() => { setSupSubTab('epis'); setEpiDetalhe(null); }} className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${supSubTab === 'epis' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}>EPIs</button>
                  </div>

                  <div className="flex items-center gap-2">
                    {supSubTab === 'produtos' && (
                      <button onClick={() => setShowNovoProdutoModal(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"><Plus className="w-4 h-4" /> + Produto</button>
                    )}
                    {supSubTab === 'locais' && visaoLocais === 'lista' && (
                      <>
                        <button onClick={() => setVisaoLocais('controle')} className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/10 cursor-pointer">Controle de estoque</button>
                        <button onClick={() => setShowNovoLocalModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ Local</button>
                      </>
                    )}
                    {supSubTab === 'epis' && !epiDetalhe && (
                      <>
                        <button onClick={() => setShowGerarContratoEpiModal(true)} className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/10 cursor-pointer">Gerar contrato</button>
                        <button onClick={() => setShowNovoEpiModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">+ Novo EPI</button>
                      </>
                    )}
                  </div>
                </div>

                {/* VISÃO PRODUTOS SUPRIMENTOS */}
                {supSubTab === 'produtos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <button onClick={() => setShowFiltroModal(!showFiltroModal)} className="px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                        <Filter className="w-4 h-4 text-amber-500" /> Adicionar filtro
                      </button>
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 w-64">
                        <Search className="w-4 h-4 text-slate-500" />
                        <input type="text" placeholder="Buscar produto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent text-xs text-white focus:outline-none w-full" />
                      </div>
                    </div>

                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Código</th>
                          <th className="p-3">Produto</th>
                          <th className="p-3">Unidade</th>
                          <th className="p-3">Marca</th>
                          <th className="p-3">Tipo</th>
                          <th className="p-3">Categoria / Subcategoria</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {produtosFiltrados.map((prod: any, idx: number) => (
                          <tr key={prod.id || idx} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-amber-400">{prod.codigo || (100 + idx)}</td>
                            <td className="p-3 font-bold text-white">{prod.nome}</td>
                            <td className="p-3 font-bold text-amber-400 font-mono uppercase">{prod.unidade || 'un'}</td>
                            <td className="p-3 text-slate-300">{prod.marca || '-'}</td>
                            <td className="p-3"><span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{prod.tipo || 'Material'}</span></td>
                            <td className="p-3 text-slate-300">{prod.categoria || 'Geral'} <span className="text-slate-500">• {prod.subcategoria || 'Geral'}</span></td>
                            <td className="p-3"><span className="text-emerald-400 font-bold">Ativo</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. MÓDULO ADMINISTRAÇÃO */}
            {activeModule === 'administracao' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-amber-500" /> Administração Corporativa</h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center"><h3 className="font-bold text-sm text-white uppercase"><Building2 className="w-4 h-4 text-amber-500 inline mr-2" /> Empresas Cadastradas</h3><button onClick={() => setShowEmpresaModal(true)} className="px-3.5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">+ Cadastrar Empresa</button></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {empresas.map(emp => (
                      <div key={emp.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div><p className="font-bold text-white text-sm">{emp.nome}</p><p className="text-xs text-slate-400">CNPJ: {emp.cnpj}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL NOVO PRODUTO COMPLETO KOPER */}
        {showNovoProdutoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-800 space-y-4 text-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2"><Boxes className="w-5 h-5 text-amber-500" /> Cadastrar Novo Produto / Insumo</h3>
                <button onClick={() => setShowNovoProdutoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSaveProduto} className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Nome / Descrição do Produto *</label><input type="text" required placeholder="Ex: Abraçadeira tipo D 3/4" value={prodNome} onChange={(e) => setProdNome(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Especificação Técnica</label><input type="text" placeholder="Ex: 512 - Abraçadeira tipo D 3/4 com rosca zincada" value={prodEspecificacao} onChange={(e) => setProdEspecificacao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Apelido</label><input type="text" placeholder="Ex: Abraçadeira 3/4" value={prodApelido} onChange={(e) => setProdApelido(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Tipo *</label><select value={prodTipo} onChange={(e) => setProdTipo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"><option value="Material">Material</option><option value="Equipamento">Equipamento</option></select></div>
                  <div><label className="block text-xs font-bold text-amber-400 mb-1">Unidade *</label><select value={prodUnidade} onChange={(e) => setProdUnidade(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold"><option value="un">un (Unidade)</option><option value="kg">kg (Quilograma)</option><option value="m³">m³ (Metro Cúbico)</option><option value="m">m (Metro)</option><option value="m²">m² (Metro²)</option><option value="l">l (Litro)</option><option value="par">par (Par)</option><option value="sc">sc (Saco)</option><option value="cx">cx (Caixa)</option></select></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Categoria *</label><select value={prodCategoria} onChange={(e) => setProdCategoria(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"><option value="Instalações hidráulicas">Instalações hidráulicas</option><option value="Estrutura">Estrutura</option><option value="Geral">Geral</option></select></div>
                  <div><label className="block text-xs font-bold text-slate-400 mb-1">Marca</label><input type="text" placeholder="Ex: Amanco, Tigre" value={prodMarca} onChange={(e) => setProdMarca(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" /></div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowNovoProdutoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg">Salvar Produto Completo</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL FINANCEIRO */}
        {showFinanceiroModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Lançamento Financeiro</h3><button onClick={() => setShowFinanceiroModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveFinanceiro} className="space-y-3">
                <input type="text" required placeholder="Descrição" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValor} onChange={(e) => setFinValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={finVencimento} onChange={(e) => setFinVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-amber-400 uppercase">Nota Fiscal (XML/PDF)</label>
                  <input type="file" accept=".xml,.pdf" onChange={(e) => handleFileChange(e, 'nf')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 cursor-pointer" />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-emerald-400 uppercase">Comprovante de Pagamento</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'comprovante')} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white cursor-pointer" />
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
