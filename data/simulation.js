var itemToCompare = {NAME:"5000 Gold",CODE:"GOLD",GOLD:5000,ID:true,always_id:true};									// Gold
//var itemToCompare = {NAME:"Grand Charm",ILVL:91,PRICE:35000,CODE:"cm3",cm3:true,MAG:true};								// Unidentified Grand Charm
//var itemToCompare = {NAME:"Zod Rune",PRICE:5000,CODE:"r33",r33:true,ID:true,RUNE:33,RUNENAME:"Zod"};							// Rune
//var itemToCompare = {NAME:"Flawless Skull",PRICE:10000,CODE:"skl",skl:true,ID:true,GEMLEVEL:4,GEMTYPE:7,GLEVEL:"Flawless",GTYPE:"Skull"};		// Gem
//var itemToCompare = {NAME:"Archon Plate",ILVL:80,PRICE:35000,CODE:"utp",utp:true,NMAG:true,ID:true,SOCK:3,DEF:524,ARMOR:true,EQ2:true,ELT:true};	// 3os Armor
//var itemToCompare = {NAME:"Mithril Coil",ILVL:80,PRICE:8000,CODE:"umc",umc:true,SET:true,ARMOR:true,EQ6:true,ELT:true}; 				// Credendum, Mithril Coil (unid set belt)
//var itemToCompare = {NAME:"Grand Charm",ILVL:91,PRICE:35000,CODE:"cm3",cm3:true,UNI:true};								// Gheed's Grand Charm (unidentified)
//var itemToCompare = {NAME:"Amulet",ILVL:86,PRICE:15000,CODE:"amu",amu:true,UNI:true};
//var itemToCompare = {NAME:"Dimensional Shard",ILVL:65,PRICE:35000,CODE:"obf",obf:true,NMAG:true,WEAPON:true,CL6:true,ELT:true,ID:true,SOCK:3,LIFE:60,SK65:3,SK64:3,SK62:3};
//var itemToCompare = {NAME:"Orb of Corruption",PRICE:1,CODE:"cx5",cx5:true,ID:true,ILVL:28};
//var itemToCompare = {NAME:"Key of Chaos",PRICE:1,CODE:"cx7",cx7:true,ID:true,ILVL:85};
//var itemToCompare = {NAME:"Tier 4 Relic",PRICE:1,CODE:"ma2",ma2:true,ILVL:86};
//var itemToCompare = {NAME:"Tier 4 Relic",PRICE:1,CODE:"ma2",ma2:true,ILVL:86,ID:true};
//var itemToCompare = {NAME:"Echoing Javelin",ILVL:70,PRICE:35000,CODE:"jav",jav:true,MAG:true,WEAPON:true,WP5:true,WP6:true,ID:true,TABSK34:3};
//var compared_items = {};
var character = {CLVL:90,CHARSTAT14:100000,CHARSTAT15:100000,DIFFICULTY:2,ILVL:90,CHARSTAT70:0};
var item_settings = {ID:false};
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

// startup - 
// ---------------------------------
function startup() {
	loadItems()
	loadOptions()
	var r = Math.floor(Math.random()*5+1);
	var background = "./images/act_"+r+".png";
	document.getElementById("background_1").src = background
	document.getElementById("background_2").src = background
}

// loadItems - 
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

// loadOptions - 
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

// setID - 
//	value: 
// ---------------------------------
function setID(value) {
	if (value == "Id") { item_settings.ID = true }
	else { item_settings.ID = false }
	itemToCompare.ID = item_settings.ID
	setItem(document.getElementById("dropdown_item").value )
}

// setCLVL - 
//	value: 
// ---------------------------------
function setCLVL(value) {
	character.CLVL = Number(value)
	simulate()
}

// setILVL - 
//	value: 
// ---------------------------------
function setILVL(value) {
	character.ILVL = Number(value)
	if (value < 36) { character.DIFFICULTY = 0 }
	else if (value > 66) { character.DIFFICULTY = 1 }
	else { character.DIFFICULTY = 2 }
	setItem(document.getElementById("dropdown_item").value )
}

// setItem - 
//	value: 
// ---------------------------------
function setItem(value) {
	if (value != "­ ­ ­ ­ Select Item") {
		for (group in equipment) { for (itemNew in equipment[group]) { if (value == equipment[group][itemNew].name) {
			var item = equipment[group][itemNew];
			itemToCompare = {}
			for (affix in item) { itemToCompare[affix] = item[affix] }
			itemToCompare.NAME = value.split(" (")[0].split(" ­ ")[0]
			itemToCompare.ILVL = character.ILVL
			itemToCompare.PRICE = 35000
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
				else if (itemToCompare.CODE == "ma4") { itemToCompare.base = "Tier 1 Relic" }
				else if (itemToCompare.CODE == "ma5") { itemToCompare.base = "Tier 2 Relic" }
				else if (itemToCompare.CODE == "ma6") { itemToCompare.base = "Tier 3 Relic" }
				else if (itemToCompare.CODE == "ma2") { itemToCompare.base = "Tier 4 Relic" }
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
				var s = 0;
				for (let i = 0; i < runewords[rw_name].length; i++) { s+=1; }
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
					if (typeof(unequipped[affix]) != 'undefined') { if (affix != "base_damage_min" && affix != "base_damage_max" && affix != "base_defense" && affix != "req_level" && affix != "req_strength" && affix != "req_dexterity" && affix != "durability" && affix != "baseSpeed" && affix != "range" && affix != "throw_min"  && affix != "throw_max" && affix != "base_min_alternate" && affix != "base_max_alternate" && affix != "block" && affix != "velocity") { itemToCompare[affix] = unequipped[affix] } }
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

// simulate - 
// ---------------------------------
function simulate() {
		for (let num = 1; num <= 2; num++) { if (document.getElementById("filter_text_"+num).value != "") {
			document.getElementById("output_"+num).innerHTML = ""
			result = parseFile(document.getElementById("filter_text_"+num).value,num)
			document.getElementById("output_"+num).innerHTML = result
			var wid = Math.floor(document.getElementById("output_area_"+num).getBoundingClientRect().width/2 - document.getElementById("output_"+num).getBoundingClientRect().width/2);
			var hei = Math.floor(document.getElementById("output_area_"+num).getBoundingClientRect().height/2 - document.getElementById("output_"+num).getBoundingClientRect().height/2);
			document.getElementById("output_"+num).style.left = wid+"px"
			document.getElementById("output_"+num).style.top = hei+"px"
		} }
}

// loadFileAsText - 
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

// parseFile - 
//	file: text from file
//	num: filter number (1 or 2)
// ---------------------------------
function parseFile(file,num) {
	document.getElementById("o"+num).innerHTML = ""
	var obscured = true;
	var color = "";
	var color_new_default = "";
	var display = "";
	var name_saved = itemToCompare.NAME;
	if (itemToCompare.ID == false) { name_saved = itemToCompare.base }
	var done = false;
	var rules_checked = 0;
	var lines = file.split("\t").join("").split("­").join("•").split("\n");
	for (line in lines) { if (done == false) {
		var line_num = Number(line)+1;
		document.getElementById("o3").innerHTML += "#"+num+" Processing line "+line_num+" (rule "+(rules_checked+1)+") ... "
		var rule = lines[line].split("/")[0];
		var index = rule.indexOf("ItemDisplay[");
		var index_end = rule.indexOf("]:");
		if (index >= 0) {
			rules_checked += 1
			var match = false;
			var formula = "";
			var rulesub = rule.substr(0,index)+rule.substr(index+12);
			var conditions = rulesub.split("]:")[0];
			var output = rulesub.split("]:")[1];
			if (index_end > index+12) {
				var cond_format = conditions.split("  ").join(" ").split("(").join(",(,").split(")").join(",),").split("!").join(",!,").split("<=").join(",≤,").split(">=").join(",≥,").split(">").join(",>,").split("<").join(",<,").split("=").join(",=,").split(" AND ").join(" ").split(" OR ").join(",|,").split("+").join(",+,").split(" ").join(",&,").split(",,").join(",");
				var cond_list = cond_format.split(",");
				var neg_paren_close = 0;
				for (cond in cond_list) {
					cond = Number(cond)
					var c = cond_list[cond];
					var number = false;
					if (isNaN(Number(c)) == false) { cond_list[cond] = Number(c); number = true; }
					if (number == false && c != "(" && c != ")" && c != "≤" && c != "≥" && c != "<" && c != ">" && c != "=" && c != "|" && c != "&" && c != "+" && c != "!") {
						if (c == "CLVL" || c == "DIFFICULTY" || c.substr(0,8) == "CHARSTAT") { if (typeof(character[c]) == 'undefined') { character[c] = 0 } }
						else if (typeof(itemToCompare[c]) == 'undefined' && c != "GOLD") { itemToCompare[c] = false }
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
			} else {
				match = true
			}
			document.getElementById("o3").innerHTML += match
			if (match == true) {
				var output_with_tabs = file.split("­").join("•").split("\n")[line].split("]:")[1];
				var color_current_rule = false;
				var name_current_rule = false;
				var name_added = false;
				var revert_color = false;
				display = "";
				done = true;
				var out_format = output.split(",").join("/").split(" ").join(", ,").split("%WHITE%").join(",color_White,").split("%GRAY%").join(",color_Gray,").split("%BLUE%").join(",color_Blue,").split("%YELLOW%").join(",color_Yellow,").split("%GOLD%").join(",color_Gold,").split("%GREEN%").join(",color_Green,").split("%DGREEN%").join(",color_DarkGreen,").split("%BLACK%").join(",color_Black,").split("%TAN%").join(",color_Tan,").split("%PURPLE%").join(",color_Purple,").split("%ORANGE%").join(",color_Orange,").split("%RED%").join(",color_Red,").split("%NAME%").join(",ref_NAME,").split("%CLVL%").join(",ref_CLVL,").split("%ILVL%").join(",ref_ILVL,").split("%SOCKETS%").join(",ref_SOCK,").split("%PRICE%").join(",ref_PRICE,").split("%RUNENUM%").join(",ref_RUNE,").split("%RUNENAME%").join(",ref_RUNENAME,").split("%GEMLEVEL%").join(",ref_GLEVEL,").split("%GEMTYPE%").join(",ref_GTYPE,").split("%CODE%").join(",ref_CODE,").split("%CONTINUE%").join(",misc_CONTINUE,")
				var out_list = out_format.split(",");
				for (out in out_list) {
					var prev_color = color;
					var o = out_list[out].split("/").join(",");
					var temp = o;
					var key = o.split("_")[0];
					if (key == "misc" && o == "misc_CONTINUE") {
						temp = ""
						done = false;
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
					} else if (o == " " && Number(out) <= 1 && output_with_tabs[0] == " ") {
						temp = ""
					} else if (o == " " && Number(out) > 0) {
						color = colors["Black"]
						temp = "_"
						revert_color = true
					} else {
						obscured = false
					}
					var colorize = false;
					if (name_added == true && color != "") { colorize = true }
					if (name_added == false && (color_current_rule == true || o == " ")) { colorize = true }
					if (o == "ref_NAME" && itemToCompare.RW == true) { color = colors["Gold"]; revert_color = true; }
					if (colorize == true || (o == "ref_NAME" && itemToCompare.RW == true)) { display += "<font color='"+color+"'>"+temp+"</font>" }
					else { display += temp }
					if (revert_color == true) { color = prev_color }
					if (name_current_rule == true) { name_added = true }
				}
				if (done == false) { name_saved = display }
				document.getElementById("o"+num).innerHTML += "#"+num+" Match found at line "+line_num+" after checking "+rules_checked+" rules ... "+"<font color='#aaa'>"+file.split("­").join("•").split("\n")[line]+"</font>"
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
		if (itemToCompare.RW == true) { display = "<font color='"+colors.Gold+"'>"+display+"</font>" }
		document.getElementById("o"+num).innerHTML += "#"+num+" No match found after checking "+rules_checked+" rules ... (default display)<br>"
	}
	if (color_new_default != "") { document.getElementById("output_"+num).style.color = color_new_default }
	else { document.getElementById("output_"+num).style.color = getColor(itemToCompare) }
	document.getElementById("o"+num).innerHTML += "<br>"
	if (obscured == false && itemToCompare.ID == true && !(itemToCompare.NMAG == true && itemToCompare.RW != true) && itemToCompare.MAG != true) {
		if (typeof(itemToCompare.base) != 'undefined' && itemToCompare.CODE != "ma4" && itemToCompare.CODE != "ma5" && itemToCompare.CODE != "ma6" && itemToCompare.CODE != "ma2") { display += "<br>"+itemToCompare.base }
	}
	return display
}

// getColor - 
//	item: 
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
	else if (item.CODE == "cx5" || item.CODE == "cx6" || item.CODE == "cx7" || item.CODE == "maz" || item.CODE == "ma4" || item.CODE == "ma5" || item.CODE == "ma6" || item.CODE == "ma2" || item.CODE == "cx8") { color = "Purple" }
	return colors[color]
}

// equipmentHover - shows equipment info on mouse-over
//	group: equipment group name
// ---------------------------------
function equipmentHover(num) {
	var name = document.getElementById("output_"+num).innerHTML;
	var main_affixes = ""
	var affixes = "";
	for (affix in itemToCompare) {
		if (typeof(stats[affix]) != 'undefined') { if (itemToCompare[affix] != unequipped[affix] && stats[affix] != unequipped[affix] && stats[affix] != 1 && affix != "velocity" && affix != "smite_min") {
			var affix_info = getAffixLine(affix);
			if (affix_info[1] != 0) {
				if (affix == "base_damage_min" || affix == "base_defense" || affix == "req_level" || affix == "req_strength" || affix == "req_dexterity" || affix == "durability" || affix == "baseSpeed" || affix == "range" || affix == "throw_min" || affix == "base_min_alternate" || affix == "block" || affix == "velocity" || affix == "QUANTITY") { main_affixes += affix_info[0]+"<br>" }
				else { affixes += affix_info[0]+"<br>" }
			}
		} }
	}
	if (itemToCompare.RW == true) {
		var rw_name = itemToCompare.name.split(" ­ ")[0].split(" ").join("_").split("'").join("");
		var runes = "";
		for (let i = 0; i < runewords[rw_name].length; i++) { runes += runewords[rw_name][i]; }
		name += "<br>"+"<font color='"+colors.Gold+"'>'"+runes+"'</font>"
	}
	document.getElementById("item_name").innerHTML = name
	document.getElementById("item_name").style.color = document.getElementById("output_"+num).style.color
	document.getElementById("item_info").innerHTML = main_affixes
	document.getElementById("item_affixes").innerHTML = affixes
	if (main_affixes != "" || affixes != "") { document.getElementById("tooltip_inventory").style.display = "block" }
	
	var tooltip_width = document.getElementById("tooltip_inventory").getBoundingClientRect().width/2;
	var item = document.getElementById("output_"+num).getBoundingClientRect();
	var textbox_height = document.getElementById("filter_text_1").getBoundingClientRect().height + document.getElementById("filter_text_2").getBoundingClientRect().height
	var offset_x = Math.floor(item.left + item.width/2 - tooltip_width);
	var offset_y = Math.floor(110 + textbox_height + 100*num + item.height/2);
	document.getElementById("tooltip_inventory").style.left = offset_x+"px"
	document.getElementById("tooltip_inventory").style.top = offset_y+"px"
}

// equipmentOut - stops showing equipment info (mouse-over ends)
// ---------------------------------
function equipmentOut() {
	document.getElementById("tooltip_inventory").style.left = 820+"px"
	document.getElementById("tooltip_inventory").style.display = "none"
}

// getAffixLine - determines how an affix should be displayed
//	affix: name of the affix
// return: the formatted affix line and combined value of affixes used
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
				if (stat.mult[i] != 1) { value *= character[stat.mult[i]] }	// 
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