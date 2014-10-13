Sticky
======

The sticky mixin allows to create elements which stick at the top or bottom of
the viewport when they are scrolled to these borders. Also, sticky elements can
have a parent element they will not leave. That means, that sticky elements will
stop sticking when the parent element is scrolled out of the viewport (see demo
browser for details). Also, this module integrates with scrollarea offsets
(see :doc:`blueleaf`).


SASS
----

.. describe:: @mixin sticky($parent:"body",$directions:"tb",$scrollarea_offset:"",$zindex:999)

   Creates a sticky element.

   .. describe:: $parent
   
      Selector for the parent element to stick in.

   .. describe:: $directions

      Defines whether the element should stick at the top and/or the bottom of the
      page. The parameter is a ``string``. If ``t`` is included, the element will
      stick at the top, if ``b`` is included in the string, the element will stick
      at the bottom of the viewport.

   .. describe:: $scrollarea_offset

      Same syntax as ``$directions``, but this parameter defines when the
      scrollarea offset should be updated.

   .. describe:: $zindex

      The elements ``z-index`` when it is sticked.

.. describe:: @mixin bp-sticked() { @content; }

   Pseudo-breakpoint valid when the current element is sticked.

.. describe:: @mixin sticky-spacing($spacing...)

   Offset for the element to stick.

JS
--

.. js:function:: $.sticky_enable(opts)

   Enables the sticky feature.

   :param object opts: Some options.

                       sticky_class: Class to be applied if sticked.

                       parent_selector, z_index, stick_directions, scrollarea_offset: See SASS mixin.

                       The sticky spacing/offset is set via the margin in sticked state
                       (``.sticked { margin:5; }``).

.. js:function:: $.sticky_disable()

   Disables the sticky feature.