/** @license React v16.7.0
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict'
;(function (L, q) {
  'object' === typeof exports && 'undefined' !== typeof module
    ? (module.exports = q())
    : 'function' === typeof define && define.amd
    ? define(q)
    : (L.React = q())
})(this, function () {
  function L(a, b, d, f, p, c, e, h) {
    if (!a) {
      a = void 0
      if (void 0 === b)
        a = Error(
          'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
        )
      else {
        var m = [d, f, p, c, e, h],
          ra = 0
        a = Error(
          b.replace(/%s/g, function () {
            return m[ra++]
          })
        )
        a.name = 'Invariant Violation'
      }
      a.framesToPop = 1
      throw a
    }
  }
  function q(a) {
    for (
      var b = arguments.length - 1,
        d = 'https://reactjs.org/docs/error-decoder.html?invariant=' + a,
        f = 0;
      f < b;
      f++
    )
      d += '&args[]=' + encodeURIComponent(arguments[f + 1])
    L(
      !1,
      'Minified React error #' +
        a +
        '; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ',
      d
    )
  }
  function r(a, b, d) {
    this.props = a
    this.context = b
    this.refs = aa
    this.updater = d || ba
  }
  function ca() {}
  function M(a, b, d) {
    this.props = a
    this.context = b
    this.refs = aa
    this.updater = d || ba
  }
  function t() {
    if (!w) {
      var a = c.expirationTime
      B ? N() : (B = !0)
      C(sa, a)
    }
  }
  function O() {
    var a = c,
      b = c.next
    if (c === b) c = null
    else {
      var d = c.previous
      c = d.next = b
      b.previous = d
    }
    a.next = a.previous = null
    d = a.callback
    b = a.expirationTime
    a = a.priorityLevel
    var f = g,
      p = D
    g = a
    D = b
    try {
      var m = d()
    } finally {
      ;(g = f), (D = p)
    }
    if ('function' === typeof m)
      if (
        ((m = {
          callback: m,
          priorityLevel: a,
          expirationTime: b,
          next: null,
          previous: null,
        }),
        null === c)
      )
        c = m.next = m.previous = m
      else {
        d = null
        a = c
        do {
          if (a.expirationTime >= b) {
            d = a
            break
          }
          a = a.next
        } while (a !== c)
        null === d ? (d = c) : d === c && ((c = m), t())
        b = d.previous
        b.next = d.previous = m
        m.next = d
        m.previous = b
      }
  }
  function P() {
    if (-1 === l && null !== c && 1 === c.priorityLevel) {
      w = !0
      try {
        do O()
        while (null !== c && 1 === c.priorityLevel)
      } finally {
        ;(w = !1), null !== c ? t() : (B = !1)
      }
    }
  }
  function sa(a) {
    w = !0
    var b = E
    E = a
    try {
      if (a)
        for (; null !== c; ) {
          var d = k()
          if (c.expirationTime <= d) {
            do O()
            while (null !== c && c.expirationTime <= d)
          } else break
        }
      else if (null !== c) {
        do O()
        while (null !== c && !F())
      }
    } finally {
      ;(w = !1), (E = b), null !== c ? t() : (B = !1), P()
    }
  }
  function da(a, b, d) {
    var f = void 0,
      p = {},
      c = null,
      e = null
    if (null != b)
      for (f in (void 0 !== b.ref && (e = b.ref),
      void 0 !== b.key && (c = '' + b.key),
      b))
        ea.call(b, f) && !fa.hasOwnProperty(f) && (p[f] = b[f])
    var h = arguments.length - 2
    if (1 === h) p.children = d
    else if (1 < h) {
      for (var g = Array(h), k = 0; k < h; k++) g[k] = arguments[k + 2]
      p.children = g
    }
    if (a && a.defaultProps)
      for (f in ((h = a.defaultProps), h)) void 0 === p[f] && (p[f] = h[f])
    return { $$typeof: x, type: a, key: c, ref: e, props: p, _owner: Q.current }
  }
  function ta(a, b) {
    return {
      $$typeof: x,
      type: a.type,
      key: b,
      ref: a.ref,
      props: a.props,
      _owner: a._owner,
    }
  }
  function R(a) {
    return 'object' === typeof a && null !== a && a.$$typeof === x
  }
  function ua(a) {
    var b = { '=': '=0', ':': '=2' }
    return (
      '$' +
      ('' + a).replace(/[=:]/g, function (a) {
        return b[a]
      })
    )
  }
  function ha(a, b, d, f) {
    if (G.length) {
      var c = G.pop()
      c.result = a
      c.keyPrefix = b
      c.func = d
      c.context = f
      c.count = 0
      return c
    }
    return { result: a, keyPrefix: b, func: d, context: f, count: 0 }
  }
  function ia(a) {
    a.result = null
    a.keyPrefix = null
    a.func = null
    a.context = null
    a.count = 0
    10 > G.length && G.push(a)
  }
  function S(a, b, d, f) {
    var c = typeof a
    if ('undefined' === c || 'boolean' === c) a = null
    var e = !1
    if (null === a) e = !0
    else
      switch (c) {
        case 'string':
        case 'number':
          e = !0
          break
        case 'object':
          switch (a.$$typeof) {
            case x:
            case va:
              e = !0
          }
      }
    if (e) return d(f, a, '' === b ? '.' + T(a, 0) : b), 1
    e = 0
    b = '' === b ? '.' : b + ':'
    if (Array.isArray(a))
      for (var g = 0; g < a.length; g++) {
        c = a[g]
        var h = b + T(c, g)
        e += S(c, h, d, f)
      }
    else if (
      (null === a || 'object' !== typeof a
        ? (h = null)
        : ((h = (ja && a[ja]) || a['@@iterator']),
          (h = 'function' === typeof h ? h : null)),
      'function' === typeof h)
    )
      for (a = h.call(a), g = 0; !(c = a.next()).done; )
        (c = c.value), (h = b + T(c, g++)), (e += S(c, h, d, f))
    else
      'object' === c &&
        ((d = '' + a),
        q(
          '31',
          '[object Object]' === d
            ? 'object with keys {' + Object.keys(a).join(', ') + '}'
            : d,
          ''
        ))
    return e
  }
  function U(a, b, d) {
    return null == a ? 0 : S(a, '', b, d)
  }
  function T(a, b) {
    return 'object' === typeof a && null !== a && null != a.key
      ? ua(a.key)
      : b.toString(36)
  }
  function wa(a, b, d) {
    a.func.call(a.context, b, a.count++)
  }
  function xa(a, b, d) {
    var f = a.result,
      c = a.keyPrefix
    a = a.func.call(a.context, b, a.count++)
    Array.isArray(a)
      ? V(a, f, d, function (a) {
          return a
        })
      : null != a &&
        (R(a) &&
          (a = ta(
            a,
            c +
              (!a.key || (b && b.key === a.key)
                ? ''
                : ('' + a.key).replace(ka, '$&/') + '/') +
              d
          )),
        f.push(a))
  }
  function V(a, b, d, f, c) {
    var e = ''
    null != d && (e = ('' + d).replace(ka, '$&/') + '/')
    b = ha(b, e, f, c)
    U(a, xa, b)
    ia(b)
  }
  var e = 'function' === typeof Symbol && Symbol.for,
    x = e ? Symbol.for('react.element') : 60103,
    va = e ? Symbol.for('react.portal') : 60106,
    n = e ? Symbol.for('react.fragment') : 60107,
    W = e ? Symbol.for('react.strict_mode') : 60108,
    ya = e ? Symbol.for('react.profiler') : 60114,
    za = e ? Symbol.for('react.provider') : 60109,
    Aa = e ? Symbol.for('react.context') : 60110,
    Ba = e ? Symbol.for('react.concurrent_mode') : 60111,
    Ca = e ? Symbol.for('react.forward_ref') : 60112,
    Da = e ? Symbol.for('react.suspense') : 60113,
    Ea = e ? Symbol.for('react.memo') : 60115,
    Fa = e ? Symbol.for('react.lazy') : 60116,
    ja = 'function' === typeof Symbol && Symbol.iterator,
    la = Object.getOwnPropertySymbols,
    Ga = Object.prototype.hasOwnProperty,
    Ha = Object.prototype.propertyIsEnumerable,
    H = (function () {
      try {
        if (!Object.assign) return !1
        var a = new String('abc')
        a[5] = 'de'
        if ('5' === Object.getOwnPropertyNames(a)[0]) return !1
        var b = {}
        for (a = 0; 10 > a; a++) b['_' + String.fromCharCode(a)] = a
        if (
          '0123456789' !==
          Object.getOwnPropertyNames(b)
            .map(function (a) {
              return b[a]
            })
            .join('')
        )
          return !1
        var d = {}
        'abcdefghijklmnopqrst'.split('').forEach(function (a) {
          d[a] = a
        })
        return 'abcdefghijklmnopqrst' !==
          Object.keys(Object.assign({}, d)).join('')
          ? !1
          : !0
      } catch (f) {
        return !1
      }
    })()
      ? Object.assign
      : function (a, b) {
          if (null === a || void 0 === a)
            throw new TypeError(
              'Object.assign cannot be called with null or undefined'
            )
          var d = Object(a)
          for (var c, e = 1; e < arguments.length; e++) {
            var g = Object(arguments[e])
            for (var k in g) Ga.call(g, k) && (d[k] = g[k])
            if (la) {
              c = la(g)
              for (var h = 0; h < c.length; h++)
                Ha.call(g, c[h]) && (d[c[h]] = g[c[h]])
            }
          }
          return d
        },
    ba = {
      isMounted: function (a) {
        return !1
      },
      enqueueForceUpdate: function (a, b, d) {},
      enqueueReplaceState: function (a, b, d, c) {},
      enqueueSetState: function (a, b, d, c) {},
    },
    aa = {}
  r.prototype.isReactComponent = {}
  r.prototype.setState = function (a, b) {
    'object' !== typeof a && 'function' !== typeof a && null != a
      ? q('85')
      : void 0
    this.updater.enqueueSetState(this, a, b, 'setState')
  }
  r.prototype.forceUpdate = function (a) {
    this.updater.enqueueForceUpdate(this, a, 'forceUpdate')
  }
  ca.prototype = r.prototype
  e = M.prototype = new ca()
  e.constructor = M
  H(e, r.prototype)
  e.isPureReactComponent = !0
  var c = null,
    E = !1,
    g = 3,
    l = -1,
    D = -1,
    w = !1,
    B = !1,
    Ia = Date,
    Ja = 'function' === typeof setTimeout ? setTimeout : void 0,
    Ka = 'function' === typeof clearTimeout ? clearTimeout : void 0,
    ma =
      'function' === typeof requestAnimationFrame
        ? requestAnimationFrame
        : void 0,
    na =
      'function' === typeof cancelAnimationFrame
        ? cancelAnimationFrame
        : void 0,
    oa,
    pa,
    X = function (a) {
      oa = ma(function (b) {
        Ka(pa)
        a(b)
      })
      pa = Ja(function () {
        na(oa)
        a(k())
      }, 100)
    }
  if (
    'object' === typeof performance &&
    'function' === typeof performance.now
  ) {
    var La = performance
    var k = function () {
      return La.now()
    }
  } else
    k = function () {
      return Ia.now()
    }
  e = null
  'undefined' !== typeof window
    ? (e = window)
    : 'undefined' !== typeof global && (e = global)
  if (e && e._schedMock) {
    e = e._schedMock
    var C = e[0]
    var N = e[1]
    var F = e[2]
    k = e[3]
  } else if (
    'undefined' === typeof window ||
    'function' !== typeof MessageChannel
  ) {
    var u = null,
      Ma = function (a) {
        if (null !== u)
          try {
            u(a)
          } finally {
            u = null
          }
      }
    C = function (a, b) {
      null !== u ? setTimeout(C, 0, a) : ((u = a), setTimeout(Ma, 0, !1))
    }
    N = function () {
      u = null
    }
    F = function () {
      return !1
    }
  } else {
    'undefined' !== typeof console &&
      ('function' !== typeof ma &&
        console.error(
          "This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
        ),
      'function' !== typeof na &&
        console.error(
          "This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"
        ))
    var v = null,
      I = !1,
      y = -1,
      z = !1,
      Y = !1,
      J = 0,
      K = 33,
      A = 33
    F = function () {
      return J <= k()
    }
    e = new MessageChannel()
    var qa = e.port2
    e.port1.onmessage = function (a) {
      I = !1
      a = v
      var b = y
      v = null
      y = -1
      var d = k(),
        c = !1
      if (0 >= J - d)
        if (-1 !== b && b <= d) c = !0
        else {
          z || ((z = !0), X(Z))
          v = a
          y = b
          return
        }
      if (null !== a) {
        Y = !0
        try {
          a(c)
        } finally {
          Y = !1
        }
      }
    }
    var Z = function (a) {
      if (null !== v) {
        X(Z)
        var b = a - J + A
        b < A && K < A ? (8 > b && (b = 8), (A = b < K ? K : b)) : (K = b)
        J = a + A
        I || ((I = !0), qa.postMessage(void 0))
      } else z = !1
    }
    C = function (a, b) {
      v = a
      y = b
      Y || 0 > b ? qa.postMessage(void 0) : z || ((z = !0), X(Z))
    }
    N = function () {
      v = null
      I = !1
      y = -1
    }
  }
  var Na = 0,
    Q = { current: null, currentDispatcher: null }
  e = { ReactCurrentOwner: Q, assign: H }
  H(e, {
    Scheduler: {
      unstable_cancelCallback: function (a) {
        var b = a.next
        if (null !== b) {
          if (b === a) c = null
          else {
            a === c && (c = b)
            var d = a.previous
            d.next = b
            b.previous = d
          }
          a.next = a.previous = null
        }
      },
      unstable_shouldYield: function () {
        return !E && ((null !== c && c.expirationTime < D) || F())
      },
      unstable_now: k,
      unstable_scheduleCallback: function (a, b) {
        var d = -1 !== l ? l : k()
        if (
          'object' === typeof b &&
          null !== b &&
          'number' === typeof b.timeout
        )
          b = d + b.timeout
        else
          switch (g) {
            case 1:
              b = d + -1
              break
            case 2:
              b = d + 250
              break
            case 5:
              b = d + 1073741823
              break
            case 4:
              b = d + 1e4
              break
            default:
              b = d + 5e3
          }
        a = {
          callback: a,
          priorityLevel: g,
          expirationTime: b,
          next: null,
          previous: null,
        }
        if (null === c) (c = a.next = a.previous = a), t()
        else {
          d = null
          var f = c
          do {
            if (f.expirationTime > b) {
              d = f
              break
            }
            f = f.next
          } while (f !== c)
          null === d ? (d = c) : d === c && ((c = a), t())
          b = d.previous
          b.next = d.previous = a
          a.next = d
          a.previous = b
        }
        return a
      },
      unstable_runWithPriority: function (a, b) {
        switch (a) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
            break
          default:
            a = 3
        }
        var d = g,
          c = l
        g = a
        l = k()
        try {
          return b()
        } finally {
          ;(g = d), (l = c), P()
        }
      },
      unstable_wrapCallback: function (a) {
        var b = g
        return function () {
          var d = g,
            c = l
          g = b
          l = k()
          try {
            return a.apply(this, arguments)
          } finally {
            ;(g = d), (l = c), P()
          }
        }
      },
      unstable_getFirstCallbackNode: function () {
        return c
      },
      unstable_pauseExecution: function () {},
      unstable_continueExecution: function () {
        null !== c && t()
      },
      unstable_getCurrentPriorityLevel: function () {
        return g
      },
    },
    SchedulerTracing: {
      __interactionsRef: null,
      __subscriberRef: null,
      unstable_clear: function (a) {
        return a()
      },
      unstable_getCurrent: function () {
        return null
      },
      unstable_getThreadID: function () {
        return ++Na
      },
      unstable_subscribe: function (a) {},
      unstable_trace: function (a, b, d) {
        return d()
      },
      unstable_unsubscribe: function (a) {},
      unstable_wrap: function (a) {
        return a
      },
    },
  })
  var ea = Object.prototype.hasOwnProperty,
    fa = { key: !0, ref: !0, __self: !0, __source: !0 },
    ka = /\/+/g,
    G = []
  n = {
    Children: {
      map: function (a, b, d) {
        if (null == a) return a
        var c = []
        V(a, c, null, b, d)
        return c
      },
      forEach: function (a, b, d) {
        if (null == a) return a
        b = ha(null, null, b, d)
        U(a, wa, b)
        ia(b)
      },
      count: function (a) {
        return U(
          a,
          function () {
            return null
          },
          null
        )
      },
      toArray: function (a) {
        var b = []
        V(a, b, null, function (a) {
          return a
        })
        return b
      },
      only: function (a) {
        R(a) ? void 0 : q('143')
        return a
      },
    },
    createRef: function () {
      return { current: null }
    },
    Component: r,
    PureComponent: M,
    createContext: function (a, b) {
      void 0 === b && (b = null)
      a = {
        $$typeof: Aa,
        _calculateChangedBits: b,
        _currentValue: a,
        _currentValue2: a,
        _threadCount: 0,
        Provider: null,
        Consumer: null,
      }
      a.Provider = { $$typeof: za, _context: a }
      return (a.Consumer = a)
    },
    forwardRef: function (a) {
      return { $$typeof: Ca, render: a }
    },
    lazy: function (a) {
      return { $$typeof: Fa, _ctor: a, _status: -1, _result: null }
    },
    memo: function (a, b) {
      return { $$typeof: Ea, type: a, compare: void 0 === b ? null : b }
    },
    Fragment: n,
    StrictMode: W,
    Suspense: Da,
    createElement: da,
    cloneElement: function (a, b, d) {
      null === a || void 0 === a ? q('267', a) : void 0
      var c = void 0,
        e = H({}, a.props),
        g = a.key,
        k = a.ref,
        h = a._owner
      if (null != b) {
        void 0 !== b.ref && ((k = b.ref), (h = Q.current))
        void 0 !== b.key && (g = '' + b.key)
        var l = void 0
        a.type && a.type.defaultProps && (l = a.type.defaultProps)
        for (c in b)
          ea.call(b, c) &&
            !fa.hasOwnProperty(c) &&
            (e[c] = void 0 === b[c] && void 0 !== l ? l[c] : b[c])
      }
      c = arguments.length - 2
      if (1 === c) e.children = d
      else if (1 < c) {
        l = Array(c)
        for (var n = 0; n < c; n++) l[n] = arguments[n + 2]
        e.children = l
      }
      return { $$typeof: x, type: a.type, key: g, ref: k, props: e, _owner: h }
    },
    createFactory: function (a) {
      var b = da.bind(null, a)
      b.type = a
      return b
    },
    isValidElement: R,
    version: '16.7.0',
    unstable_ConcurrentMode: Ba,
    unstable_Profiler: ya,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: e,
  }
  n = ((W = { default: n }), n) || W
  return n.default || n
})
