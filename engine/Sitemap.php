<?php

namespace Engine;

use Engine\Database\Statement;

class Sitemap {
	public static function update($custom_pages = [], $is_only_custom_pages = false) {
		$pages = [];

		if(!$is_only_custom_pages) {
			$sql = '
				SELECT
					*
				FROM
					{page} t_page
				INNER JOIN
					{page_translation} t_page_translation
				ON
					t_page.id = t_page_translation.page_id
				WHERE
					date_publish <= NOW()
					AND is_enabled IS true
			';
			$db_pages = new Statement($sql);
			$db_pages = $db_pages->execute()->fetchAll();
			$pages = array_merge($db_pages, $pages);
		}

		$pages = array_merge($pages, $custom_pages);

		$path = ROOT_DIR . '/sitemap.xml';
		$sitemap = self::format($pages);

		if(file_put_contents($path, $sitemap, LOCK_EX)) {
			Log::write('Sitmap updated by user ID: ' . User::get()->id . ' from IP: ' . Request::$ip, 'sitemap');

			Hook::run('sitemap_update');

			return true;
		}

		return false;
	}

	private static function format($pages) {
		$output = '<?xml version="1.0" encoding="UTF-8"?>';
		$output .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

		foreach($pages as $page) {
			if(is_array($page)) {
				$page = json_decode(json_encode($page));
			}

			if($page->language === Setting::get('main')->language) {
				$language = '';
			} else {
				$language = $page->language . '/';
			}

			if($page->url === 'home') {
				if(!empty($language)) $language = '/' . trim($language ?? '', '/');
				$url = Request::$base . $language;
				$priority = '1.00';
			} else {
				$url = Request::$base . '/' . $language . $page->url;
				$priority = '0.80';
			}

			$date = $page->date_edited ?? $page->date_created;
			$date = format_date($date, 'c');

			$output .= '<url><loc>' . $url . '</loc><lastmod>' . $date . '</lastmod><priority>' . $priority . '</priority></url>';
		}

		$output .= '</urlset>';

		return $output;
	}
}
