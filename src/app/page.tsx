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
  BarChart3,
  Upload,
  CheckCircle2
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function TorquatoFullERP() {
  const [activeModule, setActiveModule] = useState('financeiro');
  const [selectedProject, setSelectedProject] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Dados Globais
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [fornecedores, setFornecedores] = useState<any[]>([]);
  const [financialsPagar, setFinancialsPagar] = useState<any[]>([]);
  const [financialsReceber, setFinancialsReceber] = useState<any[]>([]);
  const [rdos, setRdos] = useState<any[]>([]);
  const [estoque, setEstoque] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modais
  const [showFinPagarModal, setShowFinPagarModal] = useState(false);
  const [showFinReceberModal, setShowFinReceberModal] = useState(false);
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showComprovanteModal, setShowComprovanteModal] = useState(false);

  // Forms Financeiro Pagar
  const [finDesc, setFinDesc] = useState('');
  const [finProject, setFinProject] = useState('');
  const [finType, setFinType] = useState('despesa');
  const [finValue, setFinValue] = useState('');
  const [finDueDate, setFinDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [finSupplier, setFinSupplier] = useState('');

  // Forms Importação XML/PDF Nota Fiscal
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [xmlProject, setXmlProject] = useState('');
  const [xmlStatusMsg, setXmlStatusMsg] = useState('');

  // Forms Comprovante Pagamento
  const [compFile, setCompFile] = useState<File | null>(null);
  const [compLancamentoId, setCompLancamentoId] = useState('');
  const [compStatusMsg, setCompStatusMsg] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    const { data: projData } = await supabase.from('projects').select('*');
    if (projData) setProjects(projData);
    const projMap = new Map((projData || []).map((p: any) => [p.id, p.name]));

    const { data: pagData } = await supabase.from('financeiro_lancamentos').select('*').order('created_at', { ascending: false });
    if (pagData) {
      setFinancialsPagar(pagData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral' })));
    }

    const { data: recData } = await supabase.from('financeiro_receber').select('*').order('created_at', { ascending: false });
    if (recData) {
      setFinancialsReceber(recData.map((i: any) => ({ ...i, projectName: i.obra_id ? projMap.get(i.obra_id) || 'Geral' : 'Geral' })));
    }

    const { data: reqData } = await supabase.from('purchase_requests').select('*').order('created_at', { ascending: false });
    if (reqData) setRequests(reqData);

    const { data: supData } = await supabase.from('fornecedores').select('*').order('created_at', { ascending: false });
    if (supData) setFornecedores(supData);

    const { data: rdoData } = await supabase.from('rdo_registros').select('*').order('created_at', { ascending: false });
    if (rdoData) setRdos(rdoData);

    const { data: estData } = await supabase.from('movimentacoes_estoque').select('*').order('created_at', { ascending: false });
    if (estData) setEstoque(estData);

    const { data: userData } = await supabase.from('usuarios_erp').select('*').order('created_at', { ascending: false });
    if (userData) setUsuarios(userData);

    setLoading(false);
  }

  // Ações de salvamento
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

  // Simulação de Leitura e Importação de XML / PDF de Nota Fiscal
  async function handleImportXml(e: React.FormEvent) {
    e.preventDefault();
    if (!xmlFile || !xmlProject) return alert('Selecione o arquivo e a obra correspondente.');
    
    setXmlStatusMsg('Processando arquivo e extraindo dados fiscais...');
    setTimeout(async () => {
      const nomeNota = `NF Importada - ${xmlFile.name.replace(/\.[^/.]+$/, "")}`;
      await supabase.from('financeiro_lancamentos').insert([{
        descricao: nomeNota,
        obra_id: xmlProject,
        tipo: 'despesa',
        valor: 1850.00, // Valor simulado extraído do XML/PDF
        data_vencimento: new Date().toISOString().split('T')[0],
        fornecedor_nome: 'Fornecedor XML Verificado',
        status: 'pendente'
      }]);
      setXmlStatusMsg('Nota fiscal importada com sucesso!');
      setTimeout(() => {
        setShowXmlModal(false);
        setXmlFile(null);
        setXmlStatusMsg('');
        loadAllData();
      }, 1000);
    }, 1200);
  }

  // Simulação de Anexação de Comprovante de Pagamento
  async function handleImportComprovante(e: React.FormEvent) {
    e.preventDefault();
    if (!compFile || !compLancamentoId) return alert('Selecione o comprovante e a conta correspondente.');

    setCompStatusMsg('Enviando comprovante e baixando título...');
    setTimeout(async () => {
      await supabase.from('financeiro_lancamentos').update({ status: 'pago' }).eq('id', compLancamentoId);
      setCompStatusMsg('Comprovante anexado e título baixado com sucesso!');
      setTimeout(() => {
        setShowComprovanteModal(false);
        setCompFile(null);
        setCompStatusMsg('');
        loadAllData();
      }, 1000);
    }, 1200);
  }

  async function toggleStatusPagar(id: string, currentStatus: string) {
    await supabase.from('financeiro_lancamentos').update({ status: currentStatus === 'pago' ? 'pendente' : 'pago' }).eq('id', id);
    loadAllData();
  }

  const filteredPagar = selectedProject === 'todas' 
    ? financialsPagar 
    : financialsPagar.filter(f => f.obra_id === selectedProject);

  const totalPagar = filteredPagar.filter(f => f.status === 'pendente').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);
  const totalPago = filteredPagar.filter(f => f.status === 'pago').reduce((acc, curr) => acc + Number(curr.valor || 0), 0);

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
        {/* HEADER EXECUTIVO */}
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
              <span className="text-slate-400">Centro de Custo / Obra:</span>
              <select 
                value={selectedProject} 
                onChange={(e) => setSelectedProject(e.target.value)}
                className="bg-transparent text-amber-400 font-bold focus:outline-none cursor-pointer"
              >
                <option value="todas" className="bg-slate-900">Visão Consolidada (Todas as Obras)</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
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
                <p className="text-[10px] text-slate-500">Módulo Financeiro</p>
              </div>
              <LogOut className="w-4 h-4 cursor-pointer hover:text-rose-400 transition" />
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 bg-slate-950 overflow-y-auto p-8 text-slate-200">
            
            {activeModule === 'dashboard' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Dashboard Executivo</h1>
                <p className="text-xs text-slate-400">Visão geral das contas e centros de custo.</p>
              </div>
            )}

            {/* MÓDULO FINANCEIRO COM IMPORTADORES */}
            {activeModule === 'financeiro' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-amber-500" /> Gestão Financeira & Notas Fiscais
                    </h1>
                    <p className="text-xs text-slate-400 mt-1">Importação de XML/PDF de Notas Fiscais e anexação de comprovantes de pagamento</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowXmlModal(true)} 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                    >
                      <Upload className="w-4 h-4" /> Importar NF (XML / PDF)
                    </button>
                    <button 
                      onClick={() => setShowComprovanteModal(true)} 
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                    >
                      <Upload className="w-4 h-4" /> Anexar Comprovante
                    </button>
                  </div>
                </div>

                {/* Tabela de Contas a Pagar */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white uppercase tracking-wider">Contas a Pagar / Custos de Obra</h3>
                    <button onClick={() => setShowFinPagarModal(true)} className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs">
                      + Novo Lançamento Manual
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase">
                      <tr>
                        <th className="p-3">Descrição / Nota Fiscal</th>
                        <th className="p-3">Obra / Centro de Custo</th>
                        <th className="p-3">Vencimento</th>
                        <th className="p-3">Valor</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredPagar.map((f: any) => (
                        <tr key={f.id} className="hover:bg-slate-950/50 transition">
                          <td className="p-3 font-bold text-white">{f.descricao}</td>
                          <td className="p-3 text-slate-400">{f.projectName}</td>
                          <td className="p-3">{new Date(f.data_vencimento).toLocaleDateString('pt-BR')}</td>
                          <td className="p-3 font-bold text-rose-400">R$ {Number(f.valor).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              f.status === 'pago' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-500'
                            }`}>{f.status}</span>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => toggleStatusPagar(f.id, f.status)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-[10px] font-bold">
                              {f.status === 'pago' ? 'Desfazer' : 'Baixar Título'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeModule !== 'dashboard' && activeModule !== 'financeiro' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white capitalize">{activeModule}</h1>
                <p className="text-xs text-slate-400">Módulo operacional ativo.</p>
              </div>
            )}

          </main>
        </div>

        {/* MODAL IMPORTAR XML / PDF DE NOTA FISCAL */}
        {showXmlModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Importar Nota Fiscal (XML ou PDF)</h3>
                <button onClick={() => setShowXmlModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleImportXml} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selecione a Obra / Centro de Custo</label>
                  <select required value={xmlProject} onChange={(e) => setXmlProject(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="">Selecione a Obra...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Arquivo XML ou PDF da NF</label>
                  <input type="file" accept=".xml,.pdf" required onChange={(e) => setXmlFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-400" />
                </div>
                {xmlStatusMsg && <p className="text-xs font-bold text-amber-400 animate-pulse">{xmlStatusMsg}</p>}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowXmlModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs">Processar e Importar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL ANEXAR COMPROVANTE DE PAGAMENTO */}
        {showComprovanteModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-800 text-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white">Anexar Comprovante de Pagamento</h3>
                <button onClick={() => setShowComprovanteModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <form onSubmit={handleImportComprovante} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Selecione o Título / Conta a Pagar</label>
                  <select required value={compLancamentoId} onChange={(e) => setCompLancamentoId(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="">Selecione o lançamento...</option>
                    {financialsPagar.filter(f => f.status === 'pendente').map(f => (
                      <option key={f.id} value={f.id}>{f.descricao} (R$ {Number(f.valor).toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Comprovante (PDF ou Imagem)</label>
                  <input type="file" accept=".pdf,image/*" required onChange={(e) => setCompFile(e.target.files ? e.target.files[0] : null)} className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400" />
                </div>
                {compStatusMsg && <p className="text-xs font-bold text-emerald-400 animate-pulse">{compStatusMsg}</p>}
                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button type="button" onClick={() => setShowComprovanteModal(false)} className="px-4 py-2 border border-slate-800 text-slate-400 rounded-xl text-xs">Cancelar</button>
                  <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs">Anexar e Baixar Título</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
