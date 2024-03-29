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

    , clone: function(el) {
      var clone = el.cloneNode(true), ce = [clone], te = [el], i;

      for (i = ce.length; i--;){
        var node = ce[i], element = te[i];

        /*<ltIE9>*/
        if (node.clearAttributes) {
          node.clearAttributes();
          node.mergeAttributes(element);
          node.removeAttribute('uniqueNumber');

          if (node.options) {
            var no = node.options, eo = element.options;
            for (var j = no.length; j--;) no[j].selected = eo[j].selected;
          }
        }
      }

      return clone;
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

    , hasClass: function(el, className) {
      var tester = RegExp(className)
      , classList = el.classList || el.className.split(/\s+/)
      , classes = [].slice.call(classList)
      , len = classes.length
      , i = 0;

      while (i < len) {
        if (tester.test(classes[i])) return true;
        i++;
      }

      return false;
    }

    , toggleClass: function(el, className, toggle){
      if (typeof el !== 'object') return;

      var replacer = new RegExp("(\\s+)?" + className)
      , classes = el.className
      , hasClass = this.hasClass(el, className);

      // Toggle override
      if (toggle != null) {
        if (toggle) {
          if (hasClass) return el;
          el.className += (" " + className);
        } else {
          if (!hasClass) return el;
          el.className = classes.replace(replacer, '');
        }
        return el;
      }

      if (hasClass) {
        el.className = el.className.replace(replacer, '');
      } else {
        el.className += (" " + className);
      }

      return el;
    }

    , addClass: function (el, className) {
      return this.toggleClass(el, className, true);
    }

    , removeClass: function (el, className) {
      return this.toggleClass(el, className, false);
    }
  };

  window.dom = new Dom();
}());
(function(){
  DomTest = (function() {
    function DomTest(opts) {
      opts = opts || {};
      this.testType = opts.testType || 'clone';
      this.runs = opts.runs || 500;

      this.setupElements();
      this.setupEvents();
    }

    DomTest.prototype = {
      templates: {
          clone: null
        , inner: null
        , innerArr: null
      }

      , setupElements: function() {
        this.templates.clone = dom.dispose(dom.qs('#test-container .row'));
        this.container = dom.empty(dom.qs('#test-container'));
        this.status = $('.test-status');
      }

      , setupEvents: function() {
        var _this = this;

        $(window).on('test:container-emptied', function() {
          _this.timer = new Date().getTime();
          _this.status.text('Running test...');
        });

        $(window).on('test:complete', function() {
          setTimeout(function() {
            var finishedTime = new Date().getTime() - _this.timer;
            _this.status.text('Finished in: ' + finishedTime + 'ms.');
          }, 0);
        });
      }

      , run: function(opts) {
        var _this = this
        , runs = opts.runs || this.runs
        , testType = opts.testType || this.testType;

        this._preRun();

        this._tO(function() {
          switch (testType) {
            case 'clone':
              return _this._runClone(runs, 'append');
            case 'cloneFrag':
              return _this._runCloneFrag(runs, 'append');
            case 'strConcat':
              return _this._runStrConcat(runs, 'inner');
            case 'strJoin':
              return _this._runStrJoin(runs, 'inner');
          }
        }, 'test:complete');
      }

      , _preRun: function() {
        var emptyFn = function() { dom.empty(this.container); };

        this.status.text('Removing previous content...');
        this._tO(emptyFn, 'test:container-emptied');
      }

      , _tO: function(fn, evt) {
        var _this = this;

        setTimeout(function() {
          fn.apply(_this);
          $(window).trigger(evt);
        }, 0);
      }

      , _postRun: function() {
        this.status.text('');
      }

      , insert: function(content, type, container) {
        container = container || this.container;

        if (type === 'append') {
          container.appendChild(content);
        } else {
          container.innerHTML += (typeof content === 'string' ? content : content.outerHTML);
        }
      }

      , _runClone: function(runs, insert) {
        var row;

        while (runs--) {
          row = dom.clone(this.templates.clone);
          this.insert(row, insert);
        }

        this._postRun();
      }

      , _runCloneFrag: function(runs, insert) {
        var tmpl = document.createDocumentFragment()
        , node;

        while (runs--) {
          node = dom.clone(this.templates.clone);
          tmpl.appendChild(node);
        }

        this.insert(tmpl, insert);
        this._postRun();
      }

      , _runStrConcat: function(runs, insert) {
        var tmpl = "";

        while (runs--) {
          tmpl += this._getRowStr();
        }

        this.insert(tmpl, insert);
        this._postRun();
      }

      , _runStrJoin: function(runs, insert) {
        var tmpl = [];

        while (runs--) {
          tmpl.push(this._getRowArr());
        }

        this.insert(tmpl.join(''), insert);
        this._postRun();
      }

      , _getRowStr: function() {
        var cols = 3, tmpl = '<div class="row">';

        while (cols--) {
          tmpl += this._getColumnStr();
        }

        tmpl += '</div>';
        return tmpl;
      }

      , _getColumnStr: function() {
        var tmpl = '<div class="span4">' + '<h2>Heading</h2>' + '<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>' + '<p>' + '<a href="#" class="btn">View details »</a>' + '</p>' + '</div>';
        return tmpl;
      }

      , _getRowArr: function() {
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
      }
    };

    return DomTest;

  })();

  window.DomTest = DomTest;
}());