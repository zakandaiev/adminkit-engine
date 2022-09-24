<?php

############################# REGISTER #############################
Hook::register('dummy_hook', function($data1, $data2) {
	debug($data1);
	debug($data2);
});

############################# RUN #############################
Hook::run('dummy_hook', 'Hook dummy_hook is running', 'Yeah!');
