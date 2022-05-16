<?php

namespace Engine;

class Sitemap {
	public static function write($pages = []) {
		if(empty($pages)) {
			return false;
		}

		$path = ROOT_DIR . '/sitemap.xml';

		return file_put_contents($path, self::format($pages), LOCK_EX);
	}

	private static function format($pages) {
		$output = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
		$output .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' . PHP_EOL;

		foreach($pages as $page) {
			if(is_array($page)) {
				$page = json_decode(json_encode($page));
			}

			$date = $page->date_edited ?? $page->date_created;

			if($page->url === 'home') {
				$output .= '<url><loc>' . Request::$base . '</loc><lastmod>' . format_date($date, 'c') . '</lastmod><priority>1.00</priority></url>' . PHP_EOL;
			} else {
				$output .= '<url><loc>' . Request::$base . '/' . $page->url . '</loc><lastmod>' . format_date($date, 'c') . '</lastmod><priority>0.80</priority></url>' . PHP_EOL;
			}
		}

		$output .= '</urlset>';

		return $output;
	}
}
