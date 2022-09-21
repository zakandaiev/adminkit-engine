<?php

$message = '
  <p><span style="font-size:16px"><strong>' . __('Good day') . '</strong></span></p>
  <br>
  <p>' . __('This is test mail from the site') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
  <p>' . __('This is an automatic email, no need to reply') . '.</p>
  <br>
  <p>' . __('Sincerely') . ',<br>' . __('Administration') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
';

return [
	'subject' => __('Mail test'),
	'message' => $message,
	'from' => 'dummy@mail.org', // if set to null then 'from' => Setting::get('contact')->email
	'type' => 'change_login' // if isset then it will check user preferences from $user->setting->notifications->{'mail_' . $type}
];
