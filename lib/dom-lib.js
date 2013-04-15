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