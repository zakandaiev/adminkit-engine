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
`value`='upload/demo/no-avatar.jpg'
WHERE `section`='site' AND `name`='placeholder_avatar';

UPDATE `%prefix%_setting` SET
`value`='upload/demo/no-image.jpg'
WHERE `section`='site' AND `name`='placeholder_image';

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

INSERT INTO `%prefix%_page_translation` (`page_id`, `language`, `title`, `image`, `excerpt`, `content`) VALUES
(2, 'en', 'About', NULL, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', NULL),
(3, 'en', 'Contact', NULL, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', '<p>Malis debet quo et, eam an lorem quaestio. Mea ex quod facer decore, eu nam mazim postea. Eu deleniti pertinacia ius. Ad elitr latine eam, ius sanctus eleifend no, cu primis graecis comprehensam eum. Ne vim prompta consectetuer, etiam signiferumque ea eum.</p>'),
(4, 'en', 'Lifestyle', 'upload/demo/header-2.jpg', NULL, NULL),
(5, 'en', 'Fashion', 'upload/demo/header-1.jpg', NULL, NULL),
(6, 'en', 'Technology', NULL, NULL, NULL),
(7, 'en', 'Travel', NULL, NULL, NULL),
(8, 'en', 'Health', 'upload/demo/header-2.jpg', NULL, NULL),
(9, 'en', 'Lorem post #1', 'upload/demo/post-1.jpg', NULL, NULL),
(10, 'en', 'Lorem post #2', 'upload/demo/post-2.jpg', NULL, NULL),
(11, 'en', 'Lorem post #3', 'upload/demo/post-3.jpg', NULL, NULL),
(12, 'en', 'Lorem post #4', 'upload/demo/post-4.jpg', NULL, NULL),
(13, 'en', 'Lorem post #5', 'upload/demo/post-5.jpg', NULL, NULL),
(14, 'en', 'Lorem post #6', 'upload/demo/post-6.jpg', NULL, NULL),
(15, 'en', 'Lorem post #7', 'upload/demo/post-7.jpg', NULL, NULL),
(16, 'en', 'Lorem post #8', 'upload/demo/post-8.jpg', NULL, NULL),
(17, 'en', 'Lorem post #9', 'upload/demo/post-9.jpg', NULL, NULL),
(18, 'en', 'Lorem post #10', 'upload/demo/post-10.jpg', NULL, NULL),
(19, 'en', 'Lorem post #11', 'upload/demo/post-11.jpg', NULL, NULL),
(20, 'en', 'Lorem post #12', 'upload/demo/post-12.jpg', NULL, NULL),
(21, 'en', 'Lorem post #13', 'upload/demo/post-13.jpg', NULL, NULL);

UPDATE `%prefix%_page` SET `views`=(SELECT FLOOR(RAND() * (1000-10) + 10));

INSERT INTO `%prefix%_custom_field` (`page_id`, `language`, `name`, `value`) VALUES
(2, 'en', 'story_title', 'OUR STORY'),
(2, 'en', 'story_text', '<p>Lorem ipsum dolor sit amet, mea ad idque detraxit, cu soleat graecis invenire eam. Vidisse suscipit liberavisse has ex, vocibus patrioque vim et, sed ex tation reprehendunt. Mollis volumus no vix, ut qui clita habemus, ipsum senserit est et. Ut has soluta epicurei mediocrem, nibh nostrum his cu, sea clita electram reformidans an.</p>'),
(2, 'en', 'quote_text', 'Ei prima graecis consulatu vix, per cu corpora qualisque voluptaria. Bonorum moderatius in per, ius cu albucius voluptatum. Ne ius torquatos dissentiunt. Brute illum utroque eu quo. Cu tota mediocritatem vis, aliquip cotidieque eu ius, cu lorem suscipit eleifend sit.'),
(2, 'en', 'quote_author', 'John Doe'),
(2, 'en', 'vision_title', 'OUR VISION'),
(2, 'en', 'vision_text', '<p>Est in saepe accusam luptatum. Purto deleniti philosophia eum ea, impetus copiosae id mel. Vis at ignota delenit democritum, te summo tamquam delicata pro. Utinam concludaturque et vim, mei ullum intellegam ei. Eam te illum nostrud, suas sonet corrumpit ea per. Ut sea regione posidonium. Pertinax gubergren ne qui, eos an harum mundi quaestio.</p><p>Nihil persius id est, iisque tincidunt abhorreant no duo. Eripuit placerat mnesarchum ius at, ei pro laoreet invenire persecuti, per magna tibique scriptorem an. Aeque oportere incorrupte ius ea, utroque erroribus mel in, posse dolore nam in. Per veniam vulputate intellegam et, id usu case reprimique, ne aperiam scaevola sed. Veritus omnesque qui ad. In mei admodum maiorum iracundia, no omnis melius eum, ei erat vivendo his. In pri nonumes suscipit.</p>');


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

INSERT INTO `%prefix%_menu` (`name`) VALUES
('header'),
('footer'),
('phones'),
('socials');

INSERT INTO `%prefix%_menu_translation` (`menu_id`, `language`, `items`) VALUES
(1, 'en', '[{"name":"Home","url":"","parent":null,"children":[]},{"name":"Categories","url":"","parent":null,"children":[{"name":"Lifestyle","url":"lifestyle","parent":"Categories","children":[]},{"name":"Fashion","url":"fashion","parent":"Categories","children":[]},{"name":"Health","url":"health","parent":"Categories","children":[]},{"name":"Travel","url":"travel","parent":"Categories","children":[]},{"name":"Technology","url":"technology","parent":"Categories","children":[]}]},{"name":"Contacts","url":"contact","parent":null,"children":[]},{"name":"About Us","url":"about","parent":null,"children":[]}]'),
(2, 'en', '[{"name":"Home","url":"","parent":null,"children":[]},{"name":"Contacts","url":"contact","parent":null,"children":[]},{"name":"About Us","url":"about","parent":null,"children":[]}]'),
(3, 'en', '[{"name":"202-555-0194","url":"tel:2025550194","parent":null,"children":[]}]'),
(4, 'en', '[{"name":"facebook","url":"#","parent":null,"children":[]},{"name":"twitter","url":"#","parent":null,"children":[]},{"name":"instagram","url":"#","parent":null,"children":[]}]');
