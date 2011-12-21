(function() {
  var $, NanoScroll;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  $ = this.jQuery;
  NanoScroll = (function() {
    function NanoScroll(el, options) {
      this.el = el;
      /* Probably not necessarry to define this for filesize reasons
      @slider   = null
      @pane     = null
      @content  = null
      @scrollH  = 0
      @sliderH  = 0
      @paneH    = 0
      @sliderY  = 0
      @offsetY  = 0
      @contentH = 0
      @contentY = 0
      @isDrag   = false
      */
      options || (options = {});
      this.generate();
      this.createEvents();
      this.addEvents();
      this.reset();
      return;
    }
    NanoScroll.prototype.createEvents = function() {
      var mousemove, mouseup;
      mousemove = 'mousemove';
      mouseup = 'mouseup';
      return this.events = {
        down: __bind(function(e) {
          this.isDrag = true;
          this.offsetY = e.clientY - this.slider.offset().top;
          this.pane.addClass('active');
          $(document).bind(mousemove, this.events.drag);
          $(document).bind(mouseup, this.events.up);
          return false;
        }, this),
        drag: __bind(function(e) {
          this.sliderY = e.clientY - this.el.offset().top - this.offsetY;
          this.scroll();
          return false;
        }, this),
        up: __bind(function(e) {
          this.isDrag = false;
          this.pane.removeClass('active');
          $(document).unbind(mousemove, this.events.drag);
          $(document).unbind(mouseup, this.events.up);
          return false;
        }, this),
        resize: __bind(function(e) {
          this.reset();
          return this.scroll();
        }, this),
        panedown: __bind(function(e) {
          this.sliderY = e.clientY - this.el.offset().top - this.sliderH * .5;
          this.scroll();
          return this.events.down(e);
        }, this),
        scroll: __bind(function(e) {
          var top;
          if (this.isDrag === true) {
            return;
          }
          top = this.content[0].scrollTop / (this.content[0].scrollHeight - this.content[0].clientHeight) * (this.paneH - this.sliderH);
          return this.slider.css({
            top: top + 'px'
          });
        }, this),
        wheel: __bind(function(e) {
          this.sliderY += -e.wheelDeltaY || -e.delta;
          this.scroll();
          return false;
        }, this)
      };
    };
    NanoScroll.prototype.addEvents = function() {
      $(window).bind('resize', this.events.resize);
      this.slider.bind('mousedown', this.events.down);
      this.pane.bind('mousedown', this.events.panedown);
      this.content.bind('scroll', this.events.scroll);
      if (window.addEventListener) {
        this.pane[0].addEventListener('mousewheel', this.events.wheel);
        return this.pane[0].addEventListener('DOMMouseScroll', this.events.wheel);
      }
    };
    NanoScroll.prototype.removeEvents = function() {
      $(window).unbind('resize', this.events.resize);
      this.slider.unbind('mousedown', this.events.down);
      this.pane.unbind('mousedown', this.events.panedown);
      this.content.unbind('scroll', this.events.scroll);
      if (window.addEventListener) {
        this.pane[0].removeEventListener('mousewheel', this.events.wheel);
        return this.pane[0].removeEventListener('DOMMouseScroll', this.events.wheel);
      }
    };
    NanoScroll.prototype.getScrollbarWidth = function() {
      var noscrollWidth, outer, yesscrollWidth;
      outer = document.createElement('div');
      outer.style.position = 'absolute';
      outer.style.width = '100px';
      outer.style.height = '100px';
      outer.style.overflow = 'scroll';
      document.body.appendChild(outer);
      noscrollWidth = outer.offsetWidth;
      yesscrollWidth = outer.scrollWidth;
      document.body.removeChild(outer);
      return noscrollWidth - yesscrollWidth;
    };
    NanoScroll.prototype.generate = function() {
      this.el.append('<div class="pane"><div class="slider"></div></div>');
      this.content = $(this.el.children()[0]);
      this.slider = this.el.find('.slider');
      this.pane = this.el.find('.pane');
      this.scrollW = this.getScrollbarWidth();
      if (this.scrollbarWidth === 0) {
        this.scrollW = 0;
      }
      this.content.css({
        right: -this.scrollW + 'px'
      });
      if ($.browser.msie != null) {
        if (parseInt($.browser.version) < 8) {
          this.pane.hide();
        }
      }
    };
    NanoScroll.prototype.reset = function() {
      if (this.isDead === true) {
        this.isDead = false;
        this.pane.show();
        this.addEvents();
      }
      this.contentH = this.content[0].scrollHeight + this.scrollW;
      this.paneH = this.pane.outerHeight();
      this.sliderH = this.paneH / this.contentH * this.paneH;
      this.sliderH = Math.round(this.sliderH);
      this.scrollH = this.paneH - this.sliderH;
      this.slider.height(this.sliderH);
      if (this.paneH >= this.contentH) {
        this.pane.hide();
      } else {
        this.pane.show();
      }
    };
    NanoScroll.prototype.scroll = function() {
      var scrollValue;
      this.sliderY = Math.max(0, this.sliderY);
      this.sliderY = Math.min(this.scrollH, this.sliderY);
      scrollValue = this.paneH - this.contentH + this.scrollW;
      scrollValue = scrollValue * this.sliderY / this.scrollH;
      this.content.scrollTop(-scrollValue);
      return this.slider.css({
        top: this.sliderY
      });
    };
    NanoScroll.prototype.scrollBottom = function(offsetY) {
      this.reset();
      this.sliderY = this.scrollH - offsetY;
      this.scroll();
    };
    NanoScroll.prototype.scrollTop = function(offsetY) {
      this.reset();
      this.sliderY = 0 + offsetY;
      this.scroll();
    };
    NanoScroll.prototype.stop = function() {
      this.isDead = true;
      this.removeEvents();
      this.pane.hide();
    };
    return NanoScroll;
  })();
  $.fn.nanoScroller = function(options) {
    var scrollbar;
    options || (options = {});
    scrollbar = this.data('scrollbar');
    if (scrollbar === void 0) {
      scrollbar = new NanoScroll(this, options);
      this.data({
        'scrollbar': scrollbar
      });
      return;
    }
    if (options.scrollBottom) {
      return scrollbar.scrollBottom(options.scrollBottom);
    }
    if (options.scrollTop) {
      return scrollbar.scrollTop(options.scrollTop);
    }
    if (options.scroll === 'bottom') {
      return scrollbar.scrollBottom(0);
    }
    if (options.scroll === 'top') {
      return scrollbar.scrollTop(0);
    }
    if (options.stop === true) {
      return scrollbar.stop();
    }
    return scrollbar.reset();
  };
}).call(this);
