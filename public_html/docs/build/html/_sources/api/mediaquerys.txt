Media Querys
============

Simple media query shorthands. The mixin ``bp`` is the one you will use most.
Screen sizes can be configured via the ``$screensizes`` variable in :doc:`blueleaf`.


SASS
----

.. describe:: @mixin bp($screen:s,$mode:up) { @content }

   The most important mixin. Define rules dependent on ``$screen``. ``$mode`` indicates
   whether bigger/smaller screen sizes should be included or not.

   .. describe:: $screen

      See the ``$screensizes`` variable in :doc:`blueleaf`. Normally ``s``, ``m`` or ``l``.

   .. describe:: $mode

      ``up``, ``down`` or ``onl``.

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

.. describe:: @function bpScreen($screen,$mode)

   Respond to screen sizes.

   .. describe:: $screen

      See the ``$screensizes`` variable in :doc:`blueleaf`. Normally ``s``, ``m`` or ``l``.

   .. describe:: $mode

      ``up``, ``down`` or ``onl``.

.. describe:: @function bpOrientation($orientation)

   Respond to orientation.

   .. describe:: $orientation

      ``landscape`` or ``portrait``.