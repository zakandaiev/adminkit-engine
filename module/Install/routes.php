<?php

Module::route('get', '/install/$name', 'Install@getInstallModule');
Module::route('get', '/uninstall/$name', 'Install@getUninstallModule');
