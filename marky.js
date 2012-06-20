(function() {

  /*
   *  `_each` and `_keys` pilfered from the wonderful Underscore.js
   *
   *  Underscore.js 1.3.1
   *  (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
   *  http://documentcloud.github.com/underscore
   */

  var
    nativeForEach      = Array.prototype.forEach,
    nativeKeys         = Object.keys;

  var _has = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };

  var _each = function(obj, iterator, context) {
    if (obj === null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };


  var _keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_has(obj, key)) keys[keys.length] = key;
    return keys;
  };


  var MarkyElement = function(node) {
    var node = node
    return {
      set: function(attrs) {
        _each(_keys(attrs), function(attr) {
          node.setAttribute(attr, attrs[attr])
        })
        return node
      },
      get: function(attr) {
        return node.getAttribute(attr)
      }
    }
  }

  var Marky = function(node, type) {

    if (typeof(node) === 'undefined') node = document.createElement('div')

    var type    = type || 'html',
        parent  = node,
        methods = {}

    if (type == 'svg') {
      var NS = 'http://www.w3.org/2000/svg'
    }

      var builder = function(tag) {
        var tagName = tag

        return function() {
          var txt,attrs,children,
              args = Array.prototype.slice.call(arguments)

          switch(typeof(args[0])) {
            case 'object':
              attrs = args[0]
              break;
            case 'function':
              children = args[0]
              break;
            default:
              txt = args[0]
          }

          switch(typeof(args[1])) {
            case 'object':
              attrs = args[1]
              break;
            case 'function':
              children = args[1]
              break;
          }

          (typeof(args[2]) == "function") ? children = args[1] : null

          switch(type) {
            case 'svg':
              var tag = document.createElementNS(NS, tagName)
              break;
            default:
              var tag = document.createElement(tagName)
          }

          if (typeof(parent) === 'function') {
            parent = parent()
          }
          parent.appendChild(tag)

          if (txt) {
            if (type=='svg') {
              tag.textContent = txt
            } else {
              tag.innerHTML = txt
            }
          }

          if (attrs) {
            _each(_keys(attrs), function(attr) {
              var value =  attrs[attr]
              if (typeof(value) == 'function') {
                value = value()
              }
              tag.setAttribute(attr, value)
              return this
            })
          }

          if (children) {
            var _parent = parent
            parent = tag
            children()
            parent = _parent
          } else {
            parent.appendChild(tag)
          }
          return new MarkyElement(tag)
        }
      }

      var tags = {

        html: "a abbr address area article aside audio b base bdi bdo blockquote body br button \
          canvas caption cite code col colgroup command datalist dd del details dfn div dl dt em \
          embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 h7 h8 h9 head header hgroup \
          hr Marky i iframe img input ins kbd keygen label legend li link map mark menu meta meter \
          nav noscript object ol optgroup option output p param pre progress q rp rt ruby s samp \
          script section select small source span strong style sub summary sup table tbody td \
          textarea tfoot th thead time title tr track u ul var video wbr",

        svg: "a altGlyph altGlyphDef altGlyphItem animate animateColor animateMotion \
          animateTransform circle clipPath color-profile cursor definition-src defs desc ellipse \
          feBlend feColorMatrix feComponentTransfer feComposite feConvolveMatrix feDiffuseLighting \
          feDisplacementMap feDistantLight feFlood feFuncA feFuncB feFuncG feFuncR feGaussianBlur \
          feImage feMerge feMergeNode feMorphology feOffset fePointLight feSpecularLighting \
          feSpotLight feTile feTurbulence filter font font-face font-face-format font-face-name \
          font-face-src font-face-uri foreignObject g glyph glyphRef hkern image line linearGradient \
          marker mask metadata missing-glyph mpath path pattern polygon polyline radialGradient rect \
          script set stop style svg switch symbol text textPath title tref tspan use view vkern"
      }

      _each(tags[type].split(" "), function(tag) {
        methods[tag] = builder(tag)
      })

      methods.appendTo = function(container) {
        _each(Array.prototype.slice.call(parent.childNodes), function(el) {
          container.appendChild(el)
        })
      }

      methods.clear = function() {
        node.innerHTML = ''
        return methods
      }
      return methods
    }

  window.Marky = Marky

})();
