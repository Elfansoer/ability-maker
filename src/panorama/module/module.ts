enum ResolveStatus {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED,
}

type ModuleName = string;
type ExportName = string;
type ExportHandle = any;

type Exporter = (name: ExportName, handle: ExportHandle)=>void;
type Context = {id: any};
type Setters = ((moduleExports: Exports)=>void)[];
type Execute = ()=>void;

type Callback = (exporter: Exporter, context: Context)=>{ setters: Setters, execute: Execute };
type Exports = Partial<Record<ExportName,ExportHandle>>;

type Module = {
    dependencies: ModuleName[],
    exports: Exports,
    setters: Setters,
    execute: Execute,
    status: ResolveStatus,
}

class SystemClass {
    modules: Partial<Record<ModuleName,Module>> = {};
    mainModuleName?: string;
    mainModuleFunc?: Function;
    
    constructor() {
        this.startSystem();
    }

    register(name: ModuleName, dependencyList: ModuleName[], callback: Callback) {
        $.Msg( "Registering module: ", name );

        const exports: Exports = {};
        const resolution = callback(
            ( exportName, exportHandle )=>{
                exports[exportName] = exportHandle;
            },
            {id: 0}
        );

        this.modules[name] = {
            dependencies: dependencyList,
            status: ResolveStatus.NOT_STARTED,
            execute: resolution.execute,
            setters: resolution.setters,
            exports: exports,
        }

        if (exports["Main"]) {
            if (!this.mainModuleName) {
                this.mainModuleName = name;
                this.mainModuleFunc = exports.Main;
            } else {
                throw( `There can only be one exported 'Main' function. Previously exported main in here: ${this.mainModuleName}` );
            }
        }
    }

    startSystem() {
        $.Schedule(0,()=>{
            if (!this.mainModuleName || !this.mainModuleFunc) {
                throw( `No 'Main' function found. Export a 'Main' function at the entry point of the bundle.` )
            } else {
                $.Msg("Creating main bundle: " + this.mainModuleName);
                this.resolveModule(this.mainModuleName);
                this.mainModuleFunc();
            }
        });
    }

    resolveModule( moduleName: ModuleName ) {
        const module = this.modules[moduleName];
        if (!module) {
            throw( "Module not found: " + moduleName );
        }

        switch(module.status) {
            case ResolveStatus.NOT_STARTED: {
                $.Msg("Resolving module: " + moduleName);
                module.status = ResolveStatus.IN_PROGRESS;

                for (let index = 0; index < module.dependencies.length; index++) {
                    const depModule = this.resolveModule( module.dependencies[index] );
                    module.setters[index]( depModule.exports );
                }
                module.execute();
    
                module.status = ResolveStatus.FINISHED;
            } break;

            case ResolveStatus.IN_PROGRESS: {
                throw( "Recursive module: " + moduleName );
            };

            case ResolveStatus.FINISHED: break;
        }

        return module;
    }
}
const System = new SystemClass();