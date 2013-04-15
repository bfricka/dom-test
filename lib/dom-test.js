(function(){
  DomTest = (function() {
    function DomTest(opts) {
      opts = opts || {};
      this.testType = opts.testType || 'clone';
      this.runs = opts.runs || 500;
      this.runClasses = opts.runClasses || false;

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
        var tmpl;
        if (this.runClasses) {
          tmpl = '<div class="' + 'span4' + '';
        }

        tmpl = '<div class="span4">' + '<h2>Heading</h2>' + '<p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.</p>' + '<p>' + '<a href="#" class="btn">View details »</a>' + '</p>' + '</div>';
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