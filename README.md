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
* Engine: create Filter class
* Engine: cache langs
* Engine: cache queries
* Engine: multilang settings
* Engine: multilang menu
* Engine: htaccess2 -> htaccess
* Engine: Find way to use hooks between modules
* Engine: generate an hash instead of AI int to ids - MD5(CONCAT(UNIX_TIMESTAMP(), RAND()))
* Admin: extend custom fields (image, wysiwyg...)
* Admin: load more by data-attributes
* Admin: make admin sidebar customizable by another modules
* Admin: create Form models eg. User (name, login, email...)
* Admin: getAddTranslation() also copy custom fields
* Admin: add new settings
* Admin: data-behavior refactor, add lowercase & uppercase, data-behavior-oninput:bool
* Modules: set min/maxlength for all inputs
* Modules: check all links for site('url_language')
* Modules: translate all texts
* Modules: create API module
* Modules: log all events
* Public: make pages multilang
