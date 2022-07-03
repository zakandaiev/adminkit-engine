<?php
	foreach($notifications_full as $notification) {
		echo getNotificationHTML($notification, $user);
	}
