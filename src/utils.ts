export function cleanArray(value: any): any[] {
  return (Array.isArray(value) ? value : [value]).filter(Boolean)
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
