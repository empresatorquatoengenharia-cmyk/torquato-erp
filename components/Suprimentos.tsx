'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Boxes, Plus, Trash2, Search, ChevronRight } from 'lucide-react';
import { useTable, inserir, atualizar, excluir } from '@/lib/data';
import { brl, formatarData, hoje } from '@/lib/utils';
import { Card, Modal, Field, PageHeader, Tabs, ErrorBox, Loading, Empty, inputCls } from './ui';

type FieldType = 'text' | 'number' | 'date' | 'select' | 'textarea' | 'produto' | 'local';

type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  default?: string;
};

type TabDef = {
  id: string;
  label: string;
  tabela: string;
  titulo: string;
  botao: string;
  fields: FieldDef[];
  columns: string[];
  money?: string[];
  statusFlow?: string[];
  busca?: boolean;
};

const UNIDADES = ['un', 'm', 'm²', 'm³', 'kg', 'saco', 'barra', 'lata', 'l', 'cx', 'h', 'dia'];

const TABS: TabDef[] = [
  {
    id: 'produtos',
    label: 'Produtos',
    tabela: 'suprimentos_produtos',
    titulo: 'Produtos cadastrados',
    botao: 'Produto',
    busca: true,
    columns: ['codigo', 'nome', 'unidade', 'marca', 'tipo', 'categoria', 'valor_estimado'],
    money: ['valor_estimado'],
    fields: [
      { key: 'nome', label: 'Nome do produto', required: true },
      { key: 'especificacao', label: 'Especificação' },
      { key: 'apelido', label: 'Apelido' },
      { key: 'tipo', label: 'Tipo', type: 'select', options: ['Material', 'Serviço', 'Equipamento', 'EPI'], default: 'Material' },
      { key: 'unidade', label: 'Unidade', type: 'select', options: UNIDADES, default: 'un' },
      { key: 'marca', label: 'Marca' },
      { key: 'categoria', label: 'Categoria', default: 'Instalações hidráulicas' },
      { key: 'subcategoria', label: 'Subcategoria', default: 'Tubos e Conexões para esgoto' },
      { key: 'valor_estimado', label: 'Valor estimado (R$)', type: 'number' },
      { key: 'observacoes', label: 'Observações', type: 'textarea' },
    ],
  },
  {
    id: 'locais',
    label: 'Locais de estoque',
    tabela: 'suprimentos_locais',
    titulo: 'Locais de estoque',
    botao: 'Local',
    columns: ['nome', 'cidade'],
    fields: [
      { key: 'nome', label: 'Nome do local', required: true },
      { key: 'cidade', label: 'Cidade' },
    ],
  },
  {
    id: 'entradas',
    label: 'Entradas',
    tabela: 'suprimentos_entradas',
    titulo: 'Entradas de materiais',
    botao: 'Entrada',
    columns: ['data_entrada', 'produto', 'quantidade', 'local', 'fornecedor', 'nota_fiscal', 'valor_total'],
    money: ['valor_total'],
    fields: [
      { key: 'produto', label: 'Produto', type: 'produto', required: true },
      { key: 'quantidade', label: 'Quantidade', type: 'number', required: true },
      { key: 'local', label: 'Local de estoque', type: 'local', required: true },
      { key: 'data_entrada', label: 'Data da entrada', type: 'date', default: hoje() },
      { key: 'fornecedor', label: 'Fornecedor' },
      { key: 'nota_fiscal', label: 'Nº da nota fiscal' },
      { key: 'valor_total', label: 'Valor total (R$)', type: 'number' },
    ],
  },
  {
    id: 'equipamentos',
    label: 'Equipamentos',
    tabela: 'suprimentos_equipamentos',
    titulo: 'Equipamentos',
    botao: 'Equipamento',
    columns: ['nome', 'especificacao', 'ano_fabricacao', 'ano_modelo', 'data_aquisicao', 'local_alocado'],
    fields: [
      { key: 'nome', label: 'Nome do equipamento', required: true },
      { key: 'produto_associado', label: 'Produto associado', type: 'produto' },
      { key: 'especificacao', label: 'Especificação' },
      { key: 'ano_fabricacao', label: 'Ano de fabricação', default: '2024' },
      { key: 'ano_modelo', label: 'Ano do modelo', default: '2024' },
      { key: 'data_aquisicao', label: 'Data de aquisição', type: 'date' },
      { key: 'local_alocado', label: 'Local alocado', type: 'local' },
    ],
  },
  {
    id: 'consumo',
    label: 'Consumo',
    tabela: 'suprimentos_consumos',
    titulo: 'Consumo de materiais',
    botao: 'Consumo',
    columns: ['data_consumo', 'produto', 'quantidade', 'local', 'responsavel', 'observacoes'],
    fields: [
      { key: 'produto', label: 'Produto', type: 'produto', required: true },
      { key: 'quantidade', label: 'Quantidade', type: 'number', required: true },
      { key: 'local', label: 'Local de estoque', type: 'local', required: true },
      { key: 'data_consumo', label: 'Data do consumo', type: 'date', default: hoje() },
      { key: 'responsavel', label: 'Responsável' },
      { key: 'observacoes', label: 'Observações', type: 'textarea' },
    ],
  },
  {
    id: 'epis',
    label: 'EPIs',
    tabela: 'suprimentos_epis',
    titulo: 'Entrega de EPIs',
    botao: 'EPI',
    columns: ['colaborador', 'epi', 'ca', 'data_entrega', 'validade'],
    fields: [
      { key: 'colaborador', label: 'Colaborador', required: true },
      { key: 'epi', label: 'EPI', required: true },
      { key: 'ca', label: 'Nº do CA' },
      { key: 'data_entrega', label: 'Data de entrega', type: 'date', default: hoje() },
      { key: 'validade', label: 'Validade', type: 'date' },
    ],
  },
  {
    id: 'balancos',
    label: 'Balanços',
    tabela: 'suprimentos_balancos',
    titulo: 'Balanços de estoque',
    botao: 'Balanço',
    statusFlow: ['Aberto', 'Em conferência', 'Finalizado'],
    columns: ['data_balanco', 'local', 'responsavel', 'status', 'observacoes'],
    fields: [
      { key: 'local', label: 'Local de estoque', type: 'local', required: true },
      { key: 'data_balanco', label: 'Data', type: 'date', default: hoje() },
      { key: 'responsavel', label: 'Responsável' },
      { key: 'status', label: 'Status', type: 'select', options: ['Aberto', 'Em conferência', 'Finalizado'], default: 'Aberto' },
      { key: 'observacoes', label: 'Observações', type: 'textarea' },
    ],
  },
  {
    id: 'solicitacoes',
    label: 'Solicitações / Compras',
    tabela: 'suprimentos_solicitacoes',
    titulo: 'Solicitações de compra',
    botao: 'Solicitação',
    statusFlow: ['Pendente', 'Aprovada', 'Comprada', 'Entregue'],
    columns: ['descricao', 'produto', 'quantidade', 'solicitante', 'prioridade', 'status'],
    fields: [
      { key: 'descricao', label: 'Descrição', required: true },
      { key: 'produto', label: 'Produto', type: 'produto' },
      { key: 'quantidade', label: 'Quantidade', type: 'number' },
      { key: 'solicitante', label: 'Solicitante' },
      { key: 'prioridade', label: 'Prioridade', type: 'select', options: ['Baixa', 'Média', 'Alta', 'Urgente'], default: 'Média' },
      { key: 'status', label: 'Status', type: 'select', options: ['Pendente', 'Aprovada', 'Comprada', 'Entregue'], default: 'Pendente' },
    ],
  },
];

const ROTULOS: Record<string, string> = {
  codigo: 'Código',
  data_entrada: 'Data',
  data_consumo: 'Data',
  data_balanco: 'Data',
  data_entrega: 'Entrega',
  data_aquisicao: 'Aquisição',
  nota_fiscal: 'NF',
  valor_total: 'Valor total',
  valor_estimado: 'Valor estimado',
  local_alocado: 'Local alocado',
  ano_fabricacao: 'Ano fab.',
  ano_modelo: 'Ano mod.',
  ca: 'CA',
  epi: 'EPI',
  observacoes: 'Observações',
};

function rotulo(def: TabDef, key: string) {
  return ROTULOS[key] || def.fields.find((f) => f.key === key)?.label || key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
}

/* ---------------------------------------------------------------- */
function CrudTab({
  def,
  empresa,
  produtos,
  locais,
}: {
  def: TabDef;
  empresa: string;
  produtos: string[];
  locais: string[];
}) {
  const { rows, loading, error, reload } = useTable(def.tabela, empresa);
  const [aberto, setAberto] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const filtradas = useMemo(() => {
    if (!busca.trim()) return rows;
    const q = busca.toLowerCase();
    return rows.filter((r: any) => String(r.nome || '').toLowerCase().includes(q));
  }, [rows, busca]);

  function abrir() {
    const inicial: Record<string, string> = {};
    def.fields.forEach((f) => (inicial[f.key] = f.default ?? ''));
    setForm(inicial);
    setErro('');
    setAberto(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const obj: Record<string, any> = { empresa };
    def.fields.forEach((f) => {
      const v = form[f.key];
      if (f.type === 'number') obj[f.key] = v === '' || v == null ? null : parseFloat(v);
      else obj[f.key] = v === '' || v == null ? null : v;
    });
    if (def.id === 'produtos') {
      obj.apelido = obj.apelido || '-';
      obj.status = 'Ativo';
    }
    const msg = await inserir(def.tabela, obj);
    if (msg) return setErro(msg);
    setAberto(false);
    reload();
  }

  async function apagar(r: any) {
    if (!confirm('Excluir este registro?')) return;
    const msg = await excluir(def.tabela, r.id);
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  async function avancar(r: any) {
    if (!def.statusFlow) return;
    const i = def.statusFlow.indexOf(r.status);
    const prox = def.statusFlow[Math.min(i + 1, def.statusFlow.length - 1)];
    if (prox === r.status) return;
    const msg = await atualizar(def.tabela, r.id, { status: prox });
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  function celula(r: any, key: string) {
    const v = r[key];
    if (def.money?.includes(key)) return brl(v);
    const tipo = def.fields.find((f) => f.key === key)?.type;
    if (tipo === 'date' || key.startsWith('data_') || key === 'validade') return formatarData(v);
    return v === null || v === undefined || v === '' ? '-' : String(v);
  }

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Boxes className="w-4 h-4 text-amber-500" /> {def.titulo}
        </h3>
        <div className="flex items-center gap-2">
          {def.busca && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                placeholder="Buscar produto..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white w-64"
              />
            </div>
          )}
          <button
            onClick={abrir}
            className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> {def.botao}
          </button>
        </div>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : filtradas.length === 0 ? (
        <Empty text="Nenhum registro ainda." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                {def.columns.map((c) => (
                  <th key={c} className="p-3">
                    {rotulo(def, c)}
                  </th>
                ))}
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtradas.map((r: any) => (
                <tr key={r.id} className="hover:bg-slate-950/50">
                  {def.columns.map((c, i) => (
                    <td key={c} className={`p-3 ${i === 0 ? 'font-bold text-amber-400' : c === 'nome' ? 'font-bold text-white' : 'text-slate-300'}`}>
                      {celula(r, c)}
                    </td>
                  ))}
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      {def.statusFlow && r.status !== def.statusFlow[def.statusFlow.length - 1] && (
                        <button
                          onClick={() => avancar(r)}
                          className="px-2 py-1 rounded text-xs font-bold bg-emerald-600 text-white flex items-center gap-1 cursor-pointer"
                        >
                          Avançar <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                      <button onClick={() => apagar(r)} aria-label="Excluir" className="cursor-pointer">
                        <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aberto && (
        <Modal title={`Novo registro: ${def.botao}`} onClose={() => setAberto(false)} wide>
          <form onSubmit={salvar} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {def.fields.map((f) => {
                const set = (v: string) => setForm((s) => ({ ...s, [f.key]: v }));
                const val = form[f.key] ?? '';
                const opcoes = f.type === 'produto' ? produtos : f.type === 'local' ? locais : f.options;
                return (
                  <div key={f.key} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <Field label={f.label + (f.required ? ' *' : '')}>
                      {f.type === 'textarea' ? (
                        <textarea rows={2} value={val} onChange={(e) => set(e.target.value)} className={inputCls} />
                      ) : f.type === 'select' || f.type === 'produto' || f.type === 'local' ? (
                        <select required={f.required} value={val} onChange={(e) => set(e.target.value)} className={inputCls}>
                          <option value="">{opcoes && opcoes.length ? 'Selecione...' : 'Cadastre primeiro em Produtos / Locais'}</option>
                          {(opcoes || []).map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required={f.required}
                          type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                          step={f.type === 'number' ? '0.01' : undefined}
                          min={f.type === 'number' ? '0' : undefined}
                          value={val}
                          onChange={(e) => set(e.target.value)}
                          className={inputCls}
                        />
                      )}
                    </Field>
                  </div>
                );
              })}
            </div>
            <ErrorBox message={erro} />
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
                Salvar
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Estoque calculado = entradas − consumos, por local e produto      */
/* ---------------------------------------------------------------- */
function Estoque({ empresa }: { empresa: string }) {
  const entradas = useTable('suprimentos_entradas', empresa);
  const consumos = useTable('suprimentos_consumos', empresa);
  const produtos = useTable('suprimentos_produtos', empresa);

  const linhas = useMemo(() => {
    const mapa: Record<string, { local: string; produto: string; entrou: number; saiu: number }> = {};
    const chave = (l: string, p: string) => `${l || '-'}||${p || '-'}`;
    entradas.rows.forEach((e: any) => {
      const k = chave(e.local, e.produto);
      mapa[k] ||= { local: e.local || '-', produto: e.produto || '-', entrou: 0, saiu: 0 };
      mapa[k].entrou += Number(e.quantidade || 0);
    });
    consumos.rows.forEach((c: any) => {
      const k = chave(c.local, c.produto);
      mapa[k] ||= { local: c.local || '-', produto: c.produto || '-', entrou: 0, saiu: 0 };
      mapa[k].saiu += Number(c.quantidade || 0);
    });
    return Object.values(mapa).sort((a, b) => a.local.localeCompare(b.local) || a.produto.localeCompare(b.produto));
  }, [entradas.rows, consumos.rows]);

  const unidade = (nome: string) => (produtos.rows.find((p: any) => p.nome === nome) as any)?.unidade || '';
  const carregando = entradas.loading || consumos.loading;

  return (
    <Card>
      <h3 className="font-bold text-sm text-white flex items-center gap-2">
        <Boxes className="w-4 h-4 text-amber-500" /> Controle de estoque por local
      </h3>
      <p className="text-xs text-slate-400">Saldo = soma das entradas − soma dos consumos, calculado automaticamente.</p>
      <ErrorBox message={entradas.error || consumos.error} />
      {carregando ? (
        <Loading />
      ) : linhas.length === 0 ? (
        <Empty text="Registre entradas e consumos para ver o estoque." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3">Local</th>
                <th className="p-3">Produto</th>
                <th className="p-3">Entradas</th>
                <th className="p-3">Consumo</th>
                <th className="p-3">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {linhas.map((l) => {
                const saldo = l.entrou - l.saiu;
                return (
                  <tr key={l.local + l.produto} className="hover:bg-slate-950/50">
                    <td className="p-3 text-slate-300">{l.local}</td>
                    <td className="p-3 font-bold text-white">{l.produto}</td>
                    <td className="p-3 text-emerald-400">{l.entrou}</td>
                    <td className="p-3 text-rose-400">{l.saiu}</td>
                    <td className={`p-3 font-black ${saldo < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {saldo} {unidade(l.produto)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- */
export default function Suprimentos({ empresa }: { empresa: string }) {
  const [aba, setAba] = useState('produtos');
  const produtos = useTable('suprimentos_produtos', empresa);
  const locais = useTable('suprimentos_locais', empresa);

  // Atualiza as listas usadas nos seletores sempre que a aba muda
  const { reload: recarregarProdutos } = produtos;
  const { reload: recarregarLocais } = locais;
  useEffect(() => {
    recarregarProdutos();
    recarregarLocais();
  }, [aba, recarregarProdutos, recarregarLocais]);

  const nomesProdutos = useMemo(() => produtos.rows.map((p: any) => p.nome).filter(Boolean), [produtos.rows]);
  const nomesLocais = useMemo(() => locais.rows.map((l: any) => l.nome).filter(Boolean), [locais.rows]);

  const def = TABS.find((t) => t.id === aba);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Boxes className="w-6 h-6 text-amber-500" />}
        title="Suprimentos"
        subtitle={
          <>
            Empresa ativa: <span className="text-amber-400 font-bold">{empresa}</span>
          </>
        }
      />
      <Tabs
        active={aba}
        onChange={setAba}
        tabs={[
          ...TABS.slice(0, 2).map((t) => ({ id: t.id, label: t.label })),
          { id: 'estoque', label: 'Estoque' },
          ...TABS.slice(2).map((t) => ({ id: t.id, label: t.label })),
        ]}
      />
      {aba === 'estoque' && <Estoque empresa={empresa} />}
      {def && (
        // key força recarregar o formulário/lista ao trocar de aba ou de empresa
        <CrudTab key={`${def.id}-${empresa}`} def={def} empresa={empresa} produtos={nomesProdutos} locais={nomesLocais} />
      )}
    </div>
  );
}
