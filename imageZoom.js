/**
 * imageZoom 图片放大镜
 * @param 参数列表 
 *     bigImageSize:          {Object}      大图尺寸
 *     $target:               {Object}    	小图jQuery对象
 *     bigImageSrc:           {Function}    获取大图地址的方法
 *     
 * @method [getStatus]	[获取登录状态]
 * 
 * @usage
 * 	<img id="target" src="small.jpg" data-big="big.jpg">
	imageZoom({
		$target: $('#target'),
		bigImageSize: {
			w: 800,
			h: 800
		},
		bigImageSrc: function(){
			return this.$target.attr('data-big');
		}
	});
 * 
 */
(function(fn) {
	if(typeof define === 'function' && define.amd){
		define(['jquery'], function($){
			return fn($);
		});
	}else{
		window.imageZoom = fn($);
	}
})(function($) {
	var imageZoom, defaults;

	defaults = {
		bigImageSize: {
			w: 800,
			h: 800
		},

		bigImageSrc: function(){
			return this.$target.attr('data-big');
		}
	};
	imageZoom = function(opts){
		return new imageZoom.fn.init(opts);
	};
	imageZoom.fn = imageZoom.prototype = {
		init: function(opts){
			this.opts = $.extend(true, {}, defaults, opts);
			this.$target = this.opts.$target;
			this.offset = this.$target.offset();
			this.$imageWrap = this.$target.parent();
			this.bindEvents();
			return this;
		},

		bindEvents: function(){
			var _this = this;

			this.$imageWrap.on('mouseenter', function(){
				_this.show();
				
			});

			this.$imageWrap.on('mouseleave', function(e){
				_this.hide();
				
			});
		},

		move: function(e){
			var lStyle, t, l, tW, tH, bW, bH, vW, vH, lW, lH;
			var x = e.pageX;
			var y = e.pageY;
			var _this = this;

			bW = this.opts.bigImageSize.w; //大图尺寸
			bH = this.opts.bigImageSize.h;
			tW = this.$target.width();	//小图尺寸
			tH = this.$target.height();
			vW = tW; //大图展示容器尺寸，这里强制和小图尺寸一样
			vH = tH;
			lW = this.$lens.width();
			lH = this.$lens.height();
			l = x - this.offset.left - lW / 2;
			t = y - this.offset.top - lH / 2;
			if(t > tH - lH){
				t = tH - lH;
			}
			if(t < 0){
				t = 0;
			}
			if(l > tW - lW){
				l = tW - lW;
			}
			if(l < 0){
				l = 0;
			}
			lStyle = {
				top: t,
				left: l
			};
			this.$lens.css(lStyle);
			this.$big.css({
				left: -l * bW / tW,
				top: -t * bH / tH
			});
		},

		//显示
		show: function(){
			var tW, tH, bW, bH, vW, vH;
			var lStyle;
			var vStyle;
			var _this = this;

			bW = this.opts.bigImageSize.w; //大图尺寸
			bH = this.opts.bigImageSize.h;
			tW = this.$target.width();	//小图尺寸
			tH = this.$target.height();
			vW = tW; //大图展示容器尺寸，这里强制和小图尺寸一样
			vH = tH;
			if(!this.$lens){
				this.createZoomer();
			}
			lStyle = {
				width: vW * tW / bW,
				height: vH * tH / bH
			};
			vStyle = {
				top: _this.offset.top,
				left: _this.offset.left + tW + 10
			};
			this.$lens.css(lStyle);
			this.$viewer.css(vStyle);
			this.$big.attr('src', _this.opts.bigImageSrc());

			this.$viewer.show();
			this.$lens.show();
			this.$imageWrap.on('mousemove', function(e){
				_this.move(e);
			});
			this.started = true;
		},

		hide: function(){
			if(!this.started){
				return;
			}
			this.$viewer.hide();
			this.$lens.hide();
			this.$imageWrap.unbind('mousemove');
			this.started = false;
		},

		createZoomer: function(){
			$('body').append('<div class="zoom-viewer" id="imageZoomViewer"><img /></div>');
			this.$imageWrap.append('<span class="zoom-lens" id="imageZoomLens"></span>');
			this.$lens = $('#imageZoomLens');
			this.$viewer = $('#imageZoomViewer');
			this.$big = this.$viewer.find('img');
		}

	};
	imageZoom.fn.init.prototype = imageZoom.prototype;
	return imageZoom;
});
