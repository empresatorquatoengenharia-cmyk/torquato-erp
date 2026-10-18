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
  Check
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
  const [loading, setLoading] = useState(false);

  // Sub-abas do Financeiro (pagar, receber, fluxo)
  const [finTab, setFinTab] = useState('pagar');

  // Modais Administração & Financeiro
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [showFinanceiroModal, setShowFinanceiroModal] = useState(false);

  // Modais de Edição
  const [showEditEmpresaModal, setShowEditEmpresaModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [showEditContratoModal, setShowEditContratoModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);

  const [showEditFinanceiroModal, setShowEditFinanceiroModal] = useState(false);
  const [editingFinanceiro, setEditingFinanceiro] = useState<any>(null);

  // Forms Criação Empresa
  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');

  // Forms Criação Usuário
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userCargo, setUserCargo] = useState('Engenheiro');
  const [userLimite, setUserLimite] = useState('5000');
  const [userPermissoes, setUserPermissoes] = useState({
    financeiro: 'movimentar',
    engenharia: 'movimentar',
    compras: 'movimentar',
    estoque: 'visualizar',
    administracao: 'visualizar'
  });

  // Forms Criação Contrato
  const [contTitulo, setContTitulo] = useState('');
  const [contFornecedor, setContFornecedor] = useState('');
  const [contValor, setContValor] = useState('');
  const [contStatus, setContStatus] = useState('Ativo');

  // Forms Financeiro
  const [finDescricao, setFinDescricao] = useState('');
  const [finValor, setFinValor] = useState('');
  const [finTipo, setFinTipo] = useState('pagar');
  const [finVencimento, setFinVencimento] = useState('');
  const [finCategoria, setFinCategoria] = useState('Material de Obra');
  const [finStatus, setFinStatus] = useState('Pendente');

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

    const { data: userData } = await supabase.from('usuarios_erp').select('*').order('created_at', { ascending: false });
    if (userData) {
      setUsuarios(userData.map((u: any) => ({
        ...u,
        permissoes: u.permissoes || { financeiro: 'movimentar', engenharia: 'movimentar', compras: 'movimentar', estoque: 'visualizar', administracao: 'visualizar' }
      })));
    }

    const { data: contData } = await supabase.from('contratos_empresa').select('*').order('created_at', { ascending: false });
    if (contData) setContratos(contData);

    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('vencimento', { ascending: true });
    if (pagData) setFinancialsPagar(pagData);

    const { data: recData } = await supabase.from('financeiro_receber').select('*').order('vencimento', { ascending: true });
    if (recData) setFinancialsReceber(recData);

    setLoading(false);
  }

  // Ações de Criação
  async function handleSaveEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empNome) return;
    const { error } = await supabase.from('empresas_erp').insert([{
      nome: empNome,
      cnpj: empCnpj || '00.000.000/0001-00'
    }]);

    if (error) { alert('Erro ao salvar empresa: ' + error.message); return; }
    setShowEmpresaModal(false);
    setEmpNome(''); setEmpCnpj('');
    loadAllData();
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    await supabase.from('usuarios_erp').insert([{
      nome: userName, email: userEmail, cargo: userCargo, limite_aprovacao: parseFloat(userLimite), status: 'ativo', permissoes: userPermissoes
    }]);
    setShowUserModal(false);
    setUserName(''); setUserEmail(''); setUserLimite('5000');
    loadAllData();
  }

  async function handleSaveContrato(e: React.FormEvent) {
    e.preventDefault();
    if (!contTitulo || !contValor) return;
    await supabase.from('contratos_empresa').insert([{
      titulo: contTitulo, fornecedor: contFornecedor, valor: parseFloat(contValor), status: contStatus
    }]);
    setShowContratoModal(false);
    setContTitulo(''); setContFornecedor(''); setContValor('');
    loadAllData();
  }

  async function handleSaveFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!finDescricao || !finValor) return;
    const tableTarget = finTipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    const { error } = await supabase.from(tableTarget).insert([{
      descricao: finDescricao,
      valor: parseFloat(finValor),
      vencimento: finVencimento || new Date().toISOString().split('T')[0],
      categoria: finCategoria,
      status: finStatus,
      empresa: selectedCompany
    }]);

    if (error) { alert('Erro ao salvar lançamento: ' + error.message); return; }
    setShowFinanceiroModal(false);
    setFinDescricao(''); setFinValor('');
    loadAllData();
  }

  // Ações de Edição
  async function handleUpdateEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEmpresa) return;
    const { error } = await supabase.from('empresas_erp').update({ nome: editingEmpresa.nome, cnpj: editingEmpresa.cnpj }).eq('id', editingEmpresa.id);
    if (error) { alert('Erro ao atualizar empresa: ' + error.message); return; }
    setShowEditEmpresaModal(false); setEditingEmpresa(null); loadAllData();
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    const { error } = await supabase.from('usuarios_erp').update({
      nome: editingUser.nome, email: editingUser.email, cargo: editingUser.cargo, limite_aprovacao: parseFloat(editingUser.limite_aprovacao || 0), status: editingUser.status, permissoes: editingUser.permissoes
    }).eq('id', editingUser.id);
    if (error) { alert('Erro ao atualizar usuário: ' + error.message); return; }
    setShowEditUserModal(false); setEditingUser(null); loadAllData();
  }

  async function handleUpdateContrato(e: React.FormEvent) {
    e.preventDefault();
    if (!editingContrato) return;
    const { error } = await supabase.from('contratos_empresa').update({
      titulo: editingContrato.titulo, fornecedor: editingContrato.fornecedor, valor: parseFloat(editingContrato.valor || 0), status: editingContrato.status
    }).eq('id', editingContrato.id);
    if (error) { alert('Erro ao atualizar contrato: ' + error.message); return; }
    setShowEditContratoModal(false); setEditingContrato(null); loadAllData();
  }

  async function handleUpdateFinanceiro(e: React.FormEvent) {
    e.preventDefault();
    if (!editingFinanceiro) return;
    const tableTarget = editingFinanceiro.tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    const { error } = await supabase.from(tableTarget).update({
      descricao: editingFinanceiro.descricao,
      valor: parseFloat(editingFinanceiro.valor || 0),
      vencimento: editingFinanceiro.vencimento,
      categoria: editingFinanceiro.categoria,
      status: editingFinanceiro.status
    }).eq('id', editingFinanceiro.id);

    if (error) { alert('Erro ao atualizar lançamento: ' + error.message); return; }
    setShowEditFinanceiroModal(false); setEditingFinanceiro(null); loadAllData();
  }

  // Ações de Exclusão
  async function handleDeleteEmpresa(id: string) {
    if (!confirm('Deseja excluir esta empresa?')) return;
    await supabase.from('empresas_erp').delete().eq('id', id);
    loadAllData();
  }

  async function handleDeleteUser(id: string) {
    if (!confirm('Deseja excluir este usuário?')) return;
    await supabase.from('usuarios_erp').delete().eq('id', id);
    loadAllData();
  }

  async function handleDeleteContrato(id: string) {
    if (!confirm('Deseja excluir este contrato?')) return;
    await supabase.from('contratos_empresa').delete().eq('id', id);
    loadAllData();
  }

  async function handleDeleteFinanceiro(id: string, tipo: 'pagar' | 'receber') {
    if (!confirm('Deseja excluir este lançamento financeiro?')) return;
    const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).delete().eq('id', id);
    loadAllData();
  }

  // Quitar / Baixar Lançamento
  async function handleToggleQuitar(item: any, tipo: 'pagar' | 'receber') {
    const novoStatus = item.status === 'Pago' || item.status === 'Recebido' ? 'Pendente' : (tipo === 'pagar' ? 'Pago' : 'Recebido');
    const tableTarget = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
    await supabase.from(tableTarget).update({ status: novoStatus }).eq('id', item.id);
    loadAllData();
  }

  // Cálculos financeiros filtrados pela empresa ativa
  const filteredPagar = financialsPagar.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);
  const filteredReceber = financialsReceber.filter(item => !selectedCompany || item.empresa === selectedCompany || !item.empresa);

  const totalPagar = filteredPagar.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  const totalReceber = filteredReceber.reduce((acc, item) => acc + Number(item.valor || 0), 0);
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
                <div className="flex items-center gap-3"><DollarSign className="w-4 h-4" /> Financeiro Koper ERP</div>
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
                    <p className="text-xs text-slate-400 mt-1">Multiempresa, controle rigoroso de acessos hierárquicos e permissões granulares por página</p>
                  </div>
                </div>

                {/* 1. SEÇÃO MULTIEMPRESA */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-amber-500" /> Extensão Multiempresa
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Gerencie todas as suas empresas e CNPJs em um único login.</p>
                    </div>
                    <button onClick={() => setShowEmpresaModal(true)} className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition">
                      + Cadastrar Nova Empresa
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {empresas.map(emp => (
                      <div key={emp.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-sm">{emp.nome}</p>
                          <p className="text-xs text-slate-400">CNPJ: {emp.cnpj}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setEditingEmpresa(emp); setShowEditEmpresaModal(true); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition" title="Editar Empresa">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDeleteEmpresa(emp.id)} className="p-2 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded-lg transition" title="Excluir Empresa">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. GESTÃO DE ACESSOS */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400" /> Gestão de Acessos & Limites Hierárquicos
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Defina alçadas de aprovação e permissões por página.</p>
                    </div>
                    <button onClick={() => setShowUserModal(true)} className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition">
                      + Novo Usuário & Alçada
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Colaborador</th>
                        <th className="p-3">E-mail</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3">Limite</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {usuarios.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhum usuário cadastrado.</td></tr>
                      ) : (
                        usuarios.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3 font-bold text-white">{u.nome}</td>
                            <td className="p-3 text-slate-400">{u.email}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-bold">{u.cargo}</span></td>
                            <td className="p-3 font-bold text-emerald-400">R$ {Number(u.limite_aprovacao || 5000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-center flex items-center justify-center gap-1.5">
                              <button onClick={() => { setEditingUser(u); setShowEditUserModal(true); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Editar
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded text-xs font-bold" title="Excluir">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 3. CONTRATOS */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-400" /> Gestão de Contratos & Modelos
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Cadastre modelos de contratos.</p>
                    </div>
                    <button onClick={() => setShowContratoModal(true)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition">
                      + Cadastrar Contrato
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Título / Objeto</th>
                        <th className="p-3">Fornecedor</th>
                        <th className="p-3">Valor Global</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {contratos.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhum contrato cadastrado.</td></tr>
                      ) : (
                        contratos.map((c: any) => (
                          <tr key={c.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3 font-bold text-white">{c.titulo}</td>
                            <td className="p-3 text-slate-400">{c.fornecedor || 'Não informado'}</td>
                            <td className="p-3 font-bold text-amber-400">R$ {Number(c.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 font-bold uppercase">{c.status}</span></td>
                            <td className="p-3 text-center flex items-center justify-center gap-1.5">
                              <button onClick={() => { setEditingContrato(c); setShowEditContratoModal(true); }} className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Editar
                              </button>
                              <button onClick={() => handleDeleteContrato(c.id)} className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded text-xs font-bold" title="Excluir">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {/* MÓDULO FINANCEIRO KOPER ERP */}
            {activeModule === 'financeiro' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-emerald-500" /> Módulo Financeiro Corporativo (Koper ERP)
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Empresa ativa: <span className="text-amber-400 font-bold">{selectedCompany}</span></p>
                  </div>
                  <button onClick={() => setShowFinanceiroModal(true)} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Novo Lançamento Financeiro
                  </button>
                </div>

                {/* CARDS RESUMO EXECUTIVO (Padrão Koper) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contas a Pagar</p>
                      <h3 className="text-xl font-black text-rose-400 mt-1">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400 border border-rose-500/20"><TrendingDown className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Contas a Receber</p>
                      <h3 className="text-xl font-black text-emerald-400 mt-1">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20"><TrendingUp className="w-6 h-6" /></div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Líquido Projetado</p>
                      <h3 className={`text-xl font-black mt-1 ${saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                        R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </h3>
                    </div>
                    <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20"><BarChart3 className="w-6 h-6" /></div>
                  </div>
                </div>

                {/* ABAS DO FINANCEIRO */}
                <div className="flex gap-2 border-b border-slate-800 pb-2">
                  <button onClick={() => setFinTab('pagar')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${finTab === 'pagar' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
                    Contas a Pagar ({filteredPagar.length})
                  </button>
                  <button onClick={() => setFinTab('receber')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${finTab === 'receber' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
                    Contas a Receber ({filteredReceber.length})
                  </button>
                  <button onClick={() => setFinTab('fluxo')} className={`px-4 py-2 rounded-xl text-xs font-bold transition ${finTab === 'fluxo' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'}`}>
                    Fluxo de Caixa Gerencial
                  </button>
                </div>

                {/* TABELA CONTAS A PAGAR */}
                {finTab === 'pagar' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-rose-400" /> Relação de Contas a Pagar
                    </h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Descrição / Fornecedor</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Vencimento</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Ações / Quitação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredPagar.length === 0 ? (
                          <tr><td colSpan={6} className="p-6 text-center text-slate-500">Nenhuma conta a pagar registrada para esta empresa.</td></tr>
                        ) : (
                          filteredPagar.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-950/50 transition">
                              <td className="p-3 font-bold text-white">{item.descricao}</td>
                              <td className="p-3 text-slate-400">{item.categoria}</td>
                              <td className="p-3 text-slate-300">{item.vencimento}</td>
                              <td className="p-3 font-bold text-rose-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                  {item.status || 'Pendente'}
                                </span>
                              </td>
                              <td className="p-3 text-center flex items-center justify-center gap-1.5">
                                <button onClick={() => handleToggleQuitar(item, 'pagar')} className={`px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${item.status === 'Pago' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`} title="Quitar / Pagar">
                                  <Check className="w-3 h-3" /> {item.status === 'Pago' ? 'Estornar' : 'Pagar'}
                                </button>
                                <button onClick={() => { setEditingFinanceiro({ ...item, tipo: 'pagar' }); setShowEditFinanceiroModal(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded" title="Editar">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleDeleteFinanceiro(item.id, 'pagar')} className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded" title="Excluir">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TABELA CONTAS A RECEBER */}
                {finTab === 'receber' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" /> Relação de Contas a Receber
                    </h3>
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase">
                        <tr>
                          <th className="p-3">Descrição / Cliente</th>
                          <th className="p-3">Categoria</th>
                          <th className="p-3">Previsão</th>
                          <th className="p-3">Valor</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-center">Ações / Recebimento</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {filteredReceber.length === 0 ? (
                          <tr><td colSpan={6} className="p-6 text-center text-slate-500">Nenhuma conta a receber registrada para esta empresa.</td></tr>
                        ) : (
                          filteredReceber.map((item: any) => (
                            <tr key={item.id} className="hover:bg-slate-950/50 transition">
                              <td className="p-3 font-bold text-white">{item.descricao}</td>
                              <td className="p-3 text-slate-400">{item.categoria}</td>
                              <td className="p-3 text-slate-300">{item.vencimento}</td>
                              <td className="p-3 font-bold text-emerald-400">R$ {Number(item.valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'Recebido' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                  {item.status || 'Pendente'}
                                </span>
                              </td>
                              <td className="p-3 text-center flex items-center justify-center gap-1.5">
                                <button onClick={() => handleToggleQuitar(item, 'receber')} className={`px-2.5 py-1 rounded text-xs font-bold inline-flex items-center gap-1 ${item.status === 'Recebido' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`} title="Receber">
                                  <Check className="w-3 h-3" /> {item.status === 'Recebido' ? 'Estornar' : 'Receber'}
                                </button>
                                <button onClick={() => { setEditingFinanceiro({ ...item, tipo: 'receber' }); setShowEditFinanceiroModal(true); }} className="p-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded" title="Editar">
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button onClick={() => handleDeleteFinanceiro(item.id, 'receber')} className="p-1.5 bg-slate-800 hover:bg-rose-950 text-rose-400 rounded" title="Excluir">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* FLUXO DE CAIXA GERENCIAL */}
                {finTab === 'fluxo' && (
                  <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-amber-500" /> Fluxo de Caixa Consolidado ({selectedCompany})
                    </h3>
                    <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Total de Entradas Previstas / Realizadas:</span>
                        <span className="font-bold text-emerald-400">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-800">
                        <span className="text-slate-400">Total de Saídas / Despesas:</span>
                        <span className="font-bold text-rose-400">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between py-2 text-sm font-black">
                        <span className="text-white">Resultado Operacional Líquido:</span>
                        <span className={saldoLiquido >= 0 ? 'text-amber-400' : 'text-rose-400'}>
                          R$ {saldoLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {activeModule !== 'administracao' && activeModule !== 'financeiro' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white capitalize">{activeModule}</h1>
                <p className="text-xs text-slate-400">Módulo integrado ao ERP Corporativo.</p>
              </div>
            )}

          </main>
        </div>

        {/* MODAL CADASTRAR EMPRESA */}
        {showEmpresaModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Cadastrar Nova Empresa</h3><button onClick={() => setShowEmpresaModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveEmpresa} className="space-y-3">
                <input type="text" required placeholder="Razão Social" value={empNome} onChange={(e) => setEmpNome(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="CNPJ" value={empCnpj} onChange={(e) => setEmpCnpj(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Empresa</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR EMPRESA */}
        {showEditEmpresaModal && editingEmpresa && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Empresa</h3><button onClick={() => setShowEditEmpresaModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateEmpresa} className="space-y-3">
                <input type="text" required value={editingEmpresa.nome} onChange={(e) => setEditingEmpresa({ ...editingEmpresa, nome: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" required value={editingEmpresa.cnpj} onChange={(e) => setEditingEmpresa({ ...editingEmpresa, cnpj: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Alterações</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOVO USUÁRIO */}
        {showUserModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Usuário</h3><button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveUser} className="space-y-3">
                <input type="text" required placeholder="Nome Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" required placeholder="E-mail" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" required placeholder="Limite de Gastos" value={userLimite} onChange={(e) => setUserLimite(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR USUÁRIO */}
        {showEditUserModal && editingUser && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Usuário</h3><button onClick={() => setShowEditUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateUser} className="space-y-3">
                <input type="text" required value={editingUser.nome} onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" required value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" required value={editingUser.limite_aprovacao} onChange={(e) => setEditingUser({ ...editingUser, limite_aprovacao: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Salvar Alterações</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CADASTRAR CONTRATO */}
        {showContratoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Cadastrar Contrato</h3><button onClick={() => setShowContratoModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveContrato} className="space-y-3">
                <input type="text" required placeholder="Título / Objeto" value={contTitulo} onChange={(e) => setContTitulo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Fornecedor" value={contFornecedor} onChange={(e) => setContFornecedor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={contValor} onChange={(e) => setContValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR CONTRATO */}
        {showEditContratoModal && editingContrato && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Contrato</h3><button onClick={() => setShowEditContratoModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateContrato} className="space-y-3">
                <input type="text" required value={editingContrato.titulo} onChange={(e) => setEditingContrato({ ...editingContrato, titulo: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" value={editingContrato.fornecedor || ''} onChange={(e) => setEditingContrato({ ...editingContrato, fornecedor: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required value={editingContrato.valor} onChange={(e) => setEditingContrato({ ...editingContrato, valor: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar Alterações</button></div>
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
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setFinTipo('pagar')} className={`p-2.5 rounded-xl text-xs font-bold border transition ${finTipo === 'pagar' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>Conta a Pagar</button>
                  <button type="button" onClick={() => setFinTipo('receber')} className={`p-2.5 rounded-xl text-xs font-bold border transition ${finTipo === 'receber' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>Conta a Receber</button>
                </div>
                <input type="text" required placeholder="Descrição" value={finDescricao} onChange={(e) => setFinDescricao(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor (R$)" value={finValor} onChange={(e) => setFinValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={finVencimento} onChange={(e) => setFinVencimento(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={finCategoria} onChange={(e) => setFinCategoria(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Material de Obra">Material de Obra</option>
                  <option value="Mão de Obra">Mão de Obra</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Despesas Administrativas">Despesas Administrativas</option>
                  <option value="Medição de Obra / Faturamento">Medição de Obra / Faturamento</option>
                </select>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar Lançamento</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR LANÇAMENTO FINANCEIRO */}
        {showEditFinanceiroModal && editingFinanceiro && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Lançamento Financeiro</h3><button onClick={() => setShowEditFinanceiroModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateFinanceiro} className="space-y-3">
                <input type="text" required value={editingFinanceiro.descricao} onChange={(e) => setEditingFinanceiro({ ...editingFinanceiro, descricao: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required value={editingFinanceiro.valor} onChange={(e) => setEditingFinanceiro({ ...editingFinanceiro, valor: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="date" required value={editingFinanceiro.vencimento} onChange={(e) => setEditingFinanceiro({ ...editingFinanceiro, vencimento: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={editingFinanceiro.categoria} onChange={(e) => setEditingFinanceiro({ ...editingFinanceiro, categoria: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Material de Obra">Material de Obra</option>
                  <option value="Mão de Obra">Mão de Obra</option>
                  <option value="Equipamentos">Equipamentos</option>
                  <option value="Despesas Administrativas">Despesas Administrativas</option>
                  <option value="Medição de Obra / Faturamento">Medição de Obra / Faturamento</option>
                </select>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowEditFinanceiroModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
