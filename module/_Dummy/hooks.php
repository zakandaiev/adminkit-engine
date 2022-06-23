<?php

############################# REGISTER #############################
Hook::register('dummy_hook', function($data) {
	debug($data);
});

############################# RUN #############################
Hook::run('dummy_hook', 'Hook dummy_hook is running');
