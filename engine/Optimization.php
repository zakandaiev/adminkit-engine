<?php

namespace Engine;

class Optimization {
	private static $type;
	private static $files = [];
	private static $destination;

	public static function css($files, $destination) {
		self::$type = strtolower(__FUNCTION__);
		self::$files = $files;
		self::$destination = $destination;

		return self::minify();
	}

	public static function js($files, $destination) {
		self::$type = strtolower(__FUNCTION__);
		self::$files = $files;
		self::$destination = $destination;

		return self::minify();
	}

	public static function minify() {
		$output = '';

		if(empty(self::$files)) {
			return false;
		}

		foreach(self::$files as $file) {
			try {
				if(!self::validateFile($file)) {
					continue;
				}

				$content = file_get_contents($file);

				$output .= self::{'minify' . strtoupper(self::$type)}($content);
			}
			catch(\Exception $error) {
				throw new \Exception(sprintf('Error: %s', $error->getMessage()));
			}
		}

		return self::saveToFile($output);
	}

	private static function minifyJS($input) {
		$input = trim($input ?? '');

		if(empty($input)) {
			return $input;
		}

		return preg_replace(
			[
				# Remove comments
				/*
				'#\s*("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')\s*|\s*\/\*(?!\!|@cc_on)(?>[\s\S]*?\*\/)\s*|\s*(?<![\:\=])\/\/.*(?=[\n\r]|$)|^\s*|\s*$#',
				*/
				# Remove white-space(s) outside the string and regex
				'#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/)|\/(?!\/)[^\n\r]*?\/(?=[\s.,;]|[gimuy]|$))|\s*([!%&*\(\)\-=+\[\]\{\}|;:,.<>?\/])\s*#s',
				# Remove the last semicolon
				'#;+\}#',
				# Minify object attribute(s) except JSON attribute(s). From `{'foo':'bar'}` to `{foo:'bar'}`
				'#([\{,])([\'])(\d+|[a-z_][a-z0-9_]*)\2(?=\:)#i',
				# --ibid. From `foo['bar']` to `foo.bar`
				'#([a-z0-9_\)\]])\[([\'"])([a-z_][a-z0-9_]*)\2\]#i'
			],
			[
				# '$1',
				'$1$2',
				'}',
				'$1$3',
				'$1.$3'
			],
			$input
		);
	}

	private static function minifyCSS($input) {
		$input = trim($input ?? '');

		if(empty($input)) {
			return $input;
		}

		return preg_replace(
			[
				# Remove comment(s)
				'#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')|\/\*(?!\!)(?>.*?\*\/)|^\s*|\s*$#s',
				# Remove unused white-space(s)
				'#("(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\'|\/\*(?>.*?\*\/))|\s*+;\s*+(})\s*+|\s*+([*$~^|]?+=|[{};,>~]|\s(?![0-9\.])|!important\b)\s*+|([[(:])\s++|\s++([])])|\s++(:)\s*+(?!(?>[^{}"\']++|"(?:[^"\\\]++|\\\.)*+"|\'(?:[^\'\\\\]++|\\\.)*+\')*+{)|^\s++|\s++\z|(\s)\s+#si',
				# Replace `0(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)` with `0`
				'#(?<=[\s:])(0)(cm|em|ex|in|mm|pc|pt|px|vh|vw|%)#si',
				# Replace `:0 0 0 0` with `:0`
				'#:(0\s+0|0\s+0\s+0\s+0)(?=[;\}]|\!important)#i',
				# Replace `background-position:0` with `background-position:0 0`
				'#(background-position):0(?=[;\}])#si',
				# Replace `0.6` with `.6`, but only when preceded by `:`, `,`, `-` or a white-space
				'#(?<=[\s:,\-])0+\.(\d+)#s',
				# Minify string value
				'#(\/\*(?>.*?\*\/))|(?<!content\:)([\'"])([a-z_][a-z0-9\-_]*?)\2(?=[\s\{\}\];,])#si',
				'#(\/\*(?>.*?\*\/))|(\burl\()([\'"])([^\s]+?)\3(\))#si',
				# Minify HEX color code
				'#(?<=[\s:,\-]\#)([a-f0-6]+)\1([a-f0-6]+)\2([a-f0-6]+)\3#i',
				# Replace `(border|outline):none` with `(border|outline):0`
				'#(?<=[\{;])(border|outline):none(?=[;\}\!])#',
				# Remove empty selector(s)
				'#(\/\*(?>.*?\*\/))|(^|[\{\}])(?:[^\s\{\}]+)\{\}#s'
			],
			[
				'$1',
				'$1$2$3$4$5$6$7',
				'$1',
				':0',
				'$1:0 0',
				'.$1',
				'$1$3',
				'$1$2$4$5',
				'$1$2$3',
				'$1:0',
				'$1$2'
			],
			$input
		);
	}

	private static function validateFile($file_name) {
		if(file_extension($file_name) !== self::$type) {
			return false;
		}

		if(!file_exists($file_name)) {
			return false;
		}

		return true;
	}

	private static function saveToFile($content) {
		if(!file_exists(self::$destination)) {
			mkdir($path, 0755, true);
		}

		$file_name = '_o' . Hash::token(16);
		$file_extenstion = self::$type;

		$path = self::$destination . '/' . $file_name . '.' . $file_extenstion;

		file_put_contents($path, $content, LOCK_EX);

		$path_url = str_replace(ROOT_DIR, Path::url(), $path);
		$log = sprintf('%s assets optimized to %s', strtoupper($file_extenstion), $path_url);

		Log::write($log, 'optimization');

		Hook::run('optimization', $file_extenstion);
		Hook::run('optimization_' . $file_extenstion);

		return $file_name;
	}
}
