declare enum ResolveStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    FINISHED = 2
}
type ModuleName = string;
type ExportName = string;
type ExportHandle = any;
type Exporter = (name: ExportName, handle: ExportHandle) => void;
type Context = {
    id: any;
};
type Setters = ((moduleExports: Exports) => void)[];
type Execute = () => void;
type Callback = (exporter: Exporter, context: Context) => {
    setters: Setters;
    execute: Execute;
};
type Exports = Partial<Record<ExportName, ExportHandle>>;
type Module = {
    dependencies: ModuleName[];
    exports: Exports;
    setters: Setters;
    execute: Execute;
    status: ResolveStatus;
};
declare class SystemClass {
    modules: Partial<Record<ModuleName, Module>>;
    mainModuleName?: string;
    mainModuleFunc?: Function;
    constructor();
    register(name: ModuleName, dependencyList: ModuleName[], callback: Callback): void;
    startSystem(): void;
    resolveModule(moduleName: ModuleName): Module;
}
declare const System: SystemClass;
