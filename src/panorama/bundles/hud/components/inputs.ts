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

    const base = $.CreatePanel('Panel',root,id,{class: "TextEntryBase"});
    const label = $.CreatePanel('Label',base,'text');
    const entry = $.CreatePanel('TextEntry',base,'entry');
    const submit = $.CreatePanel('Button',base,'submit');
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