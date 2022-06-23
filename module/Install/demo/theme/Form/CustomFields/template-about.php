<?php

$story = [
	'required' => true,
	'required_message' => __('Story is required')
];
$quote = [
	'required' => true,
	'required_message' => __('Quote is required')
];
$quote_author = [
	'required' => true,
	'required_message' => __('Quote author is required')
];
$vision = [
	'required' => true,
	'required_message' => __('Vision author is required')
];

return [
	'fields' => [
		'story' => $story,
		'quote' => $quote,
		'quote_author' => $quote_author,
		'vision' => $vision
	]
];
