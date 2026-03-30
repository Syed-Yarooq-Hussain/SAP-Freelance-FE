import { Roles } from '@/constants/roles';

export function isClient(type: string | number | undefined): boolean {
    if (typeof type === 'undefined') return false;
    return Number(type) === Roles.CLIENT;
}

export function isConsultant(type: string | number | undefined): boolean {
    if (typeof type === 'undefined') return false;
    return Number(type) === Roles.CONSULTANT;
}

export const sanitizeUrl = (url?: string | null) =>
    url ? encodeURI(url.trim()) : undefined