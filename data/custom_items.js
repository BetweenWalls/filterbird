
// TODO: reduce similar/duplicated code for setSuperior/setSuperiorValue, setAutomod/setAutomodValue, setPointmod/setPointmodValue, setAffix/setAffixValue, setCorruption/setCorruptionValue
// TODO: add crafted items
// TODO: add option to insert socketables into items (also: Runewords)
// TODO: add option to 'Larzuk'-socket items (mostly just relevant when a non-socket corruption is already applied)
// TODO: update mutual compatibility of superior mod options (ar_bonus & req)
// TODO: add known item prices?
// TODO: add selectable affixes for skill charges (especially for PD2, since they can be searched with conditions e.g. CHSK91>0 for Lower Resist)

var itemTemp = {};
var itemCustom = {};
var itemCustomAffixes = {};
var itemCustomPremade = {};

//	data
//		.index[i] = cat for #i element in dropdown list, where cat is a unique identifier for that group and mod combination  (mod1+mod2+mod3+group)
//		.categories[cat] = {info:{},lines:[]}
//			..info.group = group number for category  (items cannot have multiple affixes from the same group)
//			..info.desc = text description for category
//			..info.mods = number of mods for category
//			..info.mod1 = variable for mod #1
//			..info.mod2 = variable for mod #2
//			..info.mod3 = variable for mod #3
//			..lines[a] = info of #a line from item_affixes.js for category
var data = {
	superior:{index:[0],categories:{}},
	automod:{index:[0],categories:{}},
	pointmod:{index:[0],categories:{}},
	affix:[
		{index:[0],categories:{}},
		{index:[0],categories:{}},
	],
	corruption:{index:[0],categories:{}},
};

// TODO: simplify similar/duplicated code in load() and implement dataChoices  (will be used to compare selected mods/values to new possible mods/values when data is reset, so choices can be preserved if possible)
//	dataChoices
//		.selected[n] = selected category for dropdown #n
//		.value[n][m] = value of mod #m for dropdown #n
var dataChoices = {
	superior:{selected:["",""],value:[[0],[0]]},
	automod:{selected:[""],value:[[0,0]]},
	pointmod:{selected:["","",""],value:[[0],[0],[0]]},
	affix:[
		{selected:["","",""],value:[[0,0,0],[0,0,0],[0,0,0]]},
		{selected:["","",""],value:[[0,0,0],[0,0,0],[0,0,0]]},
	],
	corruption:{selected:[""],value:[[0,0]]},
};

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
	other:["Scratch","Fang","Thirst","Rend","Star","Bane","Spike","Scourge","Barb","Horn","Song","Brand","Loom"],	// dagger, throwing weapon, javelin, polearm, crossbow, wand, claw, orb, amazon weapon, quiver, jewel	(none of these were listed in the source I found, so they just use this list of generic-sounding suffixes)	...TOCHECK: determine which suffix names should actually apply
};

var most_recent_rarity = "Set";		// which item rarity was most recently selected

// toggleCustom - toggles the custom item editing UI
// ---------------------------------
function toggleCustom(checked) {
	if (checked == true) {
		document.getElementById("item_editing").style.display = "block"
		document.getElementById("show_custom_format").style.display = "block"
	}
	else {
		document.getElementById("item_editing").style.display = "none"
		document.getElementById("show_custom_format").style.display = "none"
	}
}
// toggleCustomFormat - switches the custom item editing UI between horizontal and vertical orientations
// ---------------------------------
function toggleCustomFormat(checked) {
	if (checked == true) {
		document.getElementById("editing_1").style.display = "inline-table"
		document.getElementById("editing_2").style.display = "inline-table"
	}
	else {
		document.getElementById("editing_1").style.display = "table"
		document.getElementById("editing_2").style.display = "table"
	}
}

// loadCustomization - populates the 'group' dropdown
//	other dropdowns (type, base, rarity, name) are subsequently populated from here too
// ---------------------------------
function loadCustomization() {
	var options = "";
	//var options = "<option class='gray-all'>any</option>";
	for (group in item_groups) { options += "<option class='gray-all'>" + group + "</option>" }
	document.getElementById("dropdown_group").innerHTML = options
	// these lines just set the default to a Rare Phase Blade
	document.getElementById("dropdown_group").selectedIndex = 7
	setGroup(document.getElementById("dropdown_group").value)
	document.getElementById("dropdown_type").selectedIndex = 2
	setType(document.getElementById("dropdown_type").value)
	document.getElementById("dropdown_base").selectedIndex = 33
	setBase(document.getElementById("dropdown_base").value)
	document.getElementById("dropdown_rarity").selectedIndex = 2
	setRarity(document.getElementById("dropdown_base").value)
	// TODO: Expand Options to make selecting specific items easier?
	//		- add 'any' option for Type/Base
	//		- setBase() should adjust Type if it's 'any'
	//		- setName() should adjust Type/Base if either are 'any'
}
// setGroup - called when 'group' dropdown is used, loads the next dropdown
// ---------------------------------
function setGroup(value) {
	loadType(value)
}
// loadType - populates the 'type' dropdown, subsequent dropdowns
// ---------------------------------
function loadType(value) {
	var options = "";
	if (value == "any") {
		for (val in item_groups) { for (type in item_groups[val]) { options += "<option class='gray-all'>" + item_groups[val][type] + "</option>" } }	// unused
	} else {
		for (type in item_groups[value]) { options += "<option class='gray-all'>" + item_groups[value][type] + "</option>" }
	}
	document.getElementById("dropdown_type").innerHTML = options
	//if (document.getElementById("dropdown_type").options.length > 1) {
	//	options = "<option class='gray-all'>any</option>" + options
	//	document.getElementById("dropdown_type").innerHTML = options
	//}
	loadBase(document.getElementById("dropdown_type").value)
}
// setType - called when 'type' dropdown is used, loads the next dropdown
// ---------------------------------
function setType(value) {
	loadBase(value)
}
// loadBase - populates the 'base' dropdown, subsequent dropdowns
// ---------------------------------
function loadBase(value) {
	var options = "";
	if (value == "any") {
		// unused?
		if (document.getElementById("dropdown_group").selectedIndex = 0) {	// TODO: improper conditional formatting, but never gets called?
			for (val in item_types) { for (base in item_types[val]) { options += "<option class='gray-all'>" + item_types[val][base] + "</option>" } }
			document.getElementById("dropdown_base").innerHTML = options
			loadRarity(document.getElementById("dropdown_base").value)
		} else {
		//	for (opt in document.getElementById("dropdown_type").options) {
		//		var item_type_option = document.getElementById("dropdown_type").options[opt].innerHTML;
		//		if (item_type_option != "any" && typeof(item_types[item_type_option]) != 'undefined') {
		//			for (base in item_types[item_type_option]) { options += "<option class='gray-all'>" + item_types[val][base] + "</option>" }
		//		}
		//	}
		//	document.getElementById("dropdown_base").innerHTML = options
		//	loadRarity(document.getElementById("dropdown_base").value)
		}
	} else if (value == "rune" || value == "gem" || value == "other" || value == "misc") {
		for (let i = 0; i < premade[value].length; i++) { options += "<option class='gray-all'>"+premade[value][i].name+"</option>" }
		document.getElementById("dropdown_base").innerHTML = ""
		document.getElementById("dropdown_rarity").innerHTML = ""
		document.getElementById("dropdown_name").innerHTML = options
		// Show/Hide Item Level Input
		if (typeof(itemCustom.static_ILVL) == 'undefined') { item_settings.ILVL_return = character.ILVL }
		setCustomBase()
		validateILVL(document.getElementById("ilvl").value)
		if (typeof(itemCustom.static_ILVL) != 'undefined') {
			setILVL2(itemCustom.static_ILVL)
			if (settings.auto_difficulty == true) {
				if (item_settings.ILVL_return < 36) { character.DIFFICULTY = 0 }
				else if (item_settings.ILVL_return > 66) { character.DIFFICULTY = 2 }
				else { character.DIFFICULTY = 1 }
			}
			document.getElementById("select_ilvl").style.display = "none"
		} else {
			setILVL2(item_settings.ILVL_return)
			document.getElementById("select_ilvl").style.display = "block"
		}
		setCustomBase()
		tidyBaseSelection()
		setValues()
	} else {
		value = value.split(" ").join("_")
		for (base in item_types[value]) { options += "<option class='gray-all'>" + item_types[value][base] + "</option>" }
		document.getElementById("dropdown_base").innerHTML = options
		if (document.getElementById("dropdown_base").options.length > 1 && document.getElementById("dropdown_type").value != "charm" && document.getElementById("dropdown_type").value != "quiver") {
			options = "<option class='gray-all'>any</option>" + options
			document.getElementById("dropdown_base").innerHTML = options
			if (most_recent_rarity == "Regular" || most_recent_rarity == "Magic" || most_recent_rarity == "Rare") { document.getElementById("dropdown_base").selectedIndex = 1; }	// keep the previous rarity if possible by changing "any" to the first available base (only Set/Unique items can be selected with "any")
		}
		loadRarity(document.getElementById("dropdown_base").value)
	}
}
// setBase - called when 'base' dropdown is used, loads the next dropdown
// ---------------------------------
function setBase(value) {
	if (value == "any") {
		if (most_recent_rarity == "Set" && document.getElementById("dropdown_rarity").options.length > 4) {
			document.getElementById("dropdown_rarity").selectedIndex = 4;
			document.getElementById("dropdown_rarity").value = document.getElementById("dropdown_rarity").options[4].innerHTML;
		} else {
			document.getElementById("dropdown_rarity").selectedIndex = 3;
			document.getElementById("dropdown_rarity").value = document.getElementById("dropdown_rarity").options[3].innerHTML;
		}
	}
	loadRarity(value)
}
// loadRarity - populates the 'rarity' dropdown, subsequent dropdowns
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
	if (value == "any") {
		capable_unique = true
		var type = document.getElementById("dropdown_type").value;
		if (type != "dagger" && type != "throwing weapon" && type != "javelin" && type != "spear" && type != "crossbow") { capable_set = true }
	} else {
		for (group in equipment) {
			for (itemNew in equipment[group]) {
				var item = equipment[group][itemNew];
				if (item.base == value) {
					if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { capable_unique = true }
					else if (item.rarity == "set") { capable_set = true }
				}
			}
		}
	}
	if (capable_unique == true) { options += "<option class='gray-all'>" + "Unique" + "</option>" }
	if (capable_set == true) { options += "<option class='gray-all'>" + "Set" + "</option>" }
	if (value == "Small Charm" || value == "Large Charm" || value == "Grand Charm") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
	if (value == "Jewel") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
	if (value == "Amulet" || value == "Ring") { options = "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" + "<option class='gray-all'>" + "Set" + "</option>" }
	if (value == "Arrows" || value == "Bolts") {
		options = "<option class='gray-all'>" + rarities[0] + "</option>" + "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>"	// TODO: Create method that updates specific things when changing versions, so available quiver can be changed between versions consistently
		//if (settings.version == 0) { options = "<option class='gray-all'>" + rarities[0] + "</option>" + "<option class='gray-all'>" + rarities[1] + "</option>" + "<option class='gray-all'>" + rarities[2] + "</option>" + "<option class='gray-all'>" + "Unique" + "</option>" }
		//else { options = "<option class='gray-all'>" + rarities[0] + "</option>" }
		// TODO: regular quivers should never have the 'quality' dropdown for inferior/superior
	}
	// TODO: Adjust how Maps are implemented, so their rarity can be adjusted
	document.getElementById("dropdown_rarity").innerHTML = options
	
	// keeps the previous rarity if possible
	var new_index = document.getElementById("dropdown_rarity").length-1;
	if (typeof(itemCustom.rarity) != 'undefined' && !(value == "any" && itemCustom.rarity != "unique" && itemCustom.rarity != "set")) {
		for (let i = 0; i < document.getElementById("dropdown_rarity").length; i++) {
			var i_rarity = document.getElementById("dropdown_rarity").options[i].value;
			if (itemCustom.rarity == i_rarity.toLowerCase()) { new_index = i }
		}
	}
	if (most_recent_rarity == "Set") {
		for (let i = 0; i < document.getElementById("dropdown_rarity").length; i++) {
			var i_rarity = document.getElementById("dropdown_rarity").options[i].value;
			if (most_recent_rarity == i_rarity) { new_index = i }
		}
	}
	
	document.getElementById("dropdown_rarity").selectedIndex = new_index
	
	loadName(document.getElementById("dropdown_rarity").value)
}
// setRarity - called when 'rarity' dropdown is used, loads the next dropdown
// ---------------------------------
function setRarity(value) {
	var base = document.getElementById("dropdown_base").value;
	if (base == "any" && value != "Unique" && value != "Set") {
		// set base to match the previously selected unique/set item
		var group = document.getElementById("dropdown_group").value;
		var new_index = 1;
		var new_base = "";
		for (itemNew in equipment[group]) {
			if (equipment[group][itemNew].name == document.getElementById("dropdown_name").value) {
				new_base = equipment[group][itemNew].base
			}
		}
		for (opt in document.getElementById("dropdown_base").options) {
			var base_option = document.getElementById("dropdown_base").options[opt].innerHTML;
			if (base_option == new_base) { new_index = opt }
		}
		document.getElementById("dropdown_base").selectedIndex = new_index;
		// set rarity options to match the new base
		var options = "";
		var rarities = ["Regular","Magic","Rare"];
		for (rarity in rarities) {
			options += "<option class='gray-all'>" + rarities[rarity] + "</option>"
		}
		// TODO: add "Crafted" rarity
		var capable_unique = false;
		var capable_set = false;
		for (itemNew in equipment[group]) {
			var item = equipment[group][itemNew];
			if (item.base == document.getElementById("dropdown_base").value) {
				if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { capable_unique = true }
				else if (item.rarity == "set") { capable_set = true }
			}
		}
		if (capable_unique == true) { options += "<option class='gray-all'>" + "Unique" + "</option>" }
		if (capable_set == true) { options += "<option class='gray-all'>" + "Set" + "</option>" }
		document.getElementById("dropdown_rarity").innerHTML = options
		var new_index = 0;
		for (opt in document.getElementById("dropdown_rarity").options) {
			var rarity_option = document.getElementById("dropdown_rarity").options[opt].innerHTML;
			if (rarity_option == value) { new_index = opt }
		}
		document.getElementById("dropdown_rarity").selectedIndex = new_index
	}
	most_recent_rarity = value
	loadName(value)
}
// loadName - populates the 'name' dropdown
// ---------------------------------
function loadName(value) {
	var options = "";
	var base = document.getElementById("dropdown_base").value;
	if (value == "Unique" || value == "Set") {
		var group = document.getElementById("dropdown_group").value;
		var type = document.getElementById("dropdown_type").value;
		if (base == "any") {
			for (itemNew in equipment[group]) {
				var item = equipment[group][itemNew];
				var toLoad = false;
				if (itemNew != 0 && (group == "armor" || group == "gloves" || group == "boots" || group == "belt")) { toLoad = true }
				if (group == "helm" || group == "offhand") { for (item_base in item_types[type.split(" ").join("_")]) { if (item.base == item_types[type.split(" ").join("_")][item_base]) { toLoad = true } } }
				if (itemNew != 0 && item.special != 1 && group == "weapon" && (item.type == type || (item.type == "thrown" && type == "throwing weapon") || (item.type == "club" && type == "mace") || (item.type == "hammer" && type == "mace"))) { toLoad = true }
				if (toLoad == true) {
					if (value == "Unique") { if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { options += "<option class='gray-all'>" + item.name + "</option>" } }
					else { if (item.rarity == "set") { options += "<option class='gray-all'>" + item.name + "</option>" } }
				}
			}
		} else {
			for (group in equipment) {
				for (itemNew in equipment[group]) {
					var item = equipment[group][itemNew];
					if (item.base == base || (itemNew != 0 && item.special != 1 && ((base == "Amulet" && group == "amulet") || (base == "Ring" && group == "ring") || (base == "Jewel" && item.type == "jewel") || (type == "charm" && group == "charms" && base.toLowerCase().split(" ")[0] == item.size) || (type == "quiver" && item.type == "quiver")))) {
						if (value == "Unique") { if (typeof(item.rarity) == 'undefined' || item.rarity == "unique") { options += "<option class='gray-all'>" + item.name + "</option>" } }
						else { if (item.rarity == "set") { options += "<option class='gray-all'>" + item.name + "</option>" } }
					}
				}
			}
		}
	}
	document.getElementById("dropdown_name").innerHTML = options
	if (typeof(itemCustom.static_ILVL) == 'undefined') { item_settings.ILVL_return = character.ILVL }
	setCustomBase()	// called to set qlvl
	validateILVL(document.getElementById("ilvl").value)
	// Show/Hide Item Level Input
	if (typeof(itemCustom.static_ILVL) != 'undefined') {
		setILVL2(itemCustom.static_ILVL)
		if (settings.auto_difficulty == true) {
			if (item_settings.ILVL_return < 36) { character.DIFFICULTY = 0 }
			else if (item_settings.ILVL_return > 66) { character.DIFFICULTY = 2 }
			else { character.DIFFICULTY = 1 }
		}
		document.getElementById("select_ilvl").style.display = "none"
	} else {
		setILVL2(item_settings.ILVL_return)
		document.getElementById("select_ilvl").style.display = "block"
	}
	setCustomBase()
	tidyBaseSelection()
	setValues()
}
// setName - called when 'name' dropdown is used
// ---------------------------------
function setName(value) {
	var type = itemCustom.type_affix;
	if (typeof(itemCustom.static_ILVL) == 'undefined') { item_settings.ILVL_return = character.ILVL }
	setCustomBase()	// called to set qlvl
	validateILVL(document.getElementById("ilvl").value)
	// Show/Hide Item Level Input
	if (typeof(itemCustom.static_ILVL) != 'undefined') {
		setILVL2(itemCustom.static_ILVL)
		if (settings.auto_difficulty == true) {
			if (item_settings.ILVL_return < 36) { character.DIFFICULTY = 0 }
			else if (item_settings.ILVL_return > 66) { character.DIFFICULTY = 2 }
			else { character.DIFFICULTY = 1 }
		}
		document.getElementById("select_ilvl").style.display = "none"
	} else {
		setILVL2(item_settings.ILVL_return)
		document.getElementById("select_ilvl").style.display = "block"
	}
	setCustomBase()
	tidyBaseSelection()
	setValues()
}
// validateILVL - 
// ---------------------------------
function validateILVL(value) {
	var qlvl = 1;
	if (typeof(itemCustom.qlvl) != 'undefined') { qlvl = itemCustom.qlvl }
	if (isNaN(value) == true || value < 1 || value > 99) { value = document.getElementById("dropdown_ilvl").selectedIndex }
	if (value < qlvl) { value = qlvl }
	document.getElementById("ilvl").value = value
	character.ILVL = Number(value)
}
// setILVL2 - another selector for ilvl
// ---------------------------------
function setILVL2(value) {
	validateILVL(value)
	value = document.getElementById("ilvl").value
	// keep ilvl consistent (temporary while old item selection & custom item editing coexist)
	document.getElementById("dropdown_ilvl").selectedIndex = value
	character.ILVL = value
	if (settings.auto_difficulty == true) {
		if (value < 36) { character.DIFFICULTY = 0 }
		else if (value > 66) { character.DIFFICULTY = 2 }
		else { character.DIFFICULTY = 1 }
	}
	
	setCustomBase()
	tidyBaseSelection()
	setValues()
}
// setCustomBase - sets basic item info from 5 dropdowns: Group, Type, Base, Rarity, Name
//	dropdowns for possible affixes are then populated
// ---------------------------------
function setCustomBase() {
	// TODO: keep track of old rarity, and don't switch to "any" base unless it's unique/set
	var old_base = itemCustom.base;
	var group = document.getElementById("dropdown_group").value;
	var type = document.getElementById("dropdown_type").value;
	var base = document.getElementById("dropdown_base").value;
	var rarity = document.getElementById("dropdown_rarity").value;
	var name = document.getElementById("dropdown_name").value;
	data = {superior:{index:[0],categories:{}},automod:{index:[0],categories:{}},pointmod:{index:[0],categories:{}},affix:[{index:[0],categories:{}},{index:[0],categories:{}}],corruption:{index:[0],categories:{}}};
	itemCustom = {name_prefix:"",name_suffix:"",req_level:0};
	itemCustom.type_affix = type;
	itemCustom.ILVL = document.getElementById("ilvl").value;
	
	if (type == "rune" || type == "gem" || type == "other" || type == "misc") {
		document.getElementById("select_rarity").style.display = "none"
		for (itemNew in premade[type]) {
			if (premade[type][itemNew].name == name) {
				for (affix in premade[type][itemNew]) { itemCustom[affix] = premade[type][itemNew][affix] }
			}
		}
		if (typeof(itemCustom.relic_experience) != 'undefined') {
			//if (rarity == "Magic") { itemCustom.base =  }
			if (itemCustom.rarity == "rare") {
				itemCustom.base = itemCustom.name
				itemCustom.name = rare_prefix[Math.floor(Math.random()*rare_prefix.length)] + " Eye"
			}
		}
	} else {
		if (rarity == "Set" || rarity == "Unique") {
			for (group in equipment) {
				for (itemNew in equipment[group]) {
					if (equipment[group][itemNew].name == name) {
						if (base == "any") { base = equipment[group][itemNew].base }
					}
				}
			}
		}
		document.getElementById("select_rarity").style.display = "inline"
		itemCustom.base = base;
		itemCustom.rarity = rarity.toLowerCase();
		if (type != "amulet" && type != "ring" && type != "quiver" && type != "charm" && type != "jewel") {
			var base_id = bases[base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
			for (affix in base_id) { itemCustom[affix] = base_id[affix] }
			itemCustom.original_base = base
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
				if (settings.version == 0) {
					if (base == "Arrows") {
						if (rarity == "Regular") { itemCustom.CODE = "aqv"; itemCustom.name = "Rusted Arrows"; itemCustom.NAME = "Rusted Arrows"; }
						else  { itemCustom.CODE = "aq2" }
					} else if (base == "Bolts") {
						if (rarity == "Regular") { itemCustom.CODE = "cqv"; itemCustom.name = "Rusted Bolts"; itemCustom.NAME = "Rusted Bolts"; }
						else { itemCustom.CODE = "cq2" }
					}
				} else {
					if (base == "Arrows") { itemCustom.CODE = "aqv"; }
					if (base == "Bolts") { itemCustom.CODE = "cqv"; }
				}
			}
		}
		if (rarity == "Set" || rarity == "Unique") { itemCustom.name = name }
		else if (rarity == "Regular" || rarity == "Magic") { itemCustom.name = base }
		else if (rarity == "Rare") {
			var suffix = "";
			if (itemCustom.shield == true) { suffix = rare_suffix["shield"][Math.floor(Math.random()*rare_suffix["shield"].length)] }
			else if (itemCustom.ARMOR == true) { suffix = rare_suffix[group][Math.floor(Math.random()*rare_suffix[group].length)] }
			else if (typeof(rare_suffix[type]) != 'undefined') { suffix = rare_suffix[type][Math.floor(Math.random()*rare_suffix[type].length)] }
			else { suffix = rare_suffix["other"][Math.floor(Math.random()*rare_suffix["other"].length)] }
			itemCustom.name = rare_prefix[Math.floor(Math.random()*rare_prefix.length)] + " " + suffix
		}
		if (rarity == "Set" || rarity == "Unique") {
			for (group in equipment) {
				for (itemNew in equipment[group]) {
					if (equipment[group][itemNew].name == name) {
						for (affix in equipment[group][itemNew]) {
							if (affix == "damage_vs_undead") {
								if (typeof(itemCustom[affix]) == 'undefined') { itemCustom[affix] = 0 }
								itemCustom[affix] += equipment[group][itemNew][affix]
							} else {
								itemCustom[affix] = equipment[group][itemNew][affix]
							}
						}
						// TODO: unique/set affix customization?
					}
				}
			}
		}
	}
	itemCustom[itemCustom.CODE] = true
	// keep previous armor value for same bases, otherwise use max value
	if (itemCustom.ARMOR == true) {
		var armor_value = document.getElementById("armor").value;
		if (base != old_base) { armor_value = 600 }
		document.getElementById("select_armor").style.display = "block"; setArmor(armor_value);
	} else {
		document.getElementById("select_armor").style.display = "none"
	}
	loadEditing()
}
// tidyBaseSelection - hides type/base/name dropdowns when they're irrelevant
// ---------------------------------
function tidyBaseSelection() {
	if (document.getElementById("dropdown_type").length <= 1) { document.getElementById("select_type").style.display = "none" }
	else { document.getElementById("select_type").style.display = "inline" }
	if (document.getElementById("dropdown_base").length <= 1) { document.getElementById("select_base").style.display = "none"; document.getElementById("select_base_placeholder").style.display = "block"; }
	else { document.getElementById("select_base").style.display = "block"; document.getElementById("select_base_placeholder").style.display = "none"; }
	//if (document.getElementById("dropdown_rarity").length <= 1) { document.getElementById("select_rarity").style.display = "none" }	// TODO: Was there a reason these shouldn't be enabled?
	//else { document.getElementById("select_rarity").style.display = "inline" }
	if (document.getElementById("dropdown_name").innerHTML == "") { document.getElementById("select_name").style.display = "none" }
	else { document.getElementById("select_name").style.display = "inline" }
}







// getMatch - returns true if the given kind of affix should be available for the selected base item
// ---------------------------------
function getMatch(kind) {
	var result = false;
	if (kind == "identified" && itemCustom.rarity != "regular") { result = true }
	if (kind == "ethereal" && !((itemCustom.WEAPON != true && itemCustom.ARMOR != true) || itemCustom.rarity == "set" || itemCustom.WP9 == true || itemCustom["7cr"] == true || itemCustom.name == "Crown of Ages" || itemCustom.name == "Leviathan" || itemCustom.name == "Tyrael's Might" || itemCustom.name == "Butcher's Pupil" || itemCustom.name == "Wizardspike" || itemCustom.name == "Stormspire" || itemCustom.name == "Stormshield" || (settings.version == 0 && (itemCustom.name == "The Gavel of Pain" || itemCustom.name == "Schaefer's Hammer" || itemCustom.name == "The Cranium Basher" || itemCustom.name == "Doombringer" || itemCustom.name == "The Grandfather" || itemCustom.name == "Steel Pillar")) || itemCustom.name == "Ethereal Edge" || itemCustom.name == "Ghostflame" || itemCustom.name == "Wraith Flight" || itemCustom.name == "Shadow Killer")) { result = true }
	if (kind == "sockets" && typeof(itemCustom.max_sockets) != 'undefined' && itemCustom.rarity == "regular") { result = true }
	if (kind == "quality" && itemCustom.rarity == "regular" && itemCustom.affix_type != "quiver") { result = true }
	if (kind == "automod" && itemCustom.rarity != "unique" && itemCustom.rarity != "set" && (itemCustom.CL3 || itemCustom.CL4 || itemCustom.CL6 || itemCustom.CL7)) { result = true }
	if (kind == "pointmod" && itemCustom.rarity != "unique" && itemCustom.rarity != "set" && (itemCustom.CL1 || itemCustom.CL2 || itemCustom.CL4 || itemCustom.CL5 || itemCustom.CL6 || itemCustom.WP11 || itemCustom.WP12 || itemCustom.WP13) && !(itemCustom.CL5 == true && (itemCustom.tier == 1 || itemCustom["9ar"] == true || itemCustom["9wb"] == true || itemCustom["9xf"] == true))) { result = true }
	if (kind == "affix" && (itemCustom.rarity == "magic" || itemCustom.rarity == "rare" || itemCustom.rarity == "craft")) { result = true }
	if (kind == "corruption" && itemCustom.rarity != "regular" && itemCustom.type_affix != "charm" && itemCustom.type_affix != "jewel" && !(itemCustom.sockets > 0)) { result = true }
	if (kind == "upgrade" && (itemCustom.rarity == "unique" || itemCustom.rarity == "rare" || itemCustom.rarity == "set") && (itemCustom.tier == 1 || itemCustom.tier == 2)) { result = true }
	if (kind == "superior" && itemCustom.superior == true) { result = true }
	if (itemCustom.type_affix == "rune" || itemCustom.type_affix == "gem" || itemCustom.type_affix == "other" || itemCustom.type_affix == "misc") { result = false }
	if (kind == "identified" && typeof(itemCustom.relic_experience) != 'undefined') { result = true }
	return result
}
// getALVL - returns the 'affix level' for the item
// ---------------------------------
function getALVL() {
	var type = itemCustom.type_affix;
	var base_qlvl = 1;
	var magic_lvl = 0;
	var ilvl = itemCustom.ILVL;
	var x = 0;
	var alvl = 0;
	
	if (type != "amulet" && type != "ring" && type != "quiver" && type != "charm" && type != "jewel" && type != "rune" && type != "gem" && type != "other" && type != "misc") { base_qlvl = bases[itemCustom.base.split(" ").join("_").split("-").join("_").split("'s").join("s")].qlvl; }
	else if (itemCustom.base == "Large Charm") { base_qlvl = 14 }
	else if (itemCustom.base == "Small Charm") { base_qlvl = 28 }
	
	if (type == "circlet") {
		if (itemCustom.base == "Circlet") { magic_lvl = 3 }
		else if (itemCustom.base == "Coronet") { magic_lvl = 8 }
		else if (itemCustom.base == "Tiara") { magic_lvl = 13 }
		else if (itemCustom.base == "Diadem") { magic_lvl = 18 }
	} else if (type == "staff" || type == "orb" || (type == "wand" && itemCustom.tier != 3)) {
		magic_lvl = 1
	}
	
	x = Math.max(ilvl,base_qlvl)
	if (magic_lvl > 0) { x = x + magic_lvl }
	else {
		// TODO/TOCHECK: what was this meant to do? it just messes up the affix level
		//if (x < (99 - base_qlvl/2)) { x = x - base_qlvl/2 }
		//else { x = 2*x - 99 }
	}
	alvl = Math.round(Math.min(x,99))
	
	itemCustom.ALVL = alvl
	if (settings.version == 1) {
		itemCustom.CRAFTALVL = Math.floor(character.CLVL/2) + Math.floor(ilvl/2)
		itemCustom.QLVL = base_qlvl
	}
	return alvl
}
// loadEditing - disables all affix options, then enables any that are relevant to the item
// ---------------------------------
function loadEditing() {
	for (let n = 1; n <= 2; n++) { document.getElementById("select_superior_"+n).style.display = "none"; document.getElementById("select_superior_value_"+n).style.display = "none"; }
	for (let n = 1; n <= 2; n++) { document.getElementById("select_automod_value_"+n).style.display = "none"; };
	for (let n = 1; n <= 3; n++) { document.getElementById("select_pointmod_"+n).style.display = "none"; document.getElementById("select_pointmod_value_"+n).style.display = "none"; }
	for (let n = 1; n <= 6; n++) { document.getElementById("select_affix_"+n).style.display = "none"; for (let m = 1; m <= 3; m++) { document.getElementById("select_affix_value_"+n+"_"+m).style.display = "none"; }; }
	for (let n = 1; n <= 2; n++) { document.getElementById("select_corruption_value_"+n).style.display = "none"; };
	if (getMatch("superior") == false) { for (let n = 1; n <= 2; n++) { document.getElementById("dropdown_superior_"+n).selectedIndex = 0; } }
	if (getMatch("pointmod") == false) { for (let n = 1; n <= 3; n++) { document.getElementById("dropdown_pointmod_"+n).selectedIndex = 0; } }
	if (getMatch("corruption") == false) { document.getElementById("dropdown_corruption").selectedIndex = 0; }
	if (getMatch("automod") == false) { document.getElementById("dropdown_automod").selectedIndex = 0; }
	if (getMatch("affix") == false) { for (let n = 1; n <= 6; n++) { document.getElementById("dropdown_affix_"+n).selectedIndex = 0; } }
	document.getElementById("select_runeword").style.display = "none"
	itemCustomPremade = {}
	if (getMatch("sockets") == false) { document.getElementById("dropdown_runeword").selectedIndex = 0; }
	
	var selects = ["identified","ethereal","sockets","quality","automod","pointmod","affix","corruption","upgrade"];
	for (s in selects) {
		var divs = [];
		var result = "none";
		if (selects[s] == "affix") {
			divs[divs.length] = "select_"+selects[s]+"_1"
			divs[divs.length] = "select_"+selects[s]+"_4"
		} else if (selects[s] == "pointmod" || selects[s] == "superior") {
			divs[divs.length] = "select_"+selects[s]+"_1"
		} else {
			divs[divs.length] = "select_"+selects[s]
		}
		if (getMatch(selects[s])) { result = "block" }
		for (i in divs) { document.getElementById(divs[i]).style.display = result }
		if (getMatch(selects[s])) { load(selects[s]) }
	}
}
// load - subfunction for loadEditing, 
// ---------------------------------
function load(kind) {
	// TODO: reduce duplicated code
	var alvl = getALVL();
	var options = "<option class='gray-all'>" + "None" + "</option>";
	if (kind == "ethereal") {
		if (document.getElementById("ethereal").checked == true) { itemCustom.ethereal = true }
	} else if (kind == "sockets") {
		// set variables for previously selected affix info
		var sockets_index = document.getElementById("dropdown_sockets").selectedIndex;
		// set new options
		var most_sockets = itemCustom.max_sockets;
		if (itemCustom.ILVL <= 40 && typeof(itemCustom.max_sockets_lvl_40) != 'undefined') { most_sockets = itemCustom.max_sockets_lvl_40 }
		if (itemCustom.ILVL <= 25 && typeof(itemCustom.max_sockets_lvl_25) != 'undefined') { most_sockets = itemCustom.max_sockets_lvl_25 }
		if (itemCustom.rarity != "regular") { most_sockets = 1 }
		for (let i = 1; i <= most_sockets; i++) { options += "<option class='gray-all'>"+i+"</option>" }
		document.getElementById("dropdown_sockets").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (sockets_index > 0 && sockets_index <= most_sockets) {
			document.getElementById("dropdown_sockets").selectedIndex = sockets_index
			itemCustom.sockets = sockets_index
		}
		doRuneword(~~document.getElementById("dropdown_runeword").selectedIndex)
	} else if (kind == "quality") {
		// set variables for previously selected affix info
		var quality_index = document.getElementById("dropdown_quality").selectedIndex;
		// set new options
		options += "<option class='gray-all'>" + "Inferior" + "</option>"
		options += "<option class='gray-all'>" + "Superior" + "</option>"
		document.getElementById("dropdown_quality").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (quality_index > 0) {
			document.getElementById("dropdown_quality").selectedIndex = quality_index
			doQuality(quality_index)
		}
	} else if (kind == "automod") {
		// set variables for previously selected affix info
		var automod_index = document.getElementById("dropdown_automod").selectedIndex;
		var automod_value = ""; if (automod_index > 0) { automod_value = document.getElementById("dropdown_automod").options[automod_index].innerHTML };
		var automod_mod_value_1 = document.getElementById("automod_value_1").innerHTML;
		var automod_mod_value_2 = document.getElementById("automod_value_2").innerHTML;
		// set new options
		for (a in affixes_automod) {
			var aff = affixes_automod[a];
			options += loadDetails(kind,aff,alvl,aff[0],1,aff[2],aff[3],aff[4],aff[6],aff[7],aff[10],"",[aff[13]],[])
		}
		document.getElementById("dropdown_automod").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (automod_index > 0) {
			for (opt in document.getElementById("dropdown_automod").options) {
				if (automod_value == document.getElementById("dropdown_automod").options[opt].innerHTML) {
					document.getElementById("dropdown_automod").selectedIndex = opt
					doAutomod(opt)
					if (automod_mod_value_1 < document.getElementById("automod_value_1").innerHTML) {
						document.getElementById("range_automod_1").value = automod_mod_value_1
						document.getElementById("automod_value_1").innerHTML = automod_mod_value_1
						doAutomodValue(1,automod_mod_value_1)
					}
					if (automod_mod_value_2 < document.getElementById("automod_value_2").innerHTML) {
						document.getElementById("range_automod_2").value = automod_mod_value_2
						document.getElementById("automod_value_2").innerHTML = automod_mod_value_2
						doAutomodValue(2,automod_mod_value_2)
					}
				}
			}
		}
	} else if (kind == "pointmod") {
		// set variables for previously selected affix info
		var pointmod_index_1 = document.getElementById("dropdown_pointmod_1").selectedIndex;
		var pointmod_value_1 = ""; if (pointmod_index_1 > 0) { pointmod_value_1 = document.getElementById("dropdown_pointmod_1").options[pointmod_index_1].innerHTML };
		var pointmod_mod_value_1 = document.getElementById("pointmod_value_1").innerHTML;
		var pointmod_index_2 = document.getElementById("dropdown_pointmod_2").selectedIndex;
		var pointmod_value_2 = ""; if (pointmod_index_2 > 0) { pointmod_value_2 = document.getElementById("dropdown_pointmod_2").options[pointmod_index_2].innerHTML };
		var pointmod_mod_value_2 = document.getElementById("pointmod_value_2").innerHTML;
		var pointmod_index_3 = document.getElementById("dropdown_pointmod_3").selectedIndex;
		var pointmod_value_3 = ""; if (pointmod_index_3 > 0) { pointmod_value_3 = document.getElementById("dropdown_pointmod_3").options[pointmod_index_3].innerHTML };
		var pointmod_mod_value_3 = document.getElementById("pointmod_value_3").innerHTML;
		// set new options
		var aff_pointmod = affixes_pointmod;
		if (settings.version == 1) { aff_pointmod = affixes_pointmod_pd2 }
		for (a in aff_pointmod) {
			var aff = aff_pointmod[a];
			options += loadDetails(kind,aff,alvl,1,1,1,aff[0],aff[1],aff[3],aff[4],"","",[aff[7],aff[8]],[])
		}
		for (let n = 1; n <= 3; n++) { document.getElementById("dropdown_pointmod_"+n).innerHTML = options }
		// keep previously selected affix info (if compatible)
		if (pointmod_index_1 > 0) {
			for (opt in document.getElementById("dropdown_pointmod_1").options) {
				if (pointmod_value_1 == document.getElementById("dropdown_pointmod_1").options[opt].innerHTML) {
					document.getElementById("dropdown_pointmod_1").selectedIndex = opt
					doPointmod(1,opt)
					document.getElementById("range_pointmod_1").value = pointmod_mod_value_1
					document.getElementById("pointmod_value_1").innerHTML = pointmod_mod_value_1
					doPointmodValue(1,pointmod_mod_value_1)
				}
			}
		}
		if (pointmod_index_2 > 0) {
			for (opt in document.getElementById("dropdown_pointmod_2").options) {
				if (pointmod_value_2 == document.getElementById("dropdown_pointmod_2").options[opt].innerHTML) {
					document.getElementById("dropdown_pointmod_2").selectedIndex = opt
					doPointmod(2,opt)
					document.getElementById("range_pointmod_2").value = pointmod_mod_value_2
					document.getElementById("pointmod_value_2").innerHTML = pointmod_mod_value_2
					doPointmodValue(2,pointmod_mod_value_2)
				}
			}
		}
		if (pointmod_index_3 > 0) {
			for (opt in document.getElementById("dropdown_pointmod_3").options) {
				if (pointmod_value_3 == document.getElementById("dropdown_pointmod_3").options[opt].innerHTML) {
					document.getElementById("dropdown_pointmod_3").selectedIndex = opt
					doPointmod(3,opt)
					document.getElementById("range_pointmod_3").value = pointmod_mod_value_3
					document.getElementById("pointmod_value_3").innerHTML = pointmod_mod_value_3
					doPointmodValue(3,pointmod_mod_value_3)
				}
			}
		}
	} else if (kind == "affix") {
		// set variables for previously selected affix info
		var a_index = ["",0,0,0,0,0,0];
		var a_value = ["",0,0,0,0,0,0];
		var a_mod = ["",["",0,0,0],["",0,0,0],["",0,0,0],["",0,0,0],["",0,0,0],["",0,0,0]];
		for (let n = 1; n <= 6; n++) {
			a_index[n] = document.getElementById("dropdown_affix_"+n).selectedIndex;
			a_value[n] = ""; if (a_index[n] > 0) { a_value[n] = document.getElementById("dropdown_affix_"+n).options[a_index[n]].innerHTML };
			for (let m = 1; m <= 3; m++) {
				a_mod[n][m] = ~~document.getElementById("affix_value_"+n+"_"+m).innerHTML;
			}
		}
		// set new options
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
		// keep previously selected affix info (if compatible)
		for (let n = 1; n <= 6; n++) {
			if (a_index[n] > 0) {
				for (let opt = 0; opt < document.getElementById("dropdown_affix_"+n).options.length; opt++) {
					if (a_value[n] == document.getElementById("dropdown_affix_"+n).options[opt].innerHTML) {
						if (itemCustom.rarity == "rare" || itemCustom.rarity == "craft" || (itemCustom.rarity == "magic" && (n == 1 || n == 4))) {
							document.getElementById("dropdown_affix_"+n).selectedIndex = opt
							var n_prefix = 0; if (n <= 3) { n_prefix = 1 }
							doAffix(n,opt,n_prefix)
							var mods = data.affix[n_prefix].categories[data.affix[n_prefix].index[opt]].info.mods;
							for (let m = 1; m <= mods; m++) {
								if (a_mod[n][m] <= document.getElementById("affix_value_"+n+"_"+m).innerHTML) {
									// TODO: Find the broken code that prevents proper execution when the above condition is equal (only happens once per scenario before fixing itself... undefined variable somewhere?)
									document.getElementById("range_affix_"+n+"_"+m).value = a_mod[n][m]
									document.getElementById("affix_value_"+n+"_"+m).innerHTML = a_mod[n][m]
									doAffixValue(n,m,a_mod[n][m],n_prefix)
								}
							}
						}
					}
				}
			}
		}
	} else if (kind == "corruption") {
		// set variables for previously selected affix info
		var corruption_index = document.getElementById("dropdown_corruption").selectedIndex;
		var corruption_value = ""; if (corruption_index > 0) { corruption_value = document.getElementById("dropdown_corruption").options[corruption_index].innerHTML };
		var corruption_mod_value_1 = document.getElementById("corruption_value_1").innerHTML;
		var corruption_mod_value_2 = document.getElementById("corruption_value_2").innerHTML;
		// set new options
		for (a in affixes_corruption) {
			var aff = affixes_corruption[a];
			options += loadDetails(kind,aff,alvl,1,1,1,1,99,1,aff[0],aff[3],"",[aff[6]],[])
		}
		document.getElementById("dropdown_corruption").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (corruption_index > 0) {
			for (opt in document.getElementById("dropdown_corruption").options) {
				if (corruption_value == document.getElementById("dropdown_corruption").options[opt].innerHTML) {
					document.getElementById("dropdown_corruption").selectedIndex = opt
					doCorruption(opt)
					if (corruption_mod_value_1 < document.getElementById("corruption_value_1").innerHTML) {
						document.getElementById("range_corruption_1").value = corruption_mod_value_1
						document.getElementById("corruption_value_1").innerHTML = corruption_mod_value_1
						doCorruptionValue(1,corruption_mod_value_1)
					}
					if (corruption_mod_value_2 < document.getElementById("corruption_value_2").innerHTML) {
						document.getElementById("range_corruption_2").value = corruption_mod_value_2
						document.getElementById("corruption_value_2").innerHTML = corruption_mod_value_2
						doCorruptionValue(2,corruption_mod_value_2)
					}
				}
			}
		}
	} else if (kind == "upgrade") {
		// set variables for previously selected affix info
		var upgrade_index = document.getElementById("dropdown_upgrade").selectedIndex;
		var upgrade_value = ""; if (upgrade_index > 0) { upgrade_value = document.getElementById("dropdown_upgrade").options[upgrade_index].innerHTML };
		// set new options
		if (typeof(itemCustom.upgrade) != 'undefined') { options += "<option class='gray-all'>" + itemCustom.upgrade + "</option>" }
		if (typeof(itemCustom.upgrade2) != 'undefined') { options += "<option class='gray-all'>" + itemCustom.upgrade2 + "</option>" }
		document.getElementById("dropdown_upgrade").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (upgrade_index > 0 && upgrade_value == document.getElementById("dropdown_upgrade").options[upgrade_index].innerHTML) {
			document.getElementById("dropdown_upgrade").selectedIndex = upgrade_index
			doUpgrade(upgrade_index)
		}
	} else if (kind == "superior") {
		// set variables for previously selected affix info
		var superior_index_1 = document.getElementById("dropdown_superior_1").selectedIndex;
		var superior_value_1 = ""; if (superior_index_1 > 0) { superior_value_1 = document.getElementById("dropdown_superior_1").options[superior_index_1].innerHTML };
		var superior_mod_value_1 = document.getElementById("superior_value_1").innerHTML;
		var superior_index_2 = document.getElementById("dropdown_superior_2").selectedIndex;
		var superior_value_2 = ""; if (superior_index_2 > 0) { superior_value_2 = document.getElementById("dropdown_superior_2").options[superior_index_2].innerHTML };
		var superior_mod_value_2 = document.getElementById("superior_value_2").innerHTML;
		// set new options
		for (a in affixes_superior) {
			var aff = affixes_superior[a];
			options += loadDetails(kind,aff,alvl,1,1,1,1,99,aff[0],aff[1],"","",[aff[4]],[])
		}
		document.getElementById("dropdown_superior_1").innerHTML = options
		document.getElementById("dropdown_superior_2").innerHTML = options
		// keep previously selected affix info (if compatible)
		if (superior_index_1 > 0) {
			for (opt in document.getElementById("dropdown_superior_1").options) {
				if (superior_value_1 == document.getElementById("dropdown_superior_1").options[opt].innerHTML) {
					document.getElementById("dropdown_superior_1").selectedIndex = opt
					doSuperior(1,opt)
					document.getElementById("range_superior_1").value = superior_mod_value_1
					document.getElementById("superior_value_1").innerHTML = superior_mod_value_1
					doSuperiorValue(1,superior_mod_value_1)
				}
			}
		}
		if (superior_index_2 > 0) {
			for (opt in document.getElementById("dropdown_superior_2").options) {
				if (superior_value_2 == document.getElementById("dropdown_superior_2").options[opt].innerHTML) {
					document.getElementById("dropdown_superior_2").selectedIndex = opt
					doSuperior(2,opt)
					document.getElementById("range_superior_2").value = superior_mod_value_2
					document.getElementById("superior_value_2").innerHTML = superior_mod_value_2
					doSuperiorValue(2,superior_mod_value_2)
				}
			}
		}
	}
}
// loadDetails - subfunction for load, iterates through the list of affixes and returns the relevant ones as a string of options
//	data is also configured to match the relevant options
// ---------------------------------
function loadDetails(kind,aff,alvl,prefix,spawnable,rare,lvl,maxlvl,group,mod1,mod2,mod3,included,excluded) {
	var options = "";
	if (spawnable == 1 && alvl >= lvl && alvl <= maxlvl && (rare == 1 || itemCustom.rarity != "rare")) {
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









// setArmor - handles 'armor' input
// ---------------------------------
function setArmor(value) {
	var min = itemCustom.def_low;
	var max = itemCustom.def_high;
	if (isNaN(value) == true) { value = itemCustom.base_defense }
	if (value < min) { value = min }
	if (value > max) { value = max }
	document.getElementById("armor").value = value
	itemCustom.base_defense = Number(value)
	setItemFromCustom()
}



// setIdentified - handles 'identified' checkbox
// ---------------------------------
function setIdentified(checked) {
	itemCustom.ID = checked
	item_settings.ID = checked
	document.getElementById("dropdown_id").selectedIndex = 0
	if (checked == false) { document.getElementById("dropdown_id").selectedIndex = 1 }
	//setValues()
	setItemFromCustom()
}
// setEthereal - handles 'ethereal' checkbox
// ---------------------------------
function setEthereal(checked) {
	itemCustom.ethereal = checked
	//setValues()
	setItemFromCustom()
}
// setSockets - handles 'sockets' dropdown
// ---------------------------------
function setSockets(selected) {
	itemCustom.sockets = selected
	doRuneword(0)
	setItemFromCustom()
}
// setRuneword - handles 'runeword' dropdown
// ---------------------------------
function setRuneword(selected) {
	doRuneword(selected)
	setItemFromCustom()
}
// doRuneword - wrapped by setRuneword
// ---------------------------------
function doRuneword(selected) {
	itemCustomPremade = {}
	var shown = "none";
	var sockets = document.getElementById("dropdown_sockets").selectedIndex;
	var rw_items = [];
	if (sockets > 1) { shown = "block" }
	for (rw in runewords) {
		var rw_length = runewords[rw].runes.length;
		if (rw_length == sockets) {
			for (itype in runewords[rw].itypes) {
				var i = runewords[rw].itypes[itype];
				var ait = affix_item_types[i];
				var match = false;
				if (i != "rod" && i != "mele" && i != "blun" && i != "shld" && i != "tkni" && i != "abow" && i != "aspe") {
					if (itemCustom[ait] == true) { match = true }
				} else if (i == "tkni" || i == "abow" || i == "aspe") {
					if (itemCustom[ait[0]] == true && itemCustom[ait[1]] == true) { match = true }
				} else {
					for (code in ait) { if (itemCustom[ait[code]] == true) { match = true } }
				}
				if (match == true) { rw_items[rw_items.length] = rw.split("_").join(" ").split("'").join("") }
			}
		}
	}
	var options = "<option class='gray-all'>" + "None" + "</option>";
	for (rw in rw_items) { options += "<option class='gray-all'>" + rw_items[rw] + "</option>" }
	//if (selected > rw_items.length) { selected = 0 }
	document.getElementById("dropdown_runeword").innerHTML = options
	document.getElementById("dropdown_runeword").selectedIndex = selected
	document.getElementById("select_runeword").style.display = shown
	if (selected > 0) {
		var group = document.getElementById("dropdown_group").value;
		for (itemNew in runeword_stats[group]) {
			var rw_name = runeword_stats[group][itemNew].name.split("'").join("");
			if (rw_name == "Infinity") { rw_name = "infinity" }
			if (rw_name == document.getElementById("dropdown_runeword").value) {
				for (affix in runeword_stats[group][itemNew]) {
					var statNew = runeword_stats[group][itemNew][affix];
					if (typeof(statNew) == 'string' || typeof(statNew) == 'number' || affix == "ctc" || affix == "cskill") {
						itemCustomPremade[affix] = statNew
					} else {
						itemCustomPremade[affix] = statNew[1]
					}
					itemCustomPremade.rarity = "rw"
				}
			}
		}
	}
}
// setQuality - handles 'quality' dropdown, sets superior/inferior info and shows/hides 'superior' dropdowns
// ---------------------------------
function setQuality(selected) {
	doQuality(selected)
	setValues()
}
// doQuality - wrapped by setQuality
// ---------------------------------
function doQuality(selected) {
	for (let n = 1; n <= 2; n++) {
		document.getElementById("select_superior_"+n).style.display = "none";
		document.getElementById("select_superior_value_"+n).style.display = "none";
	}
	if (selected == 2) {
		document.getElementById("select_superior_1").style.display = "block";
		itemCustom.superior = true;
		itemCustom.inferior = false;
		itemCustom.name_prefix = "Superior ";
		load("superior");
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
}
// setSuperior - handles 'superior' dropdowns
// ---------------------------------
function setSuperior(num,selected) {
	doSuperior(num,selected)
	setValues()
}
// doSuperior - wrapped by setSuperior
// ---------------------------------
function doSuperior(num,selected) {
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
	var first_empty_index = -1;
	for (let n = 1; n <= 2; n++) {
		document.getElementById("select_superior_"+n).style.display = "block"
		var index = document.getElementById("dropdown_superior_"+n).selectedIndex;
		if (index == 0 && first_empty_index < 0) { first_empty_index = index }
		else if (index == 0) { document.getElementById("select_superior_"+n).style.display = "none" }
	}
	doSuperiorValue(num,document.getElementById("range_superior_"+num).value)
}
// setSuperiorValue - handles 'superior' range values
// ---------------------------------
function setSuperiorValue(num, value) {
	doSuperiorValue(num,value)
	setValues()
}
// doSuperiorValue - wrapped by setSuperiorValue
// ---------------------------------
function doSuperiorValue(num, value) {
	document.getElementById("superior_value_"+num).innerHTML = value
	if (document.getElementById("dropdown_superior_"+num).selectedIndex == 1) { itemCustom.sup = Number(document.getElementById("range_superior_"+num).value) }
	if (document.getElementById("dropdown_superior_1").selectedIndex != 1 && document.getElementById("dropdown_superior_2").selectedIndex != 1) { itemCustom.sup = 0 }
}
// setAutomod - handles 'automod' dropdown
// ---------------------------------
function setAutomod(selected) {
	doAutomod(selected)
	for (let m = 1; m <= 2; m++) { doAutomodValue(m,document.getElementById("range_automod_"+m).value); setValues(); }
}
// doAutomod - wrapped by setAutomod
// ---------------------------------
function doAutomod(selected) {
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
	//for (let m = 1; m <= 2; m++) { doAutomodValue(m,document.getElementById("range_automod_"+m).value) }
}
// setAutomodValue - handles 'automod' range values
// ---------------------------------
function setAutomodValue(mod, value) {
	doAutomodValue(mod,value)
	setValues()
}
// doAutomodValue - wrapped by setAutomodValue
// ---------------------------------
function doAutomodValue(mod, value) {
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
}
// setPointmod - handles 'pointmod' dropdowns
// ---------------------------------
function setPointmod(num,selected) {
	doPointmod(num,selected)
	setValues()
}
// doPointmod - wrapped by setPointmod
// ---------------------------------
function doPointmod(num,selected) {
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
	doPointmodValue(num,document.getElementById("range_pointmod_"+num).value)
}
// setPointmodValue - handles 'pointmod' range values
// ---------------------------------
function setPointmodValue(num, value) {
	doPointmodValue(num,value)
	setValues()
}
// doPointmodValue - wrapped by setPointmodValue
// ---------------------------------
function doPointmodValue(num, value) {
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
}
// setAffix - handles 'prefix' & 'suffix' dropdowns
// ---------------------------------
function setAffix(num, selected, prefix) {
	doAffix(num,selected,prefix)
	for (let m = 1; m <= 3; m++) { doAffixValue(num,m,document.getElementById("range_affix_"+num+"_"+m).value,prefix); setValues(); }
}
// doAffix - wrapped by setAffix
// ---------------------------------
function doAffix(num, selected, prefix) {
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
		if (sel_index > 0) { used_groups[used_groups.length] = data.affix[pre].categories[data.affix[pre].index[sel_index]].info.group }
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
	// display no more than 1 empty dropdown for prefixes/suffixes
	if (itemCustom.rarity == "rare" || itemCustom.rarity == "craft") {
		var first_empty_index = -1;
		for (let n = 1; n <= 6; n++) {
			document.getElementById("select_affix_"+n).style.display = "block"
			if (n == 4) { first_empty_index = -1 }
			var index = document.getElementById("dropdown_affix_"+n).selectedIndex;
			if (index == 0 && first_empty_index < 0) { first_empty_index = index }
			else if (index == 0) { document.getElementById("select_affix_"+n).style.display = "none" }
		}
		//limit jewels to 4 affixes instead of 6
		if (itemCustom.type_affix == "jewel") {
			var amount = 0;
			for (let n = 1; n <= 6; n++) {
				var sel_index = document.getElementById("dropdown_affix_"+n).selectedIndex;
				if (sel_index > 0) { amount += 1 }
			}
			if (amount == 4) {
				for (let n = 1; n <= 6; n++) {
					var sel_index = document.getElementById("dropdown_affix_"+n).selectedIndex;
					if (sel_index == 0) { document.getElementById("select_affix_"+n).style.display = "none" }
				}
			}
		}
	}
	//for (let m = 1; m <= 3; m++) { doAffixValue(num,m,document.getElementById("range_affix_"+num+"_"+m).value,prefix) }
}
// setAffixValue - handles 'prefix' & 'suffix' range values
// ---------------------------------
function setAffixValue(num, mod, value, prefix) {
	doAffixValue(num,mod,value,prefix)
	setValues()
}
// doAffixValue - wrapped by setAffixValue
// ---------------------------------
function doAffixValue(num, mod, value, prefix) {
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
}
// setCorruption - handles 'corruption' dropdown
// ---------------------------------
function setCorruption(selected) {
	doCorruption(selected)
	setValues()
}
// doCorruption - wrapped by setCorruption
// ---------------------------------
function doCorruption(selected) {
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
					var most_sockets = itemCustom.max_sockets;
					if (itemCustom.ILVL <= 40 && typeof(itemCustom.max_sockets_lvl_40) != 'undefined') { most_sockets = itemCustom.max_sockets_lvl_40 }
					if (itemCustom.ILVL <= 25 && typeof(itemCustom.max_sockets_lvl_25) != 'undefined') { most_sockets = itemCustom.max_sockets_lvl_25 }
					if (min > most_sockets) { min = most_sockets }
					if (max > most_sockets) { max = most_sockets }
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
	for (let m = 1; m <= 2; m++) { doCorruptionValue(m,document.getElementById("range_corruption_"+m).value) }
}
// setCorruptionValue - handles 'corruption' range values
// ---------------------------------
function setCorruptionValue(num, value) {
	doCorruptionValue(num,value)
	setValues()
}
// doCorruptionValue - wrapped by setCorruptionValue
// ---------------------------------
function doCorruptionValue(num, value) {
	document.getElementById("corruption_value_"+num).innerHTML = value
}
// setUpgrade - handles 'upgrade' dropdown
// ---------------------------------
function setUpgrade(selected) {
	doUpgrade(selected)
	setValues()
}
// doUpgrade - wrapped by setUpgrade
// ---------------------------------
function doUpgrade(selected) {
	// reset old base affixes
	itemCustom[itemCustom.CODE] = false
	var old_max_sockets = itemCustom.max_sockets;
	var old_base_id = bases[itemCustom.base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
	for (affix in old_base_id) {
		// TODO: it might be better to just reset the data structure for base info (but it would need to be separate from other info in itemCustom)
		itemCustom[affix] = 0
	}
	// add new base affixes
	var base = itemCustom.original_base;
	if (selected > 0) { base = document.getElementById("dropdown_upgrade").options[selected].value }
	var base_id = bases[base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
	for (affix in base_id) {
		// TODO: don't rewrite qlvl? ...or make Level dropdown range based on ilvl instead of qlvl? is a new original_qlvl variable necessary?
		itemCustom[affix] = base_id[affix]
	}
	itemCustom[itemCustom.CODE] = true
	itemCustom.base = base
	// reset corruption if it would change
	if (document.getElementById("dropdown_corruption").selectedIndex == 1 && typeof(old_max_sockets) != 'undefined' && old_max_sockets != itemCustom.max_sockets) {
		for (let n = 1; n <= 2; n++) { document.getElementById("select_corruption_value_"+n).style.display = "none"; }
		data.corruption = {index:[0],categories:{}}
		load("corruption")
	}
}









// setValues - sets values for various affixes
// ---------------------------------
function setValues() {
	itemCustomAffixes = {}
	//if (document.getElementById("dropdown_sockets").selectedIndex > 1) {
	//	
	//}
	if (document.getElementById("dropdown_quality").selectedIndex == 2) {
		itemCustomAffixes.SUP = true
		for (let n = 1; n <= 2; n++) {
			var selected = document.getElementById("dropdown_superior_"+n).selectedIndex;
			if (selected > 0) {
				var value = Number(document.getElementById("range_superior_"+n).value);
				var code = data.superior.categories[data.superior.index[selected]].info["mod1"];
				if (typeof(itemCustomAffixes[code]) == 'undefined') { itemCustomAffixes[code] = 0 }
				itemCustomAffixes[code] += value
			}
		}
	} else {
		itemCustomAffixes.SUP = false
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
				// add poison bitrate
				if (code == "pDamage_all") {
					var pFrames = 25*Number(document.getElementById("range_affix_"+n+"_"+(m+1)).value);
					var pAmount = (value*256/pFrames + (pFrames-1)/pFrames);
					if (typeof(itemCustomAffixes["pDamage_all_bitrate"]) == 'undefined') { itemCustomAffixes["pDamage_all_bitrate"] = 0 }
					itemCustomAffixes["pDamage_all_bitrate"] += pAmount
				}
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
			itemCustomAffixes["STAT360"] = 100;
		}
	}
	if (typeof(itemCustomAffixes["pDamage_all_bitrate"]) != 'undefined') {
		// TODO: Correct formula (issue with rounding/flooring poison bitrates)
		var pFrames = 25*itemCustomAffixes["pDamage_duration"];
		itemCustomAffixes["pDamage_all"] = Math.ceil(0.02+(Math.floor(itemCustomAffixes["pDamage_all_bitrate"])-(pFrames-1)/pFrames)*pFrames/256);
	}
	setItemFromCustom()
}

// setItemFromCustom - 
// ---------------------------------
function setItemFromCustom() {
	itemTemp = itemCustom;
	var is_premade = false; if (itemTemp.type_affix == "rune" || itemTemp.type_affix == "gem" || itemTemp.type_affix == "other" || itemTemp.type_affix == "misc") { is_premade = true };
	if (itemTemp.rarity == "Regular") { itemTemp.rarity = "regular" }
	else if (itemTemp.rarity == "Magic") { itemTemp.rarity = "magic" }
	else if (itemTemp.rarity == "Rare") { itemTemp.rarity = "rare" }
	else if (itemTemp.rarity == "Set") { itemTemp.rarity = "set" }
	else if (itemTemp.rarity == "Unique") { itemTemp.rarity = "unique" }
	else if (itemTemp.rarity == "Craft") { itemTemp.rarity = "craft" }
	itemToCompare = {}
	for (affix in itemTemp) { itemToCompare[affix] = itemTemp[affix] }
	if (typeof(itemCustomPremade.name) != 'undefined') {
		itemTemp.name = itemCustomPremade.name
		itemTemp.name_prefix = ""
	}
	if (typeof(itemCustomPremade.name) == 'undefined' && itemTemp.rarity == "regular" && typeof(itemCustom.base) != 'undefined') {	// TODO: fix name before it gets to this point
		itemTemp.name = itemCustom.base
		if (itemTemp.superior == true) { itemTemp.name_prefix = "Superior " }
		if (itemTemp.inferior == true) { itemTemp.name_prefix = "Crude " }
	}
	if (is_premade == false && itemTemp.base != "Amulet" && itemTemp.base != "Ring" && itemTemp.base != "Arrows" && itemTemp.base != "Bolts" && itemTemp.base != "Small Charm" && itemTemp.base != "Large Charm" && itemTemp.base != "Grand Charm" && itemTemp.base != "Jewel") {
		var base = bases[itemTemp.base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
		for (affix in base) { itemToCompare[affix] = base[affix] }
	}
	for (affix in itemTemp) { itemToCompare[affix] = itemTemp[affix] }	// some base affixes are overridden by regular affixes
	for (affix in itemCustomAffixes) {
		if (typeof(itemToCompare[affix]) == 'undefined') { itemToCompare[affix] = 0 }
		if (isNaN(Number(itemCustomAffixes[affix])) == false && affix != "req_level" && affix != "req_strength" && affix != "req_dexterity" && affix != "qlvl") {
			itemToCompare[affix] += itemCustomAffixes[affix]
		} else {
			itemToCompare[affix] = itemCustomAffixes[affix]
		}
	}
	for (affix in itemCustomPremade) {
		if (typeof(itemToCompare[affix]) == 'undefined') { itemToCompare[affix] = 0 }
		if (isNaN(Number(itemCustomPremade[affix])) == false && affix != "req_level" && affix != "req_strength" && affix != "req_dexterity" && affix != "qlvl") {
			itemToCompare[affix] += itemCustomPremade[affix]
		} else {
			itemToCompare[affix] = itemCustomPremade[affix]
		}
	}
	if (itemToCompare.rarity == "rw") {
		var rw_name = itemToCompare.name.split(" ­ ")[0].split(" ").join("_").split("'").join("");
		if (rw_name == "Infinity") { rw_name = "infinity" }
		var s = 0;
		for (let i = 0; i < runewords[rw_name].runes.length; i++) { s+=1; }
		itemToCompare.sockets = s
	}
	
	if (itemCustom.CODE == "GOLD") { document.getElementById("select_amount").style.display = "block"; setAmount(document.getElementById("amount").value) }
	else { document.getElementById("select_amount").style.display = "none" }
	var force_simulate = false;
	if (typeof(itemCustom.QUANTITY) != 'undefined') { document.getElementById("select_quantity").style.display = "block"; setQuantity(itemCustom.QUANTITY); force_simulate = true; }	// TODO: this extra boolean is a symptom of increasingly worse "spaghetti" code
	else { document.getElementById("select_quantity").style.display = "none" }
	
	//printAffixes()
	setItemCodes()
	var reset_simulation = setPD2Codes()
	if (reset_simulation == false || force_simulate == true) { simulate() }
}

// setItemCodes - sets item codes
// ---------------------------------
function setItemCodes() {
	var name_stripped = itemTemp.name.split(" (")[0].split(" ­ ")[0];
	if (name_stripped == "infinity") { name_stripped = "Infinity" }
	itemToCompare.NAME = itemTemp.name_prefix + name_stripped + itemTemp.name_suffix
	itemToCompare.PRICE = Number(document.getElementById("price").value)
	itemToCompare.ID = true
	var is_premade = false; if (itemTemp.type_affix == "rune" || itemTemp.type_affix == "gem" || itemTemp.type_affix == "other" || itemTemp.type_affix == "misc") { is_premade = true };
	if (is_premade == false && itemTemp.base != "Amulet" && itemTemp.base != "Ring" && itemTemp.base != "Arrows" && itemTemp.base != "Bolts" && itemTemp.base != "Small Charm" && itemTemp.base != "Large Charm" && itemTemp.base != "Grand Charm" && itemTemp.base != "Jewel") {
		var base = bases[itemTemp.base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
		if (base.tier == 1) { itemToCompare.NORM = true }
		else if (base.tier == 2) { itemToCompare.EXC = true }
		else if (base.tier == 3) { itemToCompare.ELT = true }
	}
	if (typeof(itemToCompare.rarity) != 'undefined') {
		if (itemToCompare.rarity == "set") { itemToCompare.SET = true }
		else if (itemToCompare.rarity == "rare") { itemToCompare.RARE = true }
		else if (itemToCompare.rarity == "magic") { itemToCompare.MAG = true }
		else if (itemToCompare.rarity == "regular") { itemToCompare.NMAG = true; itemToCompare.always_id = true; }
		else if (itemToCompare.rarity == "unique") { itemToCompare.UNI = true }
		else if (itemToCompare.rarity == "rw") { itemToCompare.NMAG = true; itemToCompare.RW = true; itemToCompare.always_id = true; }
		else if (itemToCompare.rarity == "craft") { itemToCompare.always_id = true }
	} else {itemToCompare.UNI = true }
	if (itemToCompare.type == "rune") { itemToCompare.RUNENAME = itemToCompare.name.split(" ")[0] }
	itemToCompare[itemToCompare.CODE] = true
	//if (typeof(itemToCompare.velocity) != 'undefined') { if (itemToCompare.velocity < 0) { itemToCompare.velocity += 100000 } }	// negative values overflow for this in-game code
	if (typeof(itemToCompare.always_id) == 'undefined') { itemToCompare.always_id = false }
	if (itemToCompare.always_id == false && item_settings.ID == false) { itemToCompare.ID = false }
	if (typeof(itemTemp.ethereal) != 'undefined') { if (itemTemp.ethereal == 1) { itemToCompare.ETH = true } }	// TODO: fix so that this line isn't needed twice in this function
	if (itemToCompare.ID == true) {
		// affix codes translated to in-game codes
		for (affix in itemToCompare) { for (code in codes) { if (affix == code) { itemToCompare[codes[code]] = itemToCompare[affix] } } }
		if (typeof(itemToCompare.sup) != 'undefined') { if (itemToCompare.sup > 0) { if (typeof(itemToCompare.ED) == 'undefined') { itemToCompare.ED = 0 }; itemToCompare.ED += itemToCompare.sup; } }
		if (itemToCompare.CODE == "aq2" || itemToCompare.CODE == "cq2" || itemToCompare.CODE == "aqv" || itemToCompare.CODE == "cqv") { itemToCompare.QUANTITY = 500; character.CHARSTAT70 = 500; }
		if (typeof(itemToCompare.sockets) != 'undefined') { itemToCompare.SOCK = itemToCompare.sockets }
		itemToCompare.DEF = Math.ceil((~~itemToCompare.base_defense * (1+~~itemTemp.ethereal*0.5) * (1+~~itemTemp.e_def/100+~~itemTemp.sup/100)) + ~~itemTemp.defense + Math.floor(~~itemTemp.defense_per_level*character.CLVL))
		itemToCompare.REQ_STR = Math.ceil(~~itemToCompare.req_strength * (1+(~~itemToCompare.req/100)) - ~~itemToCompare.ethereal*10)
		itemToCompare.REQ_DEX = Math.ceil(~~itemToCompare.req_dexterity * (1+(~~itemToCompare.req/100)) - ~~itemToCompare.ethereal*10)
		itemToCompare.BLOCK = ~~itemToCompare.block + ~~itemToCompare.ibc
		itemToCompare.ITEMSTAT17 = ~~itemToCompare.e_damage + ~~itemToCompare.damage_bonus
		// TODO: Add more codes that aren't handled properly by codes[code]
	} else {
		itemToCompare.SUP = false
		for (affix in itemToCompare) {
			for (code in codes) { if (affix == code) { itemToCompare[codes[code]] = 0 } }
			if (typeof(unequipped[affix]) != 'undefined') {
				var ignored_affixes = ["base_damage_min","base_damage_max","base_defense","req_level","req_strength","req_dexterity","durability","baseSpeed","range","throw_min" ,"throw_max","base_min_alternate","base_max_alternate","block","velocity","tier","group","type","rarity","downgrade","upgrade","subtype","def_low","def_high","max_sockets","max_sockets_lvl_25","max_sockets_lvl_40","nonmetal","smite_min","smite_max","kick_min","twoHands","only","shield","qlvl"];	// affixes from 'bases' (except damage_vs_undead)
				var ignored = false;
				for (i in ignored_affixes) { if (affix == ignored_affixes[i]) { ignored = true } }
				if (ignored == false) { itemToCompare[affix] = unequipped[affix] }
			}
		}
		//character.CHARSTAT70 = 0;
		itemToCompare.DEF = ~~itemToCompare.base_defense
		itemToCompare.REQ_STR = ~~itemToCompare.req_strength
		itemToCompare.REQ_DEX = ~~itemToCompare.req_dexterity
		itemToCompare.BLOCK = ~~itemToCompare.block
		itemToCompare.ITEMSTAT17 = 0
	}
	if (typeof(itemTemp.ethereal) != 'undefined') { if (itemTemp.ethereal == 1) { itemToCompare.ETH = true } }	// TODO: fix so that this line isn't needed twice in this function
	itemToCompare.ITEMSTAT31 = itemToCompare.DEF
	itemToCompare.ITEMSTAT18 = itemToCompare.ITEMSTAT17
	for (let i = 0; i <= 500; i++) { if (typeof(itemToCompare["ITEMSTAT"+i]) != 'undefined') { itemToCompare["STAT"+i] = itemToCompare["ITEMSTAT"+i] } }
	if (typeof(itemToCompare.STAT73) != 'undefined') { itemToCompare.STAT72 = itemToCompare.STAT73 }
	for (let i = 0; i <= 100; i++) {
		if (i < 10) {
			if (typeof(itemToCompare["STAT00"+i]) != 'undefined') { itemToCompare["STAT00"+i] = itemToCompare["STAT"+i] }
			if (typeof(itemToCompare["SK00"+i]) != 'undefined') { itemToCompare["SK00"+i] = itemToCompare["SK"+i] }
		}
		if (typeof(itemToCompare["STAT0"+i]) != 'undefined') { itemToCompare["STAT0"+i] = itemToCompare["STAT"+i] }
		if (typeof(itemToCompare["SK0"+i]) != 'undefined') { itemToCompare["SK0"+i] = itemToCompare["SK"+i] }
	}
	// TODO: Validate ILVL
	if (typeof(itemToCompare.RW) == 'undefined') { itemToCompare.RW = false }
	if (typeof(itemToCompare.NMAG) == 'undefined') { itemToCompare.NMAG = false }
	if (typeof(itemToCompare.ETH) == 'undefined') { itemToCompare.ETH = false }
	if (typeof(itemToCompare.SOCK) == 'undefined') { itemToCompare.SOCK = 0 }
	if (typeof(itemToCompare.RUNE) == 'undefined') { itemToCompare.RUNE = 0 }
	if (typeof(itemToCompare.RUNENAME) == 'undefined') { itemToCompare.RUNENAME = "" }
	if (typeof(itemToCompare.GLEVEL) == 'undefined') { itemToCompare.GLEVEL = "" }
	if (typeof(itemToCompare.GTYPE) == 'undefined') { itemToCompare.GTYPE = "" }
	if (typeof(itemToCompare.ILVL) == 'undefined') { itemToCompare.ILVL = 0 }
	if (typeof(itemToCompare.ALVL) == 'undefined') { itemToCompare.ALVL = 0 }
	if (typeof(itemToCompare.QUANTITY) == 'undefined') { itemToCompare.QUANTITY = 0 }
	if (typeof(itemToCompare.range) == 'undefined') { itemToCompare.range = 0 }
	if (typeof(itemToCompare.baseSpeed) == 'undefined') { itemToCompare.baseSpeed = 0 }
	
	var two_handers_1 = ["lax","bax","btx","gax","gix","9la","9ba","9bt","9ga","9gi","7la","7ba","7bt","7ga","7gi","mau","gma","9m9","9gm","7m7","7gm","2hs","clm","gis","bsw","flb","gsd","92h","9cm","9gs","9b9","9fb","9gd","72h","7cm","7gs","7b7","7fb","7gd","spr","tri","brn","spt","pik","9sr","9tr","9br","9st","9p9","7sr","7tr","7br","7st","7p7","am3","am4","am8","am9","amd","ame"];
	var two_handers_2 = ["WP8","WP9","WP10","WP11"];
	itemToCompare["2H"] = false;
	itemToCompare["1H"] = false;
	for (th in two_handers_1) { if (itemToCompare.CODE == two_handers_1[th]) { itemToCompare["2H"] = true; } }
	for (th in two_handers_2) { if (typeof(itemToCompare[two_handers_2[th]]) != 'undefined') { if (itemToCompare[two_handers_2[th]] == true) { itemToCompare["2H"] = true; } } }
	if (typeof(itemToCompare.WEAPON) != 'undefined') { if (itemToCompare["2H"] == false && itemToCompare.WEAPON == true) { itemToCompare["1H"] = true } }
	
	// implement missing named attribute codes:
	if (typeof(itemToCompare.STAT93) != 'undefined') { itemToCompare.IAS = itemToCompare.STAT93; itemToCompare.STAT68 = itemToCompare.STAT93; }
	if (typeof(itemToCompare.STAT105) != 'undefined') { itemToCompare.FCR = itemToCompare.STAT105 }
	if (typeof(itemToCompare.STAT99) != 'undefined') { itemToCompare.FHR = itemToCompare.STAT99 }
	if (typeof(itemToCompare.STAT102) != 'undefined') { itemToCompare.FBR = itemToCompare.STAT102 }
	if (typeof(itemToCompare.life) != 'undefined') { itemToCompare.LIFE = itemToCompare.life }
	if (typeof(itemToCompare.mana) != 'undefined') { itemToCompare.MANA = itemToCompare.mana }
	
	// implement missing PoD keywords:
	itemToCompare.CL = ""
	itemToCompare.CLASS = ""
	if (typeof(itemToCompare.CL1) != 'undefined') { if (itemToCompare.CL1 == true) { itemToCompare.CL = "Dru"; itemToCompare.CLASS = "Druid"; } }
	if (typeof(itemToCompare.CL2) != 'undefined') { if (itemToCompare.CL2 == true) { itemToCompare.CL = "Bar"; itemToCompare.CLASS = "Barbarian"; } }
	if (typeof(itemToCompare.CL3) != 'undefined') { if (itemToCompare.CL3 == true) { itemToCompare.CL = "Pal"; itemToCompare.CLASS = "Paladin"; } }
	if (typeof(itemToCompare.CL4) != 'undefined') { if (itemToCompare.CL4 == true) { itemToCompare.CL = "Nec"; itemToCompare.CLASS = "Necromancer"; } }
	if (typeof(itemToCompare.CL5) != 'undefined') { if (itemToCompare.CL5 == true) { itemToCompare.CL = "Ass"; itemToCompare.CLASS = "Assassin"; } }
	if (typeof(itemToCompare.CL6) != 'undefined') { if (itemToCompare.CL6 == true) { itemToCompare.CL = "Sor"; itemToCompare.CLASS = "Sorceress"; } }
	if (typeof(itemToCompare.CL7) != 'undefined') { if (itemToCompare.CL7 == true) { itemToCompare.CL = "Ama"; itemToCompare.CLASS = "Amazon"; } }
	itemToCompare.QUAL = ""
	if (typeof(itemToCompare.rarity) != 'undefined') {
		if (itemToCompare.SUP != true && itemToCompare.INF != true) { itemToCompare.QUAL = itemToCompare.rarity[0].toUpperCase() + itemToCompare.rarity.substring(1) }
		else {
			if (itemToCompare.SUP == true) { itemToCompare.QUAL = "Superior" }
			else if (itemToCompare.INF == true) { itemToCompare.QUAL = "Inferior" }
		}
		if (itemToCompare.QUAL == "Regular") { itemToCompare.QUAL = "Normal" }
	}
	itemToCompare.QT = "None"
	if (typeof(itemToCompare.tier) != 'undefined') {
		if (itemToCompare.tier == 1) { itemToCompare.QT = "Normal" }
		else if (itemToCompare.tier == 2) { itemToCompare.QT = "Exceptional" }
		else if (itemToCompare.tier == 3) { itemToCompare.QT = "Elite" }
	}
	itemToCompare.BASENAME = itemToCompare.NAME
	if (typeof(itemToCompare.base) != 'undefined') { itemToCompare.BASENAME = itemToCompare.base }
	if (typeof(itemToCompare.RES) != 'undefined') {
		if (typeof(itemToCompare.STAT39) == 'undefined') { itemToCompare.STAT39 = 0 }
		if (typeof(itemToCompare.STAT41) == 'undefined') { itemToCompare.STAT41 = 0 }
		if (typeof(itemToCompare.STAT43) == 'undefined') { itemToCompare.STAT43 = 0 }
		if (typeof(itemToCompare.STAT45) == 'undefined') { itemToCompare.STAT45 = 0 }
		itemToCompare.STAT39 += itemToCompare.RES
		itemToCompare.STAT41 += itemToCompare.RES
		itemToCompare.STAT43 += itemToCompare.RES
		itemToCompare.STAT45 += itemToCompare.RES
	}
}

// setPD2Codes - sets item codes for Project D2
//	return: false, or true if a higher-level function was called
// ---------------------------------
function setPD2Codes() {
	var code_originals = ["EQ1","EQ2","EQ3","EQ4","EQ5","EQ6","EQ7","WP1","WP2","WP3","WP4","WP5","WP6","WP7","WP8","WP9","WP10","WP11","WP12","WP13","CL1","CL2","CL3","CL4","CL5","CL6","CL7"];
	var code_alternates = ["HELM","CHEST","SHIELD","GLOVES","BOOTS","BELT","CIRC","AXE","MACE","SWORD","DAGGER","THROWING","JAV","SPEAR","POLEARM","BOW","XBOW","STAFF","WAND","SCEPTER","DRU","BAR","DIN","NEC","SIN","SOR","ZON"];
	var code_affixes = {ar:"AR",fRes:"FRES",cRes:"CRES",lRes:"LRES",pRes:"PRES",frw:"FRW",damage_min:"MINDMG",damage_max:"MAXDMG",strength:"STR",dexterity:"DEX",mf:"MFIND",gf:"GFIND",damage_to_mana:"DTM",life_replenish:"REPLIFE",max_durability:"MAXDUR"};
	var code_other = {req_level:"LVLREQ",QUANTITY:"QTY",mana_per_kill:"MAEK",autorepair:"REPAIR",ar_bonus:"ARPER"};
	var selected_group_index = document.getElementById("dropdown_group").selectedIndex;
	var reset_selected = false;
	
	// Both PD2 and PoD seem to have all of these codes now... TODO: test PoD codes, especially whether certain groups include/exclude the same related categories
	if (settings.version == 1) {
		if (typeof(itemToCompare.WP5) != 'undefined' || typeof(itemToCompare.WP7) != 'undefined') { if (itemToCompare.WP5 == true || itemToCompare.WP7 == true) { itemToCompare.WP6 = true } }
		if (typeof(itemToCompare.CL3) != 'undefined' || typeof(itemToCompare.CL4) != 'undefined') { if (itemToCompare.CL3 == true || itemToCompare.CL4 == true) { itemToCompare.EQ3 = true } }
		if (typeof(itemToCompare.WP10) != 'undefined') { if (itemToCompare.WP10 == true) { itemToCompare.WP9 = false } }
		if (typeof(itemToCompare.EQ7) != 'undefined') { if (itemToCompare.EQ7 == true) { itemToCompare.EQ1 = false } }
	} else {
		if (typeof(itemToCompare.WP5) != 'undefined' && typeof(itemToCompare.WP6) != 'undefined' && typeof(itemToCompare.WP7) != 'undefined') { if ((itemToCompare.WP5 == true && itemToCompare.WP6 == true && itemToCompare.WP7 != true) || (itemToCompare.WP7 == true && itemToCompare.WP6 == true && itemToCompare.WP5 != true)) { itemToCompare.WP6 = false } }
		if (typeof(itemToCompare.CL3) != 'undefined' && typeof(itemToCompare.EQ3) != 'undefined') { if (itemToCompare.CL3 == true && itemToCompare.EQ3 == true) { itemToCompare.EQ3 = false } }
		if (typeof(itemToCompare.CL4) != 'undefined' && typeof(itemToCompare.EQ3) != 'undefined') { if (itemToCompare.CL4 == true && itemToCompare.EQ3 == true) { itemToCompare.EQ3 = false } }
		if (typeof(itemToCompare.WP10) != 'undefined') { if (itemToCompare.WP10 == true) { itemToCompare.WP9 = true } }
		if (typeof(itemToCompare.EQ7) != 'undefined') { if (itemToCompare.EQ7 == true) { itemToCompare.EQ1 = true } }
	}
	// TODO: clean up setPD2Codes() so that it only includes differences between PD2 and PoD codes... many of the codes seem to be shared now
	for (let i = 0; i < code_originals.length; i++) {
		if (typeof(itemToCompare[code_originals[i]]) != 'undefined') { if (itemToCompare[code_originals[i]] == true) { itemToCompare[code_alternates[i]] = true } }
	}
	for (aff in code_affixes) {
		if (typeof(itemToCompare[codes[aff]]) != 'undefined') { itemToCompare[code_affixes[aff]] = itemToCompare[codes[aff]] }
		if (code_affixes[aff] == "FRW") { if (typeof(itemToCompare[codes["frw"]]) != 'undefined' || typeof(itemToCompare[codes["velocity"]]) != 'undefined') { itemToCompare[code_affixes[aff]] = ~~itemToCompare[codes["frw"]] + ~~itemToCompare[codes["velocity"]] } }	// speed penalties from armor are counted as FRW in PD2
	}
	for (aff in code_other) {
		if (typeof(itemToCompare[aff]) != 'undefined') { itemToCompare[code_other[aff]] = itemToCompare[aff] }
	}
	if (settings.version == 1) {
		document.getElementById("character_class").style.display = "inline-table"
		document.getElementById("character_shop").style.display = "inline-table"
		document.getElementById("character_gold").style.display = "none"
		if (selected_group_index < 9) { document.getElementById("select_price").style.display = "block" }	// shows price for all equipment groups (excludes "charm", "socketable", "miscellaneous")
		if (selected_group_index > 9) {
			var premade_type = itemToCompare.type_affix;
			var selected_name_index = document.getElementById("dropdown_name").selectedIndex;
			reset_selected = false;
			for (i in premade[premade_type]) { if (typeof(premade[premade_type][i].pd2) != 'undefined') {
				if (premade[premade_type][i].pd2 == 1) {
					document.getElementById("dropdown_name").options[i].style.display = "block"
				} else if (premade[premade_type][i].pd2 == 0) {
					if (selected_name_index == i) { reset_selected = true }
					document.getElementById("dropdown_name").options[i].style.display = "none"
				}
			} }
			if (reset_selected == true) {
				document.getElementById("dropdown_name").selectedIndex = 0
				setName(document.getElementById("dropdown_name").options[0].innerHTML)
			}
		}
	} else {
		document.getElementById("character_class").style.display = "none"
		document.getElementById("character_shop").style.display = "none"
		document.getElementById("character_gold").style.display = "inline-table"
		if (selected_group_index < 9) { document.getElementById("select_price").style.display = "block" }	// shows price for all equipment groups (excludes "charm", "socketable", "miscellaneous")
		if (selected_group_index > 9) {
			var premade_type = itemToCompare.type_affix;
			var selected_name_index = document.getElementById("dropdown_name").selectedIndex;
			reset_selected = false;
			for (i in premade[premade_type]) { if (typeof(premade[premade_type][i].pd2) != 'undefined') {
				if (premade[premade_type][i].pd2 == 1) {
					if (selected_name_index == i) { reset_selected = true }
					document.getElementById("dropdown_name").options[i].style.display = "none"
				} else if (premade[premade_type][i].pd2 == 0) {
					document.getElementById("dropdown_name").options[i].style.display = "block"
				}
			} }
			if (reset_selected == true) {
				document.getElementById("dropdown_name").selectedIndex = 0
				setName(document.getElementById("dropdown_name").options[0].innerHTML)
			}
		}
		// TODO: update pointmod options if necessary
	}
	//if (itemToCompare.type_affix == "quiver") { setType("quiver"); reset_selected = true; }	// TODO: This kind of thing should only be called once when changing versions, rather than after every changed detail. The same principle probably applies to other parts of the program, resulting in non-immediate updates.
	return reset_selected
}


// setPrice - 
// ---------------------------------
function setPrice(val) {
	val = Number(val)
	var min = document.getElementById("price").min;
	var max = document.getElementById("price").max;
	if (val < min) { val = min }
	if (val > max) { val = max }
	document.getElementById("price").value = val
	itemToCompare.PRICE = val
	simulate()
}

// setAmount - 
// ---------------------------------
function setAmount(val) {
	if (itemCustom.CODE == "GOLD") {
		val = Number(val)
		var min = document.getElementById("amount").min;
		var max = document.getElementById("amount").max;
		if (val < min) { val = min }
		if (val > max) { val = max }
		document.getElementById("amount").value = val
		itemToCompare.money = val
		itemToCompare.GOLD = val
	}
	simulate()
}

// setQuantity - 
// ---------------------------------
function setQuantity(val) {
	if (typeof(itemCustom.QUANTITY) != 'undefined') {
		val = Number(val)
		var min = document.getElementById("quantity").min;
		var max = document.getElementById("quantity").max;
		if (min < itemToCompare.quant_min) { min = itemToCompare.quant_min }
		if (max > itemToCompare.quant_max) { max = itemToCompare.quant_max }
		if (settings.version == 1) {
			if (itemToCompare.CODE == "key") { max = 50 }
			else if (itemToCompare.CODE == "tbk" || itemToCompare.CODE == "ibk") { max = 80 }
		}
		if (val < min) { val = min }
		if (val > max) { val = max }
		document.getElementById("quantity").value = val
		itemToCompare.QUANTITY = val
		itemToCompare.QTY = val
	}
	//simulate()	// moved to setItemFromCustom()
}

/* Notes about PD2 changes:
	Implemented
		* alternate codes for item groups (HELM, CHEST, SHIELD, GLOVES, BOOTS, BELT, CIRC, AXE, MACE, SWORD, DAGGER, THROWING, JAV, SPEAR, POLEARM, BOW, XBOW, STAFF, WAND, SCEPTER, DRU, BAR, DIN, NEC, SIN, SOR, ZON)
		* item group difference: all WP5/WP7 items (throwing/spears) are also considered part of WP6 (javelins)
		* item group difference: WP10 items (crossbows) are not included in WP9 (bows)
		* item group difference: EQ7 items (circlets) are not included in EQ1 (helms)
		* item group difference: all CL3/CL4 items (paladin/necromancer shields) are also considered part of EQ3 (shields)
		* %DARK_GREEN% instead of %DGREEN%
		* DIFF instead of DIFFICULTY
		* {} used for item descriptions
		* %NL% allows multiple lines
		* new info codes: LVLREQ, PRICE, QTY, ALVL, QLVL																						// Note: PRICE is not calculated, so the user may enter impossible values (calculation formula is unknown)
		* new affix codes: AR, FRES, CRES, LRES, PRES, FRW, MINDMG, MAXDMG, STR, DEX, MFIND, GFIND, DTM, REPLIFE, MAXDUR, MAEK, REPAIR, ARPER	// Note: REPAIR value of X is only 0 or 1, instead of X = Y*100/Z (Y = amount repaired, Z = seconds to repair), MINDMG/MAXDMG may not apply to all kinds of damage
		* new codes for PD2 items: wss, lbox, dcma, dcbl, dcho, dcso, imra, imma, scou, rera, upma, t11, t12, t13, t14, t15, t16, t17, t18		// Note: t16, t17, t18 should be switchable between regular/magic/rare, not currently in the game: t11, t12, t13, t14, t15
		* new keywords: %QTY%, %RANGE%, %WPNSPD%, %ALVL%
		* new codes for stacked gems (flawless/perfect) and stacked runes: normal code + s
		* unique items with Indestructible changed to Repair-over-Time (can be ethereal now): The Gavel of Pain, Schaefer's Hammer, Doombringer, The Grandfather, Steel Pillar
		* old codes for PoD items removed: cx5, cx6, cx7, maz, ma1, ma2, ma3, ma4, ma5, ma6, ma7, ma8, ma9, cm4, cx8
		* numbered stats (ITEMSTAT, CHARSTAT) removed
	Not Implemented
		* new boolean code: CRAFT
		* new keywords: %BORDER-00%, %MAP-00%, %DOT-00%, %PX-00%			// Currently ignored (instead of erroneously being displayed in the item name)
		* aqv & cqv for regular quivers, aq2 & cq2 removed
		* new affix code: FOOLS
		* Bul-Kathos' Death Band (new set ring)
		* Infernal Torch (set wand) changed to Infernal Spike (set dagger)
		* many unique/set/runeword item changes
		* many skilltree changes											// pointmods are implemented, but their availability hasn't been checked
*/


/* TODO:
		* lots of new codes/keywords available for PoD, including keywords such as %STAT45% (poison resistance) or %SK18% (enhanced [max] damage on non-weapons)
*/