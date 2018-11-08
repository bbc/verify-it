export function hasFunction (parent: any, key: string): boolean {
  return !!parent && !!parent[key] && typeof parent[key] === 'function'
}
