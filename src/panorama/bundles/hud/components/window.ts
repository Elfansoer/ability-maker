
type Size = {w: number, h: number};
/**
 * Wrapper: Window from root panel, .
 * @param root base panel for the window.
 * @returns 'panel' is the container panel for next modifications.
 */
export function customWindow( root: Panel, id: string, options?: { title?: string, size?: Size } ) {
    const base = $.CreatePanel('Panel', root, id, {class: 'WindowBase'} );
    const navBar = $.CreatePanel('Panel', base, 'navBar' );
    const closeButton = $.CreatePanel('Button', navBar, 'close' );
    const titleText = $.CreatePanel('Label', navBar, 'title' );
    const panel = $.CreatePanel('Panel', base, 'panel' );

    let actionClose = ()=>{}

    function size( size?: Size ): Size {
        if (size) {
            panel.style.width = `${size.w}px`;
            panel.style.height = `${size.h}px`;
        }
        return {
            w: panel.contentwidth,
            h: panel.contentheight,
        }
    }
    function title( text?: string ) {
        if (text) {
            titleText.text = text;
        }
        return titleText.text;
    }
    function onClose(action?: typeof actionClose) {
        if (action) {
            actionClose = action;
            closeButton.SetPanelEvent('onactivate',actionClose);
        } else {
            actionClose();
        }
    }

    title( options?.title ?? "Default Window Title" );
    size(options?.size ?? {w: 500, h: 500});

    return {
        base,
        panel,
        title,
        size,
        onClose,
    }
}
