'use client';
import React, { useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Wallet, ShieldCheck, Paperclip, CheckCircle2, Trash2 } from 'lucide-react';
import { useTable, inserir, atualizar, excluir } from '@/lib/data';
import { brl, hoje, formatarData, uploadAnexo, abrirAnexo, CATEGORIAS, CENTROS_PADRAO } from '@/lib/utils';
import { Card, Modal, Field, PageHeader, Tabs, ErrorBox, Loading, Empty, inputCls } from './ui';

type Tipo = 'pagar' | 'receber';

/* ---------------------------------------------------------------- */
/* Lançamentos (contas a pagar / a receber)                          */
/* ---------------------------------------------------------------- */
function Lancamentos({ empresa, tipo }: { empresa: string; tipo: Tipo }) {
  const tabela = tipo === 'pagar' ? 'financeiro_lancamentos' : 'financeiro_receber';
  const statusFinal = tipo === 'pagar' ? 'Pago' : 'Recebido';
  const { rows, loading, error, reload } = useTable(tabela, empresa, 'vencimento', true);

  const [aberto, setAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(hoje());
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [centro, setCentro] = useState(CENTROS_PADRAO[0]);
  const [status, setStatus] = useState('Pendente');
  const [nf, setNf] = useState<File | null>(null);
  const [comp, setComp] = useState<File | null>(null);

  const total = rows.reduce((a: number, i: any) => a + Number(i.valor || 0), 0);
  const pendente = rows
    .filter((i: any) => i.status !== statusFinal)
    .reduce((a: number, i: any) => a + Number(i.valor || 0), 0);

  function limpar() {
    setDescricao('');
    setValor('');
    setVencimento(hoje());
    setStatus('Pendente');
    setNf(null);
    setComp(null);
    setErro('');
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro('');
    try {
      const pasta = `${empresa}/${tipo}`;
      const nfUp = nf ? await uploadAnexo(nf, pasta) : null;
      const compUp = comp ? await uploadAnexo(comp, pasta) : null;
      const msg = await inserir(tabela, {
        descricao,
        valor: parseFloat(valor || '0'),
        vencimento,
        categoria,
        centro_custo: centro,
        status,
        empresa,
        nf_nome: nfUp?.nome ?? null,
        nf_url: nfUp?.path ?? null,
        comprovante_nome: compUp?.nome ?? null,
        comprovante_url: compUp?.path ?? null,
      });
      if (msg) throw new Error(msg);
      setAberto(false);
      limpar();
      reload();
    } catch (err: any) {
      setErro(err.message || 'Erro ao salvar.');
    }
    setSalvando(false);
  }

  async function alternar(item: any) {
    const novo = item.status === statusFinal ? 'Pendente' : statusFinal;
    const msg = await atualizar(tabela, item.id, { status: novo });
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  async function apagar(item: any) {
    if (!confirm(`Excluir "${item.descricao}"?`)) return;
    const msg = await excluir(tabela, item.id);
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  const cor = tipo === 'pagar' ? 'text-rose-400' : 'text-emerald-400';

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          {tipo === 'pagar' ? (
            <TrendingDown className="w-4 h-4 text-rose-400" />
          ) : (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          )}
          {tipo === 'pagar' ? 'Contas a pagar' : 'Contas a receber'}
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Pendente: <b className={cor}>{brl(pendente)}</b>
          </span>
          <span className="text-slate-400">
            Total: <b className="text-white">{brl(total)}</b>
          </span>
          <button
            onClick={() => setAberto(true)}
            className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer"
          >
            + Novo lançamento
          </button>
        </div>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text="Nenhum lançamento ainda. Clique em “Novo lançamento” para começar." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3">Descrição</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Centro de custo</th>
                <th className="p-3">Vencimento</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Nota fiscal</th>
                <th className="p-3">Comprovante</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((item: any) => {
                const quitado = item.status === statusFinal;
                const atrasado = !quitado && item.vencimento && item.vencimento < hoje();
                return (
                  <tr key={item.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white">{item.descricao}</td>
                    <td className="p-3 text-slate-400">{item.categoria}</td>
                    <td className="p-3 text-amber-400 font-bold">{item.centro_custo || 'Geral'}</td>
                    <td className={`p-3 ${atrasado ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                      {formatarData(item.vencimento)}
                    </td>
                    <td className={`p-3 font-bold ${cor}`}>{brl(item.valor)}</td>
                    <td className="p-3">
                      {item.nf_url ? (
                        <button
                          onClick={() => abrirAnexo(item.nf_url)}
                          className="text-amber-400 font-bold underline flex items-center gap-1 cursor-pointer"
                        >
                          <Paperclip className="w-3 h-3" /> Ver NF
                        </button>
                      ) : (
                        <span className="text-slate-500">Sem NF</span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.comprovante_url ? (
                        <button
                          onClick={() => abrirAnexo(item.comprovante_url)}
                          className="text-emerald-400 font-bold underline flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Ver comp.
                        </button>
                      ) : (
                        <span className="text-slate-500">Sem comp.</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          quitado ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {atrasado ? 'Vencido' : item.status || 'Pendente'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => alternar(item)}
                          className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                            quitado ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {quitado ? 'Estornar' : tipo === 'pagar' ? 'Pagar' : 'Receber'}
                        </button>
                        <button onClick={() => apagar(item)} aria-label="Excluir" className="cursor-pointer">
                          <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {aberto && (
        <Modal
          title={tipo === 'pagar' ? 'Novo lançamento a pagar' : 'Novo lançamento a receber'}
          onClose={() => {
            setAberto(false);
            limpar();
          }}
        >
          <form onSubmit={salvar} className="space-y-3">
            <Field label="Descrição *">
              <input required value={descricao} onChange={(e) => setDescricao(e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor (R$) *">
                <input required type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Vencimento *">
                <input required type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Categoria">
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={inputCls}>
                  {CATEGORIAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Centro de custo">
                <input list="centros" value={centro} onChange={(e) => setCentro(e.target.value)} className={inputCls} />
                <datalist id="centros">
                  {CENTROS_PADRAO.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
            </div>
            <Field label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                <option>Pendente</option>
                <option>{statusFinal}</option>
              </select>
            </Field>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-amber-400">Nota fiscal (XML/PDF)</label>
              <input type="file" accept=".xml,.pdf" onChange={(e) => setNf(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400" />
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-bold text-emerald-400">Comprovante de pagamento</label>
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setComp(e.target.files?.[0] || null)} className="w-full text-xs text-slate-400" />
            </div>

            <ErrorBox message={erro} />
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="submit"
                disabled={salvando}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-60"
              >
                {salvando ? 'Salvando...' : 'Salvar lançamento'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Contas bancárias                                                  */
/* ---------------------------------------------------------------- */
function Bancos({ empresa }: { empresa: string }) {
  const { rows, loading, error, reload } = useTable('contas_bancarias', empresa);
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState('');
  const [banco, setBanco] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [saldo, setSaldo] = useState('');

  const total = rows.reduce((a: number, i: any) => a + Number(i.saldo || 0), 0);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const msg = await inserir('contas_bancarias', {
      banco,
      agencia,
      conta,
      saldo: parseFloat(saldo || '0'),
      empresa,
    });
    if (msg) return setErro(msg);
    setAberto(false);
    setBanco('');
    setAgencia('');
    setConta('');
    setSaldo('');
    setErro('');
    reload();
  }

  async function apagar(b: any) {
    if (!confirm(`Excluir a conta ${b.banco}?`)) return;
    const msg = await excluir('contas_bancarias', b.id);
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Wallet className="w-4 h-4 text-amber-500" /> Contas bancárias
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-400">
            Saldo total: <b className="text-amber-400">{brl(total)}</b>
          </span>
          <button onClick={() => setAberto(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
            + Conta bancária
          </button>
        </div>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text="Nenhuma conta cadastrada." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((b: any) => (
            <div key={b.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-white text-sm">{b.banco}</p>
                <p className="text-xs text-slate-400">
                  Ag: {b.agencia || '-'} • CC: {b.conta || '-'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-black text-amber-400 text-sm">{brl(b.saldo)}</p>
                <button onClick={() => apagar(b)} aria-label="Excluir" className="cursor-pointer">
                  <Trash2 className="w-4 h-4 text-slate-500 hover:text-rose-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {aberto && (
        <Modal title="Nova conta bancária" onClose={() => setAberto(false)}>
          <form onSubmit={salvar} className="space-y-3">
            <Field label="Banco *">
              <input required placeholder="Ex.: Cora, PagBank" value={banco} onChange={(e) => setBanco(e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Agência">
                <input value={agencia} onChange={(e) => setAgencia(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Conta">
                <input value={conta} onChange={(e) => setConta(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Saldo inicial (R$)">
              <input type="number" step="0.01" value={saldo} onChange={(e) => setSaldo(e.target.value)} className={inputCls} />
            </Field>
            <ErrorBox message={erro} />
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs cursor-pointer">
                Salvar conta
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* Tributos                                                          */
/* ---------------------------------------------------------------- */
function Tributos({ empresa }: { empresa: string }) {
  const { rows, loading, error, reload } = useTable('tributos_erp', empresa, 'vencimento', true);
  const [aberto, setAberto] = useState(false);
  const [erro, setErro] = useState('');
  const [imposto, setImposto] = useState('DAS (Simples Nacional)');
  const [competencia, setCompetencia] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState(hoje());

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    const msg = await inserir('tributos_erp', {
      imposto,
      competencia: competencia || 'Atual',
      valor: parseFloat(valor || '0'),
      vencimento,
      status: 'Previsto',
      empresa,
    });
    if (msg) return setErro(msg);
    setAberto(false);
    setCompetencia('');
    setValor('');
    setErro('');
    reload();
  }

  async function alternar(t: any) {
    const novo = t.status === 'Pago' ? 'Previsto' : 'Pago';
    const msg = await atualizar('tributos_erp', t.id, { status: novo });
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  async function apagar(t: any) {
    if (!confirm(`Excluir ${t.imposto} (${t.competencia})?`)) return;
    const msg = await excluir('tributos_erp', t.id);
    if (msg) alert('Erro: ' + msg);
    reload();
  }

  return (
    <Card>
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" /> Tributos e guias fiscais (DAS, FGTS, INSS)
        </h3>
        <button onClick={() => setAberto(true)} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs cursor-pointer">
          + Tributo / guia
        </button>
      </div>

      <ErrorBox message={error} />
      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <Empty text="Nenhum tributo cadastrado." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="p-3">Imposto</th>
                <th className="p-3">Competência</th>
                <th className="p-3">Vencimento</th>
                <th className="p-3">Valor</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-950/50">
                  <td className="p-3 font-bold text-white">{t.imposto}</td>
                  <td className="p-3 text-slate-300">{t.competencia}</td>
                  <td className="p-3 text-slate-300">{formatarData(t.vencimento)}</td>
                  <td className="p-3 font-bold text-amber-400">{brl(t.valor)}</td>
                  <td className="p-3">
                    <span className={`font-bold ${t.status === 'Pago' ? 'text-emerald-400' : 'text-amber-400'}`}>{t.status}</span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => alternar(t)}
                        className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                          t.status === 'Pago' ? 'bg-slate-800 text-slate-300' : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {t.status === 'Pago' ? 'Estornar' : 'Marcar pago'}
                      </button>
                      <button onClick={() => apagar(t)} aria-label="Excluir" className="cursor-pointer">
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
        <Modal title="Novo tributo / guia" onClose={() => setAberto(false)}>
          <form onSubmit={salvar} className="space-y-3">
            <Field label="Imposto">
              <select value={imposto} onChange={(e) => setImposto(e.target.value)} className={inputCls}>
                <option>DAS (Simples Nacional)</option>
                <option>FGTS</option>
                <option>INSS</option>
                <option>ISS</option>
                <option>IRPJ</option>
                <option>CSLL</option>
              </select>
            </Field>
            <Field label="Competência">
              <input placeholder="Ex.: 05/2026" value={competencia} onChange={(e) => setCompetencia(e.target.value)} className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Valor (R$) *">
                <input required type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Vencimento *">
                <input required type="date" value={vencimento} onChange={(e) => setVencimento(e.target.value)} className={inputCls} />
              </Field>
            </div>
            <ErrorBox message={erro} />
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs cursor-pointer">
                Salvar tributo
              </button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}

/* ---------------------------------------------------------------- */
export default function Financeiro({ empresa }: { empresa: string }) {
  const [aba, setAba] = useState('pagar');
  return (
    <div className="space-y-6">
      <PageHeader
        icon={<DollarSign className="w-6 h-6 text-emerald-500" />}
        title="Módulo Financeiro"
        subtitle={
          <>
            Empresa ativa: <span className="text-amber-400 font-bold">{empresa}</span>
          </>
        }
      />
      <Tabs
        accent="emerald"
        active={aba}
        onChange={setAba}
        tabs={[
          { id: 'pagar', label: 'Contas a pagar' },
          { id: 'receber', label: 'Contas a receber' },
          { id: 'bancos', label: 'Contas bancárias' },
          { id: 'tributos', label: 'Tributos e impostos' },
        ]}
      />
      {aba === 'pagar' && <Lancamentos empresa={empresa} tipo="pagar" />}
      {aba === 'receber' && <Lancamentos empresa={empresa} tipo="receber" />}
      {aba === 'bancos' && <Bancos empresa={empresa} />}
      {aba === 'tributos' && <Tributos empresa={empresa} />}
    </div>
  );
}
