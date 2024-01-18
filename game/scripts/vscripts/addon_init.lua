-- script reload test
local scriptReloadBrand = (SCRIPT_RELOAD~=nil)
function IsScriptReload()
    return scriptReloadBrand
end
SCRIPT_RELOAD = true

-- link modifiers
require("internal/link_lua_modifiers")