(function() {
  var DomTest, Stor;

  Stor = (function() {
    function Stor(key, exp) {
      this.key = key != null ? key : void 0;
      this.exp = exp != null ? exp : null;
      this.amp = amplify.store;
    }

    Stor.prototype.get = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key);
    };

    Stor.prototype.set = function(val, key, exp) {
      if (key == null) {
        key = this.key;
      }
      if (exp == null) {
        exp = this.exp;
      }
      return this.amp(key, val, {
        expiration: exp
      });
    };

    Stor.prototype.remove = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key, null);
    };

    Stor.prototype.empty = function() {
      var self, storage;

      self = this;
      storage = self.amp();
      return _.each(storage, function(itm, key) {
        return self.amp(key, null);
      });
    };

    return Stor;

  })();

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
      this.templates.clone = this.dispose(this.q('#test-container .row'));
      this.container = this.empty(this.q('#test-container'));
      return this.status = $('.test-status');
    };

    DomTest.prototype.setupEvents = function() {
      var _this = this;

      $(window).on('test:container-emptied', function() {
        return _this.status.text('Running test...');
      });
      return $(window).on('test:complete', function() {
        return setTimeout(function() {
          return _this.status.text('');
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
        return this.empty(this.container);
      };
      return this._tO(emptyFn, 'test:container-emptied');
    };

    DomTest.prototype._tO = function(fn, evt) {
      var _this = this;

      return setTimeout(function() {
        fn.apply(_this);
        return $(window).trigger(evt);
      }, 0);
    };

    DomTest.prototype._postRun = function() {
      return this.status.text('');
    };

    DomTest.prototype._runClone = function(runs) {
      var row;

      while (runs--) {
        row = this.templates.clone.cloneNode(true);
        this.container.appendChild(row);
      }
      return this._postRun();
    };

    DomTest.prototype._runCloneFrag = function(runs) {
      var tmpl;

      tmpl = document.createDocumentFragment();
      while (runs--) {
        tmpl.appendChild(this.templates.clone.cloneNode(true));
      }
      this.container.appendChild(tmpl);
      return this._postRun();
    };

    DomTest.prototype._runInner = function(runs) {
      var tmpl;

      tmpl = "";
      while (runs--) {
        tmpl += this._getRowStr();
      }
      this.container.innerHTML += tmpl;
      return this._postRun();
    };

    DomTest.prototype._runInnerArr = function(runs) {
      var tmpl;

      tmpl = [];
      while (runs--) {
        tmpl.push(this._getRowArr());
      }
      this.container.innerHTML += tmpl.join('');
      return this._postRun();
    };

    DomTest.prototype._getRowStr = function() {
      var cols, tmpl;

      cols = 3;
      tmpl = '<div class="row">';
      while (cols--) {
        tmpl += this._getColumnStr();
      }
      tmpl += '</div>';
      return tmpl;
    };

    DomTest.prototype._getColumnStr = function() {
      var tmpl;

      tmpl = '<div class="span4">' + '<h2>Heading</h2>' + '<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>' + '<p>' + '<a href="#" class="btn">View details »</a>' + '</p>' + '</div>';
      return tmpl;
    };

    DomTest.prototype._getRowArr = function() {
      var cols, tmpl;

      cols = 3;
      tmpl = ['<div class="row">'];
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

    DomTest.prototype.q = function(selector) {
      return document.querySelector(selector);
    };

    DomTest.prototype.qA = function(selector) {
      return document.querySelectorAll(selector);
    };

    DomTest.prototype.empty = function(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
      return el;
    };

    DomTest.prototype.dispose = function(el) {
      return el.parentNode.removeChild(el);
    };

    return DomTest;

  })();

  window.DomTest = DomTest;

}).call(this);
