Misc
====

Helper functions, data structures, ...

SimpleMap and HashMap
---------------------

A map/dictionary. Every object can be a key.
Should be avoided whereever possible (use jQuery.data instead), because it may be
slow.

The ``SimpleMap`` does no hashing, it stores key-value pairs in an array. The
``HashMap`` appends a ``_hashid`` property to each key or uses ``jQuery.data``
for DOM ``Element``s.

The HashMap has the same API as the SimpleMap, with one difference: The constructor of
the HashMap has a boolean parameter which indicates whether the method ``each``
is needed or not.


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


helper functions
----------------

.. js:function:: getFirstKeyInArray(data) 

   *Deprecated* Gets the first key of the given array. (Will be moved in future, too
   lazy until now.)


uniqueIds (jQuery Plugin)
-------------------------

.. js:function:: jQuery.fn.uniqueId()

   Generates a unique id for each element of the given jQuery object.