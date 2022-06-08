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

INSERT INTO `%prefix%_page` (`is_category`, `author`, `url`, `template`) VALUES
(0, 1, 'about', 'about'),
(0, 1, 'contact', 'contact'),
(1, 1, 'lifestyle', NULL),
(1, 1, 'fashion', NULL),
(1, 1, 'technology', NULL),
(1, 1, 'travel', NULL),
(1, 1, 'health', NULL),
(0, 1, 'lorem-post-1', NULL),
(0, 1, 'lorem-post-2', NULL),
(0, 1, 'lorem-post-3', NULL),
(0, 1, 'lorem-post-4', NULL),
(0, 1, 'lorem-post-5', NULL),
(0, 1, 'lorem-post-6', NULL),
(0, 1, 'lorem-post-7', NULL),
(0, 1, 'lorem-post-8', NULL),
(0, 1, 'lorem-post-9', NULL),
(0, 1, 'lorem-post-10', NULL),
(0, 1, 'lorem-post-11', NULL),
(0, 1, 'lorem-post-12', NULL),
(0, 1, 'lorem-post-13', NULL);

INSERT INTO `%prefix%_page_translation` (`page_id`, `language`, `title`, `image`) VALUES
(2, 'en', 'About', NULL),
(3, 'en', 'Contact', NULL),
(4, 'en', 'Lifestyle', 'upload/demo/header-2.jpg'),
(5, 'en', 'Fashion', 'upload/demo/header-1.jpg'),
(6, 'en', 'Technology', NULL),
(7, 'en', 'Travel', NULL),
(8, 'en', 'Health', 'upload/demo/header-2.jpg'),
(9, 'en', 'Lorem post #1', 'upload/demo/post-1.jpg'),
(10, 'en', 'Lorem post #2', 'upload/demo/post-2.jpg'),
(11, 'en', 'Lorem post #3', 'upload/demo/post-3.jpg'),
(12, 'en', 'Lorem post #4', 'upload/demo/post-4.jpg'),
(13, 'en', 'Lorem post #5', 'upload/demo/post-5.jpg'),
(14, 'en', 'Lorem post #6', 'upload/demo/post-6.jpg'),
(15, 'en', 'Lorem post #7', 'upload/demo/post-7.jpg'),
(16, 'en', 'Lorem post #8', 'upload/demo/post-8.jpg'),
(17, 'en', 'Lorem post #9', 'upload/demo/post-9.jpg'),
(18, 'en', 'Lorem post #10', 'upload/demo/post-10.jpg'),
(19, 'en', 'Lorem post #11', 'upload/demo/post-11.jpg'),
(20, 'en', 'Lorem post #12', 'upload/demo/post-12.jpg'),
(21, 'en', 'Lorem post #13', 'upload/demo/post-13.jpg');

UPDATE `%prefix%_page` SET `views`=(SELECT FLOOR(RAND() * (1000-10) + 10));

INSERT INTO `%prefix%_tag` (`language`, `name`, `url`) VALUES
('en', 'Social', 'social'),
('en', 'Life', 'life'),
('en', 'Lifestyle', 'lifestyle'),
('en', 'Fashion', 'fashion'),
('en', 'Health', 'health'),
('en', 'Travel', 'travel'),
('en', 'Technology', 'technology'),
('en', 'Food', 'food'),
('en', 'News', 'news'),
('en', 'Magazine', 'magazine');

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

INSERT INTO `%prefix%_menu` (`name`, `items`) VALUES
('header', '[{"name":"Home","url":"","parent":null,"children":[]},{"name":"Categories","url":"","parent":null,"children":[{"name":"Lifestyle","url":"lifestyle","parent":"Categories","children":[]},{"name":"Fashion","url":"fashion","parent":"Categories","children":[]},{"name":"Health","url":"health","parent":"Categories","children":[]},{"name":"Travel","url":"travel","parent":"Categories","children":[]},{"name":"Technology","url":"technology","parent":"Categories","children":[]}]},{"name":"Contacts","url":"contact","parent":null,"children":[]},{"name":"About Us","url":"about","parent":null,"children":[]}]'),
('footer', '[{"name":"Home","url":"","parent":null,"children":[]},{"name":"Contacts","url":"contact","parent":null,"children":[]},{"name":"About Us","url":"about","parent":null,"children":[]}]'),
('phones', '[{"name":"202-555-0194","url":"tel:2025550194","parent":null,"children":[]}]'),
('socials', '[{"name":"facebook","url":"#","parent":null,"children":[]},{"name":"twitter","url":"#","parent":null,"children":[]},{"name":"instagram","url":"#","parent":null,"children":[]}]');
