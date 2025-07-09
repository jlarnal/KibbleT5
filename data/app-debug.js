(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
var n, l$2, u$2, i$1, r$1, o$1, e$1, f$2, c$2, s$2, a$2, h$2, p$2 = {}, v$2 = [], y$2 = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, w$2 = Array.isArray;
function d$2(n2, l2) {
  for (var u2 in l2) n2[u2] = l2[u2];
  return n2;
}
function g$1(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l2, u2, t2) {
  var i2, r2, o2, e2 = {};
  for (o2 in u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : e2[o2] = u2[o2];
  if (arguments.length > 2 && (e2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), "function" == typeof l2 && null != l2.defaultProps) for (o2 in l2.defaultProps) void 0 === e2[o2] && (e2[o2] = l2.defaultProps[o2]);
  return m$2(l2, e2, i2, r2, null);
}
function m$2(n2, t2, i2, r2, o2) {
  var e2 = { type: n2, props: t2, key: i2, ref: r2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u$2 : o2, __i: -1, __u: 0 };
  return null == o2 && null != l$2.vnode && l$2.vnode(e2), e2;
}
function k$2(n2) {
  return n2.children;
}
function x$1(n2, l2) {
  this.props = n2, this.context = l2;
}
function S(n2, l2) {
  if (null == l2) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u2; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) return u2.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C$1(n2) {
  var l2, u2;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l2 = 0; l2 < n2.__k.length; l2++) if (null != (u2 = n2.__k[l2]) && null != u2.__e) {
      n2.__e = n2.__c.base = u2.__e;
      break;
    }
    return C$1(n2);
  }
}
function M$1(n2) {
  (!n2.__d && (n2.__d = true) && i$1.push(n2) && !$$1.__r++ || r$1 != l$2.debounceRendering) && ((r$1 = l$2.debounceRendering) || o$1)($$1);
}
function $$1() {
  for (var n2, u2, t2, r2, o2, f2, c2, s2 = 1; i$1.length; ) i$1.length > s2 && i$1.sort(e$1), n2 = i$1.shift(), s2 = i$1.length, n2.__d && (t2 = void 0, o2 = (r2 = (u2 = n2).__v).__e, f2 = [], c2 = [], u2.__P && ((t2 = d$2({}, r2)).__v = r2.__v + 1, l$2.vnode && l$2.vnode(t2), O(u2.__P, t2, r2, u2.__n, u2.__P.namespaceURI, 32 & r2.__u ? [o2] : null, f2, null == o2 ? S(r2) : o2, !!(32 & r2.__u), c2), t2.__v = r2.__v, t2.__.__k[t2.__i] = t2, z$1(f2, t2, c2), t2.__e != o2 && C$1(t2)));
  $$1.__r = 0;
}
function I$1(n2, l2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, y2, w2, d2, g2, _2 = t2 && t2.__k || v$2, m2 = l2.length;
  for (f2 = P(u2, l2, _2, f2, m2), a2 = 0; a2 < m2; a2++) null != (y2 = u2.__k[a2]) && (h2 = -1 == y2.__i ? p$2 : _2[y2.__i] || p$2, y2.__i = a2, g2 = O(n2, y2, h2, i2, r2, o2, e2, f2, c2, s2), w2 = y2.__e, y2.ref && h2.ref != y2.ref && (h2.ref && q$1(h2.ref, null, y2), s2.push(y2.ref, y2.__c || w2, y2)), null == d2 && null != w2 && (d2 = w2), 4 & y2.__u || h2.__k === y2.__k ? f2 = A$1(y2, f2, n2) : "function" == typeof y2.type && void 0 !== g2 ? f2 = g2 : w2 && (f2 = w2.nextSibling), y2.__u &= -7);
  return u2.__e = d2, f2;
}
function P(n2, l2, u2, t2, i2) {
  var r2, o2, e2, f2, c2, s2 = u2.length, a2 = s2, h2 = 0;
  for (n2.__k = new Array(i2), r2 = 0; r2 < i2; r2++) null != (o2 = l2[r2]) && "boolean" != typeof o2 && "function" != typeof o2 ? (f2 = r2 + h2, (o2 = n2.__k[r2] = "string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? m$2(null, o2, null, null, null) : w$2(o2) ? m$2(k$2, { children: o2 }, null, null, null) : null == o2.constructor && o2.__b > 0 ? m$2(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : o2).__ = n2, o2.__b = n2.__b + 1, e2 = null, -1 != (c2 = o2.__i = L(o2, u2, f2, a2)) && (a2--, (e2 = u2[c2]) && (e2.__u |= 2)), null == e2 || null == e2.__v ? (-1 == c2 && (i2 > s2 ? h2-- : i2 < s2 && h2++), "function" != typeof o2.type && (o2.__u |= 4)) : c2 != f2 && (c2 == f2 - 1 ? h2-- : c2 == f2 + 1 ? h2++ : (c2 > f2 ? h2-- : h2++, o2.__u |= 4))) : n2.__k[r2] = null;
  if (a2) for (r2 = 0; r2 < s2; r2++) null != (e2 = u2[r2]) && 0 == (2 & e2.__u) && (e2.__e == t2 && (t2 = S(e2)), B$1(e2, e2));
  return t2;
}
function A$1(n2, l2, u2) {
  var t2, i2;
  if ("function" == typeof n2.type) {
    for (t2 = n2.__k, i2 = 0; t2 && i2 < t2.length; i2++) t2[i2] && (t2[i2].__ = n2, l2 = A$1(t2[i2], l2, u2));
    return l2;
  }
  n2.__e != l2 && (l2 && n2.type && !u2.contains(l2) && (l2 = S(n2)), u2.insertBefore(n2.__e, l2 || null), l2 = n2.__e);
  do {
    l2 = l2 && l2.nextSibling;
  } while (null != l2 && 8 == l2.nodeType);
  return l2;
}
function H(n2, l2) {
  return l2 = l2 || [], null == n2 || "boolean" == typeof n2 || (w$2(n2) ? n2.some(function(n3) {
    H(n3, l2);
  }) : l2.push(n2)), l2;
}
function L(n2, l2, u2, t2) {
  var i2, r2, o2 = n2.key, e2 = n2.type, f2 = l2[u2];
  if (null === f2 && null == n2.key || f2 && o2 == f2.key && e2 == f2.type && 0 == (2 & f2.__u)) return u2;
  if (t2 > (null != f2 && 0 == (2 & f2.__u) ? 1 : 0)) for (i2 = u2 - 1, r2 = u2 + 1; i2 >= 0 || r2 < l2.length; ) {
    if (i2 >= 0) {
      if ((f2 = l2[i2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type) return i2;
      i2--;
    }
    if (r2 < l2.length) {
      if ((f2 = l2[r2]) && 0 == (2 & f2.__u) && o2 == f2.key && e2 == f2.type) return r2;
      r2++;
    }
  }
  return -1;
}
function T$1(n2, l2, u2) {
  "-" == l2[0] ? n2.setProperty(l2, null == u2 ? "" : u2) : n2[l2] = null == u2 ? "" : "number" != typeof u2 || y$2.test(l2) ? u2 : u2 + "px";
}
function j$1(n2, l2, u2, t2, i2) {
  var r2, o2;
  n: if ("style" == l2) if ("string" == typeof u2) n2.style.cssText = u2;
  else {
    if ("string" == typeof t2 && (n2.style.cssText = t2 = ""), t2) for (l2 in t2) u2 && l2 in u2 || T$1(n2.style, l2, "");
    if (u2) for (l2 in u2) t2 && u2[l2] == t2[l2] || T$1(n2.style, l2, u2[l2]);
  }
  else if ("o" == l2[0] && "n" == l2[1]) r2 = l2 != (l2 = l2.replace(f$2, "$1")), o2 = l2.toLowerCase(), l2 = o2 in n2 || "onFocusOut" == l2 || "onFocusIn" == l2 ? o2.slice(2) : l2.slice(2), n2.l || (n2.l = {}), n2.l[l2 + r2] = u2, u2 ? t2 ? u2.u = t2.u : (u2.u = c$2, n2.addEventListener(l2, r2 ? a$2 : s$2, r2)) : n2.removeEventListener(l2, r2 ? a$2 : s$2, r2);
  else {
    if ("http://www.w3.org/2000/svg" == i2) l2 = l2.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l2 && "height" != l2 && "href" != l2 && "list" != l2 && "form" != l2 && "tabIndex" != l2 && "download" != l2 && "rowSpan" != l2 && "colSpan" != l2 && "role" != l2 && "popover" != l2 && l2 in n2) try {
      n2[l2] = null == u2 ? "" : u2;
      break n;
    } catch (n3) {
    }
    "function" == typeof u2 || (null == u2 || false === u2 && "-" != l2[4] ? n2.removeAttribute(l2) : n2.setAttribute(l2, "popover" == l2 && 1 == u2 ? "" : u2));
  }
}
function F(n2) {
  return function(u2) {
    if (this.l) {
      var t2 = this.l[u2.type + n2];
      if (null == u2.t) u2.t = c$2++;
      else if (u2.t < t2.u) return;
      return t2(l$2.event ? l$2.event(u2) : u2);
    }
  };
}
function O(n2, u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, p2, v2, y2, _2, m2, b2, S2, C2, M2, $2, P2, A2, H2, L2, T2, j2 = u2.type;
  if (null != u2.constructor) return null;
  128 & t2.__u && (c2 = !!(32 & t2.__u), o2 = [f2 = u2.__e = t2.__e]), (a2 = l$2.__b) && a2(u2);
  n: if ("function" == typeof j2) try {
    if (b2 = u2.props, S2 = "prototype" in j2 && j2.prototype.render, C2 = (a2 = j2.contextType) && i2[a2.__c], M2 = a2 ? C2 ? C2.props.value : a2.__ : i2, t2.__c ? m2 = (h2 = u2.__c = t2.__c).__ = h2.__E : (S2 ? u2.__c = h2 = new j2(b2, M2) : (u2.__c = h2 = new x$1(b2, M2), h2.constructor = j2, h2.render = D$2), C2 && C2.sub(h2), h2.props = b2, h2.state || (h2.state = {}), h2.context = M2, h2.__n = i2, p2 = h2.__d = true, h2.__h = [], h2._sb = []), S2 && null == h2.__s && (h2.__s = h2.state), S2 && null != j2.getDerivedStateFromProps && (h2.__s == h2.state && (h2.__s = d$2({}, h2.__s)), d$2(h2.__s, j2.getDerivedStateFromProps(b2, h2.__s))), v2 = h2.props, y2 = h2.state, h2.__v = u2, p2) S2 && null == j2.getDerivedStateFromProps && null != h2.componentWillMount && h2.componentWillMount(), S2 && null != h2.componentDidMount && h2.__h.push(h2.componentDidMount);
    else {
      if (S2 && null == j2.getDerivedStateFromProps && b2 !== v2 && null != h2.componentWillReceiveProps && h2.componentWillReceiveProps(b2, M2), !h2.__e && null != h2.shouldComponentUpdate && false === h2.shouldComponentUpdate(b2, h2.__s, M2) || u2.__v == t2.__v) {
        for (u2.__v != t2.__v && (h2.props = b2, h2.state = h2.__s, h2.__d = false), u2.__e = t2.__e, u2.__k = t2.__k, u2.__k.some(function(n3) {
          n3 && (n3.__ = u2);
        }), $2 = 0; $2 < h2._sb.length; $2++) h2.__h.push(h2._sb[$2]);
        h2._sb = [], h2.__h.length && e2.push(h2);
        break n;
      }
      null != h2.componentWillUpdate && h2.componentWillUpdate(b2, h2.__s, M2), S2 && null != h2.componentDidUpdate && h2.__h.push(function() {
        h2.componentDidUpdate(v2, y2, _2);
      });
    }
    if (h2.context = M2, h2.props = b2, h2.__P = n2, h2.__e = false, P2 = l$2.__r, A2 = 0, S2) {
      for (h2.state = h2.__s, h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), H2 = 0; H2 < h2._sb.length; H2++) h2.__h.push(h2._sb[H2]);
      h2._sb = [];
    } else do {
      h2.__d = false, P2 && P2(u2), a2 = h2.render(h2.props, h2.state, h2.context), h2.state = h2.__s;
    } while (h2.__d && ++A2 < 25);
    h2.state = h2.__s, null != h2.getChildContext && (i2 = d$2(d$2({}, i2), h2.getChildContext())), S2 && !p2 && null != h2.getSnapshotBeforeUpdate && (_2 = h2.getSnapshotBeforeUpdate(v2, y2)), L2 = a2, null != a2 && a2.type === k$2 && null == a2.key && (L2 = N(a2.props.children)), f2 = I$1(n2, w$2(L2) ? L2 : [L2], u2, t2, i2, r2, o2, e2, f2, c2, s2), h2.base = u2.__e, u2.__u &= -161, h2.__h.length && e2.push(h2), m2 && (h2.__E = h2.__ = null);
  } catch (n3) {
    if (u2.__v = null, c2 || null != o2) if (n3.then) {
      for (u2.__u |= c2 ? 160 : 128; f2 && 8 == f2.nodeType && f2.nextSibling; ) f2 = f2.nextSibling;
      o2[o2.indexOf(f2)] = null, u2.__e = f2;
    } else for (T2 = o2.length; T2--; ) g$1(o2[T2]);
    else u2.__e = t2.__e, u2.__k = t2.__k;
    l$2.__e(n3, u2, t2);
  }
  else null == o2 && u2.__v == t2.__v ? (u2.__k = t2.__k, u2.__e = t2.__e) : f2 = u2.__e = V(t2.__e, u2, t2, i2, r2, o2, e2, c2, s2);
  return (a2 = l$2.diffed) && a2(u2), 128 & u2.__u ? void 0 : f2;
}
function z$1(n2, u2, t2) {
  for (var i2 = 0; i2 < t2.length; i2++) q$1(t2[i2], t2[++i2], t2[++i2]);
  l$2.__c && l$2.__c(u2, n2), n2.some(function(u3) {
    try {
      n2 = u3.__h, u3.__h = [], n2.some(function(n3) {
        n3.call(u3);
      });
    } catch (n3) {
      l$2.__e(n3, u3.__v);
    }
  });
}
function N(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w$2(n2) ? n2.map(N) : d$2({}, n2);
}
function V(u2, t2, i2, r2, o2, e2, f2, c2, s2) {
  var a2, h2, v2, y2, d2, _2, m2, b2 = i2.props, k2 = t2.props, x2 = t2.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e2) {
    for (a2 = 0; a2 < e2.length; a2++) if ((d2 = e2[a2]) && "setAttribute" in d2 == !!x2 && (x2 ? d2.localName == x2 : 3 == d2.nodeType)) {
      u2 = d2, e2[a2] = null;
      break;
    }
  }
  if (null == u2) {
    if (null == x2) return document.createTextNode(k2);
    u2 = document.createElementNS(o2, x2, k2.is && k2), c2 && (l$2.__m && l$2.__m(t2, e2), c2 = false), e2 = null;
  }
  if (null == x2) b2 === k2 || c2 && u2.data == k2 || (u2.data = k2);
  else {
    if (e2 = e2 && n.call(u2.childNodes), b2 = i2.props || p$2, !c2 && null != e2) for (b2 = {}, a2 = 0; a2 < u2.attributes.length; a2++) b2[(d2 = u2.attributes[a2]).name] = d2.value;
    for (a2 in b2) if (d2 = b2[a2], "children" == a2) ;
    else if ("dangerouslySetInnerHTML" == a2) v2 = d2;
    else if (!(a2 in k2)) {
      if ("value" == a2 && "defaultValue" in k2 || "checked" == a2 && "defaultChecked" in k2) continue;
      j$1(u2, a2, null, d2, o2);
    }
    for (a2 in k2) d2 = k2[a2], "children" == a2 ? y2 = d2 : "dangerouslySetInnerHTML" == a2 ? h2 = d2 : "value" == a2 ? _2 = d2 : "checked" == a2 ? m2 = d2 : c2 && "function" != typeof d2 || b2[a2] === d2 || j$1(u2, a2, d2, b2[a2], o2);
    if (h2) c2 || v2 && (h2.__html == v2.__html || h2.__html == u2.innerHTML) || (u2.innerHTML = h2.__html), t2.__k = [];
    else if (v2 && (u2.innerHTML = ""), I$1("template" == t2.type ? u2.content : u2, w$2(y2) ? y2 : [y2], t2, i2, r2, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e2, f2, e2 ? e2[0] : i2.__k && S(i2, 0), c2, s2), null != e2) for (a2 = e2.length; a2--; ) g$1(e2[a2]);
    c2 || (a2 = "value", "progress" == x2 && null == _2 ? u2.removeAttribute("value") : null != _2 && (_2 !== u2[a2] || "progress" == x2 && !_2 || "option" == x2 && _2 != b2[a2]) && j$1(u2, a2, _2, b2[a2], o2), a2 = "checked", null != m2 && m2 != u2[a2] && j$1(u2, a2, m2, b2[a2], o2));
  }
  return u2;
}
function q$1(n2, u2, t2) {
  try {
    if ("function" == typeof n2) {
      var i2 = "function" == typeof n2.__u;
      i2 && n2.__u(), i2 && null == u2 || (n2.__u = n2(u2));
    } else n2.current = u2;
  } catch (n3) {
    l$2.__e(n3, t2);
  }
}
function B$1(n2, u2, t2) {
  var i2, r2;
  if (l$2.unmount && l$2.unmount(n2), (i2 = n2.ref) && (i2.current && i2.current != n2.__e || q$1(i2, null, u2)), null != (i2 = n2.__c)) {
    if (i2.componentWillUnmount) try {
      i2.componentWillUnmount();
    } catch (n3) {
      l$2.__e(n3, u2);
    }
    i2.base = i2.__P = null;
  }
  if (i2 = n2.__k) for (r2 = 0; r2 < i2.length; r2++) i2[r2] && B$1(i2[r2], u2, t2 || "function" != typeof n2.type);
  t2 || g$1(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function D$2(n2, l2, u2) {
  return this.constructor(n2, u2);
}
function E(u2, t2, i2) {
  var r2, o2, e2, f2;
  t2 == document && (t2 = document.documentElement), l$2.__ && l$2.__(u2, t2), o2 = (r2 = false) ? null : t2.__k, e2 = [], f2 = [], O(t2, u2 = t2.__k = _(k$2, null, [u2]), o2 || p$2, p$2, t2.namespaceURI, o2 ? null : t2.firstChild ? n.call(t2.childNodes) : null, e2, o2 ? o2.__e : t2.firstChild, r2, f2), z$1(e2, u2, f2);
}
function J(l2, u2, t2) {
  var i2, r2, o2, e2, f2 = d$2({}, l2.props);
  for (o2 in l2.type && l2.type.defaultProps && (e2 = l2.type.defaultProps), u2) "key" == o2 ? i2 = u2[o2] : "ref" == o2 ? r2 = u2[o2] : f2[o2] = void 0 === u2[o2] && null != e2 ? e2[o2] : u2[o2];
  return arguments.length > 2 && (f2.children = arguments.length > 3 ? n.call(arguments, 2) : t2), m$2(l2.type, f2, i2 || l2.key, r2 || l2.ref, null);
}
function K(n2) {
  function l2(n3) {
    var u2, t2;
    return this.getChildContext || (u2 = /* @__PURE__ */ new Set(), (t2 = {})[l2.__c] = this, this.getChildContext = function() {
      return t2;
    }, this.componentWillUnmount = function() {
      u2 = null;
    }, this.shouldComponentUpdate = function(n4) {
      this.props.value != n4.value && u2.forEach(function(n5) {
        n5.__e = true, M$1(n5);
      });
    }, this.sub = function(n4) {
      u2.add(n4);
      var l3 = n4.componentWillUnmount;
      n4.componentWillUnmount = function() {
        u2 && u2.delete(n4), l3 && l3.call(n4);
      };
    }), n3.children;
  }
  return l2.__c = "__cC" + h$2++, l2.__ = n2, l2.Provider = l2.__l = (l2.Consumer = function(n3, l3) {
    return n3.children(l3);
  }).contextType = l2, l2;
}
n = v$2.slice, l$2 = { __e: function(n2, l2, u2, t2) {
  for (var i2, r2, o2; l2 = l2.__; ) if ((i2 = l2.__c) && !i2.__) try {
    if ((r2 = i2.constructor) && null != r2.getDerivedStateFromError && (i2.setState(r2.getDerivedStateFromError(n2)), o2 = i2.__d), null != i2.componentDidCatch && (i2.componentDidCatch(n2, t2 || {}), o2 = i2.__d), o2) return i2.__E = i2;
  } catch (l3) {
    n2 = l3;
  }
  throw n2;
} }, u$2 = 0, x$1.prototype.setState = function(n2, l2) {
  var u2;
  u2 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d$2({}, this.state), "function" == typeof n2 && (n2 = n2(d$2({}, u2), this.props)), n2 && d$2(u2, n2), null != n2 && this.__v && (l2 && this._sb.push(l2), M$1(this));
}, x$1.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M$1(this));
}, x$1.prototype.render = k$2, i$1 = [], o$1 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e$1 = function(n2, l2) {
  return n2.__v.__b - l2.__v.__b;
}, $$1.__r = 0, f$2 = /(PointerCapture)$|Capture$/i, c$2 = 0, s$2 = F(false), a$2 = F(true), h$2 = 0;
var f$1 = 0;
function u$1(e2, t2, n2, o2, i2, u2) {
  t2 || (t2 = {});
  var a2, c2, p2 = t2;
  if ("ref" in p2) for (c2 in p2 = {}, t2) "ref" == c2 ? a2 = t2[c2] : p2[c2] = t2[c2];
  var l2 = { type: e2, props: p2, key: n2, ref: a2, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f$1, __i: -1, __u: 0, __source: i2, __self: u2 };
  if ("function" == typeof e2 && (a2 = e2.defaultProps)) for (c2 in a2) void 0 === p2[c2] && (p2[c2] = a2[c2]);
  return l$2.vnode && l$2.vnode(l2), l2;
}
var t, r, u, i, o = 0, f = [], c$1 = l$2, e = c$1.__b, a$1 = c$1.__r, v$1 = c$1.diffed, l$1 = c$1.__c, m$1 = c$1.unmount, s$1 = c$1.__;
function p$1(n2, t2) {
  c$1.__h && c$1.__h(r, n2, o || t2), o = 0;
  var u2 = r.__H || (r.__H = { __: [], __h: [] });
  return n2 >= u2.__.length && u2.__.push({}), u2.__[n2];
}
function d$1(n2) {
  return o = 1, h$1(D$1, n2);
}
function h$1(n2, u2, i2) {
  var o2 = p$1(t++, 2);
  if (o2.t = n2, !o2.__c && (o2.__ = [D$1(void 0, u2), function(n3) {
    var t2 = o2.__N ? o2.__N[0] : o2.__[0], r2 = o2.t(t2, n3);
    t2 !== r2 && (o2.__N = [r2, o2.__[1]], o2.__c.setState({}));
  }], o2.__c = r, !r.__f)) {
    var f2 = function(n3, t2, r2) {
      if (!o2.__c.__H) return true;
      var u3 = o2.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u3.every(function(n4) {
        return !n4.__N;
      })) return !c2 || c2.call(this, n3, t2, r2);
      var i3 = o2.__c.props !== n3;
      return u3.forEach(function(n4) {
        if (n4.__N) {
          var t3 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t3 !== n4.__[0] && (i3 = true);
        }
      }), c2 && c2.call(this, n3, t2, r2) || i3;
    };
    r.__f = true;
    var c2 = r.shouldComponentUpdate, e2 = r.componentWillUpdate;
    r.componentWillUpdate = function(n3, t2, r2) {
      if (this.__e) {
        var u3 = c2;
        c2 = void 0, f2(n3, t2, r2), c2 = u3;
      }
      e2 && e2.call(this, n3, t2, r2);
    }, r.shouldComponentUpdate = f2;
  }
  return o2.__N || o2.__;
}
function y$1(n2, u2) {
  var i2 = p$1(t++, 3);
  !c$1.__s && C(i2.__H, u2) && (i2.__ = n2, i2.u = u2, r.__H.__h.push(i2));
}
function A(n2) {
  return o = 5, T(function() {
    return { current: n2 };
  }, []);
}
function T(n2, r2) {
  var u2 = p$1(t++, 7);
  return C(u2.__H, r2) && (u2.__ = n2(), u2.__H = r2, u2.__h = n2), u2.__;
}
function q(n2, t2) {
  return o = 8, T(function() {
    return n2;
  }, t2);
}
function x(n2) {
  var u2 = r.context[n2.__c], i2 = p$1(t++, 9);
  return i2.c = n2, u2 ? (null == i2.__ && (i2.__ = true, u2.sub(r)), u2.props.value) : n2.__;
}
function j() {
  for (var n2; n2 = f.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z), n2.__H.__h.forEach(B), n2.__H.__h = [];
  } catch (t2) {
    n2.__H.__h = [], c$1.__e(t2, n2.__v);
  }
}
c$1.__b = function(n2) {
  r = null, e && e(n2);
}, c$1.__ = function(n2, t2) {
  n2 && t2.__k && t2.__k.__m && (n2.__m = t2.__k.__m), s$1 && s$1(n2, t2);
}, c$1.__r = function(n2) {
  a$1 && a$1(n2), t = 0;
  var i2 = (r = n2.__c).__H;
  i2 && (u === r ? (i2.__h = [], r.__h = [], i2.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i2.__h.forEach(z), i2.__h.forEach(B), i2.__h = [], t = 0)), u = r;
}, c$1.diffed = function(n2) {
  v$1 && v$1(n2);
  var t2 = n2.__c;
  t2 && t2.__H && (t2.__H.__h.length && (1 !== f.push(t2) && i === c$1.requestAnimationFrame || ((i = c$1.requestAnimationFrame) || w$1)(j)), t2.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u = r = null;
}, c$1.__c = function(n2, t2) {
  t2.some(function(n3) {
    try {
      n3.__h.forEach(z), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B(n4);
      });
    } catch (r2) {
      t2.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t2 = [], c$1.__e(r2, n3.__v);
    }
  }), l$1 && l$1(n2, t2);
}, c$1.unmount = function(n2) {
  m$1 && m$1(n2);
  var t2, r2 = n2.__c;
  r2 && r2.__H && (r2.__H.__.forEach(function(n3) {
    try {
      z(n3);
    } catch (n4) {
      t2 = n4;
    }
  }), r2.__H = void 0, t2 && c$1.__e(t2, r2.__v));
};
var k$1 = "function" == typeof requestAnimationFrame;
function w$1(n2) {
  var t2, r2 = function() {
    clearTimeout(u2), k$1 && cancelAnimationFrame(t2), setTimeout(n2);
  }, u2 = setTimeout(r2, 35);
  k$1 && (t2 = requestAnimationFrame(r2));
}
function z(n2) {
  var t2 = r, u2 = n2.__c;
  "function" == typeof u2 && (n2.__c = void 0, u2()), r = t2;
}
function B(n2) {
  var t2 = r;
  n2.__c = n2.__(), r = t2;
}
function C(n2, t2) {
  return !n2 || n2.length !== t2.length || t2.some(function(t3, r2) {
    return t3 !== n2[r2];
  });
}
function D$1(n2, t2) {
  return "function" == typeof t2 ? t2(n2) : t2;
}
var a = {};
function c(n2, t2) {
  for (var r2 in t2) n2[r2] = t2[r2];
  return n2;
}
function s(n2, t2, r2) {
  var i2, o2 = /(?:\?([^#]*))?(#.*)?$/, e2 = n2.match(o2), u2 = {};
  if (e2 && e2[1]) for (var f2 = e2[1].split("&"), c2 = 0; c2 < f2.length; c2++) {
    var s2 = f2[c2].split("=");
    u2[decodeURIComponent(s2[0])] = decodeURIComponent(s2.slice(1).join("="));
  }
  n2 = d(n2.replace(o2, "")), t2 = d(t2 || "");
  for (var h2 = Math.max(n2.length, t2.length), v2 = 0; v2 < h2; v2++) if (t2[v2] && ":" === t2[v2].charAt(0)) {
    var l2 = t2[v2].replace(/(^:|[+*?]+$)/g, ""), p2 = (t2[v2].match(/[+*?]+$/) || a)[0] || "", m2 = ~p2.indexOf("+"), y2 = ~p2.indexOf("*"), U2 = n2[v2] || "";
    if (!U2 && !y2 && (p2.indexOf("?") < 0 || m2)) {
      i2 = false;
      break;
    }
    if (u2[l2] = decodeURIComponent(U2), m2 || y2) {
      u2[l2] = n2.slice(v2).map(decodeURIComponent).join("/");
      break;
    }
  } else if (t2[v2] !== n2[v2]) {
    i2 = false;
    break;
  }
  return (true === r2.default || false !== i2) && u2;
}
function h(n2, t2) {
  return n2.rank < t2.rank ? 1 : n2.rank > t2.rank ? -1 : n2.index - t2.index;
}
function v(n2, t2) {
  return n2.index = t2, n2.rank = function(n3) {
    return n3.props.default ? 0 : d(n3.props.path).map(l).join("");
  }(n2), n2.props;
}
function d(n2) {
  return n2.replace(/(^\/+|\/+$)/g, "").split("/");
}
function l(n2) {
  return ":" == n2.charAt(0) ? 1 + "*+?".indexOf(n2.charAt(n2.length - 1)) || 4 : 5;
}
var p = {}, m = [], y = [], U = null, g = { url: R() }, k = K(g);
function R() {
  var n2;
  return "" + ((n2 = U && U.location ? U.location : U && U.getCurrentLocation ? U.getCurrentLocation() : "undefined" != typeof location ? location : p).pathname || "") + (n2.search || "");
}
function $(n2, t2) {
  return void 0 === t2 && (t2 = false), "string" != typeof n2 && n2.url && (t2 = n2.replace, n2 = n2.url), function(n3) {
    for (var t3 = m.length; t3--; ) if (m[t3].canRoute(n3)) return true;
    return false;
  }(n2) && function(n3, t3) {
    void 0 === t3 && (t3 = "push"), U && U[t3] ? U[t3](n3) : "undefined" != typeof history && history[t3 + "State"] && history[t3 + "State"](null, null, n3);
  }(n2, t2 ? "replace" : "push"), I(n2);
}
function I(n2) {
  for (var t2 = false, r2 = 0; r2 < m.length; r2++) m[r2].routeTo(n2) && (t2 = true);
  return t2;
}
function M(n2) {
  if (n2 && n2.getAttribute) {
    var t2 = n2.getAttribute("href"), r2 = n2.getAttribute("target");
    if (t2 && t2.match(/^\//g) && (!r2 || r2.match(/^_?self$/i))) return $(t2);
  }
}
function b(n2) {
  return n2.stopImmediatePropagation && n2.stopImmediatePropagation(), n2.stopPropagation && n2.stopPropagation(), n2.preventDefault(), false;
}
function W(n2) {
  if (!(n2.ctrlKey || n2.metaKey || n2.altKey || n2.shiftKey || n2.button)) {
    var t2 = n2.target;
    do {
      if ("a" === t2.localName && t2.getAttribute("href")) {
        if (t2.hasAttribute("data-native") || t2.hasAttribute("native")) return;
        if (M(t2)) return b(n2);
      }
    } while (t2 = t2.parentNode);
  }
}
var w = false;
function D(n2) {
  n2.history && (U = n2.history), this.state = { url: n2.url || R() };
}
c(D.prototype = new x$1(), { shouldComponentUpdate: function(n2) {
  return true !== n2.static || n2.url !== this.props.url || n2.onChange !== this.props.onChange;
}, canRoute: function(n2) {
  var t2 = H(this.props.children);
  return void 0 !== this.g(t2, n2);
}, routeTo: function(n2) {
  this.setState({ url: n2 });
  var t2 = this.canRoute(n2);
  return this.p || this.forceUpdate(), t2;
}, componentWillMount: function() {
  this.p = true;
}, componentDidMount: function() {
  var n2 = this;
  w || (w = true, U || addEventListener("popstate", function() {
    I(R());
  }), addEventListener("click", W)), m.push(this), U && (this.u = U.listen(function(t2) {
    var r2 = t2.location || t2;
    n2.routeTo("" + (r2.pathname || "") + (r2.search || ""));
  })), this.p = false;
}, componentWillUnmount: function() {
  "function" == typeof this.u && this.u(), m.splice(m.indexOf(this), 1);
}, componentWillUpdate: function() {
  this.p = true;
}, componentDidUpdate: function() {
  this.p = false;
}, g: function(n2, t2) {
  n2 = n2.filter(v).sort(h);
  for (var r2 = 0; r2 < n2.length; r2++) {
    var i2 = n2[r2], o2 = s(t2, i2.props.path, i2.props);
    if (o2) return [i2, o2];
  }
}, render: function(n2, t2) {
  var e2, u2, f2 = n2.onChange, a2 = t2.url, s2 = this.c, h2 = this.g(H(n2.children), a2);
  if (h2 && (u2 = J(h2[0], c(c({ url: a2, matches: e2 = h2[1] }, e2), { key: void 0, ref: void 0 }))), a2 !== (s2 && s2.url)) {
    c(g, s2 = this.c = { url: a2, previous: s2 && s2.url, current: u2, path: u2 ? u2.props.path : null, matches: e2 }), s2.router = this, s2.active = u2 ? [u2] : [];
    for (var v2 = y.length; v2--; ) y[v2]({});
    "function" == typeof f2 && f2(s2);
  }
  return _(k.Provider, { value: s2 }, u2);
} });
const ApiContext = K();
const createMockData = () => {
  {
    return { tanks: [], recipes: [], settings: {}, system: {}, scale: {} };
  }
};
function ApiProvider({ children }) {
  const [data, setData] = d$1(createMockData());
  const [loading, setLoading] = d$1(false);
  const [error, setError] = d$1(null);
  const baseUrl = "";
  const getMockResponse = (endpoint, options) => {
    {
      console.error("Mock response called in production build!");
      return { success: false, error: "Mock data not available in production" };
    }
  };
  const apiCall = q(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const url = false ? `/api${endpoint}` : `${baseUrl}${endpoint}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5e3);
      try {
        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers
          },
          signal: controller.signal,
          ...options
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const responseData = await response.json();
        if (false) ;
        return responseData;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (false) ;
        throw fetchError;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);
  const updateLocalData = (endpoint, options, response) => {
    return;
  };
  const value = {
    data,
    loading,
    error,
    apiCall,
    // System endpoints
    getSystemInfo: () => apiCall("/system/info"),
    getSystemStatus: () => apiCall("/system/status"),
    restartSystem: () => apiCall("/system/restart", { method: "POST" }),
    factoryReset: () => apiCall("/system/factory-reset", { method: "POST" }),
    // Settings endpoints  
    getSettings: () => apiCall("/settings"),
    updateSettings: (settings) => apiCall("/settings", {
      method: "PUT",
      body: JSON.stringify(settings)
    }),
    exportSettings: () => apiCall("/settings/export"),
    // Tank endpoints
    getTanks: () => apiCall("/tanks"),
    getTank: (uid) => apiCall(`/tanks/${uid}`),
    updateTank: (uid, updates) => apiCall(`/tanks/${uid}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    }),
    getTankHistory: (uid) => apiCall(`/tanks/${uid}/history`),
    // Feeding endpoints
    feedImmediate: (tankUid, amount = null) => apiCall(`/feed/immediate/${tankUid}`, {
      method: "POST",
      body: JSON.stringify({ amount, reason: "manual" })
    }),
    feedRecipe: (recipeId, servings = 1) => apiCall(`/feed/recipe/${recipeId}`, {
      method: "POST",
      body: JSON.stringify({ servings })
    }),
    emergencyFeed: (amount = 10) => apiCall("/feed/emergency", {
      method: "POST",
      body: JSON.stringify({ amount })
    }),
    getFeedHistory: () => apiCall("/feed/history"),
    // Recipe endpoints
    getRecipes: () => apiCall("/recipes"),
    createRecipe: (recipe) => apiCall("/recipes", {
      method: "POST",
      body: JSON.stringify(recipe)
    }),
    updateRecipe: (id, updates) => apiCall(`/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    }),
    deleteRecipe: (id) => apiCall(`/recipes/${id}`, {
      method: "DELETE"
    }),
    // Scale endpoints
    getCurrentScale: () => apiCall("/scale/current"),
    tareScale: () => apiCall("/scale/tare", { method: "POST" }),
    calibrateScale: (knownWeight, currentReading) => apiCall("/scale/calibrate", {
      method: "POST",
      body: JSON.stringify({ knownWeight, currentReading })
    }),
    // Calibration endpoints
    getServoCalibration: () => apiCall("/calibration/servos"),
    updateServoCalibration: (config) => apiCall("/calibration/servos", {
      method: "PUT",
      body: JSON.stringify(config)
    }),
    testServo: (type, id, position, duration = 1e3) => apiCall("/calibration/servo-test", {
      method: "POST",
      body: JSON.stringify({ type, id, position, duration })
    }),
    testTankDispense: (tankUid, targetAmount, duration) => apiCall("/calibration/tank-dispense-test", {
      method: "POST",
      body: JSON.stringify({ tankId: tankUid, targetAmount, duration })
    }),
    // Diagnostics endpoints
    getSensorDiagnostics: () => apiCall("/diagnostics/sensors"),
    getServoDiagnostics: () => apiCall("/diagnostics/servos"),
    getNetworkInfo: () => apiCall("/network/info"),
    getSystemLogs: () => apiCall("/logs/system"),
    getFeedingLogs: () => apiCall("/logs/feeding")
  };
  return /* @__PURE__ */ u$1(ApiContext.Provider, { value, children });
}
const useApi = () => {
  const context = x(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};
function Header() {
  const { data } = useApi();
  const settings = (data == null ? void 0 : data.settings) || {};
  const getWifiStrength = (rssi) => {
    if (rssi > -50) return { bars: 4, color: "text-success" };
    if (rssi > -60) return { bars: 3, color: "text-success" };
    if (rssi > -70) return { bars: 2, color: "text-warning" };
    if (rssi > -80) return { bars: 1, color: "text-error" };
    return { bars: 0, color: "text-gray-500" };
  };
  const wifi = getWifiStrength(settings.wifiStrength);
  const currentTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  return /* @__PURE__ */ u$1("header", { className: "bg-dark-surface border-b border-gray-700/50 px-4 py-3 sticky top-0 z-50", children: /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-3", children: [
      /* @__PURE__ */ u$1("div", { className: "text-2xl", children: "🐱" }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("h1", { className: "text-lg font-semibold text-accent-primary", children: "Kittyble" }),
        /* @__PURE__ */ u$1("p", { className: "text-xs text-gray-400", children: settings.deviceName || "KibbleT5" })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ u$1("div", { className: "text-right", children: [
        /* @__PURE__ */ u$1("div", { className: "text-sm font-mono text-white", children: currentTime }),
        /* @__PURE__ */ u$1("div", { className: "text-xs text-gray-400", children: "Local" })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-1", children: /* @__PURE__ */ u$1("div", { className: `text-xs ${wifi.color}`, children: /* @__PURE__ */ u$1("div", { className: "flex items-end space-x-0.5 h-4", children: [
        /* @__PURE__ */ u$1("div", { className: `w-1 bg-current ${wifi.bars >= 1 ? "h-1" : "h-1 opacity-30"}` }),
        /* @__PURE__ */ u$1("div", { className: `w-1 bg-current ${wifi.bars >= 2 ? "h-2" : "h-2 opacity-30"}` }),
        /* @__PURE__ */ u$1("div", { className: `w-1 bg-current ${wifi.bars >= 3 ? "h-3" : "h-3 opacity-30"}` }),
        /* @__PURE__ */ u$1("div", { className: `w-1 bg-current ${wifi.bars >= 4 ? "h-4" : "h-4 opacity-30"}` })
      ] }) }) })
    ] })
  ] }) });
}
function Navigation({ currentRoute }) {
  const navItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: "🏠",
      activeIcon: "🏠"
    },
    {
      path: "/tanks",
      label: "Tanks",
      icon: "🥫",
      activeIcon: "🥫"
    },
    {
      path: "/recipes",
      label: "Recipes",
      icon: "🥄",
      activeIcon: "🥄"
    },
    {
      path: "/settings",
      label: "Settings",
      icon: "⚙️",
      activeIcon: "⚙️"
    }
  ];
  const handleNavClick = (path) => {
    $(path);
  };
  return /* @__PURE__ */ u$1("nav", { className: "fixed bottom-0 left-0 right-0 bg-dark-surface border-t border-gray-700/50 z-50", children: /* @__PURE__ */ u$1("div", { className: "flex", children: navItems.map((item) => {
    const isActive = currentRoute === item.path;
    return /* @__PURE__ */ u$1(
      "button",
      {
        onClick: () => handleNavClick(item.path),
        className: `flex-1 flex flex-col items-center py-3 px-2 transition-colors duration-200 ${isActive ? "text-accent-primary bg-accent-primary/10" : "text-gray-400 hover:text-gray-200 active:bg-gray-800/50"}`,
        children: [
          /* @__PURE__ */ u$1("div", { className: "text-xl mb-1", children: isActive ? item.activeIcon : item.icon }),
          /* @__PURE__ */ u$1("span", { className: "text-xs font-medium", children: item.label }),
          isActive && /* @__PURE__ */ u$1("div", { className: "absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-accent-primary rounded-full" })
        ]
      },
      item.path
    );
  }) }) });
}
function Dashboard() {
  const { data, feedImmediate, emergencyFeed, loading } = useApi();
  const [feedingStatus, setFeedingStatus] = d$1({});
  const tanks = (data == null ? void 0 : data.tanks) || [];
  const getTankStatus = (level) => {
    if (level >= 70) return { status: "full", class: "tank-full" };
    if (level >= 40) return { status: "medium", class: "tank-medium" };
    if (level >= 15) return { status: "low", class: "tank-low" };
    return { status: "empty", class: "tank-empty" };
  };
  const getTimeSinceLastDispensed = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1e3 * 60 * 60));
    const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
    if (hours > 0) {
      return `${hours}h ${minutes}m ago`;
    }
    return `${minutes}m ago`;
  };
  const handleFeedTank = async (tankUid) => {
    try {
      setFeedingStatus((prev) => ({ ...prev, [tankUid]: "feeding" }));
      const response = await feedImmediate(tankUid, 25);
      setFeedingStatus((prev) => ({ ...prev, [tankUid]: "success" }));
      setTimeout(() => {
        setFeedingStatus((prev) => ({ ...prev, [tankUid]: null }));
      }, 2e3);
    } catch (error) {
      setFeedingStatus((prev) => ({ ...prev, [tankUid]: "error" }));
      setTimeout(() => {
        setFeedingStatus((prev) => ({ ...prev, [tankUid]: null }));
      }, 3e3);
    }
  };
  const handleEmergencyFeed = async () => {
    try {
      setFeedingStatus((prev) => ({ ...prev, emergency: "feeding" }));
      await emergencyFeed(10);
      setFeedingStatus((prev) => ({ ...prev, emergency: "success" }));
      setTimeout(() => {
        setFeedingStatus((prev) => ({ ...prev, emergency: null }));
      }, 3e3);
    } catch (error) {
      setFeedingStatus((prev) => ({ ...prev, emergency: "error" }));
      setTimeout(() => {
        setFeedingStatus((prev) => ({ ...prev, emergency: null }));
      }, 3e3);
    }
  };
  const formatTankUid = (uid) => {
    return uid.slice(-4).toUpperCase();
  };
  return /* @__PURE__ */ u$1("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ u$1("div", { className: "text-center py-6", children: [
      /* @__PURE__ */ u$1("h1", { className: "text-3xl font-bold text-accent-primary mb-2", children: "🐱 Kittyble" }),
      /* @__PURE__ */ u$1("p", { className: "text-gray-400", children: "Keep your cats happy and fed" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-4", children: [
      /* @__PURE__ */ u$1("div", { className: "card text-center", children: [
        /* @__PURE__ */ u$1("div", { className: "text-2xl font-bold text-accent-primary", children: tanks.length }),
        /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: "Active Tanks" })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "card text-center", children: [
        /* @__PURE__ */ u$1("div", { className: "text-2xl font-bold text-accent-secondary", children: tanks.filter((tank) => getTankStatus(tank.level).status !== "empty").length }),
        /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: "Ready to Feed" })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
      /* @__PURE__ */ u$1("h2", { className: "text-xl font-semibold text-white", children: "Tank Status" }),
      tanks.map((tank) => {
        const { status, class: statusClass } = getTankStatus(tank.level);
        const feedStatus = feedingStatus[tank.uid];
        const currentWeight = Math.round(tank.level / 100 * tank.capacity * tank.density);
        return /* @__PURE__ */ u$1("div", { className: "card", children: [
          /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-3", children: [
              /* @__PURE__ */ u$1("div", { className: `tank-indicator ${statusClass}` }),
              /* @__PURE__ */ u$1("div", { children: [
                /* @__PURE__ */ u$1("h3", { className: "font-semibold text-white", children: tank.name }),
                /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2 text-sm text-gray-400", children: [
                  /* @__PURE__ */ u$1("span", { children: [
                    "UID: ",
                    formatTankUid(tank.uid)
                  ] }),
                  /* @__PURE__ */ u$1("span", { children: "•" }),
                  /* @__PURE__ */ u$1("span", { children: [
                    "Density: ",
                    tank.density,
                    "g/cm³"
                  ] })
                ] }),
                /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-400", children: [
                  "Last dispensed: ",
                  getTimeSinceLastDispensed(tank.lastDispensed)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "text-right", children: [
              /* @__PURE__ */ u$1("div", { className: "text-lg font-bold text-white", children: [
                tank.level,
                "%"
              ] }),
              /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: [
                currentWeight,
                "g"
              ] }),
              /* @__PURE__ */ u$1("div", { className: "text-xs text-gray-400 capitalize", children: status })
            ] })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "mb-4", children: /* @__PURE__ */ u$1("div", { className: "w-full bg-dark-surface rounded-full h-2", children: /* @__PURE__ */ u$1(
            "div",
            {
              className: `h-2 rounded-full transition-all duration-300 ${statusClass.replace("text-", "bg-")}`,
              style: { width: `${tank.level}%` }
            }
          ) }) }),
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: () => handleFeedTank(tank.uid),
              disabled: loading || feedStatus === "feeding" || tank.level <= 0,
              className: `w-full py-3 rounded-lg font-medium transition-all duration-200 ${feedStatus === "feeding" ? "bg-accent-primary/50 text-white animate-pulse cursor-not-allowed" : feedStatus === "success" ? "bg-success text-white animate-bounce-gentle" : feedStatus === "error" ? "bg-error text-white" : tank.level <= 0 ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "btn-primary hover:scale-105 active:scale-95"}`,
              children: [
                feedStatus === "feeding" && "🍽️ Dispensing...",
                feedStatus === "success" && "✅ Dispensed Successfully!",
                feedStatus === "error" && "❌ Dispense Error",
                !feedStatus && tank.level <= 0 && "🚫 Tank Empty",
                !feedStatus && tank.level > 0 && "🍽️ Feed 25g"
              ]
            }
          ),
          /* @__PURE__ */ u$1("div", { className: "mt-2 text-xs text-gray-500 text-center", children: [
            "Total dispensed: ",
            tank.totalDispensed,
            "g"
          ] })
        ] }, tank.uid);
      })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card bg-accent-tertiary/10 border-accent-tertiary/20", children: [
      /* @__PURE__ */ u$1("h3", { className: "font-semibold text-accent-tertiary mb-2", children: "Emergency Feed" }),
      /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-400 mb-4", children: "Dispense 10g from all available tanks into the hopper" }),
      /* @__PURE__ */ u$1(
        "button",
        {
          onClick: handleEmergencyFeed,
          disabled: loading || feedingStatus.emergency === "feeding",
          className: `w-full py-3 rounded-lg font-medium transition-all duration-200 ${feedingStatus.emergency === "feeding" ? "bg-accent-tertiary/50 text-white animate-pulse cursor-not-allowed" : feedingStatus.emergency === "success" ? "bg-success text-white animate-bounce-gentle" : feedingStatus.emergency === "error" ? "bg-error text-white" : "btn-danger"}`,
          children: [
            feedingStatus.emergency === "feeding" && "🚨 Emergency Feeding...",
            feedingStatus.emergency === "success" && "✅ Emergency Feed Complete!",
            feedingStatus.emergency === "error" && "❌ Emergency Feed Failed",
            !feedingStatus.emergency && "🚨 Emergency Feed All Tanks"
          ]
        }
      )
    ] })
  ] });
}
function Tanks() {
  const { data, updateTank, getTankHistory, loading } = useApi();
  const [editingTank, setEditingTank] = d$1(null);
  const [editName, setEditName] = d$1("");
  const [showHistory, setShowHistory] = d$1(null);
  const [tankHistory, setTankHistory] = d$1([]);
  const [historyLoading, setHistoryLoading] = d$1(false);
  const tanks = (data == null ? void 0 : data.tanks) || [];
  const startEditing = (tank) => {
    setEditingTank(tank.uid);
    setEditName(tank.name);
  };
  const cancelEditing = () => {
    setEditingTank(null);
    setEditName("");
  };
  const saveTankName = async (tankUid) => {
    if (editName.trim() && editName.length <= 64) {
      try {
        await updateTank(tankUid, { name: editName.trim() });
        setEditingTank(null);
        setEditName("");
      } catch (error) {
        console.error("Failed to update tank name:", error);
      }
    }
  };
  const showTankHistory = async (tank) => {
    setHistoryLoading(true);
    setShowHistory(tank.uid);
    try {
      const history2 = await getTankHistory(tank.uid);
      setTankHistory(history2);
    } catch (error) {
      console.error("Failed to load tank history:", error);
      setTankHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };
  const closeHistory = () => {
    setShowHistory(null);
    setTankHistory([]);
  };
  const formatHistoryTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };
  const getTankStatus = (level) => {
    if (level >= 70) return { status: "Plenty", color: "text-tank-full", bgColor: "bg-tank-full" };
    if (level >= 40) return { status: "Moderate", color: "text-tank-medium", bgColor: "bg-tank-medium" };
    if (level >= 15) return { status: "Low", color: "text-tank-low", bgColor: "bg-tank-low" };
    return { status: "Empty", color: "text-tank-empty", bgColor: "bg-tank-empty" };
  };
  const formatCapacity = (grams) => {
    if (grams >= 1e3) {
      return `${(grams / 1e3).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };
  const formatTankUid = (uid) => {
    return uid.slice(-4).toUpperCase();
  };
  return /* @__PURE__ */ u$1("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ u$1("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ u$1("h1", { className: "text-2xl font-bold text-white mb-2", children: "Tank Management" }),
      /* @__PURE__ */ u$1("p", { className: "text-gray-400", children: "Configure and monitor your food tanks" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "space-y-4", children: tanks.map((tank) => {
      const { status, color, bgColor } = getTankStatus(tank.level);
      const isEditing = editingTank === tank.uid;
      const currentAmount = Math.round(tank.level / 100 * tank.capacity * tank.density);
      return /* @__PURE__ */ u$1("div", { className: "card", children: [
        /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-3", children: [
            /* @__PURE__ */ u$1("div", { className: "relative", children: [
              /* @__PURE__ */ u$1("div", { className: "w-12 h-12 bg-dark-surface rounded-lg flex items-center justify-center border-2 border-gray-600", children: /* @__PURE__ */ u$1("span", { className: "text-xl", children: "🥫" }) }),
              /* @__PURE__ */ u$1("div", { className: `absolute -top-1 -right-1 w-4 h-4 rounded-full ${bgColor}` })
            ] }),
            /* @__PURE__ */ u$1("div", { children: isEditing ? /* @__PURE__ */ u$1("div", { className: "space-y-2", children: [
              /* @__PURE__ */ u$1(
                "input",
                {
                  type: "text",
                  value: editName,
                  onChange: (e2) => setEditName(e2.target.value),
                  maxLength: 64,
                  className: "input text-lg font-semibold bg-dark-bg border-accent-primary",
                  placeholder: "Tank name...",
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ u$1("div", { className: "text-xs text-gray-400", children: [
                editName.length,
                "/64 characters"
              ] })
            ] }) : /* @__PURE__ */ u$1("div", { children: [
              /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white", children: tank.name }),
              /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2 text-sm text-gray-400", children: [
                /* @__PURE__ */ u$1("span", { children: [
                  "UID: ",
                  formatTankUid(tank.uid)
                ] }),
                /* @__PURE__ */ u$1("span", { children: "•" }),
                /* @__PURE__ */ u$1("span", { children: [
                  "Density: ",
                  tank.density,
                  "g/cm³"
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "flex space-x-2", children: isEditing ? /* @__PURE__ */ u$1(k$2, { children: [
            /* @__PURE__ */ u$1(
              "button",
              {
                onClick: () => saveTankName(tank.uid),
                disabled: loading || !editName.trim() || editName.length > 64,
                className: "btn-primary text-sm px-3 py-1",
                children: "✓ Save"
              }
            ),
            /* @__PURE__ */ u$1(
              "button",
              {
                onClick: cancelEditing,
                className: "btn bg-gray-600 hover:bg-gray-500 text-sm px-3 py-1",
                children: "✕ Cancel"
              }
            )
          ] }) : /* @__PURE__ */ u$1(
            "button",
            {
              onClick: () => startEditing(tank),
              className: "btn bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1",
              children: "✏️ Edit"
            }
          ) })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-4 mb-4", children: [
          /* @__PURE__ */ u$1("div", { className: "text-center", children: [
            /* @__PURE__ */ u$1("div", { className: `text-2xl font-bold ${color}`, children: [
              tank.level,
              "%"
            ] }),
            /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: status })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "text-center", children: [
            /* @__PURE__ */ u$1("div", { className: "text-2xl font-bold text-white", children: formatCapacity(currentAmount) }),
            /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: [
              "of ",
              formatCapacity(tank.capacity)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "mb-4", children: [
          /* @__PURE__ */ u$1("div", { className: "flex justify-between text-sm text-gray-400 mb-2", children: [
            /* @__PURE__ */ u$1("span", { children: "Food Level" }),
            /* @__PURE__ */ u$1("span", { children: [
              formatCapacity(currentAmount),
              " remaining"
            ] })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "relative", children: [
            /* @__PURE__ */ u$1("div", { className: "w-full bg-dark-surface rounded-full h-4", children: /* @__PURE__ */ u$1(
              "div",
              {
                className: `h-4 rounded-full transition-all duration-500 ${bgColor}`,
                style: { width: `${tank.level}%` }
              }
            ) }),
            /* @__PURE__ */ u$1("div", { className: "absolute top-0 left-0 w-full h-4 flex justify-between items-center px-1", children: [
              /* @__PURE__ */ u$1("div", { className: "w-0.5 h-2 bg-gray-600" }),
              /* @__PURE__ */ u$1("div", { className: "w-0.5 h-2 bg-gray-600" }),
              /* @__PURE__ */ u$1("div", { className: "w-0.5 h-2 bg-gray-600" }),
              /* @__PURE__ */ u$1("div", { className: "w-0.5 h-2 bg-gray-600" })
            ] })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "flex justify-between text-xs text-gray-500 mt-1", children: [
            /* @__PURE__ */ u$1("span", { children: "0%" }),
            /* @__PURE__ */ u$1("span", { children: "25%" }),
            /* @__PURE__ */ u$1("span", { children: "50%" }),
            /* @__PURE__ */ u$1("span", { children: "75%" }),
            /* @__PURE__ */ u$1("span", { children: "100%" })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "grid grid-cols-1 gap-3", children: /* @__PURE__ */ u$1(
          "button",
          {
            onClick: () => showTankHistory(tank),
            className: "btn bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30 border border-accent-secondary/30",
            children: "📊 History"
          }
        ) })
      ] }, tank.uid);
    }) }),
    showHistory && /* @__PURE__ */ u$1("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", children: /* @__PURE__ */ u$1("div", { className: "bg-dark-card rounded-xl p-6 m-4 max-w-lg w-full max-h-[80vh] overflow-hidden border border-gray-600", children: [
      /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ u$1("h3", { className: "text-xl font-semibold text-white", children: "Tank History" }),
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: closeHistory,
            className: "btn bg-gray-600 hover:bg-gray-500 text-sm px-3 py-1",
            children: "✕ Close"
          }
        )
      ] }),
      tanks.find((t2) => t2.uid === showHistory) && /* @__PURE__ */ u$1("div", { className: "mb-4 p-3 bg-dark-surface rounded-lg", children: [
        /* @__PURE__ */ u$1("div", { className: "font-medium text-white", children: tanks.find((t2) => t2.uid === showHistory).name }),
        /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: [
          "UID: ",
          formatTankUid(showHistory)
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "overflow-y-auto max-h-96", children: historyLoading ? /* @__PURE__ */ u$1("div", { className: "text-center py-8", children: /* @__PURE__ */ u$1("div", { className: "animate-pulse text-accent-primary", children: "⏳ Loading history..." }) }) : tankHistory.length === 0 ? /* @__PURE__ */ u$1("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ u$1("div", { className: "text-4xl mb-2", children: "📊" }),
        /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "No dispensing history yet" })
      ] }) : /* @__PURE__ */ u$1("div", { className: "space-y-3", children: tankHistory.map((entry, index) => /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-3", children: /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("div", { className: "text-white font-medium", children: [
            entry.amount,
            "g dispensed"
          ] }),
          /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: formatHistoryTime(entry.timestamp) })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "text-right", children: entry.recipeName ? /* @__PURE__ */ u$1("div", { className: "text-accent-primary text-sm", children: [
          "🥄 ",
          entry.recipeName
        ] }) : /* @__PURE__ */ u$1("div", { className: "text-accent-secondary text-sm", children: "🍽️ Manual Feed" }) })
      ] }) }, index)) }) })
    ] }) }),
    /* @__PURE__ */ u$1("div", { className: "card bg-accent-primary/5 border-accent-primary/20", children: /* @__PURE__ */ u$1("div", { className: "text-center", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-accent-primary mb-2", children: "Need More Tanks?" }),
      /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-400 mb-4", children: "Hardware modification required to add additional tanks" }),
      /* @__PURE__ */ u$1("button", { className: "btn bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 border border-accent-primary/30", children: "📋 Hardware Guide" })
    ] }) })
  ] });
}
function Recipes() {
  const { data, createRecipe, updateRecipe, deleteRecipe, loading } = useApi();
  const [showCreateForm, setShowCreateForm] = d$1(false);
  const [editingRecipe, setEditingRecipe] = d$1(null);
  const recipes = (data == null ? void 0 : data.recipes) || [];
  const tanks = (data == null ? void 0 : data.tanks) || [];
  const [newRecipe, setNewRecipe] = d$1({
    name: "",
    totalWeight: 100,
    servings: 2,
    tanks: []
  });
  const [editRecipe, setEditRecipe] = d$1({
    name: "",
    totalWeight: 100,
    servings: 2,
    tanks: []
  });
  const resetForms = () => {
    setNewRecipe({ name: "", totalWeight: 100, servings: 2, tanks: [] });
    setEditRecipe({ name: "", totalWeight: 100, servings: 2, tanks: [] });
    setShowCreateForm(false);
    setEditingRecipe(null);
  };
  const handleCreateRecipe = async () => {
    if (newRecipe.name.trim() && newRecipe.tanks.length > 0) {
      try {
        await createRecipe(newRecipe);
        resetForms();
      } catch (error) {
        console.error("Failed to create recipe:", error);
      }
    }
  };
  const handleUpdateRecipe = async () => {
    if (editRecipe.name.trim() && editRecipe.tanks.length > 0) {
      try {
        await updateRecipe(editingRecipe, editRecipe);
        resetForms();
      } catch (error) {
        console.error("Failed to update recipe:", error);
      }
    }
  };
  const handleDeleteRecipe = async (recipeId) => {
    if (confirm("Delete this recipe?")) {
      try {
        await deleteRecipe(recipeId);
      } catch (error) {
        console.error("Failed to delete recipe:", error);
      }
    }
  };
  const startEditing = (recipe) => {
    setEditRecipe({
      name: recipe.name,
      totalWeight: recipe.totalWeight,
      servings: recipe.servings,
      tanks: [...recipe.tanks]
    });
    setEditingRecipe(recipe.id);
  };
  const updateTankPercentage = (tankUid, percentage, isEdit = false) => {
    const currentRecipe = isEdit ? editRecipe : newRecipe;
    const setCurrentRecipe = isEdit ? setEditRecipe : setNewRecipe;
    let updatedTanks = currentRecipe.tanks.filter((t2) => t2.tankUid !== tankUid);
    if (percentage > 0) {
      updatedTanks.push({ tankUid, percentage });
    }
    const currentTotal = updatedTanks.reduce((sum, t2) => sum + t2.percentage, 0);
    if (currentTotal > 100) {
      const excess = currentTotal - 100;
      const otherTanks = updatedTanks.filter((t2) => t2.tankUid !== tankUid);
      if (otherTanks.length > 0) {
        const reductionPerTank = excess / otherTanks.length;
        updatedTanks = updatedTanks.map(
          (t2) => t2.tankUid === tankUid ? t2 : { ...t2, percentage: Math.max(0, Math.round(t2.percentage - reductionPerTank)) }
        );
      }
    }
    setCurrentRecipe((prev) => ({ ...prev, tanks: updatedTanks }));
  };
  const getTankPercentage = (tankUid, isEdit = false) => {
    const currentRecipe = isEdit ? editRecipe : newRecipe;
    const tank = currentRecipe.tanks.find((t2) => t2.tankUid === tankUid);
    return tank ? tank.percentage : 0;
  };
  const getTotalPercentage = (isEdit = false) => {
    const currentRecipe = isEdit ? editRecipe : newRecipe;
    return currentRecipe.tanks.reduce((sum, t2) => sum + t2.percentage, 0);
  };
  const PieChart = ({ recipeTanks, size = 120 }) => {
    const colors = ["#22d3ee", "#a78bfa", "#fb7185", "#10b981", "#f59e0b"];
    const radius = size / 2 - 10;
    const centerX = size / 2;
    const centerY = size / 2;
    let offset = 0;
    const polarToCartesian = (centerX2, centerY2, radius2, angleInDegrees) => {
      const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;
      return {
        x: centerX2 + radius2 * Math.cos(angleInRadians),
        y: centerY2 + radius2 * Math.sin(angleInRadians)
      };
    };
    const createPath = (startAngle, endAngle) => {
      const start = polarToCartesian(centerX, centerY, radius, endAngle);
      const end = polarToCartesian(centerX, centerY, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return `M ${centerX} ${centerY} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    };
    return /* @__PURE__ */ u$1("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ u$1("svg", { width: size, height: size, className: "transform -rotate-90", children: recipeTanks.map((tank, index) => {
      const angle = tank.percentage / 100 * 360;
      const path = createPath(offset, offset + angle);
      offset += angle;
      return /* @__PURE__ */ u$1(
        "path",
        {
          d: path,
          fill: colors[index % colors.length],
          stroke: "#1a1a1a",
          strokeWidth: "2",
          opacity: "0.8"
        },
        index
      );
    }) }) });
  };
  const RecipeForm = ({ recipe, setRecipe, isEdit, onSubmit, onCancel }) => /* @__PURE__ */ u$1("div", { className: "card bg-accent-primary/5 border-accent-primary/20", children: [
    /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-accent-primary mb-4", children: isEdit ? "Edit Recipe" : "Create New Recipe" }),
    /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Recipe Name" }),
        /* @__PURE__ */ u$1(
          "input",
          {
            type: "text",
            value: recipe.name,
            onChange: (e2) => setRecipe((prev) => ({ ...prev, name: e2.target.value })),
            placeholder: "e.g., Morning Mix, Evening Feast",
            className: "input w-full",
            maxLength: 32
          }
        )
      ] }),
      /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Total Weight (g)" }),
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "number",
              value: recipe.totalWeight,
              onChange: (e2) => setRecipe((prev) => ({ ...prev, totalWeight: parseInt(e2.target.value) || 0 })),
              min: "10",
              max: "500",
              className: "input w-full"
            }
          )
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Servings/Day" }),
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "number",
              value: recipe.servings,
              onChange: (e2) => setRecipe((prev) => ({ ...prev, servings: parseInt(e2.target.value) || 1 })),
              min: "1",
              max: "10",
              className: "input w-full"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: [
          "Tank Mix (",
          getTotalPercentage(isEdit),
          "% total)"
        ] }),
        /* @__PURE__ */ u$1("div", { className: "space-y-3", children: tanks.map((tank) => /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ u$1("div", { className: "flex-1", children: [
            /* @__PURE__ */ u$1("div", { className: "text-sm text-white mb-1", children: tank.name }),
            /* @__PURE__ */ u$1(
              "input",
              {
                type: "range",
                min: "0",
                max: "100",
                value: getTankPercentage(tank.uid, isEdit),
                onChange: (e2) => updateTankPercentage(tank.uid, parseInt(e2.target.value), isEdit),
                className: "w-full h-2 bg-dark-surface rounded-lg appearance-none cursor-pointer"
              }
            )
          ] }),
          /* @__PURE__ */ u$1("div", { className: "w-16 text-right", children: /* @__PURE__ */ u$1("span", { className: "text-accent-primary font-medium", children: [
            getTankPercentage(tank.uid, isEdit),
            "%"
          ] }) })
        ] }, tank.uid)) }),
        getTotalPercentage(isEdit) !== 100 && /* @__PURE__ */ u$1("div", { className: "text-sm text-warning mt-2", children: [
          "⚠️ Total should equal 100% (currently ",
          getTotalPercentage(isEdit),
          "%)"
        ] })
      ] }),
      recipe.tanks.length > 0 && /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Mix Preview" }),
        /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-6", children: [
          /* @__PURE__ */ u$1(PieChart, { recipeTanks: recipe.tanks, size: 100 }),
          /* @__PURE__ */ u$1("div", { className: "space-y-1", children: recipe.tanks.map((tank, index) => {
            const tankData = tanks.find((t2) => t2.uid === tank.tankUid);
            const colors = ["#22d3ee", "#a78bfa", "#fb7185", "#10b981", "#f59e0b"];
            return /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2 text-sm", children: [
              /* @__PURE__ */ u$1("div", { className: "w-3 h-3 rounded", style: { backgroundColor: colors[index % colors.length] } }),
              /* @__PURE__ */ u$1("span", { className: "text-gray-300", children: [
                tankData == null ? void 0 : tankData.name,
                ": ",
                tank.percentage,
                "%"
              ] })
            ] }, tank.tankUid);
          }) })
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "flex space-x-3 pt-4", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: onSubmit,
            disabled: loading || !recipe.name.trim() || getTotalPercentage(isEdit) !== 100,
            className: "btn-primary flex-1",
            children: isEdit ? "✓ Save Changes" : "✓ Create Recipe"
          }
        ),
        /* @__PURE__ */ u$1("button", { onClick: onCancel, className: "btn bg-gray-600 hover:bg-gray-500", children: "✕ Cancel" })
      ] })
    ] })
  ] });
  return /* @__PURE__ */ u$1("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("h1", { className: "text-2xl font-bold text-white", children: "Recipes" }),
        /* @__PURE__ */ u$1("p", { className: "text-gray-400", children: "Create custom feeding mixes" })
      ] }),
      /* @__PURE__ */ u$1("button", { onClick: () => setShowCreateForm(true), className: "btn-primary", children: "➕ New Recipe" })
    ] }),
    showCreateForm && /* @__PURE__ */ u$1(
      RecipeForm,
      {
        recipe: newRecipe,
        setRecipe: setNewRecipe,
        isEdit: false,
        onSubmit: handleCreateRecipe,
        onCancel: resetForms
      }
    ),
    /* @__PURE__ */ u$1("div", { className: "space-y-4", children: recipes.length === 0 ? /* @__PURE__ */ u$1("div", { className: "card text-center py-8", children: [
      /* @__PURE__ */ u$1("div", { className: "text-4xl mb-4", children: "🥄" }),
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-gray-300 mb-2", children: "No Recipes Yet" }),
      /* @__PURE__ */ u$1("p", { className: "text-gray-400 mb-4", children: "Create your first feeding recipe to get started" }),
      /* @__PURE__ */ u$1("button", { onClick: () => setShowCreateForm(true), className: "btn-primary", children: "Create First Recipe" })
    ] }) : recipes.map((recipe) => /* @__PURE__ */ u$1("div", { children: editingRecipe === recipe.id ? /* @__PURE__ */ u$1(
      RecipeForm,
      {
        recipe: editRecipe,
        setRecipe: setEditRecipe,
        isEdit: true,
        onSubmit: handleUpdateRecipe,
        onCancel: resetForms
      }
    ) : /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("div", { className: "flex items-start justify-between mb-4", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white", children: recipe.name }),
          /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-4 text-sm text-gray-400 mt-1", children: [
            /* @__PURE__ */ u$1("span", { children: [
              "📏 ",
              recipe.totalWeight,
              "g total"
            ] }),
            /* @__PURE__ */ u$1("span", { children: [
              "🍽️ ",
              recipe.servings,
              " servings/day"
            ] }),
            /* @__PURE__ */ u$1("span", { children: [
              "⚖️ ",
              Math.round(recipe.totalWeight / recipe.servings),
              "g per serving"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: () => startEditing(recipe),
              className: "btn bg-gray-700 hover:bg-gray-600 text-sm px-3 py-1",
              children: "✏️ Edit"
            }
          ),
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: () => handleDeleteRecipe(recipe.id),
              className: "btn bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm px-3 py-1",
              children: "🗑️ Delete"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-6", children: [
        /* @__PURE__ */ u$1("div", { className: "flex-shrink-0", children: /* @__PURE__ */ u$1(PieChart, { recipeTanks: recipe.tanks, size: 80 }) }),
        /* @__PURE__ */ u$1("div", { className: "flex-1 space-y-2", children: recipe.tanks.map((tank, index) => {
          const tankData = tanks.find((t2) => t2.uid === tank.tankUid);
          const gramsPerServing = Math.round(recipe.totalWeight * tank.percentage / 100 / recipe.servings);
          const colors = ["#22d3ee", "#a78bfa", "#fb7185", "#10b981", "#f59e0b"];
          return /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ u$1("div", { className: "w-3 h-3 rounded", style: { backgroundColor: colors[index % colors.length] } }),
              /* @__PURE__ */ u$1("span", { className: "text-white font-medium", children: (tankData == null ? void 0 : tankData.name) || `Tank ${tank.tankUid}` })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "text-right", children: [
              /* @__PURE__ */ u$1("div", { className: "text-accent-primary font-semibold", children: [
                tank.percentage,
                "%"
              ] }),
              /* @__PURE__ */ u$1("div", { className: "text-xs text-gray-400", children: [
                gramsPerServing,
                "g/serving"
              ] })
            ] })
          ] }, tank.tankUid);
        }) })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-3 mt-4", children: [
        /* @__PURE__ */ u$1("button", { className: "btn bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 border border-accent-primary/30", children: "🍽️ Dispense Now" }),
        /* @__PURE__ */ u$1("button", { className: "btn bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30 border border-accent-secondary/30", children: "⏰ Schedule" })
      ] })
    ] }) }, recipe.id)) })
  ] });
}
function Settings() {
  const { data, updateSettings, loading } = useApi();
  const [settings, setSettings] = d$1({
    deviceName: "",
    timezone: "",
    wifiStrength: 0
  });
  const [unsavedChanges, setUnsavedChanges] = d$1(false);
  y$1(() => {
    if (data == null ? void 0 : data.settings) {
      setSettings(data.settings);
    }
  }, [data == null ? void 0 : data.settings]);
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };
  const saveSettings = async () => {
    try {
      await updateSettings(settings);
      setUnsavedChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };
  const resetSettings = () => {
    setSettings((data == null ? void 0 : data.settings) || {});
    setUnsavedChanges(false);
  };
  const getWifiStrengthText = (rssi) => {
    if (rssi > -50) return { text: "Excellent", color: "text-success" };
    if (rssi > -60) return { text: "Good", color: "text-success" };
    if (rssi > -70) return { text: "Fair", color: "text-warning" };
    if (rssi > -80) return { text: "Poor", color: "text-error" };
    return { text: "Very Poor", color: "text-error" };
  };
  const wifiStatus = getWifiStrengthText(settings.wifiStrength);
  return /* @__PURE__ */ u$1("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ u$1("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ u$1("h1", { className: "text-2xl font-bold text-white mb-2", children: "Settings" }),
      /* @__PURE__ */ u$1("p", { className: "text-gray-400", children: "Configure your Kittyble device" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "Device Information" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Device Name" }),
          /* @__PURE__ */ u$1(
            "input",
            {
              type: "text",
              value: settings.deviceName,
              onChange: (e2) => handleSettingChange("deviceName", e2.target.value),
              placeholder: "KibbleT5",
              className: "input w-full",
              maxLength: 32
            }
          ),
          /* @__PURE__ */ u$1("p", { className: "text-xs text-gray-400 mt-1", children: "This name appears in your router and network discovery" })
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("label", { className: "block text-sm font-medium text-gray-300 mb-2", children: "Timezone" }),
          /* @__PURE__ */ u$1(
            "select",
            {
              value: settings.timezone,
              onChange: (e2) => handleSettingChange("timezone", e2.target.value),
              className: "input w-full",
              children: [
                /* @__PURE__ */ u$1("option", { value: "UTC-12", children: "UTC-12 (Baker Island)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-11", children: "UTC-11 (American Samoa)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-10", children: "UTC-10 (Hawaii)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-9", children: "UTC-9 (Alaska)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-8", children: "UTC-8 (Pacific Time)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-7", children: "UTC-7 (Mountain Time)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-6", children: "UTC-6 (Central Time)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-5", children: "UTC-5 (Eastern Time)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-4", children: "UTC-4 (Atlantic Time)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-3", children: "UTC-3 (Argentina)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-2", children: "UTC-2 (South Georgia)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC-1", children: "UTC-1 (Azores)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+0", children: "UTC+0 (London)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+1", children: "UTC+1 (Paris, Berlin)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+2", children: "UTC+2 (Cairo, Athens)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+3", children: "UTC+3 (Moscow, Istanbul)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+4", children: "UTC+4 (Dubai)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+5", children: "UTC+5 (Pakistan)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+6", children: "UTC+6 (Bangladesh)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+7", children: "UTC+7 (Thailand)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+8", children: "UTC+8 (China, Singapore)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+9", children: "UTC+9 (Japan, Korea)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+10", children: "UTC+10 (Australia East)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+11", children: "UTC+11 (New Caledonia)" }),
                /* @__PURE__ */ u$1("option", { value: "UTC+12", children: "UTC+12 (New Zealand)" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "Network Status" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
        /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ u$1("div", { children: [
            /* @__PURE__ */ u$1("div", { className: "text-white font-medium", children: "WiFi Signal" }),
            /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: [
              settings.wifiStrength,
              " dBm"
            ] })
          ] }),
          /* @__PURE__ */ u$1("div", { className: `text-right ${wifiStatus.color}`, children: [
            /* @__PURE__ */ u$1("div", { className: "font-semibold", children: wifiStatus.text }),
            /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-0.5", children: [1, 2, 3, 4].map((bar) => /* @__PURE__ */ u$1(
              "div",
              {
                className: `w-1 bg-current ${settings.wifiStrength > -50 - (bar - 1) * 10 ? "opacity-100" : "opacity-30"}`,
                style: { height: `${bar * 3}px` }
              },
              bar
            )) })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
          /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-3", children: [
            /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "IP Address" }),
            /* @__PURE__ */ u$1("div", { className: "text-white font-mono", children: "192.168.1.42" })
          ] }),
          /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-3", children: [
            /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "MAC Address" }),
            /* @__PURE__ */ u$1("div", { className: "text-white font-mono text-xs", children: "A4:CF:12:FE:DC:BA" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "Feeding Settings" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
        /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-3", children: [
          /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ u$1("span", { className: "text-white font-medium", children: "Safety Mode" }),
            /* @__PURE__ */ u$1("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ u$1("input", { type: "checkbox", className: "sr-only peer", defaultChecked: true }),
              /* @__PURE__ */ u$1("div", { className: "w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary" })
            ] })
          ] }),
          /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-400", children: "Prevents overfeeding by limiting dispensing frequency" })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-3", children: [
          /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ u$1("span", { className: "text-white font-medium", children: "Auto Refill Alerts" }),
            /* @__PURE__ */ u$1("label", { className: "relative inline-flex items-center cursor-pointer", children: [
              /* @__PURE__ */ u$1("input", { type: "checkbox", className: "sr-only peer", defaultChecked: true }),
              /* @__PURE__ */ u$1("div", { className: "w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary" })
            ] })
          ] }),
          /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-400", children: "Get notified when tanks are running low" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "System Actions" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-3", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: () => window.location.href = "/settings/calibration",
            className: "btn bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 border border-accent-primary/30 w-full",
            children: "⚙️ Advanced Calibration"
          }
        ),
        /* @__PURE__ */ u$1("button", { className: "btn bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30 border border-accent-secondary/30 w-full", children: "🔄 Restart Device" }),
        /* @__PURE__ */ u$1("button", { className: "btn bg-warning/20 text-warning hover:bg-warning/30 border border-warning/30 w-full", children: "📥 Export Settings" }),
        /* @__PURE__ */ u$1("button", { className: "btn bg-error/20 text-error hover:bg-error/30 border border-error/30 w-full", children: "🏭 Factory Reset" })
      ] })
    ] }),
    unsavedChanges && /* @__PURE__ */ u$1("div", { className: "fixed bottom-20 left-4 right-4 bg-accent-primary/90 backdrop-blur rounded-lg p-4 border border-accent-primary shadow-lg", children: /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ u$1("div", { children: [
        /* @__PURE__ */ u$1("div", { className: "text-white font-medium", children: "Unsaved Changes" }),
        /* @__PURE__ */ u$1("div", { className: "text-white/80 text-sm", children: "You have pending configuration changes" })
      ] }),
      /* @__PURE__ */ u$1("div", { className: "flex space-x-2", children: [
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: resetSettings,
            className: "btn bg-white/20 text-white hover:bg-white/30 text-sm px-3 py-1",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ u$1(
          "button",
          {
            onClick: saveSettings,
            disabled: loading,
            className: "btn bg-white text-dark-bg hover:bg-white/90 font-semibold text-sm px-4 py-1",
            children: loading ? "💾 Saving..." : "💾 Save"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ u$1("div", { className: "card bg-dark-surface/50", children: /* @__PURE__ */ u$1("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ u$1("div", { className: "text-sm text-gray-400", children: "Kittyble Firmware" }),
      /* @__PURE__ */ u$1("div", { className: "text-lg font-semibold text-accent-primary", children: "v1.0.0" }),
      /* @__PURE__ */ u$1("div", { className: "text-xs text-gray-500", children: "Build 2025.07.03" })
    ] }) })
  ] });
}
function Calibration() {
  var _a, _b, _c, _d;
  const { apiCall, loading } = useApi();
  const [scaleData, setScaleData] = d$1([]);
  const [isMonitoring, setIsMonitoring] = d$1(false);
  const [servoConfig, setServoConfig] = d$1({
    tanks: [
      { id: 0, idlePwm: 1500, name: "Tank 0" },
      { id: 1, idlePwm: 1500, name: "Tank 1" },
      { id: 2, idlePwm: 1500, name: "Tank 2" }
    ],
    hopper: {
      closedPwm: 1e3,
      openPwm: 2e3
    }
  });
  const [tareInProgress, setTareInProgress] = d$1(false);
  const intervalRef = A(null);
  const canvasRef = A(null);
  const generateMockScaleData = () => {
    return {
      timestamp: Date.now(),
      rawValue: Math.floor(Math.random() * 1e3 + 2e3),
      // ADC raw value
      weight: (Math.random() * 10 + 95).toFixed(1),
      // Weight in grams
      stable: Math.random() > 0.3
      // Stability indicator
    };
  };
  const toggleMonitoring = () => {
    if (isMonitoring) {
      clearInterval(intervalRef.current);
      setIsMonitoring(false);
    } else {
      setIsMonitoring(true);
      intervalRef.current = setInterval(() => {
        const newData = generateMockScaleData();
        setScaleData((prev) => {
          const updated = [...prev, newData];
          return updated.slice(-50);
        });
      }, 500);
    }
  };
  const handleTare = async () => {
    setTareInProgress(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2e3));
      setScaleData([]);
    } catch (error) {
      console.error("Tare failed:", error);
    } finally {
      setTareInProgress(false);
    }
  };
  const updateServoConfig = async (type, id, field, value) => {
    const pwmValue = parseInt(value);
    if (pwmValue < 500 || pwmValue > 2500) return;
    if (type === "tank") {
      setServoConfig((prev) => ({
        ...prev,
        tanks: prev.tanks.map(
          (tank) => tank.id === id ? { ...tank, [field]: pwmValue } : tank
        )
      }));
    } else if (type === "hopper") {
      setServoConfig((prev) => ({
        ...prev,
        hopper: { ...prev.hopper, [field]: pwmValue }
      }));
    }
  };
  const testServo = async (type, id, position) => {
    try {
      console.log(`Testing ${type} servo ${id} at position ${position}`);
    } catch (error) {
      console.error("Servo test failed:", error);
    }
  };
  const saveCalibration = async () => {
    try {
      console.log("Calibration saved:", servoConfig);
      alert("Calibration settings saved!");
    } catch (error) {
      console.error("Save failed:", error);
    }
  };
  y$1(() => {
    if (!canvasRef.current || scaleData.length === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 1;
    for (let i2 = 0; i2 <= 10; i2++) {
      const y2 = height / 10 * i2;
      ctx.beginPath();
      ctx.moveTo(0, y2);
      ctx.lineTo(width, y2);
      ctx.stroke();
    }
    for (let i2 = 0; i2 <= 20; i2++) {
      const x2 = width / 20 * i2;
      ctx.beginPath();
      ctx.moveTo(x2, 0);
      ctx.lineTo(x2, height);
      ctx.stroke();
    }
    if (scaleData.length < 2) return;
    const weights = scaleData.map((d2) => parseFloat(d2.weight));
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const range = maxWeight - minWeight || 1;
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.beginPath();
    scaleData.forEach((data, index) => {
      const x2 = index / (scaleData.length - 1) * width;
      const normalizedWeight = (parseFloat(data.weight) - minWeight) / range;
      const y2 = height - normalizedWeight * height;
      if (index === 0) {
        ctx.moveTo(x2, y2);
      } else {
        ctx.lineTo(x2, y2);
      }
    });
    ctx.stroke();
    scaleData.forEach((data, index) => {
      const x2 = index / (scaleData.length - 1) * width;
      const normalizedWeight = (parseFloat(data.weight) - minWeight) / range;
      const y2 = height - normalizedWeight * height;
      ctx.fillStyle = data.stable ? "#10b981" : "#ef4444";
      ctx.beginPath();
      ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px monospace";
    ctx.fillText(`Min: ${minWeight.toFixed(1)}g`, 10, height - 10);
    ctx.fillText(`Max: ${maxWeight.toFixed(1)}g`, 10, 20);
    if (scaleData.length > 0) {
      const latest = scaleData[scaleData.length - 1];
      ctx.fillText(`Current: ${latest.weight}g (${latest.stable ? "Stable" : "Unstable"})`, width - 200, 20);
    }
  }, [scaleData]);
  y$1(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  return /* @__PURE__ */ u$1("div", { className: "p-4 space-y-6", children: [
    /* @__PURE__ */ u$1("div", { className: "text-center py-4", children: [
      /* @__PURE__ */ u$1("h1", { className: "text-2xl font-bold text-white mb-2", children: "⚙️ Advanced Calibration" }),
      /* @__PURE__ */ u$1("p", { className: "text-gray-400", children: "Hardware servicing and sensor calibration" })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "🔧 Scale Calibration" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-4", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ u$1("label", { className: "text-sm font-medium text-gray-300", children: "Real-time Weight Monitor (2Hz)" }),
            /* @__PURE__ */ u$1(
              "button",
              {
                onClick: toggleMonitoring,
                className: `btn text-sm px-3 py-1 ${isMonitoring ? "bg-error/20 text-error hover:bg-error/30" : "bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30"}`,
                children: [
                  isMonitoring ? "⏹️ Stop" : "▶️ Start",
                  " Monitor"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-2 border border-gray-600", children: /* @__PURE__ */ u$1(
            "canvas",
            {
              ref: canvasRef,
              width: "600",
              height: "200",
              className: "w-full h-48 rounded",
              style: { maxWidth: "100%", height: "200px" }
            }
          ) }),
          scaleData.length > 0 && /* @__PURE__ */ u$1("div", { className: "grid grid-cols-3 gap-4 mt-2 text-sm", children: [
            /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded p-2 text-center", children: [
              /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "Raw ADC" }),
              /* @__PURE__ */ u$1("div", { className: "text-white font-mono", children: (_a = scaleData[scaleData.length - 1]) == null ? void 0 : _a.rawValue })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded p-2 text-center", children: [
              /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "Weight" }),
              /* @__PURE__ */ u$1("div", { className: "text-accent-primary font-bold", children: [
                (_b = scaleData[scaleData.length - 1]) == null ? void 0 : _b.weight,
                "g"
              ] })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded p-2 text-center", children: [
              /* @__PURE__ */ u$1("div", { className: "text-gray-400", children: "Status" }),
              /* @__PURE__ */ u$1("div", { className: `font-medium ${((_c = scaleData[scaleData.length - 1]) == null ? void 0 : _c.stable) ? "text-success" : "text-error"}`, children: ((_d = scaleData[scaleData.length - 1]) == null ? void 0 : _d.stable) ? "Stable" : "Unstable" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "flex space-x-3", children: [
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: handleTare,
              disabled: tareInProgress || loading,
              className: `btn-primary flex-1 ${tareInProgress ? "animate-pulse" : ""}`,
              children: tareInProgress ? "⏳ Taring..." : "⚖️ Tare Scale"
            }
          ),
          /* @__PURE__ */ u$1("button", { className: "btn bg-accent-secondary/20 text-accent-secondary hover:bg-accent-secondary/30 border border-accent-secondary/30", children: "📋 Calibrate Weight" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-lg font-semibold text-white mb-4", children: "🎛️ Servo Configuration" }),
      /* @__PURE__ */ u$1("div", { className: "space-y-6", children: [
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("h4", { className: "text-md font-medium text-gray-300 mb-3", children: "Tank Dispensing Servos" }),
          /* @__PURE__ */ u$1("div", { className: "space-y-4", children: servoConfig.tanks.map((tank) => /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-4", children: [
            /* @__PURE__ */ u$1("div", { className: "flex items-center justify-between mb-3", children: [
              /* @__PURE__ */ u$1("span", { className: "text-white font-medium", children: tank.name }),
              /* @__PURE__ */ u$1("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    onClick: () => testServo("tank", tank.id, "idle"),
                    className: "btn bg-gray-600 hover:bg-gray-500 text-xs px-2 py-1",
                    children: "🔄 Test Idle"
                  }
                ),
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    onClick: () => testServo("tank", tank.id, "dispense"),
                    className: "btn bg-accent-primary/20 text-accent-primary hover:bg-accent-primary/30 text-xs px-2 py-1",
                    children: "🍽️ Test Dispense"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u$1("div", { children: [
              /* @__PURE__ */ u$1("label", { className: "block text-sm text-gray-400 mb-1", children: "Idle Position PWM (500-2500μs)" }),
              /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-3", children: [
                /* @__PURE__ */ u$1(
                  "input",
                  {
                    type: "range",
                    min: "500",
                    max: "2500",
                    value: tank.idlePwm,
                    onChange: (e2) => updateServoConfig("tank", tank.id, "idlePwm", e2.target.value),
                    className: "flex-1 h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer"
                  }
                ),
                /* @__PURE__ */ u$1(
                  "input",
                  {
                    type: "number",
                    value: tank.idlePwm,
                    onChange: (e2) => updateServoConfig("tank", tank.id, "idlePwm", e2.target.value),
                    min: "500",
                    max: "2500",
                    className: "input w-20 text-center text-sm"
                  }
                ),
                /* @__PURE__ */ u$1("span", { className: "text-xs text-gray-400", children: "μs" })
              ] })
            ] })
          ] }, tank.id)) })
        ] }),
        /* @__PURE__ */ u$1("div", { children: [
          /* @__PURE__ */ u$1("h4", { className: "text-md font-medium text-gray-300 mb-3", children: "Hopper Trap Door Servo" }),
          /* @__PURE__ */ u$1("div", { className: "bg-dark-surface rounded-lg p-4 space-y-4", children: [
            /* @__PURE__ */ u$1("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ u$1("span", { className: "text-white font-medium", children: "Main Hopper Door" }),
              /* @__PURE__ */ u$1("div", { className: "flex space-x-2", children: [
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    onClick: () => testServo("hopper", 0, "closed"),
                    className: "btn bg-error/20 text-error hover:bg-error/30 text-xs px-2 py-1",
                    children: "🔒 Test Close"
                  }
                ),
                /* @__PURE__ */ u$1(
                  "button",
                  {
                    onClick: () => testServo("hopper", 0, "open"),
                    className: "btn bg-success/20 text-success hover:bg-success/30 text-xs px-2 py-1",
                    children: "🔓 Test Open"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ u$1("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ u$1("div", { children: [
                /* @__PURE__ */ u$1("label", { className: "block text-sm text-gray-400 mb-1", children: "Closed Position PWM" }),
                /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "range",
                      min: "500",
                      max: "2500",
                      value: servoConfig.hopper.closedPwm,
                      onChange: (e2) => updateServoConfig("hopper", 0, "closedPwm", e2.target.value),
                      className: "flex-1 h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "number",
                      value: servoConfig.hopper.closedPwm,
                      onChange: (e2) => updateServoConfig("hopper", 0, "closedPwm", e2.target.value),
                      min: "500",
                      max: "2500",
                      className: "input w-20 text-center text-sm"
                    }
                  ),
                  /* @__PURE__ */ u$1("span", { className: "text-xs text-gray-400", children: "μs" })
                ] })
              ] }),
              /* @__PURE__ */ u$1("div", { children: [
                /* @__PURE__ */ u$1("label", { className: "block text-sm text-gray-400 mb-1", children: "Open Position PWM" }),
                /* @__PURE__ */ u$1("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "range",
                      min: "500",
                      max: "2500",
                      value: servoConfig.hopper.openPwm,
                      onChange: (e2) => updateServoConfig("hopper", 0, "openPwm", e2.target.value),
                      className: "flex-1 h-2 bg-dark-bg rounded-lg appearance-none cursor-pointer"
                    }
                  ),
                  /* @__PURE__ */ u$1(
                    "input",
                    {
                      type: "number",
                      value: servoConfig.hopper.openPwm,
                      onChange: (e2) => updateServoConfig("hopper", 0, "openPwm", e2.target.value),
                      min: "500",
                      max: "2500",
                      className: "input w-20 text-center text-sm"
                    }
                  ),
                  /* @__PURE__ */ u$1("span", { className: "text-xs text-gray-400", children: "μs" })
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ u$1("div", { className: "flex space-x-3 pt-4", children: [
          /* @__PURE__ */ u$1(
            "button",
            {
              onClick: saveCalibration,
              disabled: loading,
              className: "btn-primary flex-1",
              children: "💾 Save Calibration"
            }
          ),
          /* @__PURE__ */ u$1("button", { className: "btn bg-gray-600 hover:bg-gray-500", children: "🔄 Reset to Defaults" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ u$1("div", { className: "card bg-warning/10 border-warning/20", children: [
      /* @__PURE__ */ u$1("h3", { className: "text-warning font-semibold mb-2", children: "⚠️ Safety Notice" }),
      /* @__PURE__ */ u$1("p", { className: "text-sm text-gray-300 mb-3", children: "Only qualified technicians should perform servo calibration. Incorrect PWM values can damage servos or cause mechanical failures." }),
      /* @__PURE__ */ u$1("ul", { className: "text-xs text-gray-400 space-y-1", children: [
        /* @__PURE__ */ u$1("li", { children: "• Always test servo movements before saving configuration" }),
        /* @__PURE__ */ u$1("li", { children: "• PWM range: 500-2500μs (typical servo safe range)" }),
        /* @__PURE__ */ u$1("li", { children: "• Ensure mechanical clearances before testing" }),
        /* @__PURE__ */ u$1("li", { children: "• Stop all operations before calibrating" })
      ] })
    ] })
  ] });
}
function App() {
  const [currentRoute, setCurrentRoute] = d$1("/");
  const handleRoute = (e2) => {
    setCurrentRoute(e2.url);
  };
  return /* @__PURE__ */ u$1(ApiProvider, { children: /* @__PURE__ */ u$1("div", { className: "min-h-screen bg-dark-bg text-white", children: [
    /* @__PURE__ */ u$1(Header, {}),
    /* @__PURE__ */ u$1("main", { className: "pb-20", children: [
      " ",
      /* @__PURE__ */ u$1(D, { onChange: handleRoute, children: [
        /* @__PURE__ */ u$1(Dashboard, { path: "/" }),
        /* @__PURE__ */ u$1(Tanks, { path: "/tanks" }),
        /* @__PURE__ */ u$1(Recipes, { path: "/recipes" }),
        /* @__PURE__ */ u$1(Settings, { path: "/settings" }),
        /* @__PURE__ */ u$1(Calibration, { path: "/settings/calibration" })
      ] })
    ] }),
    /* @__PURE__ */ u$1(Navigation, { currentRoute })
  ] }) });
}
E(/* @__PURE__ */ u$1(App, {}), document.getElementById("app"));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLWRlYnVnLmpzIiwic291cmNlcyI6WyIuLi8uLi93ZWJwYWdlL25vZGVfbW9kdWxlcy9wcmVhY3QvZGlzdC9wcmVhY3QubW9kdWxlLmpzIiwiLi4vLi4vd2VicGFnZS9ub2RlX21vZHVsZXMvcHJlYWN0L2pzeC1ydW50aW1lL2Rpc3QvanN4UnVudGltZS5tb2R1bGUuanMiLCIuLi8uLi93ZWJwYWdlL25vZGVfbW9kdWxlcy9wcmVhY3QvaG9va3MvZGlzdC9ob29rcy5tb2R1bGUuanMiLCIuLi8uLi93ZWJwYWdlL25vZGVfbW9kdWxlcy9wcmVhY3Qtcm91dGVyL2Rpc3QvcHJlYWN0LXJvdXRlci5tanMiLCIuLi8uLi93ZWJwYWdlL3NyYy9ob29rcy91c2VBcGkuanN4IiwiLi4vLi4vd2VicGFnZS9zcmMvY29tcG9uZW50cy9IZWFkZXIuanN4IiwiLi4vLi4vd2VicGFnZS9zcmMvY29tcG9uZW50cy9OYXZpZ2F0aW9uLmpzeCIsIi4uLy4uL3dlYnBhZ2Uvc3JjL3BhZ2VzL0Rhc2hib2FyZC5qc3giLCIuLi8uLi93ZWJwYWdlL3NyYy9wYWdlcy9UYW5rcy5qc3giLCIuLi8uLi93ZWJwYWdlL3NyYy9wYWdlcy9SZWNpcGVzLmpzeCIsIi4uLy4uL3dlYnBhZ2Uvc3JjL3BhZ2VzL1NldHRpbmdzLmpzeCIsIi4uLy4uL3dlYnBhZ2Uvc3JjL3BhZ2VzL0NhbGlicmF0aW9uLmpzeCIsIi4uLy4uL3dlYnBhZ2Uvc3JjL0FwcC5qc3giLCIuLi8uLi93ZWJwYWdlL3NyYy9tYWluLmpzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbixsLHUsdCxpLHIsbyxlLGYsYyxzLGEsaCxwPXt9LHY9W10seT0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pLHc9QXJyYXkuaXNBcnJheTtmdW5jdGlvbiBkKG4sbCl7Zm9yKHZhciB1IGluIGwpblt1XT1sW3VdO3JldHVybiBufWZ1bmN0aW9uIGcobil7biYmbi5wYXJlbnROb2RlJiZuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobil9ZnVuY3Rpb24gXyhsLHUsdCl7dmFyIGkscixvLGU9e307Zm9yKG8gaW4gdSlcImtleVwiPT1vP2k9dVtvXTpcInJlZlwiPT1vP3I9dVtvXTplW29dPXVbb107aWYoYXJndW1lbnRzLmxlbmd0aD4yJiYoZS5jaGlsZHJlbj1hcmd1bWVudHMubGVuZ3RoPjM/bi5jYWxsKGFyZ3VtZW50cywyKTp0KSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBsJiZudWxsIT1sLmRlZmF1bHRQcm9wcylmb3IobyBpbiBsLmRlZmF1bHRQcm9wcyl2b2lkIDA9PT1lW29dJiYoZVtvXT1sLmRlZmF1bHRQcm9wc1tvXSk7cmV0dXJuIG0obCxlLGkscixudWxsKX1mdW5jdGlvbiBtKG4sdCxpLHIsbyl7dmFyIGU9e3R5cGU6bixwcm9wczp0LGtleTppLHJlZjpyLF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjpudWxsPT1vPysrdTpvLF9faTotMSxfX3U6MH07cmV0dXJuIG51bGw9PW8mJm51bGwhPWwudm5vZGUmJmwudm5vZGUoZSksZX1mdW5jdGlvbiBiKCl7cmV0dXJue2N1cnJlbnQ6bnVsbH19ZnVuY3Rpb24gayhuKXtyZXR1cm4gbi5jaGlsZHJlbn1mdW5jdGlvbiB4KG4sbCl7dGhpcy5wcm9wcz1uLHRoaXMuY29udGV4dD1sfWZ1bmN0aW9uIFMobixsKXtpZihudWxsPT1sKXJldHVybiBuLl9fP1Mobi5fXyxuLl9faSsxKTpudWxsO2Zvcih2YXIgdTtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSlyZXR1cm4gdS5fX2U7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2Ygbi50eXBlP1Mobik6bnVsbH1mdW5jdGlvbiBDKG4pe3ZhciBsLHU7aWYobnVsbCE9KG49bi5fXykmJm51bGwhPW4uX19jKXtmb3Iobi5fX2U9bi5fX2MuYmFzZT1udWxsLGw9MDtsPG4uX19rLmxlbmd0aDtsKyspaWYobnVsbCE9KHU9bi5fX2tbbF0pJiZudWxsIT11Ll9fZSl7bi5fX2U9bi5fX2MuYmFzZT11Ll9fZTticmVha31yZXR1cm4gQyhuKX19ZnVuY3Rpb24gTShuKXsoIW4uX19kJiYobi5fX2Q9ITApJiZpLnB1c2gobikmJiEkLl9fcisrfHxyIT1sLmRlYm91bmNlUmVuZGVyaW5nKSYmKChyPWwuZGVib3VuY2VSZW5kZXJpbmcpfHxvKSgkKX1mdW5jdGlvbiAkKCl7Zm9yKHZhciBuLHUsdCxyLG8sZixjLHM9MTtpLmxlbmd0aDspaS5sZW5ndGg+cyYmaS5zb3J0KGUpLG49aS5zaGlmdCgpLHM9aS5sZW5ndGgsbi5fX2QmJih0PXZvaWQgMCxvPShyPSh1PW4pLl9fdikuX19lLGY9W10sYz1bXSx1Ll9fUCYmKCh0PWQoe30scikpLl9fdj1yLl9fdisxLGwudm5vZGUmJmwudm5vZGUodCksTyh1Ll9fUCx0LHIsdS5fX24sdS5fX1AubmFtZXNwYWNlVVJJLDMyJnIuX191P1tvXTpudWxsLGYsbnVsbD09bz9TKHIpOm8sISEoMzImci5fX3UpLGMpLHQuX192PXIuX192LHQuX18uX19rW3QuX19pXT10LHooZix0LGMpLHQuX19lIT1vJiZDKHQpKSk7JC5fX3I9MH1mdW5jdGlvbiBJKG4sbCx1LHQsaSxyLG8sZSxmLGMscyl7dmFyIGEsaCx5LHcsZCxnLF89dCYmdC5fX2t8fHYsbT1sLmxlbmd0aDtmb3IoZj1QKHUsbCxfLGYsbSksYT0wO2E8bTthKyspbnVsbCE9KHk9dS5fX2tbYV0pJiYoaD0tMT09eS5fX2k/cDpfW3kuX19pXXx8cCx5Ll9faT1hLGc9TyhuLHksaCxpLHIsbyxlLGYsYyxzKSx3PXkuX19lLHkucmVmJiZoLnJlZiE9eS5yZWYmJihoLnJlZiYmcShoLnJlZixudWxsLHkpLHMucHVzaCh5LnJlZix5Ll9fY3x8dyx5KSksbnVsbD09ZCYmbnVsbCE9dyYmKGQ9dyksNCZ5Ll9fdXx8aC5fX2s9PT15Ll9faz9mPUEoeSxmLG4pOlwiZnVuY3Rpb25cIj09dHlwZW9mIHkudHlwZSYmdm9pZCAwIT09Zz9mPWc6dyYmKGY9dy5uZXh0U2libGluZykseS5fX3UmPS03KTtyZXR1cm4gdS5fX2U9ZCxmfWZ1bmN0aW9uIFAobixsLHUsdCxpKXt2YXIgcixvLGUsZixjLHM9dS5sZW5ndGgsYT1zLGg9MDtmb3Iobi5fX2s9bmV3IEFycmF5KGkpLHI9MDtyPGk7cisrKW51bGwhPShvPWxbcl0pJiZcImJvb2xlYW5cIiE9dHlwZW9mIG8mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIG8/KGY9citoLChvPW4uX19rW3JdPVwic3RyaW5nXCI9PXR5cGVvZiBvfHxcIm51bWJlclwiPT10eXBlb2Ygb3x8XCJiaWdpbnRcIj09dHlwZW9mIG98fG8uY29uc3RydWN0b3I9PVN0cmluZz9tKG51bGwsbyxudWxsLG51bGwsbnVsbCk6dyhvKT9tKGsse2NoaWxkcmVuOm99LG51bGwsbnVsbCxudWxsKTpudWxsPT1vLmNvbnN0cnVjdG9yJiZvLl9fYj4wP20oby50eXBlLG8ucHJvcHMsby5rZXksby5yZWY/by5yZWY6bnVsbCxvLl9fdik6bykuX189bixvLl9fYj1uLl9fYisxLGU9bnVsbCwtMSE9KGM9by5fX2k9TChvLHUsZixhKSkmJihhLS0sKGU9dVtjXSkmJihlLl9fdXw9MikpLG51bGw9PWV8fG51bGw9PWUuX192PygtMT09YyYmKGk+cz9oLS06aTxzJiZoKyspLFwiZnVuY3Rpb25cIiE9dHlwZW9mIG8udHlwZSYmKG8uX191fD00KSk6YyE9ZiYmKGM9PWYtMT9oLS06Yz09ZisxP2grKzooYz5mP2gtLTpoKyssby5fX3V8PTQpKSk6bi5fX2tbcl09bnVsbDtpZihhKWZvcihyPTA7cjxzO3IrKyludWxsIT0oZT11W3JdKSYmMD09KDImZS5fX3UpJiYoZS5fX2U9PXQmJih0PVMoZSkpLEIoZSxlKSk7cmV0dXJuIHR9ZnVuY3Rpb24gQShuLGwsdSl7dmFyIHQsaTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBuLnR5cGUpe2Zvcih0PW4uX19rLGk9MDt0JiZpPHQubGVuZ3RoO2krKyl0W2ldJiYodFtpXS5fXz1uLGw9QSh0W2ldLGwsdSkpO3JldHVybiBsfW4uX19lIT1sJiYobCYmbi50eXBlJiYhdS5jb250YWlucyhsKSYmKGw9UyhuKSksdS5pbnNlcnRCZWZvcmUobi5fX2UsbHx8bnVsbCksbD1uLl9fZSk7ZG97bD1sJiZsLm5leHRTaWJsaW5nfXdoaWxlKG51bGwhPWwmJjg9PWwubm9kZVR5cGUpO3JldHVybiBsfWZ1bmN0aW9uIEgobixsKXtyZXR1cm4gbD1sfHxbXSxudWxsPT1ufHxcImJvb2xlYW5cIj09dHlwZW9mIG58fCh3KG4pP24uc29tZShmdW5jdGlvbihuKXtIKG4sbCl9KTpsLnB1c2gobikpLGx9ZnVuY3Rpb24gTChuLGwsdSx0KXt2YXIgaSxyLG89bi5rZXksZT1uLnR5cGUsZj1sW3VdO2lmKG51bGw9PT1mJiZudWxsPT1uLmtleXx8ZiYmbz09Zi5rZXkmJmU9PWYudHlwZSYmMD09KDImZi5fX3UpKXJldHVybiB1O2lmKHQ+KG51bGwhPWYmJjA9PSgyJmYuX191KT8xOjApKWZvcihpPXUtMSxyPXUrMTtpPj0wfHxyPGwubGVuZ3RoOyl7aWYoaT49MCl7aWYoKGY9bFtpXSkmJjA9PSgyJmYuX191KSYmbz09Zi5rZXkmJmU9PWYudHlwZSlyZXR1cm4gaTtpLS19aWYocjxsLmxlbmd0aCl7aWYoKGY9bFtyXSkmJjA9PSgyJmYuX191KSYmbz09Zi5rZXkmJmU9PWYudHlwZSlyZXR1cm4gcjtyKyt9fXJldHVybi0xfWZ1bmN0aW9uIFQobixsLHUpe1wiLVwiPT1sWzBdP24uc2V0UHJvcGVydHkobCxudWxsPT11P1wiXCI6dSk6bltsXT1udWxsPT11P1wiXCI6XCJudW1iZXJcIiE9dHlwZW9mIHV8fHkudGVzdChsKT91OnUrXCJweFwifWZ1bmN0aW9uIGoobixsLHUsdCxpKXt2YXIgcixvO246aWYoXCJzdHlsZVwiPT1sKWlmKFwic3RyaW5nXCI9PXR5cGVvZiB1KW4uc3R5bGUuY3NzVGV4dD11O2Vsc2V7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQmJihuLnN0eWxlLmNzc1RleHQ9dD1cIlwiKSx0KWZvcihsIGluIHQpdSYmbCBpbiB1fHxUKG4uc3R5bGUsbCxcIlwiKTtpZih1KWZvcihsIGluIHUpdCYmdVtsXT09dFtsXXx8VChuLnN0eWxlLGwsdVtsXSl9ZWxzZSBpZihcIm9cIj09bFswXSYmXCJuXCI9PWxbMV0pcj1sIT0obD1sLnJlcGxhY2UoZixcIiQxXCIpKSxvPWwudG9Mb3dlckNhc2UoKSxsPW8gaW4gbnx8XCJvbkZvY3VzT3V0XCI9PWx8fFwib25Gb2N1c0luXCI9PWw/by5zbGljZSgyKTpsLnNsaWNlKDIpLG4ubHx8KG4ubD17fSksbi5sW2wrcl09dSx1P3Q/dS51PXQudToodS51PWMsbi5hZGRFdmVudExpc3RlbmVyKGwscj9hOnMscikpOm4ucmVtb3ZlRXZlbnRMaXN0ZW5lcihsLHI/YTpzLHIpO2Vsc2V7aWYoXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiPT1pKWw9bC5yZXBsYWNlKC94bGluayhIfDpoKS8sXCJoXCIpLnJlcGxhY2UoL3NOYW1lJC8sXCJzXCIpO2Vsc2UgaWYoXCJ3aWR0aFwiIT1sJiZcImhlaWdodFwiIT1sJiZcImhyZWZcIiE9bCYmXCJsaXN0XCIhPWwmJlwiZm9ybVwiIT1sJiZcInRhYkluZGV4XCIhPWwmJlwiZG93bmxvYWRcIiE9bCYmXCJyb3dTcGFuXCIhPWwmJlwiY29sU3BhblwiIT1sJiZcInJvbGVcIiE9bCYmXCJwb3BvdmVyXCIhPWwmJmwgaW4gbil0cnl7bltsXT1udWxsPT11P1wiXCI6dTticmVhayBufWNhdGNoKG4pe31cImZ1bmN0aW9uXCI9PXR5cGVvZiB1fHwobnVsbD09dXx8ITE9PT11JiZcIi1cIiE9bFs0XT9uLnJlbW92ZUF0dHJpYnV0ZShsKTpuLnNldEF0dHJpYnV0ZShsLFwicG9wb3ZlclwiPT1sJiYxPT11P1wiXCI6dSkpfX1mdW5jdGlvbiBGKG4pe3JldHVybiBmdW5jdGlvbih1KXtpZih0aGlzLmwpe3ZhciB0PXRoaXMubFt1LnR5cGUrbl07aWYobnVsbD09dS50KXUudD1jKys7ZWxzZSBpZih1LnQ8dC51KXJldHVybjtyZXR1cm4gdChsLmV2ZW50P2wuZXZlbnQodSk6dSl9fX1mdW5jdGlvbiBPKG4sdSx0LGkscixvLGUsZixjLHMpe3ZhciBhLGgscCx2LHksXyxtLGIsUyxDLE0sJCxQLEEsSCxMLFQsaj11LnR5cGU7aWYobnVsbCE9dS5jb25zdHJ1Y3RvcilyZXR1cm4gbnVsbDsxMjgmdC5fX3UmJihjPSEhKDMyJnQuX191KSxvPVtmPXUuX19lPXQuX19lXSksKGE9bC5fX2IpJiZhKHUpO246aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygail0cnl7aWYoYj11LnByb3BzLFM9XCJwcm90b3R5cGVcImluIGomJmoucHJvdG90eXBlLnJlbmRlcixDPShhPWouY29udGV4dFR5cGUpJiZpW2EuX19jXSxNPWE/Qz9DLnByb3BzLnZhbHVlOmEuX186aSx0Ll9fYz9tPShoPXUuX19jPXQuX19jKS5fXz1oLl9fRTooUz91Ll9fYz1oPW5ldyBqKGIsTSk6KHUuX19jPWg9bmV3IHgoYixNKSxoLmNvbnN0cnVjdG9yPWosaC5yZW5kZXI9RCksQyYmQy5zdWIoaCksaC5wcm9wcz1iLGguc3RhdGV8fChoLnN0YXRlPXt9KSxoLmNvbnRleHQ9TSxoLl9fbj1pLHA9aC5fX2Q9ITAsaC5fX2g9W10saC5fc2I9W10pLFMmJm51bGw9PWguX19zJiYoaC5fX3M9aC5zdGF0ZSksUyYmbnVsbCE9ai5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJihoLl9fcz09aC5zdGF0ZSYmKGguX19zPWQoe30saC5fX3MpKSxkKGguX19zLGouZ2V0RGVyaXZlZFN0YXRlRnJvbVByb3BzKGIsaC5fX3MpKSksdj1oLnByb3BzLHk9aC5zdGF0ZSxoLl9fdj11LHApUyYmbnVsbD09ai5nZXREZXJpdmVkU3RhdGVGcm9tUHJvcHMmJm51bGwhPWguY29tcG9uZW50V2lsbE1vdW50JiZoLmNvbXBvbmVudFdpbGxNb3VudCgpLFMmJm51bGwhPWguY29tcG9uZW50RGlkTW91bnQmJmguX19oLnB1c2goaC5jb21wb25lbnREaWRNb3VudCk7ZWxzZXtpZihTJiZudWxsPT1qLmdldERlcml2ZWRTdGF0ZUZyb21Qcm9wcyYmYiE9PXYmJm51bGwhPWguY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyYmaC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKGIsTSksIWguX19lJiZudWxsIT1oLnNob3VsZENvbXBvbmVudFVwZGF0ZSYmITE9PT1oLnNob3VsZENvbXBvbmVudFVwZGF0ZShiLGguX19zLE0pfHx1Ll9fdj09dC5fX3Ype2Zvcih1Ll9fdiE9dC5fX3YmJihoLnByb3BzPWIsaC5zdGF0ZT1oLl9fcyxoLl9fZD0hMSksdS5fX2U9dC5fX2UsdS5fX2s9dC5fX2ssdS5fX2suc29tZShmdW5jdGlvbihuKXtuJiYobi5fXz11KX0pLCQ9MDskPGguX3NiLmxlbmd0aDskKyspaC5fX2gucHVzaChoLl9zYlskXSk7aC5fc2I9W10saC5fX2gubGVuZ3RoJiZlLnB1c2goaCk7YnJlYWsgbn1udWxsIT1oLmNvbXBvbmVudFdpbGxVcGRhdGUmJmguY29tcG9uZW50V2lsbFVwZGF0ZShiLGguX19zLE0pLFMmJm51bGwhPWguY29tcG9uZW50RGlkVXBkYXRlJiZoLl9faC5wdXNoKGZ1bmN0aW9uKCl7aC5jb21wb25lbnREaWRVcGRhdGUodix5LF8pfSl9aWYoaC5jb250ZXh0PU0saC5wcm9wcz1iLGguX19QPW4saC5fX2U9ITEsUD1sLl9fcixBPTAsUyl7Zm9yKGguc3RhdGU9aC5fX3MsaC5fX2Q9ITEsUCYmUCh1KSxhPWgucmVuZGVyKGgucHJvcHMsaC5zdGF0ZSxoLmNvbnRleHQpLEg9MDtIPGguX3NiLmxlbmd0aDtIKyspaC5fX2gucHVzaChoLl9zYltIXSk7aC5fc2I9W119ZWxzZSBkb3toLl9fZD0hMSxQJiZQKHUpLGE9aC5yZW5kZXIoaC5wcm9wcyxoLnN0YXRlLGguY29udGV4dCksaC5zdGF0ZT1oLl9fc313aGlsZShoLl9fZCYmKytBPDI1KTtoLnN0YXRlPWguX19zLG51bGwhPWguZ2V0Q2hpbGRDb250ZXh0JiYoaT1kKGQoe30saSksaC5nZXRDaGlsZENvbnRleHQoKSkpLFMmJiFwJiZudWxsIT1oLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlJiYoXz1oLmdldFNuYXBzaG90QmVmb3JlVXBkYXRlKHYseSkpLEw9YSxudWxsIT1hJiZhLnR5cGU9PT1rJiZudWxsPT1hLmtleSYmKEw9TihhLnByb3BzLmNoaWxkcmVuKSksZj1JKG4sdyhMKT9MOltMXSx1LHQsaSxyLG8sZSxmLGMscyksaC5iYXNlPXUuX19lLHUuX191Jj0tMTYxLGguX19oLmxlbmd0aCYmZS5wdXNoKGgpLG0mJihoLl9fRT1oLl9fPW51bGwpfWNhdGNoKG4pe2lmKHUuX192PW51bGwsY3x8bnVsbCE9bylpZihuLnRoZW4pe2Zvcih1Ll9fdXw9Yz8xNjA6MTI4O2YmJjg9PWYubm9kZVR5cGUmJmYubmV4dFNpYmxpbmc7KWY9Zi5uZXh0U2libGluZztvW28uaW5kZXhPZihmKV09bnVsbCx1Ll9fZT1mfWVsc2UgZm9yKFQ9by5sZW5ndGg7VC0tOylnKG9bVF0pO2Vsc2UgdS5fX2U9dC5fX2UsdS5fX2s9dC5fX2s7bC5fX2Uobix1LHQpfWVsc2UgbnVsbD09byYmdS5fX3Y9PXQuX192Pyh1Ll9faz10Ll9fayx1Ll9fZT10Ll9fZSk6Zj11Ll9fZT1WKHQuX19lLHUsdCxpLHIsbyxlLGMscyk7cmV0dXJuKGE9bC5kaWZmZWQpJiZhKHUpLDEyOCZ1Ll9fdT92b2lkIDA6Zn1mdW5jdGlvbiB6KG4sdSx0KXtmb3IodmFyIGk9MDtpPHQubGVuZ3RoO2krKylxKHRbaV0sdFsrK2ldLHRbKytpXSk7bC5fX2MmJmwuX19jKHUsbiksbi5zb21lKGZ1bmN0aW9uKHUpe3RyeXtuPXUuX19oLHUuX19oPVtdLG4uc29tZShmdW5jdGlvbihuKXtuLmNhbGwodSl9KX1jYXRjaChuKXtsLl9fZShuLHUuX192KX19KX1mdW5jdGlvbiBOKG4pe3JldHVyblwib2JqZWN0XCIhPXR5cGVvZiBufHxudWxsPT1ufHxuLl9fYiYmbi5fX2I+MD9uOncobik/bi5tYXAoTik6ZCh7fSxuKX1mdW5jdGlvbiBWKHUsdCxpLHIsbyxlLGYsYyxzKXt2YXIgYSxoLHYseSxkLF8sbSxiPWkucHJvcHMsaz10LnByb3BzLHg9dC50eXBlO2lmKFwic3ZnXCI9PXg/bz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI6XCJtYXRoXCI9PXg/bz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTgvTWF0aC9NYXRoTUxcIjpvfHwobz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWxcIiksbnVsbCE9ZSlmb3IoYT0wO2E8ZS5sZW5ndGg7YSsrKWlmKChkPWVbYV0pJiZcInNldEF0dHJpYnV0ZVwiaW4gZD09ISF4JiYoeD9kLmxvY2FsTmFtZT09eDozPT1kLm5vZGVUeXBlKSl7dT1kLGVbYV09bnVsbDticmVha31pZihudWxsPT11KXtpZihudWxsPT14KXJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrKTt1PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhvLHgsay5pcyYmayksYyYmKGwuX19tJiZsLl9fbSh0LGUpLGM9ITEpLGU9bnVsbH1pZihudWxsPT14KWI9PT1rfHxjJiZ1LmRhdGE9PWt8fCh1LmRhdGE9ayk7ZWxzZXtpZihlPWUmJm4uY2FsbCh1LmNoaWxkTm9kZXMpLGI9aS5wcm9wc3x8cCwhYyYmbnVsbCE9ZSlmb3IoYj17fSxhPTA7YTx1LmF0dHJpYnV0ZXMubGVuZ3RoO2ErKyliWyhkPXUuYXR0cmlidXRlc1thXSkubmFtZV09ZC52YWx1ZTtmb3IoYSBpbiBiKWlmKGQ9YlthXSxcImNoaWxkcmVuXCI9PWEpO2Vsc2UgaWYoXCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiPT1hKXY9ZDtlbHNlIGlmKCEoYSBpbiBrKSl7aWYoXCJ2YWx1ZVwiPT1hJiZcImRlZmF1bHRWYWx1ZVwiaW4ga3x8XCJjaGVja2VkXCI9PWEmJlwiZGVmYXVsdENoZWNrZWRcImluIGspY29udGludWU7aih1LGEsbnVsbCxkLG8pfWZvcihhIGluIGspZD1rW2FdLFwiY2hpbGRyZW5cIj09YT95PWQ6XCJkYW5nZXJvdXNseVNldElubmVySFRNTFwiPT1hP2g9ZDpcInZhbHVlXCI9PWE/Xz1kOlwiY2hlY2tlZFwiPT1hP209ZDpjJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBkfHxiW2FdPT09ZHx8aih1LGEsZCxiW2FdLG8pO2lmKGgpY3x8diYmKGguX19odG1sPT12Ll9faHRtbHx8aC5fX2h0bWw9PXUuaW5uZXJIVE1MKXx8KHUuaW5uZXJIVE1MPWguX19odG1sKSx0Ll9faz1bXTtlbHNlIGlmKHYmJih1LmlubmVySFRNTD1cIlwiKSxJKFwidGVtcGxhdGVcIj09dC50eXBlP3UuY29udGVudDp1LHcoeSk/eTpbeV0sdCxpLHIsXCJmb3JlaWduT2JqZWN0XCI9PXg/XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sXCI6byxlLGYsZT9lWzBdOmkuX19rJiZTKGksMCksYyxzKSxudWxsIT1lKWZvcihhPWUubGVuZ3RoO2EtLTspZyhlW2FdKTtjfHwoYT1cInZhbHVlXCIsXCJwcm9ncmVzc1wiPT14JiZudWxsPT1fP3UucmVtb3ZlQXR0cmlidXRlKFwidmFsdWVcIik6bnVsbCE9XyYmKF8hPT11W2FdfHxcInByb2dyZXNzXCI9PXgmJiFffHxcIm9wdGlvblwiPT14JiZfIT1iW2FdKSYmaih1LGEsXyxiW2FdLG8pLGE9XCJjaGVja2VkXCIsbnVsbCE9bSYmbSE9dVthXSYmaih1LGEsbSxiW2FdLG8pKX1yZXR1cm4gdX1mdW5jdGlvbiBxKG4sdSx0KXt0cnl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbil7dmFyIGk9XCJmdW5jdGlvblwiPT10eXBlb2Ygbi5fX3U7aSYmbi5fX3UoKSxpJiZudWxsPT11fHwobi5fX3U9bih1KSl9ZWxzZSBuLmN1cnJlbnQ9dX1jYXRjaChuKXtsLl9fZShuLHQpfX1mdW5jdGlvbiBCKG4sdSx0KXt2YXIgaSxyO2lmKGwudW5tb3VudCYmbC51bm1vdW50KG4pLChpPW4ucmVmKSYmKGkuY3VycmVudCYmaS5jdXJyZW50IT1uLl9fZXx8cShpLG51bGwsdSkpLG51bGwhPShpPW4uX19jKSl7aWYoaS5jb21wb25lbnRXaWxsVW5tb3VudCl0cnl7aS5jb21wb25lbnRXaWxsVW5tb3VudCgpfWNhdGNoKG4pe2wuX19lKG4sdSl9aS5iYXNlPWkuX19QPW51bGx9aWYoaT1uLl9faylmb3Iocj0wO3I8aS5sZW5ndGg7cisrKWlbcl0mJkIoaVtyXSx1LHR8fFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4udHlwZSk7dHx8ZyhuLl9fZSksbi5fX2M9bi5fXz1uLl9fZT12b2lkIDB9ZnVuY3Rpb24gRChuLGwsdSl7cmV0dXJuIHRoaXMuY29uc3RydWN0b3Iobix1KX1mdW5jdGlvbiBFKHUsdCxpKXt2YXIgcixvLGUsZjt0PT1kb2N1bWVudCYmKHQ9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSxsLl9fJiZsLl9fKHUsdCksbz0ocj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBpKT9udWxsOmkmJmkuX19rfHx0Ll9fayxlPVtdLGY9W10sTyh0LHU9KCFyJiZpfHx0KS5fX2s9XyhrLG51bGwsW3VdKSxvfHxwLHAsdC5uYW1lc3BhY2VVUkksIXImJmk/W2ldOm8/bnVsbDp0LmZpcnN0Q2hpbGQ/bi5jYWxsKHQuY2hpbGROb2Rlcyk6bnVsbCxlLCFyJiZpP2k6bz9vLl9fZTp0LmZpcnN0Q2hpbGQscixmKSx6KGUsdSxmKX1mdW5jdGlvbiBHKG4sbCl7RShuLGwsRyl9ZnVuY3Rpb24gSihsLHUsdCl7dmFyIGkscixvLGUsZj1kKHt9LGwucHJvcHMpO2ZvcihvIGluIGwudHlwZSYmbC50eXBlLmRlZmF1bHRQcm9wcyYmKGU9bC50eXBlLmRlZmF1bHRQcm9wcyksdSlcImtleVwiPT1vP2k9dVtvXTpcInJlZlwiPT1vP3I9dVtvXTpmW29dPXZvaWQgMD09PXVbb10mJm51bGwhPWU/ZVtvXTp1W29dO3JldHVybiBhcmd1bWVudHMubGVuZ3RoPjImJihmLmNoaWxkcmVuPWFyZ3VtZW50cy5sZW5ndGg+Mz9uLmNhbGwoYXJndW1lbnRzLDIpOnQpLG0obC50eXBlLGYsaXx8bC5rZXkscnx8bC5yZWYsbnVsbCl9ZnVuY3Rpb24gSyhuKXtmdW5jdGlvbiBsKG4pe3ZhciB1LHQ7cmV0dXJuIHRoaXMuZ2V0Q2hpbGRDb250ZXh0fHwodT1uZXcgU2V0LCh0PXt9KVtsLl9fY109dGhpcyx0aGlzLmdldENoaWxkQ29udGV4dD1mdW5jdGlvbigpe3JldHVybiB0fSx0aGlzLmNvbXBvbmVudFdpbGxVbm1vdW50PWZ1bmN0aW9uKCl7dT1udWxsfSx0aGlzLnNob3VsZENvbXBvbmVudFVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLnByb3BzLnZhbHVlIT1uLnZhbHVlJiZ1LmZvckVhY2goZnVuY3Rpb24obil7bi5fX2U9ITAsTShuKX0pfSx0aGlzLnN1Yj1mdW5jdGlvbihuKXt1LmFkZChuKTt2YXIgbD1uLmNvbXBvbmVudFdpbGxVbm1vdW50O24uY29tcG9uZW50V2lsbFVubW91bnQ9ZnVuY3Rpb24oKXt1JiZ1LmRlbGV0ZShuKSxsJiZsLmNhbGwobil9fSksbi5jaGlsZHJlbn1yZXR1cm4gbC5fX2M9XCJfX2NDXCIraCsrLGwuX189bixsLlByb3ZpZGVyPWwuX19sPShsLkNvbnN1bWVyPWZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uY2hpbGRyZW4obCl9KS5jb250ZXh0VHlwZT1sLGx9bj12LnNsaWNlLGw9e19fZTpmdW5jdGlvbihuLGwsdSx0KXtmb3IodmFyIGkscixvO2w9bC5fXzspaWYoKGk9bC5fX2MpJiYhaS5fXyl0cnl7aWYoKHI9aS5jb25zdHJ1Y3RvcikmJm51bGwhPXIuZ2V0RGVyaXZlZFN0YXRlRnJvbUVycm9yJiYoaS5zZXRTdGF0ZShyLmdldERlcml2ZWRTdGF0ZUZyb21FcnJvcihuKSksbz1pLl9fZCksbnVsbCE9aS5jb21wb25lbnREaWRDYXRjaCYmKGkuY29tcG9uZW50RGlkQ2F0Y2gobix0fHx7fSksbz1pLl9fZCksbylyZXR1cm4gaS5fX0U9aX1jYXRjaChsKXtuPWx9dGhyb3cgbn19LHU9MCx0PWZ1bmN0aW9uKG4pe3JldHVybiBudWxsIT1uJiZudWxsPT1uLmNvbnN0cnVjdG9yfSx4LnByb3RvdHlwZS5zZXRTdGF0ZT1mdW5jdGlvbihuLGwpe3ZhciB1O3U9bnVsbCE9dGhpcy5fX3MmJnRoaXMuX19zIT10aGlzLnN0YXRlP3RoaXMuX19zOnRoaXMuX19zPWQoe30sdGhpcy5zdGF0ZSksXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKG49bihkKHt9LHUpLHRoaXMucHJvcHMpKSxuJiZkKHUsbiksbnVsbCE9biYmdGhpcy5fX3YmJihsJiZ0aGlzLl9zYi5wdXNoKGwpLE0odGhpcykpfSx4LnByb3RvdHlwZS5mb3JjZVVwZGF0ZT1mdW5jdGlvbihuKXt0aGlzLl9fdiYmKHRoaXMuX19lPSEwLG4mJnRoaXMuX19oLnB1c2gobiksTSh0aGlzKSl9LHgucHJvdG90eXBlLnJlbmRlcj1rLGk9W10sbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBQcm9taXNlP1Byb21pc2UucHJvdG90eXBlLnRoZW4uYmluZChQcm9taXNlLnJlc29sdmUoKSk6c2V0VGltZW91dCxlPWZ1bmN0aW9uKG4sbCl7cmV0dXJuIG4uX192Ll9fYi1sLl9fdi5fX2J9LCQuX19yPTAsZj0vKFBvaW50ZXJDYXB0dXJlKSR8Q2FwdHVyZSQvaSxjPTAscz1GKCExKSxhPUYoITApLGg9MDtleHBvcnR7eCBhcyBDb21wb25lbnQsayBhcyBGcmFnbWVudCxKIGFzIGNsb25lRWxlbWVudCxLIGFzIGNyZWF0ZUNvbnRleHQsXyBhcyBjcmVhdGVFbGVtZW50LGIgYXMgY3JlYXRlUmVmLF8gYXMgaCxHIGFzIGh5ZHJhdGUsdCBhcyBpc1ZhbGlkRWxlbWVudCxsIGFzIG9wdGlvbnMsRSBhcyByZW5kZXIsSCBhcyB0b0NoaWxkQXJyYXl9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0Lm1vZHVsZS5qcy5tYXBcbiIsImltcG9ydHtvcHRpb25zIGFzIHIsRnJhZ21lbnQgYXMgZX1mcm9tXCJwcmVhY3RcIjtleHBvcnR7RnJhZ21lbnR9ZnJvbVwicHJlYWN0XCI7dmFyIHQ9L1tcIiY8XS87ZnVuY3Rpb24gbihyKXtpZigwPT09ci5sZW5ndGh8fCExPT09dC50ZXN0KHIpKXJldHVybiByO2Zvcih2YXIgZT0wLG49MCxvPVwiXCIsZj1cIlwiO248ci5sZW5ndGg7bisrKXtzd2l0Y2goci5jaGFyQ29kZUF0KG4pKXtjYXNlIDM0OmY9XCImcXVvdDtcIjticmVhaztjYXNlIDM4OmY9XCImYW1wO1wiO2JyZWFrO2Nhc2UgNjA6Zj1cIiZsdDtcIjticmVhaztkZWZhdWx0OmNvbnRpbnVlfW4hPT1lJiYobys9ci5zbGljZShlLG4pKSxvKz1mLGU9bisxfXJldHVybiBuIT09ZSYmKG8rPXIuc2xpY2UoZSxuKSksb312YXIgbz0vYWNpdHxleCg/OnN8Z3xufHB8JCl8cnBofGdyaWR8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZHxpdGVyYS9pLGY9MCxpPUFycmF5LmlzQXJyYXk7ZnVuY3Rpb24gdShlLHQsbixvLGksdSl7dHx8KHQ9e30pO3ZhciBhLGMscD10O2lmKFwicmVmXCJpbiBwKWZvcihjIGluIHA9e30sdClcInJlZlwiPT1jP2E9dFtjXTpwW2NdPXRbY107dmFyIGw9e3R5cGU6ZSxwcm9wczpwLGtleTpuLHJlZjphLF9fazpudWxsLF9fOm51bGwsX19iOjAsX19lOm51bGwsX19jOm51bGwsY29uc3RydWN0b3I6dm9pZCAwLF9fdjotLWYsX19pOi0xLF9fdTowLF9fc291cmNlOmksX19zZWxmOnV9O2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGUmJihhPWUuZGVmYXVsdFByb3BzKSlmb3IoYyBpbiBhKXZvaWQgMD09PXBbY10mJihwW2NdPWFbY10pO3JldHVybiByLnZub2RlJiZyLnZub2RlKGwpLGx9ZnVuY3Rpb24gYShyKXt2YXIgdD11KGUse3RwbDpyLGV4cHJzOltdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpfSk7cmV0dXJuIHQua2V5PXQuX192LHR9dmFyIGM9e30scD0vW0EtWl0vZztmdW5jdGlvbiBsKGUsdCl7aWYoci5hdHRyKXt2YXIgZj1yLmF0dHIoZSx0KTtpZihcInN0cmluZ1wiPT10eXBlb2YgZilyZXR1cm4gZn1pZih0PWZ1bmN0aW9uKHIpe3JldHVybiBudWxsIT09ciYmXCJvYmplY3RcIj09dHlwZW9mIHImJlwiZnVuY3Rpb25cIj09dHlwZW9mIHIudmFsdWVPZj9yLnZhbHVlT2YoKTpyfSh0KSxcInJlZlwiPT09ZXx8XCJrZXlcIj09PWUpcmV0dXJuXCJcIjtpZihcInN0eWxlXCI9PT1lJiZcIm9iamVjdFwiPT10eXBlb2YgdCl7dmFyIGk9XCJcIjtmb3IodmFyIHUgaW4gdCl7dmFyIGE9dFt1XTtpZihudWxsIT1hJiZcIlwiIT09YSl7dmFyIGw9XCItXCI9PXVbMF0/dTpjW3VdfHwoY1t1XT11LnJlcGxhY2UocCxcIi0kJlwiKS50b0xvd2VyQ2FzZSgpKSxzPVwiO1wiO1wibnVtYmVyXCIhPXR5cGVvZiBhfHxsLnN0YXJ0c1dpdGgoXCItLVwiKXx8by50ZXN0KGwpfHwocz1cInB4O1wiKSxpPWkrbCtcIjpcIithK3N9fXJldHVybiBlKyc9XCInK24oaSkrJ1wiJ31yZXR1cm4gbnVsbD09dHx8ITE9PT10fHxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0fHxcIm9iamVjdFwiPT10eXBlb2YgdD9cIlwiOiEwPT09dD9lOmUrJz1cIicrbihcIlwiK3QpKydcIid9ZnVuY3Rpb24gcyhyKXtpZihudWxsPT1yfHxcImJvb2xlYW5cIj09dHlwZW9mIHJ8fFwiZnVuY3Rpb25cIj09dHlwZW9mIHIpcmV0dXJuIG51bGw7aWYoXCJvYmplY3RcIj09dHlwZW9mIHIpe2lmKHZvaWQgMD09PXIuY29uc3RydWN0b3IpcmV0dXJuIHI7aWYoaShyKSl7Zm9yKHZhciBlPTA7ZTxyLmxlbmd0aDtlKyspcltlXT1zKHJbZV0pO3JldHVybiByfX1yZXR1cm4gbihcIlwiK3IpfWV4cG9ydHt1IGFzIGpzeCxsIGFzIGpzeEF0dHIsdSBhcyBqc3hERVYscyBhcyBqc3hFc2NhcGUsYSBhcyBqc3hUZW1wbGF0ZSx1IGFzIGpzeHN9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9anN4UnVudGltZS5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7b3B0aW9ucyBhcyBufWZyb21cInByZWFjdFwiO3ZhciB0LHIsdSxpLG89MCxmPVtdLGM9bixlPWMuX19iLGE9Yy5fX3Isdj1jLmRpZmZlZCxsPWMuX19jLG09Yy51bm1vdW50LHM9Yy5fXztmdW5jdGlvbiBwKG4sdCl7Yy5fX2gmJmMuX19oKHIsbixvfHx0KSxvPTA7dmFyIHU9ci5fX0h8fChyLl9fSD17X186W10sX19oOltdfSk7cmV0dXJuIG4+PXUuX18ubGVuZ3RoJiZ1Ll9fLnB1c2goe30pLHUuX19bbl19ZnVuY3Rpb24gZChuKXtyZXR1cm4gbz0xLGgoRCxuKX1mdW5jdGlvbiBoKG4sdSxpKXt2YXIgbz1wKHQrKywyKTtpZihvLnQ9biwhby5fX2MmJihvLl9fPVtpP2kodSk6RCh2b2lkIDAsdSksZnVuY3Rpb24obil7dmFyIHQ9by5fX04/by5fX05bMF06by5fX1swXSxyPW8udCh0LG4pO3QhPT1yJiYoby5fX049W3Isby5fX1sxXV0sby5fX2Muc2V0U3RhdGUoe30pKX1dLG8uX19jPXIsIXIuX19mKSl7dmFyIGY9ZnVuY3Rpb24obix0LHIpe2lmKCFvLl9fYy5fX0gpcmV0dXJuITA7dmFyIHU9by5fX2MuX19ILl9fLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hIW4uX19jfSk7aWYodS5ldmVyeShmdW5jdGlvbihuKXtyZXR1cm4hbi5fX059KSlyZXR1cm4hY3x8Yy5jYWxsKHRoaXMsbix0LHIpO3ZhciBpPW8uX19jLnByb3BzIT09bjtyZXR1cm4gdS5mb3JFYWNoKGZ1bmN0aW9uKG4pe2lmKG4uX19OKXt2YXIgdD1uLl9fWzBdO24uX189bi5fX04sbi5fX049dm9pZCAwLHQhPT1uLl9fWzBdJiYoaT0hMCl9fSksYyYmYy5jYWxsKHRoaXMsbix0LHIpfHxpfTtyLl9fZj0hMDt2YXIgYz1yLnNob3VsZENvbXBvbmVudFVwZGF0ZSxlPXIuY29tcG9uZW50V2lsbFVwZGF0ZTtyLmNvbXBvbmVudFdpbGxVcGRhdGU9ZnVuY3Rpb24obix0LHIpe2lmKHRoaXMuX19lKXt2YXIgdT1jO2M9dm9pZCAwLGYobix0LHIpLGM9dX1lJiZlLmNhbGwodGhpcyxuLHQscil9LHIuc2hvdWxkQ29tcG9uZW50VXBkYXRlPWZ9cmV0dXJuIG8uX19OfHxvLl9ffWZ1bmN0aW9uIHkobix1KXt2YXIgaT1wKHQrKywzKTshYy5fX3MmJkMoaS5fX0gsdSkmJihpLl9fPW4saS51PXUsci5fX0guX19oLnB1c2goaSkpfWZ1bmN0aW9uIF8obix1KXt2YXIgaT1wKHQrKyw0KTshYy5fX3MmJkMoaS5fX0gsdSkmJihpLl9fPW4saS51PXUsci5fX2gucHVzaChpKSl9ZnVuY3Rpb24gQShuKXtyZXR1cm4gbz01LFQoZnVuY3Rpb24oKXtyZXR1cm57Y3VycmVudDpufX0sW10pfWZ1bmN0aW9uIEYobix0LHIpe289NixfKGZ1bmN0aW9uKCl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2Ygbil7dmFyIHI9bih0KCkpO3JldHVybiBmdW5jdGlvbigpe24obnVsbCksciYmXCJmdW5jdGlvblwiPT10eXBlb2YgciYmcigpfX1pZihuKXJldHVybiBuLmN1cnJlbnQ9dCgpLGZ1bmN0aW9uKCl7cmV0dXJuIG4uY3VycmVudD1udWxsfX0sbnVsbD09cj9yOnIuY29uY2F0KG4pKX1mdW5jdGlvbiBUKG4scil7dmFyIHU9cCh0KyssNyk7cmV0dXJuIEModS5fX0gscikmJih1Ll9fPW4oKSx1Ll9fSD1yLHUuX19oPW4pLHUuX199ZnVuY3Rpb24gcShuLHQpe3JldHVybiBvPTgsVChmdW5jdGlvbigpe3JldHVybiBufSx0KX1mdW5jdGlvbiB4KG4pe3ZhciB1PXIuY29udGV4dFtuLl9fY10saT1wKHQrKyw5KTtyZXR1cm4gaS5jPW4sdT8obnVsbD09aS5fXyYmKGkuX189ITAsdS5zdWIocikpLHUucHJvcHMudmFsdWUpOm4uX199ZnVuY3Rpb24gUChuLHQpe2MudXNlRGVidWdWYWx1ZSYmYy51c2VEZWJ1Z1ZhbHVlKHQ/dChuKTpuKX1mdW5jdGlvbiBiKG4pe3ZhciB1PXAodCsrLDEwKSxpPWQoKTtyZXR1cm4gdS5fXz1uLHIuY29tcG9uZW50RGlkQ2F0Y2h8fChyLmNvbXBvbmVudERpZENhdGNoPWZ1bmN0aW9uKG4sdCl7dS5fXyYmdS5fXyhuLHQpLGlbMV0obil9KSxbaVswXSxmdW5jdGlvbigpe2lbMV0odm9pZCAwKX1dfWZ1bmN0aW9uIGcoKXt2YXIgbj1wKHQrKywxMSk7aWYoIW4uX18pe2Zvcih2YXIgdT1yLl9fdjtudWxsIT09dSYmIXUuX19tJiZudWxsIT09dS5fXzspdT11Ll9fO3ZhciBpPXUuX19tfHwodS5fX209WzAsMF0pO24uX189XCJQXCIraVswXStcIi1cIitpWzFdKyt9cmV0dXJuIG4uX199ZnVuY3Rpb24gaigpe2Zvcih2YXIgbjtuPWYuc2hpZnQoKTspaWYobi5fX1AmJm4uX19IKXRyeXtuLl9fSC5fX2guZm9yRWFjaCh6KSxuLl9fSC5fX2guZm9yRWFjaChCKSxuLl9fSC5fX2g9W119Y2F0Y2godCl7bi5fX0guX19oPVtdLGMuX19lKHQsbi5fX3YpfX1jLl9fYj1mdW5jdGlvbihuKXtyPW51bGwsZSYmZShuKX0sYy5fXz1mdW5jdGlvbihuLHQpe24mJnQuX19rJiZ0Ll9fay5fX20mJihuLl9fbT10Ll9fay5fX20pLHMmJnMobix0KX0sYy5fX3I9ZnVuY3Rpb24obil7YSYmYShuKSx0PTA7dmFyIGk9KHI9bi5fX2MpLl9fSDtpJiYodT09PXI/KGkuX19oPVtdLHIuX19oPVtdLGkuX18uZm9yRWFjaChmdW5jdGlvbihuKXtuLl9fTiYmKG4uX189bi5fX04pLG4udT1uLl9fTj12b2lkIDB9KSk6KGkuX19oLmZvckVhY2goeiksaS5fX2guZm9yRWFjaChCKSxpLl9faD1bXSx0PTApKSx1PXJ9LGMuZGlmZmVkPWZ1bmN0aW9uKG4pe3YmJnYobik7dmFyIHQ9bi5fX2M7dCYmdC5fX0gmJih0Ll9fSC5fX2gubGVuZ3RoJiYoMSE9PWYucHVzaCh0KSYmaT09PWMucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHwoKGk9Yy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpfHx3KShqKSksdC5fX0guX18uZm9yRWFjaChmdW5jdGlvbihuKXtuLnUmJihuLl9fSD1uLnUpLG4udT12b2lkIDB9KSksdT1yPW51bGx9LGMuX19jPWZ1bmN0aW9uKG4sdCl7dC5zb21lKGZ1bmN0aW9uKG4pe3RyeXtuLl9faC5mb3JFYWNoKHopLG4uX19oPW4uX19oLmZpbHRlcihmdW5jdGlvbihuKXtyZXR1cm4hbi5fX3x8QihuKX0pfWNhdGNoKHIpe3Quc29tZShmdW5jdGlvbihuKXtuLl9faCYmKG4uX19oPVtdKX0pLHQ9W10sYy5fX2UocixuLl9fdil9fSksbCYmbChuLHQpfSxjLnVubW91bnQ9ZnVuY3Rpb24obil7bSYmbShuKTt2YXIgdCxyPW4uX19jO3ImJnIuX19IJiYoci5fX0guX18uZm9yRWFjaChmdW5jdGlvbihuKXt0cnl7eihuKX1jYXRjaChuKXt0PW59fSksci5fX0g9dm9pZCAwLHQmJmMuX19lKHQsci5fX3YpKX07dmFyIGs9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWVzdEFuaW1hdGlvbkZyYW1lO2Z1bmN0aW9uIHcobil7dmFyIHQscj1mdW5jdGlvbigpe2NsZWFyVGltZW91dCh1KSxrJiZjYW5jZWxBbmltYXRpb25GcmFtZSh0KSxzZXRUaW1lb3V0KG4pfSx1PXNldFRpbWVvdXQociwzNSk7ayYmKHQ9cmVxdWVzdEFuaW1hdGlvbkZyYW1lKHIpKX1mdW5jdGlvbiB6KG4pe3ZhciB0PXIsdT1uLl9fYztcImZ1bmN0aW9uXCI9PXR5cGVvZiB1JiYobi5fX2M9dm9pZCAwLHUoKSkscj10fWZ1bmN0aW9uIEIobil7dmFyIHQ9cjtuLl9fYz1uLl9fKCkscj10fWZ1bmN0aW9uIEMobix0KXtyZXR1cm4hbnx8bi5sZW5ndGghPT10Lmxlbmd0aHx8dC5zb21lKGZ1bmN0aW9uKHQscil7cmV0dXJuIHQhPT1uW3JdfSl9ZnVuY3Rpb24gRChuLHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQ/dChuKTp0fWV4cG9ydHtxIGFzIHVzZUNhbGxiYWNrLHggYXMgdXNlQ29udGV4dCxQIGFzIHVzZURlYnVnVmFsdWUseSBhcyB1c2VFZmZlY3QsYiBhcyB1c2VFcnJvckJvdW5kYXJ5LGcgYXMgdXNlSWQsRiBhcyB1c2VJbXBlcmF0aXZlSGFuZGxlLF8gYXMgdXNlTGF5b3V0RWZmZWN0LFQgYXMgdXNlTWVtbyxoIGFzIHVzZVJlZHVjZXIsQSBhcyB1c2VSZWYsZCBhcyB1c2VTdGF0ZX07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ob29rcy5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnR7Y3JlYXRlQ29udGV4dCBhcyBuLENvbXBvbmVudCBhcyB0LHRvQ2hpbGRBcnJheSBhcyByLGNsb25lRWxlbWVudCBhcyBpLGggYXMgb31mcm9tXCJwcmVhY3RcIjtpbXBvcnR7dXNlQ29udGV4dCBhcyBlLHVzZVN0YXRlIGFzIHUsdXNlRWZmZWN0IGFzIGZ9ZnJvbVwicHJlYWN0L2hvb2tzXCI7dmFyIGE9e307ZnVuY3Rpb24gYyhuLHQpe2Zvcih2YXIgciBpbiB0KW5bcl09dFtyXTtyZXR1cm4gbn1mdW5jdGlvbiBzKG4sdCxyKXt2YXIgaSxvPS8oPzpcXD8oW14jXSopKT8oIy4qKT8kLyxlPW4ubWF0Y2gobyksdT17fTtpZihlJiZlWzFdKWZvcih2YXIgZj1lWzFdLnNwbGl0KFwiJlwiKSxjPTA7YzxmLmxlbmd0aDtjKyspe3ZhciBzPWZbY10uc3BsaXQoXCI9XCIpO3VbZGVjb2RlVVJJQ29tcG9uZW50KHNbMF0pXT1kZWNvZGVVUklDb21wb25lbnQocy5zbGljZSgxKS5qb2luKFwiPVwiKSl9bj1kKG4ucmVwbGFjZShvLFwiXCIpKSx0PWQodHx8XCJcIik7Zm9yKHZhciBoPU1hdGgubWF4KG4ubGVuZ3RoLHQubGVuZ3RoKSx2PTA7djxoO3YrKylpZih0W3ZdJiZcIjpcIj09PXRbdl0uY2hhckF0KDApKXt2YXIgbD10W3ZdLnJlcGxhY2UoLyheOnxbKyo/XSskKS9nLFwiXCIpLHA9KHRbdl0ubWF0Y2goL1srKj9dKyQvKXx8YSlbMF18fFwiXCIsbT1+cC5pbmRleE9mKFwiK1wiKSx5PX5wLmluZGV4T2YoXCIqXCIpLFU9blt2XXx8XCJcIjtpZighVSYmIXkmJihwLmluZGV4T2YoXCI/XCIpPDB8fG0pKXtpPSExO2JyZWFrfWlmKHVbbF09ZGVjb2RlVVJJQ29tcG9uZW50KFUpLG18fHkpe3VbbF09bi5zbGljZSh2KS5tYXAoZGVjb2RlVVJJQ29tcG9uZW50KS5qb2luKFwiL1wiKTticmVha319ZWxzZSBpZih0W3ZdIT09blt2XSl7aT0hMTticmVha31yZXR1cm4oITA9PT1yLmRlZmF1bHR8fCExIT09aSkmJnV9ZnVuY3Rpb24gaChuLHQpe3JldHVybiBuLnJhbms8dC5yYW5rPzE6bi5yYW5rPnQucmFuaz8tMTpuLmluZGV4LXQuaW5kZXh9ZnVuY3Rpb24gdihuLHQpe3JldHVybiBuLmluZGV4PXQsbi5yYW5rPWZ1bmN0aW9uKG4pe3JldHVybiBuLnByb3BzLmRlZmF1bHQ/MDpkKG4ucHJvcHMucGF0aCkubWFwKGwpLmpvaW4oXCJcIil9KG4pLG4ucHJvcHN9ZnVuY3Rpb24gZChuKXtyZXR1cm4gbi5yZXBsYWNlKC8oXlxcLyt8XFwvKyQpL2csXCJcIikuc3BsaXQoXCIvXCIpfWZ1bmN0aW9uIGwobil7cmV0dXJuXCI6XCI9PW4uY2hhckF0KDApPzErXCIqKz9cIi5pbmRleE9mKG4uY2hhckF0KG4ubGVuZ3RoLTEpKXx8NDo1fXZhciBwPXt9LG09W10seT1bXSxVPW51bGwsZz17dXJsOlIoKX0saz1uKGcpO2Z1bmN0aW9uIEMoKXt2YXIgbj1lKGspO2lmKG49PT1nKXt2YXIgdD11KClbMV07ZihmdW5jdGlvbigpe3JldHVybiB5LnB1c2godCksZnVuY3Rpb24oKXtyZXR1cm4geS5zcGxpY2UoeS5pbmRleE9mKHQpLDEpfX0sW10pfXJldHVybltuLCRdfWZ1bmN0aW9uIFIoKXt2YXIgbjtyZXR1cm5cIlwiKygobj1VJiZVLmxvY2F0aW9uP1UubG9jYXRpb246VSYmVS5nZXRDdXJyZW50TG9jYXRpb24/VS5nZXRDdXJyZW50TG9jYXRpb24oKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgbG9jYXRpb24/bG9jYXRpb246cCkucGF0aG5hbWV8fFwiXCIpKyhuLnNlYXJjaHx8XCJcIil9ZnVuY3Rpb24gJChuLHQpe3JldHVybiB2b2lkIDA9PT10JiYodD0hMSksXCJzdHJpbmdcIiE9dHlwZW9mIG4mJm4udXJsJiYodD1uLnJlcGxhY2Usbj1uLnVybCksZnVuY3Rpb24obil7Zm9yKHZhciB0PW0ubGVuZ3RoO3QtLTspaWYobVt0XS5jYW5Sb3V0ZShuKSlyZXR1cm4hMDtyZXR1cm4hMX0obikmJmZ1bmN0aW9uKG4sdCl7dm9pZCAwPT09dCYmKHQ9XCJwdXNoXCIpLFUmJlVbdF0/VVt0XShuKTpcInVuZGVmaW5lZFwiIT10eXBlb2YgaGlzdG9yeSYmaGlzdG9yeVt0K1wiU3RhdGVcIl0mJmhpc3RvcnlbdCtcIlN0YXRlXCJdKG51bGwsbnVsbCxuKX0obix0P1wicmVwbGFjZVwiOlwicHVzaFwiKSxJKG4pfWZ1bmN0aW9uIEkobil7Zm9yKHZhciB0PSExLHI9MDtyPG0ubGVuZ3RoO3IrKyltW3JdLnJvdXRlVG8obikmJih0PSEwKTtyZXR1cm4gdH1mdW5jdGlvbiBNKG4pe2lmKG4mJm4uZ2V0QXR0cmlidXRlKXt2YXIgdD1uLmdldEF0dHJpYnV0ZShcImhyZWZcIikscj1uLmdldEF0dHJpYnV0ZShcInRhcmdldFwiKTtpZih0JiZ0Lm1hdGNoKC9eXFwvL2cpJiYoIXJ8fHIubWF0Y2goL15fP3NlbGYkL2kpKSlyZXR1cm4gJCh0KX19ZnVuY3Rpb24gYihuKXtyZXR1cm4gbi5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24mJm4uc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCksbi5zdG9wUHJvcGFnYXRpb24mJm4uc3RvcFByb3BhZ2F0aW9uKCksbi5wcmV2ZW50RGVmYXVsdCgpLCExfWZ1bmN0aW9uIFcobil7aWYoIShuLmN0cmxLZXl8fG4ubWV0YUtleXx8bi5hbHRLZXl8fG4uc2hpZnRLZXl8fG4uYnV0dG9uKSl7dmFyIHQ9bi50YXJnZXQ7ZG97aWYoXCJhXCI9PT10LmxvY2FsTmFtZSYmdC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpKXtpZih0Lmhhc0F0dHJpYnV0ZShcImRhdGEtbmF0aXZlXCIpfHx0Lmhhc0F0dHJpYnV0ZShcIm5hdGl2ZVwiKSlyZXR1cm47aWYoTSh0KSlyZXR1cm4gYihuKX19d2hpbGUodD10LnBhcmVudE5vZGUpfX12YXIgdz0hMTtmdW5jdGlvbiBEKG4pe24uaGlzdG9yeSYmKFU9bi5oaXN0b3J5KSx0aGlzLnN0YXRlPXt1cmw6bi51cmx8fFIoKX19YyhELnByb3RvdHlwZT1uZXcgdCx7c2hvdWxkQ29tcG9uZW50VXBkYXRlOmZ1bmN0aW9uKG4pe3JldHVybiEwIT09bi5zdGF0aWN8fG4udXJsIT09dGhpcy5wcm9wcy51cmx8fG4ub25DaGFuZ2UhPT10aGlzLnByb3BzLm9uQ2hhbmdlfSxjYW5Sb3V0ZTpmdW5jdGlvbihuKXt2YXIgdD1yKHRoaXMucHJvcHMuY2hpbGRyZW4pO3JldHVybiB2b2lkIDAhPT10aGlzLmcodCxuKX0scm91dGVUbzpmdW5jdGlvbihuKXt0aGlzLnNldFN0YXRlKHt1cmw6bn0pO3ZhciB0PXRoaXMuY2FuUm91dGUobik7cmV0dXJuIHRoaXMucHx8dGhpcy5mb3JjZVVwZGF0ZSgpLHR9LGNvbXBvbmVudFdpbGxNb3VudDpmdW5jdGlvbigpe3RoaXMucD0hMH0sY29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKXt2YXIgbj10aGlzO3d8fCh3PSEwLFV8fGFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLGZ1bmN0aW9uKCl7SShSKCkpfSksYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsVykpLG0ucHVzaCh0aGlzKSxVJiYodGhpcy51PVUubGlzdGVuKGZ1bmN0aW9uKHQpe3ZhciByPXQubG9jYXRpb258fHQ7bi5yb3V0ZVRvKFwiXCIrKHIucGF0aG5hbWV8fFwiXCIpKyhyLnNlYXJjaHx8XCJcIikpfSkpLHRoaXMucD0hMX0sY29tcG9uZW50V2lsbFVubW91bnQ6ZnVuY3Rpb24oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0aGlzLnUmJnRoaXMudSgpLG0uc3BsaWNlKG0uaW5kZXhPZih0aGlzKSwxKX0sY29tcG9uZW50V2lsbFVwZGF0ZTpmdW5jdGlvbigpe3RoaXMucD0hMH0sY29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCl7dGhpcy5wPSExfSxnOmZ1bmN0aW9uKG4sdCl7bj1uLmZpbHRlcih2KS5zb3J0KGgpO2Zvcih2YXIgcj0wO3I8bi5sZW5ndGg7cisrKXt2YXIgaT1uW3JdLG89cyh0LGkucHJvcHMucGF0aCxpLnByb3BzKTtpZihvKXJldHVybltpLG9dfX0scmVuZGVyOmZ1bmN0aW9uKG4sdCl7dmFyIGUsdSxmPW4ub25DaGFuZ2UsYT10LnVybCxzPXRoaXMuYyxoPXRoaXMuZyhyKG4uY2hpbGRyZW4pLGEpO2lmKGgmJih1PWkoaFswXSxjKGMoe3VybDphLG1hdGNoZXM6ZT1oWzFdfSxlKSx7a2V5OnZvaWQgMCxyZWY6dm9pZCAwfSkpKSxhIT09KHMmJnMudXJsKSl7YyhnLHM9dGhpcy5jPXt1cmw6YSxwcmV2aW91czpzJiZzLnVybCxjdXJyZW50OnUscGF0aDp1P3UucHJvcHMucGF0aDpudWxsLG1hdGNoZXM6ZX0pLHMucm91dGVyPXRoaXMscy5hY3RpdmU9dT9bdV06W107Zm9yKHZhciB2PXkubGVuZ3RoO3YtLTspeVt2XSh7fSk7XCJmdW5jdGlvblwiPT10eXBlb2YgZiYmZihzKX1yZXR1cm4gbyhrLlByb3ZpZGVyLHt2YWx1ZTpzfSx1KX19KTt2YXIgRT1mdW5jdGlvbihuKXtyZXR1cm4gbyhcImFcIixjKHtvbkNsaWNrOld9LG4pKX0sTD1mdW5jdGlvbihuKXtyZXR1cm4gbyhuLmNvbXBvbmVudCxuKX07ZXhwb3J0e0UgYXMgTGluayxMIGFzIFJvdXRlLEQgYXMgUm91dGVyLEQgYXMgZGVmYXVsdCxzIGFzIGV4ZWMsUiBhcyBnZXRDdXJyZW50VXJsLCQgYXMgcm91dGUsQyBhcyB1c2VSb3V0ZXJ9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHJlYWN0LXJvdXRlci5tb2R1bGUuanMubWFwXG4iLCJpbXBvcnQgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAncHJlYWN0J1xyXG5pbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2sgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcblxyXG5jb25zdCBBcGlDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpXHJcblxyXG4vLyBPbmx5IGluY2x1ZGUgbW9jayBkYXRhIGluIGRldmVsb3BtZW50IGJ1aWxkc1xyXG5jb25zdCBjcmVhdGVNb2NrRGF0YSA9ICgpID0+IHtcclxuICBpZiAoaW1wb3J0Lm1ldGEuZW52LlBST0QpIHtcclxuICAgIHJldHVybiB7IHRhbmtzOiBbXSwgcmVjaXBlczogW10sIHNldHRpbmdzOiB7fSwgc3lzdGVtOiB7fSwgc2NhbGU6IHt9IH1cclxuICB9XHJcbiAgXHJcbiAgcmV0dXJuIHtcclxuICAgIHRhbmtzOiBbXHJcbiAgICAgIHsgXHJcbiAgICAgICAgdWlkOiAnQTRDRjEyRkVEQ0JBMDAwMScsIFxyXG4gICAgICAgIG5hbWU6ICdQcmVtaXVtIENoaWNrZW4nLCBcclxuICAgICAgICBsZXZlbDogODUsIFxyXG4gICAgICAgIGNhcGFjaXR5OiAxMDAwLCBcclxuICAgICAgICBkZW5zaXR5OiAwLjQ1LFxyXG4gICAgICAgIGxhc3REaXNwZW5zZWQ6IERhdGUubm93KCkgLSAzNjAwMDAwLFxyXG4gICAgICAgIHRvdGFsRGlzcGVuc2VkOiAyNTAwLFxyXG4gICAgICAgIGNhbGlicmF0aW9uOiB7IGlkbGVQd206IDE1MDAsIGRpc3BlbnNlUHdtOiAyMDAwLCBkaXNwZW5zZVRpbWVNczogNTAwIH1cclxuICAgICAgfSxcclxuICAgICAgeyBcclxuICAgICAgICB1aWQ6ICdBNENGMTJGRURDQkEwMDAyJywgXHJcbiAgICAgICAgbmFtZTogJ0Zpc2ggVHJlYXRzJywgXHJcbiAgICAgICAgbGV2ZWw6IDYwLCBcclxuICAgICAgICBjYXBhY2l0eTogMTAwMCwgXHJcbiAgICAgICAgZGVuc2l0eTogMC4zOCxcclxuICAgICAgICBsYXN0RGlzcGVuc2VkOiBEYXRlLm5vdygpIC0gNzIwMDAwMCxcclxuICAgICAgICB0b3RhbERpc3BlbnNlZDogMTgwMCxcclxuICAgICAgICBjYWxpYnJhdGlvbjogeyBpZGxlUHdtOiAxNTIwLCBkaXNwZW5zZVB3bTogMTk4MCwgZGlzcGVuc2VUaW1lTXM6IDQ1MCB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHsgXHJcbiAgICAgICAgdWlkOiAnQTRDRjEyRkVEQ0JBMDAwMycsIFxyXG4gICAgICAgIG5hbWU6ICdIZWFsdGh5IE1peCcsIFxyXG4gICAgICAgIGxldmVsOiAyMCwgXHJcbiAgICAgICAgY2FwYWNpdHk6IDEwMDAsIFxyXG4gICAgICAgIGRlbnNpdHk6IDAuNTIsXHJcbiAgICAgICAgbGFzdERpc3BlbnNlZDogRGF0ZS5ub3coKSAtIDE4MDAwMDAsXHJcbiAgICAgICAgdG90YWxEaXNwZW5zZWQ6IDMyMDAsXHJcbiAgICAgICAgY2FsaWJyYXRpb246IHsgaWRsZVB3bTogMTQ4MCwgZGlzcGVuc2VQd206IDIwMjAsIGRpc3BlbnNlVGltZU1zOiA1MjAgfVxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgcmVjaXBlczogW1xyXG4gICAgICB7IFxyXG4gICAgICAgIGlkOiAwLCBcclxuICAgICAgICBuYW1lOiAnTW9ybmluZyBNaXgnLCBcclxuICAgICAgICB0b3RhbFdlaWdodDogMTAwLFxyXG4gICAgICAgIHNlcnZpbmdzOiAyLFxyXG4gICAgICAgIHRhbmtzOiBbXHJcbiAgICAgICAgICB7IHRhbmtVaWQ6ICdBNENGMTJGRURDQkEwMDAxJywgcGVyY2VudGFnZTogNjAgfSxcclxuICAgICAgICAgIHsgdGFua1VpZDogJ0E0Q0YxMkZFRENCQTAwMDInLCBwZXJjZW50YWdlOiA0MCB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBjcmVhdGVkOiBEYXRlLm5vdygpIC0gODY0MDAwMDAsXHJcbiAgICAgICAgbGFzdFVzZWQ6IERhdGUubm93KCkgLSAzNjAwMDAwXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBpZDogMSxcclxuICAgICAgICBuYW1lOiAnRXZlbmluZyBGZWFzdCcsXHJcbiAgICAgICAgdG90YWxXZWlnaHQ6IDE1MCxcclxuICAgICAgICBzZXJ2aW5nczogMyxcclxuICAgICAgICB0YW5rczogW1xyXG4gICAgICAgICAgeyB0YW5rVWlkOiAnQTRDRjEyRkVEQ0JBMDAwMScsIHBlcmNlbnRhZ2U6IDMwIH0sXHJcbiAgICAgICAgICB7IHRhbmtVaWQ6ICdBNENGMTJGRURDQkEwMDAyJywgcGVyY2VudGFnZTogMzAgfSxcclxuICAgICAgICAgIHsgdGFua1VpZDogJ0E0Q0YxMkZFRENCQTAwMDMnLCBwZXJjZW50YWdlOiA0MCB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBjcmVhdGVkOiBEYXRlLm5vdygpIC0gMTcyODAwMDAwLFxyXG4gICAgICAgIGxhc3RVc2VkOiBEYXRlLm5vdygpIC0gNzIwMDAwMFxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgc2V0dGluZ3M6IHtcclxuICAgICAgZGV2aWNlTmFtZTogaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09ICdkZWJ1ZycgPyAnS2liYmxlVDUtREVCVUcnIDogJ0tpYmJsZVQ1JyxcclxuICAgICAgdGltZXpvbmU6ICdVVEMrMScsXHJcbiAgICAgIHdpZmlTdHJlbmd0aDogLTQ1LFxyXG4gICAgICBzYWZldHlNb2RlOiB0cnVlLFxyXG4gICAgICBhdXRvUmVmaWxsQWxlcnRzOiB0cnVlLFxyXG4gICAgICBmZWVkaW5nU2V0dGluZ3M6IHtcclxuICAgICAgICBtYXhEaXNwZW5zZVBlckhvdXI6IDEwLFxyXG4gICAgICAgIG1pblRpbWVCZXR3ZWVuRmVlZHM6IDMwMFxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgc3lzdGVtOiB7XHJcbiAgICAgIGRldmljZU5hbWU6IGltcG9ydC5tZXRhLmVudi5NT0RFID09PSAnZGVidWcnID8gJ0tpYmJsZVQ1LURFQlVHJyA6ICdLaWJibGVUNScsXHJcbiAgICAgIGZpcm13YXJlVmVyc2lvbjogaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09ICdkZWJ1ZycgPyAnMS4wLjAtZGVidWcnIDogJzEuMC4wJyxcclxuICAgICAgYnVpbGREYXRlOiAnMjAyNS0wNy0wMycsXHJcbiAgICAgIHVwdGltZTogMzYwMDAwMCxcclxuICAgICAgZnJlZUhlYXA6IDQ1MDAwLFxyXG4gICAgICB3aWZpU3RyZW5ndGg6IC00NVxyXG4gICAgfSxcclxuICAgIHNjYWxlOiB7XHJcbiAgICAgIHJhd1ZhbHVlOiAyMDQ1LFxyXG4gICAgICB3ZWlnaHQ6IDk4LjcsXHJcbiAgICAgIHN0YWJsZTogdHJ1ZSxcclxuICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gQXBpUHJvdmlkZXIoeyBjaGlsZHJlbiB9KSB7XHJcbiAgY29uc3QgW2RhdGEsIHNldERhdGFdID0gdXNlU3RhdGUoY3JlYXRlTW9ja0RhdGEoKSlcclxuICBjb25zdCBbbG9hZGluZywgc2V0TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpXHJcblxyXG4gIGNvbnN0IGJhc2VVcmwgPSBpbXBvcnQubWV0YS5lbnYuREVWID8gJy9hcGknIDogJydcclxuXHJcbiAgLy8gTW9jayByZXNwb25zZSBnZW5lcmF0b3IgLSBvbmx5IHVzZWQgaW4gZGV2ZWxvcG1lbnRcclxuICBjb25zdCBnZXRNb2NrUmVzcG9uc2UgPSAoZW5kcG9pbnQsIG9wdGlvbnMpID0+IHtcclxuICAgIGlmIChpbXBvcnQubWV0YS5lbnYuUFJPRCkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdNb2NrIHJlc3BvbnNlIGNhbGxlZCBpbiBwcm9kdWN0aW9uIGJ1aWxkIScpXHJcbiAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ01vY2sgZGF0YSBub3QgYXZhaWxhYmxlIGluIHByb2R1Y3Rpb24nIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXRoUGFydHMgPSBlbmRwb2ludC5zcGxpdCgnLycpLmZpbHRlcihCb29sZWFuKVxyXG4gICAgY29uc3QgW3Jlc291cmNlLCBpZGVudGlmaWVyLCBzdWJSZXNvdXJjZV0gPSBwYXRoUGFydHNcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coYPCflKcgW0RFVl0gTW9jayByZXNwb25zZSBmb3I6ICR7b3B0aW9ucy5tZXRob2QgfHwgJ0dFVCd9ICR7ZW5kcG9pbnR9YClcclxuXHJcbiAgICBzd2l0Y2ggKHJlc291cmNlKSB7XHJcbiAgICAgIGNhc2UgJ3N5c3RlbSc6XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAnaW5mbycpIHJldHVybiBkYXRhLnN5c3RlbVxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ3N0YXR1cycpIHJldHVybiB7IG9wZXJhdGlvbmFsOiB0cnVlLCBsYXN0RXJyb3I6IG51bGwsIHNhZmV0eU1vZGU6IHRydWUsIGF1dG9SZWZpbGxBbGVydHM6IHRydWUgfVxyXG4gICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBtZXNzYWdlOiAnU3lzdGVtIG9wZXJhdGlvbiBjb21wbGV0ZWQnIH1cclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgY2FzZSAnc2V0dGluZ3MnOlxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ2V4cG9ydCcpIHJldHVybiB7IHNldHRpbmdzOiBkYXRhLnNldHRpbmdzLCB0YW5rczogZGF0YS50YW5rcywgcmVjaXBlczogZGF0YS5yZWNpcGVzIH1cclxuICAgICAgICBpZiAob3B0aW9ucy5tZXRob2QgPT09ICdQVVQnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5zZXR0aW5nc1xyXG5cclxuICAgICAgY2FzZSAndGFua3MnOlxyXG4gICAgICAgIGlmIChpZGVudGlmaWVyICYmIHN1YlJlc291cmNlID09PSAnaGlzdG9yeScpIHJldHVybiBbXHJcbiAgICAgICAgICB7IHRpbWVzdGFtcDogRGF0ZS5ub3coKSAtIDM2MDAwMDAsIGFtb3VudDogMjUsIHJlY2lwZUlkOiAxLCByZWNpcGVOYW1lOiAnTW9ybmluZyBNaXgnIH1cclxuICAgICAgICBdXHJcbiAgICAgICAgaWYgKGlkZW50aWZpZXIgJiYgb3B0aW9ucy5tZXRob2QgPT09ICdQVVQnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH1cclxuICAgICAgICBpZiAoaWRlbnRpZmllcikgcmV0dXJuIGRhdGEudGFua3MuZmluZCh0ID0+IHQudWlkID09PSBpZGVudGlmaWVyKSB8fCBkYXRhLnRhbmtzWzBdXHJcbiAgICAgICAgcmV0dXJuIGRhdGEudGFua3NcclxuXHJcbiAgICAgIGNhc2UgJ2ZlZWQnOlxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ2hpc3RvcnknKSByZXR1cm4gW1xyXG4gICAgICAgICAgeyB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAzNjAwMDAwLCB0eXBlOiAncmVjaXBlJywgcmVjaXBlSWQ6IDEsIHN1Y2Nlc3M6IHRydWUsIGFtb3VudDogOTguNSB9XHJcbiAgICAgICAgXVxyXG4gICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSB7XHJcbiAgICAgICAgICBpZiAoc3ViUmVzb3VyY2UgPT09ICdpbW1lZGlhdGUnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBkaXNwZW5zZWQ6IDI0LjgsIHJlbWFpbmluZ0xldmVsOiA4MiB9XHJcbiAgICAgICAgICBpZiAoc3ViUmVzb3VyY2UgPT09ICdyZWNpcGUnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCB0b3RhbERpc3BlbnNlZDogOTguNSwgYnJlYWtkb3duOiBbeyB0YW5rVWlkOiAnQTRDRjEyRkVEQ0JBMDAwMScsIGFtb3VudDogNTkuMSB9XSB9XHJcbiAgICAgICAgICBpZiAoc3ViUmVzb3VyY2UgPT09ICdlbWVyZ2VuY3knKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCB0YW5rc0Rpc3BlbnNlZDogZGF0YS50YW5rcy5tYXAodCA9PiB0LnVpZCksIHRvdGFsQW1vdW50OiBkYXRhLnRhbmtzLmxlbmd0aCAqIDEwIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGNhc2UgJ3JlY2lwZXMnOlxyXG4gICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBpZDogZGF0YS5yZWNpcGVzLmxlbmd0aCB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnUFVUJykgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbiAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnREVMRVRFJykgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEucmVjaXBlc1xyXG5cclxuICAgICAgY2FzZSAnc2NhbGUnOlxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ2N1cnJlbnQnKSByZXR1cm4ge1xyXG4gICAgICAgICAgcmF3VmFsdWU6IDIwNDUgKyBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyMCAtIDEwKSxcclxuICAgICAgICAgIHdlaWdodDogKDk4LjcgKyBNYXRoLnJhbmRvbSgpICogMiAtIDEpLnRvRml4ZWQoMSksXHJcbiAgICAgICAgICBzdGFibGU6IE1hdGgucmFuZG9tKCkgPiAwLjIsXHJcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAndGFyZScgJiYgb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJykgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbmV3WmVyb1ZhbHVlOiAyMDQ1LCBtZXNzYWdlOiAnU2NhbGUgdGFyZWQgc3VjY2Vzc2Z1bGx5JyB9XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAnY2FsaWJyYXRlJyAmJiBvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBuZXdDYWxpYnJhdGlvbkZhY3RvcjogMC4wNDY1LCBtZXNzYWdlOiAnU2NhbGUgY2FsaWJyYXRlZCcgfVxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBjYXNlICdjYWxpYnJhdGlvbic6XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAnc2Vydm9zJykge1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnUFVUJykgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9XHJcbiAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0YW5rczogZGF0YS50YW5rcy5tYXAodCA9PiAoeyB1aWQ6IHQudWlkLCBuYW1lOiB0Lm5hbWUsIC4uLnQuY2FsaWJyYXRpb24gfSkpLFxyXG4gICAgICAgICAgICBob3BwZXI6IHsgY2xvc2VkUHdtOiAxMDAwLCBvcGVuUHdtOiAyMDAwIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAnc2Vydm8tdGVzdCcgJiYgb3B0aW9ucy5tZXRob2QgPT09ICdQT1NUJykgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogJ1NlcnZvIHRlc3QgY29tcGxldGVkJyB9XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAndGFuay1kaXNwZW5zZS10ZXN0JyAmJiBvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnKSByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCBhY3R1YWxBbW91bnQ6IDI0LjgsIHN1Z2dlc3RlZER1cmF0aW9uOiA0ODUsIGFjY3VyYWN5OiA5OS4yIH1cclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgY2FzZSAnZGlhZ25vc3RpY3MnOlxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ3NlbnNvcnMnKSByZXR1cm4ge1xyXG4gICAgICAgICAgc2NhbGU6IGRhdGEuc2NhbGUsXHJcbiAgICAgICAgICB0YW5rTGV2ZWxzOiBkYXRhLnRhbmtzLm1hcCh0ID0+ICh7IHVpZDogdC51aWQsIGxldmVsOiB0LmxldmVsLCBzZW5zb3JUeXBlOiAndWx0cmFzb25pYycgfSkpLFxyXG4gICAgICAgICAgdGVtcGVyYXR1cmU6IDIzLjUsXHJcbiAgICAgICAgICBodW1pZGl0eTogNDUuMlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc3ViUmVzb3VyY2UgPT09ICdzZXJ2b3MnKSByZXR1cm4ge1xyXG4gICAgICAgICAgdGFua3M6IGRhdGEudGFua3MubWFwKHQgPT4gKHsgdWlkOiB0LnVpZCwgY29ubmVjdGVkOiB0cnVlLCBjdXJyZW50UG9zaXRpb246IHQuY2FsaWJyYXRpb24uaWRsZVB3bSB9KSksXHJcbiAgICAgICAgICBob3BwZXI6IHsgY29ubmVjdGVkOiB0cnVlLCBjdXJyZW50UG9zaXRpb246IDEwMDAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBicmVha1xyXG5cclxuICAgICAgY2FzZSAnbmV0d29yayc6XHJcbiAgICAgICAgaWYgKHN1YlJlc291cmNlID09PSAnaW5mbycpIHJldHVybiB7XHJcbiAgICAgICAgICBzc2lkOiAnTXlXaUZpLURFVicsXHJcbiAgICAgICAgICBpcEFkZHJlc3M6ICcxOTIuMTY4LjEuMTAwJyxcclxuICAgICAgICAgIG1hY0FkZHJlc3M6ICdBNDpDRjoxMjpGRTpEQzpCQScsXHJcbiAgICAgICAgICBzaWduYWxTdHJlbmd0aDogLTQ1LFxyXG4gICAgICAgICAgY29ubmVjdGVkOiB0cnVlLFxyXG4gICAgICAgICAgdXB0aW1lOiAzNjAwMDAwXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcblxyXG4gICAgICBjYXNlICdsb2dzJzpcclxuICAgICAgICBpZiAoc3ViUmVzb3VyY2UgPT09ICdzeXN0ZW0nKSByZXR1cm4gW1xyXG4gICAgICAgICAgeyB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAzNjAwMDAwLCBsZXZlbDogJ0lORk8nLCBtZXNzYWdlOiAnRGV2aWNlIHN0YXJ0ZWQgc3VjY2Vzc2Z1bGx5JywgY29tcG9uZW50OiAnU1lTVEVNJyB9XHJcbiAgICAgICAgXVxyXG4gICAgICAgIGlmIChzdWJSZXNvdXJjZSA9PT0gJ2ZlZWRpbmcnKSByZXR1cm4gW1xyXG4gICAgICAgICAgeyB0aW1lc3RhbXA6IERhdGUubm93KCkgLSAzNjAwMDAwLCB0eXBlOiAncmVjaXBlJywgcmVjaXBlSWQ6IDEsIHN1Y2Nlc3M6IHRydWUsIGFtb3VudDogOTguNSB9XHJcbiAgICAgICAgXVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSwgbWVzc2FnZTogYERldiBmYWxsYmFjayBmb3IgJHtvcHRpb25zLm1ldGhvZCB8fCAnR0VUJ30gJHtlbmRwb2ludH1gIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IGFwaUNhbGwgPSB1c2VDYWxsYmFjayhhc3luYyAoZW5kcG9pbnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xyXG4gICAgc2V0TG9hZGluZyh0cnVlKVxyXG4gICAgc2V0RXJyb3IobnVsbClcclxuICAgIFxyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgdXJsID0gaW1wb3J0Lm1ldGEuZW52LkRFViA/IGAvYXBpJHtlbmRwb2ludH1gIDogYCR7YmFzZVVybH0ke2VuZHBvaW50fWBcclxuICAgICAgXHJcbiAgICAgIC8vIENyZWF0ZSBBYm9ydENvbnRyb2xsZXIgZm9yIDUtc2Vjb25kIHRpbWVvdXRcclxuICAgICAgY29uc3QgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKVxyXG4gICAgICBjb25zdCB0aW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IGNvbnRyb2xsZXIuYWJvcnQoKSwgNTAwMClcclxuICAgICAgXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIHtcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgLi4ub3B0aW9ucy5oZWFkZXJzXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2lnbmFsOiBjb250cm9sbGVyLnNpZ25hbCxcclxuICAgICAgICAgIC4uLm9wdGlvbnNcclxuICAgICAgICB9KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBIVFRQICR7cmVzcG9uc2Uuc3RhdHVzfTogJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVwZGF0ZSBsb2NhbCBzdGF0ZSBvbmx5IGluIGRldmVsb3BtZW50XHJcbiAgICAgICAgaWYgKGltcG9ydC5tZXRhLmVudi5ERVYpIHtcclxuICAgICAgICAgIHVwZGF0ZUxvY2FsRGF0YShlbmRwb2ludCwgb3B0aW9ucywgcmVzcG9uc2VEYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2VEYXRhXHJcbiAgICAgIH0gY2F0Y2ggKGZldGNoRXJyb3IpIHtcclxuICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dElkKVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFVzZSBtb2NrIGZhbGxiYWNrIG9uIHRpbWVvdXQgb3IgbmV0d29yayBlcnJvciAob25seSBpbiBkZXZlbG9wbWVudClcclxuICAgICAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LkRFViAmJiAoZmV0Y2hFcnJvci5uYW1lID09PSAnQWJvcnRFcnJvcicgfHwgZmV0Y2hFcnJvci5tZXNzYWdlLmluY2x1ZGVzKCdmZXRjaCcpKSkge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKGDwn5SEIEFQSSB0aW1lb3V0L2Vycm9yLCB1c2luZyBtb2NrIGZhbGxiYWNrOiAke2ZldGNoRXJyb3IubWVzc2FnZX1gKVxyXG4gICAgICAgICAgY29uc3QgbW9ja1Jlc3BvbnNlID0gZ2V0TW9ja1Jlc3BvbnNlKGVuZHBvaW50LCBvcHRpb25zKVxyXG4gICAgICAgICAgdXBkYXRlTG9jYWxEYXRhKGVuZHBvaW50LCBvcHRpb25zLCBtb2NrUmVzcG9uc2UpXHJcbiAgICAgICAgICByZXR1cm4gbW9ja1Jlc3BvbnNlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRocm93IGZldGNoRXJyb3JcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgIHNldEVycm9yKGVyci5tZXNzYWdlKVxyXG4gICAgICB0aHJvdyBlcnJcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHNldExvYWRpbmcoZmFsc2UpXHJcbiAgICB9XHJcbiAgfSwgW2Jhc2VVcmxdKVxyXG5cclxuICBjb25zdCB1cGRhdGVMb2NhbERhdGEgPSAoZW5kcG9pbnQsIG9wdGlvbnMsIHJlc3BvbnNlKSA9PiB7XHJcbiAgICBpZiAoaW1wb3J0Lm1ldGEuZW52LlBST0QpIHJldHVyblxyXG5cclxuICAgIGNvbnN0IHBhdGhQYXJ0cyA9IGVuZHBvaW50LnNwbGl0KCcvJykuZmlsdGVyKEJvb2xlYW4pXHJcbiAgICBjb25zdCBbcmVzb3VyY2UsIGlkZW50aWZpZXIsIHN1YlJlc291cmNlXSA9IHBhdGhQYXJ0c1xyXG4gICAgXHJcbiAgICBzd2l0Y2ggKHJlc291cmNlKSB7XHJcbiAgICAgIGNhc2UgJ3RhbmtzJzpcclxuICAgICAgICBpZiAob3B0aW9ucy5tZXRob2QgPT09ICdQVVQnICYmIGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRUYW5rcyA9IGRhdGEudGFua3MubWFwKHRhbmsgPT4gXHJcbiAgICAgICAgICAgIHRhbmsudWlkID09PSBpZGVudGlmaWVyID8geyAuLi50YW5rLCAuLi5KU09OLnBhcnNlKG9wdGlvbnMuYm9keSB8fCAne30nKSB9IDogdGFua1xyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgc2V0RGF0YShwcmV2ID0+ICh7IC4uLnByZXYsIHRhbmtzOiB1cGRhdGVkVGFua3MgfSkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgICAgXHJcbiAgICAgIGNhc2UgJ2ZlZWQnOlxyXG4gICAgICAgIGlmIChvcHRpb25zLm1ldGhvZCA9PT0gJ1BPU1QnICYmIHN1YlJlc291cmNlID09PSAnaW1tZWRpYXRlJyAmJiBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkVGFua3MgPSBkYXRhLnRhbmtzLm1hcCh0YW5rID0+IFxyXG4gICAgICAgICAgICB0YW5rLnVpZCA9PT0gaWRlbnRpZmllciA/IHsgXHJcbiAgICAgICAgICAgICAgLi4udGFuaywgXHJcbiAgICAgICAgICAgICAgbGFzdERpc3BlbnNlZDogRGF0ZS5ub3coKSwgXHJcbiAgICAgICAgICAgICAgbGV2ZWw6IE1hdGgubWF4KDAsIHRhbmsubGV2ZWwgLSA1KSxcclxuICAgICAgICAgICAgICB0b3RhbERpc3BlbnNlZDogdGFuay50b3RhbERpc3BlbnNlZCArIChyZXNwb25zZS5kaXNwZW5zZWQgfHwgMjUpXHJcbiAgICAgICAgICAgIH0gOiB0YW5rXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICBzZXREYXRhKHByZXYgPT4gKHsgLi4ucHJldiwgdGFua3M6IHVwZGF0ZWRUYW5rcyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgICBcclxuICAgICAgY2FzZSAncmVjaXBlcyc6XHJcbiAgICAgICAgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnUE9TVCcpIHtcclxuICAgICAgICAgIGNvbnN0IG5ld1JlY2lwZSA9IHsgLi4uSlNPTi5wYXJzZShvcHRpb25zLmJvZHkgfHwgJ3t9JyksIGlkOiBkYXRhLnJlY2lwZXMubGVuZ3RoLCBjcmVhdGVkOiBEYXRlLm5vdygpIH1cclxuICAgICAgICAgIHNldERhdGEocHJldiA9PiAoeyAuLi5wcmV2LCByZWNpcGVzOiBbLi4ucHJldi5yZWNpcGVzLCBuZXdSZWNpcGVdIH0pKVxyXG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5tZXRob2QgPT09ICdERUxFVEUnICYmIGlkZW50aWZpZXIpIHtcclxuICAgICAgICAgIGNvbnN0IHVwZGF0ZWRSZWNpcGVzID0gZGF0YS5yZWNpcGVzLmZpbHRlcihyZWNpcGUgPT4gcmVjaXBlLmlkICE9PSBwYXJzZUludChpZGVudGlmaWVyKSlcclxuICAgICAgICAgIHNldERhdGEocHJldiA9PiAoeyAuLi5wcmV2LCByZWNpcGVzOiB1cGRhdGVkUmVjaXBlcyB9KSlcclxuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMubWV0aG9kID09PSAnUFVUJyAmJiBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgICBjb25zdCB1cGRhdGVkUmVjaXBlcyA9IGRhdGEucmVjaXBlcy5tYXAocmVjaXBlID0+IFxyXG4gICAgICAgICAgICByZWNpcGUuaWQgPT09IHBhcnNlSW50KGlkZW50aWZpZXIpID8geyAuLi5yZWNpcGUsIC4uLkpTT04ucGFyc2Uob3B0aW9ucy5ib2R5IHx8ICd7fScpIH0gOiByZWNpcGVcclxuICAgICAgICAgIClcclxuICAgICAgICAgIHNldERhdGEocHJldiA9PiAoeyAuLi5wcmV2LCByZWNpcGVzOiB1cGRhdGVkUmVjaXBlcyB9KSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuXHJcbiAgICAgIGNhc2UgJ3NldHRpbmdzJzpcclxuICAgICAgICBpZiAob3B0aW9ucy5tZXRob2QgPT09ICdQVVQnKSB7XHJcbiAgICAgICAgICBzZXREYXRhKHByZXYgPT4gKHsgLi4ucHJldiwgc2V0dGluZ3M6IHsgLi4ucHJldi5zZXR0aW5ncywgLi4uSlNPTi5wYXJzZShvcHRpb25zLmJvZHkgfHwgJ3t9JykgfSB9KSlcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHZhbHVlID0ge1xyXG4gICAgZGF0YSxcclxuICAgIGxvYWRpbmcsXHJcbiAgICBlcnJvcixcclxuICAgIGFwaUNhbGwsXHJcbiAgICBcclxuICAgIC8vIFN5c3RlbSBlbmRwb2ludHNcclxuICAgIGdldFN5c3RlbUluZm86ICgpID0+IGFwaUNhbGwoJy9zeXN0ZW0vaW5mbycpLFxyXG4gICAgZ2V0U3lzdGVtU3RhdHVzOiAoKSA9PiBhcGlDYWxsKCcvc3lzdGVtL3N0YXR1cycpLFxyXG4gICAgcmVzdGFydFN5c3RlbTogKCkgPT4gYXBpQ2FsbCgnL3N5c3RlbS9yZXN0YXJ0JywgeyBtZXRob2Q6ICdQT1NUJyB9KSxcclxuICAgIGZhY3RvcnlSZXNldDogKCkgPT4gYXBpQ2FsbCgnL3N5c3RlbS9mYWN0b3J5LXJlc2V0JywgeyBtZXRob2Q6ICdQT1NUJyB9KSxcclxuICAgIFxyXG4gICAgLy8gU2V0dGluZ3MgZW5kcG9pbnRzICBcclxuICAgIGdldFNldHRpbmdzOiAoKSA9PiBhcGlDYWxsKCcvc2V0dGluZ3MnKSxcclxuICAgIHVwZGF0ZVNldHRpbmdzOiAoc2V0dGluZ3MpID0+IGFwaUNhbGwoJy9zZXR0aW5ncycsIHtcclxuICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoc2V0dGluZ3MpXHJcbiAgICB9KSxcclxuICAgIGV4cG9ydFNldHRpbmdzOiAoKSA9PiBhcGlDYWxsKCcvc2V0dGluZ3MvZXhwb3J0JyksXHJcbiAgICBcclxuICAgIC8vIFRhbmsgZW5kcG9pbnRzXHJcbiAgICBnZXRUYW5rczogKCkgPT4gYXBpQ2FsbCgnL3RhbmtzJyksXHJcbiAgICBnZXRUYW5rOiAodWlkKSA9PiBhcGlDYWxsKGAvdGFua3MvJHt1aWR9YCksXHJcbiAgICB1cGRhdGVUYW5rOiAodWlkLCB1cGRhdGVzKSA9PiBhcGlDYWxsKGAvdGFua3MvJHt1aWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh1cGRhdGVzKVxyXG4gICAgfSksXHJcbiAgICBnZXRUYW5rSGlzdG9yeTogKHVpZCkgPT4gYXBpQ2FsbChgL3RhbmtzLyR7dWlkfS9oaXN0b3J5YCksXHJcbiAgICBcclxuICAgIC8vIEZlZWRpbmcgZW5kcG9pbnRzXHJcbiAgICBmZWVkSW1tZWRpYXRlOiAodGFua1VpZCwgYW1vdW50ID0gbnVsbCkgPT4gYXBpQ2FsbChgL2ZlZWQvaW1tZWRpYXRlLyR7dGFua1VpZH1gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IGFtb3VudCwgcmVhc29uOiAnbWFudWFsJyB9KVxyXG4gICAgfSksXHJcbiAgICBmZWVkUmVjaXBlOiAocmVjaXBlSWQsIHNlcnZpbmdzID0gMSkgPT4gYXBpQ2FsbChgL2ZlZWQvcmVjaXBlLyR7cmVjaXBlSWR9YCwge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoeyBzZXJ2aW5ncyB9KVxyXG4gICAgfSksXHJcbiAgICBlbWVyZ2VuY3lGZWVkOiAoYW1vdW50ID0gMTApID0+IGFwaUNhbGwoJy9mZWVkL2VtZXJnZW5jeScsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgYW1vdW50IH0pXHJcbiAgICB9KSxcclxuICAgIGdldEZlZWRIaXN0b3J5OiAoKSA9PiBhcGlDYWxsKCcvZmVlZC9oaXN0b3J5JyksXHJcbiAgICBcclxuICAgIC8vIFJlY2lwZSBlbmRwb2ludHNcclxuICAgIGdldFJlY2lwZXM6ICgpID0+IGFwaUNhbGwoJy9yZWNpcGVzJyksXHJcbiAgICBjcmVhdGVSZWNpcGU6IChyZWNpcGUpID0+IGFwaUNhbGwoJy9yZWNpcGVzJywge1xyXG4gICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVjaXBlKVxyXG4gICAgfSksXHJcbiAgICB1cGRhdGVSZWNpcGU6IChpZCwgdXBkYXRlcykgPT4gYXBpQ2FsbChgL3JlY2lwZXMvJHtpZH1gLCB7XHJcbiAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHVwZGF0ZXMpXHJcbiAgICB9KSxcclxuICAgIGRlbGV0ZVJlY2lwZTogKGlkKSA9PiBhcGlDYWxsKGAvcmVjaXBlcy8ke2lkfWAsIHtcclxuICAgICAgbWV0aG9kOiAnREVMRVRFJ1xyXG4gICAgfSksXHJcbiAgICBcclxuICAgIC8vIFNjYWxlIGVuZHBvaW50c1xyXG4gICAgZ2V0Q3VycmVudFNjYWxlOiAoKSA9PiBhcGlDYWxsKCcvc2NhbGUvY3VycmVudCcpLFxyXG4gICAgdGFyZVNjYWxlOiAoKSA9PiBhcGlDYWxsKCcvc2NhbGUvdGFyZScsIHsgbWV0aG9kOiAnUE9TVCcgfSksXHJcbiAgICBjYWxpYnJhdGVTY2FsZTogKGtub3duV2VpZ2h0LCBjdXJyZW50UmVhZGluZykgPT4gYXBpQ2FsbCgnL3NjYWxlL2NhbGlicmF0ZScsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsga25vd25XZWlnaHQsIGN1cnJlbnRSZWFkaW5nIH0pXHJcbiAgICB9KSxcclxuICAgIFxyXG4gICAgLy8gQ2FsaWJyYXRpb24gZW5kcG9pbnRzXHJcbiAgICBnZXRTZXJ2b0NhbGlicmF0aW9uOiAoKSA9PiBhcGlDYWxsKCcvY2FsaWJyYXRpb24vc2Vydm9zJyksXHJcbiAgICB1cGRhdGVTZXJ2b0NhbGlicmF0aW9uOiAoY29uZmlnKSA9PiBhcGlDYWxsKCcvY2FsaWJyYXRpb24vc2Vydm9zJywge1xyXG4gICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShjb25maWcpXHJcbiAgICB9KSxcclxuICAgIHRlc3RTZXJ2bzogKHR5cGUsIGlkLCBwb3NpdGlvbiwgZHVyYXRpb24gPSAxMDAwKSA9PiBhcGlDYWxsKCcvY2FsaWJyYXRpb24vc2Vydm8tdGVzdCcsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdHlwZSwgaWQsIHBvc2l0aW9uLCBkdXJhdGlvbiB9KVxyXG4gICAgfSksXHJcbiAgICB0ZXN0VGFua0Rpc3BlbnNlOiAodGFua1VpZCwgdGFyZ2V0QW1vdW50LCBkdXJhdGlvbikgPT4gYXBpQ2FsbCgnL2NhbGlicmF0aW9uL3RhbmstZGlzcGVuc2UtdGVzdCcsIHtcclxuICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdGFua0lkOiB0YW5rVWlkLCB0YXJnZXRBbW91bnQsIGR1cmF0aW9uIH0pXHJcbiAgICB9KSxcclxuICAgIFxyXG4gICAgLy8gRGlhZ25vc3RpY3MgZW5kcG9pbnRzXHJcbiAgICBnZXRTZW5zb3JEaWFnbm9zdGljczogKCkgPT4gYXBpQ2FsbCgnL2RpYWdub3N0aWNzL3NlbnNvcnMnKSxcclxuICAgIGdldFNlcnZvRGlhZ25vc3RpY3M6ICgpID0+IGFwaUNhbGwoJy9kaWFnbm9zdGljcy9zZXJ2b3MnKSxcclxuICAgIGdldE5ldHdvcmtJbmZvOiAoKSA9PiBhcGlDYWxsKCcvbmV0d29yay9pbmZvJyksXHJcbiAgICBnZXRTeXN0ZW1Mb2dzOiAoKSA9PiBhcGlDYWxsKCcvbG9ncy9zeXN0ZW0nKSxcclxuICAgIGdldEZlZWRpbmdMb2dzOiAoKSA9PiBhcGlDYWxsKCcvbG9ncy9mZWVkaW5nJylcclxuICB9XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8QXBpQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L0FwaUNvbnRleHQuUHJvdmlkZXI+XHJcbiAgKVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdXNlQXBpID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNvbnRleHQgPSB1c2VDb250ZXh0KEFwaUNvbnRleHQpXHJcbiAgaWYgKCFjb250ZXh0KSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VzZUFwaSBtdXN0IGJlIHVzZWQgd2l0aGluIGFuIEFwaVByb3ZpZGVyJylcclxuICB9XHJcbiAgcmV0dXJuIGNvbnRleHRcclxufSIsImltcG9ydCB7IHVzZUFwaSB9IGZyb20gJy4uL2hvb2tzL3VzZUFwaSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXIoKSB7XHJcbiAgY29uc3QgeyBkYXRhIH0gPSB1c2VBcGkoKVxyXG4gIGNvbnN0IHNldHRpbmdzID0gZGF0YT8uc2V0dGluZ3MgfHwge31cclxuXHJcbiAgLy8gR2V0IFdpRmkgc2lnbmFsIHN0cmVuZ3RoIGluZGljYXRvclxyXG4gIGNvbnN0IGdldFdpZmlTdHJlbmd0aCA9IChyc3NpKSA9PiB7XHJcbiAgICBpZiAocnNzaSA+IC01MCkgcmV0dXJuIHsgYmFyczogNCwgY29sb3I6ICd0ZXh0LXN1Y2Nlc3MnIH1cclxuICAgIGlmIChyc3NpID4gLTYwKSByZXR1cm4geyBiYXJzOiAzLCBjb2xvcjogJ3RleHQtc3VjY2VzcycgfVxyXG4gICAgaWYgKHJzc2kgPiAtNzApIHJldHVybiB7IGJhcnM6IDIsIGNvbG9yOiAndGV4dC13YXJuaW5nJyB9XHJcbiAgICBpZiAocnNzaSA+IC04MCkgcmV0dXJuIHsgYmFyczogMSwgY29sb3I6ICd0ZXh0LWVycm9yJyB9XHJcbiAgICByZXR1cm4geyBiYXJzOiAwLCBjb2xvcjogJ3RleHQtZ3JheS01MDAnIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHdpZmkgPSBnZXRXaWZpU3RyZW5ndGgoc2V0dGluZ3Mud2lmaVN0cmVuZ3RoKVxyXG5cclxuICAvLyBGb3JtYXQgY3VycmVudCB0aW1lXHJcbiAgY29uc3QgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLnRvTG9jYWxlVGltZVN0cmluZygnZW4tVVMnLCB7XHJcbiAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICBtaW51dGU6ICcyLWRpZ2l0JyxcclxuICAgIGhvdXIxMjogZmFsc2VcclxuICB9KVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGhlYWRlciBjbGFzc05hbWU9XCJiZy1kYXJrLXN1cmZhY2UgYm9yZGVyLWIgYm9yZGVyLWdyYXktNzAwLzUwIHB4LTQgcHktMyBzdGlja3kgdG9wLTAgei01MFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxyXG4gICAgICAgIHsvKiBMb2dvIGFuZCBEZXZpY2UgTmFtZSAqL31cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtM1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bFwiPvCfkLE8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1hY2NlbnQtcHJpbWFyeVwiPktpdHR5YmxlPC9oMT5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwXCI+e3NldHRpbmdzLmRldmljZU5hbWUgfHwgJ0tpYmJsZVQ1J308L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgey8qIFN0YXR1cyBJbmRpY2F0b3JzICovfVxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC00XCI+XHJcbiAgICAgICAgICB7LyogQ3VycmVudCBUaW1lICovfVxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSBmb250LW1vbm8gdGV4dC13aGl0ZVwiPntjdXJyZW50VGltZX08L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS00MDBcIj5Mb2NhbDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgey8qIFdpRmkgU3RyZW5ndGggKi99XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMVwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YHRleHQteHMgJHt3aWZpLmNvbG9yfWB9PlxyXG4gICAgICAgICAgICAgIHsvKiBXaUZpIGJhcnMgdmlzdWFsaXphdGlvbiAqL31cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtZW5kIHNwYWNlLXgtMC41IGgtNFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B3LTEgYmctY3VycmVudCAke3dpZmkuYmFycyA+PSAxID8gJ2gtMScgOiAnaC0xIG9wYWNpdHktMzAnfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B3LTEgYmctY3VycmVudCAke3dpZmkuYmFycyA+PSAyID8gJ2gtMicgOiAnaC0yIG9wYWNpdHktMzAnfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B3LTEgYmctY3VycmVudCAke3dpZmkuYmFycyA+PSAzID8gJ2gtMycgOiAnaC0zIG9wYWNpdHktMzAnfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B3LTEgYmctY3VycmVudCAke3dpZmkuYmFycyA+PSA0ID8gJ2gtNCcgOiAnaC00IG9wYWNpdHktMzAnfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvaGVhZGVyPlxyXG4gIClcclxufSIsImltcG9ydCB7IHJvdXRlIH0gZnJvbSAncHJlYWN0LXJvdXRlcidcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBOYXZpZ2F0aW9uKHsgY3VycmVudFJvdXRlIH0pIHtcclxuICBjb25zdCBuYXZJdGVtcyA9IFtcclxuICAgIHtcclxuICAgICAgcGF0aDogJy8nLFxyXG4gICAgICBsYWJlbDogJ0Rhc2hib2FyZCcsXHJcbiAgICAgIGljb246ICfwn4+gJyxcclxuICAgICAgYWN0aXZlSWNvbjogJ/Cfj6AnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3RhbmtzJyxcclxuICAgICAgbGFiZWw6ICdUYW5rcycsXHJcbiAgICAgIGljb246ICfwn6WrJyxcclxuICAgICAgYWN0aXZlSWNvbjogJ/CfpasnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBwYXRoOiAnL3JlY2lwZXMnLFxyXG4gICAgICBsYWJlbDogJ1JlY2lwZXMnLFxyXG4gICAgICBpY29uOiAn8J+lhCcsXHJcbiAgICAgIGFjdGl2ZUljb246ICfwn6WEJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgcGF0aDogJy9zZXR0aW5ncycsXHJcbiAgICAgIGxhYmVsOiAnU2V0dGluZ3MnLFxyXG4gICAgICBpY29uOiAn4pqZ77iPJyxcclxuICAgICAgYWN0aXZlSWNvbjogJ+Kame+4jydcclxuICAgIH1cclxuICBdXHJcblxyXG4gIGNvbnN0IGhhbmRsZU5hdkNsaWNrID0gKHBhdGgpID0+IHtcclxuICAgIHJvdXRlKHBhdGgpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPG5hdiBjbGFzc05hbWU9XCJmaXhlZCBib3R0b20tMCBsZWZ0LTAgcmlnaHQtMCBiZy1kYXJrLXN1cmZhY2UgYm9yZGVyLXQgYm9yZGVyLWdyYXktNzAwLzUwIHotNTBcIj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4XCI+XHJcbiAgICAgICAge25hdkl0ZW1zLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSBjdXJyZW50Um91dGUgPT09IGl0ZW0ucGF0aFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAga2V5PXtpdGVtLnBhdGh9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlTmF2Q2xpY2soaXRlbS5wYXRoKX1cclxuICAgICAgICAgICAgICBjbGFzc05hbWU9e2BmbGV4LTEgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIgcHktMyBweC0yIHRyYW5zaXRpb24tY29sb3JzIGR1cmF0aW9uLTIwMCAke1xyXG4gICAgICAgICAgICAgICAgaXNBY3RpdmVcclxuICAgICAgICAgICAgICAgICAgPyAndGV4dC1hY2NlbnQtcHJpbWFyeSBiZy1hY2NlbnQtcHJpbWFyeS8xMCdcclxuICAgICAgICAgICAgICAgICAgOiAndGV4dC1ncmF5LTQwMCBob3Zlcjp0ZXh0LWdyYXktMjAwIGFjdGl2ZTpiZy1ncmF5LTgwMC81MCdcclxuICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC14bCBtYi0xXCI+XHJcbiAgICAgICAgICAgICAgICB7aXNBY3RpdmUgPyBpdGVtLmFjdGl2ZUljb24gOiBpdGVtLmljb259XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyBmb250LW1lZGl1bVwiPlxyXG4gICAgICAgICAgICAgICAge2l0ZW0ubGFiZWx9XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIHsvKiBBY3RpdmUgaW5kaWNhdG9yICovfVxyXG4gICAgICAgICAgICAgIHtpc0FjdGl2ZSAmJiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGxlZnQtMS8yIHRyYW5zZm9ybSAtdHJhbnNsYXRlLXgtMS8yIHctOCBoLTAuNSBiZy1hY2NlbnQtcHJpbWFyeSByb3VuZGVkLWZ1bGxcIj48L2Rpdj5cclxuICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIClcclxuICAgICAgICB9KX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L25hdj5cclxuICApXHJcbn0iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgdXNlQXBpIH0gZnJvbSAnLi4vaG9va3MvdXNlQXBpJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIERhc2hib2FyZCgpIHtcclxuICBjb25zdCB7IGRhdGEsIGZlZWRJbW1lZGlhdGUsIGVtZXJnZW5jeUZlZWQsIGxvYWRpbmcgfSA9IHVzZUFwaSgpXHJcbiAgY29uc3QgW2ZlZWRpbmdTdGF0dXMsIHNldEZlZWRpbmdTdGF0dXNdID0gdXNlU3RhdGUoe30pXHJcblxyXG4gIGNvbnN0IHRhbmtzID0gZGF0YT8udGFua3MgfHwgW11cclxuXHJcbiAgLy8gR2V0IHRhbmsgbGV2ZWwgc3RhdHVzXHJcbiAgY29uc3QgZ2V0VGFua1N0YXR1cyA9IChsZXZlbCkgPT4ge1xyXG4gICAgaWYgKGxldmVsID49IDcwKSByZXR1cm4geyBzdGF0dXM6ICdmdWxsJywgY2xhc3M6ICd0YW5rLWZ1bGwnIH1cclxuICAgIGlmIChsZXZlbCA+PSA0MCkgcmV0dXJuIHsgc3RhdHVzOiAnbWVkaXVtJywgY2xhc3M6ICd0YW5rLW1lZGl1bScgfVxyXG4gICAgaWYgKGxldmVsID49IDE1KSByZXR1cm4geyBzdGF0dXM6ICdsb3cnLCBjbGFzczogJ3RhbmstbG93JyB9XHJcbiAgICByZXR1cm4geyBzdGF0dXM6ICdlbXB0eScsIGNsYXNzOiAndGFuay1lbXB0eScgfVxyXG4gIH1cclxuXHJcbiAgLy8gRm9ybWF0IHRpbWUgc2luY2UgbGFzdCBkaXNwZW5zZWRcclxuICBjb25zdCBnZXRUaW1lU2luY2VMYXN0RGlzcGVuc2VkID0gKHRpbWVzdGFtcCkgPT4ge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxyXG4gICAgY29uc3QgZGlmZiA9IG5vdyAtIHRpbWVzdGFtcFxyXG4gICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKGRpZmYgLyAoMTAwMCAqIDYwICogNjApKVxyXG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoKGRpZmYgJSAoMTAwMCAqIDYwICogNjApKSAvICgxMDAwICogNjApKVxyXG4gICAgXHJcbiAgICBpZiAoaG91cnMgPiAwKSB7XHJcbiAgICAgIHJldHVybiBgJHtob3Vyc31oICR7bWludXRlc31tIGFnb2BcclxuICAgIH1cclxuICAgIHJldHVybiBgJHttaW51dGVzfW0gYWdvYFxyXG4gIH1cclxuXHJcbiAgLy8gSGFuZGxlIGltbWVkaWF0ZSBmZWVkaW5nIGZyb20gc3BlY2lmaWMgdGFua1xyXG4gIGNvbnN0IGhhbmRsZUZlZWRUYW5rID0gYXN5bmMgKHRhbmtVaWQpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHNldEZlZWRpbmdTdGF0dXMocHJldiA9PiAoeyAuLi5wcmV2LCBbdGFua1VpZF06ICdmZWVkaW5nJyB9KSlcclxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZWVkSW1tZWRpYXRlKHRhbmtVaWQsIDI1KVxyXG4gICAgICBcclxuICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIFt0YW5rVWlkXTogJ3N1Y2Nlc3MnIH0pKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzZXRGZWVkaW5nU3RhdHVzKHByZXYgPT4gKHsgLi4ucHJldiwgW3RhbmtVaWRdOiBudWxsIH0pKVxyXG4gICAgICB9LCAyMDAwKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIFt0YW5rVWlkXTogJ2Vycm9yJyB9KSlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIFt0YW5rVWlkXTogbnVsbCB9KSlcclxuICAgICAgfSwgMzAwMClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEhhbmRsZSBlbWVyZ2VuY3kgZmVlZCBhbGwgdGFua3NcclxuICBjb25zdCBoYW5kbGVFbWVyZ2VuY3lGZWVkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIGVtZXJnZW5jeTogJ2ZlZWRpbmcnIH0pKVxyXG4gICAgICBhd2FpdCBlbWVyZ2VuY3lGZWVkKDEwKVxyXG4gICAgICBcclxuICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIGVtZXJnZW5jeTogJ3N1Y2Nlc3MnIH0pKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBzZXRGZWVkaW5nU3RhdHVzKHByZXYgPT4gKHsgLi4ucHJldiwgZW1lcmdlbmN5OiBudWxsIH0pKVxyXG4gICAgICB9LCAzMDAwKVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIGVtZXJnZW5jeTogJ2Vycm9yJyB9KSlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgc2V0RmVlZGluZ1N0YXR1cyhwcmV2ID0+ICh7IC4uLnByZXYsIGVtZXJnZW5jeTogbnVsbCB9KSlcclxuICAgICAgfSwgMzAwMClcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEZvcm1hdCB0YW5rIFVJRCBmb3IgZGlzcGxheVxyXG4gIGNvbnN0IGZvcm1hdFRhbmtVaWQgPSAodWlkKSA9PiB7XHJcbiAgICByZXR1cm4gdWlkLnNsaWNlKC00KS50b1VwcGVyQ2FzZSgpXHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJwLTQgc3BhY2UteS02XCI+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHktNlwiPlxyXG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBmb250LWJvbGQgdGV4dC1hY2NlbnQtcHJpbWFyeSBtYi0yXCI+8J+QsSBLaXR0eWJsZTwvaDE+XHJcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMFwiPktlZXAgeW91ciBjYXRzIGhhcHB5IGFuZCBmZWQ8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC00XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWFjY2VudC1wcmltYXJ5XCI+e3RhbmtzLmxlbmd0aH08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+QWN0aXZlIFRhbmtzPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LWFjY2VudC1zZWNvbmRhcnlcIj5cclxuICAgICAgICAgICAge3RhbmtzLmZpbHRlcih0YW5rID0+IGdldFRhbmtTdGF0dXModGFuay5sZXZlbCkuc3RhdHVzICE9PSAnZW1wdHknKS5sZW5ndGh9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+UmVhZHkgdG8gRmVlZDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cInRleHQteGwgZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlXCI+VGFuayBTdGF0dXM8L2gyPlxyXG4gICAgICAgIFxyXG4gICAgICAgIHt0YW5rcy5tYXAoKHRhbmspID0+IHtcclxuICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBjbGFzczogc3RhdHVzQ2xhc3MgfSA9IGdldFRhbmtTdGF0dXModGFuay5sZXZlbClcclxuICAgICAgICAgIGNvbnN0IGZlZWRTdGF0dXMgPSBmZWVkaW5nU3RhdHVzW3RhbmsudWlkXVxyXG4gICAgICAgICAgY29uc3QgY3VycmVudFdlaWdodCA9IE1hdGgucm91bmQoKHRhbmsubGV2ZWwgLyAxMDApICogdGFuay5jYXBhY2l0eSAqIHRhbmsuZGVuc2l0eSlcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBrZXk9e3RhbmsudWlkfSBjbGFzc05hbWU9XCJjYXJkXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItM1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTNcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0YW5rLWluZGljYXRvciAke3N0YXR1c0NsYXNzfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIHRleHQtd2hpdGVcIj57dGFuay5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTIgdGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5VSUQ6IHtmb3JtYXRUYW5rVWlkKHRhbmsudWlkKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7igKI8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5EZW5zaXR5OiB7dGFuay5kZW5zaXR5fWcvY23Cszwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS00MDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIExhc3QgZGlzcGVuc2VkOiB7Z2V0VGltZVNpbmNlTGFzdERpc3BlbnNlZCh0YW5rLmxhc3REaXNwZW5zZWQpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1ib2xkIHRleHQtd2hpdGVcIj57dGFuay5sZXZlbH0lPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+e2N1cnJlbnRXZWlnaHR9ZzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBjYXBpdGFsaXplXCI+e3N0YXR1c308L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy1mdWxsIGJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWZ1bGwgaC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgaC0yIHJvdW5kZWQtZnVsbCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0zMDAgJHtzdGF0dXNDbGFzcy5yZXBsYWNlKCd0ZXh0LScsICdiZy0nKX1gfVxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IHdpZHRoOiBgJHt0YW5rLmxldmVsfSVgIH19XHJcbiAgICAgICAgICAgICAgICAgID48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVGZWVkVGFuayh0YW5rLnVpZCl9XHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZyB8fCBmZWVkU3RhdHVzID09PSAnZmVlZGluZycgfHwgdGFuay5sZXZlbCA8PSAwfVxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgdy1mdWxsIHB5LTMgcm91bmRlZC1sZyBmb250LW1lZGl1bSB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi0yMDAgJHtcclxuICAgICAgICAgICAgICAgICAgZmVlZFN0YXR1cyA9PT0gJ2ZlZWRpbmcnXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnYmctYWNjZW50LXByaW1hcnkvNTAgdGV4dC13aGl0ZSBhbmltYXRlLXB1bHNlIGN1cnNvci1ub3QtYWxsb3dlZCdcclxuICAgICAgICAgICAgICAgICAgICA6IGZlZWRTdGF0dXMgPT09ICdzdWNjZXNzJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLXN1Y2Nlc3MgdGV4dC13aGl0ZSBhbmltYXRlLWJvdW5jZS1nZW50bGUnXHJcbiAgICAgICAgICAgICAgICAgICAgOiBmZWVkU3RhdHVzID09PSAnZXJyb3InXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnYmctZXJyb3IgdGV4dC13aGl0ZSdcclxuICAgICAgICAgICAgICAgICAgICA6IHRhbmsubGV2ZWwgPD0gMFxyXG4gICAgICAgICAgICAgICAgICAgID8gJ2JnLWdyYXktNjAwIHRleHQtZ3JheS00MDAgY3Vyc29yLW5vdC1hbGxvd2VkJ1xyXG4gICAgICAgICAgICAgICAgICAgIDogJ2J0bi1wcmltYXJ5IGhvdmVyOnNjYWxlLTEwNSBhY3RpdmU6c2NhbGUtOTUnXHJcbiAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7ZmVlZFN0YXR1cyA9PT0gJ2ZlZWRpbmcnICYmICfwn42977iPIERpc3BlbnNpbmcuLi4nfVxyXG4gICAgICAgICAgICAgICAge2ZlZWRTdGF0dXMgPT09ICdzdWNjZXNzJyAmJiAn4pyFIERpc3BlbnNlZCBTdWNjZXNzZnVsbHkhJ31cclxuICAgICAgICAgICAgICAgIHtmZWVkU3RhdHVzID09PSAnZXJyb3InICYmICfinYwgRGlzcGVuc2UgRXJyb3InfVxyXG4gICAgICAgICAgICAgICAgeyFmZWVkU3RhdHVzICYmIHRhbmsubGV2ZWwgPD0gMCAmJiAn8J+aqyBUYW5rIEVtcHR5J31cclxuICAgICAgICAgICAgICAgIHshZmVlZFN0YXR1cyAmJiB0YW5rLmxldmVsID4gMCAmJiAn8J+Nve+4jyBGZWVkIDI1Zyd9XHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcblxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMiB0ZXh0LXhzIHRleHQtZ3JheS01MDAgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIFRvdGFsIGRpc3BlbnNlZDoge3RhbmsudG90YWxEaXNwZW5zZWR9Z1xyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIClcclxuICAgICAgICB9KX1cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgYmctYWNjZW50LXRlcnRpYXJ5LzEwIGJvcmRlci1hY2NlbnQtdGVydGlhcnkvMjBcIj5cclxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZm9udC1zZW1pYm9sZCB0ZXh0LWFjY2VudC10ZXJ0aWFyeSBtYi0yXCI+RW1lcmdlbmN5IEZlZWQ8L2gzPlxyXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTQwMCBtYi00XCI+XHJcbiAgICAgICAgICBEaXNwZW5zZSAxMGcgZnJvbSBhbGwgYXZhaWxhYmxlIHRhbmtzIGludG8gdGhlIGhvcHBlclxyXG4gICAgICAgIDwvcD5cclxuICAgICAgICA8YnV0dG9uIFxyXG4gICAgICAgICAgb25DbGljaz17aGFuZGxlRW1lcmdlbmN5RmVlZH1cclxuICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8IGZlZWRpbmdTdGF0dXMuZW1lcmdlbmN5ID09PSAnZmVlZGluZyd9XHJcbiAgICAgICAgICBjbGFzc05hbWU9e2B3LWZ1bGwgcHktMyByb3VuZGVkLWxnIGZvbnQtbWVkaXVtIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTIwMCAke1xyXG4gICAgICAgICAgICBmZWVkaW5nU3RhdHVzLmVtZXJnZW5jeSA9PT0gJ2ZlZWRpbmcnXHJcbiAgICAgICAgICAgICAgPyAnYmctYWNjZW50LXRlcnRpYXJ5LzUwIHRleHQtd2hpdGUgYW5pbWF0ZS1wdWxzZSBjdXJzb3Itbm90LWFsbG93ZWQnXHJcbiAgICAgICAgICAgICAgOiBmZWVkaW5nU3RhdHVzLmVtZXJnZW5jeSA9PT0gJ3N1Y2Nlc3MnXHJcbiAgICAgICAgICAgICAgPyAnYmctc3VjY2VzcyB0ZXh0LXdoaXRlIGFuaW1hdGUtYm91bmNlLWdlbnRsZSdcclxuICAgICAgICAgICAgICA6IGZlZWRpbmdTdGF0dXMuZW1lcmdlbmN5ID09PSAnZXJyb3InXHJcbiAgICAgICAgICAgICAgPyAnYmctZXJyb3IgdGV4dC13aGl0ZSdcclxuICAgICAgICAgICAgICA6ICdidG4tZGFuZ2VyJ1xyXG4gICAgICAgICAgfWB9XHJcbiAgICAgICAgPlxyXG4gICAgICAgICAge2ZlZWRpbmdTdGF0dXMuZW1lcmdlbmN5ID09PSAnZmVlZGluZycgJiYgJ/CfmqggRW1lcmdlbmN5IEZlZWRpbmcuLi4nfVxyXG4gICAgICAgICAge2ZlZWRpbmdTdGF0dXMuZW1lcmdlbmN5ID09PSAnc3VjY2VzcycgJiYgJ+KchSBFbWVyZ2VuY3kgRmVlZCBDb21wbGV0ZSEnfVxyXG4gICAgICAgICAge2ZlZWRpbmdTdGF0dXMuZW1lcmdlbmN5ID09PSAnZXJyb3InICYmICfinYwgRW1lcmdlbmN5IEZlZWQgRmFpbGVkJ31cclxuICAgICAgICAgIHshZmVlZGluZ1N0YXR1cy5lbWVyZ2VuY3kgJiYgJ/CfmqggRW1lcmdlbmN5IEZlZWQgQWxsIFRhbmtzJ31cclxuICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn0iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcydcclxuaW1wb3J0IHsgdXNlQXBpIH0gZnJvbSAnLi4vaG9va3MvdXNlQXBpJ1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIFRhbmtzKCkge1xyXG4gIGNvbnN0IHsgZGF0YSwgdXBkYXRlVGFuaywgZ2V0VGFua0hpc3RvcnksIGxvYWRpbmcgfSA9IHVzZUFwaSgpXHJcbiAgY29uc3QgW2VkaXRpbmdUYW5rLCBzZXRFZGl0aW5nVGFua10gPSB1c2VTdGF0ZShudWxsKVxyXG4gIGNvbnN0IFtlZGl0TmFtZSwgc2V0RWRpdE5hbWVdID0gdXNlU3RhdGUoJycpXHJcbiAgY29uc3QgW3Nob3dIaXN0b3J5LCBzZXRTaG93SGlzdG9yeV0gPSB1c2VTdGF0ZShudWxsKVxyXG4gIGNvbnN0IFt0YW5rSGlzdG9yeSwgc2V0VGFua0hpc3RvcnldID0gdXNlU3RhdGUoW10pXHJcbiAgY29uc3QgW2hpc3RvcnlMb2FkaW5nLCBzZXRIaXN0b3J5TG9hZGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcclxuXHJcbiAgY29uc3QgdGFua3MgPSBkYXRhPy50YW5rcyB8fCBbXVxyXG5cclxuICBjb25zdCBzdGFydEVkaXRpbmcgPSAodGFuaykgPT4ge1xyXG4gICAgc2V0RWRpdGluZ1RhbmsodGFuay51aWQpXHJcbiAgICBzZXRFZGl0TmFtZSh0YW5rLm5hbWUpXHJcbiAgfVxyXG5cclxuICBjb25zdCBjYW5jZWxFZGl0aW5nID0gKCkgPT4ge1xyXG4gICAgc2V0RWRpdGluZ1RhbmsobnVsbClcclxuICAgIHNldEVkaXROYW1lKCcnKVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgc2F2ZVRhbmtOYW1lID0gYXN5bmMgKHRhbmtVaWQpID0+IHtcclxuICAgIGlmIChlZGl0TmFtZS50cmltKCkgJiYgZWRpdE5hbWUubGVuZ3RoIDw9IDY0KSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgdXBkYXRlVGFuayh0YW5rVWlkLCB7IG5hbWU6IGVkaXROYW1lLnRyaW0oKSB9KVxyXG4gICAgICAgIHNldEVkaXRpbmdUYW5rKG51bGwpXHJcbiAgICAgICAgc2V0RWRpdE5hbWUoJycpXHJcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIHVwZGF0ZSB0YW5rIG5hbWU6JywgZXJyb3IpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IHNob3dUYW5rSGlzdG9yeSA9IGFzeW5jICh0YW5rKSA9PiB7XHJcbiAgICBzZXRIaXN0b3J5TG9hZGluZyh0cnVlKVxyXG4gICAgc2V0U2hvd0hpc3RvcnkodGFuay51aWQpXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBoaXN0b3J5ID0gYXdhaXQgZ2V0VGFua0hpc3RvcnkodGFuay51aWQpXHJcbiAgICAgIHNldFRhbmtIaXN0b3J5KGhpc3RvcnkpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gbG9hZCB0YW5rIGhpc3Rvcnk6JywgZXJyb3IpXHJcbiAgICAgIHNldFRhbmtIaXN0b3J5KFtdKVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgc2V0SGlzdG9yeUxvYWRpbmcoZmFsc2UpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBjbG9zZUhpc3RvcnkgPSAoKSA9PiB7XHJcbiAgICBzZXRTaG93SGlzdG9yeShudWxsKVxyXG4gICAgc2V0VGFua0hpc3RvcnkoW10pXHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXRIaXN0b3J5VGltZSA9ICh0aW1lc3RhbXApID0+IHtcclxuICAgIHJldHVybiBuZXcgRGF0ZSh0aW1lc3RhbXApLnRvTG9jYWxlU3RyaW5nKCdlbi1VUycsIHtcclxuICAgICAgbW9udGg6ICdzaG9ydCcsXHJcbiAgICAgIGRheTogJ251bWVyaWMnLFxyXG4gICAgICBob3VyOiAnMi1kaWdpdCcsXHJcbiAgICAgIG1pbnV0ZTogJzItZGlnaXQnLFxyXG4gICAgICBob3VyMTI6IGZhbHNlXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgY29uc3QgZ2V0VGFua1N0YXR1cyA9IChsZXZlbCkgPT4ge1xyXG4gICAgaWYgKGxldmVsID49IDcwKSByZXR1cm4geyBzdGF0dXM6ICdQbGVudHknLCBjb2xvcjogJ3RleHQtdGFuay1mdWxsJywgYmdDb2xvcjogJ2JnLXRhbmstZnVsbCcgfVxyXG4gICAgaWYgKGxldmVsID49IDQwKSByZXR1cm4geyBzdGF0dXM6ICdNb2RlcmF0ZScsIGNvbG9yOiAndGV4dC10YW5rLW1lZGl1bScsIGJnQ29sb3I6ICdiZy10YW5rLW1lZGl1bScgfVxyXG4gICAgaWYgKGxldmVsID49IDE1KSByZXR1cm4geyBzdGF0dXM6ICdMb3cnLCBjb2xvcjogJ3RleHQtdGFuay1sb3cnLCBiZ0NvbG9yOiAnYmctdGFuay1sb3cnIH1cclxuICAgIHJldHVybiB7IHN0YXR1czogJ0VtcHR5JywgY29sb3I6ICd0ZXh0LXRhbmstZW1wdHknLCBiZ0NvbG9yOiAnYmctdGFuay1lbXB0eScgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgZm9ybWF0Q2FwYWNpdHkgPSAoZ3JhbXMpID0+IHtcclxuICAgIGlmIChncmFtcyA+PSAxMDAwKSB7XHJcbiAgICAgIHJldHVybiBgJHsoZ3JhbXMgLyAxMDAwKS50b0ZpeGVkKDEpfWtnYFxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke2dyYW1zfWdgXHJcbiAgfVxyXG5cclxuICBjb25zdCBmb3JtYXRUYW5rVWlkID0gKHVpZCkgPT4ge1xyXG4gICAgcmV0dXJuIHVpZC5zbGljZSgtNCkudG9VcHBlckNhc2UoKVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHNwYWNlLXktNlwiPlxyXG4gICAgICB7LyogSGVhZGVyICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LTRcIj5cclxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtd2hpdGUgbWItMlwiPlRhbmsgTWFuYWdlbWVudDwvaDE+XHJcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMFwiPkNvbmZpZ3VyZSBhbmQgbW9uaXRvciB5b3VyIGZvb2QgdGFua3M8L3A+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFRhbmsgTGlzdCAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICB7dGFua3MubWFwKCh0YW5rKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB7IHN0YXR1cywgY29sb3IsIGJnQ29sb3IgfSA9IGdldFRhbmtTdGF0dXModGFuay5sZXZlbClcclxuICAgICAgICAgIGNvbnN0IGlzRWRpdGluZyA9IGVkaXRpbmdUYW5rID09PSB0YW5rLnVpZFxyXG4gICAgICAgICAgY29uc3QgY3VycmVudEFtb3VudCA9IE1hdGgucm91bmQoKHRhbmsubGV2ZWwgLyAxMDApICogdGFuay5jYXBhY2l0eSAqIHRhbmsuZGVuc2l0eSlcclxuXHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGtleT17dGFuay51aWR9IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICAgICAgICB7LyogVGFuayBIZWFkZXIgKi99XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItNFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTNcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xMiBoLTEyIGJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWxnIGZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGJvcmRlci0yIGJvcmRlci1ncmF5LTYwMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14bFwiPvCfpas8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2BhYnNvbHV0ZSAtdG9wLTEgLXJpZ2h0LTEgdy00IGgtNCByb3VuZGVkLWZ1bGwgJHtiZ0NvbG9yfWB9PjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICB7aXNFZGl0aW5nID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtlZGl0TmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldEVkaXROYW1lKGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBtYXhMZW5ndGg9ezY0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0IHRleHQtbGcgZm9udC1zZW1pYm9sZCBiZy1kYXJrLWJnIGJvcmRlci1hY2NlbnQtcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJUYW5rIG5hbWUuLi5cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9Gb2N1c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtlZGl0TmFtZS5sZW5ndGh9LzY0IGNoYXJhY3RlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICApIDogKFxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlXCI+e3RhbmsubmFtZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMiB0ZXh0LXNtIHRleHQtZ3JheS00MDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5VSUQ6IHtmb3JtYXRUYW5rVWlkKHRhbmsudWlkKX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+4oCiPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkRlbnNpdHk6IHt0YW5rLmRlbnNpdHl9Zy9jbcKzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgey8qIEVkaXQgQnV0dG9uICovfVxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNwYWNlLXgtMlwiPlxyXG4gICAgICAgICAgICAgICAgICB7aXNFZGl0aW5nID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIDw+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNhdmVUYW5rTmFtZSh0YW5rLnVpZCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXtsb2FkaW5nIHx8ICFlZGl0TmFtZS50cmltKCkgfHwgZWRpdE5hbWUubGVuZ3RoID4gNjR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0bi1wcmltYXJ5IHRleHQtc20gcHgtMyBweS0xXCJcclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAg4pyTIFNhdmVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtjYW5jZWxFZGl0aW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctZ3JheS02MDAgaG92ZXI6YmctZ3JheS01MDAgdGV4dC1zbSBweC0zIHB5LTFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDinJUgQ2FuY2VsXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8Lz5cclxuICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzdGFydEVkaXRpbmcodGFuayl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctZ3JheS03MDAgaG92ZXI6YmctZ3JheS02MDAgdGV4dC1zbSBweC0zIHB5LTFcIlxyXG4gICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgIOKcj++4jyBFZGl0XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgey8qIFRhbmsgU3RhdHVzICovfVxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNCBtYi00XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtgdGV4dC0yeGwgZm9udC1ib2xkICR7Y29sb3J9YH0+e3RhbmsubGV2ZWx9JTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTQwMFwiPntzdGF0dXN9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHtmb3JtYXRDYXBhY2l0eShjdXJyZW50QW1vdW50KX1cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgb2Yge2Zvcm1hdENhcGFjaXR5KHRhbmsuY2FwYWNpdHkpfVxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICB7LyogVmlzdWFsIExldmVsIEluZGljYXRvciAqL31cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1iLTRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC1zbSB0ZXh0LWdyYXktNDAwIG1iLTJcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+Rm9vZCBMZXZlbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+e2Zvcm1hdENhcGFjaXR5KGN1cnJlbnRBbW91bnQpfSByZW1haW5pbmc8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmVcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgYmctZGFyay1zdXJmYWNlIHJvdW5kZWQtZnVsbCBoLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IFxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgaC00IHJvdW5kZWQtZnVsbCB0cmFuc2l0aW9uLWFsbCBkdXJhdGlvbi01MDAgJHtiZ0NvbG9yfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyB3aWR0aDogYCR7dGFuay5sZXZlbH0lYCB9fVxyXG4gICAgICAgICAgICAgICAgICAgID48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIHsvKiBMZXZlbCBtYXJrZXJzICovfVxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIHRvcC0wIGxlZnQtMCB3LWZ1bGwgaC00IGZsZXgganVzdGlmeS1iZXR3ZWVuIGl0ZW1zLWNlbnRlciBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTAuNSBoLTIgYmctZ3JheS02MDBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMC41IGgtMiBiZy1ncmF5LTYwMFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0wLjUgaC0yIGJnLWdyYXktNjAwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTAuNSBoLTIgYmctZ3JheS02MDBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gdGV4dC14cyB0ZXh0LWdyYXktNTAwIG10LTFcIj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+MCU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPjI1JTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgPHNwYW4+NTAlPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8c3Bhbj43NSU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPjEwMCU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgey8qIFRhbmsgQWN0aW9ucyAqL31cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgZ2FwLTNcIj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gXHJcbiAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNob3dUYW5rSGlzdG9yeSh0YW5rKX1cclxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJnLWFjY2VudC1zZWNvbmRhcnkvMjAgdGV4dC1hY2NlbnQtc2Vjb25kYXJ5IGhvdmVyOmJnLWFjY2VudC1zZWNvbmRhcnkvMzAgYm9yZGVyIGJvcmRlci1hY2NlbnQtc2Vjb25kYXJ5LzMwXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAg8J+TiiBIaXN0b3J5XHJcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApXHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIEhpc3RvcnkgTW9kYWwgKi99XHJcbiAgICAgIHtzaG93SGlzdG9yeSAmJiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHotNTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmxhY2svNTAgYmFja2Ryb3AtYmx1ci1zbVwiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1kYXJrLWNhcmQgcm91bmRlZC14bCBwLTYgbS00IG1heC13LWxnIHctZnVsbCBtYXgtaC1bODB2aF0gb3ZlcmZsb3ctaGlkZGVuIGJvcmRlciBib3JkZXItZ3JheS02MDBcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItNFwiPlxyXG4gICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LXhsIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZVwiPlxyXG4gICAgICAgICAgICAgICAgVGFuayBIaXN0b3J5XHJcbiAgICAgICAgICAgICAgPC9oMz5cclxuICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICBvbkNsaWNrPXtjbG9zZUhpc3Rvcnl9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctZ3JheS02MDAgaG92ZXI6YmctZ3JheS01MDAgdGV4dC1zbSBweC0zIHB5LTFcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIOKclSBDbG9zZVxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIHsvKiBUYW5rIEluZm8gKi99XHJcbiAgICAgICAgICAgIHt0YW5rcy5maW5kKHQgPT4gdC51aWQgPT09IHNob3dIaXN0b3J5KSAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYi00IHAtMyBiZy1kYXJrLXN1cmZhY2Ugcm91bmRlZC1sZ1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LW1lZGl1bSB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgIHt0YW5rcy5maW5kKHQgPT4gdC51aWQgPT09IHNob3dIaXN0b3J5KS5uYW1lfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTQwMFwiPlxyXG4gICAgICAgICAgICAgICAgICBVSUQ6IHtmb3JtYXRUYW5rVWlkKHNob3dIaXN0b3J5KX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApfVxyXG5cclxuICAgICAgICAgICAgey8qIEhpc3RvcnkgQ29udGVudCAqL31cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvdmVyZmxvdy15LWF1dG8gbWF4LWgtOTZcIj5cclxuICAgICAgICAgICAgICB7aGlzdG9yeUxvYWRpbmcgPyAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB5LThcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJhbmltYXRlLXB1bHNlIHRleHQtYWNjZW50LXByaW1hcnlcIj7ij7MgTG9hZGluZyBoaXN0b3J5Li4uPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApIDogdGFua0hpc3RvcnkubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBweS04XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC00eGwgbWItMlwiPvCfk4o8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwXCI+Tm8gZGlzcGVuc2luZyBoaXN0b3J5IHlldDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XHJcbiAgICAgICAgICAgICAgICAgIHt0YW5rSGlzdG9yeS5tYXAoKGVudHJ5LCBpbmRleCkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpbmRleH0gY2xhc3NOYW1lPVwiYmctZGFyay1zdXJmYWNlIHJvdW5kZWQtbGcgcC0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1lZGl1bVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2VudHJ5LmFtb3VudH1nIGRpc3BlbnNlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Zm9ybWF0SGlzdG9yeVRpbWUoZW50cnkudGltZXN0YW1wKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtlbnRyeS5yZWNpcGVOYW1lID8gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWFjY2VudC1wcmltYXJ5IHRleHQtc21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg8J+lhCB7ZW50cnkucmVjaXBlTmFtZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtYWNjZW50LXNlY29uZGFyeSB0ZXh0LXNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIPCfjb3vuI8gTWFudWFsIEZlZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIHsvKiBBZGQgVGFuayBTZWN0aW9uICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgYmctYWNjZW50LXByaW1hcnkvNSBib3JkZXItYWNjZW50LXByaW1hcnkvMjBcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCI+XHJcbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtYWNjZW50LXByaW1hcnkgbWItMlwiPk5lZWQgTW9yZSBUYW5rcz88L2gzPlxyXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwIG1iLTRcIj5cclxuICAgICAgICAgICAgSGFyZHdhcmUgbW9kaWZpY2F0aW9uIHJlcXVpcmVkIHRvIGFkZCBhZGRpdGlvbmFsIHRhbmtzXHJcbiAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBiZy1hY2NlbnQtcHJpbWFyeS8yMCB0ZXh0LWFjY2VudC1wcmltYXJ5IGhvdmVyOmJnLWFjY2VudC1wcmltYXJ5LzMwIGJvcmRlciBib3JkZXItYWNjZW50LXByaW1hcnkvMzBcIj5cclxuICAgICAgICAgICAg8J+TiyBIYXJkd2FyZSBHdWlkZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgKVxyXG59IiwiaW1wb3J0IHsgdXNlU3RhdGUgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IHVzZUFwaSB9IGZyb20gJy4uL2hvb2tzL3VzZUFwaSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBSZWNpcGVzKCkge1xyXG4gIGNvbnN0IHsgZGF0YSwgY3JlYXRlUmVjaXBlLCB1cGRhdGVSZWNpcGUsIGRlbGV0ZVJlY2lwZSwgbG9hZGluZyB9ID0gdXNlQXBpKClcclxuICBjb25zdCBbc2hvd0NyZWF0ZUZvcm0sIHNldFNob3dDcmVhdGVGb3JtXSA9IHVzZVN0YXRlKGZhbHNlKVxyXG4gIGNvbnN0IFtlZGl0aW5nUmVjaXBlLCBzZXRFZGl0aW5nUmVjaXBlXSA9IHVzZVN0YXRlKG51bGwpXHJcblxyXG4gIGNvbnN0IHJlY2lwZXMgPSBkYXRhPy5yZWNpcGVzIHx8IFtdXHJcbiAgY29uc3QgdGFua3MgPSBkYXRhPy50YW5rcyB8fCBbXVxyXG5cclxuICBjb25zdCBbbmV3UmVjaXBlLCBzZXROZXdSZWNpcGVdID0gdXNlU3RhdGUoe1xyXG4gICAgbmFtZTogJycsXHJcbiAgICB0b3RhbFdlaWdodDogMTAwLFxyXG4gICAgc2VydmluZ3M6IDIsXHJcbiAgICB0YW5rczogW11cclxuICB9KVxyXG5cclxuICBjb25zdCBbZWRpdFJlY2lwZSwgc2V0RWRpdFJlY2lwZV0gPSB1c2VTdGF0ZSh7XHJcbiAgICBuYW1lOiAnJyxcclxuICAgIHRvdGFsV2VpZ2h0OiAxMDAsXHJcbiAgICBzZXJ2aW5nczogMixcclxuICAgIHRhbmtzOiBbXVxyXG4gIH0pXHJcblxyXG4gIGNvbnN0IHJlc2V0Rm9ybXMgPSAoKSA9PiB7XHJcbiAgICBzZXROZXdSZWNpcGUoeyBuYW1lOiAnJywgdG90YWxXZWlnaHQ6IDEwMCwgc2VydmluZ3M6IDIsIHRhbmtzOiBbXSB9KVxyXG4gICAgc2V0RWRpdFJlY2lwZSh7IG5hbWU6ICcnLCB0b3RhbFdlaWdodDogMTAwLCBzZXJ2aW5nczogMiwgdGFua3M6IFtdIH0pXHJcbiAgICBzZXRTaG93Q3JlYXRlRm9ybShmYWxzZSlcclxuICAgIHNldEVkaXRpbmdSZWNpcGUobnVsbClcclxuICB9XHJcblxyXG4gIGNvbnN0IGhhbmRsZUNyZWF0ZVJlY2lwZSA9IGFzeW5jICgpID0+IHtcclxuICAgIGlmIChuZXdSZWNpcGUubmFtZS50cmltKCkgJiYgbmV3UmVjaXBlLnRhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCBjcmVhdGVSZWNpcGUobmV3UmVjaXBlKVxyXG4gICAgICAgIHJlc2V0Rm9ybXMoKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgcmVjaXBlOicsIGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBoYW5kbGVVcGRhdGVSZWNpcGUgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBpZiAoZWRpdFJlY2lwZS5uYW1lLnRyaW0oKSAmJiBlZGl0UmVjaXBlLnRhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBhd2FpdCB1cGRhdGVSZWNpcGUoZWRpdGluZ1JlY2lwZSwgZWRpdFJlY2lwZSlcclxuICAgICAgICByZXNldEZvcm1zKClcclxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gdXBkYXRlIHJlY2lwZTonLCBlcnJvcilcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgaGFuZGxlRGVsZXRlUmVjaXBlID0gYXN5bmMgKHJlY2lwZUlkKSA9PiB7XHJcbiAgICBpZiAoY29uZmlybSgnRGVsZXRlIHRoaXMgcmVjaXBlPycpKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgZGVsZXRlUmVjaXBlKHJlY2lwZUlkKVxyXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBkZWxldGUgcmVjaXBlOicsIGVycm9yKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBzdGFydEVkaXRpbmcgPSAocmVjaXBlKSA9PiB7XHJcbiAgICBzZXRFZGl0UmVjaXBlKHtcclxuICAgICAgbmFtZTogcmVjaXBlLm5hbWUsXHJcbiAgICAgIHRvdGFsV2VpZ2h0OiByZWNpcGUudG90YWxXZWlnaHQsXHJcbiAgICAgIHNlcnZpbmdzOiByZWNpcGUuc2VydmluZ3MsXHJcbiAgICAgIHRhbmtzOiBbLi4ucmVjaXBlLnRhbmtzXVxyXG4gICAgfSlcclxuICAgIHNldEVkaXRpbmdSZWNpcGUocmVjaXBlLmlkKVxyXG4gIH1cclxuXHJcbiAgLy8gQ29tbW9uIGZ1bmN0aW9ucyBmb3IgYm90aCBjcmVhdGUgYW5kIGVkaXQgZm9ybXNcclxuICBjb25zdCB1cGRhdGVUYW5rUGVyY2VudGFnZSA9ICh0YW5rVWlkLCBwZXJjZW50YWdlLCBpc0VkaXQgPSBmYWxzZSkgPT4ge1xyXG4gICAgY29uc3QgY3VycmVudFJlY2lwZSA9IGlzRWRpdCA/IGVkaXRSZWNpcGUgOiBuZXdSZWNpcGVcclxuICAgIGNvbnN0IHNldEN1cnJlbnRSZWNpcGUgPSBpc0VkaXQgPyBzZXRFZGl0UmVjaXBlIDogc2V0TmV3UmVjaXBlXHJcbiAgICBcclxuICAgIGxldCB1cGRhdGVkVGFua3MgPSBjdXJyZW50UmVjaXBlLnRhbmtzLmZpbHRlcih0ID0+IHQudGFua1VpZCAhPT0gdGFua1VpZClcclxuICAgIGlmIChwZXJjZW50YWdlID4gMCkge1xyXG4gICAgICB1cGRhdGVkVGFua3MucHVzaCh7IHRhbmtVaWQsIHBlcmNlbnRhZ2UgfSlcclxuICAgIH1cclxuICAgIFxyXG4gICAgLy8gQXV0by1hZGp1c3Qgb3RoZXIgdGFua3MgdG8gbWFpbnRhaW4gMTAwJSB0b3RhbFxyXG4gICAgY29uc3QgY3VycmVudFRvdGFsID0gdXBkYXRlZFRhbmtzLnJlZHVjZSgoc3VtLCB0KSA9PiBzdW0gKyB0LnBlcmNlbnRhZ2UsIDApXHJcbiAgICBpZiAoY3VycmVudFRvdGFsID4gMTAwKSB7XHJcbiAgICAgIGNvbnN0IGV4Y2VzcyA9IGN1cnJlbnRUb3RhbCAtIDEwMFxyXG4gICAgICBjb25zdCBvdGhlclRhbmtzID0gdXBkYXRlZFRhbmtzLmZpbHRlcih0ID0+IHQudGFua1VpZCAhPT0gdGFua1VpZClcclxuICAgICAgXHJcbiAgICAgIGlmIChvdGhlclRhbmtzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBjb25zdCByZWR1Y3Rpb25QZXJUYW5rID0gZXhjZXNzIC8gb3RoZXJUYW5rcy5sZW5ndGhcclxuICAgICAgICB1cGRhdGVkVGFua3MgPSB1cGRhdGVkVGFua3MubWFwKHQgPT4gXHJcbiAgICAgICAgICB0LnRhbmtVaWQgPT09IHRhbmtVaWQgPyB0IDogeyAuLi50LCBwZXJjZW50YWdlOiBNYXRoLm1heCgwLCBNYXRoLnJvdW5kKHQucGVyY2VudGFnZSAtIHJlZHVjdGlvblBlclRhbmspKSB9XHJcbiAgICAgICAgKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHNldEN1cnJlbnRSZWNpcGUocHJldiA9PiAoeyAuLi5wcmV2LCB0YW5rczogdXBkYXRlZFRhbmtzIH0pKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgZ2V0VGFua1BlcmNlbnRhZ2UgPSAodGFua1VpZCwgaXNFZGl0ID0gZmFsc2UpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRSZWNpcGUgPSBpc0VkaXQgPyBlZGl0UmVjaXBlIDogbmV3UmVjaXBlXHJcbiAgICBjb25zdCB0YW5rID0gY3VycmVudFJlY2lwZS50YW5rcy5maW5kKHQgPT4gdC50YW5rVWlkID09PSB0YW5rVWlkKVxyXG4gICAgcmV0dXJuIHRhbmsgPyB0YW5rLnBlcmNlbnRhZ2UgOiAwXHJcbiAgfVxyXG5cclxuICBjb25zdCBnZXRUb3RhbFBlcmNlbnRhZ2UgPSAoaXNFZGl0ID0gZmFsc2UpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRSZWNpcGUgPSBpc0VkaXQgPyBlZGl0UmVjaXBlIDogbmV3UmVjaXBlXHJcbiAgICByZXR1cm4gY3VycmVudFJlY2lwZS50YW5rcy5yZWR1Y2UoKHN1bSwgdCkgPT4gc3VtICsgdC5wZXJjZW50YWdlLCAwKVxyXG4gIH1cclxuXHJcbiAgY29uc3QgUGllQ2hhcnQgPSAoeyByZWNpcGVUYW5rcywgc2l6ZSA9IDEyMCB9KSA9PiB7XHJcbiAgICBjb25zdCBjb2xvcnMgPSBbJyMyMmQzZWUnLCAnI2E3OGJmYScsICcjZmI3MTg1JywgJyMxMGI5ODEnLCAnI2Y1OWUwYiddXHJcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMiAtIDEwXHJcbiAgICBjb25zdCBjZW50ZXJYID0gc2l6ZSAvIDJcclxuICAgIGNvbnN0IGNlbnRlclkgPSBzaXplIC8gMlxyXG4gICAgbGV0IG9mZnNldCA9IDBcclxuXHJcbiAgICBjb25zdCBwb2xhclRvQ2FydGVzaWFuID0gKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgYW5nbGVJbkRlZ3JlZXMpID0+IHtcclxuICAgICAgY29uc3QgYW5nbGVJblJhZGlhbnMgPSAoYW5nbGVJbkRlZ3JlZXMgLSA5MCkgKiBNYXRoLlBJIC8gMTgwLjBcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OiBjZW50ZXJYICsgKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKSksXHJcbiAgICAgICAgeTogY2VudGVyWSArIChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZUluUmFkaWFucykpXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjcmVhdGVQYXRoID0gKHN0YXJ0QW5nbGUsIGVuZEFuZ2xlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHN0YXJ0ID0gcG9sYXJUb0NhcnRlc2lhbihjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGVuZEFuZ2xlKVxyXG4gICAgICBjb25zdCBlbmQgPSBwb2xhclRvQ2FydGVzaWFuKGNlbnRlclgsIGNlbnRlclksIHJhZGl1cywgc3RhcnRBbmdsZSlcclxuICAgICAgY29uc3QgbGFyZ2VBcmNGbGFnID0gZW5kQW5nbGUgLSBzdGFydEFuZ2xlIDw9IDE4MCA/IFwiMFwiIDogXCIxXCJcclxuICAgICAgcmV0dXJuIGBNICR7Y2VudGVyWH0gJHtjZW50ZXJZfSBMICR7c3RhcnQueH0gJHtzdGFydC55fSBBICR7cmFkaXVzfSAke3JhZGl1c30gMCAke2xhcmdlQXJjRmxhZ30gMCAke2VuZC54fSAke2VuZC55fSBaYFxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cclxuICAgICAgICA8c3ZnIHdpZHRoPXtzaXplfSBoZWlnaHQ9e3NpemV9IGNsYXNzTmFtZT1cInRyYW5zZm9ybSAtcm90YXRlLTkwXCI+XHJcbiAgICAgICAgICB7cmVjaXBlVGFua3MubWFwKCh0YW5rLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9ICh0YW5rLnBlcmNlbnRhZ2UgLyAxMDApICogMzYwXHJcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVQYXRoKG9mZnNldCwgb2Zmc2V0ICsgYW5nbGUpXHJcbiAgICAgICAgICAgIG9mZnNldCArPSBhbmdsZVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgIDxwYXRoXHJcbiAgICAgICAgICAgICAgICBrZXk9e2luZGV4fVxyXG4gICAgICAgICAgICAgICAgZD17cGF0aH1cclxuICAgICAgICAgICAgICAgIGZpbGw9e2NvbG9yc1tpbmRleCAlIGNvbG9ycy5sZW5ndGhdfVxyXG4gICAgICAgICAgICAgICAgc3Ryb2tlPVwiIzFhMWExYVwiXHJcbiAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eT1cIjAuOFwiXHJcbiAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgfSl9XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxuXHJcbiAgLy8gU2hhcmVkIFJlY2lwZSBGb3JtIENvbXBvbmVudFxyXG4gIGNvbnN0IFJlY2lwZUZvcm0gPSAoeyByZWNpcGUsIHNldFJlY2lwZSwgaXNFZGl0LCBvblN1Ym1pdCwgb25DYW5jZWwgfSkgPT4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIGJnLWFjY2VudC1wcmltYXJ5LzUgYm9yZGVyLWFjY2VudC1wcmltYXJ5LzIwXCI+XHJcbiAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC1hY2NlbnQtcHJpbWFyeSBtYi00XCI+XHJcbiAgICAgICAge2lzRWRpdCA/ICdFZGl0IFJlY2lwZScgOiAnQ3JlYXRlIE5ldyBSZWNpcGUnfVxyXG4gICAgICA8L2gzPlxyXG4gICAgICBcclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMCBtYi0yXCI+UmVjaXBlIE5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgdmFsdWU9e3JlY2lwZS5uYW1lfVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHNldFJlY2lwZShwcmV2ID0+ICh7IC4uLnByZXYsIG5hbWU6IGUudGFyZ2V0LnZhbHVlIH0pKX1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJlLmcuLCBNb3JuaW5nIE1peCwgRXZlbmluZyBGZWFzdFwiXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0IHctZnVsbFwiXHJcbiAgICAgICAgICAgIG1heExlbmd0aD17MzJ9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTRcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS0zMDAgbWItMlwiPlRvdGFsIFdlaWdodCAoZyk8L2xhYmVsPlxyXG4gICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICB2YWx1ZT17cmVjaXBlLnRvdGFsV2VpZ2h0fVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gc2V0UmVjaXBlKHByZXYgPT4gKHsgLi4ucHJldiwgdG90YWxXZWlnaHQ6IHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSB8fCAwIH0pKX1cclxuICAgICAgICAgICAgICBtaW49XCIxMFwiIG1heD1cIjUwMFwiIGNsYXNzTmFtZT1cImlucHV0IHctZnVsbFwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS0zMDAgbWItMlwiPlNlcnZpbmdzL0RheTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDxpbnB1dFxyXG4gICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtyZWNpcGUuc2VydmluZ3N9XHJcbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiBzZXRSZWNpcGUocHJldiA9PiAoeyAuLi5wcmV2LCBzZXJ2aW5nczogcGFyc2VJbnQoZS50YXJnZXQudmFsdWUpIHx8IDEgfSkpfVxyXG4gICAgICAgICAgICAgIG1pbj1cIjFcIiBtYXg9XCIxMFwiIGNsYXNzTmFtZT1cImlucHV0IHctZnVsbFwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS0zMDAgbWItMlwiPlxyXG4gICAgICAgICAgICBUYW5rIE1peCAoe2dldFRvdGFsUGVyY2VudGFnZShpc0VkaXQpfSUgdG90YWwpXHJcbiAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cclxuICAgICAgICAgICAge3RhbmtzLm1hcCgodGFuaykgPT4gKFxyXG4gICAgICAgICAgICAgIDxkaXYga2V5PXt0YW5rLnVpZH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0zXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC13aGl0ZSBtYi0xXCI+e3RhbmsubmFtZX08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cInJhbmdlXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU9e2dldFRhbmtQZXJjZW50YWdlKHRhbmsudWlkLCBpc0VkaXQpfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlVGFua1BlcmNlbnRhZ2UodGFuay51aWQsIHBhcnNlSW50KGUudGFyZ2V0LnZhbHVlKSwgaXNFZGl0KX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgaC0yIGJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWxnIGFwcGVhcmFuY2Utbm9uZSBjdXJzb3ItcG9pbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0xNiB0ZXh0LXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtYWNjZW50LXByaW1hcnkgZm9udC1tZWRpdW1cIj5cclxuICAgICAgICAgICAgICAgICAgICB7Z2V0VGFua1BlcmNlbnRhZ2UodGFuay51aWQsIGlzRWRpdCl9JVxyXG4gICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIFxyXG4gICAgICAgICAge2dldFRvdGFsUGVyY2VudGFnZShpc0VkaXQpICE9PSAxMDAgJiYgKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC13YXJuaW5nIG10LTJcIj5cclxuICAgICAgICAgICAgICDimqDvuI8gVG90YWwgc2hvdWxkIGVxdWFsIDEwMCUgKGN1cnJlbnRseSB7Z2V0VG90YWxQZXJjZW50YWdlKGlzRWRpdCl9JSlcclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICB7cmVjaXBlLnRhbmtzLmxlbmd0aCA+IDAgJiYgKFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMCBtYi0yXCI+TWl4IFByZXZpZXc8L2xhYmVsPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtNlwiPlxyXG4gICAgICAgICAgICAgIDxQaWVDaGFydCByZWNpcGVUYW5rcz17cmVjaXBlLnRhbmtzfSBzaXplPXsxMDB9IC8+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTFcIj5cclxuICAgICAgICAgICAgICAgIHtyZWNpcGUudGFua3MubWFwKCh0YW5rLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBjb25zdCB0YW5rRGF0YSA9IHRhbmtzLmZpbmQodCA9PiB0LnVpZCA9PT0gdGFuay50YW5rVWlkKVxyXG4gICAgICAgICAgICAgICAgICBjb25zdCBjb2xvcnMgPSBbJyMyMmQzZWUnLCAnI2E3OGJmYScsICcjZmI3MTg1JywgJyMxMGI5ODEnLCAnI2Y1OWUwYiddXHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3RhbmsudGFua1VpZH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0yIHRleHQtc21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0zIGgtMyByb3VuZGVkXCIgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBjb2xvcnNbaW5kZXggJSBjb2xvcnMubGVuZ3RoXSB9fT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtZ3JheS0zMDBcIj57dGFua0RhdGE/Lm5hbWV9OiB7dGFuay5wZXJjZW50YWdlfSU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICl9XHJcblxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzcGFjZS14LTMgcHQtNFwiPlxyXG4gICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICBvbkNsaWNrPXtvblN1Ym1pdH1cclxuICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmcgfHwgIXJlY2lwZS5uYW1lLnRyaW0oKSB8fCBnZXRUb3RhbFBlcmNlbnRhZ2UoaXNFZGl0KSAhPT0gMTAwfVxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tcHJpbWFyeSBmbGV4LTFcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICB7aXNFZGl0ID8gJ+KckyBTYXZlIENoYW5nZXMnIDogJ+KckyBDcmVhdGUgUmVjaXBlJ31cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXtvbkNhbmNlbH0gY2xhc3NOYW1lPVwiYnRuIGJnLWdyYXktNjAwIGhvdmVyOmJnLWdyYXktNTAwXCI+XHJcbiAgICAgICAgICAgIOKclSBDYW5jZWxcclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIClcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwicC00IHNwYWNlLXktNlwiPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlblwiPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC0yeGwgZm9udC1ib2xkIHRleHQtd2hpdGVcIj5SZWNpcGVzPC9oMT5cclxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDBcIj5DcmVhdGUgY3VzdG9tIGZlZWRpbmcgbWl4ZXM8L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiBzZXRTaG93Q3JlYXRlRm9ybSh0cnVlKX0gY2xhc3NOYW1lPVwiYnRuLXByaW1hcnlcIj5cclxuICAgICAgICAgIOKelSBOZXcgUmVjaXBlXHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAge3Nob3dDcmVhdGVGb3JtICYmIChcclxuICAgICAgICA8UmVjaXBlRm9ybVxyXG4gICAgICAgICAgcmVjaXBlPXtuZXdSZWNpcGV9XHJcbiAgICAgICAgICBzZXRSZWNpcGU9e3NldE5ld1JlY2lwZX1cclxuICAgICAgICAgIGlzRWRpdD17ZmFsc2V9XHJcbiAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlQ3JlYXRlUmVjaXBlfVxyXG4gICAgICAgICAgb25DYW5jZWw9e3Jlc2V0Rm9ybXN9XHJcbiAgICAgICAgLz5cclxuICAgICAgKX1cclxuXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAge3JlY2lwZXMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHRleHQtY2VudGVyIHB5LThcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LTR4bCBtYi00XCI+8J+lhDwvZGl2PlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtZ3JheS0zMDAgbWItMlwiPk5vIFJlY2lwZXMgWWV0PC9oMz5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMCBtYi00XCI+Q3JlYXRlIHlvdXIgZmlyc3QgZmVlZGluZyByZWNpcGUgdG8gZ2V0IHN0YXJ0ZWQ8L3A+XHJcbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gc2V0U2hvd0NyZWF0ZUZvcm0odHJ1ZSl9IGNsYXNzTmFtZT1cImJ0bi1wcmltYXJ5XCI+XHJcbiAgICAgICAgICAgICAgQ3JlYXRlIEZpcnN0IFJlY2lwZVxyXG4gICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICkgOiAoXHJcbiAgICAgICAgICByZWNpcGVzLm1hcCgocmVjaXBlKSA9PiAoXHJcbiAgICAgICAgICAgIDxkaXYga2V5PXtyZWNpcGUuaWR9PlxyXG4gICAgICAgICAgICAgIHtlZGl0aW5nUmVjaXBlID09PSByZWNpcGUuaWQgPyAoXHJcbiAgICAgICAgICAgICAgICA8UmVjaXBlRm9ybVxyXG4gICAgICAgICAgICAgICAgICByZWNpcGU9e2VkaXRSZWNpcGV9XHJcbiAgICAgICAgICAgICAgICAgIHNldFJlY2lwZT17c2V0RWRpdFJlY2lwZX1cclxuICAgICAgICAgICAgICAgICAgaXNFZGl0PXt0cnVlfVxyXG4gICAgICAgICAgICAgICAgICBvblN1Ym1pdD17aGFuZGxlVXBkYXRlUmVjaXBlfVxyXG4gICAgICAgICAgICAgICAgICBvbkNhbmNlbD17cmVzZXRGb3Jtc31cclxuICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtc3RhcnQganVzdGlmeS1iZXR3ZWVuIG1iLTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlXCI+e3JlY2lwZS5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtNCB0ZXh0LXNtIHRleHQtZ3JheS00MDAgbXQtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj7wn5OPIHtyZWNpcGUudG90YWxXZWlnaHR9ZyB0b3RhbDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+8J+Nve+4jyB7cmVjaXBlLnNlcnZpbmdzfSBzZXJ2aW5ncy9kYXk8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPuKalu+4jyB7TWF0aC5yb3VuZChyZWNpcGUudG90YWxXZWlnaHQgLyByZWNpcGUuc2VydmluZ3MpfWcgcGVyIHNlcnZpbmc8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHN0YXJ0RWRpdGluZyhyZWNpcGUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctZ3JheS03MDAgaG92ZXI6YmctZ3JheS02MDAgdGV4dC1zbSBweC0zIHB5LTFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDinI/vuI8gRWRpdFxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IGhhbmRsZURlbGV0ZVJlY2lwZShyZWNpcGUuaWQpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctcmVkLTYwMC8yMCB0ZXh0LXJlZC00MDAgaG92ZXI6YmctcmVkLTYwMC8zMCB0ZXh0LXNtIHB4LTMgcHktMVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIPCfl5HvuI8gRGVsZXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC1zaHJpbmstMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPFBpZUNoYXJ0IHJlY2lwZVRhbmtzPXtyZWNpcGUudGFua3N9IHNpemU9ezgwfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIHNwYWNlLXktMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAge3JlY2lwZS50YW5rcy5tYXAoKHRhbmssIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhbmtEYXRhID0gdGFua3MuZmluZCh0ID0+IHQudWlkID09PSB0YW5rLnRhbmtVaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGdyYW1zUGVyU2VydmluZyA9IE1hdGgucm91bmQoKHJlY2lwZS50b3RhbFdlaWdodCAqIHRhbmsucGVyY2VudGFnZSAvIDEwMCkgLyByZWNpcGUuc2VydmluZ3MpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9ycyA9IFsnIzIyZDNlZScsICcjYTc4YmZhJywgJyNmYjcxODUnLCAnIzEwYjk4MScsICcjZjU5ZTBiJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e3RhbmsudGFua1VpZH0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMyBoLTMgcm91bmRlZFwiIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogY29sb3JzW2luZGV4ICUgY29sb3JzLmxlbmd0aF0gfX0+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9udC1tZWRpdW1cIj57dGFua0RhdGE/Lm5hbWUgfHwgYFRhbmsgJHt0YW5rLnRhbmtVaWR9YH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtYWNjZW50LXByaW1hcnkgZm9udC1zZW1pYm9sZFwiPnt0YW5rLnBlcmNlbnRhZ2V9JTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMFwiPntncmFtc1BlclNlcnZpbmd9Zy9zZXJ2aW5nPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0yIGdhcC0zIG10LTRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBiZy1hY2NlbnQtcHJpbWFyeS8yMCB0ZXh0LWFjY2VudC1wcmltYXJ5IGhvdmVyOmJnLWFjY2VudC1wcmltYXJ5LzMwIGJvcmRlciBib3JkZXItYWNjZW50LXByaW1hcnkvMzBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIPCfjb3vuI8gRGlzcGVuc2UgTm93XHJcbiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYmctYWNjZW50LXNlY29uZGFyeS8yMCB0ZXh0LWFjY2VudC1zZWNvbmRhcnkgaG92ZXI6YmctYWNjZW50LXNlY29uZGFyeS8zMCBib3JkZXIgYm9yZGVyLWFjY2VudC1zZWNvbmRhcnkvMzBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIOKPsCBTY2hlZHVsZVxyXG4gICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSlcclxuICAgICAgICApfVxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIClcclxufSIsImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IHVzZUFwaSB9IGZyb20gJy4uL2hvb2tzL3VzZUFwaSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBTZXR0aW5ncygpIHtcclxuICBjb25zdCB7IGRhdGEsIHVwZGF0ZVNldHRpbmdzLCBsb2FkaW5nIH0gPSB1c2VBcGkoKVxyXG4gIGNvbnN0IFtzZXR0aW5ncywgc2V0U2V0dGluZ3NdID0gdXNlU3RhdGUoe1xyXG4gICAgZGV2aWNlTmFtZTogJycsXHJcbiAgICB0aW1lem9uZTogJycsXHJcbiAgICB3aWZpU3RyZW5ndGg6IDBcclxuICB9KVxyXG4gIGNvbnN0IFt1bnNhdmVkQ2hhbmdlcywgc2V0VW5zYXZlZENoYW5nZXNdID0gdXNlU3RhdGUoZmFsc2UpXHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBpZiAoZGF0YT8uc2V0dGluZ3MpIHtcclxuICAgICAgc2V0U2V0dGluZ3MoZGF0YS5zZXR0aW5ncylcclxuICAgIH1cclxuICB9LCBbZGF0YT8uc2V0dGluZ3NdKVxyXG5cclxuICBjb25zdCBoYW5kbGVTZXR0aW5nQ2hhbmdlID0gKGtleSwgdmFsdWUpID0+IHtcclxuICAgIHNldFNldHRpbmdzKHByZXYgPT4gKHsgLi4ucHJldiwgW2tleV06IHZhbHVlIH0pKVxyXG4gICAgc2V0VW5zYXZlZENoYW5nZXModHJ1ZSlcclxuICB9XHJcblxyXG4gIGNvbnN0IHNhdmVTZXR0aW5ncyA9IGFzeW5jICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHVwZGF0ZVNldHRpbmdzKHNldHRpbmdzKVxyXG4gICAgICBzZXRVbnNhdmVkQ2hhbmdlcyhmYWxzZSlcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzYXZlIHNldHRpbmdzOicsIGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVzZXRTZXR0aW5ncyA9ICgpID0+IHtcclxuICAgIHNldFNldHRpbmdzKGRhdGE/LnNldHRpbmdzIHx8IHt9KVxyXG4gICAgc2V0VW5zYXZlZENoYW5nZXMoZmFsc2UpXHJcbiAgfVxyXG5cclxuICBjb25zdCBnZXRXaWZpU3RyZW5ndGhUZXh0ID0gKHJzc2kpID0+IHtcclxuICAgIGlmIChyc3NpID4gLTUwKSByZXR1cm4geyB0ZXh0OiAnRXhjZWxsZW50JywgY29sb3I6ICd0ZXh0LXN1Y2Nlc3MnIH1cclxuICAgIGlmIChyc3NpID4gLTYwKSByZXR1cm4geyB0ZXh0OiAnR29vZCcsIGNvbG9yOiAndGV4dC1zdWNjZXNzJyB9XHJcbiAgICBpZiAocnNzaSA+IC03MCkgcmV0dXJuIHsgdGV4dDogJ0ZhaXInLCBjb2xvcjogJ3RleHQtd2FybmluZycgfVxyXG4gICAgaWYgKHJzc2kgPiAtODApIHJldHVybiB7IHRleHQ6ICdQb29yJywgY29sb3I6ICd0ZXh0LWVycm9yJyB9XHJcbiAgICByZXR1cm4geyB0ZXh0OiAnVmVyeSBQb29yJywgY29sb3I6ICd0ZXh0LWVycm9yJyB9XHJcbiAgfVxyXG5cclxuICBjb25zdCB3aWZpU3RhdHVzID0gZ2V0V2lmaVN0cmVuZ3RoVGV4dChzZXR0aW5ncy53aWZpU3RyZW5ndGgpXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBzcGFjZS15LTZcIj5cclxuICAgICAgey8qIEhlYWRlciAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBweS00XCI+XHJcbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIG1iLTJcIj5TZXR0aW5nczwvaDE+XHJcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTQwMFwiPkNvbmZpZ3VyZSB5b3VyIEtpdHR5YmxlIGRldmljZTwvcD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogRGV2aWNlIEluZm9ybWF0aW9uICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtd2hpdGUgbWItNFwiPkRldmljZSBJbmZvcm1hdGlvbjwvaDM+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS0zMDAgbWItMlwiPkRldmljZSBOYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgICAgICAgIHZhbHVlPXtzZXR0aW5ncy5kZXZpY2VOYW1lfVxyXG4gICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gaGFuZGxlU2V0dGluZ0NoYW5nZSgnZGV2aWNlTmFtZScsIGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIktpYmJsZVQ1XCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dCB3LWZ1bGxcIlxyXG4gICAgICAgICAgICAgIG1heExlbmd0aD17MzJ9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMCBtdC0xXCI+XHJcbiAgICAgICAgICAgICAgVGhpcyBuYW1lIGFwcGVhcnMgaW4geW91ciByb3V0ZXIgYW5kIG5ldHdvcmsgZGlzY292ZXJ5XHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIGZvbnQtbWVkaXVtIHRleHQtZ3JheS0zMDAgbWItMlwiPlRpbWV6b25lPC9sYWJlbD5cclxuICAgICAgICAgICAgPHNlbGVjdFxyXG4gICAgICAgICAgICAgIHZhbHVlPXtzZXR0aW5ncy50aW1lem9uZX1cclxuICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IGhhbmRsZVNldHRpbmdDaGFuZ2UoJ3RpbWV6b25lJywgZS50YXJnZXQudmFsdWUpfVxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0IHctZnVsbFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDLTEyXCI+VVRDLTEyIChCYWtlciBJc2xhbmQpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQy0xMVwiPlVUQy0xMSAoQW1lcmljYW4gU2Ftb2EpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQy0xMFwiPlVUQy0xMCAoSGF3YWlpKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJVVEMtOVwiPlVUQy05IChBbGFza2EpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQy04XCI+VVRDLTggKFBhY2lmaWMgVGltZSk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDLTdcIj5VVEMtNyAoTW91bnRhaW4gVGltZSk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDLTZcIj5VVEMtNiAoQ2VudHJhbCBUaW1lKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJVVEMtNVwiPlVUQy01IChFYXN0ZXJuIFRpbWUpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQy00XCI+VVRDLTQgKEF0bGFudGljIFRpbWUpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQy0zXCI+VVRDLTMgKEFyZ2VudGluYSk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDLTJcIj5VVEMtMiAoU291dGggR2VvcmdpYSk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDLTFcIj5VVEMtMSAoQXpvcmVzKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJVVEMrMFwiPlVUQyswIChMb25kb24pPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQysxXCI+VVRDKzEgKFBhcmlzLCBCZXJsaW4pPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQysyXCI+VVRDKzIgKENhaXJvLCBBdGhlbnMpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQyszXCI+VVRDKzMgKE1vc2NvdywgSXN0YW5idWwpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQys0XCI+VVRDKzQgKER1YmFpKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJVVEMrNVwiPlVUQys1IChQYWtpc3Rhbik8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDKzZcIj5VVEMrNiAoQmFuZ2xhZGVzaCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDKzdcIj5VVEMrNyAoVGhhaWxhbmQpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQys4XCI+VVRDKzggKENoaW5hLCBTaW5nYXBvcmUpPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlVUQys5XCI+VVRDKzkgKEphcGFuLCBLb3JlYSk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDKzEwXCI+VVRDKzEwIChBdXN0cmFsaWEgRWFzdCk8L29wdGlvbj5cclxuICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiVVRDKzExXCI+VVRDKzExIChOZXcgQ2FsZWRvbmlhKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJVVEMrMTJcIj5VVEMrMTIgKE5ldyBaZWFsYW5kKTwvb3B0aW9uPlxyXG4gICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBOZXR3b3JrIFN0YXR1cyAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkXCI+XHJcbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LXdoaXRlIG1iLTRcIj5OZXR3b3JrIFN0YXR1czwvaDM+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtXCI+V2lGaSBTaWduYWw8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTQwMFwiPntzZXR0aW5ncy53aWZpU3RyZW5ndGh9IGRCbTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2B0ZXh0LXJpZ2h0ICR7d2lmaVN0YXR1cy5jb2xvcn1gfT5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvbnQtc2VtaWJvbGRcIj57d2lmaVN0YXR1cy50ZXh0fTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgc3BhY2UteC0wLjVcIj5cclxuICAgICAgICAgICAgICAgIHtbMSwgMiwgMywgNF0ubWFwKChiYXIpID0+IChcclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGtleT17YmFyfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YHctMSBiZy1jdXJyZW50ICR7XHJcbiAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy53aWZpU3RyZW5ndGggPiAtNTAgLSAoYmFyIC0gMSkgKiAxMCA/ICdvcGFjaXR5LTEwMCcgOiAnb3BhY2l0eS0zMCdcclxuICAgICAgICAgICAgICAgICAgICB9YH1cclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBoZWlnaHQ6IGAke2JhciAqIDN9cHhgIH19XHJcbiAgICAgICAgICAgICAgICAgID48L2Rpdj5cclxuICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBncmlkLWNvbHMtMiBnYXAtNCB0ZXh0LXNtXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctZGFyay1zdXJmYWNlIHJvdW5kZWQtbGcgcC0zXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwXCI+SVAgQWRkcmVzczwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1vbm9cIj4xOTIuMTY4LjEuNDI8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctZGFyay1zdXJmYWNlIHJvdW5kZWQtbGcgcC0zXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwXCI+TUFDIEFkZHJlc3M8L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9udC1tb25vIHRleHQteHNcIj5BNDpDRjoxMjpGRTpEQzpCQTwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIHsvKiBGZWVkaW5nIFNldHRpbmdzICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtd2hpdGUgbWItNFwiPkZlZWRpbmcgU2V0dGluZ3M8L2gzPlxyXG4gICAgICAgIFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWxnIHAtM1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0yXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1lZGl1bVwiPlNhZmV0eSBNb2RlPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJyZWxhdGl2ZSBpbmxpbmUtZmxleCBpdGVtcy1jZW50ZXIgY3Vyc29yLXBvaW50ZXJcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzc05hbWU9XCJzci1vbmx5IHBlZXJcIiBkZWZhdWx0Q2hlY2tlZCAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTExIGgtNiBiZy1ncmF5LTYwMCBwZWVyLWZvY3VzOm91dGxpbmUtbm9uZSByb3VuZGVkLWZ1bGwgcGVlciBwZWVyLWNoZWNrZWQ6YWZ0ZXI6dHJhbnNsYXRlLXgtZnVsbCBwZWVyLWNoZWNrZWQ6YWZ0ZXI6Ym9yZGVyLXdoaXRlIGFmdGVyOmNvbnRlbnQtWycnXSBhZnRlcjphYnNvbHV0ZSBhZnRlcjp0b3AtWzJweF0gYWZ0ZXI6bGVmdC1bMnB4XSBhZnRlcjpiZy13aGl0ZSBhZnRlcjpyb3VuZGVkLWZ1bGwgYWZ0ZXI6aC01IGFmdGVyOnctNSBhZnRlcjp0cmFuc2l0aW9uLWFsbCBwZWVyLWNoZWNrZWQ6YmctYWNjZW50LXByaW1hcnlcIj48L2Rpdj5cclxuICAgICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktNDAwXCI+XHJcbiAgICAgICAgICAgICAgUHJldmVudHMgb3ZlcmZlZWRpbmcgYnkgbGltaXRpbmcgZGlzcGVuc2luZyBmcmVxdWVuY3lcclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1kYXJrLXN1cmZhY2Ugcm91bmRlZC1sZyBwLTNcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LWJldHdlZW4gbWItMlwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9udC1tZWRpdW1cIj5BdXRvIFJlZmlsbCBBbGVydHM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInJlbGF0aXZlIGlubGluZS1mbGV4IGl0ZW1zLWNlbnRlciBjdXJzb3ItcG9pbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzTmFtZT1cInNyLW9ubHkgcGVlclwiIGRlZmF1bHRDaGVja2VkIC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMTEgaC02IGJnLWdyYXktNjAwIHBlZXItZm9jdXM6b3V0bGluZS1ub25lIHJvdW5kZWQtZnVsbCBwZWVyIHBlZXItY2hlY2tlZDphZnRlcjp0cmFuc2xhdGUteC1mdWxsIHBlZXItY2hlY2tlZDphZnRlcjpib3JkZXItd2hpdGUgYWZ0ZXI6Y29udGVudC1bJyddIGFmdGVyOmFic29sdXRlIGFmdGVyOnRvcC1bMnB4XSBhZnRlcjpsZWZ0LVsycHhdIGFmdGVyOmJnLXdoaXRlIGFmdGVyOnJvdW5kZWQtZnVsbCBhZnRlcjpoLTUgYWZ0ZXI6dy01IGFmdGVyOnRyYW5zaXRpb24tYWxsIHBlZXItY2hlY2tlZDpiZy1hY2NlbnQtcHJpbWFyeVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS00MDBcIj5cclxuICAgICAgICAgICAgICBHZXQgbm90aWZpZWQgd2hlbiB0YW5rcyBhcmUgcnVubmluZyBsb3dcclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFN5c3RlbSBBY3Rpb25zICovfVxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmRcIj5cclxuICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC1sZyBmb250LXNlbWlib2xkIHRleHQtd2hpdGUgbWItNFwiPlN5c3RlbSBBY3Rpb25zPC9oMz5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktM1wiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBcclxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3NldHRpbmdzL2NhbGlicmF0aW9uJ31cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJnLWFjY2VudC1wcmltYXJ5LzIwIHRleHQtYWNjZW50LXByaW1hcnkgaG92ZXI6YmctYWNjZW50LXByaW1hcnkvMzAgYm9yZGVyIGJvcmRlci1hY2NlbnQtcHJpbWFyeS8zMCB3LWZ1bGxcIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICDimpnvuI8gQWR2YW5jZWQgQ2FsaWJyYXRpb25cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBiZy1hY2NlbnQtc2Vjb25kYXJ5LzIwIHRleHQtYWNjZW50LXNlY29uZGFyeSBob3ZlcjpiZy1hY2NlbnQtc2Vjb25kYXJ5LzMwIGJvcmRlciBib3JkZXItYWNjZW50LXNlY29uZGFyeS8zMCB3LWZ1bGxcIj5cclxuICAgICAgICAgICAg8J+UhCBSZXN0YXJ0IERldmljZVxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJnLXdhcm5pbmcvMjAgdGV4dC13YXJuaW5nIGhvdmVyOmJnLXdhcm5pbmcvMzAgYm9yZGVyIGJvcmRlci13YXJuaW5nLzMwIHctZnVsbFwiPlxyXG4gICAgICAgICAgICDwn5OlIEV4cG9ydCBTZXR0aW5nc1xyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJnLWVycm9yLzIwIHRleHQtZXJyb3IgaG92ZXI6YmctZXJyb3IvMzAgYm9yZGVyIGJvcmRlci1lcnJvci8zMCB3LWZ1bGxcIj5cclxuICAgICAgICAgICAg8J+PrSBGYWN0b3J5IFJlc2V0XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogU2F2ZSBDaGFuZ2VzICovfVxyXG4gICAgICB7dW5zYXZlZENoYW5nZXMgJiYgKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZml4ZWQgYm90dG9tLTIwIGxlZnQtNCByaWdodC00IGJnLWFjY2VudC1wcmltYXJ5LzkwIGJhY2tkcm9wLWJsdXIgcm91bmRlZC1sZyBwLTQgYm9yZGVyIGJvcmRlci1hY2NlbnQtcHJpbWFyeSBzaGFkb3ctbGdcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1iZXR3ZWVuXCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtXCI+VW5zYXZlZCBDaGFuZ2VzPC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlLzgwIHRleHQtc21cIj5Zb3UgaGF2ZSBwZW5kaW5nIGNvbmZpZ3VyYXRpb24gY2hhbmdlczwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHNwYWNlLXgtMlwiPlxyXG4gICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3Jlc2V0U2V0dGluZ3N9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctd2hpdGUvMjAgdGV4dC13aGl0ZSBob3ZlcjpiZy13aGl0ZS8zMCB0ZXh0LXNtIHB4LTMgcHktMVwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgQ2FuY2VsXHJcbiAgICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17c2F2ZVNldHRpbmdzfVxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWQ9e2xvYWRpbmd9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctd2hpdGUgdGV4dC1kYXJrLWJnIGhvdmVyOmJnLXdoaXRlLzkwIGZvbnQtc2VtaWJvbGQgdGV4dC1zbSBweC00IHB5LTFcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIHtsb2FkaW5nID8gJ/Cfkr4gU2F2aW5nLi4uJyA6ICfwn5K+IFNhdmUnfVxyXG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApfVxyXG5cclxuICAgICAgey8qIERldmljZSBJbmZvIEZvb3RlciAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIGJnLWRhcmstc3VyZmFjZS81MFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgc3BhY2UteS0yXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTQwMFwiPktpdHR5YmxlIEZpcm13YXJlPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtbGcgZm9udC1zZW1pYm9sZCB0ZXh0LWFjY2VudC1wcmltYXJ5XCI+djEuMC4wPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTUwMFwiPkJ1aWxkIDIwMjUuMDcuMDM8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn0iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYgfSBmcm9tICdwcmVhY3QvaG9va3MnXHJcbmltcG9ydCB7IHVzZUFwaSB9IGZyb20gJy4uL2hvb2tzL3VzZUFwaSdcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBDYWxpYnJhdGlvbigpIHtcclxuICBjb25zdCB7IGFwaUNhbGwsIGxvYWRpbmcgfSA9IHVzZUFwaSgpXHJcbiAgY29uc3QgW3NjYWxlRGF0YSwgc2V0U2NhbGVEYXRhXSA9IHVzZVN0YXRlKFtdKVxyXG4gIGNvbnN0IFtpc01vbml0b3JpbmcsIHNldElzTW9uaXRvcmluZ10gPSB1c2VTdGF0ZShmYWxzZSlcclxuICBjb25zdCBbc2Vydm9Db25maWcsIHNldFNlcnZvQ29uZmlnXSA9IHVzZVN0YXRlKHtcclxuICAgIHRhbmtzOiBbXHJcbiAgICAgIHsgaWQ6IDAsIGlkbGVQd206IDE1MDAsIG5hbWU6ICdUYW5rIDAnIH0sXHJcbiAgICAgIHsgaWQ6IDEsIGlkbGVQd206IDE1MDAsIG5hbWU6ICdUYW5rIDEnIH0sXHJcbiAgICAgIHsgaWQ6IDIsIGlkbGVQd206IDE1MDAsIG5hbWU6ICdUYW5rIDInIH1cclxuICAgIF0sXHJcbiAgICBob3BwZXI6IHtcclxuICAgICAgY2xvc2VkUHdtOiAxMDAwLFxyXG4gICAgICBvcGVuUHdtOiAyMDAwXHJcbiAgICB9XHJcbiAgfSlcclxuICBjb25zdCBbdGFyZUluUHJvZ3Jlc3MsIHNldFRhcmVJblByb2dyZXNzXSA9IHVzZVN0YXRlKGZhbHNlKVxyXG4gIGNvbnN0IGludGVydmFsUmVmID0gdXNlUmVmKG51bGwpXHJcbiAgY29uc3QgY2FudmFzUmVmID0gdXNlUmVmKG51bGwpXHJcblxyXG4gIC8vIE1vY2sgc2NhbGUgZGF0YSBmb3IgZGV2ZWxvcG1lbnRcclxuICBjb25zdCBnZW5lcmF0ZU1vY2tTY2FsZURhdGEgPSAoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXHJcbiAgICAgIHJhd1ZhbHVlOiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAwICsgMjAwMCksIC8vIEFEQyByYXcgdmFsdWVcclxuICAgICAgd2VpZ2h0OiAoTWF0aC5yYW5kb20oKSAqIDEwICsgOTUpLnRvRml4ZWQoMSksIC8vIFdlaWdodCBpbiBncmFtc1xyXG4gICAgICBzdGFibGU6IE1hdGgucmFuZG9tKCkgPiAwLjMgLy8gU3RhYmlsaXR5IGluZGljYXRvclxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU3RhcnQvc3RvcCByZWFsLXRpbWUgbW9uaXRvcmluZ1xyXG4gIGNvbnN0IHRvZ2dsZU1vbml0b3JpbmcgPSAoKSA9PiB7XHJcbiAgICBpZiAoaXNNb25pdG9yaW5nKSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWxSZWYuY3VycmVudClcclxuICAgICAgc2V0SXNNb25pdG9yaW5nKGZhbHNlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc2V0SXNNb25pdG9yaW5nKHRydWUpXHJcbiAgICAgIGludGVydmFsUmVmLmN1cnJlbnQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmV3RGF0YSA9IGdlbmVyYXRlTW9ja1NjYWxlRGF0YSgpXHJcbiAgICAgICAgc2V0U2NhbGVEYXRhKHByZXYgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdXBkYXRlZCA9IFsuLi5wcmV2LCBuZXdEYXRhXVxyXG4gICAgICAgICAgLy8gS2VlcCBvbmx5IGxhc3QgNTAgcmVhZGluZ3MgKDI1IHNlY29uZHMgYXQgMkh6KVxyXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZWQuc2xpY2UoLTUwKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0sIDUwMCkgLy8gMkh6ID0gNTAwbXMgaW50ZXJ2YWxcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFRhcmUgdGhlIHNjYWxlXHJcbiAgY29uc3QgaGFuZGxlVGFyZSA9IGFzeW5jICgpID0+IHtcclxuICAgIHNldFRhcmVJblByb2dyZXNzKHRydWUpXHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBJbiBwcm9kdWN0aW9uOiBhd2FpdCBhcGlDYWxsKCcvY2FsaWJyYXRpb24vdGFyZScsIHsgbWV0aG9kOiAnUE9TVCcgfSlcclxuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDIwMDApKSAvLyBNb2NrIGRlbGF5XHJcbiAgICAgIHNldFNjYWxlRGF0YShbXSkgLy8gQ2xlYXIgcmVhZGluZ3MgYWZ0ZXIgdGFyZVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5lcnJvcignVGFyZSBmYWlsZWQ6JywgZXJyb3IpXHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICBzZXRUYXJlSW5Qcm9ncmVzcyhmYWxzZSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBzZXJ2byBjb25maWd1cmF0aW9uXHJcbiAgY29uc3QgdXBkYXRlU2Vydm9Db25maWcgPSBhc3luYyAodHlwZSwgaWQsIGZpZWxkLCB2YWx1ZSkgPT4ge1xyXG4gICAgY29uc3QgcHdtVmFsdWUgPSBwYXJzZUludCh2YWx1ZSlcclxuICAgIGlmIChwd21WYWx1ZSA8IDUwMCB8fCBwd21WYWx1ZSA+IDI1MDApIHJldHVybiAvLyBQV00gc2FmZXR5IGxpbWl0c1xyXG5cclxuICAgIGlmICh0eXBlID09PSAndGFuaycpIHtcclxuICAgICAgc2V0U2Vydm9Db25maWcocHJldiA9PiAoe1xyXG4gICAgICAgIC4uLnByZXYsXHJcbiAgICAgICAgdGFua3M6IHByZXYudGFua3MubWFwKHRhbmsgPT4gXHJcbiAgICAgICAgICB0YW5rLmlkID09PSBpZCA/IHsgLi4udGFuaywgW2ZpZWxkXTogcHdtVmFsdWUgfSA6IHRhbmtcclxuICAgICAgICApXHJcbiAgICAgIH0pKVxyXG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnaG9wcGVyJykge1xyXG4gICAgICBzZXRTZXJ2b0NvbmZpZyhwcmV2ID0+ICh7XHJcbiAgICAgICAgLi4ucHJldixcclxuICAgICAgICBob3BwZXI6IHsgLi4ucHJldi5ob3BwZXIsIFtmaWVsZF06IHB3bVZhbHVlIH1cclxuICAgICAgfSkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBUZXN0IHNlcnZvIG1vdmVtZW50XHJcbiAgY29uc3QgdGVzdFNlcnZvID0gYXN5bmMgKHR5cGUsIGlkLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgLy8gSW4gcHJvZHVjdGlvbjogYXdhaXQgYXBpQ2FsbCgnL2NhbGlicmF0aW9uL3NlcnZvLXRlc3QnLCB7IG1ldGhvZDogJ1BPU1QnLCBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHR5cGUsIGlkLCBwb3NpdGlvbiB9KSB9KVxyXG4gICAgICBjb25zb2xlLmxvZyhgVGVzdGluZyAke3R5cGV9IHNlcnZvICR7aWR9IGF0IHBvc2l0aW9uICR7cG9zaXRpb259YClcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1NlcnZvIHRlc3QgZmFpbGVkOicsIGVycm9yKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2F2ZSBjYWxpYnJhdGlvbiBzZXR0aW5nc1xyXG4gIGNvbnN0IHNhdmVDYWxpYnJhdGlvbiA9IGFzeW5jICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIEluIHByb2R1Y3Rpb246IGF3YWl0IGFwaUNhbGwoJy9jYWxpYnJhdGlvbi9zYXZlJywgeyBtZXRob2Q6ICdQT1NUJywgYm9keTogSlNPTi5zdHJpbmdpZnkoc2Vydm9Db25maWcpIH0pXHJcbiAgICAgIGNvbnNvbGUubG9nKCdDYWxpYnJhdGlvbiBzYXZlZDonLCBzZXJ2b0NvbmZpZylcclxuICAgICAgYWxlcnQoJ0NhbGlicmF0aW9uIHNldHRpbmdzIHNhdmVkIScpXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKCdTYXZlIGZhaWxlZDonLCBlcnJvcilcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIERyYXcgcmVhbC10aW1lIGdyYXBoXHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIGlmICghY2FudmFzUmVmLmN1cnJlbnQgfHwgc2NhbGVEYXRhLmxlbmd0aCA9PT0gMCkgcmV0dXJuXHJcblxyXG4gICAgY29uc3QgY2FudmFzID0gY2FudmFzUmVmLmN1cnJlbnRcclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGNhbnZhc1xyXG5cclxuICAgIC8vIENsZWFyIGNhbnZhc1xyXG4gICAgY3R4LmZpbGxTdHlsZSA9ICcjMWExYTFhJ1xyXG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpXHJcblxyXG4gICAgLy8gRHJhdyBncmlkXHJcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSAnIzM3NDE1MSdcclxuICAgIGN0eC5saW5lV2lkdGggPSAxXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSAxMDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IHkgPSAoaGVpZ2h0IC8gMTApICogaVxyXG4gICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgY3R4Lm1vdmVUbygwLCB5KVxyXG4gICAgICBjdHgubGluZVRvKHdpZHRoLCB5KVxyXG4gICAgICBjdHguc3Ryb2tlKClcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDIwOyBpKyspIHtcclxuICAgICAgY29uc3QgeCA9ICh3aWR0aCAvIDIwKSAqIGlcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgIGN0eC5tb3ZlVG8oeCwgMClcclxuICAgICAgY3R4LmxpbmVUbyh4LCBoZWlnaHQpXHJcbiAgICAgIGN0eC5zdHJva2UoKVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChzY2FsZURhdGEubGVuZ3RoIDwgMikgcmV0dXJuXHJcblxyXG4gICAgLy8gRmluZCBtaW4vbWF4IGZvciBzY2FsaW5nXHJcbiAgICBjb25zdCB3ZWlnaHRzID0gc2NhbGVEYXRhLm1hcChkID0+IHBhcnNlRmxvYXQoZC53ZWlnaHQpKVxyXG4gICAgY29uc3QgbWluV2VpZ2h0ID0gTWF0aC5taW4oLi4ud2VpZ2h0cylcclxuICAgIGNvbnN0IG1heFdlaWdodCA9IE1hdGgubWF4KC4uLndlaWdodHMpXHJcbiAgICBjb25zdCByYW5nZSA9IG1heFdlaWdodCAtIG1pbldlaWdodCB8fCAxXHJcblxyXG4gICAgLy8gRHJhdyB3ZWlnaHQgbGluZVxyXG4gICAgY3R4LnN0cm9rZVN0eWxlID0gJyMyMmQzZWUnXHJcbiAgICBjdHgubGluZVdpZHRoID0gMlxyXG4gICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICBcclxuICAgIHNjYWxlRGF0YS5mb3JFYWNoKChkYXRhLCBpbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCB4ID0gKGluZGV4IC8gKHNjYWxlRGF0YS5sZW5ndGggLSAxKSkgKiB3aWR0aFxyXG4gICAgICBjb25zdCBub3JtYWxpemVkV2VpZ2h0ID0gKHBhcnNlRmxvYXQoZGF0YS53ZWlnaHQpIC0gbWluV2VpZ2h0KSAvIHJhbmdlXHJcbiAgICAgIGNvbnN0IHkgPSBoZWlnaHQgLSAobm9ybWFsaXplZFdlaWdodCAqIGhlaWdodClcclxuICAgICAgXHJcbiAgICAgIGlmIChpbmRleCA9PT0gMCkge1xyXG4gICAgICAgIGN0eC5tb3ZlVG8oeCwgeSlcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjdHgubGluZVRvKHgsIHkpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICBjdHguc3Ryb2tlKClcclxuXHJcbiAgICAvLyBEcmF3IHN0YWJpbGl0eSBpbmRpY2F0b3JzXHJcbiAgICBzY2FsZURhdGEuZm9yRWFjaCgoZGF0YSwgaW5kZXgpID0+IHtcclxuICAgICAgY29uc3QgeCA9IChpbmRleCAvIChzY2FsZURhdGEubGVuZ3RoIC0gMSkpICogd2lkdGhcclxuICAgICAgY29uc3Qgbm9ybWFsaXplZFdlaWdodCA9IChwYXJzZUZsb2F0KGRhdGEud2VpZ2h0KSAtIG1pbldlaWdodCkgLyByYW5nZVxyXG4gICAgICBjb25zdCB5ID0gaGVpZ2h0IC0gKG5vcm1hbGl6ZWRXZWlnaHQgKiBoZWlnaHQpXHJcbiAgICAgIFxyXG4gICAgICBjdHguZmlsbFN0eWxlID0gZGF0YS5zdGFibGUgPyAnIzEwYjk4MScgOiAnI2VmNDQ0NCdcclxuICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgIGN0eC5hcmMoeCwgeSwgMywgMCwgMiAqIE1hdGguUEkpXHJcbiAgICAgIGN0eC5maWxsKClcclxuICAgIH0pXHJcblxyXG4gICAgLy8gRHJhdyBsYWJlbHNcclxuICAgIGN0eC5maWxsU3R5bGUgPSAnIzljYTNhZidcclxuICAgIGN0eC5mb250ID0gJzEycHggbW9ub3NwYWNlJ1xyXG4gICAgY3R4LmZpbGxUZXh0KGBNaW46ICR7bWluV2VpZ2h0LnRvRml4ZWQoMSl9Z2AsIDEwLCBoZWlnaHQgLSAxMClcclxuICAgIGN0eC5maWxsVGV4dChgTWF4OiAke21heFdlaWdodC50b0ZpeGVkKDEpfWdgLCAxMCwgMjApXHJcbiAgICBpZiAoc2NhbGVEYXRhLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgbGF0ZXN0ID0gc2NhbGVEYXRhW3NjYWxlRGF0YS5sZW5ndGggLSAxXVxyXG4gICAgICBjdHguZmlsbFRleHQoYEN1cnJlbnQ6ICR7bGF0ZXN0LndlaWdodH1nICgke2xhdGVzdC5zdGFibGUgPyAnU3RhYmxlJyA6ICdVbnN0YWJsZSd9KWAsIHdpZHRoIC0gMjAwLCAyMClcclxuICAgIH1cclxuICB9LCBbc2NhbGVEYXRhXSlcclxuXHJcbiAgLy8gQ2xlYW51cCBvbiB1bm1vdW50XHJcbiAgdXNlRWZmZWN0KCgpID0+IHtcclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIGlmIChpbnRlcnZhbFJlZi5jdXJyZW50KSB7XHJcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbFJlZi5jdXJyZW50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSwgW10pXHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNCBzcGFjZS15LTZcIj5cclxuICAgICAgey8qIEhlYWRlciAqL31cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlciBweS00XCI+XHJcbiAgICAgICAgPGgxIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCB0ZXh0LXdoaXRlIG1iLTJcIj7impnvuI8gQWR2YW5jZWQgQ2FsaWJyYXRpb248L2gxPlxyXG4gICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDBcIj5IYXJkd2FyZSBzZXJ2aWNpbmcgYW5kIHNlbnNvciBjYWxpYnJhdGlvbjwvcD5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogU2NhbGUgQ2FsaWJyYXRpb24gKi99XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxyXG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSBtYi00XCI+8J+UpyBTY2FsZSBDYWxpYnJhdGlvbjwvaDM+XHJcbiAgICAgICAgXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGFjZS15LTRcIj5cclxuICAgICAgICAgIHsvKiBSZWFsLXRpbWUgR3JhcGggKi99XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0yXCI+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cInRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMFwiPlJlYWwtdGltZSBXZWlnaHQgTW9uaXRvciAoMkh6KTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgb25DbGljaz17dG9nZ2xlTW9uaXRvcmluZ31cclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17YGJ0biB0ZXh0LXNtIHB4LTMgcHktMSAke1xyXG4gICAgICAgICAgICAgICAgICBpc01vbml0b3JpbmcgXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnYmctZXJyb3IvMjAgdGV4dC1lcnJvciBob3ZlcjpiZy1lcnJvci8zMCcgXHJcbiAgICAgICAgICAgICAgICAgICAgOiAnYmctYWNjZW50LXByaW1hcnkvMjAgdGV4dC1hY2NlbnQtcHJpbWFyeSBob3ZlcjpiZy1hY2NlbnQtcHJpbWFyeS8zMCdcclxuICAgICAgICAgICAgICAgIH1gfVxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIHtpc01vbml0b3JpbmcgPyAn4o+577iPIFN0b3AnIDogJ+KWtu+4jyBTdGFydCd9IE1vbml0b3JcclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWxnIHAtMiBib3JkZXIgYm9yZGVyLWdyYXktNjAwXCI+XHJcbiAgICAgICAgICAgICAgPGNhbnZhc1xyXG4gICAgICAgICAgICAgICAgcmVmPXtjYW52YXNSZWZ9XHJcbiAgICAgICAgICAgICAgICB3aWR0aD1cIjYwMFwiXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ9XCIyMDBcIlxyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtNDggcm91bmRlZFwiXHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBtYXhXaWR0aDogJzEwMCUnLCBoZWlnaHQ6ICcyMDBweCcgfX1cclxuICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHtzY2FsZURhdGEubGVuZ3RoID4gMCAmJiAoXHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJncmlkIGdyaWQtY29scy0zIGdhcC00IG10LTIgdGV4dC1zbVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1kYXJrLXN1cmZhY2Ugcm91bmRlZCBwLTIgdGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwXCI+UmF3IEFEQzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtd2hpdGUgZm9udC1tb25vXCI+e3NjYWxlRGF0YVtzY2FsZURhdGEubGVuZ3RoIC0gMV0/LnJhd1ZhbHVlfTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWRhcmstc3VyZmFjZSByb3VuZGVkIHAtMiB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDBcIj5XZWlnaHQ8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWFjY2VudC1wcmltYXJ5IGZvbnQtYm9sZFwiPntzY2FsZURhdGFbc2NhbGVEYXRhLmxlbmd0aCAtIDFdPy53ZWlnaHR9ZzwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLWRhcmstc3VyZmFjZSByb3VuZGVkIHAtMiB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDBcIj5TdGF0dXM8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Bmb250LW1lZGl1bSAke3NjYWxlRGF0YVtzY2FsZURhdGEubGVuZ3RoIC0gMV0/LnN0YWJsZSA/ICd0ZXh0LXN1Y2Nlc3MnIDogJ3RleHQtZXJyb3InfWB9PlxyXG4gICAgICAgICAgICAgICAgICAgIHtzY2FsZURhdGFbc2NhbGVEYXRhLmxlbmd0aCAtIDFdPy5zdGFibGUgPyAnU3RhYmxlJyA6ICdVbnN0YWJsZSd9XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICl9XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7LyogVGFyZSBDb250cm9scyAqL31cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzcGFjZS14LTNcIj5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e2hhbmRsZVRhcmV9XHJcbiAgICAgICAgICAgICAgZGlzYWJsZWQ9e3RhcmVJblByb2dyZXNzIHx8IGxvYWRpbmd9XHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPXtgYnRuLXByaW1hcnkgZmxleC0xICR7dGFyZUluUHJvZ3Jlc3MgPyAnYW5pbWF0ZS1wdWxzZScgOiAnJ31gfVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAge3RhcmVJblByb2dyZXNzID8gJ+KPsyBUYXJpbmcuLi4nIDogJ+Kalu+4jyBUYXJlIFNjYWxlJ31cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJnLWFjY2VudC1zZWNvbmRhcnkvMjAgdGV4dC1hY2NlbnQtc2Vjb25kYXJ5IGhvdmVyOmJnLWFjY2VudC1zZWNvbmRhcnkvMzAgYm9yZGVyIGJvcmRlci1hY2NlbnQtc2Vjb25kYXJ5LzMwXCI+XHJcbiAgICAgICAgICAgICAg8J+TiyBDYWxpYnJhdGUgV2VpZ2h0XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgey8qIFNlcnZvIENvbmZpZ3VyYXRpb24gKi99XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZFwiPlxyXG4gICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LWxnIGZvbnQtc2VtaWJvbGQgdGV4dC13aGl0ZSBtYi00XCI+8J+Om++4jyBTZXJ2byBDb25maWd1cmF0aW9uPC9oMz5cclxuICAgICAgICBcclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNwYWNlLXktNlwiPlxyXG4gICAgICAgICAgey8qIFRhbmsgU2Vydm9zICovfVxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtbWQgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMCBtYi0zXCI+VGFuayBEaXNwZW5zaW5nIFNlcnZvczwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAgICAgICAge3NlcnZvQ29uZmlnLnRhbmtzLm1hcCgodGFuaykgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdiBrZXk9e3RhbmsuaWR9IGNsYXNzTmFtZT1cImJnLWRhcmstc3VyZmFjZSByb3VuZGVkLWxnIHAtNFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktYmV0d2VlbiBtYi0zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZSBmb250LW1lZGl1bVwiPnt0YW5rLm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzcGFjZS14LTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGVzdFNlcnZvKCd0YW5rJywgdGFuay5pZCwgJ2lkbGUnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJnLWdyYXktNjAwIGhvdmVyOmJnLWdyYXktNTAwIHRleHQteHMgcHgtMiBweS0xXCJcclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAg8J+UhCBUZXN0IElkbGVcclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0ZXN0U2Vydm8oJ3RhbmsnLCB0YW5rLmlkLCAnZGlzcGVuc2UnKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnRuIGJnLWFjY2VudC1wcmltYXJ5LzIwIHRleHQtYWNjZW50LXByaW1hcnkgaG92ZXI6YmctYWNjZW50LXByaW1hcnkvMzAgdGV4dC14cyBweC0yIHB5LTFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICDwn42977iPIFRlc3QgRGlzcGVuc2VcclxuICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gdGV4dC1ncmF5LTQwMCBtYi0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBJZGxlIFBvc2l0aW9uIFBXTSAoNTAwLTI1MDDOvHMpXHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtM1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heD1cIjI1MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGFuay5pZGxlUHdtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVNlcnZvQ29uZmlnKCd0YW5rJywgdGFuay5pZCwgJ2lkbGVQd20nLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBoLTIgYmctZGFyay1iZyByb3VuZGVkLWxnIGFwcGVhcmFuY2Utbm9uZSBjdXJzb3ItcG9pbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17dGFuay5pZGxlUHdtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVNlcnZvQ29uZmlnKCd0YW5rJywgdGFuay5pZCwgJ2lkbGVQd20nLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heD1cIjI1MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dCB3LTIwIHRleHQtY2VudGVyIHRleHQtc21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHMgdGV4dC1ncmF5LTQwMFwiPs68czwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICB7LyogSG9wcGVyIFNlcnZvICovfVxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGg0IGNsYXNzTmFtZT1cInRleHQtbWQgZm9udC1tZWRpdW0gdGV4dC1ncmF5LTMwMCBtYi0zXCI+SG9wcGVyIFRyYXAgRG9vciBTZXJ2bzwvaDQ+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctZGFyay1zdXJmYWNlIHJvdW5kZWQtbGcgcC00IHNwYWNlLXktNFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWJldHdlZW4gaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtXCI+TWFpbiBIb3BwZXIgRG9vcjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBzcGFjZS14LTJcIj5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRlc3RTZXJ2bygnaG9wcGVyJywgMCwgJ2Nsb3NlZCcpfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJ0biBiZy1lcnJvci8yMCB0ZXh0LWVycm9yIGhvdmVyOmJnLWVycm9yLzMwIHRleHQteHMgcHgtMiBweS0xXCJcclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIPCflJIgVGVzdCBDbG9zZVxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRlc3RTZXJ2bygnaG9wcGVyJywgMCwgJ29wZW4nKX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4gYmctc3VjY2Vzcy8yMCB0ZXh0LXN1Y2Nlc3MgaG92ZXI6Ymctc3VjY2Vzcy8zMCB0ZXh0LXhzIHB4LTIgcHktMVwiXHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICDwn5STIFRlc3QgT3BlblxyXG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTIgZ2FwLTRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9XCJibG9jayB0ZXh0LXNtIHRleHQtZ3JheS00MDAgbWItMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIENsb3NlZCBQb3NpdGlvbiBQV01cclxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCI1MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2Vydm9Db25maWcuaG9wcGVyLmNsb3NlZFB3bX1cclxuICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXsoZSkgPT4gdXBkYXRlU2Vydm9Db25maWcoJ2hvcHBlcicsIDAsICdjbG9zZWRQd20nLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJmbGV4LTEgaC0yIGJnLWRhcmstYmcgcm91bmRlZC1sZyBhcHBlYXJhbmNlLW5vbmUgY3Vyc29yLXBvaW50ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICB0eXBlPVwibnVtYmVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHZhbHVlPXtzZXJ2b0NvbmZpZy5ob3BwZXIuY2xvc2VkUHdtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVTZXJ2b0NvbmZpZygnaG9wcGVyJywgMCwgJ2Nsb3NlZFB3bScsIGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgIG1pbj1cIjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBtYXg9XCIyNTAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImlucHV0IHctMjAgdGV4dC1jZW50ZXIgdGV4dC1zbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXhzIHRleHQtZ3JheS00MDBcIj7OvHM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtc20gdGV4dC1ncmF5LTQwMCBtYi0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgT3BlbiBQb3NpdGlvbiBQV01cclxuICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBzcGFjZS14LTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJyYW5nZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCI1MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17c2Vydm9Db25maWcuaG9wcGVyLm9wZW5Qd219XHJcbiAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17KGUpID0+IHVwZGF0ZVNlcnZvQ29uZmlnKCdob3BwZXInLCAwLCAnb3BlblB3bScsIGUudGFyZ2V0LnZhbHVlKX1cclxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImZsZXgtMSBoLTIgYmctZGFyay1iZyByb3VuZGVkLWxnIGFwcGVhcmFuY2Utbm9uZSBjdXJzb3ItcG9pbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXRcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJudW1iZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU9e3NlcnZvQ29uZmlnLmhvcHBlci5vcGVuUHdtfVxyXG4gICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhlKSA9PiB1cGRhdGVTZXJ2b0NvbmZpZygnaG9wcGVyJywgMCwgJ29wZW5Qd20nLCBlLnRhcmdldC52YWx1ZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICBtaW49XCI1MDBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgbWF4PVwiMjUwMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dCB3LTIwIHRleHQtY2VudGVyIHRleHQtc21cIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwXCI+zrxzPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIHsvKiBTYXZlIENvbmZpZ3VyYXRpb24gKi99XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC0zIHB0LTRcIj5cclxuICAgICAgICAgICAgPGJ1dHRvblxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3NhdmVDYWxpYnJhdGlvbn1cclxuICAgICAgICAgICAgICBkaXNhYmxlZD17bG9hZGluZ31cclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJidG4tcHJpbWFyeSBmbGV4LTFcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAg8J+SviBTYXZlIENhbGlicmF0aW9uXHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBiZy1ncmF5LTYwMCBob3ZlcjpiZy1ncmF5LTUwMFwiPlxyXG4gICAgICAgICAgICAgIPCflIQgUmVzZXQgdG8gRGVmYXVsdHNcclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcblxyXG4gICAgICB7LyogU2FmZXR5IFdhcm5pbmcgKi99XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBiZy13YXJuaW5nLzEwIGJvcmRlci13YXJuaW5nLzIwXCI+XHJcbiAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtd2FybmluZyBmb250LXNlbWlib2xkIG1iLTJcIj7imqDvuI8gU2FmZXR5IE5vdGljZTwvaDM+XHJcbiAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1zbSB0ZXh0LWdyYXktMzAwIG1iLTNcIj5cclxuICAgICAgICAgIE9ubHkgcXVhbGlmaWVkIHRlY2huaWNpYW5zIHNob3VsZCBwZXJmb3JtIHNlcnZvIGNhbGlicmF0aW9uLiBJbmNvcnJlY3QgUFdNIHZhbHVlcyBjYW4gZGFtYWdlIHNlcnZvcyBvciBjYXVzZSBtZWNoYW5pY2FsIGZhaWx1cmVzLlxyXG4gICAgICAgIDwvcD5cclxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwidGV4dC14cyB0ZXh0LWdyYXktNDAwIHNwYWNlLXktMVwiPlxyXG4gICAgICAgICAgPGxpPuKAoiBBbHdheXMgdGVzdCBzZXJ2byBtb3ZlbWVudHMgYmVmb3JlIHNhdmluZyBjb25maWd1cmF0aW9uPC9saT5cclxuICAgICAgICAgIDxsaT7igKIgUFdNIHJhbmdlOiA1MDAtMjUwMM68cyAodHlwaWNhbCBzZXJ2byBzYWZlIHJhbmdlKTwvbGk+XHJcbiAgICAgICAgICA8bGk+4oCiIEVuc3VyZSBtZWNoYW5pY2FsIGNsZWFyYW5jZXMgYmVmb3JlIHRlc3Rpbmc8L2xpPlxyXG4gICAgICAgICAgPGxpPuKAoiBTdG9wIGFsbCBvcGVyYXRpb25zIGJlZm9yZSBjYWxpYnJhdGluZzwvbGk+XHJcbiAgICAgICAgPC91bD5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICApXHJcbn0iLCJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3ByZWFjdC9ob29rcydcbmltcG9ydCBSb3V0ZXIgZnJvbSAncHJlYWN0LXJvdXRlcidcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJy4vY29tcG9uZW50cy9IZWFkZXInXG5pbXBvcnQgeyBOYXZpZ2F0aW9uIH0gZnJvbSAnLi9jb21wb25lbnRzL05hdmlnYXRpb24nXG5pbXBvcnQgeyBEYXNoYm9hcmQgfSBmcm9tICcuL3BhZ2VzL0Rhc2hib2FyZCdcbmltcG9ydCB7IFRhbmtzIH0gZnJvbSAnLi9wYWdlcy9UYW5rcydcbmltcG9ydCB7IFJlY2lwZXMgfSBmcm9tICcuL3BhZ2VzL1JlY2lwZXMnXG5pbXBvcnQgeyBTZXR0aW5ncyB9IGZyb20gJy4vcGFnZXMvU2V0dGluZ3MnXG5pbXBvcnQgeyBDYWxpYnJhdGlvbiB9IGZyb20gJy4vcGFnZXMvQ2FsaWJyYXRpb24nXG5pbXBvcnQgeyBBcGlQcm92aWRlciB9IGZyb20gJy4vaG9va3MvdXNlQXBpJ1xuXG5leHBvcnQgZnVuY3Rpb24gQXBwKCkge1xuICBjb25zdCBbY3VycmVudFJvdXRlLCBzZXRDdXJyZW50Um91dGVdID0gdXNlU3RhdGUoJy8nKVxuXG4gIGNvbnN0IGhhbmRsZVJvdXRlID0gKGUpID0+IHtcbiAgICBzZXRDdXJyZW50Um91dGUoZS51cmwpXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxBcGlQcm92aWRlcj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWluLWgtc2NyZWVuIGJnLWRhcmstYmcgdGV4dC13aGl0ZVwiPlxuICAgICAgICA8SGVhZGVyIC8+XG4gICAgICAgIFxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJwYi0yMFwiPiB7LyogQm90dG9tIHBhZGRpbmcgZm9yIG5hdmlnYXRpb24gKi99XG4gICAgICAgICAgPFJvdXRlciBvbkNoYW5nZT17aGFuZGxlUm91dGV9PlxuICAgICAgICAgICAgPERhc2hib2FyZCBwYXRoPVwiL1wiIC8+XG4gICAgICAgICAgICA8VGFua3MgcGF0aD1cIi90YW5rc1wiIC8+XG4gICAgICAgICAgICA8UmVjaXBlcyBwYXRoPVwiL3JlY2lwZXNcIiAvPlxuICAgICAgICAgICAgPFNldHRpbmdzIHBhdGg9XCIvc2V0dGluZ3NcIiAvPlxuICAgICAgICAgICAgPENhbGlicmF0aW9uIHBhdGg9XCIvc2V0dGluZ3MvY2FsaWJyYXRpb25cIiAvPlxuICAgICAgICAgIDwvUm91dGVyPlxuICAgICAgICA8L21haW4+XG4gICAgICAgIFxuICAgICAgICA8TmF2aWdhdGlvbiBjdXJyZW50Um91dGU9e2N1cnJlbnRSb3V0ZX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvQXBpUHJvdmlkZXI+XG4gIClcbn0iLCJpbXBvcnQgeyByZW5kZXIgfSBmcm9tICdwcmVhY3QnXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL0FwcC5qc3gnXG5pbXBvcnQgJy4vaW5kZXguY3NzJ1xuXG5yZW5kZXIoPEFwcCAvPiwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2FwcCcpKSJdLCJuYW1lcyI6WyJsIiwidSIsImkiLCJyIiwibyIsImUiLCJmIiwiYyIsInMiLCJhIiwiaCIsInAiLCJ2IiwieSIsInciLCJkIiwibiIsImciLCJ0IiwibSIsImsiLCJ4IiwiQyIsIk0iLCIkIiwieiIsIkkiLCJfIiwicSIsIkEiLCJCIiwiVCIsImoiLCJiIiwiUyIsIlAiLCJIIiwiTCIsIkQiLCJVIiwiY3JlYXRlQ29udGV4dCIsInVzZVN0YXRlIiwidXNlQ2FsbGJhY2siLCJ1c2VDb250ZXh0IiwianN4cyIsImpzeCIsInJvdXRlIiwiaGlzdG9yeSIsIkZyYWdtZW50IiwiY2VudGVyWCIsImNlbnRlclkiLCJyYWRpdXMiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJSb3V0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LElBQUVPLEVBQUMsR0FBRSxJQUFFO0FBQUUsTUFBSWQsTUFBRyxJQUFFYyxHQUFFLEtBQUs7QUFBSSxFQUFBZCxPQUFJLE1BQUksS0FBR0EsR0FBRSxNQUFJLENBQUEsR0FBRyxFQUFFLE1BQUksQ0FBQSxHQUFHQSxHQUFFLEdBQUcsUUFBUSxTQUFTYyxJQUFFO0FBQUMsSUFBQUEsR0FBRSxRQUFNQSxHQUFFLEtBQUdBLEdBQUUsTUFBS0EsR0FBRSxJQUFFQSxHQUFFLE1BQUk7QUFBQSxFQUFNLENBQUMsTUFBSWQsR0FBRSxJQUFJLFFBQVEsQ0FBQyxHQUFFQSxHQUFFLElBQUksUUFBUSxDQUFDLEdBQUVBLEdBQUUsTUFBSSxDQUFBLEdBQUcsSUFBRSxLQUFJLElBQUU7QUFBQyxHQUFFSyxJQUFFLFNBQU8sU0FBU1MsSUFBRTtBQUFDSixTQUFHQSxJQUFFSSxFQUFDO0FBQUUsTUFBSUUsS0FBRUYsR0FBRTtBQUFJLEVBQUFFLE1BQUdBLEdBQUUsUUFBTUEsR0FBRSxJQUFJLElBQUksV0FBUyxNQUFJLEVBQUUsS0FBS0EsRUFBQyxLQUFHLE1BQUlYLElBQUUsMkJBQXlCLElBQUVBLElBQUUsMEJBQXdCTyxLQUFHLENBQUMsSUFBR0ksR0FBRSxJQUFJLEdBQUcsUUFBUSxTQUFTRixJQUFFO0FBQUMsSUFBQUEsR0FBRSxNQUFJQSxHQUFFLE1BQUlBLEdBQUUsSUFBR0EsR0FBRSxJQUFFO0FBQUEsRUFBTSxDQUFDLElBQUcsSUFBRSxJQUFFO0FBQUksR0FBRVQsSUFBRSxNQUFJLFNBQVNTLElBQUVFLElBQUU7QUFBQyxFQUFBQSxHQUFFLEtBQUssU0FBU0YsSUFBRTtBQUFDLFFBQUc7QUFBQyxNQUFBQSxHQUFFLElBQUksUUFBUSxDQUFDLEdBQUVBLEdBQUUsTUFBSUEsR0FBRSxJQUFJLE9BQU8sU0FBU0EsSUFBRTtBQUFDLGVBQU0sQ0FBQ0EsR0FBRSxNQUFJLEVBQUVBLEVBQUM7QUFBQSxNQUFDLENBQUM7QUFBQSxJQUFDLFNBQU9iLElBQUU7QUFBQyxNQUFBZSxHQUFFLEtBQUssU0FBU0YsSUFBRTtB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QSxRQUFBLEVBQUEsQ0FDRjtBQUFBLE1BQUEsRUFBQSxDQUNGO0FBQUEsSUFBQSxHQUNGO0FBQUEsSUFHQUQsb0JBQUMsT0FBQSxFQUFJLFdBQVUsd0NBQ2IsVUFBQTtBQUFBLE1BQUFDLG9CQUFDLE1BQUEsRUFBRyxXQUFVLG1DQUFrQyxVQUFBLG9CQUFnQjtBQUFBLE1BQ2hFQSxvQkFBQyxLQUFBLEVBQUUsV0FBVSw4QkFBNkIsVUFBQSxxSUFFMUM7QUFBQSxNQUNBRCxvQkFBQyxNQUFBLEVBQUcsV0FBVSxtQ0FDWixVQUFBO0FBQUEsUUFBQUMsb0JBQUMsUUFBRyxVQUFBLDREQUFBLENBQXlEO0FBQUEsUUFDN0RBLG9CQUFDLFFBQUcsVUFBQSxxREFBQSxDQUFrRDtBQUFBLFFBQ3REQSxvQkFBQyxRQUFHLFVBQUEsZ0RBQUEsQ0FBNkM7QUFBQSxRQUNqREEsb0JBQUMsUUFBRyxVQUFBLDJDQUFBLENBQXdDO0FBQUEsTUFBQSxFQUFBLENBQzlDO0FBQUEsSUFBQSxFQUFBLENBQ0Y7QUFBQSxFQUFBLEdBQ0Y7QUFFSjtBQ3RhTyxTQUFTLE1BQU07QUFDcEIsUUFBTSxDQUFDLGNBQWMsZUFBZSxJQUFJSixJQUFTLEdBQUc7QUFFcEQsUUFBTSxjQUFjLENBQUNwQyxPQUFNO0FBQ3pCLG9CQUFnQkEsR0FBRSxHQUFHO0FBQUEsRUFBQTtBQUd2QixTQUNFd0Msb0JBQUMsYUFBQSxFQUNDLFVBQUFELG9CQUFDLE9BQUEsRUFBSSxXQUFVLHNDQUNiLFVBQUE7QUFBQSxJQUFBQyxvQkFBQyxRQUFBLEVBQU87QUFBQSxJQUVSRCxvQkFBQyxRQUFBLEVBQUssV0FBVSxTQUFRLFVBQUE7QUFBQSxNQUFBO0FBQUEsTUFDdEJBLG9CQUFDVSxHQUFBLEVBQU8sVUFBVSxhQUNoQixVQUFBO0FBQUEsUUFBQVQsb0JBQUMsV0FBQSxFQUFVLE1BQUssSUFBQSxDQUFJO0FBQUEsUUFDcEJBLG9CQUFDLE9BQUEsRUFBTSxNQUFLLFNBQUEsQ0FBUztBQUFBLFFBQ3JCQSxvQkFBQyxTQUFBLEVBQVEsTUFBSyxXQUFBLENBQVc7QUFBQSxRQUN6QkEsb0JBQUMsVUFBQSxFQUFTLE1BQUssWUFBQSxDQUFZO0FBQUEsUUFDM0JBLG9CQUFDLGFBQUEsRUFBWSxNQUFLLHdCQUFBLENBQXdCO0FBQUEsTUFBQSxFQUFBLENBQzVDO0FBQUEsSUFBQSxHQUNGO0FBQUEsSUFFQUEsb0JBQUMsY0FBVyxhQUFBLENBQTRCO0FBQUEsRUFBQSxFQUFBLENBQzFDLEVBQUEsQ0FDRjtBQUVKO0FDakNBVSxzQkFBUSxLQUFBLENBQUEsQ0FBSSxHQUFJLFNBQVMsZUFBZSxLQUFLLENBQUM7IiwieF9nb29nbGVfaWdub3JlTGlzdCI6WzAsMSwyLDNdfQ==
