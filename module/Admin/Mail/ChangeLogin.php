<?php

$message = '
  <p><span style="font-size:16px"><strong>' . __('Good day') . '</strong></span></p>
  <br>
  <p>' . __('You have changed your login on the site') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
  <p>' . __('Details') . ':</p>
  <p><strong>' . __('Old login') . ':</strong> ' . $data->login_old . '</p>
  <p><strong>' . __('New login') . ':</strong> ' . $data->login_new . '</p>
  <p>' . __('This is an automatic email, no need to reply') . '.</p>
  <br>
  <p>' . __('Sincerely') . ',<br>' . __('Administration') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
';

return [
	'type' => 'user_change_login',
	'subject' => __('Login change'),
	'message' => $message
];
