Get started
===========

Please note that the blue leaf package comes not only with the library itself.
It has a set of examples and this documentation bundled with it!

Download & extract the files of the lib/blueleaf folder to your project.

We assume that you have set up SASS with your development environment and know
how to use it:

- `SASS <http://sass-lang.com/>`_ (latest)

blue leaf has the following dependencies, please add them to your project:

- `jQuery <http://jquery.com/>`_ (1.9 is recommended)


To run a blueleaf project, the CSS files must be load via HTTP, because JavaScript
is not allowed to access local files. If you want to develop on your computer,
you have to setup a local web server. Some IDEs have a simple webserver
integrated (e.g. Netbeans).


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