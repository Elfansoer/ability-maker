export function sectionHeader( root: Panel, options?: {title?: string} ) {
    const base = $.CreatePanel('Panel',root,'',{class: 'CustomSection'});
    const header = $.CreatePanel('Label',base,'header');
    const headerLine = $.CreatePanel('Panel',base,'line');
    function text( title?: string ) {
        if (title) {
            header.text = title;
        }
        return header.text;
    }
    text(options?.title ?? "Default Section Title");

    return {
        root,
        text,
    }
}

export function columns( root: Panel, options: { count: number } ) {
    const base = $.CreatePanel('Panel',root,'',{class: 'CustomColumnBase'});
    const panels: Panel[] = [];
    for (let index = 0; index < options.count; index++) {
        panels.push( $.CreatePanel('Panel',base,'column'+index,{class: "Column"}) );
    }
    return {
        base,
        panels,
    }
}

export function tabs( root: Panel, options: { tabIDs: string[], tabTitles: string[] } ) {
    const base = $.CreatePanel('Panel',root,'',{class: 'CustomTabsBase'});
    const tabContainer = $.CreatePanel('Panel',base,'tabs');
    const tabLine = $.CreatePanel('Panel',base,'line');
    const contentContainer = $.CreatePanel('Panel',base,'container');

    const titles: Map<string,Panel> = new Map();
    const panels: Map<string,Panel> = new Map();
    let currentTab = options.tabIDs[0];
    let actionStateChange = (currentTab: ReturnType<typeof state>)=>{}

    options.tabIDs.forEach((val,idx)=>{
        const title = $.CreatePanel( 'Label', tabContainer, val );
        title.text = options.tabTitles[idx];
        title.SetPanelEvent( 'onactivate', ()=>{
            selectTab( val );
        });
        titles.set(val,title);
        
        const content = $.CreatePanel('Panel',contentContainer,val,{class: "Tab"});
        panels.set(val,content);
    });

    function selectTab( tab: string ) {
        titles.get(currentTab)?.RemoveClass( "TabSelected" );
        panels.get(currentTab)?.RemoveClass( "TabSelected" );
        titles.get(tab)?.AddClass( "TabSelected" );
        panels.get(tab)?.AddClass( "TabSelected" );

        currentTab = tab;
        actionStateChange(currentTab);
    }

    function onStateChange( action?: typeof actionStateChange ) {
        if (action) {
            actionStateChange = action;
        } else {
            actionStateChange(currentTab);
        }
    }

    function state( newTab?: string ) {
        if (newTab) {
            selectTab(newTab);
        }
        return currentTab;
    }
    selectTab( currentTab );

    return {
        base,
        panels,
        state,
        onStateChange,
    }
}