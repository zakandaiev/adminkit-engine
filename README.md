# CMS
* PHP
* MVC + Language + Form
* OOP

## Web environment requirements
* PHP 7.0+
* MySQL 5.7+ or MariaDB 10.3+

## Installation
1. Download latest release.
2. Extract archive content to your web server.
3. Install dependencies with `composer upgrade` command.
4. Open the site and fill out the installation form.
5. Enjoy ;)

## ToDo:
* create Filter class
* create Menu class
* modal forms compile
* extend custom fields (image, wysiwyg...)
* more convenient DB data output, pagination, filtering (maybe move from controller directly to template, but ha MVC?)
* load more by data-attributes
* cache langs
* cache queries in Public module
* make admin sidebar customizable by another modules
* translate all texts
* multilang settings
* multilang menu
* optimizations functionality in settings
* htaccess2 -> htaccess
* create Form models eg. User (name, login, email...)
* getAddTranslation() also copy custom fields, tags
* check all links for site('url_language')
* SQL: enabled -> is_enabled
* add new settings in Admin
* set min/maxlength for all inputs
* Create Logs page in Admin module
* Find way to use hooks between modules
* JS scripts -> Classes for usability in another modules
* JS add data-behavior (+ lowercase, uppercase), data-behavior-oninput
* id VARCHAR(64) NOT NULL DEFAULT MD5(CONCAT(UNIX_TIMESTAMP(), RAND(), UUID()))
