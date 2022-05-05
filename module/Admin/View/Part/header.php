<!DOCTYPE html>
<html lang="<?= site('language_current') ?>">

<head>
	<title><?= Theme::title(); ?></title>

	<meta charset="<?= site('charset') ?>">
	<meta name="author" content="github.com/zakandaiev">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, shrink-to-fit=no">

	<meta name="description" content="">
	<meta name="keywords" content="">

	<meta property="og:type" content="website">
	<meta property="og:locale" content="<?= lang(site('language_current'), 'region') ?>">
	<meta property="og:url" content="<?= site('permalink') ?>">
	<meta property="og:title" content="<?= Theme::title() ?>">
	<meta property="og:description" content="">
	<meta property="og:keywords" content="">
	<meta property="og:image" content="">

	<link rel="canonical" href="<?= site('permalink') ?>">

	<link rel="icon" href="<?= site('url') ?>/favicon.ico" sizes="any">
	<link rel="icon" href="<?= site('url') ?>/favicon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="<?= site('url') ?>/apple-touch-icon.png">
	<link rel="image_src" href="">

	<?= Theme::meta() ?>
	<?= Asset::render('css') ?>
</head>

<body>
<script src="<?= Asset::url() ?>/js/colormode.js"></script>
