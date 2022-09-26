<?php

$message = '
  <p><span style="font-size:16px"><strong>' . __('Good day') . '</strong></span></p>
  <br>
  <p>' . __('You have reseted your password on the site') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
  <p>' . __('Authorization data') . ':</p>
  <p><strong>' . __('New password') . ':</strong> ' . $data->password . '</p>
  <p>' . __('This is an automatic email, no need to reply') . '.</p>
  <br>
  <p>' . __('Sincerely') . ',<br>' . __('Administration') . ' <a href="' . site('url') . '" target="_blank">' . site('name') . '</a></p>
';

return [
	'subject' => __('Reset password'),
	'message' => $message
];
