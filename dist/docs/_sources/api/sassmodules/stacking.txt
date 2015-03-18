Stacking
========

This is not a "real" module, but blue leaf assumes some code style rules to create
predictable results. This is necessary, because blue leaf uses some CSS properties
which create a new stacking context. Because most devs do not know how ``z-index``
really works, this would lead to hopelessly developers losing their beliefs.

The stacking order is managed by ``z-index``, but devs should assume that each
element creates a new *stacking context* and each element is positioned (``position:relative;``).

Brief description: All child element of an element creating a *stacking context* belong to this stacking
context. ``z-index`` can specify the stacking order inside this *stacking context*, 
but an element can never be moved relative to an element belonging to a different
*stacking context*.


How does z-index work?
----------------------

The brief description above is not the best, please read the `specs <http://www.w3.org/TR/CSS2/zindex.html>`_.

Another goot post about can be found here:
`http://philipwalton.com/articles/what-no-one-told-you-about-z-index/ <http://philipwalton.com/articles/what-no-one-told-you-about-z-index/>`_

