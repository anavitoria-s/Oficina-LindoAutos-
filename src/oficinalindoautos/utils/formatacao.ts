export function formatarDataHoraBrasileira(isoString?: string): string {
  if (!isoString) return 'Data não disponível';
  
  try {
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return isoString;

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
  } catch (error) {
    return isoString;
  }
}
