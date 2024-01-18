
///////////////////////////////////////////
/**
 * Component: Section header
 * assuming root 
 * @param title section title
 */
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

// type NoEmptyArray<K> = [K, ...K[]];
export function radioSelection<T extends string>(
    root: Panel,
    id: string,
    options: {
        radioOptions: T[],
        title?: string,
        texts?: string[],
        defaultState?: T,
    }
) {
    type RadioState = T;
    type Radios = {
        option: T,
        button: RadioButton,
        label: LabelPanel,
    }
    let radioOptions: Radios[] = [];

    let currentState: RadioState = options.radioOptions[0];
    let actionStateChange = (state: RadioState)=>{};

    const base = $.CreatePanel('DOTASettingsEnum',root,id,{class: "RadioSelection"});
    base.AddClass("EnumButton");
    const radioText = base.FindChildTraverse('title') as LabelPanel;
    const radioContainer = base.FindChildTraverse('values') as Panel;

    for (const option of options.radioOptions) {
        const radioOption = $.CreatePanel('RadioButton',radioContainer,option,{class: "RadioOption",name: id});
        const radioOptionLabel = $.CreatePanel('Label',radioOption,'');
        radioOptions.push({
            option: option,
            button: radioOption,
            label: radioOptionLabel,
        })
    }

    function title(text?: string) {
        if (text) {
            radioText.text = text;
        }
        return radioText.text;
    }
    function texts( texts?: string[] ) {
        if (texts) {
            if (texts.length==radioOptions.length) {
                radioOptions.forEach((option,index)=>{option.label.text = texts[index]});
            } else {
                $.Warning(`Text array size doesn't match for RadioButton of id: ${id}`);
            }
        }
        return radioOptions.map(option=>option.label.text);
    }
    function state( newState?: RadioState ) {
        if (newState) {
            if (newState!="undefined") {
                const option = radioOptions.find(op=>op.option==newState);
                if (option) {
                    currentState = newState;
                    // TODO: Make this prettier
                    (option.button as unknown as {checked: boolean}).checked = true;
                } else {
                    $.Warning(`"State ${newState} is not available on RadioBox of id ${id}`);
                }
            } else {
                currentState = newState;
            }
        }
        return currentState
    }
    function onStateChange(action?: (state: RadioState)=>void) {
        if (action) {
            actionStateChange = action;
            radioOptions.forEach((option)=>{
                option.button.SetPanelEvent('onactivate',()=>{
                    currentState = option.option;
                    actionStateChange(currentState);
                });
            })
        } else {
            actionStateChange(currentState);
        }
    }

    title(options.title ?? "Default Radio Title");
    texts(options.texts ?? options.radioOptions.map( (_,index)=>{
        return `Radio Option ${index}`
    }));
    state(options.defaultState ?? currentState);

    return {
        root,
        base,
        title,
        texts,
        state,
        onStateChange,
    }

}

export function checkBox( root: Panel, id: string, options?: {text?: string, defaultState?: boolean} ) {
    let currentState = true;
    let actionStateChange = (state: boolean)=>{};

    const base = $.CreatePanel('DOTASettingsCheckbox',root,id,{class: 'CheckBox'});    

    function text( text?: string ) {
        if (text) {
            base.text = text;
        }
        return base.text;
    }
    function state( newState?: boolean ) {
        if (newState) {
            currentState = newState;
            base.SetSelected( currentState );
        };
        return currentState;
    }
    function onStateChange(action?: (state: boolean)=>void) {
        if (action) {
            actionStateChange = action;
            base.SetPanelEvent('onactivate',()=>{
                currentState = !currentState;
                actionStateChange(currentState);
            });
        } else {
            actionStateChange(currentState);
        }
    }

    text(options?.text ?? "CheckBox");
    state(options?.defaultState ?? currentState);

    return {
        root,
        base,
        state,
        text,
        onStateChange,
    }
}

export function textEntry(root: Panel, id: string, options?: {text?: string}) {
    let filledText = ""
    let actions = {
        actionTextChange: (text: string)=>{},
        actionSubmit: (text: string)=>{},
    }
    const fields = {
        text: (newText?: string)=>{
            if (newText) entry.text = newText;
            else return entry.text;
        }
    }

    const base = $.CreatePanel('Panel',root,id,{class: "TextEntryBase"});
    const label = $.CreatePanel('Label',base,'text');
    const entry = $.CreatePanel('TextEntry',base,'entry');
    entry.SetPanelEvent('ontextentrychange',()=>{
        actions.actionTextChange(entry.text);
    });
    entry.SetPanelEvent('ontextentrysubmit',()=>{
        actions.actionSubmit(entry.text);
    });

    const submit = $.CreatePanel('Button',base,'submit');
    submit.SetPanelEvent('onactivate',()=>{
        actions.actionSubmit(entry.text);
    })
    submit.AddClass("ButtonBevel");

    const submitLabel = $.CreatePanel('Label',submit,'submitLabel');
    submitLabel.text = "Submit";

    function text(text?: string) {
        if (text) {
            label.text = text;
        }
        return label.text;
    }

    text( options?.text ?? "Entry Text: " );

    return {
        base,
        text,
        actions,
    }
}

export function editabelTextEntry(root: Panel, id: string, options?: {text?: string}) {
    // Panel creation
    const base = $.CreatePanel('Panel',root,id,{class: "EditableTextEntryBase"});
    const label = $.CreatePanel('Label',base,'text');
    const entry = $.CreatePanel('TextEntry',label,'entry');
    const edit = $.CreatePanel('Button',base,'edit');

    // Panel base behavior
    edit.AddClass("EditButton");

    entry.SetPanelEvent('onblur',()=>{
        toggleEdit(false);
    });
    entry.SetPanelEvent('oninputsubmit',()=>{
        toggleEdit(false);
    });
    base.SetPanelEvent('onactivate',()=>{
        toggleEdit(true);
    });
    entry.SetPanelEvent('ontextentrychange',()=>{
        label.text = entry.text;
    });

    // Definitions
    let actionStateChange = ( currentText: ReturnType<typeof text> )=>{};
    function toggleEdit( show: boolean ) {
        if (show) {
            entry.text = label.text;
            entry.RemoveClass("Hidden");
            entry.SetFocus();
        } else {
            onStateChange();
            label.text = entry.text;
            entry.AddClass("Hidden");
        }
    }

    // Exposable methods
    function onStateChange( action?: typeof actionStateChange ) {
        if (action) {
            actionStateChange = action;
        } else {
            actionStateChange(text());
        }
    }
    function text(text?: string) {
        if (text) {
            label.text = text;
            entry.text = text;
        }
        return label.text;
    }

    // Initialize
    text( options?.text ?? "Entry Text: " );
    toggleEdit(false);

    return {
        base,
        text,
        onStateChange,
    }
}