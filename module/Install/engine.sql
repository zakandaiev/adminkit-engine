CREATE TABLE IF NOT EXISTS `%prefix%_setting` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`section` VARCHAR(200) NOT NULL,
	`name` VARCHAR(200) NOT NULL,
	`value` TEXT DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_user` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`login` VARCHAR(200) NOT NULL,
	`password` VARCHAR(200) NOT NULL,
	`email` VARCHAR(200) NOT NULL,
	`name` VARCHAR(200) NOT NULL,
	`address` VARCHAR(200) DEFAULT NULL,
	`phone` VARCHAR(100) DEFAULT NULL,
	`about` TEXT DEFAULT NULL,
	`avatar` TEXT DEFAULT NULL,
	`socials` TEXT DEFAULT NULL,
	`auth_token` VARCHAR(200) DEFAULT NULL,
	`last_ip` VARCHAR(32) DEFAULT NULL,
	`last_auth` DATETIME NULL DEFAULT NULL,
	`enabled` BOOLEAN NOT NULL DEFAULT TRUE,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_edited` DATETIME on update CURRENT_TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE `login` (`login`),
	UNIQUE `email` (`email`),
	UNIQUE `phone` (`phone`),
	UNIQUE `auth_token` (`auth_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_user_group` (
	`group_id` INT UNSIGNED NOT NULL,
	`user_id` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`group_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_group` ( 
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(200) NOT NULL,
	`access_all` BOOLEAN NOT NULL DEFAULT FALSE,
	`enabled` BOOLEAN NOT NULL DEFAULT TRUE,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_edited` DATETIME on update CURRENT_TIMESTAMP DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_group_route` (
	`group_id` INT UNSIGNED NOT NULL,
	`route` VARCHAR(500) NOT NULL,
	PRIMARY KEY (`group_id`, `route`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_page` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`language` VARCHAR(8) NOT NULL,
	`is_category` BOOLEAN NOT NULL DEFAULT FALSE,
	`author` INT NOT NULL,
	`title` VARCHAR(300) NOT NULL,
	`url` VARCHAR(300) NOT NULL,
	`content` LONGTEXT DEFAULT NULL,
	`excerpt` TEXT DEFAULT NULL,
	`image` TEXT DEFAULT NULL,
	`gallery` TEXT DEFAULT NULL,
	`seo_description` TEXT DEFAULT NULL,
	`seo_keywords` TEXT DEFAULT NULL,
	`seo_image` TEXT DEFAULT NULL,
	`no_index_no_follow` BOOLEAN NOT NULL DEFAULT FALSE,
	`template` VARCHAR(100) DEFAULT NULL,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_edited` DATETIME on update CURRENT_TIMESTAMP DEFAULT NULL,
	`date_publish` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`is_static` BOOLEAN NOT NULL DEFAULT FALSE,
	`allow_comment` BOOLEAN NOT NULL DEFAULT TRUE,
	`hide_comments` BOOLEAN NOT NULL DEFAULT FALSE,
	`views` BIGINT UNSIGNED NOT NULL DEFAULT 0,
	`enabled` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY  (`id`),
	UNIQUE `url` (`language`, `url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_page_category` (
	`category_id` INT UNSIGNED NOT NULL,
	`page_id` INT UNSIGNED NOT NULL,
	PRIMARY KEY (`category_id`, `page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_tag` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(100) NOT NULL,
	`url` VARCHAR(100) NOT NULL,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_edited` DATETIME on update CURRENT_TIMESTAMP DEFAULT NULL,
	`enabled` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY  (`id`),
	UNIQUE `name` (`name`),
	UNIQUE `url` (`url`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_page_tag` (
	`page_id` INT UNSIGNED NOT NULL,
	`tag_id` BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (`page_id`, `tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_comment` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`parent` BIGINT DEFAULT NULL,
	`page_id` INT NOT NULL,
	`author` INT NOT NULL,
	`message` TEXT NOT NULL,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`date_edited` DATETIME on update CURRENT_TIMESTAMP DEFAULT NULL,
	`is_approved` BOOLEAN NOT NULL DEFAULT TRUE,
	`enabled` BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `%prefix%_custom_field` (
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`page_id` INT NOT NULL,
	`name` VARCHAR(200) NOT NULL,
	`value` LONGTEXT DEFAULT NULL,
	PRIMARY KEY (`id`),
	UNIQUE `name` (`page_id`, `name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_form` (
	`token` VARCHAR(200) NOT NULL,
	`module` varchar(200) NOT NULL,
	`action` enum('add','edit','delete') NOT NULL,
	`form_name` varchar(200) NOT NULL,
	`item_id` INT DEFAULT NULL,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY  (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `%prefix%_menu` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(200) NOT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE `%prefix%_menu_item` (
	`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
	`parent` INT DEFAULT NULL,
	`menu_id` INT NOT NULL,
	`name` VARCHAR(200) NOT NULL,
	`url` VARCHAR(400) DEFAULT NULL,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `%prefix%_notification` ( 
	`id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	`kind` VARCHAR(100) NOT NULL,
	`info` TEXT DEFAULT NULL,
	`is_read` BOOLEAN NOT NULL DEFAULT FALSE,
	`date_created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

INSERT INTO `%prefix%_setting` (`section`, `name`, `value`) VALUES
('main', 'time_zone', 'Europe/Kiev'),
('main', 'language', 'en'),
('main', 'socials_allowed', '["Telegram","Facebook","VK","Instagram"]'),
('main', 'enable_registration', 'true'),
('main', 'moderate_comments', 'true'),
('site', 'name', '%site_name%'),
('site', 'description', null),
('site', 'logo_admin', null),
('site', 'logo_public', null),
('site', 'logo_alt', null),
('site', 'analytics_gtag', null),
('site', 'pagination_limit', '10'),
('site', 'placeholder_avatar', null),
('site', 'placeholder_image', null),
('site', 'no_index_no_follow', null),
('contact', 'address', null),
('contact', 'coordinate_x', null),
('contact', 'coordinate_y', null),
('contact', 'hours', null),
('contact', 'email', '%contact_email%'),
('optimization', 'group_css', null),
('optimization', 'group_js', null),
('optimization', 'cache_db', null);

INSERT INTO `%prefix%_user` (`login`, `password`, `email`, `auth_token`) VALUES
('%admin_login%', '%admin_password%', '%admin_email%', '%auth_token%');

INSERT INTO `%prefix%_group` (`name`, `access_all`) VALUES
('Developer', true),
('Administrator', true);

INSERT INTO `%prefix%_user_group` (`user_id`, `group_id`) VALUES
(1, 1);

INSERT INTO `%prefix%_page` (`language`, `title`, `url`, `author`) VALUES
('en', '%site_name%', 'home', 1);

CREATE TRIGGER
	`set_page_static`
BEFORE UPDATE ON
	`%prefix%_page`
FOR EACH ROW
	SET NEW.is_static =
		CASE WHEN (SELECT count(*) FROM `%prefix%_page_category` WHERE page_id=NEW.id) > 0 THEN
			false
		ELSE
			true
		END;

CREATE TRIGGER
	`clear_page_category`
AFTER DELETE ON
	`%prefix%_page`
FOR EACH ROW
	DELETE FROM `%prefix%_page_category` t_pc WHERE t_pc.page_id=OLD.id OR t_pc.category_id=OLD.id;

CREATE TRIGGER
	`clear_page_comment`
AFTER DELETE ON
	`%prefix%_page`
FOR EACH ROW
	DELETE FROM `%prefix%_comment` t_c WHERE t_c.page_id=OLD.id;

CREATE TRIGGER
	`clear_page_tag_by_page_delete`
AFTER DELETE ON
	`%prefix%_page`
FOR EACH ROW
  DELETE FROM `%prefix%_page_tag` t_pt WHERE t_pt.page_id=OLD.id;
	
CREATE TRIGGER
	`clear_page_tag_by_tag_delete`
AFTER DELETE ON
	`%prefix%_tag`
FOR EACH ROW
  DELETE FROM `%prefix%_page_tag` t_pt WHERE t_pt.tag_id=OLD.id;
	
CREATE TRIGGER
	`clear_group_route_by_group_delete`
AFTER DELETE ON
	`%prefix%_group`
FOR EACH ROW
  DELETE FROM `%prefix%_group_route` t_gr WHERE t_gr.group_id=OLD.id;
	
CREATE TRIGGER
	`clear_user_group_by_group_delete`
AFTER DELETE ON
	`%prefix%_group`
FOR EACH ROW
  DELETE FROM `%prefix%_user_group` t_ug WHERE t_ug.group_id=OLD.id;
	
CREATE TRIGGER
	`clear_user_group_by_user_delete`
AFTER DELETE ON
	`%prefix%_user`
FOR EACH ROW
  DELETE FROM `%prefix%_user_group` t_ug WHERE t_ug.user_id=OLD.id;
