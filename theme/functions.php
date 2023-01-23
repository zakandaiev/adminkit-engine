<?php

Asset::css('css/bootstrap.min');
Asset::css('css/font-awesome.min');
Asset::css('css/style');
Asset::css('css/form');

Asset::js('js/jquery.min', 'defer');
Asset::js('js/bootstrap.min', 'defer');
Asset::js('js/jquery.stellar.min', 'defer');
Asset::js('js/main', 'defer');
Asset::js('js/form', 'defer');

Asset::optimization('js', 'defer');

############################# POSTS #############################
function getPosts($posts, $options) {
	$output = '';

	if(!is_array($posts) || empty($posts) || !isset($options['type'])) {
		return $output;
	}

	$posts_with_categories = [];
	foreach($posts as $post) {
		$post->categories = PageModel::getInstance()->getPageCategories($post->id);
		$posts_with_categories[] = $post;
	}

	$count = 0;
	foreach($posts_with_categories as $post) {
		$count++;

		if(isset($options['offset']) && $count - 1 < $options['offset']) {
			continue;
		}

		if(isset($options['limit']) && isset($options['offset']) && $count > ($options['limit'] + $options['offset'])) {
			break;
		}

		if(isset($options['limit']) && !isset($options['offset']) && $count > $options['limit']) {
			break;
		}

		if(isset($options['wrap'])) {
			$output .= '<div class="' . $options['wrap'] . '">';
		}

		$output .= getPostHTML($post, $options['type']);

		if(isset($options['wrap'])) {
			$output .= '</div>';
		}
	}

	return $output;
}

function getPostHTML($post, $type) {
	$html = '';

	if(!isset($type)) {
		return $html;
	}

	$class_post = '';
	$class_title = '';

	$meta = '<ul class="post-meta">';
	$meta .= '<li><a href="' . site('url_language') . '/author/' . $post->author . '">' . $post->author_name . '</a></li>';
	$meta .= '<li>' . date_when($post->date_publish) . '</li>';
	$meta .= '</ul>';

	$excerpt = '';

	switch(intval($type)) {
		case 1: {
			$class_post = 'post-thumb';
			$class_title = 'title-lg';
			break;
		}
		case 2: {
			// as is set
			break;
		}
		case 3: {
			$class_post = 'post-sm';
			$class_title = 'title-sm';
			break;
		}
		case 4: {
			$class_post = 'post-widget';
			$meta = '';
			break;
		}
		case 5: {
			$class_post = 'post-row';
			if(!empty($post->excerpt)) {
				$excerpt = '<p>' . $post->excerpt . '...</p>';
			}
			break;
		}
	}

	$html .= '<div class="post ' . $class_post . '">';
	$html .= '<a class="post-img" href="' . site('url_language') . '/' . $post->url . '"><img src="' . site('url') . '/' . $post->image . '" alt=""></a>';
	$html .= '<div class="post-body">';
	if(!empty($post->categories)) {
		$html .= '<div class="post-category">';
		foreach($post->categories as $category) {
			$html .= '<a href="' . site('url_language') . '/' . $category->url . '">' . $category->title . '</a> ';
		}
		$html .= '</div>';
	}
	$html .= '<h3 class="post-title ' . $class_title . '"><a href="' . site('url_language') . '/' . $post->url . '">' . $post->title . '</a></h3>';
	$html .= $meta;
	$html .= $excerpt;
	$html .= '</div>';
	$html .= '</div>';

	return $html;
}

############################# COMMENTS #############################
function comments($comments) {
	$output = '';

	foreach($comments as $item) {
		$class = '';
		if(!empty($item['children'])) {
			$class = 'media-author';
		}

		$output .= '<div class="media ' . $class . '">';
		$output .= '<div class="media-left">';
		$output .= '<img class="media-object" src="' . site('url') . '/' . placeholder_avatar($item['author_avatar']) . '" alt="' . html($item['author_name']) . '">';
		$output .= '</div>';
		$output .= '<div class="media-body">';
		$output .= '<div class="media-heading">';
		$output .= '<h4>' . html($item['author_name']) . '</h4>';
		$output .= '<span class="time">' . date_when($item['date_created']) . '</span>';
		$output .= '</div>';
		$output .= '<p>' . html($item['message']) . '</p>';
		$output .= '<button type="button" data-coment-reply="' . $item['id'] . '" class="reply">' . __('Reply') . '</button>';

		if(!empty($item['children'])) {
			$output .= comments($item['children']);
		}

		$output .= '</div>';
		$output .= '</div>';
	}

	return $output;
}
