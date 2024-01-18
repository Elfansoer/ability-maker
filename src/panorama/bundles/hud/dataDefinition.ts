import { checkBox, columns, editabelTextEntry, radioSelection, sectionHeader } from "./components/settings";
import { CAbilityBehavior, CAbilityTargetTeam, CAbilityType, KVData, constructKV } from "./kvConstructor";

type DamageType = "Physical" | "Magical" | "Pure"
type AbilityValueItem = ReturnType<typeof abilityValueItem>;
type AbilityValueItemOptions = { name: string, value: string };
function abilityValueItem( root: Panel, id: string, options: AbilityValueItemOptions ) {
    const base = $.CreatePanel( 'Panel', root, id, {class: "AbilityValueItemBase"} );

    const nameContainer = $.CreatePanel( 'Panel', base, 'nameContainer' );
    const nameLabel = $.CreatePanel('Label',nameContainer,'nameLabel');
    const name = editabelTextEntry(nameContainer,'name');

    const valueContainer = $.CreatePanel( 'Panel', base, 'valueContainer' );
    const valueLabel = $.CreatePanel( 'Label', valueContainer, 'valueLabel' );
    const value = editabelTextEntry(valueContainer,'value');

    const deleteButton = $.CreatePanel( 'TextButton', base, 'delete' );
    
    deleteButton.AddClass("BlueButton");
    nameLabel.text = "Name: ";
    valueLabel.text = "Value: ";
    deleteButton.text = "Delete";

    name.text( options.name );
    value.text( options.value );
    name.onStateChange( (_)=>onStateChange() );
    value.onStateChange( (_)=>onStateChange() );
    
    let actionDelete = ()=>{};
    let actionStateChange = ( currentState: ReturnType<typeof state> )=>{};

    function onDelete( action?: typeof actionDelete ) {
        if (action) {
            actionDelete = action;
            deleteButton.SetPanelEvent('onactivate',actionDelete);
        } else {
            actionDelete();
        }
    }
    function onStateChange( action?: typeof actionStateChange ) {
        if (action) {
            actionStateChange = action;
        } else {
            actionStateChange(state());
        }
    }
    function state() {
        return {
            name: name.text(),
            value: value.text(),
        }
    }

    return {
        base,
        state,
        onDelete,
        onStateChange,
    }
}

/**
 * Singular: New AbilityValue button
 */
function newAbilityValue( root: Panel, id: string ) {
    const base = $.CreatePanel( 'Button', root, id, {class: "AbilityValueNewItemBase"} );
    base.AddClass( "BlueButton" );
    const label = $.CreatePanel( 'Label', base, 'newValueLabel' );
    label.text = "New AbilityValue";

    let actionActivate = ()=>{};

    // TODO: try automate this invoke functions into some kind of inheritance system
    function onActivate( action?: typeof actionActivate ) {
        if (action) {
            actionActivate = action;
            base.SetPanelEvent('onactivate',actionActivate);
        } else {
            actionActivate();
        }
    }

    return {
        base,
        onActivate,
    }
}

function abilityValuesSection( root: Panel, id: string ) {
    const base = $.CreatePanel( 'Panel', root, id, {class: "AbilityValuesBase"} );
    const container = $.CreatePanel( 'Panel', base, 'container' );
    const newValue = newAbilityValue( base, 'newValue' );
    newValue.onActivate(()=>{
        const len = abilityValueItems.length;
        addAbilityValueItem( 'AV' + len, {
            name: "value" + len,
            value: "100",
        });
    });

    let actionStateChange = (currentState: ReturnType<typeof state>)=>{};

    const abilityValueItems: AbilityValueItem[] = [];
    function addAbilityValueItem( id: string, options: AbilityValueItemOptions ) {
        const newItem = abilityValueItem( container, id, options );
        newItem.onStateChange((_)=>{
            onStateChange();
        });
        newItem.onDelete(()=>{
            removeAbilityValueItem( newItem );
        });
        abilityValueItems.push( newItem );
        onStateChange();
    }
    function removeAbilityValueItem( item: AbilityValueItem ) {
        // TODO: create remove item util
        const index = abilityValueItems.indexOf(item);
        abilityValueItems.splice(index, 1);
        item.base.DeleteAsync(0);
        onStateChange();
    }

    function state() {
        return abilityValueItems.map(item=>item.state());
    }
    function onStateChange( action?: typeof actionStateChange ) {
        if (action) {
            actionStateChange = action;
        } else {
            actionStateChange(state());
        }
    }

    addAbilityValueItem( 'sample1', {
        name: "radius",
        value: "500",
    });
    addAbilityValueItem( 'sample2', {
        name: "damage",
        value: "100 200 300 400",
    });

    return {
        base,
        state,
        onStateChange,
    }
}

/**
 * Singular: Tab for 1st step, Data Definition
 */
export function dataDefinitionPage( root: Panel, id: string ) {

    const base = $.CreatePanel( 'Panel', root, id, {class: "DataDefinitionBase"} );
    const columnContainer = columns( base, {count: 2} );
    
    const baseLeft = columnContainer.panels[0];

    const header1 = sectionHeader( baseLeft, { title: "Ability Properties" } );

    const abilityType = radioSelection(baseLeft,'abilityType',{
        radioOptions: ["basic","ultimate"] as CAbilityType[],
        title: "Ability Type:",
        texts: [
            "Basic",
            "Ultimate",
        ],
        defaultState: "basic",
    });
    abilityType.onStateChange((state)=>{
        update();
    });

    const abilityBehavior = radioSelection(baseLeft,'abilityBehavior',{
        radioOptions: ["noTarget","unitTarget","pointTarget"] as CAbilityBehavior[],
        title: "Ability Behavior:",
        texts: [
            "No Target",
            "Unit Target",
            "Point Target",
        ],
        defaultState: "unitTarget",
    });
    abilityBehavior.onStateChange((state)=>{
        update();
    });

    const abilityTargetTeam = radioSelection(baseLeft,'abilityTargetTeam',{
        radioOptions: ["teamEnemy","teamFriendly","teamBoth"] as CAbilityTargetTeam[],
        title: "Ability Target Team:",
        texts: [
            "Enemy",
            "Friendly",
            "Both",
        ],
        defaultState: "teamBoth",
    });
    abilityTargetTeam.onStateChange((state)=>{
        update();
    });

    const spellImmune = checkBox(baseLeft,'spellImmune',{
        text: "Pierces Spell Immunity",
        defaultState: true,
    });
    spellImmune.onStateChange((ticked)=>{
        update();
    });

    const header2 = sectionHeader( baseLeft, { title: "Ability Values" } );

    const avSection = abilityValuesSection( baseLeft, 'abilityValuesSection' );
    avSection.onStateChange((state)=>{
        update();
    });

    const baseRight = columnContainer.panels[1];
    const preview = $.CreatePanel('Label',baseRight,'preview');
    update();
    
    function state(): KVData {
        return {
            abilityName: "ability_sample",
            abilityType: abilityType.state(),
            abilityBehavior: abilityBehavior.state(),
            abilityTargetTeam: abilityTargetTeam.state(),
            spellImmune: spellImmune.state(),
            abilityValues: avSection.state(),
        }
    }
    function update() {
        const kv = constructKV( state() );
        preview.text = kv;
    }

    return {
        base,
        state,
    }
}