<?php

############################# ASSETS #############################
Asset::css('css/main');

Asset::js('js/main');

############################# BREADCRUMBS #############################
Breadcrumb::setOption('render_homepage', true);
Breadcrumb::setOption('homepage_name', '<i class="align-middle" data-feather="home"></i>');
Breadcrumb::setOption('homepage_url', '/homepage-url');
Breadcrumb::setOption('separator', '<i class="align-middle" data-feather="arrow-right"></i>');
