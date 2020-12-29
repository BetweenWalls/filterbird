
// TODO: items with multiple lines should have pre-NAME modifications shown at the start of the second line

var itemToCompare = {name:"5000 Gold",NAME:"5000 Gold",CODE:"GOLD",GOLD:5000,ID:true,always_id:true,rarity:"common"};
var character = {CLVL:90,CHARSTAT14:199000,CHARSTAT15:199000,DIFFICULTY:2,ILVL:90,CHARSTAT70:0,CHARSTAT13:1000};
var item_settings = {ID:false};
var settings = {auto_difficulty:true,pd2_option:1,validation:1};
var colors = {
	White:"#dddddd",
	Gray:"#707070",
	Blue:"#6666bb",	
	Yellow:"#cccc77",
	Gold:"#9b885e",
	Green:"#00f000",
	DarkGreen:"#255d16",
	Tan:"#9b8c6d",
	Black:"Black",
	Orange:"#c48736",
	Purple:"#9b2aea",
	Red:"#a94838"
};

// startup - runs when the page loads
// ---------------------------------
function startup() {
	loadItems()
	loadOptions()
	var r = Math.floor(Math.random()*5+1);
	var background = "./images/act_"+r+".png";
	document.getElementById("background_1").src = background
	document.getElementById("background_2").src = background
	loadCustomization()
	
	// TODO: Add URL parameters for these options
	document.getElementById("original").checked = false
	toggleOriginalChoices(false)
	document.getElementById("non_item_custom").checked = true
	toggleNonItemDetails(true)
	document.getElementById("custom").checked = true
	toggleCustom(true)
	document.getElementById("custom_format").checked = true
	toggleCustomFormat(true)
	document.getElementById("pd2_option").checked = false
	settings.pd2_option = 0
	document.getElementById("select_price").style.display = "none"
	
	//document.getElementById("debug").style.display = "block"
	//document.getElementById("simulate_custom").style.display = "block"
}

// loadItems - adds equipment and other items to the item dropdown menu
// ---------------------------------
function loadItems() {
	var choices = "<option>­ ­ ­ ­ Select Item</option>";
	for (group in equipment) {
		for (itemNew in equipment[group]) {
			var item = equipment[group][itemNew];
			var addon = "";
			if (item == equipment[group][0]) { addon = "<option class='gray-all' style='color:gray' disabled>" + item.name + "</option>" }
			else if (typeof(item.rarity) != 'undefined') { addon = "<option class='dropdown-"+item.rarity+"'>" + item.name + "</option>" }
			else { addon = "<option class='dropdown-unique'>" + item.name + "</option>" }
			choices += addon
		}
	}
	document.getElementById("dropdown_item").innerHTML = choices
}

// loadOptions - populates the dropdown menus (other than the item menu)
// ---------------------------------
function loadOptions() {
	document.getElementById("dropdown_id").innerHTML = "<option>Id</option><option selected>Unid (if possible)</option>";
	var options_clvl = "<option class='gray-all' style='color:gray' disabled>Character Level</option>"; for (let i = 1; i < 100; i++) { options_clvl += "<option>"+i+"</option>" }
	document.getElementById("dropdown_clvl").innerHTML = options_clvl
	document.getElementById("dropdown_clvl").selectedIndex = character.CLVL
	var options_ilvl = "<option class='gray-all' style='color:gray' disabled>Item Level</option>"; for (let i = 1; i < 100; i++) { options_ilvl += "<option>"+i+"</option>" }
	document.getElementById("dropdown_ilvl").innerHTML = options_ilvl
	document.getElementById("dropdown_ilvl").selectedIndex = character.ILVL
}

// setID - handles input from the ID dropdown menu
//	value: 'Id' or 'Unid (if possible)'
// ---------------------------------
function setID(value) {
	if (value == "Id") { item_settings.ID = true; document.getElementById("identified").checked = true; }
	else { item_settings.ID = false; document.getElementById("identified").checked = false; }
	itemToCompare.ID = item_settings.ID
	setItem(document.getElementById("dropdown_item").value )
}

// setCLVL - handles input from the CLVL dropdown menu
//	value: character's level (1-99)
// ---------------------------------
function setCLVL(value) {
	character.CLVL = Number(value)
	// keep clvl consistent (temporary while old item selection & non-item details coexist)
	document.getElementById("clvl").value = Number(value)
	if (character.CHARSTAT14 > (character.CLVL * 10000)) {
		character.CHARSTAT14 = character.CLVL * 10000
		document.getElementById("gold_char").value = character.CHARSTAT14
	}
	if (value == 1) { character.CHARSTAT13 = 0 }
	else { character.CHARSTAT13 = 1000 }
	simulate()
}

// setILVL - handles input from the ILVL dropdown menu
//	value: item's level (1-99)
// ---------------------------------
function setILVL(value) {
	// keep ilvl consistent (temporary while old item selection & custom item editing coexist)
	itemCustom.ILVL = value
	document.getElementById("ilvl").value = value
	
	character.ILVL = Number(value)
	if (settings.auto_difficulty == true) {
		if (value < 36) { character.DIFFICULTY = 0 }
		else if (value > 66) { character.DIFFICULTY = 2 }
		else { character.DIFFICULTY = 1 }
	}
	setItem(document.getElementById("dropdown_item").value )
}

// setItem - handles input from the item dropdown menu
//	value: the item's name
// ---------------------------------
function setItem(value) {
	if (value != "­ ­ ­ ­ Select Item") {
		for (group in equipment) { for (itemNew in equipment[group]) { if (value == equipment[group][itemNew].name) {
			var item = equipment[group][itemNew];
			itemToCompare = {}
			for (affix in item) { itemToCompare[affix] = item[affix] }
			itemToCompare.NAME = value.split(" (")[0].split(" ­ ")[0]
			itemToCompare.ILVL = character.ILVL
			itemToCompare.PRICE = Number(document.getElementById("price").value)
			itemToCompare.ID = true
			if (typeof(itemToCompare.base) != 'undefined') {
				var base = bases[itemToCompare.base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
				for (affix in base) { itemToCompare[affix] = base[affix] }
				if (base.tier == 1) { itemToCompare.NORM = true }
				else if (base.tier == 2) { itemToCompare.EXC = true }
				else if (base.tier == 3) { itemToCompare.ELT = true }
			} else {
				if (group == "amulet" && typeof(itemToCompare.CODE) == 'undefined') { itemToCompare.CODE = "amu"; itemToCompare.base = "Amulet"; }
				else if (group == "ring") { itemToCompare.CODE = "rin"; itemToCompare.base = "Ring"; }
				else if (group == "charms") {
					if (item.size == "small") { itemToCompare.CODE = "cm1"; itemToCompare.base = "Small Charm"; }
					else if (item.size == "large") { itemToCompare.CODE = "cm2"; itemToCompare.base = "Large Charm"; }
					else if (item.size == "grand") { itemToCompare.CODE = "cm3"; itemToCompare.base = "Grand Charm"; }
				}
				else if (group == "socketables") {
					if (item.type == "jewel") { itemToCompare.CODE = "jew"; itemToCompare.base = "Jewel"; }
					else if (item.type == "rune") { itemToCompare.RUNENAME = itemToCompare.name.split(" ")[0] }
					else if (item.type == "gem") {
						var g_level = [0,"Chipped","Flawed","Standard","Flawless","Perfect"];
						var g_type = [0,"Amethyst","Diamond","Emerald","Ruby","Sapphire","Topaz","Skull"];
						itemToCompare.GLEVEL = g_level[itemToCompare.GEMLEVEL]
						itemToCompare.GTYPE = g_type[itemToCompare.GEMTYPE]
					}
				}
				else if (itemToCompare.CODE == "aq2") { itemToCompare.base = "Arrows" }
				else if (itemToCompare.CODE == "cq2") { itemToCompare.base = "Bolts" }
				else if (itemToCompare.CODE == "ma1" || itemToCompare.CODE == "ma2" || itemToCompare.CODE == "ma4" || itemToCompare.CODE == "ma5" || itemToCompare.CODE == "ma6" || itemToCompare.CODE == "ma7" || itemToCompare.CODE == "ma8" || itemToCompare.CODE == "ma9") {
					itemToCompare.base = itemToCompare.name
					itemToCompare.NAME = rare_prefix[Math.floor(Math.random()*rare_prefix.length)] + " Eye"
				}
				else if (itemToCompare.CODE == "cm4") { itemToCompare.base = "Grand Charm" }	// TOCHECK: Does this item still display with 2 lines?
			}
			for (affix in item) { itemToCompare[affix] = item[affix] }	// some base affixes are overridden by regular affixes
			if (typeof(itemToCompare.rarity) != 'undefined') {
				if (itemToCompare.rarity == "set") { itemToCompare.SET = true }
				else if (itemToCompare.rarity == "rare") { itemToCompare.RARE = true }
				else if (itemToCompare.rarity == "magic") { itemToCompare.MAG = true }
				else if (itemToCompare.rarity == "common") { itemToCompare.NMAG = true; itemToCompare.always_id = true; }
				else if (itemToCompare.rarity == "rw") { itemToCompare.NMAG = true; itemToCompare.RW = true; itemToCompare.always_id = true; }
				else if (itemToCompare.rarity == "unique") { itemToCompare.UNI = true }
				else if (itemToCompare.rarity == "craft") { itemToCompare.always_id = true }
			} else { itemToCompare.UNI = true }
			if (itemToCompare.RW == true) {
				var rw_name = itemToCompare.name.split(" ­ ")[0].split(" ").join("_").split("'").join("");
				if (rw_name == "Infinity") { rw_name = "infinity" }
				var s = 0;
				for (let i = 0; i < runewords[rw_name].runes.length; i++) { s+=1; }
				itemToCompare.sockets = s
			}
			itemToCompare[itemToCompare.CODE] = true
			if (typeof(itemToCompare.velocity) != 'undefined') { if (itemToCompare.velocity < 0) { itemToCompare.velocity += 100000 } }	// negative values overflow for this in-game code
			if (typeof(itemToCompare.always_id) == 'undefined') { itemToCompare.always_id = false }
			if (itemToCompare.always_id == false && item_settings.ID == false) { itemToCompare.ID = false }
			if (itemToCompare.ID == true) {
				// affix codes translated to in-game codes
				for (affix in itemToCompare) { for (code in codes) { if (affix == code) { itemToCompare[codes[code]] = itemToCompare[affix] } } }
				if (typeof(itemToCompare.sup) != 'undefined') { if (itemToCompare.sup > 0) { if (typeof(itemToCompare.ED) == 'undefined') { itemToCompare.ED = 0 }; itemToCompare.ED += itemToCompare.sup; itemToCompare.SUP = true; if (item.rarity == "common") { itemToCompare.NAME = "Superior "+itemToCompare.NAME } } }
				if (typeof(itemToCompare.ethereal) != 'undefined' && itemToCompare.ethereal == 1) { itemToCompare.ETH = true }
				if (itemToCompare.CODE == "aq2" || itemToCompare.CODE == "cq2" || itemToCompare.CODE == "aqv" || itemToCompare.CODE == "cqv") { itemToCompare.QUANTITY = 500; character.CHARSTAT70 = 500; }
				itemToCompare.DEF = Math.ceil((~~itemToCompare.base_defense * (1+~~item.ethereal*0.5) * (1+~~item.e_def/100+~~item.sup/100)) + ~~item.defense + Math.floor(~~item.defense_per_level*character.CLVL))
				itemToCompare.REQ_STR = Math.ceil(~~itemToCompare.req_strength * (1+(~~itemToCompare.req/100)) - ~~itemToCompare.ethereal*10)
				itemToCompare.REQ_DEX = Math.ceil(~~itemToCompare.req_dexterity * (1+(~~itemToCompare.req/100)) - ~~itemToCompare.ethereal*10)
				itemToCompare.BLOCK = ~~itemToCompare.block + ~~itemToCompare.ibc
				itemToCompare.ITEMSTAT17 = ~~itemToCompare.e_damage + ~~itemToCompare.damage_bonus
				// TODO: Add more codes that aren't handled properly by codes[code]
			} else {
				itemToCompare.SUP = false
				itemToCompare.ETH = false
				for (affix in itemToCompare) {
					for (code in codes) { if (affix == code) { itemToCompare[codes[code]] = 0 } }
					if (typeof(unequipped[affix]) != 'undefined') { if (affix != "base_damage_min" && affix != "base_damage_max" && affix != "base_defense" && affix != "req_level" && affix != "req_strength" && affix != "req_dexterity" && affix != "durability" && affix != "baseSpeed" && affix != "range" && affix != "throw_min"  && affix != "throw_max" && affix != "base_min_alternate" && affix != "base_max_alternate" && affix != "block" && affix != "velocity") { itemToCompare[affix] = unequipped[affix] } }	// doesn't include all 'base' affixes... fix?
				}
				//character.CHARSTAT70 = 0;
				itemToCompare.DEF = ~~itemToCompare.base_defense
				itemToCompare.REQ_STR = ~~itemToCompare.req_strength
				itemToCompare.REQ_DEX = ~~itemToCompare.req_dexterity
				itemToCompare.BLOCK = ~~itemToCompare.block
				itemToCompare.ITEMSTAT17 = 0
			}
			itemToCompare.ITEMSTAT31 = itemToCompare.DEF
			itemToCompare.ITEMSTAT18 = itemToCompare.ITEMSTAT17
			// TODO: Validate ILVL
		} } }
		if (typeof(itemToCompare.RW) == 'undefined') { itemToCompare.RW = false }
		if (typeof(itemToCompare.NMAG) == 'undefined') { itemToCompare.NMAG = false }
		if (typeof(itemToCompare.ETH) == 'undefined') { itemToCompare.ETH = false }
		if (typeof(itemToCompare.SOCK) == 'undefined') { itemToCompare.SOCK = 0 }
		simulate()
	}
}

// simulate - begins the filter simulation process
// ---------------------------------
function simulate() {
	//document.getElementById("print").innerHTML = ""
	if (settings.pd2_option == 0 || document.getElementById("dropdown_group").selectedIndex > 8) { document.getElementById("select_price").style.display = "none" }
	document.getElementById("o3").innerHTML = ""
	document.getElementById("o4").innerHTML = ""
	for (let num = 1; num <= 2; num++) {
		document.getElementById("o"+num).innerHTML = ""
		document.getElementById("output_"+num).innerHTML = ""
		document.getElementById("item_desc"+num).innerHTML = ""
		var result = ["",""];
		if (document.getElementById("filter_text_"+num).value != "") {
			if (num == 1 || document.getElementById("o3").innerHTML == "") {
				result = parseFile(document.getElementById("filter_text_"+num).value,num)
			} else {
				document.getElementById("o"+num).innerHTML = ""
			}
		}
		document.getElementById("output_"+num).innerHTML = result[0]
		document.getElementById("item_desc"+num).innerHTML = result[1]
		var wid = Math.floor(document.getElementById("output_area_"+num).getBoundingClientRect().width/2 - document.getElementById("output_"+num).getBoundingClientRect().width/2);
		var hei = Math.floor(document.getElementById("output_area_"+num).getBoundingClientRect().height/2 - document.getElementById("output_"+num).getBoundingClientRect().height/2);
		document.getElementById("output_"+num).style.left = wid+"px"
		document.getElementById("output_"+num).style.top = hei+"px"
	}
}

// loadFileAsText - loads text from a file
// ---------------------------------
function loadFileAsText(num) {
	var fileToLoad = document.getElementById("fileToLoad_"+num).files[0];
	var textFromFileLoaded = "";
	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) {
		textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("filter_text_"+num).value = fileLoadedEvent.target.result;
		simulate()
	};
	fileReader.readAsText(fileToLoad, "UTF-8");
}

// parseFile - parses the filter file line by line
//	file: text of the filter
//	num: filter number (1 or 2)
// ---------------------------------
function parseFile(file,num) {
	var obscured = true;
	var color = "";
	var color_new_default = "";
	var display = "";
	var description = "";
	var all_conditions = [];
	var all_line_nums = [];
	var messageAboutDuplicates = false;
	var messageAboutPD2 = false;
	var name_saved = itemToCompare.NAME;
	var secondary_line = "";
	if (!(itemToCompare.NMAG == true && itemToCompare.RW != true) && itemToCompare.MAG != true) {	// setup variables to accomodate item names that use multiple lines
		if (typeof(itemToCompare.base) != 'undefined') {
			if (itemToCompare.ID == true) {
				name_saved = itemToCompare.NAME;
				secondary_line = "<br>"+itemToCompare.base
			} else {
				name_saved = itemToCompare.base;
				secondary_line = ""
			}
		}
	}
	if (itemToCompare.ID == false) {
		if (typeof(itemToCompare.base) == 'undefined') { name_saved = itemToCompare.NAME }	// TODO: remove after fixing premade items?
		else { name_saved = itemToCompare.base }
	}
	var done = false;
	var rules_checked = 0;
	var lines = file.split("\t").join("").split("­").join("•").split("\n");
	var lines_with_tabs = file.split("­").join("•").split("\n");
	var line_num = 0;
	for (line in lines) { if (done == false) {
		line_num = Number(line)+1;
		document.getElementById("o3").innerHTML += "ERROR: Cannot Evaluate<br>"+"#"+num+" Invalid formatting on line "+line_num+" (rule "+(rules_checked+1)+") ... "+"<l style='color:#aaa'>"+file.split("­").join("•").split("\n")[line]+"</l><br><br>"	// gets displayed if the function halts unexpectedly at any point
		var rule = lines[line].split("/")[0];
		var rule_with_tabs = lines_with_tabs[line].split("/")[0];
		var index = rule.indexOf("ItemDisplay[");
		var index_with_tabs = rule_with_tabs.indexOf("ItemDisplay[");
		var index_end = rule.indexOf("]:");
		if (settings.validation == 1) {
			if (!(index >= 0 && rule_with_tabs.substr(0,index_with_tabs).length == 0) && rule_with_tabs.length > 0) { document.getElementById("o"+num).innerHTML += "#"+num+" Improper formatting on line "+line_num+" ... "+"<l style='color:#aaa'>"+file.split("­").join("•").split("\n")[line]+"</l><br>" }	// display an error if the line is not a rule and has other characters prior to any "/" characters
		}
		if (index >= 0 && rule_with_tabs.substr(0,index_with_tabs).length == 0) {
			rules_checked += 1
			var match = false;
			var formula = "";
			var rulesub = rule.substr(0,index)+rule.substr(index+12);
			var conditions = rulesub.split("]:")[0];
			var output = lines_with_tabs[line].substr(0,index)+lines_with_tabs[line].substr(index+12);
			output = output.split("]:")[1]
			if (conditions[0] == " " || conditions[conditions.length-1] == " ") {
				if (settings.validation == 1) { document.getElementById("o"+num).innerHTML += "#"+num+" Irregular formatting on line "+line_num+" ... "+"<l style='color:#aaa'>"+file.split("­").join("•").split("\n")[line]+"</l><br>" }	// display an error if the rule's conditions have space on either side
				conditions = conditions.trim()
			}
			if (settings.validation == 1) {
				var duplicateConditions = all_conditions.includes(conditions);
				all_conditions[all_conditions.length] = conditions
				all_line_nums[all_line_nums.length] = line_num
				if (duplicateConditions == true) { document.getElementById("o"+num).innerHTML += "#"+num+" Inadvisable formatting (lines "+all_line_nums[all_conditions.indexOf(conditions)]+" and "+line_num+" have identical conditions) ... "+"<l style='color:#aaa'>"+file.split("­").join("•").split("\n")[line]+"</l><br>"; messageAboutDuplicates = true; }	// display an error if the rule's conditions exactly match a previous line
			}
			if (index_end > index+12 && rule.substr(0,index).length == 0) {
				var match_override = false;
				var cond_format = conditions.split("  ").join(" ").split("(").join(",(,").split(")").join(",),").split("!").join(",!,").split("<=").join(",≤,").split(">=").join(",≥,").split(">").join(",>,").split("<").join(",<,").split("=").join(",=,").split(" AND ").join(" ").split(" OR ").join(",|,").split("+").join(",+,").split(" ").join(",&,").split(",,").join(",");
				var cond_list = cond_format.split(",");
				var neg_paren_close = 0;
				for (cond in cond_list) {
					cond = Number(cond)
					var c = cond_list[cond];
					if (c == "GEM") { c = "GEMLEVEL" }
					if (c == "RUNENUM") { c = "RUNE" }
					if (settings.pd2_option == 1) { if (c == "DIFF") { c = "DIFFICULTY" } }
					var number = false;
					if (isNaN(Number(c)) == false) { cond_list[cond] = Number(c); number = true; }
					if (number == false && c != "(" && c != ")" && c != "≤" && c != "≥" && c != "<" && c != ">" && c != "=" && c != "|" && c != "&" && c != "+" && c != "!") {
						if (settings.validation == 1) {
							var recognized = false;
							var cr = c;
							if (isNaN(Number(cr[0])) == false) { cr = "_"+cr }
							if (typeof(all_codes[cr]) != 'undefined') {
								if (all_codes[cr] == 3 || (settings.pd2_option == 0 && all_codes[cr] == 1) || (settings.pd2_option == 1 && all_codes[cr] == 2)) { recognized = true }
								if (settings.pd2_option == 0 && all_codes[cr] == 2) { messageAboutPD2 = true }
							}
							if (settings.pd2_option == 0) {
								if (cr.substr(0,8) == "CHARSTAT" || cr.substr(0,8) == "ITEMSTAT") { if (Number(cr.slice(8)) >= 0 && Number(cr.slice(8)) <= 500) { recognized = true } }
							}
							if (recognized == false) {
								document.getElementById("o"+num).innerHTML += "#"+num+" Unrecognized condition on line "+line_num+": <l style='color:#c55'>"+c+"</l> ... "+"<l style='color:#aaa'>"+file.split("\t").join(" ").split("­").join("•").split("\n")[line]+"</l><br>"
							}
							if (settings.pd2_option == 0) { if (c == "PRICE") { c = "invalid_"+c } }
						}
						if (((c == "GEMLEVEL" || c == "GEMTYPE") && itemToCompare.type != "gem") || (c == "RUNE" && itemToCompare.type != "rune")) { match_override = true }	// TODO/TOCHECK: Can these conditions (RUNE, GEMLEVEL, GEMTYPE) be used in a way that the rule will match with other items? For example: ItemDisplay[!RUNE>0]: %NAME%		...TODO: also include others (DIFF)
						if (c == "CLVL" || c == "DIFFICULTY" || c.substr(0,8) == "CHARSTAT") { if (typeof(character[c]) == 'undefined') { character[c] = 0 } }
						else if (typeof(itemToCompare[c]) == 'undefined' && c != "GOLD") {
							itemToCompare[c] = false
						}
						if (c == "CLVL" || c == "DIFFICULTY" || c.substr(0,8) == "CHARSTAT") { formula += character[c]+" " }
						else { formula += itemToCompare[c]+" " }
					} else {
						if (c == "&") { formula += "&& " }
						else if (c == "|") { formula += "|| " }
						else if (c == "=") { formula += "== " }
						else if (c == "≤") { formula += "<= " }
						else if (c == "≥") { formula += ">= " }
						else if (c == "!") { formula += "!" }
						else { formula += c+" " }
					}
					if (neg_paren_close > 0 && neg_paren_close == cond) { formula += ") "; neg_paren_close = 0; }
					if (c == "!" && cond_list.length > cond+3) { if ((isNaN(Number(cond_list[cond+1])) == false || isNaN(Number(cond_list[cond+3])) == false) && (cond_list[cond+2] == "=" || cond_list[cond+2] == ">" || cond_list[cond+2] == "<" || cond_list[cond+2] == "≤" || cond_list[cond+2] == "≥")) { formula += "( "; neg_paren_close = cond+3; } }
				}
				match = eval(formula)
				if (match_override == true && match == true) {
					document.getElementById("o"+num).innerHTML += "#"+num+" Inadvisable formatting on line "+line_num+" (unbounded condition) ... "+"<l style='color:#aaa'>"+file.split("­").join("•").split("\n")[line]+"</l><br>"	// display an error if the rule has unbounded conditions at zero
					match = false
				}
			} else {
				match = true
			}
			document.getElementById("o3").innerHTML += match
			if (match == true) {
				var color_current_rule = false;
				var name_current_rule = false;
				var name_added = false;
				var revert_color = false;
				var new_line = false;
				var description_active = false;
				var description_braces = 0;
				if (settings.pd2_option == 1) { if (output.includes("{") == true && output.includes("}") == true) { if (output.indexOf("{") < output.lastIndexOf("}")) { description_active = true } } }
				display = "";
				done = true;
				var out_format = output.split(",").join("‾").split(" ").join(", ,").split("%WHITE%").join(",color_White,").split("%GRAY%").join(",color_Gray,").split("%BLUE%").join(",color_Blue,").split("%YELLOW%").join(",color_Yellow,").split("%GOLD%").join(",color_Gold,").split("%GREEN%").join(",color_Green,").split("%DGREEN%").join(",color_DarkGreen,").split("%BLACK%").join(",color_Black,").split("%TAN%").join(",color_Tan,").split("%PURPLE%").join(",color_Purple,").split("%ORANGE%").join(",color_Orange,").split("%RED%").join(",color_Red,").split("%NAME%").join(",ref_NAME,").split("%CLVL%").join(",ref_CLVL,").split("%ILVL%").join(",ref_ILVL,").split("%SOCKETS%").join(",ref_SOCK,").split("%PRICE%").join(",ref_PRICE,").split("%RUNENUM%").join(",ref_RUNE,").split("%RUNENAME%").join(",ref_RUNENAME,").split("%GEMLEVEL%").join(",ref_GLEVEL,").split("%GEMTYPE%").join(",ref_GTYPE,").split("%CODE%").join(",ref_CODE,").split("%CONTINUE%").join(",misc_CONTINUE,").split("\t").join(",\t,").split("/").join(",/,").split("{").join(",{,").split("}").join(",},")
				if (settings.pd2_option == 1) {
					// TODO: disable %DGREEN%?
					out_format = out_format.split("%DARK_GREEN%").join(",color_DarkGreen,").split("%QTY%").join(",ref_QUANTITY,").split("%RANGE%").join(",ref_range,").split("%WPNSPD%").join(",ref_baseSpeed,").split("%ALVL%").join(",ref_ALVL,").split("%NL%").join(",misc_NL,").split("%MAP%").join(",ignore_MAP,")
					var notifs = ["%PX-","%DOT-","%MAP-","%BORDER-"];
					for (n in notifs) {									// TODO: implement more efficient way to split notification keywords
						if (out_format.includes(notifs[n])) {
							for (let a = 0; a < 16; a++) {
								for (let b = 0; b < 16; b++) {
									var av = a.toString(16);
									var bv = b.toString(16);
									if (out_format.includes(notifs[n]+av+bv+"%") || out_format.includes(notifs[n]+av.toUpperCase()+bv.toUpperCase()+"%")) {
										out_format = out_format.split(notifs[n]+av+bv+"%").join(",ignore_notif").split(notifs[n]+av.toUpperCase()+bv.toUpperCase()+"%").join(",ignore_notif,")
									}
								}
							}
						}
					}
				}
				out_format = out_format.split(",,").join(",")
				var out_list = out_format.split(",");
				if (out_list[0] == "") { out_list.shift() }
				if (out_list[out_list.length-1] == "") { out_list.pop() }
				if (settings.pd2_option == 1) {
					for (out in out_list) {
						var o = out_list[out];
						if (description_active == true && ((o == "{" && description_braces == 0) || (o == "}" && description_braces == 1))) { description_braces = description_braces+1 }
						if (description_braces == 1) { if (o == "/") { out_list[out] = "‡" } }
					}
					description_braces = 0
				}
				for (let i = 0; i < out_list.length; i++) {
					if (out_list[i] == "/") {
						for (let j = out_list.length-1; j >= i; j--) {
							out_list.pop()
						}
						i = out_list.length
					}
				}
				var trailingTabs = false;
				for (let i = out_list.length-1; i > 0; i--) {
					if (out_list[i] == " " && trailingTabs == false) { out_list.pop() }
					else if (out_list[i] == "\t") { out_list.pop(); trailingTabs = true; }
					else { i = 0 }
				}
				var leadingTabs = false;
				for (let i = 0; i < out_list.length; i++) {
					if (out_list[i] == " " && leadingTabs == false) { out_list.shift(); i--; }
					else if (out_list[i] == "\t") { out_list.shift(); leadingTabs = true; i--; }
					else { i = out_list.length }
				}
				for (out in out_list) {
					var space = false;
					var prev_color = color;
					var o = out_list[out].split("‾").join(",");
					var temp = o;
					var key = o.split("_")[0];
					if (key == "misc") {
						temp = ""
						if (o == "misc_CONTINUE") { done = false }
						else if (o == "misc_NL") { new_line = true }
					} else if (key == "color") {
						temp = ""
						color = colors[o.split("_")[1]]
						prev_color = color
						color_current_rule = true
					} else if (key == "ref") {
						if (o == "ref_CLVL") { temp = character["CLVL"] }
						else if (o == "ref_NAME") { temp = name_saved; name_current_rule = true; if (color_new_default == "" && color_current_rule != false && color != "") { color_new_default = color; } }
						else { temp = itemToCompare[o.split("_")[1]]; }
						obscured = false
					} else if (key == "ignore" && settings.pd2_option == 1) {
						temp = ""
					} else if (o == " ") {
						color = colors["Black"]
						temp = "_"
						revert_color = true
						space = true
					} else if (o == "\t") {
						temp = ""
					} else if (o == "‡") {
						temp = "/"
					} else {
						obscured = false
						if (description_active == true) {
							if (o == "{" && description_braces == 0) { description_braces = description_braces+1; temp = ""; }
							if (o == "}" && description_braces == 1) { description_braces = description_braces+1; temp = ""; }
						}
					}
					var colorize = false;
					if (name_added == true && color != "") { colorize = true }
					if (name_added == false && (color_current_rule == true || o == " ")) { colorize = true }
					if (o == "ref_NAME" && itemToCompare.RW == true) { color = colors["Gold"]; revert_color = true; }
					if (description_braces != 1) {
						if (new_line == true) { display += "<br>"; new_line = false; }
						if (colorize == true || (o == "ref_NAME" && itemToCompare.RW == true)) {
							if (space == true) { display += "<l style='color:"+color+"; opacity:0%;'>"+temp+"</l>" }
							else { display += "<l style='color:"+color+"'>"+temp+"</l>" }
						}
						else { display += temp }
					} else {
						if (new_line == true) { description += "<br>"; new_line = false; }
						if (colorize == true || (o == "ref_NAME" && itemToCompare.RW == true)) {
							if (space == true) { description += "<l style='color:"+color+"; opacity:0%;'>"+temp+"</l>" }
							else { description += "<l style='color:"+color+"'>"+temp+"</l>" }
						}
						else { description += temp }
					}
					if (revert_color == true) { color = prev_color }
					if (name_current_rule == true) { name_added = true }
				}
				if (done == false) { name_saved = display }
				document.getElementById("o"+num).innerHTML += "#"+num+" Match found at line "+line_num+" after checking "+rules_checked+" rules ... "+"<l style='color:#aaa'>"+file.split("\t").join(" ").split("­").join("•").split("\n")[line]+"</l>"
				if (output == "") { document.getElementById("o"+num).innerHTML += " /hidden"; obscured = true; }
				document.getElementById("o"+num).innerHTML += "<br>"
			}
		} else {
			document.getElementById("o3").innerHTML += "not a rule"
		}
		document.getElementById("o3").innerHTML = ""
	} }
	if (done == false) {
		obscured = false
		display = name_saved
		if (itemToCompare.RW == true) { display = "<l style='color:"+colors.Gold+"'>"+display+"</l>" }
		document.getElementById("o"+num).innerHTML += "#"+num+" No match found after checking all "+line_num+" lines ("+rules_checked+" rules) ... (default display)<br>"
	}
	if (color_new_default != "") { document.getElementById("output_"+num).style.color = color_new_default }
	else { document.getElementById("output_"+num).style.color = getColor(itemToCompare) }
	if (display.includes("<br>") == true) {
		var display_multi = display.split("<br>");
		display = ""
		for (dline in display_multi) { display = display_multi[dline] + "<br>" + display }
	}
	if (description.includes("<br>") == true) {
		var description_multi = description.split("<br>");
		description = ""
		for (dline in description_multi) { description = description_multi[dline] + "<br>" + description }
	}
	if (obscured == false && itemToCompare.ID == true && !(itemToCompare.NMAG == true && itemToCompare.RW != true) && itemToCompare.MAG != true) {
		if (typeof(itemToCompare.base) != 'undefined') { display += secondary_line }
	}
	if (messageAboutDuplicates == true) { document.getElementById("o4").innerHTML += "When two rules have identical conditions, the first rule gets checked twice instead of both rules being checked." }
	if (messageAboutDuplicates == true && messageAboutPD2 == true) { document.getElementById("o4").innerHTML += "<br>" }	// TODO: Improve logic for when to display errors/messages and how to handle spacing for them
	if (messageAboutPD2 == true) { document.getElementById("o4").innerHTML += "A PD2 condition was detected, but PD2 codes are currently disabled. They can be enabled from the options menu." }
	return [display,description]
}

// getColor - gets the default color for a given item
//	item: the item being compared
//	return: the item's default color
// ---------------------------------
function getColor(item) {
	var color = "White";
	if (item.UNI == true) { color = "Gold" }
	else if (item.MAG == true) { color = "Blue" }
	else if (item.RARE == true) { color = "Yellow" }
	else if (item.UNI == true) { color = "Gold" }
	else if (item.SET == true) { color = "Green" }
	else if (item.NMAG == true && (item.ETH == true || item.SOCK > 0)) { color = "Gray" }
	else if (item.rarity == "craft") { color = "Orange" }
	else if ((item.ARMOR == true || item.WEAPON == true || item.CODE == "rin" || item.CODE == "amu") && item.NMAG != true  && item.MAG != true  && item.RARE != true  && item.UNI != true  && item.SET != true ) { color = "Orange" }
	else if (item.RUNE > 0) { color = "Orange" }
	else if (item.CODE == "cx5" || item.CODE == "cx6" || item.CODE == "cx7" || item.CODE == "maz" || item.CODE == "ma4" || item.CODE == "ma5" || item.CODE == "ma6" || item.CODE == "ma2" || item.CODE == "cx8" || item.CODE == "wss") { color = "Purple" }
	return colors[color]
}

// equipmentHover - shows equipment info (on mouse-over)
//	num: filter number (1 or 2)
// ---------------------------------
function equipmentHover(num) {
	document.getElementById("tooltip_inventory").style.left = "0px"
	var name = document.getElementById("output_"+num).innerHTML;
	var main_affixes = ""
	var affixes = "";
	for (affix in itemToCompare) {
		if (typeof(stats[affix]) != 'undefined') { if (itemToCompare[affix] != unequipped[affix] && stats[affix] != unequipped[affix] && stats[affix] != 1 && affix != "velocity" && affix != "smite_min") {
			var affix_info = getAffixLine(affix);
			if (affix_info[1] != 0) {
				if (affix == "base_damage_min" || affix == "base_defense" || affix == "req_level" || affix == "req_strength" || affix == "req_dexterity" || affix == "durability" || affix == "baseSpeed" || affix == "range" || affix == "throw_min" || affix == "base_min_alternate" || affix == "block" || affix == "velocity" || affix == "QUANTITY" || affix == "relic_experience" || affix == "relic_density" || affix == "map_tier") { main_affixes += affix_info[0]+"<br>" }
				else { affixes += affix_info[0]+"<br>" }
			}
		} }
	}
	if (itemToCompare.RW == true) {
		var rw_name = itemToCompare.name.split(" ­ ")[0].split(" ").join("_").split("'").join("");
		if (rw_name == "Infinity") { rw_name = "infinity" }
		var runes = "";
		for (let i = 0; i < runewords[rw_name].runes.length; i++) { runes += runewords[rw_name].runes[i]; }
		name += "<br>"+"<l style='color:"+colors.Gold+"'>'"+runes+"'</l>"
	}
	document.getElementById("item_name").innerHTML = name
	document.getElementById("item_name").style.color = document.getElementById("output_"+num).style.color
	document.getElementById("item_info").innerHTML = main_affixes
	document.getElementById("item_affixes").innerHTML = affixes
	document.getElementById("item_desc"+num).style.display = "block"
	if (main_affixes != "" || affixes != "") { document.getElementById("tooltip_inventory").style.display = "block" }
	
	var original_choices_height = 47; if (document.getElementById("original_choices").style.display == "none") { original_choices_height = 0 }
	var item = document.getElementById("output_"+num).getBoundingClientRect();
	var tooltip_width = document.getElementById("tooltip_inventory").getBoundingClientRect().width;
	var textbox_height = document.getElementById("filter_text_1").getBoundingClientRect().height + document.getElementById("filter_text_2").getBoundingClientRect().height
	var editing_height = document.getElementById("item_editing").getBoundingClientRect().height + document.getElementById("non_item_editing").getBoundingClientRect().height + original_choices_height
	var offset_x = Math.floor(item.left + item.width/2 - tooltip_width/2);
	var offset_y = Math.floor(63 + textbox_height + editing_height + 100*num + item.height/2);
	document.getElementById("tooltip_inventory").style.left = offset_x+"px"
	document.getElementById("tooltip_inventory").style.top = offset_y+"px"
	var extra_height = Math.max(0,(document.getElementById("tooltip_inventory").getBoundingClientRect().height - 50 - document.getElementById("output_processing_info").getBoundingClientRect().height))
	document.getElementById("extra_space").style.height = extra_height+"px"
}

// equipmentOut - stops showing equipment info (mouse-over ends)
// ---------------------------------
function equipmentOut() {
	document.getElementById("tooltip_inventory").style.left = "820px"
	document.getElementById("tooltip_inventory").style.display = "none"
	document.getElementById("item_desc1").style.display = "none"
	document.getElementById("item_desc2").style.display = "none"
}

// getAffixLine - determines how an affix should be displayed
//	affix: name of the affix
//	return: the formatted affix line and combined value of affixes used
// ---------------------------------
function getAffixLine(affix) {
	var source = itemToCompare;
	var affix_line = "";
	var value = source[affix];
	var value_combined = ~~value;
	var halt = false;
	var both = 0;
	var stat = stats[affix];
	if (affix != "ctc" && affix != "cskill" && affix != "set_bonuses") {
		if (stat.alt != null) {
			if (typeof(source[stat.index[0]]) != 'undefined' && typeof(source[stat.index[1]]) != 'undefined') { if (source[stat.index[0]] > 0 && source[stat.index[1]] > 0) { both = 1; if (stat.index[1] == affix) { halt = true } } }
			if (both == 0) { stat = null; stat = stats_alternate[affix]; }
		}
		for (let i = 0; i < stat.index.length; i++) {
			value = source[stat.index[i]]
			if (value == 'undefined') { value = 0 }
			if (isNaN(value) == false) { value_combined += value }
			var rounding = true;
			if (stat.mult != null) {
				if (stat.mult[i] != 1) {
					value *= character[stat.mult[i]]
					if (affix == "all_skills_per_level") { value = Math.ceil(value) }
				}
				else { rounding = false }
			}
			if (isNaN(value) == false && rounding == true) { value = Math.floor(Math.round(value)) }
			var affix_text = stat.format[i];
			if (value < 0 && affix_text[affix_text.length-1] == "+") { affix_text = affix_text.slice(0,affix_text.length-1) }
			affix_line += affix_text
			affix_line += value
		}
		var affix_text = stat.format[stat.index.length];
		//if (affix_text == " to Class Skills") { affix_text = " to "+character.class_name+" Skills" }
		affix_line += affix_text
		if (affix == "aura" && (source[affix] == "Lifted Spirit" || source[affix] == "Righteous Fire")) { affix_line = source[affix]+" Aura when Equipped" }
		if (halt == true) { value_combined = 0 }
	} else {
		affix_line == ""; value_combined = 1;
		if (affix == "ctc") {
			for (let i = 0; i < source[affix].length; i++) {
				var line = source[affix][i][0]+"% chance to cast level "+source[affix][i][1]+" "+source[affix][i][2]+" "+source[affix][i][3];
				affix_line += line
				if (i < source[affix].length-1) { affix_line += "<br>" }
			}
		} else if (affix == "cskill") {
			for (let i = 0; i < source[affix].length; i++) {
				var line = "Level "+source[affix][i][0]+" "+source[affix][i][1]+" ("+source[affix][i][2]+" charges)";
				affix_line += line
				if (i < source[affix].length-1) { affix_line += "<br>" }
			}
		}
	}
	var result = [affix_line,value_combined];
	return result
}

// debug
function printAffixes() {
	document.getElementById("print").innerHTML = ""
	var output = "---------------------------<br>";
	//for (affix in itemCustom) {
	//	output += affix+" "+itemCustom[affix]+"<br>"
	//}
	for (affix in itemToCompare) {
		output += affix+" "+itemToCompare[affix]+"<br>"
	}
	output += "---------------------------<br>"
	document.getElementById("print").innerHTML += output
	
}












// character codes used by filters:
/*
CHARSTAT15	gold in stash
CHARSTAT14	gold on character
CHARSTAT70	quantity (quiver = 500 arrows, javelins & throwing weapons > 0)
CHARSTAT45	poison resist
CHARSTAT43	cold resist
CHARSTAT13	experience (0 for mules ...tied to character level)
*/

// toggleNonItemDetails - 
// ---------------------------------
function toggleNonItemDetails(checked)  {
	if (checked == true) { document.getElementById("non_item_editing").style.display = "block" }
	else { document.getElementById("non_item_editing").style.display = "none" }
}
// setCLVL2 - 
// ---------------------------------
function setCLVL2(value) {
	if (isNaN(value) == true || value < 1 || value > 99) { value = document.getElementById("dropdown_clvl").selectedIndex }
	document.getElementById("clvl").value = value
	document.getElementById("dropdown_clvl").value = value
	character.CLVL = Number(value)
	if (settings.pd2_option == 1) { itemCustom.CRAFTALVL = Math.floor(character.CLVL/2) + Math.floor(ilvl/2) }
	if (character.CHARSTAT14 > (character.CLVL * 10000)) {
		character.CHARSTAT14 = character.CLVL * 10000
		document.getElementById("gold_char").value = character.CHARSTAT14
	}
	if (value == 1) { character.CHARSTAT13 = 0 }
	else { character.CHARSTAT13 = 1000 }
	simulate()
}
// setDifficulty - 
// ---------------------------------
function setDifficulty(selected) {
	if (selected < 3) {
		character.auto_difficulty = false
		character.DIFFICULTY = selected
	} else {
		character.auto_difficulty = true
		if (itemCustom.ILVL < 36) { character.DIFFICULTY = 0 }
		else if (itemCustom.ILVL > 66) { character.DIFFICULTY = 2 }
		else { character.DIFFICULTY = 1 }
	}
	simulate()
}
// setGoldStash - 
// ---------------------------------
function setGoldStash(value) {
	if (isNaN(value) == true || value < 0 || value > 2500000) { value = character.CHARSTAT15 }
	document.getElementById("gold_stash").value = Number(value)
	character.CHARSTAT15 = Number(value)
	simulate()
}
// setGoldChar - 
// ---------------------------------
function setGoldChar(value) {
	if (isNaN(value) == true || value < 0 || value > (character.CLVL * 10000)) {
		value = Number(character.CHARSTAT14);
		if (value > (character.CLVL * 10000)) { value = character.CLVL * 10000 };
	}
	document.getElementById("gold_char").value = Number(value)
	character.CHARSTAT14 = Number(value)
	simulate()
}


// toggleOriginalChoices - 
// ---------------------------------
function toggleOriginalChoices(checked) {
	if (checked == true) { document.getElementById("original_choices").style.display = "block" }
	else { document.getElementById("original_choices").style.display = "none" }
}

// togglePD2Option - 
// ---------------------------------
function togglePD2Option(checked) {
	if (checked == true) { settings.pd2_option = 1 }
	else { settings.pd2_option = 0 }
	setPD2Codes()
	simulate()
}

// togglePD2Option - 
// ---------------------------------
function toggleConditionValidation(checked) {
	if (checked == true) { settings.validation = 1 }
	else { settings.validation = 0 }
	simulate()
}
