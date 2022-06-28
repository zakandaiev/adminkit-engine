<?php

Module::route('get', '/install/$name', 'Install@getInstallModule');
Module::route('get', '/uninstall/module/$name', 'Install@getUninstallModule');
