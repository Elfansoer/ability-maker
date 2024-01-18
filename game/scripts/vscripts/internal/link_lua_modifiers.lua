--[[ Created by Elfansoer ]]
ModifierLinks = ModifierLinks or class({})
function ModifierLinks:Initialize()
    self.modifierList = {}
end

-- TODO: Auto-deduce file path
function ModifierLinks:RegisterModifier( modifierName, modifierPath, modifierType )
    self.modifierList[modifierName] = {modifierPath,modifierType}
end

function ModifierLinks:LinkModifiers()
    for name, valueTable in pairs(self.modifierList) do
        LinkLuaModifier( name, valueTable[1], valueTable[2] or LUA_MODIFIER_MOTION_NONE)
    end
end

if not IsScriptReload() then
    ModifierLinks:Initialize()
end