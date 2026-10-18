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
  CheckCircle2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoComprasERP() {
  const [activeModule, setActiveModule] = useState('compras');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [ordensCompra, setOrdensCompra] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Forms Solicitação de Compra
  const [reqTitle, setReqTitle] = useState('');
  const [reqProject, setReqProject] = useState('');
  const [reqUrgency, setReqUrgency] = useState('media');
  const [reqObs, setReqObs] = useState('');

  // Forms Fornecedor
  const [supName, setSupName] = useState('');
  const [supCnpj, setSupCnpj] = useState('');
  const [supPhone, setSupPhone] = useState('');

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

    const { data: ocData } = await supabase.from('ordens_compra').select('*').order('created_at', { ascending: false });
    if (ocData) {
      const supMap = new Map((supData || []).map((s: any) => [s.id, s.razao_social]));
      setOrdensCompra(ocData.map((i: any) => ({
        ...i,
        projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral',
        fornecedorName: i.fornecedor_id ? supMap.get(i.fornecedor_id) || 'Fornecedor' : 'Fornecedor'
      })));
    }

    const { data: userData } = await supabase.from('usuarios_erp').select('*');
    if (userData) setUsuarios(userData);

    setLoading(false);
  }

  async function handleSaveRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!reqTitle || !reqProject) return;
    const { error } = await supabase.from('purchase_requests').insert([{
      title: reqTitle, project_id: reqProject, urgency: reqUrgency, observation: reqObs, status: 'pendente'
    }]);
    if (!error) {
      setShowRequestModal(false);
      setReqTitle(''); setReqObs('');
      loadAllData();
    } else {
      alert('Erro ao salvar solicitação: ' + error.message);
    }
  }

  async function handleSaveSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!supName) return;
    const { error } = await supabase.from('fornecedores').insert([{
      razao_social: supName, cnpj: supCnpj, telefone: supPhone
    }]);
    if (!error) {
      setShowSupplierModal(false);
      setSupName(''); setSupCnpj(''); setSupPhone('');
      loadAllData();
    } else {
      alert('Erro ao salvar fornecedor: ' + error.message);
    }
  }

  async function approveRequest(id: string) {
    await supabase.from('purchase_requests').update({ status: 'aprovado' }).eq('id', id);
    loadAllData();
  }

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
                placeholder="Buscar solicitação ou fornecedor..."
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
                <p className="text-[10px] text-slate-500">Módulo Compras</p>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Solicitações de Compra</span>
                    <p className="text-3xl font-black text-white mt-3">{requests.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Parceiros / Fornecedores</span>
                    <p className="text-3xl font-black text-amber-500 mt-3">{fornecedores.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Ordens de Compra</span>
                    <p className="text-3xl font-black text-blue-400 mt-3">{ordensCompra.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Obras Ativas</span>
                    <p className="text-3xl font-black text-emerald-400 mt-3">{projects.length}</p>
                  </div>
                </div>
              </div>
            )}

            {/* MÓDULO COMPRAS & SUPRIMENTOS (IGUAL KOPER) */}
            {activeModule === 'compras' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <ShoppingCart className="w-6 h-6 text-amber-500" /> Gestão de Suprimentos & Compras
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Aprovação de solicitações de campo, cotação com parceiros e emissão de ordens de compra</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowSupplierModal(true)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition border border-slate-700"
                    >
                      <Plus className="w-4 h-4" /> Novo Fornecedor
                    </button>
                    <button 
                      onClick={() => setShowRequestModal(true)}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/10"
                    >
                      <Plus className="w-4 h-4" /> Solicitar Material
                    </button>
                  </div>
                </div>

                {/* 1. SEÇÃO DE SOLICITAÇÕES DE COMPRA */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-500" /> Solicitações de Materiais Pendentes / Cotações
                    </h3>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3.5">Título / Insumo</th>
                        <th className="p-3.5">Obra / Centro de Custo</th>
                        <th className="p-3.5">Urgência</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {requests.length === 0 ? (
                        <tr><td colSpan={5} className="p-6 text-center text-slate-500">Nenhuma solicitação de compra cadastrada.</td></tr>
                      ) : (
                        requests.map((req: any) => (
                          <tr key={req.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3.5 font-bold text-white">{req.title}</td>
                            <td className="p-3.5 text-slate-400">{req.projectName}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20 font-bold uppercase text-[10px]">
                                {req.urgency}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-lg border font-bold uppercase text-[10px] ${
                                req.status === 'aprovado' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {req.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              {req.status !== 'aprovado' && (
                                <button
                                  onClick={() => approveRequest(req.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px] transition"
                                >
                                  Aprovar / Cotar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 2. SEÇÃO DE FORNECEDORES (PARCEIROS) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-400" /> Cadastro de Parceiros & Fornecedores
                    </h3>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3.5">Razão Social</th>
                        <th className="p-3.5">CNPJ</th>
                        <th className="p-3.5">Telefone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {fornecedores.length === 0 ? (
                        <tr><td colSpan={3} className="p-6 text-center text-slate-500">Nenhum fornecedor cadastrado.</td></tr>
                      ) : (
                        fornecedores.map((sup: any) => (
                          <tr key={sup.id} className="hover:bg-slate-950/50 transition">
                            <td className="p-3.5 font-bold text-white">{sup.razao_social}</td>
                            <td className="p-3.5 text-slate-400">{sup.cnpj || 'Não informado'}</td>
                            <td className="p-3.5 text-slate-300">{sup.telefone || 'Não informado'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Outros módulos */}
            {activeModule !== 'dashboard' && activeModule !== 'compras' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white capitalize">{activeModule}</h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                  <p className="text-xs text-slate-400">Módulo {activeModule} operacional integrado ao Supabase.</p>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* MODAL SOLICITAÇÃO DE COMPRA */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Nova Solicitação de Materiais</h3>
                <button onClick={() => setShowRequestModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveRequest} className="space-y-3">
                <input type="text" required placeholder="Ex: 50 sacos de Cimento CP-II" value={reqTitle} onChange={(e) => setReqTitle(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <select required value={reqProject} onChange={(e) => setReqProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="">Selecione a Obra...</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <select value={reqUrgency} onChange={(e) => setReqUrgency(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="baixa">Urgência: Baixa</option>
                  <option value="media">Urgência: Média</option>
                  <option value="alta">Urgência: Alta (Crítica)</option>
                </select>
                <textarea rows={3} placeholder="Observações adicionais para a compra..." value={reqObs} onChange={(e) => setReqObs(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"></textarea>
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Enviar Solicitação</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL NOVO FORNECEDOR */}
        {showSupplierModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Cadastrar Novo Fornecedor (Parceiro)</h3>
                <button onClick={() => setShowSupplierModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleSaveSupplier} className="space-y-3">
                <input type="text" required placeholder="Razão Social" value={supName} onChange={(e) => setSupName(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="CNPJ" value={supCnpj} onChange={(e) => setSupCnpj(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <input type="text" placeholder="Telefone / Contato" value={supPhone} onChange={(e) => setSupPhone(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowSupplierModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Salvar Fornecedor</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
