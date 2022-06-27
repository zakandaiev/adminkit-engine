# AdminKit Engine
* Designed for developers
* PHP based flexible framework + CMS modules
* MVC pattern
* OOP code style
* Module system
* Multilingual

## Web environment requirements
* PHP 7.0+
* MySQL 5.6+ or MariaDB 10.3+

## Installation
1. Download latest release
2. Extract archive content to your web server
3. Install dependencies with `composer upgrade` command
4. Open the site and fill out the installation form
5. Create & enjoy ;)

## ToDo:
* Engine: create Filter class
* Engine: generate an hash instead of AI int to ids - MD5(CONCAT(UNIX_TIMESTAMP(), RAND()))
* Engine: add module install func (languages, DB queries etc.)
* Admin: data-behavior refactor, add lowercase & uppercase, data-behavior-oninput:bool
* Admin: profile settings: privacy, notifications, delete account
* Modules: refactor SQL queries
* API: create API module
