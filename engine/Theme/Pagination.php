<?php

namespace Engine\Theme;

use Engine\Request;
use Engine\Setting;

class Pagination {
	public $uri_key;
	public $uri;
	public $per_page;
	public $total_rows;
	public $total_pages;
	public $current_page;
	public $offset;

	public function __construct($total_rows, $uri_key = 'page') {
		$this->uri_key = strval($uri_key);
		$this->uri = $this->handleUri();
		$this->per_page = intval(site('pagination_limit'));
		$this->total_rows = intval($total_rows);
		$this->total_pages = $this->countPages();
		$this->current_page = $this->currentPage();
		$this->offset = ($this->current_page - 1) * $this->per_page;
	}

	public function handleUri() {
		$uri = explode('?', Request::$uri, 2);
		$uri_handle = $uri[0] . '?';

		if(isset($uri[1]) && !empty($uri[1])) {
			$params = explode('&', $uri[1]);

			foreach($params as $param) {
				if(!preg_match('#' . $this->uri_key . '=#', $param)) $uri_handle .= $param.'&';
			}
		}

		$uri_handle .= $this->uri_key . '=';

		return hc($uri_handle);
	}

	public function countPages() {
		return ceil($this->total_rows / $this->per_page) ?? 1;
	}

	public function currentPage() {
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

		$current = '
			<li class="page-item active">
				<span class="page-link">' . $this->current_page . '</span>
			</li>
		';

		if($this->current_page > 1) {
			$num = $this->current_page - 1;
			$prev = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">Previous</a>
				</li>
			';
		}

		if($this->current_page < $this->total_pages) {
			$num = $this->current_page + 1;
			$next = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">Next</a>
				</li>
			';
		}

		if($this->current_page - 1 > 0) {
			$num = $this->current_page - 1;
			$page1prev = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
			';
		}

		if($this->current_page + 1 <= $this->total_pages) {
			$num = $this->current_page + 1;
			$page1next = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
			';
		}

		if($this->current_page - 2 > 0) {
			$num = $this->current_page - 2;
			$page2prev = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
			';
		}

		if($this->current_page + 2 <= $this->total_pages) {
			$num = $this->current_page + 2;
			$page2next = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
			';
		}

		if($this->current_page > 4) {
			$num = 1;
			$first = '
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
				<li class="page-item">
					<span class="page-link">...</span>
				</li>
			';
		}

		if($this->current_page <= $this->total_pages - 4) {
			$num = $this->total_pages;
			$last = '
				<li class="page-item">
					<span class="page-link">...</span>
				</li>
				<li class="page-item">
					<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
				</li>
			';
		}

		return '<ul class="pagination">' . $prev.$first.$page2prev.$page1prev.$current.$page1next.$page2next.$last.$next . '</ul>';
	}
}
