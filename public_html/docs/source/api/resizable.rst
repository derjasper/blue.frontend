Resizable
=========

Elements that can be resized with the mouse.


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


JavaScript
----------

.. js:function:: $.resizable_enable(resize_class,click_spacing)

   Enable the resizable feature.

   :param string resize_class: Class.

   :param int click_spacing: Click spacing.


.. js:function:: $.resizable_disable()

   Disable the resizable feature.