Resizable
=========

Elements that can be resized using the mouse. This module uses the
:doc:`../jsplugins/resizable` JavaScript plugin.


SASS
----

.. describe:: @mixin resizable($resize_class:"resizing",$click_spacing:10)

   Makes the current element resizable

   .. describe:: $resize_class

      Class to be added to the element during the resizing process.

   .. describe:: $click_spacing

      Maximum spacing to the element's border to initiate the resizing process.


.. describe:: @mixin bp-resizing($resize_class:"resizing") { @content }

   Styles to be applied during the resizing process.

   .. describe:: $resize_class

      Class.

   .. describe:: @content

      Styles.