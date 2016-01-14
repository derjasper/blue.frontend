Using blue.frontend with Drupal
===============================

Drupal 7
--------

Your ``theme.info`` file should look like this:
    
.. code-block:: none

    name = THEMENAME
    description = ...
    core = 7.x
    engine = phptemplate

    regions[...] = ...

    ; stylesheets[all][] = css/style.css ; IMPORTANT: DO NOT add your theme's CSS file here!

    stylesheets[all][] = libs/font-awesome/css/font-awesome.css

    scripts[] = libs/blue/js/blue.js

    features[] = ...


Then, add this to your ``template.php``:
    
.. code-block:: php

    <?php
    function THEMENAME_preprocess_html(&$variables) {
            drupal_add_css(path_to_theme().'/css/style.css', array('preprocess' => false));

            $element = array(
                    '#tag' => 'meta',
                    '#attributes' => array(
                            'name' => 'viewport',
                            'content' => 'width=device-width, minimum-scale=1.0, maximum-scale=1.0'
                    )
            );
            drupal_add_html_head($element, 'template_viewport');
    }
    ?>

This makes sure that the CSS file can be found by blue.frontend's CSS and enables
correct rendering on mobile devices.

For now, it is important to **enable CSS compression** in Drupal's cache settings.
Otherwise, the JavaScript-Bridge would not work!

Drupal 8
--------

Since Drupal 8 is not finished yet, this instruction may not work in the future.

Add this to your theme's ``THEMENAME.libraries.yml``:

.. code-block:: yaml

    blue:
      version: 1.x
      js:
        libs/blue/js/blue.js: {}
      dependencies:
        - core/jquery
        
        
Your theme's ``THEMENAME.info.yml`` should look like tihs:

.. code-block:: yaml

    name: THEMENAME
    type: theme
    description: '...'
    core: 8.x
    stylesheets:
        all:
            - css/style.css
            - libs/font-awesome/css/font-awesome.css
    libraries:
        - THEMENAME/blue

    regions:
        #...

    stylesheets-remove: 
      - system.theme.css # optional
      
      
For now, it is important to **disable CSS compression** in Drupal's cache settings.
Otherwise, the JavaScript-Bridge would not work!