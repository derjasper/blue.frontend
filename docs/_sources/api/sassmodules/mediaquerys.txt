Media Querys
============

Simple media query shorthands. The mixin ``bp`` is the one you will use most.
Screen sizes can be configured via the ``$screensizes`` variable in :doc:`blue`.


SASS
----

.. describe:: @mixin bp($screen:s,$mode:up,$screen2:"") { @content }

   The most important mixin. Define rules dependent on ``$screen``. ``$mode`` indicates
   whether bigger/smaller screen sizes should be included or not.

   .. describe:: $screen

      See the ``$screensizes`` variable in :doc:`blue`. By default ``s``, ``m``, ``l``, ``xl`` or ``xxl``.

   .. describe:: $mode

      ``up``, ``down``, ``to`` or ``onl``.

   .. describe:: $screen2
     
      If ``$mode`` is set to ``to``, the media query is true for breakpoints from
      ``$screen`` to ``$screen2``.

.. describe:: @mixin bp-o($orientation) { @content }

   Respond to device orientation.

   .. describe:: $orientation

      ``landscape`` or ``portrait``.


The following functions are used to construct advanced media querys. They can be used like this:

.. code-block:: css

   @media #{bpBase() and mediaQueryScreen("m","up")}, #{bpBase() and bpOrientation("portrait")} { 
       some: code;
   }

.. describe:: @function bpBase()

   Makes sure that styles are applied to screens only.

.. describe:: @function bpScreen($screen,$mode,$screen2:"")

   Respond to screen sizes.

   .. describe:: $screen

      See the ``$screensizes`` variable in :doc:`blue`.

   .. describe:: $mode

      ``up``, ``down``, ``to`` or ``onl``.

   .. describe:: $screen2
     
      If ``$mode`` is set to ``to``, the media query is true for breakpoints from
      ``$screen`` to ``$screen2``. ``$screen`` needs to contain a smaller (or equal)
      screen size than ``$screen2``.

.. describe:: @function bpOrientation($orientation)

   Respond to orientation.

   .. describe:: $orientation

      ``landscape`` or ``portrait``.