<?php

$story = [
	'required' => true,
	'html' => true
];
$quote = [
	'required' => true
];
$quote_author = [
	'required' => true
];
$vision = [
	'required' => true,
	'html' => true
];

return [
	'fields' => [
		'story' => $story,
		'quote' => $quote,
		'quote_author' => $quote_author,
		'vision' => $vision
	]
];
