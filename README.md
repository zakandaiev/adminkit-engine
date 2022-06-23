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
* Engine: cache queries
* Engine: generate an hash instead of AI int to ids - MD5(CONCAT(UNIX_TIMESTAMP(), RAND()))
* Engine: add module install func (languages, DB queries etc.)
* Admin: load more by data-attributes
* Admin: create Form models eg. User (name, login, email...)
* Admin: data-behavior refactor, add lowercase & uppercase, data-behavior-oninput:bool
* Admin: create mails
* Admin: realize reset password
* Admin: profile settings: privacy, notifications, delete account
* Modules: set min/maxlength, required for all inputs
* Modules: check all links for site('url_language')
* Modules: translate all texts
* Modules: log all events
* Public: getPagePrevNext - consider category
* Public: getRelatedPages - select posts with similar tags and categories else random
* API: create API module
