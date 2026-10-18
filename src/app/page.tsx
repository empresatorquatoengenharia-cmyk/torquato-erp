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
  Lock,
  Briefcase,
  Edit2,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Check,
  Eye,
  Paperclip,
  CreditCard,
  Wallet,
  FileSpreadsheet,
  Receipt,
  Scale
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('administracao');
  const [selectedCompany, setSelectedCompany] = useState('Torquato Engenharia Ltda');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados Globais
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [contasBancarias, setContasBancarias] = useState<any[]>([]);
  const [cartoesCredito, setCartoesCredito] = useState<any[]>([]);
  const [boletos, setBoletos] = useState<any[]>([]);
  const [tributos, setTributos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Sub-abas do Financeiro estilo Koper
  const [finSubTab, setFinSubTab] = useState('pagar');

  // Modais Gerais
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);
  const [showBancoModal, setShowBancoModal] = useState(false);
  const [showBoletoModal, setShowBoletoModal] = useState(false);
  const [showTributoModal, setShowTributoModal] = useState(false);

  // Modais de Edição
  const [showEditEmpresaModal, setShowEditEmpresaModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showEditContratoModal, setShowEditContratoModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);
  const [showEditFinanceiroModal, setShowEditFinanceiroModal] = useState(false);
  const [editingFinanceiro, setEditingFinanceiro] = useState<any>(null);

  // Forms Administração
  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCargo, setUserCargo] = useState('Engenheiro');
  const [userLimite, setUserLimite] = useState('5000');
  const [userPermissoes, setUserPermissoes] = useState({ financeiro: 'movimentar', engenharia: 'movimentar', compras: 'movimentar', estoque: 'visualizar', administracao: 'visualizar' });
  const [contTitulo, setContTitulo] = useState('');
  const [contFornecedor, setContFornecedor] = useState('');
  const [contValor, setContValor] = useState('');
  const [contStatus, setContStatus] = useState('Ativo');

  // Forms Financeiro Koper (com NF e Comprovante separados)
  const [finDescricao, setFinDescricao] = useState('');
  const [finValor, setFinValor] = useState('');
  const [finTipo, setFinTipo] = useState('pagar');
  const [finVencimento, setFinVencimento] = useState('');
  const [finCategoria, setFinCategoria] = useState('Material de Obra');
  const [finStatus, setFinStatus] = useState('Pendente');
  const [finEtiqueta, setFinEtiqueta] = useState('Geral');
  const [finNfNome, setFinNfNome] = useState('');
  const [finNfUrl, setFinNfUrl] = useState('');
  const [finCompNome, setFinCompNome] = useState('');
  const [finCompUrl, setFinCompUrl] = useState('');

  // Forms Bancos, Boletos e Tributos
  const [bancoNome, setBancoNome] = useState('');
  const [bancoAgencia, setBancoAgencia] = useState('');
  const [bancoConta, setBancoConta] = useState('');
  const [bancoSaldo, setBancoSaldo] = useState('');

  const [bolNumero, setBolNumero] = useState('');
  const [bolSacado, setBolSacado] = useState('');
  const [bolValor, setBolValor] = useState('');
  const [bolVencimento, setBolVencimento] = useState('');

  const [tribImposto, setTribImposto] = useState('ISS / PIS / COFINS');
  const [tribCompetencia, setTribCompetencia] = useState('2026/10');
  const [tribValor, setTribValor] = useState('');
  const [tribVencimento, setTribVencimento] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    const { data: empData } = await supabase.from('empresas_erp').select('*').order('created_at', { ascending: true });
    if (empData && empData.length > 0) {
      setEmpresas(empData);
      if (!selectedCompany) setSelectedCompany(empData[0].nome);
    }
    const { data: projData } = await supabase.from('projects').select('*');
    if (projData) setProjects(projData);

    const { data: userData } = await supabase.from('usuarios_erp').select('*');
    if (userData) setUsuarios(userData);

    const { data: contData } = await supabase.from('contratos_empresa').select('*');
    if (contData) setContratos(contData);

    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('vencimento', { ascending: true });
    if (pagData) setFinancialsPagar(pagData);

    const { data: recData } = await supabase.from('financeiro_receber').select('*').order('vencimento', { ascending: true });
    if (recData) setFinancialsReceber(recData);

    const { data: bancoData } = await supabase.from('contas_bancarias').select('*');
    if (bancoData) setContasBancarias(bancoData);

    const { data: cartaoData } = await supabase.from('cartoes_credito').select('*');
    if (cartaoData) setCartoesCredito(cartaoData);

    const { data: bolData } = await supabase.from('boletos_erp').select('*');
    if (bolData) setBoletos(bolData);

    const { data: tribData } = await supabase.from('tributos_erp').select('*');
    if (tribData) setTributos(tribData);

    setLoading(false);
  }

  // Upload separado NF / Comprovante
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, tipoArquivo: 'nf' | 'comprovante', isEditing = false) {
    const file = e.target.files?.[0];
    if (!file) return;
    const nomeFicheiro = file.name;
    const urlFicheiro = URL.createObjectURL(file);

    if (isEditing) {
      if (tipoArquivo === 'nf') setEditingFinanceiro({ ...editingFinanceiro, nf_nome: nomeFicheiro, nf_url: urlFicheiro });
      else setEditingFinanceiro({ ...editingFinanceiro, comprovante_nome: nomeFicheiro, comprovante_url: urlFicheiro });
    } else {
      if (tipoArquivo === 'nf') { setFinNfNome(nomeFicheiro); setFinNfUrl(urlFicheiro); }
      else { setFinCompNome(nomeFicheiro); setFinCompUrl(urlFicheiro); }
    }
  }

  // Ações de Inserção
  async function handleSaveEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empNome) return;
    await supabase.from('empresas_erp').insert([{ nome: empNome, cnpj: empCnpj || '00.000.000/0001-00' }]);
    setShowEmpresaModal(false); setEmpNome(''); setEmpCnpj(''); loadAllData();
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    await supabase.from('usuarios_erp').insert([{ nome: userName, email: userEmail, cargo: userCargo, limite_aprovacao: parseFloat(userLimite), status: 'ativo', permissoes: userPermissoes }]);
    setShowUserModal(false); setUserName(''); setUserEmail(''); loadAllData();
  }

  async function handleSaveContrato(e: React.FormEvent) {
    e.preventDefault();
    if (!contTitulo || !contValor) return;
    await supabase.from('contratos_empresa').insert([{ titulo: contTitulo, fornecedor: contFornecedor, valor: parseFloat(contValor), status: contStatus }]);
    setShowContratoModal(false); setContTitulo(''); setContFornecedor(''); setContValor(''); loadAllData();
  }

  async function handleSaveFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!finDescricao || !finValor) return;
    const tableTarget = finTipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).insert([{
      descricao: finDescricao,
      valor: parseFloat(finValor),
      vencimento: finVencimento || new Date().toISOString().split('T')[0],
      categoria: finCategoria,
      status: finStatus,
      empresa: selectedCompany,
      etiqueta: finEtiqueta,
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
    await supabase.from('contas_bancarias').insert([{ banco: bancoNome, agencia: bancoAgencia, conta: bancoConta, saldo: parseFloat(bancoSaldo || 0), empresa: selectedCompany }]);
    setShowBancoModal(false); setBancoNome(''); setBancoAgencia(''); setBancoConta(''); setBancoSaldo(''); loadAllData();
  }

  async function handleSaveBoleto(e: React.FormEvent) {
    e.preventDefault();
    if (!bolNumero || !bolValor) return;
    await supabase.from('boletos_erp').insert([{ nosso_numero: bolNumero, sacado: bolSacado, valor: parseFloat(bolValor), vencimento: bolVencimento, status: 'Em Aberto', empresa: selectedCompany }]);
    setShowBoletoModal(false); setBolNumero(''); setBolSacado(''); setBolValor(''); loadAllData();
  }

  async function handleSaveTributo(e: React.FormEvent) {
    e.preventDefault();
    if (!tribImposto || !tribValor) return;
    await supabase.from('tributos_erp').insert([{ imposto: tribImposto, competencia: tribCompetencia, valor: parseFloat(tribValor), vencimento: tribVencimento, status: 'Previsto', empresa: selectedCompany }]);
    setShowTributoModal(false); setTribImposto('ISS / PIS / COFINS'); setTribValor(''); loadAllData();
  }

  // Quitar / Baixar
  async function handleToggleQuitar(item: any, tipo: 'pagar' | 'receber') {
    const novoStatus = item.status === 'Pago' || item.status === 'Recebido' ? 'Pendente' : (tipo === 'pagar' ? 'Pago' : 'Recebido');
    const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).update({ status: novoStatus }).eq('id', item.id);
    loadAllData();
  }

  // Deleções
  async function handleDeleteEmpresa(id: string) { if (confirm('Excluir empresa?')) { await supabase.from('empresas_erp').delete().eq('id', id); loadAllData(); } }
  async function handleDeleteUser(id: string) { if (confirm('Excluir usuário?')) { await supabase.from('usuarios_erp').delete().eq('id', id); loadAllData(); } }
  async function handleDeleteContrato(id: string) { if (confirm('Excluir contrato?')) { await supabase.from('contratos_empresa').delete().eq('id', id); loadAllData(); } }
  async function handleDeleteFinanceiro(id: string, tipo: 'pagar' | 'receber') {
    if (confirm('Excluir lançamento?')) {
      const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
      await supabase.from(tableTarget).delete().eq('id', id);
      loadAllData();
    }
  }

  // Filtros Globais da Empresa Ativa
  const filteredPagar = financialsPagar.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredReceber = financialsReceber.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredBancos = contasBancarias.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredBoletos = boletos.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredTributos = tributos.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);

  const totalPagar = filteredPagar.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalReceber = filteredReceber.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalSaldosBancos = filteredBancos.reduce((acc, item) => acc + Number(item.saldo || 0), 0);
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
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block -mt-1">ERP Corporativo (Padrão Koper)</span>
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
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.nome} className="bg-slate-900">{emp.nome}</option>
                ))}
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
                onClick={() => setActiveModule('administracao')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'administracao' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><ShieldCheck className="w-4 h-4" /> Administração & Governança</div>
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
                onClick={() => setActiveModule('dashboard')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'dashboard' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><LayoutDashboard className="w-4 h-4" /> Dashboard Executivo</div>
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

              <button
                onClick={() => setActiveModule('compras')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'compras' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3"><ShoppingCart className="w-4 h-4" /> Compras & Suprimentos</div>
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

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {/* MÓDULO ADMINISTRAÇÃO */}
            {activeModule === 'administracao' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-amber-500" /> Administração & Governança Corporativa
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Multiempresa, controle rigoroso de acessos hierárquicos e permissões</p>
                  </div>
                </div>

                {/* EMPRESAS */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Building2 className="w-4 h-4 text-amber-500" /> Extensão Multiempresa</h3>
                    <button onClick={() => setShowEmpresaModal(true)} className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition">+ Cadastrar Empresa</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {empresas.map(emp => (
                      <div key={emp.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div><p className="font-bold text-white text-sm">{emp.nome}</p><p className="text-xs text-slate-400">CNPJ: {emp.cnpj}</p></div>
                        <button onClick={() => handleDeleteEmpresa(emp.id)} className="p-2 bg-slate-800 text-rose-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO FINANCEIRO KOPER ERP COMPLETO */}
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
                    <button onClick={() => setShowBancoModal(true)} className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-amber-400 font-bold rounded-xl text-xs transition border border-slate-700">+ Conta Bancária</button>
                    <button onClick={() => setShowFinanceiroModal(true)} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Novo Lançamento
                    </button>
                  </div>
                </div>

                {/* CARDS RESUMO EXECUTIVO PADRÃO KOPER */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldos Bancários</p>
                      <h3 className="text-xl font-black text-amber-400 mt-1">R$ {totalSaldosBancos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><Wallet className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Pagar</p>
                      <h3 className="text-xl font-black text-rose-400 mt-1">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20"><TrendingDown className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contas a Receber</p>
                      <h3 className="text-xl font-black text-emerald-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><TrendingUp className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Líquido</p>
                      <h3 className={`text-xl font-black mt-1 ${saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                        R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><BarChart3 className="w-6 h-6" /></div>
                  </div>
                </div>

                {/* ABAS DO KOPER ERP FINANCEIRO */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
                  <button onClick={() => setFinSubTab('pagar')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'pagar' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Pagar ({filteredPagar.length})</button>
                  <button onClick={() => setFinSubTab('receber')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'receber' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas a Receber ({filteredReceber.length})</button>
                  <button onClick={() => setFinSubTab('bancos')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'bancos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Contas Bancárias & Extrato ({filteredBancos.length})</button>
                  <button onClick={() => setFinSubTab('boletos')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'boletos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Gestão de Boletos ({filteredBoletos.length})</button>
                  <button onClick={() => setFinSubTab('tributos')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'tributos' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Gestão Tributária ({filteredTributos.length})</button>
                  <button onClick={() => setFinSubTab('fluxo')} className={`px-3 py-2 rounded-xl text-xs font-bold transition ${finSubTab === 'fluxo' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'}`}>Fluxo de Caixa Gerencial</button>
                </div>

                {/* 1. CONTAS A PAGAR */}
                {finSubTab === 'pagar' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><TrendingDown className="w-4 h-4 text-rose-400" /> Contas a Pagar & Comprovantes / Notas Fiscais</h3>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Descrição / Fornecedor</th>
                          <th className="p-3">Etiqueta</th>
                          <th className="p-3">Vencimento</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Nota Fiscal (XML/PDF)</th>
                          <th className="p-3">Comprovante de Pagamento</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPagar.length === 0 ? (
                          <tr><td colSpan={8} className="p-6 text-center text-slate-500">Nenhuma conta a pagar registrada.</td></tr>
                        ) : (
                          filteredPagar.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-950/50">
                              <td className="p-3 font-bold text-white">{item.descricao}</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">{item.etiqueta || 'Geral'}</span></td>
                              <td className="p-3 text-slate-300">{item.vencimento}</td>
                              <td className="p-3 font-bold text-rose-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-3">
                                {item.nf_url ? <a href={item.nf_url} target="_blank" rel="noreferrer" className="text-amber-400 font-bold underline flex items-center gap-1"><Paperclip className="w-3 h-3" /> {item.nf_nome || 'Ver NF'}</a> : <span className="text-slate-500">Sem NF</span>}
                              </td>
                              <td className="p-3">
                                {item.comprovante_url ? <a href={item.comprovante_url} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold underline flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {item.comprovante_nome || 'Ver Comp.'}</a> : <span className="text-slate-500">Sem Comprovante</span>}
                              </td>
                              <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{item.status || 'Pendente'}</span></td>
                              <td className="p-3 text-center flex items-center justify-center gap-1.5">
                                <button onClick={() => handleToggleQuitar(item, 'pagar')} className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Pago' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'}`}><Check className="w-3 h-3" /> {item.status === 'Pago' ? 'Estornar' : 'Pagar'}</button>
                                <button onClick={() => handleDeleteFinanceiro(item.id, 'pagar')} className="p-1 bg-slate-800 text-rose-400 rounded"><Trash2 className="w-3 h-3" /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. CONTAS A RECEBER */}
                {finSubTab === 'receber' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Contas a Receber & Extrato por Cliente</h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Descrição / Cliente</th>
                          <th className="p-3">Etiqueta</th>
                          <th className="p-3">Vencimento</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Nota Fiscal</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredReceber.length === 0 ? (
                          <tr><td colSpan={7} className="p-6 text-center text-slate-500">Nenhuma conta a receber registrada.</td></tr>
                        ) : (
                          filteredReceber.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-950/50">
                              <td className="p-3 font-bold text-white">{item.descricao}</td>
                              <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded text-[10px] font-bold">{item.etiqueta || 'Geral'}</span></td>
                              <td className="p-3 text-slate-300">{item.vencimento}</td>
                              <td className="p-3 font-bold text-emerald-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-3">{item.nf_url ? <a href={item.nf_url} target="_blank" rel="noreferrer" className="text-amber-400 underline">Ver NF</a> : <span className="text-slate-500">Sem NF</span>}</td>
                              <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Recebido' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>{item.status || 'Pendente'}</span></td>
                              <td className="p-3 text-center flex items-center justify-center gap-1.5">
                                <button onClick={() => handleToggleQuitar(item, 'receber')} className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'Recebido' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'}`}><Check className="w-3 h-3" /> {item.status === 'Recebido' ? 'Estornar' : 'Receber'}</button>
                                <button onClick={() => handleDeleteFinanceiro(item.id, 'receber')} className="p-1 bg-slate-800 text-rose-400 rounded"><Trash2 className="w-3 h-3" /></button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. CONTAS BANCÁRIAS E CONCILIAÇÃO */}
                {finSubTab === 'bancos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Wallet className="w-4 h-4 text-amber-500" /> Contas Bancárias & Conciliação</h3>
                      <button onClick={() => setShowBancoModal(true)} className="px-3 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">+ Nova Conta Bancária</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredBancos.map((b: any) => (
                        <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-white text-sm">{b.banco}</p>
                            <p className="text-xs text-slate-400">Ag: {b.agencia} • CC: {b.conta}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-amber-400 text-sm">R$ {Number(b.saldo || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase">Conciliado</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. GESTÃO DE BOLETOS */}
                {finSubTab === 'boletos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><FileText className="w-4 h-4 text-blue-400" /> Controle de Boletos Emitidos & Remessas</h3>
                      <button onClick={() => setShowBoletoModal(true)} className="px-3 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">+ Emitir Boleto</button>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Nosso Número</th><th className="p-3">Sacado / Cliente</th><th className="p-3">Vencimento</th><th className="p-3">Valor</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredBoletos.map((bol: any) => (
                          <tr key={bol.id} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-white">{bol.nosso_numero}</td>
                            <td className="p-3 text-slate-300">{bol.sacado}</td>
                            <td className="p-3 text-slate-400">{bol.vencimento}</td>
                            <td className="p-3 font-bold text-emerald-400">R$ {Number(bol.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded font-bold">{bol.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 5. GESTÃO TRIBUTÁRIA */}
                {finSubTab === 'tributos' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><Scale className="w-4 h-4 text-rose-400" /> Gestão Tributária & Impostos</h3>
                      <button onClick={() => setShowTributoModal(true)} className="px-3 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs">+ Cadastrar Tributo</button>
                    </div>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr><th className="p-3">Imposto</th><th className="p-3">Competência</th><th className="p-3">Vencimento</th><th className="p-3">Valor</th><th className="p-3">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredTributos.map((t: any) => (
                          <tr key={t.id} className="hover:bg-slate-950/50">
                            <td className="p-3 font-bold text-white">{t.imposto}</td>
                            <td className="p-3 text-slate-300">{t.competencia}</td>
                            <td className="p-3 text-slate-400">{t.vencimento}</td>
                            <td className="p-3 font-bold text-rose-400">R$ {Number(t.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3"><span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded font-bold">{t.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 6. FLUXO DE CAIXA */}
                {finSubTab === 'fluxo' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-500" /> Fluxo de Caixa Gerencial (Projetado)</h3>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-400">Total Entradas (Receber):</span><span className="font-bold text-emerald-400">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                      <div className="flex justify-between py-2 border-b border-slate-800"><span className="text-slate-400">Total Saídas (Pagar):</span><span className="font-bold text-rose-400">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                      <div className="flex justify-between py-2 text-sm font-black"><span className="text-white">Resultado Operacional Líquido:</span><span className={saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}>R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </main>
        </div>

        {/* MODAL NOVO LANÇAMENTO COM NF E COMPROVANTE */}
        {showFinanceiroModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Lançamento Financeiro (Koper)</h3><button onClick={() => setShowFinanceiroModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveFinanceiro} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFinTipo('pagar')} className={`p-2.5 rounded-xl text-xs font-bold border ${finTipo === 'pagar' ? 'bg-rose-500/25 border-rose-500 text-rose-400' : 'bg-slate-950 text-slate-400'}`}>Conta a Pagar</button>
                  <button type="button" onClick={() => setFinTipo('receber')} className={`p-2.5 rounded-xl text-xs font-bold border ${finTipo === 'receber' ? 'bg-emerald-500/25 border-emerald-500 text-emerald-400' : 'bg-slate-950 text-slate-400'}`}>Conta a Receber</button>
                </div>
                <input type="text" required placeholder="Descrição / Fornecedor / Cliente" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValor} onChange={(e) => setFinValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={finVencimento} onChange={(e) => setFinVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Etiqueta (ex: Obra Centro, Materiais)" value={finEtiqueta} onChange={(e) => setFinEtiqueta(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />

                {/* Nota Fiscal XML/PDF */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-amber-400 uppercase">Nota Fiscal (XML ou PDF)</label>
                  <input type="file" accept=".xml,.pdf" onChange={(e) => handleFileChange(e, 'nf', false)} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 cursor-pointer" />
                  {finNfNome && <p className="text-[11px] text-amber-400">NF: {finNfNome}</p>}
                </div>

                {/* Comprovante */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-emerald-400 uppercase">Comprovante de Pagamento</label>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileChange(e, 'comprovante', false)} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white cursor-pointer" />
                  {finCompNome && <p className="text-[11px] text-emerald-400">Comprovante: {finCompNome}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar Lançamento</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CONTA BANCÁRIA */}
        {showBancoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white">Nova Conta Bancária</h3>
              <form onSubmit={handleSaveBanco} className="space-y-3">
                <input type="text" required placeholder="Nome do Banco (ex: Itaú, Sicoob)" value={bancoNome} onChange={(e) => setBancoNome(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Agência" value={bancoAgencia} onChange={(e) => setBancoAgencia(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Conta Corrente" value={bancoConta} onChange={(e) => setBancoConta(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" placeholder="Saldo Inicial (R$)" value={bancoSaldo} onChange={(e) => setBancoSaldo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2"><button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Conta</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL BOLETO */}
        {showBoletoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white">Emitir / Cadastrar Boleto</h3>
              <form onSubmit={handleSaveBoleto} className="space-y-3">
                <input type="text" required placeholder="Nosso Número" value={bolNumero} onChange={(e) => setBolNumero(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" required placeholder="Sacado (Cliente)" value={bolSacado} onChange={(e) => setBolSacado(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={bolValor} onChange={(e) => setBolValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={bolVencimento} onChange={(e) => setBolVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2"><button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Salvar Boleto</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL TRIBUTO */}
        {showTributoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 space-y-4">
              <h3 className="font-bold text-white">Cadastrar Tributo / Imposto</h3>
              <form onSubmit={handleSaveTributo} className="space-y-3">
                <input type="text" required placeholder="Imposto (ex: ISS, INSS, DARF)" value={tribImposto} onChange={(e) => setTribImposto(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Competência (ex: 2026/10)" value={tribCompetencia} onChange={(e) => setTribCompetencia(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={tribValor} onChange={(e) => setTribValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={tribVencimento} onChange={(e) => setTribVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2"><button type="submit" className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl text-xs">Salvar Tributo</button></div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
