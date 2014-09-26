Get started
===========

Please note that the blue leaf package comes not only with the library itself.
It has a set of examples and this documentation bundled with it!

Download & extract the files of the lib/blueleaf folder to your project.

We assume that you have set up SASS with your development environment and know
how to use it:

- `SASS <http://sass-lang.com/>`_

blue leaf has the following dependencies, please add them to your project:

- `jQuery <http://jquery.com/>`_
- `enquire.js <http://wicky.nillia.ms/enquire.js/>`_

Skeleton
--------

HTML:

.. code-block:: html

   <!DOCTYPE html>
    <html>
        <head>
            <title>blue leaf</title>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <script src="libs/jquery/jquery.js"></script>
            <script src="libs/enquire.js/enquire.js"></script>
            <script src="libs/blueleaf/js/blueleaf.js"></script>

            <link rel="stylesheet" href="css/dummy.css" />
        </head>
        <body>
            <h1>dummy</h1>
        </body>
    </html>

The line
``<meta name="viewport" content="width=device-width, initial-scale=1.0">``
is important!


SASS:

Make sure to import the blueleaf.scss.

.. code-block:: sass

   @import "libs/blueleaf/scss/blueleaf.scss";