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