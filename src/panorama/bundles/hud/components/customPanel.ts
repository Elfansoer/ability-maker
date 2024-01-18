export function newPanel<T,U>( fun: (root: Panel, id: string, ...params: T[])=>U, root: Panel, id: string, params: T ) {
    const base = $.CreatePanel( 'Panel', root, id );
    return fun( base, id, params );
}