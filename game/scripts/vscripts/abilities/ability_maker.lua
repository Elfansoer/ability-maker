ability_maker = class({})
function ability_maker:OnSpellStart()
    InteropManager:SendToClient( self:GetCaster():GetPlayerOwner(), "openWindow", {} )
end