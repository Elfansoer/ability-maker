--[[ Created by Elfansoer ]]
JSON = require( "internal.dkjson" )
InteropManager = InteropManager or class({})
function InteropManager:Initialize()
    self.eventHandlers = {}

    self.listener = CustomGameEventManager:RegisterListener( "customListener" , function( userID, rawData )
        local player = EntIndexToHScript( userID )
        local eventName = rawData.name
        local data = JSON.decode( rawData.json )

        local eventHandler = self.eventHandlers[eventName]
        if not eventHandler then return end
        for key, callback in pairs(eventHandler) do
            callback( player, data )
        end
    end)
end

function InteropManager:Subscribe( eventName, callback )
    local uniqueStr = DoUniqueString( "InteropManager.Subscribe" )
    self.eventHandlers[ eventName ] = self.eventHandlers[ eventName ] or {}
    self.eventHandlers[ eventName ][ uniqueStr ] = callback
    return uniqueStr
end

function InteropManager:Unsubscribe( subscriberID )
    for _, eventHandler in pairs(self.eventHandlers) do
        eventHandler[subscriberID] = nil
    end
end

function InteropManager:SendToClient( player, eventName, data )
    CustomGameEventManager:Send_ServerToPlayer( player, eventName, {json = JSON.encode(data)} )
end

function InteropManager:SendToTeam( teamNumber, eventName, data )
    CustomGameEventManager:Send_ServerToTeam( teamNumber, eventName, {json = JSON.encode(data)} )
end

function InteropManager:SendToAllClient( eventName, data )
    CustomGameEventManager:Send_ServerToAllClients( eventName, {json = JSON.encode(data)} )
end

if not IsScriptReload() then
    InteropManager:Initialize()
end