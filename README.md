# [FilterBird](https://betweenwalls.github.io/filterbird/)
Diablo II Filter Simulation (Path of Diablo & Project Diablo II)

### [Download](https://github.com/BetweenWalls/filterbird/archive/master.zip)

### Uses:
* Compare aesthetics of multiple filters
* Determine whether a filter shows what you're looking for
* Diagnose filter problems
* Discover which rules are responsible for displaying/hiding different items

### Notes:
By default, the simulation updates when any character/item changes are made. For large or complex filters, disable *Auto-Simulate* and/or *Error Checking* from the *Options* menu and use manual simulation instead. (click the background images)

URL parameters (v=PD2, alternate=0, multiple=0, auto=0, checking=0) can be used to load the filter with certain menu options enabled/disabled. For example: https://betweenwalls.github.io/filterbird/?v=PD2&multiple=0&auto=0

The background images can be changed by right-clicking them.

This was originally made for Path of Diablo, and some features may still reflect that for the PD2 version.
* Unique/Set/Runeword item stats and item corruptions are from PoD
* Skill charges were never fully implemented, so no items can be selected that would match on "CHSK" codes
* Some affix codes such as "FOOLS" are unimplemented
* Notifications & minimap icons are unimplemented

### Future Goals:
* Allow multiple items to be viewed simultaneously
* Create option to generate variety of different items so filters can be compared effectively with just a few clicks
* Allow any number of filters to be compared simultaneously
* Make item tooltips better match in-game tooltips

### Feedback:
Feel free to message me ([BetweenWalls](https://www.reddit.com/message/compose/?to=BetweenWalls) on reddit, @BetweenWalls#2390 on discord)

FilterBird is open-source, so improvements can be contributed by anyone through github. Here are the basic steps:
* Create a duplicate version of this repository (fork)
* Edit the files
* Submit a pull request (i.e. request your changes be pulled into this version)