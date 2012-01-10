(function() {

  var MarkyElement = function(node) {
    var node = node
    return {
      set: function(attrs) {
        Object.keys(attrs).forEach(function(attr) {
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

          parent.appendChild(tag)

          if (txt) {
            if (type=='svg') {
              tag.textContent = txt
            } else {
              tag.innerHTML = txt
            }
          }

          if (attrs) {
            Object.keys(attrs).forEach(function(attr) {
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

      tags[type].split(" ").forEach(function(tag) {
        methods[tag] = builder(tag)
      })

      methods.appendTo = function(container) {
        //var children = parent.childNodes
        //for (var i = 0; i <= children.length; ++i) {
          Array.prototype.slice.call(parent.childNodes).forEach(function(el) {
            container.appendChild(el)
          })
          //container.appendChild(Array.prototype.slice.call(parent.childNodes))
        //}
      }

      return methods
    }

  window.Marky = Marky

})()
