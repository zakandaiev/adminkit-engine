<?php

return [
	'table' => 'contact',
	'fields' => [],
	'execute_post' => function($data) {
		Hook::run('contact_' . $data->form_data['action'], $data);
	}
];
