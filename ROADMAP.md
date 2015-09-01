These issues are imported from the old issue tracker. I don't plan to realize all these things, but it shows the direction the framework was aimed to go.

To add feature requests, please use the bugtracker. If you want to discuss an entry in this list, add a new issue and copy the description from here.

v1.2.1
======

add legacy support 
------------------

Currently, there are some basic polyfills used. Replace them by 3rd party libs.

Provide a default set of polyfills in the demo.

(Polyfills should be seperated from core)

- make use of modernizr/yepnope for that (?)
- https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills

- Use Traceur ? -> chekc what it covers ...

offer polyfills:
- Map, Set, WeakMap, WeakSet (ES6)
- Element.matches / CSS Selectors
- media Querys: https://github.com/weblinc/media-match
- Array.indexOf

pseudo polyfill: (polyfills would be too expensive, so we need to add a "dummy" method)
- MutationObserver

Define compatibility goal:
- IE9, current Firefox/Chrome/Safari and their mobile versions

media querys
------------

- min-height, max-height
- touch detection (modernizr)
- and/or in bp

Custom Rules improvements 
-------------------------

- own media queries (touch detection)

v1.2.2
======

option to "pre-parse" CSS files 
-------------------------------

provide grunt action and script to parse CSS files and store the tree in a JSON file.

replace jQuery whereever possible 
---------------------------------

ProperyListener performance 
---------------------------

debounce checks


v1.3 series
===========

effects/animation framework
---------------------------

- CSS transitions ?
- animations and scrolling?
- parralax scrolling?
- integrate with offcanvas + menu + trigger

parralax scrolling
------------------

animations / image positioning / sticky

Image/Content Scaling/Positioning/Alignment 
-------------------------------------------

(can be handled in parts by the container module)
- contain-width (width:100%;height:auto;), cover, contain, ...
- everything what can be done with CSS backgrounds should be possible with the img element and a wrapper element
- add a new module provding shorthands

document a few examples 

cascading custom rules
----------------------

- priorities, define order of the rule handlers to be executed
- distinct between two different types of rules: rules that replace another rule with the same type and rules that replace rules with the same key (the key is determined by it's parameters)

delegated properties
--------------------

for example triggers, expression listeners etc may be recreated and destroyed frequently -> overhead

- should the plugin API provide a way to handle delegated properties? (possible?)
- is it possible to do it transparent / in the background ?
- or should each plugin provide its own api (messy)
- or if not possible: do nothing?

Predefined Rules and Media Querys
---------------------------------

Decide if we should introduce predefined rules with media querys, eg

If we have the predefined rule

    .rule

Then generate these classes:

    .rule-s
    .rule-m
    .rule-l
    
    
improvements to sticky 
----------------------

- stick when element reaches the bottom viewport edge (from "inside")
- what if element is greater than parent/viewport
- stick left/right
- multiple stickys at the same time: how to avoid overlapping?
- performance

restructure mixins
------------------

It gets messy when using more than one component.

The plan is:
- split one big mixin into "smaller" ones (see list-module)
- *set variables in mixins and process these vars at the end of each rule (how to do that?)*

example (menu module):
today:
```css
@mixin menu("horizontal",(outrgttr:(2),innrgttr:(2),...));
```

should be:
```css
@mixin menu-type("horizontal");
@mixin menu-gutter(inner,2);
@mixin menu-gutter(outer,2);
...
```

or:
```
@mixin menu() {
    @mixin menu-type("horizontal");
    @mixin menu-gutter(inner,2);
    @mixin menu-gutter(outer,2);
    ....
}
```


Backlog
=======

Focus API
---------

Currently, only one element can be focussed, it looses focus whenever a child element is clicked. 

We need an API to determine which elements are focussed and to track if a child element has the focus. This would allow nice menu systems, off-canvas elements and so on.

Things to discuss:
- Does this really make things easier?
- Can this already be done via the trigger API?

JavaScript APIs to interact with other frameworks
-------------------------------------------------

provide APIs to interact with other frameworks

- add function to set Variables API from other frameworks; or to define Variable actions that can be triggered from JavaScript frameworks

scroll offset api
-----------------

handle scroll offset via javascript
- introduce Scroll-offset API
- save wanted scroll offset per element (in every direction)
- use scrol offsets in sticky, scrollposition, JS jump link correction
- remove scroll-offset SASS mixin (CSS hack)

alternative:
- introduce scroll area API
- save scrollarea offsets and apply offsets in sticky, scrollposition, ... (and listen to offset changes)

current situation:
- sticky, scrollposition have their own offset parameters
- CSS hack for jumplink correction (scroll-offset)


Resizable
---------

Resizable
- make the object resizable in each direction
- use min/max width/height css properties; also listen to window resize events

List/Menu flexibility
---------------------

- block grid / menu: more options
- flexbox?

consider use cases
------------------

- use css grids, flexbox, etc
- carousel
- lightbox/dialog/popover
- forms
- tables
- tooltips
- overlays
- dropdowns
