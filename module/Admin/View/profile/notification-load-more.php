<?php
	foreach($notifications as $notification) {
		echo getNotificationHTML($notification, $user);
	}
