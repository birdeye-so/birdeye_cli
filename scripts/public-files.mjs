// One policy for the Git tree, historical paths and packed artifacts.
export function isPrivatePath(path) {
  const normalized = path.replaceAll('\\', '/');
  return /(^|\/)(internaldocs|\.impeccable)(\/|$)/.test(normalized)
    || /(^|\/)docs\/(plans|research|ui)(\/|$)/.test(normalized)
    || /(^|\/)(PRODUCT|DESIGN|PUBLIC_READINESS)\.md$/.test(normalized)
    || /(^|\/)\.DS_Store$|\.(swp|swo)$/.test(normalized);
}
