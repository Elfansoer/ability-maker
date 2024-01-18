import { PopupManager } from "./components/popup";
import { textEntry } from "./components/settings";
import { customWindow } from "./components/window";

type Expression = ReturnType<typeof expression>;

function selector( root: Panel, id: string ) {
    const base = $.CreatePanel( 'Panel', root, id, {class: "SelectorBase"} );
    const entry = textEntry( base, 'entry' );
    entry.actions.actionTextChange = (text: string)=>{
        $.Msg("changed");
    }

    function update( text: string ) {

    }

    const selections = $.CreatePanel( 'Panel', base, 'selections' );
}

function newExpression( root: Panel ) {
    const base = $.CreatePanel('Panel',root,"newExpression");
    const label = $.CreatePanel('Label',base,'');
    label.text = "New Expression";

    base.SetPanelEvent('onactivate',()=>{
        // new window here
        const popup = PopupManager.createPopup();
        popup.onBackgroundClick(()=>{
            popup.close();
        })
        const window = customWindow(popup.panel,'newExpression',{title: "New Expression"});
        window.onClose(()=>{
            popup.close();
        });

        const newSelector = selector( window.panel, 'selector' );
    })
}

function expression( root: Panel, id: string, options: { code: string, desc: string } ) {
    const base = $.CreatePanel('Panel',root,id,{class: "Expression"});
    const code = $.CreatePanel('Label',base,'code');
    const desc = $.CreatePanel('Label',base,'desc');
    const line = $.CreatePanel('Panel',base,'line');

    code.text = options.code;
    desc.text = options.desc;
}

export function codeContainer(root: Panel, id: string) {
    const expressions: Expression[] = [];

    const base = $.CreatePanel('Panel',root,id,{class: "CodeContainer"});
    const expressionContainer = $.CreatePanel('Panel',base,"expressions");
    const newExpressionItem = newExpression(base);

    expression(expressionContainer,'exp1',{
        code: "local caster = self:GetCaster()",
        desc: "Assign variable <caster> with value of this ability's caster.",
    });
    expression(expressionContainer,'exp2',{
        code: "local damage = self:GetSpecialValueFor( damage )",
        desc: "Assign variable <caster> with value of <this ability's special value <damage>>.",
    });
}