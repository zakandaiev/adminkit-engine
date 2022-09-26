<?php

namespace Module\Admin\Model;

use Engine\Database\Statement;

class Contact extends \Engine\Model {
	public function countUnreadContacts() {
		$sql = 'SELECT count(*) FROM {contact} WHERE is_read IS false';

		$count = new Statement($sql);

		return $count->execute()->fetchColumn();
	}

	public function getContacts() {
		$sql = '
			SELECT
				*
			FROM
				{contact}
			ORDER BY
				date_created DESC
		';

		$contacts = new Statement($sql);

		$contacts = $contacts->filter('Contact')->paginate()->execute()->fetchAll();

		return $contacts;
	}
}
