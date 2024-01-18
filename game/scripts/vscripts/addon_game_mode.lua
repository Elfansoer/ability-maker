-- dotadoc = require "util/sublime_json"

-- Generated from template


function Precache( context )
	--[[
		Precache things we know we'll use.  Possible file types include (but not limited to):
			PrecacheResource( "model", "*.vmdl", context )
			PrecacheResource( "soundfile", "*.vsndevts", context )
			PrecacheResource( "particle", "*.vpcf", context )
			PrecacheResource( "particle_folder", "particles/folder", context )
	]]
	PrecacheResource( "particle", "particles/ui_mouseactions/range_finder_cone.vpcf", context )
end

-- Create the game mode when we activate
function Activate()
	GameRules.AddonTemplate = AbilityMakerGame()
	GameRules.AddonTemplate:InitGameMode()
end

if AbilityMakerGame == nil then
	AbilityMakerGame = class({})
end

function AbilityMakerGame:InitGameMode()
	GameRules:GetGameModeEntity():SetThink( "OnThink", self, "GlobalThink", 2 )
end

-- Evaluate the state of the game
function AbilityMakerGame:OnThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
		--print( "Template addon script is running." )
	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end
	return 1
end
