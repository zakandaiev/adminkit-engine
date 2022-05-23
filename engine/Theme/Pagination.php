<?php

namespace Engine\Theme;

use Engine\Define;
use Engine\Request;
use Engine\Setting;

class Pagination {
	public static $uri_key;
	public static $uri;
	public static $limit;
	public static $total_rows;
	public static $total_pages;
	public static $current_page;
	public static $offset;

	public static function initialize($total_rows) {
		self::$uri_key = strval(Define::PAGINATION_URI_KEY);
		self::$uri = self::handleUri();
		self::$limit = intval(Setting::get('site')->pagination_limit);
		self::$total_rows = intval($total_rows);
		self::$total_pages = self::countPages();
		self::$current_page = self::currentPage();
		self::$offset = (self::$current_page - 1) * self::$limit;
	}

	public function handleUri() {
		$uri = explode('?', Request::$uri, 2);
		$uri_handle = $uri[0] . '?';

		if(isset($uri[1]) && !empty($uri[1])) {
			$params = explode('&', $uri[1]);

			foreach($params as $param) {
				if(!preg_match('#' . self::$uri_key . '=#', $param)) $uri_handle .= $param.'&';
			}
		}

		$uri_handle .= self::$uri_key . '=';

		return hc($uri_handle);
	}

	public function countPages() {
		return ceil(self::$total_rows / self::$limit) ?? 1;
	}

	public function currentPage() {
		$page = Request::get(self::$uri_key);

		if(isset($page) && !empty($page) && is_numeric($page)) {
			$page = intval($page);
		} else {
			$page = 1;
		}

		if($page < 1) $page = 1;
		if($page > self::$total_pages && self::$total_pages > 0) $page = self::$total_pages;

		return $page;
	}

	public function render() {
		$prev = null;
		$next = null;
		$page1prev = null;
		$page1next = null;
		$page2prev = null;
		$page2next = null;
		$first = null;
		$last = null;

		$url = Request::$base . self::$uri;

		$current = '<span class="pagination__item pagination__item_active">' . self::$current_page . '</span>';

		if(self::$current_page > 1) {
			$num = self::$current_page - 1;
			$prev = '<a href="' . $url . $num . '" class="pagination__item">' . __('Previous') . '</a>';
		}

		if(self::$current_page < self::$total_pages) {
			$num = self::$current_page + 1;
			$next = '<a href="' . $url . $num . '" class="pagination__item">' . __('Next') . '</a>';
		}

		if(self::$current_page - 1 > 0) {
			$num = self::$current_page - 1;
			$page1prev = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if(self::$current_page + 1 <= self::$total_pages) {
			$num = self::$current_page + 1;
			$page1next = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if(self::$current_page - 2 > 0) {
			$num = self::$current_page - 2;
			$page2prev = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if(self::$current_page + 2 <= self::$total_pages) {
			$num = self::$current_page + 2;
			$page2next = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if(self::$current_page > 4) {
			$num = 1;
			$first = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a><span class="pagination__item">...</span>';
		}

		if(self::$current_page <= self::$total_pages - 4) {
			$num = self::$total_pages;
			$last = '<span class="pagination__item">...</span><a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		return '<nav class="pagination">' . $prev.$first.$page2prev.$page1prev.$current.$page1next.$page2next.$last.$next . '</nav>';
	}
}
