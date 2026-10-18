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
  Edit2
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
  const [empresas, setEmpresas] = useState<any[]>([
    { id: '1', nome: 'Torquato Engenharia Ltda', cnpj: '35.000.000/0001-00' },
    { id: '2', nome: 'Torquato Incorporações e Empreendimentos', cnpj: '35.000.000/0002-88' }
  ]);
  const [projects, setProjects] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [contratos, setContratos] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais de Criação
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showContratoModal, setShowContratoModal] = useState(false);

  // Modais de Edição Avançada
  const [showEditEmpresaModal, setShowEditEmpresaModal] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<any>(null);

  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [showEditContratoModal, setShowEditContratoModal] = useState(false);
  const [editingContrato, setEditingContrato] = useState<any>(null);

  // Forms Criação
  const [empNome, setEmpNome] = useState('');
  const [empCnpj, setEmpCnpj] = useState('');

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

  const [contTitulo, setContTitulo] = useState('');
  const [contFornecedor, setContFornecedor] = useState('');
  const [contValor, setContValor] = useState('');
  const [contStatus, setContStatus] = useState('Ativo');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
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

    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*');
    if (pagData) setFinancialsPagar(pagData);

    const { data: recData } = await supabase.from('financeiro_receber').select('*');
    if (recData) setFinancialsReceber(recData);

    setLoading(false);
  }

  // Ações de Criação
  async function handleSaveEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!empNome) return;
    setEmpresas([...empresas, { id: Date.now().toString(), nome: empNome, cnpj: empCnpj || '00.000.000/0001-00' }]);
    setShowEmpresaModal(false);
    setEmpNome(''); setEmpCnpj('');
  }

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    await supabase.from('usuarios_erp').insert([{
      nome: userName, 
      email: userEmail, 
      cargo: userCargo, 
      limite_aprovacao: parseFloat(userLimite), 
      status: 'ativo',
      permissoes: userPermissoes
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

  // Ações de Edição (Update)
  async function handleUpdateEmpresa(e: React.FormEvent) {
    e.preventDefault();
    if (!editingEmpresa) return;
    setEmpresas(empresas.map(emp => emp.id === editingEmpresa.id ? editingEmpresa : emp));
    setShowEditEmpresaModal(false);
    setEditingEmpresa(null);
  }

  async function handleUpdateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    await supabase.from('usuarios_erp').update({
      nome: editingUser.nome,
      email: editingUser.email,
      cargo: editingUser.cargo,
      limite_aprovacao: parseFloat(editingUser.limite_aprovacao || 0),
      status: editingUser.status,
      permissoes: editingUser.permissoes
    }).eq('id', editingUser.id);
    setShowEditUserModal(false);
    setEditingUser(null);
    loadAllData();
  }

  async function handleUpdateContrato(e: React.FormEvent) {
    e.preventDefault();
    if (!editingContrato) return;
    await supabase.from('contratos_empresa').update({
      titulo: editingContrato.titulo,
      fornecedor: editingContrato.fornecedor,
      valor: parseFloat(editingContrato.valor || 0),
      status: editingContrato.status
    }).eq('id', editingContrato.id);
    setShowEditContratoModal(false);
    setEditingContrato(null);
    loadAllData();
  }

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER EXECUTIVO CORPORATIVO COM MULTIEMPRESA */}
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

            {/* SELETOR MULTIEMPRESA */}
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
          {/* SIDEBAR NAVEGAÇÃO */}
          <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4">
            <nav className="space-y-1.5">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Módulos do Sistema
              </div>

              <button
                onClick={() => setActiveModule('administracao')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeModule === 'administracao' ? 'bg-amber-500 text-slate-950 font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4" /> Administração & Governança
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

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
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Torquato ERP</p>
                <p className="text-[10px] text-slate-500">Módulo Administração</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
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

                {/* 1. SEÇÃO MULTIEMPRESA COM EDIÇÃO */}
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
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase border border-emerald-500/20">Ativa</span>
                          <button onClick={() => { setEditingEmpresa(emp); setShowEditEmpresaModal(true); }} className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg transition" title="Editar Empresa">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. SEÇÃO GESTÃO DE ACESSOS COM PERMISSÕES GRANULARES */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <Lock className="w-4 h-4 text-blue-400" /> Gestão de Acessos & Limites Hierárquicos
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Defina alçadas de aprovação e permissões por página (Visualizar vs Movimentar).</p>
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
                        <th className="p-3">Cargo / Nível</th>
                        <th className="p-3">Limite de Gastos</th>
                        <th className="p-3">Permissões por Módulo</th>
                        <th className="p-3 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {usuarios.length === 0 ? (
                        <tr><td colSpan={6} className="p-6 text-center text-slate-500">Nenhum usuário cadastrado.</td></tr>
                      ) : (
                        usuarios.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3 font-bold text-white">{u.nome}</td>
                            <td className="p-3 text-slate-400">{u.email}</td>
                            <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-bold">{u.cargo}</span></td>
                            <td className="p-3 font-bold text-emerald-400">R$ {Number(u.limite_aprovacao || 5000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="p-3 text-[11px] text-slate-300">
                              Fin: <span className="text-amber-400 font-bold">{u.permissoes?.financeiro || 'movimentar'}</span> | 
                              Eng: <span className="text-amber-400 font-bold">{u.permissoes?.engenharia || 'movimentar'}</span> | 
                              Comp: <span className="text-amber-400 font-bold">{u.permissoes?.compras || 'movimentar'}</span>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => { setEditingUser(u); setShowEditUserModal(true); }} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Editar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 3. SEÇÃO GESTÃO DE CONTRATOS */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-emerald-400" /> Gestão de Contratos & Modelos
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">Cadastre modelos de contratos e gerencie-os diretamente no sistema.</p>
                    </div>
                    <button onClick={() => setShowContratoModal(true)} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition">
                      + Cadastrar Contrato
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Título / Objeto</th>
                        <th className="p-3">Fornecedor / Parte</th>
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
                            <td className="p-3 text-center">
                              <button onClick={() => { setEditingContrato(c); setShowEditContratoModal(true); }} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded text-xs font-bold inline-flex items-center gap-1">
                                <Edit2 className="w-3 h-3" /> Editar
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

            {activeModule !== 'administracao' && (
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

        {/* MODAL EDITAR EMPRESA (Razão Social e CNPJ) */}
        {showEditEmpresaModal && editingEmpresa && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Empresa (Multiempresa)</h3><button onClick={() => setShowEditEmpresaModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateEmpresa} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Razão Social</label>
                  <input type="text" required value={editingEmpresa.nome} onChange={(e) => setEditingEmpresa({ ...editingEmpresa, nome: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">CNPJ</label>
                  <input type="text" required value={editingEmpresa.cnpj} onChange={(e) => setEditingEmpresa({ ...editingEmpresa, cnpj: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowEditEmpresaModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOVO USUÁRIO */}
        {showUserModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Novo Usuário & Limites</h3><button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveUser} className="space-y-3">
                <input type="text" required placeholder="Nome Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" required placeholder="E-mail de Acesso" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={userCargo} onChange={(e) => setUserCargo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Diretor">Diretor (Aprovação Ilimitada)</option>
                  <option value="Gerente de Obras">Gerente de Obras</option>
                  <option value="Engenheiro">Engenheiro</option>
                  <option value="Assistente Financeiro">Assistente Financeiro</option>
                </select>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Limite Máximo para Aprovação de Gastos (R$)</label>
                  <input type="number" step="100" required value={userLimite} onChange={(e) => setUserLimite(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Salvar Usuário</button></div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL EDITAR USUÁRIO & PERMISSÕES GRANULARES POR PÁGINA */}
        {showEditUserModal && editingUser && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-800 text-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Editar Usuário, Alçadas & Permissões por Página</h3><button onClick={() => setShowEditUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleUpdateUser} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome Completo</label>
                  <input type="text" required value={editingUser.nome} onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">E-mail</label>
                  <input type="email" required value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Cargo / Nível</label>
                    <select value={editingUser.cargo} onChange={(e) => setEditingUser({ ...editingUser, cargo: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                      <option value="Diretor">Diretor</option>
                      <option value="Gerente de Obras">Gerente de Obras</option>
                      <option value="Engenheiro">Engenheiro</option>
                      <option value="Assistente Financeiro">Assistente Financeiro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Limite Gastos (R$)</label>
                    <input type="number" step="100" required value={editingUser.limite_aprovacao} onChange={(e) => setEditingUser({ ...editingUser, limite_aprovacao: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-amber-400 uppercase">Controle de Acesso Granular (Visualizar vs Movimentar)</p>
                  
                  <div className="grid grid-cols-2 gap-2 items-center text-xs">
                    <span className="text-slate-300">Financeiro:</span>
                    <select value={editingUser.permissoes?.financeiro || 'movimentar'} onChange={(e) => setEditingUser({ ...editingUser, permissoes: { ...editingUser.permissoes, financeiro: e.target.value } })} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                      <option value="movimentar">Movimentar & Cadastrar</option>
                      <option value="visualizar">Somente Visualizar</option>
                      <option value="bloqueado">Sem Acesso</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center text-xs">
                    <span className="text-slate-300">Engenharia & RDO:</span>
                    <select value={editingUser.permissoes?.engenharia || 'movimentar'} onChange={(e) => setEditingUser({ ...editingUser, permissoes: { ...editingUser.permissoes, engenharia: e.target.value } })} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                      <option value="movimentar">Movimentar & Cadastrar</option>
                      <option value="visualizar">Somente Visualizar</option>
                      <option value="bloqueado">Sem Acesso</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2 items-center text-xs">
                    <span className="text-slate-300">Compras & Suprimentos:</span>
                    <select value={editingUser.permissoes?.compras || 'movimentar'} onChange={(e) => setEditingUser({ ...editingUser, permissoes: { ...editingUser.permissoes, compras: e.target.value } })} className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                      <option value="movimentar">Movimentar & Cadastrar</option>
                      <option value="visualizar">Somente Visualizar</option>
                      <option value="bloqueado">Sem Acesso</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowEditUserModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">Salvar Alterações</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL CADASTRAR CONTRATO */}
        {showContratoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center"><h3 className="font-bold text-white">Cadastrar Modelo de Contrato</h3><button onClick={() => setShowContratoModal(false)}><X className="w-5 h-5 text-slate-400" /></button></div>
              <form onSubmit={handleSaveContrato} className="space-y-3">
                <input type="text" required placeholder="Título / Objeto do Contrato" value={contTitulo} onChange={(e) => setContTitulo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Fornecedor / Contratada" value={contFornecedor} onChange={(e) => setContFornecedor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="number" step="0.01" required placeholder="Valor Global (R$)" value={contValor} onChange={(e) => setContValor(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                <select value={contStatus} onChange={(e) => setContStatus(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Ativo">Status: Ativo</option>
                  <option value="Minuta">Status: Em Minuta</option>
                  <option value="Encerrado">Status: Encerrado</option>
                </select>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800"><button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Salvar Contrato</button></div>
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
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Título / Objeto</label>
                  <input type="text" required value={editingContrato.titulo} onChange={(e) => setEditingContrato({ ...editingContrato, titulo: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Fornecedor / Parte</label>
                  <input type="text" value={editingContrato.fornecedor || ''} onChange={(e) => setEditingContrato({ ...editingContrato, fornecedor: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Valor Global (R$)</label>
                  <input type="number" step="0.01" required value={editingContrato.valor} onChange={(e) => setEditingContrato({ ...editingContrato, valor: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Status</label>
                  <select value={editingContrato.status} onChange={(e) => setEditingContrato({ ...editingContrato, status: e.target.value })} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="Ativo">Ativo</option>
                    <option value="Minuta">Em Minuta</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowEditContratoModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
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
