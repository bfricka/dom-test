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
    }

    DomTest.prototype.templates = {
      clone: null,
      inner: null,
      innerArr: null
    };

    DomTest.prototype.setupElements = function() {
      this.templates.clone = this.dispose(this.q('#test-container .row'));
      return this.container = this.empty(this.q('#test-container'));
    };

    DomTest.prototype.run = function(runs, type) {
      if (runs == null) {
        runs = this.runs;
      }
      if (type == null) {
        type = this.type;
      }
      this.empty(this.container);
      switch (this.type) {
        case 'clone':
          this._runClone(runs);
          break;
        case 'cloneFrag':
          this._runCloneFrag(runs);
          break;
        case 'inner':
          this._runInner(runs);
          break;
        case 'innerArr':
          this._runInnerArr(runs);
      }
    };

    DomTest.prototype._runClone = function(runs) {
      var row;

      while (runs--) {
        row = this.templates.clone.cloneNode(true);
        this.container.appendChild(row);
      }
    };

    DomTest.prototype._runCloneFrag = function(runs) {
      var tmpl;

      tmpl = document.createDocumentFragment();
      while (runs--) {
        tmpl.appendChild(this.templates.clone.cloneNode(true));
      }
      this.container.appendChild(tmpl);
    };

    DomTest.prototype._runInner = function(runs) {
      var tmpl;

      tmpl = "";
      while (runs--) {
        tmpl += this._getRowStr();
      }
      this.container.innerHTML += tmpl;
    };

    DomTest.prototype._runInnerArr = function(runs) {
      var tmpl;

      tmpl = [];
      while (runs--) {
        tmpl.push(this._getRowArr());
      }
      this.container.innerHTML += tmpl.join('');
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
