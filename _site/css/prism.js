var _self = (typeof window!== 'undefined') ? window // if in browser :( (typeof WorkerGlobalScope!== 'undefined' && self instanceof WorkerGlobalScope) ? self // if in worker :{}// if in node js );var Prism = (function(){// Private helper vars var lang = /\blang(?:uage)?-([\w-]+)\b/i;var uniqueId = 0;var _ = _self.Prism ={manual:_self.Prism && _self.Prism.manual,disableWorkerMessageHandler:_self.Prism && _self.Prism.disableWorkerMessageHandler,util:{encode:function (tokens){if (tokens instanceof Token){return new Token(tokens.type,_.util.encode(tokens.content),tokens.alias)}else if (_.util.type(tokens) === 'Array'){return tokens.map(_.util.encode)}else{return tokens.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\u00a0/g,' ')}},type:function (o){return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1]},objId:function (obj){if (!obj['__id']){Object.defineProperty(obj,'__id',{value:++uniqueId})}return obj['__id']},// Deep clone a language definition (e.g. to extend it) clone:function (o,visited){var type = _.util.type(o);visited = visited ||{};switch (type){case 'Object':if (visited[_.util.objId(o)]){return visited[_.util.objId(o)]}var clone ={};visited[_.util.objId(o)] = clone;for (var key in o){if (o.hasOwnProperty(key)){clone[key] = _.util.clone(o[key],visited)}}return clone;case 'Array':if (visited[_.util.objId(o)]){return visited[_.util.objId(o)]}var clone = [];visited[_.util.objId(o)] = clone;o.forEach(function (v,i){clone[i] = _.util.clone(v,visited)});return clone}return o}},languages:{extend:function (id,redef){var lang = _.util.clone(_.languages[id]);for (var key in redef){lang[key] = redef[key]}return lang},insertBefore:function (inside,before,insert,root){root = root || _.languages;var grammar = root[inside];if (arguments.length == 2){insert = arguments[1];for (var newToken in insert){if (insert.hasOwnProperty(newToken)){grammar[newToken] = insert[newToken]}}return grammar}var ret ={};for (var token in grammar){if (grammar.hasOwnProperty(token)){if (token == before){for (var newToken in insert){if (insert.hasOwnProperty(newToken)){ret[newToken] = insert[newToken]}}}ret[token] = grammar[token]}}var old = root[inside];root[inside] = ret;// Update references in other language definitions _.languages.DFS(_.languages,function(key,value){if (value === old && key!= inside){this[key] = ret}});return ret},// Traverse a language definition with Depth First Search DFS:function(o,callback,type,visited){visited = visited ||{};for (var i in o){if (o.hasOwnProperty(i)){callback.call(o,i,o[i],type || i);if (_.util.type(o[i]) === 'Object' &&!visited[_.util.objId(o[i])]){visited[_.util.objId(o[i])] = true;_.languages.DFS(o[i],callback,null,visited)}else if (_.util.type(o[i]) === 'Array' &&!visited[_.util.objId(o[i])]){visited[_.util.objId(o[i])] = true;_.languages.DFS(o[i],callback,i,visited)}}}}},plugins:{},highlightAll:function(async,callback){_.highlightAllUnder(document,async,callback)},highlightAllUnder:function(container,async,callback){var env ={callback:callback,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};_.hooks.run("before-highlightall",env);var elements = env.elements || container.querySelectorAll(env.selector);for (var i=0,element;element = elements[i++];){_.highlightElement(element,async === true,env.callback)}},highlightElement:function(element,async,callback){// Find language var language,grammar,parent = element;while (parent &&!lang.test(parent.className)){parent = parent.parentNode}if (parent){language = (parent.className.match(lang) || [,''])[1].toLowerCase();grammar = _.languages[language]}// Set language on the element,if not present element.className = element.className.replace(lang,'').replace(/\s+/g,' ')+' language-'+language;if (element.parentNode){// Set language on the parent,for styling parent = element.parentNode;if (/pre/i.test(parent.nodeName)){parent.className = parent.className.replace(lang,'').replace(/\s+/g,' ')+' language-'+language}}var code = element.textContent;var env ={element:element,language:language,grammar:grammar,code:code};_.hooks.run('before-sanity-check',env);if (!env.code ||!env.grammar){if (env.code){_.hooks.run('before-highlight',env);env.element.textContent = env.code;_.hooks.run('after-highlight',env)}_.hooks.run('complete',env);return}_.hooks.run('before-highlight',env);if (async && _self.Worker){var worker = new Worker(_.filename);worker.onmessage = function(evt){env.highlightedCode = evt.data;_.hooks.run('before-insert',env);env.element.innerHTML = env.highlightedCode;_.hooks.run('after-highlight',env);_.hooks.run('complete',env);callback && callback.call(env.element)};worker.postMessage(JSON.stringify({language:env.language,code:env.code,immediateClose:true}))}else{env.highlightedCode = _.highlight(env.code,env.grammar,env.language);_.hooks.run('before-insert',env);env.element.innerHTML = env.highlightedCode;_.hooks.run('after-highlight',env);_.hooks.run('complete',env);callback && callback.call(element)}},highlight:function (text,grammar,language){var env ={code:text,grammar:grammar,language:language};_.hooks.run('before-tokenize',env);env.tokens = _.tokenize(env.code,env.grammar);_.hooks.run('after-tokenize',env);return Token.stringify(_.util.encode(env.tokens),env.language)},matchGrammar:function (text,strarr,grammar,index,startPos,oneshot,target){var Token = _.Token;for (var token in grammar){if(!grammar.hasOwnProperty(token) ||!grammar[token]){continue}if (token == target){return}var patterns = grammar[token];patterns = (_.util.type(patterns) === "Array") ? patterns :[patterns];for (var j = 0;j < patterns.length;++j){var pattern = patterns[j],inside = pattern.inside,lookbehind =!!pattern.lookbehind,greedy =!!pattern.greedy,lookbehindLength = 0,alias = pattern.alias;if (greedy &&!pattern.pattern.global){// Without the global flag,lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					if (greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						var match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						// If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						if (strarr[i] instanceof Token) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					} else {
						pattern.lastIndex = 0;

						var match = pattern.exec(str),
							delNum = 1;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1] ? match[1].length : 0;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g,'&quot;')+'"'}).join(' ');return '<'+env.tag+' class="'+env.classes.join(' ')+'"'+(attributes ? ' '+attributes :'')+'>'+env.content+'</'+env.tag+'>'};if (!_self.document){if (!_self.addEventListener){// in Node.js return _self.Prism}if (!_.disableWorkerMessageHandler){// In worker _self.addEventListener('message',function (evt){var message = JSON.parse(evt.data),lang = message.language,code = message.code,immediateClose = message.immediateClose;_self.postMessage(_.highlight(code,_.languages[lang],lang));if (immediateClose){_self.close()}},false)}return _self.Prism}//Get current script and highlight var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();if (script){_.filename = script.src;if (!_.manual &&!script.hasAttribute('data-manual')){if(document.readyState!== "loading"){if (window.requestAnimationFrame){window.requestAnimationFrame(_.highlightAll)}else{window.setTimeout(_.highlightAll,16)}}else{document.addEventListener('DOMContentLoaded',_.highlightAll)}}}return _self.Prism})();if (typeof module!== 'undefined' && module.exports){module.exports = Prism}// hack for components to work correctly in node.js if (typeof global!== 'undefined'){global.Prism = Prism};Prism.languages.haskell={'comment':{pattern:/(^|[^-!#$%*+=?&@|~.:<>^\\\/])(?:--[^-!#$%*+=?&@|~.:<>^\\\/].*|{-[\s\S]*?-})/m,lookbehind:true},'char':/'(?:[^\\']|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+))'/,
	'string': {
		pattern: /"(?:[^\\"]|\\(?:[abfnrtv\\"'&]|\^[A-Z@[\]^_]|NUL|SOH|STX|ETX|EOT|ENQ|ACK|BEL|BS|HT|LF|VT|FF|CR|SO|SI|DLE|DC1|DC2|DC3|DC4|NAK|SYN|ETB|CAN|EM|SUB|ESC|FS|GS|RS|US|SP|DEL|\d+|o[0-7]+|x[0-9a-fA-F]+)|\\\s+\\)*"/,
		greedy: true
	},
	'keyword' : /\b(?:case|class|data|deriving|do|else|if|in|infixl|infixr|instance|let|module|newtype|of|primitive|then|type|where)\b/,
	'import_statement' : {
		// The imported or hidden names are not included in this import
		// statement. This is because we want to highlight those exactly like
		// we do for the names in the program.
		pattern: /((?:\r?\n|\r|^)\s*)import\s+(?:qualified\s+)?(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*(?:\s+as\s+(?:[A-Z][_a-zA-Z0-9']*)(?:\.[A-Z][\w']*)*)?(?:\s+hiding\b)?/m,
		lookbehind: true,
		inside: {
			'keyword': /\b(?:import|qualified|as|hiding)\b/
		}
	},
	// These are builtin variables only. Constructors are highlighted later as a constant.
	'builtin': /\b(?:abs|acos|acosh|all|and|any|appendFile|approxRational|asTypeOf|asin|asinh|atan|atan2|atanh|basicIORun|break|catch|ceiling|chr|compare|concat|concatMap|const|cos|cosh|curry|cycle|decodeFloat|denominator|digitToInt|div|divMod|drop|dropWhile|either|elem|encodeFloat|enumFrom|enumFromThen|enumFromThenTo|enumFromTo|error|even|exp|exponent|fail|filter|flip|floatDigits|floatRadix|floatRange|floor|fmap|foldl|foldl1|foldr|foldr1|fromDouble|fromEnum|fromInt|fromInteger|fromIntegral|fromRational|fst|gcd|getChar|getContents|getLine|group|head|id|inRange|index|init|intToDigit|interact|ioError|isAlpha|isAlphaNum|isAscii|isControl|isDenormalized|isDigit|isHexDigit|isIEEE|isInfinite|isLower|isNaN|isNegativeZero|isOctDigit|isPrint|isSpace|isUpper|iterate|last|lcm|length|lex|lexDigits|lexLitChar|lines|log|logBase|lookup|map|mapM|mapM_|max|maxBound|maximum|maybe|min|minBound|minimum|mod|negate|not|notElem|null|numerator|odd|or|ord|otherwise|pack|pi|pred|primExitWith|print|product|properFraction|putChar|putStr|putStrLn|quot|quotRem|range|rangeSize|read|readDec|readFile|readFloat|readHex|readIO|readInt|readList|readLitChar|readLn|readOct|readParen|readSigned|reads|readsPrec|realToFrac|recip|rem|repeat|replicate|return|reverse|round|scaleFloat|scanl|scanl1|scanr|scanr1|seq|sequence|sequence_|show|showChar|showInt|showList|showLitChar|showParen|showSigned|showString|shows|showsPrec|significand|signum|sin|sinh|snd|sort|span|splitAt|sqrt|subtract|succ|sum|tail|take|takeWhile|tan|tanh|threadToIOResult|toEnum|toInt|toInteger|toLower|toRational|toUpper|truncate|uncurry|undefined|unlines|until|unwords|unzip|unzip3|userError|words|writeFile|zip|zip3|zipWith|zipWith3)\b/,
	// decimal integers and floating point numbers | octal integers | hexadecimal integers
	'number' : /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0o[0-7]+|0x[0-9a-f]+)\b/i,
	// Most of this is needed because of the meaning of a single '.'.
	// If it stands alone freely, it is the function composition.
	// It may also be a separator between a module name and an identifier => no
	// operator. If it comes together with other special characters it is an
	// operator too.
	'operator' : /\s\.\s|[-!#$%*+=?&@|~.:<>^\\\/]*\.[-!#$%*+=?&@|~.:<>^\\\/]+|[-!#$%*+=?&@|~.:<>^\\\/]+\.[-!#$%*+=?&@|~.:<>^\\\/]*|[-!#$%*+=?&@|~:<>^\\\/]+|`([A-Z][\w']*\.)*[_a-z][\w']*`/,
	// In Haskell, nearly everything is a variable, do not highlight these.
	'hvariable': /\b(?:[A-Z][\w']*\.)*[_a-z][\w']*\b/,
	'constant': /\b(?:[A-Z][\w']*\.)*[A-Z][\w']*\b/,
	'punctuation' : /[{}[\];(),.:]/
};

(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	/**
	 * Plugin name which is used as a class name for <pre> which is activating the plugin
	 * @type {String}
	 */
	var PLUGIN_NAME = 'line-numbers';
	
	/**
	 * Regular expression used for determining line breaks
	 * @type {RegExp}
	 */
	var NEW_LINE_EXP = /\n(?!$)/g;

	/**
	 * Resizes line numbers spans according to height of line of code
	 * @param {Element} element <pre> element
	 */
	var _resizeElement = function (element) {
		var codeStyles = getStyles(element);
		var whiteSpace = codeStyles['white-space'];

		if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
			var codeElement = element.querySelector('code');
			var lineNumbersWrapper = element.querySelector('.line-numbers-rows');
			var lineNumberSizer = element.querySelector('.line-numbers-sizer');
			var codeLines = codeElement.textContent.split(NEW_LINE_EXP);

			if (!lineNumberSizer) {
				lineNumberSizer = document.createElement('span');
				lineNumberSizer.className = 'line-numbers-sizer';

				codeElement.appendChild(lineNumberSizer);
			}

			lineNumberSizer.style.display = 'block';

			codeLines.forEach(function (line, lineNumber) {
				lineNumberSizer.textContent = line || '\n';
				var lineSize = lineNumberSizer.getBoundingClientRect().height;
				lineNumbersWrapper.children[lineNumber].style.height = lineSize + 'px';
			});

			lineNumberSizer.textContent = '';
			lineNumberSizer.style.display = 'none';
		}
	};

	/**
	 * Returns style declarations for the element
	 * @param {Element} element
	 */
	var getStyles = function (element) {
		if (!element) {
			return null;
		}

		return window.getComputedStyle ? getComputedStyle(element) : (element.currentStyle || null);
	};

	window.addEventListener('resize', function () {
		Array.prototype.forEach.call(document.querySelectorAll('pre.' + PLUGIN_NAME), _resizeElement);
	});

	Prism.hooks.add('complete', function (env) {
		if (!env.code) {
			return;
		}

		// works only for <code> wrapped inside <pre> (not inline)
		var pre = env.element.parentNode;
		var clsReg = /\s*\bline-numbers\b\s*/;
		if (
			!pre || !/pre/i.test(pre.nodeName) ||
			// Abort only if nor the <pre> nor the <code> have the class
			(!clsReg.test(pre.className) && !clsReg.test(env.element.className))
		) {
			return;
		}

		if (env.element.querySelector('.line-numbers-rows')) {
			// Abort if line numbers already exists
			return;
		}

		if (clsReg.test(env.element.className)) {
			// Remove the class 'line-numbers' from the <code>
			env.element.className = env.element.className.replace(clsReg, ' ');
		}
		if (!clsReg.test(pre.className)) {
			// Add the class 'line-numbers' to the <pre>
			pre.className += ' line-numbers';
		}

		var match = env.code.match(NEW_LINE_EXP);
		var linesNum = match ? match.length + 1 : 1;
		var lineNumbersWrapper;

		var lines = new Array(linesNum + 1);
		lines = lines.join('<span></span>');

		lineNumbersWrapper = document.createElement('span');
		lineNumbersWrapper.setAttribute('aria-hidden', 'true');
		lineNumbersWrapper.className = 'line-numbers-rows';
		lineNumbersWrapper.innerHTML = lines;

		if (pre.hasAttribute('data-start')) {
			pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
		}

		env.element.appendChild(lineNumbersWrapper);

		_resizeElement(pre);

		Prism.hooks.run('line-numbers', env);
	});

	Prism.hooks.add('line-numbers', function (env) {
		env.plugins = env.plugins || {};
		env.plugins.lineNumbers = true;
	});
	
	/**
	 * Global exports
	 */
	Prism.plugins.lineNumbers = {
		/**
		 * Get node for provided line number
		 * @param {Element} element pre element
		 * @param {Number} number line number
		 * @return {Element|undefined}
		 */
		getLine: function (element, number) {
			if (element.tagName !== 'PRE' || !element.classList.contains(PLUGIN_NAME)) {
				return;
			}

			var lineNumberRows = element.querySelector('.line-numbers-rows');
			var lineNumberStart = parseInt(element.getAttribute('data-start'), 10) || 1;
			var lineNumberEnd = lineNumberStart + (lineNumberRows.children.length - 1);

			if (number < lineNumberStart) {
				number = lineNumberStart;
			}
			if (number > lineNumberEnd) {
				number = lineNumberEnd;
			}

			var lineIndex = number - lineNumberStart;

			return lineNumberRows.children[lineIndex];
		}
	};

}());