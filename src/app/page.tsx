'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  HardHat, 
  Users, 
  Boxes, 
  ShieldCheck, 
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

// Inicialização do cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState('compras');
  const [userRole, setUserRole] = useState('admin');

  // Estados de dados do Supabase
  const [projects, setProjects] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados do Formulário de Nova Solicitação (Estilo Koper ERP)
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [urgency, setUrgency] = useState('media');
  const [observation, setObservation] = useState('');
  const [items, setItems] = useState([{ item_name: '', quantity: 1, unit: 'un' }]);

  // Buscar Obras e Solicitações ao carregar
  useEffect(() => {
    fetchProjects();
    fetchRequests();
  }, []);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*');
    if (data) setProjects(data);
  }

  async function fetchRequests() {
    setLoading(true);
    const { data } = await supabase
      .from('purchase_requests')
      .select('*, projects(name), purchase_request_items(*)')
      .order('created_at', { ascending: false });
    if (data) setRequests(data);
    setLoading(false);
  }

  // Manipulação de múltiplos itens da compra
  const handleAddItem = () => {
    setItems([...items, { item_name: '', quantity: 1, unit: 'un' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Salvar Solicitação estilo Koper no Supabase
  async function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !projectId) {
      alert('Por favor, preencha o título e selecione a Obra!');
      return;
    }

    setLoading(true);

    // 1. Inserir cabeçalho da solicitação
    const { data: requestData, error: requestError } = await supabase
      .from('purchase_requests')
      .insert([
        {
          title,
          project_id: projectId,
          urgency,
          observation,
          status: 'pendente'
        }
      ])
      .select();

    if (requestError || !requestData) {
      alert('Erro ao salvar solicitação no Supabase: ' + requestError?.message);
      setLoading(false);
      return;
    }

    const requestId = requestData[0].id;

    // 2. Inserir os insumos/itens vinculados à solicitação
    const formattedItems = items
      .filter(i => i.item_name.trim() !== '')
      .map(i => ({
        request_id: requestId,
        item_name: i.item_name,
        quantity: i.quantity,
        unit: i.unit
      }));

    if (formattedItems.length > 0) {
      await supabase.from('purchase_request_items').insert(formattedItems);
    }

    // Limpar formulário e atualizar lista
    setTitle('');
    setObservation('');
    setItems([{ item_name: '', quantity: 1, unit: 'un' }]);
    setShowModal(false);
    fetchRequests();
    setLoading(false);
  }

  const modules = [
    { id: 'admin', name: 'Painel Administrativo', icon: ShieldCheck, roles: ['admin'] },
    { id: 'compras', name: 'Setor de Compras', icon: ShoppingCart, roles: ['admin', 'compras'] },
    { id: 'financeiro', name: 'Setor Financeiro', icon: DollarSign, roles: ['admin', 'financeiro'] },
    { id: 'engenharia', name: 'Setor de Engenharia', icon: HardHat, roles: ['admin', 'engenharia'] },
    { id: 'rh', name: 'Recursos Humanos', icon: Users, roles: ['admin', 'rh'] },
    { id: 'almoxarifado', name: 'Almoxarifado & Estoque', icon: Boxes, roles: ['admin', 'almoxarifado', 'engenharia'] },
  ];

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shadow-xl">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 border-b border-slate-800">
            <Building2 className="w-8 h-8 text-amber-500" />
            <div>
              <h1 className="font-bold text-lg leading-tight">Torquato ERP</h1>
              <p className="text-xs text-slate-400">Engenharia & Gestão</p>
            </div>
          </div>

          <div className="mt-6 mb-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Selecione o Perfil:
          </div>
          <select 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full bg-slate-800 text-xs text-slate-200 p-2 rounded border border-slate-700 mb-6 focus:outline-none"
          >
            <option value="admin">Administrador (Acesso Total)</option>
            <option value="compras">Setor Compras</option>
            <option value="financeiro">Setor Financeiro</option>
            <option value="engenharia">Engenharia / Obras</option>
          </select>

          <nav className="space-y-1">
            {modules
              .filter(m => m.roles.includes(userRole))
              .map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                      activeModule === m.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {m.name}
                  </button>
                );
              })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Perfil: <strong className="text-white uppercase">{userRole}</strong></span>
          <LogOut className="w-4 h-4 cursor-pointer hover:text-red-400 transition" />
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {modules.find(m => m.id === activeModule)?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Torquato Engenharia Ltda — Gestão de Suprimentos & Obras</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600">Supabase Conectado</span>
          </div>
        </header>

        {/* MÓDULO DE COMPRAS (PADRÃO KOPER ERP) */}
        {activeModule === 'compras' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Solicitações de Compra</h3>
                <p className="text-xs text-slate-500">Controle e cotações de insumos para obras</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg hover:bg-amber-400 transition shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" /> Nova Solicitação
              </button>
            </div>

            {/* Listagem de Solicitações do Supabase */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
                    <th className="p-4">Solicitação / Insumo</th>
                    <th className="p-4">Obra / Centro de Custo</th>
                    <th className="p-4">Urgência</th>
                    <th className="p-4">Itens</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {requests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        Nenhuma solicitação cadastrada ainda. Clique em "Nova Solicitação" para criar.
                      </td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-semibold text-slate-800">
                          {req.title}
                          {req.observation && <p className="text-xs text-slate-400 font-normal">{req.observation}</p>}
                        </td>
                        <td className="p-4 text-slate-600">{req.projects?.name || 'Obra Geral'}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.urgency === 'urgente' ? 'bg-rose-100 text-rose-700' :
                            req.urgency === 'alta' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {req.urgency?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-slate-600">
                          {req.purchase_request_items?.map((item: any, idx: number) => (
                            <div key={idx}>• {item.quantity} {item.unit} - {item.item_name}</div>
                          ))}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            <Clock className="w-3.5 h-3.5" /> {req.status?.toUpperCase()}
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

        {/* MODAL PADRÃO KOPER PARA NOVA SOLICITAÇÃO */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-800 mb-1">Nova Solicitação de Compra</h3>
              <p className="text-xs text-slate-500 mb-6">Padrão Koper ERP — Envio direto para cotação e aprovação</p>

              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Solicitação</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cimento e Areia para concretagem da laje"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Obra / Centro de Custo</label>
                    <select
                      required
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Selecione a Obra...</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prioridade / Urgência</label>
                    <select
                      value={urgency}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                      <option value="urgente">URGENTE (Parada de Obra)</option>
                    </select>
                  </div>
                </div>

                {/* LISTA DINÂMICA DE INSUMOS */}
                <div className="pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Insumos / Materiais Solicitados</label>
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2 items-center">
                      <input
                        type="text"
                        placeholder="Nome do Insumo (Ex: Cimento CP-II)"
                        value={item.item_name}
                        onChange={(e) => handleItemChange(index, 'item_name', e.target.value)}
                        className="flex-1 p-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Qtd"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                        className="w-20 p-2 border border-slate-300 rounded-lg text-sm"
                        required
                      />
                      <select
                        value={item.unit}
                        onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                        className="w-24 p-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="un">Unid.</option>
                        <option value="sc">Saco</option>
                        <option value="m3">m³</option>
                        <option value="kg">Kg</option>
                        <option value="m">Metros</option>
                        <option value="cx">Caixa</option>
                      </select>
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-rose-500 hover:text-rose-700 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 mt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar outro item
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Observações Técnicas</label>
                  <textarea
                    rows={2}
                    placeholder="Instruções de entrega ou especificações do engenheiro..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2 bg-amber-500 text-slate-950 rounded-lg text-sm font-bold hover:bg-amber-400 transition shadow-sm"
                  >
                    {loading ? 'Salvando...' : 'Criar Solicitação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
