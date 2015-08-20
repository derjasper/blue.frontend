API
===

Please note that some modules are not for use from outside of the framework. Also,
JavaScript functions are designed for use through blue.frontend mixins, not for direct
usage. However, some JavaScript modules can be used independently from the framework
(but this is not supported).

The framework is divided into three parts: SASS modules providing mixins, the JavaScript
core and the JavaScript Plugin API with plugins.

SASS modules
------------

This is the most important part to frontend developers who don't care about the
underlaying models and plugins. SASS modules provide mixins, sometimes they depend
on each other.

Some of them are using JavaScript Plugins (through :doc:`api/sassmodules/customrules`),
but this is transparent to the developer. The documentation informs the developer
whenever a mixin is using JavaScript. One thing important to know is that JavaScript
Plugins do not cascade, so mixins have to explicitly be disabled via media querys.
(This is an issue that is targeted to the blue.frontend 3 series.)

The SASS module documentation pages refer always to a SASS file (e.g. sticky refers to
sticky.scss).


.. toctree::
   :maxdepth: 2
   :glob:

   api/sassmodules/*


JavaScript plugins
------------------

JavaScript plugins implement features that cannot be handled by CSS. All of them
depend on the JavaScript Plugin API described below (and they use jQuery). JavaScript
Plugins do not depend on each other, they communicate through the Plugin API.

The JavaScript plugin documentation pages refer to their JS file (e.g. variables
refers to variables.js).


.. toctree::
   :maxdepth: 2
   :glob:

   api/jsplugins/*


JavaScript Plugin API (the blue object)
---------------------------------------

The JavaScript Plugin API provides a set of APIs and services that allows Plugins
to communicate with each other, be fully responsive and to have a consistent state.

Note that the Plugin API is fully independent from the core, so it's possible to 
implement a bridge between jQuery and the Plugin API. (For a while all Plugins
were implemented as jQuery Plugins but some changes in the core needed an API providing
more control over the plugins.)

The JavaScript Plugin API is contained in the ``pluginapi`` folder.

The Plugin API creates the global ``blue`` object.


.. toctree::
   :maxdepth: 2
   :glob:

   api/jspluginapi/*


JavaScript CSS Parser
---------------------

The CSS Parser library provides a function to parse a stylesheet string to a
JSON tree containing custom rules.


.. toctree::
   :maxdepth: 2
   :glob:

   api/jscssparser/*


JavaScript core
---------------

The core provides an interface to add rules and listens
to media querys and DOM changes and manages the en- and disabling of the rules.
Rules are using the Plugin API for it's features.

The JavaScript core is contained in the ``core.js`` file.


.. toctree::
   :maxdepth: 2
   :glob:

   api/jscore/*


JavaScript loader file
----------------------

The JavaScript loader file uses the CSS parser to parse all present CSS files
and adds them to the core. It puts the whole thing together to a working script
that can be added to end products.


.. toctree::
   :maxdepth: 2
   :glob:

   api/jsloader/*