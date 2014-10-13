Menu
====

The menu mixin provides a set of menu types defining layout and behaviour. They are
mainly using :doc:`list`, :doc:`trigger` and :doc:`container`.

Please note that this module will be extended in future.


SASS
----

.. describe:: @mixin menu($type,$opt:())

   Creates a menu. Should be applied to an ``ul`` element.

   .. describe:: $type

      The menu type. The demo browser has examples for each type. The following types
      are available:

      .. describe:: horizontal

         The root level is horizontal, the following levels are vertical. Beginning
         with the 2nd level, the ``ul`` blocks are aside of their parents, it will
         look like a menu in desktop operating systems.

      .. describe:: vertical

         All levels are vertical.

   .. describe:: $opt

      A map of options. Following keys are available:

      .. describe:: submenuwdth

         Horizontal menu only. With of the submenu containers.

      .. describe:: strctspac

         Structure padding. See :doc:`list` for more details.

      .. describe:: innrgttr

         Inner gutter. See :doc:`list` for more details.

      .. describe:: outrgttr

         Outer gutter. See :doc:`list` for more details.

      .. describe:: submenutrggr

         Trigger type for opening submenus. The following trigger types are available:

         .. describe:: hover

            Submenu will be opened on hover.

         .. describe:: click
         
            Submenu will be opened and closed on click on the parent element.

         .. describe:: click-superfish

            Same as click, but menu can be closed by clicking somewhere on the screen.

            To get this to work, you have to add these lines to your stylesheet:

            .. code-block:: sass

               html {
                    @include trigger("[path to your menu] li","menu-show",click,off,-1);
               }