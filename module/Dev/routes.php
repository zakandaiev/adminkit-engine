<?php

Module::route('get', '/dev/language-template', 'LanguageTemplate@generate');
Module::route('get', '/dev/language-template/module/$name', 'LanguageTemplate@generateModule');
