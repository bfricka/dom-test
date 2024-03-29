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