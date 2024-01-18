import { editabelTextEntry } from "./components/settings";
import { KVData } from "./kvConstructor";

function exampleCase( root: Panel, id: string, options: {title: string, titleEditable?: boolean, desc?: string} ) {
    const base = $.CreatePanel( 'Panel', root, id, {class: "ExampleCase"} );
    let label: LabelPanel | ReturnType<typeof editabelTextEntry>;
    if (options.titleEditable) {
        label = editabelTextEntry( base, 'label', {text: options.title} );
    } else {
        label = $.CreatePanel( 'Label', base, 'label' );
        label.text = options.title;
    }

    const defaultText = options.desc ?? "Enter behavior here..." 
    const behaviorDesc = $.CreatePanel( 'TextEntry', base, 'behaviorDesc', {multiline: true} );
    behaviorDesc.text = defaultText;
    behaviorDesc.SetPanelEvent('onfocus',()=>{
        toggleEdit(true);
    });
    behaviorDesc.SetPanelEvent('onblur',()=>{
        toggleEdit(false);
    });
    behaviorDesc.SetPanelEvent('oninputsubmit',()=>{
        toggleEdit(false);
    });

    let initialized = false;
    let actionStateChange = (state: ReturnType<typeof text>)=>{}

    function toggleEdit(show: boolean) {
        if (show) {
            if (!initialized) {
                behaviorDesc.text = "";
                initialized = true;
            } else {
                behaviorDesc.SelectAll();
            }
        } else {
            if (behaviorDesc.text.length==0 || behaviorDesc.text==defaultText) {
                behaviorDesc.text = defaultText;
                initialized = false;
            }
        }

    }
    function text() {
        return behaviorDesc.text;
    }
    function onStateChange( action?: typeof actionStateChange ) {
        if (action) {
            actionStateChange = action;
        } else {
            actionStateChange(text());
        }
    }
    function state() {
        return {
            title: "base" in label ? label.text() : label.text,
            behavior: behaviorDesc.text,
        }
    }

    return {
        base,
        text,
        state,
        onStateChange,
    }
}

export function functionExamples( root: Panel, id: string, options: KVData ) {
    const predefinedCases: ReturnType<typeof exampleCase>[] = [];
    const customCases: ReturnType<typeof exampleCase>[] = [];

    const base = $.CreatePanel( 'Panel', root, id, {class: "FunctionExampleBase"} );
    const predefinedContainer = $.CreatePanel( 'Panel', base, 'predefined' );
    const customContainer = $.CreatePanel( 'Panel', base, 'custom' );

    if (options.abilityTargetTeam=="teamBoth") {
        predefinedCases.push(
            exampleCase( predefinedContainer, '', {
                title: "If target is an enemy:",
            }),
            exampleCase( predefinedContainer, '', {
                title: "If target is an ally:",
            }),       
            exampleCase( predefinedContainer, '', {
                title: "If ability is self-cast:",
            }),
        );
    } else if (options.abilityTargetTeam=="teamFriendly") {
        predefinedCases.push(
            exampleCase( predefinedContainer, '', {
                title: "If target is an ally:",
            }),       
            exampleCase( predefinedContainer, '', {
                title: "If ability is self-cast:",
            }),
        );
    }

    if (options.abilityBehavior=="unitTarget") {
        predefinedCases.push(
            exampleCase( predefinedContainer, '', {
                title: "If Target has spell reflect (Lotus Orb) and spell block (Linken's Sphere):",
            })
        );
    }

    if (options.spellImmune==false) {
        predefinedCases.push(
            exampleCase( predefinedContainer, '', {
                title: "If target is spell immune (BKB):",
            })
        );
    }

    exampleCase( predefinedContainer, '', {
        title: "If Target dodged the projectile (Blink Dagger):",
        titleEditable: true,
    });

    function state() {
        return predefinedCases.map((value)=>{return value.state()});
    }

    return {
        base,
        state,
    }
}