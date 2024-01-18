function popup(root: Panel) {
    // a popup contains background to cancel, and a main window
    const base = $.CreatePanel('Panel', root, '',{class: 'PopupBase'});
    const background = $.CreatePanel('Panel', base, 'background');
    const panel = $.CreatePanel('Panel', base, 'panel', {hittest: true});
    panel.SetPanelEvent('onactivate',()=>{});

    let actionBackgroundClick = ()=>{}

    function close() {
        base.DeleteAsync(0);
    }
    function hide() {
        base.AddClass("Hidden");
    }
    function show() {
        base.RemoveClass("Hidden");
    }
    function onBackgroundClick( action?: typeof actionBackgroundClick ) {
        if (action) {
            actionBackgroundClick = action;
            background.SetPanelEvent('onactivate',()=>{
                actionBackgroundClick();
            });
        } else {
            actionBackgroundClick();
        }
    }

    return {
        panel,
        close,
        hide,
        show,
        onBackgroundClick,
    }
}

export function popupManager(root: Panel) {
    const popups: ReturnType<typeof popup>[] = [];
    const base = $.CreatePanel( 'Panel', root, '', {class: 'PopupManagerBase', hittest: false} );

    function createPopup() {
        const newPopup = popup( base );
        popups.push(newPopup);
        // newPopup.window.onClose(()=>{
        //     if (popups[popups.length-1]==newPopup) {
        //         popups.pop()?.close();
        //     }
        // })
        return newPopup;
    }

    return {
        base,
        createPopup
    }
}

export const PopupManager = popupManager($.GetContextPanel());