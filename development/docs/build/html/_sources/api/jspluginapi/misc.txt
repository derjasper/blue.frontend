Misc
====

Helper functions, data structures, ...

Map
---

A map. Every object can be a key. Should be avoided whereever possible (use jQuery.data instead),
because it uses no hashing, it uses an array of key-value pairs.

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