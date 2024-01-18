import { PopupManager } from "./components/popup";
import { tabs } from "./components/settings";
import { customWindow } from "./components/window";
import { dataDefinitionPage } from "./dataDefinition";
import { functionExamples } from "./functionExamples";
import { codeContainer } from "./functionImplementation";

export function Main() {
    $.Msg("Hello from main, world!");
    const opener = $.CreatePanel('Panel',$.GetContextPanel(),'windowOpener');
    opener.SetPanelEvent('onactivate',()=>{
        mainPopup.show();
    })
    const mainPopup = PopupManager.createPopup();
    mainPopup.onBackgroundClick(()=>{
        mainPopup.hide();
    })
    const newWindow = customWindow( mainPopup.panel, 'mainWindow', {title: "Main Window", size: {w: 1500, h: 800}});
    newWindow.onClose(()=>{
        mainPopup.hide();
    })

    const tabContainer = tabs( newWindow.panel, {
        tabIDs: ['dataDefinition', 'functionSignature', 'functionExamples', 'functionTemplate', 'functionImplementation' , 'functionTesting'],
        tabTitles: [
            "Ability Definition",
            "Ability Description",
            "Cast Examples",
            "Implementation Template",
            "Ability Implementation",
            "Ability Testing"
        ],
    } )

    let tab1 = dataDefinitionPage( tabContainer.panels.get('dataDefinition')!, 'dataDefinition' );
    let tab2 = $.CreatePanel( 'Label', tabContainer.panels.get('functionSignature')!, 'functionSignature' );
    let tab3 = functionExamples( tabContainer.panels.get('functionExamples')!, 'functionExamples', tab1.state() );
    let tab4 = $.CreatePanel( 'Label', tabContainer.panels.get('functionTemplate')!, 'functionTemplate' );
    let tab5 = codeContainer( tabContainer.panels.get('functionImplementation')!, 'functionImplementation' );
    let tab6 = $.CreatePanel( 'Label', tabContainer.panels.get('functionTesting')!, 'functionTesting' );

    tab2.text = "Under Construction";
    tab4.text = "Under Construction";
    tab6.text = "Under Construction";

    tabContainer.state('functionExamples');
    tabContainer.onStateChange((currentTab)=>{
        if (currentTab=='functionExamples') {
            tab3.base.DeleteAsync(0);
            tab3 = functionExamples( tabContainer.panels.get('functionExamples')!, 'functionExamples', tab1.state() );
        }
    })
}