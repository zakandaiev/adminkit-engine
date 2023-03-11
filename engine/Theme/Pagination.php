<?php

namespace Engine\Theme;

use Engine\Request;
use Engine\Setting;

class Pagination {
	public $uri_key;
	public $uri;
	public $limit;
	public $total_rows;
	public $total_pages;
	public $current_page;
	public $offset;

	private static $instance;

	public static function getInstance() {
		if(!self::$instance instanceof self) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	public function __construct($total_rows, $options = []) {
		$this->uri_key = $options['uri_key'] ?? PAGINATION['uri_key'];
		$this->uri = $this->handleUri();
		$this->limit = $options['limit'] ?? Setting::get('site')->pagination_limit;
		$this->limit = intval($this->limit);
		$this->total_rows = intval($total_rows);
		$this->total_pages = $this->countPages();
		$this->current_page = $this->currentPage();
		$this->offset = ($this->current_page - 1) * $this->limit;

		self::$instance = $this;
	}

	private function handleUri() {
		$uri = explode('?', Request::$uri, 2);
		$uri_handle = $uri[0] . '?';

		if(isset($uri[1]) && !empty($uri[1])) {
			$params = explode('&', $uri[1]);

			foreach($params as $param) {
				if(!preg_match('#' . $this->uri_key . '=#', $param)) $uri_handle .= $param.'&';
			}
		}

		$uri_handle .= $this->uri_key . '=';

		return html($uri_handle);
	}

	private function countPages() {
		return ceil($this->total_rows / $this->limit) ?? 1;
	}

	private function currentPage() {
		$page = Request::get($this->uri_key);

		if(isset($page) && !empty($page) && is_numeric($page)) {
			$page = intval($page);
		} else {
			$page = 1;
		}

		if($page < 1) $page = 1;
		if($page > $this->total_pages && $this->total_pages > 0) $page = $this->total_pages;

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

		$url = Request::$base . $this->uri;

		$current = '<span class="pagination__item pagination__item_active">' . $this->current_page . '</span>';

		if($this->current_page > 1) {
			$num = $this->current_page - 1;
			$prev = '<a rel="prev" href="' . $url . $num . '" class="pagination__item">' . __('Previous') . '</a>';
		}

		if($this->current_page < $this->total_pages) {
			$num = $this->current_page + 1;
			$next = '<a rel="next" href="' . $url . $num . '" class="pagination__item">' . __('Next') . '</a>';
		}

		if($this->current_page - 1 > 0) {
			$num = $this->current_page - 1;
			$page1prev = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if($this->current_page + 1 <= $this->total_pages) {
			$num = $this->current_page + 1;
			$page1next = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if($this->current_page - 2 > 0) {
			$num = $this->current_page - 2;
			$page2prev = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if($this->current_page + 2 <= $this->total_pages) {
			$num = $this->current_page + 2;
			$page2next = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		if($this->current_page > 4) {
			$num = 1;
			$first = '<a href="' . $url . $num . '" class="pagination__item">' . $num . '</a><span class="pagination__item">...</span>';
		}

		if($this->current_page <= $this->total_pages - 4) {
			$num = $this->total_pages;
			$last = '<span class="pagination__item">...</span><a href="' . $url . $num . '" class="pagination__item">' . $num . '</a>';
		}

		return '<nav class="pagination">' . $prev.$first.$page2prev.$page1prev.$current.$page1next.$page2next.$last.$next . '</nav>';
	}
}
