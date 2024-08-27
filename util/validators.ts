export function throwOnNull<T>( val: T | null, message?: string): T {
    if( val === null ) {
        throw new Error(message ?? '');
    } else {
        return val;
    }
}