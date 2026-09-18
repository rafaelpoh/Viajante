/**
 * Formata datas em padrão amigável pt-BR com suporte seguro a timestamps do Firestore.
 */
export function formatDate(val: unknown): string {
  if (!val) return '';

  try {
    if (typeof val === 'object' && val !== null && '_seconds' in val) {
      const sec = (val as { _seconds: number })._seconds;
      return new Date(sec * 1000).toLocaleDateString('pt-BR');
    }

    if (val instanceof Date) {
      return val.toLocaleDateString('pt-BR');
    }

    if (typeof val === 'number') {
      return new Date(val).toLocaleDateString('pt-BR');
    }

    if (typeof val === 'string') {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('pt-BR');
      }
    }
  } catch {
    return '';
  }

  return '';
}
