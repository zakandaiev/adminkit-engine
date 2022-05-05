UPDATE `%prefix%_setting` SET
`value`='Nec feugiat nisl pretium fusce id velit ut tortor pretium. Nisl purus in mollis nunc sed. Nunc non blandit massa enim nec.'
WHERE `section`='site' AND `name`='description';

UPDATE `%prefix%_setting` SET
`value`='upload/demo/logo-alt.png'
WHERE `section`='site' AND `name`='logo_admin';

UPDATE `%prefix%_setting` SET
`value`='upload/demo/logo.png'
WHERE `section`='site' AND `name`='logo_public';

UPDATE `%prefix%_setting` SET
`value`='upload/demo/logo-alt.png'
WHERE `section`='site' AND `name`='logo_alt';

UPDATE `%prefix%_setting` SET
`value`='123 6th St.Melbourne, FL 32904'
WHERE `section`='contact' AND `name`='address';

UPDATE `%prefix%_user` SET
`avatar`='upload/demo/avatar-2.jpg',
`name`='John Doe',
`about`='Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
`socials`='[{"type":"telegram","link":"#"},{"type":"facebook","link":"#"},{"type":"instagram","link":"#"}]'
WHERE `id`=1;

INSERT INTO `%prefix%_page` (`language`, `is_category`, `author`, `title`, `url`, `image`, `template`) VALUES
('en', 0, 1, 'About', 'about', NULL, 'about'),
('en', 0, 1, 'Contact', 'contact', NULL, 'contact'),
('en', 1, 1, 'Lifestyle', 'lifestyle', 'upload/demo/header-2.jpg', NULL),
('en', 1, 1, 'Fashion', 'fashion', 'upload/demo/header-1.jpg', NULL),
('en', 1, 1, 'Technology', 'technology', NULL, NULL),
('en', 1, 1, 'Travel', 'travel', NULL, NULL),
('en', 1, 1, 'Health', 'health', 'upload/demo/header-2.jpg', NULL),
('en', 0, 1, 'Lorem post #1', 'lorem-post-1', 'upload/demo/post-1.jpg', NULL),
('en', 0, 1, 'Lorem post #2', 'lorem-post-2', 'upload/demo/post-2.jpg', NULL),
('en', 0, 1, 'Lorem post #3', 'lorem-post-3', 'upload/demo/post-3.jpg', NULL),
('en', 0, 1, 'Lorem post #4', 'lorem-post-4', 'upload/demo/post-4.jpg', NULL),
('en', 0, 1, 'Lorem post #5', 'lorem-post-5', 'upload/demo/post-5.jpg', NULL),
('en', 0, 1, 'Lorem post #6', 'lorem-post-6', 'upload/demo/post-6.jpg', NULL),
('en', 0, 1, 'Lorem post #7', 'lorem-post-7', 'upload/demo/post-7.jpg', NULL),
('en', 0, 1, 'Lorem post #8', 'lorem-post-8', 'upload/demo/post-8.jpg', NULL),
('en', 0, 1, 'Lorem post #9', 'lorem-post-9', 'upload/demo/post-9.jpg', NULL),
('en', 0, 1, 'Lorem post #10', 'lorem-post-10', 'upload/demo/post-10.jpg', NULL),
('en', 0, 1, 'Lorem post #11', 'lorem-post-11', 'upload/demo/post-11.jpg', NULL),
('en', 0, 1, 'Lorem post #12', 'lorem-post-12', 'upload/demo/post-12.jpg', NULL),
('en', 0, 1, 'Lorem post #13', 'lorem-post-13', 'upload/demo/post-13.jpg', NULL);

UPDATE `%prefix%_page` SET `views`=(SELECT FLOOR(RAND() * (1000-10) + 10));

INSERT INTO `%prefix%_page_category` (`category_id`, `page_id`) VALUES
(4, 9),
(4, 10),
(4, 11),
(4, 12),
(4, 13),
(4, 14),
(4, 15),
(4, 16),
(5, 17),
(5, 18),
(6, 19),
(6, 20),
(7, 21),
(7, 9),
(7, 10),
(8, 11),
(8, 12),
(8, 13);

INSERT INTO `%prefix%_tag` (`name`, `url`) VALUES
('Social', 'social'),
('Life', 'life'),
('Lifestyle', 'lifestyle'),
('Fashion', 'fashion'),
('Health', 'health'),
('Travel', 'travel'),
('Technology', 'technology'),
('Food', 'food'),
('News', 'news'),
('Magazine', 'magazine');

INSERT INTO `%prefix%_page_tag` (`page_id`, `tag_id`) VALUES
(9, 1),
(9, 2),
(9, 3),
(9, 4),
(10, 5),
(10, 6),
(10, 7),
(10, 8),
(11, 9),
(11, 10),
(11, 1),
(11, 2),
(12, 3),
(13, 4),
(14, 5),
(14, 6),
(15, 7),
(16, 8),
(16, 9),
(16, 10),
(16, 1),
(17, 2),
(18, 3),
(19, 4),
(19, 5),
(20, 6),
(20, 7),
(20, 8),
(21, 9),
(21, 10);

INSERT INTO `%prefix%_comment` (`parent`, `page_id`, `author`, `message`) VALUES
(NULL, 9, 1, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'),
(1, 9, 1, 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.');

INSERT INTO `%prefix%_menu` (`name`) VALUES
('header'),
('footer'),
('phones'),
('socials');

INSERT INTO `%prefix%_menu_item` (`parent`, `menu_id`, `name`, `url`) VALUES
(NULL, 1, 'Home', 'home'),
(NULL, 1, 'Categories', NULL),
(2, 1, 'Lifestyle', 'lifestyle'),
(2, 1, 'Fashion', 'fashion'),
(2, 1, 'Health', 'health'),
(2, 1, 'Travel', 'travel'),
(2, 1, 'Technology', 'technology'),
(NULL, 1, 'Contacts', 'contact'),
(NULL, 1, 'About Us', 'about'),
(NULL, 2, 'Home', 'home'),
(NULL, 2, 'Contacts', 'contact'),
(NULL, 2, 'About Us', 'about'),
(NULL, 3, '202-555-0194', 'tel:2025550194'),
(NULL, 4, 'facebook', '#'),
(NULL, 4, 'twitter', '#'),
(NULL, 4, 'instagram', '#');
