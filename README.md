# AdminKit Engine
* Designed for developers
* PHP based flexible framework with CMS-ready modules
* MVC pattern
* OOP code style
* Modular system
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
* Engine: Statement class - use regex to create more optimized query for counting total rows for Pagination
* Engine: load tranlations from current module + engine, but not from all modules like now
* Engine: add custom pages to Sitemap from Module level
* Modules: refactor all SQL queries
* Modules: hooks + lang cache, test + routes remove page objs + breadcrumbs + dev language-template + localize demo theme
* API: create API module
* Admin: data-behavior selected value behavior features
* Admin: localize quill editor
* Public: add pagination & filter to Page model
* Public: create dummy theme if no demo on install
