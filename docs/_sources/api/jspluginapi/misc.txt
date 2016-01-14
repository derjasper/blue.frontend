Misc
====

Helper functions, data structures, ...

Polyfill Map
------------

An ECMAScript 6 Map polyfill (incomplete). Uses jQuery.data.
Will be replaced by a thrid party library in future.


.. js:class:: Map()

   Create a new map.

.. js:function:: Map.put(key,value)

   Put an entry.
 
   :param object key: The key.

   :param object value: The value.

.. js:function:: Map.get(key)

   Get a value.
 
   :param object key: The key.

   :returns: The value.

.. js:function:: Map.remove(key)

   Remove an entry.
 
   :param object key: The key.

.. js:function:: Map.each(callback)

   Calls the callback function with each entry as parameter.
 
   :param function callback: The function: fn(key,value)


uniqueIds (jQuery Plugin)
-------------------------

.. js:function:: jQuery.fn.uniqueId()

   Generates a unique id for each element of the given jQuery object.