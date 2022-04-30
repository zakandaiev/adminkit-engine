<nav class="navbar navbar-expand navbar-light navbar-bg">
	<a class="sidebar-toggle js-sidebar-toggle">
		<i class="hamburger align-self-center"></i>
	</a>

	<div class="navbar-collapse collapse">
		<ul class="navbar-nav navbar-align">
			<?php Theme::widget('navbar-colormode'); ?>
			<?php Theme::widget('navbar-notification'); ?>
			<?php Theme::widget('navbar-lang'); ?>
			<?php Theme::widget('navbar-profile'); ?>
		</ul>
	</div>
</nav>
