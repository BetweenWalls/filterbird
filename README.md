# [FilterBird](https://betweenwalls.github.io/filterbird/)
Diablo II Filter Simulation (Path of Diablo & Project Diablo II)

This program allows users to select an item and see how a filter would display that item, simulating the in-game behavior.

### [Download](https://github.com/BetweenWalls/filterbird/archive/master.zip)

## Uses
* Compare aesthetics of multiple filters
* Determine whether a filter shows what you're looking for
* Diagnose filter problems
* Discover which rules are responsible for displaying/hiding different items

## Notes
By default, the simulation updates when any character/item changes are made. For large or complex filters, disable *Auto-Simulate* and/or *Error Checking* from the *Options* menu and use manual simulation instead by clicking the background image.

The background images can be changed by right-clicking them.

URL parameters (v=PD2, alternate=0, multiple=0, auto=0, checking=0) can be used to load the filter with certain menu options enabled/disabled. For example: https://betweenwalls.github.io/filterbird/?v=PD2&multiple=0&auto=0

## Known Issues
* Nothing special is done to display item notifications or minimap icons
* All PD2 items use the same attributes as those in the PoD version (with the exception of PD2-specific equipment and pointmod attribute names)
* PD2-specific equipment items and runeword options aren't hidden if the PoD version is selected (and vice versa)
* Unique and set items cannot have their attributes customized
* Crafted items don't have predetermined affixes
* Wirt's Leg and quest weapons cannot be customized
* Item condition issues:
  * "CHSK" codes for skill charges and "OS" codes for oskills are unimplemented
  * PRICE is not updated automatically
  * Unimplemented PoD-specific conditions: AREALVL (may be others due to poor documentation, please report them)
  * Unimplemented PD2-specific conditions: PREFIX, SUFFIX, MAPID
  * STAT360 (item corruption) is only partially implemented - it checks whether a corruption exists, but not which corruption
  * There may be some numbered "STAT" codes which aren't implemented - please report them
* Many PD2 changes after s6 have not been implemented, or have only been partially implemented
<!--
** MAPTIER, new maps
** SOCKETS (same as SOCK), GEM (same as GEMLEVEL)
** EDEF, EDAM (includes bonuses from socketed runes/gems/jewels unlike ED)
** "between" operator (~)
** additional codes can be summed prior to evaluation
** previously-glide-only colors now work
** new keywords: %SOCKETS%, %DEF%, %ED%, %EDEF%, %EDAM%, %AR%, %RES%, %STR%, %DEX%
** keywords for all numbered attributes
** keywords for all individual skills
** many new numbered attributes
** CHARSTAT codes
** MULTI stats
** AUTOMOD (similar to PREFIX/SUFFIX)
** probably others...
-->

## Feedback
If you would like to improve this program, or just share feedback about how it could be improved, you can message me on reddit ([BetweenWalls](https://www.reddit.com/message/compose/?to=BetweenWalls)) or discord (@BetweenWalls#2390). You can also just open an [issue](https://github.com/BetweenWalls/filterbird/issues) here.

Potential Improvements:
* Address **known issues** listed above
* Optimize simulation performance so that major features can be added:
  * Allow multiple items to be viewed simultaneously
  * Create option to generate variety of different items so filters can be compared effectively with just a few clicks
  * Allow any number of filters to be compared simultaneously
* Make item tooltip formatting better match in-game tooltip formatting
* Expand syntax/error checking to further help with diagnosing filter problems