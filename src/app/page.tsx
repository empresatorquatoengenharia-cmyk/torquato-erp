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
  const [activeModule, setActiveModule] = useState('suprimentos');
  const [selectedCompany, setSelectedCompany] = useState('Torquato Engenharia Ltda');

  // Estados Globais
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);

  // Módulo Suprimentos
  const [supSubTab, setSupSubTab] = useState('produtos'); 
  const [produtosSup, setProdutosSup] = useState<any[]>([]);
  const [locaisSup, setLocaisSup] = useState<any[]>([]);
  const [episSup, setEpisSup] = useState<any[]>([]);
  const [entregasEpi, setEntregasEpi] = useState<any[]>([]);
  const [balancosSup, setBalancosSup] = useState<any[]>([]);
  
  const [visaoLocais, setVisaoLocais] = useState<'lista' | 'controle'>('lista');
  const [epiDetalhe, setEpiDetalhe] = useState<any>(null);

  // Busca e Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatusProduto, setFiltroStatusProduto] = useState('Ativo');
  const [showFiltroModal, setShowFiltroModal] = useState(false);

  // Modais de Suprimentos
  const [showNovoProdutoModal, setShowNovoProdutoModal] = useState(false);
  const [showNovoLocalModal, setShowNovoLocalModal] = useState(false);
  const [showNovoEpiModal, setShowNovoEpiModal] = useState(false);
  const [showGerarContratoEpiModal, setShowGerarContratoEpiModal] = useState(false);

  // Form States para Cadastro COMPLETO de Produto (Koper Pattern)
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

  // Outros Forms
  const [localNome, setLocalNome] = useState('');
  const [localCidade, setLocalCidade] = useState('');
  const [epiNome, setEpiNome] = useState('');
  const [epiCa, setEpiCa] = useState('');
  const [epiQtd, setEpiQtd] = useState('10');

  const [epiColaborador, setEpiColaborador] = useState('');
  const [epiObra, setEpiObra] = useState('Obra Res. Pôr do Sol');
  const [epiItemSelecionado, setEpiItemSelecionado] = useState('');
  const [epiQtdEntrega, setEpiQtdEntrega] = useState('1');

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

  // Handler de Cadastro Completo de Produto
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

  // Filtro de Busca de Produtos
  const produtosFiltrados = produtosSup.filter(p => {
    const matchesSearch = p.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.categoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.apelido?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filtroStatusProduto === 'Todos' || p.status === filtroStatusProduto;
    return matchesSearch && matchesStatus;
  });

  const totalPagar = financialsPagar.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalReceber = financialsReceber.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalSaldosBancos = contasBancarias.reduce((acc, item) => acc + Number(item.saldo || 0), 0);
  const saldoLiquido = totalReceber - totalPagar;

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
            
            {/* DASHBOARD */}
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <LayoutDashboard className="w-6 h-6 text-amber-500" /> Dashboard Executivo & Métricas (Koper ERP)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Visão geral do ERP: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Bancário Total</p>
                    <h3 className="text-xl font-black text-amber-400 mt-1">R$ {totalSaldosBancos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Pagar</p>
                    <h3 className="text-xl font-black text-rose-400 mt-1">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Receber</p>
                    <h3 className="text-xl font-black text-emerald-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultado Projetado</p>
                    <h3 className={`text-xl font-black mt-1 ${saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO SUPRIMENTOS */}
            {activeModule === 'suprimentos' && (
              <div className="space-y-6">
                
                {/* SUB-NAVEGAÇÃO */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setSupSubTab('produtos'); setEpiDetalhe(null); }} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${supSubTab === 'produtos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Produtos
                    </button>
                    <button 
                      onClick={() => { setSupSubTab('locais'); setVisaoLocais('lista'); setEpiDetalhe(null); }} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${supSubTab === 'locais' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Locais de Estoque
                    </button>
                    <button 
                      onClick={() => { setSupSubTab('balancos'); setEpiDetalhe(null); }} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${supSubTab === 'balancos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                    >
                      Balanços
                    </button>
                    <button 
                      onClick={() => { setSupSubTab('epis'); setEpiDetalhe(null); }} 
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${supSubTab === 'epis' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'}`}
                    >
                      EPIs
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {supSubTab === 'produtos' && (
                      <button onClick={() => setShowNovoProdutoModal(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg cursor-pointer flex items-center gap-1.5">
                        <Plus className="w-4 h-4" /> + Produto
                      </button>
                    )}

                    {supSubTab === 'locais' && visaoLocais === 'lista' && (
                      <>
                        <button onClick={() => setVisaoLocais('controle')} className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/10 transition cursor-pointer">
                          Controle de estoque
                        </button>
                        <button onClick={() => setShowNovoLocalModal(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg cursor-pointer">
                          + Local
                        </button>
                      </>
                    )}

                    {supSubTab === 'epis' && !epiDetalhe && (
                      <>
                        <button onClick={() => setShowGerarContratoEpiModal(true)} className="px-3.5 py-2 border border-amber-500 text-amber-400 font-bold rounded-xl text-xs hover:bg-amber-500/10 transition cursor-pointer">
                          Gerar contrato
                        </button>
                        <button onClick={() => setShowNovoEpiModal(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition shadow-lg cursor-pointer">
                          + Novo EPI
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* 1. TELA DE PRODUTOS */}
                {supSubTab === 'produtos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="relative">
                        <button onClick={() => setShowFiltroModal(!showFiltroModal)} className="px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer">
                          <Filter className="w-4 h-4 text-amber-500" /> Adicionar filtro
                        </button>

                        {showFiltroModal && (
                          <div className="absolute top-11 left-0 w-64 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl z-40 text-xs space-y-3">
                            <p className="font-bold text-amber-400 uppercase">Filtros de Valor</p>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={filtroStatusProduto === 'Ativo'} onChange={() => setFiltroStatusProduto(filtroStatusProduto === 'Ativo' ? 'Todos' : 'Ativo')} />
                              <span>Somente Ativos</span>
                            </label>
                            <button onClick={() => setShowFiltroModal(false)} className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Aplicar filtros</button>
                          </div>
                        )}
                      </div>

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
                        {produtosFiltrados.length === 0 ? (
                          <tr><td colSpan={7} className="p-6 text-center text-slate-500">Nenhum produto cadastrado.</td></tr>
                        ) : (
                          produtosFiltrados.map((prod: any, idx: number) => (
                            <tr key={prod.id || idx} className="hover:bg-slate-950/50">
                              <td className="p-3 font-bold text-amber-400">{prod.codigo || (100 + idx)}</td>
                              <td className="p-3 font-bold text-white">
                                {prod.nome}
                                {prod.especificacao && <p className="text-[10px] text-slate-400 font-normal">{prod.especificacao}</p>}
                              </td>
                              <td className="p-3 font-bold text-amber-400 font-mono uppercase">{prod.unidade || 'un'}</td>
                              <td className="p-3 text-slate-300">{prod.marca || '-'}</td>
                              <td className="p-3">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${prod.tipo === 'Equipamento' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                  {prod.tipo || 'Material'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-300">{prod.categoria || 'Geral'} <span className="text-slate-500">• {prod.subcategoria || 'Geral'}</span></td>
                              <td className="p-3"><span className="text-emerald-400 font-bold">Ativo</span></td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. LOCAIS DE ESTOQUE */}
                {supSubTab === 'locais' && visaoLocais === 'lista' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Warehouse className="w-4 h-4 text-amber-500" /> Locais Ativos de Estoque</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Código</th>
                          <th className="p-3">Nome</th>
                          <th className="p-3">Cidade</th>
                          <th className="p-3">Quantidade de Setores</th>
                          <th className="p-3">Status do Balanço</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {locaisSup.map((loc: any, idx: number) => (
                          <tr key={loc.id || idx} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-amber-400">{loc.codigo || (2000 + idx)}</td>
                            <td className="p-3 font-bold text-white">{loc.nome}</td>
                            <td className="p-3 text-slate-300">{loc.cidade || 'Belo Horizonte'}</td>
                            <td className="p-3 text-slate-400 font-mono">{loc.qtd_setores || 1}</td>
                            <td className="p-3"><span className="px-2.5 py-1 bg-slate-800 text-slate-400 rounded-full text-[10px] font-bold">{loc.status_balanco || 'Sem balanço'}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. BALANÇOS */}
                {supSubTab === 'balancos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><ClipboardCheck className="w-4 h-4 text-amber-500" /> Balanços de Estoque e Conferência Física</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {balancosSup.map((bal: any) => (
                        <div key={bal.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                          <div><p className="font-bold text-white text-sm">{bal.codigo_balanco} - {bal.centro_custo}</p><p className="text-slate-400">Periodicidade: {bal.periodicidade}</p></div>
                          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full font-bold uppercase">{bal.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. EPIS */}
                {supSubTab === 'epis' && !epiDetalhe && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-500" /> Equipamentos de Proteção Individual (EPIs)</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Código</th><th className="p-3">EPI</th><th className="p-3">CA</th><th className="p-3">Quantidade</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {episSup.map((epi: any, idx: number) => (
                          <tr key={epi.id || idx} onClick={() => setEpiDetalhe(epi)} className="hover:bg-slate-950/50 cursor-pointer">
                            <td className="p-3 font-bold text-amber-400">{epi.codigo || (4920 + idx)}</td>
                            <td className="p-3 font-bold text-white underline">{epi.nome}</td>
                            <td className="p-3 text-slate-400 font-mono">{epi.ca || 'N/A'}</td>
                            <td className="p-3 font-bold text-emerald-400 font-mono text-sm">{epi.quantidade || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

            {activeModule !== 'dashboard' && activeModule !== 'suprimentos' && <div className="p-6 text-slate-400">Módulo Ativo.</div>}
          </main>
        </div>

        {/* MODAL NOVO PRODUTO COM CAMPOS COMPLETOS (PADRÃO KOPER ERP) */}
        {showNovoProdutoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-800 space-y-4 text-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-amber-500" /> Cadastrar Novo Produto / Insumo
                </h3>
                <button onClick={() => setShowNovoProdutoModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <form onSubmit={handleSaveProduto} className="space-y-4">
                {/* INFORMAÇÕES BÁSICAS */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Nome / Descrição do Produto *</label>
                  <input type="text" required placeholder="Ex: Abraçadeira tipo D 3/4" value={prodNome} onChange={(e) => setProdNome(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Especificação Técnica</label>
                  <input type="text" placeholder="Ex: 512 - Abraçadeira tipo D 3/4 com rosca zincada" value={prodEspecificacao} onChange={(e) => setProdEspecificacao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Apelido / Nome Curto</label>
                    <input type="text" placeholder="Ex: Abraçadeira 3/4" value={prodApelido} onChange={(e) => setProdApelido(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tipo *</label>
                    <select value={prodTipo} onChange={(e) => setProdTipo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option value="Material">Material</option>
                      <option value="Equipamento">Equipamento</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1">Unidade de Medida *</label>
                    <select value={prodUnidade} onChange={(e) => setProdUnidade(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option value="un">un (Unidade)</option>
                      <option value="kg">kg (Quilograma)</option>
                      <option value="m³">m³ (Metro Cúbico)</option>
                      <option value="m">m (Metro Lineal)</option>
                      <option value="m²">m² (Metro Quadrado)</option>
                      <option value="l">l (Litro)</option>
                      <option value="par">par (Par - EPI)</option>
                      <option value="sc">sc (Saco)</option>
                      <option value="cx">cx (Caixa)</option>
                      <option value="rl">rl (Rolo)</option>
                    </select>
                  </div>
                </div>

                {/* CATEGORIZAÇÃO E REFERÊNCIAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Categoria *</label>
                    <select value={prodCategoria} onChange={(e) => setProdCategoria(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option value="Instalações hidráulicas">Instalações hidráulicas</option>
                      <option value="Instalações elétricas e Telecomunicações">Instalações elétricas e Telecomunicações</option>
                      <option value="Estrutura">Estrutura</option>
                      <option value="Artfatos">Artfatos</option>
                      <option value="Máquinas, Ferramentas e Equipamentos">Máquinas, Ferramentas e Equipamentos</option>
                      <option value="Materiais de expediente">Materiais de expediente</option>
                      <option value="Aberturas e Gradis">Aberturas e Gradis</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Subcategoria *</label>
                    <select value={prodSubcategoria} onChange={(e) => setProdSubcategoria(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer">
                      <option value="Tubos e Conexões para esgoto">Tubos e Conexões para esgoto</option>
                      <option value="Consumíveis">Consumíveis</option>
                      <option value="Fixações">Fixações</option>
                      <option value="Cabos de comunicação">Cabos de comunicação</option>
                      <option value="Condutores elétricos">Condutores elétricos</option>
                      <option value="Acessórios e Materiais">Acessórios e Materiais</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Marca / Fabricante Preferencial</label>
                    <input type="text" placeholder="Ex: Amanco, Tigre, Gerdau" value={prodMarca} onChange={(e) => setProdMarca(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Valor Estimado / Preço Ref. (R$)</label>
                    <input type="number" step="0.01" placeholder="R$ 0,00" value={prodValorEstimado} onChange={(e) => setProdValorEstimado(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Observações Gerais</label>
                  <textarea rows={2} placeholder="Informações adicionais sobre o produto..." value={prodObservacoes} onChange={(e) => setProdObservacoes(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowNovoProdutoModal(false)} className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-lg">Salvar Produto Completo</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
