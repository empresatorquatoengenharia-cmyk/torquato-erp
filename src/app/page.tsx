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
  Sliders,
  X,
  CheckCircle2,
  Lock
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoAdminERP() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [rdos, setRdos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showFinPagarModal, setShowFinPagarModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Forms Financeiro
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');

  // Forms Usuários (Admin)
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
    if (reqData) setRequests(reqData);

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

    const { data: userData } = await supabase.from('usuarios_erp').select('*').order('created_at', { ascending: false });
    if (userData) setUsuarios(userData);

    setLoading(false);
  }

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

  async function handleSaveUser(e: React.FormEvent) {
    e.preventDefault();
    if (!userName || !userEmail) return;
    const { error } = await supabase.from('usuarios_erp').insert([{
      nome: userName, email: userEmail, cargo: userCargo, status: 'ativo'
    }]);
    if (!error) {
      setShowUserModal(false);
      setUserName(''); setUserEmail('');
      loadAllData();
    } else {
      alert('Erro ao cadastrar usuário: ' + error.message);
    }
  }

  const totalPagar = financialsPagar.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalReceber = financialsReceber.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER EXECUTIVO KOPER */}
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
              <span className="text-slate-400">Obra Selecionada:</span>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
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
                placeholder="Busca rápida..."
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
          {/* SIDEBAR NAVEGAÇÃO */}
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
            </nav>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-200">Torquato ERP</p>
                <p className="text-[10px] text-slate-500">Gestão 2026</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {/* DASHBOARD */}
            {activeModule === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Executivo</h1>
                    <p className="text-xs text-slate-400 mt-1">Visão geral das operações da Torquato Engenharia Ltda</p>
                  </div>
                  <button onClick={() => setShowFinPagarModal(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Novo Lançamento
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Obras em Andamento</span>
                    <p className="text-3xl font-black text-white mt-3">{projects.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Receber</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">R$ {totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Contas a Pagar</span>
                    <p className="text-3xl font-black text-rose-400 mt-3">R$ {totalPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Usuários Ativos</span>
                    <p className="text-3xl font-black text-amber-500 mt-3">{usuarios.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO ADMINISTRAÇÃO (IGUAL KOPER) */}
            {activeModule === 'administracao' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-6 h-6 text-amber-500" /> Módulo Administrativo & Governança
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Gestão de empresas, parametrização do sistema e controle de acessos de usuários</p>
                  </div>
                  <button 
                    onClick={() => setShowUserModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" /> Convidar Usuário / Perfil
                  </button>
                </div>

                {/* Cards Informativos de Governança */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Torquato Engenharia Ltda</h3>
                        <p className="text-[11px] text-slate-400">CNPJ Matriz & Filiais • Ativo</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Licença Corporativa A1 vinculada ao Supabase e hospedagem Vercel.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Sliders className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Parâmetros de Obras</h3>
                        <p className="text-[11px] text-slate-400">EAPs e Rateio Automático</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Configuração ativa para centros de custo e controle de insumos.
                    </p>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-white">Segurança & Níveis</h3>
                        <p className="text-[11px] text-slate-400">Controle por Permissões</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                      Acessos restritos por setor (Engenharia, Compras, Financeiro, Admin).
                    </p>
                  </div>
                </div>

                {/* Tabela de Gestão de Usuários */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-500" /> Usuários & Colaboradores Vinculados
                    </h3>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3.5">Nome do Colaborador</th>
                        <th className="p-3.5">E-mail de Acesso</th>
                        <th className="p-3.5">Cargo / Perfil Koper</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {usuarios.length === 0 ? (
                        <tr><td colSpan={4} className="p-6 text-center text-slate-500">Nenhum usuário cadastrado.</td></tr>
                      ) : (
                        usuarios.map((u: any) => (
                          <tr key={u.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3.5 font-bold text-white">{u.nome}</td>
                            <td className="p-3.5 text-slate-400">{u.email}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 font-bold uppercase text-[10px]">
                                {u.cargo}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 font-bold uppercase text-[10px]">
                                {u.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Outros módulos */}
            {activeModule !== 'dashboard' && activeModule !== 'administracao' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white capitalize">{activeModule}</h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <p className="text-xs text-slate-400">Módulo {activeModule} operacional integrado ao Supabase.</p>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL NOVO USUÁRIO ADMIN */}
        {showUserModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Cadastrar Novo Usuário</h3>
                <button onClick={() => setShowUserModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveUser} className="space-y-3">
                <input type="text" required placeholder="Nome Completo" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="email" required placeholder="E-mail Corporativo" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select value={userCargo} onChange={(e) => setUserCargo(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="Administrador">Administrador</option>
                  <option value="Engenheiro">Engenheiro / Residente</option>
                  <option value="Financeiro">Setor Financeiro</option>
                  <option value="Compras">Setor de Compras</option>
                </select>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Usuário</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
