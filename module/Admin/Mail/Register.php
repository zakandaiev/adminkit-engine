<?php

$site_url = Request::$base;

$message = '
  <p><span style="font-size:16px"><strong>Доброго времени суток</strong></span></p>
  <br>
  <p>Вы успешно зарегистрировались на сайте <a href="' . $site_url . '" target="_blank">' . site('name') . '</a>.</p>
  <p>Данные для входа на сайт:</p>
  <p><strong>Логин:</strong> ' . $data->login . '</p>
  <p><strong>Пароль:</strong> ' . $data->password . '</p>
  <p>Это автоматическое письмо, отвечать на него не нужно.</p>
  <br>
  <p>С уважением,<br>Администрация <a href="' . $site_url . '" target="_blank">' . site('name') . '</a></p>
';

return [
	'recepient' => $data->email,
	'subject' => 'Registration',
	'message' => $message
];
