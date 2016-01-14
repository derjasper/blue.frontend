Grid
====

A (responsive) grid similiar to Foundation's one. Offers columns and rows.

The number of cols/rows can be configured via the ``$columns`` / ``$rows``
variable in :doc:`blue`.

Each element in the grid is a *box* and cannot be a *container* (see :doc:`container`).

A group of *box* es should be wrapped in a *container*. This container must have a
defined width to make the *col* s work properly. Same is true for *row* s and the container's
height.

Offsets
-------

A *col* or a *row* can have an offset.

Source ordering
---------------

*col*s and *row*s can do source ordering (e.g. push and pull). For example, the code

HTML:

.. code-block:: html
   
   <div class="first">1st</div>
   <div class="second">2nd</div>

SASS:

.. code-block:: sass

   .first {@include col(6);}
   .second {@include col(6);}

has the same output as:

HTML:

.. code-block:: html
   
   <div class="second">2nd</div>
   <div class="first">1st</div>
   

SASS:

.. code-block:: sass

   .second {@include col(6);@include col-push(6);}
   .first {@include col(6);@include col-pull(6);}
   
For more information refer to the grid demo. 

Direction
---------

Each *box* has a direction indicating from which side the parent element will be
filled (left or right).


SASS
----

.. describe:: @mixin box($direction)

   An element which is part of the grid. Will be used by ``col`` and ``row``, no 
   need to use this directly.

   .. describe:: $direction

      ``left`` or ``right``, indicates the alignment of the grid.


.. describe:: @mixin col($size,$direction:left)
   
   An element with the width of ``$size`` cols.

   .. describe:: $size
     
      Width of the element.

   .. describe:: $direction
    
      See ``box``.

.. describe:: @mixin col-offset($x)

   Offset to the left of ``$x`` cols.

   .. describe:: $x

      Width of the offset.

.. describe:: @mixin col-push($x)

   The element pushes itself ``$x`` cols to the right.

   .. describe:: $x

      Number of cols.

.. describe:: @mixin col-pull($x)

   The element pulls itself ``$x`` cols to the left.

   .. describe:: $x

      Number of cols.


.. describe:: @mixin row($size,$direction:left)
   
   An element with the height of ``$size`` rows.

   .. describe:: $size
     
      Height of the element.

   .. describe:: $direction
    
      See ``box``.

.. describe:: @mixin row-offset($x)

   Offset to the top of ``$x`` rows. This mixin uses JavaScript, see :doc:`../jsplugins/grid`

   .. describe:: $x

      Height of the offset.

.. describe:: @mixin row-push($x)

   The element pushes itself ``$x`` rows to the bottom.

   .. describe:: $x

      Number of rows.

.. describe:: @mixin row-pull($x)

   The element pulls itself ``$x`` rows to the top.

   .. describe:: $x

      Number of rows.