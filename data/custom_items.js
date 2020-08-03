
var rare_prefix = ["Armageddon", "Beast", "Bitter", "Blood", "Bone", "Bramble", "Brimstone", "Carrion", "Chaos", "Corpse", "Corruption", "Cruel", "Death", "Demon", "Dire", "Dread", "Doom", "Eagle", "Empyrian", "Entropy", "Fiend", "Gale", "Ghoul", "Glyph", "Grim", "Hailstone", "Havoc", "Imp", "Loath", "Order", "Pain", "Plague", "Raven", "Rift", "Rule", "Rune", "Shadow", "Skull", "Soul", "Spirit", "Stone", "Storm", "Viper", "Warp", "Wraith"];
var rare_suffix = {
	helm:["Brow", "Casque", "Circlet", "Cowl", "Crest", "Hood", "Horn", "Mask", "Veil", "Visage", "Visor"],
	armor:["Carapace", "Cloak", "Coat", "Hide", "Jack", "Mantle", "Pelt", "Shroud", "Suit", "Wrap"],
	gloves:["Claw", "Clutches", "Finger", "Fist", "Grasp", "Grip", "Hand", "Hold", "Knuckle", "Touch"],
	boots:["Blazer","Brogues","Greave","Nails","Slippers", "Spur","Stalker","Track","Trample","Tread"],
	belt:["Buckle", "Chain", "Clasp", "Cord", "Fringe", "Harness", "Lash", "Lock", "Strap", "Winding"],
	amulet:["Beads", "Collar", "Gorget", "Heart", "Necklace", "Noose", "Scarab", "Talisman", "Torc"],
	ring:["Band", "Circle", "Coil", "Eye", "Finger", "Grasp", "Grip", "Gyre", "Hold", "Knuckle", "Loop", "Nails", "Spiral", "Touch", "Turn", "Whorl"],
	shield:["Aegis", "Badge", "Emblem", "Guard", "Mark", "Rock", "Shield", "Tower", "Ward", "Wing", "Shell"],
	axe:["Beak", "Bite", "Cleaver", "Edge", "Gnash", "Mangler", "Reaver", "Rend", "Scythe", "Sever", "Slayer", "Song", "Spawn", "Splitter", "Sunder", "Thirst"],
	mace:["Bane", "Blow", "Brand", "Breaker", "Crack", "Crusher", "Grinder", "Knell", "Mallet", "Ram", "Smasher", "Star"],
	sword:["Barb", "Bite", "Cleaver", "Edge", "Fang", "Gutter", "Impaler", "Needle", "Razor", "Saw", "Scalpel", "Scratch", "Scythe", "Sever", "Skewer", "Spike", "Song", "Stinger", "Thirst", "Wand"],
	spear:["Barb", "Branch", "Dart", "Fang", "Goad", "Gutter", "Impaler", "Lance", "Nails", "Needle", "Prod", "Scourge", "Scratch", "Skewer", "Spike", "Stinger", "Wand", "Wrack"],
	bow:["Bolt", "Branch", "Fletch", "Flight", "Horn", "Nock", "Quarrel", "Quill", "Song", "Stinger", "Thirst"],
	staff:["Branch", "Call", "Chant", "Cry", "Goad", "Gnarl", "Spell", "Spire", "Song", "Weaver"],
	scepter:["Blow", "Breaker", "Call", "Chant", "Crack", "Crusher", "Cry", "Gnarl", "Grinder", "Knell", "Ram", "Smasher", "Song", "Spell", "Star", "Weaver"],
	other:["Scratch","Fang","Thirst","Rend","Star","Bane","Spike","Scourge","Barb","Horn","Song","Brand","Loom"],	// dagger, throwing weapon, javelin, polearm, crossbow, wand, claw, orb, amazon weapon, quiver
};

// toggleCustom - 
// ---------------------------------
function toggleCustom(checked) {
	if (checked == true) { document.getElementById("item_editing").style.display = "block" }
	else { document.getElementById("item_editing").style.display = "none" }
}

// loadCustomization - 
// ---------------------------------
function loadCustomization() {
	var options = "";
	for (group in item_groups) { options += "<option class='gray-all'>" + group + "</option>" }
	document.getElementById("dropdown_group").innerHTML = options
	// these lines just set the default to a Rare Phase Blade
	document.getElementById("dropdown_group").selectedIndex = 7
	setGroup(document.getElementById("dropdown_group").value)
	document.getElementById("dropdown_type").selectedIndex = 2
	setType(document.getElementById("dropdown_type").value)
	document.getElementById("dropdown_base").selectedIndex = 32
	setBase(document.getElementById("dropdown_base").value)
	document.getElementById("dropdown_rarity").selectedIndex = 2
	setRarity(document.getElementById("dropdown_base").value)
	// TODO: Expand Options to make selecting specific items easier?
	//		- add 'any' option for Type/Base
	//		- setBase() should adjust Type if it's 'any'
	//		- setName() should adjust Type/Base if either are 'any'
}
// 
// ---------------------------------
function setGroup(value) {
	loadType(value)
}
// 
// ---------------------------------
function loadType(value) {
	var options = "";
	for (type in item_groups[value]) { options += "<option class='gray-all'>" + item_groups[value][type] + "</option>" }
	document.getElementById("dropdown_type").innerHTML = options
	loadBase(document.getElementById("dropdown_type").value)
}
// 
// ---------------------------------
function setType(value) {
	loadBase(value)
}
// 
// ---------------------------------
function loadBase(value) {
	value = value.split(" ").join("_")
	var options = "";
	for (base in item_types[value]) { options += "<option class='gray-all'>" + item_types[value][base] + "</option>" }
	document.getElementById("dropdown_base").innerHTML = options
	loadRarity(document.getElementById("dropdown_base").value)
}
// 
// ---------------------------------
function setBase(value) {
	loadRarity(value)
}
// 
// ---------------------------------
function loadRarity(value) {
	var options = "";
	var rarities = ["Regular","Magic","Rare"];
	for (rarity in rarities) {
		options += "<option class='gray-all'>" + rarities[rarity] + "</option>"
	}
	var capable_unique = false;
	var capable_set = false;
	var options_name_unique = "";
	var options_name_set = "";
	for (group in equipment) {
		for (itemNew in equipment[group]) {
			var item = equipment[group][itemNew];
			if (item.base == value) {
				if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { capable_unique = true }
				else if (item.rarity == "set") { capable_set = true }
			}
		}
	}
	if (capable_unique == true) { options += "<option class='gray-all'>" + "Unique" + "</option>" }
	if (capable_set == true) { options += "<option class='gray-all'>" + "Set" + "</option>" }
	if (value == "Small Charm" || value == "Large Charm" || value == "Grand Charm") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
	if (value == "Jewel") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
	if (value == "Amulet" || value == "Ring") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" + "<option class='gray-all'>" + "Set" + "</option>" }
	if (value == "Arrows" || value == "Bolts") { options = "<option class='gray-all'>" + rarities[0] + "</option>" + "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
	document.getElementById("dropdown_rarity").innerHTML = options
	
	// keeps the previous rarity if possible
	var new_index = document.getElementById("dropdown_rarity").length-1;
	if (typeof(itemCustom.rarity) != 'undefined') {
		for (let i = 0; i < document.getElementById("dropdown_rarity").length; i++) {
			var i_rarity = document.getElementById("dropdown_rarity").options[i].value;
			if (itemCustom.rarity == i_rarity.toLowerCase()) { new_index = i }		
		}
	}
	document.getElementById("dropdown_rarity").selectedIndex = new_index
	
	loadName(document.getElementById("dropdown_rarity").value)
}
// 
// ---------------------------------
function setRarity(value) {
	loadName(value)
}
// 
// ---------------------------------
function loadName(value) {
	var options = "";
	if (value == "Unique" || value == "Set") {
		for (group in equipment) {
			for (itemNew in equipment[group]) {
				var item = equipment[group][itemNew];
				var base = document.getElementById("dropdown_base").value;
				var type = document.getElementById("dropdown_type").value;
				if (item.base == base || (itemNew != 0 && item.special != 1 && ((base == "Amulet" && group == "amulet") || (base == "Ring" && group == "ring") || (base == "Jewel" && item.type == "jewel") || (type == "charm" && group == "charms" && base.toLowerCase().split(" ")[0] == item.size) || (type == "quiver" && item.type == "quiver")))) {
					if (value == "Unique") { if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { options += "<option class='gray-all'>" + item.name + "</option>" } }
					else { if (item.rarity == "set") { options += "<option class='gray-all'>" + item.name + "</option>" } }
				}
			}
		}
	}
	// TODO: Prevent duplicate unique/set items (any with variations) from being duplicated here, if needed
	document.getElementById("dropdown_name").innerHTML = options
	setCustomBase()
	tidyBaseSelection()
	itemCustomAffixes = {}
}
// 
// ---------------------------------
function setName(value) {
	setCustomBase()
	tidyBaseSelection()
	itemCustomAffixes = {}
}
// 
// ---------------------------------
function setCustomBase() {
	var group = document.getElementById("dropdown_group").value;
	var type = document.getElementById("dropdown_type").value;
	var base = document.getElementById("dropdown_base").value;
	var rarity = document.getElementById("dropdown_rarity").value;
	var name = document.getElementById("dropdown_name").value;
	data = {superior:{index:[0],categories:{}},automod:{index:[0],categories:{}},pointmod:{index:[0],categories:{}},affix:[{index:[0],categories:{}},{index:[0],categories:{}}],corruption:{index:[0],categories:{}}};
	itemCustom = {}
	itemCustom.name_prefix = ""
	itemCustom.name_suffix = ""
	itemCustom.req_level = 1
	
	if (type != "amulet" && type != "ring" && type != "quiver" && type != "charm" && type != "jewel") {
		var base_id = bases[base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
		for (affix in base_id) { itemCustom[affix] = base_id[affix] }
		itemCustom.original_base = itemCustom.base;
		itemCustom.original_tier = itemCustom.tier;
		if (itemCustom.tier == 1) { itemCustom.upgrade2 = bases[itemCustom.upgrade.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")].upgrade }
	} else {
		if (type == "amulet") { itemCustom.CODE = "amu" }
		else if (type == "ring") { itemCustom.CODE = "rin" }
		else if (type == "charm") {
			if (base == "Small Charm") { itemCustom.CODE = "cm1" }
			else if (base == "Large Charm") { itemCustom.CODE = "cm2" }
			else if (base == "Grand Charm") { itemCustom.CODE = "cm3" }
		}
		else if (type == "jewel") { itemCustom.CODE = "jew" }
		else if (type == "quiver") {
			itemCustom.quiv = true
			if (base == "Arrows") {
				if (rarity == "Regular") { itemCustom.CODE = "aqv"; itemCustom.name = "Rusted Arrows"; itemCustom.NAME = "Rusted Arrows"; }
				else { itemCustom.CODE = "aq2" }
			} else if (base == "Bolts") {
				if (rarity == "Regular") { itemCustom.CODE = "cqv"; itemCustom.name = "Rusted Bolts"; itemCustom.NAME = "Rusted Bolts"; }
				else { itemCustom.CODE = "cq2" }
			}
		}
	}
	if (rarity == "Set" || rarity == "Unique") {
		for (group in equipment) {
			for (itemNew in equipment[group]) {
				if (equipment[group][itemNew].name == name) {
					for (affix in equipment[group][itemNew]) { itemCustom[affix] = equipment[group][itemNew][affix] }
				}
			}
		}
	}
	itemCustom.type_affix = type
	itemCustom.base = base
	itemCustom.rarity = rarity.toLowerCase()
	if (rarity == "Set" || rarity == "Unique") { itemCustom.name = name }
	else if (rarity == "Regular" || rarity == "Magic") { itemCustom.name = base }
	//else if (rarity == "Magic") { itemCustom.name = "___ "+base+" of __" }
	else if (rarity == "Rare") {
		var suffix = "";
		if (itemCustom.shield == true) { suffix = rare_suffix["shield"][Math.floor(Math.random()*rare_suffix["shield"].length)] }
		else if (itemCustom.ARMOR == true) { suffix = rare_suffix[group][Math.floor(Math.random()*rare_suffix[group].length)] }
		else if (typeof(rare_suffix[type]) != 'undefined') { suffix = rare_suffix[type][Math.floor(Math.random()*rare_suffix[type].length)] }
		else { suffix = rare_suffix["other"][Math.floor(Math.random()*rare_suffix["other"].length)] }
		itemCustom.name = rare_prefix[Math.floor(Math.random()*rare_prefix.length)] + " " + suffix
	}
	itemCustom[itemCustom.CODE] = true
	loadEditing()
}
// 
// ---------------------------------
function tidyBaseSelection() {
	if (document.getElementById("dropdown_type").length == 1) { document.getElementById("select_type").style.display = "none" }
	else { document.getElementById("select_type").style.display = "inline" }
	if (document.getElementById("dropdown_name").innerHTML == "") { document.getElementById("select_name").style.display = "none" }
	else { document.getElementById("select_name").style.display = "inline" }
}










// 
// ---------------------------------
function getMatch(kind) {
	var result = false;
	if (kind == "identified" && itemCustom.rarity != "regular") { result = true }
	if (kind == "ethereal" && !((itemCustom.WEAPON != true && itemCustom.ARMOR != true) || itemCustom.rarity == "set" || itemCustom["7cr"] == true || itemCustom.name == "Crown of Ages" || itemCustom.name == "Leviathan" || itemCustom.name == "Tyrael's Might" || itemCustom.name == "The Gavel of Pain" || itemCustom.name == "Schaefer's Hammer" || itemCustom.name == "Butcher's Pupil" || itemCustom.name == "Doombringer" || itemCustom.name == "The Grandfather" || itemCustom.name == "Wizardspike" || itemCustom.name == "Stormspire" || itemCustom.name == "Steel Pillar" || itemCustom.name == "Stormshield")) { result = true }
	if (kind == "sockets" && itemCustom.rarity == "regular" && typeof(itemCustom.max_sockets) != 'undefined') { result = true }
	if (kind == "quality" && itemCustom.rarity == "regular" && itemCustom.affix_type != "quiver") { result = true }
	if (kind == "automod" && itemCustom.rarity != "unique" && itemCustom.rarity != "set" && (itemCustom.CL3 || itemCustom.CL4 || itemCustom.CL6 || itemCustom.CL7)) { result = true }
	if (kind == "pointmod" && itemCustom.rarity != "unique" && itemCustom.rarity != "set" && (itemCustom.CL1 || itemCustom.CL2 || itemCustom.CL4 || itemCustom.CL5 || itemCustom.CL6 || itemCustom.WP11 || itemCustom.WP12 || itemCustom.WP13) && !(itemCustom.CL5 == true && (itemCustom.tier == 1 || itemCustom["9ar"] == true || itemCustom["9wb"] == true || itemCustom["9xf"] == true))) { result = true }
	if (kind == "affix" && (itemCustom.rarity == "magic" || itemCustom.rarity == "rare" || itemCustom.rarity == "craft")) { result = true }
	if (kind == "corruption" && itemCustom.rarity != "regular" && itemCustom.type_affix != "charm" && itemCustom.type_affix != "jewel" && !(itemCustom.sockets > 0)) { result = true }
	if (kind == "upgrade" && (itemCustom.rarity == "unique" || itemCustom.rarity == "rare") && (itemCustom.tier == 1 || itemCustom.tier == 2)) { result = true }
	return result
}
// 
// ---------------------------------
function getALVL() {
	var type = itemCustom.type_affix;
	var base_qlvl = 1;
	var magic_lvl = 0;
	var ilvl = character.ILVL;
	var x = 0;
	var alvl = 0;
	
	if (type != "amulet" && type != "ring" && type != "quiver" && type != "charm" && type != "jewel") { base_qlvl = bases[itemCustom.base.split(" ").join("_").split("-").join("_").split("'s").join("s")].qlvl; }
	else if (itemCustom.base == "Large Charm") { base_qlvl = 14 }
	else if (itemCustom.base == "Small Charm") { base_qlvl = 28 }
	
	if (type == "circlet") {
		if (itemCustom.base == "Circlet") { magic_lvl = 3 }
		else if (itemCustom.base == "Coronet") { magic_lvl = 8 }
		else if (itemCustom.base == "Tiara") { magic_lvl = 13 }
		else if (itemCustom.base == "Diadem") { magic_lvl = 18 }
	} else if (type == "staff" || type == "wand" || type == "orb") {
		magic_lvl = 1
	}

	if (base_qlvl > ilvl) { x = base_qlvl }
	else { x = ilvl }
	if (magic_lvl > 0) { x = x + magic_lvl }
	else {
		if (x < (99 - base_qlvl/2)) { x = x - base_qlvl/2 }
		else { x = 2*x - 99 }
	}
	if (x > 99) { alvl = 99 }
	else { alvl = x }
	
	return alvl
}
// 
// ---------------------------------
function loadEditing() {
	for (let n = 1; n <= 2; n++) { document.getElementById("select_superior_"+n).style.display = "none"; document.getElementById("select_superior_value_"+n).style.display = "none"; }
	for (let n = 1; n <= 3; n++) { document.getElementById("select_pointmod_"+n).style.display = "none"; document.getElementById("select_pointmod_value_"+n).style.display = "none"; }
	for (let n = 1; n <= 2; n++) { document.getElementById("select_automod_value_"+n).style.display = "none"; }
	for (let n = 1; n <= 6; n++) { document.getElementById("select_affix_"+n).style.display = "none"; for (let m = 1; m <= 3; m++) { document.getElementById("select_affix_value_"+n+"_"+m).style.display = "none"; }; }
	for (let n = 1; n <= 2; n++) { document.getElementById("select_corruption_value_"+n).style.display = "none"; }
	
	var selects = ["identified","ethereal","sockets","quality","automod","pointmod","affix","corruption","upgrade"];
	for (s in selects) {
		var divs = [];
		var result = "none";
		if (selects[s] == "affix") {
			divs[divs.length] = "select_"+selects[s]+"_1"
			divs[divs.length] = "select_"+selects[s]+"_4"
		} else if (selects[s] == "pointmod") {
			divs[divs.length] = "select_"+selects[s]+"_1"
		} else {
			divs[divs.length] = "select_"+selects[s]
		}
		if (getMatch(selects[s])) { result = "block" }
		for (i in divs) { document.getElementById(divs[i]).style.display = result }
		if (getMatch(selects[s])) { load(selects[s]) }
	}
}
// 
// ---------------------------------
function load(kind) {
	var alvl = getALVL();
	var options = "<option class='gray-all'>" + "None" + "</option>";
	if (kind == "sockets") {
		// TODO: reference list of max sockets if ilvl < 40
		for (let i = 1; i <= itemCustom.max_sockets; i++) { options += "<option class='gray-all'>"+i+"</option>" }
		document.getElementById("dropdown_sockets").innerHTML = options
	} else if (kind == "quality") {
		options += "<option class='gray-all'>" + "Inferior" + "</option>"
		options += "<option class='gray-all'>" + "Superior" + "</option>"
		document.getElementById("dropdown_quality").innerHTML = options
	} else if (kind == "automod") {
		for (a in affixes_automod) {
			var aff = affixes_automod[a];
			options += loadDetails(kind,aff,alvl,aff[0],1,aff[2],aff[3],aff[4],aff[6],aff[7],aff[10],"",[aff[13]],[])
		}
		document.getElementById("dropdown_automod").innerHTML = options
	} else if (kind == "pointmod") {
		for (a in affixes_pointmod) {
			var aff = affixes_pointmod[a];
			options += loadDetails(kind,aff,alvl,1,1,1,aff[0],aff[1],aff[3],aff[4],"","",[aff[7],aff[8]],[])
		}
		for (let n = 1; n <= 3; n++) { document.getElementById("dropdown_pointmod_"+n).innerHTML = options }
	} else if (kind == "affix") {
		var options_prefix = options;
		var options_suffix = options;
		for (a in affixes) {
			var aff = affixes[a];
			var included = [aff[22],aff[23],aff[24],aff[25],aff[26],aff[27],aff[28]];
			var excluded = [aff[29],aff[30],aff[31],aff[32],aff[33]];
			if (aff[0] == 1) {
				options_prefix += loadDetails(kind,aff,alvl,aff[0],aff[2],aff[3],aff[4],aff[5],aff[9],aff[10],aff[14],aff[18],included,excluded)
			} else {
				options_suffix += loadDetails(kind,aff,alvl,aff[0],aff[2],aff[3],aff[4],aff[5],aff[9],aff[10],aff[14],aff[18],included,excluded)
			}
		}
		for (let n = 1; n <= 6; n++) {
			if (n < 4) { document.getElementById("dropdown_affix_"+n).innerHTML = options_prefix }
			else { document.getElementById("dropdown_affix_"+n).innerHTML = options_suffix }
		}
	} else if (kind == "corruption") {
		for (a in affixes_corruption) {
			var aff = affixes_corruption[a];
			options += loadDetails(kind,aff,alvl,1,1,1,1,99,1,aff[0],aff[3],"",[aff[6]],[])
		}
		document.getElementById("dropdown_corruption").innerHTML = options
	} else if (kind == "upgrade") {
		if (typeof(itemCustom.upgrade) != 'undefined') { options += "<option class='gray-all'>" + itemCustom.upgrade + "</option>" }
		if (typeof(itemCustom.upgrade2) != 'undefined') { options += "<option class='gray-all'>" + itemCustom.upgrade2 + "</option>" }
		document.getElementById("dropdown_upgrade").innerHTML = options
	} else if (kind == "superior") {
		for (a in affixes_superior) {
			var aff = affixes_superior[a];
			options += loadDetails(kind,aff,alvl,1,1,1,1,99,aff[0],aff[1],"","",[aff[4]],[])
		}
		document.getElementById("dropdown_superior_1").innerHTML = options
		if (itemCustom["WEAPON"] == true) { document.getElementById("dropdown_superior_2").innerHTML = options }
	}
}
// 
// ---------------------------------
function loadDetails(kind,aff,alvl,prefix,spawnable,rare,lvl,maxlvl,group,mod1,mod2,mod3,included,excluded) {
	var options = "";
	if (spawnable == 1 && alvl >= lvl && alvl <= maxlvl && (rare == 1 || itemCustom.rarity == "magic")) {
		var match = false;
		// check inclusions
		for (let i = 0; i < included.length; i++) {
			var atype = included[i];
			if (atype != "") {
				var ait = affix_item_types[atype];
				if (atype != "rod" && atype != "mele" && atype != "blun" && atype != "shld" && atype != "tkni" && atype != "abow" && atype != "aspe") {
					if (itemCustom[ait] == true) { match = true }
				} else if (atype == "tkni" || atype == "abow" || atype == "aspe") {
					if (itemCustom[ait[0]] == true && itemCustom[ait[1]] == true) { match = true }
				} else {
					for (code in ait) { if (itemCustom[ait[code]] == true) { match = true } }
				}
			}
		}
		// check exclusions
		for (let i = 0; i < excluded.length; i++) {
			var atype = excluded[i];
			if (atype != "") {
				var ait = affix_item_types[atype];
				if (atype != "rod" && atype != "mele" && atype != "blun" && atype != "shld" && atype != "tkni" && atype != "abow" && atype != "aspe") {
					if (itemCustom[ait] == true) { match = false }
				} else if (atype == "tkni" || atype == "abow" || atype == "aspe") {
					if (itemCustom[ait[0]] == true && itemCustom[ait[1]] == true) { match = false }
				} else {
					for (code in ait) { if (itemCustom[ait[code]] == true) { match = false } }
				}
			}
		}
		// affixes & their ranges are recorded
		if (match == true) {
			var affix_group = group;
			var cat = mod1+mod2+mod3+affix_group;
			var mod_desc = "";
			var aff_data = data[kind];
			if (kind == "affix") { aff_data = data[kind][prefix] }
			if (typeof(aff_data.categories[cat]) == 'undefined') {
				aff_data.categories[cat] = {info:{},lines:[]}
				var aim_1 = affix_item_mods[mod1]; var mod_1 = "";
				var aim_2 = affix_item_mods[mod2]; var mod_2 = "";
				var aim_3 = affix_item_mods[mod3]; var mod_3 = "";
				if (kind == "pointmod") { aim_1 = mod1 }
				var mods = 0;
				if (mod1 != "") { mods = 1; if (typeof(stats[aim_1]) != 'undefined') { for (i in stats[aim_1].format) { mod_1 += stats[aim_1].format[i]; if (typeof(stats[aim_1].index[i]) != 'undefined') { mod_1 += "#" }; } }; }
				if (mod2 != "") { mods = 2; if (typeof(stats[aim_2]) != 'undefined') { for (i in stats[aim_2].format) { mod_2 += stats[aim_2].format[i]; if (typeof(stats[aim_2].index[i]) != 'undefined') { mod_2 += "#" }; } }; }
				if (mod3 != "") { mods = 3; if (typeof(stats[aim_3]) != 'undefined') { for (i in stats[aim_3].format) { mod_3 += stats[aim_3].format[i]; if (typeof(stats[aim_3].index[i]) != 'undefined') { mod_3 += "#" }; } }; }
				if (mod_1 == mod_2) { mod_2 = "" }
				if (mod_1 != "" && mod_2 != "") { mod_1 += ", " };
				if (mod_3 != "") { mod_2 += ", " };
				mod_desc = mod_1+mod_2+mod_3;
				aff_data.categories[cat].info.group = affix_group
				aff_data.categories[cat].info.desc = mod_desc
				aff_data.categories[cat].info.mods = mods
				aff_data.categories[cat].info.mod1 = aim_1
				aff_data.categories[cat].info.mod2 = aim_2
				aff_data.categories[cat].info.mod3 = aim_3
				aff_data.index[aff_data.index.length] = cat
				if (mod_desc != "") { options += "<option class='gray-all'>"+mod_desc+"</option>" }
			}
			aff_data.categories[cat].lines[aff_data.categories[cat].lines.length] = []
			for (let x = 0; x < aff.length; x++) { aff_data.categories[cat].lines[aff_data.categories[cat].lines.length-1][x] = aff[x] }
		}
	}
	return options
}










// 
// ---------------------------------
function setIdentified(checked) {
	itemCustom.ID = checked
	item_settings.ID = checked
	document.getElementById("dropdown_id").selectedIndex = 0
	if (checked == false) { document.getElementById("dropdown_id").selectedIndex = 1 }
	//setValues()
	setItemFromCustom()
}
// 
// ---------------------------------
function setEthereal(checked) {
	itemCustom.ethereal = checked
	itemCustom.ETH = checked
	//setValues()
	setItemFromCustom()
}
// 
// ---------------------------------
function setSockets(selected) {
	itemCustom.sockets = selected
	//setValues()
	setItemFromCustom()
}
// 
// ---------------------------------
function setQuality(selected) {
	for (let n = 1; n <= 2; n++) {
		document.getElementById("select_superior_"+n).style.display = "none";
		document.getElementById("select_superior_value_"+n).style.display = "none";
	}
	if (selected == 2) {
		document.getElementById("select_superior_1").style.display = "block";
		load("superior");
		itemCustom.superior = true;
		itemCustom.inferior = false;
		itemCustom.name_prefix = "Superior ";
		document.getElementById("dropdown_superior_1").selectedIndex = 1;
		setSuperior(1,1)
	} else {
		data.superior = {index:[0],categories:{}}
		itemCustom.sup = 0;
		itemCustom.superior = false;
		if (selected == 1) {
			itemCustom.inferior = true;
			var inferior_prefixes = ["Low Quality ", "Cracked ", "Crude ", "Damaged "];
			var r = Math.floor(Math.random()*4);
			itemCustom.name_prefix = inferior_prefixes[r];
			// TODO: pointmods cannot be from tier 5/6, and cannot be more than +1
			// TODO: durability & defense/damage may be affected
		} else {
			itemCustom.inferior = false;
			itemCustom.name_prefix = "";
		}
	}
	setValues()
}
// 
// ---------------------------------
function setSuperior(num,selected) {
	// tidy ranges
	if (selected == 0) {
		document.getElementById("select_superior_value_"+num).style.display = "none"
	} else {
		document.getElementById("select_superior_value_"+num).style.display = "block"
		var cat = data.superior.index[selected];
		var mod_min = 1000;
		var mod_max = -100;
		var index = 1;
		for (line in data.superior.categories[cat].lines) {
			var min = data.superior.categories[cat].lines[line][index+1];
			var max = data.superior.categories[cat].lines[line][index+2];
			if (min <= mod_min) { mod_min = min }
			if (max >= mod_max) { mod_max = max }
		}
		document.getElementById("range_superior_"+num).min = mod_min
		document.getElementById("range_superior_"+num).max = mod_max
		document.getElementById("range_superior_"+num).value = mod_max
		document.getElementById("superior_value_"+num).innerHTML = document.getElementById("range_superior_"+num).value
		if (selected == 1) { itemCustom.sup = Number(document.getElementById("range_superior_"+num).value) }
	}
	// tidy incompatible options (disabled options)
	var used_groups = [];
	for (let n = 1; n <= 2; n++) {
		var sel_index = document.getElementById("dropdown_superior_"+n).selectedIndex;
		if (sel_index > 0) {
			used_groups[used_groups.length] = data.superior.categories[data.superior.index[sel_index]].info.group
		}
	}
	for (let n = 1; n <= 2; n++) {
		var sel_index = document.getElementById("dropdown_superior_"+n).selectedIndex;
		var sel_group = 0;
		if (sel_index > 0) { sel_group = data.superior.categories[data.superior.index[sel_index]].info.group }
		for (let o = 1; o < data.superior.index.length; o++) {
			var option_group = data.superior.categories[data.superior.index[o]].info.group;
			document.getElementById("dropdown_superior_"+n).options[o].disabled = false
			for (let i = 0; i < used_groups.length; i++) {
				if (used_groups[i] == option_group && used_groups[i] != sel_group) { document.getElementById("dropdown_superior_"+n).options[o].disabled = true }
			}
		}
	}
	// display no more than 1 empty dropdown for superior affixes
	if (itemCustom.WEAPON == true) {
		var first_empty_index = -1;
		for (let n = 1; n <= 2; n++) {
			document.getElementById("select_superior_"+n).style.display = "block"
			var index = document.getElementById("dropdown_superior_"+n).selectedIndex;
			if (index == 0 && first_empty_index < 0) { first_empty_index = index }
			else if (index == 0) { document.getElementById("select_superior_"+n).style.display = "none" }
		}
	}
	setSuperiorValue(num,document.getElementById("range_superior_"+num).value)
}
// 
// ---------------------------------
function setSuperiorValue(num, value) {
	document.getElementById("superior_value_"+num).innerHTML = value
	if (document.getElementById("dropdown_superior_"+num).selectedIndex == 1) { itemCustom.sup = Number(document.getElementById("range_superior_"+num).value) }
	if (document.getElementById("dropdown_superior_1").selectedIndex != 1 && document.getElementById("dropdown_superior_2").selectedIndex != 1) { itemCustom.sup = 0 }
	setValues()
}
// 
// ---------------------------------
function setAutomod(selected) {
	var mods = 0;
	if (selected > 0) {
		var cat = data.automod.index[selected];
		mods = data.automod.categories[cat].info.mods;
		for (let m = 1; m <= mods; m++) {
			var mod_min = 1000;
			var mod_max = -100;
			var index = 7;
			if (m == 2) { index = 10 }
			for (line in data.automod.categories[cat].lines) {
				var min = data.automod.categories[cat].lines[line][index+1];
				var max = data.automod.categories[cat].lines[line][index+2];
				if (min <= mod_min) { mod_min = min }
				if (max >= mod_max) { mod_max = max }
			}
			document.getElementById("range_automod_"+m).min = mod_min
			document.getElementById("range_automod_"+m).max = mod_max
			document.getElementById("range_automod_"+m).value = mod_max
			document.getElementById("automod_value_"+m).innerHTML = document.getElementById("range_automod_"+m).value
		}
	}
	for (let mod = 1; mod <= 2; mod++) {
		if (mods >= mod) { document.getElementById("select_automod_value_"+mod).style.display = "block" }
		else { document.getElementById("select_automod_value_"+mod).style.display = "none" }
	}
	for (let m = 1; m <= 2; m++) { setAutomodValue(m,document.getElementById("range_automod_"+m).value) }
}
// 
// ---------------------------------
function setAutomodValue(mod, value) {
	document.getElementById("automod_value_"+mod).innerHTML = value
	var selected = document.getElementById("dropdown_automod").selectedIndex;
	if (selected > 0) {
		var cat = data.automod.index[selected];
		var mods = data.automod.categories[cat].info.mods;
		var index = 7;
		if (mod == 2) { index = 10 }
		var mod_line = -1;
		var mod_next_line = -1;
		for (line in data.automod.categories[cat].lines) {
			var min = data.automod.categories[cat].lines[line][index+1];
			var max = data.automod.categories[cat].lines[line][index+2];
			if (value >= min && value <= max) { mod_line = Number(line) }
			if (value < min && mod_next_line < 0) { mod_next_line = Number(line) }
		}
		// invalid values get increased to next available minimum
		if (mod_line < 0) {
			var new_value = data.automod.categories[cat].lines[mod_next_line][index+1];
			document.getElementById("range_automod_"+mod).value = new_value
			document.getElementById("automod_value_"+mod).innerHTML = new_value
			mod_line = mod_next_line
		}
		// invalid values for other mods are set to the nearest valid value
		for (let m = 1; m <= mods; m++) {
			if (m != mod) {
				var m_value = document.getElementById("range_automod_"+m).value;
				var m_index = 7;
				if (m == 2) { m_index = 10 }
				var m_min = data.automod.categories[cat].lines[mod_line][m_index+1];
				var m_max = data.automod.categories[cat].lines[mod_line][m_index+2];
				if (m_value < m_min) {
					document.getElementById("range_automod_"+m).value = m_min
					document.getElementById("automod_value_"+m).innerHTML = m_min
				}
				else if (m_value > m_max) {
					document.getElementById("range_automod_"+m).value = m_max
					document.getElementById("automod_value_"+m).innerHTML = m_max
				}
			}
		}
		data.automod.categories[cat].info.used = mod_line
	}
	setValues()
}
// 
// ---------------------------------
function setPointmod(num,selected) {
	// tidy ranges
	if (selected == 0) {
		document.getElementById("select_pointmod_value_"+num).style.display = "none"
	} else {
		document.getElementById("select_pointmod_value_"+num).style.display = "block"
		document.getElementById("range_pointmod_"+num).min = 1
		document.getElementById("range_pointmod_"+num).max = 3
		document.getElementById("range_pointmod_"+num).value = 3
		document.getElementById("pointmod_value_"+num).innerHTML = document.getElementById("range_pointmod_"+num).value
	}
	// tidy incompatible options (disabled options)
	var used_groups = [];
	for (let n = 1; n <= 3; n++) {
		var sel_index = document.getElementById("dropdown_pointmod_"+n).selectedIndex;
		if (sel_index > 0) {
			used_groups[used_groups.length] = data.pointmod.categories[data.pointmod.index[sel_index]].info.group
		}
	}
	for (let n = 1; n <= 3; n++) {
		var sel_index = document.getElementById("dropdown_pointmod_"+n).selectedIndex;
		var sel_group = 0;
		if (sel_index > 0) { sel_group = data.pointmod.categories[data.pointmod.index[sel_index]].info.group }
		for (let o = 1; o < data.pointmod.index.length; o++) {
			var option_group = data.pointmod.categories[data.pointmod.index[o]].info.group;
			document.getElementById("dropdown_pointmod_"+n).options[o].disabled = false
			for (let i = 0; i < used_groups.length; i++) {
				if (used_groups[i] == option_group && used_groups[i] != sel_group) { document.getElementById("dropdown_pointmod_"+n).options[o].disabled = true }
			}
		}
	}
	// display no more than 1 empty dropdown for pointmods
	var first_empty_index = -1;
	for (let n = 1; n <= 3; n++) {
		document.getElementById("select_pointmod_"+n).style.display = "block"
		var index = document.getElementById("dropdown_pointmod_"+n).selectedIndex;
		if (index == 0 && first_empty_index < 0) { first_empty_index = index }
		else if (index == 0) { document.getElementById("select_pointmod_"+n).style.display = "none" }
	}
	setPointmodValue(num,document.getElementById("range_pointmod_"+num).value)
}
// 
// ---------------------------------
function setPointmodValue(num, value) {
	document.getElementById("pointmod_value_"+num).innerHTML = value
	var selected = document.getElementById("dropdown_pointmod_"+num).selectedIndex;
	if (selected > 0) {
		var cat = data.pointmod.index[selected];
		var mod_line = -1;
		for (line in data.pointmod.categories[cat].lines) {
			var min = data.pointmod.categories[cat].lines[line][5];
			var max = data.pointmod.categories[cat].lines[line][6];
			if (value >= min && value <= max) { mod_line = Number(line) }
		}
		data.pointmod.categories[cat].info.used = 0//mod_line
	}
	setValues()
}
// 
// ---------------------------------
function setAffix(num, selected, prefix) {
	// tidy ranges
	var mods = 0;
	if (selected == 0) {
		for (let m = 1; m <= 3; m++) { document.getElementById("select_affix_value_"+num+"_"+m).style.display = "none" }
		if (itemCustom.rarity == "magic") {
			if (prefix == 1) { itemCustom.name_prefix = "" }
			else if (prefix == 0) { itemCustom.name_suffix = "" }
		}
	} else {
		var cat = data.affix[prefix].index[selected];
		mods = data.affix[prefix].categories[cat].info.mods;
		for (let m = 1; m <= mods; m++) {
			var mod_min = 1000;
			var mod_max = -100;
			var index = 10;
			if (m == 2) { index = 14 }
			if (m == 3) { index = 18 }
			for (line in data.affix[prefix].categories[cat].lines) {
				var min = data.affix[prefix].categories[cat].lines[line][index+2];
				var max = data.affix[prefix].categories[cat].lines[line][index+3];
				if (min <= mod_min) { mod_min = min }
				if (max >= mod_max) { mod_max = max }
			}
			document.getElementById("range_affix_"+num+"_"+m).min = mod_min
			document.getElementById("range_affix_"+num+"_"+m).max = mod_max
			document.getElementById("range_affix_"+num+"_"+m).value = mod_max
			document.getElementById("affix_value_"+num+"_"+m).innerHTML = document.getElementById("range_affix_"+num+"_"+m).value
		}
	}
	for (let mod = 1; mod <= 3; mod++) {
		if (mods >= mod) { document.getElementById("select_affix_value_"+num+"_"+mod).style.display = "block" }
		else { document.getElementById("select_affix_value_"+num+"_"+mod).style.display = "none" }
	}
	// tidy incompatible options (disabled options)
	var used_groups = [];
	for (let n = 1; n <= 6; n++) {
		var pre = 1; if (n >= 4) { pre = 0 }
		var sel_index = document.getElementById("dropdown_affix_"+n).selectedIndex;
		if (sel_index > 0) {
			used_groups[used_groups.length] = data.affix[pre].categories[data.affix[pre].index[sel_index]].info.group
		}
	}
	for (let n = 1; n <= 6; n++) {
		var pre = 1; if (n >= 4) { pre = 0 }
		var sel_index = document.getElementById("dropdown_affix_"+n).selectedIndex;
		var sel_group = 0;
		if (sel_index > 0) { sel_group = data.affix[pre].categories[data.affix[pre].index[sel_index]].info.group }
		for (let o = 1; o < data.affix[pre].index.length; o++) {
			var option_group = data.affix[pre].categories[data.affix[pre].index[o]].info.group;
			document.getElementById("dropdown_affix_"+n).options[o].disabled = false
			for (let i = 0; i < used_groups.length; i++) {
				if (used_groups[i] == option_group && used_groups[i] != sel_group) { document.getElementById("dropdown_affix_"+n).options[o].disabled = true }
			}
		}
	}
	// display no more than 1 empty dropdown for affixes (prefixes/suffixes)
	if (itemCustom.rarity == "rare" || itemCustom.rarity == "craft") {
		var first_empty_index = -1;
		for (let n = 1; n <= 6; n++) {
			document.getElementById("select_affix_"+n).style.display = "block"
			if (n == 4) { first_empty_index = -1 }
			var index = document.getElementById("dropdown_affix_"+n).selectedIndex;
			if (index == 0 && first_empty_index < 0) { first_empty_index = index }
			else if (index == 0) { document.getElementById("select_affix_"+n).style.display = "none" }
		}
	}
	for (let m = 1; m <= 3; m++) { setAffixValue(num,m,document.getElementById("range_affix_"+num+"_"+m).value,prefix) }
}
// 
// ---------------------------------
function setAffixValue(num, mod, value, prefix) {
	document.getElementById("affix_value_"+num+"_"+mod).innerHTML = value
	var selected = document.getElementById("dropdown_affix_"+num).selectedIndex;
	if (selected > 0) {
		var cat = data.affix[prefix].index[selected];
		var mods = data.affix[prefix].categories[cat].info.mods;
		var index = 10;
		if (mod == 2) { index = 14 }
		if (mod == 3) { index = 18 }
		var mod_line = -1;
		var mod_next_line = -1;
		for (line in data.affix[prefix].categories[cat].lines) {
			var min = data.affix[prefix].categories[cat].lines[line][index+2];
			var max = data.affix[prefix].categories[cat].lines[line][index+3];
			if (value >= min && value <= max) { mod_line = Number(line) }
			if (value < min && mod_next_line < 0) { mod_next_line = Number(line) }
		}
		// invalid values get increased to next available minimum
		if (mod_line < 0) {
			var new_value = data.affix[prefix].categories[cat].lines[mod_next_line][index+2];
			document.getElementById("range_affix_"+num+"_"+mod).value = new_value
			document.getElementById("affix_value_"+num+"_"+mod).innerHTML = new_value
			mod_line = mod_next_line
		}
		// invalid values for other mods are set to the nearest valid value
		for (let m = 1; m <= mods; m++) {
			if (m != mod) {
				var m_value = document.getElementById("range_affix_"+num+"_"+m).value;
				var m_index = 10;
				if (m == 2) { m_index = 14 }
				if (m == 3) { m_index = 18 }
				var m_min = data.affix[prefix].categories[cat].lines[mod_line][m_index+2];
				var m_max = data.affix[prefix].categories[cat].lines[mod_line][m_index+3];
				if (m_value < m_min) {
					document.getElementById("range_affix_"+num+"_"+m).value = m_min
					document.getElementById("affix_value_"+num+"_"+m).innerHTML = m_min
				}
				else if (m_value > m_max) {
					document.getElementById("range_affix_"+num+"_"+m).value = m_max
					document.getElementById("affix_value_"+num+"_"+m).innerHTML = m_max
				}
			}
		}
		// name adjusted for magic items
		if (itemCustom.rarity == "magic") {
			var affix_name = data.affix[prefix].categories[cat].lines[mod_line][1];
			if (prefix == 1) { itemCustom.name_prefix = affix_name+" " }
			else if (prefix == 0) { itemCustom.name_suffix = " "+affix_name }
		}
		data.affix[prefix].categories[cat].info.used = mod_line
	}
	setValues()
}
// 
// ---------------------------------
function setCorruption(selected) {
	var mods = 0;
	if (selected > 0) {
		var cat = data.corruption.index[selected];
		mods = data.corruption.categories[cat].info.mods;
		for (let m = 1; m <= mods; m++) {
			var mod_min = 1000;
			var mod_max = -100;
			var index = 0;
			if (m == 2) { index = 3 }
			for (line in data.corruption.categories[cat].lines) {
				var min = data.corruption.categories[cat].lines[line][index+1];
				var max = data.corruption.categories[cat].lines[line][index+2];
				if (data.corruption.categories[cat].lines[line][index] == "sock") {
					if (min > itemCustom.max_sockets) { min = itemCustom.max_sockets }
					if (max > itemCustom.max_sockets) { max = itemCustom.max_sockets }
				}
				if (min <= mod_min) { mod_min = min }
				if (max >= mod_max) { mod_max = max }
			}
			document.getElementById("range_corruption_"+m).min = mod_min
			document.getElementById("range_corruption_"+m).max = mod_max
			document.getElementById("range_corruption_"+m).value = mod_max
			document.getElementById("corruption_value_"+m).innerHTML = document.getElementById("range_corruption_"+m).value
		}
	}
	for (let mod = 1; mod <= 2; mod++) {
		if (mods >= mod) { document.getElementById("select_corruption_value_"+mod).style.display = "block" }
		else { document.getElementById("select_corruption_value_"+mod).style.display = "none" }
	}
	for (let m = 1; m <= 2; m++) { setCorruptionValue(m,document.getElementById("range_corruption_"+m).value) }
}
// 
// ---------------------------------
function setCorruptionValue(num, value) {
	document.getElementById("corruption_value_"+num).innerHTML = value
	setValues()
}
// 
// ---------------------------------
function setUpgrade(selected) {
	var base = itemCustom.original_base;
	var old_max_sockets = itemCustom.max_sockets;
	if (selected > 0) {
		base = document.getElementById("dropdown_upgrade").options[selected].value
	}
	itemCustom[itemCustom.CODE] = false
	var base_id = bases[base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
	for (affix in base_id) { itemCustom[affix] = base_id[affix] }
	itemCustom[itemCustom.CODE] = true
	itemCustom.base = base
	
	if (document.getElementById("dropdown_corruption").selectedIndex == 1 && typeof(old_max_sockets) != 'undefined' && old_max_sockets != itemCustom.max_sockets) {
		for (let n = 1; n <= 2; n++) { document.getElementById("select_corruption_value_"+n).style.display = "none"; }
		data.corruption = {index:[0],categories:{}}
		load("corruption")
	}
	
	setValues()
}










// 
// ---------------------------------
function setValues() {
	itemCustomAffixes = {}
	if (document.getElementById("dropdown_quality").selectedIndex == 2) {
		for (let n = 1; n <= 2; n++) {
			var selected = document.getElementById("dropdown_superior_"+n).selectedIndex;
			if (selected > 0) {
				var value = Number(document.getElementById("range_superior_"+n).value);
				var code = data.superior.categories[data.superior.index[selected]].info["mod1"];
				if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
				itemCustomAffixes[code] += value
			}
		}
	}
	for (let m = 1; m <= 2; m++) {
		var selected = document.getElementById("dropdown_automod").selectedIndex;
		if (selected > 0) {
			var cat = data.automod.index[selected];
			var used = data.automod.categories[cat].info.used;
			if (typeof(used) != 'undefined') {
				var req_level = data.automod.categories[cat].lines[used][5];
				if (req_level > itemCustom.req_level) {
					if (typeof(itemCustomAffixes.req_level) == 'undefined') { itemCustomAffixes.req_level = 0 }
					if (req_level > itemCustomAffixes.req_level) { itemCustomAffixes.req_level = req_level }
				}
			}
			var value = Number(document.getElementById("range_automod_"+m).value);
			var code = data.automod.categories[cat].info["mod"+m];
			if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
			itemCustomAffixes[code] += value
		}
	}
	for (let n = 1; n <= 3; n++) {
		var selected = document.getElementById("dropdown_pointmod_"+n).selectedIndex;
		if (selected > 0) {
			var cat = data.pointmod.index[selected];
			var used = data.pointmod.categories[cat].info.used;
			if (typeof(used) != 'undefined') {
				var req_level = data.pointmod.categories[cat].lines[used][2];
				if (req_level > itemCustom.req_level) {
					if (typeof(itemCustomAffixes.req_level) == 'undefined') { itemCustomAffixes.req_level = 0 }
					if (req_level > itemCustomAffixes.req_level) { itemCustomAffixes.req_level = req_level }
				}
			}
			var value = Number(document.getElementById("range_pointmod_"+n).value);
			var code = data.pointmod.categories[cat].info["mod1"];
			if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
			itemCustomAffixes[code] += value
		}
	}
	for (let n = 1; n <= 6; n++) {
		for (let m = 1; m <= 3; m++) {
			var prefix = 1; if (n >= 4) { prefix = 0 }
			var selected = document.getElementById("dropdown_affix_"+n).selectedIndex;
			if (selected > 0) {
				var cat = data.affix[prefix].index[selected];
				var used = data.affix[prefix].categories[cat].info.used;
				if (typeof(used) != 'undefined') {
					var req_level = data.affix[prefix].categories[cat].lines[used][6];
					if (req_level > itemCustom.req_level) {
						if (typeof(itemCustomAffixes.req_level) == 'undefined') { itemCustomAffixes.req_level = 0 }
						if (req_level > itemCustomAffixes.req_level) { itemCustomAffixes.req_level = req_level }
					}
				}
				var value = Number(document.getElementById("range_affix_"+n+"_"+m).value);
				var code = data.affix[prefix].categories[cat].info["mod"+m];
				if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
				itemCustomAffixes[code] += value
			}
		}
	}
	for (let m = 1; m <= 2; m++) {
		var selected = document.getElementById("dropdown_corruption").selectedIndex;
		if (selected > 0) {
			var value = Number(document.getElementById("range_corruption_"+m).value);
			var code = data.corruption.categories[data.corruption.index[selected]].info["mod"+m];
			if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
			itemCustomAffixes[code] += value
		}
	}
	setItemFromCustom()
}