<?php

return [
	'id@id' => '=',
	'name@name' => 'text',
	'created@date_created' => 'date',
	'lastauth@auth_date' => 'date',
	'active@is_enabled' => 'boolean',

	'oid@id' => 'order',
	'oname@name' => 'order',
	'ogroups@count_groups' => 'order',
	'ocreated@date_created' => 'order',
	'olastauth@auth_date' => 'order',
	'oactive@is_enabled' => 'order'
];
