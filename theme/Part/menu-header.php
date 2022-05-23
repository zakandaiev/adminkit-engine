<?php

if(!function_exists('menu')) {
	function menu($menu) {
		$output = '';

		foreach($menu as $item) {
			$has_url = 'href="/'. $item->url . '"';
			$has_dropdown = '';
			if(!empty($item->children)) {
				$has_url = '';
				$has_dropdown = 'class="has-dropdown"';
			}

			$output .= '<li ' . $has_dropdown . '><a ' . $has_url . '>' . $item->name . '</a>';

			if(!empty($item->children)) {
				$output .= '<div class="dropdown">';
				$output .= '<div class="dropdown-body">';
				$output .= '<ul class="dropdown-list">';
				$output .= '<div class="dropdown">';
				$output .= menu($item->children);
				$output .= '</ul>';
				$output .= '</div>';
				$output .= '</div>';
			}

			$output .= '</li>';
		}

		return $output;
	}
}

if(!function_exists('aside')) {
	function aside($menu) {
		$output = '';

		foreach($menu as $item) {
			$has_url = 'href="/'. $item->url . '"';
			$has_dropdown = '';
			if(!empty($item->children)) {
				$has_url = '';
				$has_dropdown = 'class="has-dropdown"';
			}

			$output .= '<li ' . $has_dropdown . '><a ' . $has_url . '>' . $item->name . '</a>';

			if(!empty($item->children)) {
				$output .= '<ul class="dropdown">';
				$output .= aside($item->children);
				$output .= '</ul>';
			}

			$output .= '</li>';
		}

		return $output;
	}
}

?>

<?php if(!empty($menu)): ?>
	<?php if(@$aside): ?>
		<ul class="nav-aside-menu">
			<?= aside($menu); ?>
		</ul>
	<?php else: ?>
		<div id="nav-bottom">
			<div class="container">
				<ul class="nav-menu">
					<?= menu($menu); ?>
				</ul>
			</div>
		</div>
	<?php endif; ?>
<?php endif; ?>