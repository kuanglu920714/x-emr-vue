﻿/*
 * My97 DatePicker 4.8.5
 * License: http://www.my97.net/license.asp
 */
var $dp, WdatePicker;
(function () {
	var Config = {
		$langList: [{
				name: 'en',
				charset: 'UTF-8'
			},
			{
				name: 'zh-cn',
				charset: 'gb2312'
			},
			{
				name: 'zh-tw',
				charset: 'GBK'
			}
		],
		$skinList: [{
				name: 'default',
				charset: 'gb2312'
			},
			{
				name: 'whyGreen',
				charset: 'gb2312'
			},
			{
				name: 'blue',
				charset: 'gb2312'
			},
			{
				name: 'green',
				charset: 'gb2312'
			},
			{
				name: 'simple',
				charset: 'gb2312'
			},
			{
				name: 'ext',
				charset: 'gb2312'
			},
			{
				name: 'blueFresh',
				charset: 'gb2312'
			},
			{
				name: 'twoer',
				charset: 'gb2312'
			},
			{
				name: 'YcloudRed',
				charset: 'gb2312'
			},
			{
				name: 'thinkpap',
				charset: 'gb2312'
			}
		],
		$wdate: false,
		$crossFrame: false,
		$preLoad: false,
		$dpPath: '',
		doubleCalendar: false,
		enableKeyboard: true,
		enableInputMask: true,
		autoUpdateOnChanged: null,
		weekMethod: 'MSExcel',
		position: {},
		lang: 'auto',
		skin: 'default',
		dateFmt: 'yyyy年MM月dd日 HH时mm分',
		realDateFmt: 'yyyy-MM-dd',
		realTimeFmt: 'HH:mm:ss',
		realFullFmt: '%Date %Time',
		minDate: '0001-01-01 00:00:00',
		maxDate: '9999-12-31 23:59:59',
		minTime: '00:00:00',
		maxTime: '23:59:59',
		startDate: '',
		alwaysUseStartDate: false,
		yearOffset: 1911,
		firstDayOfWeek: 0,
		isShowWeek: false,
		highLineWeekDay: true,
		isShowClear: true,
		isShowToday: true,
		isShowOK: true,
		isShowOthers: true,
		readOnly: false,
		errDealMode: 0,
		autoPickDate: null,
		qsEnabled: true,
		autoShowQS: false,
		hmsMenuCfg: {
			H: [1, 6],
			m: [5, 6],
			s: [15, 4]
		},

		opposite: false,
		specialDates: null,
		specialDays: null,
		disabledDates: null,
		disabledDays: null,
		onpicking: null,
		onpicked: null,
		onclearing: null,
		oncleared: null,
		ychanging: null,
		ychanged: null,
		Mchanging: null,
		Mchanged: null,
		dchanging: null,
		dchanged: null,
		Hchanging: null,
		Hchanged: null,
		mchanging: null,
		mchanged: null,
		schanging: null,
		schanged: null,
		eCont: null,
		vel: null,
		elProp: '',
		errMsg: '',
		quickSel: [],
		has: {},
		getRealLang: function () {
			var arr = Config.$langList;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].name == this.lang) {
					return arr[i]
				}
			}
			return arr[0]
		}
	};
	WdatePicker = main;
	var w = window,
		emptyEl = {
			innerHTML: ''
		},
		d = 'document',
		de = 'documentElement',
		tag = 'getElementsByTagName',
		dptop, jsPath, $IE, $FF, $OPERA;
	var ua = navigator.userAgent,
		isTablet = /(?:iPad|PlayBook)/.test(ua) || (/(?:Android)/.test(ua) && !/(?:Mobile)/.test(ua)),
		isPhone = /(?:iPhone)/.test(ua) || /(?:Android)/.test(ua) && /(?:Mobile)/.test(ua);
	var appName = navigator.appName;
	if (appName == 'Microsoft Internet Explorer') $IE = true;
	else if (appName == 'Opera') $OPERA = true;
	else $FF = true;
	jsPath = Config.$dpPath || getJsPath();
	if (Config.$wdate) {
		loadCSS(jsPath + 'skin/WdatePicker.css')
	}
	dptop = w;
	if (Config.$crossFrame) {
		try {
			while (dptop.parent != dptop && dptop.parent[d][tag]('frameset').length == 0) {
				dptop = dptop.parent
			}
		} catch (e) {}
	}
	if (!dptop.$dp) {
		dptop.$dp = {
			ff: $FF,
			ie: $IE,
			opera: $OPERA,
			status: 0,
			defMinDate: Config.minDate,
			defMaxDate: Config.maxDate,
			isTablet: isTablet,
			isPhone: isPhone,
			isTouch: isTablet || isPhone
		}
	}
	initTopDP();
	if (Config.$preLoad && $dp.status == 0) {
		dpAttachEvent(w, 'onload', function () {
			main(null, true)
		})
	}
	var docEventName = $dp.isTouch ? 'ontouchstart' : 'onmousedown';
	if (!w[d].docMD) {
		dpAttachEvent(w[d], docEventName, disposeDP, true);
		w[d].docMD = true
	}
	if (!dptop[d].docMD) {
		dpAttachEvent(dptop[d], docEventName, disposeDP, true);
		dptop[d].docMD = true
	}
	dpAttachEvent(w, 'onunload', function () {
		if ($dp.dd) {
			display($dp.dd, "none")
		}
	});

	function initTopDP() {
		try {
			dptop[d], dptop.$dp = dptop.$dp || {}
		} catch (e) {
			dptop = w;
			$dp = $dp || {}
		}
		var obj = {
			win: w,
			$: function (el) {
				return (typeof el == 'string') ? w[d].getElementById(el) : el
			},
			$D: function (id, arg) {
				return this.$DV(this.$(id).value, arg)
			},
			$DV: function (v, arg) {
				if (v != '') {
					this.dt = $dp.cal.splitDate(v, $dp.cal.dateFmt);
					if (arg) {
						for (var p in arg) {
							if (this.dt[p] === undefined) {
								this.errMsg = 'invalid property:' + p
							} else {
								this.dt[p] += arg[p];
								if (p == 'M') {
									var offset = arg['M'] > 0 ? 1 : 0;
									var tmpday = new Date(this.dt['y'], this.dt['M'], 0).getDate();
									this.dt['d'] = Math.min(tmpday + offset, this.dt['d'])
								}
							}
						}
					}
					if (this.dt.refresh()) {
						return this.dt
					}
				}
				return ''
			},
			show: function () {
				var divs = dptop[d].getElementsByTagName('div'),
					maxZIndex = 1e5;
				for (var i = 0; i < divs.length; i++) {
					var curZ = parseInt(divs[i].style.zIndex);
					if (curZ > maxZIndex) {
						maxZIndex = curZ
					}
				}
				this.dd.style.zIndex = maxZIndex + 2;
				display(this.dd, "block");
				display(this.dd.firstChild, "")
			},
			unbind: function (el) {
				el = this.$(el);
				if (el.initcfg) {
					dpDetachEvent(el, 'onclick', function () {
						main(el.initcfg)
					});
					dpDetachEvent(el, 'onfocus', function () {
						main(el.initcfg)
					})
				}
			},
			hide: function () {
				display(this.dd, "none")
			},
			attachEvent: dpAttachEvent
		};
		for (var p in obj) {
			dptop.$dp[p] = obj[p];
		}
		$dp = dptop.$dp
	}

	function dpAttachEvent(o, sType, fHandler, useCapture) {
		if (o.addEventListener) {
			var shortTypeName = sType.replace(/on/, "");
			fHandler._ieEmuEventHandler = function (e) {
				return fHandler(e)
			};
			o.addEventListener(shortTypeName, fHandler._ieEmuEventHandler, useCapture)
		} else {
			o.attachEvent(sType, fHandler)
		}
	}

	function dpDetachEvent(o, sType, fHandler) {
		if (o.removeEventListener) {
			var shortTypeName = sType.replace(/on/, "");
			fHandler._ieEmuEventHandler = function (e) {
				return fHandler(e)
			};
			o.removeEventListener(shortTypeName, fHandler._ieEmuEventHandler, false)
		} else {
			o.detachEvent(sType, fHandler)
		}
	}

	function compareCfg(o1, o2, issub) {
		if (typeof o1 != typeof o2) return false;
		if (typeof o1 == 'object') {
			if (!issub) {
				for (var o in o1) {
					if (typeof o2[o] == 'undefined') return false;
					if (!compareCfg(o1[o], o2[o], true)) return false
				}
			}
			return true
		} else if (typeof o1 == 'function' && typeof o2 == 'function') {
			return o1.toString() == o2.toString()
		} else {
			return o1 == o2
		}
	}

	function getJsPath() {
		var path, tmp, scripts = w[d][tag]("script");
		for (var i = 0; i < scripts.length; i++) {
			path = scripts[i].getAttribute('src') || '';
			path = path.substr(0, path.toLowerCase().indexOf('wdatepicker.js'));
			var tmp = path.lastIndexOf("/");
			if (tmp > 0) path = path.substring(0, tmp + 1);
			if (path) break
		}
		return path
	}

	function loadCSS(path, title, charset) {
		var head = w[d][tag]('HEAD').item(0),
			style = w[d].createElement('link');
		if (head) {
			style.href = path;
			style.rel = 'stylesheet';
			style.type = 'text/css';
			if (title) style.title = title;
			if (charset) style.charset = charset;
			head.appendChild(style)
		}
	}

	function getAbsM(w) {
		w = w || dptop;
		var lm = 0,
			tm = 0;
		while (w != dptop) {
			var ifs = w.parent[d][tag]('iframe');
			for (var i = 0; i < ifs.length; i++) {
				try {
					if (ifs[i].contentWindow == w) {
						var rc = getBound(ifs[i]);
						lm += rc.left;
						tm += rc.top;
						break
					}
				} catch (e) {}
			}
			w = w.parent
		}
		return {
			'leftM': lm,
			'topM': tm
		}
	}

	function getBound(o, ignoreScr) {
		if (o.getBoundingClientRect) {
			return o.getBoundingClientRect()
		} else {
			var patterns = {
				ROOT_TAG: /^body|html$/i,
				OP_SCROLL: /^(?:inline|table-row)$/i
			};
			var hssFixed = false,
				win = null,
				t = o.offsetTop,
				l = o.offsetLeft,
				r = o.offsetWidth,
				b = o.offsetHeight;
			var parentNode = o.offsetParent;
			if (parentNode != o) {
				while (parentNode) {
					l += parentNode.offsetLeft;
					t += parentNode.offsetTop;
					if (getStyle(parentNode, 'position').toLowerCase() == 'fixed') hssFixed = true;
					else if (parentNode.tagName.toLowerCase() == "body") win = parentNode.ownerDocument.defaultView;
					parentNode = parentNode.offsetParent
				}
			}
			parentNode = o.parentNode;
			while (parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName)) {
				if (parentNode.scrollTop || parentNode.scrollLeft) {
					if (!patterns.OP_SCROLL.test(display(parentNode))) {
						if (!$OPERA || parentNode.style.overflow !== 'visible') {
							l -= parentNode.scrollLeft;
							t -= parentNode.scrollTop
						}
					}
				}
				parentNode = parentNode.parentNode
			}
			if (!hssFixed) {
				var scr = getScroll(win);
				l -= scr.left;
				t -= scr.top
			}
			r += l;
			b += t;
			return {
				'left': l,
				'top': t,
				'right': r,
				'bottom': b
			}
		}
	}

	function getWH(w) {
		w = w || dptop;
		var doc = w[d],
			width = (w.innerWidth) ? w.innerWidth : (doc[de] && doc[de].clientWidth) ? doc[de].clientWidth : doc.body.offsetWidth,
			height = (w.innerHeight) ? w.innerHeight : (doc[de] && doc[de].clientHeight) ? doc[de].clientHeight : doc.body.offsetHeight;
		return {
			'width': width,
			'height': height
		}
	}

	function getScroll(w) {
		w = w || dptop;
		var doc = w[d],
			doce = doc[de],
			db = doc.body;
		doc = (doce && doce.scrollTop != null && (doce.scrollTop > db.scrollTop || doce.scrollLeft > db.scrollLeft)) ? doce : db;
		return {
			'top': doc.scrollTop,
			'left': doc.scrollLeft
		}
	}

	function disposeDP(e) {
		try {
			var src = e ? (e.srcElement || e.target) : null;
			if ($dp.cal && !$dp.eCont && $dp.dd && src != $dp.el && $dp.dd.style.display == 'block') {
				$dp.cal.close()
			}
		} catch (e) {}
	}

	function dpLoaded() {
		$dp.status = 2
	}
	var isDptopReady, dptopInterval;

	function main(initcfg, preLoad) {
		if (!$dp) return;
		initcfg.el = initcfg.el || w[d].activeElement;
		if ($dp.isTouch) {
			try {
				initcfg.el.readOnly = true;
				initcfg.el.blur()
			} catch (e) {}
		}
		initTopDP();
		var cfg = {};
		for (var p in initcfg) {
			cfg[p] = initcfg[p]
		}
		for (var p in Config) {
			if (p.substring(0, 1) != '$' && cfg[p] === undefined) {
				cfg[p] = Config[p]
			}
		}
		if (preLoad) {
			if (!dptopReady()) {
				dptopInterval = dptopInterval || setInterval(function () {
					if (dptop[d].readyState == 'complete') {
						clearInterval(dptopInterval);
					}
					main(null, true)
				}, 50);
				return
			}
			if ($dp.status == 0) {
				$dp.status = 1;
				cfg.el = emptyEl;
				showPicker(cfg, true)
			} else {
				return
			}
		} else if (cfg.eCont) {
			cfg.eCont = $dp.$(cfg.eCont);
			cfg.el = emptyEl;
			cfg.autoPickDate = true;
			cfg.qsEnabled = false;
			showPicker(cfg)
		} else {
			if (Config.$preLoad && $dp.status != 2) return;
			if (!cfg.el) {
				var evt = SearchEvent();
				if (w.event === evt || evt) {
					cfg.srcEl = evt.srcElement || evt.target;
					evt.cancelBubble = true
				}
			}
			cfg.el = cfg.el = $dp.$(cfg.el || cfg.srcEl);
			if (cfg.el == null) {
				alert('WdatePicker:el is null!\nexample:onclick="WdatePicker({el:this})"');
				return
			}
			try {
				if (!cfg.el || cfg.el['My97Mark'] === true || cfg.el.disabled || ($dp.dd && display($dp.dd) != 'none' && $dp.dd.style.left != '-970px')) {
					if (cfg.el['My97Mark']) cfg.el['My97Mark'] = false;
					return
				}
			} catch (e) {}
			if (evt && cfg.el.nodeType == 1 && !compareCfg(cfg.el.initcfg, initcfg)) {
				$dp.unbind(cfg.el);
				dpAttachEvent(cfg.el, evt.type == 'focus' ? 'onclick' : 'onfocus', function () {
					main(initcfg)
				});
				cfg.el.initcfg = initcfg;
			}
			showPicker(cfg)
		}

		function dptopReady() {
			if ($IE && dptop != w && dptop[d].readyState != 'complete') return false;
			return true
		}

		function SearchEvent() {
			if ($FF) {
				try {
					var count = 0;
					func = SearchEvent.caller;
					while (func != null) {
						var arg0 = func.arguments[0];
						if (arg0 && (arg0 + '').indexOf('Event') >= 0 || (count++) > 97) {
							return arg0
						}
						func = func.caller
					}
				} catch (e) {}
				return null
			}
			return event
		}
	}

	function getStyle(obj, attribute) {
		return obj.currentStyle ? obj.currentStyle[attribute] : document.defaultView.getComputedStyle(obj, false)[attribute]
	}

	function display(obj, value) {
		if (obj) {
			if (value != null) obj.style.display = value;
			else return getStyle(obj, 'display')
		}
	}

	function showPicker(cfg, preLoad) {
		var nodeName = cfg.el ? cfg.el.nodeName : 'INPUT';
		if (preLoad || cfg.eCont || new RegExp(/input|textarea|div|span|p|a/ig).test(nodeName)) {
			cfg.elProp = cfg.elProp || nodeName == 'INPUT' ? 'value' : 'innerHTML'
		} else {
			return
		}
		if (cfg.lang == 'auto') {
			cfg.lang = $IE ? navigator.browserLanguage.toLowerCase() : navigator.language.toLowerCase()
		}
		if (!cfg.eCont) {
			for (var p in cfg) {
				$dp[p] = cfg[p]
			}
		}
		if (!$dp.dd || cfg.eCont || ($dp.dd && (cfg.getRealLang().name != $dp.dd.lang || cfg.skin != $dp.dd.skin))) {
			if (cfg.eCont) {
				ddInit(cfg.eCont, cfg)
			} else {
				$dp.dd = dptop[d].createElement("DIV");
				$dp.dd.style.cssText = 'position:absolute';
				dptop[d].body.appendChild($dp.dd);
				ddInit($dp.dd, cfg);
				if (preLoad) {
					$dp.dd.style.left = $dp.dd.style.top = '-970px'
				} else {
					$dp.show();
					setPos($dp)
				}
			}
		} else if ($dp.cal) {
			$dp.show();
			$dp.cal.init();
			if (!$dp.eCont) setPos($dp)
		}

		function ddInit(cont, cfg) {
			var dm = dptop[d].domain,
				isCross = false,
				defHtml = '<iframe hideFocus=true width=9 height=7 frameborder=0 border=0 scrolling=no src="about:blank"></iframe>';
			cont.innerHTML = defHtml;
			var langList = Config.$langList,
				skinList = Config.$skinList,
				doc;
			try {
				doc = cont.lastChild.contentWindow[d]
			} catch (e) {
				isCross = true;
				cont.removeChild(cont.lastChild);
				var ifr = dptop[d].createElement("iframe");
				ifr.hideFocus = true;
				ifr.frameBorder = 0;
				ifr.scrolling = 'no';
				ifr.src = "javascript:(function(){var d=document;d.open();d.domain='" + dm + "';})()";
				cont.appendChild(ifr);
				setTimeout(function () {
					doc = cont.lastChild.contentWindow[d];
					ddWrite()
				}, 97);
				return
			}
			ddWrite();

			function ddWrite() {
				var realLang = cfg.getRealLang(),
					ver = '4.9.0b3';
				cont.lang = realLang.name;
				cont.skin = cfg.skin;
				var h = ['<head><script>', '', 'var doc=document, $d, $dp, $cfg=doc.cfg, $pdp = parent.$dp, $dt, $tdt, $sdt, $lastInput, $IE=$pdp.ie, $FF = $pdp.ff,$OPERA=$pdp.opera, $ny, $cMark = false;', 'if($cfg.eCont){$dp = {};for(var p in $pdp)$dp[p]=$pdp[p];}else{$dp=$pdp;};for(var p in $cfg){$dp[p]=$cfg[p];}', 'if(!$dp.isTouch)doc.oncontextmenu=function(){try{$c._fillQS(!$dp.has.d,1);showB($d.qsDivSel);}catch(e){};return false;};', '</script><script src=', jsPath, 'lang/', realLang.name, '.js?' + ver + ' charset=', realLang.charset, '></script>'];
				if (isCross) h[1] = 'document.domain="' + dm + '";';
				for (var i = 0; i < skinList.length; i++) {
					if (skinList[i].name == cfg.skin) {
						h.push('<link rel="stylesheet" type="text/css" href="' + jsPath + 'skin/' + skinList[i].name + '/datepicker.css?');
						h.push(ver);
						h.push('" charset="' + skinList[i].charset + '"/>')
					}
				}
				h.push('<script src="' + jsPath + 'calendar.js?');
				h.push(ver);
				h.push('"></script>');
				h.push('</head><body leftmargin="0" topmargin="0" tabindex=0></body></html>');
				h.push('<script>var t;t=t||setInterval(function(){if((typeof(doc.ready)=="boolean"&&doc.ready)||doc.readyState=="complete"){new My97DP();$cfg.onload();$c.autoSize();$cfg.setPos($dp);clearInterval(t);}},20);</script>');
				cfg.setPos = setPos;
				cfg.onload = dpLoaded;
				doc.write('<html>');
				doc.cfg = cfg;
				doc.write(h.join(''));
				doc.close()
			}
		}

		function setPos(dp) {
			var l = dp.position.left,
				t = dp.position.top,
				el = dp.el;
			if (el == emptyEl) return;
			if (el != dp.srcEl && (display(el) == 'none' || el.type == 'hidden')) el = dp.srcEl;
			var objxy = getBound(el),
				mm = getAbsM(w),
				currWH = getWH(dptop),
				scr = getScroll(dptop),
				ddHeight = $dp.dd.offsetHeight,
				ddWidth = $dp.dd.offsetWidth;
			if (isNaN(t)) t = 0;
			if ((mm.topM + objxy.bottom + ddHeight > currWH.height) && (mm.topM + objxy.top - ddHeight > 0)) {
				t += scr.top + mm.topM + objxy.top - ddHeight - 2
			} else {
				t += scr.top + mm.topM + objxy.bottom;
				var offsetT = t - scr.top + ddHeight - currWH.height;
				if (offsetT > 0) t -= offsetT
			}
			if (isNaN(l)) l = 0;
			l += scr.left + Math.min(mm.leftM + objxy.left, currWH.width - ddWidth - 5) - ($IE ? 2 : 0);
			dp.dd.style.top = (t + 2) + 'px';
			dp.dd.style.left = l + 'px'
		}
	}
})();