
export type CAbilityType = "basic" | "ultimate"
export type CAbilityBehavior = "noTarget" | "pointTarget" | "unitTarget"
export type CAbilityTargetTeam = "teamEnemy" | "teamFriendly" | "teamBoth"
export type CAbilityValueItem = {
    name: string,
    value: string,
}
export type KVData = {
    abilityName: string,
    abilityType: CAbilityType,
    abilityBehavior: CAbilityBehavior,
    abilityTargetTeam: CAbilityTargetTeam,
    spellImmune: boolean,
    abilityValues: CAbilityValueItem[]
}

export function constructKV( data: KVData ) {
    let abilityType: string;
    switch(data.abilityType) {
        case "basic": abilityType = "DOTA_ABILITY_TYPE_BASIC"; break;
        case "ultimate": abilityType = "DOTA_ABILITY_TYPE_ULTIMATE"; break;
    }

    let abilityBehavior: string;
    switch(data.abilityBehavior) {
        case "noTarget": abilityBehavior = "DOTA_ABILITY_BEHAVIOR_NO_TARGET"; break;
        case "unitTarget": abilityBehavior = "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET"; break;
        case "pointTarget": abilityBehavior = "DOTA_ABILITY_BEHAVIOR_POINT_TARGET"; break;
    }

    let abilityTargetTeam: string;
    switch(data.abilityTargetTeam) {
        case "teamEnemy": abilityTargetTeam = "DOTA_UNIT_TARGET_TEAM_ENEMY"; break;
        case "teamFriendly": abilityTargetTeam = "DOTA_UNIT_TARGET_TEAM_FRIENDLY"; break;
        case "teamBoth": abilityTargetTeam = "DOTA_UNIT_TARGET_TEAM_BOTH"; break;
    }

    let abilityFlags: string;
    switch(data.spellImmune) {
        case true: abilityFlags = "DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES"; break;
        case false: abilityFlags = "DOTA_UNIT_TARGET_FLAG_NONE"; break;
    }

    let spellImmune: string;
    switch(data.spellImmune) {
        case true: spellImmune = "SPELL_IMMUNITY_ENEMIES_YES"; break;
        case false: spellImmune = "SPELL_IMMUNITY_ENEMIES_NO"; break;
    }

    let abilityValues: string = "";
    const abilityValuesIndent = "            ";
    for (const item of data.abilityValues) {
        abilityValues += `\n${abilityValuesIndent}"${item.name}" "${item.value}"`
    }

return `
"DOTAAbilities"
{
    "${data.abilityName}"
    {
        "BaseClass"                 "ability_lua"
        "ScriptFile"                "lua_abilities/${data.abilityName}/${data.abilityName}"
        "AbilityTextureName"        "${data.abilityName}"
        "MaxLevel"                  "${data.abilityType=="basic" ? 4 : 3}"

        "AbilityType"               "${abilityType}"
        "AbilityBehavior"           "${abilityBehavior}"
        "AbilityUnitTargetTeam"     "${abilityTargetTeam}"
        "AbilityUnitTargetType"     "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC"
        "AbilityUnitTargetFlags"    "${abilityFlags}"
        "AbilityUnitDamageType"     "DAMAGE_TYPE_MAGICAL"
        "SpellDispellableType"      "SPELL_DISPELLABLE_YES"
        "SpellImmunityType"         "${spellImmune}"

        "AbilityCastRange"          "600"
        "AbilityCastPoint"          "0.3"
        "AbilityCooldown"           "10.0"
        "AbilityManaCost"           "100"

        "AbilityValues"
        {${abilityValues}
        }
    }
}`
}