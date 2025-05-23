export function ObjectEntries<T extends Record<string, unknown>>(
    value: T,
): Entries<T> {
    return Object.entries(value) as Entries<T>;
}

export type Entries<T> = {
    [K in keyof T]: [K, T[K]];
}[keyof T][];
