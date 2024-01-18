/// <reference types="@moddota/panorama-types" />
declare module "components/settings" {
    /**
     * Component: Section header
     * assuming root
     * @param title section title
     */
    export function sectionHeader(root: Panel, options?: {
        title?: string;
    }): {
        root: Panel;
        text: (title?: string) => string;
    };
    export function columns(root: Panel, options: {
        count: number;
    }): {
        base: Panel;
        panels: Panel[];
    };
    export function tabs(root: Panel, options: {
        tabIDs: string[];
        tabTitles: string[];
    }): {
        base: Panel;
        panels: Map<string, Panel>;
        state: (newTab?: string) => string;
        onStateChange: (action?: ((currentTab: string) => void) | undefined) => void;
    };
    export function radioSelection<T extends string>(root: Panel, id: string, options: {
        radioOptions: T[];
        title?: string;
        texts?: string[];
        defaultState?: T;
    }): {
        root: Panel;
        base: Panel;
        title: (text?: string) => string;
        texts: (texts?: string[]) => string[];
        state: (newState?: T | undefined) => T;
        onStateChange: (action?: ((state: T) => void) | undefined) => void;
    };
    export function checkBox(root: Panel, id: string, options?: {
        text?: string;
        defaultState?: boolean;
    }): {
        root: Panel;
        base: ToggleButton;
        state: (newState?: boolean) => boolean;
        text: (text?: string) => string;
        onStateChange: (action?: ((state: boolean) => void) | undefined) => void;
    };
    export function textEntry(root: Panel, id: string, options?: {
        text?: string;
    }): {
        base: Panel;
        text: (text?: string) => string;
        actions: {
            actionTextChange: (text: string) => void;
            actionSubmit: (text: string) => void;
        };
    };
    export function editabelTextEntry(root: Panel, id: string, options?: {
        text?: string;
    }): {
        base: Panel;
        text: (text?: string) => string;
        onStateChange: (action?: ((currentText: string) => void) | undefined) => void;
    };
}
declare module "kvConstructor" {
    export type CAbilityType = "basic" | "ultimate";
    export type CAbilityBehavior = "noTarget" | "pointTarget" | "unitTarget";
    export type CAbilityTargetTeam = "teamEnemy" | "teamFriendly" | "teamBoth";
    export type CAbilityValueItem = {
        name: string;
        value: string;
    };
    export type KVData = {
        abilityName: string;
        abilityType: CAbilityType;
        abilityBehavior: CAbilityBehavior;
        abilityTargetTeam: CAbilityTargetTeam;
        spellImmune: boolean;
        abilityValues: CAbilityValueItem[];
    };
    export function constructKV(data: KVData): string;
}
declare module "dataDefinition" {
    import { KVData } from "kvConstructor";
    /**
     * Singular: Tab for 1st step, Data Definition
     */
    export function dataDefinitionPage(root: Panel, id: string): {
        base: Panel;
        state: () => KVData;
    };
}
declare module "functionExamples" {
    import { KVData } from "kvConstructor";
    export function functionExamples(root: Panel, id: string, options: KVData): {
        base: Panel;
        state: () => {
            title: string;
            behavior: string;
        }[];
    };
}
declare module "components/popup" {
    export function popupManager(root: Panel): {
        base: Panel;
        createPopup: () => {
            panel: Panel;
            close: () => void;
            hide: () => void;
            show: () => void;
            onBackgroundClick: (action?: (() => void) | undefined) => void;
        };
    };
    export const PopupManager: {
        base: Panel;
        createPopup: () => {
            panel: Panel;
            close: () => void;
            hide: () => void;
            show: () => void;
            onBackgroundClick: (action?: (() => void) | undefined) => void;
        };
    };
}
declare module "components/window" {
    type Size = {
        w: number;
        h: number;
    };
    /**
     * Wrapper: Window from root panel, .
     * @param root base panel for the window.
     * @returns 'panel' is the container panel for next modifications.
     */
    export function customWindow(root: Panel, id: string, options?: {
        title?: string;
        size?: Size;
    }): {
        base: Panel;
        panel: Panel;
        title: (text?: string) => string;
        size: (size?: Size) => Size;
        onClose: (action?: (() => void) | undefined) => void;
    };
}
declare module "functionImplementation" {
    export function codeContainer(root: Panel, id: string): void;
}
declare module "hud" {
    export function Main(): void;
}
declare module "components/customPanel" {
    export function newPanel<T, U>(fun: (root: Panel, id: string, ...params: T[]) => U, root: Panel, id: string, params: T): U;
}
declare module "components/inputs" {
    export function radioSelection<T extends string>(root: Panel, id: string, options: {
        radioOptions: T[];
        title?: string;
        texts?: string[];
        defaultState?: T;
    }): {
        root: Panel;
        base: Panel;
        title: (text?: string) => string;
        texts: (texts?: string[]) => string[];
        state: (newState?: T | undefined) => T;
        onStateChange: (action?: ((state: T) => void) | undefined) => void;
    };
    export function checkBox(root: Panel, id: string, options?: {
        text?: string;
        defaultState?: boolean;
    }): {
        root: Panel;
        base: ToggleButton;
        state: (newState?: boolean) => boolean;
        text: (text?: string) => string;
        onStateChange: (action?: ((state: boolean) => void) | undefined) => void;
    };
    export function textEntry(root: Panel, id: string, options?: {
        text?: string;
    }): {
        base: Panel;
        text: (text?: string) => string;
    };
    export function editabelTextEntry(root: Panel, id: string, options?: {
        text?: string;
    }): {
        base: Panel;
        text: (text?: string) => string;
        onStateChange: (action?: ((currentText: string) => void) | undefined) => void;
    };
}
declare module "components/pageElements" {
    export function sectionHeader(root: Panel, options?: {
        title?: string;
    }): {
        root: Panel;
        text: (title?: string) => string;
    };
    export function columns(root: Panel, options: {
        count: number;
    }): {
        base: Panel;
        panels: Panel[];
    };
    export function tabs(root: Panel, options: {
        tabIDs: string[];
        tabTitles: string[];
    }): {
        base: Panel;
        panels: Map<string, Panel>;
        state: (newTab?: string) => string;
        onStateChange: (action?: ((currentTab: string) => void) | undefined) => void;
    };
}
