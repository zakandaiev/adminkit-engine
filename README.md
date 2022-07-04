# AdminKit Engine
* Designed for developers
* PHP based flexible framework + CMS modules
* MVC pattern
* OOP code style
* Module system
* Multilingual

## Web environment requirements
* PHP 7.4+
* MySQL 5.6+ or MariaDB 10.3+

## Installation
1. Download latest release
2. Extract archive content to your web server
3. Install dependencies with `composer upgrade` command
4. Open the site and fill out the installation form
5. Create & enjoy ;)

## ToDo:
* Engine: Statement class - use regex to auto-insert Filter parts and create query to count total pages for Pagination
* Engine: generate an hash instead of AI int to ids - MD5(CONCAT(UNIX_TIMESTAMP(), RAND()))
* Modules: refactor all SQL queries
* API: create API module
