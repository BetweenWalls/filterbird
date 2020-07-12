var itemToCompare = {NAME:"9999 Gold",CODE:"GOLD",GOLD:9999};												// Gold
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

var character = {CLVL:80,CHARSTAT14:100000,CHARSTAT15:100000,DIFFICULTY:2};

var colors = {
	White:"#c7c3c0",
	Gray:"#524e4b",
	Blue:"#52519d",
	Yellow:"#cccc77",
	Gold:"#9b885e",
	Green:"#31eb1b",
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

// setItem - 
//	value: 
// ---------------------------------
function setItem(value) {
	if (value != "­ ­ ­ ­ Select Item") { for (group in equipment) { if (group != "charms") { for (itemNew in equipment[group]) { if (value == equipment[group][itemNew].name) {
		itemToCompare = equipment[group][itemNew]
		itemToCompare.NAME = itemToCompare.name.split(" (")[0].split(" ­ ")[0]
		itemToCompare.ILVL = 85
		itemToCompare.PRICE = 35000
		itemToCompare.ID = true
		if (typeof(itemToCompare.base) != 'undefined') {
			var base = bases[itemToCompare.base.split(" ").join("_").split("-").join("_").split("s'").join("s").split("'s").join("s")];
			for (affix in base) { itemToCompare[affix] = base[affix] }
			if (itemToCompare.tier == 1) { itemToCompare.NORM = true }
			else if (itemToCompare.tier == 2) { itemToCompare.EXC = true }
			else if (itemToCompare.tier == 3) { itemToCompare.ELT = true }
		} else {
			if (group == "amulet" && typeof(itemToCompare.CODE) == 'undefined') { itemToCompare.CODE = "amu" }
			else if (group == "ring") { itemToCompare.CODE = "rin" }
			else if (group == "charms") {
				if (itemToCompare.size == "small") { itemToCompare.CODE = "cm1" }
				else if (itemToCompare.size == "large") { itemToCompare.CODE = "cm2" }
				else if (itemToCompare.size == "grand") { itemToCompare.CODE = "cm3" }
			}
			else if (group == "socketables") {
				if (itemToCompare.type == "jewel") { itemToCompare.CODE = "jew" }
				else if (itemToCompare.type == "rune") { itemToCompare.RUNENAME = itemToCompare.name.split(" ")[0] }
				else if (itemToCompare.type == "gem") {
					var g_level = [0,"Chipped","Flawed","Standard","Flawless","Perfect"];
					var g_type = [0,"Amethyst","Diamond","Emerald","Ruby","Sapphire","Topaz","Skull"];
					itemToCompare.GLEVEL = g_level[itemToCompare.GEMLEVEL]
					itemToCompare.GTYPE = g_type[itemToCompare.GEMTYPE]
				}
			}
		}
		if (typeof(itemToCompare.rarity) != 'undefined') {
			if (itemToCompare.rarity == "set") { itemToCompare.SET = true }
			else if (itemToCompare.rarity == "rare") { itemToCompare.RARE = true }
			else if (itemToCompare.rarity == "magic") { itemToCompare.MAG = true }
			else if (itemToCompare.rarity == "common") { itemToCompare.NMAG = true }
			else if (itemToCompare.rarity == "rw") { itemToCompare.NMAG = true; itemToCompare.RW = true; itemToCompare.SOCK = 2 }	// TODO: edit sockets for RWs
			else if (itemToCompare.rarity == "unique") { itemToCompare.UNI = true }
		} else { itemToCompare.UNI = true }
		if (typeof(itemToCompare.ethereal) != 'undefined' && itemToCompare.ethereal == 1) { itemToCompare.ETH = true }
		if (typeof(itemToCompare.sockets) != 'undefined' && itemToCompare.sockets > 0) { itemToCompare.SOCK = itemToCompare.sockets }
		if (typeof(itemToCompare.sup) != 'undefined' && itemToCompare.sup > 0) { itemToCompare.SUP = true; itemToCompare.ED = itemToCompare.sup }
		// TODO: Update other stats...
		// DEF, RES, LIFE, MANA, IAS, FCR, FHR, FBR, skills, etc
		itemToCompare[itemToCompare.CODE] = true
	} } } } }
	if (typeof(itemToCompare.RW) == 'undefined') { itemToCompare.RW = false }
	if (typeof(itemToCompare.NMAG) == 'undefined') { itemToCompare.NMAG = false }
	if (typeof(itemToCompare.ETH) == 'undefined') { itemToCompare.ETH = false }
	if (typeof(itemToCompare.SOCK) == 'undefined') { itemToCompare.SOCK = 0 }
	simulate()
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
				for (cond in cond_list) {
					var c = cond_list[cond];
					var number = false;
					if (isNaN(Number(c)) == false) { cond_list[cond] = Number(c); number = true; }
					if (number == false && c != "(" && c != ")" && c != "≤" && c != "≥" && c != "<" && c != ">" && c != "=" && c != "|" && c != "&" && c != "+" && c != "!") {
						if (typeof(itemToCompare[c]) == 'undefined' && c != "GOLD") { itemToCompare[c] = false }
						if (c == "CLVL" || c == "DIFFICULTY" || c == "CHARSTAT14" || c == "CHARSTAT15") { formula += character[c]+" " }
						else { formula += itemToCompare[c]+" " }
					} else {
						if (c == "&") {
						/*	var valid_before = false;
							var valid_after = false;
							var c_before = cond_list[cond-1];
							var c_after = cond_list[cond+1];
							if (c_before != "(" && c_before != "<=" && c_before != ">=" && c_before != "<" && c_before != ">" && c_before != "=" && c_before != "|" && c_before != "&" && c_before != "+" && c_before != "!") { valid_before = true }
							if (c_after != ")" && c_before != "<=" && c_before != ">=" && c_after != "<" && c_after != ">" && c_after != "=" && c_after != "|" && c_after != "&" && c_after != "+" && isNaN(Number(c_after)) != false) { valid_after = true }
							//if (valid_before == true && valid_after == true) { formula += "&& " }
						*/	formula += "&& "
						}
						else if (c == "|") { formula += "|| " }
						else if (c == "=") { formula += "== " }
						else if (c == "≤") { formula += "<= " }
						else if (c == "≥") { formula += ">= " }
						else { formula += c+" " }
					}
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
		document.getElementById("o"+num).innerHTML += "#"+num+" No match found after checking "+rules_checked+" rules ... (default display)<br>"
	}
	if (color_new_default != "") { document.getElementById("output_"+num).style.color = color_new_default }
	else { document.getElementById("output_"+num).style.color = getColor(itemToCompare) }
	document.getElementById("o"+num).innerHTML += "<br>"
	if (obscured == false) {
		if (typeof(itemToCompare.base) != 'undefined') { display += "<br>"+itemToCompare.base }
		else if (itemToCompare.CODE == "amu") { display += "<br>Amulet" }
		else if (itemToCompare.CODE == "rin") { display += "<br>Ring" }
		else if (itemToCompare.CODE == "aq2") { display += "<br>Arrows" }
		else if (itemToCompare.CODE == "cq2") { display += "<br>Bolts" }
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