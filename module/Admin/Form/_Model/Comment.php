<?php

$author = [
	'required' => true,
	'int' => true,
	'required_message' => 'Author is required',
	'int_message' => 'Author format is invalid'
];
$message = [
	'required' => true,
	'maxlength' => 1000,
	'required_message' => 'Message is required',
	'maxlength_message' => 'Message is too long'
];
$date_created = [
	'date' => true
];
$is_approved = [
	'boolean' => true
];
