<?php

$story_title = [
	'required' => true,
	'required_message' => __('Story title is required')
];
$story_text = [
	'required' => true,
	'required_message' => __('Story is required')
];
$quote_text = [
	'required' => true,
	'required_message' => __('Quote is required')
];
$quote_author = [
	'required' => true,
	'required_message' => __('Quote author is required')
];
$vision_title = [
	'required' => true,
	'required_message' => __('Vision title is required')
];
$vision_text = [
	'required' => true,
	'required_message' => __('Vision author is required')
];

return [
	'fields' => [
		'story_title' => $story_title,
		'story_text' => $story_text,
		'quote_text' => $quote_text,
		'quote_author' => $quote_author,
		'vision_title' => $vision_title,
		'vision_text' => $vision_text
	]
];
