<?php

$prev = null;
$next = null;
$page1prev = null;
$page1next = null;
$page2prev = null;
$page2next = null;
$first = null;
$last = null;

$url = site('url') . $pagination->uri;

$current = '
	<li class="page-item active">
		<span class="page-link">' . $pagination->current_page . '</span>
	</li>
';

if($pagination->current_page > 1) {
	$num = $pagination->current_page - 1;
	$prev = '
		<li class="page-item">
			<a rel="prev" href="' . $url . $num . '" class="page-link">' . __('Previous') . '</a>
		</li>
	';
}

if($pagination->current_page < $pagination->total_pages) {
	$num = $pagination->current_page + 1;
	$next = '
		<li class="page-item">
			<a rel="next" href="' . $url . $num . '" class="page-link">' . __('Next') . '</a>
		</li>
	';
}

if($pagination->current_page - 1 > 0) {
	$num = $pagination->current_page - 1;
	$page1prev = '
		<li class="page-item">
			<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
		</li>
	';
}

if($pagination->current_page + 1 <= $pagination->total_pages) {
	$num = $pagination->current_page + 1;
	$page1next = '
		<li class="page-item">
			<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
		</li>
	';
}

if($pagination->current_page - 2 > 0) {
	$num = $pagination->current_page - 2;
	$page2prev = '
		<li class="page-item">
			<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
		</li>
	';
}

if($pagination->current_page + 2 <= $pagination->total_pages) {
	$num = $pagination->current_page + 2;
	$page2next = '
		<li class="page-item">
			<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
		</li>
	';
}

if($pagination->current_page > 4) {
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

if($pagination->current_page <= $pagination->total_pages - 4) {
	$num = $pagination->total_pages;
	$last = '
		<li class="page-item">
			<span class="page-link">...</span>
		</li>
		<li class="page-item">
			<a href="' . $url . $num . '" class="page-link">' . $num . '</a>
		</li>
	';
}

?>

<?php if($pagination->total_pages > 1): ?>
	<ul class="pagination justify-content-end"><?= $prev.$first.$page2prev.$page1prev.$current.$page1next.$page2next.$last.$next ?></ul>
<?php endif; ?>
