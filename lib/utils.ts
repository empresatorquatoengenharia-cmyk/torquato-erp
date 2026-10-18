import { supabase } from './supabase';

export const CATEGORIAS = [
  'Material de Obra',
  'Mão de Obra',
  'Equipamentos',
  'Combustível',
  'Impostos',
  'Administrativo',
  'Outros',
];

export const CENTROS_PADRAO = ['Geral / Sede', 'Obra Res. Pôr do Sol', 'Pavimentação Buenópolis'];

export function brl(n: number | string | null | undefined) {
  return Number(n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function hoje() {
  return new Date().toISOString().split('T')[0];
}

export function formatarData(d?: string | null) {
  if (!d) return '-';
  const [y, m, day] = String(d).split('T')[0].split('-');
  return y && m && day ? `${day}/${m}/${y}` : String(d);
}

/**
 * Envia um arquivo para o Supabase Storage (bucket privado "anexos").
 * Retorna o nome original e o caminho salvo no bucket.
 */
export async function uploadAnexo(file: File, pasta: string) {
  const seguro = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pastaSegura = pasta.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `${pastaSegura}/${Date.now()}_${seguro}`;
  const { error } = await supabase.storage.from('anexos').upload(path, file);
  if (error) throw new Error(error.message);
  return { nome: file.name, path };
}

/** Gera um link temporário (5 min) e abre o anexo numa nova aba. */
export async function abrirAnexo(path: string) {
  const { data, error } = await supabase.storage.from('anexos').createSignedUrl(path, 300);
  if (error || !data) {
    alert('Não foi possível abrir o arquivo: ' + (error?.message || 'link indisponível'));
    return;
  }
  window.open(data.signedUrl, '_blank', 'noopener');
}
