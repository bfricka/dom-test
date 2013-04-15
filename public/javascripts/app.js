// From MooTools core

(function(){
	var ua = navigator.userAgent.toLowerCase()
		, platform = navigator.platform.toLowerCase()
		, UA = ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/) || [null, 'unknown', 0]
		, mode = UA[1] === 'ie' && document.documentMode

	, Browser = {
		name: (UA[1] === 'version') ? UA[3] : UA[1]
		, version: mode || parseFloat((UA[1] === 'opera' && UA[4]) ? UA[4] : UA[2])
		, Platform: {
			name: ua.match(/ip(?:ad|od|hone)/) ? 'ios' : (ua.match(/(?:webos|android)/) || platform.match(/mac|win|linux/) || ['other'])[0]
		}
		, Features: {
			xpath: !!(document.evaluate),
			air: !!(window.runtime),
			query: !!(document.querySelector),
			json: !!(window.JSON)
		}
	};

	Browser[Browser.name] = true;
	window.Browser = Browser;
}());
(function(){
  function Dom (){}

  function q (selector, context, all) {
    if (context == null) context = document;
    all = all ? "All" : "";

    return context['querySelector' + all](selector);
  }

  Dom.prototype = {
    qs: function(selector, context) {
      return q(selector, context, false);
    }

    , qsa: function(selector, context) {
      return q(selector, context, true);
    }

    , empty: function(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }

      return el;
    }

    , dispose: function(el) {
      return el.parentNode.removeChild(el);
    }

    , getSize: function(el) {
      return { x: el.offsetWidth, y: el.offsetHeight };
    }

    , getChildren: function(el) {
      var children = el.children
      , childrenArr = [];

      for (var i = 0, len = children.length; i < len; i++) {
        if (Browser.ie) {
          var tag = children[i].tagName.toLowerCase();
          if (tag === '!') continue;
        }

        childrenArr.push(children[i]);
      }

      return childrenArr;
    }

    , typeOf: function(obj) {
      return Object.prototype
        .toString.call(obj)
        .replace(/\[\w+\s(\w+)\]/, '$1')
        .toLowerCase();
    }

    , setPxStyles: function(el, styles){
      var cssText = "", k;
      for(k in styles) {
        if (styles.hasOwnProperty(k)) cssText += "" + k + ": " + styles[k] + "px; ";
      }
      el.style.cssText = cssText;
    }

    , setText: function(el, text) {
      if (typeof el.textContent === 'string') {
        el.textContent = text;
      } else if (typeof el.innerText === 'string') {
        el.innerText = text;
      } else {
        while (el.firstChild) { el.removeChild(el.firstChild); }
        el.appendChild(document.createTextNode(text));
      }
    }

    , toggleClass: function(el, className, toggle){
      if (typeof el !== 'object') return;

      var tester = new RegExp(className)
      , replacer = new RegExp("(\\s+)?" + className)
      , classes = el.className
      , hasClass = tester.test(classes);

      // Toggle override
      if (toggle != null) {
        if (toggle) {
          if (hasClass) return;
          el.className += (" " + className);
        } else {
          if (!hasClass) return;
          el.className = classes.replace(replacer, '');
        }
        return;
      }

      if (hasClass) {
        el.className = el.className.replace(replacer, '');
      } else {
        el.className += (" " + className);
      }
    }

    , addClass: function (el, className) {
      this.toggleClass(el, className, true);
    }

    , removeClass: function (el, className) {
      this.toggleClass(el, className, false);
    }
  };

  window.dom = new Dom();
}());
(function(){
  DomTest = (function() {
    function DomTest(type, runs) {
      this.type = type != null ? type : 'clone';
      this.runs = runs != null ? runs : 500;

      this.setupElements();
      this.setupEvents();
    }

    DomTest.prototype.templates = {
      clone: null,
      inner: null,
      innerArr: null
    };

    DomTest.prototype.setupElements = function() {
      this.templates.clone = dom.dispose(dom.qs('#test-container .row'));
      this.container = dom.empty(dom.qs('#test-container'));
      this.status = $('.test-status');
    };

    DomTest.prototype.setupEvents = function() {
      var _this = this;

      $(window).on('test:container-emptied', function() {
        _this.timer = new Date().getTime();
        _this.status.text('Running test...');
      });

      $(window).on('test:complete', function() {
        setTimeout(function() {
          var finishedTime = new Date().getTime() - _this.timer;
          _this.status.text('Finished in: ' + finishedTime + 'ms.');
        }, 500);
      });
    };

    DomTest.prototype.run = function(runs, type) {
      var _this = this;

      this._preRun();
      runs = runs != null ? runs : this.runs;
      type = type != null ? type : this.type;
      this._tO(function() {
        switch (type) {
          case 'clone':
            return _this._runClone(runs);
          case 'cloneFrag':
            return _this._runCloneFrag(runs);
          case 'inner':
            return _this._runInner(runs);
          case 'innerArr':
            return _this._runInnerArr(runs);
        }
      }, 'test:complete');
    };

    DomTest.prototype._preRun = function() {
      var emptyFn;

      this.status.text('Removing previous content...');
      emptyFn = function() {
        dom.empty(this.container);
      };

      this._tO(emptyFn, 'test:container-emptied');
    };

    DomTest.prototype._tO = function(fn, evt) {
      var _this = this;

      setTimeout(function() {
        fn.apply(_this);
        $(window).trigger(evt);
      }, 0);
    };

    DomTest.prototype._postRun = function() {
      this.status.text('');
    };

    DomTest.prototype._runClone = function(runs) {
      var row;

      while (runs--) {
        row = this.templates.clone.cloneNode(true);
        this.container.appendChild(row);
      }

      this._postRun();
    };

    DomTest.prototype._runCloneFrag = function(runs) {
      var tmpl = document.createDocumentFragment();

      while (runs--) {
        tmpl.appendChild(this.templates.clone.cloneNode(true));
      }

      this.container.appendChild(tmpl);
      this._postRun();
    };

    DomTest.prototype._runInner = function(runs) {
      var tmpl = "";

      while (runs--) {
        tmpl += this._getRowStr();
      }

      this.container.innerHTML += tmpl;
      this._postRun();
    };

    DomTest.prototype._runInnerArr = function(runs) {
      var tmpl = [];

      while (runs--) {
        tmpl.push(this._getRowArr());
      }

      this.container.innerHTML += tmpl.join('');
      this._postRun();
    };

    DomTest.prototype._getRowStr = function() {
      var cols = 3, tmpl = '<div class="row">';

      while (cols--) {
        tmpl += this._getColumnStr();
      }

      tmpl += '</div>';
      return tmpl;
    };

    DomTest.prototype._getColumnStr = function() {
      var tmpl = '<div class="span4">' + '<h2>Heading</h2>' + '<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>' + '<p>' + '<a href="#" class="btn">View details »</a>' + '</p>' + '</div>';
      return tmpl;
    };

    DomTest.prototype._getRowArr = function() {
      var cols = 3, tmpl = ['<div class="row">'];

      while (cols--) {
        tmpl.push('<div class="span4">');
        tmpl.push('<h2>Heading</h2>');
        tmpl.push('<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>');
        tmpl.push('<p>');
        tmpl.push('<a href="#" class="btn">View details »</a>');
        tmpl.push('</p>');
        tmpl.push('</div>');
      }
      tmpl.push('</div>');

      return tmpl.join('');
    };

    return DomTest;

  })();

  window.DomTest = DomTest;
}());