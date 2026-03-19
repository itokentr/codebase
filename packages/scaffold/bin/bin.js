#!/usr/bin/env node --enable-source-maps
import { createRequire as rgf29f } from 'node:module';
const require = rgf29f(import.meta.url);
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
var Si = Object.create;
var wt = Object.defineProperty;
var Ai = Object.getOwnPropertyDescriptor;
var Di = Object.getOwnPropertyNames;
var vi = Object.getPrototypeOf,
  ki = Object.prototype.hasOwnProperty;
var Z = ((i) =>
  typeof require < 'u'
    ? require
    : typeof Proxy < 'u'
      ? new Proxy(i, { get: (e, t) => (typeof require < 'u' ? require : e)[t] })
      : i)(function (i) {
  if (typeof require < 'u') return require.apply(this, arguments);
  throw Error('Dynamic require of "' + i + '" is not supported');
});
var V = (i, e) => () => (e || i((e = { exports: {} }).exports, e), e.exports);
var Ti = (i, e, t, n) => {
  if ((e && typeof e == 'object') || typeof e == 'function')
    for (let r of Di(e))
      !ki.call(i, r) &&
        r !== t &&
        wt(i, r, {
          get: () => e[r],
          enumerable: !(n = Ai(e, r)) || n.enumerable,
        });
  return i;
};
var Le = (i, e, t) => (
  (t = i != null ? Si(vi(i)) : {}),
  Ti(
    e || !i || !i.__esModule
      ? wt(t, 'default', { value: i, enumerable: !0 })
      : t,
    i,
  )
);
var le = V((Ie) => {
  var _e = class extends Error {
      constructor(e, t, n) {
        (super(n),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name),
          (this.code = t),
          (this.exitCode = e),
          (this.nestedError = void 0));
      }
    },
    Fe = class extends _e {
      constructor(e) {
        (super(1, 'commander.invalidArgument', e),
          Error.captureStackTrace(this, this.constructor),
          (this.name = this.constructor.name));
      }
    };
  Ie.CommanderError = _e;
  Ie.InvalidArgumentError = Fe;
});
var be = V((Pe) => {
  var { InvalidArgumentError: Li } = le(),
    $e = class {
      constructor(e, t) {
        switch (
          ((this.description = t || ''),
          (this.variadic = !1),
          (this.parseArg = void 0),
          (this.defaultValue = void 0),
          (this.defaultValueDescription = void 0),
          (this.argChoices = void 0),
          e[0])
        ) {
          case '<':
            ((this.required = !0), (this._name = e.slice(1, -1)));
            break;
          case '[':
            ((this.required = !1), (this._name = e.slice(1, -1)));
            break;
          default:
            ((this.required = !0), (this._name = e));
            break;
        }
        this._name.endsWith('...') &&
          ((this.variadic = !0), (this._name = this._name.slice(0, -3)));
      }
      name() {
        return this._name;
      }
      _collectValue(e, t) {
        return t === this.defaultValue || !Array.isArray(t)
          ? [e]
          : (t.push(e), t);
      }
      default(e, t) {
        return (
          (this.defaultValue = e), (this.defaultValueDescription = t), this
        );
      }
      argParser(e) {
        return ((this.parseArg = e), this);
      }
      choices(e) {
        return (
          (this.argChoices = e.slice()),
          (this.parseArg = (t, n) => {
            if (!this.argChoices.includes(t))
              throw new Li(
                `Allowed choices are ${this.argChoices.join(', ')}.`,
              );
            return this.variadic ? this._collectValue(t, n) : t;
          }),
          this
        );
      }
      argRequired() {
        return ((this.required = !0), this);
      }
      argOptional() {
        return ((this.required = !1), this);
      }
    };
  function Fi(i) {
    let e = i.name() + (i.variadic === !0 ? '...' : '');
    return i.required ? '<' + e + '>' : '[' + e + ']';
  }
  Pe.Argument = $e;
  Pe.humanReadableArgName = Fi;
});
var Ue = V((Be) => {
  var { humanReadableArgName: Ii } = be(),
    Re = class {
      constructor() {
        ((this.helpWidth = void 0),
          (this.minWidthToWrap = 40),
          (this.sortSubcommands = !1),
          (this.sortOptions = !1),
          (this.showGlobalOptions = !1));
      }
      prepareContext(e) {
        this.helpWidth = this.helpWidth ?? e.helpWidth ?? 80;
      }
      visibleCommands(e) {
        let t = e.commands.filter((r) => !r._hidden),
          n = e._getHelpCommand();
        return (
          n && !n._hidden && t.push(n),
          this.sortSubcommands &&
            t.sort((r, s) => r.name().localeCompare(s.name())),
          t
        );
      }
      compareOptions(e, t) {
        let n = (r) =>
          r.short ? r.short.replace(/^-/, '') : r.long.replace(/^--/, '');
        return n(e).localeCompare(n(t));
      }
      visibleOptions(e) {
        let t = e.options.filter((r) => !r.hidden),
          n = e._getHelpOption();
        if (n && !n.hidden) {
          let r = n.short && e._findOption(n.short),
            s = n.long && e._findOption(n.long);
          !r && !s
            ? t.push(n)
            : n.long && !s
              ? t.push(e.createOption(n.long, n.description))
              : n.short && !r && t.push(e.createOption(n.short, n.description));
        }
        return (this.sortOptions && t.sort(this.compareOptions), t);
      }
      visibleGlobalOptions(e) {
        if (!this.showGlobalOptions) return [];
        let t = [];
        for (let n = e.parent; n; n = n.parent) {
          let r = n.options.filter((s) => !s.hidden);
          t.push(...r);
        }
        return (this.sortOptions && t.sort(this.compareOptions), t);
      }
      visibleArguments(e) {
        return (
          e._argsDescription &&
            e.registeredArguments.forEach((t) => {
              t.description =
                t.description || e._argsDescription[t.name()] || '';
            }),
          e.registeredArguments.find((t) => t.description)
            ? e.registeredArguments
            : []
        );
      }
      subcommandTerm(e) {
        let t = e.registeredArguments.map((n) => Ii(n)).join(' ');
        return (
          e._name +
          (e._aliases[0] ? '|' + e._aliases[0] : '') +
          (e.options.length ? ' [options]' : '') +
          (t ? ' ' + t : '')
        );
      }
      optionTerm(e) {
        return e.flags;
      }
      argumentTerm(e) {
        return e.name();
      }
      longestSubcommandTermLength(e, t) {
        return t
          .visibleCommands(e)
          .reduce(
            (n, r) =>
              Math.max(
                n,
                this.displayWidth(t.styleSubcommandTerm(t.subcommandTerm(r))),
              ),
            0,
          );
      }
      longestOptionTermLength(e, t) {
        return t
          .visibleOptions(e)
          .reduce(
            (n, r) =>
              Math.max(
                n,
                this.displayWidth(t.styleOptionTerm(t.optionTerm(r))),
              ),
            0,
          );
      }
      longestGlobalOptionTermLength(e, t) {
        return t
          .visibleGlobalOptions(e)
          .reduce(
            (n, r) =>
              Math.max(
                n,
                this.displayWidth(t.styleOptionTerm(t.optionTerm(r))),
              ),
            0,
          );
      }
      longestArgumentTermLength(e, t) {
        return t
          .visibleArguments(e)
          .reduce(
            (n, r) =>
              Math.max(
                n,
                this.displayWidth(t.styleArgumentTerm(t.argumentTerm(r))),
              ),
            0,
          );
      }
      commandUsage(e) {
        let t = e._name;
        e._aliases[0] && (t = t + '|' + e._aliases[0]);
        let n = '';
        for (let r = e.parent; r; r = r.parent) n = r.name() + ' ' + n;
        return n + t + ' ' + e.usage();
      }
      commandDescription(e) {
        return e.description();
      }
      subcommandDescription(e) {
        return e.summary() || e.description();
      }
      optionDescription(e) {
        let t = [];
        if (
          (e.argChoices &&
            t.push(
              `choices: ${e.argChoices.map((n) => JSON.stringify(n)).join(', ')}`,
            ),
          e.defaultValue !== void 0 &&
            (e.required ||
              e.optional ||
              (e.isBoolean() && typeof e.defaultValue == 'boolean')) &&
            t.push(
              `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`,
            ),
          e.presetArg !== void 0 &&
            e.optional &&
            t.push(`preset: ${JSON.stringify(e.presetArg)}`),
          e.envVar !== void 0 && t.push(`env: ${e.envVar}`),
          t.length > 0)
        ) {
          let n = `(${t.join(', ')})`;
          return e.description ? `${e.description} ${n}` : n;
        }
        return e.description;
      }
      argumentDescription(e) {
        let t = [];
        if (
          (e.argChoices &&
            t.push(
              `choices: ${e.argChoices.map((n) => JSON.stringify(n)).join(', ')}`,
            ),
          e.defaultValue !== void 0 &&
            t.push(
              `default: ${e.defaultValueDescription || JSON.stringify(e.defaultValue)}`,
            ),
          t.length > 0)
        ) {
          let n = `(${t.join(', ')})`;
          return e.description ? `${e.description} ${n}` : n;
        }
        return e.description;
      }
      formatItemList(e, t, n) {
        return t.length === 0 ? [] : [n.styleTitle(e), ...t, ''];
      }
      groupItems(e, t, n) {
        let r = new Map();
        return (
          e.forEach((s) => {
            let o = n(s);
            r.has(o) || r.set(o, []);
          }),
          t.forEach((s) => {
            let o = n(s);
            (r.has(o) || r.set(o, []), r.get(o).push(s));
          }),
          r
        );
      }
      formatHelp(e, t) {
        let n = t.padWidth(e, t),
          r = t.helpWidth ?? 80;
        function s(l, h) {
          return t.formatItem(l, n, h, t);
        }
        let o = [
            `${t.styleTitle('Usage:')} ${t.styleUsage(t.commandUsage(e))}`,
            '',
          ],
          a = t.commandDescription(e);
        a.length > 0 &&
          (o = o.concat([t.boxWrap(t.styleCommandDescription(a), r), '']));
        let c = t
          .visibleArguments(e)
          .map((l) =>
            s(
              t.styleArgumentTerm(t.argumentTerm(l)),
              t.styleArgumentDescription(t.argumentDescription(l)),
            ),
          );
        if (
          ((o = o.concat(this.formatItemList('Arguments:', c, t))),
          this.groupItems(
            e.options,
            t.visibleOptions(e),
            (l) => l.helpGroupHeading ?? 'Options:',
          ).forEach((l, h) => {
            let m = l.map((f) =>
              s(
                t.styleOptionTerm(t.optionTerm(f)),
                t.styleOptionDescription(t.optionDescription(f)),
              ),
            );
            o = o.concat(this.formatItemList(h, m, t));
          }),
          t.showGlobalOptions)
        ) {
          let l = t
            .visibleGlobalOptions(e)
            .map((h) =>
              s(
                t.styleOptionTerm(t.optionTerm(h)),
                t.styleOptionDescription(t.optionDescription(h)),
              ),
            );
          o = o.concat(this.formatItemList('Global Options:', l, t));
        }
        return (
          this.groupItems(
            e.commands,
            t.visibleCommands(e),
            (l) => l.helpGroup() || 'Commands:',
          ).forEach((l, h) => {
            let m = l.map((f) =>
              s(
                t.styleSubcommandTerm(t.subcommandTerm(f)),
                t.styleSubcommandDescription(t.subcommandDescription(f)),
              ),
            );
            o = o.concat(this.formatItemList(h, m, t));
          }),
          o.join(`
`)
        );
      }
      displayWidth(e) {
        return yt(e).length;
      }
      styleTitle(e) {
        return e;
      }
      styleUsage(e) {
        return e
          .split(' ')
          .map((t) =>
            t === '[options]'
              ? this.styleOptionText(t)
              : t === '[command]'
                ? this.styleSubcommandText(t)
                : t[0] === '[' || t[0] === '<'
                  ? this.styleArgumentText(t)
                  : this.styleCommandText(t),
          )
          .join(' ');
      }
      styleCommandDescription(e) {
        return this.styleDescriptionText(e);
      }
      styleOptionDescription(e) {
        return this.styleDescriptionText(e);
      }
      styleSubcommandDescription(e) {
        return this.styleDescriptionText(e);
      }
      styleArgumentDescription(e) {
        return this.styleDescriptionText(e);
      }
      styleDescriptionText(e) {
        return e;
      }
      styleOptionTerm(e) {
        return this.styleOptionText(e);
      }
      styleSubcommandTerm(e) {
        return e
          .split(' ')
          .map((t) =>
            t === '[options]'
              ? this.styleOptionText(t)
              : t[0] === '[' || t[0] === '<'
                ? this.styleArgumentText(t)
                : this.styleSubcommandText(t),
          )
          .join(' ');
      }
      styleArgumentTerm(e) {
        return this.styleArgumentText(e);
      }
      styleOptionText(e) {
        return e;
      }
      styleArgumentText(e) {
        return e;
      }
      styleSubcommandText(e) {
        return e;
      }
      styleCommandText(e) {
        return e;
      }
      padWidth(e, t) {
        return Math.max(
          t.longestOptionTermLength(e, t),
          t.longestGlobalOptionTermLength(e, t),
          t.longestSubcommandTermLength(e, t),
          t.longestArgumentTermLength(e, t),
        );
      }
      preformatted(e) {
        return /\n[^\S\r\n]/.test(e);
      }
      formatItem(e, t, n, r) {
        let o = ' '.repeat(2);
        if (!n) return o + e;
        let a = e.padEnd(t + e.length - r.displayWidth(e)),
          c = 2,
          u = (this.helpWidth ?? 80) - t - c - 2,
          l;
        return (
          u < this.minWidthToWrap || r.preformatted(n)
            ? (l = n)
            : (l = r.boxWrap(n, u).replace(
                /\n/g,
                `
` + ' '.repeat(t + c),
              )),
          o +
            a +
            ' '.repeat(c) +
            l.replace(
              /\n/g,
              `
${o}`,
            )
        );
      }
      boxWrap(e, t) {
        if (t < this.minWidthToWrap) return e;
        let n = e.split(/\r\n|\n/),
          r = /[\s]*[^\s]+/g,
          s = [];
        return (
          n.forEach((o) => {
            let a = o.match(r);
            if (a === null) {
              s.push('');
              return;
            }
            let c = [a.shift()],
              d = this.displayWidth(c[0]);
            (a.forEach((u) => {
              let l = this.displayWidth(u);
              if (d + l <= t) {
                (c.push(u), (d += l));
                return;
              }
              s.push(c.join(''));
              let h = u.trimStart();
              ((c = [h]), (d = this.displayWidth(h)));
            }),
              s.push(c.join('')));
          }),
          s.join(`
`)
        );
      }
    };
  function yt(i) {
    let e = /\x1b\[\d*(;\d*)*m/g;
    return i.replace(e, '');
  }
  Be.Help = Re;
  Be.stripColor = yt;
});
var We = V((Ne) => {
  var { InvalidArgumentError: $i } = le(),
    He = class {
      constructor(e, t) {
        ((this.flags = e),
          (this.description = t || ''),
          (this.required = e.includes('<')),
          (this.optional = e.includes('[')),
          (this.variadic = /\w\.\.\.[>\]]$/.test(e)),
          (this.mandatory = !1));
        let n = Pi(e);
        ((this.short = n.shortFlag),
          (this.long = n.longFlag),
          (this.negate = !1),
          this.long && (this.negate = this.long.startsWith('--no-')),
          (this.defaultValue = void 0),
          (this.defaultValueDescription = void 0),
          (this.presetArg = void 0),
          (this.envVar = void 0),
          (this.parseArg = void 0),
          (this.hidden = !1),
          (this.argChoices = void 0),
          (this.conflictsWith = []),
          (this.implied = void 0),
          (this.helpGroupHeading = void 0));
      }
      default(e, t) {
        return (
          (this.defaultValue = e), (this.defaultValueDescription = t), this
        );
      }
      preset(e) {
        return ((this.presetArg = e), this);
      }
      conflicts(e) {
        return ((this.conflictsWith = this.conflictsWith.concat(e)), this);
      }
      implies(e) {
        let t = e;
        return (
          typeof e == 'string' && (t = { [e]: !0 }),
          (this.implied = Object.assign(this.implied || {}, t)),
          this
        );
      }
      env(e) {
        return ((this.envVar = e), this);
      }
      argParser(e) {
        return ((this.parseArg = e), this);
      }
      makeOptionMandatory(e = !0) {
        return ((this.mandatory = !!e), this);
      }
      hideHelp(e = !0) {
        return ((this.hidden = !!e), this);
      }
      _collectValue(e, t) {
        return t === this.defaultValue || !Array.isArray(t)
          ? [e]
          : (t.push(e), t);
      }
      choices(e) {
        return (
          (this.argChoices = e.slice()),
          (this.parseArg = (t, n) => {
            if (!this.argChoices.includes(t))
              throw new $i(
                `Allowed choices are ${this.argChoices.join(', ')}.`,
              );
            return this.variadic ? this._collectValue(t, n) : t;
          }),
          this
        );
      }
      name() {
        return this.long
          ? this.long.replace(/^--/, '')
          : this.short.replace(/^-/, '');
      }
      attributeName() {
        return this.negate
          ? Ct(this.name().replace(/^no-/, ''))
          : Ct(this.name());
      }
      helpGroup(e) {
        return ((this.helpGroupHeading = e), this);
      }
      is(e) {
        return this.short === e || this.long === e;
      }
      isBoolean() {
        return !this.required && !this.optional && !this.negate;
      }
    },
    Ve = class {
      constructor(e) {
        ((this.positiveOptions = new Map()),
          (this.negativeOptions = new Map()),
          (this.dualOptions = new Set()),
          e.forEach((t) => {
            t.negate
              ? this.negativeOptions.set(t.attributeName(), t)
              : this.positiveOptions.set(t.attributeName(), t);
          }),
          this.negativeOptions.forEach((t, n) => {
            this.positiveOptions.has(n) && this.dualOptions.add(n);
          }));
      }
      valueFromOption(e, t) {
        let n = t.attributeName();
        if (!this.dualOptions.has(n)) return !0;
        let r = this.negativeOptions.get(n).presetArg,
          s = r !== void 0 ? r : !1;
        return t.negate === (s === e);
      }
    };
  function Ct(i) {
    return i.split('-').reduce((e, t) => e + t[0].toUpperCase() + t.slice(1));
  }
  function Pi(i) {
    let e,
      t,
      n = /^-[^-]$/,
      r = /^--[^-]/,
      s = i.split(/[ |,]+/).concat('guard');
    if (
      (n.test(s[0]) && (e = s.shift()),
      r.test(s[0]) && (t = s.shift()),
      !e && n.test(s[0]) && (e = s.shift()),
      !e && r.test(s[0]) && ((e = t), (t = s.shift())),
      s[0].startsWith('-'))
    ) {
      let o = s[0],
        a = `option creation failed due to '${o}' in option flags '${i}'`;
      throw /^-[^-][^-]/.test(o)
        ? new Error(`${a}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`)
        : n.test(o)
          ? new Error(`${a}
- too many short flags`)
          : r.test(o)
            ? new Error(`${a}
- too many long flags`)
            : new Error(`${a}
- unrecognised flag format`);
    }
    if (e === void 0 && t === void 0)
      throw new Error(
        `option creation failed due to no flags found in '${i}'.`,
      );
    return { shortFlag: e, longFlag: t };
  }
  Ne.Option = He;
  Ne.DualOptions = Ve;
});
var Ot = V((Et) => {
  function Ri(i, e) {
    if (Math.abs(i.length - e.length) > 3) return Math.max(i.length, e.length);
    let t = [];
    for (let n = 0; n <= i.length; n++) t[n] = [n];
    for (let n = 0; n <= e.length; n++) t[0][n] = n;
    for (let n = 1; n <= e.length; n++)
      for (let r = 1; r <= i.length; r++) {
        let s = 1;
        (i[r - 1] === e[n - 1] ? (s = 0) : (s = 1),
          (t[r][n] = Math.min(
            t[r - 1][n] + 1,
            t[r][n - 1] + 1,
            t[r - 1][n - 1] + s,
          )),
          r > 1 &&
            n > 1 &&
            i[r - 1] === e[n - 2] &&
            i[r - 2] === e[n - 1] &&
            (t[r][n] = Math.min(t[r][n], t[r - 2][n - 2] + 1)));
      }
    return t[i.length][e.length];
  }
  function Bi(i, e) {
    if (!e || e.length === 0) return '';
    e = Array.from(new Set(e));
    let t = i.startsWith('--');
    t && ((i = i.slice(2)), (e = e.map((o) => o.slice(2))));
    let n = [],
      r = 3,
      s = 0.4;
    return (
      e.forEach((o) => {
        if (o.length <= 1) return;
        let a = Ri(i, o),
          c = Math.max(i.length, o.length);
        (c - a) / c > s &&
          (a < r ? ((r = a), (n = [o])) : a === r && n.push(o));
      }),
      n.sort((o, a) => o.localeCompare(a)),
      t && (n = n.map((o) => `--${o}`)),
      n.length > 1
        ? `
(Did you mean one of ${n.join(', ')}?)`
        : n.length === 1
          ? `
(Did you mean ${n[0]}?)`
          : ''
    );
  }
  Et.suggestSimilar = Bi;
});
var vt = V((Ke) => {
  var Ui = Z('node:events').EventEmitter,
    je = Z('node:child_process'),
    j = Z('node:path'),
    xe = Z('node:fs'),
    C = Z('node:process'),
    { Argument: Hi, humanReadableArgName: Vi } = be(),
    { CommanderError: Me } = le(),
    { Help: Ni, stripColor: Wi } = Ue(),
    { Option: St, DualOptions: ji } = We(),
    { suggestSimilar: At } = Ot(),
    Ge = class i extends Ui {
      constructor(e) {
        (super(),
          (this.commands = []),
          (this.options = []),
          (this.parent = null),
          (this._allowUnknownOption = !1),
          (this._allowExcessArguments = !1),
          (this.registeredArguments = []),
          (this._args = this.registeredArguments),
          (this.args = []),
          (this.rawArgs = []),
          (this.processedArgs = []),
          (this._scriptPath = null),
          (this._name = e || ''),
          (this._optionValues = {}),
          (this._optionValueSources = {}),
          (this._storeOptionsAsProperties = !1),
          (this._actionHandler = null),
          (this._executableHandler = !1),
          (this._executableFile = null),
          (this._executableDir = null),
          (this._defaultCommandName = null),
          (this._exitCallback = null),
          (this._aliases = []),
          (this._combineFlagAndOptionalValue = !0),
          (this._description = ''),
          (this._summary = ''),
          (this._argsDescription = void 0),
          (this._enablePositionalOptions = !1),
          (this._passThroughOptions = !1),
          (this._lifeCycleHooks = {}),
          (this._showHelpAfterError = !1),
          (this._showSuggestionAfterError = !0),
          (this._savedState = null),
          (this._outputConfiguration = {
            writeOut: (t) => C.stdout.write(t),
            writeErr: (t) => C.stderr.write(t),
            outputError: (t, n) => n(t),
            getOutHelpWidth: () => (C.stdout.isTTY ? C.stdout.columns : void 0),
            getErrHelpWidth: () => (C.stderr.isTTY ? C.stderr.columns : void 0),
            getOutHasColors: () =>
              qe() ?? (C.stdout.isTTY && C.stdout.hasColors?.()),
            getErrHasColors: () =>
              qe() ?? (C.stderr.isTTY && C.stderr.hasColors?.()),
            stripColor: (t) => Wi(t),
          }),
          (this._hidden = !1),
          (this._helpOption = void 0),
          (this._addImplicitHelpCommand = void 0),
          (this._helpCommand = void 0),
          (this._helpConfiguration = {}),
          (this._helpGroupHeading = void 0),
          (this._defaultCommandGroup = void 0),
          (this._defaultOptionGroup = void 0));
      }
      copyInheritedSettings(e) {
        return (
          (this._outputConfiguration = e._outputConfiguration),
          (this._helpOption = e._helpOption),
          (this._helpCommand = e._helpCommand),
          (this._helpConfiguration = e._helpConfiguration),
          (this._exitCallback = e._exitCallback),
          (this._storeOptionsAsProperties = e._storeOptionsAsProperties),
          (this._combineFlagAndOptionalValue = e._combineFlagAndOptionalValue),
          (this._allowExcessArguments = e._allowExcessArguments),
          (this._enablePositionalOptions = e._enablePositionalOptions),
          (this._showHelpAfterError = e._showHelpAfterError),
          (this._showSuggestionAfterError = e._showSuggestionAfterError),
          this
        );
      }
      _getCommandAndAncestors() {
        let e = [];
        for (let t = this; t; t = t.parent) e.push(t);
        return e;
      }
      command(e, t, n) {
        let r = t,
          s = n;
        (typeof r == 'object' && r !== null && ((s = r), (r = null)),
          (s = s || {}));
        let [, o, a] = e.match(/([^ ]+) *(.*)/),
          c = this.createCommand(o);
        return (
          r && (c.description(r), (c._executableHandler = !0)),
          s.isDefault && (this._defaultCommandName = c._name),
          (c._hidden = !!(s.noHelp || s.hidden)),
          (c._executableFile = s.executableFile || null),
          a && c.arguments(a),
          this._registerCommand(c),
          (c.parent = this),
          c.copyInheritedSettings(this),
          r ? this : c
        );
      }
      createCommand(e) {
        return new i(e);
      }
      createHelp() {
        return Object.assign(new Ni(), this.configureHelp());
      }
      configureHelp(e) {
        return e === void 0
          ? this._helpConfiguration
          : ((this._helpConfiguration = e), this);
      }
      configureOutput(e) {
        return e === void 0
          ? this._outputConfiguration
          : ((this._outputConfiguration = {
              ...this._outputConfiguration,
              ...e,
            }),
            this);
      }
      showHelpAfterError(e = !0) {
        return (
          typeof e != 'string' && (e = !!e),
          (this._showHelpAfterError = e),
          this
        );
      }
      showSuggestionAfterError(e = !0) {
        return ((this._showSuggestionAfterError = !!e), this);
      }
      addCommand(e, t) {
        if (!e._name)
          throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
        return (
          (t = t || {}),
          t.isDefault && (this._defaultCommandName = e._name),
          (t.noHelp || t.hidden) && (e._hidden = !0),
          this._registerCommand(e),
          (e.parent = this),
          e._checkForBrokenPassThrough(),
          this
        );
      }
      createArgument(e, t) {
        return new Hi(e, t);
      }
      argument(e, t, n, r) {
        let s = this.createArgument(e, t);
        return (
          typeof n == 'function' ? s.default(r).argParser(n) : s.default(n),
          this.addArgument(s),
          this
        );
      }
      arguments(e) {
        return (
          e
            .trim()
            .split(/ +/)
            .forEach((t) => {
              this.argument(t);
            }),
          this
        );
      }
      addArgument(e) {
        let t = this.registeredArguments.slice(-1)[0];
        if (t?.variadic)
          throw new Error(
            `only the last argument can be variadic '${t.name()}'`,
          );
        if (e.required && e.defaultValue !== void 0 && e.parseArg === void 0)
          throw new Error(
            `a default value for a required argument is never used: '${e.name()}'`,
          );
        return (this.registeredArguments.push(e), this);
      }
      helpCommand(e, t) {
        if (typeof e == 'boolean')
          return (
            (this._addImplicitHelpCommand = e),
            e &&
              this._defaultCommandGroup &&
              this._initCommandGroup(this._getHelpCommand()),
            this
          );
        let n = e ?? 'help [command]',
          [, r, s] = n.match(/([^ ]+) *(.*)/),
          o = t ?? 'display help for command',
          a = this.createCommand(r);
        return (
          a.helpOption(!1),
          s && a.arguments(s),
          o && a.description(o),
          (this._addImplicitHelpCommand = !0),
          (this._helpCommand = a),
          (e || t) && this._initCommandGroup(a),
          this
        );
      }
      addHelpCommand(e, t) {
        return typeof e != 'object'
          ? (this.helpCommand(e, t), this)
          : ((this._addImplicitHelpCommand = !0),
            (this._helpCommand = e),
            this._initCommandGroup(e),
            this);
      }
      _getHelpCommand() {
        return (this._addImplicitHelpCommand ??
          (this.commands.length &&
            !this._actionHandler &&
            !this._findCommand('help')))
          ? (this._helpCommand === void 0 && this.helpCommand(void 0, void 0),
            this._helpCommand)
          : null;
      }
      hook(e, t) {
        let n = ['preSubcommand', 'preAction', 'postAction'];
        if (!n.includes(e))
          throw new Error(`Unexpected value for event passed to hook : '${e}'.
Expecting one of '${n.join("', '")}'`);
        return (
          this._lifeCycleHooks[e]
            ? this._lifeCycleHooks[e].push(t)
            : (this._lifeCycleHooks[e] = [t]),
          this
        );
      }
      exitOverride(e) {
        return (
          e
            ? (this._exitCallback = e)
            : (this._exitCallback = (t) => {
                if (t.code !== 'commander.executeSubCommandAsync') throw t;
              }),
          this
        );
      }
      _exit(e, t, n) {
        (this._exitCallback && this._exitCallback(new Me(e, t, n)), C.exit(e));
      }
      action(e) {
        let t = (n) => {
          let r = this.registeredArguments.length,
            s = n.slice(0, r);
          return (
            this._storeOptionsAsProperties
              ? (s[r] = this)
              : (s[r] = this.opts()),
            s.push(this),
            e.apply(this, s)
          );
        };
        return ((this._actionHandler = t), this);
      }
      createOption(e, t) {
        return new St(e, t);
      }
      _callParseArg(e, t, n, r) {
        try {
          return e.parseArg(t, n);
        } catch (s) {
          if (s.code === 'commander.invalidArgument') {
            let o = `${r} ${s.message}`;
            this.error(o, { exitCode: s.exitCode, code: s.code });
          }
          throw s;
        }
      }
      _registerOption(e) {
        let t =
          (e.short && this._findOption(e.short)) ||
          (e.long && this._findOption(e.long));
        if (t) {
          let n = e.long && this._findOption(e.long) ? e.long : e.short;
          throw new Error(`Cannot add option '${e.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${n}'
-  already used by option '${t.flags}'`);
        }
        (this._initOptionGroup(e), this.options.push(e));
      }
      _registerCommand(e) {
        let t = (r) => [r.name()].concat(r.aliases()),
          n = t(e).find((r) => this._findCommand(r));
        if (n) {
          let r = t(this._findCommand(n)).join('|'),
            s = t(e).join('|');
          throw new Error(
            `cannot add command '${s}' as already have command '${r}'`,
          );
        }
        (this._initCommandGroup(e), this.commands.push(e));
      }
      addOption(e) {
        this._registerOption(e);
        let t = e.name(),
          n = e.attributeName();
        if (e.negate) {
          let s = e.long.replace(/^--no-/, '--');
          this._findOption(s) ||
            this.setOptionValueWithSource(
              n,
              e.defaultValue === void 0 ? !0 : e.defaultValue,
              'default',
            );
        } else
          e.defaultValue !== void 0 &&
            this.setOptionValueWithSource(n, e.defaultValue, 'default');
        let r = (s, o, a) => {
          s == null && e.presetArg !== void 0 && (s = e.presetArg);
          let c = this.getOptionValue(n);
          (s !== null && e.parseArg
            ? (s = this._callParseArg(e, s, c, o))
            : s !== null && e.variadic && (s = e._collectValue(s, c)),
            s == null &&
              (e.negate
                ? (s = !1)
                : e.isBoolean() || e.optional
                  ? (s = !0)
                  : (s = '')),
            this.setOptionValueWithSource(n, s, a));
        };
        return (
          this.on('option:' + t, (s) => {
            let o = `error: option '${e.flags}' argument '${s}' is invalid.`;
            r(s, o, 'cli');
          }),
          e.envVar &&
            this.on('optionEnv:' + t, (s) => {
              let o = `error: option '${e.flags}' value '${s}' from env '${e.envVar}' is invalid.`;
              r(s, o, 'env');
            }),
          this
        );
      }
      _optionEx(e, t, n, r, s) {
        if (typeof t == 'object' && t instanceof St)
          throw new Error(
            'To add an Option object use addOption() instead of option() or requiredOption()',
          );
        let o = this.createOption(t, n);
        if ((o.makeOptionMandatory(!!e.mandatory), typeof r == 'function'))
          o.default(s).argParser(r);
        else if (r instanceof RegExp) {
          let a = r;
          ((r = (c, d) => {
            let u = a.exec(c);
            return u ? u[0] : d;
          }),
            o.default(s).argParser(r));
        } else o.default(r);
        return this.addOption(o);
      }
      option(e, t, n, r) {
        return this._optionEx({}, e, t, n, r);
      }
      requiredOption(e, t, n, r) {
        return this._optionEx({ mandatory: !0 }, e, t, n, r);
      }
      combineFlagAndOptionalValue(e = !0) {
        return ((this._combineFlagAndOptionalValue = !!e), this);
      }
      allowUnknownOption(e = !0) {
        return ((this._allowUnknownOption = !!e), this);
      }
      allowExcessArguments(e = !0) {
        return ((this._allowExcessArguments = !!e), this);
      }
      enablePositionalOptions(e = !0) {
        return ((this._enablePositionalOptions = !!e), this);
      }
      passThroughOptions(e = !0) {
        return (
          (this._passThroughOptions = !!e),
          this._checkForBrokenPassThrough(),
          this
        );
      }
      _checkForBrokenPassThrough() {
        if (
          this.parent &&
          this._passThroughOptions &&
          !this.parent._enablePositionalOptions
        )
          throw new Error(
            `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
          );
      }
      storeOptionsAsProperties(e = !0) {
        if (this.options.length)
          throw new Error(
            'call .storeOptionsAsProperties() before adding options',
          );
        if (Object.keys(this._optionValues).length)
          throw new Error(
            'call .storeOptionsAsProperties() before setting option values',
          );
        return ((this._storeOptionsAsProperties = !!e), this);
      }
      getOptionValue(e) {
        return this._storeOptionsAsProperties ? this[e] : this._optionValues[e];
      }
      setOptionValue(e, t) {
        return this.setOptionValueWithSource(e, t, void 0);
      }
      setOptionValueWithSource(e, t, n) {
        return (
          this._storeOptionsAsProperties
            ? (this[e] = t)
            : (this._optionValues[e] = t),
          (this._optionValueSources[e] = n),
          this
        );
      }
      getOptionValueSource(e) {
        return this._optionValueSources[e];
      }
      getOptionValueSourceWithGlobals(e) {
        let t;
        return (
          this._getCommandAndAncestors().forEach((n) => {
            n.getOptionValueSource(e) !== void 0 &&
              (t = n.getOptionValueSource(e));
          }),
          t
        );
      }
      _prepareUserArgs(e, t) {
        if (e !== void 0 && !Array.isArray(e))
          throw new Error(
            'first parameter to parse must be array or undefined',
          );
        if (((t = t || {}), e === void 0 && t.from === void 0)) {
          C.versions?.electron && (t.from = 'electron');
          let r = C.execArgv ?? [];
          (r.includes('-e') ||
            r.includes('--eval') ||
            r.includes('-p') ||
            r.includes('--print')) &&
            (t.from = 'eval');
        }
        (e === void 0 && (e = C.argv), (this.rawArgs = e.slice()));
        let n;
        switch (t.from) {
          case void 0:
          case 'node':
            ((this._scriptPath = e[1]), (n = e.slice(2)));
            break;
          case 'electron':
            C.defaultApp
              ? ((this._scriptPath = e[1]), (n = e.slice(2)))
              : (n = e.slice(1));
            break;
          case 'user':
            n = e.slice(0);
            break;
          case 'eval':
            n = e.slice(1);
            break;
          default:
            throw new Error(`unexpected parse option { from: '${t.from}' }`);
        }
        return (
          !this._name &&
            this._scriptPath &&
            this.nameFromFilename(this._scriptPath),
          (this._name = this._name || 'program'),
          n
        );
      }
      parse(e, t) {
        this._prepareForParse();
        let n = this._prepareUserArgs(e, t);
        return (this._parseCommand([], n), this);
      }
      async parseAsync(e, t) {
        this._prepareForParse();
        let n = this._prepareUserArgs(e, t);
        return (await this._parseCommand([], n), this);
      }
      _prepareForParse() {
        this._savedState === null
          ? this.saveStateBeforeParse()
          : this.restoreStateBeforeParse();
      }
      saveStateBeforeParse() {
        this._savedState = {
          _name: this._name,
          _optionValues: { ...this._optionValues },
          _optionValueSources: { ...this._optionValueSources },
        };
      }
      restoreStateBeforeParse() {
        if (this._storeOptionsAsProperties)
          throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);
        ((this._name = this._savedState._name),
          (this._scriptPath = null),
          (this.rawArgs = []),
          (this._optionValues = { ...this._savedState._optionValues }),
          (this._optionValueSources = {
            ...this._savedState._optionValueSources,
          }),
          (this.args = []),
          (this.processedArgs = []));
      }
      _checkForMissingExecutable(e, t, n) {
        if (xe.existsSync(e)) return;
        let r = t
            ? `searched for local subcommand relative to directory '${t}'`
            : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory',
          s = `'${e}' does not exist
 - if '${n}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${r}`;
        throw new Error(s);
      }
      _executeSubCommand(e, t) {
        t = t.slice();
        let n = !1,
          r = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];
        function s(u, l) {
          let h = j.resolve(u, l);
          if (xe.existsSync(h)) return h;
          if (r.includes(j.extname(l))) return;
          let m = r.find((f) => xe.existsSync(`${h}${f}`));
          if (m) return `${h}${m}`;
        }
        (this._checkForMissingMandatoryOptions(),
          this._checkForConflictingOptions());
        let o = e._executableFile || `${this._name}-${e._name}`,
          a = this._executableDir || '';
        if (this._scriptPath) {
          let u;
          try {
            u = xe.realpathSync(this._scriptPath);
          } catch {
            u = this._scriptPath;
          }
          a = j.resolve(j.dirname(u), a);
        }
        if (a) {
          let u = s(a, o);
          if (!u && !e._executableFile && this._scriptPath) {
            let l = j.basename(this._scriptPath, j.extname(this._scriptPath));
            l !== this._name && (u = s(a, `${l}-${e._name}`));
          }
          o = u || o;
        }
        n = r.includes(j.extname(o));
        let c;
        (C.platform !== 'win32'
          ? n
            ? (t.unshift(o),
              (t = Dt(C.execArgv).concat(t)),
              (c = je.spawn(C.argv[0], t, { stdio: 'inherit' })))
            : (c = je.spawn(o, t, { stdio: 'inherit' }))
          : (this._checkForMissingExecutable(o, a, e._name),
            t.unshift(o),
            (t = Dt(C.execArgv).concat(t)),
            (c = je.spawn(C.execPath, t, { stdio: 'inherit' }))),
          c.killed ||
            ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'].forEach(
              (l) => {
                C.on(l, () => {
                  c.killed === !1 && c.exitCode === null && c.kill(l);
                });
              },
            ));
        let d = this._exitCallback;
        (c.on('close', (u) => {
          ((u = u ?? 1),
            d
              ? d(new Me(u, 'commander.executeSubCommandAsync', '(close)'))
              : C.exit(u));
        }),
          c.on('error', (u) => {
            if (u.code === 'ENOENT')
              this._checkForMissingExecutable(o, a, e._name);
            else if (u.code === 'EACCES')
              throw new Error(`'${o}' not executable`);
            if (!d) C.exit(1);
            else {
              let l = new Me(1, 'commander.executeSubCommandAsync', '(error)');
              ((l.nestedError = u), d(l));
            }
          }),
          (this.runningCommand = c));
      }
      _dispatchSubcommand(e, t, n) {
        let r = this._findCommand(e);
        (r || this.help({ error: !0 }), r._prepareForParse());
        let s;
        return (
          (s = this._chainOrCallSubCommandHook(s, r, 'preSubcommand')),
          (s = this._chainOrCall(s, () => {
            if (r._executableHandler) this._executeSubCommand(r, t.concat(n));
            else return r._parseCommand(t, n);
          })),
          s
        );
      }
      _dispatchHelpCommand(e) {
        e || this.help();
        let t = this._findCommand(e);
        return (
          t && !t._executableHandler && t.help(),
          this._dispatchSubcommand(
            e,
            [],
            [
              this._getHelpOption()?.long ??
                this._getHelpOption()?.short ??
                '--help',
            ],
          )
        );
      }
      _checkNumberOfArguments() {
        (this.registeredArguments.forEach((e, t) => {
          e.required && this.args[t] == null && this.missingArgument(e.name());
        }),
          !(
            this.registeredArguments.length > 0 &&
            this.registeredArguments[this.registeredArguments.length - 1]
              .variadic
          ) &&
            this.args.length > this.registeredArguments.length &&
            this._excessArguments(this.args));
      }
      _processArguments() {
        let e = (n, r, s) => {
          let o = r;
          if (r !== null && n.parseArg) {
            let a = `error: command-argument value '${r}' is invalid for argument '${n.name()}'.`;
            o = this._callParseArg(n, r, s, a);
          }
          return o;
        };
        this._checkNumberOfArguments();
        let t = [];
        (this.registeredArguments.forEach((n, r) => {
          let s = n.defaultValue;
          (n.variadic
            ? r < this.args.length
              ? ((s = this.args.slice(r)),
                n.parseArg &&
                  (s = s.reduce((o, a) => e(n, a, o), n.defaultValue)))
              : s === void 0 && (s = [])
            : r < this.args.length &&
              ((s = this.args[r]), n.parseArg && (s = e(n, s, n.defaultValue))),
            (t[r] = s));
        }),
          (this.processedArgs = t));
      }
      _chainOrCall(e, t) {
        return e?.then && typeof e.then == 'function' ? e.then(() => t()) : t();
      }
      _chainOrCallHooks(e, t) {
        let n = e,
          r = [];
        return (
          this._getCommandAndAncestors()
            .reverse()
            .filter((s) => s._lifeCycleHooks[t] !== void 0)
            .forEach((s) => {
              s._lifeCycleHooks[t].forEach((o) => {
                r.push({ hookedCommand: s, callback: o });
              });
            }),
          t === 'postAction' && r.reverse(),
          r.forEach((s) => {
            n = this._chainOrCall(n, () => s.callback(s.hookedCommand, this));
          }),
          n
        );
      }
      _chainOrCallSubCommandHook(e, t, n) {
        let r = e;
        return (
          this._lifeCycleHooks[n] !== void 0 &&
            this._lifeCycleHooks[n].forEach((s) => {
              r = this._chainOrCall(r, () => s(this, t));
            }),
          r
        );
      }
      _parseCommand(e, t) {
        let n = this.parseOptions(t);
        if (
          (this._parseOptionsEnv(),
          this._parseOptionsImplied(),
          (e = e.concat(n.operands)),
          (t = n.unknown),
          (this.args = e.concat(t)),
          e && this._findCommand(e[0]))
        )
          return this._dispatchSubcommand(e[0], e.slice(1), t);
        if (this._getHelpCommand() && e[0] === this._getHelpCommand().name())
          return this._dispatchHelpCommand(e[1]);
        if (this._defaultCommandName)
          return (
            this._outputHelpIfRequested(t),
            this._dispatchSubcommand(this._defaultCommandName, e, t)
          );
        (this.commands.length &&
          this.args.length === 0 &&
          !this._actionHandler &&
          !this._defaultCommandName &&
          this.help({ error: !0 }),
          this._outputHelpIfRequested(n.unknown),
          this._checkForMissingMandatoryOptions(),
          this._checkForConflictingOptions());
        let r = () => {
            n.unknown.length > 0 && this.unknownOption(n.unknown[0]);
          },
          s = `command:${this.name()}`;
        if (this._actionHandler) {
          (r(), this._processArguments());
          let o;
          return (
            (o = this._chainOrCallHooks(o, 'preAction')),
            (o = this._chainOrCall(o, () =>
              this._actionHandler(this.processedArgs),
            )),
            this.parent &&
              (o = this._chainOrCall(o, () => {
                this.parent.emit(s, e, t);
              })),
            (o = this._chainOrCallHooks(o, 'postAction')),
            o
          );
        }
        if (this.parent?.listenerCount(s))
          (r(), this._processArguments(), this.parent.emit(s, e, t));
        else if (e.length) {
          if (this._findCommand('*'))
            return this._dispatchSubcommand('*', e, t);
          this.listenerCount('command:*')
            ? this.emit('command:*', e, t)
            : this.commands.length
              ? this.unknownCommand()
              : (r(), this._processArguments());
        } else
          this.commands.length
            ? (r(), this.help({ error: !0 }))
            : (r(), this._processArguments());
      }
      _findCommand(e) {
        if (e)
          return this.commands.find(
            (t) => t._name === e || t._aliases.includes(e),
          );
      }
      _findOption(e) {
        return this.options.find((t) => t.is(e));
      }
      _checkForMissingMandatoryOptions() {
        this._getCommandAndAncestors().forEach((e) => {
          e.options.forEach((t) => {
            t.mandatory &&
              e.getOptionValue(t.attributeName()) === void 0 &&
              e.missingMandatoryOptionValue(t);
          });
        });
      }
      _checkForConflictingLocalOptions() {
        let e = this.options.filter((n) => {
          let r = n.attributeName();
          return this.getOptionValue(r) === void 0
            ? !1
            : this.getOptionValueSource(r) !== 'default';
        });
        e.filter((n) => n.conflictsWith.length > 0).forEach((n) => {
          let r = e.find((s) => n.conflictsWith.includes(s.attributeName()));
          r && this._conflictingOption(n, r);
        });
      }
      _checkForConflictingOptions() {
        this._getCommandAndAncestors().forEach((e) => {
          e._checkForConflictingLocalOptions();
        });
      }
      parseOptions(e) {
        let t = [],
          n = [],
          r = t;
        function s(u) {
          return u.length > 1 && u[0] === '-';
        }
        let o = (u) =>
            /^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(u)
              ? !this._getCommandAndAncestors().some((l) =>
                  l.options.map((h) => h.short).some((h) => /^-\d$/.test(h)),
                )
              : !1,
          a = null,
          c = null,
          d = 0;
        for (; d < e.length || c; ) {
          let u = c ?? e[d++];
          if (((c = null), u === '--')) {
            (r === n && r.push(u), r.push(...e.slice(d)));
            break;
          }
          if (a && (!s(u) || o(u))) {
            this.emit(`option:${a.name()}`, u);
            continue;
          }
          if (((a = null), s(u))) {
            let l = this._findOption(u);
            if (l) {
              if (l.required) {
                let h = e[d++];
                (h === void 0 && this.optionMissingArgument(l),
                  this.emit(`option:${l.name()}`, h));
              } else if (l.optional) {
                let h = null;
                (d < e.length && (!s(e[d]) || o(e[d])) && (h = e[d++]),
                  this.emit(`option:${l.name()}`, h));
              } else this.emit(`option:${l.name()}`);
              a = l.variadic ? l : null;
              continue;
            }
          }
          if (u.length > 2 && u[0] === '-' && u[1] !== '-') {
            let l = this._findOption(`-${u[1]}`);
            if (l) {
              l.required || (l.optional && this._combineFlagAndOptionalValue)
                ? this.emit(`option:${l.name()}`, u.slice(2))
                : (this.emit(`option:${l.name()}`), (c = `-${u.slice(2)}`));
              continue;
            }
          }
          if (/^--[^=]+=/.test(u)) {
            let l = u.indexOf('='),
              h = this._findOption(u.slice(0, l));
            if (h && (h.required || h.optional)) {
              this.emit(`option:${h.name()}`, u.slice(l + 1));
              continue;
            }
          }
          if (
            (r === t &&
              s(u) &&
              !(this.commands.length === 0 && o(u)) &&
              (r = n),
            (this._enablePositionalOptions || this._passThroughOptions) &&
              t.length === 0 &&
              n.length === 0)
          ) {
            if (this._findCommand(u)) {
              (t.push(u), n.push(...e.slice(d)));
              break;
            } else if (
              this._getHelpCommand() &&
              u === this._getHelpCommand().name()
            ) {
              t.push(u, ...e.slice(d));
              break;
            } else if (this._defaultCommandName) {
              n.push(u, ...e.slice(d));
              break;
            }
          }
          if (this._passThroughOptions) {
            r.push(u, ...e.slice(d));
            break;
          }
          r.push(u);
        }
        return { operands: t, unknown: n };
      }
      opts() {
        if (this._storeOptionsAsProperties) {
          let e = {},
            t = this.options.length;
          for (let n = 0; n < t; n++) {
            let r = this.options[n].attributeName();
            e[r] = r === this._versionOptionName ? this._version : this[r];
          }
          return e;
        }
        return this._optionValues;
      }
      optsWithGlobals() {
        return this._getCommandAndAncestors().reduce(
          (e, t) => Object.assign(e, t.opts()),
          {},
        );
      }
      error(e, t) {
        (this._outputConfiguration.outputError(
          `${e}
`,
          this._outputConfiguration.writeErr,
        ),
          typeof this._showHelpAfterError == 'string'
            ? this._outputConfiguration.writeErr(`${this._showHelpAfterError}
`)
            : this._showHelpAfterError &&
              (this._outputConfiguration.writeErr(`
`),
              this.outputHelp({ error: !0 })));
        let n = t || {},
          r = n.exitCode || 1,
          s = n.code || 'commander.error';
        this._exit(r, s, e);
      }
      _parseOptionsEnv() {
        this.options.forEach((e) => {
          if (e.envVar && e.envVar in C.env) {
            let t = e.attributeName();
            (this.getOptionValue(t) === void 0 ||
              ['default', 'config', 'env'].includes(
                this.getOptionValueSource(t),
              )) &&
              (e.required || e.optional
                ? this.emit(`optionEnv:${e.name()}`, C.env[e.envVar])
                : this.emit(`optionEnv:${e.name()}`));
          }
        });
      }
      _parseOptionsImplied() {
        let e = new ji(this.options),
          t = (n) =>
            this.getOptionValue(n) !== void 0 &&
            !['default', 'implied'].includes(this.getOptionValueSource(n));
        this.options
          .filter(
            (n) =>
              n.implied !== void 0 &&
              t(n.attributeName()) &&
              e.valueFromOption(this.getOptionValue(n.attributeName()), n),
          )
          .forEach((n) => {
            Object.keys(n.implied)
              .filter((r) => !t(r))
              .forEach((r) => {
                this.setOptionValueWithSource(r, n.implied[r], 'implied');
              });
          });
      }
      missingArgument(e) {
        let t = `error: missing required argument '${e}'`;
        this.error(t, { code: 'commander.missingArgument' });
      }
      optionMissingArgument(e) {
        let t = `error: option '${e.flags}' argument missing`;
        this.error(t, { code: 'commander.optionMissingArgument' });
      }
      missingMandatoryOptionValue(e) {
        let t = `error: required option '${e.flags}' not specified`;
        this.error(t, { code: 'commander.missingMandatoryOptionValue' });
      }
      _conflictingOption(e, t) {
        let n = (o) => {
            let a = o.attributeName(),
              c = this.getOptionValue(a),
              d = this.options.find((l) => l.negate && a === l.attributeName()),
              u = this.options.find(
                (l) => !l.negate && a === l.attributeName(),
              );
            return d &&
              ((d.presetArg === void 0 && c === !1) ||
                (d.presetArg !== void 0 && c === d.presetArg))
              ? d
              : u || o;
          },
          r = (o) => {
            let a = n(o),
              c = a.attributeName();
            return this.getOptionValueSource(c) === 'env'
              ? `environment variable '${a.envVar}'`
              : `option '${a.flags}'`;
          },
          s = `error: ${r(e)} cannot be used with ${r(t)}`;
        this.error(s, { code: 'commander.conflictingOption' });
      }
      unknownOption(e) {
        if (this._allowUnknownOption) return;
        let t = '';
        if (e.startsWith('--') && this._showSuggestionAfterError) {
          let r = [],
            s = this;
          do {
            let o = s
              .createHelp()
              .visibleOptions(s)
              .filter((a) => a.long)
              .map((a) => a.long);
            ((r = r.concat(o)), (s = s.parent));
          } while (s && !s._enablePositionalOptions);
          t = At(e, r);
        }
        let n = `error: unknown option '${e}'${t}`;
        this.error(n, { code: 'commander.unknownOption' });
      }
      _excessArguments(e) {
        if (this._allowExcessArguments) return;
        let t = this.registeredArguments.length,
          n = t === 1 ? '' : 's',
          s = `error: too many arguments${this.parent ? ` for '${this.name()}'` : ''}. Expected ${t} argument${n} but got ${e.length}.`;
        this.error(s, { code: 'commander.excessArguments' });
      }
      unknownCommand() {
        let e = this.args[0],
          t = '';
        if (this._showSuggestionAfterError) {
          let r = [];
          (this.createHelp()
            .visibleCommands(this)
            .forEach((s) => {
              (r.push(s.name()), s.alias() && r.push(s.alias()));
            }),
            (t = At(e, r)));
        }
        let n = `error: unknown command '${e}'${t}`;
        this.error(n, { code: 'commander.unknownCommand' });
      }
      version(e, t, n) {
        if (e === void 0) return this._version;
        ((this._version = e),
          (t = t || '-V, --version'),
          (n = n || 'output the version number'));
        let r = this.createOption(t, n);
        return (
          (this._versionOptionName = r.attributeName()),
          this._registerOption(r),
          this.on('option:' + r.name(), () => {
            (this._outputConfiguration.writeOut(`${e}
`),
              this._exit(0, 'commander.version', e));
          }),
          this
        );
      }
      description(e, t) {
        return e === void 0 && t === void 0
          ? this._description
          : ((this._description = e), t && (this._argsDescription = t), this);
      }
      summary(e) {
        return e === void 0 ? this._summary : ((this._summary = e), this);
      }
      alias(e) {
        if (e === void 0) return this._aliases[0];
        let t = this;
        if (
          (this.commands.length !== 0 &&
            this.commands[this.commands.length - 1]._executableHandler &&
            (t = this.commands[this.commands.length - 1]),
          e === t._name)
        )
          throw new Error("Command alias can't be the same as its name");
        let n = this.parent?._findCommand(e);
        if (n) {
          let r = [n.name()].concat(n.aliases()).join('|');
          throw new Error(
            `cannot add alias '${e}' to command '${this.name()}' as already have command '${r}'`,
          );
        }
        return (t._aliases.push(e), this);
      }
      aliases(e) {
        return e === void 0
          ? this._aliases
          : (e.forEach((t) => this.alias(t)), this);
      }
      usage(e) {
        if (e === void 0) {
          if (this._usage) return this._usage;
          let t = this.registeredArguments.map((n) => Vi(n));
          return []
            .concat(
              this.options.length || this._helpOption !== null
                ? '[options]'
                : [],
              this.commands.length ? '[command]' : [],
              this.registeredArguments.length ? t : [],
            )
            .join(' ');
        }
        return ((this._usage = e), this);
      }
      name(e) {
        return e === void 0 ? this._name : ((this._name = e), this);
      }
      helpGroup(e) {
        return e === void 0
          ? (this._helpGroupHeading ?? '')
          : ((this._helpGroupHeading = e), this);
      }
      commandsGroup(e) {
        return e === void 0
          ? (this._defaultCommandGroup ?? '')
          : ((this._defaultCommandGroup = e), this);
      }
      optionsGroup(e) {
        return e === void 0
          ? (this._defaultOptionGroup ?? '')
          : ((this._defaultOptionGroup = e), this);
      }
      _initOptionGroup(e) {
        this._defaultOptionGroup &&
          !e.helpGroupHeading &&
          e.helpGroup(this._defaultOptionGroup);
      }
      _initCommandGroup(e) {
        this._defaultCommandGroup &&
          !e.helpGroup() &&
          e.helpGroup(this._defaultCommandGroup);
      }
      nameFromFilename(e) {
        return ((this._name = j.basename(e, j.extname(e))), this);
      }
      executableDir(e) {
        return e === void 0
          ? this._executableDir
          : ((this._executableDir = e), this);
      }
      helpInformation(e) {
        let t = this.createHelp(),
          n = this._getOutputContext(e);
        t.prepareContext({
          error: n.error,
          helpWidth: n.helpWidth,
          outputHasColors: n.hasColors,
        });
        let r = t.formatHelp(this, t);
        return n.hasColors ? r : this._outputConfiguration.stripColor(r);
      }
      _getOutputContext(e) {
        e = e || {};
        let t = !!e.error,
          n,
          r,
          s;
        return (
          t
            ? ((n = (a) => this._outputConfiguration.writeErr(a)),
              (r = this._outputConfiguration.getErrHasColors()),
              (s = this._outputConfiguration.getErrHelpWidth()))
            : ((n = (a) => this._outputConfiguration.writeOut(a)),
              (r = this._outputConfiguration.getOutHasColors()),
              (s = this._outputConfiguration.getOutHelpWidth())),
          {
            error: t,
            write: (a) => (
              r || (a = this._outputConfiguration.stripColor(a)), n(a)
            ),
            hasColors: r,
            helpWidth: s,
          }
        );
      }
      outputHelp(e) {
        let t;
        typeof e == 'function' && ((t = e), (e = void 0));
        let n = this._getOutputContext(e),
          r = { error: n.error, write: n.write, command: this };
        (this._getCommandAndAncestors()
          .reverse()
          .forEach((o) => o.emit('beforeAllHelp', r)),
          this.emit('beforeHelp', r));
        let s = this.helpInformation({ error: n.error });
        if (t && ((s = t(s)), typeof s != 'string' && !Buffer.isBuffer(s)))
          throw new Error(
            'outputHelp callback must return a string or a Buffer',
          );
        (n.write(s),
          this._getHelpOption()?.long && this.emit(this._getHelpOption().long),
          this.emit('afterHelp', r),
          this._getCommandAndAncestors().forEach((o) =>
            o.emit('afterAllHelp', r),
          ));
      }
      helpOption(e, t) {
        return typeof e == 'boolean'
          ? (e
              ? (this._helpOption === null && (this._helpOption = void 0),
                this._defaultOptionGroup &&
                  this._initOptionGroup(this._getHelpOption()))
              : (this._helpOption = null),
            this)
          : ((this._helpOption = this.createOption(
              e ?? '-h, --help',
              t ?? 'display help for command',
            )),
            (e || t) && this._initOptionGroup(this._helpOption),
            this);
      }
      _getHelpOption() {
        return (
          this._helpOption === void 0 && this.helpOption(void 0, void 0),
          this._helpOption
        );
      }
      addHelpOption(e) {
        return ((this._helpOption = e), this._initOptionGroup(e), this);
      }
      help(e) {
        this.outputHelp(e);
        let t = Number(C.exitCode ?? 0);
        (t === 0 && e && typeof e != 'function' && e.error && (t = 1),
          this._exit(t, 'commander.help', '(outputHelp)'));
      }
      addHelpText(e, t) {
        let n = ['beforeAll', 'before', 'after', 'afterAll'];
        if (!n.includes(e))
          throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${n.join("', '")}'`);
        let r = `${e}Help`;
        return (
          this.on(r, (s) => {
            let o;
            (typeof t == 'function'
              ? (o = t({ error: s.error, command: s.command }))
              : (o = t),
              o &&
                s.write(`${o}
`));
          }),
          this
        );
      }
      _outputHelpIfRequested(e) {
        let t = this._getHelpOption();
        t &&
          e.find((r) => t.is(r)) &&
          (this.outputHelp(),
          this._exit(0, 'commander.helpDisplayed', '(outputHelp)'));
      }
    };
  function Dt(i) {
    return i.map((e) => {
      if (!e.startsWith('--inspect')) return e;
      let t,
        n = '127.0.0.1',
        r = '9229',
        s;
      return (
        (s = e.match(/^(--inspect(-brk)?)$/)) !== null
          ? (t = s[1])
          : (s = e.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null
            ? ((t = s[1]), /^\d+$/.test(s[3]) ? (r = s[3]) : (n = s[3]))
            : (s = e.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !==
                null && ((t = s[1]), (n = s[3]), (r = s[4])),
        t && r !== '0' ? `${t}=${n}:${parseInt(r) + 1}` : e
      );
    });
  }
  function qe() {
    if (
      C.env.NO_COLOR ||
      C.env.FORCE_COLOR === '0' ||
      C.env.FORCE_COLOR === 'false'
    )
      return !1;
    if (C.env.FORCE_COLOR || C.env.CLICOLOR_FORCE !== void 0) return !0;
  }
  Ke.Command = Ge;
  Ke.useColor = qe;
});
var Ft = V(($) => {
  var { Argument: kt } = be(),
    { Command: Ye } = vt(),
    { CommanderError: Mi, InvalidArgumentError: Tt } = le(),
    { Help: Gi } = Ue(),
    { Option: Lt } = We();
  $.program = new Ye();
  $.createCommand = (i) => new Ye(i);
  $.createOption = (i, e) => new Lt(i, e);
  $.createArgument = (i, e) => new kt(i, e);
  $.Command = Ye;
  $.Option = Lt;
  $.Argument = kt;
  $.Help = Gi;
  $.CommanderError = Mi;
  $.InvalidArgumentError = Tt;
  $.InvalidOptionArgumentError = Tt;
});
var $t = V((F, It) => {
  var R = Ft();
  F = It.exports = {};
  F.program = new R.Command();
  F.Argument = R.Argument;
  F.Command = R.Command;
  F.CommanderError = R.CommanderError;
  F.Help = R.Help;
  F.InvalidArgumentError = R.InvalidArgumentError;
  F.InvalidOptionArgumentError = R.InvalidArgumentError;
  F.Option = R.Option;
  F.createCommand = (i) => new R.Command(i);
  F.createOption = (i, e) => new R.Option(i, e);
  F.createArgument = (i, e) => new R.Argument(i, e);
});
var Kt = V((Pr, qt) => {
  'use strict';
  qt.exports = sn;
  function rn(i) {
    let e = { defaultWidth: 0, output: process.stdout, tty: Z('tty') };
    return i
      ? (Object.keys(e).forEach(function (t) {
          i[t] || (i[t] = e[t]);
        }),
        i)
      : e;
  }
  function sn(i) {
    let e = rn(i);
    if (e.output.getWindowSize)
      return e.output.getWindowSize()[0] || e.defaultWidth;
    if (e.tty.getWindowSize) return e.tty.getWindowSize()[1] || e.defaultWidth;
    if (e.output.columns) return e.output.columns;
    if (process.env.CLI_WIDTH) {
      let t = parseInt(process.env.CLI_WIDTH, 10);
      if (!isNaN(t) && t !== 0) return t;
    }
    return e.defaultWidth;
  }
});
var hi = V((Jr, ci) => {
  var wn = Z('stream'),
    it = class extends wn {
      #i = null;
      constructor(e = {}) {
        (super(e),
          (this.writable = this.readable = !0),
          (this.muted = !1),
          this.on('pipe', this._onpipe),
          (this.replace = e.replace),
          (this._prompt = e.prompt || null),
          (this._hadControl = !1));
      }
      #t(e, t) {
        return this._dest ? this._dest[e] : this._src ? this._src[e] : t;
      }
      #e(e, ...t) {
        (typeof this._dest?.[e] == 'function' && this._dest[e](...t),
          typeof this._src?.[e] == 'function' && this._src[e](...t));
      }
      get isTTY() {
        return this.#i !== null ? this.#i : this.#t('isTTY', !1);
      }
      set isTTY(e) {
        this.#i = e;
      }
      get rows() {
        return this.#t('rows');
      }
      get columns() {
        return this.#t('columns');
      }
      mute() {
        this.muted = !0;
      }
      unmute() {
        this.muted = !1;
      }
      _onpipe(e) {
        this._src = e;
      }
      pipe(e, t) {
        return ((this._dest = e), super.pipe(e, t));
      }
      pause() {
        if (this._src) return this._src.pause();
      }
      resume() {
        if (this._src) return this._src.resume();
      }
      write(e) {
        if (this.muted) {
          if (!this.replace) return !0;
          if (e.match(/^\u001b/))
            return (
              e.indexOf(this._prompt) === 0 &&
                ((e = e.slice(this._prompt.length)),
                (e = e.replace(/./g, this.replace)),
                (e = this._prompt + e)),
              (this._hadControl = !0),
              this.emit('data', e)
            );
          (this._prompt &&
            this._hadControl &&
            e.indexOf(this._prompt) === 0 &&
            ((this._hadControl = !1),
            this.emit('data', this._prompt),
            (e = e.slice(this._prompt.length))),
            (e = e.toString().replace(/./g, this.replace)));
        }
        this.emit('data', e);
      }
      end(e) {
        (this.muted &&
          (e && this.replace
            ? (e = e.toString().replace(/./g, this.replace))
            : (e = null)),
          e && this.emit('data', e),
          this.emit('end'));
      }
      destroy(...e) {
        return this.#e('destroy', ...e);
      }
      destroySoon(...e) {
        return this.#e('destroySoon', ...e);
      }
      close(...e) {
        return this.#e('close', ...e);
      }
    };
  ci.exports = it;
});
import { readFileSync as Hn } from 'node:fs';
var Pt = Le($t(), 1),
  {
    program: Je,
    createCommand: Yn,
    createArgument: Jn,
    createOption: zn,
    CommanderError: Qn,
    InvalidArgumentError: Xn,
    InvalidOptionArgumentError: Zn,
    Command: Rt,
    Argument: er,
    Option: tr,
    Help: ir,
  } = Pt.default;
var Bt = {
  name: '@lib/scaffold',
  version: '0.1.0',
  devDependencies: {
    '@commander-js/extra-typings': '^14.0.0',
    '@eslint/compat': '^2.0.0',
    '@eslint/js': '^10.0.1',
    '@inquirer/prompts': '^8.3.0',
    '@lib/fs': 'workspace:^',
    '@lib/path': 'workspace:^',
    '@npmcli/package-json': '^7.0.5',
    '@repo/test': 'workspace:^',
    '@stylistic/eslint-plugin': '^5.8.0',
    '@tsconfig/node-ts': '^23.6.4',
    '@tsconfig/node24': '^24.0.4',
    '@tsconfig/strictest': '^2.0.8',
    '@types/node': 'catalog:',
    '@types/npmcli__package-json': '^4.0.4',
    '@typescript-eslint/parser': '^8.55.0',
    chokidar: '^5.0.0',
    commander: '^14.0.3',
    esbuild: 'catalog:',
    eslint: '^10.0.3',
    'eslint-plugin-import': '^2.32.0',
    'eslint-plugin-svelte': '^3.15.0',
    execa: '^9.6.1',
    'find-up': '^8.0.0',
    globals: '^17.3.0',
    oxfmt: 'catalog:',
    oxlint: 'catalog:',
    'oxlint-tsgolint': 'catalog:',
    'svelte-eslint-parser': '^1.4.1',
    typescript: 'catalog:',
    'typescript-eslint': '^8.55.0',
    vite: 'catalog:',
  },
  exports: {
    './eslint': {
      types: './src/packages/eslint/config-base.ts',
      default: './src/packages/eslint/config-base.ts',
    },
    './eslint/svelte': {
      types: './src/packages/eslint/config-svelte.ts',
      default: './src/packages/eslint/config-svelte.ts',
    },
    './oxfmt/*': {
      types: './src/packages/oxfmt/*.ts',
      default: './src/packages/oxfmt/*.ts',
    },
    './oxlint/*': {
      types: './src/packages/oxlint/*.ts',
      default: './src/packages/oxlint/*.ts',
    },
    './tsconfig': { default: './src/packages/typescript/tsconfig-base.json' },
  },
  license: 'MIT',
  private: !0,
  scripts: {
    'build-bin': 'bun bin/build.ts',
    'check-types': 'tsc --noEmit',
    lint: 'oxlint',
  },
  type: 'module',
};
var M = (i, e = []) =>
    i.name === 'up' ||
    (e.includes('vim') && i.name === 'k') ||
    (e.includes('emacs') && i.ctrl && i.name === 'p'),
  ee = (i, e = []) =>
    i.name === 'down' ||
    (e.includes('vim') && i.name === 'j') ||
    (e.includes('emacs') && i.ctrl && i.name === 'n'),
  ze = (i) => i.name === 'space',
  ue = (i) => i.name === 'backspace',
  ce = (i) => i.name === 'tab',
  he = (i) => '1234567890'.includes(i.name),
  G = (i) => i.name === 'enter' || i.name === 'return';
var we = class extends Error {
    name = 'AbortPromptError';
    message = 'Prompt was aborted';
    constructor(e) {
      (super(), (this.cause = e?.cause));
    }
  },
  ye = class extends Error {
    name = 'CancelPromptError';
    message = 'Prompt was canceled';
  },
  de = class extends Error {
    name = 'ExitPromptError';
  },
  Ce = class extends Error {
    name = 'HookError';
  },
  Q = class extends Error {
    name = 'ValidationError';
  };
import { AsyncResource as zi } from 'node:async_hooks';
import { AsyncLocalStorage as Ki, AsyncResource as Yi } from 'node:async_hooks';
var Ut = new Ki();
function Ji(i) {
  return {
    rl: i,
    hooks: [],
    hooksCleanup: [],
    hooksEffect: [],
    index: 0,
    handleChange() {},
  };
}
function Ht(i, e) {
  let t = Ji(i);
  return Ut.run(t, () => {
    function n(r) {
      ((t.handleChange = () => {
        ((t.index = 0), r());
      }),
        t.handleChange());
    }
    return e(n);
  });
}
function te() {
  let i = Ut.getStore();
  if (!i)
    throw new Ce(
      '[Inquirer] Hook functions can only be called from within a prompt',
    );
  return i;
}
function Qe() {
  return te().rl;
}
function Xe(i) {
  let e = (...t) => {
    let n = te(),
      r = !1,
      s = n.handleChange;
    n.handleChange = () => {
      r = !0;
    };
    let o = i(...t);
    return (r && s(), (n.handleChange = s), o);
  };
  return Yi.bind(e);
}
function ae(i) {
  let e = te(),
    { index: t } = e,
    n = {
      get() {
        return e.hooks[t];
      },
      set(s) {
        e.hooks[t] = s;
      },
      initialized: t in e.hooks,
    },
    r = i(n);
  return (e.index++, r);
}
function Vt() {
  te().handleChange();
}
var ie = {
  queue(i) {
    let e = te(),
      { index: t } = e;
    e.hooksEffect.push(() => {
      e.hooksCleanup[t]?.();
      let n = i(Qe());
      if (n != null && typeof n != 'function')
        throw new Q(
          'useEffect return value must be a cleanup function or nothing.',
        );
      e.hooksCleanup[t] = n;
    });
  },
  run() {
    let i = te();
    Xe(() => {
      (i.hooksEffect.forEach((e) => {
        e();
      }),
        (i.hooksEffect.length = 0));
    })();
  },
  clearAll() {
    let i = te();
    (i.hooksCleanup.forEach((e) => {
      e?.();
    }),
      (i.hooksEffect.length = 0),
      (i.hooksCleanup.length = 0));
  },
};
function A(i) {
  return ae((e) => {
    let t = zi.bind(function (s) {
      e.get() !== s && (e.set(s), Vt());
    });
    if (e.initialized) return [e.get(), t];
    let n = typeof i == 'function' ? i() : i;
    return (e.set(n), [n, t]);
  });
}
function q(i, e) {
  ae((t) => {
    let n = t.get();
    ((!Array.isArray(n) || e.some((s, o) => !Object.is(s, n[o]))) &&
      ie.queue(i),
      t.set(e));
  });
}
import N from 'node:process';
import { styleText as U } from 'node:util';
function Qi() {
  return N.platform !== 'win32'
    ? N.env.TERM !== 'linux'
    : !!N.env.WT_SESSION ||
        !!N.env.TERMINUS_SUBLIME ||
        N.env.ConEmuTask === '{cmd::Cmder}' ||
        N.env.TERM_PROGRAM === 'Terminus-Sublime' ||
        N.env.TERM_PROGRAM === 'vscode' ||
        N.env.TERM === 'xterm-256color' ||
        N.env.TERM === 'alacritty' ||
        N.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm';
}
var Nt = {
    circleQuestionMark: '(?)',
    questionMarkPrefix: '(?)',
    square: '\u2588',
    squareDarkShade: '\u2593',
    squareMediumShade: '\u2592',
    squareLightShade: '\u2591',
    squareTop: '\u2580',
    squareBottom: '\u2584',
    squareLeft: '\u258C',
    squareRight: '\u2590',
    squareCenter: '\u25A0',
    bullet: '\u25CF',
    dot: '\u2024',
    ellipsis: '\u2026',
    pointerSmall: '\u203A',
    triangleUp: '\u25B2',
    triangleUpSmall: '\u25B4',
    triangleDown: '\u25BC',
    triangleDownSmall: '\u25BE',
    triangleLeftSmall: '\u25C2',
    triangleRightSmall: '\u25B8',
    home: '\u2302',
    heart: '\u2665',
    musicNote: '\u266A',
    musicNoteBeamed: '\u266B',
    arrowUp: '\u2191',
    arrowDown: '\u2193',
    arrowLeft: '\u2190',
    arrowRight: '\u2192',
    arrowLeftRight: '\u2194',
    arrowUpDown: '\u2195',
    almostEqual: '\u2248',
    notEqual: '\u2260',
    lessOrEqual: '\u2264',
    greaterOrEqual: '\u2265',
    identical: '\u2261',
    infinity: '\u221E',
    subscriptZero: '\u2080',
    subscriptOne: '\u2081',
    subscriptTwo: '\u2082',
    subscriptThree: '\u2083',
    subscriptFour: '\u2084',
    subscriptFive: '\u2085',
    subscriptSix: '\u2086',
    subscriptSeven: '\u2087',
    subscriptEight: '\u2088',
    subscriptNine: '\u2089',
    oneHalf: '\xBD',
    oneThird: '\u2153',
    oneQuarter: '\xBC',
    oneFifth: '\u2155',
    oneSixth: '\u2159',
    oneEighth: '\u215B',
    twoThirds: '\u2154',
    twoFifths: '\u2156',
    threeQuarters: '\xBE',
    threeFifths: '\u2157',
    threeEighths: '\u215C',
    fourFifths: '\u2158',
    fiveSixths: '\u215A',
    fiveEighths: '\u215D',
    sevenEighths: '\u215E',
    line: '\u2500',
    lineBold: '\u2501',
    lineDouble: '\u2550',
    lineDashed0: '\u2504',
    lineDashed1: '\u2505',
    lineDashed2: '\u2508',
    lineDashed3: '\u2509',
    lineDashed4: '\u254C',
    lineDashed5: '\u254D',
    lineDashed6: '\u2574',
    lineDashed7: '\u2576',
    lineDashed8: '\u2578',
    lineDashed9: '\u257A',
    lineDashed10: '\u257C',
    lineDashed11: '\u257E',
    lineDashed12: '\u2212',
    lineDashed13: '\u2013',
    lineDashed14: '\u2010',
    lineDashed15: '\u2043',
    lineVertical: '\u2502',
    lineVerticalBold: '\u2503',
    lineVerticalDouble: '\u2551',
    lineVerticalDashed0: '\u2506',
    lineVerticalDashed1: '\u2507',
    lineVerticalDashed2: '\u250A',
    lineVerticalDashed3: '\u250B',
    lineVerticalDashed4: '\u254E',
    lineVerticalDashed5: '\u254F',
    lineVerticalDashed6: '\u2575',
    lineVerticalDashed7: '\u2577',
    lineVerticalDashed8: '\u2579',
    lineVerticalDashed9: '\u257B',
    lineVerticalDashed10: '\u257D',
    lineVerticalDashed11: '\u257F',
    lineDownLeft: '\u2510',
    lineDownLeftArc: '\u256E',
    lineDownBoldLeftBold: '\u2513',
    lineDownBoldLeft: '\u2512',
    lineDownLeftBold: '\u2511',
    lineDownDoubleLeftDouble: '\u2557',
    lineDownDoubleLeft: '\u2556',
    lineDownLeftDouble: '\u2555',
    lineDownRight: '\u250C',
    lineDownRightArc: '\u256D',
    lineDownBoldRightBold: '\u250F',
    lineDownBoldRight: '\u250E',
    lineDownRightBold: '\u250D',
    lineDownDoubleRightDouble: '\u2554',
    lineDownDoubleRight: '\u2553',
    lineDownRightDouble: '\u2552',
    lineUpLeft: '\u2518',
    lineUpLeftArc: '\u256F',
    lineUpBoldLeftBold: '\u251B',
    lineUpBoldLeft: '\u251A',
    lineUpLeftBold: '\u2519',
    lineUpDoubleLeftDouble: '\u255D',
    lineUpDoubleLeft: '\u255C',
    lineUpLeftDouble: '\u255B',
    lineUpRight: '\u2514',
    lineUpRightArc: '\u2570',
    lineUpBoldRightBold: '\u2517',
    lineUpBoldRight: '\u2516',
    lineUpRightBold: '\u2515',
    lineUpDoubleRightDouble: '\u255A',
    lineUpDoubleRight: '\u2559',
    lineUpRightDouble: '\u2558',
    lineUpDownLeft: '\u2524',
    lineUpBoldDownBoldLeftBold: '\u252B',
    lineUpBoldDownBoldLeft: '\u2528',
    lineUpDownLeftBold: '\u2525',
    lineUpBoldDownLeftBold: '\u2529',
    lineUpDownBoldLeftBold: '\u252A',
    lineUpDownBoldLeft: '\u2527',
    lineUpBoldDownLeft: '\u2526',
    lineUpDoubleDownDoubleLeftDouble: '\u2563',
    lineUpDoubleDownDoubleLeft: '\u2562',
    lineUpDownLeftDouble: '\u2561',
    lineUpDownRight: '\u251C',
    lineUpBoldDownBoldRightBold: '\u2523',
    lineUpBoldDownBoldRight: '\u2520',
    lineUpDownRightBold: '\u251D',
    lineUpBoldDownRightBold: '\u2521',
    lineUpDownBoldRightBold: '\u2522',
    lineUpDownBoldRight: '\u251F',
    lineUpBoldDownRight: '\u251E',
    lineUpDoubleDownDoubleRightDouble: '\u2560',
    lineUpDoubleDownDoubleRight: '\u255F',
    lineUpDownRightDouble: '\u255E',
    lineDownLeftRight: '\u252C',
    lineDownBoldLeftBoldRightBold: '\u2533',
    lineDownLeftBoldRightBold: '\u252F',
    lineDownBoldLeftRight: '\u2530',
    lineDownBoldLeftBoldRight: '\u2531',
    lineDownBoldLeftRightBold: '\u2532',
    lineDownLeftRightBold: '\u252E',
    lineDownLeftBoldRight: '\u252D',
    lineDownDoubleLeftDoubleRightDouble: '\u2566',
    lineDownDoubleLeftRight: '\u2565',
    lineDownLeftDoubleRightDouble: '\u2564',
    lineUpLeftRight: '\u2534',
    lineUpBoldLeftBoldRightBold: '\u253B',
    lineUpLeftBoldRightBold: '\u2537',
    lineUpBoldLeftRight: '\u2538',
    lineUpBoldLeftBoldRight: '\u2539',
    lineUpBoldLeftRightBold: '\u253A',
    lineUpLeftRightBold: '\u2536',
    lineUpLeftBoldRight: '\u2535',
    lineUpDoubleLeftDoubleRightDouble: '\u2569',
    lineUpDoubleLeftRight: '\u2568',
    lineUpLeftDoubleRightDouble: '\u2567',
    lineUpDownLeftRight: '\u253C',
    lineUpBoldDownBoldLeftBoldRightBold: '\u254B',
    lineUpDownBoldLeftBoldRightBold: '\u2548',
    lineUpBoldDownLeftBoldRightBold: '\u2547',
    lineUpBoldDownBoldLeftRightBold: '\u254A',
    lineUpBoldDownBoldLeftBoldRight: '\u2549',
    lineUpBoldDownLeftRight: '\u2540',
    lineUpDownBoldLeftRight: '\u2541',
    lineUpDownLeftBoldRight: '\u253D',
    lineUpDownLeftRightBold: '\u253E',
    lineUpBoldDownBoldLeftRight: '\u2542',
    lineUpDownLeftBoldRightBold: '\u253F',
    lineUpBoldDownLeftBoldRight: '\u2543',
    lineUpBoldDownLeftRightBold: '\u2544',
    lineUpDownBoldLeftBoldRight: '\u2545',
    lineUpDownBoldLeftRightBold: '\u2546',
    lineUpDoubleDownDoubleLeftDoubleRightDouble: '\u256C',
    lineUpDoubleDownDoubleLeftRight: '\u256B',
    lineUpDownLeftDoubleRightDouble: '\u256A',
    lineCross: '\u2573',
    lineBackslash: '\u2572',
    lineSlash: '\u2571',
  },
  Wt = {
    tick: '\u2714',
    info: '\u2139',
    warning: '\u26A0',
    cross: '\u2718',
    squareSmall: '\u25FB',
    squareSmallFilled: '\u25FC',
    circle: '\u25EF',
    circleFilled: '\u25C9',
    circleDotted: '\u25CC',
    circleDouble: '\u25CE',
    circleCircle: '\u24DE',
    circleCross: '\u24E7',
    circlePipe: '\u24BE',
    radioOn: '\u25C9',
    radioOff: '\u25EF',
    checkboxOn: '\u2612',
    checkboxOff: '\u2610',
    checkboxCircleOn: '\u24E7',
    checkboxCircleOff: '\u24BE',
    pointer: '\u276F',
    triangleUpOutline: '\u25B3',
    triangleLeft: '\u25C0',
    triangleRight: '\u25B6',
    lozenge: '\u25C6',
    lozengeOutline: '\u25C7',
    hamburger: '\u2630',
    smiley: '\u32E1',
    mustache: '\u0DF4',
    star: '\u2605',
    play: '\u25B6',
    nodejs: '\u2B22',
    oneSeventh: '\u2150',
    oneNinth: '\u2151',
    oneTenth: '\u2152',
  },
  Xi = {
    tick: '\u221A',
    info: 'i',
    warning: '\u203C',
    cross: '\xD7',
    squareSmall: '\u25A1',
    squareSmallFilled: '\u25A0',
    circle: '( )',
    circleFilled: '(*)',
    circleDotted: '( )',
    circleDouble: '( )',
    circleCircle: '(\u25CB)',
    circleCross: '(\xD7)',
    circlePipe: '(\u2502)',
    radioOn: '(*)',
    radioOff: '( )',
    checkboxOn: '[\xD7]',
    checkboxOff: '[ ]',
    checkboxCircleOn: '(\xD7)',
    checkboxCircleOff: '( )',
    pointer: '>',
    triangleUpOutline: '\u2206',
    triangleLeft: '\u25C4',
    triangleRight: '\u25BA',
    lozenge: '\u2666',
    lozengeOutline: '\u25CA',
    hamburger: '\u2261',
    smiley: '\u263A',
    mustache: '\u250C\u2500\u2510',
    star: '\u2736',
    play: '\u25BA',
    nodejs: '\u2666',
    oneSeventh: '1/7',
    oneNinth: '1/9',
    oneTenth: '1/10',
  },
  Zi = { ...Nt, ...Wt },
  en = { ...Nt, ...Xi },
  tn = Qi(),
  nn = tn ? Zi : en,
  B = nn,
  gr = Object.entries(Wt);
var jt = {
  prefix: { idle: U('blue', '?'), done: U('green', B.tick) },
  spinner: {
    interval: 80,
    frames: [
      '\u280B',
      '\u2819',
      '\u2839',
      '\u2838',
      '\u283C',
      '\u2834',
      '\u2826',
      '\u2827',
      '\u2807',
      '\u280F',
    ].map((i) => U('yellow', i)),
  },
  style: {
    answer: (i) => U('cyan', i),
    message: (i) => U('bold', i),
    error: (i) => U('red', `> ${i}`),
    defaultAnswer: (i) => U('dim', `(${i})`),
    help: (i) => U('dim', i),
    highlight: (i) => U('cyan', i),
    key: (i) => U('cyan', U('bold', `<${i}>`)),
  },
};
function Mt(i) {
  if (typeof i != 'object' || i === null) return !1;
  let e = i;
  for (; Object.getPrototypeOf(e) !== null; ) e = Object.getPrototypeOf(e);
  return Object.getPrototypeOf(i) === e;
}
function Gt(...i) {
  let e = {};
  for (let t of i)
    for (let [n, r] of Object.entries(t)) {
      let s = e[n];
      e[n] = Mt(s) && Mt(r) ? Gt(s, r) : r;
    }
  return e;
}
function H(...i) {
  let e = [jt, ...i.filter((t) => t != null)];
  return Gt(...e);
}
function K({ status: i = 'idle', theme: e }) {
  let [t, n] = A(!1),
    [r, s] = A(0),
    { prefix: o, spinner: a } = H(e);
  return (
    q(() => {
      if (i === 'loading') {
        let d,
          u = -1,
          l = setTimeout(() => {
            (n(!0),
              (d = setInterval(() => {
                ((u = u + 1), s(u % a.frames.length));
              }, a.interval)));
          }, 300);
        return () => {
          (clearTimeout(l), clearInterval(d));
        };
      } else n(!1);
    }, [i]),
    t
      ? a.frames[r]
      : typeof o == 'string'
        ? o
        : (o[i === 'loading' ? 'idle' : i] ?? o.idle)
  );
}
function ne(i, e) {
  return ae((t) => {
    let n = t.get();
    if (
      !n ||
      n.dependencies.length !== e.length ||
      n.dependencies.some((r, s) => r !== e[s])
    ) {
      let r = i();
      return (t.set({ value: r, dependencies: e }), r);
    }
    return n.value;
  });
}
function re(i) {
  return A({ current: i })[0];
}
function Y(i) {
  let e = re(i);
  ((e.current = i),
    q((t) => {
      let n = !1,
        r = Xe((s, o) => {
          n || e.current(o, t);
        });
      return (
        t.input.on('keypress', r),
        () => {
          ((n = !0), t.input.removeListener('keypress', r));
        }
      );
    }, []));
}
var ui = Le(Kt(), 1);
var Yt = (() => {
    let i = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    return (e) => {
      let t = 0;
      for (i.lastIndex = 0; i.test(e); ) t += 1;
      return e.length - t;
    };
  })(),
  Jt = (i) =>
    i === 12288 || (i >= 65281 && i <= 65376) || (i >= 65504 && i <= 65510),
  zt = (i) =>
    i === 8987 ||
    i === 9001 ||
    (i >= 12272 && i <= 12287) ||
    (i >= 12289 && i <= 12350) ||
    (i >= 12441 && i <= 12543) ||
    (i >= 12549 && i <= 12591) ||
    (i >= 12593 && i <= 12686) ||
    (i >= 12688 && i <= 12771) ||
    (i >= 12783 && i <= 12830) ||
    (i >= 12832 && i <= 12871) ||
    (i >= 12880 && i <= 19903) ||
    (i >= 65040 && i <= 65049) ||
    (i >= 65072 && i <= 65106) ||
    (i >= 65108 && i <= 65126) ||
    (i >= 65128 && i <= 65131) ||
    (i >= 127488 && i <= 127490) ||
    (i >= 127504 && i <= 127547) ||
    (i >= 127552 && i <= 127560) ||
    (i >= 131072 && i <= 196605) ||
    (i >= 196608 && i <= 262141);
var on =
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y,
  an = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y,
  Qt =
    /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/uy,
  ln = /\t{1,1000}/y,
  Xt = new RegExp(
    '[\\u{1F1E6}-\\u{1F1FF}]{2}|\\u{1F3F4}[\\u{E0061}-\\u{E007A}]{2}[\\u{E0030}-\\u{E0039}\\u{E0061}-\\u{E007A}]{1,3}\\u{E007F}|(?:\\p{Emoji}\\uFE0F\\u20E3?|\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation})(?:\\u200D(?:\\p{Emoji_Modifier_Base}\\p{Emoji_Modifier}?|\\p{Emoji_Presentation}|\\p{Emoji}\\uFE0F\\u20E3?))*',
    'yu',
  ),
  un = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y,
  cn = new RegExp('\\p{M}+', 'gu'),
  hn = { limit: 1 / 0, ellipsis: '' },
  Zt = (i, e = {}, t = {}) => {
    let n = e.limit ?? 1 / 0,
      r = e.ellipsis ?? '',
      s = e?.ellipsisWidth ?? (r ? Zt(r, hn, t).width : 0),
      o = 0,
      a = t.controlWidth ?? 0,
      c = t.tabWidth ?? 8,
      d = t.emojiWidth ?? 2,
      u = 2,
      l = t.regularWidth ?? 1,
      h = t.wideWidth ?? u,
      m = [
        [un, l],
        [on, o],
        [an, a],
        [ln, c],
        [Xt, d],
        [Qt, h],
      ],
      f = 0,
      g = 0,
      b = i.length,
      y = 0,
      _ = !1,
      E = b,
      S = Math.max(0, n - s),
      v = 0,
      L = 0,
      k = 0,
      I = 0;
    e: for (;;) {
      if (L > v || (g >= b && g > f)) {
        let p = i.slice(v, L) || i.slice(f, g);
        y = 0;
        for (let x of p.replaceAll(cn, '')) {
          let w = x.codePointAt(0) || 0;
          if (
            (Jt(w) ? (I = u) : zt(w) ? (I = h) : (I = l),
            k + I > S && (E = Math.min(E, Math.max(v, f) + y)),
            k + I > n)
          ) {
            _ = !0;
            break e;
          }
          ((y += x.length), (k += I));
        }
        v = L = 0;
      }
      if (g >= b) break e;
      for (let p = 0, x = m.length; p < x; p++) {
        let [w, O] = m[p];
        if (((w.lastIndex = g), w.test(i))) {
          if (
            ((y =
              w === Qt
                ? Yt(i.slice(g, w.lastIndex))
                : w === Xt
                  ? 1
                  : w.lastIndex - g),
            (I = y * O),
            k + I > S && (E = Math.min(E, g + Math.floor((S - k) / O))),
            k + I > n)
          ) {
            _ = !0;
            break e;
          }
          ((k += I), (v = f), (L = g), (g = f = w.lastIndex));
          continue e;
        }
      }
      g += 1;
    }
    return {
      width: _ ? S : k,
      index: _ ? E : b,
      truncated: _,
      ellipsed: _ && n >= s,
    };
  },
  ei = Zt;
var dn = { limit: 1 / 0, ellipsis: '', ellipsisWidth: 0 },
  pn = (i, e = {}) => ei(i, dn, e).width,
  J = pn;
var Ee = '\x1B',
  si = '\x9B',
  fn = 39,
  et = '\x07',
  oi = '[',
  mn = ']',
  ai = 'm',
  tt = `${mn}8;;`,
  ti = new RegExp(`(?:\\${oi}(?<code>\\d+)m|\\${tt}(?<uri>.*)${et})`, 'y'),
  ii = (i) => {
    if ((i >= 30 && i <= 37) || (i >= 90 && i <= 97)) return 39;
    if ((i >= 40 && i <= 47) || (i >= 100 && i <= 107)) return 49;
    if (i === 1 || i === 2) return 22;
    if (i === 3) return 23;
    if (i === 4) return 24;
    if (i === 7) return 27;
    if (i === 8) return 28;
    if (i === 9) return 29;
    if (i === 0) return 0;
  },
  ni = (i) => `${Ee}${oi}${i}${ai}`,
  ri = (i) => `${Ee}${tt}${i}${et}`,
  Ze = (i, e, t) => {
    let n = e[Symbol.iterator](),
      r = !1,
      s = !1,
      o = i.at(-1),
      a = o === void 0 ? 0 : J(o),
      c = n.next(),
      d = n.next(),
      u = 0;
    for (; !c.done; ) {
      let l = c.value,
        h = J(l);
      (a + h <= t ? (i[i.length - 1] += l) : (i.push(l), (a = 0)),
        (l === Ee || l === si) && ((r = !0), (s = e.startsWith(tt, u + 1))),
        r
          ? s
            ? l === et && ((r = !1), (s = !1))
            : l === ai && (r = !1)
          : ((a += h), a === t && !d.done && (i.push(''), (a = 0))),
        (c = d),
        (d = n.next()),
        (u += l.length));
    }
    ((o = i.at(-1)),
      !a &&
        o !== void 0 &&
        o.length &&
        i.length > 1 &&
        (i[i.length - 2] += i.pop()));
  },
  gn = (i) => {
    let e = i.split(' '),
      t = e.length;
    for (; t && !J(e[t - 1]); ) t--;
    return t === e.length ? i : e.slice(0, t).join(' ') + e.slice(t).join('');
  },
  _n = (i, e, t = {}) => {
    if (t.trim !== !1 && i.trim() === '') return '';
    let n = '',
      r,
      s,
      o = i.split(' '),
      a = [''],
      c = 0;
    for (let l = 0; l < o.length; l++) {
      let h = o[l];
      if (t.trim !== !1) {
        let f = a.at(-1) ?? '',
          g = f.trimStart();
        f.length !== g.length && ((a[a.length - 1] = g), (c = J(g)));
      }
      l !== 0 &&
        (c >= e &&
          (t.wordWrap === !1 || t.trim === !1) &&
          (a.push(''), (c = 0)),
        (c || t.trim === !1) && ((a[a.length - 1] += ' '), c++));
      let m = J(h);
      if (t.hard && m > e) {
        let f = e - c,
          g = 1 + Math.floor((m - f - 1) / e);
        (Math.floor((m - 1) / e) < g && a.push(''),
          Ze(a, h, e),
          (c = J(a.at(-1) ?? '')));
        continue;
      }
      if (c + m > e && c && m) {
        if (t.wordWrap === !1 && c < e) {
          (Ze(a, h, e), (c = J(a.at(-1) ?? '')));
          continue;
        }
        (a.push(''), (c = 0));
      }
      if (c + m > e && t.wordWrap === !1) {
        (Ze(a, h, e), (c = J(a.at(-1) ?? '')));
        continue;
      }
      ((a[a.length - 1] += h), (c += m));
    }
    t.trim !== !1 && (a = a.map((l) => gn(l)));
    let d = a.join(`
`),
      u = !1;
    for (let l = 0; l < d.length; l++) {
      let h = d[l];
      if (((n += h), u)) u = !1;
      else if (((u = h >= '\uD800' && h <= '\uDBFF'), u)) continue;
      if (h === Ee || h === si) {
        ti.lastIndex = l + 1;
        let f = ti.exec(d)?.groups;
        if (f?.code !== void 0) {
          let g = Number.parseFloat(f.code);
          r = g === fn ? void 0 : g;
        } else f?.uri !== void 0 && (s = f.uri.length === 0 ? void 0 : f.uri);
      }
      if (
        d[l + 1] ===
        `
`
      ) {
        s && (n += ri(''));
        let m = r ? ii(r) : void 0;
        r && m && (n += ni(m));
      } else
        h ===
          `
` && (r && ii(r) && (n += ni(r)), s && (n += ri(s)));
    }
    return n;
  },
  bn = /\r?\n/;
function li(i, e, t) {
  return String(i)
    .normalize()
    .split(bn)
    .map((n) => _n(n, e, t)).join(`
`);
}
function pe(i, e) {
  return i
    .split(`
`)
    .flatMap((t) =>
      li(t, e, { trim: !1, hard: !0 })
        .split(`
`)
        .map((n) => n.trimEnd()),
    ).join(`
`);
}
function Oe() {
  return (0, ui.default)({ defaultWidth: 80, output: Qe().output });
}
function xn({ active: i, renderedItems: e, pageSize: t, loop: n }) {
  let r = re({ lastPointer: i, lastActive: void 0 }),
    { lastPointer: s, lastActive: o } = r.current,
    a = Math.floor(t / 2),
    c = e.reduce((l, h) => l + h.length, 0),
    d = e.slice(0, i).reduce((l, h) => l + h.length, 0),
    u = d;
  if (c > t)
    if (n)
      ((u = s),
        o != null &&
          o < i &&
          i - o < t &&
          (u = Math.min(
            a,
            Math.abs(i - o) === 1
              ? Math.min(s + (e[o]?.length ?? 0), Math.max(d, s))
              : s + i - o,
          )));
    else {
      let l = e.slice(i).reduce((h, m) => h + m.length, 0);
      u = l < t - a ? t - l : Math.min(d, a);
    }
  return ((r.current.lastPointer = u), (r.current.lastActive = i), u);
}
function fe({ items: i, active: e, renderItem: t, pageSize: n, loop: r = !0 }) {
  let s = Oe(),
    o = (y) => ((y % i.length) + i.length) % i.length,
    a = i.map((y, _) =>
      y == null
        ? []
        : pe(t({ item: y, index: _, isActive: _ === e }), s).split(`
`),
    ),
    c = a.reduce((y, _) => y + _.length, 0),
    d = (y) => a[y] ?? [],
    u = xn({ active: e, renderedItems: a, pageSize: n, loop: r }),
    l = d(e).slice(0, n),
    h = u + l.length <= n ? u : n - l.length,
    m = Array.from({ length: n });
  m.splice(h, l.length, ...l);
  let f = new Set([e]),
    g = h + l.length,
    b = o(e + 1);
  for (; g < n && !f.has(b) && (r && c > n ? b !== e : b > e); ) {
    let _ = d(b).slice(0, n - g);
    (m.splice(g, _.length, ..._), f.add(b), (g += _.length), (b = o(b + 1)));
  }
  for (
    g = h - 1, b = o(e - 1);
    g >= 0 && !f.has(b) && (r && c > n ? b !== e : b < e);
  ) {
    let y = d(b),
      _ = y.slice(Math.max(0, y.length - g - 1));
    (m.splice(g - _.length + 1, _.length, ..._),
      f.add(b),
      (g -= _.length),
      (b = o(b - 1)));
  }
  return m.filter((y) => typeof y == 'string').join(`
`);
}
var _i = Le(hi(), 1);
import { AsyncResource as Sn } from 'node:async_hooks';
import * as gi from 'node:readline';
var se = [];
se.push('SIGHUP', 'SIGINT', 'SIGTERM');
process.platform !== 'win32' &&
  se.push(
    'SIGALRM',
    'SIGABRT',
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT',
  );
process.platform === 'linux' &&
  se.push('SIGIO', 'SIGPOLL', 'SIGPWR', 'SIGSTKFLT');
var Se = (i) =>
    !!i &&
    typeof i == 'object' &&
    typeof i.removeListener == 'function' &&
    typeof i.emit == 'function' &&
    typeof i.reallyExit == 'function' &&
    typeof i.listeners == 'function' &&
    typeof i.kill == 'function' &&
    typeof i.pid == 'number' &&
    typeof i.on == 'function',
  nt = Symbol.for('signal-exit emitter'),
  rt = globalThis,
  yn = Object.defineProperty.bind(Object),
  st = class {
    emitted = { afterExit: !1, exit: !1 };
    listeners = { afterExit: [], exit: [] };
    count = 0;
    id = Math.random();
    constructor() {
      if (rt[nt]) return rt[nt];
      yn(rt, nt, {
        value: this,
        writable: !1,
        enumerable: !1,
        configurable: !1,
      });
    }
    on(e, t) {
      this.listeners[e].push(t);
    }
    removeListener(e, t) {
      let n = this.listeners[e],
        r = n.indexOf(t);
      r !== -1 && (r === 0 && n.length === 1 ? (n.length = 0) : n.splice(r, 1));
    }
    emit(e, t, n) {
      if (this.emitted[e]) return !1;
      this.emitted[e] = !0;
      let r = !1;
      for (let s of this.listeners[e]) r = s(t, n) === !0 || r;
      return (e === 'exit' && (r = this.emit('afterExit', t, n) || r), r);
    }
  },
  Ae = class {},
  Cn = (i) => ({
    onExit(e, t) {
      return i.onExit(e, t);
    },
    load() {
      return i.load();
    },
    unload() {
      return i.unload();
    },
  }),
  ot = class extends Ae {
    onExit() {
      return () => {};
    }
    load() {}
    unload() {}
  },
  at = class extends Ae {
    #i = lt.platform === 'win32' ? 'SIGINT' : 'SIGHUP';
    #t = new st();
    #e;
    #s;
    #o;
    #r = {};
    #n = !1;
    constructor(e) {
      (super(), (this.#e = e), (this.#r = {}));
      for (let t of se)
        this.#r[t] = () => {
          let n = this.#e.listeners(t),
            { count: r } = this.#t,
            s = e;
          if (
            (typeof s.__signal_exit_emitter__ == 'object' &&
              typeof s.__signal_exit_emitter__.count == 'number' &&
              (r += s.__signal_exit_emitter__.count),
            n.length === r)
          ) {
            this.unload();
            let o = this.#t.emit('exit', null, t),
              a = t === 'SIGHUP' ? this.#i : t;
            o || e.kill(e.pid, a);
          }
        };
      ((this.#o = e.reallyExit), (this.#s = e.emit));
    }
    onExit(e, t) {
      if (!Se(this.#e)) return () => {};
      this.#n === !1 && this.load();
      let n = t?.alwaysLast ? 'afterExit' : 'exit';
      return (
        this.#t.on(n, e),
        () => {
          (this.#t.removeListener(n, e),
            this.#t.listeners.exit.length === 0 &&
              this.#t.listeners.afterExit.length === 0 &&
              this.unload());
        }
      );
    }
    load() {
      if (!this.#n) {
        ((this.#n = !0), (this.#t.count += 1));
        for (let e of se)
          try {
            let t = this.#r[e];
            t && this.#e.on(e, t);
          } catch {}
        ((this.#e.emit = (e, ...t) => this.#l(e, ...t)),
          (this.#e.reallyExit = (e) => this.#a(e)));
      }
    }
    unload() {
      this.#n &&
        ((this.#n = !1),
        se.forEach((e) => {
          let t = this.#r[e];
          if (!t) throw new Error('Listener not defined for signal: ' + e);
          try {
            this.#e.removeListener(e, t);
          } catch {}
        }),
        (this.#e.emit = this.#s),
        (this.#e.reallyExit = this.#o),
        (this.#t.count -= 1));
    }
    #a(e) {
      return Se(this.#e)
        ? ((this.#e.exitCode = e || 0),
          this.#t.emit('exit', this.#e.exitCode, null),
          this.#o.call(this.#e, this.#e.exitCode))
        : 0;
    }
    #l(e, ...t) {
      let n = this.#s;
      if (e === 'exit' && Se(this.#e)) {
        typeof t[0] == 'number' && (this.#e.exitCode = t[0]);
        let r = n.call(this.#e, e, ...t);
        return (this.#t.emit('exit', this.#e.exitCode, null), r);
      } else return n.call(this.#e, e, ...t);
    }
  },
  lt = globalThis.process,
  { onExit: di, load: Xr, unload: Zr } = Cn(Se(lt) ? new at(lt) : new ot());
import { stripVTControlCharacters as En } from 'node:util';
var De = '\x1B[?25l',
  fi = '\x1B[?25h',
  ut = (i = 1) => (i > 0 ? `\x1B[${i}A` : ''),
  ct = (i = 1) => (i > 0 ? `\x1B[${i}B` : ''),
  ht = (i, e) =>
    typeof e == 'number' && !Number.isNaN(e)
      ? `\x1B[${e + 1};${i + 1}H`
      : `\x1B[${i + 1}G`,
  pi = '\x1B[2K',
  dt = (i) => (i > 0 ? (pi + ut(1)).repeat(i - 1) + pi + '\x1B[G' : '');
var mi = (i) =>
    i.split(`
`).length,
  On = (i) =>
    i
      .split(`
`)
      .pop() ?? '',
  me = class {
    height = 0;
    extraLinesUnderPrompt = 0;
    cursorPos;
    rl;
    constructor(e) {
      ((this.rl = e), (this.cursorPos = e.getCursorPos()));
    }
    write(e) {
      (this.rl.output.unmute(), this.rl.output.write(e), this.rl.output.mute());
    }
    render(e, t = '') {
      let n = On(e),
        r = En(n),
        s = r;
      (this.rl.line.length > 0 && (s = s.slice(0, -this.rl.line.length)),
        this.rl.setPrompt(s),
        (this.cursorPos = this.rl.getCursorPos()));
      let o = Oe();
      ((e = pe(e, o)),
        (t = pe(t, o)),
        r.length % o === 0 &&
          (e += `
`));
      let a =
          e +
          (t
            ? `
` + t
            : ''),
        d = Math.floor(r.length / o) - this.cursorPos.rows + (t ? mi(t) : 0);
      (d > 0 && (a += ut(d)),
        (a += ht(this.cursorPos.cols)),
        this.write(ct(this.extraLinesUnderPrompt) + dt(this.height) + a),
        (this.extraLinesUnderPrompt = d),
        (this.height = mi(a)));
    }
    checkCursorPos() {
      let e = this.rl.getCursorPos();
      e.cols !== this.cursorPos.cols &&
        (this.write(ht(e.cols)), (this.cursorPos = e));
    }
    done({ clearContent: e }) {
      this.rl.setPrompt('');
      let t = ct(this.extraLinesUnderPrompt);
      ((t += e
        ? dt(this.height)
        : `
`),
        (t += fi),
        this.write(t),
        this.rl.close());
    }
  };
var ve = class extends Promise {
  static withResolver() {
    let e, t;
    return {
      promise: new Promise((r, s) => {
        ((e = r), (t = s));
      }),
      resolve: e,
      reject: t,
    };
  }
};
var An = globalThis.setImmediate;
function Dn() {
  let i = Error.prepareStackTrace,
    e = [];
  try {
    ((Error.prepareStackTrace = (t, n) => {
      let r = n.slice(1);
      return ((e = r), r);
    }),
      new Error().stack);
  } catch {
    return e;
  }
  return ((Error.prepareStackTrace = i), e);
}
function z(i) {
  let e = Dn();
  return (n, r = {}) => {
    let { input: s = process.stdin, signal: o } = r,
      a = new Set(),
      c = new _i.default();
    (c.pipe(r.output ?? process.stdout), c.mute());
    let d = gi.createInterface({ terminal: !0, input: s, output: c }),
      u = new me(d),
      { promise: l, resolve: h, reject: m } = ve.withResolver(),
      f = () => m(new ye());
    if (o) {
      let b = () => m(new we({ cause: o.reason }));
      if (o.aborted) return (b(), Object.assign(l, { cancel: f }));
      (o.addEventListener('abort', b),
        a.add(() => o.removeEventListener('abort', b)));
    }
    a.add(
      di((b, y) => {
        m(new de(`User force closed the prompt with ${b} ${y}`));
      }),
    );
    let g = () => m(new de('User force closed the prompt with SIGINT'));
    return (
      d.on('SIGINT', g),
      a.add(() => d.removeListener('SIGINT', g)),
      Ht(d, (b) => {
        let y = Sn.bind(() => ie.clearAll());
        (d.on('close', y), a.add(() => d.removeListener('close', y)));
        let _ = () => {
          let E = () => u.checkCursorPos();
          (d.input.on('keypress', E),
            a.add(() => d.input.removeListener('keypress', E)),
            b(() => {
              try {
                let S = i(n, (k) => {
                  setImmediate(() => h(k));
                });
                if (S === void 0) {
                  let k = e[1]?.getFileName();
                  throw new Error(`Prompt functions must return a string.
    at ${k}`);
                }
                let [v, L] = typeof S == 'string' ? [S] : S;
                (u.render(v, L), ie.run());
              } catch (S) {
                m(S);
              }
            }));
        };
        return (
          'readableFlowing' in s ? An(_) : _(),
          Object.assign(
            l
              .then(
                (E) => (ie.clearAll(), E),
                (E) => {
                  throw (ie.clearAll(), E);
                },
              )
              .finally(() => {
                (a.forEach((E) => E()),
                  u.done({ clearContent: !!r.clearPromptOnDone }),
                  c.end());
              })
              .then(() => l),
            { cancel: f },
          )
        );
      })
    );
  };
}
import { styleText as vn } from 'node:util';
var D = class {
  separator = vn('dim', Array.from({ length: 15 }).join(B.line));
  type = 'separator';
  constructor(e) {
    e && (this.separator = e);
  }
  static isSeparator(e) {
    return !!(
      e &&
      typeof e == 'object' &&
      'type' in e &&
      e.type === 'separator'
    );
  }
};
import { styleText as oe } from 'node:util';
var kn = {
  icon: {
    checked: oe('green', B.circleFilled),
    unchecked: B.circle,
    cursor: B.pointer,
    disabledChecked: oe('green', B.circleDouble),
    disabledUnchecked: '-',
  },
  style: {
    disabled: (i) => oe('dim', i),
    renderSelectedChoices: (i) => i.map((e) => e.short).join(', '),
    description: (i) => oe('cyan', i),
    keysHelpTip: (i) =>
      i
        .map(([e, t]) => `${oe('bold', e)} ${oe('dim', t)}`)
        .join(oe('dim', ' \u2022 ')),
  },
  i18n: { disabledError: 'This option is disabled and cannot be toggled.' },
  keybindings: [],
};
function ke(i) {
  return !D.isSeparator(i) && !i.disabled;
}
function pt(i) {
  return !D.isSeparator(i);
}
function bi(i) {
  return !D.isSeparator(i) && i.checked;
}
function ft(i) {
  return ke(i) ? { ...i, checked: !i.checked } : i;
}
function Tn(i) {
  return function (e) {
    return ke(e) ? { ...e, checked: i } : e;
  };
}
function Ln(i) {
  return i.map((e) => {
    if (D.isSeparator(e)) return e;
    if (typeof e == 'string')
      return {
        value: e,
        name: e,
        short: e,
        checkedName: e,
        disabled: !1,
        checked: !1,
      };
    let t = e.name ?? String(e.value),
      n = {
        value: e.value,
        name: t,
        short: e.short ?? t,
        checkedName: e.checkedName ?? t,
        disabled: e.disabled ?? !1,
        checked: e.checked ?? !1,
      };
    return (e.description && (n.description = e.description), n);
  });
}
var mt = z((i, e) => {
  let {
      pageSize: t = 7,
      loop: n = !0,
      required: r,
      validate: s = () => !0,
    } = i,
    o = { all: 'a', invert: 'i', ...i.shortcuts },
    a = H(kn, i.theme),
    { keybindings: c } = a,
    [d, u] = A('idle'),
    l = K({ status: d, theme: a }),
    [h, m] = A(Ln(i.choices)),
    f = ne(() => {
      let p = h.findIndex(pt),
        x = h.findLastIndex(pt);
      if (p === -1)
        throw new Q(
          '[checkbox prompt] No selectable choices. All choices are disabled.',
        );
      return { first: p, last: x };
    }, [h]),
    [g, b] = A(f.first),
    [y, _] = A();
  Y(async (p) => {
    if (G(p)) {
      let x = h.filter(bi),
        w = await s([...x]);
      r && !x.length
        ? _('At least one choice must be selected')
        : w === !0
          ? (u('done'), e(x.map((O) => O.value)))
          : _(w || 'You must select a valid value');
    } else if (M(p, c) || ee(p, c)) {
      if (
        (y && _(void 0),
        n || (M(p, c) && g !== f.first) || (ee(p, c) && g !== f.last))
      ) {
        let x = M(p, c) ? -1 : 1,
          w = g;
        do w = (w + x + h.length) % h.length;
        while (!pt(h[w]));
        b(w);
      }
    } else if (ze(p)) {
      let x = h[g];
      x &&
        !D.isSeparator(x) &&
        (x.disabled
          ? _(a.i18n.disabledError)
          : (_(void 0), m(h.map((w, O) => (O === g ? ft(w) : w)))));
    } else if (p.name === o.all) {
      let x = h.some((w) => ke(w) && !w.checked);
      m(h.map(Tn(x)));
    } else if (p.name === o.invert) m(h.map(ft));
    else if (he(p)) {
      let x = Number(p.name) - 1,
        w = -1,
        O = h.findIndex((W) => (D.isSeparator(W) ? !1 : (w++, w === x))),
        T = h[O];
      T && ke(T) && (b(O), m(h.map((W, P) => (P === O ? ft(W) : W))));
    }
  });
  let E = a.style.message(i.message, d),
    S,
    v = fe({
      items: h,
      active: g,
      renderItem({ item: p, isActive: x }) {
        if (D.isSeparator(p)) return ` ${p.separator}`;
        let w = x ? a.icon.cursor : ' ';
        if (p.disabled) {
          let P = typeof p.disabled == 'string' ? p.disabled : '(disabled)',
            Te = p.checked ? a.icon.disabledChecked : a.icon.disabledUnchecked;
          return a.style.disabled(`${w}${Te} ${p.name} ${P}`);
        }
        x && (S = p.description);
        let O = p.checked ? a.icon.checked : a.icon.unchecked,
          T = p.checked ? p.checkedName : p.name;
        return (x ? a.style.highlight : (P) => P)(`${w}${O} ${T}`);
      },
      pageSize: t,
      loop: n,
    });
  if (d === 'done') {
    let p = h.filter(bi),
      x = a.style.answer(a.style.renderSelectedChoices(p, h));
    return [l, E, x].filter(Boolean).join(' ');
  }
  let L = [
    ['\u2191\u2193', 'navigate'],
    ['space', 'select'],
  ];
  (o.all && L.push([o.all, 'all']),
    o.invert && L.push([o.invert, 'invert']),
    L.push(['\u23CE', 'submit']));
  let k = a.style.keysHelpTip(L);
  return `${[
    [l, E].filter(Boolean).join(' '),
    v,
    ' ',
    S ? a.style.description(S) : '',
    y ? a.style.error(y) : '',
    k,
  ]
    .filter(Boolean)
    .join(`
`)
    .trimEnd()}${De}`;
});
function xi(i, e) {
  let t = e !== !1;
  return (/^(y|yes)/i.test(i) ? (t = !0) : /^(n|no)/i.test(i) && (t = !1), t);
}
function wi(i) {
  return i ? 'Yes' : 'No';
}
var gt = z((i, e) => {
  let { transformer: t = wi } = i,
    [n, r] = A('idle'),
    [s, o] = A(''),
    a = H(i.theme),
    c = K({ status: n, theme: a });
  Y((h, m) => {
    if (n === 'idle')
      if (G(h)) {
        let f = xi(s, i.default);
        (o(t(f)), r('done'), e(f));
      } else if (ce(h)) {
        let f = wi(!xi(s, i.default));
        (m.clearLine(0), m.write(f), o(f));
      } else o(m.line);
  });
  let d = s,
    u = '';
  n === 'done'
    ? (d = a.style.answer(s))
    : (u = ` ${a.style.defaultAnswer(i.default === !1 ? 'y/N' : 'Y/n')}`);
  let l = a.style.message(i.message, n);
  return `${c} ${l}${u} ${d}`;
});
var Fn = { validationFailureMode: 'keep' },
  _t = z((i, e) => {
    let { prefill: t = 'tab' } = i,
      n = H(Fn, i.theme),
      [r, s] = A('idle'),
      [o, a] = A(String(i.default ?? '')),
      [c, d] = A(),
      [u, l] = A(''),
      h = K({ status: r, theme: n });
    async function m(_) {
      let { required: E, pattern: S, patternError: v = 'Invalid input' } = i;
      return E && !_
        ? 'You must provide a value'
        : S && !S.test(_)
          ? v
          : typeof i.validate == 'function'
            ? (await i.validate(_)) || 'You must provide a valid value'
            : !0;
    }
    (Y(async (_, E) => {
      if (r === 'idle')
        if (G(_)) {
          let S = u || o;
          s('loading');
          let v = await m(S);
          v === !0
            ? (l(S), s('done'), e(S))
            : (n.validationFailureMode === 'clear' ? l('') : E.write(u),
              d(v),
              s('idle'));
        } else
          ue(_) && !u
            ? a('')
            : ce(_) && !u
              ? (a(''), E.clearLine(0), E.write(o), l(o))
              : (l(E.line), d(void 0));
    }),
      q((_) => {
        t === 'editable' && o && (_.write(o), l(o));
      }, []));
    let f = n.style.message(i.message, r),
      g = u;
    typeof i.transformer == 'function'
      ? (g = i.transformer(u, { isFinal: r === 'done' }))
      : r === 'done' && (g = n.style.answer(u));
    let b;
    o && r !== 'done' && !u && (b = n.style.defaultAnswer(o));
    let y = '';
    return (
      c && (y = n.style.error(c)),
      [[h, f, b, g].filter((_) => _ !== void 0).join(' '), y]
    );
  });
import { styleText as ge } from 'node:util';
var In = {
  icon: { cursor: B.pointer },
  style: {
    disabled: (i) => ge('dim', i),
    description: (i) => ge('cyan', i),
    keysHelpTip: (i) =>
      i
        .map(([e, t]) => `${ge('bold', e)} ${ge('dim', t)}`)
        .join(ge('dim', ' \u2022 ')),
  },
  i18n: { disabledError: 'This option is disabled and cannot be selected.' },
  indexMode: 'hidden',
  keybindings: [],
};
function bt(i) {
  return !D.isSeparator(i) && !i.disabled;
}
function xt(i) {
  return !D.isSeparator(i);
}
function $n(i) {
  return i.map((e) => {
    if (D.isSeparator(e)) return e;
    if (typeof e != 'object' || e === null || !('value' in e)) {
      let r = String(e);
      return { value: e, name: r, short: r, disabled: !1 };
    }
    let t = e.name ?? String(e.value),
      n = {
        value: e.value,
        name: t,
        short: e.short ?? t,
        disabled: e.disabled ?? !1,
      };
    return (e.description && (n.description = e.description), n);
  });
}
var X = z((i, e) => {
  let { loop: t = !0, pageSize: n = 7 } = i,
    r = H(In, i.theme),
    { keybindings: s } = r,
    [o, a] = A('idle'),
    c = K({ status: o, theme: r }),
    d = re(),
    u = !s.includes('vim'),
    l = ne(() => $n(i.choices), [i.choices]),
    h = ne(() => {
      let p = l.findIndex(xt),
        x = l.findLastIndex(xt);
      if (p === -1)
        throw new Q(
          '[select prompt] No selectable choices. All choices are disabled.',
        );
      return { first: p, last: x };
    }, [l]),
    m = ne(
      () =>
        'default' in i
          ? l.findIndex((p) => bt(p) && p.value === i.default)
          : -1,
      [i.default, l],
    ),
    [f, g] = A(m === -1 ? h.first : m),
    b = l[f],
    [y, _] = A();
  (Y((p, x) => {
    if ((clearTimeout(d.current), y && _(void 0), G(p)))
      b.disabled ? _(r.i18n.disabledError) : (a('done'), e(b.value));
    else if (M(p, s) || ee(p, s)) {
      if (
        (x.clearLine(0),
        t || (M(p, s) && f !== h.first) || (ee(p, s) && f !== h.last))
      ) {
        let w = M(p, s) ? -1 : 1,
          O = f;
        do O = (O + w + l.length) % l.length;
        while (!xt(l[O]));
        g(O);
      }
    } else if (he(p) && !Number.isNaN(Number(x.line))) {
      let w = Number(x.line) - 1,
        O = -1,
        T = l.findIndex((P) => (D.isSeparator(P) ? !1 : (O++, O === w))),
        W = l[T];
      (W != null && bt(W) && g(T),
        (d.current = setTimeout(() => {
          x.clearLine(0);
        }, 700)));
    } else if (ue(p)) x.clearLine(0);
    else if (u) {
      let w = x.line.toLowerCase(),
        O = l.findIndex((T) =>
          D.isSeparator(T) || !bt(T) ? !1 : T.name.toLowerCase().startsWith(w),
        );
      (O !== -1 && g(O),
        (d.current = setTimeout(() => {
          x.clearLine(0);
        }, 700)));
    }
  }),
    q(
      () => () => {
        clearTimeout(d.current);
      },
      [],
    ));
  let E = r.style.message(i.message, o),
    S = r.style.keysHelpTip([
      ['\u2191\u2193', 'navigate'],
      ['\u23CE', 'select'],
    ]),
    v = 0,
    L = fe({
      items: l,
      active: f,
      renderItem({ item: p, isActive: x, index: w }) {
        if (D.isSeparator(p)) return (v++, ` ${p.separator}`);
        let O = x ? r.icon.cursor : ' ',
          T = r.indexMode === 'number' ? `${w + 1 - v}. ` : '';
        if (p.disabled) {
          let P = typeof p.disabled == 'string' ? p.disabled : '(disabled)',
            Te = x ? r.icon.cursor : '-';
          return r.style.disabled(`${Te} ${T}${p.name} ${P}`);
        }
        return (x ? r.style.highlight : (P) => P)(`${O} ${T}${p.name}`);
      },
      pageSize: n,
      loop: t,
    });
  if (o === 'done')
    return [c, E, r.style.answer(b.short)].filter(Boolean).join(' ');
  let { description: k } = b;
  return `${[
    [c, E].filter(Boolean).join(' '),
    L,
    ' ',
    k ? r.style.description(k) : '',
    y ? r.style.error(y) : '',
    S,
  ]
    .filter(Boolean)
    .join(`
`)
    .trimEnd()}${De}`;
});
import Rn from 'node:path';
function yi(i) {
  return {
    formatters: {
      css: 'dprint',
      html: 'oxfmt',
      react: 'oxfmt',
      svelte: 'oxfmt',
      typescript: 'oxfmt',
      vue: 'oxfmt',
    },
    framework: null,
    gitUtil: ['lint-staged'],
    linter: 'oxlint',
    monorepo: !1,
    projectName: Rn.basename(i) || 'my-project',
  };
}
async function Ci(
  i,
  {
    formatters: e,
    framework: t,
    gitUtil: n,
    linter: r,
    monorepo: s,
    projectName: o,
  },
) {}
async function Bn(i, e) {
  let t = e.formatters.css,
    n = e.formatters.html,
    r = e.formatters.react,
    s = e.formatters.svelte,
    o = e.formatters.typescript,
    a = e.formatters.vue,
    c,
    d = null,
    u = { css: t, html: n, react: r, svelte: s, typescript: o, vue: a };
  switch (
    ((o = await X({
      choices: [
        { value: 'dprint' },
        { value: 'oxfmt' },
        { name: 'none', value: null },
      ],
      default: o,
      message: 'Formatter for TypeScript?',
    })),
    i)
  ) {
    case 'react':
    case 'svelte':
    case 'vue': {
      ((d = await X({
        choices: [
          { value: 'dprint' },
          { value: 'oxfmt' },
          { name: 'none', value: null },
        ],
        default: u[i],
        message: `Formatter for ${i.toUpperCase()}?`,
      })),
        (c = i));
      break;
    }
  }
  return (
    (n = await X({
      choices: [
        { value: 'dprint' },
        { value: 'oxfmt' },
        { name: 'none', value: null },
      ],
      default: n,
      message: 'Formatter for HTML?',
    })),
    (t = await X({
      choices: [
        { value: 'dprint' },
        { value: 'oxfmt' },
        { name: 'none', value: null },
      ],
      default: t,
      message: 'Formatter for CSS?',
    })),
    c ? { ...u, [c]: d } : u
  );
}
async function Un(i, e) {
  let t = yi(i);
  if (e) return t;
  let n = await _t({ default: t.projectName, message: 'Project name?' }),
    r = await X({
      choices: [
        { disabled: !0, value: 'react' },
        { disabled: !0, value: 'vue' },
        { disabled: !0, value: 'svelte' },
        { disabled: !0, value: 'vite' },
        { name: 'none', value: null },
      ],
      default: t.framework,
      message: 'Framework?',
    }),
    s = await gt({ default: r ? !0 : t.monorepo, message: 'Monorepo?' }),
    o = await X({
      choices: [
        { value: 'oxlint' },
        { disabled: !0, name: 'eslint (deprecated)', value: 'eslint' },
        { name: 'none', value: null },
      ],
      default: t.linter,
      message: 'Linter?',
    }),
    a = await Bn(r, t),
    c = await mt({
      choices: [
        { checked: t.gitUtil.includes('lint-staged'), value: 'lint-staged' },
        { checked: t.gitUtil.includes('commitlint'), value: 'commitlint' },
      ],
      message: 'Utils for Git?',
    });
  return {
    formatters: a,
    framework: r,
    gitUtil: c,
    linter: o,
    monorepo: s,
    projectName: n,
  };
}
var Ei = new Rt('create')
  .option('-d, --dir <dir>', 'working directory', process.cwd())
  .option('-y, --yes', 'execute without any prompts', !1)
  .action(async ({ dir: i, yes: e }) => {
    await Ci(i, await Un(i, e));
  });
async function Oi(i) {
  (Je.name('scaffold').version(Bt.version).addCommand(Ei, { isDefault: !0 }),
    await Je.parseAsync(i));
}
process.argv[1] === '-'
  ? console.log(Hn(0, 'utf-8'))
  : await Oi(process.argv.slice(2));
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9saWIvZXJyb3IuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9saWIvYXJndW1lbnQuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9saWIvaGVscC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29tbWFuZGVyL2xpYi9vcHRpb24uanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9saWIvc3VnZ2VzdFNpbWlsYXIuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvbW1hbmRlci9saWIvY29tbWFuZC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29tbWFuZGVyL2luZGV4LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AY29tbWFuZGVyLWpzL2V4dHJhLXR5cGluZ3MvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NsaS13aWR0aC9pbmRleC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbXV0ZS1zdHJlYW0vbGliL2luZGV4LmpzIiwgImJpbi50cyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGNvbW1hbmRlci1qcy9leHRyYS10eXBpbmdzL2VzbS5tanMiLCAiLi4vcGFja2FnZS5qc29uIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi9rZXkuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9jb3JlL2Rpc3QvbGliL2Vycm9ycy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvcmUvZGlzdC9saWIvdXNlLXN0YXRlLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi9ob29rLWVuZ2luZS5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvcmUvZGlzdC9saWIvdXNlLWVmZmVjdC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvcmUvZGlzdC9saWIvdGhlbWUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9maWd1cmVzL2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9jb3JlL2Rpc3QvbGliL21ha2UtdGhlbWUuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9jb3JlL2Rpc3QvbGliL3VzZS1wcmVmaXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9jb3JlL2Rpc3QvbGliL3VzZS1tZW1vLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi91c2UtcmVmLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi91c2Uta2V5cHJlc3MuanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9jb3JlL2Rpc3QvbGliL3V0aWxzLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9mYXN0LXN0cmluZy10cnVuY2F0ZWQtd2lkdGgvZGlzdC91dGlscy5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZmFzdC1zdHJpbmctdHJ1bmNhdGVkLXdpZHRoL2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3Qtc3RyaW5nLXdpZHRoL2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Zhc3Qtd3JhcC1hbnNpL3NyYy9tYWluLnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi9wYWdpbmF0aW9uL3VzZS1wYWdpbmF0aW9uLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi9jcmVhdGUtcHJvbXB0LmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9zaWduYWwtZXhpdC9zcmMvc2lnbmFscy50cyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvc2lnbmFsLWV4aXQvc3JjL2luZGV4LnRzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY29yZS9kaXN0L2xpYi9zY3JlZW4tbWFuYWdlci5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2Fuc2kvZGlzdC9pbmRleC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvcmUvZGlzdC9saWIvcHJvbWlzZS1wb2x5ZmlsbC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvcmUvZGlzdC9saWIvU2VwYXJhdG9yLmpzIiwgIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW5xdWlyZXIvY2hlY2tib3gvZGlzdC9pbmRleC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2NvbmZpcm0vZGlzdC9pbmRleC5qcyIsICIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGlucXVpcmVyL2lucHV0L2Rpc3QvaW5kZXguanMiLCAiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnF1aXJlci9zZWxlY3QvZGlzdC9pbmRleC5qcyIsICIuLi9zcmMvcGFja2FnZXMvY3JlYXRlLXNjYWZmb2xkLnRzIiwgIi4uL3NyYy9jbGkvY29tbWFuZHMvY3JlYXRlLnRzIiwgIi4uL3NyYy9jbGkvbWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLyoqXG4gKiBDb21tYW5kZXJFcnJvciBjbGFzc1xuICovXG5jbGFzcyBDb21tYW5kZXJFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgdGhlIENvbW1hbmRlckVycm9yIGNsYXNzXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBleGl0Q29kZSBzdWdnZXN0ZWQgZXhpdCBjb2RlIHdoaWNoIGNvdWxkIGJlIHVzZWQgd2l0aCBwcm9jZXNzLmV4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgYW4gaWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXJyb3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yXG4gICAqL1xuICBjb25zdHJ1Y3RvcihleGl0Q29kZSwgY29kZSwgbWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgIC8vIHByb3Blcmx5IGNhcHR1cmUgc3RhY2sgdHJhY2UgaW4gTm9kZS5qc1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICAgIHRoaXMuZXhpdENvZGUgPSBleGl0Q29kZTtcbiAgICB0aGlzLm5lc3RlZEVycm9yID0gdW5kZWZpbmVkO1xuICB9XG59XG5cbi8qKlxuICogSW52YWxpZEFyZ3VtZW50RXJyb3IgY2xhc3NcbiAqL1xuY2xhc3MgSW52YWxpZEFyZ3VtZW50RXJyb3IgZXh0ZW5kcyBDb21tYW5kZXJFcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIHRoZSBJbnZhbGlkQXJndW1lbnRFcnJvciBjbGFzc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW21lc3NhZ2VdIGV4cGxhbmF0aW9uIG9mIHdoeSBhcmd1bWVudCBpcyBpbnZhbGlkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG4gICAgc3VwZXIoMSwgJ2NvbW1hbmRlci5pbnZhbGlkQXJndW1lbnQnLCBtZXNzYWdlKTtcbiAgICAvLyBwcm9wZXJseSBjYXB0dXJlIHN0YWNrIHRyYWNlIGluIE5vZGUuanNcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gIH1cbn1cblxuZXhwb3J0cy5Db21tYW5kZXJFcnJvciA9IENvbW1hbmRlckVycm9yO1xuZXhwb3J0cy5JbnZhbGlkQXJndW1lbnRFcnJvciA9IEludmFsaWRBcmd1bWVudEVycm9yO1xuIiwgImNvbnN0IHsgSW52YWxpZEFyZ3VtZW50RXJyb3IgfSA9IHJlcXVpcmUoJy4vZXJyb3IuanMnKTtcblxuY2xhc3MgQXJndW1lbnQge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBjb21tYW5kIGFyZ3VtZW50IHdpdGggdGhlIGdpdmVuIG5hbWUgYW5kIGRlc2NyaXB0aW9uLlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0aGF0IHRoZSBhcmd1bWVudCBpcyByZXF1aXJlZCwgYW5kIHlvdSBjYW4gZXhwbGljaXRseVxuICAgKiBpbmRpY2F0ZSB0aGlzIHdpdGggPD4gYXJvdW5kIHRoZSBuYW1lLiBQdXQgW10gYXJvdW5kIHRoZSBuYW1lIGZvciBhbiBvcHRpb25hbCBhcmd1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICovXG5cbiAgY29uc3RydWN0b3IobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gfHwgJyc7XG4gICAgdGhpcy52YXJpYWRpYyA9IGZhbHNlO1xuICAgIHRoaXMucGFyc2VBcmcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWVEZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmFyZ0Nob2ljZXMgPSB1bmRlZmluZWQ7XG5cbiAgICBzd2l0Y2ggKG5hbWVbMF0pIHtcbiAgICAgIGNhc2UgJzwnOiAvLyBlLmcuIDxyZXF1aXJlZD5cbiAgICAgICAgdGhpcy5yZXF1aXJlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lLnNsaWNlKDEsIC0xKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdbJzogLy8gZS5nLiBbb3B0aW9uYWxdXG4gICAgICAgIHRoaXMucmVxdWlyZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWUuc2xpY2UoMSwgLTEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMucmVxdWlyZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9uYW1lID0gbmFtZTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX25hbWUuZW5kc1dpdGgoJy4uLicpKSB7XG4gICAgICB0aGlzLnZhcmlhZGljID0gdHJ1ZTtcbiAgICAgIHRoaXMuX25hbWUgPSB0aGlzLl9uYW1lLnNsaWNlKDAsIC0zKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFyZ3VtZW50IG5hbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cbiAgbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFja2FnZVxuICAgKi9cblxuICBfY29sbGVjdFZhbHVlKHZhbHVlLCBwcmV2aW91cykge1xuICAgIGlmIChwcmV2aW91cyA9PT0gdGhpcy5kZWZhdWx0VmFsdWUgfHwgIUFycmF5LmlzQXJyYXkocHJldmlvdXMpKSB7XG4gICAgICByZXR1cm4gW3ZhbHVlXTtcbiAgICB9XG5cbiAgICBwcmV2aW91cy5wdXNoKHZhbHVlKTtcbiAgICByZXR1cm4gcHJldmlvdXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkZWZhdWx0IHZhbHVlLCBhbmQgb3B0aW9uYWxseSBzdXBwbHkgdGhlIGRlc2NyaXB0aW9uIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgaGVscC5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtBcmd1bWVudH1cbiAgICovXG5cbiAgZGVmYXVsdCh2YWx1ZSwgZGVzY3JpcHRpb24pIHtcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuZGVmYXVsdFZhbHVlRGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1c3RvbSBoYW5kbGVyIGZvciBwcm9jZXNzaW5nIENMSSBjb21tYW5kIGFyZ3VtZW50cyBpbnRvIGFyZ3VtZW50IHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICAgKiBAcmV0dXJuIHtBcmd1bWVudH1cbiAgICovXG5cbiAgYXJnUGFyc2VyKGZuKSB7XG4gICAgdGhpcy5wYXJzZUFyZyA9IGZuO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE9ubHkgYWxsb3cgYXJndW1lbnQgdmFsdWUgdG8gYmUgb25lIG9mIGNob2ljZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHZhbHVlc1xuICAgKiBAcmV0dXJuIHtBcmd1bWVudH1cbiAgICovXG5cbiAgY2hvaWNlcyh2YWx1ZXMpIHtcbiAgICB0aGlzLmFyZ0Nob2ljZXMgPSB2YWx1ZXMuc2xpY2UoKTtcbiAgICB0aGlzLnBhcnNlQXJnID0gKGFyZywgcHJldmlvdXMpID0+IHtcbiAgICAgIGlmICghdGhpcy5hcmdDaG9pY2VzLmluY2x1ZGVzKGFyZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRBcmd1bWVudEVycm9yKFxuICAgICAgICAgIGBBbGxvd2VkIGNob2ljZXMgYXJlICR7dGhpcy5hcmdDaG9pY2VzLmpvaW4oJywgJyl9LmAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52YXJpYWRpYykge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGVjdFZhbHVlKGFyZywgcHJldmlvdXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZztcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYXJndW1lbnQgcmVxdWlyZWQuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcmd1bWVudH1cbiAgICovXG4gIGFyZ1JlcXVpcmVkKCkge1xuICAgIHRoaXMucmVxdWlyZWQgPSB0cnVlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ha2UgYXJndW1lbnQgb3B0aW9uYWwuXG4gICAqXG4gICAqIEByZXR1cm5zIHtBcmd1bWVudH1cbiAgICovXG4gIGFyZ09wdGlvbmFsKCkge1xuICAgIHRoaXMucmVxdWlyZWQgPSBmYWxzZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vKipcbiAqIFRha2VzIGFuIGFyZ3VtZW50IGFuZCByZXR1cm5zIGl0cyBodW1hbiByZWFkYWJsZSBlcXVpdmFsZW50IGZvciBoZWxwIHVzYWdlLlxuICpcbiAqIEBwYXJhbSB7QXJndW1lbnR9IGFyZ1xuICogQHJldHVybiB7c3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBodW1hblJlYWRhYmxlQXJnTmFtZShhcmcpIHtcbiAgY29uc3QgbmFtZU91dHB1dCA9IGFyZy5uYW1lKCkgKyAoYXJnLnZhcmlhZGljID09PSB0cnVlID8gJy4uLicgOiAnJyk7XG5cbiAgcmV0dXJuIGFyZy5yZXF1aXJlZCA/ICc8JyArIG5hbWVPdXRwdXQgKyAnPicgOiAnWycgKyBuYW1lT3V0cHV0ICsgJ10nO1xufVxuXG5leHBvcnRzLkFyZ3VtZW50ID0gQXJndW1lbnQ7XG5leHBvcnRzLmh1bWFuUmVhZGFibGVBcmdOYW1lID0gaHVtYW5SZWFkYWJsZUFyZ05hbWU7XG4iLCAiY29uc3QgeyBodW1hblJlYWRhYmxlQXJnTmFtZSB9ID0gcmVxdWlyZSgnLi9hcmd1bWVudC5qcycpO1xuXG4vKipcbiAqIFR5cGVTY3JpcHQgaW1wb3J0IHR5cGVzIGZvciBKU0RvYywgdXNlZCBieSBWaXN1YWwgU3R1ZGlvIENvZGUgSW50ZWxsaVNlbnNlIGFuZCBgbnBtIHJ1biB0eXBlc2NyaXB0LWNoZWNrSlNgXG4gKiBodHRwczovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvZG9jcy9oYW5kYm9vay9qc2RvYy1zdXBwb3J0ZWQtdHlwZXMuaHRtbCNpbXBvcnQtdHlwZXNcbiAqIEB0eXBlZGVmIHsgaW1wb3J0KFwiLi9hcmd1bWVudC5qc1wiKS5Bcmd1bWVudCB9IEFyZ3VtZW50XG4gKiBAdHlwZWRlZiB7IGltcG9ydChcIi4vY29tbWFuZC5qc1wiKS5Db21tYW5kIH0gQ29tbWFuZFxuICogQHR5cGVkZWYgeyBpbXBvcnQoXCIuL29wdGlvbi5qc1wiKS5PcHRpb24gfSBPcHRpb25cbiAqL1xuXG4vLyBBbHRob3VnaCB0aGlzIGlzIGEgY2xhc3MsIG1ldGhvZHMgYXJlIHN0YXRpYyBpbiBzdHlsZSB0byBhbGxvdyBvdmVycmlkZSB1c2luZyBzdWJjbGFzcyBvciBqdXN0IGZ1bmN0aW9ucy5cbmNsYXNzIEhlbHAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmhlbHBXaWR0aCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm1pbldpZHRoVG9XcmFwID0gNDA7XG4gICAgdGhpcy5zb3J0U3ViY29tbWFuZHMgPSBmYWxzZTtcbiAgICB0aGlzLnNvcnRPcHRpb25zID0gZmFsc2U7XG4gICAgdGhpcy5zaG93R2xvYmFsT3B0aW9ucyA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIHByZXBhcmVDb250ZXh0IGlzIGNhbGxlZCBieSBDb21tYW5kZXIgYWZ0ZXIgYXBwbHlpbmcgb3ZlcnJpZGVzIGZyb20gYENvbW1hbmQuY29uZmlndXJlSGVscCgpYFxuICAgKiBhbmQganVzdCBiZWZvcmUgY2FsbGluZyBgZm9ybWF0SGVscCgpYC5cbiAgICpcbiAgICogQ29tbWFuZGVyIGp1c3QgdXNlcyB0aGUgaGVscFdpZHRoIGFuZCB0aGUgcmVzdCBpcyBwcm92aWRlZCBmb3Igb3B0aW9uYWwgdXNlIGJ5IG1vcmUgY29tcGxleCBzdWJjbGFzc2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge3sgZXJyb3I/OiBib29sZWFuLCBoZWxwV2lkdGg/OiBudW1iZXIsIG91dHB1dEhhc0NvbG9ycz86IGJvb2xlYW4gfX0gY29udGV4dE9wdGlvbnNcbiAgICovXG4gIHByZXBhcmVDb250ZXh0KGNvbnRleHRPcHRpb25zKSB7XG4gICAgdGhpcy5oZWxwV2lkdGggPSB0aGlzLmhlbHBXaWR0aCA/PyBjb250ZXh0T3B0aW9ucy5oZWxwV2lkdGggPz8gODA7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFuIGFycmF5IG9mIHRoZSB2aXNpYmxlIHN1YmNvbW1hbmRzLiBJbmNsdWRlcyBhIHBsYWNlaG9sZGVyIGZvciB0aGUgaW1wbGljaXQgaGVscCBjb21tYW5kLCBpZiB0aGVyZSBpcyBvbmUuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEByZXR1cm5zIHtDb21tYW5kW119XG4gICAqL1xuXG4gIHZpc2libGVDb21tYW5kcyhjbWQpIHtcbiAgICBjb25zdCB2aXNpYmxlQ29tbWFuZHMgPSBjbWQuY29tbWFuZHMuZmlsdGVyKChjbWQpID0+ICFjbWQuX2hpZGRlbik7XG4gICAgY29uc3QgaGVscENvbW1hbmQgPSBjbWQuX2dldEhlbHBDb21tYW5kKCk7XG4gICAgaWYgKGhlbHBDb21tYW5kICYmICFoZWxwQ29tbWFuZC5faGlkZGVuKSB7XG4gICAgICB2aXNpYmxlQ29tbWFuZHMucHVzaChoZWxwQ29tbWFuZCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNvcnRTdWJjb21tYW5kcykge1xuICAgICAgdmlzaWJsZUNvbW1hbmRzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgLy8gQHRzLWlnbm9yZTogYmVjYXVzZSBvdmVybG9hZGVkIHJldHVybiB0eXBlXG4gICAgICAgIHJldHVybiBhLm5hbWUoKS5sb2NhbGVDb21wYXJlKGIubmFtZSgpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gdmlzaWJsZUNvbW1hbmRzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbXBhcmUgb3B0aW9ucyBmb3Igc29ydC5cbiAgICpcbiAgICogQHBhcmFtIHtPcHRpb259IGFcbiAgICogQHBhcmFtIHtPcHRpb259IGJcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGNvbXBhcmVPcHRpb25zKGEsIGIpIHtcbiAgICBjb25zdCBnZXRTb3J0S2V5ID0gKG9wdGlvbikgPT4ge1xuICAgICAgLy8gV1lTSVdZRyBmb3Igb3JkZXIgZGlzcGxheWVkIGluIGhlbHAuIFNob3J0IHVzZWQgZm9yIGNvbXBhcmlzb24gaWYgcHJlc2VudC4gTm8gc3BlY2lhbCBoYW5kbGluZyBmb3IgbmVnYXRlZC5cbiAgICAgIHJldHVybiBvcHRpb24uc2hvcnRcbiAgICAgICAgPyBvcHRpb24uc2hvcnQucmVwbGFjZSgvXi0vLCAnJylcbiAgICAgICAgOiBvcHRpb24ubG9uZy5yZXBsYWNlKC9eLS0vLCAnJyk7XG4gICAgfTtcbiAgICByZXR1cm4gZ2V0U29ydEtleShhKS5sb2NhbGVDb21wYXJlKGdldFNvcnRLZXkoYikpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBhcnJheSBvZiB0aGUgdmlzaWJsZSBvcHRpb25zLiBJbmNsdWRlcyBhIHBsYWNlaG9sZGVyIGZvciB0aGUgaW1wbGljaXQgaGVscCBvcHRpb24sIGlmIHRoZXJlIGlzIG9uZS5cbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWRcbiAgICogQHJldHVybnMge09wdGlvbltdfVxuICAgKi9cblxuICB2aXNpYmxlT3B0aW9ucyhjbWQpIHtcbiAgICBjb25zdCB2aXNpYmxlT3B0aW9ucyA9IGNtZC5vcHRpb25zLmZpbHRlcigob3B0aW9uKSA9PiAhb3B0aW9uLmhpZGRlbik7XG4gICAgLy8gQnVpbHQtaW4gaGVscCBvcHRpb24uXG4gICAgY29uc3QgaGVscE9wdGlvbiA9IGNtZC5fZ2V0SGVscE9wdGlvbigpO1xuICAgIGlmIChoZWxwT3B0aW9uICYmICFoZWxwT3B0aW9uLmhpZGRlbikge1xuICAgICAgLy8gQXV0b21hdGljYWxseSBoaWRlIGNvbmZsaWN0aW5nIGZsYWdzLiBCaXQgZHViaW91cyBidXQgYSBoaXN0b3JpY2FsIGJlaGF2aW91ciB0aGF0IGlzIGNvbnZlbmllbnQgZm9yIHNpbmdsZS1jb21tYW5kIHByb2dyYW1zLlxuICAgICAgY29uc3QgcmVtb3ZlU2hvcnQgPSBoZWxwT3B0aW9uLnNob3J0ICYmIGNtZC5fZmluZE9wdGlvbihoZWxwT3B0aW9uLnNob3J0KTtcbiAgICAgIGNvbnN0IHJlbW92ZUxvbmcgPSBoZWxwT3B0aW9uLmxvbmcgJiYgY21kLl9maW5kT3B0aW9uKGhlbHBPcHRpb24ubG9uZyk7XG4gICAgICBpZiAoIXJlbW92ZVNob3J0ICYmICFyZW1vdmVMb25nKSB7XG4gICAgICAgIHZpc2libGVPcHRpb25zLnB1c2goaGVscE9wdGlvbik7IC8vIG5vIGNoYW5nZXMgbmVlZGVkXG4gICAgICB9IGVsc2UgaWYgKGhlbHBPcHRpb24ubG9uZyAmJiAhcmVtb3ZlTG9uZykge1xuICAgICAgICB2aXNpYmxlT3B0aW9ucy5wdXNoKFxuICAgICAgICAgIGNtZC5jcmVhdGVPcHRpb24oaGVscE9wdGlvbi5sb25nLCBoZWxwT3B0aW9uLmRlc2NyaXB0aW9uKSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAoaGVscE9wdGlvbi5zaG9ydCAmJiAhcmVtb3ZlU2hvcnQpIHtcbiAgICAgICAgdmlzaWJsZU9wdGlvbnMucHVzaChcbiAgICAgICAgICBjbWQuY3JlYXRlT3B0aW9uKGhlbHBPcHRpb24uc2hvcnQsIGhlbHBPcHRpb24uZGVzY3JpcHRpb24pLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5zb3J0T3B0aW9ucykge1xuICAgICAgdmlzaWJsZU9wdGlvbnMuc29ydCh0aGlzLmNvbXBhcmVPcHRpb25zKTtcbiAgICB9XG4gICAgcmV0dXJuIHZpc2libGVPcHRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhbiBhcnJheSBvZiB0aGUgdmlzaWJsZSBnbG9iYWwgb3B0aW9ucy4gKE5vdCBpbmNsdWRpbmcgaGVscC4pXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEByZXR1cm5zIHtPcHRpb25bXX1cbiAgICovXG5cbiAgdmlzaWJsZUdsb2JhbE9wdGlvbnMoY21kKSB7XG4gICAgaWYgKCF0aGlzLnNob3dHbG9iYWxPcHRpb25zKSByZXR1cm4gW107XG5cbiAgICBjb25zdCBnbG9iYWxPcHRpb25zID0gW107XG4gICAgZm9yIChcbiAgICAgIGxldCBhbmNlc3RvckNtZCA9IGNtZC5wYXJlbnQ7XG4gICAgICBhbmNlc3RvckNtZDtcbiAgICAgIGFuY2VzdG9yQ21kID0gYW5jZXN0b3JDbWQucGFyZW50XG4gICAgKSB7XG4gICAgICBjb25zdCB2aXNpYmxlT3B0aW9ucyA9IGFuY2VzdG9yQ21kLm9wdGlvbnMuZmlsdGVyKFxuICAgICAgICAob3B0aW9uKSA9PiAhb3B0aW9uLmhpZGRlbixcbiAgICAgICk7XG4gICAgICBnbG9iYWxPcHRpb25zLnB1c2goLi4udmlzaWJsZU9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb3J0T3B0aW9ucykge1xuICAgICAgZ2xvYmFsT3B0aW9ucy5zb3J0KHRoaXMuY29tcGFyZU9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gZ2xvYmFsT3B0aW9ucztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYW4gYXJyYXkgb2YgdGhlIGFyZ3VtZW50cyBpZiBhbnkgaGF2ZSBhIGRlc2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbW1hbmR9IGNtZFxuICAgKiBAcmV0dXJucyB7QXJndW1lbnRbXX1cbiAgICovXG5cbiAgdmlzaWJsZUFyZ3VtZW50cyhjbWQpIHtcbiAgICAvLyBTaWRlIGVmZmVjdCEgQXBwbHkgdGhlIGxlZ2FjeSBkZXNjcmlwdGlvbnMgYmVmb3JlIHRoZSBhcmd1bWVudHMgYXJlIGRpc3BsYXllZC5cbiAgICBpZiAoY21kLl9hcmdzRGVzY3JpcHRpb24pIHtcbiAgICAgIGNtZC5yZWdpc3RlcmVkQXJndW1lbnRzLmZvckVhY2goKGFyZ3VtZW50KSA9PiB7XG4gICAgICAgIGFyZ3VtZW50LmRlc2NyaXB0aW9uID1cbiAgICAgICAgICBhcmd1bWVudC5kZXNjcmlwdGlvbiB8fCBjbWQuX2FyZ3NEZXNjcmlwdGlvblthcmd1bWVudC5uYW1lKCldIHx8ICcnO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlcmUgYXJlIGFueSBhcmd1bWVudHMgd2l0aCBhIGRlc2NyaXB0aW9uIHRoZW4gcmV0dXJuIGFsbCB0aGUgYXJndW1lbnRzLlxuICAgIGlmIChjbWQucmVnaXN0ZXJlZEFyZ3VtZW50cy5maW5kKChhcmd1bWVudCkgPT4gYXJndW1lbnQuZGVzY3JpcHRpb24pKSB7XG4gICAgICByZXR1cm4gY21kLnJlZ2lzdGVyZWRBcmd1bWVudHM7XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGNvbW1hbmQgdGVybSB0byBzaG93IGluIHRoZSBsaXN0IG9mIHN1YmNvbW1hbmRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbW1hbmR9IGNtZFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuICBzdWJjb21tYW5kVGVybShjbWQpIHtcbiAgICAvLyBMZWdhY3kuIElnbm9yZXMgY3VzdG9tIHVzYWdlIHN0cmluZywgYW5kIG5lc3RlZCBjb21tYW5kcy5cbiAgICBjb25zdCBhcmdzID0gY21kLnJlZ2lzdGVyZWRBcmd1bWVudHNcbiAgICAgIC5tYXAoKGFyZykgPT4gaHVtYW5SZWFkYWJsZUFyZ05hbWUoYXJnKSlcbiAgICAgIC5qb2luKCcgJyk7XG4gICAgcmV0dXJuIChcbiAgICAgIGNtZC5fbmFtZSArXG4gICAgICAoY21kLl9hbGlhc2VzWzBdID8gJ3wnICsgY21kLl9hbGlhc2VzWzBdIDogJycpICtcbiAgICAgIChjbWQub3B0aW9ucy5sZW5ndGggPyAnIFtvcHRpb25zXScgOiAnJykgKyAvLyBzaW1wbGlzdGljIGNoZWNrIGZvciBub24taGVscCBvcHRpb25cbiAgICAgIChhcmdzID8gJyAnICsgYXJncyA6ICcnKVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBvcHRpb24gdGVybSB0byBzaG93IGluIHRoZSBsaXN0IG9mIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgb3B0aW9uVGVybShvcHRpb24pIHtcbiAgICByZXR1cm4gb3B0aW9uLmZsYWdzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYXJndW1lbnQgdGVybSB0byBzaG93IGluIHRoZSBsaXN0IG9mIGFyZ3VtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudH0gYXJndW1lbnRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgYXJndW1lbnRUZXJtKGFyZ3VtZW50KSB7XG4gICAgcmV0dXJuIGFyZ3VtZW50Lm5hbWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGxvbmdlc3QgY29tbWFuZCB0ZXJtIGxlbmd0aC5cbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWRcbiAgICogQHBhcmFtIHtIZWxwfSBoZWxwZXJcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG5cbiAgbG9uZ2VzdFN1YmNvbW1hbmRUZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSB7XG4gICAgcmV0dXJuIGhlbHBlci52aXNpYmxlQ29tbWFuZHMoY21kKS5yZWR1Y2UoKG1heCwgY29tbWFuZCkgPT4ge1xuICAgICAgcmV0dXJuIE1hdGgubWF4KFxuICAgICAgICBtYXgsXG4gICAgICAgIHRoaXMuZGlzcGxheVdpZHRoKFxuICAgICAgICAgIGhlbHBlci5zdHlsZVN1YmNvbW1hbmRUZXJtKGhlbHBlci5zdWJjb21tYW5kVGVybShjb21tYW5kKSksXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH0sIDApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbG9uZ2VzdCBvcHRpb24gdGVybSBsZW5ndGguXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuXG4gIGxvbmdlc3RPcHRpb25UZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSB7XG4gICAgcmV0dXJuIGhlbHBlci52aXNpYmxlT3B0aW9ucyhjbWQpLnJlZHVjZSgobWF4LCBvcHRpb24pID0+IHtcbiAgICAgIHJldHVybiBNYXRoLm1heChcbiAgICAgICAgbWF4LFxuICAgICAgICB0aGlzLmRpc3BsYXlXaWR0aChoZWxwZXIuc3R5bGVPcHRpb25UZXJtKGhlbHBlci5vcHRpb25UZXJtKG9wdGlvbikpKSxcbiAgICAgICk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsb25nZXN0IGdsb2JhbCBvcHRpb24gdGVybSBsZW5ndGguXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuXG4gIGxvbmdlc3RHbG9iYWxPcHRpb25UZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSB7XG4gICAgcmV0dXJuIGhlbHBlci52aXNpYmxlR2xvYmFsT3B0aW9ucyhjbWQpLnJlZHVjZSgobWF4LCBvcHRpb24pID0+IHtcbiAgICAgIHJldHVybiBNYXRoLm1heChcbiAgICAgICAgbWF4LFxuICAgICAgICB0aGlzLmRpc3BsYXlXaWR0aChoZWxwZXIuc3R5bGVPcHRpb25UZXJtKGhlbHBlci5vcHRpb25UZXJtKG9wdGlvbikpKSxcbiAgICAgICk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBsb25nZXN0IGFyZ3VtZW50IHRlcm0gbGVuZ3RoLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbW1hbmR9IGNtZFxuICAgKiBAcGFyYW0ge0hlbHB9IGhlbHBlclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgKi9cblxuICBsb25nZXN0QXJndW1lbnRUZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSB7XG4gICAgcmV0dXJuIGhlbHBlci52aXNpYmxlQXJndW1lbnRzKGNtZCkucmVkdWNlKChtYXgsIGFyZ3VtZW50KSA9PiB7XG4gICAgICByZXR1cm4gTWF0aC5tYXgoXG4gICAgICAgIG1heCxcbiAgICAgICAgdGhpcy5kaXNwbGF5V2lkdGgoXG4gICAgICAgICAgaGVscGVyLnN0eWxlQXJndW1lbnRUZXJtKGhlbHBlci5hcmd1bWVudFRlcm0oYXJndW1lbnQpKSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfSwgMCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjb21tYW5kIHVzYWdlIHRvIGJlIGRpc3BsYXllZCBhdCB0aGUgdG9wIG9mIHRoZSBidWlsdC1pbiBoZWxwLlxuICAgKlxuICAgKiBAcGFyYW0ge0NvbW1hbmR9IGNtZFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cblxuICBjb21tYW5kVXNhZ2UoY21kKSB7XG4gICAgLy8gVXNhZ2VcbiAgICBsZXQgY21kTmFtZSA9IGNtZC5fbmFtZTtcbiAgICBpZiAoY21kLl9hbGlhc2VzWzBdKSB7XG4gICAgICBjbWROYW1lID0gY21kTmFtZSArICd8JyArIGNtZC5fYWxpYXNlc1swXTtcbiAgICB9XG4gICAgbGV0IGFuY2VzdG9yQ21kTmFtZXMgPSAnJztcbiAgICBmb3IgKFxuICAgICAgbGV0IGFuY2VzdG9yQ21kID0gY21kLnBhcmVudDtcbiAgICAgIGFuY2VzdG9yQ21kO1xuICAgICAgYW5jZXN0b3JDbWQgPSBhbmNlc3RvckNtZC5wYXJlbnRcbiAgICApIHtcbiAgICAgIGFuY2VzdG9yQ21kTmFtZXMgPSBhbmNlc3RvckNtZC5uYW1lKCkgKyAnICcgKyBhbmNlc3RvckNtZE5hbWVzO1xuICAgIH1cbiAgICByZXR1cm4gYW5jZXN0b3JDbWROYW1lcyArIGNtZE5hbWUgKyAnICcgKyBjbWQudXNhZ2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGRlc2NyaXB0aW9uIGZvciB0aGUgY29tbWFuZC5cbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgY29tbWFuZERlc2NyaXB0aW9uKGNtZCkge1xuICAgIC8vIEB0cy1pZ25vcmU6IGJlY2F1c2Ugb3ZlcmxvYWRlZCByZXR1cm4gdHlwZVxuICAgIHJldHVybiBjbWQuZGVzY3JpcHRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHN1YmNvbW1hbmQgc3VtbWFyeSB0byBzaG93IGluIHRoZSBsaXN0IG9mIHN1YmNvbW1hbmRzLlxuICAgKiAoRmFsbGJhY2sgdG8gZGVzY3JpcHRpb24gZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5LilcbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWRcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG5cbiAgc3ViY29tbWFuZERlc2NyaXB0aW9uKGNtZCkge1xuICAgIC8vIEB0cy1pZ25vcmU6IGJlY2F1c2Ugb3ZlcmxvYWRlZCByZXR1cm4gdHlwZVxuICAgIHJldHVybiBjbWQuc3VtbWFyeSgpIHx8IGNtZC5kZXNjcmlwdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgb3B0aW9uIGRlc2NyaXB0aW9uIHRvIHNob3cgaW4gdGhlIGxpc3Qgb2Ygb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtPcHRpb259IG9wdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG4gIG9wdGlvbkRlc2NyaXB0aW9uKG9wdGlvbikge1xuICAgIGNvbnN0IGV4dHJhSW5mbyA9IFtdO1xuXG4gICAgaWYgKG9wdGlvbi5hcmdDaG9pY2VzKSB7XG4gICAgICBleHRyYUluZm8ucHVzaChcbiAgICAgICAgLy8gdXNlIHN0cmluZ2lmeSB0byBtYXRjaCB0aGUgZGlzcGxheSBvZiB0aGUgZGVmYXVsdCB2YWx1ZVxuICAgICAgICBgY2hvaWNlczogJHtvcHRpb24uYXJnQ2hvaWNlcy5tYXAoKGNob2ljZSkgPT4gSlNPTi5zdHJpbmdpZnkoY2hvaWNlKSkuam9pbignLCAnKX1gLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbi5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gZGVmYXVsdCBmb3IgYm9vbGVhbiBhbmQgbmVnYXRlZCBtb3JlIGZvciBwcm9ncmFtbWVyIHRoYW4gZW5kIHVzZXIsXG4gICAgICAvLyBidXQgc2hvdyB0cnVlL2ZhbHNlIGZvciBib29sZWFuIG9wdGlvbiBhcyBtYXkgYmUgZm9yIGhhbmQtcm9sbGVkIGVudiBvciBjb25maWcgcHJvY2Vzc2luZy5cbiAgICAgIGNvbnN0IHNob3dEZWZhdWx0ID1cbiAgICAgICAgb3B0aW9uLnJlcXVpcmVkIHx8XG4gICAgICAgIG9wdGlvbi5vcHRpb25hbCB8fFxuICAgICAgICAob3B0aW9uLmlzQm9vbGVhbigpICYmIHR5cGVvZiBvcHRpb24uZGVmYXVsdFZhbHVlID09PSAnYm9vbGVhbicpO1xuICAgICAgaWYgKHNob3dEZWZhdWx0KSB7XG4gICAgICAgIGV4dHJhSW5mby5wdXNoKFxuICAgICAgICAgIGBkZWZhdWx0OiAke29wdGlvbi5kZWZhdWx0VmFsdWVEZXNjcmlwdGlvbiB8fCBKU09OLnN0cmluZ2lmeShvcHRpb24uZGVmYXVsdFZhbHVlKX1gLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBwcmVzZXQgZm9yIGJvb2xlYW4gYW5kIG5lZ2F0ZWQgYXJlIG1vcmUgZm9yIHByb2dyYW1tZXIgdGhhbiBlbmQgdXNlclxuICAgIGlmIChvcHRpb24ucHJlc2V0QXJnICE9PSB1bmRlZmluZWQgJiYgb3B0aW9uLm9wdGlvbmFsKSB7XG4gICAgICBleHRyYUluZm8ucHVzaChgcHJlc2V0OiAke0pTT04uc3RyaW5naWZ5KG9wdGlvbi5wcmVzZXRBcmcpfWApO1xuICAgIH1cbiAgICBpZiAob3B0aW9uLmVudlZhciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBleHRyYUluZm8ucHVzaChgZW52OiAke29wdGlvbi5lbnZWYXJ9YCk7XG4gICAgfVxuICAgIGlmIChleHRyYUluZm8ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgZXh0cmFEZXNjcmlwdGlvbiA9IGAoJHtleHRyYUluZm8uam9pbignLCAnKX0pYDtcbiAgICAgIGlmIChvcHRpb24uZGVzY3JpcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIGAke29wdGlvbi5kZXNjcmlwdGlvbn0gJHtleHRyYURlc2NyaXB0aW9ufWA7XG4gICAgICB9XG4gICAgICByZXR1cm4gZXh0cmFEZXNjcmlwdGlvbjtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9uLmRlc2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgYXJndW1lbnQgZGVzY3JpcHRpb24gdG8gc2hvdyBpbiB0aGUgbGlzdCBvZiBhcmd1bWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7QXJndW1lbnR9IGFyZ3VtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cbiAgYXJndW1lbnREZXNjcmlwdGlvbihhcmd1bWVudCkge1xuICAgIGNvbnN0IGV4dHJhSW5mbyA9IFtdO1xuICAgIGlmIChhcmd1bWVudC5hcmdDaG9pY2VzKSB7XG4gICAgICBleHRyYUluZm8ucHVzaChcbiAgICAgICAgLy8gdXNlIHN0cmluZ2lmeSB0byBtYXRjaCB0aGUgZGlzcGxheSBvZiB0aGUgZGVmYXVsdCB2YWx1ZVxuICAgICAgICBgY2hvaWNlczogJHthcmd1bWVudC5hcmdDaG9pY2VzLm1hcCgoY2hvaWNlKSA9PiBKU09OLnN0cmluZ2lmeShjaG9pY2UpKS5qb2luKCcsICcpfWAsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoYXJndW1lbnQuZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGV4dHJhSW5mby5wdXNoKFxuICAgICAgICBgZGVmYXVsdDogJHthcmd1bWVudC5kZWZhdWx0VmFsdWVEZXNjcmlwdGlvbiB8fCBKU09OLnN0cmluZ2lmeShhcmd1bWVudC5kZWZhdWx0VmFsdWUpfWAsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoZXh0cmFJbmZvLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGV4dHJhRGVzY3JpcHRpb24gPSBgKCR7ZXh0cmFJbmZvLmpvaW4oJywgJyl9KWA7XG4gICAgICBpZiAoYXJndW1lbnQuZGVzY3JpcHRpb24pIHtcbiAgICAgICAgcmV0dXJuIGAke2FyZ3VtZW50LmRlc2NyaXB0aW9ufSAke2V4dHJhRGVzY3JpcHRpb259YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHRyYURlc2NyaXB0aW9uO1xuICAgIH1cbiAgICByZXR1cm4gYXJndW1lbnQuZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0IGEgbGlzdCBvZiBpdGVtcywgZ2l2ZW4gYSBoZWFkaW5nIGFuZCBhbiBhcnJheSBvZiBmb3JtYXR0ZWQgaXRlbXMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoZWFkaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IGl0ZW1zXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHN0cmluZ1tdXG4gICAqL1xuICBmb3JtYXRJdGVtTGlzdChoZWFkaW5nLCBpdGVtcywgaGVscGVyKSB7XG4gICAgaWYgKGl0ZW1zLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdO1xuXG4gICAgcmV0dXJuIFtoZWxwZXIuc3R5bGVUaXRsZShoZWFkaW5nKSwgLi4uaXRlbXMsICcnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcm91cCBpdGVtcyBieSB0aGVpciBoZWxwIGdyb3VwIGhlYWRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZFtdIHwgT3B0aW9uW119IHVuc29ydGVkSXRlbXNcbiAgICogQHBhcmFtIHtDb21tYW5kW10gfCBPcHRpb25bXX0gdmlzaWJsZUl0ZW1zXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGdldEdyb3VwXG4gICAqIEByZXR1cm5zIHtNYXA8c3RyaW5nLCBDb21tYW5kW10gfCBPcHRpb25bXT59XG4gICAqL1xuICBncm91cEl0ZW1zKHVuc29ydGVkSXRlbXMsIHZpc2libGVJdGVtcywgZ2V0R3JvdXApIHtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgTWFwKCk7XG4gICAgLy8gQWRkIGdyb3VwcyBpbiBvcmRlciBvZiBhcHBlYXJhbmNlIGluIHVuc29ydGVkSXRlbXMuXG4gICAgdW5zb3J0ZWRJdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBncm91cCA9IGdldEdyb3VwKGl0ZW0pO1xuICAgICAgaWYgKCFyZXN1bHQuaGFzKGdyb3VwKSkgcmVzdWx0LnNldChncm91cCwgW10pO1xuICAgIH0pO1xuICAgIC8vIEFkZCBpdGVtcyBpbiBvcmRlciBvZiBhcHBlYXJhbmNlIGluIHZpc2libGVJdGVtcy5cbiAgICB2aXNpYmxlSXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgZ3JvdXAgPSBnZXRHcm91cChpdGVtKTtcbiAgICAgIGlmICghcmVzdWx0Lmhhcyhncm91cCkpIHtcbiAgICAgICAgcmVzdWx0LnNldChncm91cCwgW10pO1xuICAgICAgfVxuICAgICAgcmVzdWx0LmdldChncm91cCkucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHRoZSBidWlsdC1pbiBoZWxwIHRleHQuXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuXG4gIGZvcm1hdEhlbHAoY21kLCBoZWxwZXIpIHtcbiAgICBjb25zdCB0ZXJtV2lkdGggPSBoZWxwZXIucGFkV2lkdGgoY21kLCBoZWxwZXIpO1xuICAgIGNvbnN0IGhlbHBXaWR0aCA9IGhlbHBlci5oZWxwV2lkdGggPz8gODA7IC8vIGluIGNhc2UgcHJlcGFyZUNvbnRleHQoKSB3YXMgbm90IGNhbGxlZFxuXG4gICAgZnVuY3Rpb24gY2FsbEZvcm1hdEl0ZW0odGVybSwgZGVzY3JpcHRpb24pIHtcbiAgICAgIHJldHVybiBoZWxwZXIuZm9ybWF0SXRlbSh0ZXJtLCB0ZXJtV2lkdGgsIGRlc2NyaXB0aW9uLCBoZWxwZXIpO1xuICAgIH1cblxuICAgIC8vIFVzYWdlXG4gICAgbGV0IG91dHB1dCA9IFtcbiAgICAgIGAke2hlbHBlci5zdHlsZVRpdGxlKCdVc2FnZTonKX0gJHtoZWxwZXIuc3R5bGVVc2FnZShoZWxwZXIuY29tbWFuZFVzYWdlKGNtZCkpfWAsXG4gICAgICAnJyxcbiAgICBdO1xuXG4gICAgLy8gRGVzY3JpcHRpb25cbiAgICBjb25zdCBjb21tYW5kRGVzY3JpcHRpb24gPSBoZWxwZXIuY29tbWFuZERlc2NyaXB0aW9uKGNtZCk7XG4gICAgaWYgKGNvbW1hbmREZXNjcmlwdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBvdXRwdXQgPSBvdXRwdXQuY29uY2F0KFtcbiAgICAgICAgaGVscGVyLmJveFdyYXAoXG4gICAgICAgICAgaGVscGVyLnN0eWxlQ29tbWFuZERlc2NyaXB0aW9uKGNvbW1hbmREZXNjcmlwdGlvbiksXG4gICAgICAgICAgaGVscFdpZHRoLFxuICAgICAgICApLFxuICAgICAgICAnJyxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIC8vIEFyZ3VtZW50c1xuICAgIGNvbnN0IGFyZ3VtZW50TGlzdCA9IGhlbHBlci52aXNpYmxlQXJndW1lbnRzKGNtZCkubWFwKChhcmd1bWVudCkgPT4ge1xuICAgICAgcmV0dXJuIGNhbGxGb3JtYXRJdGVtKFxuICAgICAgICBoZWxwZXIuc3R5bGVBcmd1bWVudFRlcm0oaGVscGVyLmFyZ3VtZW50VGVybShhcmd1bWVudCkpLFxuICAgICAgICBoZWxwZXIuc3R5bGVBcmd1bWVudERlc2NyaXB0aW9uKGhlbHBlci5hcmd1bWVudERlc2NyaXB0aW9uKGFyZ3VtZW50KSksXG4gICAgICApO1xuICAgIH0pO1xuICAgIG91dHB1dCA9IG91dHB1dC5jb25jYXQoXG4gICAgICB0aGlzLmZvcm1hdEl0ZW1MaXN0KCdBcmd1bWVudHM6JywgYXJndW1lbnRMaXN0LCBoZWxwZXIpLFxuICAgICk7XG5cbiAgICAvLyBPcHRpb25zXG4gICAgY29uc3Qgb3B0aW9uR3JvdXBzID0gdGhpcy5ncm91cEl0ZW1zKFxuICAgICAgY21kLm9wdGlvbnMsXG4gICAgICBoZWxwZXIudmlzaWJsZU9wdGlvbnMoY21kKSxcbiAgICAgIChvcHRpb24pID0+IG9wdGlvbi5oZWxwR3JvdXBIZWFkaW5nID8/ICdPcHRpb25zOicsXG4gICAgKTtcbiAgICBvcHRpb25Hcm91cHMuZm9yRWFjaCgob3B0aW9ucywgZ3JvdXApID0+IHtcbiAgICAgIGNvbnN0IG9wdGlvbkxpc3QgPSBvcHRpb25zLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiBjYWxsRm9ybWF0SXRlbShcbiAgICAgICAgICBoZWxwZXIuc3R5bGVPcHRpb25UZXJtKGhlbHBlci5vcHRpb25UZXJtKG9wdGlvbikpLFxuICAgICAgICAgIGhlbHBlci5zdHlsZU9wdGlvbkRlc2NyaXB0aW9uKGhlbHBlci5vcHRpb25EZXNjcmlwdGlvbihvcHRpb24pKSxcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgICAgb3V0cHV0ID0gb3V0cHV0LmNvbmNhdCh0aGlzLmZvcm1hdEl0ZW1MaXN0KGdyb3VwLCBvcHRpb25MaXN0LCBoZWxwZXIpKTtcbiAgICB9KTtcblxuICAgIGlmIChoZWxwZXIuc2hvd0dsb2JhbE9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGdsb2JhbE9wdGlvbkxpc3QgPSBoZWxwZXJcbiAgICAgICAgLnZpc2libGVHbG9iYWxPcHRpb25zKGNtZClcbiAgICAgICAgLm1hcCgob3B0aW9uKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNhbGxGb3JtYXRJdGVtKFxuICAgICAgICAgICAgaGVscGVyLnN0eWxlT3B0aW9uVGVybShoZWxwZXIub3B0aW9uVGVybShvcHRpb24pKSxcbiAgICAgICAgICAgIGhlbHBlci5zdHlsZU9wdGlvbkRlc2NyaXB0aW9uKGhlbHBlci5vcHRpb25EZXNjcmlwdGlvbihvcHRpb24pKSxcbiAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICAgIG91dHB1dCA9IG91dHB1dC5jb25jYXQoXG4gICAgICAgIHRoaXMuZm9ybWF0SXRlbUxpc3QoJ0dsb2JhbCBPcHRpb25zOicsIGdsb2JhbE9wdGlvbkxpc3QsIGhlbHBlciksXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIENvbW1hbmRzXG4gICAgY29uc3QgY29tbWFuZEdyb3VwcyA9IHRoaXMuZ3JvdXBJdGVtcyhcbiAgICAgIGNtZC5jb21tYW5kcyxcbiAgICAgIGhlbHBlci52aXNpYmxlQ29tbWFuZHMoY21kKSxcbiAgICAgIChzdWIpID0+IHN1Yi5oZWxwR3JvdXAoKSB8fCAnQ29tbWFuZHM6JyxcbiAgICApO1xuICAgIGNvbW1hbmRHcm91cHMuZm9yRWFjaCgoY29tbWFuZHMsIGdyb3VwKSA9PiB7XG4gICAgICBjb25zdCBjb21tYW5kTGlzdCA9IGNvbW1hbmRzLm1hcCgoc3ViKSA9PiB7XG4gICAgICAgIHJldHVybiBjYWxsRm9ybWF0SXRlbShcbiAgICAgICAgICBoZWxwZXIuc3R5bGVTdWJjb21tYW5kVGVybShoZWxwZXIuc3ViY29tbWFuZFRlcm0oc3ViKSksXG4gICAgICAgICAgaGVscGVyLnN0eWxlU3ViY29tbWFuZERlc2NyaXB0aW9uKGhlbHBlci5zdWJjb21tYW5kRGVzY3JpcHRpb24oc3ViKSksXG4gICAgICAgICk7XG4gICAgICB9KTtcbiAgICAgIG91dHB1dCA9IG91dHB1dC5jb25jYXQodGhpcy5mb3JtYXRJdGVtTGlzdChncm91cCwgY29tbWFuZExpc3QsIGhlbHBlcikpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dHB1dC5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gZGlzcGxheSB3aWR0aCBvZiBzdHJpbmcsIGlnbm9yaW5nIEFOU0kgZXNjYXBlIHNlcXVlbmNlcy4gVXNlZCBpbiBwYWRkaW5nIGFuZCB3cmFwcGluZyBjYWxjdWxhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge251bWJlcn1cbiAgICovXG4gIGRpc3BsYXlXaWR0aChzdHIpIHtcbiAgICByZXR1cm4gc3RyaXBDb2xvcihzdHIpLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHlsZSB0aGUgdGl0bGUgZm9yIGRpc3BsYXlpbmcgaW4gdGhlIGhlbHAuIENhbGxlZCB3aXRoICdVc2FnZTonLCAnT3B0aW9uczonLCBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0eWxlVGl0bGUoc3RyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuXG4gIHN0eWxlVXNhZ2Uoc3RyKSB7XG4gICAgLy8gVXNhZ2UgaGFzIGxvdHMgb2YgcGFydHMgdGhlIHVzZXIgbWlnaHQgbGlrZSB0byBjb2xvciBzZXBhcmF0ZWx5ISBBc3N1bWUgZGVmYXVsdCB1c2FnZSBzdHJpbmcgd2hpY2ggaXMgZm9ybWVkIGxpa2U6XG4gICAgLy8gICAgY29tbWFuZCBzdWJjb21tYW5kIFtvcHRpb25zXSBbY29tbWFuZF0gPGZvbz4gW2Jhcl1cbiAgICByZXR1cm4gc3RyXG4gICAgICAuc3BsaXQoJyAnKVxuICAgICAgLm1hcCgod29yZCkgPT4ge1xuICAgICAgICBpZiAod29yZCA9PT0gJ1tvcHRpb25zXScpIHJldHVybiB0aGlzLnN0eWxlT3B0aW9uVGV4dCh3b3JkKTtcbiAgICAgICAgaWYgKHdvcmQgPT09ICdbY29tbWFuZF0nKSByZXR1cm4gdGhpcy5zdHlsZVN1YmNvbW1hbmRUZXh0KHdvcmQpO1xuICAgICAgICBpZiAod29yZFswXSA9PT0gJ1snIHx8IHdvcmRbMF0gPT09ICc8JylcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdHlsZUFyZ3VtZW50VGV4dCh3b3JkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGVDb21tYW5kVGV4dCh3b3JkKTsgLy8gUmVzdHJpY3QgdG8gaW5pdGlhbCB3b3Jkcz9cbiAgICAgIH0pXG4gICAgICAuam9pbignICcpO1xuICB9XG4gIHN0eWxlQ29tbWFuZERlc2NyaXB0aW9uKHN0cikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlRGVzY3JpcHRpb25UZXh0KHN0cik7XG4gIH1cbiAgc3R5bGVPcHRpb25EZXNjcmlwdGlvbihzdHIpIHtcbiAgICByZXR1cm4gdGhpcy5zdHlsZURlc2NyaXB0aW9uVGV4dChzdHIpO1xuICB9XG4gIHN0eWxlU3ViY29tbWFuZERlc2NyaXB0aW9uKHN0cikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlRGVzY3JpcHRpb25UZXh0KHN0cik7XG4gIH1cbiAgc3R5bGVBcmd1bWVudERlc2NyaXB0aW9uKHN0cikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlRGVzY3JpcHRpb25UZXh0KHN0cik7XG4gIH1cbiAgc3R5bGVEZXNjcmlwdGlvblRleHQoc3RyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBzdHlsZU9wdGlvblRlcm0oc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVPcHRpb25UZXh0KHN0cik7XG4gIH1cbiAgc3R5bGVTdWJjb21tYW5kVGVybShzdHIpIHtcbiAgICAvLyBUaGlzIGlzIHZlcnkgbGlrZSB1c2FnZSB3aXRoIGxvdHMgb2YgcGFydHMhIEFzc3VtZSBkZWZhdWx0IHN0cmluZyB3aGljaCBpcyBmb3JtZWQgbGlrZTpcbiAgICAvLyAgICBzdWJjb21tYW5kIFtvcHRpb25zXSA8Zm9vPiBbYmFyXVxuICAgIHJldHVybiBzdHJcbiAgICAgIC5zcGxpdCgnICcpXG4gICAgICAubWFwKCh3b3JkKSA9PiB7XG4gICAgICAgIGlmICh3b3JkID09PSAnW29wdGlvbnNdJykgcmV0dXJuIHRoaXMuc3R5bGVPcHRpb25UZXh0KHdvcmQpO1xuICAgICAgICBpZiAod29yZFswXSA9PT0gJ1snIHx8IHdvcmRbMF0gPT09ICc8JylcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdHlsZUFyZ3VtZW50VGV4dCh3b3JkKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3R5bGVTdWJjb21tYW5kVGV4dCh3b3JkKTsgLy8gUmVzdHJpY3QgdG8gaW5pdGlhbCB3b3Jkcz9cbiAgICAgIH0pXG4gICAgICAuam9pbignICcpO1xuICB9XG4gIHN0eWxlQXJndW1lbnRUZXJtKHN0cikge1xuICAgIHJldHVybiB0aGlzLnN0eWxlQXJndW1lbnRUZXh0KHN0cik7XG4gIH1cbiAgc3R5bGVPcHRpb25UZXh0KHN0cikge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgc3R5bGVBcmd1bWVudFRleHQoc3RyKSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxuICBzdHlsZVN1YmNvbW1hbmRUZXh0KHN0cikge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbiAgc3R5bGVDb21tYW5kVGV4dChzdHIpIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGN1bGF0ZSB0aGUgcGFkIHdpZHRoIGZyb20gdGhlIG1heGltdW0gdGVybSBsZW5ndGguXG4gICAqXG4gICAqIEBwYXJhbSB7Q29tbWFuZH0gY21kXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuXG4gIHBhZFdpZHRoKGNtZCwgaGVscGVyKSB7XG4gICAgcmV0dXJuIE1hdGgubWF4KFxuICAgICAgaGVscGVyLmxvbmdlc3RPcHRpb25UZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSxcbiAgICAgIGhlbHBlci5sb25nZXN0R2xvYmFsT3B0aW9uVGVybUxlbmd0aChjbWQsIGhlbHBlciksXG4gICAgICBoZWxwZXIubG9uZ2VzdFN1YmNvbW1hbmRUZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSxcbiAgICAgIGhlbHBlci5sb25nZXN0QXJndW1lbnRUZXJtTGVuZ3RoKGNtZCwgaGVscGVyKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIERldGVjdCBtYW51YWxseSB3cmFwcGVkIGFuZCBpbmRlbnRlZCBzdHJpbmdzIGJ5IGNoZWNraW5nIGZvciBsaW5lIGJyZWFrIGZvbGxvd2VkIGJ5IHdoaXRlc3BhY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAqL1xuICBwcmVmb3JtYXR0ZWQoc3RyKSB7XG4gICAgcmV0dXJuIC9cXG5bXlxcU1xcclxcbl0vLnRlc3Qoc3RyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgdGhlIFwiaXRlbVwiLCB3aGljaCBjb25zaXN0cyBvZiBhIHRlcm0gYW5kIGRlc2NyaXB0aW9uLiBQYWQgdGhlIHRlcm0gYW5kIHdyYXAgdGhlIGRlc2NyaXB0aW9uLCBpbmRlbnRpbmcgdGhlIGZvbGxvd2luZyBsaW5lcy5cbiAgICpcbiAgICogU28gXCJUVFRcIiwgNSwgXCJEREQgRERERCBERCBERERcIiBtaWdodCBiZSBmb3JtYXR0ZWQgZm9yIHRoaXMuaGVscFdpZHRoPTE3IGxpa2Ugc286XG4gICAqICAgVFRUICBEREQgRERERFxuICAgKiAgICAgICAgREQgREREXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB0ZXJtV2lkdGhcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSB7SGVscH0gaGVscGVyXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBmb3JtYXRJdGVtKHRlcm0sIHRlcm1XaWR0aCwgZGVzY3JpcHRpb24sIGhlbHBlcikge1xuICAgIGNvbnN0IGl0ZW1JbmRlbnQgPSAyO1xuICAgIGNvbnN0IGl0ZW1JbmRlbnRTdHIgPSAnICcucmVwZWF0KGl0ZW1JbmRlbnQpO1xuICAgIGlmICghZGVzY3JpcHRpb24pIHJldHVybiBpdGVtSW5kZW50U3RyICsgdGVybTtcblxuICAgIC8vIFBhZCB0aGUgdGVybSBvdXQgdG8gYSBjb25zaXN0ZW50IHdpZHRoLCBzbyBkZXNjcmlwdGlvbnMgYXJlIGFsaWduZWQuXG4gICAgY29uc3QgcGFkZGVkVGVybSA9IHRlcm0ucGFkRW5kKFxuICAgICAgdGVybVdpZHRoICsgdGVybS5sZW5ndGggLSBoZWxwZXIuZGlzcGxheVdpZHRoKHRlcm0pLFxuICAgICk7XG5cbiAgICAvLyBGb3JtYXQgdGhlIGRlc2NyaXB0aW9uLlxuICAgIGNvbnN0IHNwYWNlcldpZHRoID0gMjsgLy8gYmV0d2VlbiB0ZXJtIGFuZCBkZXNjcmlwdGlvblxuICAgIGNvbnN0IGhlbHBXaWR0aCA9IHRoaXMuaGVscFdpZHRoID8/IDgwOyAvLyBpbiBjYXNlIHByZXBhcmVDb250ZXh0KCkgd2FzIG5vdCBjYWxsZWRcbiAgICBjb25zdCByZW1haW5pbmdXaWR0aCA9IGhlbHBXaWR0aCAtIHRlcm1XaWR0aCAtIHNwYWNlcldpZHRoIC0gaXRlbUluZGVudDtcbiAgICBsZXQgZm9ybWF0dGVkRGVzY3JpcHRpb247XG4gICAgaWYgKFxuICAgICAgcmVtYWluaW5nV2lkdGggPCB0aGlzLm1pbldpZHRoVG9XcmFwIHx8XG4gICAgICBoZWxwZXIucHJlZm9ybWF0dGVkKGRlc2NyaXB0aW9uKVxuICAgICkge1xuICAgICAgZm9ybWF0dGVkRGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgd3JhcHBlZERlc2NyaXB0aW9uID0gaGVscGVyLmJveFdyYXAoZGVzY3JpcHRpb24sIHJlbWFpbmluZ1dpZHRoKTtcbiAgICAgIGZvcm1hdHRlZERlc2NyaXB0aW9uID0gd3JhcHBlZERlc2NyaXB0aW9uLnJlcGxhY2UoXG4gICAgICAgIC9cXG4vZyxcbiAgICAgICAgJ1xcbicgKyAnICcucmVwZWF0KHRlcm1XaWR0aCArIHNwYWNlcldpZHRoKSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gQ29uc3RydWN0IGFuZCBvdmVyYWxsIGluZGVudC5cbiAgICByZXR1cm4gKFxuICAgICAgaXRlbUluZGVudFN0ciArXG4gICAgICBwYWRkZWRUZXJtICtcbiAgICAgICcgJy5yZXBlYXQoc3BhY2VyV2lkdGgpICtcbiAgICAgIGZvcm1hdHRlZERlc2NyaXB0aW9uLnJlcGxhY2UoL1xcbi9nLCBgXFxuJHtpdGVtSW5kZW50U3RyfWApXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwIGEgc3RyaW5nIGF0IHdoaXRlc3BhY2UsIHByZXNlcnZpbmcgZXhpc3RpbmcgbGluZSBicmVha3MuXG4gICAqIFdyYXBwaW5nIGlzIHNraXBwZWQgaWYgdGhlIHdpZHRoIGlzIGxlc3MgdGhhbiBgbWluV2lkdGhUb1dyYXBgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aFxuICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgKi9cbiAgYm94V3JhcChzdHIsIHdpZHRoKSB7XG4gICAgaWYgKHdpZHRoIDwgdGhpcy5taW5XaWR0aFRvV3JhcCkgcmV0dXJuIHN0cjtcblxuICAgIGNvbnN0IHJhd0xpbmVzID0gc3RyLnNwbGl0KC9cXHJcXG58XFxuLyk7XG4gICAgLy8gc3BsaXQgdXAgdGV4dCBieSB3aGl0ZXNwYWNlXG4gICAgY29uc3QgY2h1bmtQYXR0ZXJuID0gL1tcXHNdKlteXFxzXSsvZztcbiAgICBjb25zdCB3cmFwcGVkTGluZXMgPSBbXTtcbiAgICByYXdMaW5lcy5mb3JFYWNoKChsaW5lKSA9PiB7XG4gICAgICBjb25zdCBjaHVua3MgPSBsaW5lLm1hdGNoKGNodW5rUGF0dGVybik7XG4gICAgICBpZiAoY2h1bmtzID09PSBudWxsKSB7XG4gICAgICAgIHdyYXBwZWRMaW5lcy5wdXNoKCcnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgc3VtQ2h1bmtzID0gW2NodW5rcy5zaGlmdCgpXTtcbiAgICAgIGxldCBzdW1XaWR0aCA9IHRoaXMuZGlzcGxheVdpZHRoKHN1bUNodW5rc1swXSk7XG4gICAgICBjaHVua3MuZm9yRWFjaCgoY2h1bmspID0+IHtcbiAgICAgICAgY29uc3QgdmlzaWJsZVdpZHRoID0gdGhpcy5kaXNwbGF5V2lkdGgoY2h1bmspO1xuICAgICAgICAvLyBBY2N1bXVsYXRlIGNodW5rcyB3aGlsZSB0aGV5IGZpdCBpbnRvIHdpZHRoLlxuICAgICAgICBpZiAoc3VtV2lkdGggKyB2aXNpYmxlV2lkdGggPD0gd2lkdGgpIHtcbiAgICAgICAgICBzdW1DaHVua3MucHVzaChjaHVuayk7XG4gICAgICAgICAgc3VtV2lkdGggKz0gdmlzaWJsZVdpZHRoO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3cmFwcGVkTGluZXMucHVzaChzdW1DaHVua3Muam9pbignJykpO1xuXG4gICAgICAgIGNvbnN0IG5leHRDaHVuayA9IGNodW5rLnRyaW1TdGFydCgpOyAvLyB0cmltIHNwYWNlIGF0IGxpbmUgYnJlYWtcbiAgICAgICAgc3VtQ2h1bmtzID0gW25leHRDaHVua107XG4gICAgICAgIHN1bVdpZHRoID0gdGhpcy5kaXNwbGF5V2lkdGgobmV4dENodW5rKTtcbiAgICAgIH0pO1xuICAgICAgd3JhcHBlZExpbmVzLnB1c2goc3VtQ2h1bmtzLmpvaW4oJycpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB3cmFwcGVkTGluZXMuam9pbignXFxuJyk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHJpcCBzdHlsZSBBTlNJIGVzY2FwZSBzZXF1ZW5jZXMgZnJvbSB0aGUgc3RyaW5nLiBJbiBwYXJ0aWN1bGFyLCBTR1IgKFNlbGVjdCBHcmFwaGljIFJlbmRpdGlvbikgY29kZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqIEBwYWNrYWdlXG4gKi9cblxuZnVuY3Rpb24gc3RyaXBDb2xvcihzdHIpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgY29uc3Qgc2dyUGF0dGVybiA9IC9cXHgxYlxcW1xcZCooO1xcZCopKm0vZztcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKHNnclBhdHRlcm4sICcnKTtcbn1cblxuZXhwb3J0cy5IZWxwID0gSGVscDtcbmV4cG9ydHMuc3RyaXBDb2xvciA9IHN0cmlwQ29sb3I7XG4iLCAiY29uc3QgeyBJbnZhbGlkQXJndW1lbnRFcnJvciB9ID0gcmVxdWlyZSgnLi9lcnJvci5qcycpO1xuXG5jbGFzcyBPcHRpb24ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5ldyBgT3B0aW9uYCB3aXRoIHRoZSBnaXZlbiBgZmxhZ3NgIGFuZCBgZGVzY3JpcHRpb25gLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmxhZ3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICovXG5cbiAgY29uc3RydWN0b3IoZmxhZ3MsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5mbGFncyA9IGZsYWdzO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbiB8fCAnJztcblxuICAgIHRoaXMucmVxdWlyZWQgPSBmbGFncy5pbmNsdWRlcygnPCcpOyAvLyBBIHZhbHVlIG11c3QgYmUgc3VwcGxpZWQgd2hlbiB0aGUgb3B0aW9uIGlzIHNwZWNpZmllZC5cbiAgICB0aGlzLm9wdGlvbmFsID0gZmxhZ3MuaW5jbHVkZXMoJ1snKTsgLy8gQSB2YWx1ZSBpcyBvcHRpb25hbCB3aGVuIHRoZSBvcHRpb24gaXMgc3BlY2lmaWVkLlxuICAgIC8vIHZhcmlhZGljIHRlc3QgaWdub3JlcyA8dmFsdWUsLi4uPiBldCBhbCB3aGljaCBtaWdodCBiZSB1c2VkIHRvIGRlc2NyaWJlIGN1c3RvbSBzcGxpdHRpbmcgb2Ygc2luZ2xlIGFyZ3VtZW50XG4gICAgdGhpcy52YXJpYWRpYyA9IC9cXHdcXC5cXC5cXC5bPlxcXV0kLy50ZXN0KGZsYWdzKTsgLy8gVGhlIG9wdGlvbiBjYW4gdGFrZSBtdWx0aXBsZSB2YWx1ZXMuXG4gICAgdGhpcy5tYW5kYXRvcnkgPSBmYWxzZTsgLy8gVGhlIG9wdGlvbiBtdXN0IGhhdmUgYSB2YWx1ZSBhZnRlciBwYXJzaW5nLCB3aGljaCB1c3VhbGx5IG1lYW5zIGl0IG11c3QgYmUgc3BlY2lmaWVkIG9uIGNvbW1hbmQgbGluZS5cbiAgICBjb25zdCBvcHRpb25GbGFncyA9IHNwbGl0T3B0aW9uRmxhZ3MoZmxhZ3MpO1xuICAgIHRoaXMuc2hvcnQgPSBvcHRpb25GbGFncy5zaG9ydEZsYWc7IC8vIE1heSBiZSBhIHNob3J0IGZsYWcsIHVuZGVmaW5lZCwgb3IgZXZlbiBhIGxvbmcgZmxhZyAoaWYgb3B0aW9uIGhhcyB0d28gbG9uZyBmbGFncykuXG4gICAgdGhpcy5sb25nID0gb3B0aW9uRmxhZ3MubG9uZ0ZsYWc7XG4gICAgdGhpcy5uZWdhdGUgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5sb25nKSB7XG4gICAgICB0aGlzLm5lZ2F0ZSA9IHRoaXMubG9uZy5zdGFydHNXaXRoKCctLW5vLScpO1xuICAgIH1cbiAgICB0aGlzLmRlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZURlc2NyaXB0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJlc2V0QXJnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuZW52VmFyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucGFyc2VBcmcgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5oaWRkZW4gPSBmYWxzZTtcbiAgICB0aGlzLmFyZ0Nob2ljZXMgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jb25mbGljdHNXaXRoID0gW107XG4gICAgdGhpcy5pbXBsaWVkID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuaGVscEdyb3VwSGVhZGluZyA9IHVuZGVmaW5lZDsgLy8gc29mdCBpbml0aWFsaXNlZCB3aGVuIG9wdGlvbiBhZGRlZCB0byBjb21tYW5kXG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBkZWZhdWx0IHZhbHVlLCBhbmQgb3B0aW9uYWxseSBzdXBwbHkgdGhlIGRlc2NyaXB0aW9uIHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgaGVscC5cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtPcHRpb259XG4gICAqL1xuXG4gIGRlZmF1bHQodmFsdWUsIGRlc2NyaXB0aW9uKSB7XG4gICAgdGhpcy5kZWZhdWx0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmRlZmF1bHRWYWx1ZURlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUHJlc2V0IHRvIHVzZSB3aGVuIG9wdGlvbiB1c2VkIHdpdGhvdXQgb3B0aW9uLWFyZ3VtZW50LCBlc3BlY2lhbGx5IG9wdGlvbmFsIGJ1dCBhbHNvIGJvb2xlYW4gYW5kIG5lZ2F0ZWQuXG4gICAqIFRoZSBjdXN0b20gcHJvY2Vzc2luZyAocGFyc2VBcmcpIGlzIGNhbGxlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogbmV3IE9wdGlvbignLS1jb2xvcicpLmRlZmF1bHQoJ0dSRVlTQ0FMRScpLnByZXNldCgnUkdCJyk7XG4gICAqIG5ldyBPcHRpb24oJy0tZG9uYXRlIFthbW91bnRdJykucHJlc2V0KCcyMCcpLmFyZ1BhcnNlcihwYXJzZUZsb2F0KTtcbiAgICpcbiAgICogQHBhcmFtIHsqfSBhcmdcbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cblxuICBwcmVzZXQoYXJnKSB7XG4gICAgdGhpcy5wcmVzZXRBcmcgPSBhcmc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9wdGlvbiBuYW1lKHMpIHRoYXQgY29uZmxpY3Qgd2l0aCB0aGlzIG9wdGlvbi5cbiAgICogQW4gZXJyb3Igd2lsbCBiZSBkaXNwbGF5ZWQgaWYgY29uZmxpY3Rpbmcgb3B0aW9ucyBhcmUgZm91bmQgZHVyaW5nIHBhcnNpbmcuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIG5ldyBPcHRpb24oJy0tcmdiJykuY29uZmxpY3RzKCdjbXlrJyk7XG4gICAqIG5ldyBPcHRpb24oJy0tanMnKS5jb25mbGljdHMoWyd0cycsICdqc3gnXSk7XG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZyB8IHN0cmluZ1tdKX0gbmFtZXNcbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cblxuICBjb25mbGljdHMobmFtZXMpIHtcbiAgICB0aGlzLmNvbmZsaWN0c1dpdGggPSB0aGlzLmNvbmZsaWN0c1dpdGguY29uY2F0KG5hbWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IGltcGxpZWQgb3B0aW9uIHZhbHVlcyBmb3Igd2hlbiB0aGlzIG9wdGlvbiBpcyBzZXQgYW5kIHRoZSBpbXBsaWVkIG9wdGlvbnMgYXJlIG5vdC5cbiAgICpcbiAgICogVGhlIGN1c3RvbSBwcm9jZXNzaW5nIChwYXJzZUFyZykgaXMgbm90IGNhbGxlZCBvbiB0aGUgaW1wbGllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW1cbiAgICogICAuYWRkT3B0aW9uKG5ldyBPcHRpb24oJy0tbG9nJywgJ3dyaXRlIGxvZ2dpbmcgaW5mb3JtYXRpb24gdG8gZmlsZScpKVxuICAgKiAgIC5hZGRPcHRpb24obmV3IE9wdGlvbignLS10cmFjZScsICdsb2cgZXh0cmEgZGV0YWlscycpLmltcGxpZXMoeyBsb2c6ICd0cmFjZS50eHQnIH0pKTtcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGltcGxpZWRPcHRpb25WYWx1ZXNcbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cbiAgaW1wbGllcyhpbXBsaWVkT3B0aW9uVmFsdWVzKSB7XG4gICAgbGV0IG5ld0ltcGxpZWQgPSBpbXBsaWVkT3B0aW9uVmFsdWVzO1xuICAgIGlmICh0eXBlb2YgaW1wbGllZE9wdGlvblZhbHVlcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIHN0cmluZyBpcyBub3QgZG9jdW1lbnRlZCwgYnV0IGVhc3kgbWlzdGFrZSBhbmQgd2UgY2FuIGRvIHdoYXQgdXNlciBwcm9iYWJseSBpbnRlbmRlZC5cbiAgICAgIG5ld0ltcGxpZWQgPSB7IFtpbXBsaWVkT3B0aW9uVmFsdWVzXTogdHJ1ZSB9O1xuICAgIH1cbiAgICB0aGlzLmltcGxpZWQgPSBPYmplY3QuYXNzaWduKHRoaXMuaW1wbGllZCB8fCB7fSwgbmV3SW1wbGllZCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGVudmlyb25tZW50IHZhcmlhYmxlIHRvIGNoZWNrIGZvciBvcHRpb24gdmFsdWUuXG4gICAqXG4gICAqIEFuIGVudmlyb25tZW50IHZhcmlhYmxlIGlzIG9ubHkgdXNlZCBpZiB3aGVuIHByb2Nlc3NlZCB0aGUgY3VycmVudCBvcHRpb24gdmFsdWUgaXNcbiAgICogdW5kZWZpbmVkLCBvciB0aGUgc291cmNlIG9mIHRoZSBjdXJyZW50IHZhbHVlIGlzICdkZWZhdWx0JyBvciAnY29uZmlnJyBvciAnZW52Jy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cblxuICBlbnYobmFtZSkge1xuICAgIHRoaXMuZW52VmFyID0gbmFtZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1c3RvbSBoYW5kbGVyIGZvciBwcm9jZXNzaW5nIENMSSBvcHRpb24gYXJndW1lbnRzIGludG8gb3B0aW9uIHZhbHVlcy5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gW2ZuXVxuICAgKiBAcmV0dXJuIHtPcHRpb259XG4gICAqL1xuXG4gIGFyZ1BhcnNlcihmbikge1xuICAgIHRoaXMucGFyc2VBcmcgPSBmbjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBvcHRpb24gaXMgbWFuZGF0b3J5IGFuZCBtdXN0IGhhdmUgYSB2YWx1ZSBhZnRlciBwYXJzaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFttYW5kYXRvcnk9dHJ1ZV1cbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cblxuICBtYWtlT3B0aW9uTWFuZGF0b3J5KG1hbmRhdG9yeSA9IHRydWUpIHtcbiAgICB0aGlzLm1hbmRhdG9yeSA9ICEhbWFuZGF0b3J5O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgb3B0aW9uIGluIGhlbHAuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2hpZGU9dHJ1ZV1cbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cblxuICBoaWRlSGVscChoaWRlID0gdHJ1ZSkge1xuICAgIHRoaXMuaGlkZGVuID0gISFoaWRlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYWNrYWdlXG4gICAqL1xuXG4gIF9jb2xsZWN0VmFsdWUodmFsdWUsIHByZXZpb3VzKSB7XG4gICAgaWYgKHByZXZpb3VzID09PSB0aGlzLmRlZmF1bHRWYWx1ZSB8fCAhQXJyYXkuaXNBcnJheShwcmV2aW91cykpIHtcbiAgICAgIHJldHVybiBbdmFsdWVdO1xuICAgIH1cblxuICAgIHByZXZpb3VzLnB1c2godmFsdWUpO1xuICAgIHJldHVybiBwcmV2aW91cztcbiAgfVxuXG4gIC8qKlxuICAgKiBPbmx5IGFsbG93IG9wdGlvbiB2YWx1ZSB0byBiZSBvbmUgb2YgY2hvaWNlcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gdmFsdWVzXG4gICAqIEByZXR1cm4ge09wdGlvbn1cbiAgICovXG5cbiAgY2hvaWNlcyh2YWx1ZXMpIHtcbiAgICB0aGlzLmFyZ0Nob2ljZXMgPSB2YWx1ZXMuc2xpY2UoKTtcbiAgICB0aGlzLnBhcnNlQXJnID0gKGFyZywgcHJldmlvdXMpID0+IHtcbiAgICAgIGlmICghdGhpcy5hcmdDaG9pY2VzLmluY2x1ZGVzKGFyZykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRBcmd1bWVudEVycm9yKFxuICAgICAgICAgIGBBbGxvd2VkIGNob2ljZXMgYXJlICR7dGhpcy5hcmdDaG9pY2VzLmpvaW4oJywgJyl9LmAsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy52YXJpYWRpYykge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGVjdFZhbHVlKGFyZywgcHJldmlvdXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFyZztcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBvcHRpb24gbmFtZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuICBuYW1lKCkge1xuICAgIGlmICh0aGlzLmxvbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLmxvbmcucmVwbGFjZSgvXi0tLywgJycpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5zaG9ydC5yZXBsYWNlKC9eLS8sICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gb3B0aW9uIG5hbWUsIGluIGEgY2FtZWxjYXNlIGZvcm1hdCB0aGF0IGNhbiBiZSB1c2VkXG4gICAqIGFzIGFuIG9iamVjdCBhdHRyaWJ1dGUga2V5LlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuXG4gIGF0dHJpYnV0ZU5hbWUoKSB7XG4gICAgaWYgKHRoaXMubmVnYXRlKSB7XG4gICAgICByZXR1cm4gY2FtZWxjYXNlKHRoaXMubmFtZSgpLnJlcGxhY2UoL15uby0vLCAnJykpO1xuICAgIH1cbiAgICByZXR1cm4gY2FtZWxjYXNlKHRoaXMubmFtZSgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGhlbHAgZ3JvdXAgaGVhZGluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGhlYWRpbmdcbiAgICogQHJldHVybiB7T3B0aW9ufVxuICAgKi9cbiAgaGVscEdyb3VwKGhlYWRpbmcpIHtcbiAgICB0aGlzLmhlbHBHcm91cEhlYWRpbmcgPSBoZWFkaW5nO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGBhcmdgIG1hdGNoZXMgdGhlIHNob3J0IG9yIGxvbmcgZmxhZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGFyZ1xuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKiBAcGFja2FnZVxuICAgKi9cblxuICBpcyhhcmcpIHtcbiAgICByZXR1cm4gdGhpcy5zaG9ydCA9PT0gYXJnIHx8IHRoaXMubG9uZyA9PT0gYXJnO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB3aGV0aGVyIGEgYm9vbGVhbiBvcHRpb24uXG4gICAqXG4gICAqIE9wdGlvbnMgYXJlIG9uZSBvZiBib29sZWFuLCBuZWdhdGVkLCByZXF1aXJlZCBhcmd1bWVudCwgb3Igb3B0aW9uYWwgYXJndW1lbnQuXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqIEBwYWNrYWdlXG4gICAqL1xuXG4gIGlzQm9vbGVhbigpIHtcbiAgICByZXR1cm4gIXRoaXMucmVxdWlyZWQgJiYgIXRoaXMub3B0aW9uYWwgJiYgIXRoaXMubmVnYXRlO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBjbGFzcyBpcyB0byBtYWtlIGl0IGVhc2llciB0byB3b3JrIHdpdGggZHVhbCBvcHRpb25zLCB3aXRob3V0IGNoYW5naW5nIHRoZSBleGlzdGluZ1xuICogaW1wbGVtZW50YXRpb24uIFdlIHN1cHBvcnQgc2VwYXJhdGUgZHVhbCBvcHRpb25zIGZvciBzZXBhcmF0ZSBwb3NpdGl2ZSBhbmQgbmVnYXRpdmUgb3B0aW9ucyxcbiAqIGxpa2UgYC0tYnVpbGRgIGFuZCBgLS1uby1idWlsZGAsIHdoaWNoIHNoYXJlIGEgc2luZ2xlIG9wdGlvbiB2YWx1ZS4gVGhpcyB3b3JrcyBuaWNlbHkgZm9yIHNvbWVcbiAqIHVzZSBjYXNlcywgYnV0IGlzIHRyaWNreSBmb3Igb3RoZXJzIHdoZXJlIHdlIHdhbnQgc2VwYXJhdGUgYmVoYXZpb3VycyBkZXNwaXRlXG4gKiB0aGUgc2luZ2xlIHNoYXJlZCBvcHRpb24gdmFsdWUuXG4gKi9cbmNsYXNzIER1YWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T3B0aW9uW119IG9wdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLnBvc2l0aXZlT3B0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLm5lZ2F0aXZlT3B0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmR1YWxPcHRpb25zID0gbmV3IFNldCgpO1xuICAgIG9wdGlvbnMuZm9yRWFjaCgob3B0aW9uKSA9PiB7XG4gICAgICBpZiAob3B0aW9uLm5lZ2F0ZSkge1xuICAgICAgICB0aGlzLm5lZ2F0aXZlT3B0aW9ucy5zZXQob3B0aW9uLmF0dHJpYnV0ZU5hbWUoKSwgb3B0aW9uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucG9zaXRpdmVPcHRpb25zLnNldChvcHRpb24uYXR0cmlidXRlTmFtZSgpLCBvcHRpb24pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMubmVnYXRpdmVPcHRpb25zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGlmICh0aGlzLnBvc2l0aXZlT3B0aW9ucy5oYXMoa2V5KSkge1xuICAgICAgICB0aGlzLmR1YWxPcHRpb25zLmFkZChrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIERpZCB0aGUgdmFsdWUgY29tZSBmcm9tIHRoZSBvcHRpb24sIGFuZCBub3QgZnJvbSBwb3NzaWJsZSBtYXRjaGluZyBkdWFsIG9wdGlvbj9cbiAgICpcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge09wdGlvbn0gb3B0aW9uXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgdmFsdWVGcm9tT3B0aW9uKHZhbHVlLCBvcHRpb24pIHtcbiAgICBjb25zdCBvcHRpb25LZXkgPSBvcHRpb24uYXR0cmlidXRlTmFtZSgpO1xuICAgIGlmICghdGhpcy5kdWFsT3B0aW9ucy5oYXMob3B0aW9uS2V5KSkgcmV0dXJuIHRydWU7XG5cbiAgICAvLyBVc2UgdGhlIHZhbHVlIHRvIGRlZHVjZSBpZiAocHJvYmFibHkpIGNhbWUgZnJvbSB0aGUgb3B0aW9uLlxuICAgIGNvbnN0IHByZXNldCA9IHRoaXMubmVnYXRpdmVPcHRpb25zLmdldChvcHRpb25LZXkpLnByZXNldEFyZztcbiAgICBjb25zdCBuZWdhdGl2ZVZhbHVlID0gcHJlc2V0ICE9PSB1bmRlZmluZWQgPyBwcmVzZXQgOiBmYWxzZTtcbiAgICByZXR1cm4gb3B0aW9uLm5lZ2F0ZSA9PT0gKG5lZ2F0aXZlVmFsdWUgPT09IHZhbHVlKTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnZlcnQgc3RyaW5nIGZyb20ga2ViYWItY2FzZSB0byBjYW1lbENhc2UuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICogQHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBjYW1lbGNhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHIuc3BsaXQoJy0nKS5yZWR1Y2UoKHN0ciwgd29yZCkgPT4ge1xuICAgIHJldHVybiBzdHIgKyB3b3JkWzBdLnRvVXBwZXJDYXNlKCkgKyB3b3JkLnNsaWNlKDEpO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTcGxpdCB0aGUgc2hvcnQgYW5kIGxvbmcgZmxhZyBvdXQgb2Ygc29tZXRoaW5nIGxpa2UgJy1tLC0tbWl4ZWQgPHZhbHVlPidcbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIHNwbGl0T3B0aW9uRmxhZ3MoZmxhZ3MpIHtcbiAgbGV0IHNob3J0RmxhZztcbiAgbGV0IGxvbmdGbGFnO1xuICAvLyBzaG9ydCBmbGFnLCBzaW5nbGUgZGFzaCBhbmQgc2luZ2xlIGNoYXJhY3RlclxuICBjb25zdCBzaG9ydEZsYWdFeHAgPSAvXi1bXi1dJC87XG4gIC8vIGxvbmcgZmxhZywgZG91YmxlIGRhc2ggYW5kIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXJcbiAgY29uc3QgbG9uZ0ZsYWdFeHAgPSAvXi0tW14tXS87XG5cbiAgY29uc3QgZmxhZ1BhcnRzID0gZmxhZ3Muc3BsaXQoL1sgfCxdKy8pLmNvbmNhdCgnZ3VhcmQnKTtcbiAgLy8gTm9ybWFsIGlzIHNob3J0IGFuZC9vciBsb25nLlxuICBpZiAoc2hvcnRGbGFnRXhwLnRlc3QoZmxhZ1BhcnRzWzBdKSkgc2hvcnRGbGFnID0gZmxhZ1BhcnRzLnNoaWZ0KCk7XG4gIGlmIChsb25nRmxhZ0V4cC50ZXN0KGZsYWdQYXJ0c1swXSkpIGxvbmdGbGFnID0gZmxhZ1BhcnRzLnNoaWZ0KCk7XG4gIC8vIExvbmcgdGhlbiBzaG9ydC4gUmFyZWx5IHVzZWQgYnV0IGZpbmUuXG4gIGlmICghc2hvcnRGbGFnICYmIHNob3J0RmxhZ0V4cC50ZXN0KGZsYWdQYXJ0c1swXSkpXG4gICAgc2hvcnRGbGFnID0gZmxhZ1BhcnRzLnNoaWZ0KCk7XG4gIC8vIEFsbG93IHR3byBsb25nIGZsYWdzLCBsaWtlICctLXdzLCAtLXdvcmtzcGFjZSdcbiAgLy8gVGhpcyBpcyB0aGUgc3VwcG9ydGVkIHdheSB0byBoYXZlIGEgc2hvcnRpc2ggb3B0aW9uIGZsYWcuXG4gIGlmICghc2hvcnRGbGFnICYmIGxvbmdGbGFnRXhwLnRlc3QoZmxhZ1BhcnRzWzBdKSkge1xuICAgIHNob3J0RmxhZyA9IGxvbmdGbGFnO1xuICAgIGxvbmdGbGFnID0gZmxhZ1BhcnRzLnNoaWZ0KCk7XG4gIH1cblxuICAvLyBDaGVjayBmb3IgdW5wcm9jZXNzZWQgZmxhZy4gRmFpbCBub2lzaWx5IHJhdGhlciB0aGFuIHNpbGVudGx5IGlnbm9yZS5cbiAgaWYgKGZsYWdQYXJ0c1swXS5zdGFydHNXaXRoKCctJykpIHtcbiAgICBjb25zdCB1bnN1cHBvcnRlZEZsYWcgPSBmbGFnUGFydHNbMF07XG4gICAgY29uc3QgYmFzZUVycm9yID0gYG9wdGlvbiBjcmVhdGlvbiBmYWlsZWQgZHVlIHRvICcke3Vuc3VwcG9ydGVkRmxhZ30nIGluIG9wdGlvbiBmbGFncyAnJHtmbGFnc30nYDtcbiAgICBpZiAoL14tW14tXVteLV0vLnRlc3QodW5zdXBwb3J0ZWRGbGFnKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYCR7YmFzZUVycm9yfVxuLSBhIHNob3J0IGZsYWcgaXMgYSBzaW5nbGUgZGFzaCBhbmQgYSBzaW5nbGUgY2hhcmFjdGVyXG4gIC0gZWl0aGVyIHVzZSBhIHNpbmdsZSBkYXNoIGFuZCBhIHNpbmdsZSBjaGFyYWN0ZXIgKGZvciBhIHNob3J0IGZsYWcpXG4gIC0gb3IgdXNlIGEgZG91YmxlIGRhc2ggZm9yIGEgbG9uZyBvcHRpb24gKGFuZCBjYW4gaGF2ZSB0d28sIGxpa2UgJy0td3MsIC0td29ya3NwYWNlJylgLFxuICAgICAgKTtcbiAgICBpZiAoc2hvcnRGbGFnRXhwLnRlc3QodW5zdXBwb3J0ZWRGbGFnKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtiYXNlRXJyb3J9XG4tIHRvbyBtYW55IHNob3J0IGZsYWdzYCk7XG4gICAgaWYgKGxvbmdGbGFnRXhwLnRlc3QodW5zdXBwb3J0ZWRGbGFnKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtiYXNlRXJyb3J9XG4tIHRvbyBtYW55IGxvbmcgZmxhZ3NgKTtcblxuICAgIHRocm93IG5ldyBFcnJvcihgJHtiYXNlRXJyb3J9XG4tIHVucmVjb2duaXNlZCBmbGFnIGZvcm1hdGApO1xuICB9XG4gIGlmIChzaG9ydEZsYWcgPT09IHVuZGVmaW5lZCAmJiBsb25nRmxhZyA9PT0gdW5kZWZpbmVkKVxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBvcHRpb24gY3JlYXRpb24gZmFpbGVkIGR1ZSB0byBubyBmbGFncyBmb3VuZCBpbiAnJHtmbGFnc30nLmAsXG4gICAgKTtcblxuICByZXR1cm4geyBzaG9ydEZsYWcsIGxvbmdGbGFnIH07XG59XG5cbmV4cG9ydHMuT3B0aW9uID0gT3B0aW9uO1xuZXhwb3J0cy5EdWFsT3B0aW9ucyA9IER1YWxPcHRpb25zO1xuIiwgImNvbnN0IG1heERpc3RhbmNlID0gMztcblxuZnVuY3Rpb24gZWRpdERpc3RhbmNlKGEsIGIpIHtcbiAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGFtZXJhdVx1MjAxM0xldmVuc2h0ZWluX2Rpc3RhbmNlXG4gIC8vIENhbGN1bGF0aW5nIG9wdGltYWwgc3RyaW5nIGFsaWdubWVudCBkaXN0YW5jZSwgbm8gc3Vic3RyaW5nIGlzIGVkaXRlZCBtb3JlIHRoYW4gb25jZS5cbiAgLy8gKFNpbXBsZSBpbXBsZW1lbnRhdGlvbi4pXG5cbiAgLy8gUXVpY2sgZWFybHkgZXhpdCwgcmV0dXJuIHdvcnN0IGNhc2UuXG4gIGlmIChNYXRoLmFicyhhLmxlbmd0aCAtIGIubGVuZ3RoKSA+IG1heERpc3RhbmNlKVxuICAgIHJldHVybiBNYXRoLm1heChhLmxlbmd0aCwgYi5sZW5ndGgpO1xuXG4gIC8vIGRpc3RhbmNlIGJldHdlZW4gcHJlZml4IHN1YnN0cmluZ3Mgb2YgYSBhbmQgYlxuICBjb25zdCBkID0gW107XG5cbiAgLy8gcHVyZSBkZWxldGlvbnMgdHVybiBhIGludG8gZW1wdHkgc3RyaW5nXG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IGEubGVuZ3RoOyBpKyspIHtcbiAgICBkW2ldID0gW2ldO1xuICB9XG4gIC8vIHB1cmUgaW5zZXJ0aW9ucyB0dXJuIGVtcHR5IHN0cmluZyBpbnRvIGJcbiAgZm9yIChsZXQgaiA9IDA7IGogPD0gYi5sZW5ndGg7IGorKykge1xuICAgIGRbMF1bal0gPSBqO1xuICB9XG5cbiAgLy8gZmlsbCBtYXRyaXhcbiAgZm9yIChsZXQgaiA9IDE7IGogPD0gYi5sZW5ndGg7IGorKykge1xuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjb3N0ID0gMTtcbiAgICAgIGlmIChhW2kgLSAxXSA9PT0gYltqIC0gMV0pIHtcbiAgICAgICAgY29zdCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb3N0ID0gMTtcbiAgICAgIH1cbiAgICAgIGRbaV1bal0gPSBNYXRoLm1pbihcbiAgICAgICAgZFtpIC0gMV1bal0gKyAxLCAvLyBkZWxldGlvblxuICAgICAgICBkW2ldW2ogLSAxXSArIDEsIC8vIGluc2VydGlvblxuICAgICAgICBkW2kgLSAxXVtqIC0gMV0gKyBjb3N0LCAvLyBzdWJzdGl0dXRpb25cbiAgICAgICk7XG4gICAgICAvLyB0cmFuc3Bvc2l0aW9uXG4gICAgICBpZiAoaSA+IDEgJiYgaiA+IDEgJiYgYVtpIC0gMV0gPT09IGJbaiAtIDJdICYmIGFbaSAtIDJdID09PSBiW2ogLSAxXSkge1xuICAgICAgICBkW2ldW2pdID0gTWF0aC5taW4oZFtpXVtqXSwgZFtpIC0gMl1baiAtIDJdICsgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRbYS5sZW5ndGhdW2IubGVuZ3RoXTtcbn1cblxuLyoqXG4gKiBGaW5kIGNsb3NlIG1hdGNoZXMsIHJlc3RyaWN0ZWQgdG8gc2FtZSBudW1iZXIgb2YgZWRpdHMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHdvcmRcbiAqIEBwYXJhbSB7c3RyaW5nW119IGNhbmRpZGF0ZXNcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cblxuZnVuY3Rpb24gc3VnZ2VzdFNpbWlsYXIod29yZCwgY2FuZGlkYXRlcykge1xuICBpZiAoIWNhbmRpZGF0ZXMgfHwgY2FuZGlkYXRlcy5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgLy8gcmVtb3ZlIHBvc3NpYmxlIGR1cGxpY2F0ZXNcbiAgY2FuZGlkYXRlcyA9IEFycmF5LmZyb20obmV3IFNldChjYW5kaWRhdGVzKSk7XG5cbiAgY29uc3Qgc2VhcmNoaW5nT3B0aW9ucyA9IHdvcmQuc3RhcnRzV2l0aCgnLS0nKTtcbiAgaWYgKHNlYXJjaGluZ09wdGlvbnMpIHtcbiAgICB3b3JkID0gd29yZC5zbGljZSgyKTtcbiAgICBjYW5kaWRhdGVzID0gY2FuZGlkYXRlcy5tYXAoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLnNsaWNlKDIpKTtcbiAgfVxuXG4gIGxldCBzaW1pbGFyID0gW107XG4gIGxldCBiZXN0RGlzdGFuY2UgPSBtYXhEaXN0YW5jZTtcbiAgY29uc3QgbWluU2ltaWxhcml0eSA9IDAuNDtcbiAgY2FuZGlkYXRlcy5mb3JFYWNoKChjYW5kaWRhdGUpID0+IHtcbiAgICBpZiAoY2FuZGlkYXRlLmxlbmd0aCA8PSAxKSByZXR1cm47IC8vIG5vIG9uZSBjaGFyYWN0ZXIgZ3Vlc3Nlc1xuXG4gICAgY29uc3QgZGlzdGFuY2UgPSBlZGl0RGlzdGFuY2Uod29yZCwgY2FuZGlkYXRlKTtcbiAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1heCh3b3JkLmxlbmd0aCwgY2FuZGlkYXRlLmxlbmd0aCk7XG4gICAgY29uc3Qgc2ltaWxhcml0eSA9IChsZW5ndGggLSBkaXN0YW5jZSkgLyBsZW5ndGg7XG4gICAgaWYgKHNpbWlsYXJpdHkgPiBtaW5TaW1pbGFyaXR5KSB7XG4gICAgICBpZiAoZGlzdGFuY2UgPCBiZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgLy8gYmV0dGVyIGVkaXQgZGlzdGFuY2UsIHRocm93IGF3YXkgcHJldmlvdXMgd29yc2UgbWF0Y2hlc1xuICAgICAgICBiZXN0RGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICAgICAgc2ltaWxhciA9IFtjYW5kaWRhdGVdO1xuICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA9PT0gYmVzdERpc3RhbmNlKSB7XG4gICAgICAgIHNpbWlsYXIucHVzaChjYW5kaWRhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgc2ltaWxhci5zb3J0KChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYikpO1xuICBpZiAoc2VhcmNoaW5nT3B0aW9ucykge1xuICAgIHNpbWlsYXIgPSBzaW1pbGFyLm1hcCgoY2FuZGlkYXRlKSA9PiBgLS0ke2NhbmRpZGF0ZX1gKTtcbiAgfVxuXG4gIGlmIChzaW1pbGFyLmxlbmd0aCA+IDEpIHtcbiAgICByZXR1cm4gYFxcbihEaWQgeW91IG1lYW4gb25lIG9mICR7c2ltaWxhci5qb2luKCcsICcpfT8pYDtcbiAgfVxuICBpZiAoc2ltaWxhci5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gYFxcbihEaWQgeW91IG1lYW4gJHtzaW1pbGFyWzBdfT8pYDtcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydHMuc3VnZ2VzdFNpbWlsYXIgPSBzdWdnZXN0U2ltaWxhcjtcbiIsICJjb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdub2RlOmV2ZW50cycpLkV2ZW50RW1pdHRlcjtcbmNvbnN0IGNoaWxkUHJvY2VzcyA9IHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ25vZGU6cGF0aCcpO1xuY29uc3QgZnMgPSByZXF1aXJlKCdub2RlOmZzJyk7XG5jb25zdCBwcm9jZXNzID0gcmVxdWlyZSgnbm9kZTpwcm9jZXNzJyk7XG5cbmNvbnN0IHsgQXJndW1lbnQsIGh1bWFuUmVhZGFibGVBcmdOYW1lIH0gPSByZXF1aXJlKCcuL2FyZ3VtZW50LmpzJyk7XG5jb25zdCB7IENvbW1hbmRlckVycm9yIH0gPSByZXF1aXJlKCcuL2Vycm9yLmpzJyk7XG5jb25zdCB7IEhlbHAsIHN0cmlwQ29sb3IgfSA9IHJlcXVpcmUoJy4vaGVscC5qcycpO1xuY29uc3QgeyBPcHRpb24sIER1YWxPcHRpb25zIH0gPSByZXF1aXJlKCcuL29wdGlvbi5qcycpO1xuY29uc3QgeyBzdWdnZXN0U2ltaWxhciB9ID0gcmVxdWlyZSgnLi9zdWdnZXN0U2ltaWxhcicpO1xuXG5jbGFzcyBDb21tYW5kIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuZXcgYENvbW1hbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW25hbWVdXG4gICAqL1xuXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKiBAdHlwZSB7Q29tbWFuZFtdfSAqL1xuICAgIHRoaXMuY29tbWFuZHMgPSBbXTtcbiAgICAvKiogQHR5cGUge09wdGlvbltdfSAqL1xuICAgIHRoaXMub3B0aW9ucyA9IFtdO1xuICAgIHRoaXMucGFyZW50ID0gbnVsbDtcbiAgICB0aGlzLl9hbGxvd1Vua25vd25PcHRpb24gPSBmYWxzZTtcbiAgICB0aGlzLl9hbGxvd0V4Y2Vzc0FyZ3VtZW50cyA9IGZhbHNlO1xuICAgIC8qKiBAdHlwZSB7QXJndW1lbnRbXX0gKi9cbiAgICB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHMgPSBbXTtcbiAgICB0aGlzLl9hcmdzID0gdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzOyAvLyBkZXByZWNhdGVkIG9sZCBuYW1lXG4gICAgLyoqIEB0eXBlIHtzdHJpbmdbXX0gKi9cbiAgICB0aGlzLmFyZ3MgPSBbXTsgLy8gY2xpIGFyZ3Mgd2l0aCBvcHRpb25zIHJlbW92ZWRcbiAgICB0aGlzLnJhd0FyZ3MgPSBbXTtcbiAgICB0aGlzLnByb2Nlc3NlZEFyZ3MgPSBbXTsgLy8gbGlrZSAuYXJncyBidXQgYWZ0ZXIgY3VzdG9tIHByb2Nlc3NpbmcgYW5kIGNvbGxlY3RpbmcgdmFyaWFkaWNcbiAgICB0aGlzLl9zY3JpcHRQYXRoID0gbnVsbDtcbiAgICB0aGlzLl9uYW1lID0gbmFtZSB8fCAnJztcbiAgICB0aGlzLl9vcHRpb25WYWx1ZXMgPSB7fTtcbiAgICB0aGlzLl9vcHRpb25WYWx1ZVNvdXJjZXMgPSB7fTsgLy8gZGVmYXVsdCwgZW52LCBjbGkgZXRjXG4gICAgdGhpcy5fc3RvcmVPcHRpb25zQXNQcm9wZXJ0aWVzID0gZmFsc2U7XG4gICAgdGhpcy5fYWN0aW9uSGFuZGxlciA9IG51bGw7XG4gICAgdGhpcy5fZXhlY3V0YWJsZUhhbmRsZXIgPSBmYWxzZTtcbiAgICB0aGlzLl9leGVjdXRhYmxlRmlsZSA9IG51bGw7IC8vIGN1c3RvbSBuYW1lIGZvciBleGVjdXRhYmxlXG4gICAgdGhpcy5fZXhlY3V0YWJsZURpciA9IG51bGw7IC8vIGN1c3RvbSBzZWFyY2ggZGlyZWN0b3J5IGZvciBzdWJjb21tYW5kc1xuICAgIHRoaXMuX2RlZmF1bHRDb21tYW5kTmFtZSA9IG51bGw7XG4gICAgdGhpcy5fZXhpdENhbGxiYWNrID0gbnVsbDtcbiAgICB0aGlzLl9hbGlhc2VzID0gW107XG4gICAgdGhpcy5fY29tYmluZUZsYWdBbmRPcHRpb25hbFZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9ICcnO1xuICAgIHRoaXMuX3N1bW1hcnkgPSAnJztcbiAgICB0aGlzLl9hcmdzRGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7IC8vIGxlZ2FjeVxuICAgIHRoaXMuX2VuYWJsZVBvc2l0aW9uYWxPcHRpb25zID0gZmFsc2U7XG4gICAgdGhpcy5fcGFzc1Rocm91Z2hPcHRpb25zID0gZmFsc2U7XG4gICAgdGhpcy5fbGlmZUN5Y2xlSG9va3MgPSB7fTsgLy8gYSBoYXNoIG9mIGFycmF5c1xuICAgIC8qKiBAdHlwZSB7KGJvb2xlYW4gfCBzdHJpbmcpfSAqL1xuICAgIHRoaXMuX3Nob3dIZWxwQWZ0ZXJFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuX3Nob3dTdWdnZXN0aW9uQWZ0ZXJFcnJvciA9IHRydWU7XG4gICAgdGhpcy5fc2F2ZWRTdGF0ZSA9IG51bGw7IC8vIHVzZWQgaW4gc2F2ZS9yZXN0b3JlU3RhdGVCZWZvcmVQYXJzZVxuXG4gICAgLy8gc2VlIGNvbmZpZ3VyZU91dHB1dCgpIGZvciBkb2NzXG4gICAgdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbiA9IHtcbiAgICAgIHdyaXRlT3V0OiAoc3RyKSA9PiBwcm9jZXNzLnN0ZG91dC53cml0ZShzdHIpLFxuICAgICAgd3JpdGVFcnI6IChzdHIpID0+IHByb2Nlc3Muc3RkZXJyLndyaXRlKHN0ciksXG4gICAgICBvdXRwdXRFcnJvcjogKHN0ciwgd3JpdGUpID0+IHdyaXRlKHN0ciksXG4gICAgICBnZXRPdXRIZWxwV2lkdGg6ICgpID0+XG4gICAgICAgIHByb2Nlc3Muc3Rkb3V0LmlzVFRZID8gcHJvY2Vzcy5zdGRvdXQuY29sdW1ucyA6IHVuZGVmaW5lZCxcbiAgICAgIGdldEVyckhlbHBXaWR0aDogKCkgPT5cbiAgICAgICAgcHJvY2Vzcy5zdGRlcnIuaXNUVFkgPyBwcm9jZXNzLnN0ZGVyci5jb2x1bW5zIDogdW5kZWZpbmVkLFxuICAgICAgZ2V0T3V0SGFzQ29sb3JzOiAoKSA9PlxuICAgICAgICB1c2VDb2xvcigpID8/IChwcm9jZXNzLnN0ZG91dC5pc1RUWSAmJiBwcm9jZXNzLnN0ZG91dC5oYXNDb2xvcnM/LigpKSxcbiAgICAgIGdldEVyckhhc0NvbG9yczogKCkgPT5cbiAgICAgICAgdXNlQ29sb3IoKSA/PyAocHJvY2Vzcy5zdGRlcnIuaXNUVFkgJiYgcHJvY2Vzcy5zdGRlcnIuaGFzQ29sb3JzPy4oKSksXG4gICAgICBzdHJpcENvbG9yOiAoc3RyKSA9PiBzdHJpcENvbG9yKHN0ciksXG4gICAgfTtcblxuICAgIHRoaXMuX2hpZGRlbiA9IGZhbHNlO1xuICAgIC8qKiBAdHlwZSB7KE9wdGlvbiB8IG51bGwgfCB1bmRlZmluZWQpfSAqL1xuICAgIHRoaXMuX2hlbHBPcHRpb24gPSB1bmRlZmluZWQ7IC8vIExhenkgY3JlYXRlZCBvbiBkZW1hbmQuIE1heSBiZSBudWxsIGlmIGhlbHAgb3B0aW9uIGlzIGRpc2FibGVkLlxuICAgIHRoaXMuX2FkZEltcGxpY2l0SGVscENvbW1hbmQgPSB1bmRlZmluZWQ7IC8vIHVuZGVjaWRlZCB3aGV0aGVyIHRydWUgb3IgZmFsc2UgeWV0LCBub3QgaW5oZXJpdGVkXG4gICAgLyoqIEB0eXBlIHtDb21tYW5kfSAqL1xuICAgIHRoaXMuX2hlbHBDb21tYW5kID0gdW5kZWZpbmVkOyAvLyBsYXp5IGluaXRpYWxpc2VkLCBpbmhlcml0ZWRcbiAgICB0aGlzLl9oZWxwQ29uZmlndXJhdGlvbiA9IHt9O1xuICAgIC8qKiBAdHlwZSB7c3RyaW5nIHwgdW5kZWZpbmVkfSAqL1xuICAgIHRoaXMuX2hlbHBHcm91cEhlYWRpbmcgPSB1bmRlZmluZWQ7IC8vIHNvZnQgaW5pdGlhbGlzZWQgd2hlbiBhZGRlZCB0byBwYXJlbnRcbiAgICAvKiogQHR5cGUge3N0cmluZyB8IHVuZGVmaW5lZH0gKi9cbiAgICB0aGlzLl9kZWZhdWx0Q29tbWFuZEdyb3VwID0gdW5kZWZpbmVkO1xuICAgIC8qKiBAdHlwZSB7c3RyaW5nIHwgdW5kZWZpbmVkfSAqL1xuICAgIHRoaXMuX2RlZmF1bHRPcHRpb25Hcm91cCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5IHNldHRpbmdzIHRoYXQgYXJlIHVzZWZ1bCB0byBoYXZlIGluIGNvbW1vbiBhY3Jvc3Mgcm9vdCBjb21tYW5kIGFuZCBzdWJjb21tYW5kcy5cbiAgICpcbiAgICogKFVzZWQgaW50ZXJuYWxseSB3aGVuIGFkZGluZyBhIGNvbW1hbmQgdXNpbmcgYC5jb21tYW5kKClgIHNvIHN1YmNvbW1hbmRzIGluaGVyaXQgcGFyZW50IHNldHRpbmdzLilcbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBzb3VyY2VDb21tYW5kXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cbiAgY29weUluaGVyaXRlZFNldHRpbmdzKHNvdXJjZUNvbW1hbmQpIHtcbiAgICB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uID0gc291cmNlQ29tbWFuZC5fb3V0cHV0Q29uZmlndXJhdGlvbjtcbiAgICB0aGlzLl9oZWxwT3B0aW9uID0gc291cmNlQ29tbWFuZC5faGVscE9wdGlvbjtcbiAgICB0aGlzLl9oZWxwQ29tbWFuZCA9IHNvdXJjZUNvbW1hbmQuX2hlbHBDb21tYW5kO1xuICAgIHRoaXMuX2hlbHBDb25maWd1cmF0aW9uID0gc291cmNlQ29tbWFuZC5faGVscENvbmZpZ3VyYXRpb247XG4gICAgdGhpcy5fZXhpdENhbGxiYWNrID0gc291cmNlQ29tbWFuZC5fZXhpdENhbGxiYWNrO1xuICAgIHRoaXMuX3N0b3JlT3B0aW9uc0FzUHJvcGVydGllcyA9IHNvdXJjZUNvbW1hbmQuX3N0b3JlT3B0aW9uc0FzUHJvcGVydGllcztcbiAgICB0aGlzLl9jb21iaW5lRmxhZ0FuZE9wdGlvbmFsVmFsdWUgPVxuICAgICAgc291cmNlQ29tbWFuZC5fY29tYmluZUZsYWdBbmRPcHRpb25hbFZhbHVlO1xuICAgIHRoaXMuX2FsbG93RXhjZXNzQXJndW1lbnRzID0gc291cmNlQ29tbWFuZC5fYWxsb3dFeGNlc3NBcmd1bWVudHM7XG4gICAgdGhpcy5fZW5hYmxlUG9zaXRpb25hbE9wdGlvbnMgPSBzb3VyY2VDb21tYW5kLl9lbmFibGVQb3NpdGlvbmFsT3B0aW9ucztcbiAgICB0aGlzLl9zaG93SGVscEFmdGVyRXJyb3IgPSBzb3VyY2VDb21tYW5kLl9zaG93SGVscEFmdGVyRXJyb3I7XG4gICAgdGhpcy5fc2hvd1N1Z2dlc3Rpb25BZnRlckVycm9yID0gc291cmNlQ29tbWFuZC5fc2hvd1N1Z2dlc3Rpb25BZnRlckVycm9yO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMge0NvbW1hbmRbXX1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgZm9yIChsZXQgY29tbWFuZCA9IHRoaXM7IGNvbW1hbmQ7IGNvbW1hbmQgPSBjb21tYW5kLnBhcmVudCkge1xuICAgICAgcmVzdWx0LnB1c2goY29tbWFuZCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGEgY29tbWFuZC5cbiAgICpcbiAgICogVGhlcmUgYXJlIHR3byBzdHlsZXMgb2YgY29tbWFuZDogcGF5IGF0dGVudGlvbiB0byB3aGVyZSB0byBwdXQgdGhlIGRlc2NyaXB0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBDb21tYW5kIGltcGxlbWVudGVkIHVzaW5nIGFjdGlvbiBoYW5kbGVyIChkZXNjcmlwdGlvbiBpcyBzdXBwbGllZCBzZXBhcmF0ZWx5IHRvIGAuY29tbWFuZGApXG4gICAqIHByb2dyYW1cbiAgICogICAuY29tbWFuZCgnY2xvbmUgPHNvdXJjZT4gW2Rlc3RpbmF0aW9uXScpXG4gICAqICAgLmRlc2NyaXB0aW9uKCdjbG9uZSBhIHJlcG9zaXRvcnkgaW50byBhIG5ld2x5IGNyZWF0ZWQgZGlyZWN0b3J5JylcbiAgICogICAuYWN0aW9uKChzb3VyY2UsIGRlc3RpbmF0aW9uKSA9PiB7XG4gICAqICAgICBjb25zb2xlLmxvZygnY2xvbmUgY29tbWFuZCBjYWxsZWQnKTtcbiAgICogICB9KTtcbiAgICpcbiAgICogLy8gQ29tbWFuZCBpbXBsZW1lbnRlZCB1c2luZyBzZXBhcmF0ZSBleGVjdXRhYmxlIGZpbGUgKGRlc2NyaXB0aW9uIGlzIHNlY29uZCBwYXJhbWV0ZXIgdG8gYC5jb21tYW5kYClcbiAgICogcHJvZ3JhbVxuICAgKiAgIC5jb21tYW5kKCdzdGFydCA8c2VydmljZT4nLCAnc3RhcnQgbmFtZWQgc2VydmljZScpXG4gICAqICAgLmNvbW1hbmQoJ3N0b3AgW3NlcnZpY2VdJywgJ3N0b3AgbmFtZWQgc2VydmljZSwgb3IgYWxsIGlmIG5vIG5hbWUgc3VwcGxpZWQnKTtcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVBbmRBcmdzIC0gY29tbWFuZCBuYW1lIGFuZCBhcmd1bWVudHMsIGFyZ3MgYXJlIGA8cmVxdWlyZWQ+YCBvciBgW29wdGlvbmFsXWAgYW5kIGxhc3QgbWF5IGFsc28gYmUgYHZhcmlhZGljLi4uYFxuICAgKiBAcGFyYW0geyhvYmplY3QgfCBzdHJpbmcpfSBbYWN0aW9uT3B0c09yRXhlY0Rlc2NdIC0gY29uZmlndXJhdGlvbiBvcHRpb25zIChmb3IgYWN0aW9uKSwgb3IgZGVzY3JpcHRpb24gKGZvciBleGVjdXRhYmxlKVxuICAgKiBAcGFyYW0ge29iamVjdH0gW2V4ZWNPcHRzXSAtIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyAoZm9yIGV4ZWN1dGFibGUpXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IHJldHVybnMgbmV3IGNvbW1hbmQgZm9yIGFjdGlvbiBoYW5kbGVyLCBvciBgdGhpc2AgZm9yIGV4ZWN1dGFibGUgY29tbWFuZFxuICAgKi9cblxuICBjb21tYW5kKG5hbWVBbmRBcmdzLCBhY3Rpb25PcHRzT3JFeGVjRGVzYywgZXhlY09wdHMpIHtcbiAgICBsZXQgZGVzYyA9IGFjdGlvbk9wdHNPckV4ZWNEZXNjO1xuICAgIGxldCBvcHRzID0gZXhlY09wdHM7XG4gICAgaWYgKHR5cGVvZiBkZXNjID09PSAnb2JqZWN0JyAmJiBkZXNjICE9PSBudWxsKSB7XG4gICAgICBvcHRzID0gZGVzYztcbiAgICAgIGRlc2MgPSBudWxsO1xuICAgIH1cbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICBjb25zdCBbLCBuYW1lLCBhcmdzXSA9IG5hbWVBbmRBcmdzLm1hdGNoKC8oW14gXSspICooLiopLyk7XG5cbiAgICBjb25zdCBjbWQgPSB0aGlzLmNyZWF0ZUNvbW1hbmQobmFtZSk7XG4gICAgaWYgKGRlc2MpIHtcbiAgICAgIGNtZC5kZXNjcmlwdGlvbihkZXNjKTtcbiAgICAgIGNtZC5fZXhlY3V0YWJsZUhhbmRsZXIgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAob3B0cy5pc0RlZmF1bHQpIHRoaXMuX2RlZmF1bHRDb21tYW5kTmFtZSA9IGNtZC5fbmFtZTtcbiAgICBjbWQuX2hpZGRlbiA9ICEhKG9wdHMubm9IZWxwIHx8IG9wdHMuaGlkZGVuKTsgLy8gbm9IZWxwIGlzIGRlcHJlY2F0ZWQgb2xkIG5hbWUgZm9yIGhpZGRlblxuICAgIGNtZC5fZXhlY3V0YWJsZUZpbGUgPSBvcHRzLmV4ZWN1dGFibGVGaWxlIHx8IG51bGw7IC8vIEN1c3RvbSBuYW1lIGZvciBleGVjdXRhYmxlIGZpbGUsIHNldCBtaXNzaW5nIHRvIG51bGwgdG8gbWF0Y2ggY29uc3RydWN0b3JcbiAgICBpZiAoYXJncykgY21kLmFyZ3VtZW50cyhhcmdzKTtcbiAgICB0aGlzLl9yZWdpc3RlckNvbW1hbmQoY21kKTtcbiAgICBjbWQucGFyZW50ID0gdGhpcztcbiAgICBjbWQuY29weUluaGVyaXRlZFNldHRpbmdzKHRoaXMpO1xuXG4gICAgaWYgKGRlc2MpIHJldHVybiB0aGlzO1xuICAgIHJldHVybiBjbWQ7XG4gIH1cblxuICAvKipcbiAgICogRmFjdG9yeSByb3V0aW5lIHRvIGNyZWF0ZSBhIG5ldyB1bmF0dGFjaGVkIGNvbW1hbmQuXG4gICAqXG4gICAqIFNlZSAuY29tbWFuZCgpIGZvciBjcmVhdGluZyBhbiBhdHRhY2hlZCBzdWJjb21tYW5kLCB3aGljaCB1c2VzIHRoaXMgcm91dGluZSB0b1xuICAgKiBjcmVhdGUgdGhlIGNvbW1hbmQuIFlvdSBjYW4gb3ZlcnJpZGUgY3JlYXRlQ29tbWFuZCB0byBjdXN0b21pc2Ugc3ViY29tbWFuZHMuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbbmFtZV1cbiAgICogQHJldHVybiB7Q29tbWFuZH0gbmV3IGNvbW1hbmRcbiAgICovXG5cbiAgY3JlYXRlQ29tbWFuZChuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBDb21tYW5kKG5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFlvdSBjYW4gY3VzdG9taXNlIHRoZSBoZWxwIHdpdGggYSBzdWJjbGFzcyBvZiBIZWxwIGJ5IG92ZXJyaWRpbmcgY3JlYXRlSGVscCxcbiAgICogb3IgYnkgb3ZlcnJpZGluZyBIZWxwIHByb3BlcnRpZXMgdXNpbmcgY29uZmlndXJlSGVscCgpLlxuICAgKlxuICAgKiBAcmV0dXJuIHtIZWxwfVxuICAgKi9cblxuICBjcmVhdGVIZWxwKCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyBIZWxwKCksIHRoaXMuY29uZmlndXJlSGVscCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBZb3UgY2FuIGN1c3RvbWlzZSB0aGUgaGVscCBieSBvdmVycmlkaW5nIEhlbHAgcHJvcGVydGllcyB1c2luZyBjb25maWd1cmVIZWxwKCksXG4gICAqIG9yIHdpdGggYSBzdWJjbGFzcyBvZiBIZWxwIGJ5IG92ZXJyaWRpbmcgY3JlYXRlSGVscCgpLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gW2NvbmZpZ3VyYXRpb25dIC0gY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEByZXR1cm4geyhDb21tYW5kIHwgb2JqZWN0KX0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nLCBvciBzdG9yZWQgY29uZmlndXJhdGlvblxuICAgKi9cblxuICBjb25maWd1cmVIZWxwKGNvbmZpZ3VyYXRpb24pIHtcbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5faGVscENvbmZpZ3VyYXRpb247XG5cbiAgICB0aGlzLl9oZWxwQ29uZmlndXJhdGlvbiA9IGNvbmZpZ3VyYXRpb247XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgb3V0cHV0IGdvZXMgdG8gc3Rkb3V0IGFuZCBzdGRlcnIuIFlvdSBjYW4gY3VzdG9taXNlIHRoaXMgZm9yIHNwZWNpYWxcbiAgICogYXBwbGljYXRpb25zLiBZb3UgY2FuIGFsc28gY3VzdG9taXNlIHRoZSBkaXNwbGF5IG9mIGVycm9ycyBieSBvdmVycmlkaW5nIG91dHB1dEVycm9yLlxuICAgKlxuICAgKiBUaGUgY29uZmlndXJhdGlvbiBwcm9wZXJ0aWVzIGFyZSBhbGwgZnVuY3Rpb25zOlxuICAgKlxuICAgKiAgICAgLy8gY2hhbmdlIGhvdyBvdXRwdXQgYmVpbmcgd3JpdHRlbiwgZGVmYXVsdHMgdG8gc3Rkb3V0IGFuZCBzdGRlcnJcbiAgICogICAgIHdyaXRlT3V0KHN0cilcbiAgICogICAgIHdyaXRlRXJyKHN0cilcbiAgICogICAgIC8vIGNoYW5nZSBob3cgb3V0cHV0IGJlaW5nIHdyaXR0ZW4gZm9yIGVycm9ycywgZGVmYXVsdHMgdG8gd3JpdGVFcnJcbiAgICogICAgIG91dHB1dEVycm9yKHN0ciwgd3JpdGUpIC8vIHVzZWQgZm9yIGRpc3BsYXlpbmcgZXJyb3JzIGFuZCBub3QgdXNlZCBmb3IgZGlzcGxheWluZyBoZWxwXG4gICAqICAgICAvLyBzcGVjaWZ5IHdpZHRoIGZvciB3cmFwcGluZyBoZWxwXG4gICAqICAgICBnZXRPdXRIZWxwV2lkdGgoKVxuICAgKiAgICAgZ2V0RXJySGVscFdpZHRoKClcbiAgICogICAgIC8vIGNvbG9yIHN1cHBvcnQsIGN1cnJlbnRseSBvbmx5IHVzZWQgd2l0aCBIZWxwXG4gICAqICAgICBnZXRPdXRIYXNDb2xvcnMoKVxuICAgKiAgICAgZ2V0RXJySGFzQ29sb3JzKClcbiAgICogICAgIHN0cmlwQ29sb3IoKSAvLyB1c2VkIHRvIHJlbW92ZSBBTlNJIGVzY2FwZSBjb2RlcyBpZiBvdXRwdXQgZG9lcyBub3QgaGF2ZSBjb2xvcnNcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IFtjb25maWd1cmF0aW9uXSAtIGNvbmZpZ3VyYXRpb24gb3B0aW9uc1xuICAgKiBAcmV0dXJuIHsoQ29tbWFuZCB8IG9iamVjdCl9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZywgb3Igc3RvcmVkIGNvbmZpZ3VyYXRpb25cbiAgICovXG5cbiAgY29uZmlndXJlT3V0cHV0KGNvbmZpZ3VyYXRpb24pIHtcbiAgICBpZiAoY29uZmlndXJhdGlvbiA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbjtcblxuICAgIHRoaXMuX291dHB1dENvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAuLi50aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLFxuICAgICAgLi4uY29uZmlndXJhdGlvbixcbiAgICB9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgdGhlIGhlbHAgb3IgYSBjdXN0b20gbWVzc2FnZSBhZnRlciBhbiBlcnJvciBvY2N1cnMuXG4gICAqXG4gICAqIEBwYXJhbSB7KGJvb2xlYW58c3RyaW5nKX0gW2Rpc3BsYXlIZWxwXVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIHNob3dIZWxwQWZ0ZXJFcnJvcihkaXNwbGF5SGVscCA9IHRydWUpIHtcbiAgICBpZiAodHlwZW9mIGRpc3BsYXlIZWxwICE9PSAnc3RyaW5nJykgZGlzcGxheUhlbHAgPSAhIWRpc3BsYXlIZWxwO1xuICAgIHRoaXMuX3Nob3dIZWxwQWZ0ZXJFcnJvciA9IGRpc3BsYXlIZWxwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgc3VnZ2VzdGlvbiBvZiBzaW1pbGFyIGNvbW1hbmRzIGZvciB1bmtub3duIGNvbW1hbmRzLCBvciBvcHRpb25zIGZvciB1bmtub3duIG9wdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Rpc3BsYXlTdWdnZXN0aW9uXVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIHNob3dTdWdnZXN0aW9uQWZ0ZXJFcnJvcihkaXNwbGF5U3VnZ2VzdGlvbiA9IHRydWUpIHtcbiAgICB0aGlzLl9zaG93U3VnZ2VzdGlvbkFmdGVyRXJyb3IgPSAhIWRpc3BsYXlTdWdnZXN0aW9uO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHByZXBhcmVkIHN1YmNvbW1hbmQuXG4gICAqXG4gICAqIFNlZSAuY29tbWFuZCgpIGZvciBjcmVhdGluZyBhbiBhdHRhY2hlZCBzdWJjb21tYW5kIHdoaWNoIGluaGVyaXRzIHNldHRpbmdzIGZyb20gaXRzIHBhcmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWQgLSBuZXcgc3ViY29tbWFuZFxuICAgKiBAcGFyYW0ge29iamVjdH0gW29wdHNdIC0gY29uZmlndXJhdGlvbiBvcHRpb25zXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBhZGRDb21tYW5kKGNtZCwgb3B0cykge1xuICAgIGlmICghY21kLl9uYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbW1hbmQgcGFzc2VkIHRvIC5hZGRDb21tYW5kKCkgbXVzdCBoYXZlIGEgbmFtZVxuLSBzcGVjaWZ5IHRoZSBuYW1lIGluIENvbW1hbmQgY29uc3RydWN0b3Igb3IgdXNpbmcgLm5hbWUoKWApO1xuICAgIH1cblxuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuICAgIGlmIChvcHRzLmlzRGVmYXVsdCkgdGhpcy5fZGVmYXVsdENvbW1hbmROYW1lID0gY21kLl9uYW1lO1xuICAgIGlmIChvcHRzLm5vSGVscCB8fCBvcHRzLmhpZGRlbikgY21kLl9oaWRkZW4gPSB0cnVlOyAvLyBtb2RpZnlpbmcgcGFzc2VkIGNvbW1hbmQgZHVlIHRvIGV4aXN0aW5nIGltcGxlbWVudGF0aW9uXG5cbiAgICB0aGlzLl9yZWdpc3RlckNvbW1hbmQoY21kKTtcbiAgICBjbWQucGFyZW50ID0gdGhpcztcbiAgICBjbWQuX2NoZWNrRm9yQnJva2VuUGFzc1Rocm91Z2goKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3Rvcnkgcm91dGluZSB0byBjcmVhdGUgYSBuZXcgdW5hdHRhY2hlZCBhcmd1bWVudC5cbiAgICpcbiAgICogU2VlIC5hcmd1bWVudCgpIGZvciBjcmVhdGluZyBhbiBhdHRhY2hlZCBhcmd1bWVudCwgd2hpY2ggdXNlcyB0aGlzIHJvdXRpbmUgdG9cbiAgICogY3JlYXRlIHRoZSBhcmd1bWVudC4gWW91IGNhbiBvdmVycmlkZSBjcmVhdGVBcmd1bWVudCB0byByZXR1cm4gYSBjdXN0b20gYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge0FyZ3VtZW50fSBuZXcgYXJndW1lbnRcbiAgICovXG5cbiAgY3JlYXRlQXJndW1lbnQobmFtZSwgZGVzY3JpcHRpb24pIHtcbiAgICByZXR1cm4gbmV3IEFyZ3VtZW50KG5hbWUsIGRlc2NyaXB0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYXJndW1lbnQgc3ludGF4IGZvciBjb21tYW5kLlxuICAgKlxuICAgKiBUaGUgZGVmYXVsdCBpcyB0aGF0IHRoZSBhcmd1bWVudCBpcyByZXF1aXJlZCwgYW5kIHlvdSBjYW4gZXhwbGljaXRseVxuICAgKiBpbmRpY2F0ZSB0aGlzIHdpdGggPD4gYXJvdW5kIHRoZSBuYW1lLiBQdXQgW10gYXJvdW5kIHRoZSBuYW1lIGZvciBhbiBvcHRpb25hbCBhcmd1bWVudC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogcHJvZ3JhbS5hcmd1bWVudCgnPGlucHV0LWZpbGU+Jyk7XG4gICAqIHByb2dyYW0uYXJndW1lbnQoJ1tvdXRwdXQtZmlsZV0nKTtcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHsoRnVuY3Rpb258Kil9IFtwYXJzZUFyZ10gLSBjdXN0b20gYXJndW1lbnQgcHJvY2Vzc2luZyBmdW5jdGlvbiBvciBkZWZhdWx0IHZhbHVlXG4gICAqIEBwYXJhbSB7Kn0gW2RlZmF1bHRWYWx1ZV1cbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuICBhcmd1bWVudChuYW1lLCBkZXNjcmlwdGlvbiwgcGFyc2VBcmcsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IGFyZ3VtZW50ID0gdGhpcy5jcmVhdGVBcmd1bWVudChuYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgaWYgKHR5cGVvZiBwYXJzZUFyZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJndW1lbnQuZGVmYXVsdChkZWZhdWx0VmFsdWUpLmFyZ1BhcnNlcihwYXJzZUFyZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFyZ3VtZW50LmRlZmF1bHQocGFyc2VBcmcpO1xuICAgIH1cbiAgICB0aGlzLmFkZEFyZ3VtZW50KGFyZ3VtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYXJndW1lbnQgc3ludGF4IGZvciBjb21tYW5kLCBhZGRpbmcgbXVsdGlwbGUgYXQgb25jZSAod2l0aG91dCBkZXNjcmlwdGlvbnMpLlxuICAgKlxuICAgKiBTZWUgYWxzbyAuYXJndW1lbnQoKS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogcHJvZ3JhbS5hcmd1bWVudHMoJzxjbWQ+IFtlbnZdJyk7XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lc1xuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG5cbiAgYXJndW1lbnRzKG5hbWVzKSB7XG4gICAgbmFtZXNcbiAgICAgIC50cmltKClcbiAgICAgIC5zcGxpdCgvICsvKVxuICAgICAgLmZvckVhY2goKGRldGFpbCkgPT4ge1xuICAgICAgICB0aGlzLmFyZ3VtZW50KGRldGFpbCk7XG4gICAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgYXJndW1lbnQgc3ludGF4IGZvciBjb21tYW5kLCBhZGRpbmcgYSBwcmVwYXJlZCBhcmd1bWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtBcmd1bWVudH0gYXJndW1lbnRcbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuICBhZGRBcmd1bWVudChhcmd1bWVudCkge1xuICAgIGNvbnN0IHByZXZpb3VzQXJndW1lbnQgPSB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHMuc2xpY2UoLTEpWzBdO1xuICAgIGlmIChwcmV2aW91c0FyZ3VtZW50Py52YXJpYWRpYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgb25seSB0aGUgbGFzdCBhcmd1bWVudCBjYW4gYmUgdmFyaWFkaWMgJyR7cHJldmlvdXNBcmd1bWVudC5uYW1lKCl9J2AsXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoXG4gICAgICBhcmd1bWVudC5yZXF1aXJlZCAmJlxuICAgICAgYXJndW1lbnQuZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIGFyZ3VtZW50LnBhcnNlQXJnID09PSB1bmRlZmluZWRcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGEgZGVmYXVsdCB2YWx1ZSBmb3IgYSByZXF1aXJlZCBhcmd1bWVudCBpcyBuZXZlciB1c2VkOiAnJHthcmd1bWVudC5uYW1lKCl9J2AsXG4gICAgICApO1xuICAgIH1cbiAgICB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHMucHVzaChhcmd1bWVudCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQ3VzdG9taXNlIG9yIG92ZXJyaWRlIGRlZmF1bHQgaGVscCBjb21tYW5kLiBCeSBkZWZhdWx0IGEgaGVscCBjb21tYW5kIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgaWYgeW91ciBjb21tYW5kIGhhcyBzdWJjb21tYW5kcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogICAgcHJvZ3JhbS5oZWxwQ29tbWFuZCgnaGVscCBbY21kXScpO1xuICAgKiAgICBwcm9ncmFtLmhlbHBDb21tYW5kKCdoZWxwIFtjbWRdJywgJ3Nob3cgaGVscCcpO1xuICAgKiAgICBwcm9ncmFtLmhlbHBDb21tYW5kKGZhbHNlKTsgLy8gc3VwcHJlc3MgZGVmYXVsdCBoZWxwIGNvbW1hbmRcbiAgICogICAgcHJvZ3JhbS5oZWxwQ29tbWFuZCh0cnVlKTsgLy8gYWRkIGhlbHAgY29tbWFuZCBldmVuIGlmIG5vIHN1YmNvbW1hbmRzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfGJvb2xlYW59IGVuYWJsZU9yTmFtZUFuZEFyZ3MgLSBlbmFibGUgd2l0aCBjdXN0b20gbmFtZSBhbmQvb3IgYXJndW1lbnRzLCBvciBib29sZWFuIHRvIG92ZXJyaWRlIHdoZXRoZXIgYWRkZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl0gLSBjdXN0b20gZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuXG4gIGhlbHBDb21tYW5kKGVuYWJsZU9yTmFtZUFuZEFyZ3MsIGRlc2NyaXB0aW9uKSB7XG4gICAgaWYgKHR5cGVvZiBlbmFibGVPck5hbWVBbmRBcmdzID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHRoaXMuX2FkZEltcGxpY2l0SGVscENvbW1hbmQgPSBlbmFibGVPck5hbWVBbmRBcmdzO1xuICAgICAgaWYgKGVuYWJsZU9yTmFtZUFuZEFyZ3MgJiYgdGhpcy5fZGVmYXVsdENvbW1hbmRHcm91cCkge1xuICAgICAgICAvLyBtYWtlIHRoZSBjb21tYW5kIHRvIHN0b3JlIHRoZSBncm91cFxuICAgICAgICB0aGlzLl9pbml0Q29tbWFuZEdyb3VwKHRoaXMuX2dldEhlbHBDb21tYW5kKCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY29uc3QgbmFtZUFuZEFyZ3MgPSBlbmFibGVPck5hbWVBbmRBcmdzID8/ICdoZWxwIFtjb21tYW5kXSc7XG4gICAgY29uc3QgWywgaGVscE5hbWUsIGhlbHBBcmdzXSA9IG5hbWVBbmRBcmdzLm1hdGNoKC8oW14gXSspICooLiopLyk7XG4gICAgY29uc3QgaGVscERlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gPz8gJ2Rpc3BsYXkgaGVscCBmb3IgY29tbWFuZCc7XG5cbiAgICBjb25zdCBoZWxwQ29tbWFuZCA9IHRoaXMuY3JlYXRlQ29tbWFuZChoZWxwTmFtZSk7XG4gICAgaGVscENvbW1hbmQuaGVscE9wdGlvbihmYWxzZSk7XG4gICAgaWYgKGhlbHBBcmdzKSBoZWxwQ29tbWFuZC5hcmd1bWVudHMoaGVscEFyZ3MpO1xuICAgIGlmIChoZWxwRGVzY3JpcHRpb24pIGhlbHBDb21tYW5kLmRlc2NyaXB0aW9uKGhlbHBEZXNjcmlwdGlvbik7XG5cbiAgICB0aGlzLl9hZGRJbXBsaWNpdEhlbHBDb21tYW5kID0gdHJ1ZTtcbiAgICB0aGlzLl9oZWxwQ29tbWFuZCA9IGhlbHBDb21tYW5kO1xuICAgIC8vIGluaXQgZ3JvdXAgdW5sZXNzIGxhenkgY3JlYXRlXG4gICAgaWYgKGVuYWJsZU9yTmFtZUFuZEFyZ3MgfHwgZGVzY3JpcHRpb24pIHRoaXMuX2luaXRDb21tYW5kR3JvdXAoaGVscENvbW1hbmQpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIHByZXBhcmVkIGN1c3RvbSBoZWxwIGNvbW1hbmQuXG4gICAqXG4gICAqIEBwYXJhbSB7KENvbW1hbmR8c3RyaW5nfGJvb2xlYW4pfSBoZWxwQ29tbWFuZCAtIGN1c3RvbSBoZWxwIGNvbW1hbmQsIG9yIGRlcHJlY2F0ZWQgZW5hYmxlT3JOYW1lQW5kQXJncyBhcyBmb3IgYC5oZWxwQ29tbWFuZCgpYFxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2RlcHJlY2F0ZWREZXNjcmlwdGlvbl0gLSBkZXByZWNhdGVkIGN1c3RvbSBkZXNjcmlwdGlvbiB1c2VkIHdpdGggY3VzdG9tIG5hbWUgb25seVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIGFkZEhlbHBDb21tYW5kKGhlbHBDb21tYW5kLCBkZXByZWNhdGVkRGVzY3JpcHRpb24pIHtcbiAgICAvLyBJZiBub3QgcGFzc2VkIGFuIG9iamVjdCwgY2FsbCB0aHJvdWdoIHRvIGhlbHBDb21tYW5kIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSxcbiAgICAvLyBhcyBhZGRIZWxwQ29tbWFuZCB3YXMgb3JpZ2luYWxseSB1c2VkIGxpa2UgaGVscENvbW1hbmQgaXMgbm93LlxuICAgIGlmICh0eXBlb2YgaGVscENvbW1hbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmhlbHBDb21tYW5kKGhlbHBDb21tYW5kLCBkZXByZWNhdGVkRGVzY3JpcHRpb24pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdGhpcy5fYWRkSW1wbGljaXRIZWxwQ29tbWFuZCA9IHRydWU7XG4gICAgdGhpcy5faGVscENvbW1hbmQgPSBoZWxwQ29tbWFuZDtcbiAgICB0aGlzLl9pbml0Q29tbWFuZEdyb3VwKGhlbHBDb21tYW5kKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBMYXp5IGNyZWF0ZSBoZWxwIGNvbW1hbmQuXG4gICAqXG4gICAqIEByZXR1cm4geyhDb21tYW5kfG51bGwpfVxuICAgKiBAcGFja2FnZVxuICAgKi9cbiAgX2dldEhlbHBDb21tYW5kKCkge1xuICAgIGNvbnN0IGhhc0ltcGxpY2l0SGVscENvbW1hbmQgPVxuICAgICAgdGhpcy5fYWRkSW1wbGljaXRIZWxwQ29tbWFuZCA/P1xuICAgICAgKHRoaXMuY29tbWFuZHMubGVuZ3RoICYmXG4gICAgICAgICF0aGlzLl9hY3Rpb25IYW5kbGVyICYmXG4gICAgICAgICF0aGlzLl9maW5kQ29tbWFuZCgnaGVscCcpKTtcblxuICAgIGlmIChoYXNJbXBsaWNpdEhlbHBDb21tYW5kKSB7XG4gICAgICBpZiAodGhpcy5faGVscENvbW1hbmQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmhlbHBDb21tYW5kKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTsgLy8gdXNlIGRlZmF1bHQgbmFtZSBhbmQgZGVzY3JpcHRpb25cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLl9oZWxwQ29tbWFuZDtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGhvb2sgZm9yIGxpZmUgY3ljbGUgZXZlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lclxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG5cbiAgaG9vayhldmVudCwgbGlzdGVuZXIpIHtcbiAgICBjb25zdCBhbGxvd2VkVmFsdWVzID0gWydwcmVTdWJjb21tYW5kJywgJ3ByZUFjdGlvbicsICdwb3N0QWN0aW9uJ107XG4gICAgaWYgKCFhbGxvd2VkVmFsdWVzLmluY2x1ZGVzKGV2ZW50KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIHZhbHVlIGZvciBldmVudCBwYXNzZWQgdG8gaG9vayA6ICcke2V2ZW50fScuXG5FeHBlY3Rpbmcgb25lIG9mICcke2FsbG93ZWRWYWx1ZXMuam9pbihcIicsICdcIil9J2ApO1xuICAgIH1cbiAgICBpZiAodGhpcy5fbGlmZUN5Y2xlSG9va3NbZXZlbnRdKSB7XG4gICAgICB0aGlzLl9saWZlQ3ljbGVIb29rc1tldmVudF0ucHVzaChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2xpZmVDeWNsZUhvb2tzW2V2ZW50XSA9IFtsaXN0ZW5lcl07XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGNhbGxiYWNrIHRvIHVzZSBhcyByZXBsYWNlbWVudCBmb3IgY2FsbGluZyBwcm9jZXNzLmV4aXQuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IFtmbl0gb3B0aW9uYWwgY2FsbGJhY2sgd2hpY2ggd2lsbCBiZSBwYXNzZWQgYSBDb21tYW5kZXJFcnJvciwgZGVmYXVsdHMgdG8gdGhyb3dpbmdcbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuXG4gIGV4aXRPdmVycmlkZShmbikge1xuICAgIGlmIChmbikge1xuICAgICAgdGhpcy5fZXhpdENhbGxiYWNrID0gZm47XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2V4aXRDYWxsYmFjayA9IChlcnIpID0+IHtcbiAgICAgICAgaWYgKGVyci5jb2RlICE9PSAnY29tbWFuZGVyLmV4ZWN1dGVTdWJDb21tYW5kQXN5bmMnKSB7XG4gICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEFzeW5jIGNhbGxiYWNrIGZyb20gc3Bhd24gZXZlbnRzLCBub3QgdXNlZnVsIHRvIHRocm93LlxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsIHByb2Nlc3MuZXhpdCwgYW5kIF9leGl0Q2FsbGJhY2sgaWYgZGVmaW5lZC5cbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGV4aXRDb2RlIGV4aXQgY29kZSBmb3IgdXNpbmcgd2l0aCBwcm9jZXNzLmV4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgYW4gaWQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZXJyb3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yXG4gICAqIEByZXR1cm4gbmV2ZXJcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2V4aXQoZXhpdENvZGUsIGNvZGUsIG1lc3NhZ2UpIHtcbiAgICBpZiAodGhpcy5fZXhpdENhbGxiYWNrKSB7XG4gICAgICB0aGlzLl9leGl0Q2FsbGJhY2sobmV3IENvbW1hbmRlckVycm9yKGV4aXRDb2RlLCBjb2RlLCBtZXNzYWdlKSk7XG4gICAgICAvLyBFeHBlY3RpbmcgdGhpcyBsaW5lIGlzIG5vdCByZWFjaGVkLlxuICAgIH1cbiAgICBwcm9jZXNzLmV4aXQoZXhpdENvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGNhbGxiYWNrIGBmbmAgZm9yIHRoZSBjb21tYW5kLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBwcm9ncmFtXG4gICAqICAgLmNvbW1hbmQoJ3NlcnZlJylcbiAgICogICAuZGVzY3JpcHRpb24oJ3N0YXJ0IHNlcnZpY2UnKVxuICAgKiAgIC5hY3Rpb24oZnVuY3Rpb24oKSB7XG4gICAqICAgICAgLy8gZG8gd29yayBoZXJlXG4gICAqICAgfSk7XG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBhY3Rpb24oZm4pIHtcbiAgICBjb25zdCBsaXN0ZW5lciA9IChhcmdzKSA9PiB7XG4gICAgICAvLyBUaGUgLmFjdGlvbiBjYWxsYmFjayB0YWtlcyBhbiBleHRyYSBwYXJhbWV0ZXIgd2hpY2ggaXMgdGhlIGNvbW1hbmQgb3Igb3B0aW9ucy5cbiAgICAgIGNvbnN0IGV4cGVjdGVkQXJnc0NvdW50ID0gdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGFjdGlvbkFyZ3MgPSBhcmdzLnNsaWNlKDAsIGV4cGVjdGVkQXJnc0NvdW50KTtcbiAgICAgIGlmICh0aGlzLl9zdG9yZU9wdGlvbnNBc1Byb3BlcnRpZXMpIHtcbiAgICAgICAgYWN0aW9uQXJnc1tleHBlY3RlZEFyZ3NDb3VudF0gPSB0aGlzOyAvLyBiYWNrd2FyZHMgY29tcGF0aWJsZSBcIm9wdGlvbnNcIlxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWN0aW9uQXJnc1tleHBlY3RlZEFyZ3NDb3VudF0gPSB0aGlzLm9wdHMoKTtcbiAgICAgIH1cbiAgICAgIGFjdGlvbkFyZ3MucHVzaCh0aGlzKTtcblxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFjdGlvbkFyZ3MpO1xuICAgIH07XG4gICAgdGhpcy5fYWN0aW9uSGFuZGxlciA9IGxpc3RlbmVyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEZhY3Rvcnkgcm91dGluZSB0byBjcmVhdGUgYSBuZXcgdW5hdHRhY2hlZCBvcHRpb24uXG4gICAqXG4gICAqIFNlZSAub3B0aW9uKCkgZm9yIGNyZWF0aW5nIGFuIGF0dGFjaGVkIG9wdGlvbiwgd2hpY2ggdXNlcyB0aGlzIHJvdXRpbmUgdG9cbiAgICogY3JlYXRlIHRoZSBvcHRpb24uIFlvdSBjYW4gb3ZlcnJpZGUgY3JlYXRlT3B0aW9uIHRvIHJldHVybiBhIGN1c3RvbSBvcHRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmbGFnc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtPcHRpb259IG5ldyBvcHRpb25cbiAgICovXG5cbiAgY3JlYXRlT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiBuZXcgT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogV3JhcCBwYXJzZUFyZ3MgdG8gY2F0Y2ggJ2NvbW1hbmRlci5pbnZhbGlkQXJndW1lbnQnLlxuICAgKlxuICAgKiBAcGFyYW0geyhPcHRpb24gfCBBcmd1bWVudCl9IHRhcmdldFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAgICogQHBhcmFtIHsqfSBwcmV2aW91c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gaW52YWxpZEFyZ3VtZW50TWVzc2FnZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBfY2FsbFBhcnNlQXJnKHRhcmdldCwgdmFsdWUsIHByZXZpb3VzLCBpbnZhbGlkQXJndW1lbnRNZXNzYWdlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0YXJnZXQucGFyc2VBcmcodmFsdWUsIHByZXZpb3VzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGlmIChlcnIuY29kZSA9PT0gJ2NvbW1hbmRlci5pbnZhbGlkQXJndW1lbnQnKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJHtpbnZhbGlkQXJndW1lbnRNZXNzYWdlfSAke2Vyci5tZXNzYWdlfWA7XG4gICAgICAgIHRoaXMuZXJyb3IobWVzc2FnZSwgeyBleGl0Q29kZTogZXJyLmV4aXRDb2RlLCBjb2RlOiBlcnIuY29kZSB9KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgZm9yIG9wdGlvbiBmbGFnIGNvbmZsaWN0cy5cbiAgICogUmVnaXN0ZXIgb3B0aW9uIGlmIG5vIGNvbmZsaWN0cyBmb3VuZCwgb3IgdGhyb3cgb24gY29uZmxpY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX3JlZ2lzdGVyT3B0aW9uKG9wdGlvbikge1xuICAgIGNvbnN0IG1hdGNoaW5nT3B0aW9uID1cbiAgICAgIChvcHRpb24uc2hvcnQgJiYgdGhpcy5fZmluZE9wdGlvbihvcHRpb24uc2hvcnQpKSB8fFxuICAgICAgKG9wdGlvbi5sb25nICYmIHRoaXMuX2ZpbmRPcHRpb24ob3B0aW9uLmxvbmcpKTtcbiAgICBpZiAobWF0Y2hpbmdPcHRpb24pIHtcbiAgICAgIGNvbnN0IG1hdGNoaW5nRmxhZyA9XG4gICAgICAgIG9wdGlvbi5sb25nICYmIHRoaXMuX2ZpbmRPcHRpb24ob3B0aW9uLmxvbmcpXG4gICAgICAgICAgPyBvcHRpb24ubG9uZ1xuICAgICAgICAgIDogb3B0aW9uLnNob3J0O1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgYWRkIG9wdGlvbiAnJHtvcHRpb24uZmxhZ3N9JyR7dGhpcy5fbmFtZSAmJiBgIHRvIGNvbW1hbmQgJyR7dGhpcy5fbmFtZX0nYH0gZHVlIHRvIGNvbmZsaWN0aW5nIGZsYWcgJyR7bWF0Y2hpbmdGbGFnfSdcbi0gIGFscmVhZHkgdXNlZCBieSBvcHRpb24gJyR7bWF0Y2hpbmdPcHRpb24uZmxhZ3N9J2ApO1xuICAgIH1cblxuICAgIHRoaXMuX2luaXRPcHRpb25Hcm91cChvcHRpb24pO1xuICAgIHRoaXMub3B0aW9ucy5wdXNoKG9wdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgZm9yIGNvbW1hbmQgbmFtZSBhbmQgYWxpYXMgY29uZmxpY3RzIHdpdGggZXhpc3RpbmcgY29tbWFuZHMuXG4gICAqIFJlZ2lzdGVyIGNvbW1hbmQgaWYgbm8gY29uZmxpY3RzIGZvdW5kLCBvciB0aHJvdyBvbiBjb25mbGljdC5cbiAgICpcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjb21tYW5kXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9yZWdpc3RlckNvbW1hbmQoY29tbWFuZCkge1xuICAgIGNvbnN0IGtub3duQnkgPSAoY21kKSA9PiB7XG4gICAgICByZXR1cm4gW2NtZC5uYW1lKCldLmNvbmNhdChjbWQuYWxpYXNlcygpKTtcbiAgICB9O1xuXG4gICAgY29uc3QgYWxyZWFkeVVzZWQgPSBrbm93bkJ5KGNvbW1hbmQpLmZpbmQoKG5hbWUpID0+XG4gICAgICB0aGlzLl9maW5kQ29tbWFuZChuYW1lKSxcbiAgICApO1xuICAgIGlmIChhbHJlYWR5VXNlZCkge1xuICAgICAgY29uc3QgZXhpc3RpbmdDbWQgPSBrbm93bkJ5KHRoaXMuX2ZpbmRDb21tYW5kKGFscmVhZHlVc2VkKSkuam9pbignfCcpO1xuICAgICAgY29uc3QgbmV3Q21kID0ga25vd25CeShjb21tYW5kKS5qb2luKCd8Jyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBjYW5ub3QgYWRkIGNvbW1hbmQgJyR7bmV3Q21kfScgYXMgYWxyZWFkeSBoYXZlIGNvbW1hbmQgJyR7ZXhpc3RpbmdDbWR9J2AsXG4gICAgICApO1xuICAgIH1cblxuICAgIHRoaXMuX2luaXRDb21tYW5kR3JvdXAoY29tbWFuZCk7XG4gICAgdGhpcy5jb21tYW5kcy5wdXNoKGNvbW1hbmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBvcHRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuICBhZGRPcHRpb24ob3B0aW9uKSB7XG4gICAgdGhpcy5fcmVnaXN0ZXJPcHRpb24ob3B0aW9uKTtcblxuICAgIGNvbnN0IG9uYW1lID0gb3B0aW9uLm5hbWUoKTtcbiAgICBjb25zdCBuYW1lID0gb3B0aW9uLmF0dHJpYnV0ZU5hbWUoKTtcblxuICAgIC8vIHN0b3JlIGRlZmF1bHQgdmFsdWVcbiAgICBpZiAob3B0aW9uLm5lZ2F0ZSkge1xuICAgICAgLy8gLS1uby1mb28gaXMgc3BlY2lhbCBhbmQgZGVmYXVsdHMgZm9vIHRvIHRydWUsIHVubGVzcyBhIC0tZm9vIG9wdGlvbiBpcyBhbHJlYWR5IGRlZmluZWRcbiAgICAgIGNvbnN0IHBvc2l0aXZlTG9uZ0ZsYWcgPSBvcHRpb24ubG9uZy5yZXBsYWNlKC9eLS1uby0vLCAnLS0nKTtcbiAgICAgIGlmICghdGhpcy5fZmluZE9wdGlvbihwb3NpdGl2ZUxvbmdGbGFnKSkge1xuICAgICAgICB0aGlzLnNldE9wdGlvblZhbHVlV2l0aFNvdXJjZShcbiAgICAgICAgICBuYW1lLFxuICAgICAgICAgIG9wdGlvbi5kZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBvcHRpb24uZGVmYXVsdFZhbHVlLFxuICAgICAgICAgICdkZWZhdWx0JyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9wdGlvbi5kZWZhdWx0VmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5zZXRPcHRpb25WYWx1ZVdpdGhTb3VyY2UobmFtZSwgb3B0aW9uLmRlZmF1bHRWYWx1ZSwgJ2RlZmF1bHQnKTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGVyIGZvciBjbGkgYW5kIGVudiBzdXBwbGllZCB2YWx1ZXNcbiAgICBjb25zdCBoYW5kbGVPcHRpb25WYWx1ZSA9ICh2YWwsIGludmFsaWRWYWx1ZU1lc3NhZ2UsIHZhbHVlU291cmNlKSA9PiB7XG4gICAgICAvLyB2YWwgaXMgbnVsbCBmb3Igb3B0aW9uYWwgb3B0aW9uIHVzZWQgd2l0aG91dCBhbiBvcHRpb25hbC1hcmd1bWVudC5cbiAgICAgIC8vIHZhbCBpcyB1bmRlZmluZWQgZm9yIGJvb2xlYW4gYW5kIG5lZ2F0ZWQgb3B0aW9uLlxuICAgICAgaWYgKHZhbCA9PSBudWxsICYmIG9wdGlvbi5wcmVzZXRBcmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YWwgPSBvcHRpb24ucHJlc2V0QXJnO1xuICAgICAgfVxuXG4gICAgICAvLyBjdXN0b20gcHJvY2Vzc2luZ1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSB0aGlzLmdldE9wdGlvblZhbHVlKG5hbWUpO1xuICAgICAgaWYgKHZhbCAhPT0gbnVsbCAmJiBvcHRpb24ucGFyc2VBcmcpIHtcbiAgICAgICAgdmFsID0gdGhpcy5fY2FsbFBhcnNlQXJnKG9wdGlvbiwgdmFsLCBvbGRWYWx1ZSwgaW52YWxpZFZhbHVlTWVzc2FnZSk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCAhPT0gbnVsbCAmJiBvcHRpb24udmFyaWFkaWMpIHtcbiAgICAgICAgdmFsID0gb3B0aW9uLl9jb2xsZWN0VmFsdWUodmFsLCBvbGRWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZpbGwtaW4gYXBwcm9wcmlhdGUgbWlzc2luZyB2YWx1ZXMuIExvbmcgd2luZGVkIGJ1dCBlYXN5IHRvIGZvbGxvdy5cbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICBpZiAob3B0aW9uLm5lZ2F0ZSkge1xuICAgICAgICAgIHZhbCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi5pc0Jvb2xlYW4oKSB8fCBvcHRpb24ub3B0aW9uYWwpIHtcbiAgICAgICAgICB2YWwgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbCA9ICcnOyAvLyBub3Qgbm9ybWFsLCBwYXJzZUFyZyBtaWdodCBoYXZlIGZhaWxlZCBvciBiZSBhIG1vY2sgZnVuY3Rpb24gZm9yIHRlc3RpbmdcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRPcHRpb25WYWx1ZVdpdGhTb3VyY2UobmFtZSwgdmFsLCB2YWx1ZVNvdXJjZSk7XG4gICAgfTtcblxuICAgIHRoaXMub24oJ29wdGlvbjonICsgb25hbWUsICh2YWwpID0+IHtcbiAgICAgIGNvbnN0IGludmFsaWRWYWx1ZU1lc3NhZ2UgPSBgZXJyb3I6IG9wdGlvbiAnJHtvcHRpb24uZmxhZ3N9JyBhcmd1bWVudCAnJHt2YWx9JyBpcyBpbnZhbGlkLmA7XG4gICAgICBoYW5kbGVPcHRpb25WYWx1ZSh2YWwsIGludmFsaWRWYWx1ZU1lc3NhZ2UsICdjbGknKTtcbiAgICB9KTtcblxuICAgIGlmIChvcHRpb24uZW52VmFyKSB7XG4gICAgICB0aGlzLm9uKCdvcHRpb25FbnY6JyArIG9uYW1lLCAodmFsKSA9PiB7XG4gICAgICAgIGNvbnN0IGludmFsaWRWYWx1ZU1lc3NhZ2UgPSBgZXJyb3I6IG9wdGlvbiAnJHtvcHRpb24uZmxhZ3N9JyB2YWx1ZSAnJHt2YWx9JyBmcm9tIGVudiAnJHtvcHRpb24uZW52VmFyfScgaXMgaW52YWxpZC5gO1xuICAgICAgICBoYW5kbGVPcHRpb25WYWx1ZSh2YWwsIGludmFsaWRWYWx1ZU1lc3NhZ2UsICdlbnYnKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVybmFsIGltcGxlbWVudGF0aW9uIHNoYXJlZCBieSAub3B0aW9uKCkgYW5kIC5yZXF1aXJlZE9wdGlvbigpXG4gICAqXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX29wdGlvbkV4KGNvbmZpZywgZmxhZ3MsIGRlc2NyaXB0aW9uLCBmbiwgZGVmYXVsdFZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBmbGFncyA9PT0gJ29iamVjdCcgJiYgZmxhZ3MgaW5zdGFuY2VvZiBPcHRpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RvIGFkZCBhbiBPcHRpb24gb2JqZWN0IHVzZSBhZGRPcHRpb24oKSBpbnN0ZWFkIG9mIG9wdGlvbigpIG9yIHJlcXVpcmVkT3B0aW9uKCknLFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc3Qgb3B0aW9uID0gdGhpcy5jcmVhdGVPcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uKTtcbiAgICBvcHRpb24ubWFrZU9wdGlvbk1hbmRhdG9yeSghIWNvbmZpZy5tYW5kYXRvcnkpO1xuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9wdGlvbi5kZWZhdWx0KGRlZmF1bHRWYWx1ZSkuYXJnUGFyc2VyKGZuKTtcbiAgICB9IGVsc2UgaWYgKGZuIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAvLyBkZXByZWNhdGVkXG4gICAgICBjb25zdCByZWdleCA9IGZuO1xuICAgICAgZm4gPSAodmFsLCBkZWYpID0+IHtcbiAgICAgICAgY29uc3QgbSA9IHJlZ2V4LmV4ZWModmFsKTtcbiAgICAgICAgcmV0dXJuIG0gPyBtWzBdIDogZGVmO1xuICAgICAgfTtcbiAgICAgIG9wdGlvbi5kZWZhdWx0KGRlZmF1bHRWYWx1ZSkuYXJnUGFyc2VyKGZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uLmRlZmF1bHQoZm4pO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmFkZE9wdGlvbihvcHRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBvcHRpb24gd2l0aCBgZmxhZ3NgLCBgZGVzY3JpcHRpb25gLCBhbmQgb3B0aW9uYWwgYXJndW1lbnQgcGFyc2luZyBmdW5jdGlvbiBvciBgZGVmYXVsdFZhbHVlYCBvciBib3RoLlxuICAgKlxuICAgKiBUaGUgYGZsYWdzYCBzdHJpbmcgY29udGFpbnMgdGhlIHNob3J0IGFuZC9vciBsb25nIGZsYWdzLCBzZXBhcmF0ZWQgYnkgY29tbWEsIGEgcGlwZSBvciBzcGFjZS4gQSByZXF1aXJlZFxuICAgKiBvcHRpb24tYXJndW1lbnQgaXMgaW5kaWNhdGVkIGJ5IGA8PmAgYW5kIGFuIG9wdGlvbmFsIG9wdGlvbi1hcmd1bWVudCBieSBgW11gLlxuICAgKlxuICAgKiBTZWUgdGhlIFJFQURNRSBmb3IgbW9yZSBkZXRhaWxzLCBhbmQgc2VlIGFsc28gYWRkT3B0aW9uKCkgYW5kIHJlcXVpcmVkT3B0aW9uKCkuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW1cbiAgICogICAgIC5vcHRpb24oJy1wLCAtLXBlcHBlcicsICdhZGQgcGVwcGVyJylcbiAgICogICAgIC5vcHRpb24oJy0tcHQsIC0tcGl6emEtdHlwZSA8VFlQRT4nLCAndHlwZSBvZiBwaXp6YScpIC8vIHJlcXVpcmVkIG9wdGlvbi1hcmd1bWVudFxuICAgKiAgICAgLm9wdGlvbignLWMsIC0tY2hlZXNlIFtDSEVFU0VdJywgJ2FkZCBleHRyYSBjaGVlc2UnLCAnbW96emFyZWxsYScpIC8vIG9wdGlvbmFsIG9wdGlvbi1hcmd1bWVudCB3aXRoIGRlZmF1bHRcbiAgICogICAgIC5vcHRpb24oJy10LCAtLXRpcCA8VkFMVUU+JywgJ2FkZCB0aXAgdG8gcHVyY2hhc2UgY29zdCcsIHBhcnNlRmxvYXQpIC8vIGN1c3RvbSBwYXJzZSBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmxhZ3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHsoRnVuY3Rpb258Kil9IFtwYXJzZUFyZ10gLSBjdXN0b20gb3B0aW9uIHByb2Nlc3NpbmcgZnVuY3Rpb24gb3IgZGVmYXVsdCB2YWx1ZVxuICAgKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBvcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uLCBwYXJzZUFyZywgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX29wdGlvbkV4KHt9LCBmbGFncywgZGVzY3JpcHRpb24sIHBhcnNlQXJnLCBkZWZhdWx0VmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlcXVpcmVkIG9wdGlvbiB3aGljaCBtdXN0IGhhdmUgYSB2YWx1ZSBhZnRlciBwYXJzaW5nLiBUaGlzIHVzdWFsbHkgbWVhbnNcbiAgICogdGhlIG9wdGlvbiBtdXN0IGJlIHNwZWNpZmllZCBvbiB0aGUgY29tbWFuZCBsaW5lLiAoT3RoZXJ3aXNlIHRoZSBzYW1lIGFzIC5vcHRpb24oKS4pXG4gICAqXG4gICAqIFRoZSBgZmxhZ3NgIHN0cmluZyBjb250YWlucyB0aGUgc2hvcnQgYW5kL29yIGxvbmcgZmxhZ3MsIHNlcGFyYXRlZCBieSBjb21tYSwgYSBwaXBlIG9yIHNwYWNlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmxhZ3NcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHsoRnVuY3Rpb258Kil9IFtwYXJzZUFyZ10gLSBjdXN0b20gb3B0aW9uIHByb2Nlc3NpbmcgZnVuY3Rpb24gb3IgZGVmYXVsdCB2YWx1ZVxuICAgKiBAcGFyYW0geyp9IFtkZWZhdWx0VmFsdWVdXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICByZXF1aXJlZE9wdGlvbihmbGFncywgZGVzY3JpcHRpb24sIHBhcnNlQXJnLCBkZWZhdWx0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uRXgoXG4gICAgICB7IG1hbmRhdG9yeTogdHJ1ZSB9LFxuICAgICAgZmxhZ3MsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIHBhcnNlQXJnLFxuICAgICAgZGVmYXVsdFZhbHVlLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQWx0ZXIgcGFyc2luZyBvZiBzaG9ydCBmbGFncyB3aXRoIG9wdGlvbmFsIHZhbHVlcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gZm9yIGAub3B0aW9uKCctZiwtLWZsYWcgW3ZhbHVlXScpOlxuICAgKiBwcm9ncmFtLmNvbWJpbmVGbGFnQW5kT3B0aW9uYWxWYWx1ZSh0cnVlKTsgIC8vIGAtZjgwYCBpcyB0cmVhdGVkIGxpa2UgYC0tZmxhZz04MGAsIHRoaXMgaXMgdGhlIGRlZmF1bHQgYmVoYXZpb3VyXG4gICAqIHByb2dyYW0uY29tYmluZUZsYWdBbmRPcHRpb25hbFZhbHVlKGZhbHNlKSAvLyBgLWZiYCBpcyB0cmVhdGVkIGxpa2UgYC1mIC1iYFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjb21iaW5lXSAtIGlmIGB0cnVlYCBvciBvbWl0dGVkLCBhbiBvcHRpb25hbCB2YWx1ZSBjYW4gYmUgc3BlY2lmaWVkIGRpcmVjdGx5IGFmdGVyIHRoZSBmbGFnLlxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIGNvbWJpbmVGbGFnQW5kT3B0aW9uYWxWYWx1ZShjb21iaW5lID0gdHJ1ZSkge1xuICAgIHRoaXMuX2NvbWJpbmVGbGFnQW5kT3B0aW9uYWxWYWx1ZSA9ICEhY29tYmluZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyB1bmtub3duIG9wdGlvbnMgb24gdGhlIGNvbW1hbmQgbGluZS5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBbYWxsb3dVbmtub3duXSAtIGlmIGB0cnVlYCBvciBvbWl0dGVkLCBubyBlcnJvciB3aWxsIGJlIHRocm93biBmb3IgdW5rbm93biBvcHRpb25zLlxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIGFsbG93VW5rbm93bk9wdGlvbihhbGxvd1Vua25vd24gPSB0cnVlKSB7XG4gICAgdGhpcy5fYWxsb3dVbmtub3duT3B0aW9uID0gISFhbGxvd1Vua25vd247XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgZXhjZXNzIGNvbW1hbmQtYXJndW1lbnRzIG9uIHRoZSBjb21tYW5kIGxpbmUuIFBhc3MgZmFsc2UgdG8gbWFrZSBleGNlc3MgYXJndW1lbnRzIGFuIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFthbGxvd0V4Y2Vzc10gLSBpZiBgdHJ1ZWAgb3Igb21pdHRlZCwgbm8gZXJyb3Igd2lsbCBiZSB0aHJvd24gZm9yIGV4Y2VzcyBhcmd1bWVudHMuXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cbiAgYWxsb3dFeGNlc3NBcmd1bWVudHMoYWxsb3dFeGNlc3MgPSB0cnVlKSB7XG4gICAgdGhpcy5fYWxsb3dFeGNlc3NBcmd1bWVudHMgPSAhIWFsbG93RXhjZXNzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZSBwb3NpdGlvbmFsIG9wdGlvbnMuIFBvc2l0aW9uYWwgbWVhbnMgZ2xvYmFsIG9wdGlvbnMgYXJlIHNwZWNpZmllZCBiZWZvcmUgc3ViY29tbWFuZHMgd2hpY2ggbGV0c1xuICAgKiBzdWJjb21tYW5kcyByZXVzZSB0aGUgc2FtZSBvcHRpb24gbmFtZXMsIGFuZCBhbHNvIGVuYWJsZXMgc3ViY29tbWFuZHMgdG8gdHVybiBvbiBwYXNzVGhyb3VnaE9wdGlvbnMuXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW91ciBpcyBub24tcG9zaXRpb25hbCBhbmQgZ2xvYmFsIG9wdGlvbnMgbWF5IGFwcGVhciBhbnl3aGVyZSBvbiB0aGUgY29tbWFuZCBsaW5lLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtwb3NpdGlvbmFsXVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG4gIGVuYWJsZVBvc2l0aW9uYWxPcHRpb25zKHBvc2l0aW9uYWwgPSB0cnVlKSB7XG4gICAgdGhpcy5fZW5hYmxlUG9zaXRpb25hbE9wdGlvbnMgPSAhIXBvc2l0aW9uYWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyB0aHJvdWdoIG9wdGlvbnMgdGhhdCBjb21lIGFmdGVyIGNvbW1hbmQtYXJndW1lbnRzIHJhdGhlciB0aGFuIHRyZWF0IHRoZW0gYXMgY29tbWFuZC1vcHRpb25zLFxuICAgKiBzbyBhY3R1YWwgY29tbWFuZC1vcHRpb25zIGNvbWUgYmVmb3JlIGNvbW1hbmQtYXJndW1lbnRzLiBUdXJuaW5nIHRoaXMgb24gZm9yIGEgc3ViY29tbWFuZCByZXF1aXJlc1xuICAgKiBwb3NpdGlvbmFsIG9wdGlvbnMgdG8gaGF2ZSBiZWVuIGVuYWJsZWQgb24gdGhlIHByb2dyYW0gKHBhcmVudCBjb21tYW5kcykuXG4gICAqIFRoZSBkZWZhdWx0IGJlaGF2aW91ciBpcyBub24tcG9zaXRpb25hbCBhbmQgb3B0aW9ucyBtYXkgYXBwZWFyIGJlZm9yZSBvciBhZnRlciBjb21tYW5kLWFyZ3VtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBbcGFzc1Rocm91Z2hdIGZvciB1bmtub3duIG9wdGlvbnMuXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cbiAgcGFzc1Rocm91Z2hPcHRpb25zKHBhc3NUaHJvdWdoID0gdHJ1ZSkge1xuICAgIHRoaXMuX3Bhc3NUaHJvdWdoT3B0aW9ucyA9ICEhcGFzc1Rocm91Z2g7XG4gICAgdGhpcy5fY2hlY2tGb3JCcm9rZW5QYXNzVGhyb3VnaCgpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9jaGVja0ZvckJyb2tlblBhc3NUaHJvdWdoKCkge1xuICAgIGlmIChcbiAgICAgIHRoaXMucGFyZW50ICYmXG4gICAgICB0aGlzLl9wYXNzVGhyb3VnaE9wdGlvbnMgJiZcbiAgICAgICF0aGlzLnBhcmVudC5fZW5hYmxlUG9zaXRpb25hbE9wdGlvbnNcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYHBhc3NUaHJvdWdoT3B0aW9ucyBjYW5ub3QgYmUgdXNlZCBmb3IgJyR7dGhpcy5fbmFtZX0nIHdpdGhvdXQgdHVybmluZyBvbiBlbmFibGVQb3NpdGlvbmFsT3B0aW9ucyBmb3IgcGFyZW50IGNvbW1hbmQocylgLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hldGhlciB0byBzdG9yZSBvcHRpb24gdmFsdWVzIGFzIHByb3BlcnRpZXMgb24gY29tbWFuZCBvYmplY3QsXG4gICAqIG9yIHN0b3JlIHNlcGFyYXRlbHkgKHNwZWNpZnkgZmFsc2UpLiBJbiBib3RoIGNhc2VzIHRoZSBvcHRpb24gdmFsdWVzIGNhbiBiZSBhY2Nlc3NlZCB1c2luZyAub3B0cygpLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtzdG9yZUFzUHJvcGVydGllcz10cnVlXVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG5cbiAgc3RvcmVPcHRpb25zQXNQcm9wZXJ0aWVzKHN0b3JlQXNQcm9wZXJ0aWVzID0gdHJ1ZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NhbGwgLnN0b3JlT3B0aW9uc0FzUHJvcGVydGllcygpIGJlZm9yZSBhZGRpbmcgb3B0aW9ucycpO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy5fb3B0aW9uVmFsdWVzKS5sZW5ndGgpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2NhbGwgLnN0b3JlT3B0aW9uc0FzUHJvcGVydGllcygpIGJlZm9yZSBzZXR0aW5nIG9wdGlvbiB2YWx1ZXMnLFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5fc3RvcmVPcHRpb25zQXNQcm9wZXJ0aWVzID0gISFzdG9yZUFzUHJvcGVydGllcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBvcHRpb24gdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7b2JqZWN0fSB2YWx1ZVxuICAgKi9cblxuICBnZXRPcHRpb25WYWx1ZShrZXkpIHtcbiAgICBpZiAodGhpcy5fc3RvcmVPcHRpb25zQXNQcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uVmFsdWVzW2tleV07XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgb3B0aW9uIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEBwYXJhbSB7b2JqZWN0fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtDb21tYW5kfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmdcbiAgICovXG5cbiAgc2V0T3B0aW9uVmFsdWUoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldE9wdGlvblZhbHVlV2l0aFNvdXJjZShrZXksIHZhbHVlLCB1bmRlZmluZWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIG9wdGlvbiB2YWx1ZSBhbmQgd2hlcmUgdGhlIHZhbHVlIGNhbWUgZnJvbS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIGV4cGVjdGVkIHZhbHVlcyBhcmUgZGVmYXVsdC9jb25maWcvZW52L2NsaS9pbXBsaWVkXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBzZXRPcHRpb25WYWx1ZVdpdGhTb3VyY2Uoa2V5LCB2YWx1ZSwgc291cmNlKSB7XG4gICAgaWYgKHRoaXMuX3N0b3JlT3B0aW9uc0FzUHJvcGVydGllcykge1xuICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29wdGlvblZhbHVlc1trZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHRoaXMuX29wdGlvblZhbHVlU291cmNlc1trZXldID0gc291cmNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBzb3VyY2Ugb2Ygb3B0aW9uIHZhbHVlLlxuICAgKiBFeHBlY3RlZCB2YWx1ZXMgYXJlIGRlZmF1bHQgfCBjb25maWcgfCBlbnYgfCBjbGkgfCBpbXBsaWVkXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuICBnZXRPcHRpb25WYWx1ZVNvdXJjZShrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5fb3B0aW9uVmFsdWVTb3VyY2VzW2tleV07XG4gIH1cblxuICAvKipcbiAgICogR2V0IHNvdXJjZSBvZiBvcHRpb24gdmFsdWUuIFNlZSBhbHNvIC5vcHRzV2l0aEdsb2JhbHMoKS5cbiAgICogRXhwZWN0ZWQgdmFsdWVzIGFyZSBkZWZhdWx0IHwgY29uZmlnIHwgZW52IHwgY2xpIHwgaW1wbGllZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG5cbiAgZ2V0T3B0aW9uVmFsdWVTb3VyY2VXaXRoR2xvYmFscyhrZXkpIHtcbiAgICAvLyBnbG9iYWwgb3ZlcndyaXRlcyBsb2NhbCwgbGlrZSBvcHRzV2l0aEdsb2JhbHNcbiAgICBsZXQgc291cmNlO1xuICAgIHRoaXMuX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKS5mb3JFYWNoKChjbWQpID0+IHtcbiAgICAgIGlmIChjbWQuZ2V0T3B0aW9uVmFsdWVTb3VyY2Uoa2V5KSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNvdXJjZSA9IGNtZC5nZXRPcHRpb25WYWx1ZVNvdXJjZShrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBzb3VyY2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHVzZXIgYXJndW1lbnRzIGZyb20gaW1wbGllZCBvciBleHBsaWNpdCBhcmd1bWVudHMuXG4gICAqIFNpZGUtZWZmZWN0czogc2V0IF9zY3JpcHRQYXRoIGlmIGFyZ3MgaW5jbHVkZWQgc2NyaXB0LiBVc2VkIGZvciBkZWZhdWx0IHByb2dyYW0gbmFtZSwgYW5kIHN1YmNvbW1hbmQgc2VhcmNoZXMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9wcmVwYXJlVXNlckFyZ3MoYXJndiwgcGFyc2VPcHRpb25zKSB7XG4gICAgaWYgKGFyZ3YgIT09IHVuZGVmaW5lZCAmJiAhQXJyYXkuaXNBcnJheShhcmd2KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdmaXJzdCBwYXJhbWV0ZXIgdG8gcGFyc2UgbXVzdCBiZSBhcnJheSBvciB1bmRlZmluZWQnKTtcbiAgICB9XG4gICAgcGFyc2VPcHRpb25zID0gcGFyc2VPcHRpb25zIHx8IHt9O1xuXG4gICAgLy8gYXV0by1kZXRlY3QgYXJndW1lbnQgY29udmVudGlvbnMgaWYgbm90aGluZyBzdXBwbGllZFxuICAgIGlmIChhcmd2ID09PSB1bmRlZmluZWQgJiYgcGFyc2VPcHRpb25zLmZyb20gPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudmVyc2lvbnM/LmVsZWN0cm9uKSB7XG4gICAgICAgIHBhcnNlT3B0aW9ucy5mcm9tID0gJ2VsZWN0cm9uJztcbiAgICAgIH1cbiAgICAgIC8vIGNoZWNrIG5vZGUgc3BlY2lmaWMgb3B0aW9ucyBmb3Igc2NlbmFyaW9zIHdoZXJlIHVzZXIgQ0xJIGFyZ3MgZm9sbG93IGV4ZWN1dGFibGUgd2l0aG91dCBzY3JpcHRuYW1lXG4gICAgICBjb25zdCBleGVjQXJndiA9IHByb2Nlc3MuZXhlY0FyZ3YgPz8gW107XG4gICAgICBpZiAoXG4gICAgICAgIGV4ZWNBcmd2LmluY2x1ZGVzKCctZScpIHx8XG4gICAgICAgIGV4ZWNBcmd2LmluY2x1ZGVzKCctLWV2YWwnKSB8fFxuICAgICAgICBleGVjQXJndi5pbmNsdWRlcygnLXAnKSB8fFxuICAgICAgICBleGVjQXJndi5pbmNsdWRlcygnLS1wcmludCcpXG4gICAgICApIHtcbiAgICAgICAgcGFyc2VPcHRpb25zLmZyb20gPSAnZXZhbCc7IC8vIGludGVybmFsIHVzYWdlLCBub3QgZG9jdW1lbnRlZFxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGRlZmF1bHQgdG8gdXNpbmcgcHJvY2Vzcy5hcmd2XG4gICAgaWYgKGFyZ3YgPT09IHVuZGVmaW5lZCkge1xuICAgICAgYXJndiA9IHByb2Nlc3MuYXJndjtcbiAgICB9XG4gICAgdGhpcy5yYXdBcmdzID0gYXJndi5zbGljZSgpO1xuXG4gICAgLy8gZXh0cmFjdCB0aGUgdXNlciBhcmdzIGFuZCBzY3JpcHRQYXRoXG4gICAgbGV0IHVzZXJBcmdzO1xuICAgIHN3aXRjaCAocGFyc2VPcHRpb25zLmZyb20pIHtcbiAgICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgY2FzZSAnbm9kZSc6XG4gICAgICAgIHRoaXMuX3NjcmlwdFBhdGggPSBhcmd2WzFdO1xuICAgICAgICB1c2VyQXJncyA9IGFyZ3Yuc2xpY2UoMik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZWxlY3Ryb24nOlxuICAgICAgICAvLyBAdHMtaWdub3JlOiBiZWNhdXNlIGRlZmF1bHRBcHAgaXMgYW4gdW5rbm93biBwcm9wZXJ0eVxuICAgICAgICBpZiAocHJvY2Vzcy5kZWZhdWx0QXBwKSB7XG4gICAgICAgICAgdGhpcy5fc2NyaXB0UGF0aCA9IGFyZ3ZbMV07XG4gICAgICAgICAgdXNlckFyZ3MgPSBhcmd2LnNsaWNlKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHVzZXJBcmdzID0gYXJndi5zbGljZSgxKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3VzZXInOlxuICAgICAgICB1c2VyQXJncyA9IGFyZ3Yuc2xpY2UoMCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXZhbCc6XG4gICAgICAgIHVzZXJBcmdzID0gYXJndi5zbGljZSgxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYHVuZXhwZWN0ZWQgcGFyc2Ugb3B0aW9uIHsgZnJvbTogJyR7cGFyc2VPcHRpb25zLmZyb219JyB9YCxcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIGRlZmF1bHQgbmFtZSBmb3IgcHJvZ3JhbSBmcm9tIGFyZ3VtZW50cy5cbiAgICBpZiAoIXRoaXMuX25hbWUgJiYgdGhpcy5fc2NyaXB0UGF0aClcbiAgICAgIHRoaXMubmFtZUZyb21GaWxlbmFtZSh0aGlzLl9zY3JpcHRQYXRoKTtcbiAgICB0aGlzLl9uYW1lID0gdGhpcy5fbmFtZSB8fCAncHJvZ3JhbSc7XG5cbiAgICByZXR1cm4gdXNlckFyZ3M7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYGFyZ3ZgLCBzZXR0aW5nIG9wdGlvbnMgYW5kIGludm9raW5nIGNvbW1hbmRzIHdoZW4gZGVmaW5lZC5cbiAgICpcbiAgICogVXNlIHBhcnNlQXN5bmMgaW5zdGVhZCBvZiBwYXJzZSBpZiBhbnkgb2YgeW91ciBhY3Rpb24gaGFuZGxlcnMgYXJlIGFzeW5jLlxuICAgKlxuICAgKiBDYWxsIHdpdGggbm8gcGFyYW1ldGVycyB0byBwYXJzZSBgcHJvY2Vzcy5hcmd2YC4gRGV0ZWN0cyBFbGVjdHJvbiBhbmQgc3BlY2lhbCBub2RlIG9wdGlvbnMgbGlrZSBgbm9kZSAtLWV2YWxgLiBFYXN5IG1vZGUhXG4gICAqXG4gICAqIE9yIGNhbGwgd2l0aCBhbiBhcnJheSBvZiBzdHJpbmdzIHRvIHBhcnNlLCBhbmQgb3B0aW9uYWxseSB3aGVyZSB0aGUgdXNlciBhcmd1bWVudHMgc3RhcnQgYnkgc3BlY2lmeWluZyB3aGVyZSB0aGUgYXJndW1lbnRzIGFyZSBgZnJvbWA6XG4gICAqIC0gYCdub2RlJ2A6IGRlZmF1bHQsIGBhcmd2WzBdYCBpcyB0aGUgYXBwbGljYXRpb24gYW5kIGBhcmd2WzFdYCBpcyB0aGUgc2NyaXB0IGJlaW5nIHJ1biwgd2l0aCB1c2VyIGFyZ3VtZW50cyBhZnRlciB0aGF0XG4gICAqIC0gYCdlbGVjdHJvbidgOiBgYXJndlswXWAgaXMgdGhlIGFwcGxpY2F0aW9uIGFuZCBgYXJndlsxXWAgdmFyaWVzIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBlbGVjdHJvbiBhcHBsaWNhdGlvbiBpcyBwYWNrYWdlZFxuICAgKiAtIGAndXNlcidgOiBqdXN0IHVzZXIgYXJndW1lbnRzXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW0ucGFyc2UoKTsgLy8gcGFyc2UgcHJvY2Vzcy5hcmd2IGFuZCBhdXRvLWRldGVjdCBlbGVjdHJvbiBhbmQgc3BlY2lhbCBub2RlIGZsYWdzXG4gICAqIHByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KTsgLy8gYXNzdW1lIGFyZ3ZbMF0gaXMgYXBwIGFuZCBhcmd2WzFdIGlzIHNjcmlwdFxuICAgKiBwcm9ncmFtLnBhcnNlKG15LWFyZ3MsIHsgZnJvbTogJ3VzZXInIH0pOyAvLyBqdXN0IHVzZXIgc3VwcGxpZWQgYXJndW1lbnRzLCBub3RoaW5nIHNwZWNpYWwgYWJvdXQgYXJndlswXVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBbYXJndl0gLSBvcHRpb25hbCwgZGVmYXVsdHMgdG8gcHJvY2Vzcy5hcmd2XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyc2VPcHRpb25zXSAtIG9wdGlvbmFsbHkgc3BlY2lmeSBzdHlsZSBvZiBvcHRpb25zIHdpdGggZnJvbTogbm9kZS91c2VyL2VsZWN0cm9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbcGFyc2VPcHRpb25zLmZyb21dIC0gd2hlcmUgdGhlIGFyZ3MgYXJlIGZyb206ICdub2RlJywgJ3VzZXInLCAnZWxlY3Ryb24nXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBwYXJzZShhcmd2LCBwYXJzZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9wcmVwYXJlRm9yUGFyc2UoKTtcbiAgICBjb25zdCB1c2VyQXJncyA9IHRoaXMuX3ByZXBhcmVVc2VyQXJncyhhcmd2LCBwYXJzZU9wdGlvbnMpO1xuICAgIHRoaXMuX3BhcnNlQ29tbWFuZChbXSwgdXNlckFyZ3MpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgYGFyZ3ZgLCBzZXR0aW5nIG9wdGlvbnMgYW5kIGludm9raW5nIGNvbW1hbmRzIHdoZW4gZGVmaW5lZC5cbiAgICpcbiAgICogQ2FsbCB3aXRoIG5vIHBhcmFtZXRlcnMgdG8gcGFyc2UgYHByb2Nlc3MuYXJndmAuIERldGVjdHMgRWxlY3Ryb24gYW5kIHNwZWNpYWwgbm9kZSBvcHRpb25zIGxpa2UgYG5vZGUgLS1ldmFsYC4gRWFzeSBtb2RlIVxuICAgKlxuICAgKiBPciBjYWxsIHdpdGggYW4gYXJyYXkgb2Ygc3RyaW5ncyB0byBwYXJzZSwgYW5kIG9wdGlvbmFsbHkgd2hlcmUgdGhlIHVzZXIgYXJndW1lbnRzIHN0YXJ0IGJ5IHNwZWNpZnlpbmcgd2hlcmUgdGhlIGFyZ3VtZW50cyBhcmUgYGZyb21gOlxuICAgKiAtIGAnbm9kZSdgOiBkZWZhdWx0LCBgYXJndlswXWAgaXMgdGhlIGFwcGxpY2F0aW9uIGFuZCBgYXJndlsxXWAgaXMgdGhlIHNjcmlwdCBiZWluZyBydW4sIHdpdGggdXNlciBhcmd1bWVudHMgYWZ0ZXIgdGhhdFxuICAgKiAtIGAnZWxlY3Ryb24nYDogYGFyZ3ZbMF1gIGlzIHRoZSBhcHBsaWNhdGlvbiBhbmQgYGFyZ3ZbMV1gIHZhcmllcyBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgZWxlY3Ryb24gYXBwbGljYXRpb24gaXMgcGFja2FnZWRcbiAgICogLSBgJ3VzZXInYDoganVzdCB1c2VyIGFyZ3VtZW50c1xuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBhd2FpdCBwcm9ncmFtLnBhcnNlQXN5bmMoKTsgLy8gcGFyc2UgcHJvY2Vzcy5hcmd2IGFuZCBhdXRvLWRldGVjdCBlbGVjdHJvbiBhbmQgc3BlY2lhbCBub2RlIGZsYWdzXG4gICAqIGF3YWl0IHByb2dyYW0ucGFyc2VBc3luYyhwcm9jZXNzLmFyZ3YpOyAvLyBhc3N1bWUgYXJndlswXSBpcyBhcHAgYW5kIGFyZ3ZbMV0gaXMgc2NyaXB0XG4gICAqIGF3YWl0IHByb2dyYW0ucGFyc2VBc3luYyhteS1hcmdzLCB7IGZyb206ICd1c2VyJyB9KTsgLy8ganVzdCB1c2VyIHN1cHBsaWVkIGFyZ3VtZW50cywgbm90aGluZyBzcGVjaWFsIGFib3V0IGFyZ3ZbMF1cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW2FyZ3ZdXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbcGFyc2VPcHRpb25zXVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGFyc2VPcHRpb25zLmZyb20gLSB3aGVyZSB0aGUgYXJncyBhcmUgZnJvbTogJ25vZGUnLCAndXNlcicsICdlbGVjdHJvbidcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG5cbiAgYXN5bmMgcGFyc2VBc3luYyhhcmd2LCBwYXJzZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9wcmVwYXJlRm9yUGFyc2UoKTtcbiAgICBjb25zdCB1c2VyQXJncyA9IHRoaXMuX3ByZXBhcmVVc2VyQXJncyhhcmd2LCBwYXJzZU9wdGlvbnMpO1xuICAgIGF3YWl0IHRoaXMuX3BhcnNlQ29tbWFuZChbXSwgdXNlckFyZ3MpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfcHJlcGFyZUZvclBhcnNlKCkge1xuICAgIGlmICh0aGlzLl9zYXZlZFN0YXRlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnNhdmVTdGF0ZUJlZm9yZVBhcnNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVzdG9yZVN0YXRlQmVmb3JlUGFyc2UoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHRoZSBmaXJzdCB0aW1lIHBhcnNlIGlzIGNhbGxlZCB0byBzYXZlIHN0YXRlIGFuZCBhbGxvdyBhIHJlc3RvcmUgYmVmb3JlIHN1YnNlcXVlbnQgY2FsbHMgdG8gcGFyc2UuXG4gICAqIE5vdCB1c3VhbGx5IGNhbGxlZCBkaXJlY3RseSwgYnV0IGF2YWlsYWJsZSBmb3Igc3ViY2xhc3NlcyB0byBzYXZlIHRoZWlyIGN1c3RvbSBzdGF0ZS5cbiAgICpcbiAgICogVGhpcyBpcyBjYWxsZWQgaW4gYSBsYXp5IHdheS4gT25seSBjb21tYW5kcyB1c2VkIGluIHBhcnNpbmcgY2hhaW4gd2lsbCBoYXZlIHN0YXRlIHNhdmVkLlxuICAgKi9cbiAgc2F2ZVN0YXRlQmVmb3JlUGFyc2UoKSB7XG4gICAgdGhpcy5fc2F2ZWRTdGF0ZSA9IHtcbiAgICAgIC8vIG5hbWUgaXMgc3RhYmxlIGlmIHN1cHBsaWVkIGJ5IGF1dGhvciwgYnV0IG1heSBiZSB1bnNwZWNpZmllZCBmb3Igcm9vdCBjb21tYW5kIGFuZCBkZWR1Y2VkIGR1cmluZyBwYXJzaW5nXG4gICAgICBfbmFtZTogdGhpcy5fbmFtZSxcbiAgICAgIC8vIG9wdGlvbiB2YWx1ZXMgYmVmb3JlIHBhcnNlIGhhdmUgZGVmYXVsdCB2YWx1ZXMgKGluY2x1ZGluZyBmYWxzZSBmb3IgbmVnYXRlZCBvcHRpb25zKVxuICAgICAgLy8gc2hhbGxvdyBjbG9uZXNcbiAgICAgIF9vcHRpb25WYWx1ZXM6IHsgLi4udGhpcy5fb3B0aW9uVmFsdWVzIH0sXG4gICAgICBfb3B0aW9uVmFsdWVTb3VyY2VzOiB7IC4uLnRoaXMuX29wdGlvblZhbHVlU291cmNlcyB9LFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVzdG9yZSBzdGF0ZSBiZWZvcmUgcGFyc2UgZm9yIGNhbGxzIGFmdGVyIHRoZSBmaXJzdC5cbiAgICogTm90IHVzdWFsbHkgY2FsbGVkIGRpcmVjdGx5LCBidXQgYXZhaWxhYmxlIGZvciBzdWJjbGFzc2VzIHRvIHNhdmUgdGhlaXIgY3VzdG9tIHN0YXRlLlxuICAgKlxuICAgKiBUaGlzIGlzIGNhbGxlZCBpbiBhIGxhenkgd2F5LiBPbmx5IGNvbW1hbmRzIHVzZWQgaW4gcGFyc2luZyBjaGFpbiB3aWxsIGhhdmUgc3RhdGUgcmVzdG9yZWQuXG4gICAqL1xuICByZXN0b3JlU3RhdGVCZWZvcmVQYXJzZSgpIHtcbiAgICBpZiAodGhpcy5fc3RvcmVPcHRpb25zQXNQcm9wZXJ0aWVzKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW4gbm90IGNhbGwgcGFyc2UgYWdhaW4gd2hlbiBzdG9yZU9wdGlvbnNBc1Byb3BlcnRpZXMgaXMgdHJ1ZS5cbi0gZWl0aGVyIG1ha2UgYSBuZXcgQ29tbWFuZCBmb3IgZWFjaCBjYWxsIHRvIHBhcnNlLCBvciBzdG9wIHN0b3Jpbmcgb3B0aW9ucyBhcyBwcm9wZXJ0aWVzYCk7XG5cbiAgICAvLyBjbGVhciBzdGF0ZSBmcm9tIF9wcmVwYXJlVXNlckFyZ3NcbiAgICB0aGlzLl9uYW1lID0gdGhpcy5fc2F2ZWRTdGF0ZS5fbmFtZTtcbiAgICB0aGlzLl9zY3JpcHRQYXRoID0gbnVsbDtcbiAgICB0aGlzLnJhd0FyZ3MgPSBbXTtcbiAgICAvLyBjbGVhciBzdGF0ZSBmcm9tIHNldE9wdGlvblZhbHVlV2l0aFNvdXJjZVxuICAgIHRoaXMuX29wdGlvblZhbHVlcyA9IHsgLi4udGhpcy5fc2F2ZWRTdGF0ZS5fb3B0aW9uVmFsdWVzIH07XG4gICAgdGhpcy5fb3B0aW9uVmFsdWVTb3VyY2VzID0geyAuLi50aGlzLl9zYXZlZFN0YXRlLl9vcHRpb25WYWx1ZVNvdXJjZXMgfTtcbiAgICAvLyBjbGVhciBzdGF0ZSBmcm9tIF9wYXJzZUNvbW1hbmRcbiAgICB0aGlzLmFyZ3MgPSBbXTtcbiAgICAvLyBjbGVhciBzdGF0ZSBmcm9tIF9wcm9jZXNzQXJndW1lbnRzXG4gICAgdGhpcy5wcm9jZXNzZWRBcmdzID0gW107XG4gIH1cblxuICAvKipcbiAgICogVGhyb3cgaWYgZXhwZWN0ZWQgZXhlY3V0YWJsZSBpcyBtaXNzaW5nLiBBZGQgbG90cyBvZiBoZWxwIGZvciBhdXRob3IuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleGVjdXRhYmxlRmlsZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhlY3V0YWJsZURpclxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3ViY29tbWFuZE5hbWVcbiAgICovXG4gIF9jaGVja0Zvck1pc3NpbmdFeGVjdXRhYmxlKGV4ZWN1dGFibGVGaWxlLCBleGVjdXRhYmxlRGlyLCBzdWJjb21tYW5kTmFtZSkge1xuICAgIGlmIChmcy5leGlzdHNTeW5jKGV4ZWN1dGFibGVGaWxlKSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhlY3V0YWJsZURpck1lc3NhZ2UgPSBleGVjdXRhYmxlRGlyXG4gICAgICA/IGBzZWFyY2hlZCBmb3IgbG9jYWwgc3ViY29tbWFuZCByZWxhdGl2ZSB0byBkaXJlY3RvcnkgJyR7ZXhlY3V0YWJsZURpcn0nYFxuICAgICAgOiAnbm8gZGlyZWN0b3J5IGZvciBzZWFyY2ggZm9yIGxvY2FsIHN1YmNvbW1hbmQsIHVzZSAuZXhlY3V0YWJsZURpcigpIHRvIHN1cHBseSBhIGN1c3RvbSBkaXJlY3RvcnknO1xuICAgIGNvbnN0IGV4ZWN1dGFibGVNaXNzaW5nID0gYCcke2V4ZWN1dGFibGVGaWxlfScgZG9lcyBub3QgZXhpc3RcbiAtIGlmICcke3N1YmNvbW1hbmROYW1lfScgaXMgbm90IG1lYW50IHRvIGJlIGFuIGV4ZWN1dGFibGUgY29tbWFuZCwgcmVtb3ZlIGRlc2NyaXB0aW9uIHBhcmFtZXRlciBmcm9tICcuY29tbWFuZCgpJyBhbmQgdXNlICcuZGVzY3JpcHRpb24oKScgaW5zdGVhZFxuIC0gaWYgdGhlIGRlZmF1bHQgZXhlY3V0YWJsZSBuYW1lIGlzIG5vdCBzdWl0YWJsZSwgdXNlIHRoZSBleGVjdXRhYmxlRmlsZSBvcHRpb24gdG8gc3VwcGx5IGEgY3VzdG9tIG5hbWUgb3IgcGF0aFxuIC0gJHtleGVjdXRhYmxlRGlyTWVzc2FnZX1gO1xuICAgIHRocm93IG5ldyBFcnJvcihleGVjdXRhYmxlTWlzc2luZyk7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIHN1Yi1jb21tYW5kIGV4ZWN1dGFibGUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9leGVjdXRlU3ViQ29tbWFuZChzdWJjb21tYW5kLCBhcmdzKSB7XG4gICAgYXJncyA9IGFyZ3Muc2xpY2UoKTtcbiAgICBsZXQgbGF1bmNoV2l0aE5vZGUgPSBmYWxzZTsgLy8gVXNlIG5vZGUgZm9yIHNvdXJjZSB0YXJnZXRzIHNvIGRvIG5vdCBuZWVkIHRvIGdldCBwZXJtaXNzaW9ucyBjb3JyZWN0LCBhbmQgb24gV2luZG93cy5cbiAgICBjb25zdCBzb3VyY2VFeHQgPSBbJy5qcycsICcudHMnLCAnLnRzeCcsICcubWpzJywgJy5janMnXTtcblxuICAgIGZ1bmN0aW9uIGZpbmRGaWxlKGJhc2VEaXIsIGJhc2VOYW1lKSB7XG4gICAgICAvLyBMb29rIGZvciBzcGVjaWZpZWQgZmlsZVxuICAgICAgY29uc3QgbG9jYWxCaW4gPSBwYXRoLnJlc29sdmUoYmFzZURpciwgYmFzZU5hbWUpO1xuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMobG9jYWxCaW4pKSByZXR1cm4gbG9jYWxCaW47XG5cbiAgICAgIC8vIFN0b3AgbG9va2luZyBpZiBjYW5kaWRhdGUgYWxyZWFkeSBoYXMgYW4gZXhwZWN0ZWQgZXh0ZW5zaW9uLlxuICAgICAgaWYgKHNvdXJjZUV4dC5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoYmFzZU5hbWUpKSkgcmV0dXJuIHVuZGVmaW5lZDtcblxuICAgICAgLy8gVHJ5IGFsbCB0aGUgZXh0ZW5zaW9ucy5cbiAgICAgIGNvbnN0IGZvdW5kRXh0ID0gc291cmNlRXh0LmZpbmQoKGV4dCkgPT5cbiAgICAgICAgZnMuZXhpc3RzU3luYyhgJHtsb2NhbEJpbn0ke2V4dH1gKSxcbiAgICAgICk7XG4gICAgICBpZiAoZm91bmRFeHQpIHJldHVybiBgJHtsb2NhbEJpbn0ke2ZvdW5kRXh0fWA7XG5cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLy8gTm90IGNoZWNraW5nIGZvciBoZWxwIGZpcnN0LiBVbmxpa2VseSB0byBoYXZlIG1hbmRhdG9yeSBhbmQgZXhlY3V0YWJsZSwgYW5kIGNhbid0IHJvYnVzdGx5IHRlc3QgZm9yIGhlbHAgZmxhZ3MgaW4gZXh0ZXJuYWwgY29tbWFuZC5cbiAgICB0aGlzLl9jaGVja0Zvck1pc3NpbmdNYW5kYXRvcnlPcHRpb25zKCk7XG4gICAgdGhpcy5fY2hlY2tGb3JDb25mbGljdGluZ09wdGlvbnMoKTtcblxuICAgIC8vIGV4ZWN1dGFibGVGaWxlIGFuZCBleGVjdXRhYmxlRGlyIG1pZ2h0IGJlIGZ1bGwgcGF0aCwgb3IganVzdCBhIG5hbWVcbiAgICBsZXQgZXhlY3V0YWJsZUZpbGUgPVxuICAgICAgc3ViY29tbWFuZC5fZXhlY3V0YWJsZUZpbGUgfHwgYCR7dGhpcy5fbmFtZX0tJHtzdWJjb21tYW5kLl9uYW1lfWA7XG4gICAgbGV0IGV4ZWN1dGFibGVEaXIgPSB0aGlzLl9leGVjdXRhYmxlRGlyIHx8ICcnO1xuICAgIGlmICh0aGlzLl9zY3JpcHRQYXRoKSB7XG4gICAgICBsZXQgcmVzb2x2ZWRTY3JpcHRQYXRoOyAvLyByZXNvbHZlIHBvc3NpYmxlIHN5bWxpbmsgZm9yIGluc3RhbGxlZCBucG0gYmluYXJ5XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlZFNjcmlwdFBhdGggPSBmcy5yZWFscGF0aFN5bmModGhpcy5fc2NyaXB0UGF0aCk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgcmVzb2x2ZWRTY3JpcHRQYXRoID0gdGhpcy5fc2NyaXB0UGF0aDtcbiAgICAgIH1cbiAgICAgIGV4ZWN1dGFibGVEaXIgPSBwYXRoLnJlc29sdmUoXG4gICAgICAgIHBhdGguZGlybmFtZShyZXNvbHZlZFNjcmlwdFBhdGgpLFxuICAgICAgICBleGVjdXRhYmxlRGlyLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBMb29rIGZvciBhIGxvY2FsIGZpbGUgaW4gcHJlZmVyZW5jZSB0byBhIGNvbW1hbmQgaW4gUEFUSC5cbiAgICBpZiAoZXhlY3V0YWJsZURpcikge1xuICAgICAgbGV0IGxvY2FsRmlsZSA9IGZpbmRGaWxlKGV4ZWN1dGFibGVEaXIsIGV4ZWN1dGFibGVGaWxlKTtcblxuICAgICAgLy8gTGVnYWN5IHNlYXJjaCB1c2luZyBwcmVmaXggb2Ygc2NyaXB0IG5hbWUgaW5zdGVhZCBvZiBjb21tYW5kIG5hbWVcbiAgICAgIGlmICghbG9jYWxGaWxlICYmICFzdWJjb21tYW5kLl9leGVjdXRhYmxlRmlsZSAmJiB0aGlzLl9zY3JpcHRQYXRoKSB7XG4gICAgICAgIGNvbnN0IGxlZ2FjeU5hbWUgPSBwYXRoLmJhc2VuYW1lKFxuICAgICAgICAgIHRoaXMuX3NjcmlwdFBhdGgsXG4gICAgICAgICAgcGF0aC5leHRuYW1lKHRoaXMuX3NjcmlwdFBhdGgpLFxuICAgICAgICApO1xuICAgICAgICBpZiAobGVnYWN5TmFtZSAhPT0gdGhpcy5fbmFtZSkge1xuICAgICAgICAgIGxvY2FsRmlsZSA9IGZpbmRGaWxlKFxuICAgICAgICAgICAgZXhlY3V0YWJsZURpcixcbiAgICAgICAgICAgIGAke2xlZ2FjeU5hbWV9LSR7c3ViY29tbWFuZC5fbmFtZX1gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGV4ZWN1dGFibGVGaWxlID0gbG9jYWxGaWxlIHx8IGV4ZWN1dGFibGVGaWxlO1xuICAgIH1cblxuICAgIGxhdW5jaFdpdGhOb2RlID0gc291cmNlRXh0LmluY2x1ZGVzKHBhdGguZXh0bmFtZShleGVjdXRhYmxlRmlsZSkpO1xuXG4gICAgbGV0IHByb2M7XG4gICAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICAgIGlmIChsYXVuY2hXaXRoTm9kZSkge1xuICAgICAgICBhcmdzLnVuc2hpZnQoZXhlY3V0YWJsZUZpbGUpO1xuICAgICAgICAvLyBhZGQgZXhlY3V0YWJsZSBhcmd1bWVudHMgdG8gc3Bhd25cbiAgICAgICAgYXJncyA9IGluY3JlbWVudE5vZGVJbnNwZWN0b3JQb3J0KHByb2Nlc3MuZXhlY0FyZ3YpLmNvbmNhdChhcmdzKTtcblxuICAgICAgICBwcm9jID0gY2hpbGRQcm9jZXNzLnNwYXduKHByb2Nlc3MuYXJndlswXSwgYXJncywgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJvYyA9IGNoaWxkUHJvY2Vzcy5zcGF3bihleGVjdXRhYmxlRmlsZSwgYXJncywgeyBzdGRpbzogJ2luaGVyaXQnIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jaGVja0Zvck1pc3NpbmdFeGVjdXRhYmxlKFxuICAgICAgICBleGVjdXRhYmxlRmlsZSxcbiAgICAgICAgZXhlY3V0YWJsZURpcixcbiAgICAgICAgc3ViY29tbWFuZC5fbmFtZSxcbiAgICAgICk7XG4gICAgICBhcmdzLnVuc2hpZnQoZXhlY3V0YWJsZUZpbGUpO1xuICAgICAgLy8gYWRkIGV4ZWN1dGFibGUgYXJndW1lbnRzIHRvIHNwYXduXG4gICAgICBhcmdzID0gaW5jcmVtZW50Tm9kZUluc3BlY3RvclBvcnQocHJvY2Vzcy5leGVjQXJndikuY29uY2F0KGFyZ3MpO1xuICAgICAgcHJvYyA9IGNoaWxkUHJvY2Vzcy5zcGF3bihwcm9jZXNzLmV4ZWNQYXRoLCBhcmdzLCB7IHN0ZGlvOiAnaW5oZXJpdCcgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFwcm9jLmtpbGxlZCkge1xuICAgICAgLy8gdGVzdGluZyBtYWlubHkgdG8gYXZvaWQgbGVhayB3YXJuaW5ncyBkdXJpbmcgdW5pdCB0ZXN0cyB3aXRoIG1vY2tlZCBzcGF3blxuICAgICAgY29uc3Qgc2lnbmFscyA9IFsnU0lHVVNSMScsICdTSUdVU1IyJywgJ1NJR1RFUk0nLCAnU0lHSU5UJywgJ1NJR0hVUCddO1xuICAgICAgc2lnbmFscy5mb3JFYWNoKChzaWduYWwpID0+IHtcbiAgICAgICAgcHJvY2Vzcy5vbihzaWduYWwsICgpID0+IHtcbiAgICAgICAgICBpZiAocHJvYy5raWxsZWQgPT09IGZhbHNlICYmIHByb2MuZXhpdENvZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgYmVjYXVzZSBzaWduYWxzIG5vdCB0eXBlZCB0byBrbm93biBzdHJpbmdzXG4gICAgICAgICAgICBwcm9jLmtpbGwoc2lnbmFsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCB0ZXJtaW5hdGUgcHJvY2VzcyB3aGVuIHNwYXduZWQgcHJvY2VzcyB0ZXJtaW5hdGVzLlxuICAgIGNvbnN0IGV4aXRDYWxsYmFjayA9IHRoaXMuX2V4aXRDYWxsYmFjaztcbiAgICBwcm9jLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICBjb2RlID0gY29kZSA/PyAxOyAvLyBjb2RlIGlzIG51bGwgaWYgc3Bhd25lZCBwcm9jZXNzIHRlcm1pbmF0ZWQgZHVlIHRvIGEgc2lnbmFsXG4gICAgICBpZiAoIWV4aXRDYWxsYmFjaykge1xuICAgICAgICBwcm9jZXNzLmV4aXQoY29kZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleGl0Q2FsbGJhY2soXG4gICAgICAgICAgbmV3IENvbW1hbmRlckVycm9yKFxuICAgICAgICAgICAgY29kZSxcbiAgICAgICAgICAgICdjb21tYW5kZXIuZXhlY3V0ZVN1YkNvbW1hbmRBc3luYycsXG4gICAgICAgICAgICAnKGNsb3NlKScsXG4gICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBwcm9jLm9uKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgIC8vIEB0cy1pZ25vcmU6IGJlY2F1c2UgZXJyLmNvZGUgaXMgYW4gdW5rbm93biBwcm9wZXJ0eVxuICAgICAgaWYgKGVyci5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgICB0aGlzLl9jaGVja0Zvck1pc3NpbmdFeGVjdXRhYmxlKFxuICAgICAgICAgIGV4ZWN1dGFibGVGaWxlLFxuICAgICAgICAgIGV4ZWN1dGFibGVEaXIsXG4gICAgICAgICAgc3ViY29tbWFuZC5fbmFtZSxcbiAgICAgICAgKTtcbiAgICAgICAgLy8gQHRzLWlnbm9yZTogYmVjYXVzZSBlcnIuY29kZSBpcyBhbiB1bmtub3duIHByb3BlcnR5XG4gICAgICB9IGVsc2UgaWYgKGVyci5jb2RlID09PSAnRUFDQ0VTJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCcke2V4ZWN1dGFibGVGaWxlfScgbm90IGV4ZWN1dGFibGVgKTtcbiAgICAgIH1cbiAgICAgIGlmICghZXhpdENhbGxiYWNrKSB7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZWRFcnJvciA9IG5ldyBDb21tYW5kZXJFcnJvcihcbiAgICAgICAgICAxLFxuICAgICAgICAgICdjb21tYW5kZXIuZXhlY3V0ZVN1YkNvbW1hbmRBc3luYycsXG4gICAgICAgICAgJyhlcnJvciknLFxuICAgICAgICApO1xuICAgICAgICB3cmFwcGVkRXJyb3IubmVzdGVkRXJyb3IgPSBlcnI7XG4gICAgICAgIGV4aXRDYWxsYmFjayh3cmFwcGVkRXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gU3RvcmUgdGhlIHJlZmVyZW5jZSB0byB0aGUgY2hpbGQgcHJvY2Vzc1xuICAgIHRoaXMucnVubmluZ0NvbW1hbmQgPSBwcm9jO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9kaXNwYXRjaFN1YmNvbW1hbmQoY29tbWFuZE5hbWUsIG9wZXJhbmRzLCB1bmtub3duKSB7XG4gICAgY29uc3Qgc3ViQ29tbWFuZCA9IHRoaXMuX2ZpbmRDb21tYW5kKGNvbW1hbmROYW1lKTtcbiAgICBpZiAoIXN1YkNvbW1hbmQpIHRoaXMuaGVscCh7IGVycm9yOiB0cnVlIH0pO1xuXG4gICAgc3ViQ29tbWFuZC5fcHJlcGFyZUZvclBhcnNlKCk7XG4gICAgbGV0IHByb21pc2VDaGFpbjtcbiAgICBwcm9taXNlQ2hhaW4gPSB0aGlzLl9jaGFpbk9yQ2FsbFN1YkNvbW1hbmRIb29rKFxuICAgICAgcHJvbWlzZUNoYWluLFxuICAgICAgc3ViQ29tbWFuZCxcbiAgICAgICdwcmVTdWJjb21tYW5kJyxcbiAgICApO1xuICAgIHByb21pc2VDaGFpbiA9IHRoaXMuX2NoYWluT3JDYWxsKHByb21pc2VDaGFpbiwgKCkgPT4ge1xuICAgICAgaWYgKHN1YkNvbW1hbmQuX2V4ZWN1dGFibGVIYW5kbGVyKSB7XG4gICAgICAgIHRoaXMuX2V4ZWN1dGVTdWJDb21tYW5kKHN1YkNvbW1hbmQsIG9wZXJhbmRzLmNvbmNhdCh1bmtub3duKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc3ViQ29tbWFuZC5fcGFyc2VDb21tYW5kKG9wZXJhbmRzLCB1bmtub3duKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZUNoYWluO1xuICB9XG5cbiAgLyoqXG4gICAqIEludm9rZSBoZWxwIGRpcmVjdGx5IGlmIHBvc3NpYmxlLCBvciBkaXNwYXRjaCBpZiBuZWNlc3NhcnkuXG4gICAqIGUuZy4gaGVscCBmb29cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2Rpc3BhdGNoSGVscENvbW1hbmQoc3ViY29tbWFuZE5hbWUpIHtcbiAgICBpZiAoIXN1YmNvbW1hbmROYW1lKSB7XG4gICAgICB0aGlzLmhlbHAoKTtcbiAgICB9XG4gICAgY29uc3Qgc3ViQ29tbWFuZCA9IHRoaXMuX2ZpbmRDb21tYW5kKHN1YmNvbW1hbmROYW1lKTtcbiAgICBpZiAoc3ViQ29tbWFuZCAmJiAhc3ViQ29tbWFuZC5fZXhlY3V0YWJsZUhhbmRsZXIpIHtcbiAgICAgIHN1YkNvbW1hbmQuaGVscCgpO1xuICAgIH1cblxuICAgIC8vIEZhbGxiYWNrIHRvIHBhcnNpbmcgdGhlIGhlbHAgZmxhZyB0byBpbnZva2UgdGhlIGhlbHAuXG4gICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoU3ViY29tbWFuZChcbiAgICAgIHN1YmNvbW1hbmROYW1lLFxuICAgICAgW10sXG4gICAgICBbdGhpcy5fZ2V0SGVscE9wdGlvbigpPy5sb25nID8/IHRoaXMuX2dldEhlbHBPcHRpb24oKT8uc2hvcnQgPz8gJy0taGVscCddLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdGhpcy5hcmdzIGFnYWluc3QgZXhwZWN0ZWQgdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBfY2hlY2tOdW1iZXJPZkFyZ3VtZW50cygpIHtcbiAgICAvLyB0b28gZmV3XG4gICAgdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLmZvckVhY2goKGFyZywgaSkgPT4ge1xuICAgICAgaWYgKGFyZy5yZXF1aXJlZCAmJiB0aGlzLmFyZ3NbaV0gPT0gbnVsbCkge1xuICAgICAgICB0aGlzLm1pc3NpbmdBcmd1bWVudChhcmcubmFtZSgpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvLyB0b28gbWFueVxuICAgIGlmIChcbiAgICAgIHRoaXMucmVnaXN0ZXJlZEFyZ3VtZW50cy5sZW5ndGggPiAwICYmXG4gICAgICB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHNbdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLmxlbmd0aCAtIDFdLnZhcmlhZGljXG4gICAgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmFyZ3MubGVuZ3RoID4gdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fZXhjZXNzQXJndW1lbnRzKHRoaXMuYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3MgdGhpcy5hcmdzIHVzaW5nIHRoaXMucmVnaXN0ZXJlZEFyZ3VtZW50cyBhbmQgc2F2ZSBhcyB0aGlzLnByb2Nlc3NlZEFyZ3MhXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9wcm9jZXNzQXJndW1lbnRzKCkge1xuICAgIGNvbnN0IG15UGFyc2VBcmcgPSAoYXJndW1lbnQsIHZhbHVlLCBwcmV2aW91cykgPT4ge1xuICAgICAgLy8gRXh0cmEgcHJvY2Vzc2luZyBmb3IgbmljZSBlcnJvciBtZXNzYWdlIG9uIHBhcnNpbmcgZmFpbHVyZS5cbiAgICAgIGxldCBwYXJzZWRWYWx1ZSA9IHZhbHVlO1xuICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIGFyZ3VtZW50LnBhcnNlQXJnKSB7XG4gICAgICAgIGNvbnN0IGludmFsaWRWYWx1ZU1lc3NhZ2UgPSBgZXJyb3I6IGNvbW1hbmQtYXJndW1lbnQgdmFsdWUgJyR7dmFsdWV9JyBpcyBpbnZhbGlkIGZvciBhcmd1bWVudCAnJHthcmd1bWVudC5uYW1lKCl9Jy5gO1xuICAgICAgICBwYXJzZWRWYWx1ZSA9IHRoaXMuX2NhbGxQYXJzZUFyZyhcbiAgICAgICAgICBhcmd1bWVudCxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICBwcmV2aW91cyxcbiAgICAgICAgICBpbnZhbGlkVmFsdWVNZXNzYWdlLFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcnNlZFZhbHVlO1xuICAgIH07XG5cbiAgICB0aGlzLl9jaGVja051bWJlck9mQXJndW1lbnRzKCk7XG5cbiAgICBjb25zdCBwcm9jZXNzZWRBcmdzID0gW107XG4gICAgdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLmZvckVhY2goKGRlY2xhcmVkQXJnLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHZhbHVlID0gZGVjbGFyZWRBcmcuZGVmYXVsdFZhbHVlO1xuICAgICAgaWYgKGRlY2xhcmVkQXJnLnZhcmlhZGljKSB7XG4gICAgICAgIC8vIENvbGxlY3QgdG9nZXRoZXIgcmVtYWluaW5nIGFyZ3VtZW50cyBmb3IgcGFzc2luZyB0b2dldGhlciBhcyBhbiBhcnJheS5cbiAgICAgICAgaWYgKGluZGV4IDwgdGhpcy5hcmdzLmxlbmd0aCkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5hcmdzLnNsaWNlKGluZGV4KTtcbiAgICAgICAgICBpZiAoZGVjbGFyZWRBcmcucGFyc2VBcmcpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUucmVkdWNlKChwcm9jZXNzZWQsIHYpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIG15UGFyc2VBcmcoZGVjbGFyZWRBcmcsIHYsIHByb2Nlc3NlZCk7XG4gICAgICAgICAgICB9LCBkZWNsYXJlZEFyZy5kZWZhdWx0VmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdmFsdWUgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpbmRleCA8IHRoaXMuYXJncy5sZW5ndGgpIHtcbiAgICAgICAgdmFsdWUgPSB0aGlzLmFyZ3NbaW5kZXhdO1xuICAgICAgICBpZiAoZGVjbGFyZWRBcmcucGFyc2VBcmcpIHtcbiAgICAgICAgICB2YWx1ZSA9IG15UGFyc2VBcmcoZGVjbGFyZWRBcmcsIHZhbHVlLCBkZWNsYXJlZEFyZy5kZWZhdWx0VmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwcm9jZXNzZWRBcmdzW2luZGV4XSA9IHZhbHVlO1xuICAgIH0pO1xuICAgIHRoaXMucHJvY2Vzc2VkQXJncyA9IHByb2Nlc3NlZEFyZ3M7XG4gIH1cblxuICAvKipcbiAgICogT25jZSB3ZSBoYXZlIGEgcHJvbWlzZSB3ZSBjaGFpbiwgYnV0IGNhbGwgc3luY2hyb25vdXNseSB1bnRpbCB0aGVuLlxuICAgKlxuICAgKiBAcGFyYW0geyhQcm9taXNlfHVuZGVmaW5lZCl9IHByb21pc2VcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAgICogQHJldHVybiB7KFByb21pc2V8dW5kZWZpbmVkKX1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2NoYWluT3JDYWxsKHByb21pc2UsIGZuKSB7XG4gICAgLy8gdGhlbmFibGVcbiAgICBpZiAocHJvbWlzZT8udGhlbiAmJiB0eXBlb2YgcHJvbWlzZS50aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBhbHJlYWR5IGhhdmUgYSBwcm9taXNlLCBjaGFpbiBjYWxsYmFja1xuICAgICAgcmV0dXJuIHByb21pc2UudGhlbigoKSA9PiBmbigpKTtcbiAgICB9XG4gICAgLy8gY2FsbGJhY2sgbWlnaHQgcmV0dXJuIGEgcHJvbWlzZVxuICAgIHJldHVybiBmbigpO1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7KFByb21pc2V8dW5kZWZpbmVkKX0gcHJvbWlzZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICogQHJldHVybiB7KFByb21pc2V8dW5kZWZpbmVkKX1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2NoYWluT3JDYWxsSG9va3MocHJvbWlzZSwgZXZlbnQpIHtcbiAgICBsZXQgcmVzdWx0ID0gcHJvbWlzZTtcbiAgICBjb25zdCBob29rcyA9IFtdO1xuICAgIHRoaXMuX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLmZpbHRlcigoY21kKSA9PiBjbWQuX2xpZmVDeWNsZUhvb2tzW2V2ZW50XSAhPT0gdW5kZWZpbmVkKVxuICAgICAgLmZvckVhY2goKGhvb2tlZENvbW1hbmQpID0+IHtcbiAgICAgICAgaG9va2VkQ29tbWFuZC5fbGlmZUN5Y2xlSG9va3NbZXZlbnRdLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgICAgaG9va3MucHVzaCh7IGhvb2tlZENvbW1hbmQsIGNhbGxiYWNrIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIGlmIChldmVudCA9PT0gJ3Bvc3RBY3Rpb24nKSB7XG4gICAgICBob29rcy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgaG9va3MuZm9yRWFjaCgoaG9va0RldGFpbCkgPT4ge1xuICAgICAgcmVzdWx0ID0gdGhpcy5fY2hhaW5PckNhbGwocmVzdWx0LCAoKSA9PiB7XG4gICAgICAgIHJldHVybiBob29rRGV0YWlsLmNhbGxiYWNrKGhvb2tEZXRhaWwuaG9va2VkQ29tbWFuZCwgdGhpcyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7KFByb21pc2V8dW5kZWZpbmVkKX0gcHJvbWlzZVxuICAgKiBAcGFyYW0ge0NvbW1hbmR9IHN1YkNvbW1hbmRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEByZXR1cm4geyhQcm9taXNlfHVuZGVmaW5lZCl9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIF9jaGFpbk9yQ2FsbFN1YkNvbW1hbmRIb29rKHByb21pc2UsIHN1YkNvbW1hbmQsIGV2ZW50KSB7XG4gICAgbGV0IHJlc3VsdCA9IHByb21pc2U7XG4gICAgaWYgKHRoaXMuX2xpZmVDeWNsZUhvb2tzW2V2ZW50XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9saWZlQ3ljbGVIb29rc1tldmVudF0uZm9yRWFjaCgoaG9vaykgPT4ge1xuICAgICAgICByZXN1bHQgPSB0aGlzLl9jaGFpbk9yQ2FsbChyZXN1bHQsICgpID0+IHtcbiAgICAgICAgICByZXR1cm4gaG9vayh0aGlzLCBzdWJDb21tYW5kKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzIGFyZ3VtZW50cyBpbiBjb250ZXh0IG9mIHRoaXMgY29tbWFuZC5cbiAgICogUmV0dXJucyBhY3Rpb24gcmVzdWx0LCBpbiBjYXNlIGl0IGlzIGEgcHJvbWlzZS5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX3BhcnNlQ29tbWFuZChvcGVyYW5kcywgdW5rbm93bikge1xuICAgIGNvbnN0IHBhcnNlZCA9IHRoaXMucGFyc2VPcHRpb25zKHVua25vd24pO1xuICAgIHRoaXMuX3BhcnNlT3B0aW9uc0VudigpOyAvLyBhZnRlciBjbGksIHNvIHBhcnNlQXJnIG5vdCBjYWxsZWQgb24gYm90aCBjbGkgYW5kIGVudlxuICAgIHRoaXMuX3BhcnNlT3B0aW9uc0ltcGxpZWQoKTtcbiAgICBvcGVyYW5kcyA9IG9wZXJhbmRzLmNvbmNhdChwYXJzZWQub3BlcmFuZHMpO1xuICAgIHVua25vd24gPSBwYXJzZWQudW5rbm93bjtcbiAgICB0aGlzLmFyZ3MgPSBvcGVyYW5kcy5jb25jYXQodW5rbm93bik7XG5cbiAgICBpZiAob3BlcmFuZHMgJiYgdGhpcy5fZmluZENvbW1hbmQob3BlcmFuZHNbMF0pKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hTdWJjb21tYW5kKG9wZXJhbmRzWzBdLCBvcGVyYW5kcy5zbGljZSgxKSwgdW5rbm93bik7XG4gICAgfVxuICAgIGlmIChcbiAgICAgIHRoaXMuX2dldEhlbHBDb21tYW5kKCkgJiZcbiAgICAgIG9wZXJhbmRzWzBdID09PSB0aGlzLl9nZXRIZWxwQ29tbWFuZCgpLm5hbWUoKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoSGVscENvbW1hbmQob3BlcmFuZHNbMV0pO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGVmYXVsdENvbW1hbmROYW1lKSB7XG4gICAgICB0aGlzLl9vdXRwdXRIZWxwSWZSZXF1ZXN0ZWQodW5rbm93bik7IC8vIFJ1biB0aGUgaGVscCBmb3IgZGVmYXVsdCBjb21tYW5kIGZyb20gcGFyZW50IHJhdGhlciB0aGFuIHBhc3NpbmcgdG8gZGVmYXVsdCBjb21tYW5kXG4gICAgICByZXR1cm4gdGhpcy5fZGlzcGF0Y2hTdWJjb21tYW5kKFxuICAgICAgICB0aGlzLl9kZWZhdWx0Q29tbWFuZE5hbWUsXG4gICAgICAgIG9wZXJhbmRzLFxuICAgICAgICB1bmtub3duLFxuICAgICAgKTtcbiAgICB9XG4gICAgaWYgKFxuICAgICAgdGhpcy5jb21tYW5kcy5sZW5ndGggJiZcbiAgICAgIHRoaXMuYXJncy5sZW5ndGggPT09IDAgJiZcbiAgICAgICF0aGlzLl9hY3Rpb25IYW5kbGVyICYmXG4gICAgICAhdGhpcy5fZGVmYXVsdENvbW1hbmROYW1lXG4gICAgKSB7XG4gICAgICAvLyBwcm9iYWJseSBtaXNzaW5nIHN1YmNvbW1hbmQgYW5kIG5vIGhhbmRsZXIsIHVzZXIgbmVlZHMgaGVscCAoYW5kIGV4aXQpXG4gICAgICB0aGlzLmhlbHAoeyBlcnJvcjogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICB0aGlzLl9vdXRwdXRIZWxwSWZSZXF1ZXN0ZWQocGFyc2VkLnVua25vd24pO1xuICAgIHRoaXMuX2NoZWNrRm9yTWlzc2luZ01hbmRhdG9yeU9wdGlvbnMoKTtcbiAgICB0aGlzLl9jaGVja0ZvckNvbmZsaWN0aW5nT3B0aW9ucygpO1xuXG4gICAgLy8gV2UgZG8gbm90IGFsd2F5cyBjYWxsIHRoaXMgY2hlY2sgdG8gYXZvaWQgbWFza2luZyBhIFwiYmV0dGVyXCIgZXJyb3IsIGxpa2UgdW5rbm93biBjb21tYW5kLlxuICAgIGNvbnN0IGNoZWNrRm9yVW5rbm93bk9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICBpZiAocGFyc2VkLnVua25vd24ubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnVua25vd25PcHRpb24ocGFyc2VkLnVua25vd25bMF0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBjb21tYW5kRXZlbnQgPSBgY29tbWFuZDoke3RoaXMubmFtZSgpfWA7XG4gICAgaWYgKHRoaXMuX2FjdGlvbkhhbmRsZXIpIHtcbiAgICAgIGNoZWNrRm9yVW5rbm93bk9wdGlvbnMoKTtcbiAgICAgIHRoaXMuX3Byb2Nlc3NBcmd1bWVudHMoKTtcblxuICAgICAgbGV0IHByb21pc2VDaGFpbjtcbiAgICAgIHByb21pc2VDaGFpbiA9IHRoaXMuX2NoYWluT3JDYWxsSG9va3MocHJvbWlzZUNoYWluLCAncHJlQWN0aW9uJyk7XG4gICAgICBwcm9taXNlQ2hhaW4gPSB0aGlzLl9jaGFpbk9yQ2FsbChwcm9taXNlQ2hhaW4sICgpID0+XG4gICAgICAgIHRoaXMuX2FjdGlvbkhhbmRsZXIodGhpcy5wcm9jZXNzZWRBcmdzKSxcbiAgICAgICk7XG4gICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgcHJvbWlzZUNoYWluID0gdGhpcy5fY2hhaW5PckNhbGwocHJvbWlzZUNoYWluLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5wYXJlbnQuZW1pdChjb21tYW5kRXZlbnQsIG9wZXJhbmRzLCB1bmtub3duKTsgLy8gbGVnYWN5XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcHJvbWlzZUNoYWluID0gdGhpcy5fY2hhaW5PckNhbGxIb29rcyhwcm9taXNlQ2hhaW4sICdwb3N0QWN0aW9uJyk7XG4gICAgICByZXR1cm4gcHJvbWlzZUNoYWluO1xuICAgIH1cbiAgICBpZiAodGhpcy5wYXJlbnQ/Lmxpc3RlbmVyQ291bnQoY29tbWFuZEV2ZW50KSkge1xuICAgICAgY2hlY2tGb3JVbmtub3duT3B0aW9ucygpO1xuICAgICAgdGhpcy5fcHJvY2Vzc0FyZ3VtZW50cygpO1xuICAgICAgdGhpcy5wYXJlbnQuZW1pdChjb21tYW5kRXZlbnQsIG9wZXJhbmRzLCB1bmtub3duKTsgLy8gbGVnYWN5XG4gICAgfSBlbHNlIGlmIChvcGVyYW5kcy5sZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLl9maW5kQ29tbWFuZCgnKicpKSB7XG4gICAgICAgIC8vIGxlZ2FjeSBkZWZhdWx0IGNvbW1hbmRcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoU3ViY29tbWFuZCgnKicsIG9wZXJhbmRzLCB1bmtub3duKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxpc3RlbmVyQ291bnQoJ2NvbW1hbmQ6KicpKSB7XG4gICAgICAgIC8vIHNraXAgb3B0aW9uIGNoZWNrLCBlbWl0IGV2ZW50IGZvciBwb3NzaWJsZSBtaXNzcGVsbGluZyBzdWdnZXN0aW9uXG4gICAgICAgIHRoaXMuZW1pdCgnY29tbWFuZDoqJywgb3BlcmFuZHMsIHVua25vd24pO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbW1hbmRzLmxlbmd0aCkge1xuICAgICAgICB0aGlzLnVua25vd25Db21tYW5kKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjaGVja0ZvclVua25vd25PcHRpb25zKCk7XG4gICAgICAgIHRoaXMuX3Byb2Nlc3NBcmd1bWVudHMoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuY29tbWFuZHMubGVuZ3RoKSB7XG4gICAgICBjaGVja0ZvclVua25vd25PcHRpb25zKCk7XG4gICAgICAvLyBUaGlzIGNvbW1hbmQgaGFzIHN1YmNvbW1hbmRzIGFuZCBub3RoaW5nIGhvb2tlZCB1cCBhdCB0aGlzIGxldmVsLCBzbyBkaXNwbGF5IGhlbHAgKGFuZCBleGl0KS5cbiAgICAgIHRoaXMuaGVscCh7IGVycm9yOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaGVja0ZvclVua25vd25PcHRpb25zKCk7XG4gICAgICB0aGlzLl9wcm9jZXNzQXJndW1lbnRzKCk7XG4gICAgICAvLyBmYWxsIHRocm91Z2ggZm9yIGNhbGxlciB0byBoYW5kbGUgYWZ0ZXIgY2FsbGluZyAucGFyc2UoKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIG1hdGNoaW5nIGNvbW1hbmQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqIEByZXR1cm4ge0NvbW1hbmQgfCB1bmRlZmluZWR9XG4gICAqL1xuICBfZmluZENvbW1hbmQobmFtZSkge1xuICAgIGlmICghbmFtZSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcy5jb21tYW5kcy5maW5kKFxuICAgICAgKGNtZCkgPT4gY21kLl9uYW1lID09PSBuYW1lIHx8IGNtZC5fYWxpYXNlcy5pbmNsdWRlcyhuYW1lKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhbiBvcHRpb24gbWF0Y2hpbmcgYGFyZ2AgaWYgYW55LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXJnXG4gICAqIEByZXR1cm4ge09wdGlvbn1cbiAgICogQHBhY2thZ2VcbiAgICovXG5cbiAgX2ZpbmRPcHRpb24oYXJnKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5maW5kKChvcHRpb24pID0+IG9wdGlvbi5pcyhhcmcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgaWYgYSBtYW5kYXRvcnkgb3B0aW9uIGRvZXMgbm90IGhhdmUgYSB2YWx1ZS5cbiAgICogQ2FsbGVkIGFmdGVyIGNoZWNraW5nIGZvciBoZWxwIGZsYWdzIGluIGxlYWYgc3ViY29tbWFuZC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2NoZWNrRm9yTWlzc2luZ01hbmRhdG9yeU9wdGlvbnMoKSB7XG4gICAgLy8gV2FsayB1cCBoaWVyYXJjaHkgc28gY2FuIGNhbGwgaW4gc3ViY29tbWFuZCBhZnRlciBjaGVja2luZyBmb3IgZGlzcGxheWluZyBoZWxwLlxuICAgIHRoaXMuX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKS5mb3JFYWNoKChjbWQpID0+IHtcbiAgICAgIGNtZC5vcHRpb25zLmZvckVhY2goKGFuT3B0aW9uKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICBhbk9wdGlvbi5tYW5kYXRvcnkgJiZcbiAgICAgICAgICBjbWQuZ2V0T3B0aW9uVmFsdWUoYW5PcHRpb24uYXR0cmlidXRlTmFtZSgpKSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICkge1xuICAgICAgICAgIGNtZC5taXNzaW5nTWFuZGF0b3J5T3B0aW9uVmFsdWUoYW5PcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgaWYgY29uZmxpY3Rpbmcgb3B0aW9ucyBhcmUgdXNlZCB0b2dldGhlciBpbiB0aGlzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrRm9yQ29uZmxpY3RpbmdMb2NhbE9wdGlvbnMoKSB7XG4gICAgY29uc3QgZGVmaW5lZE5vbkRlZmF1bHRPcHRpb25zID0gdGhpcy5vcHRpb25zLmZpbHRlcigob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBvcHRpb25LZXkgPSBvcHRpb24uYXR0cmlidXRlTmFtZSgpO1xuICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uVmFsdWUob3B0aW9uS2V5KSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLmdldE9wdGlvblZhbHVlU291cmNlKG9wdGlvbktleSkgIT09ICdkZWZhdWx0JztcbiAgICB9KTtcblxuICAgIGNvbnN0IG9wdGlvbnNXaXRoQ29uZmxpY3RpbmcgPSBkZWZpbmVkTm9uRGVmYXVsdE9wdGlvbnMuZmlsdGVyKFxuICAgICAgKG9wdGlvbikgPT4gb3B0aW9uLmNvbmZsaWN0c1dpdGgubGVuZ3RoID4gMCxcbiAgICApO1xuXG4gICAgb3B0aW9uc1dpdGhDb25mbGljdGluZy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IGNvbmZsaWN0aW5nQW5kRGVmaW5lZCA9IGRlZmluZWROb25EZWZhdWx0T3B0aW9ucy5maW5kKChkZWZpbmVkKSA9PlxuICAgICAgICBvcHRpb24uY29uZmxpY3RzV2l0aC5pbmNsdWRlcyhkZWZpbmVkLmF0dHJpYnV0ZU5hbWUoKSksXG4gICAgICApO1xuICAgICAgaWYgKGNvbmZsaWN0aW5nQW5kRGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9jb25mbGljdGluZ09wdGlvbihvcHRpb24sIGNvbmZsaWN0aW5nQW5kRGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBhbiBlcnJvciBtZXNzYWdlIGlmIGNvbmZsaWN0aW5nIG9wdGlvbnMgYXJlIHVzZWQgdG9nZXRoZXIuXG4gICAqIENhbGxlZCBhZnRlciBjaGVja2luZyBmb3IgaGVscCBmbGFncyBpbiBsZWFmIHN1YmNvbW1hbmQuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tGb3JDb25mbGljdGluZ09wdGlvbnMoKSB7XG4gICAgLy8gV2FsayB1cCBoaWVyYXJjaHkgc28gY2FuIGNhbGwgaW4gc3ViY29tbWFuZCBhZnRlciBjaGVja2luZyBmb3IgZGlzcGxheWluZyBoZWxwLlxuICAgIHRoaXMuX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKS5mb3JFYWNoKChjbWQpID0+IHtcbiAgICAgIGNtZC5fY2hlY2tGb3JDb25mbGljdGluZ0xvY2FsT3B0aW9ucygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIG9wdGlvbnMgZnJvbSBgYXJndmAgcmVtb3Zpbmcga25vd24gb3B0aW9ucyxcbiAgICogYW5kIHJldHVybiBhcmd2IHNwbGl0IGludG8gb3BlcmFuZHMgYW5kIHVua25vd24gYXJndW1lbnRzLlxuICAgKlxuICAgKiBTaWRlIGVmZmVjdHM6IG1vZGlmaWVzIGNvbW1hbmQgYnkgc3RvcmluZyBvcHRpb25zLiBEb2VzIG5vdCByZXNldCBzdGF0ZSBpZiBjYWxsZWQgYWdhaW4uXG4gICAqXG4gICAqIEV4YW1wbGVzOlxuICAgKlxuICAgKiAgICAgYXJndiA9PiBvcGVyYW5kcywgdW5rbm93blxuICAgKiAgICAgLS1rbm93biBra2sgb3AgPT4gW29wXSwgW11cbiAgICogICAgIG9wIC0ta25vd24ga2trID0+IFtvcF0sIFtdXG4gICAqICAgICBzdWIgLS11bmtub3duIHV1dSBvcCA9PiBbc3ViXSwgWy0tdW5rbm93biB1dXUgb3BdXG4gICAqICAgICBzdWIgLS0gLS11bmtub3duIHV1dSBvcCA9PiBbc3ViIC0tdW5rbm93biB1dXUgb3BdLCBbXVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBhcmdzXG4gICAqIEByZXR1cm4ge3tvcGVyYW5kczogc3RyaW5nW10sIHVua25vd246IHN0cmluZ1tdfX1cbiAgICovXG5cbiAgcGFyc2VPcHRpb25zKGFyZ3MpIHtcbiAgICBjb25zdCBvcGVyYW5kcyA9IFtdOyAvLyBvcGVyYW5kcywgbm90IG9wdGlvbnMgb3IgdmFsdWVzXG4gICAgY29uc3QgdW5rbm93biA9IFtdOyAvLyBmaXJzdCB1bmtub3duIG9wdGlvbiBhbmQgcmVtYWluaW5nIHVua25vd24gYXJnc1xuICAgIGxldCBkZXN0ID0gb3BlcmFuZHM7XG5cbiAgICBmdW5jdGlvbiBtYXliZU9wdGlvbihhcmcpIHtcbiAgICAgIHJldHVybiBhcmcubGVuZ3RoID4gMSAmJiBhcmdbMF0gPT09ICctJztcbiAgICB9XG5cbiAgICBjb25zdCBuZWdhdGl2ZU51bWJlckFyZyA9IChhcmcpID0+IHtcbiAgICAgIC8vIHJldHVybiBmYWxzZSBpZiBub3QgYSBuZWdhdGl2ZSBudW1iZXJcbiAgICAgIGlmICghL14tKFxcZCt8XFxkKlxcLlxcZCspKGVbKy1dP1xcZCspPyQvLnRlc3QoYXJnKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgLy8gbmVnYXRpdmUgbnVtYmVyIGlzIG9rIHVubGVzcyBkaWdpdCB1c2VkIGFzIGFuIG9wdGlvbiBpbiBjb21tYW5kIGhpZXJhcmNoeVxuICAgICAgcmV0dXJuICF0aGlzLl9nZXRDb21tYW5kQW5kQW5jZXN0b3JzKCkuc29tZSgoY21kKSA9PlxuICAgICAgICBjbWQub3B0aW9uc1xuICAgICAgICAgIC5tYXAoKG9wdCkgPT4gb3B0LnNob3J0KVxuICAgICAgICAgIC5zb21lKChzaG9ydCkgPT4gL14tXFxkJC8udGVzdChzaG9ydCkpLFxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgLy8gcGFyc2Ugb3B0aW9uc1xuICAgIGxldCBhY3RpdmVWYXJpYWRpY09wdGlvbiA9IG51bGw7XG4gICAgbGV0IGFjdGl2ZUdyb3VwID0gbnVsbDsgLy8gd29ya2luZyB0aHJvdWdoIGdyb3VwIG9mIHNob3J0IG9wdGlvbnMsIGxpa2UgLWFiY1xuICAgIGxldCBpID0gMDtcbiAgICB3aGlsZSAoaSA8IGFyZ3MubGVuZ3RoIHx8IGFjdGl2ZUdyb3VwKSB7XG4gICAgICBjb25zdCBhcmcgPSBhY3RpdmVHcm91cCA/PyBhcmdzW2krK107XG4gICAgICBhY3RpdmVHcm91cCA9IG51bGw7XG5cbiAgICAgIC8vIGxpdGVyYWxcbiAgICAgIGlmIChhcmcgPT09ICctLScpIHtcbiAgICAgICAgaWYgKGRlc3QgPT09IHVua25vd24pIGRlc3QucHVzaChhcmcpO1xuICAgICAgICBkZXN0LnB1c2goLi4uYXJncy5zbGljZShpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgIGFjdGl2ZVZhcmlhZGljT3B0aW9uICYmXG4gICAgICAgICghbWF5YmVPcHRpb24oYXJnKSB8fCBuZWdhdGl2ZU51bWJlckFyZyhhcmcpKVxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZW1pdChgb3B0aW9uOiR7YWN0aXZlVmFyaWFkaWNPcHRpb24ubmFtZSgpfWAsIGFyZyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgYWN0aXZlVmFyaWFkaWNPcHRpb24gPSBudWxsO1xuXG4gICAgICBpZiAobWF5YmVPcHRpb24oYXJnKSkge1xuICAgICAgICBjb25zdCBvcHRpb24gPSB0aGlzLl9maW5kT3B0aW9uKGFyZyk7XG4gICAgICAgIC8vIHJlY29nbmlzZWQgb3B0aW9uLCBjYWxsIGxpc3RlbmVyIHRvIGFzc2lnbiB2YWx1ZSB3aXRoIHBvc3NpYmxlIGN1c3RvbSBwcm9jZXNzaW5nXG4gICAgICAgIGlmIChvcHRpb24pIHtcbiAgICAgICAgICBpZiAob3B0aW9uLnJlcXVpcmVkKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGFyZ3NbaSsrXTtcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB0aGlzLm9wdGlvbk1pc3NpbmdBcmd1bWVudChvcHRpb24pO1xuICAgICAgICAgICAgdGhpcy5lbWl0KGBvcHRpb246JHtvcHRpb24ubmFtZSgpfWAsIHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbi5vcHRpb25hbCkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIGhpc3RvcmljYWwgYmVoYXZpb3VyIGlzIG9wdGlvbmFsIHZhbHVlIGlzIGZvbGxvd2luZyBhcmcgdW5sZXNzIGFuIG9wdGlvblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICBpIDwgYXJncy5sZW5ndGggJiZcbiAgICAgICAgICAgICAgKCFtYXliZU9wdGlvbihhcmdzW2ldKSB8fCBuZWdhdGl2ZU51bWJlckFyZyhhcmdzW2ldKSlcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICB2YWx1ZSA9IGFyZ3NbaSsrXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZW1pdChgb3B0aW9uOiR7b3B0aW9uLm5hbWUoKX1gLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJvb2xlYW4gZmxhZ1xuICAgICAgICAgICAgdGhpcy5lbWl0KGBvcHRpb246JHtvcHRpb24ubmFtZSgpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVWYXJpYWRpY09wdGlvbiA9IG9wdGlvbi52YXJpYWRpYyA/IG9wdGlvbiA6IG51bGw7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTG9vayBmb3IgY29tYm8gb3B0aW9ucyBmb2xsb3dpbmcgc2luZ2xlIGRhc2gsIGVhdCBmaXJzdCBvbmUgaWYga25vd24uXG4gICAgICBpZiAoYXJnLmxlbmd0aCA+IDIgJiYgYXJnWzBdID09PSAnLScgJiYgYXJnWzFdICE9PSAnLScpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5fZmluZE9wdGlvbihgLSR7YXJnWzFdfWApO1xuICAgICAgICBpZiAob3B0aW9uKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgb3B0aW9uLnJlcXVpcmVkIHx8XG4gICAgICAgICAgICAob3B0aW9uLm9wdGlvbmFsICYmIHRoaXMuX2NvbWJpbmVGbGFnQW5kT3B0aW9uYWxWYWx1ZSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIC8vIG9wdGlvbiB3aXRoIHZhbHVlIGZvbGxvd2luZyBpbiBzYW1lIGFyZ3VtZW50XG4gICAgICAgICAgICB0aGlzLmVtaXQoYG9wdGlvbjoke29wdGlvbi5uYW1lKCl9YCwgYXJnLnNsaWNlKDIpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gYm9vbGVhbiBvcHRpb25cbiAgICAgICAgICAgIHRoaXMuZW1pdChgb3B0aW9uOiR7b3B0aW9uLm5hbWUoKX1gKTtcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcHJvY2Vzc2VkIG9wdGlvbiBhbmQga2VlcCBwcm9jZXNzaW5nIGdyb3VwXG4gICAgICAgICAgICBhY3RpdmVHcm91cCA9IGAtJHthcmcuc2xpY2UoMil9YDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gTG9vayBmb3Iga25vd24gbG9uZyBmbGFnIHdpdGggdmFsdWUsIGxpa2UgLS1mb289YmFyXG4gICAgICBpZiAoL14tLVtePV0rPS8udGVzdChhcmcpKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXJnLmluZGV4T2YoJz0nKTtcbiAgICAgICAgY29uc3Qgb3B0aW9uID0gdGhpcy5fZmluZE9wdGlvbihhcmcuc2xpY2UoMCwgaW5kZXgpKTtcbiAgICAgICAgaWYgKG9wdGlvbiAmJiAob3B0aW9uLnJlcXVpcmVkIHx8IG9wdGlvbi5vcHRpb25hbCkpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoYG9wdGlvbjoke29wdGlvbi5uYW1lKCl9YCwgYXJnLnNsaWNlKGluZGV4ICsgMSkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE5vdCBhIHJlY29nbmlzZWQgb3B0aW9uIGJ5IHRoaXMgY29tbWFuZC5cbiAgICAgIC8vIE1pZ2h0IGJlIGEgY29tbWFuZC1hcmd1bWVudCwgb3Igc3ViY29tbWFuZCBvcHRpb24sIG9yIHVua25vd24gb3B0aW9uLCBvciBoZWxwIGNvbW1hbmQgb3Igb3B0aW9uLlxuXG4gICAgICAvLyBBbiB1bmtub3duIG9wdGlvbiBtZWFucyBmdXJ0aGVyIGFyZ3VtZW50cyBhbHNvIGNsYXNzaWZpZWQgYXMgdW5rbm93biBzbyBjYW4gYmUgcmVwcm9jZXNzZWQgYnkgc3ViY29tbWFuZHMuXG4gICAgICAvLyBBIG5lZ2F0aXZlIG51bWJlciBpbiBhIGxlYWYgY29tbWFuZCBpcyBub3QgYW4gdW5rbm93biBvcHRpb24uXG4gICAgICBpZiAoXG4gICAgICAgIGRlc3QgPT09IG9wZXJhbmRzICYmXG4gICAgICAgIG1heWJlT3B0aW9uKGFyZykgJiZcbiAgICAgICAgISh0aGlzLmNvbW1hbmRzLmxlbmd0aCA9PT0gMCAmJiBuZWdhdGl2ZU51bWJlckFyZyhhcmcpKVxuICAgICAgKSB7XG4gICAgICAgIGRlc3QgPSB1bmtub3duO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB1c2luZyBwb3NpdGlvbmFsT3B0aW9ucywgc3RvcCBwcm9jZXNzaW5nIG91ciBvcHRpb25zIGF0IHN1YmNvbW1hbmQuXG4gICAgICBpZiAoXG4gICAgICAgICh0aGlzLl9lbmFibGVQb3NpdGlvbmFsT3B0aW9ucyB8fCB0aGlzLl9wYXNzVGhyb3VnaE9wdGlvbnMpICYmXG4gICAgICAgIG9wZXJhbmRzLmxlbmd0aCA9PT0gMCAmJlxuICAgICAgICB1bmtub3duLmxlbmd0aCA9PT0gMFxuICAgICAgKSB7XG4gICAgICAgIGlmICh0aGlzLl9maW5kQ29tbWFuZChhcmcpKSB7XG4gICAgICAgICAgb3BlcmFuZHMucHVzaChhcmcpO1xuICAgICAgICAgIHVua25vd24ucHVzaCguLi5hcmdzLnNsaWNlKGkpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICB0aGlzLl9nZXRIZWxwQ29tbWFuZCgpICYmXG4gICAgICAgICAgYXJnID09PSB0aGlzLl9nZXRIZWxwQ29tbWFuZCgpLm5hbWUoKVxuICAgICAgICApIHtcbiAgICAgICAgICBvcGVyYW5kcy5wdXNoKGFyZywgLi4uYXJncy5zbGljZShpKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmYXVsdENvbW1hbmROYW1lKSB7XG4gICAgICAgICAgdW5rbm93bi5wdXNoKGFyZywgLi4uYXJncy5zbGljZShpKSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgdXNpbmcgcGFzc1Rocm91Z2hPcHRpb25zLCBzdG9wIHByb2Nlc3Npbmcgb3B0aW9ucyBhdCBmaXJzdCBjb21tYW5kLWFyZ3VtZW50LlxuICAgICAgaWYgKHRoaXMuX3Bhc3NUaHJvdWdoT3B0aW9ucykge1xuICAgICAgICBkZXN0LnB1c2goYXJnLCAuLi5hcmdzLnNsaWNlKGkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIC8vIGFkZCBhcmdcbiAgICAgIGRlc3QucHVzaChhcmcpO1xuICAgIH1cblxuICAgIHJldHVybiB7IG9wZXJhbmRzLCB1bmtub3duIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGxvY2FsIG9wdGlvbiB2YWx1ZXMgYXMga2V5LXZhbHVlIHBhaXJzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBvcHRzKCkge1xuICAgIGlmICh0aGlzLl9zdG9yZU9wdGlvbnNBc1Byb3BlcnRpZXMpIHtcbiAgICAgIC8vIFByZXNlcnZlIG9yaWdpbmFsIGJlaGF2aW91ciBzbyBiYWNrd2FyZHMgY29tcGF0aWJsZSB3aGVuIHN0aWxsIHVzaW5nIHByb3BlcnRpZXNcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgY29uc3QgbGVuID0gdGhpcy5vcHRpb25zLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLm9wdGlvbnNbaV0uYXR0cmlidXRlTmFtZSgpO1xuICAgICAgICByZXN1bHRba2V5XSA9XG4gICAgICAgICAga2V5ID09PSB0aGlzLl92ZXJzaW9uT3B0aW9uTmFtZSA/IHRoaXMuX3ZlcnNpb24gOiB0aGlzW2tleV07XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9vcHRpb25WYWx1ZXM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIG1lcmdlZCBsb2NhbCBhbmQgZ2xvYmFsIG9wdGlvbiB2YWx1ZXMgYXMga2V5LXZhbHVlIHBhaXJzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBvcHRzV2l0aEdsb2JhbHMoKSB7XG4gICAgLy8gZ2xvYmFscyBvdmVyd3JpdGUgbG9jYWxzXG4gICAgcmV0dXJuIHRoaXMuX2dldENvbW1hbmRBbmRBbmNlc3RvcnMoKS5yZWR1Y2UoXG4gICAgICAoY29tYmluZWRPcHRpb25zLCBjbWQpID0+IE9iamVjdC5hc3NpZ24oY29tYmluZWRPcHRpb25zLCBjbWQub3B0cygpKSxcbiAgICAgIHt9LFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBlcnJvciBtZXNzYWdlIGFuZCBleGl0IChvciBjYWxsIGV4aXRPdmVycmlkZSkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBbZXJyb3JPcHRpb25zXVxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2Vycm9yT3B0aW9ucy5jb2RlXSAtIGFuIGlkIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGVycm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBbZXJyb3JPcHRpb25zLmV4aXRDb2RlXSAtIHVzZWQgd2l0aCBwcm9jZXNzLmV4aXRcbiAgICovXG4gIGVycm9yKG1lc3NhZ2UsIGVycm9yT3B0aW9ucykge1xuICAgIC8vIG91dHB1dCBoYW5kbGluZ1xuICAgIHRoaXMuX291dHB1dENvbmZpZ3VyYXRpb24ub3V0cHV0RXJyb3IoXG4gICAgICBgJHttZXNzYWdlfVxcbmAsXG4gICAgICB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLndyaXRlRXJyLFxuICAgICk7XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9zaG93SGVscEFmdGVyRXJyb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLndyaXRlRXJyKGAke3RoaXMuX3Nob3dIZWxwQWZ0ZXJFcnJvcn1cXG5gKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX3Nob3dIZWxwQWZ0ZXJFcnJvcikge1xuICAgICAgdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbi53cml0ZUVycignXFxuJyk7XG4gICAgICB0aGlzLm91dHB1dEhlbHAoeyBlcnJvcjogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICAvLyBleGl0IGhhbmRsaW5nXG4gICAgY29uc3QgY29uZmlnID0gZXJyb3JPcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGV4aXRDb2RlID0gY29uZmlnLmV4aXRDb2RlIHx8IDE7XG4gICAgY29uc3QgY29kZSA9IGNvbmZpZy5jb2RlIHx8ICdjb21tYW5kZXIuZXJyb3InO1xuICAgIHRoaXMuX2V4aXQoZXhpdENvZGUsIGNvZGUsIG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IGFueSBvcHRpb24gcmVsYXRlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMsIGlmIG9wdGlvbiBkb2VzXG4gICAqIG5vdCBoYXZlIGEgdmFsdWUgZnJvbSBjbGkgb3IgY2xpZW50IGNvZGUuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcGFyc2VPcHRpb25zRW52KCkge1xuICAgIHRoaXMub3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGlmIChvcHRpb24uZW52VmFyICYmIG9wdGlvbi5lbnZWYXIgaW4gcHJvY2Vzcy5lbnYpIHtcbiAgICAgICAgY29uc3Qgb3B0aW9uS2V5ID0gb3B0aW9uLmF0dHJpYnV0ZU5hbWUoKTtcbiAgICAgICAgLy8gUHJpb3JpdHkgY2hlY2suIERvIG5vdCBvdmVyd3JpdGUgY2xpIG9yIG9wdGlvbnMgZnJvbSB1bmtub3duIHNvdXJjZSAoY2xpZW50LWNvZGUpLlxuICAgICAgICBpZiAoXG4gICAgICAgICAgdGhpcy5nZXRPcHRpb25WYWx1ZShvcHRpb25LZXkpID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICBbJ2RlZmF1bHQnLCAnY29uZmlnJywgJ2VudiddLmluY2x1ZGVzKFxuICAgICAgICAgICAgdGhpcy5nZXRPcHRpb25WYWx1ZVNvdXJjZShvcHRpb25LZXkpLFxuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbi5yZXF1aXJlZCB8fCBvcHRpb24ub3B0aW9uYWwpIHtcbiAgICAgICAgICAgIC8vIG9wdGlvbiBjYW4gdGFrZSBhIHZhbHVlXG4gICAgICAgICAgICAvLyBrZWVwIHZlcnkgc2ltcGxlLCBvcHRpb25hbCBhbHdheXMgdGFrZXMgdmFsdWVcbiAgICAgICAgICAgIHRoaXMuZW1pdChgb3B0aW9uRW52OiR7b3B0aW9uLm5hbWUoKX1gLCBwcm9jZXNzLmVudltvcHRpb24uZW52VmFyXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJvb2xlYW5cbiAgICAgICAgICAgIC8vIGtlZXAgdmVyeSBzaW1wbGUsIG9ubHkgY2FyZSB0aGF0IGVudlZhciBkZWZpbmVkIGFuZCBub3QgdGhlIHZhbHVlXG4gICAgICAgICAgICB0aGlzLmVtaXQoYG9wdGlvbkVudjoke29wdGlvbi5uYW1lKCl9YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgYW55IGltcGxpZWQgb3B0aW9uIHZhbHVlcywgaWYgb3B0aW9uIGlzIHVuZGVmaW5lZCBvciBkZWZhdWx0IHZhbHVlLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3BhcnNlT3B0aW9uc0ltcGxpZWQoKSB7XG4gICAgY29uc3QgZHVhbEhlbHBlciA9IG5ldyBEdWFsT3B0aW9ucyh0aGlzLm9wdGlvbnMpO1xuICAgIGNvbnN0IGhhc0N1c3RvbU9wdGlvblZhbHVlID0gKG9wdGlvbktleSkgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5nZXRPcHRpb25WYWx1ZShvcHRpb25LZXkpICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgIVsnZGVmYXVsdCcsICdpbXBsaWVkJ10uaW5jbHVkZXModGhpcy5nZXRPcHRpb25WYWx1ZVNvdXJjZShvcHRpb25LZXkpKVxuICAgICAgKTtcbiAgICB9O1xuICAgIHRoaXMub3B0aW9uc1xuICAgICAgLmZpbHRlcihcbiAgICAgICAgKG9wdGlvbikgPT5cbiAgICAgICAgICBvcHRpb24uaW1wbGllZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgaGFzQ3VzdG9tT3B0aW9uVmFsdWUob3B0aW9uLmF0dHJpYnV0ZU5hbWUoKSkgJiZcbiAgICAgICAgICBkdWFsSGVscGVyLnZhbHVlRnJvbU9wdGlvbihcbiAgICAgICAgICAgIHRoaXMuZ2V0T3B0aW9uVmFsdWUob3B0aW9uLmF0dHJpYnV0ZU5hbWUoKSksXG4gICAgICAgICAgICBvcHRpb24sXG4gICAgICAgICAgKSxcbiAgICAgIClcbiAgICAgIC5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9uLmltcGxpZWQpXG4gICAgICAgICAgLmZpbHRlcigoaW1wbGllZEtleSkgPT4gIWhhc0N1c3RvbU9wdGlvblZhbHVlKGltcGxpZWRLZXkpKVxuICAgICAgICAgIC5mb3JFYWNoKChpbXBsaWVkS2V5KSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvblZhbHVlV2l0aFNvdXJjZShcbiAgICAgICAgICAgICAgaW1wbGllZEtleSxcbiAgICAgICAgICAgICAgb3B0aW9uLmltcGxpZWRbaW1wbGllZEtleV0sXG4gICAgICAgICAgICAgICdpbXBsaWVkJyxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcmd1bWVudCBgbmFtZWAgaXMgbWlzc2luZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgbWlzc2luZ0FyZ3VtZW50KG5hbWUpIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYGVycm9yOiBtaXNzaW5nIHJlcXVpcmVkIGFyZ3VtZW50ICcke25hbWV9J2A7XG4gICAgdGhpcy5lcnJvcihtZXNzYWdlLCB7IGNvZGU6ICdjb21tYW5kZXIubWlzc2luZ0FyZ3VtZW50JyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgT3B0aW9uYCBpcyBtaXNzaW5nIGFuIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09wdGlvbn0gb3B0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuXG4gIG9wdGlvbk1pc3NpbmdBcmd1bWVudChvcHRpb24pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYGVycm9yOiBvcHRpb24gJyR7b3B0aW9uLmZsYWdzfScgYXJndW1lbnQgbWlzc2luZ2A7XG4gICAgdGhpcy5lcnJvcihtZXNzYWdlLCB7IGNvZGU6ICdjb21tYW5kZXIub3B0aW9uTWlzc2luZ0FyZ3VtZW50JyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBgT3B0aW9uYCBkb2VzIG5vdCBoYXZlIGEgdmFsdWUsIGFuZCBpcyBhIG1hbmRhdG9yeSBvcHRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgbWlzc2luZ01hbmRhdG9yeU9wdGlvblZhbHVlKG9wdGlvbikge1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBgZXJyb3I6IHJlcXVpcmVkIG9wdGlvbiAnJHtvcHRpb24uZmxhZ3N9JyBub3Qgc3BlY2lmaWVkYDtcbiAgICB0aGlzLmVycm9yKG1lc3NhZ2UsIHsgY29kZTogJ2NvbW1hbmRlci5taXNzaW5nTWFuZGF0b3J5T3B0aW9uVmFsdWUnIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIGBPcHRpb25gIGNvbmZsaWN0cyB3aXRoIGFub3RoZXIgb3B0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge09wdGlvbn0gb3B0aW9uXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBjb25mbGljdGluZ09wdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NvbmZsaWN0aW5nT3B0aW9uKG9wdGlvbiwgY29uZmxpY3RpbmdPcHRpb24pIHtcbiAgICAvLyBUaGUgY2FsbGluZyBjb2RlIGRvZXMgbm90IGtub3cgd2hldGhlciBhIG5lZ2F0ZWQgb3B0aW9uIGlzIHRoZSBzb3VyY2Ugb2YgdGhlXG4gICAgLy8gdmFsdWUsIHNvIGRvIHNvbWUgd29yayB0byB0YWtlIGFuIGVkdWNhdGVkIGd1ZXNzLlxuICAgIGNvbnN0IGZpbmRCZXN0T3B0aW9uRnJvbVZhbHVlID0gKG9wdGlvbikgPT4ge1xuICAgICAgY29uc3Qgb3B0aW9uS2V5ID0gb3B0aW9uLmF0dHJpYnV0ZU5hbWUoKTtcbiAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gdGhpcy5nZXRPcHRpb25WYWx1ZShvcHRpb25LZXkpO1xuICAgICAgY29uc3QgbmVnYXRpdmVPcHRpb24gPSB0aGlzLm9wdGlvbnMuZmluZChcbiAgICAgICAgKHRhcmdldCkgPT4gdGFyZ2V0Lm5lZ2F0ZSAmJiBvcHRpb25LZXkgPT09IHRhcmdldC5hdHRyaWJ1dGVOYW1lKCksXG4gICAgICApO1xuICAgICAgY29uc3QgcG9zaXRpdmVPcHRpb24gPSB0aGlzLm9wdGlvbnMuZmluZChcbiAgICAgICAgKHRhcmdldCkgPT4gIXRhcmdldC5uZWdhdGUgJiYgb3B0aW9uS2V5ID09PSB0YXJnZXQuYXR0cmlidXRlTmFtZSgpLFxuICAgICAgKTtcbiAgICAgIGlmIChcbiAgICAgICAgbmVnYXRpdmVPcHRpb24gJiZcbiAgICAgICAgKChuZWdhdGl2ZU9wdGlvbi5wcmVzZXRBcmcgPT09IHVuZGVmaW5lZCAmJiBvcHRpb25WYWx1ZSA9PT0gZmFsc2UpIHx8XG4gICAgICAgICAgKG5lZ2F0aXZlT3B0aW9uLnByZXNldEFyZyAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICBvcHRpb25WYWx1ZSA9PT0gbmVnYXRpdmVPcHRpb24ucHJlc2V0QXJnKSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gbmVnYXRpdmVPcHRpb247XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9zaXRpdmVPcHRpb24gfHwgb3B0aW9uO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRFcnJvck1lc3NhZ2UgPSAob3B0aW9uKSA9PiB7XG4gICAgICBjb25zdCBiZXN0T3B0aW9uID0gZmluZEJlc3RPcHRpb25Gcm9tVmFsdWUob3B0aW9uKTtcbiAgICAgIGNvbnN0IG9wdGlvbktleSA9IGJlc3RPcHRpb24uYXR0cmlidXRlTmFtZSgpO1xuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5nZXRPcHRpb25WYWx1ZVNvdXJjZShvcHRpb25LZXkpO1xuICAgICAgaWYgKHNvdXJjZSA9PT0gJ2VudicpIHtcbiAgICAgICAgcmV0dXJuIGBlbnZpcm9ubWVudCB2YXJpYWJsZSAnJHtiZXN0T3B0aW9uLmVudlZhcn0nYDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgb3B0aW9uICcke2Jlc3RPcHRpb24uZmxhZ3N9J2A7XG4gICAgfTtcblxuICAgIGNvbnN0IG1lc3NhZ2UgPSBgZXJyb3I6ICR7Z2V0RXJyb3JNZXNzYWdlKG9wdGlvbil9IGNhbm5vdCBiZSB1c2VkIHdpdGggJHtnZXRFcnJvck1lc3NhZ2UoY29uZmxpY3RpbmdPcHRpb24pfWA7XG4gICAgdGhpcy5lcnJvcihtZXNzYWdlLCB7IGNvZGU6ICdjb21tYW5kZXIuY29uZmxpY3RpbmdPcHRpb24nIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVua25vd24gb3B0aW9uIGBmbGFnYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZsYWdcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgdW5rbm93bk9wdGlvbihmbGFnKSB7XG4gICAgaWYgKHRoaXMuX2FsbG93VW5rbm93bk9wdGlvbikgcmV0dXJuO1xuICAgIGxldCBzdWdnZXN0aW9uID0gJyc7XG5cbiAgICBpZiAoZmxhZy5zdGFydHNXaXRoKCctLScpICYmIHRoaXMuX3Nob3dTdWdnZXN0aW9uQWZ0ZXJFcnJvcikge1xuICAgICAgLy8gTG9vcGluZyB0byBwaWNrIHVwIHRoZSBnbG9iYWwgb3B0aW9ucyB0b29cbiAgICAgIGxldCBjYW5kaWRhdGVGbGFncyA9IFtdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgICBsZXQgY29tbWFuZCA9IHRoaXM7XG4gICAgICBkbyB7XG4gICAgICAgIGNvbnN0IG1vcmVGbGFncyA9IGNvbW1hbmRcbiAgICAgICAgICAuY3JlYXRlSGVscCgpXG4gICAgICAgICAgLnZpc2libGVPcHRpb25zKGNvbW1hbmQpXG4gICAgICAgICAgLmZpbHRlcigob3B0aW9uKSA9PiBvcHRpb24ubG9uZylcbiAgICAgICAgICAubWFwKChvcHRpb24pID0+IG9wdGlvbi5sb25nKTtcbiAgICAgICAgY2FuZGlkYXRlRmxhZ3MgPSBjYW5kaWRhdGVGbGFncy5jb25jYXQobW9yZUZsYWdzKTtcbiAgICAgICAgY29tbWFuZCA9IGNvbW1hbmQucGFyZW50O1xuICAgICAgfSB3aGlsZSAoY29tbWFuZCAmJiAhY29tbWFuZC5fZW5hYmxlUG9zaXRpb25hbE9wdGlvbnMpO1xuICAgICAgc3VnZ2VzdGlvbiA9IHN1Z2dlc3RTaW1pbGFyKGZsYWcsIGNhbmRpZGF0ZUZsYWdzKTtcbiAgICB9XG5cbiAgICBjb25zdCBtZXNzYWdlID0gYGVycm9yOiB1bmtub3duIG9wdGlvbiAnJHtmbGFnfScke3N1Z2dlc3Rpb259YDtcbiAgICB0aGlzLmVycm9yKG1lc3NhZ2UsIHsgY29kZTogJ2NvbW1hbmRlci51bmtub3duT3B0aW9uJyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeGNlc3MgYXJndW1lbnRzLCBtb3JlIHRoYW4gZXhwZWN0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nW119IHJlY2VpdmVkQXJnc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBfZXhjZXNzQXJndW1lbnRzKHJlY2VpdmVkQXJncykge1xuICAgIGlmICh0aGlzLl9hbGxvd0V4Y2Vzc0FyZ3VtZW50cykgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHMubGVuZ3RoO1xuICAgIGNvbnN0IHMgPSBleHBlY3RlZCA9PT0gMSA/ICcnIDogJ3MnO1xuICAgIGNvbnN0IGZvclN1YmNvbW1hbmQgPSB0aGlzLnBhcmVudCA/IGAgZm9yICcke3RoaXMubmFtZSgpfSdgIDogJyc7XG4gICAgY29uc3QgbWVzc2FnZSA9IGBlcnJvcjogdG9vIG1hbnkgYXJndW1lbnRzJHtmb3JTdWJjb21tYW5kfS4gRXhwZWN0ZWQgJHtleHBlY3RlZH0gYXJndW1lbnQke3N9IGJ1dCBnb3QgJHtyZWNlaXZlZEFyZ3MubGVuZ3RofS5gO1xuICAgIHRoaXMuZXJyb3IobWVzc2FnZSwgeyBjb2RlOiAnY29tbWFuZGVyLmV4Y2Vzc0FyZ3VtZW50cycgfSk7XG4gIH1cblxuICAvKipcbiAgICogVW5rbm93biBjb21tYW5kLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICB1bmtub3duQ29tbWFuZCgpIHtcbiAgICBjb25zdCB1bmtub3duTmFtZSA9IHRoaXMuYXJnc1swXTtcbiAgICBsZXQgc3VnZ2VzdGlvbiA9ICcnO1xuXG4gICAgaWYgKHRoaXMuX3Nob3dTdWdnZXN0aW9uQWZ0ZXJFcnJvcikge1xuICAgICAgY29uc3QgY2FuZGlkYXRlTmFtZXMgPSBbXTtcbiAgICAgIHRoaXMuY3JlYXRlSGVscCgpXG4gICAgICAgIC52aXNpYmxlQ29tbWFuZHModGhpcylcbiAgICAgICAgLmZvckVhY2goKGNvbW1hbmQpID0+IHtcbiAgICAgICAgICBjYW5kaWRhdGVOYW1lcy5wdXNoKGNvbW1hbmQubmFtZSgpKTtcbiAgICAgICAgICAvLyBqdXN0IHZpc2libGUgYWxpYXNcbiAgICAgICAgICBpZiAoY29tbWFuZC5hbGlhcygpKSBjYW5kaWRhdGVOYW1lcy5wdXNoKGNvbW1hbmQuYWxpYXMoKSk7XG4gICAgICAgIH0pO1xuICAgICAgc3VnZ2VzdGlvbiA9IHN1Z2dlc3RTaW1pbGFyKHVua25vd25OYW1lLCBjYW5kaWRhdGVOYW1lcyk7XG4gICAgfVxuXG4gICAgY29uc3QgbWVzc2FnZSA9IGBlcnJvcjogdW5rbm93biBjb21tYW5kICcke3Vua25vd25OYW1lfScke3N1Z2dlc3Rpb259YDtcbiAgICB0aGlzLmVycm9yKG1lc3NhZ2UsIHsgY29kZTogJ2NvbW1hbmRlci51bmtub3duQ29tbWFuZCcgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IG9yIHNldCB0aGUgcHJvZ3JhbSB2ZXJzaW9uLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBhdXRvLXJlZ2lzdGVycyB0aGUgXCItViwgLS12ZXJzaW9uXCIgb3B0aW9uIHdoaWNoIHdpbGwgcHJpbnQgdGhlIHZlcnNpb24gbnVtYmVyLlxuICAgKlxuICAgKiBZb3UgY2FuIG9wdGlvbmFsbHkgc3VwcGx5IHRoZSBmbGFncyBhbmQgZGVzY3JpcHRpb24gdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHRzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3N0cl1cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtmbGFnc11cbiAgICogQHBhcmFtIHtzdHJpbmd9IFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7KHRoaXMgfCBzdHJpbmcgfCB1bmRlZmluZWQpfSBgdGhpc2AgY29tbWFuZCBmb3IgY2hhaW5pbmcsIG9yIHZlcnNpb24gc3RyaW5nIGlmIG5vIGFyZ3VtZW50c1xuICAgKi9cblxuICB2ZXJzaW9uKHN0ciwgZmxhZ3MsIGRlc2NyaXB0aW9uKSB7XG4gICAgaWYgKHN0ciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fdmVyc2lvbjtcbiAgICB0aGlzLl92ZXJzaW9uID0gc3RyO1xuICAgIGZsYWdzID0gZmxhZ3MgfHwgJy1WLCAtLXZlcnNpb24nO1xuICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24gfHwgJ291dHB1dCB0aGUgdmVyc2lvbiBudW1iZXInO1xuICAgIGNvbnN0IHZlcnNpb25PcHRpb24gPSB0aGlzLmNyZWF0ZU9wdGlvbihmbGFncywgZGVzY3JpcHRpb24pO1xuICAgIHRoaXMuX3ZlcnNpb25PcHRpb25OYW1lID0gdmVyc2lvbk9wdGlvbi5hdHRyaWJ1dGVOYW1lKCk7XG4gICAgdGhpcy5fcmVnaXN0ZXJPcHRpb24odmVyc2lvbk9wdGlvbik7XG5cbiAgICB0aGlzLm9uKCdvcHRpb246JyArIHZlcnNpb25PcHRpb24ubmFtZSgpLCAoKSA9PiB7XG4gICAgICB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLndyaXRlT3V0KGAke3N0cn1cXG5gKTtcbiAgICAgIHRoaXMuX2V4aXQoMCwgJ2NvbW1hbmRlci52ZXJzaW9uJywgc3RyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGRlc2NyaXB0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW3N0cl1cbiAgICogQHBhcmFtIHtvYmplY3R9IFthcmdzRGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4geyhzdHJpbmd8Q29tbWFuZCl9XG4gICAqL1xuICBkZXNjcmlwdGlvbihzdHIsIGFyZ3NEZXNjcmlwdGlvbikge1xuICAgIGlmIChzdHIgPT09IHVuZGVmaW5lZCAmJiBhcmdzRGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdGlvbjtcbiAgICB0aGlzLl9kZXNjcmlwdGlvbiA9IHN0cjtcbiAgICBpZiAoYXJnc0Rlc2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9hcmdzRGVzY3JpcHRpb24gPSBhcmdzRGVzY3JpcHRpb247XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgc3VtbWFyeS4gVXNlZCB3aGVuIGxpc3RlZCBhcyBzdWJjb21tYW5kIG9mIHBhcmVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdHJdXG4gICAqIEByZXR1cm4geyhzdHJpbmd8Q29tbWFuZCl9XG4gICAqL1xuICBzdW1tYXJ5KHN0cikge1xuICAgIGlmIChzdHIgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX3N1bW1hcnk7XG4gICAgdGhpcy5fc3VtbWFyeSA9IHN0cjtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgYW4gYWxpYXMgZm9yIHRoZSBjb21tYW5kLlxuICAgKlxuICAgKiBZb3UgbWF5IGNhbGwgbW9yZSB0aGFuIG9uY2UgdG8gYWRkIG11bHRpcGxlIGFsaWFzZXMuIE9ubHkgdGhlIGZpcnN0IGFsaWFzIGlzIHNob3duIGluIHRoZSBhdXRvLWdlbmVyYXRlZCBoZWxwLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2FsaWFzXVxuICAgKiBAcmV0dXJuIHsoc3RyaW5nfENvbW1hbmQpfVxuICAgKi9cblxuICBhbGlhcyhhbGlhcykge1xuICAgIGlmIChhbGlhcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fYWxpYXNlc1swXTsgLy8ganVzdCByZXR1cm4gZmlyc3QsIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuXG4gICAgLyoqIEB0eXBlIHtDb21tYW5kfSAqL1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgIGxldCBjb21tYW5kID0gdGhpcztcbiAgICBpZiAoXG4gICAgICB0aGlzLmNvbW1hbmRzLmxlbmd0aCAhPT0gMCAmJlxuICAgICAgdGhpcy5jb21tYW5kc1t0aGlzLmNvbW1hbmRzLmxlbmd0aCAtIDFdLl9leGVjdXRhYmxlSGFuZGxlclxuICAgICkge1xuICAgICAgLy8gYXNzdW1lIGFkZGluZyBhbGlhcyBmb3IgbGFzdCBhZGRlZCBleGVjdXRhYmxlIHN1YmNvbW1hbmQsIHJhdGhlciB0aGFuIHRoaXNcbiAgICAgIGNvbW1hbmQgPSB0aGlzLmNvbW1hbmRzW3RoaXMuY29tbWFuZHMubGVuZ3RoIC0gMV07XG4gICAgfVxuXG4gICAgaWYgKGFsaWFzID09PSBjb21tYW5kLl9uYW1lKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29tbWFuZCBhbGlhcyBjYW4ndCBiZSB0aGUgc2FtZSBhcyBpdHMgbmFtZVwiKTtcbiAgICBjb25zdCBtYXRjaGluZ0NvbW1hbmQgPSB0aGlzLnBhcmVudD8uX2ZpbmRDb21tYW5kKGFsaWFzKTtcbiAgICBpZiAobWF0Y2hpbmdDb21tYW5kKSB7XG4gICAgICAvLyBjLmYuIF9yZWdpc3RlckNvbW1hbmRcbiAgICAgIGNvbnN0IGV4aXN0aW5nQ21kID0gW21hdGNoaW5nQ29tbWFuZC5uYW1lKCldXG4gICAgICAgIC5jb25jYXQobWF0Y2hpbmdDb21tYW5kLmFsaWFzZXMoKSlcbiAgICAgICAgLmpvaW4oJ3wnKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYGNhbm5vdCBhZGQgYWxpYXMgJyR7YWxpYXN9JyB0byBjb21tYW5kICcke3RoaXMubmFtZSgpfScgYXMgYWxyZWFkeSBoYXZlIGNvbW1hbmQgJyR7ZXhpc3RpbmdDbWR9J2AsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbW1hbmQuX2FsaWFzZXMucHVzaChhbGlhcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0IGFsaWFzZXMgZm9yIHRoZSBjb21tYW5kLlxuICAgKlxuICAgKiBPbmx5IHRoZSBmaXJzdCBhbGlhcyBpcyBzaG93biBpbiB0aGUgYXV0by1nZW5lcmF0ZWQgaGVscC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmdbXX0gW2FsaWFzZXNdXG4gICAqIEByZXR1cm4geyhzdHJpbmdbXXxDb21tYW5kKX1cbiAgICovXG5cbiAgYWxpYXNlcyhhbGlhc2VzKSB7XG4gICAgLy8gR2V0dGVyIGZvciB0aGUgYXJyYXkgb2YgYWxpYXNlcyBpcyB0aGUgbWFpbiByZWFzb24gZm9yIGhhdmluZyBhbGlhc2VzKCkgaW4gYWRkaXRpb24gdG8gYWxpYXMoKS5cbiAgICBpZiAoYWxpYXNlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fYWxpYXNlcztcblxuICAgIGFsaWFzZXMuZm9yRWFjaCgoYWxpYXMpID0+IHRoaXMuYWxpYXMoYWxpYXMpKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgLyBnZXQgdGhlIGNvbW1hbmQgdXNhZ2UgYHN0cmAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbc3RyXVxuICAgKiBAcmV0dXJuIHsoc3RyaW5nfENvbW1hbmQpfVxuICAgKi9cblxuICB1c2FnZShzdHIpIHtcbiAgICBpZiAoc3RyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLl91c2FnZSkgcmV0dXJuIHRoaXMuX3VzYWdlO1xuXG4gICAgICBjb25zdCBhcmdzID0gdGhpcy5yZWdpc3RlcmVkQXJndW1lbnRzLm1hcCgoYXJnKSA9PiB7XG4gICAgICAgIHJldHVybiBodW1hblJlYWRhYmxlQXJnTmFtZShhcmcpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gW11cbiAgICAgICAgLmNvbmNhdChcbiAgICAgICAgICB0aGlzLm9wdGlvbnMubGVuZ3RoIHx8IHRoaXMuX2hlbHBPcHRpb24gIT09IG51bGwgPyAnW29wdGlvbnNdJyA6IFtdLFxuICAgICAgICAgIHRoaXMuY29tbWFuZHMubGVuZ3RoID8gJ1tjb21tYW5kXScgOiBbXSxcbiAgICAgICAgICB0aGlzLnJlZ2lzdGVyZWRBcmd1bWVudHMubGVuZ3RoID8gYXJncyA6IFtdLFxuICAgICAgICApXG4gICAgICAgIC5qb2luKCcgJyk7XG4gICAgfVxuXG4gICAgdGhpcy5fdXNhZ2UgPSBzdHI7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0IG9yIHNldCB0aGUgbmFtZSBvZiB0aGUgY29tbWFuZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtzdHJdXG4gICAqIEByZXR1cm4geyhzdHJpbmd8Q29tbWFuZCl9XG4gICAqL1xuXG4gIG5hbWUoc3RyKSB7XG4gICAgaWYgKHN0ciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdGhpcy5fbmFtZTtcbiAgICB0aGlzLl9uYW1lID0gc3RyO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldC9nZXQgdGhlIGhlbHAgZ3JvdXAgaGVhZGluZyBmb3IgdGhpcyBzdWJjb21tYW5kIGluIHBhcmVudCBjb21tYW5kJ3MgaGVscC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtoZWFkaW5nXVxuICAgKiBAcmV0dXJuIHtDb21tYW5kIHwgc3RyaW5nfVxuICAgKi9cblxuICBoZWxwR3JvdXAoaGVhZGluZykge1xuICAgIGlmIChoZWFkaW5nID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9oZWxwR3JvdXBIZWFkaW5nID8/ICcnO1xuICAgIHRoaXMuX2hlbHBHcm91cEhlYWRpbmcgPSBoZWFkaW5nO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldC9nZXQgdGhlIGRlZmF1bHQgaGVscCBncm91cCBoZWFkaW5nIGZvciBzdWJjb21tYW5kcyBhZGRlZCB0byB0aGlzIGNvbW1hbmQuXG4gICAqIChUaGlzIGRvZXMgbm90IG92ZXJyaWRlIGEgZ3JvdXAgc2V0IGRpcmVjdGx5IG9uIHRoZSBzdWJjb21tYW5kIHVzaW5nIC5oZWxwR3JvdXAoKS4pXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW0uY29tbWFuZHNHcm91cCgnRGV2ZWxvcG1lbnQgQ29tbWFuZHM6KTtcbiAgICogcHJvZ3JhbS5jb21tYW5kKCd3YXRjaCcpLi4uXG4gICAqIHByb2dyYW0uY29tbWFuZCgnbGludCcpLi4uXG4gICAqIC4uLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gW2hlYWRpbmddXG4gICAqIEByZXR1cm5zIHtDb21tYW5kIHwgc3RyaW5nfVxuICAgKi9cbiAgY29tbWFuZHNHcm91cChoZWFkaW5nKSB7XG4gICAgaWYgKGhlYWRpbmcgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX2RlZmF1bHRDb21tYW5kR3JvdXAgPz8gJyc7XG4gICAgdGhpcy5fZGVmYXVsdENvbW1hbmRHcm91cCA9IGhlYWRpbmc7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0L2dldCB0aGUgZGVmYXVsdCBoZWxwIGdyb3VwIGhlYWRpbmcgZm9yIG9wdGlvbnMgYWRkZWQgdG8gdGhpcyBjb21tYW5kLlxuICAgKiAoVGhpcyBkb2VzIG5vdCBvdmVycmlkZSBhIGdyb3VwIHNldCBkaXJlY3RseSBvbiB0aGUgb3B0aW9uIHVzaW5nIC5oZWxwR3JvdXAoKS4pXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW1cbiAgICogICAub3B0aW9uc0dyb3VwKCdEZXZlbG9wbWVudCBPcHRpb25zOicpXG4gICAqICAgLm9wdGlvbignLWQsIC0tZGVidWcnLCAnb3V0cHV0IGV4dHJhIGRlYnVnZ2luZycpXG4gICAqICAgLm9wdGlvbignLXAsIC0tcHJvZmlsZScsICdvdXRwdXQgcHJvZmlsaW5nIGluZm9ybWF0aW9uJylcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtoZWFkaW5nXVxuICAgKiBAcmV0dXJucyB7Q29tbWFuZCB8IHN0cmluZ31cbiAgICovXG4gIG9wdGlvbnNHcm91cChoZWFkaW5nKSB7XG4gICAgaWYgKGhlYWRpbmcgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRoaXMuX2RlZmF1bHRPcHRpb25Hcm91cCA/PyAnJztcbiAgICB0aGlzLl9kZWZhdWx0T3B0aW9uR3JvdXAgPSBoZWFkaW5nO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0T3B0aW9uR3JvdXAob3B0aW9uKSB7XG4gICAgaWYgKHRoaXMuX2RlZmF1bHRPcHRpb25Hcm91cCAmJiAhb3B0aW9uLmhlbHBHcm91cEhlYWRpbmcpXG4gICAgICBvcHRpb24uaGVscEdyb3VwKHRoaXMuX2RlZmF1bHRPcHRpb25Hcm91cCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtDb21tYW5kfSBjbWRcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0Q29tbWFuZEdyb3VwKGNtZCkge1xuICAgIGlmICh0aGlzLl9kZWZhdWx0Q29tbWFuZEdyb3VwICYmICFjbWQuaGVscEdyb3VwKCkpXG4gICAgICBjbWQuaGVscEdyb3VwKHRoaXMuX2RlZmF1bHRDb21tYW5kR3JvdXApO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgbmFtZSBvZiB0aGUgY29tbWFuZCBmcm9tIHNjcmlwdCBmaWxlbmFtZSwgc3VjaCBhcyBwcm9jZXNzLmFyZ3ZbMV0sXG4gICAqIG9yIHJlcXVpcmUubWFpbi5maWxlbmFtZSwgb3IgX19maWxlbmFtZS5cbiAgICpcbiAgICogKFVzZWQgaW50ZXJuYWxseSBhbmQgcHVibGljIGFsdGhvdWdoIG5vdCBkb2N1bWVudGVkIGluIFJFQURNRS4pXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIHByb2dyYW0ubmFtZUZyb21GaWxlbmFtZShyZXF1aXJlLm1haW4uZmlsZW5hbWUpO1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsZW5hbWVcbiAgICogQHJldHVybiB7Q29tbWFuZH1cbiAgICovXG5cbiAgbmFtZUZyb21GaWxlbmFtZShmaWxlbmFtZSkge1xuICAgIHRoaXMuX25hbWUgPSBwYXRoLmJhc2VuYW1lKGZpbGVuYW1lLCBwYXRoLmV4dG5hbWUoZmlsZW5hbWUpKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBvciBzZXQgdGhlIGRpcmVjdG9yeSBmb3Igc2VhcmNoaW5nIGZvciBleGVjdXRhYmxlIHN1YmNvbW1hbmRzIG9mIHRoaXMgY29tbWFuZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogcHJvZ3JhbS5leGVjdXRhYmxlRGlyKF9fZGlybmFtZSk7XG4gICAqIC8vIG9yXG4gICAqIHByb2dyYW0uZXhlY3V0YWJsZURpcignc3ViY29tbWFuZHMnKTtcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IFtwYXRoXVxuICAgKiBAcmV0dXJuIHsoc3RyaW5nfG51bGx8Q29tbWFuZCl9XG4gICAqL1xuXG4gIGV4ZWN1dGFibGVEaXIocGF0aCkge1xuICAgIGlmIChwYXRoID09PSB1bmRlZmluZWQpIHJldHVybiB0aGlzLl9leGVjdXRhYmxlRGlyO1xuICAgIHRoaXMuX2V4ZWN1dGFibGVEaXIgPSBwYXRoO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBwcm9ncmFtIGhlbHAgZG9jdW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHt7IGVycm9yOiBib29sZWFuIH19IFtjb250ZXh0T3B0aW9uc10gLSBwYXNzIHtlcnJvcjp0cnVlfSB0byB3cmFwIGZvciBzdGRlcnIgaW5zdGVhZCBvZiBzdGRvdXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cblxuICBoZWxwSW5mb3JtYXRpb24oY29udGV4dE9wdGlvbnMpIHtcbiAgICBjb25zdCBoZWxwZXIgPSB0aGlzLmNyZWF0ZUhlbHAoKTtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fZ2V0T3V0cHV0Q29udGV4dChjb250ZXh0T3B0aW9ucyk7XG4gICAgaGVscGVyLnByZXBhcmVDb250ZXh0KHtcbiAgICAgIGVycm9yOiBjb250ZXh0LmVycm9yLFxuICAgICAgaGVscFdpZHRoOiBjb250ZXh0LmhlbHBXaWR0aCxcbiAgICAgIG91dHB1dEhhc0NvbG9yczogY29udGV4dC5oYXNDb2xvcnMsXG4gICAgfSk7XG4gICAgY29uc3QgdGV4dCA9IGhlbHBlci5mb3JtYXRIZWxwKHRoaXMsIGhlbHBlcik7XG4gICAgaWYgKGNvbnRleHQuaGFzQ29sb3JzKSByZXR1cm4gdGV4dDtcbiAgICByZXR1cm4gdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbi5zdHJpcENvbG9yKHRleHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIEhlbHBDb250ZXh0XG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZXJyb3JcbiAgICogQHByb3BlcnR5IHtudW1iZXJ9IGhlbHBXaWR0aFxuICAgKiBAcHJvcGVydHkge2Jvb2xlYW59IGhhc0NvbG9yc1xuICAgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSB3cml0ZSAtIGluY2x1ZGVzIHN0cmlwQ29sb3IgaWYgbmVlZGVkXG4gICAqXG4gICAqIEByZXR1cm5zIHtIZWxwQ29udGV4dH1cbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX2dldE91dHB1dENvbnRleHQoY29udGV4dE9wdGlvbnMpIHtcbiAgICBjb250ZXh0T3B0aW9ucyA9IGNvbnRleHRPcHRpb25zIHx8IHt9O1xuICAgIGNvbnN0IGVycm9yID0gISFjb250ZXh0T3B0aW9ucy5lcnJvcjtcbiAgICBsZXQgYmFzZVdyaXRlO1xuICAgIGxldCBoYXNDb2xvcnM7XG4gICAgbGV0IGhlbHBXaWR0aDtcbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIGJhc2VXcml0ZSA9IChzdHIpID0+IHRoaXMuX291dHB1dENvbmZpZ3VyYXRpb24ud3JpdGVFcnIoc3RyKTtcbiAgICAgIGhhc0NvbG9ycyA9IHRoaXMuX291dHB1dENvbmZpZ3VyYXRpb24uZ2V0RXJySGFzQ29sb3JzKCk7XG4gICAgICBoZWxwV2lkdGggPSB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLmdldEVyckhlbHBXaWR0aCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBiYXNlV3JpdGUgPSAoc3RyKSA9PiB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLndyaXRlT3V0KHN0cik7XG4gICAgICBoYXNDb2xvcnMgPSB0aGlzLl9vdXRwdXRDb25maWd1cmF0aW9uLmdldE91dEhhc0NvbG9ycygpO1xuICAgICAgaGVscFdpZHRoID0gdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbi5nZXRPdXRIZWxwV2lkdGgoKTtcbiAgICB9XG4gICAgY29uc3Qgd3JpdGUgPSAoc3RyKSA9PiB7XG4gICAgICBpZiAoIWhhc0NvbG9ycykgc3RyID0gdGhpcy5fb3V0cHV0Q29uZmlndXJhdGlvbi5zdHJpcENvbG9yKHN0cik7XG4gICAgICByZXR1cm4gYmFzZVdyaXRlKHN0cik7XG4gICAgfTtcbiAgICByZXR1cm4geyBlcnJvciwgd3JpdGUsIGhhc0NvbG9ycywgaGVscFdpZHRoIH07XG4gIH1cblxuICAvKipcbiAgICogT3V0cHV0IGhlbHAgaW5mb3JtYXRpb24gZm9yIHRoaXMgY29tbWFuZC5cbiAgICpcbiAgICogT3V0cHV0cyBidWlsdC1pbiBoZWxwLCBhbmQgY3VzdG9tIHRleHQgYWRkZWQgdXNpbmcgYC5hZGRIZWxwVGV4dCgpYC5cbiAgICpcbiAgICogQHBhcmFtIHt7IGVycm9yOiBib29sZWFuIH0gfCBGdW5jdGlvbn0gW2NvbnRleHRPcHRpb25zXSAtIHBhc3Mge2Vycm9yOnRydWV9IHRvIHdyaXRlIHRvIHN0ZGVyciBpbnN0ZWFkIG9mIHN0ZG91dFxuICAgKi9cblxuICBvdXRwdXRIZWxwKGNvbnRleHRPcHRpb25zKSB7XG4gICAgbGV0IGRlcHJlY2F0ZWRDYWxsYmFjaztcbiAgICBpZiAodHlwZW9mIGNvbnRleHRPcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBkZXByZWNhdGVkQ2FsbGJhY2sgPSBjb250ZXh0T3B0aW9ucztcbiAgICAgIGNvbnRleHRPcHRpb25zID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGNvbnN0IG91dHB1dENvbnRleHQgPSB0aGlzLl9nZXRPdXRwdXRDb250ZXh0KGNvbnRleHRPcHRpb25zKTtcbiAgICAvKiogQHR5cGUge0hlbHBUZXh0RXZlbnRDb250ZXh0fSAqL1xuICAgIGNvbnN0IGV2ZW50Q29udGV4dCA9IHtcbiAgICAgIGVycm9yOiBvdXRwdXRDb250ZXh0LmVycm9yLFxuICAgICAgd3JpdGU6IG91dHB1dENvbnRleHQud3JpdGUsXG4gICAgICBjb21tYW5kOiB0aGlzLFxuICAgIH07XG5cbiAgICB0aGlzLl9nZXRDb21tYW5kQW5kQW5jZXN0b3JzKClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5mb3JFYWNoKChjb21tYW5kKSA9PiBjb21tYW5kLmVtaXQoJ2JlZm9yZUFsbEhlbHAnLCBldmVudENvbnRleHQpKTtcbiAgICB0aGlzLmVtaXQoJ2JlZm9yZUhlbHAnLCBldmVudENvbnRleHQpO1xuXG4gICAgbGV0IGhlbHBJbmZvcm1hdGlvbiA9IHRoaXMuaGVscEluZm9ybWF0aW9uKHsgZXJyb3I6IG91dHB1dENvbnRleHQuZXJyb3IgfSk7XG4gICAgaWYgKGRlcHJlY2F0ZWRDYWxsYmFjaykge1xuICAgICAgaGVscEluZm9ybWF0aW9uID0gZGVwcmVjYXRlZENhbGxiYWNrKGhlbHBJbmZvcm1hdGlvbik7XG4gICAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBoZWxwSW5mb3JtYXRpb24gIT09ICdzdHJpbmcnICYmXG4gICAgICAgICFCdWZmZXIuaXNCdWZmZXIoaGVscEluZm9ybWF0aW9uKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignb3V0cHV0SGVscCBjYWxsYmFjayBtdXN0IHJldHVybiBhIHN0cmluZyBvciBhIEJ1ZmZlcicpO1xuICAgICAgfVxuICAgIH1cbiAgICBvdXRwdXRDb250ZXh0LndyaXRlKGhlbHBJbmZvcm1hdGlvbik7XG5cbiAgICBpZiAodGhpcy5fZ2V0SGVscE9wdGlvbigpPy5sb25nKSB7XG4gICAgICB0aGlzLmVtaXQodGhpcy5fZ2V0SGVscE9wdGlvbigpLmxvbmcpOyAvLyBkZXByZWNhdGVkXG4gICAgfVxuICAgIHRoaXMuZW1pdCgnYWZ0ZXJIZWxwJywgZXZlbnRDb250ZXh0KTtcbiAgICB0aGlzLl9nZXRDb21tYW5kQW5kQW5jZXN0b3JzKCkuZm9yRWFjaCgoY29tbWFuZCkgPT5cbiAgICAgIGNvbW1hbmQuZW1pdCgnYWZ0ZXJBbGxIZWxwJywgZXZlbnRDb250ZXh0KSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFlvdSBjYW4gcGFzcyBpbiBmbGFncyBhbmQgYSBkZXNjcmlwdGlvbiB0byBjdXN0b21pc2UgdGhlIGJ1aWx0LWluIGhlbHAgb3B0aW9uLlxuICAgKiBQYXNzIGluIGZhbHNlIHRvIGRpc2FibGUgdGhlIGJ1aWx0LWluIGhlbHAgb3B0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBwcm9ncmFtLmhlbHBPcHRpb24oJy0/LCAtLWhlbHAnICdzaG93IGhlbHAnKTsgLy8gY3VzdG9taXNlXG4gICAqIHByb2dyYW0uaGVscE9wdGlvbihmYWxzZSk7IC8vIGRpc2FibGVcbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nIHwgYm9vbGVhbil9IGZsYWdzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge0NvbW1hbmR9IGB0aGlzYCBjb21tYW5kIGZvciBjaGFpbmluZ1xuICAgKi9cblxuICBoZWxwT3B0aW9uKGZsYWdzLCBkZXNjcmlwdGlvbikge1xuICAgIC8vIFN1cHBvcnQgZW5hYmxpbmcvZGlzYWJsaW5nIGJ1aWx0LWluIGhlbHAgb3B0aW9uLlxuICAgIGlmICh0eXBlb2YgZmxhZ3MgPT09ICdib29sZWFuJykge1xuICAgICAgaWYgKGZsYWdzKSB7XG4gICAgICAgIGlmICh0aGlzLl9oZWxwT3B0aW9uID09PSBudWxsKSB0aGlzLl9oZWxwT3B0aW9uID0gdW5kZWZpbmVkOyAvLyByZWVuYWJsZVxuICAgICAgICBpZiAodGhpcy5fZGVmYXVsdE9wdGlvbkdyb3VwKSB7XG4gICAgICAgICAgLy8gbWFrZSB0aGUgb3B0aW9uIHRvIHN0b3JlIHRoZSBncm91cFxuICAgICAgICAgIHRoaXMuX2luaXRPcHRpb25Hcm91cCh0aGlzLl9nZXRIZWxwT3B0aW9uKCkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9oZWxwT3B0aW9uID0gbnVsbDsgLy8gZGlzYWJsZVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQ3VzdG9taXNlIGZsYWdzIGFuZCBkZXNjcmlwdGlvbi5cbiAgICB0aGlzLl9oZWxwT3B0aW9uID0gdGhpcy5jcmVhdGVPcHRpb24oXG4gICAgICBmbGFncyA/PyAnLWgsIC0taGVscCcsXG4gICAgICBkZXNjcmlwdGlvbiA/PyAnZGlzcGxheSBoZWxwIGZvciBjb21tYW5kJyxcbiAgICApO1xuICAgIC8vIGluaXQgZ3JvdXAgdW5sZXNzIGxhenkgY3JlYXRlXG4gICAgaWYgKGZsYWdzIHx8IGRlc2NyaXB0aW9uKSB0aGlzLl9pbml0T3B0aW9uR3JvdXAodGhpcy5faGVscE9wdGlvbik7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBMYXp5IGNyZWF0ZSBoZWxwIG9wdGlvbi5cbiAgICogUmV0dXJucyBudWxsIGlmIGhhcyBiZWVuIGRpc2FibGVkIHdpdGggLmhlbHBPcHRpb24oZmFsc2UpLlxuICAgKlxuICAgKiBAcmV0dXJucyB7KE9wdGlvbiB8IG51bGwpfSB0aGUgaGVscCBvcHRpb25cbiAgICogQHBhY2thZ2VcbiAgICovXG4gIF9nZXRIZWxwT3B0aW9uKCkge1xuICAgIC8vIExhenkgY3JlYXRlIGhlbHAgb3B0aW9uIG9uIGRlbWFuZC5cbiAgICBpZiAodGhpcy5faGVscE9wdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLmhlbHBPcHRpb24odW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5faGVscE9wdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdXBwbHkgeW91ciBvd24gb3B0aW9uIHRvIHVzZSBmb3IgdGhlIGJ1aWx0LWluIGhlbHAgb3B0aW9uLlxuICAgKiBUaGlzIGlzIGFuIGFsdGVybmF0aXZlIHRvIHVzaW5nIGhlbHBPcHRpb24oKSB0byBjdXN0b21pc2UgdGhlIGZsYWdzIGFuZCBkZXNjcmlwdGlvbiBldGMuXG4gICAqXG4gICAqIEBwYXJhbSB7T3B0aW9ufSBvcHRpb25cbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuICBhZGRIZWxwT3B0aW9uKG9wdGlvbikge1xuICAgIHRoaXMuX2hlbHBPcHRpb24gPSBvcHRpb247XG4gICAgdGhpcy5faW5pdE9wdGlvbkdyb3VwKG9wdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogT3V0cHV0IGhlbHAgaW5mb3JtYXRpb24gYW5kIGV4aXQuXG4gICAqXG4gICAqIE91dHB1dHMgYnVpbHQtaW4gaGVscCwgYW5kIGN1c3RvbSB0ZXh0IGFkZGVkIHVzaW5nIGAuYWRkSGVscFRleHQoKWAuXG4gICAqXG4gICAqIEBwYXJhbSB7eyBlcnJvcjogYm9vbGVhbiB9fSBbY29udGV4dE9wdGlvbnNdIC0gcGFzcyB7ZXJyb3I6dHJ1ZX0gdG8gd3JpdGUgdG8gc3RkZXJyIGluc3RlYWQgb2Ygc3Rkb3V0XG4gICAqL1xuXG4gIGhlbHAoY29udGV4dE9wdGlvbnMpIHtcbiAgICB0aGlzLm91dHB1dEhlbHAoY29udGV4dE9wdGlvbnMpO1xuICAgIGxldCBleGl0Q29kZSA9IE51bWJlcihwcm9jZXNzLmV4aXRDb2RlID8/IDApOyAvLyBwcm9jZXNzLmV4aXRDb2RlIGRvZXMgYWxsb3cgYSBzdHJpbmcgb3IgYW4gaW50ZWdlciwgYnV0IHdlIHByZWZlciBqdXN0IGEgbnVtYmVyXG4gICAgaWYgKFxuICAgICAgZXhpdENvZGUgPT09IDAgJiZcbiAgICAgIGNvbnRleHRPcHRpb25zICYmXG4gICAgICB0eXBlb2YgY29udGV4dE9wdGlvbnMgIT09ICdmdW5jdGlvbicgJiZcbiAgICAgIGNvbnRleHRPcHRpb25zLmVycm9yXG4gICAgKSB7XG4gICAgICBleGl0Q29kZSA9IDE7XG4gICAgfVxuICAgIC8vIG1lc3NhZ2U6IGRvIG5vdCBoYXZlIGFsbCBkaXNwbGF5ZWQgdGV4dCBhdmFpbGFibGUgc28gb25seSBwYXNzaW5nIHBsYWNlaG9sZGVyLlxuICAgIHRoaXMuX2V4aXQoZXhpdENvZGUsICdjb21tYW5kZXIuaGVscCcsICcob3V0cHV0SGVscCknKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAvLyBEbyBhIGxpdHRsZSB0eXBpbmcgdG8gY29vcmRpbmF0ZSBlbWl0IGFuZCBsaXN0ZW5lciBmb3IgdGhlIGhlbHAgdGV4dCBldmVudHMuXG4gICAqIEB0eXBlZGVmIEhlbHBUZXh0RXZlbnRDb250ZXh0XG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gZXJyb3JcbiAgICogQHByb3BlcnR5IHtDb21tYW5kfSBjb21tYW5kXG4gICAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IHdyaXRlXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBZGQgYWRkaXRpb25hbCB0ZXh0IHRvIGJlIGRpc3BsYXllZCB3aXRoIHRoZSBidWlsdC1pbiBoZWxwLlxuICAgKlxuICAgKiBQb3NpdGlvbiBpcyAnYmVmb3JlJyBvciAnYWZ0ZXInIHRvIGFmZmVjdCBqdXN0IHRoaXMgY29tbWFuZCxcbiAgICogYW5kICdiZWZvcmVBbGwnIG9yICdhZnRlckFsbCcgdG8gYWZmZWN0IHRoaXMgY29tbWFuZCBhbmQgYWxsIGl0cyBzdWJjb21tYW5kcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBvc2l0aW9uIC0gYmVmb3JlIG9yIGFmdGVyIGJ1aWx0LWluIGhlbHBcbiAgICogQHBhcmFtIHsoc3RyaW5nIHwgRnVuY3Rpb24pfSB0ZXh0IC0gc3RyaW5nIHRvIGFkZCwgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBzdHJpbmdcbiAgICogQHJldHVybiB7Q29tbWFuZH0gYHRoaXNgIGNvbW1hbmQgZm9yIGNoYWluaW5nXG4gICAqL1xuXG4gIGFkZEhlbHBUZXh0KHBvc2l0aW9uLCB0ZXh0KSB7XG4gICAgY29uc3QgYWxsb3dlZFZhbHVlcyA9IFsnYmVmb3JlQWxsJywgJ2JlZm9yZScsICdhZnRlcicsICdhZnRlckFsbCddO1xuICAgIGlmICghYWxsb3dlZFZhbHVlcy5pbmNsdWRlcyhwb3NpdGlvbikpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCB2YWx1ZSBmb3IgcG9zaXRpb24gdG8gYWRkSGVscFRleHQuXG5FeHBlY3Rpbmcgb25lIG9mICcke2FsbG93ZWRWYWx1ZXMuam9pbihcIicsICdcIil9J2ApO1xuICAgIH1cblxuICAgIGNvbnN0IGhlbHBFdmVudCA9IGAke3Bvc2l0aW9ufUhlbHBgO1xuICAgIHRoaXMub24oaGVscEV2ZW50LCAoLyoqIEB0eXBlIHtIZWxwVGV4dEV2ZW50Q29udGV4dH0gKi8gY29udGV4dCkgPT4ge1xuICAgICAgbGV0IGhlbHBTdHI7XG4gICAgICBpZiAodHlwZW9mIHRleHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgaGVscFN0ciA9IHRleHQoeyBlcnJvcjogY29udGV4dC5lcnJvciwgY29tbWFuZDogY29udGV4dC5jb21tYW5kIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGVscFN0ciA9IHRleHQ7XG4gICAgICB9XG4gICAgICAvLyBJZ25vcmUgZmFsc3kgdmFsdWUgd2hlbiBub3RoaW5nIHRvIG91dHB1dC5cbiAgICAgIGlmIChoZWxwU3RyKSB7XG4gICAgICAgIGNvbnRleHQud3JpdGUoYCR7aGVscFN0cn1cXG5gKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBPdXRwdXQgaGVscCBpbmZvcm1hdGlvbiBpZiBoZWxwIGZsYWdzIHNwZWNpZmllZFxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5fSBhcmdzIC0gYXJyYXkgb2Ygb3B0aW9ucyB0byBzZWFyY2ggZm9yIGhlbHAgZmxhZ3NcbiAgICogQHByaXZhdGVcbiAgICovXG5cbiAgX291dHB1dEhlbHBJZlJlcXVlc3RlZChhcmdzKSB7XG4gICAgY29uc3QgaGVscE9wdGlvbiA9IHRoaXMuX2dldEhlbHBPcHRpb24oKTtcbiAgICBjb25zdCBoZWxwUmVxdWVzdGVkID0gaGVscE9wdGlvbiAmJiBhcmdzLmZpbmQoKGFyZykgPT4gaGVscE9wdGlvbi5pcyhhcmcpKTtcbiAgICBpZiAoaGVscFJlcXVlc3RlZCkge1xuICAgICAgdGhpcy5vdXRwdXRIZWxwKCk7XG4gICAgICAvLyAoRG8gbm90IGhhdmUgYWxsIGRpc3BsYXllZCB0ZXh0IGF2YWlsYWJsZSBzbyBvbmx5IHBhc3NpbmcgcGxhY2Vob2xkZXIuKVxuICAgICAgdGhpcy5fZXhpdCgwLCAnY29tbWFuZGVyLmhlbHBEaXNwbGF5ZWQnLCAnKG91dHB1dEhlbHApJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2NhbiBhcmd1bWVudHMgYW5kIGluY3JlbWVudCBwb3J0IG51bWJlciBmb3IgaW5zcGVjdCBjYWxscyAodG8gYXZvaWQgY29uZmxpY3RzIHdoZW4gc3Bhd25pbmcgbmV3IGNvbW1hbmQpLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IGFyZ3MgLSBhcnJheSBvZiBhcmd1bWVudHMgZnJvbSBub2RlLmV4ZWNBcmd2XG4gKiBAcmV0dXJucyB7c3RyaW5nW119XG4gKiBAcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIGluY3JlbWVudE5vZGVJbnNwZWN0b3JQb3J0KGFyZ3MpIHtcbiAgLy8gVGVzdGluZyBmb3IgdGhlc2Ugb3B0aW9uczpcbiAgLy8gIC0taW5zcGVjdFs9W2hvc3Q6XXBvcnRdXG4gIC8vICAtLWluc3BlY3QtYnJrWz1baG9zdDpdcG9ydF1cbiAgLy8gIC0taW5zcGVjdC1wb3J0PVtob3N0Ol1wb3J0XG4gIHJldHVybiBhcmdzLm1hcCgoYXJnKSA9PiB7XG4gICAgaWYgKCFhcmcuc3RhcnRzV2l0aCgnLS1pbnNwZWN0JykpIHtcbiAgICAgIHJldHVybiBhcmc7XG4gICAgfVxuICAgIGxldCBkZWJ1Z09wdGlvbjtcbiAgICBsZXQgZGVidWdIb3N0ID0gJzEyNy4wLjAuMSc7XG4gICAgbGV0IGRlYnVnUG9ydCA9ICc5MjI5JztcbiAgICBsZXQgbWF0Y2g7XG4gICAgaWYgKChtYXRjaCA9IGFyZy5tYXRjaCgvXigtLWluc3BlY3QoLWJyayk/KSQvKSkgIT09IG51bGwpIHtcbiAgICAgIC8vIGUuZy4gLS1pbnNwZWN0XG4gICAgICBkZWJ1Z09wdGlvbiA9IG1hdGNoWzFdO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAobWF0Y2ggPSBhcmcubWF0Y2goL14oLS1pbnNwZWN0KC1icmt8LXBvcnQpPyk9KFteOl0rKSQvKSkgIT09IG51bGxcbiAgICApIHtcbiAgICAgIGRlYnVnT3B0aW9uID0gbWF0Y2hbMV07XG4gICAgICBpZiAoL15cXGQrJC8udGVzdChtYXRjaFszXSkpIHtcbiAgICAgICAgLy8gZS5nLiAtLWluc3BlY3Q9MTIzNFxuICAgICAgICBkZWJ1Z1BvcnQgPSBtYXRjaFszXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGUuZy4gLS1pbnNwZWN0PWxvY2FsaG9zdFxuICAgICAgICBkZWJ1Z0hvc3QgPSBtYXRjaFszXTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKFxuICAgICAgKG1hdGNoID0gYXJnLm1hdGNoKC9eKC0taW5zcGVjdCgtYnJrfC1wb3J0KT8pPShbXjpdKyk6KFxcZCspJC8pKSAhPT0gbnVsbFxuICAgICkge1xuICAgICAgLy8gZS5nLiAtLWluc3BlY3Q9bG9jYWxob3N0OjEyMzRcbiAgICAgIGRlYnVnT3B0aW9uID0gbWF0Y2hbMV07XG4gICAgICBkZWJ1Z0hvc3QgPSBtYXRjaFszXTtcbiAgICAgIGRlYnVnUG9ydCA9IG1hdGNoWzRdO1xuICAgIH1cblxuICAgIGlmIChkZWJ1Z09wdGlvbiAmJiBkZWJ1Z1BvcnQgIT09ICcwJykge1xuICAgICAgcmV0dXJuIGAke2RlYnVnT3B0aW9ufT0ke2RlYnVnSG9zdH06JHtwYXJzZUludChkZWJ1Z1BvcnQpICsgMX1gO1xuICAgIH1cbiAgICByZXR1cm4gYXJnO1xuICB9KTtcbn1cblxuLyoqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbiB8IHVuZGVmaW5lZH1cbiAqIEBwYWNrYWdlXG4gKi9cbmZ1bmN0aW9uIHVzZUNvbG9yKCkge1xuICAvLyBUZXN0IGZvciBjb21tb24gY29udmVudGlvbnMuXG4gIC8vIE5COiB0aGUgb2JzZXJ2ZWQgYmVoYXZpb3VyIGlzIGluIGNvbWJpbmF0aW9uIHdpdGggaG93IGF1dGhvciBhZGRzIGNvbG9yISBGb3IgZXhhbXBsZTpcbiAgLy8gICAtIHdlIGRvIG5vdCB0ZXN0IE5PREVfRElTQUJMRV9DT0xPUlMsIGJ1dCB1dGlsOnN0eWxldGV4dCBkb2VzXG4gIC8vICAgLSB3ZSBkbyB0ZXN0IE5PX0NPTE9SLCBidXQgQ2hhbGsgZG9lcyBub3RcbiAgLy9cbiAgLy8gUmVmZXJlbmNlczpcbiAgLy8gaHR0cHM6Ly9uby1jb2xvci5vcmdcbiAgLy8gaHR0cHM6Ly9iaXhlbnNlLmNvbS9jbGljb2xvcnMvXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9ub2RlanMvbm9kZS9ibG9iLzBhMDAyMTdhNWY2N2VmNGEyMjM4NGNmYzgwZWI2ZGQ5YTkxN2ZkYzEvbGliL2ludGVybmFsL3R0eS5qcyNMMTA5XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGFsay9zdXBwb3J0cy1jb2xvci9ibG9iL2MyMTQzMTRhMTRiY2IxNzRiMTJiMzAxNGIyYjBhOGRlMzc1MDI5YWUvaW5kZXguanMjTDMzXG4gIC8vIChodHRwczovL2ZvcmNlLWNvbG9yLm9yZyByZWNlbnQgd2ViIHBhZ2UgZnJvbSAyMDIzLCBkb2VzIG5vdCBtYXRjaCBtYWpvciBqYXZhc2NyaXB0IGltcGxlbWVudGF0aW9ucylcblxuICBpZiAoXG4gICAgcHJvY2Vzcy5lbnYuTk9fQ09MT1IgfHxcbiAgICBwcm9jZXNzLmVudi5GT1JDRV9DT0xPUiA9PT0gJzAnIHx8XG4gICAgcHJvY2Vzcy5lbnYuRk9SQ0VfQ09MT1IgPT09ICdmYWxzZSdcbiAgKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKHByb2Nlc3MuZW52LkZPUkNFX0NPTE9SIHx8IHByb2Nlc3MuZW52LkNMSUNPTE9SX0ZPUkNFICE9PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIHRydWU7XG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydHMuQ29tbWFuZCA9IENvbW1hbmQ7XG5leHBvcnRzLnVzZUNvbG9yID0gdXNlQ29sb3I7IC8vIGV4cG9ydGluZyBmb3IgdGVzdHNcbiIsICJjb25zdCB7IEFyZ3VtZW50IH0gPSByZXF1aXJlKCcuL2xpYi9hcmd1bWVudC5qcycpO1xuY29uc3QgeyBDb21tYW5kIH0gPSByZXF1aXJlKCcuL2xpYi9jb21tYW5kLmpzJyk7XG5jb25zdCB7IENvbW1hbmRlckVycm9yLCBJbnZhbGlkQXJndW1lbnRFcnJvciB9ID0gcmVxdWlyZSgnLi9saWIvZXJyb3IuanMnKTtcbmNvbnN0IHsgSGVscCB9ID0gcmVxdWlyZSgnLi9saWIvaGVscC5qcycpO1xuY29uc3QgeyBPcHRpb24gfSA9IHJlcXVpcmUoJy4vbGliL29wdGlvbi5qcycpO1xuXG5leHBvcnRzLnByb2dyYW0gPSBuZXcgQ29tbWFuZCgpO1xuXG5leHBvcnRzLmNyZWF0ZUNvbW1hbmQgPSAobmFtZSkgPT4gbmV3IENvbW1hbmQobmFtZSk7XG5leHBvcnRzLmNyZWF0ZU9wdGlvbiA9IChmbGFncywgZGVzY3JpcHRpb24pID0+IG5ldyBPcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uKTtcbmV4cG9ydHMuY3JlYXRlQXJndW1lbnQgPSAobmFtZSwgZGVzY3JpcHRpb24pID0+IG5ldyBBcmd1bWVudChuYW1lLCBkZXNjcmlwdGlvbik7XG5cbi8qKlxuICogRXhwb3NlIGNsYXNzZXNcbiAqL1xuXG5leHBvcnRzLkNvbW1hbmQgPSBDb21tYW5kO1xuZXhwb3J0cy5PcHRpb24gPSBPcHRpb247XG5leHBvcnRzLkFyZ3VtZW50ID0gQXJndW1lbnQ7XG5leHBvcnRzLkhlbHAgPSBIZWxwO1xuXG5leHBvcnRzLkNvbW1hbmRlckVycm9yID0gQ29tbWFuZGVyRXJyb3I7XG5leHBvcnRzLkludmFsaWRBcmd1bWVudEVycm9yID0gSW52YWxpZEFyZ3VtZW50RXJyb3I7XG5leHBvcnRzLkludmFsaWRPcHRpb25Bcmd1bWVudEVycm9yID0gSW52YWxpZEFyZ3VtZW50RXJyb3I7IC8vIERlcHJlY2F0ZWRcbiIsICJjb25zdCBjb21tYW5kZXIgPSByZXF1aXJlKCdjb21tYW5kZXInKTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIFJldHVybiBhIGRpZmZlcmVudCBnbG9iYWwgcHJvZ3JhbSB0aGFuIGNvbW1hbmRlcixcbi8vIGFuZCBkb24ndCBhbHNvIHJldHVybiBpdCBhcyBkZWZhdWx0IGV4cG9ydC5cbmV4cG9ydHMucHJvZ3JhbSA9IG5ldyBjb21tYW5kZXIuQ29tbWFuZCgpO1xuXG4vKipcbiAqIEV4cG9zZSBjbGFzc2VzLiBUaGUgRm9vVCB2ZXJzaW9ucyBhcmUganVzdCB0eXBlcywgc28gcmV0dXJuIENvbW1hbmRlciBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbnMhXG4gKi9cblxuZXhwb3J0cy5Bcmd1bWVudCA9IGNvbW1hbmRlci5Bcmd1bWVudDtcbmV4cG9ydHMuQ29tbWFuZCA9IGNvbW1hbmRlci5Db21tYW5kO1xuZXhwb3J0cy5Db21tYW5kZXJFcnJvciA9IGNvbW1hbmRlci5Db21tYW5kZXJFcnJvcjtcbmV4cG9ydHMuSGVscCA9IGNvbW1hbmRlci5IZWxwO1xuZXhwb3J0cy5JbnZhbGlkQXJndW1lbnRFcnJvciA9IGNvbW1hbmRlci5JbnZhbGlkQXJndW1lbnRFcnJvcjtcbmV4cG9ydHMuSW52YWxpZE9wdGlvbkFyZ3VtZW50RXJyb3IgPSBjb21tYW5kZXIuSW52YWxpZEFyZ3VtZW50RXJyb3I7IC8vIERlcHJlY2F0ZWRcbmV4cG9ydHMuT3B0aW9uID0gY29tbWFuZGVyLk9wdGlvbjtcblxuZXhwb3J0cy5jcmVhdGVDb21tYW5kID0gKG5hbWUpID0+IG5ldyBjb21tYW5kZXIuQ29tbWFuZChuYW1lKTtcbmV4cG9ydHMuY3JlYXRlT3B0aW9uID0gKGZsYWdzLCBkZXNjcmlwdGlvbikgPT5cbiAgbmV3IGNvbW1hbmRlci5PcHRpb24oZmxhZ3MsIGRlc2NyaXB0aW9uKTtcbmV4cG9ydHMuY3JlYXRlQXJndW1lbnQgPSAobmFtZSwgZGVzY3JpcHRpb24pID0+XG4gIG5ldyBjb21tYW5kZXIuQXJndW1lbnQobmFtZSwgZGVzY3JpcHRpb24pO1xuIiwgIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBjbGlXaWR0aDtcblxuZnVuY3Rpb24gbm9ybWFsaXplT3B0cyhvcHRpb25zKSB7XG4gIGNvbnN0IGRlZmF1bHRPcHRzID0ge1xuICAgIGRlZmF1bHRXaWR0aDogMCxcbiAgICBvdXRwdXQ6IHByb2Nlc3Muc3Rkb3V0LFxuICAgIHR0eTogcmVxdWlyZSgndHR5JyksXG4gIH07XG5cbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRPcHRzO1xuICB9XG5cbiAgT2JqZWN0LmtleXMoZGVmYXVsdE9wdHMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghb3B0aW9uc1trZXldKSB7XG4gICAgICBvcHRpb25zW2tleV0gPSBkZWZhdWx0T3B0c1trZXldO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGNsaVdpZHRoKG9wdGlvbnMpIHtcbiAgY29uc3Qgb3B0cyA9IG5vcm1hbGl6ZU9wdHMob3B0aW9ucyk7XG5cbiAgaWYgKG9wdHMub3V0cHV0LmdldFdpbmRvd1NpemUpIHtcbiAgICByZXR1cm4gb3B0cy5vdXRwdXQuZ2V0V2luZG93U2l6ZSgpWzBdIHx8IG9wdHMuZGVmYXVsdFdpZHRoO1xuICB9XG5cbiAgaWYgKG9wdHMudHR5LmdldFdpbmRvd1NpemUpIHtcbiAgICByZXR1cm4gb3B0cy50dHkuZ2V0V2luZG93U2l6ZSgpWzFdIHx8IG9wdHMuZGVmYXVsdFdpZHRoO1xuICB9XG5cbiAgaWYgKG9wdHMub3V0cHV0LmNvbHVtbnMpIHtcbiAgICByZXR1cm4gb3B0cy5vdXRwdXQuY29sdW1ucztcbiAgfVxuXG4gIGlmIChwcm9jZXNzLmVudi5DTElfV0lEVEgpIHtcbiAgICBjb25zdCB3aWR0aCA9IHBhcnNlSW50KHByb2Nlc3MuZW52LkNMSV9XSURUSCwgMTApO1xuXG4gICAgaWYgKCFpc05hTih3aWR0aCkgJiYgd2lkdGggIT09IDApIHtcbiAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gb3B0cy5kZWZhdWx0V2lkdGg7XG59XG4iLCAiY29uc3QgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcblxuY2xhc3MgTXV0ZVN0cmVhbSBleHRlbmRzIFN0cmVhbSB7XG4gICNpc1RUWSA9IG51bGxcblxuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9KSB7XG4gICAgc3VwZXIob3B0cylcbiAgICB0aGlzLndyaXRhYmxlID0gdGhpcy5yZWFkYWJsZSA9IHRydWVcbiAgICB0aGlzLm11dGVkID0gZmFsc2VcbiAgICB0aGlzLm9uKCdwaXBlJywgdGhpcy5fb25waXBlKVxuICAgIHRoaXMucmVwbGFjZSA9IG9wdHMucmVwbGFjZVxuXG4gICAgLy8gRm9yIHJlYWRsaW5lLXR5cGUgc2l0dWF0aW9uc1xuICAgIC8vIFRoaXMgbXVjaCBhdCB0aGUgc3RhcnQgb2YgYSBsaW5lIGJlaW5nIHJlZHJhd24gYWZ0ZXIgYSBjdHJsIGNoYXJcbiAgICAvLyBpcyBzZWVuIChzdWNoIGFzIGJhY2tzcGFjZSkgd29uJ3QgYmUgcmVkcmF3biBhcyB0aGUgcmVwbGFjZW1lbnRcbiAgICB0aGlzLl9wcm9tcHQgPSBvcHRzLnByb21wdCB8fCBudWxsXG4gICAgdGhpcy5faGFkQ29udHJvbCA9IGZhbHNlXG4gIH1cblxuICAjZGVzdFNyYyAoa2V5LCBkZWYpIHtcbiAgICBpZiAodGhpcy5fZGVzdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2Rlc3Rba2V5XVxuICAgIH1cbiAgICBpZiAodGhpcy5fc3JjKSB7XG4gICAgICByZXR1cm4gdGhpcy5fc3JjW2tleV1cbiAgICB9XG4gICAgcmV0dXJuIGRlZlxuICB9XG5cbiAgI3Byb3h5IChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuX2Rlc3Q/LlttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9kZXN0W21ldGhvZF0oLi4uYXJncylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLl9zcmM/LlttZXRob2RdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLl9zcmNbbWV0aG9kXSguLi5hcmdzKVxuICAgIH1cbiAgfVxuXG4gIGdldCBpc1RUWSAoKSB7XG4gICAgaWYgKHRoaXMuI2lzVFRZICE9PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy4jaXNUVFlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuI2Rlc3RTcmMoJ2lzVFRZJywgZmFsc2UpXG4gIH1cblxuICAvLyBiYXNpY2FsbHkganVzdCBnZXQgcmVwbGFjZSB0aGUgZ2V0dGVyL3NldHRlciB3aXRoIGEgcmVndWxhciB2YWx1ZVxuICBzZXQgaXNUVFkgKHZhbCkge1xuICAgIHRoaXMuI2lzVFRZID0gdmFsXG4gIH1cblxuICBnZXQgcm93cyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Rlc3RTcmMoJ3Jvd3MnKVxuICB9XG5cbiAgZ2V0IGNvbHVtbnMgKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXN0U3JjKCdjb2x1bW5zJylcbiAgfVxuXG4gIG11dGUgKCkge1xuICAgIHRoaXMubXV0ZWQgPSB0cnVlXG4gIH1cblxuICB1bm11dGUgKCkge1xuICAgIHRoaXMubXV0ZWQgPSBmYWxzZVxuICB9XG5cbiAgX29ucGlwZSAoc3JjKSB7XG4gICAgdGhpcy5fc3JjID0gc3JjXG4gIH1cblxuICBwaXBlIChkZXN0LCBvcHRpb25zKSB7XG4gICAgdGhpcy5fZGVzdCA9IGRlc3RcbiAgICByZXR1cm4gc3VwZXIucGlwZShkZXN0LCBvcHRpb25zKVxuICB9XG5cbiAgcGF1c2UgKCkge1xuICAgIGlmICh0aGlzLl9zcmMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9zcmMucGF1c2UoKVxuICAgIH1cbiAgfVxuXG4gIHJlc3VtZSAoKSB7XG4gICAgaWYgKHRoaXMuX3NyYykge1xuICAgICAgcmV0dXJuIHRoaXMuX3NyYy5yZXN1bWUoKVxuICAgIH1cbiAgfVxuXG4gIHdyaXRlIChjKSB7XG4gICAgaWYgKHRoaXMubXV0ZWQpIHtcbiAgICAgIGlmICghdGhpcy5yZXBsYWNlKSB7XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleFxuICAgICAgaWYgKGMubWF0Y2goL15cXHUwMDFiLykpIHtcbiAgICAgICAgaWYgKGMuaW5kZXhPZih0aGlzLl9wcm9tcHQpID09PSAwKSB7XG4gICAgICAgICAgYyA9IGMuc2xpY2UodGhpcy5fcHJvbXB0Lmxlbmd0aClcbiAgICAgICAgICBjID0gYy5yZXBsYWNlKC8uL2csIHRoaXMucmVwbGFjZSlcbiAgICAgICAgICBjID0gdGhpcy5fcHJvbXB0ICsgY1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2hhZENvbnRyb2wgPSB0cnVlXG4gICAgICAgIHJldHVybiB0aGlzLmVtaXQoJ2RhdGEnLCBjKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuX3Byb21wdCAmJiB0aGlzLl9oYWRDb250cm9sICYmXG4gICAgICAgICAgYy5pbmRleE9mKHRoaXMuX3Byb21wdCkgPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9oYWRDb250cm9sID0gZmFsc2VcbiAgICAgICAgICB0aGlzLmVtaXQoJ2RhdGEnLCB0aGlzLl9wcm9tcHQpXG4gICAgICAgICAgYyA9IGMuc2xpY2UodGhpcy5fcHJvbXB0Lmxlbmd0aClcbiAgICAgICAgfVxuICAgICAgICBjID0gYy50b1N0cmluZygpLnJlcGxhY2UoLy4vZywgdGhpcy5yZXBsYWNlKVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBjKVxuICB9XG5cbiAgZW5kIChjKSB7XG4gICAgaWYgKHRoaXMubXV0ZWQpIHtcbiAgICAgIGlmIChjICYmIHRoaXMucmVwbGFjZSkge1xuICAgICAgICBjID0gYy50b1N0cmluZygpLnJlcGxhY2UoLy4vZywgdGhpcy5yZXBsYWNlKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYyA9IG51bGxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGMpIHtcbiAgICAgIHRoaXMuZW1pdCgnZGF0YScsIGMpXG4gICAgfVxuICAgIHRoaXMuZW1pdCgnZW5kJylcbiAgfVxuXG4gIGRlc3Ryb3kgKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJveHkoJ2Rlc3Ryb3knLCAuLi5hcmdzKVxuICB9XG5cbiAgZGVzdHJveVNvb24gKC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJveHkoJ2Rlc3Ryb3lTb29uJywgLi4uYXJncylcbiAgfVxuXG4gIGNsb3NlICguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb3h5KCdjbG9zZScsIC4uLmFyZ3MpXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBNdXRlU3RyZWFtXG4iLCAiIyEvdXNyL2Jpbi9lbnYgbm9kZSAtLWVuYWJsZS1zb3VyY2UtbWFwc1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcyc7XG5pbXBvcnQgeyBtYWluIH0gZnJvbSAnLi4vc3JjL2NsaS9tYWluLnRzJztcbmlmIChwcm9jZXNzLmFyZ3ZbMV0gPT09ICctJykge1xuICBjb25zb2xlLmxvZyhyZWFkRmlsZVN5bmMoMCwgJ3V0Zi04JykpO1xufSBlbHNlIHtcbiAgYXdhaXQgbWFpbihwcm9jZXNzLmFyZ3Yuc2xpY2UoMikpO1xufVxuIiwgImltcG9ydCBleHRyYVR5cGluZ3NDb21tYW5kZXIgZnJvbSAnLi9pbmRleC5qcyc7XG5cbi8vIHdyYXBwZXIgdG8gcHJvdmlkZSBuYW1lZCBleHBvcnRzIGZvciBFU00uXG5leHBvcnQgY29uc3Qge1xuICBwcm9ncmFtLFxuICBjcmVhdGVDb21tYW5kLFxuICBjcmVhdGVBcmd1bWVudCxcbiAgY3JlYXRlT3B0aW9uLFxuICBDb21tYW5kZXJFcnJvcixcbiAgSW52YWxpZEFyZ3VtZW50RXJyb3IsXG4gIEludmFsaWRPcHRpb25Bcmd1bWVudEVycm9yLCAvLyBkZXByZWNhdGVkIG9sZCBuYW1lXG4gIENvbW1hbmQsXG4gIEFyZ3VtZW50LFxuICBPcHRpb24sXG4gIEhlbHAsXG59ID0gZXh0cmFUeXBpbmdzQ29tbWFuZGVyO1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiQGxpYi9zY2FmZm9sZFwiLFxuICBcInZlcnNpb25cIjogXCIwLjEuMFwiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAY29tbWFuZGVyLWpzL2V4dHJhLXR5cGluZ3NcIjogXCJeMTQuMC4wXCIsXG4gICAgXCJAZXNsaW50L2NvbXBhdFwiOiBcIl4yLjAuMFwiLFxuICAgIFwiQGVzbGludC9qc1wiOiBcIl4xMC4wLjFcIixcbiAgICBcIkBpbnF1aXJlci9wcm9tcHRzXCI6IFwiXjguMy4wXCIsXG4gICAgXCJAbGliL2ZzXCI6IFwid29ya3NwYWNlOl5cIixcbiAgICBcIkBsaWIvcGF0aFwiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAbnBtY2xpL3BhY2thZ2UtanNvblwiOiBcIl43LjAuNVwiLFxuICAgIFwiQHJlcG8vdGVzdFwiOiBcIndvcmtzcGFjZTpeXCIsXG4gICAgXCJAc3R5bGlzdGljL2VzbGludC1wbHVnaW5cIjogXCJeNS44LjBcIixcbiAgICBcIkB0c2NvbmZpZy9ub2RlLXRzXCI6IFwiXjIzLjYuNFwiLFxuICAgIFwiQHRzY29uZmlnL25vZGUyNFwiOiBcIl4yNC4wLjRcIixcbiAgICBcIkB0c2NvbmZpZy9zdHJpY3Rlc3RcIjogXCJeMi4wLjhcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIkB0eXBlcy9ucG1jbGlfX3BhY2thZ2UtanNvblwiOiBcIl40LjAuNFwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L3BhcnNlclwiOiBcIl44LjU1LjBcIixcbiAgICBcImNob2tpZGFyXCI6IFwiXjUuMC4wXCIsXG4gICAgXCJjb21tYW5kZXJcIjogXCJeMTQuMC4zXCIsXG4gICAgXCJlc2J1aWxkXCI6IFwiY2F0YWxvZzpcIixcbiAgICBcImVzbGludFwiOiBcIl4xMC4wLjNcIixcbiAgICBcImVzbGludC1wbHVnaW4taW1wb3J0XCI6IFwiXjIuMzIuMFwiLFxuICAgIFwiZXNsaW50LXBsdWdpbi1zdmVsdGVcIjogXCJeMy4xNS4wXCIsXG4gICAgXCJleGVjYVwiOiBcIl45LjYuMVwiLFxuICAgIFwiZmluZC11cFwiOiBcIl44LjAuMFwiLFxuICAgIFwiZ2xvYmFsc1wiOiBcIl4xNy4zLjBcIixcbiAgICBcIm94Zm10XCI6IFwiY2F0YWxvZzpcIixcbiAgICBcIm94bGludFwiOiBcImNhdGFsb2c6XCIsXG4gICAgXCJveGxpbnQtdHNnb2xpbnRcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwic3ZlbHRlLWVzbGludC1wYXJzZXJcIjogXCJeMS40LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJjYXRhbG9nOlwiLFxuICAgIFwidHlwZXNjcmlwdC1lc2xpbnRcIjogXCJeOC41NS4wXCIsXG4gICAgXCJ2aXRlXCI6IFwiY2F0YWxvZzpcIlxuICB9LFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLi9lc2xpbnRcIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vc3JjL3BhY2thZ2VzL2VzbGludC9jb25maWctYmFzZS50c1wiLFxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9zcmMvcGFja2FnZXMvZXNsaW50L2NvbmZpZy1iYXNlLnRzXCJcbiAgICB9LFxuICAgIFwiLi9lc2xpbnQvc3ZlbHRlXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL3NyYy9wYWNrYWdlcy9lc2xpbnQvY29uZmlnLXN2ZWx0ZS50c1wiLFxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9zcmMvcGFja2FnZXMvZXNsaW50L2NvbmZpZy1zdmVsdGUudHNcIlxuICAgIH0sXG4gICAgXCIuL294Zm10LypcIjoge1xuICAgICAgXCJ0eXBlc1wiOiBcIi4vc3JjL3BhY2thZ2VzL294Zm10LyoudHNcIixcbiAgICAgIFwiZGVmYXVsdFwiOiBcIi4vc3JjL3BhY2thZ2VzL294Zm10LyoudHNcIlxuICAgIH0sXG4gICAgXCIuL294bGludC8qXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL3NyYy9wYWNrYWdlcy9veGxpbnQvKi50c1wiLFxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9zcmMvcGFja2FnZXMvb3hsaW50LyoudHNcIlxuICAgIH0sXG4gICAgXCIuL3RzY29uZmlnXCI6IHtcbiAgICAgIFwiZGVmYXVsdFwiOiBcIi4vc3JjL3BhY2thZ2VzL3R5cGVzY3JpcHQvdHNjb25maWctYmFzZS5qc29uXCJcbiAgICB9XG4gIH0sXG4gIFwibGljZW5zZVwiOiBcIk1JVFwiLFxuICBcInByaXZhdGVcIjogdHJ1ZSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkLWJpblwiOiBcImJ1biBiaW4vYnVpbGQudHNcIixcbiAgICBcImNoZWNrLXR5cGVzXCI6IFwidHNjIC0tbm9FbWl0XCIsXG4gICAgXCJsaW50XCI6IFwib3hsaW50XCJcbiAgfSxcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCJcbn1cbiIsICJleHBvcnQgY29uc3QgaXNVcEtleSA9IChrZXksIGtleWJpbmRpbmdzID0gW10pID0+IFxuLy8gVGhlIHVwIGtleVxua2V5Lm5hbWUgPT09ICd1cCcgfHxcbiAgICAvLyBWaW0ga2V5YmluZGluZzogaGprbCBrZXlzIG1hcCB0byBsZWZ0L2Rvd24vdXAvcmlnaHRcbiAgICAoa2V5YmluZGluZ3MuaW5jbHVkZXMoJ3ZpbScpICYmIGtleS5uYW1lID09PSAnaycpIHx8XG4gICAgLy8gRW1hY3Mga2V5YmluZGluZzogQ3RybCtQIG1lYW5zIFwicHJldmlvdXNcIiBpbiBFbWFjcyBuYXZpZ2F0aW9uIGNvbnZlbnRpb25zXG4gICAgKGtleWJpbmRpbmdzLmluY2x1ZGVzKCdlbWFjcycpICYmIGtleS5jdHJsICYmIGtleS5uYW1lID09PSAncCcpO1xuZXhwb3J0IGNvbnN0IGlzRG93bktleSA9IChrZXksIGtleWJpbmRpbmdzID0gW10pID0+IFxuLy8gVGhlIGRvd24ga2V5XG5rZXkubmFtZSA9PT0gJ2Rvd24nIHx8XG4gICAgLy8gVmltIGtleWJpbmRpbmc6IGhqa2wga2V5cyBtYXAgdG8gbGVmdC9kb3duL3VwL3JpZ2h0XG4gICAgKGtleWJpbmRpbmdzLmluY2x1ZGVzKCd2aW0nKSAmJiBrZXkubmFtZSA9PT0gJ2onKSB8fFxuICAgIC8vIEVtYWNzIGtleWJpbmRpbmc6IEN0cmwrTiBtZWFucyBcIm5leHRcIiBpbiBFbWFjcyBuYXZpZ2F0aW9uIGNvbnZlbnRpb25zXG4gICAgKGtleWJpbmRpbmdzLmluY2x1ZGVzKCdlbWFjcycpICYmIGtleS5jdHJsICYmIGtleS5uYW1lID09PSAnbicpO1xuZXhwb3J0IGNvbnN0IGlzU3BhY2VLZXkgPSAoa2V5KSA9PiBrZXkubmFtZSA9PT0gJ3NwYWNlJztcbmV4cG9ydCBjb25zdCBpc0JhY2tzcGFjZUtleSA9IChrZXkpID0+IGtleS5uYW1lID09PSAnYmFja3NwYWNlJztcbmV4cG9ydCBjb25zdCBpc1RhYktleSA9IChrZXkpID0+IGtleS5uYW1lID09PSAndGFiJztcbmV4cG9ydCBjb25zdCBpc051bWJlcktleSA9IChrZXkpID0+ICcxMjM0NTY3ODkwJy5pbmNsdWRlcyhrZXkubmFtZSk7XG5leHBvcnQgY29uc3QgaXNFbnRlcktleSA9IChrZXkpID0+IGtleS5uYW1lID09PSAnZW50ZXInIHx8IGtleS5uYW1lID09PSAncmV0dXJuJztcbmV4cG9ydCBjb25zdCBpc1NoaWZ0S2V5ID0gKGtleSkgPT4ga2V5LnNoaWZ0O1xuIiwgImV4cG9ydCBjbGFzcyBBYm9ydFByb21wdEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIG5hbWUgPSAnQWJvcnRQcm9tcHRFcnJvcic7XG4gICAgbWVzc2FnZSA9ICdQcm9tcHQgd2FzIGFib3J0ZWQnO1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5jYXVzZSA9IG9wdGlvbnM/LmNhdXNlO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBDYW5jZWxQcm9tcHRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBuYW1lID0gJ0NhbmNlbFByb21wdEVycm9yJztcbiAgICBtZXNzYWdlID0gJ1Byb21wdCB3YXMgY2FuY2VsZWQnO1xufVxuZXhwb3J0IGNsYXNzIEV4aXRQcm9tcHRFcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBuYW1lID0gJ0V4aXRQcm9tcHRFcnJvcic7XG59XG5leHBvcnQgY2xhc3MgSG9va0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIG5hbWUgPSAnSG9va0Vycm9yJztcbn1cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gICAgbmFtZSA9ICdWYWxpZGF0aW9uRXJyb3InO1xufVxuIiwgImltcG9ydCB7IEFzeW5jUmVzb3VyY2UgfSBmcm9tICdub2RlOmFzeW5jX2hvb2tzJztcbmltcG9ydCB7IHdpdGhQb2ludGVyLCBoYW5kbGVDaGFuZ2UgfSBmcm9tIFwiLi9ob29rLWVuZ2luZS5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVN0YXRlKGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiB3aXRoUG9pbnRlcigocG9pbnRlcikgPT4ge1xuICAgICAgICBjb25zdCBzZXRTdGF0ZSA9IEFzeW5jUmVzb3VyY2UuYmluZChmdW5jdGlvbiBzZXRTdGF0ZShuZXdWYWx1ZSkge1xuICAgICAgICAgICAgLy8gTm9vcCBpZiB0aGUgdmFsdWUgaXMgc3RpbGwgdGhlIHNhbWUuXG4gICAgICAgICAgICBpZiAocG9pbnRlci5nZXQoKSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwb2ludGVyLnNldChuZXdWYWx1ZSk7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciByZS1yZW5kZXJcbiAgICAgICAgICAgICAgICBoYW5kbGVDaGFuZ2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChwb2ludGVyLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICByZXR1cm4gW3BvaW50ZXIuZ2V0KCksIHNldFN0YXRlXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZSA9IHR5cGVvZiBkZWZhdWx0VmFsdWUgPT09ICdmdW5jdGlvbicgPyBkZWZhdWx0VmFsdWUoKSA6IGRlZmF1bHRWYWx1ZTtcbiAgICAgICAgcG9pbnRlci5zZXQodmFsdWUpO1xuICAgICAgICByZXR1cm4gW3ZhbHVlLCBzZXRTdGF0ZV07XG4gICAgfSk7XG59XG4iLCAiLyogZXNsaW50IEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnk6IFtcIm9mZlwiXSAqL1xuaW1wb3J0IHsgQXN5bmNMb2NhbFN0b3JhZ2UsIEFzeW5jUmVzb3VyY2UgfSBmcm9tICdub2RlOmFzeW5jX2hvb2tzJztcbmltcG9ydCB7IEhvb2tFcnJvciwgVmFsaWRhdGlvbkVycm9yIH0gZnJvbSBcIi4vZXJyb3JzLmpzXCI7XG5jb25zdCBob29rU3RvcmFnZSA9IG5ldyBBc3luY0xvY2FsU3RvcmFnZSgpO1xuZnVuY3Rpb24gY3JlYXRlU3RvcmUocmwpIHtcbiAgICBjb25zdCBzdG9yZSA9IHtcbiAgICAgICAgcmwsXG4gICAgICAgIGhvb2tzOiBbXSxcbiAgICAgICAgaG9va3NDbGVhbnVwOiBbXSxcbiAgICAgICAgaG9va3NFZmZlY3Q6IFtdLFxuICAgICAgICBpbmRleDogMCxcbiAgICAgICAgaGFuZGxlQ2hhbmdlKCkgeyB9LFxuICAgIH07XG4gICAgcmV0dXJuIHN0b3JlO1xufVxuLy8gUnVuIGNhbGxiYWNrIGluIHdpdGggdGhlIGhvb2sgZW5naW5lIHNldHVwLlxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhIb29rcyhybCwgY2IpIHtcbiAgICBjb25zdCBzdG9yZSA9IGNyZWF0ZVN0b3JlKHJsKTtcbiAgICByZXR1cm4gaG9va1N0b3JhZ2UucnVuKHN0b3JlLCAoKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIGN5Y2xlKHJlbmRlcikge1xuICAgICAgICAgICAgc3RvcmUuaGFuZGxlQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3JlLmluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdG9yZS5oYW5kbGVDaGFuZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2IoY3ljbGUpO1xuICAgIH0pO1xufVxuLy8gU2FmZSBnZXRTdG9yZSB1dGlsaXR5IHRoYXQnbGwgcmV0dXJuIHRoZSBzdG9yZSBvciB0aHJvdyBpZiB1bmRlZmluZWQuXG5mdW5jdGlvbiBnZXRTdG9yZSgpIHtcbiAgICBjb25zdCBzdG9yZSA9IGhvb2tTdG9yYWdlLmdldFN0b3JlKCk7XG4gICAgaWYgKCFzdG9yZSkge1xuICAgICAgICB0aHJvdyBuZXcgSG9va0Vycm9yKCdbSW5xdWlyZXJdIEhvb2sgZnVuY3Rpb25zIGNhbiBvbmx5IGJlIGNhbGxlZCBmcm9tIHdpdGhpbiBhIHByb21wdCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RvcmU7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVhZGxpbmUoKSB7XG4gICAgcmV0dXJuIGdldFN0b3JlKCkucmw7XG59XG4vLyBNZXJnZSBzdGF0ZSB1cGRhdGVzIGhhcHBlbmluZyB3aXRoaW4gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGF2b2lkIG11bHRpcGxlIHJlbmRlcnMuXG5leHBvcnQgZnVuY3Rpb24gd2l0aFVwZGF0ZXMoZm4pIHtcbiAgICBjb25zdCB3cmFwcGVkID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZSgpO1xuICAgICAgICBsZXQgc2hvdWxkVXBkYXRlID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IG9sZEhhbmRsZUNoYW5nZSA9IHN0b3JlLmhhbmRsZUNoYW5nZTtcbiAgICAgICAgc3RvcmUuaGFuZGxlQ2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgc2hvdWxkVXBkYXRlID0gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmV0dXJuVmFsdWUgPSBmbiguLi5hcmdzKTtcbiAgICAgICAgaWYgKHNob3VsZFVwZGF0ZSkge1xuICAgICAgICAgICAgb2xkSGFuZGxlQ2hhbmdlKCk7XG4gICAgICAgIH1cbiAgICAgICAgc3RvcmUuaGFuZGxlQ2hhbmdlID0gb2xkSGFuZGxlQ2hhbmdlO1xuICAgICAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gICAgfTtcbiAgICByZXR1cm4gQXN5bmNSZXNvdXJjZS5iaW5kKHdyYXBwZWQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHdpdGhQb2ludGVyKGNiKSB7XG4gICAgY29uc3Qgc3RvcmUgPSBnZXRTdG9yZSgpO1xuICAgIGNvbnN0IHsgaW5kZXggfSA9IHN0b3JlO1xuICAgIGNvbnN0IHBvaW50ZXIgPSB7XG4gICAgICAgIGdldCgpIHtcbiAgICAgICAgICAgIHJldHVybiBzdG9yZS5ob29rc1tpbmRleF07XG4gICAgICAgIH0sXG4gICAgICAgIHNldCh2YWx1ZSkge1xuICAgICAgICAgICAgc3RvcmUuaG9va3NbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIGluaXRpYWxpemVkOiBpbmRleCBpbiBzdG9yZS5ob29rcyxcbiAgICB9O1xuICAgIGNvbnN0IHJldHVyblZhbHVlID0gY2IocG9pbnRlcik7XG4gICAgc3RvcmUuaW5kZXgrKztcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG59XG5leHBvcnQgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKCkge1xuICAgIGdldFN0b3JlKCkuaGFuZGxlQ2hhbmdlKCk7XG59XG5leHBvcnQgY29uc3QgZWZmZWN0U2NoZWR1bGVyID0ge1xuICAgIHF1ZXVlKGNiKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gZ2V0U3RvcmUoKTtcbiAgICAgICAgY29uc3QgeyBpbmRleCB9ID0gc3RvcmU7XG4gICAgICAgIHN0b3JlLmhvb2tzRWZmZWN0LnB1c2goKCkgPT4ge1xuICAgICAgICAgICAgc3RvcmUuaG9va3NDbGVhbnVwW2luZGV4XT8uKCk7XG4gICAgICAgICAgICBjb25zdCBjbGVhbkZuID0gY2IocmVhZGxpbmUoKSk7XG4gICAgICAgICAgICBpZiAoY2xlYW5GbiAhPSBudWxsICYmIHR5cGVvZiBjbGVhbkZuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcigndXNlRWZmZWN0IHJldHVybiB2YWx1ZSBtdXN0IGJlIGEgY2xlYW51cCBmdW5jdGlvbiBvciBub3RoaW5nLicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RvcmUuaG9va3NDbGVhbnVwW2luZGV4XSA9IGNsZWFuRm47XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgcnVuKCkge1xuICAgICAgICBjb25zdCBzdG9yZSA9IGdldFN0b3JlKCk7XG4gICAgICAgIHdpdGhVcGRhdGVzKCgpID0+IHtcbiAgICAgICAgICAgIHN0b3JlLmhvb2tzRWZmZWN0LmZvckVhY2goKGVmZmVjdCkgPT4ge1xuICAgICAgICAgICAgICAgIGVmZmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBXYXJuaW5nOiBDbGVhbiB0aGUgaG9va3MgYmVmb3JlIGV4aXRpbmcgdGhlIGB3aXRoVXBkYXRlc2AgYmxvY2suXG4gICAgICAgICAgICAvLyBGYWlsdXJlIHRvIGRvIHNvIG1lYW5zIGFuIHVwZGF0ZXMgd291bGQgaGl0IHRoZSBzYW1lIGVmZmVjdHMgYWdhaW4uXG4gICAgICAgICAgICBzdG9yZS5ob29rc0VmZmVjdC5sZW5ndGggPSAwO1xuICAgICAgICB9KSgpO1xuICAgIH0sXG4gICAgY2xlYXJBbGwoKSB7XG4gICAgICAgIGNvbnN0IHN0b3JlID0gZ2V0U3RvcmUoKTtcbiAgICAgICAgc3RvcmUuaG9va3NDbGVhbnVwLmZvckVhY2goKGNsZWFuRm4pID0+IHtcbiAgICAgICAgICAgIGNsZWFuRm4/LigpO1xuICAgICAgICB9KTtcbiAgICAgICAgc3RvcmUuaG9va3NFZmZlY3QubGVuZ3RoID0gMDtcbiAgICAgICAgc3RvcmUuaG9va3NDbGVhbnVwLmxlbmd0aCA9IDA7XG4gICAgfSxcbn07XG4iLCAiaW1wb3J0IHsgd2l0aFBvaW50ZXIsIGVmZmVjdFNjaGVkdWxlciB9IGZyb20gXCIuL2hvb2stZW5naW5lLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gdXNlRWZmZWN0KGNiLCBkZXBBcnJheSkge1xuICAgIHdpdGhQb2ludGVyKChwb2ludGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IG9sZERlcHMgPSBwb2ludGVyLmdldCgpO1xuICAgICAgICBjb25zdCBoYXNDaGFuZ2VkID0gIUFycmF5LmlzQXJyYXkob2xkRGVwcykgfHwgZGVwQXJyYXkuc29tZSgoZGVwLCBpKSA9PiAhT2JqZWN0LmlzKGRlcCwgb2xkRGVwc1tpXSkpO1xuICAgICAgICBpZiAoaGFzQ2hhbmdlZCkge1xuICAgICAgICAgICAgZWZmZWN0U2NoZWR1bGVyLnF1ZXVlKGNiKTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludGVyLnNldChkZXBBcnJheSk7XG4gICAgfSk7XG59XG4iLCAiaW1wb3J0IHsgc3R5bGVUZXh0IH0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBmaWd1cmVzIGZyb20gJ0BpbnF1aXJlci9maWd1cmVzJztcbmV4cG9ydCBjb25zdCBkZWZhdWx0VGhlbWUgPSB7XG4gICAgcHJlZml4OiB7XG4gICAgICAgIGlkbGU6IHN0eWxlVGV4dCgnYmx1ZScsICc/JyksXG4gICAgICAgIGRvbmU6IHN0eWxlVGV4dCgnZ3JlZW4nLCBmaWd1cmVzLnRpY2spLFxuICAgIH0sXG4gICAgc3Bpbm5lcjoge1xuICAgICAgICBpbnRlcnZhbDogODAsXG4gICAgICAgIGZyYW1lczogWydcdTI4MEInLCAnXHUyODE5JywgJ1x1MjgzOScsICdcdTI4MzgnLCAnXHUyODNDJywgJ1x1MjgzNCcsICdcdTI4MjYnLCAnXHUyODI3JywgJ1x1MjgwNycsICdcdTI4MEYnXS5tYXAoKGZyYW1lKSA9PiBzdHlsZVRleHQoJ3llbGxvdycsIGZyYW1lKSksXG4gICAgfSxcbiAgICBzdHlsZToge1xuICAgICAgICBhbnN3ZXI6ICh0ZXh0KSA9PiBzdHlsZVRleHQoJ2N5YW4nLCB0ZXh0KSxcbiAgICAgICAgbWVzc2FnZTogKHRleHQpID0+IHN0eWxlVGV4dCgnYm9sZCcsIHRleHQpLFxuICAgICAgICBlcnJvcjogKHRleHQpID0+IHN0eWxlVGV4dCgncmVkJywgYD4gJHt0ZXh0fWApLFxuICAgICAgICBkZWZhdWx0QW5zd2VyOiAodGV4dCkgPT4gc3R5bGVUZXh0KCdkaW0nLCBgKCR7dGV4dH0pYCksXG4gICAgICAgIGhlbHA6ICh0ZXh0KSA9PiBzdHlsZVRleHQoJ2RpbScsIHRleHQpLFxuICAgICAgICBoaWdobGlnaHQ6ICh0ZXh0KSA9PiBzdHlsZVRleHQoJ2N5YW4nLCB0ZXh0KSxcbiAgICAgICAga2V5OiAodGV4dCkgPT4gc3R5bGVUZXh0KCdjeWFuJywgc3R5bGVUZXh0KCdib2xkJywgYDwke3RleHR9PmApKSxcbiAgICB9LFxufTtcbiIsICIvLyBwcm9jZXNzLmVudiBkb3Qtbm90YXRpb24gYWNjZXNzIHByaW50czpcbi8vIFByb3BlcnR5ICdURVJNJyBjb21lcyBmcm9tIGFuIGluZGV4IHNpZ25hdHVyZSwgc28gaXQgbXVzdCBiZSBhY2Nlc3NlZCB3aXRoIFsnVEVSTSddLnRzKDQxMTEpXG4vKiBlc2xpbnQgZG90LW5vdGF0aW9uOiBbXCJvZmZcIl0gKi9cbmltcG9ydCBwcm9jZXNzIGZyb20gJ25vZGU6cHJvY2Vzcyc7XG4vLyBQb3J0ZWQgZnJvbSBpcy11bmljb2RlLXN1cHBvcnRlZFxuZnVuY3Rpb24gaXNVbmljb2RlU3VwcG9ydGVkKCkge1xuICAgIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzLmVudlsnVEVSTSddICE9PSAnbGludXgnOyAvLyBMaW51eCBjb25zb2xlIChrZXJuZWwpXG4gICAgfVxuICAgIHJldHVybiAoQm9vbGVhbihwcm9jZXNzLmVudlsnV1RfU0VTU0lPTiddKSB8fCAvLyBXaW5kb3dzIFRlcm1pbmFsXG4gICAgICAgIEJvb2xlYW4ocHJvY2Vzcy5lbnZbJ1RFUk1JTlVTX1NVQkxJTUUnXSkgfHwgLy8gVGVybWludXMgKDwwLjIuMjcpXG4gICAgICAgIHByb2Nlc3MuZW52WydDb25FbXVUYXNrJ10gPT09ICd7Y21kOjpDbWRlcn0nIHx8IC8vIENvbkVtdSBhbmQgY21kZXJcbiAgICAgICAgcHJvY2Vzcy5lbnZbJ1RFUk1fUFJPR1JBTSddID09PSAnVGVybWludXMtU3VibGltZScgfHxcbiAgICAgICAgcHJvY2Vzcy5lbnZbJ1RFUk1fUFJPR1JBTSddID09PSAndnNjb2RlJyB8fFxuICAgICAgICBwcm9jZXNzLmVudlsnVEVSTSddID09PSAneHRlcm0tMjU2Y29sb3InIHx8XG4gICAgICAgIHByb2Nlc3MuZW52WydURVJNJ10gPT09ICdhbGFjcml0dHknIHx8XG4gICAgICAgIHByb2Nlc3MuZW52WydURVJNSU5BTF9FTVVMQVRPUiddID09PSAnSmV0QnJhaW5zLUplZGlUZXJtJyk7XG59XG4vLyBQb3J0ZWQgZnJvbSBmaWd1cmVzXG5jb25zdCBjb21tb24gPSB7XG4gICAgY2lyY2xlUXVlc3Rpb25NYXJrOiAnKD8pJyxcbiAgICBxdWVzdGlvbk1hcmtQcmVmaXg6ICcoPyknLFxuICAgIHNxdWFyZTogJ1x1MjU4OCcsXG4gICAgc3F1YXJlRGFya1NoYWRlOiAnXHUyNTkzJyxcbiAgICBzcXVhcmVNZWRpdW1TaGFkZTogJ1x1MjU5MicsXG4gICAgc3F1YXJlTGlnaHRTaGFkZTogJ1x1MjU5MScsXG4gICAgc3F1YXJlVG9wOiAnXHUyNTgwJyxcbiAgICBzcXVhcmVCb3R0b206ICdcdTI1ODQnLFxuICAgIHNxdWFyZUxlZnQ6ICdcdTI1OEMnLFxuICAgIHNxdWFyZVJpZ2h0OiAnXHUyNTkwJyxcbiAgICBzcXVhcmVDZW50ZXI6ICdcdTI1QTAnLFxuICAgIGJ1bGxldDogJ1x1MjVDRicsXG4gICAgZG90OiAnXHUyMDI0JyxcbiAgICBlbGxpcHNpczogJ1x1MjAyNicsXG4gICAgcG9pbnRlclNtYWxsOiAnXHUyMDNBJyxcbiAgICB0cmlhbmdsZVVwOiAnXHUyNUIyJyxcbiAgICB0cmlhbmdsZVVwU21hbGw6ICdcdTI1QjQnLFxuICAgIHRyaWFuZ2xlRG93bjogJ1x1MjVCQycsXG4gICAgdHJpYW5nbGVEb3duU21hbGw6ICdcdTI1QkUnLFxuICAgIHRyaWFuZ2xlTGVmdFNtYWxsOiAnXHUyNUMyJyxcbiAgICB0cmlhbmdsZVJpZ2h0U21hbGw6ICdcdTI1QjgnLFxuICAgIGhvbWU6ICdcdTIzMDInLFxuICAgIGhlYXJ0OiAnXHUyNjY1JyxcbiAgICBtdXNpY05vdGU6ICdcdTI2NkEnLFxuICAgIG11c2ljTm90ZUJlYW1lZDogJ1x1MjY2QicsXG4gICAgYXJyb3dVcDogJ1x1MjE5MScsXG4gICAgYXJyb3dEb3duOiAnXHUyMTkzJyxcbiAgICBhcnJvd0xlZnQ6ICdcdTIxOTAnLFxuICAgIGFycm93UmlnaHQ6ICdcdTIxOTInLFxuICAgIGFycm93TGVmdFJpZ2h0OiAnXHUyMTk0JyxcbiAgICBhcnJvd1VwRG93bjogJ1x1MjE5NScsXG4gICAgYWxtb3N0RXF1YWw6ICdcdTIyNDgnLFxuICAgIG5vdEVxdWFsOiAnXHUyMjYwJyxcbiAgICBsZXNzT3JFcXVhbDogJ1x1MjI2NCcsXG4gICAgZ3JlYXRlck9yRXF1YWw6ICdcdTIyNjUnLFxuICAgIGlkZW50aWNhbDogJ1x1MjI2MScsXG4gICAgaW5maW5pdHk6ICdcdTIyMUUnLFxuICAgIHN1YnNjcmlwdFplcm86ICdcdTIwODAnLFxuICAgIHN1YnNjcmlwdE9uZTogJ1x1MjA4MScsXG4gICAgc3Vic2NyaXB0VHdvOiAnXHUyMDgyJyxcbiAgICBzdWJzY3JpcHRUaHJlZTogJ1x1MjA4MycsXG4gICAgc3Vic2NyaXB0Rm91cjogJ1x1MjA4NCcsXG4gICAgc3Vic2NyaXB0Rml2ZTogJ1x1MjA4NScsXG4gICAgc3Vic2NyaXB0U2l4OiAnXHUyMDg2JyxcbiAgICBzdWJzY3JpcHRTZXZlbjogJ1x1MjA4NycsXG4gICAgc3Vic2NyaXB0RWlnaHQ6ICdcdTIwODgnLFxuICAgIHN1YnNjcmlwdE5pbmU6ICdcdTIwODknLFxuICAgIG9uZUhhbGY6ICdcdTAwQkQnLFxuICAgIG9uZVRoaXJkOiAnXHUyMTUzJyxcbiAgICBvbmVRdWFydGVyOiAnXHUwMEJDJyxcbiAgICBvbmVGaWZ0aDogJ1x1MjE1NScsXG4gICAgb25lU2l4dGg6ICdcdTIxNTknLFxuICAgIG9uZUVpZ2h0aDogJ1x1MjE1QicsXG4gICAgdHdvVGhpcmRzOiAnXHUyMTU0JyxcbiAgICB0d29GaWZ0aHM6ICdcdTIxNTYnLFxuICAgIHRocmVlUXVhcnRlcnM6ICdcdTAwQkUnLFxuICAgIHRocmVlRmlmdGhzOiAnXHUyMTU3JyxcbiAgICB0aHJlZUVpZ2h0aHM6ICdcdTIxNUMnLFxuICAgIGZvdXJGaWZ0aHM6ICdcdTIxNTgnLFxuICAgIGZpdmVTaXh0aHM6ICdcdTIxNUEnLFxuICAgIGZpdmVFaWdodGhzOiAnXHUyMTVEJyxcbiAgICBzZXZlbkVpZ2h0aHM6ICdcdTIxNUUnLFxuICAgIGxpbmU6ICdcdTI1MDAnLFxuICAgIGxpbmVCb2xkOiAnXHUyNTAxJyxcbiAgICBsaW5lRG91YmxlOiAnXHUyNTUwJyxcbiAgICBsaW5lRGFzaGVkMDogJ1x1MjUwNCcsXG4gICAgbGluZURhc2hlZDE6ICdcdTI1MDUnLFxuICAgIGxpbmVEYXNoZWQyOiAnXHUyNTA4JyxcbiAgICBsaW5lRGFzaGVkMzogJ1x1MjUwOScsXG4gICAgbGluZURhc2hlZDQ6ICdcdTI1NEMnLFxuICAgIGxpbmVEYXNoZWQ1OiAnXHUyNTREJyxcbiAgICBsaW5lRGFzaGVkNjogJ1x1MjU3NCcsXG4gICAgbGluZURhc2hlZDc6ICdcdTI1NzYnLFxuICAgIGxpbmVEYXNoZWQ4OiAnXHUyNTc4JyxcbiAgICBsaW5lRGFzaGVkOTogJ1x1MjU3QScsXG4gICAgbGluZURhc2hlZDEwOiAnXHUyNTdDJyxcbiAgICBsaW5lRGFzaGVkMTE6ICdcdTI1N0UnLFxuICAgIGxpbmVEYXNoZWQxMjogJ1x1MjIxMicsXG4gICAgbGluZURhc2hlZDEzOiAnXHUyMDEzJyxcbiAgICBsaW5lRGFzaGVkMTQ6ICdcdTIwMTAnLFxuICAgIGxpbmVEYXNoZWQxNTogJ1x1MjA0MycsXG4gICAgbGluZVZlcnRpY2FsOiAnXHUyNTAyJyxcbiAgICBsaW5lVmVydGljYWxCb2xkOiAnXHUyNTAzJyxcbiAgICBsaW5lVmVydGljYWxEb3VibGU6ICdcdTI1NTEnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDA6ICdcdTI1MDYnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDE6ICdcdTI1MDcnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDI6ICdcdTI1MEEnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDM6ICdcdTI1MEInLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDQ6ICdcdTI1NEUnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDU6ICdcdTI1NEYnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDY6ICdcdTI1NzUnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDc6ICdcdTI1NzcnLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDg6ICdcdTI1NzknLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDk6ICdcdTI1N0InLFxuICAgIGxpbmVWZXJ0aWNhbERhc2hlZDEwOiAnXHUyNTdEJyxcbiAgICBsaW5lVmVydGljYWxEYXNoZWQxMTogJ1x1MjU3RicsXG4gICAgbGluZURvd25MZWZ0OiAnXHUyNTEwJyxcbiAgICBsaW5lRG93bkxlZnRBcmM6ICdcdTI1NkUnLFxuICAgIGxpbmVEb3duQm9sZExlZnRCb2xkOiAnXHUyNTEzJyxcbiAgICBsaW5lRG93bkJvbGRMZWZ0OiAnXHUyNTEyJyxcbiAgICBsaW5lRG93bkxlZnRCb2xkOiAnXHUyNTExJyxcbiAgICBsaW5lRG93bkRvdWJsZUxlZnREb3VibGU6ICdcdTI1NTcnLFxuICAgIGxpbmVEb3duRG91YmxlTGVmdDogJ1x1MjU1NicsXG4gICAgbGluZURvd25MZWZ0RG91YmxlOiAnXHUyNTU1JyxcbiAgICBsaW5lRG93blJpZ2h0OiAnXHUyNTBDJyxcbiAgICBsaW5lRG93blJpZ2h0QXJjOiAnXHUyNTZEJyxcbiAgICBsaW5lRG93bkJvbGRSaWdodEJvbGQ6ICdcdTI1MEYnLFxuICAgIGxpbmVEb3duQm9sZFJpZ2h0OiAnXHUyNTBFJyxcbiAgICBsaW5lRG93blJpZ2h0Qm9sZDogJ1x1MjUwRCcsXG4gICAgbGluZURvd25Eb3VibGVSaWdodERvdWJsZTogJ1x1MjU1NCcsXG4gICAgbGluZURvd25Eb3VibGVSaWdodDogJ1x1MjU1MycsXG4gICAgbGluZURvd25SaWdodERvdWJsZTogJ1x1MjU1MicsXG4gICAgbGluZVVwTGVmdDogJ1x1MjUxOCcsXG4gICAgbGluZVVwTGVmdEFyYzogJ1x1MjU2RicsXG4gICAgbGluZVVwQm9sZExlZnRCb2xkOiAnXHUyNTFCJyxcbiAgICBsaW5lVXBCb2xkTGVmdDogJ1x1MjUxQScsXG4gICAgbGluZVVwTGVmdEJvbGQ6ICdcdTI1MTknLFxuICAgIGxpbmVVcERvdWJsZUxlZnREb3VibGU6ICdcdTI1NUQnLFxuICAgIGxpbmVVcERvdWJsZUxlZnQ6ICdcdTI1NUMnLFxuICAgIGxpbmVVcExlZnREb3VibGU6ICdcdTI1NUInLFxuICAgIGxpbmVVcFJpZ2h0OiAnXHUyNTE0JyxcbiAgICBsaW5lVXBSaWdodEFyYzogJ1x1MjU3MCcsXG4gICAgbGluZVVwQm9sZFJpZ2h0Qm9sZDogJ1x1MjUxNycsXG4gICAgbGluZVVwQm9sZFJpZ2h0OiAnXHUyNTE2JyxcbiAgICBsaW5lVXBSaWdodEJvbGQ6ICdcdTI1MTUnLFxuICAgIGxpbmVVcERvdWJsZVJpZ2h0RG91YmxlOiAnXHUyNTVBJyxcbiAgICBsaW5lVXBEb3VibGVSaWdodDogJ1x1MjU1OScsXG4gICAgbGluZVVwUmlnaHREb3VibGU6ICdcdTI1NTgnLFxuICAgIGxpbmVVcERvd25MZWZ0OiAnXHUyNTI0JyxcbiAgICBsaW5lVXBCb2xkRG93bkJvbGRMZWZ0Qm9sZDogJ1x1MjUyQicsXG4gICAgbGluZVVwQm9sZERvd25Cb2xkTGVmdDogJ1x1MjUyOCcsXG4gICAgbGluZVVwRG93bkxlZnRCb2xkOiAnXHUyNTI1JyxcbiAgICBsaW5lVXBCb2xkRG93bkxlZnRCb2xkOiAnXHUyNTI5JyxcbiAgICBsaW5lVXBEb3duQm9sZExlZnRCb2xkOiAnXHUyNTJBJyxcbiAgICBsaW5lVXBEb3duQm9sZExlZnQ6ICdcdTI1MjcnLFxuICAgIGxpbmVVcEJvbGREb3duTGVmdDogJ1x1MjUyNicsXG4gICAgbGluZVVwRG91YmxlRG93bkRvdWJsZUxlZnREb3VibGU6ICdcdTI1NjMnLFxuICAgIGxpbmVVcERvdWJsZURvd25Eb3VibGVMZWZ0OiAnXHUyNTYyJyxcbiAgICBsaW5lVXBEb3duTGVmdERvdWJsZTogJ1x1MjU2MScsXG4gICAgbGluZVVwRG93blJpZ2h0OiAnXHUyNTFDJyxcbiAgICBsaW5lVXBCb2xkRG93bkJvbGRSaWdodEJvbGQ6ICdcdTI1MjMnLFxuICAgIGxpbmVVcEJvbGREb3duQm9sZFJpZ2h0OiAnXHUyNTIwJyxcbiAgICBsaW5lVXBEb3duUmlnaHRCb2xkOiAnXHUyNTFEJyxcbiAgICBsaW5lVXBCb2xkRG93blJpZ2h0Qm9sZDogJ1x1MjUyMScsXG4gICAgbGluZVVwRG93bkJvbGRSaWdodEJvbGQ6ICdcdTI1MjInLFxuICAgIGxpbmVVcERvd25Cb2xkUmlnaHQ6ICdcdTI1MUYnLFxuICAgIGxpbmVVcEJvbGREb3duUmlnaHQ6ICdcdTI1MUUnLFxuICAgIGxpbmVVcERvdWJsZURvd25Eb3VibGVSaWdodERvdWJsZTogJ1x1MjU2MCcsXG4gICAgbGluZVVwRG91YmxlRG93bkRvdWJsZVJpZ2h0OiAnXHUyNTVGJyxcbiAgICBsaW5lVXBEb3duUmlnaHREb3VibGU6ICdcdTI1NUUnLFxuICAgIGxpbmVEb3duTGVmdFJpZ2h0OiAnXHUyNTJDJyxcbiAgICBsaW5lRG93bkJvbGRMZWZ0Qm9sZFJpZ2h0Qm9sZDogJ1x1MjUzMycsXG4gICAgbGluZURvd25MZWZ0Qm9sZFJpZ2h0Qm9sZDogJ1x1MjUyRicsXG4gICAgbGluZURvd25Cb2xkTGVmdFJpZ2h0OiAnXHUyNTMwJyxcbiAgICBsaW5lRG93bkJvbGRMZWZ0Qm9sZFJpZ2h0OiAnXHUyNTMxJyxcbiAgICBsaW5lRG93bkJvbGRMZWZ0UmlnaHRCb2xkOiAnXHUyNTMyJyxcbiAgICBsaW5lRG93bkxlZnRSaWdodEJvbGQ6ICdcdTI1MkUnLFxuICAgIGxpbmVEb3duTGVmdEJvbGRSaWdodDogJ1x1MjUyRCcsXG4gICAgbGluZURvd25Eb3VibGVMZWZ0RG91YmxlUmlnaHREb3VibGU6ICdcdTI1NjYnLFxuICAgIGxpbmVEb3duRG91YmxlTGVmdFJpZ2h0OiAnXHUyNTY1JyxcbiAgICBsaW5lRG93bkxlZnREb3VibGVSaWdodERvdWJsZTogJ1x1MjU2NCcsXG4gICAgbGluZVVwTGVmdFJpZ2h0OiAnXHUyNTM0JyxcbiAgICBsaW5lVXBCb2xkTGVmdEJvbGRSaWdodEJvbGQ6ICdcdTI1M0InLFxuICAgIGxpbmVVcExlZnRCb2xkUmlnaHRCb2xkOiAnXHUyNTM3JyxcbiAgICBsaW5lVXBCb2xkTGVmdFJpZ2h0OiAnXHUyNTM4JyxcbiAgICBsaW5lVXBCb2xkTGVmdEJvbGRSaWdodDogJ1x1MjUzOScsXG4gICAgbGluZVVwQm9sZExlZnRSaWdodEJvbGQ6ICdcdTI1M0EnLFxuICAgIGxpbmVVcExlZnRSaWdodEJvbGQ6ICdcdTI1MzYnLFxuICAgIGxpbmVVcExlZnRCb2xkUmlnaHQ6ICdcdTI1MzUnLFxuICAgIGxpbmVVcERvdWJsZUxlZnREb3VibGVSaWdodERvdWJsZTogJ1x1MjU2OScsXG4gICAgbGluZVVwRG91YmxlTGVmdFJpZ2h0OiAnXHUyNTY4JyxcbiAgICBsaW5lVXBMZWZ0RG91YmxlUmlnaHREb3VibGU6ICdcdTI1NjcnLFxuICAgIGxpbmVVcERvd25MZWZ0UmlnaHQ6ICdcdTI1M0MnLFxuICAgIGxpbmVVcEJvbGREb3duQm9sZExlZnRCb2xkUmlnaHRCb2xkOiAnXHUyNTRCJyxcbiAgICBsaW5lVXBEb3duQm9sZExlZnRCb2xkUmlnaHRCb2xkOiAnXHUyNTQ4JyxcbiAgICBsaW5lVXBCb2xkRG93bkxlZnRCb2xkUmlnaHRCb2xkOiAnXHUyNTQ3JyxcbiAgICBsaW5lVXBCb2xkRG93bkJvbGRMZWZ0UmlnaHRCb2xkOiAnXHUyNTRBJyxcbiAgICBsaW5lVXBCb2xkRG93bkJvbGRMZWZ0Qm9sZFJpZ2h0OiAnXHUyNTQ5JyxcbiAgICBsaW5lVXBCb2xkRG93bkxlZnRSaWdodDogJ1x1MjU0MCcsXG4gICAgbGluZVVwRG93bkJvbGRMZWZ0UmlnaHQ6ICdcdTI1NDEnLFxuICAgIGxpbmVVcERvd25MZWZ0Qm9sZFJpZ2h0OiAnXHUyNTNEJyxcbiAgICBsaW5lVXBEb3duTGVmdFJpZ2h0Qm9sZDogJ1x1MjUzRScsXG4gICAgbGluZVVwQm9sZERvd25Cb2xkTGVmdFJpZ2h0OiAnXHUyNTQyJyxcbiAgICBsaW5lVXBEb3duTGVmdEJvbGRSaWdodEJvbGQ6ICdcdTI1M0YnLFxuICAgIGxpbmVVcEJvbGREb3duTGVmdEJvbGRSaWdodDogJ1x1MjU0MycsXG4gICAgbGluZVVwQm9sZERvd25MZWZ0UmlnaHRCb2xkOiAnXHUyNTQ0JyxcbiAgICBsaW5lVXBEb3duQm9sZExlZnRCb2xkUmlnaHQ6ICdcdTI1NDUnLFxuICAgIGxpbmVVcERvd25Cb2xkTGVmdFJpZ2h0Qm9sZDogJ1x1MjU0NicsXG4gICAgbGluZVVwRG91YmxlRG93bkRvdWJsZUxlZnREb3VibGVSaWdodERvdWJsZTogJ1x1MjU2QycsXG4gICAgbGluZVVwRG91YmxlRG93bkRvdWJsZUxlZnRSaWdodDogJ1x1MjU2QicsXG4gICAgbGluZVVwRG93bkxlZnREb3VibGVSaWdodERvdWJsZTogJ1x1MjU2QScsXG4gICAgbGluZUNyb3NzOiAnXHUyNTczJyxcbiAgICBsaW5lQmFja3NsYXNoOiAnXHUyNTcyJyxcbiAgICBsaW5lU2xhc2g6ICdcdTI1NzEnLFxufTtcbmNvbnN0IHNwZWNpYWxNYWluU3ltYm9scyA9IHtcbiAgICB0aWNrOiAnXHUyNzE0JyxcbiAgICBpbmZvOiAnXHUyMTM5JyxcbiAgICB3YXJuaW5nOiAnXHUyNkEwJyxcbiAgICBjcm9zczogJ1x1MjcxOCcsXG4gICAgc3F1YXJlU21hbGw6ICdcdTI1RkInLFxuICAgIHNxdWFyZVNtYWxsRmlsbGVkOiAnXHUyNUZDJyxcbiAgICBjaXJjbGU6ICdcdTI1RUYnLFxuICAgIGNpcmNsZUZpbGxlZDogJ1x1MjVDOScsXG4gICAgY2lyY2xlRG90dGVkOiAnXHUyNUNDJyxcbiAgICBjaXJjbGVEb3VibGU6ICdcdTI1Q0UnLFxuICAgIGNpcmNsZUNpcmNsZTogJ1x1MjRERScsXG4gICAgY2lyY2xlQ3Jvc3M6ICdcdTI0RTcnLFxuICAgIGNpcmNsZVBpcGU6ICdcdTI0QkUnLFxuICAgIHJhZGlvT246ICdcdTI1QzknLFxuICAgIHJhZGlvT2ZmOiAnXHUyNUVGJyxcbiAgICBjaGVja2JveE9uOiAnXHUyNjEyJyxcbiAgICBjaGVja2JveE9mZjogJ1x1MjYxMCcsXG4gICAgY2hlY2tib3hDaXJjbGVPbjogJ1x1MjRFNycsXG4gICAgY2hlY2tib3hDaXJjbGVPZmY6ICdcdTI0QkUnLFxuICAgIHBvaW50ZXI6ICdcdTI3NkYnLFxuICAgIHRyaWFuZ2xlVXBPdXRsaW5lOiAnXHUyNUIzJyxcbiAgICB0cmlhbmdsZUxlZnQ6ICdcdTI1QzAnLFxuICAgIHRyaWFuZ2xlUmlnaHQ6ICdcdTI1QjYnLFxuICAgIGxvemVuZ2U6ICdcdTI1QzYnLFxuICAgIGxvemVuZ2VPdXRsaW5lOiAnXHUyNUM3JyxcbiAgICBoYW1idXJnZXI6ICdcdTI2MzAnLFxuICAgIHNtaWxleTogJ1x1MzJFMScsXG4gICAgbXVzdGFjaGU6ICdcdTBERjQnLFxuICAgIHN0YXI6ICdcdTI2MDUnLFxuICAgIHBsYXk6ICdcdTI1QjYnLFxuICAgIG5vZGVqczogJ1x1MkIyMicsXG4gICAgb25lU2V2ZW50aDogJ1x1MjE1MCcsXG4gICAgb25lTmludGg6ICdcdTIxNTEnLFxuICAgIG9uZVRlbnRoOiAnXHUyMTUyJyxcbn07XG5jb25zdCBzcGVjaWFsRmFsbGJhY2tTeW1ib2xzID0ge1xuICAgIHRpY2s6ICdcdTIyMUEnLFxuICAgIGluZm86ICdpJyxcbiAgICB3YXJuaW5nOiAnXHUyMDNDJyxcbiAgICBjcm9zczogJ1x1MDBENycsXG4gICAgc3F1YXJlU21hbGw6ICdcdTI1QTEnLFxuICAgIHNxdWFyZVNtYWxsRmlsbGVkOiAnXHUyNUEwJyxcbiAgICBjaXJjbGU6ICcoICknLFxuICAgIGNpcmNsZUZpbGxlZDogJygqKScsXG4gICAgY2lyY2xlRG90dGVkOiAnKCApJyxcbiAgICBjaXJjbGVEb3VibGU6ICcoICknLFxuICAgIGNpcmNsZUNpcmNsZTogJyhcdTI1Q0IpJyxcbiAgICBjaXJjbGVDcm9zczogJyhcdTAwRDcpJyxcbiAgICBjaXJjbGVQaXBlOiAnKFx1MjUwMiknLFxuICAgIHJhZGlvT246ICcoKiknLFxuICAgIHJhZGlvT2ZmOiAnKCApJyxcbiAgICBjaGVja2JveE9uOiAnW1x1MDBEN10nLFxuICAgIGNoZWNrYm94T2ZmOiAnWyBdJyxcbiAgICBjaGVja2JveENpcmNsZU9uOiAnKFx1MDBENyknLFxuICAgIGNoZWNrYm94Q2lyY2xlT2ZmOiAnKCApJyxcbiAgICBwb2ludGVyOiAnPicsXG4gICAgdHJpYW5nbGVVcE91dGxpbmU6ICdcdTIyMDYnLFxuICAgIHRyaWFuZ2xlTGVmdDogJ1x1MjVDNCcsXG4gICAgdHJpYW5nbGVSaWdodDogJ1x1MjVCQScsXG4gICAgbG96ZW5nZTogJ1x1MjY2NicsXG4gICAgbG96ZW5nZU91dGxpbmU6ICdcdTI1Q0EnLFxuICAgIGhhbWJ1cmdlcjogJ1x1MjI2MScsXG4gICAgc21pbGV5OiAnXHUyNjNBJyxcbiAgICBtdXN0YWNoZTogJ1x1MjUwQ1x1MjUwMFx1MjUxMCcsXG4gICAgc3RhcjogJ1x1MjczNicsXG4gICAgcGxheTogJ1x1MjVCQScsXG4gICAgbm9kZWpzOiAnXHUyNjY2JyxcbiAgICBvbmVTZXZlbnRoOiAnMS83JyxcbiAgICBvbmVOaW50aDogJzEvOScsXG4gICAgb25lVGVudGg6ICcxLzEwJyxcbn07XG5leHBvcnQgY29uc3QgbWFpblN5bWJvbHMgPSB7XG4gICAgLi4uY29tbW9uLFxuICAgIC4uLnNwZWNpYWxNYWluU3ltYm9scyxcbn07XG5leHBvcnQgY29uc3QgZmFsbGJhY2tTeW1ib2xzID0ge1xuICAgIC4uLmNvbW1vbixcbiAgICAuLi5zcGVjaWFsRmFsbGJhY2tTeW1ib2xzLFxufTtcbmNvbnN0IHNob3VsZFVzZU1haW4gPSBpc1VuaWNvZGVTdXBwb3J0ZWQoKTtcbmNvbnN0IGZpZ3VyZXMgPSBzaG91bGRVc2VNYWluXG4gICAgPyBtYWluU3ltYm9sc1xuICAgIDogZmFsbGJhY2tTeW1ib2xzO1xuZXhwb3J0IGRlZmF1bHQgZmlndXJlcztcbmNvbnN0IHJlcGxhY2VtZW50cyA9IE9iamVjdC5lbnRyaWVzKHNwZWNpYWxNYWluU3ltYm9scyk7XG4vLyBPbiB0ZXJtaW5hbHMgd2hpY2ggZG8gbm90IHN1cHBvcnQgVW5pY29kZSBzeW1ib2xzLCBzdWJzdGl0dXRlIHRoZW0gdG8gb3RoZXIgc3ltYm9sc1xuZXhwb3J0IGNvbnN0IHJlcGxhY2VTeW1ib2xzID0gKHN0cmluZywgeyB1c2VGYWxsYmFjayA9ICFzaG91bGRVc2VNYWluIH0gPSB7fSkgPT4ge1xuICAgIGlmICh1c2VGYWxsYmFjaykge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIG1haW5TeW1ib2xdIG9mIHJlcGxhY2VtZW50cykge1xuICAgICAgICAgICAgY29uc3QgZmFsbGJhY2tTeW1ib2wgPSBmYWxsYmFja1N5bWJvbHNba2V5XTtcbiAgICAgICAgICAgIGlmICghZmFsbGJhY2tTeW1ib2wpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIGZhbGxiYWNrIGZvciAke2tleX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlQWxsKG1haW5TeW1ib2wsIGZhbGxiYWNrU3ltYm9sKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nO1xufTtcbiIsICJpbXBvcnQgeyBkZWZhdWx0VGhlbWUgfSBmcm9tIFwiLi90aGVtZS5qc1wiO1xuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IHZhbHVlID09PSBudWxsKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgbGV0IHByb3RvID0gdmFsdWU7XG4gICAgd2hpbGUgKE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90bykgIT09IG51bGwpIHtcbiAgICAgICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKSA9PT0gcHJvdG87XG59XG5mdW5jdGlvbiBkZWVwTWVyZ2UoLi4ub2JqZWN0cykge1xuICAgIGNvbnN0IG91dHB1dCA9IHt9O1xuICAgIGZvciAoY29uc3Qgb2JqIG9mIG9iamVjdHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob2JqKSkge1xuICAgICAgICAgICAgY29uc3QgcHJldlZhbHVlID0gb3V0cHV0W2tleV07XG4gICAgICAgICAgICBvdXRwdXRba2V5XSA9XG4gICAgICAgICAgICAgICAgaXNQbGFpbk9iamVjdChwcmV2VmFsdWUpICYmIGlzUGxhaW5PYmplY3QodmFsdWUpXG4gICAgICAgICAgICAgICAgICAgID8gZGVlcE1lcmdlKHByZXZWYWx1ZSwgdmFsdWUpXG4gICAgICAgICAgICAgICAgICAgIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG91dHB1dDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtYWtlVGhlbWUoLi4udGhlbWVzKSB7XG4gICAgY29uc3QgdGhlbWVzVG9NZXJnZSA9IFtcbiAgICAgICAgZGVmYXVsdFRoZW1lLFxuICAgICAgICAuLi50aGVtZXMuZmlsdGVyKCh0aGVtZSkgPT4gdGhlbWUgIT0gbnVsbCksXG4gICAgXTtcbiAgICByZXR1cm4gZGVlcE1lcmdlKC4uLnRoZW1lc1RvTWVyZ2UpO1xufVxuIiwgImltcG9ydCB7IHVzZVN0YXRlIH0gZnJvbSBcIi4vdXNlLXN0YXRlLmpzXCI7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tIFwiLi91c2UtZWZmZWN0LmpzXCI7XG5pbXBvcnQgeyBtYWtlVGhlbWUgfSBmcm9tIFwiLi9tYWtlLXRoZW1lLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gdXNlUHJlZml4KHsgc3RhdHVzID0gJ2lkbGUnLCB0aGVtZSwgfSkge1xuICAgIGNvbnN0IFtzaG93TG9hZGVyLCBzZXRTaG93TG9hZGVyXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgICBjb25zdCBbdGljaywgc2V0VGlja10gPSB1c2VTdGF0ZSgwKTtcbiAgICBjb25zdCB7IHByZWZpeCwgc3Bpbm5lciB9ID0gbWFrZVRoZW1lKHRoZW1lKTtcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoc3RhdHVzID09PSAnbG9hZGluZycpIHtcbiAgICAgICAgICAgIGxldCB0aWNrSW50ZXJ2YWw7XG4gICAgICAgICAgICBsZXQgaW5jID0gLTE7XG4gICAgICAgICAgICAvLyBEZWxheSBkaXNwbGF5aW5nIHNwaW5uZXIgYnkgMzAwbXMsIHRvIGF2b2lkIGZsaWNrZXJpbmdcbiAgICAgICAgICAgIGNvbnN0IGRlbGF5VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNldFNob3dMb2FkZXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgdGlja0ludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbmMgPSBpbmMgKyAxO1xuICAgICAgICAgICAgICAgICAgICBzZXRUaWNrKGluYyAlIHNwaW5uZXIuZnJhbWVzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfSwgc3Bpbm5lci5pbnRlcnZhbCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZGVsYXlUaW1lb3V0KTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpY2tJbnRlcnZhbCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0U2hvd0xvYWRlcihmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LCBbc3RhdHVzXSk7XG4gICAgaWYgKHNob3dMb2FkZXIpIHtcbiAgICAgICAgcmV0dXJuIHNwaW5uZXIuZnJhbWVzW3RpY2tdO1xuICAgIH1cbiAgICAvLyBUaGVyZSdzIGEgZGVsYXkgYmVmb3JlIHdlIHNob3cgdGhlIGxvYWRlci4gU28gd2Ugd2FudCB0byBpZ25vcmUgYGxvYWRpbmdgIGhlcmUsIGFuZCBwYXNzIGlkbGUgaW5zdGVhZC5cbiAgICBjb25zdCBpY29uTmFtZSA9IHN0YXR1cyA9PT0gJ2xvYWRpbmcnID8gJ2lkbGUnIDogc3RhdHVzO1xuICAgIHJldHVybiB0eXBlb2YgcHJlZml4ID09PSAnc3RyaW5nJyA/IHByZWZpeCA6IChwcmVmaXhbaWNvbk5hbWVdID8/IHByZWZpeFsnaWRsZSddKTtcbn1cbiIsICJpbXBvcnQgeyB3aXRoUG9pbnRlciB9IGZyb20gXCIuL2hvb2stZW5naW5lLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gdXNlTWVtbyhmbiwgZGVwZW5kZW5jaWVzKSB7XG4gICAgcmV0dXJuIHdpdGhQb2ludGVyKChwb2ludGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBwb2ludGVyLmdldCgpO1xuICAgICAgICBpZiAoIXByZXYgfHxcbiAgICAgICAgICAgIHByZXYuZGVwZW5kZW5jaWVzLmxlbmd0aCAhPT0gZGVwZW5kZW5jaWVzLmxlbmd0aCB8fFxuICAgICAgICAgICAgcHJldi5kZXBlbmRlbmNpZXMuc29tZSgoZGVwLCBpKSA9PiBkZXAgIT09IGRlcGVuZGVuY2llc1tpXSkpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZm4oKTtcbiAgICAgICAgICAgIHBvaW50ZXIuc2V0KHsgdmFsdWUsIGRlcGVuZGVuY2llcyB9KTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJldi52YWx1ZTtcbiAgICB9KTtcbn1cbiIsICJpbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gXCIuL3VzZS1zdGF0ZS5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZih2YWwpIHtcbiAgICByZXR1cm4gdXNlU3RhdGUoeyBjdXJyZW50OiB2YWwgfSlbMF07XG59XG4iLCAiaW1wb3J0IHsgdXNlUmVmIH0gZnJvbSBcIi4vdXNlLXJlZi5qc1wiO1xuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSBcIi4vdXNlLWVmZmVjdC5qc1wiO1xuaW1wb3J0IHsgd2l0aFVwZGF0ZXMgfSBmcm9tIFwiLi9ob29rLWVuZ2luZS5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIHVzZUtleXByZXNzKHVzZXJIYW5kbGVyKSB7XG4gICAgY29uc3Qgc2lnbmFsID0gdXNlUmVmKHVzZXJIYW5kbGVyKTtcbiAgICBzaWduYWwuY3VycmVudCA9IHVzZXJIYW5kbGVyO1xuICAgIHVzZUVmZmVjdCgocmwpID0+IHtcbiAgICAgICAgbGV0IGlnbm9yZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gd2l0aFVwZGF0ZXMoKF9pbnB1dCwgZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChpZ25vcmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgdm9pZCBzaWduYWwuY3VycmVudChldmVudCwgcmwpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmwuaW5wdXQub24oJ2tleXByZXNzJywgaGFuZGxlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBpZ25vcmUgPSB0cnVlO1xuICAgICAgICAgICAgcmwuaW5wdXQucmVtb3ZlTGlzdGVuZXIoJ2tleXByZXNzJywgaGFuZGxlcik7XG4gICAgICAgIH07XG4gICAgfSwgW10pO1xufVxuIiwgImltcG9ydCBjbGlXaWR0aCBmcm9tICdjbGktd2lkdGgnO1xuaW1wb3J0IHsgd3JhcEFuc2kgfSBmcm9tICdmYXN0LXdyYXAtYW5zaSc7XG5pbXBvcnQgeyByZWFkbGluZSB9IGZyb20gXCIuL2hvb2stZW5naW5lLmpzXCI7XG4vKipcbiAqIEZvcmNlIGxpbmUgcmV0dXJucyBhdCBzcGVjaWZpYyB3aWR0aC4gVGhpcyBmdW5jdGlvbiBpcyBBTlNJIGNvZGUgZnJpZW5kbHkgYW5kIGl0J2xsXG4gKiBpZ25vcmUgaW52aXNpYmxlIGNvZGVzIGR1cmluZyB3aWR0aCBjYWxjdWxhdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gKiBAcGFyYW0ge251bWJlcn0gd2lkdGhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJyZWFrTGluZXMoY29udGVudCwgd2lkdGgpIHtcbiAgICByZXR1cm4gY29udGVudFxuICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgIC5mbGF0TWFwKChsaW5lKSA9PiB3cmFwQW5zaShsaW5lLCB3aWR0aCwgeyB0cmltOiBmYWxzZSwgaGFyZDogdHJ1ZSB9KVxuICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgIC5tYXAoKHN0cikgPT4gc3RyLnRyaW1FbmQoKSkpXG4gICAgICAgIC5qb2luKCdcXG4nKTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgd2lkdGggb2YgdGhlIGFjdGl2ZSByZWFkbGluZSwgb3IgODAgYXMgZGVmYXVsdCB2YWx1ZS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWFkbGluZVdpZHRoKCkge1xuICAgIHJldHVybiBjbGlXaWR0aCh7IGRlZmF1bHRXaWR0aDogODAsIG91dHB1dDogcmVhZGxpbmUoKS5vdXRwdXQgfSk7XG59XG4iLCAiLyogTUFJTiAqL1xuY29uc3QgZ2V0Q29kZVBvaW50c0xlbmd0aCA9ICgoKSA9PiB7XG4gICAgY29uc3QgU1VSUk9HQVRFX1BBSVJfUkUgPSAvW1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXS9nO1xuICAgIHJldHVybiAoaW5wdXQpID0+IHtcbiAgICAgICAgbGV0IHN1cnJvZ2F0ZVBhaXJzTnIgPSAwO1xuICAgICAgICBTVVJST0dBVEVfUEFJUl9SRS5sYXN0SW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoU1VSUk9HQVRFX1BBSVJfUkUudGVzdChpbnB1dCkpIHtcbiAgICAgICAgICAgIHN1cnJvZ2F0ZVBhaXJzTnIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5wdXQubGVuZ3RoIC0gc3Vycm9nYXRlUGFpcnNOcjtcbiAgICB9O1xufSkoKTtcbmNvbnN0IGlzRnVsbFdpZHRoID0gKHgpID0+IHtcbiAgICByZXR1cm4geCA9PT0gMHgzMDAwIHx8IHggPj0gMHhGRjAxICYmIHggPD0gMHhGRjYwIHx8IHggPj0gMHhGRkUwICYmIHggPD0gMHhGRkU2O1xufTtcbmNvbnN0IGlzV2lkZU5vdENKS1ROb3RFbW9qaSA9ICh4KSA9PiB7XG4gICAgcmV0dXJuIHggPT09IDB4MjMxQiB8fCB4ID09PSAweDIzMjkgfHwgeCA+PSAweDJGRjAgJiYgeCA8PSAweDJGRkYgfHwgeCA+PSAweDMwMDEgJiYgeCA8PSAweDMwM0UgfHwgeCA+PSAweDMwOTkgJiYgeCA8PSAweDMwRkYgfHwgeCA+PSAweDMxMDUgJiYgeCA8PSAweDMxMkYgfHwgeCA+PSAweDMxMzEgJiYgeCA8PSAweDMxOEUgfHwgeCA+PSAweDMxOTAgJiYgeCA8PSAweDMxRTMgfHwgeCA+PSAweDMxRUYgJiYgeCA8PSAweDMyMUUgfHwgeCA+PSAweDMyMjAgJiYgeCA8PSAweDMyNDcgfHwgeCA+PSAweDMyNTAgJiYgeCA8PSAweDREQkYgfHwgeCA+PSAweEZFMTAgJiYgeCA8PSAweEZFMTkgfHwgeCA+PSAweEZFMzAgJiYgeCA8PSAweEZFNTIgfHwgeCA+PSAweEZFNTQgJiYgeCA8PSAweEZFNjYgfHwgeCA+PSAweEZFNjggJiYgeCA8PSAweEZFNkIgfHwgeCA+PSAweDFGMjAwICYmIHggPD0gMHgxRjIwMiB8fCB4ID49IDB4MUYyMTAgJiYgeCA8PSAweDFGMjNCIHx8IHggPj0gMHgxRjI0MCAmJiB4IDw9IDB4MUYyNDggfHwgeCA+PSAweDIwMDAwICYmIHggPD0gMHgyRkZGRCB8fCB4ID49IDB4MzAwMDAgJiYgeCA8PSAweDNGRkZEO1xufTtcbi8qIEVYUE9SVCAqL1xuZXhwb3J0IHsgZ2V0Q29kZVBvaW50c0xlbmd0aCwgaXNGdWxsV2lkdGgsIGlzV2lkZU5vdENKS1ROb3RFbW9qaSB9O1xuIiwgIi8qIElNUE9SVCAqL1xuaW1wb3J0IHsgZ2V0Q29kZVBvaW50c0xlbmd0aCwgaXNGdWxsV2lkdGgsIGlzV2lkZU5vdENKS1ROb3RFbW9qaSB9IGZyb20gJy4vdXRpbHMuanMnO1xuLyogSEVMUEVSUyAqL1xuY29uc3QgQU5TSV9SRSA9IC9bXFx1MDAxYlxcdTAwOWJdW1soKSM7P10qKD86WzAtOV17MSw0fSg/OjtbMC05XXswLDR9KSopP1swLTlBLU9SWmNmLW5xcnk9PjxdfFxcdTAwMWJcXF04O1teO10qOy4qPyg/OlxcdTAwMDd8XFx1MDAxYlxcdTAwNWMpL3k7XG5jb25zdCBDT05UUk9MX1JFID0gL1tcXHgwMC1cXHgwOFxceDBBLVxceDFGXFx4N0YtXFx4OUZdezEsMTAwMH0veTtcbmNvbnN0IENKS1RfV0lERV9SRSA9IC8oPzooPyFbXFx1RkY2MS1cXHVGRjlGXFx1RkYwMC1cXHVGRkVGXSlbXFxwe1NjcmlwdD1IYW59XFxwe1NjcmlwdD1IaXJhZ2FuYX1cXHB7U2NyaXB0PUthdGFrYW5hfVxccHtTY3JpcHQ9SGFuZ3VsfVxccHtTY3JpcHQ9VGFuZ3V0fV0pezEsMTAwMH0veXU7XG5jb25zdCBUQUJfUkUgPSAvXFx0ezEsMTAwMH0veTtcbmNvbnN0IEVNT0pJX1JFID0gL1tcXHV7MUYxRTZ9LVxcdXsxRjFGRn1dezJ9fFxcdXsxRjNGNH1bXFx1e0UwMDYxfS1cXHV7RTAwN0F9XXsyfVtcXHV7RTAwMzB9LVxcdXtFMDAzOX1cXHV7RTAwNjF9LVxcdXtFMDA3QX1dezEsM31cXHV7RTAwN0Z9fCg/OlxccHtFbW9qaX1cXHVGRTBGXFx1MjBFMz98XFxwe0Vtb2ppX01vZGlmaWVyX0Jhc2V9XFxwe0Vtb2ppX01vZGlmaWVyfT98XFxwe0Vtb2ppX1ByZXNlbnRhdGlvbn0pKD86XFx1MjAwRCg/OlxccHtFbW9qaV9Nb2RpZmllcl9CYXNlfVxccHtFbW9qaV9Nb2RpZmllcn0/fFxccHtFbW9qaV9QcmVzZW50YXRpb259fFxccHtFbW9qaX1cXHVGRTBGXFx1MjBFMz8pKSoveXU7XG5jb25zdCBMQVRJTl9SRSA9IC8oPzpbXFx4MjAtXFx4N0VcXHhBMC1cXHhGRl0oPyFcXHVGRTBGKSl7MSwxMDAwfS95O1xuY29uc3QgTU9ESUZJRVJfUkUgPSAvXFxwe019Ky9ndTtcbmNvbnN0IE5PX1RSVU5DQVRJT04gPSB7IGxpbWl0OiBJbmZpbml0eSwgZWxsaXBzaXM6ICcnIH07XG4vKiBNQUlOICovXG5jb25zdCBnZXRTdHJpbmdUcnVuY2F0ZWRXaWR0aCA9IChpbnB1dCwgdHJ1bmNhdGlvbk9wdGlvbnMgPSB7fSwgd2lkdGhPcHRpb25zID0ge30pID0+IHtcbiAgICAvKiBDT05TVEFOVFMgKi9cbiAgICBjb25zdCBMSU1JVCA9IHRydW5jYXRpb25PcHRpb25zLmxpbWl0ID8/IEluZmluaXR5O1xuICAgIGNvbnN0IEVMTElQU0lTID0gdHJ1bmNhdGlvbk9wdGlvbnMuZWxsaXBzaXMgPz8gJyc7XG4gICAgY29uc3QgRUxMSVBTSVNfV0lEVEggPSB0cnVuY2F0aW9uT3B0aW9ucz8uZWxsaXBzaXNXaWR0aCA/PyAoRUxMSVBTSVMgPyBnZXRTdHJpbmdUcnVuY2F0ZWRXaWR0aChFTExJUFNJUywgTk9fVFJVTkNBVElPTiwgd2lkdGhPcHRpb25zKS53aWR0aCA6IDApO1xuICAgIGNvbnN0IEFOU0lfV0lEVEggPSAwO1xuICAgIGNvbnN0IENPTlRST0xfV0lEVEggPSB3aWR0aE9wdGlvbnMuY29udHJvbFdpZHRoID8/IDA7XG4gICAgY29uc3QgVEFCX1dJRFRIID0gd2lkdGhPcHRpb25zLnRhYldpZHRoID8/IDg7XG4gICAgY29uc3QgRU1PSklfV0lEVEggPSB3aWR0aE9wdGlvbnMuZW1vamlXaWR0aCA/PyAyO1xuICAgIGNvbnN0IEZVTExfV0lEVEhfV0lEVEggPSAyO1xuICAgIGNvbnN0IFJFR1VMQVJfV0lEVEggPSB3aWR0aE9wdGlvbnMucmVndWxhcldpZHRoID8/IDE7XG4gICAgY29uc3QgV0lERV9XSURUSCA9IHdpZHRoT3B0aW9ucy53aWRlV2lkdGggPz8gRlVMTF9XSURUSF9XSURUSDtcbiAgICBjb25zdCBQQVJTRV9CTE9DS1MgPSBbXG4gICAgICAgIFtMQVRJTl9SRSwgUkVHVUxBUl9XSURUSF0sXG4gICAgICAgIFtBTlNJX1JFLCBBTlNJX1dJRFRIXSxcbiAgICAgICAgW0NPTlRST0xfUkUsIENPTlRST0xfV0lEVEhdLFxuICAgICAgICBbVEFCX1JFLCBUQUJfV0lEVEhdLFxuICAgICAgICBbRU1PSklfUkUsIEVNT0pJX1dJRFRIXSxcbiAgICAgICAgW0NKS1RfV0lERV9SRSwgV0lERV9XSURUSF0sXG4gICAgXTtcbiAgICAvKiBTVEFURSAqL1xuICAgIGxldCBpbmRleFByZXYgPSAwO1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGxlbmd0aCA9IGlucHV0Lmxlbmd0aDtcbiAgICBsZXQgbGVuZ3RoRXh0cmEgPSAwO1xuICAgIGxldCB0cnVuY2F0aW9uRW5hYmxlZCA9IGZhbHNlO1xuICAgIGxldCB0cnVuY2F0aW9uSW5kZXggPSBsZW5ndGg7XG4gICAgbGV0IHRydW5jYXRpb25MaW1pdCA9IE1hdGgubWF4KDAsIExJTUlUIC0gRUxMSVBTSVNfV0lEVEgpO1xuICAgIGxldCB1bm1hdGNoZWRTdGFydCA9IDA7XG4gICAgbGV0IHVubWF0Y2hlZEVuZCA9IDA7XG4gICAgbGV0IHdpZHRoID0gMDtcbiAgICBsZXQgd2lkdGhFeHRyYSA9IDA7XG4gICAgLyogUEFSU0UgTE9PUCAqL1xuICAgIG91dGVyOiB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvKiBVTk1BVENIRUQgKi9cbiAgICAgICAgaWYgKCh1bm1hdGNoZWRFbmQgPiB1bm1hdGNoZWRTdGFydCkgfHwgKGluZGV4ID49IGxlbmd0aCAmJiBpbmRleCA+IGluZGV4UHJldikpIHtcbiAgICAgICAgICAgIGNvbnN0IHVubWF0Y2hlZCA9IGlucHV0LnNsaWNlKHVubWF0Y2hlZFN0YXJ0LCB1bm1hdGNoZWRFbmQpIHx8IGlucHV0LnNsaWNlKGluZGV4UHJldiwgaW5kZXgpO1xuICAgICAgICAgICAgbGVuZ3RoRXh0cmEgPSAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBjaGFyIG9mIHVubWF0Y2hlZC5yZXBsYWNlQWxsKE1PRElGSUVSX1JFLCAnJykpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2RlUG9pbnQgPSBjaGFyLmNvZGVQb2ludEF0KDApIHx8IDA7XG4gICAgICAgICAgICAgICAgaWYgKGlzRnVsbFdpZHRoKGNvZGVQb2ludCkpIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGhFeHRyYSA9IEZVTExfV0lEVEhfV0lEVEg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzV2lkZU5vdENKS1ROb3RFbW9qaShjb2RlUG9pbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpZHRoRXh0cmEgPSBXSURFX1dJRFRIO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGhFeHRyYSA9IFJFR1VMQVJfV0lEVEg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgod2lkdGggKyB3aWR0aEV4dHJhKSA+IHRydW5jYXRpb25MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICB0cnVuY2F0aW9uSW5kZXggPSBNYXRoLm1pbih0cnVuY2F0aW9uSW5kZXgsIE1hdGgubWF4KHVubWF0Y2hlZFN0YXJ0LCBpbmRleFByZXYpICsgbGVuZ3RoRXh0cmEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoKHdpZHRoICsgd2lkdGhFeHRyYSkgPiBMSU1JVCkge1xuICAgICAgICAgICAgICAgICAgICB0cnVuY2F0aW9uRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrIG91dGVyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZW5ndGhFeHRyYSArPSBjaGFyLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB3aWR0aCArPSB3aWR0aEV4dHJhO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdW5tYXRjaGVkU3RhcnQgPSB1bm1hdGNoZWRFbmQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8qIEVYSVRJTkcgKi9cbiAgICAgICAgaWYgKGluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICAgICAgYnJlYWsgb3V0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgLyogUEFSU0UgQkxPQ0tTICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gUEFSU0VfQkxPQ0tTLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgW0JMT0NLX1JFLCBCTE9DS19XSURUSF0gPSBQQVJTRV9CTE9DS1NbaV07XG4gICAgICAgICAgICBCTE9DS19SRS5sYXN0SW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIGlmIChCTE9DS19SRS50ZXN0KGlucHV0KSkge1xuICAgICAgICAgICAgICAgIGxlbmd0aEV4dHJhID0gQkxPQ0tfUkUgPT09IENKS1RfV0lERV9SRSA/IGdldENvZGVQb2ludHNMZW5ndGgoaW5wdXQuc2xpY2UoaW5kZXgsIEJMT0NLX1JFLmxhc3RJbmRleCkpIDogQkxPQ0tfUkUgPT09IEVNT0pJX1JFID8gMSA6IEJMT0NLX1JFLmxhc3RJbmRleCAtIGluZGV4O1xuICAgICAgICAgICAgICAgIHdpZHRoRXh0cmEgPSBsZW5ndGhFeHRyYSAqIEJMT0NLX1dJRFRIO1xuICAgICAgICAgICAgICAgIGlmICgod2lkdGggKyB3aWR0aEV4dHJhKSA+IHRydW5jYXRpb25MaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICB0cnVuY2F0aW9uSW5kZXggPSBNYXRoLm1pbih0cnVuY2F0aW9uSW5kZXgsIGluZGV4ICsgTWF0aC5mbG9vcigodHJ1bmNhdGlvbkxpbWl0IC0gd2lkdGgpIC8gQkxPQ0tfV0lEVEgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCh3aWR0aCArIHdpZHRoRXh0cmEpID4gTElNSVQpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ1bmNhdGlvbkVuYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhayBvdXRlcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2lkdGggKz0gd2lkdGhFeHRyYTtcbiAgICAgICAgICAgICAgICB1bm1hdGNoZWRTdGFydCA9IGluZGV4UHJldjtcbiAgICAgICAgICAgICAgICB1bm1hdGNoZWRFbmQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGluZGV4UHJldiA9IEJMT0NLX1JFLmxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBVTk1BVENIRUQgSU5ERVggKi9cbiAgICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG4gICAgLyogUkVUVVJOICovXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IHRydW5jYXRpb25FbmFibGVkID8gdHJ1bmNhdGlvbkxpbWl0IDogd2lkdGgsXG4gICAgICAgIGluZGV4OiB0cnVuY2F0aW9uRW5hYmxlZCA/IHRydW5jYXRpb25JbmRleCA6IGxlbmd0aCxcbiAgICAgICAgdHJ1bmNhdGVkOiB0cnVuY2F0aW9uRW5hYmxlZCxcbiAgICAgICAgZWxsaXBzZWQ6IHRydW5jYXRpb25FbmFibGVkICYmIExJTUlUID49IEVMTElQU0lTX1dJRFRIXG4gICAgfTtcbn07XG4vKiBFWFBPUlQgKi9cbmV4cG9ydCBkZWZhdWx0IGdldFN0cmluZ1RydW5jYXRlZFdpZHRoO1xuIiwgIi8qIElNUE9SVCAqL1xuaW1wb3J0IGZhc3RTdHJpbmdUcnVuY2F0ZWRXaWR0aCBmcm9tICdmYXN0LXN0cmluZy10cnVuY2F0ZWQtd2lkdGgnO1xuLyogSEVMUEVSUyAqL1xuY29uc3QgTk9fVFJVTkNBVElPTiA9IHtcbiAgICBsaW1pdDogSW5maW5pdHksXG4gICAgZWxsaXBzaXM6ICcnLFxuICAgIGVsbGlwc2lzV2lkdGg6IDAsXG59O1xuLyogTUFJTiAqL1xuY29uc3QgZmFzdFN0cmluZ1dpZHRoID0gKGlucHV0LCBvcHRpb25zID0ge30pID0+IHtcbiAgICByZXR1cm4gZmFzdFN0cmluZ1RydW5jYXRlZFdpZHRoKGlucHV0LCBOT19UUlVOQ0FUSU9OLCBvcHRpb25zKS53aWR0aDtcbn07XG4vKiBFWFBPUlQgKi9cbmV4cG9ydCBkZWZhdWx0IGZhc3RTdHJpbmdXaWR0aDtcbiIsIG51bGwsICJpbXBvcnQgeyB1c2VSZWYgfSBmcm9tIFwiLi4vdXNlLXJlZi5qc1wiO1xuaW1wb3J0IHsgcmVhZGxpbmVXaWR0aCwgYnJlYWtMaW5lcyB9IGZyb20gXCIuLi91dGlscy5qc1wiO1xuZnVuY3Rpb24gdXNlUG9pbnRlclBvc2l0aW9uKHsgYWN0aXZlLCByZW5kZXJlZEl0ZW1zLCBwYWdlU2l6ZSwgbG9vcCwgfSkge1xuICAgIGNvbnN0IHN0YXRlID0gdXNlUmVmKHtcbiAgICAgICAgbGFzdFBvaW50ZXI6IGFjdGl2ZSxcbiAgICAgICAgbGFzdEFjdGl2ZTogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIGNvbnN0IHsgbGFzdFBvaW50ZXIsIGxhc3RBY3RpdmUgfSA9IHN0YXRlLmN1cnJlbnQ7XG4gICAgY29uc3QgbWlkZGxlID0gTWF0aC5mbG9vcihwYWdlU2l6ZSAvIDIpO1xuICAgIGNvbnN0IHJlbmRlcmVkTGVuZ3RoID0gcmVuZGVyZWRJdGVtcy5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5sZW5ndGgsIDApO1xuICAgIGNvbnN0IGRlZmF1bHRQb2ludGVyUG9zaXRpb24gPSByZW5kZXJlZEl0ZW1zXG4gICAgICAgIC5zbGljZSgwLCBhY3RpdmUpXG4gICAgICAgIC5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5sZW5ndGgsIDApO1xuICAgIGxldCBwb2ludGVyID0gZGVmYXVsdFBvaW50ZXJQb3NpdGlvbjtcbiAgICBpZiAocmVuZGVyZWRMZW5ndGggPiBwYWdlU2l6ZSkge1xuICAgICAgICBpZiAobG9vcCkge1xuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBDcmVhdGVzIHRoZSBuZXh0IHBvc2l0aW9uIGZvciB0aGUgcG9pbnRlciBjb25zaWRlcmluZyBhbiBpbmZpbml0ZWx5XG4gICAgICAgICAgICAgKiBsb29waW5nIGxpc3Qgb2YgaXRlbXMgdG8gYmUgcmVuZGVyZWQgb24gdGhlIHBhZ2UuXG4gICAgICAgICAgICAgKlxuICAgICAgICAgICAgICogVGhlIGdvYWwgaXMgdG8gcHJvZ3Jlc3NpdmVseSBtb3ZlIHRoZSBjdXJzb3IgdG8gdGhlIG1pZGRsZSBwb3NpdGlvbiBhcyB0aGUgdXNlciBtb3ZlIGRvd24sIGFuZCB0aGVuIGtlZXBcbiAgICAgICAgICAgICAqIHRoZSBjdXJzb3IgdGhlcmUuIFdoZW4gdGhlIHVzZXIgbW92ZSB1cCwgbWFpbnRhaW4gdGhlIGN1cnNvciBwb3NpdGlvbi5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgLy8gQnkgZGVmYXVsdCwga2VlcCB0aGUgY3Vyc29yIHBvc2l0aW9uIGFzLWlzLlxuICAgICAgICAgICAgcG9pbnRlciA9IGxhc3RQb2ludGVyO1xuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgLy8gRmlyc3QgcmVuZGVyLCBza2lwIHRoaXMgbG9naWMuXG4gICAgICAgICAgICBsYXN0QWN0aXZlICE9IG51bGwgJiZcbiAgICAgICAgICAgICAgICAvLyBPbmx5IG1vdmUgdGhlIHBvaW50ZXIgZG93biB3aGVuIHRoZSB1c2VyIG1vdmVzIGRvd24uXG4gICAgICAgICAgICAgICAgbGFzdEFjdGl2ZSA8IGFjdGl2ZSAmJlxuICAgICAgICAgICAgICAgIC8vIENoZWNrIHVzZXIgZGlkbid0IG1vdmUgdXAgYWNyb3NzIHBhZ2UgYm91bmRhcnkuXG4gICAgICAgICAgICAgICAgYWN0aXZlIC0gbGFzdEFjdGl2ZSA8IHBhZ2VTaXplKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRlciA9IE1hdGgubWluKFxuICAgICAgICAgICAgICAgIC8vIEZ1cnRoZXN0IGFsbG93ZWQgcG9zaXRpb24gZm9yIHRoZSBwb2ludGVyIGlzIHRoZSBtaWRkbGUgb2YgdGhlIGxpc3RcbiAgICAgICAgICAgICAgICBtaWRkbGUsIE1hdGguYWJzKGFjdGl2ZSAtIGxhc3RBY3RpdmUpID09PSAxXG4gICAgICAgICAgICAgICAgICAgID8gTWF0aC5taW4oXG4gICAgICAgICAgICAgICAgICAgIC8vIE1vdmUgdGhlIHBvaW50ZXIgYXQgbW9zdCB0aGUgaGVpZ2h0IG9mIHRoZSBsYXN0IGFjdGl2ZSBpdGVtLlxuICAgICAgICAgICAgICAgICAgICBsYXN0UG9pbnRlciArIChyZW5kZXJlZEl0ZW1zW2xhc3RBY3RpdmVdPy5sZW5ndGggPz8gMCksIFxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdXNlciBtb3ZlZCBieSBvbmUgaXRlbSwgbW92ZSB0aGUgcG9pbnRlciB0byB0aGUgbmF0dXJhbCBwb3NpdGlvbiBvZiB0aGUgYWN0aXZlIGl0ZW0gYXNcbiAgICAgICAgICAgICAgICAgICAgLy8gbG9uZyBhcyBpdCBkb2Vzbid0IG1vdmUgdGhlIGN1cnNvciB1cC5cbiAgICAgICAgICAgICAgICAgICAgTWF0aC5tYXgoZGVmYXVsdFBvaW50ZXJQb3NpdGlvbiwgbGFzdFBvaW50ZXIpKVxuICAgICAgICAgICAgICAgICAgICA6IC8vIE90aGVyd2lzZSwgbW92ZSB0aGUgcG9pbnRlciBkb3duIGJ5IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGFjdGl2ZSBhbmQgbGFzdCBhY3RpdmUgaXRlbS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQb2ludGVyICsgYWN0aXZlIC0gbGFzdEFjdGl2ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIENyZWF0ZXMgdGhlIG5leHQgcG9zaXRpb24gZm9yIHRoZSBwb2ludGVyIGNvbnNpZGVyaW5nIGEgZmluaXRlIGxpc3Qgb2ZcbiAgICAgICAgICAgICAqIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIG9uIGEgcGFnZS5cbiAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgKiBUaGUgZ29hbCBpcyB0byBrZWVwIHRoZSBwb2ludGVyIGluIHRoZSBtaWRkbGUgb2YgdGhlIHBhZ2Ugd2hlbmV2ZXIgcG9zc2libGUsIHVudGlsXG4gICAgICAgICAgICAgKiB3ZSByZWFjaCB0aGUgYm91bmRzIG9mIHRoZSBsaXN0ICh0b3Agb3IgYm90dG9tKS4gSW4gd2hpY2ggY2FzZSwgdGhlIGN1cnNvciBtb3ZlcyBwcm9ncmVzc2l2ZWx5XG4gICAgICAgICAgICAgKiB0byB0aGUgYm90dG9tIG9yIHRvcCBvZiB0aGUgbGlzdC5cbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgY29uc3Qgc3BhY2VVbmRlckFjdGl2ZSA9IHJlbmRlcmVkSXRlbXNcbiAgICAgICAgICAgICAgICAuc2xpY2UoYWN0aXZlKVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywgaXRlbSkgPT4gYWNjICsgaXRlbS5sZW5ndGgsIDApO1xuICAgICAgICAgICAgcG9pbnRlciA9XG4gICAgICAgICAgICAgICAgc3BhY2VVbmRlckFjdGl2ZSA8IHBhZ2VTaXplIC0gbWlkZGxlXG4gICAgICAgICAgICAgICAgICAgID8gLy8gSWYgdGhlIGFjdGl2ZSBpdGVtIGlzIG5lYXIgdGhlIGVuZCBvZiB0aGUgbGlzdCwgcHJvZ3Jlc3NpdmVseSBtb3ZlIHRoZSBjdXJzb3IgdG93YXJkcyB0aGUgZW5kLlxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemUgLSBzcGFjZVVuZGVyQWN0aXZlXG4gICAgICAgICAgICAgICAgICAgIDogLy8gT3RoZXJ3aXNlLCBwcm9ncmVzc2l2ZWx5IG1vdmUgdGhlIHBvaW50ZXIgdG8gdGhlIG1pZGRsZSBvZiB0aGUgbGlzdC5cbiAgICAgICAgICAgICAgICAgICAgICAgIE1hdGgubWluKGRlZmF1bHRQb2ludGVyUG9zaXRpb24sIG1pZGRsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gU2F2ZSBzdGF0ZSBmb3IgdGhlIG5leHQgcmVuZGVyXG4gICAgc3RhdGUuY3VycmVudC5sYXN0UG9pbnRlciA9IHBvaW50ZXI7XG4gICAgc3RhdGUuY3VycmVudC5sYXN0QWN0aXZlID0gYWN0aXZlO1xuICAgIHJldHVybiBwb2ludGVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHVzZVBhZ2luYXRpb24oeyBpdGVtcywgYWN0aXZlLCByZW5kZXJJdGVtLCBwYWdlU2l6ZSwgbG9vcCA9IHRydWUsIH0pIHtcbiAgICBjb25zdCB3aWR0aCA9IHJlYWRsaW5lV2lkdGgoKTtcbiAgICBjb25zdCBib3VuZCA9IChudW0pID0+ICgobnVtICUgaXRlbXMubGVuZ3RoKSArIGl0ZW1zLmxlbmd0aCkgJSBpdGVtcy5sZW5ndGg7XG4gICAgY29uc3QgcmVuZGVyZWRJdGVtcyA9IGl0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgcmV0dXJuIGJyZWFrTGluZXMocmVuZGVySXRlbSh7IGl0ZW0sIGluZGV4LCBpc0FjdGl2ZTogaW5kZXggPT09IGFjdGl2ZSB9KSwgd2lkdGgpLnNwbGl0KCdcXG4nKTtcbiAgICB9KTtcbiAgICBjb25zdCByZW5kZXJlZExlbmd0aCA9IHJlbmRlcmVkSXRlbXMucmVkdWNlKChhY2MsIGl0ZW0pID0+IGFjYyArIGl0ZW0ubGVuZ3RoLCAwKTtcbiAgICBjb25zdCByZW5kZXJJdGVtQXRJbmRleCA9IChpbmRleCkgPT4gcmVuZGVyZWRJdGVtc1tpbmRleF0gPz8gW107XG4gICAgY29uc3QgcG9pbnRlciA9IHVzZVBvaW50ZXJQb3NpdGlvbih7IGFjdGl2ZSwgcmVuZGVyZWRJdGVtcywgcGFnZVNpemUsIGxvb3AgfSk7XG4gICAgLy8gUmVuZGVyIHRoZSBhY3RpdmUgaXRlbSB0byBkZWNpZGUgdGhlIHBvc2l0aW9uLlxuICAgIC8vIElmIHRoZSBhY3RpdmUgaXRlbSBmaXRzIHVuZGVyIHRoZSBwb2ludGVyLCB3ZSByZW5kZXIgaXQgdGhlcmUuXG4gICAgLy8gT3RoZXJ3aXNlLCB3ZSBuZWVkIHRvIHJlbmRlciBpdCB0byBmaXQgYXQgdGhlIGJvdHRvbSBvZiB0aGUgcGFnZTsgbW92aW5nIHRoZSBwb2ludGVyIHVwLlxuICAgIGNvbnN0IGFjdGl2ZUl0ZW0gPSByZW5kZXJJdGVtQXRJbmRleChhY3RpdmUpLnNsaWNlKDAsIHBhZ2VTaXplKTtcbiAgICBjb25zdCBhY3RpdmVJdGVtUG9zaXRpb24gPSBwb2ludGVyICsgYWN0aXZlSXRlbS5sZW5ndGggPD0gcGFnZVNpemUgPyBwb2ludGVyIDogcGFnZVNpemUgLSBhY3RpdmVJdGVtLmxlbmd0aDtcbiAgICAvLyBDcmVhdGUgYW4gYXJyYXkgb2YgbGluZXMgZm9yIHRoZSBwYWdlLCBhbmQgYWRkIHRoZSBsaW5lcyBvZiB0aGUgYWN0aXZlIGl0ZW0gaW50byB0aGUgcGFnZVxuICAgIGNvbnN0IHBhZ2VCdWZmZXIgPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiBwYWdlU2l6ZSB9KTtcbiAgICBwYWdlQnVmZmVyLnNwbGljZShhY3RpdmVJdGVtUG9zaXRpb24sIGFjdGl2ZUl0ZW0ubGVuZ3RoLCAuLi5hY3RpdmVJdGVtKTtcbiAgICAvLyBTdG9yZSB0byBwcmV2ZW50IHJlbmRlcmluZyB0aGUgc2FtZSBpdGVtIHR3aWNlXG4gICAgY29uc3QgaXRlbVZpc2l0ZWQgPSBuZXcgU2V0KFthY3RpdmVdKTtcbiAgICAvLyBGaWxsIHRoZSBwYWdlIHVuZGVyIHRoZSBhY3RpdmUgaXRlbVxuICAgIGxldCBidWZmZXJQb2ludGVyID0gYWN0aXZlSXRlbVBvc2l0aW9uICsgYWN0aXZlSXRlbS5sZW5ndGg7XG4gICAgbGV0IGl0ZW1Qb2ludGVyID0gYm91bmQoYWN0aXZlICsgMSk7XG4gICAgd2hpbGUgKGJ1ZmZlclBvaW50ZXIgPCBwYWdlU2l6ZSAmJlxuICAgICAgICAhaXRlbVZpc2l0ZWQuaGFzKGl0ZW1Qb2ludGVyKSAmJlxuICAgICAgICAobG9vcCAmJiByZW5kZXJlZExlbmd0aCA+IHBhZ2VTaXplID8gaXRlbVBvaW50ZXIgIT09IGFjdGl2ZSA6IGl0ZW1Qb2ludGVyID4gYWN0aXZlKSkge1xuICAgICAgICBjb25zdCBsaW5lcyA9IHJlbmRlckl0ZW1BdEluZGV4KGl0ZW1Qb2ludGVyKTtcbiAgICAgICAgY29uc3QgbGluZXNUb0FkZCA9IGxpbmVzLnNsaWNlKDAsIHBhZ2VTaXplIC0gYnVmZmVyUG9pbnRlcik7XG4gICAgICAgIHBhZ2VCdWZmZXIuc3BsaWNlKGJ1ZmZlclBvaW50ZXIsIGxpbmVzVG9BZGQubGVuZ3RoLCAuLi5saW5lc1RvQWRkKTtcbiAgICAgICAgLy8gTW92ZSBwb2ludGVycyBmb3IgbmV4dCBpdGVyYXRpb25cbiAgICAgICAgaXRlbVZpc2l0ZWQuYWRkKGl0ZW1Qb2ludGVyKTtcbiAgICAgICAgYnVmZmVyUG9pbnRlciArPSBsaW5lc1RvQWRkLmxlbmd0aDtcbiAgICAgICAgaXRlbVBvaW50ZXIgPSBib3VuZChpdGVtUG9pbnRlciArIDEpO1xuICAgIH1cbiAgICAvLyBGaWxsIHRoZSBwYWdlIG92ZXIgdGhlIGFjdGl2ZSBpdGVtXG4gICAgYnVmZmVyUG9pbnRlciA9IGFjdGl2ZUl0ZW1Qb3NpdGlvbiAtIDE7XG4gICAgaXRlbVBvaW50ZXIgPSBib3VuZChhY3RpdmUgLSAxKTtcbiAgICB3aGlsZSAoYnVmZmVyUG9pbnRlciA+PSAwICYmXG4gICAgICAgICFpdGVtVmlzaXRlZC5oYXMoaXRlbVBvaW50ZXIpICYmXG4gICAgICAgIChsb29wICYmIHJlbmRlcmVkTGVuZ3RoID4gcGFnZVNpemUgPyBpdGVtUG9pbnRlciAhPT0gYWN0aXZlIDogaXRlbVBvaW50ZXIgPCBhY3RpdmUpKSB7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gcmVuZGVySXRlbUF0SW5kZXgoaXRlbVBvaW50ZXIpO1xuICAgICAgICBjb25zdCBsaW5lc1RvQWRkID0gbGluZXMuc2xpY2UoTWF0aC5tYXgoMCwgbGluZXMubGVuZ3RoIC0gYnVmZmVyUG9pbnRlciAtIDEpKTtcbiAgICAgICAgcGFnZUJ1ZmZlci5zcGxpY2UoYnVmZmVyUG9pbnRlciAtIGxpbmVzVG9BZGQubGVuZ3RoICsgMSwgbGluZXNUb0FkZC5sZW5ndGgsIC4uLmxpbmVzVG9BZGQpO1xuICAgICAgICAvLyBNb3ZlIHBvaW50ZXJzIGZvciBuZXh0IGl0ZXJhdGlvblxuICAgICAgICBpdGVtVmlzaXRlZC5hZGQoaXRlbVBvaW50ZXIpO1xuICAgICAgICBidWZmZXJQb2ludGVyIC09IGxpbmVzVG9BZGQubGVuZ3RoO1xuICAgICAgICBpdGVtUG9pbnRlciA9IGJvdW5kKGl0ZW1Qb2ludGVyIC0gMSk7XG4gICAgfVxuICAgIHJldHVybiBwYWdlQnVmZmVyLmZpbHRlcigobGluZSkgPT4gdHlwZW9mIGxpbmUgPT09ICdzdHJpbmcnKS5qb2luKCdcXG4nKTtcbn1cbiIsICJpbXBvcnQgKiBhcyByZWFkbGluZSBmcm9tICdub2RlOnJlYWRsaW5lJztcbmltcG9ydCB7IEFzeW5jUmVzb3VyY2UgfSBmcm9tICdub2RlOmFzeW5jX2hvb2tzJztcbmltcG9ydCBNdXRlU3RyZWFtIGZyb20gJ211dGUtc3RyZWFtJztcbmltcG9ydCB7IG9uRXhpdCBhcyBvblNpZ25hbEV4aXQgfSBmcm9tICdzaWduYWwtZXhpdCc7XG5pbXBvcnQgU2NyZWVuTWFuYWdlciBmcm9tIFwiLi9zY3JlZW4tbWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgUHJvbWlzZVBvbHlmaWxsIH0gZnJvbSBcIi4vcHJvbWlzZS1wb2x5ZmlsbC5qc1wiO1xuaW1wb3J0IHsgd2l0aEhvb2tzLCBlZmZlY3RTY2hlZHVsZXIgfSBmcm9tIFwiLi9ob29rLWVuZ2luZS5qc1wiO1xuaW1wb3J0IHsgQWJvcnRQcm9tcHRFcnJvciwgQ2FuY2VsUHJvbXB0RXJyb3IsIEV4aXRQcm9tcHRFcnJvciB9IGZyb20gXCIuL2Vycm9ycy5qc1wiO1xuLy8gQ2FwdHVyZSB0aGUgcmVhbCBzZXRJbW1lZGlhdGUgYXQgbW9kdWxlIGxvYWQgdGltZSBzbyBpdCB3b3JrcyBldmVuIHdoZW4gdGVzdFxuLy8gZnJhbWV3b3JrcyBtb2NrIHRpbWVycyB3aXRoIHZpLnVzZUZha2VUaW1lcnMoKSBvciBzaW1pbGFyLlxuY29uc3QgbmF0aXZlU2V0SW1tZWRpYXRlID0gZ2xvYmFsVGhpcy5zZXRJbW1lZGlhdGU7XG5mdW5jdGlvbiBnZXRDYWxsU2l0ZXMoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC91bmJvdW5kLW1ldGhvZFxuICAgIGNvbnN0IF9wcmVwYXJlU3RhY2tUcmFjZSA9IEVycm9yLnByZXBhcmVTdGFja1RyYWNlO1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICB0cnkge1xuICAgICAgICBFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IChfLCBjYWxsU2l0ZXMpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxTaXRlc1dpdGhvdXRDdXJyZW50ID0gY2FsbFNpdGVzLnNsaWNlKDEpO1xuICAgICAgICAgICAgcmVzdWx0ID0gY2FsbFNpdGVzV2l0aG91dEN1cnJlbnQ7XG4gICAgICAgICAgICByZXR1cm4gY2FsbFNpdGVzV2l0aG91dEN1cnJlbnQ7XG4gICAgICAgIH07XG4gICAgICAgIC8vIG94bGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgICAgbmV3IEVycm9yKCkuc3RhY2s7XG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgICAgLy8gQW4gZXJyb3Igd2lsbCBvY2N1ciBpZiB0aGUgTm9kZSBmbGFnIC0tZnJvemVuLWludHJpbnNpY3MgaXMgdXNlZC5cbiAgICAgICAgLy8gaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9jbGkuaHRtbCMtLWZyb3plbi1pbnRyaW5zaWNzXG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIEVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gX3ByZXBhcmVTdGFja1RyYWNlO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUHJvbXB0KHZpZXcpIHtcbiAgICBjb25zdCBjYWxsU2l0ZXMgPSBnZXRDYWxsU2l0ZXMoKTtcbiAgICBjb25zdCBwcm9tcHQgPSAoY29uZmlnLCBjb250ZXh0ID0ge30pID0+IHtcbiAgICAgICAgLy8gRGVmYXVsdCBgaW5wdXRgIHRvIHN0ZGluXG4gICAgICAgIGNvbnN0IHsgaW5wdXQgPSBwcm9jZXNzLnN0ZGluLCBzaWduYWwgfSA9IGNvbnRleHQ7XG4gICAgICAgIGNvbnN0IGNsZWFudXBzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBBZGQgbXV0ZSBjYXBhYmlsaXRpZXMgdG8gdGhlIG91dHB1dFxuICAgICAgICBjb25zdCBvdXRwdXQgPSBuZXcgTXV0ZVN0cmVhbSgpO1xuICAgICAgICBvdXRwdXQucGlwZShjb250ZXh0Lm91dHB1dCA/PyBwcm9jZXNzLnN0ZG91dCk7XG4gICAgICAgIC8vIFByZS1tdXRlIHRoZSBvdXRwdXQgc28gdGhhdCByZWFkbGluZSBkb2Vzbid0IGVjaG8gc3RhbGUga2V5c3Ryb2tlc1xuICAgICAgICAvLyB0byB0aGUgdGVybWluYWwgYmVmb3JlIHRoZSBmaXJzdCByZW5kZXIuIFNjcmVlbk1hbmFnZXIgd2lsbCB1bm11dGUvbXV0ZVxuICAgICAgICAvLyB0aGUgb3V0cHV0IGFyb3VuZCBlYWNoIHJlbmRlciBjYWxsIGFzIG5lZWRlZC5cbiAgICAgICAgb3V0cHV0Lm11dGUoKTtcbiAgICAgICAgY29uc3QgcmwgPSByZWFkbGluZS5jcmVhdGVJbnRlcmZhY2Uoe1xuICAgICAgICAgICAgdGVybWluYWw6IHRydWUsXG4gICAgICAgICAgICBpbnB1dCxcbiAgICAgICAgICAgIG91dHB1dCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNjcmVlbiA9IG5ldyBTY3JlZW5NYW5hZ2VyKHJsKTtcbiAgICAgICAgY29uc3QgeyBwcm9taXNlLCByZXNvbHZlLCByZWplY3QgfSA9IFByb21pc2VQb2x5ZmlsbC53aXRoUmVzb2x2ZXIoKTtcbiAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVqZWN0KG5ldyBDYW5jZWxQcm9tcHRFcnJvcigpKTtcbiAgICAgICAgaWYgKHNpZ25hbCkge1xuICAgICAgICAgICAgY29uc3QgYWJvcnQgPSAoKSA9PiByZWplY3QobmV3IEFib3J0UHJvbXB0RXJyb3IoeyBjYXVzZTogc2lnbmFsLnJlYXNvbiB9KSk7XG4gICAgICAgICAgICBpZiAoc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBhYm9ydCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHByb21pc2UsIHsgY2FuY2VsIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgYWJvcnQpO1xuICAgICAgICAgICAgY2xlYW51cHMuYWRkKCgpID0+IHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0KSk7XG4gICAgICAgIH1cbiAgICAgICAgY2xlYW51cHMuYWRkKG9uU2lnbmFsRXhpdCgoY29kZSwgc2lnbmFsKSA9PiB7XG4gICAgICAgICAgICByZWplY3QobmV3IEV4aXRQcm9tcHRFcnJvcihgVXNlciBmb3JjZSBjbG9zZWQgdGhlIHByb21wdCB3aXRoICR7Y29kZX0gJHtzaWduYWx9YCkpO1xuICAgICAgICB9KSk7XG4gICAgICAgIC8vIFNJR0lOVCBtdXN0IGJlIGV4cGxpY2l0bHkgaGFuZGxlZCBieSB0aGUgcHJvbXB0IHNvIHRoZSBFeGl0UHJvbXB0RXJyb3IgY2FuIGJlIGhhbmRsZWQuXG4gICAgICAgIC8vIE90aGVyd2lzZSwgdGhlIHByb21wdCB3aWxsIHN0b3AgYW5kIGluIHNvbWUgc2NlbmFyaW9zIG5ldmVyIHJlc29sdmUuXG4gICAgICAgIC8vIFJlZiBpc3N1ZSAjMTc0MVxuICAgICAgICBjb25zdCBzaWdpbnQgPSAoKSA9PiByZWplY3QobmV3IEV4aXRQcm9tcHRFcnJvcihgVXNlciBmb3JjZSBjbG9zZWQgdGhlIHByb21wdCB3aXRoIFNJR0lOVGApKTtcbiAgICAgICAgcmwub24oJ1NJR0lOVCcsIHNpZ2ludCk7XG4gICAgICAgIGNsZWFudXBzLmFkZCgoKSA9PiBybC5yZW1vdmVMaXN0ZW5lcignU0lHSU5UJywgc2lnaW50KSk7XG4gICAgICAgIHJldHVybiB3aXRoSG9va3MocmwsIChjeWNsZSkgPT4ge1xuICAgICAgICAgICAgLy8gVGhlIGNsb3NlIGV2ZW50IHRyaWdnZXJzIGltbWVkaWF0ZWx5IHdoZW4gdGhlIHVzZXIgcHJlc3MgY3RybCtjLiBTaWduYWxFeGl0IG9uIHRoZSBvdGhlciBoYW5kXG4gICAgICAgICAgICAvLyB0cmlnZ2VycyBhZnRlciB0aGUgcHJvY2VzcyBpcyBkb25lICh3aGljaCBoYXBwZW5zIGFmdGVyIHRpbWVvdXRzIGFyZSBkb25lIHRyaWdnZXJpbmcuKVxuICAgICAgICAgICAgLy8gV2UgdHJpZ2dlcnMgdGhlIGhvb2tzIGNsZWFudXAgcGhhc2Ugb24gcmwgYGNsb3NlYCBzbyBhY3RpdmUgdGltZW91dHMgY2FuIGJlIGNsZWFyZWQuXG4gICAgICAgICAgICBjb25zdCBob29rc0NsZWFudXAgPSBBc3luY1Jlc291cmNlLmJpbmQoKCkgPT4gZWZmZWN0U2NoZWR1bGVyLmNsZWFyQWxsKCkpO1xuICAgICAgICAgICAgcmwub24oJ2Nsb3NlJywgaG9va3NDbGVhbnVwKTtcbiAgICAgICAgICAgIGNsZWFudXBzLmFkZCgoKSA9PiBybC5yZW1vdmVMaXN0ZW5lcignY2xvc2UnLCBob29rc0NsZWFudXApKTtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0Q3ljbGUgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gUmUtcmVuZGVycyBvbmx5IGhhcHBlbiB3aGVuIHRoZSBzdGF0ZSBjaGFuZ2U7IGJ1dCB0aGUgcmVhZGxpbmUgY3Vyc29yIGNvdWxkXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIHBvc2l0aW9uIGFuZCB0aGF0IGFsc28gcmVxdWlyZXMgYSByZS1yZW5kZXIgKGFuZCBhIG1hbnVhbCBvbmUgYmVjYXVzZVxuICAgICAgICAgICAgICAgIC8vIHdlIG11dGUgdGhlIHN0cmVhbXMpLiBXZSBzZXQgdGhlIGxpc3RlbmVyIGFmdGVyIHRoZSBpbml0aWFsIHdvcmtMb29wIHRvIGF2b2lkXG4gICAgICAgICAgICAgICAgLy8gYSBkb3VibGUgcmVuZGVyIGlmIHJlbmRlciB0cmlnZ2VyZWQgYnkgYSBzdGF0ZSBjaGFuZ2Ugc2V0cyB0aGUgY3Vyc29yIHRvIHRoZVxuICAgICAgICAgICAgICAgIC8vIHJpZ2h0IHBvc2l0aW9uLlxuICAgICAgICAgICAgICAgIGNvbnN0IGNoZWNrQ3Vyc29yUG9zID0gKCkgPT4gc2NyZWVuLmNoZWNrQ3Vyc29yUG9zKCk7XG4gICAgICAgICAgICAgICAgcmwuaW5wdXQub24oJ2tleXByZXNzJywgY2hlY2tDdXJzb3JQb3MpO1xuICAgICAgICAgICAgICAgIGNsZWFudXBzLmFkZCgoKSA9PiBybC5pbnB1dC5yZW1vdmVMaXN0ZW5lcigna2V5cHJlc3MnLCBjaGVja0N1cnNvclBvcykpO1xuICAgICAgICAgICAgICAgIGN5Y2xlKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5leHRWaWV3ID0gdmlldyhjb25maWcsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZSgoKSA9PiByZXNvbHZlKHZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFR5cGVzY3JpcHQgd29uJ3QgYWxsb3cgdGhpcywgYnV0IG5vdCBhbGwgdXNlcnMgcmVseSBvbiB0eXBlc2NyaXB0LlxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS1jb25kaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChuZXh0VmlldyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGVyRmlsZW5hbWUgPSBjYWxsU2l0ZXNbMV0/LmdldEZpbGVOYW1lKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQcm9tcHQgZnVuY3Rpb25zIG11c3QgcmV0dXJuIGEgc3RyaW5nLlxcbiAgICBhdCAke2NhbGxlckZpbGVuYW1lfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgW2NvbnRlbnQsIGJvdHRvbUNvbnRlbnRdID0gdHlwZW9mIG5leHRWaWV3ID09PSAnc3RyaW5nJyA/IFtuZXh0Vmlld10gOiBuZXh0VmlldztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcmVlbi5yZW5kZXIoY29udGVudCwgYm90dG9tQ29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RTY2hlZHVsZXIucnVuKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gUHJvcGVyIFJlYWRhYmxlIHN0cmVhbXMgKGxpa2UgcHJvY2Vzcy5zdGRpbikgbWF5IGhhdmUgT1MtbGV2ZWwgYnVmZmVyZWRcbiAgICAgICAgICAgIC8vIGRhdGEgdGhhdCBhcnJpdmVzIGluIHRoZSBwb2xsIHBoYXNlIHdoZW4gcmVhZGxpbmUgcmVzdW1lcyB0aGUgc3RyZWFtLlxuICAgICAgICAgICAgLy8gRGVmZXJyaW5nIHRoZSBmaXJzdCByZW5kZXIgYnkgb25lIHNldEltbWVkaWF0ZSB0aWNrIChjaGVjayBwaGFzZSwgYWZ0ZXJcbiAgICAgICAgICAgIC8vIHBvbGwpIGxldHMgdGhhdCBzdGFsZSBkYXRhIGZsb3cgdGhyb3VnaCByZWFkbGluZSBoYXJtbGVzc2x5XHUyMDE0bm8ga2V5cHJlc3NcbiAgICAgICAgICAgIC8vIGhhbmRsZXJzIGFyZSByZWdpc3RlcmVkIHlldCBhbmQgdGhlIG91dHB1dCBpcyBtdXRlZCwgc28gdGhlIHN0YWxlXG4gICAgICAgICAgICAvLyBrZXlzdHJva2VzIGFyZSBzaWxlbnRseSBkaXNjYXJkZWQuXG4gICAgICAgICAgICAvLyBPbGQtc3R5bGUgc3RyZWFtcyAobGlrZSBNdXRlU3RyZWFtKSBoYXZlIG5vIHN1Y2ggYnVmZmVyaW5nLCBzbyB0aGVcbiAgICAgICAgICAgIC8vIHJlbmRlciBjeWNsZSBzdGFydHMgaW1tZWRpYXRlbHkuXG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vU0JvdWRyaWFzL0lucXVpcmVyLmpzL2lzc3Vlcy8xMzAzXG4gICAgICAgICAgICBpZiAoJ3JlYWRhYmxlRmxvd2luZycgaW4gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICBuYXRpdmVTZXRJbW1lZGlhdGUoc3RhcnRDeWNsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdGFydEN5Y2xlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihwcm9taXNlXG4gICAgICAgICAgICAgICAgLnRoZW4oKGFuc3dlcikgPT4ge1xuICAgICAgICAgICAgICAgIGVmZmVjdFNjaGVkdWxlci5jbGVhckFsbCgpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhbnN3ZXI7XG4gICAgICAgICAgICB9LCAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBlZmZlY3RTY2hlZHVsZXIuY2xlYXJBbGwoKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLy8gV2FpdCBmb3IgdGhlIHByb21pc2UgdG8gc2V0dGxlLCB0aGVuIGNsZWFudXAuXG4gICAgICAgICAgICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNsZWFudXBzLmZvckVhY2goKGNsZWFudXApID0+IGNsZWFudXAoKSk7XG4gICAgICAgICAgICAgICAgc2NyZWVuLmRvbmUoeyBjbGVhckNvbnRlbnQ6IEJvb2xlYW4oY29udGV4dC5jbGVhclByb21wdE9uRG9uZSkgfSk7XG4gICAgICAgICAgICAgICAgb3V0cHV0LmVuZCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAvLyBPbmNlIGNsZWFudXAgaXMgZG9uZSwgbGV0IHRoZSBleHBvc2UgcHJvbWlzZSByZXNvbHZlL3JlamVjdCB0byB0aGUgaW50ZXJuYWwgb25lLlxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHByb21pc2UpLCB7IGNhbmNlbCB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gcHJvbXB0O1xufVxuIiwgIi8qKlxuICogVGhpcyBpcyBub3QgdGhlIHNldCBvZiBhbGwgcG9zc2libGUgc2lnbmFscy5cbiAqXG4gKiBJdCBJUywgaG93ZXZlciwgdGhlIHNldCBvZiBhbGwgc2lnbmFscyB0aGF0IHRyaWdnZXJcbiAqIGFuIGV4aXQgb24gZWl0aGVyIExpbnV4IG9yIEJTRCBzeXN0ZW1zLiAgTGludXggaXMgYVxuICogc3VwZXJzZXQgb2YgdGhlIHNpZ25hbCBuYW1lcyBzdXBwb3J0ZWQgb24gQlNELCBhbmRcbiAqIHRoZSB1bmtub3duIHNpZ25hbHMganVzdCBmYWlsIHRvIHJlZ2lzdGVyLCBzbyB3ZSBjYW5cbiAqIGNhdGNoIHRoYXQgZWFzaWx5IGVub3VnaC5cbiAqXG4gKiBXaW5kb3dzIHNpZ25hbHMgYXJlIGEgZGlmZmVyZW50IHNldCwgc2luY2UgdGhlcmUgYXJlXG4gKiBzaWduYWxzIHRoYXQgdGVybWluYXRlIFdpbmRvd3MgcHJvY2Vzc2VzLCBidXQgZG9uJ3RcbiAqIHRlcm1pbmF0ZSAob3IgZG9uJ3QgZXZlbiBleGlzdCkgb24gUG9zaXggc3lzdGVtcy5cbiAqXG4gKiBEb24ndCBib3RoZXIgd2l0aCBTSUdLSUxMLiAgSXQncyB1bmNhdGNoYWJsZSwgd2hpY2hcbiAqIG1lYW5zIHRoYXQgd2UgY2FuJ3QgZmlyZSBhbnkgY2FsbGJhY2tzIGFueXdheS5cbiAqXG4gKiBJZiBhIHVzZXIgZG9lcyBoYXBwZW4gdG8gcmVnaXN0ZXIgYSBoYW5kbGVyIG9uIGEgbm9uLVxuICogZmF0YWwgc2lnbmFsIGxpa2UgU0lHV0lOQ0ggb3Igc29tZXRoaW5nLCBhbmQgdGhlblxuICogZXhpdCwgaXQnbGwgZW5kIHVwIGZpcmluZyBgcHJvY2Vzcy5lbWl0KCdleGl0JylgLCBzb1xuICogdGhlIGhhbmRsZXIgd2lsbCBiZSBmaXJlZCBhbnl3YXkuXG4gKlxuICogU0lHQlVTLCBTSUdGUEUsIFNJR1NFR1YgYW5kIFNJR0lMTCwgd2hlbiBub3QgcmFpc2VkXG4gKiBhcnRpZmljaWFsbHksIGluaGVyZW50bHkgbGVhdmUgdGhlIHByb2Nlc3MgaW4gYVxuICogc3RhdGUgZnJvbSB3aGljaCBpdCBpcyBub3Qgc2FmZSB0byB0cnkgYW5kIGVudGVyIEpTXG4gKiBsaXN0ZW5lcnMuXG4gKi9cbmV4cG9ydCBjb25zdCBzaWduYWxzOiBOb2RlSlMuU2lnbmFsc1tdID0gW11cbnNpZ25hbHMucHVzaCgnU0lHSFVQJywgJ1NJR0lOVCcsICdTSUdURVJNJylcblxuaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgc2lnbmFscy5wdXNoKFxuICAgICdTSUdBTFJNJyxcbiAgICAnU0lHQUJSVCcsXG4gICAgJ1NJR1ZUQUxSTScsXG4gICAgJ1NJR1hDUFUnLFxuICAgICdTSUdYRlNaJyxcbiAgICAnU0lHVVNSMicsXG4gICAgJ1NJR1RSQVAnLFxuICAgICdTSUdTWVMnLFxuICAgICdTSUdRVUlUJyxcbiAgICAnU0lHSU9UJ1xuICAgIC8vIHNob3VsZCBkZXRlY3QgcHJvZmlsZXIgYW5kIGVuYWJsZS9kaXNhYmxlIGFjY29yZGluZ2x5LlxuICAgIC8vIHNlZSAjMjFcbiAgICAvLyAnU0lHUFJPRidcbiAgKVxufVxuXG5pZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jykge1xuICBzaWduYWxzLnB1c2goJ1NJR0lPJywgJ1NJR1BPTEwnLCAnU0lHUFdSJywgJ1NJR1NUS0ZMVCcpXG59XG4iLCAiLy8gTm90ZTogc2luY2UgbnljIHVzZXMgdGhpcyBtb2R1bGUgdG8gb3V0cHV0IGNvdmVyYWdlLCBhbnkgbGluZXNcbi8vIHRoYXQgYXJlIGluIHRoZSBkaXJlY3Qgc3luYyBmbG93IG9mIG55YydzIG91dHB1dENvdmVyYWdlIGFyZVxuLy8gaWdub3JlZCwgc2luY2Ugd2UgY2FuIG5ldmVyIGdldCBjb3ZlcmFnZSBmb3IgdGhlbS5cbi8vIGdyYWIgYSByZWZlcmVuY2UgdG8gbm9kZSdzIHJlYWwgcHJvY2VzcyBvYmplY3QgcmlnaHQgYXdheVxuaW1wb3J0IHsgc2lnbmFscyB9IGZyb20gJy4vc2lnbmFscy5qcydcbmV4cG9ydCB7IHNpZ25hbHMgfVxuXG4vLyBqdXN0IGEgbG9vc2VuZWQgcHJvY2VzcyB0eXBlIHNvIHdlIGNhbiBkbyBzb21lIGV2aWwgdGhpbmdzXG50eXBlIFByb2Nlc3NSRSA9IE5vZGVKUy5Qcm9jZXNzICYge1xuICByZWFsbHlFeGl0OiAoY29kZT86IG51bWJlciB8IHVuZGVmaW5lZCB8IG51bGwpID0+IGFueVxuICBlbWl0OiAoZXY6IHN0cmluZywgLi4uYTogYW55W10pID0+IGFueVxufVxuXG5jb25zdCBwcm9jZXNzT2sgPSAocHJvY2VzczogYW55KTogcHJvY2VzcyBpcyBQcm9jZXNzUkUgPT5cbiAgISFwcm9jZXNzICYmXG4gIHR5cGVvZiBwcm9jZXNzID09PSAnb2JqZWN0JyAmJlxuICB0eXBlb2YgcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJyAmJlxuICB0eXBlb2YgcHJvY2Vzcy5lbWl0ID09PSAnZnVuY3Rpb24nICYmXG4gIHR5cGVvZiBwcm9jZXNzLnJlYWxseUV4aXQgPT09ICdmdW5jdGlvbicgJiZcbiAgdHlwZW9mIHByb2Nlc3MubGlzdGVuZXJzID09PSAnZnVuY3Rpb24nICYmXG4gIHR5cGVvZiBwcm9jZXNzLmtpbGwgPT09ICdmdW5jdGlvbicgJiZcbiAgdHlwZW9mIHByb2Nlc3MucGlkID09PSAnbnVtYmVyJyAmJlxuICB0eXBlb2YgcHJvY2Vzcy5vbiA9PT0gJ2Z1bmN0aW9uJ1xuXG5jb25zdCBrRXhpdEVtaXR0ZXIgPSBTeW1ib2wuZm9yKCdzaWduYWwtZXhpdCBlbWl0dGVyJylcbmNvbnN0IGdsb2JhbDogdHlwZW9mIGdsb2JhbFRoaXMgJiB7IFtrRXhpdEVtaXR0ZXJdPzogRW1pdHRlciB9ID0gZ2xvYmFsVGhpc1xuY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkuYmluZChPYmplY3QpXG5cbi8qKlxuICogQSBmdW5jdGlvbiB0aGF0IHRha2VzIGFuIGV4aXQgY29kZSBhbmQgc2lnbmFsIGFzIGFyZ3VtZW50c1xuICpcbiAqIEluIHRoZSBjYXNlIG9mIHNpZ25hbCBleGl0cyAqb25seSosIGEgcmV0dXJuIHZhbHVlIG9mIHRydWVcbiAqIHdpbGwgaW5kaWNhdGUgdGhhdCB0aGUgc2lnbmFsIGlzIGJlaW5nIGhhbmRsZWQsIGFuZCB3ZSBzaG91bGRcbiAqIG5vdCBzeW50aGV0aWNhbGx5IGV4aXQgd2l0aCB0aGUgc2lnbmFsIHdlIHJlY2VpdmVkLiBSZWdhcmRsZXNzXG4gKiBvZiB0aGUgaGFuZGxlciByZXR1cm4gdmFsdWUsIHRoZSBoYW5kbGVyIGlzIHVubG9hZGVkIHdoZW4gYW5cbiAqIG90aGVyd2lzZSBmYXRhbCBzaWduYWwgaXMgcmVjZWl2ZWQsIHNvIHlvdSBnZXQgZXhhY3RseSAxIHNob3RcbiAqIGF0IGl0LCB1bmxlc3MgeW91IGFkZCBhbm90aGVyIG9uRXhpdCBoYW5kbGVyIGF0IHRoYXQgcG9pbnQuXG4gKlxuICogSW4gdGhlIGNhc2Ugb2YgbnVtZXJpYyBjb2RlIGV4aXRzLCB3ZSBtYXkgYWxyZWFkeSBoYXZlIGNvbW1pdHRlZFxuICogdG8gZXhpdGluZyB0aGUgcHJvY2VzcywgZm9yIGV4YW1wbGUgdmlhIGEgZmF0YWwgZXhjZXB0aW9uIG9yXG4gKiB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24sIHNvIGl0IGlzIGltcG9zc2libGUgdG8gc3RvcCBzYWZlbHkuXG4gKi9cbmV4cG9ydCB0eXBlIEhhbmRsZXIgPSAoXG4gIGNvZGU6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gIHNpZ25hbDogTm9kZUpTLlNpZ25hbHMgfCBudWxsXG4pID0+IHRydWUgfCB2b2lkXG50eXBlIEV4aXRFdmVudCA9ICdhZnRlckV4aXQnIHwgJ2V4aXQnXG50eXBlIEVtaXR0ZWQgPSB7IFtrIGluIEV4aXRFdmVudF06IGJvb2xlYW4gfVxudHlwZSBMaXN0ZW5lcnMgPSB7IFtrIGluIEV4aXRFdmVudF06IEhhbmRsZXJbXSB9XG5cbi8vIHRlZW55IHNwZWNpYWwgcHVycG9zZSBlZVxuY2xhc3MgRW1pdHRlciB7XG4gIGVtaXR0ZWQ6IEVtaXR0ZWQgPSB7XG4gICAgYWZ0ZXJFeGl0OiBmYWxzZSxcbiAgICBleGl0OiBmYWxzZSxcbiAgfVxuXG4gIGxpc3RlbmVyczogTGlzdGVuZXJzID0ge1xuICAgIGFmdGVyRXhpdDogW10sXG4gICAgZXhpdDogW10sXG4gIH1cblxuICBjb3VudDogbnVtYmVyID0gMFxuICBpZDogbnVtYmVyID0gTWF0aC5yYW5kb20oKVxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmIChnbG9iYWxba0V4aXRFbWl0dGVyXSkge1xuICAgICAgcmV0dXJuIGdsb2JhbFtrRXhpdEVtaXR0ZXJdXG4gICAgfVxuICAgIE9iamVjdERlZmluZVByb3BlcnR5KGdsb2JhbCwga0V4aXRFbWl0dGVyLCB7XG4gICAgICB2YWx1ZTogdGhpcyxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICB9KVxuICB9XG5cbiAgb24oZXY6IEV4aXRFdmVudCwgZm46IEhhbmRsZXIpIHtcbiAgICB0aGlzLmxpc3RlbmVyc1tldl0ucHVzaChmbilcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGV2OiBFeGl0RXZlbnQsIGZuOiBIYW5kbGVyKSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMubGlzdGVuZXJzW2V2XVxuICAgIGNvbnN0IGkgPSBsaXN0LmluZGV4T2YoZm4pXG4gICAgLyogYzggaWdub3JlIHN0YXJ0ICovXG4gICAgaWYgKGkgPT09IC0xKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgLyogYzggaWdub3JlIHN0b3AgKi9cbiAgICBpZiAoaSA9PT0gMCAmJiBsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwXG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKGksIDEpXG4gICAgfVxuICB9XG5cbiAgZW1pdChcbiAgICBldjogRXhpdEV2ZW50LFxuICAgIGNvZGU6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsXG4gICAgc2lnbmFsOiBOb2RlSlMuU2lnbmFscyB8IG51bGxcbiAgKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuZW1pdHRlZFtldl0pIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICB0aGlzLmVtaXR0ZWRbZXZdID0gdHJ1ZVxuICAgIGxldCByZXQ6IGJvb2xlYW4gPSBmYWxzZVxuICAgIGZvciAoY29uc3QgZm4gb2YgdGhpcy5saXN0ZW5lcnNbZXZdKSB7XG4gICAgICByZXQgPSBmbihjb2RlLCBzaWduYWwpID09PSB0cnVlIHx8IHJldFxuICAgIH1cbiAgICBpZiAoZXYgPT09ICdleGl0Jykge1xuICAgICAgcmV0ID0gdGhpcy5lbWl0KCdhZnRlckV4aXQnLCBjb2RlLCBzaWduYWwpIHx8IHJldFxuICAgIH1cbiAgICByZXR1cm4gcmV0XG4gIH1cbn1cblxuYWJzdHJhY3QgY2xhc3MgU2lnbmFsRXhpdEJhc2Uge1xuICBhYnN0cmFjdCBvbkV4aXQoY2I6IEhhbmRsZXIsIG9wdHM/OiB7IGFsd2F5c0xhc3Q/OiBib29sZWFuIH0pOiAoKSA9PiB2b2lkXG4gIGFic3RyYWN0IGxvYWQoKTogdm9pZFxuICBhYnN0cmFjdCB1bmxvYWQoKTogdm9pZFxufVxuXG5jb25zdCBzaWduYWxFeGl0V3JhcCA9IDxUIGV4dGVuZHMgU2lnbmFsRXhpdEJhc2U+KGhhbmRsZXI6IFQpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBvbkV4aXQoY2I6IEhhbmRsZXIsIG9wdHM/OiB7IGFsd2F5c0xhc3Q/OiBib29sZWFuIH0pIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLm9uRXhpdChjYiwgb3B0cylcbiAgICB9LFxuICAgIGxvYWQoKSB7XG4gICAgICByZXR1cm4gaGFuZGxlci5sb2FkKClcbiAgICB9LFxuICAgIHVubG9hZCgpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyLnVubG9hZCgpXG4gICAgfSxcbiAgfVxufVxuXG5jbGFzcyBTaWduYWxFeGl0RmFsbGJhY2sgZXh0ZW5kcyBTaWduYWxFeGl0QmFzZSB7XG4gIG9uRXhpdCgpIHtcbiAgICByZXR1cm4gKCkgPT4ge31cbiAgfVxuICBsb2FkKCkge31cbiAgdW5sb2FkKCkge31cbn1cblxuY2xhc3MgU2lnbmFsRXhpdCBleHRlbmRzIFNpZ25hbEV4aXRCYXNlIHtcbiAgLy8gXCJTSUdIVVBcIiB0aHJvd3MgYW4gYEVOT1NZU2AgZXJyb3Igb24gV2luZG93cyxcbiAgLy8gc28gdXNlIGEgc3VwcG9ydGVkIHNpZ25hbCBpbnN0ZWFkXG4gIC8qIGM4IGlnbm9yZSBzdGFydCAqL1xuICAjaHVwU2lnID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJyA/ICdTSUdJTlQnIDogJ1NJR0hVUCdcbiAgLyogYzggaWdub3JlIHN0b3AgKi9cbiAgI2VtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICNwcm9jZXNzOiBQcm9jZXNzUkVcbiAgI29yaWdpbmFsUHJvY2Vzc0VtaXQ6IFByb2Nlc3NSRVsnZW1pdCddXG4gICNvcmlnaW5hbFByb2Nlc3NSZWFsbHlFeGl0OiBQcm9jZXNzUkVbJ3JlYWxseUV4aXQnXVxuXG4gICNzaWdMaXN0ZW5lcnM6IHsgW2sgaW4gTm9kZUpTLlNpZ25hbHNdPzogKCkgPT4gdm9pZCB9ID0ge31cbiAgI2xvYWRlZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgY29uc3RydWN0b3IocHJvY2VzczogUHJvY2Vzc1JFKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuI3Byb2Nlc3MgPSBwcm9jZXNzXG4gICAgLy8geyA8c2lnbmFsPjogPGxpc3RlbmVyIGZuPiwgLi4uIH1cbiAgICB0aGlzLiNzaWdMaXN0ZW5lcnMgPSB7fVxuICAgIGZvciAoY29uc3Qgc2lnIG9mIHNpZ25hbHMpIHtcbiAgICAgIHRoaXMuI3NpZ0xpc3RlbmVyc1tzaWddID0gKCkgPT4ge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gb3RoZXIgbGlzdGVuZXJzLCBhbiBleGl0IGlzIGNvbWluZyFcbiAgICAgICAgLy8gU2ltcGxlc3Qgd2F5OiByZW1vdmUgdXMgYW5kIHRoZW4gcmUtc2VuZCB0aGUgc2lnbmFsLlxuICAgICAgICAvLyBXZSBrbm93IHRoYXQgdGhpcyB3aWxsIGtpbGwgdGhlIHByb2Nlc3MsIHNvIHdlIGNhblxuICAgICAgICAvLyBzYWZlbHkgZW1pdCBub3cuXG4gICAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuI3Byb2Nlc3MubGlzdGVuZXJzKHNpZylcbiAgICAgICAgbGV0IHsgY291bnQgfSA9IHRoaXMuI2VtaXR0ZXJcbiAgICAgICAgLy8gVGhpcyBpcyBhIHdvcmthcm91bmQgZm9yIHRoZSBmYWN0IHRoYXQgc2lnbmFsLWV4aXQgdjMgYW5kIHNpZ25hbFxuICAgICAgICAvLyBleGl0IHY0IGFyZSBub3QgYXdhcmUgb2YgZWFjaCBvdGhlciwgYW5kIGVhY2ggd2lsbCBhdHRlbXB0IHRvIGxldFxuICAgICAgICAvLyB0aGUgb3RoZXIgaGFuZGxlIGl0LCBzbyBuZWl0aGVyIG9mIHRoZW0gZG8uIFRvIGNvcnJlY3QgdGhpcywgd2VcbiAgICAgICAgLy8gZGV0ZWN0IGlmIHdlJ3JlIHRoZSBvbmx5IGhhbmRsZXIgKmV4Y2VwdCogZm9yIHByZXZpb3VzIHZlcnNpb25zXG4gICAgICAgIC8vIG9mIHNpZ25hbC1leGl0LCBhbmQgaW5jcmVtZW50IGJ5IHRoZSBjb3VudCBvZiBsaXN0ZW5lcnMgaXQgaGFzXG4gICAgICAgIC8vIGNyZWF0ZWQuXG4gICAgICAgIC8qIGM4IGlnbm9yZSBzdGFydCAqL1xuICAgICAgICBjb25zdCBwID0gcHJvY2VzcyBhcyB1bmtub3duIGFzIHtcbiAgICAgICAgICBfX3NpZ25hbF9leGl0X2VtaXR0ZXJfXz86IHsgY291bnQ6IG51bWJlciB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFxuICAgICAgICAgIHR5cGVvZiBwLl9fc2lnbmFsX2V4aXRfZW1pdHRlcl9fID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgIHR5cGVvZiBwLl9fc2lnbmFsX2V4aXRfZW1pdHRlcl9fLmNvdW50ID09PSAnbnVtYmVyJ1xuICAgICAgICApIHtcbiAgICAgICAgICBjb3VudCArPSBwLl9fc2lnbmFsX2V4aXRfZW1pdHRlcl9fLmNvdW50XG4gICAgICAgIH1cbiAgICAgICAgLyogYzggaWdub3JlIHN0b3AgKi9cbiAgICAgICAgaWYgKGxpc3RlbmVycy5sZW5ndGggPT09IGNvdW50KSB7XG4gICAgICAgICAgdGhpcy51bmxvYWQoKVxuICAgICAgICAgIGNvbnN0IHJldCA9IHRoaXMuI2VtaXR0ZXIuZW1pdCgnZXhpdCcsIG51bGwsIHNpZylcbiAgICAgICAgICAvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbiAgICAgICAgICBjb25zdCBzID0gc2lnID09PSAnU0lHSFVQJyA/IHRoaXMuI2h1cFNpZyA6IHNpZ1xuICAgICAgICAgIGlmICghcmV0KSBwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQsIHMpXG4gICAgICAgICAgLyogYzggaWdub3JlIHN0b3AgKi9cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuI29yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXQgPSBwcm9jZXNzLnJlYWxseUV4aXRcbiAgICB0aGlzLiNvcmlnaW5hbFByb2Nlc3NFbWl0ID0gcHJvY2Vzcy5lbWl0XG4gIH1cblxuICBvbkV4aXQoY2I6IEhhbmRsZXIsIG9wdHM/OiB7IGFsd2F5c0xhc3Q/OiBib29sZWFuIH0pIHtcbiAgICAvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbiAgICBpZiAoIXByb2Nlc3NPayh0aGlzLiNwcm9jZXNzKSkge1xuICAgICAgcmV0dXJuICgpID0+IHt9XG4gICAgfVxuICAgIC8qIGM4IGlnbm9yZSBzdG9wICovXG5cbiAgICBpZiAodGhpcy4jbG9hZGVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5sb2FkKClcbiAgICB9XG5cbiAgICBjb25zdCBldiA9IG9wdHM/LmFsd2F5c0xhc3QgPyAnYWZ0ZXJFeGl0JyA6ICdleGl0J1xuICAgIHRoaXMuI2VtaXR0ZXIub24oZXYsIGNiKVxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLiNlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKGV2LCBjYilcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy4jZW1pdHRlci5saXN0ZW5lcnNbJ2V4aXQnXS5sZW5ndGggPT09IDAgJiZcbiAgICAgICAgdGhpcy4jZW1pdHRlci5saXN0ZW5lcnNbJ2FmdGVyRXhpdCddLmxlbmd0aCA9PT0gMFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMudW5sb2FkKClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsb2FkKCkge1xuICAgIGlmICh0aGlzLiNsb2FkZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLiNsb2FkZWQgPSB0cnVlXG5cbiAgICAvLyBUaGlzIGlzIHRoZSBudW1iZXIgb2Ygb25TaWduYWxFeGl0J3MgdGhhdCBhcmUgaW4gcGxheS5cbiAgICAvLyBJdCdzIGltcG9ydGFudCBzbyB0aGF0IHdlIGNhbiBjb3VudCB0aGUgY29ycmVjdCBudW1iZXIgb2ZcbiAgICAvLyBsaXN0ZW5lcnMgb24gc2lnbmFscywgYW5kIGRvbid0IHdhaXQgZm9yIHRoZSBvdGhlciBvbmUgdG9cbiAgICAvLyBoYW5kbGUgaXQgaW5zdGVhZCBvZiB1cy5cbiAgICB0aGlzLiNlbWl0dGVyLmNvdW50ICs9IDFcblxuICAgIGZvciAoY29uc3Qgc2lnIG9mIHNpZ25hbHMpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGZuID0gdGhpcy4jc2lnTGlzdGVuZXJzW3NpZ11cbiAgICAgICAgaWYgKGZuKSB0aGlzLiNwcm9jZXNzLm9uKHNpZywgZm4pXG4gICAgICB9IGNhdGNoIChfKSB7fVxuICAgIH1cblxuICAgIHRoaXMuI3Byb2Nlc3MuZW1pdCA9IChldjogc3RyaW5nLCAuLi5hOiBhbnlbXSkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuI3Byb2Nlc3NFbWl0KGV2LCAuLi5hKVxuICAgIH1cbiAgICB0aGlzLiNwcm9jZXNzLnJlYWxseUV4aXQgPSAoY29kZT86IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLiNwcm9jZXNzUmVhbGx5RXhpdChjb2RlKVxuICAgIH1cbiAgfVxuXG4gIHVubG9hZCgpIHtcbiAgICBpZiAoIXRoaXMuI2xvYWRlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuI2xvYWRlZCA9IGZhbHNlXG5cbiAgICBzaWduYWxzLmZvckVhY2goc2lnID0+IHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy4jc2lnTGlzdGVuZXJzW3NpZ11cbiAgICAgIC8qIGM4IGlnbm9yZSBzdGFydCAqL1xuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0xpc3RlbmVyIG5vdCBkZWZpbmVkIGZvciBzaWduYWw6ICcgKyBzaWcpXG4gICAgICB9XG4gICAgICAvKiBjOCBpZ25vcmUgc3RvcCAqL1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy4jcHJvY2Vzcy5yZW1vdmVMaXN0ZW5lcihzaWcsIGxpc3RlbmVyKVxuICAgICAgICAvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbiAgICAgIH0gY2F0Y2ggKF8pIHt9XG4gICAgICAvKiBjOCBpZ25vcmUgc3RvcCAqL1xuICAgIH0pXG4gICAgdGhpcy4jcHJvY2Vzcy5lbWl0ID0gdGhpcy4jb3JpZ2luYWxQcm9jZXNzRW1pdFxuICAgIHRoaXMuI3Byb2Nlc3MucmVhbGx5RXhpdCA9IHRoaXMuI29yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXRcbiAgICB0aGlzLiNlbWl0dGVyLmNvdW50IC09IDFcbiAgfVxuXG4gICNwcm9jZXNzUmVhbGx5RXhpdChjb2RlPzogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCkge1xuICAgIC8qIGM4IGlnbm9yZSBzdGFydCAqL1xuICAgIGlmICghcHJvY2Vzc09rKHRoaXMuI3Byb2Nlc3MpKSB7XG4gICAgICByZXR1cm4gMFxuICAgIH1cbiAgICB0aGlzLiNwcm9jZXNzLmV4aXRDb2RlID0gY29kZSB8fCAwXG4gICAgLyogYzggaWdub3JlIHN0b3AgKi9cblxuICAgIHRoaXMuI2VtaXR0ZXIuZW1pdCgnZXhpdCcsIHRoaXMuI3Byb2Nlc3MuZXhpdENvZGUsIG51bGwpXG4gICAgcmV0dXJuIHRoaXMuI29yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXQuY2FsbChcbiAgICAgIHRoaXMuI3Byb2Nlc3MsXG4gICAgICB0aGlzLiNwcm9jZXNzLmV4aXRDb2RlXG4gICAgKVxuICB9XG5cbiAgI3Byb2Nlc3NFbWl0KGV2OiBzdHJpbmcsIC4uLmFyZ3M6IGFueVtdKTogYW55IHtcbiAgICBjb25zdCBvZyA9IHRoaXMuI29yaWdpbmFsUHJvY2Vzc0VtaXRcbiAgICBpZiAoZXYgPT09ICdleGl0JyAmJiBwcm9jZXNzT2sodGhpcy4jcHJvY2VzcykpIHtcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdGhpcy4jcHJvY2Vzcy5leGl0Q29kZSA9IGFyZ3NbMF1cbiAgICAgICAgLyogYzggaWdub3JlIHN0YXJ0ICovXG4gICAgICB9XG4gICAgICAvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbiAgICAgIGNvbnN0IHJldCA9IG9nLmNhbGwodGhpcy4jcHJvY2VzcywgZXYsIC4uLmFyZ3MpXG4gICAgICAvKiBjOCBpZ25vcmUgc3RhcnQgKi9cbiAgICAgIHRoaXMuI2VtaXR0ZXIuZW1pdCgnZXhpdCcsIHRoaXMuI3Byb2Nlc3MuZXhpdENvZGUsIG51bGwpXG4gICAgICAvKiBjOCBpZ25vcmUgc3RvcCAqL1xuICAgICAgcmV0dXJuIHJldFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2cuY2FsbCh0aGlzLiNwcm9jZXNzLCBldiwgLi4uYXJncylcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgcHJvY2VzcyA9IGdsb2JhbFRoaXMucHJvY2Vzc1xuLy8gd3JhcCBzbyB0aGF0IHdlIGNhbGwgdGhlIG1ldGhvZCBvbiB0aGUgYWN0dWFsIGhhbmRsZXIsIHdpdGhvdXRcbi8vIGV4cG9ydGluZyBpdCBkaXJlY3RseS5cbmV4cG9ydCBjb25zdCB7XG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgcHJvY2VzcyBpcyBleGl0aW5nLCB3aGV0aGVyIHZpYSBzaWduYWwsIGV4cGxpY2l0XG4gICAqIGV4aXQsIG9yIHJ1bm5pbmcgb3V0IG9mIHN0dWZmIHRvIGRvLlxuICAgKlxuICAgKiBJZiB0aGUgZ2xvYmFsIHByb2Nlc3Mgb2JqZWN0IGlzIG5vdCBzdWl0YWJsZSBmb3IgaW5zdHJ1bWVudGF0aW9uLFxuICAgKiB0aGVuIHRoaXMgd2lsbCBiZSBhIG5vLW9wLlxuICAgKlxuICAgKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBtYXkgYmUgdXNlZCB0byB1bmxvYWQgc2lnbmFsLWV4aXQuXG4gICAqL1xuICBvbkV4aXQsXG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIGxpc3RlbmVycy4gIExpa2VseSB5b3UgbmV2ZXIgbmVlZCB0byBjYWxsIHRoaXMsIHVubGVzc1xuICAgKiBkb2luZyBhIHJhdGhlciBkZWVwIGludGVncmF0aW9uIHdpdGggc2lnbmFsLWV4aXQgZnVuY3Rpb25hbGl0eS5cbiAgICogTW9zdGx5IGV4cG9zZWQgZm9yIHRoZSBiZW5lZml0IG9mIHRlc3RpbmcuXG4gICAqXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgbG9hZCxcblxuICAvKipcbiAgICogVW5sb2FkIHRoZSBsaXN0ZW5lcnMuICBMaWtlbHkgeW91IG5ldmVyIG5lZWQgdG8gY2FsbCB0aGlzLCB1bmxlc3NcbiAgICogZG9pbmcgYSByYXRoZXIgZGVlcCBpbnRlZ3JhdGlvbiB3aXRoIHNpZ25hbC1leGl0IGZ1bmN0aW9uYWxpdHkuXG4gICAqIE1vc3RseSBleHBvc2VkIGZvciB0aGUgYmVuZWZpdCBvZiB0ZXN0aW5nLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHVubG9hZCxcbn0gPSBzaWduYWxFeGl0V3JhcChcbiAgcHJvY2Vzc09rKHByb2Nlc3MpID8gbmV3IFNpZ25hbEV4aXQocHJvY2VzcykgOiBuZXcgU2lnbmFsRXhpdEZhbGxiYWNrKClcbilcbiIsICJpbXBvcnQgeyBzdHJpcFZUQ29udHJvbENoYXJhY3RlcnMgfSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IHsgYnJlYWtMaW5lcywgcmVhZGxpbmVXaWR0aCB9IGZyb20gXCIuL3V0aWxzLmpzXCI7XG5pbXBvcnQgeyBjdXJzb3JEb3duLCBjdXJzb3JVcCwgY3Vyc29yVG8sIGN1cnNvclNob3csIGVyYXNlTGluZXMgfSBmcm9tICdAaW5xdWlyZXIvYW5zaSc7XG5jb25zdCBoZWlnaHQgPSAoY29udGVudCkgPT4gY29udGVudC5zcGxpdCgnXFxuJykubGVuZ3RoO1xuY29uc3QgbGFzdExpbmUgPSAoY29udGVudCkgPT4gY29udGVudC5zcGxpdCgnXFxuJykucG9wKCkgPz8gJyc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY3JlZW5NYW5hZ2VyIHtcbiAgICAvLyBUaGVzZSB2YXJpYWJsZXMgYXJlIGtlZXBpbmcgaW5mb3JtYXRpb24gdG8gYWxsb3cgY29ycmVjdCBwcm9tcHQgcmUtcmVuZGVyaW5nXG4gICAgaGVpZ2h0ID0gMDtcbiAgICBleHRyYUxpbmVzVW5kZXJQcm9tcHQgPSAwO1xuICAgIGN1cnNvclBvcztcbiAgICBybDtcbiAgICBjb25zdHJ1Y3RvcihybCkge1xuICAgICAgICB0aGlzLnJsID0gcmw7XG4gICAgICAgIHRoaXMuY3Vyc29yUG9zID0gcmwuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgfVxuICAgIHdyaXRlKGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5ybC5vdXRwdXQudW5tdXRlKCk7XG4gICAgICAgIHRoaXMucmwub3V0cHV0LndyaXRlKGNvbnRlbnQpO1xuICAgICAgICB0aGlzLnJsLm91dHB1dC5tdXRlKCk7XG4gICAgfVxuICAgIHJlbmRlcihjb250ZW50LCBib3R0b21Db250ZW50ID0gJycpIHtcbiAgICAgICAgLy8gV3JpdGUgbWVzc2FnZSB0byBzY3JlZW4gYW5kIHNldFByb21wdCB0byBjb250cm9sIGJhY2tzcGFjZVxuICAgICAgICBjb25zdCBwcm9tcHRMaW5lID0gbGFzdExpbmUoY29udGVudCk7XG4gICAgICAgIGNvbnN0IHJhd1Byb21wdExpbmUgPSBzdHJpcFZUQ29udHJvbENoYXJhY3RlcnMocHJvbXB0TGluZSk7XG4gICAgICAgIC8vIFJlbW92ZSB0aGUgcmwubGluZSBmcm9tIG91ciBwcm9tcHQuIFdlIGNhbid0IHJlbHkgb24gdGhlIGNvbnRlbnQgb2ZcbiAgICAgICAgLy8gcmwubGluZSAobWFpbmx5IGJlY2F1c2Ugb2YgdGhlIHBhc3N3b3JkIHByb21wdCksIHNvIGp1c3QgcmVseSBvbiBpdCdzXG4gICAgICAgIC8vIGxlbmd0aC5cbiAgICAgICAgbGV0IHByb21wdCA9IHJhd1Byb21wdExpbmU7XG4gICAgICAgIGlmICh0aGlzLnJsLmxpbmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcHJvbXB0ID0gcHJvbXB0LnNsaWNlKDAsIC10aGlzLnJsLmxpbmUubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJsLnNldFByb21wdChwcm9tcHQpO1xuICAgICAgICAvLyBTZXRQcm9tcHQgd2lsbCBjaGFuZ2UgY3Vyc29yIHBvc2l0aW9uLCBub3cgd2UgY2FuIGdldCBjb3JyZWN0IHZhbHVlXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zID0gdGhpcy5ybC5nZXRDdXJzb3JQb3MoKTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSByZWFkbGluZVdpZHRoKCk7XG4gICAgICAgIGNvbnRlbnQgPSBicmVha0xpbmVzKGNvbnRlbnQsIHdpZHRoKTtcbiAgICAgICAgYm90dG9tQ29udGVudCA9IGJyZWFrTGluZXMoYm90dG9tQ29udGVudCwgd2lkdGgpO1xuICAgICAgICAvLyBNYW51YWxseSBpbnNlcnQgYW4gZXh0cmEgbGluZSBpZiB3ZSdyZSBhdCB0aGUgZW5kIG9mIHRoZSBsaW5lLlxuICAgICAgICAvLyBUaGlzIHByZXZlbnQgdGhlIGN1cnNvciBmcm9tIGFwcGVhcmluZyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZVxuICAgICAgICAvLyBjdXJyZW50IGxpbmUuXG4gICAgICAgIGlmIChyYXdQcm9tcHRMaW5lLmxlbmd0aCAlIHdpZHRoID09PSAwKSB7XG4gICAgICAgICAgICBjb250ZW50ICs9ICdcXG4nO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvdXRwdXQgPSBjb250ZW50ICsgKGJvdHRvbUNvbnRlbnQgPyAnXFxuJyArIGJvdHRvbUNvbnRlbnQgOiAnJyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZS1hZGp1c3QgdGhlIGN1cnNvciBhdCB0aGUgY29ycmVjdCBwb3NpdGlvbi5cbiAgICAgICAgICovXG4gICAgICAgIC8vIFdlIG5lZWQgdG8gY29uc2lkZXIgcGFydHMgb2YgdGhlIHByb21wdCB1bmRlciB0aGUgY3Vyc29yIGFzIHBhcnQgb2YgdGhlIGJvdHRvbVxuICAgICAgICAvLyBjb250ZW50IGluIG9yZGVyIHRvIGNvcnJlY3RseSBjbGVhbnVwIGFuZCByZS1yZW5kZXIuXG4gICAgICAgIGNvbnN0IHByb21wdExpbmVVcERpZmYgPSBNYXRoLmZsb29yKHJhd1Byb21wdExpbmUubGVuZ3RoIC8gd2lkdGgpIC0gdGhpcy5jdXJzb3JQb3Mucm93cztcbiAgICAgICAgY29uc3QgYm90dG9tQ29udGVudEhlaWdodCA9IHByb21wdExpbmVVcERpZmYgKyAoYm90dG9tQ29udGVudCA/IGhlaWdodChib3R0b21Db250ZW50KSA6IDApO1xuICAgICAgICAvLyBSZXR1cm4gY3Vyc29yIHRvIHRoZSBpbnB1dCBwb3NpdGlvbiAob24gdG9wIG9mIHRoZSBib3R0b21Db250ZW50KVxuICAgICAgICBpZiAoYm90dG9tQ29udGVudEhlaWdodCA+IDApXG4gICAgICAgICAgICBvdXRwdXQgKz0gY3Vyc29yVXAoYm90dG9tQ29udGVudEhlaWdodCk7XG4gICAgICAgIC8vIFJldHVybiBjdXJzb3IgdG8gdGhlIGluaXRpYWwgbGVmdCBvZmZzZXQuXG4gICAgICAgIG91dHB1dCArPSBjdXJzb3JUbyh0aGlzLmN1cnNvclBvcy5jb2xzKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbmRlciBhbmQgc3RvcmUgc3RhdGUgZm9yIGZ1dHVyZSByZS1yZW5kZXJpbmdcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMud3JpdGUoY3Vyc29yRG93bih0aGlzLmV4dHJhTGluZXNVbmRlclByb21wdCkgKyBlcmFzZUxpbmVzKHRoaXMuaGVpZ2h0KSArIG91dHB1dCk7XG4gICAgICAgIHRoaXMuZXh0cmFMaW5lc1VuZGVyUHJvbXB0ID0gYm90dG9tQ29udGVudEhlaWdodDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQob3V0cHV0KTtcbiAgICB9XG4gICAgY2hlY2tDdXJzb3JQb3MoKSB7XG4gICAgICAgIGNvbnN0IGN1cnNvclBvcyA9IHRoaXMucmwuZ2V0Q3Vyc29yUG9zKCk7XG4gICAgICAgIGlmIChjdXJzb3JQb3MuY29scyAhPT0gdGhpcy5jdXJzb3JQb3MuY29scykge1xuICAgICAgICAgICAgdGhpcy53cml0ZShjdXJzb3JUbyhjdXJzb3JQb3MuY29scykpO1xuICAgICAgICAgICAgdGhpcy5jdXJzb3JQb3MgPSBjdXJzb3JQb3M7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZG9uZSh7IGNsZWFyQ29udGVudCB9KSB7XG4gICAgICAgIHRoaXMucmwuc2V0UHJvbXB0KCcnKTtcbiAgICAgICAgbGV0IG91dHB1dCA9IGN1cnNvckRvd24odGhpcy5leHRyYUxpbmVzVW5kZXJQcm9tcHQpO1xuICAgICAgICBvdXRwdXQgKz0gY2xlYXJDb250ZW50ID8gZXJhc2VMaW5lcyh0aGlzLmhlaWdodCkgOiAnXFxuJztcbiAgICAgICAgb3V0cHV0ICs9IGN1cnNvclNob3c7XG4gICAgICAgIHRoaXMud3JpdGUob3V0cHV0KTtcbiAgICAgICAgdGhpcy5ybC5jbG9zZSgpO1xuICAgIH1cbn1cbiIsICJjb25zdCBFU0MgPSAnXFx1MDAxQlsnO1xuLyoqIE1vdmUgY3Vyc29yIHRvIGZpcnN0IGNvbHVtbiAqL1xuZXhwb3J0IGNvbnN0IGN1cnNvckxlZnQgPSBFU0MgKyAnRyc7XG4vKiogSGlkZSB0aGUgY3Vyc29yICovXG5leHBvcnQgY29uc3QgY3Vyc29ySGlkZSA9IEVTQyArICc/MjVsJztcbi8qKiBTaG93IHRoZSBjdXJzb3IgKi9cbmV4cG9ydCBjb25zdCBjdXJzb3JTaG93ID0gRVNDICsgJz8yNWgnO1xuLyoqIE1vdmUgY3Vyc29yIHVwIGJ5IGNvdW50IHJvd3MgKi9cbmV4cG9ydCBjb25zdCBjdXJzb3JVcCA9IChyb3dzID0gMSkgPT4gKHJvd3MgPiAwID8gYCR7RVNDfSR7cm93c31BYCA6ICcnKTtcbi8qKiBNb3ZlIGN1cnNvciBkb3duIGJ5IGNvdW50IHJvd3MgKi9cbmV4cG9ydCBjb25zdCBjdXJzb3JEb3duID0gKHJvd3MgPSAxKSA9PiByb3dzID4gMCA/IGAke0VTQ30ke3Jvd3N9QmAgOiAnJztcbi8qKiBNb3ZlIGN1cnNvciB0byBwb3NpdGlvbiAoeCwgeSkgKi9cbmV4cG9ydCBjb25zdCBjdXJzb3JUbyA9ICh4LCB5KSA9PiB7XG4gICAgaWYgKHR5cGVvZiB5ID09PSAnbnVtYmVyJyAmJiAhTnVtYmVyLmlzTmFOKHkpKSB7XG4gICAgICAgIHJldHVybiBgJHtFU0N9JHt5ICsgMX07JHt4ICsgMX1IYDtcbiAgICB9XG4gICAgcmV0dXJuIGAke0VTQ30ke3ggKyAxfUdgO1xufTtcbmNvbnN0IGVyYXNlTGluZSA9IEVTQyArICcySyc7XG4vKiogRXJhc2UgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbGluZXMgYWJvdmUgdGhlIGN1cnNvciAqL1xuZXhwb3J0IGNvbnN0IGVyYXNlTGluZXMgPSAobGluZXMpID0+IGxpbmVzID4gMCA/IChlcmFzZUxpbmUgKyBjdXJzb3JVcCgxKSkucmVwZWF0KGxpbmVzIC0gMSkgKyBlcmFzZUxpbmUgKyBjdXJzb3JMZWZ0IDogJyc7XG4iLCAiLy8gVE9ETzogUmVtb3ZlIHRoaXMgY2xhc3Mgb25jZSBOb2RlIDIyIGJlY29tZXMgdGhlIG1pbmltdW0gc3VwcG9ydGVkIHZlcnNpb24uXG5leHBvcnQgY2xhc3MgUHJvbWlzZVBvbHlmaWxsIGV4dGVuZHMgUHJvbWlzZSB7XG4gICAgLy8gQXZhaWxhYmxlIHN0YXJ0aW5nIGZyb20gTm9kZSAyMlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb21pc2Uvd2l0aFJlc29sdmVyc1xuICAgIHN0YXRpYyB3aXRoUmVzb2x2ZXIoKSB7XG4gICAgICAgIGxldCByZXNvbHZlO1xuICAgICAgICBsZXQgcmVqZWN0O1xuICAgICAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgcHJvbWlzZSwgcmVzb2x2ZTogcmVzb2x2ZSwgcmVqZWN0OiByZWplY3QgfTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgc3R5bGVUZXh0IH0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBmaWd1cmVzIGZyb20gJ0BpbnF1aXJlci9maWd1cmVzJztcbi8qKlxuICogU2VwYXJhdG9yIG9iamVjdFxuICogVXNlZCB0byBzcGFjZS9zZXBhcmF0ZSBjaG9pY2VzIGdyb3VwXG4gKi9cbmV4cG9ydCBjbGFzcyBTZXBhcmF0b3Ige1xuICAgIHNlcGFyYXRvciA9IHN0eWxlVGV4dCgnZGltJywgQXJyYXkuZnJvbSh7IGxlbmd0aDogMTUgfSkuam9pbihmaWd1cmVzLmxpbmUpKTtcbiAgICB0eXBlID0gJ3NlcGFyYXRvcic7XG4gICAgY29uc3RydWN0b3Ioc2VwYXJhdG9yKSB7XG4gICAgICAgIGlmIChzZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuc2VwYXJhdG9yID0gc2VwYXJhdG9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIHN0YXRpYyBpc1NlcGFyYXRvcihjaG9pY2UpIHtcbiAgICAgICAgcmV0dXJuIEJvb2xlYW4oY2hvaWNlICYmXG4gICAgICAgICAgICB0eXBlb2YgY2hvaWNlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgJ3R5cGUnIGluIGNob2ljZSAmJlxuICAgICAgICAgICAgY2hvaWNlLnR5cGUgPT09ICdzZXBhcmF0b3InKTtcbiAgICB9XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlUHJvbXB0LCB1c2VTdGF0ZSwgdXNlS2V5cHJlc3MsIHVzZVByZWZpeCwgdXNlUGFnaW5hdGlvbiwgdXNlTWVtbywgbWFrZVRoZW1lLCBpc1VwS2V5LCBpc0Rvd25LZXksIGlzU3BhY2VLZXksIGlzTnVtYmVyS2V5LCBpc0VudGVyS2V5LCBWYWxpZGF0aW9uRXJyb3IsIFNlcGFyYXRvciwgfSBmcm9tICdAaW5xdWlyZXIvY29yZSc7XG5pbXBvcnQgeyBjdXJzb3JIaWRlIH0gZnJvbSAnQGlucXVpcmVyL2Fuc2knO1xuaW1wb3J0IHsgc3R5bGVUZXh0IH0gZnJvbSAnbm9kZTp1dGlsJztcbmltcG9ydCBmaWd1cmVzIGZyb20gJ0BpbnF1aXJlci9maWd1cmVzJztcbmNvbnN0IGNoZWNrYm94VGhlbWUgPSB7XG4gICAgaWNvbjoge1xuICAgICAgICBjaGVja2VkOiBzdHlsZVRleHQoJ2dyZWVuJywgZmlndXJlcy5jaXJjbGVGaWxsZWQpLFxuICAgICAgICB1bmNoZWNrZWQ6IGZpZ3VyZXMuY2lyY2xlLFxuICAgICAgICBjdXJzb3I6IGZpZ3VyZXMucG9pbnRlcixcbiAgICAgICAgZGlzYWJsZWRDaGVja2VkOiBzdHlsZVRleHQoJ2dyZWVuJywgZmlndXJlcy5jaXJjbGVEb3VibGUpLFxuICAgICAgICBkaXNhYmxlZFVuY2hlY2tlZDogJy0nLFxuICAgIH0sXG4gICAgc3R5bGU6IHtcbiAgICAgICAgZGlzYWJsZWQ6ICh0ZXh0KSA9PiBzdHlsZVRleHQoJ2RpbScsIHRleHQpLFxuICAgICAgICByZW5kZXJTZWxlY3RlZENob2ljZXM6IChzZWxlY3RlZENob2ljZXMpID0+IHNlbGVjdGVkQ2hvaWNlcy5tYXAoKGNob2ljZSkgPT4gY2hvaWNlLnNob3J0KS5qb2luKCcsICcpLFxuICAgICAgICBkZXNjcmlwdGlvbjogKHRleHQpID0+IHN0eWxlVGV4dCgnY3lhbicsIHRleHQpLFxuICAgICAgICBrZXlzSGVscFRpcDogKGtleXMpID0+IGtleXNcbiAgICAgICAgICAgIC5tYXAoKFtrZXksIGFjdGlvbl0pID0+IGAke3N0eWxlVGV4dCgnYm9sZCcsIGtleSl9ICR7c3R5bGVUZXh0KCdkaW0nLCBhY3Rpb24pfWApXG4gICAgICAgICAgICAuam9pbihzdHlsZVRleHQoJ2RpbScsICcgXHUyMDIyICcpKSxcbiAgICB9LFxuICAgIGkxOG46IHsgZGlzYWJsZWRFcnJvcjogJ1RoaXMgb3B0aW9uIGlzIGRpc2FibGVkIGFuZCBjYW5ub3QgYmUgdG9nZ2xlZC4nIH0sXG4gICAga2V5YmluZGluZ3M6IFtdLFxufTtcbmZ1bmN0aW9uIGlzU2VsZWN0YWJsZShpdGVtKSB7XG4gICAgcmV0dXJuICFTZXBhcmF0b3IuaXNTZXBhcmF0b3IoaXRlbSkgJiYgIWl0ZW0uZGlzYWJsZWQ7XG59XG5mdW5jdGlvbiBpc05hdmlnYWJsZShpdGVtKSB7XG4gICAgcmV0dXJuICFTZXBhcmF0b3IuaXNTZXBhcmF0b3IoaXRlbSk7XG59XG5mdW5jdGlvbiBpc0NoZWNrZWQoaXRlbSkge1xuICAgIHJldHVybiAhU2VwYXJhdG9yLmlzU2VwYXJhdG9yKGl0ZW0pICYmIGl0ZW0uY2hlY2tlZDtcbn1cbmZ1bmN0aW9uIHRvZ2dsZShpdGVtKSB7XG4gICAgcmV0dXJuIGlzU2VsZWN0YWJsZShpdGVtKSA/IHsgLi4uaXRlbSwgY2hlY2tlZDogIWl0ZW0uY2hlY2tlZCB9IDogaXRlbTtcbn1cbmZ1bmN0aW9uIGNoZWNrKGNoZWNrZWQpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIGlzU2VsZWN0YWJsZShpdGVtKSA/IHsgLi4uaXRlbSwgY2hlY2tlZCB9IDogaXRlbTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplQ2hvaWNlcyhjaG9pY2VzKSB7XG4gICAgcmV0dXJuIGNob2ljZXMubWFwKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKFNlcGFyYXRvci5pc1NlcGFyYXRvcihjaG9pY2UpKVxuICAgICAgICAgICAgcmV0dXJuIGNob2ljZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjaG9pY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBjaG9pY2UsXG4gICAgICAgICAgICAgICAgbmFtZTogY2hvaWNlLFxuICAgICAgICAgICAgICAgIHNob3J0OiBjaG9pY2UsXG4gICAgICAgICAgICAgICAgY2hlY2tlZE5hbWU6IGNob2ljZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2hlY2tlZDogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBjaG9pY2UubmFtZSA/PyBTdHJpbmcoY2hvaWNlLnZhbHVlKTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZENob2ljZSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBjaG9pY2UudmFsdWUsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc2hvcnQ6IGNob2ljZS5zaG9ydCA/PyBuYW1lLFxuICAgICAgICAgICAgY2hlY2tlZE5hbWU6IGNob2ljZS5jaGVja2VkTmFtZSA/PyBuYW1lLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGNob2ljZS5kaXNhYmxlZCA/PyBmYWxzZSxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGNob2ljZS5jaGVja2VkID8/IGZhbHNlLFxuICAgICAgICB9O1xuICAgICAgICBpZiAoY2hvaWNlLmRlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBub3JtYWxpemVkQ2hvaWNlLmRlc2NyaXB0aW9uID0gY2hvaWNlLmRlc2NyaXB0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub3JtYWxpemVkQ2hvaWNlO1xuICAgIH0pO1xufVxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlUHJvbXB0KChjb25maWcsIGRvbmUpID0+IHtcbiAgICBjb25zdCB7IHBhZ2VTaXplID0gNywgbG9vcCA9IHRydWUsIHJlcXVpcmVkLCB2YWxpZGF0ZSA9ICgpID0+IHRydWUgfSA9IGNvbmZpZztcbiAgICBjb25zdCBzaG9ydGN1dHMgPSB7IGFsbDogJ2EnLCBpbnZlcnQ6ICdpJywgLi4uY29uZmlnLnNob3J0Y3V0cyB9O1xuICAgIGNvbnN0IHRoZW1lID0gbWFrZVRoZW1lKGNoZWNrYm94VGhlbWUsIGNvbmZpZy50aGVtZSk7XG4gICAgY29uc3QgeyBrZXliaW5kaW5ncyB9ID0gdGhlbWU7XG4gICAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlKCdpZGxlJyk7XG4gICAgY29uc3QgcHJlZml4ID0gdXNlUHJlZml4KHsgc3RhdHVzLCB0aGVtZSB9KTtcbiAgICBjb25zdCBbaXRlbXMsIHNldEl0ZW1zXSA9IHVzZVN0YXRlKG5vcm1hbGl6ZUNob2ljZXMoY29uZmlnLmNob2ljZXMpKTtcbiAgICBjb25zdCBib3VuZHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBpdGVtcy5maW5kSW5kZXgoaXNOYXZpZ2FibGUpO1xuICAgICAgICBjb25zdCBsYXN0ID0gaXRlbXMuZmluZExhc3RJbmRleChpc05hdmlnYWJsZSk7XG4gICAgICAgIGlmIChmaXJzdCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1tjaGVja2JveCBwcm9tcHRdIE5vIHNlbGVjdGFibGUgY2hvaWNlcy4gQWxsIGNob2ljZXMgYXJlIGRpc2FibGVkLicpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGZpcnN0LCBsYXN0IH07XG4gICAgfSwgW2l0ZW1zXSk7XG4gICAgY29uc3QgW2FjdGl2ZSwgc2V0QWN0aXZlXSA9IHVzZVN0YXRlKGJvdW5kcy5maXJzdCk7XG4gICAgY29uc3QgW2Vycm9yTXNnLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgpO1xuICAgIHVzZUtleXByZXNzKGFzeW5jIChrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzRW50ZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0aW9uID0gaXRlbXMuZmlsdGVyKGlzQ2hlY2tlZCk7XG4gICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgdmFsaWRhdGUoWy4uLnNlbGVjdGlvbl0pO1xuICAgICAgICAgICAgaWYgKHJlcXVpcmVkICYmICFzZWxlY3Rpb24ubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgc2V0RXJyb3IoJ0F0IGxlYXN0IG9uZSBjaG9pY2UgbXVzdCBiZSBzZWxlY3RlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaXNWYWxpZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHNldFN0YXR1cygnZG9uZScpO1xuICAgICAgICAgICAgICAgIGRvbmUoc2VsZWN0aW9uLm1hcCgoY2hvaWNlKSA9PiBjaG9pY2UudmFsdWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKGlzVmFsaWQgfHwgJ1lvdSBtdXN0IHNlbGVjdCBhIHZhbGlkIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNVcEtleShrZXksIGtleWJpbmRpbmdzKSB8fCBpc0Rvd25LZXkoa2V5LCBrZXliaW5kaW5ncykpIHtcbiAgICAgICAgICAgIGlmIChlcnJvck1zZykge1xuICAgICAgICAgICAgICAgIHNldEVycm9yKHVuZGVmaW5lZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobG9vcCB8fFxuICAgICAgICAgICAgICAgIChpc1VwS2V5KGtleSwga2V5YmluZGluZ3MpICYmIGFjdGl2ZSAhPT0gYm91bmRzLmZpcnN0KSB8fFxuICAgICAgICAgICAgICAgIChpc0Rvd25LZXkoa2V5LCBrZXliaW5kaW5ncykgJiYgYWN0aXZlICE9PSBib3VuZHMubGFzdCkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSBpc1VwS2V5KGtleSwga2V5YmluZGluZ3MpID8gLTEgOiAxO1xuICAgICAgICAgICAgICAgIGxldCBuZXh0ID0gYWN0aXZlO1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dCA9IChuZXh0ICsgb2Zmc2V0ICsgaXRlbXMubGVuZ3RoKSAlIGl0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghaXNOYXZpZ2FibGUoaXRlbXNbbmV4dF0pKTtcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmUobmV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNTcGFjZUtleShrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBhY3RpdmVJdGVtID0gaXRlbXNbYWN0aXZlXTtcbiAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtICYmICFTZXBhcmF0b3IuaXNTZXBhcmF0b3IoYWN0aXZlSXRlbSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcih0aGVtZS5pMThuLmRpc2FibGVkRXJyb3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IodW5kZWZpbmVkKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0SXRlbXMoaXRlbXMubWFwKChjaG9pY2UsIGkpID0+IChpID09PSBhY3RpdmUgPyB0b2dnbGUoY2hvaWNlKSA6IGNob2ljZSkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5Lm5hbWUgPT09IHNob3J0Y3V0cy5hbGwpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdEFsbCA9IGl0ZW1zLnNvbWUoKGNob2ljZSkgPT4gaXNTZWxlY3RhYmxlKGNob2ljZSkgJiYgIWNob2ljZS5jaGVja2VkKTtcbiAgICAgICAgICAgIHNldEl0ZW1zKGl0ZW1zLm1hcChjaGVjayhzZWxlY3RBbGwpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoa2V5Lm5hbWUgPT09IHNob3J0Y3V0cy5pbnZlcnQpIHtcbiAgICAgICAgICAgIHNldEl0ZW1zKGl0ZW1zLm1hcCh0b2dnbGUpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc051bWJlcktleShrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RlZEluZGV4ID0gTnVtYmVyKGtleS5uYW1lKSAtIDE7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBudGggaXRlbSAoaWdub3Jpbmcgc2VwYXJhdG9ycylcbiAgICAgICAgICAgIGxldCBzZWxlY3RhYmxlSW5kZXggPSAtMTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFNlcGFyYXRvci5pc1NlcGFyYXRvcihpdGVtKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGVjdGFibGVJbmRleCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RhYmxlSW5kZXggPT09IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbSA9IGl0ZW1zW3Bvc2l0aW9uXTtcbiAgICAgICAgICAgIGlmIChzZWxlY3RlZEl0ZW0gJiYgaXNTZWxlY3RhYmxlKHNlbGVjdGVkSXRlbSkpIHtcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmUocG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1zKGl0ZW1zLm1hcCgoY2hvaWNlLCBpKSA9PiAoaSA9PT0gcG9zaXRpb24gPyB0b2dnbGUoY2hvaWNlKSA6IGNob2ljZSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGVtZS5zdHlsZS5tZXNzYWdlKGNvbmZpZy5tZXNzYWdlLCBzdGF0dXMpO1xuICAgIGxldCBkZXNjcmlwdGlvbjtcbiAgICBjb25zdCBwYWdlID0gdXNlUGFnaW5hdGlvbih7XG4gICAgICAgIGl0ZW1zLFxuICAgICAgICBhY3RpdmUsXG4gICAgICAgIHJlbmRlckl0ZW0oeyBpdGVtLCBpc0FjdGl2ZSB9KSB7XG4gICAgICAgICAgICBpZiAoU2VwYXJhdG9yLmlzU2VwYXJhdG9yKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGAgJHtpdGVtLnNlcGFyYXRvcn1gO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY3Vyc29yID0gaXNBY3RpdmUgPyB0aGVtZS5pY29uLmN1cnNvciA6ICcgJztcbiAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRMYWJlbCA9IHR5cGVvZiBpdGVtLmRpc2FibGVkID09PSAnc3RyaW5nJyA/IGl0ZW0uZGlzYWJsZWQgOiAnKGRpc2FibGVkKSc7XG4gICAgICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSBpdGVtLmNoZWNrZWRcbiAgICAgICAgICAgICAgICAgICAgPyB0aGVtZS5pY29uLmRpc2FibGVkQ2hlY2tlZFxuICAgICAgICAgICAgICAgICAgICA6IHRoZW1lLmljb24uZGlzYWJsZWRVbmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoZW1lLnN0eWxlLmRpc2FibGVkKGAke2N1cnNvcn0ke2NoZWNrYm94fSAke2l0ZW0ubmFtZX0gJHtkaXNhYmxlZExhYmVsfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRpb24gPSBpdGVtLmRlc2NyaXB0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgY2hlY2tib3ggPSBpdGVtLmNoZWNrZWQgPyB0aGVtZS5pY29uLmNoZWNrZWQgOiB0aGVtZS5pY29uLnVuY2hlY2tlZDtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpdGVtLmNoZWNrZWQgPyBpdGVtLmNoZWNrZWROYW1lIDogaXRlbS5uYW1lO1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBpc0FjdGl2ZSA/IHRoZW1lLnN0eWxlLmhpZ2hsaWdodCA6ICh4KSA9PiB4O1xuICAgICAgICAgICAgcmV0dXJuIGNvbG9yKGAke2N1cnNvcn0ke2NoZWNrYm94fSAke25hbWV9YCk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhZ2VTaXplLFxuICAgICAgICBsb29wLFxuICAgIH0pO1xuICAgIGlmIChzdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICBjb25zdCBzZWxlY3Rpb24gPSBpdGVtcy5maWx0ZXIoaXNDaGVja2VkKTtcbiAgICAgICAgY29uc3QgYW5zd2VyID0gdGhlbWUuc3R5bGUuYW5zd2VyKHRoZW1lLnN0eWxlLnJlbmRlclNlbGVjdGVkQ2hvaWNlcyhzZWxlY3Rpb24sIGl0ZW1zKSk7XG4gICAgICAgIHJldHVybiBbcHJlZml4LCBtZXNzYWdlLCBhbnN3ZXJdLmZpbHRlcihCb29sZWFuKS5qb2luKCcgJyk7XG4gICAgfVxuICAgIGNvbnN0IGtleXMgPSBbXG4gICAgICAgIFsnXHUyMTkxXHUyMTkzJywgJ25hdmlnYXRlJ10sXG4gICAgICAgIFsnc3BhY2UnLCAnc2VsZWN0J10sXG4gICAgXTtcbiAgICBpZiAoc2hvcnRjdXRzLmFsbClcbiAgICAgICAga2V5cy5wdXNoKFtzaG9ydGN1dHMuYWxsLCAnYWxsJ10pO1xuICAgIGlmIChzaG9ydGN1dHMuaW52ZXJ0KVxuICAgICAgICBrZXlzLnB1c2goW3Nob3J0Y3V0cy5pbnZlcnQsICdpbnZlcnQnXSk7XG4gICAga2V5cy5wdXNoKFsnXHUyM0NFJywgJ3N1Ym1pdCddKTtcbiAgICBjb25zdCBoZWxwTGluZSA9IHRoZW1lLnN0eWxlLmtleXNIZWxwVGlwKGtleXMpO1xuICAgIGNvbnN0IGxpbmVzID0gW1xuICAgICAgICBbcHJlZml4LCBtZXNzYWdlXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpLFxuICAgICAgICBwYWdlLFxuICAgICAgICAnICcsXG4gICAgICAgIGRlc2NyaXB0aW9uID8gdGhlbWUuc3R5bGUuZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIDogJycsXG4gICAgICAgIGVycm9yTXNnID8gdGhlbWUuc3R5bGUuZXJyb3IoZXJyb3JNc2cpIDogJycsXG4gICAgICAgIGhlbHBMaW5lLFxuICAgIF1cbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuam9pbignXFxuJylcbiAgICAgICAgLnRyaW1FbmQoKTtcbiAgICByZXR1cm4gYCR7bGluZXN9JHtjdXJzb3JIaWRlfWA7XG59KTtcbmV4cG9ydCB7IFNlcGFyYXRvciB9IGZyb20gJ0BpbnF1aXJlci9jb3JlJztcbiIsICJpbXBvcnQgeyBjcmVhdGVQcm9tcHQsIHVzZVN0YXRlLCB1c2VLZXlwcmVzcywgaXNFbnRlcktleSwgaXNUYWJLZXksIHVzZVByZWZpeCwgbWFrZVRoZW1lLCB9IGZyb20gJ0BpbnF1aXJlci9jb3JlJztcbmZ1bmN0aW9uIGdldEJvb2xlYW5WYWx1ZSh2YWx1ZSwgZGVmYXVsdFZhbHVlKSB7XG4gICAgbGV0IGFuc3dlciA9IGRlZmF1bHRWYWx1ZSAhPT0gZmFsc2U7XG4gICAgaWYgKC9eKHl8eWVzKS9pLnRlc3QodmFsdWUpKVxuICAgICAgICBhbnN3ZXIgPSB0cnVlO1xuICAgIGVsc2UgaWYgKC9eKG58bm8pL2kudGVzdCh2YWx1ZSkpXG4gICAgICAgIGFuc3dlciA9IGZhbHNlO1xuICAgIHJldHVybiBhbnN3ZXI7XG59XG5mdW5jdGlvbiBib29sVG9TdHJpbmcodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPyAnWWVzJyA6ICdObyc7XG59XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVQcm9tcHQoKGNvbmZpZywgZG9uZSkgPT4ge1xuICAgIGNvbnN0IHsgdHJhbnNmb3JtZXIgPSBib29sVG9TdHJpbmcgfSA9IGNvbmZpZztcbiAgICBjb25zdCBbc3RhdHVzLCBzZXRTdGF0dXNdID0gdXNlU3RhdGUoJ2lkbGUnKTtcbiAgICBjb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IHVzZVN0YXRlKCcnKTtcbiAgICBjb25zdCB0aGVtZSA9IG1ha2VUaGVtZShjb25maWcudGhlbWUpO1xuICAgIGNvbnN0IHByZWZpeCA9IHVzZVByZWZpeCh7IHN0YXR1cywgdGhlbWUgfSk7XG4gICAgdXNlS2V5cHJlc3MoKGtleSwgcmwpID0+IHtcbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gJ2lkbGUnKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAoaXNFbnRlcktleShrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBhbnN3ZXIgPSBnZXRCb29sZWFuVmFsdWUodmFsdWUsIGNvbmZpZy5kZWZhdWx0KTtcbiAgICAgICAgICAgIHNldFZhbHVlKHRyYW5zZm9ybWVyKGFuc3dlcikpO1xuICAgICAgICAgICAgc2V0U3RhdHVzKCdkb25lJyk7XG4gICAgICAgICAgICBkb25lKGFuc3dlcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNUYWJLZXkoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgYW5zd2VyID0gYm9vbFRvU3RyaW5nKCFnZXRCb29sZWFuVmFsdWUodmFsdWUsIGNvbmZpZy5kZWZhdWx0KSk7XG4gICAgICAgICAgICBybC5jbGVhckxpbmUoMCk7IC8vIFJlbW92ZSB0aGUgdGFiIGNoYXJhY3Rlci5cbiAgICAgICAgICAgIHJsLndyaXRlKGFuc3dlcik7XG4gICAgICAgICAgICBzZXRWYWx1ZShhbnN3ZXIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2V0VmFsdWUocmwubGluZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSB2YWx1ZTtcbiAgICBsZXQgZGVmYXVsdFZhbHVlID0gJyc7XG4gICAgaWYgKHN0YXR1cyA9PT0gJ2RvbmUnKSB7XG4gICAgICAgIGZvcm1hdHRlZFZhbHVlID0gdGhlbWUuc3R5bGUuYW5zd2VyKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZSA9IGAgJHt0aGVtZS5zdHlsZS5kZWZhdWx0QW5zd2VyKGNvbmZpZy5kZWZhdWx0ID09PSBmYWxzZSA/ICd5L04nIDogJ1kvbicpfWA7XG4gICAgfVxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGVtZS5zdHlsZS5tZXNzYWdlKGNvbmZpZy5tZXNzYWdlLCBzdGF0dXMpO1xuICAgIHJldHVybiBgJHtwcmVmaXh9ICR7bWVzc2FnZX0ke2RlZmF1bHRWYWx1ZX0gJHtmb3JtYXR0ZWRWYWx1ZX1gO1xufSk7XG4iLCAiaW1wb3J0IHsgY3JlYXRlUHJvbXB0LCB1c2VTdGF0ZSwgdXNlS2V5cHJlc3MsIHVzZUVmZmVjdCwgdXNlUHJlZml4LCBpc0JhY2tzcGFjZUtleSwgaXNFbnRlcktleSwgaXNUYWJLZXksIG1ha2VUaGVtZSwgfSBmcm9tICdAaW5xdWlyZXIvY29yZSc7XG5jb25zdCBpbnB1dFRoZW1lID0ge1xuICAgIHZhbGlkYXRpb25GYWlsdXJlTW9kZTogJ2tlZXAnLFxufTtcbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVByb21wdCgoY29uZmlnLCBkb25lKSA9PiB7XG4gICAgY29uc3QgeyBwcmVmaWxsID0gJ3RhYicgfSA9IGNvbmZpZztcbiAgICBjb25zdCB0aGVtZSA9IG1ha2VUaGVtZShpbnB1dFRoZW1lLCBjb25maWcudGhlbWUpO1xuICAgIGNvbnN0IFtzdGF0dXMsIHNldFN0YXR1c10gPSB1c2VTdGF0ZSgnaWRsZScpO1xuICAgIC8vIENvZXJjZSB0byBzdHJpbmcgdG8gaGFuZGxlIHJ1bnRpbWUgdmFsdWVzIHRoYXQgbWF5IGJlIG51bWJlcnMgZGVzcGl0ZSBUeXBlU2NyaXB0IHR5cGVzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bm5lY2Vzc2FyeS10eXBlLWNvbnZlcnNpb25cbiAgICBjb25zdCBbZGVmYXVsdFZhbHVlLCBzZXREZWZhdWx0VmFsdWVdID0gdXNlU3RhdGUoU3RyaW5nKGNvbmZpZy5kZWZhdWx0ID8/ICcnKSk7XG4gICAgY29uc3QgW2Vycm9yTXNnLCBzZXRFcnJvcl0gPSB1c2VTdGF0ZSgpO1xuICAgIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGUoJycpO1xuICAgIGNvbnN0IHByZWZpeCA9IHVzZVByZWZpeCh7IHN0YXR1cywgdGhlbWUgfSk7XG4gICAgYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGUodmFsdWUpIHtcbiAgICAgICAgY29uc3QgeyByZXF1aXJlZCwgcGF0dGVybiwgcGF0dGVybkVycm9yID0gJ0ludmFsaWQgaW5wdXQnIH0gPSBjb25maWc7XG4gICAgICAgIGlmIChyZXF1aXJlZCAmJiAhdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybiAnWW91IG11c3QgcHJvdmlkZSBhIHZhbHVlJztcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0dGVybiAmJiAhcGF0dGVybi50ZXN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhdHRlcm5FcnJvcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIGNvbmZpZy52YWxpZGF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIChhd2FpdCBjb25maWcudmFsaWRhdGUodmFsdWUpKSB8fCAnWW91IG11c3QgcHJvdmlkZSBhIHZhbGlkIHZhbHVlJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgdXNlS2V5cHJlc3MoYXN5bmMgKGtleSwgcmwpID0+IHtcbiAgICAgICAgLy8gSWdub3JlIGtleXByZXNzIHdoaWxlIG91ciBwcm9tcHQgaXMgZG9pbmcgb3RoZXIgcHJvY2Vzc2luZy5cbiAgICAgICAgaWYgKHN0YXR1cyAhPT0gJ2lkbGUnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzRW50ZXJLZXkoa2V5KSkge1xuICAgICAgICAgICAgY29uc3QgYW5zd2VyID0gdmFsdWUgfHwgZGVmYXVsdFZhbHVlO1xuICAgICAgICAgICAgc2V0U3RhdHVzKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgdmFsaWRhdGUoYW5zd2VyKTtcbiAgICAgICAgICAgIGlmIChpc1ZhbGlkID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2V0VmFsdWUoYW5zd2VyKTtcbiAgICAgICAgICAgICAgICBzZXRTdGF0dXMoJ2RvbmUnKTtcbiAgICAgICAgICAgICAgICBkb25lKGFuc3dlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhlbWUudmFsaWRhdGlvbkZhaWx1cmVNb2RlID09PSAnY2xlYXInKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFZhbHVlKCcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFJlc2V0IHRoZSByZWFkbGluZSBsaW5lIHZhbHVlIHRvIHRoZSBwcmV2aW91cyB2YWx1ZS4gT24gbGluZSBldmVudCwgdGhlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGdldCBjbGVhcmVkLCBmb3JjaW5nIHRoZSB1c2VyIHRvIHJlLWVudGVyIHRoZSB2YWx1ZSBpbnN0ZWFkIG9mIGZpeGluZyBpdC5cbiAgICAgICAgICAgICAgICAgICAgcmwud3JpdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZXRFcnJvcihpc1ZhbGlkKTtcbiAgICAgICAgICAgICAgICBzZXRTdGF0dXMoJ2lkbGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc0JhY2tzcGFjZUtleShrZXkpICYmICF2YWx1ZSkge1xuICAgICAgICAgICAgc2V0RGVmYXVsdFZhbHVlKCcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1RhYktleShrZXkpICYmICF2YWx1ZSkge1xuICAgICAgICAgICAgc2V0RGVmYXVsdFZhbHVlKCcnKTtcbiAgICAgICAgICAgIHJsLmNsZWFyTGluZSgwKTsgLy8gUmVtb3ZlIHRoZSB0YWIgY2hhcmFjdGVyLlxuICAgICAgICAgICAgcmwud3JpdGUoZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIHNldFZhbHVlKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzZXRWYWx1ZShybC5saW5lKTtcbiAgICAgICAgICAgIHNldEVycm9yKHVuZGVmaW5lZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBJZiBwcmVmaWxsIGlzIHNldCB0byAnZWRpdGFibGUnIGN1dCBvdXQgdGhlIGRlZmF1bHQgdmFsdWUgYW5kIHBhc3RlIGludG8gY3VycmVudCBzdGF0ZSBhbmQgdGhlIHVzZXIncyBjbGkgYnVmZmVyXG4gICAgLy8gVGhleSBjYW4gZWRpdCB0aGUgdmFsdWUgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBuZWVkaW5nIHRvIHByZXNzICd0YWInXG4gICAgdXNlRWZmZWN0KChybCkgPT4ge1xuICAgICAgICBpZiAocHJlZmlsbCA9PT0gJ2VkaXRhYmxlJyAmJiBkZWZhdWx0VmFsdWUpIHtcbiAgICAgICAgICAgIHJsLndyaXRlKGRlZmF1bHRWYWx1ZSk7XG4gICAgICAgICAgICBzZXRWYWx1ZShkZWZhdWx0VmFsdWUpO1xuICAgICAgICB9XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGVtZS5zdHlsZS5tZXNzYWdlKGNvbmZpZy5tZXNzYWdlLCBzdGF0dXMpO1xuICAgIGxldCBmb3JtYXR0ZWRWYWx1ZSA9IHZhbHVlO1xuICAgIGlmICh0eXBlb2YgY29uZmlnLnRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvcm1hdHRlZFZhbHVlID0gY29uZmlnLnRyYW5zZm9ybWVyKHZhbHVlLCB7IGlzRmluYWw6IHN0YXR1cyA9PT0gJ2RvbmUnIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmIChzdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICBmb3JtYXR0ZWRWYWx1ZSA9IHRoZW1lLnN0eWxlLmFuc3dlcih2YWx1ZSk7XG4gICAgfVxuICAgIGxldCBkZWZhdWx0U3RyO1xuICAgIGlmIChkZWZhdWx0VmFsdWUgJiYgc3RhdHVzICE9PSAnZG9uZScgJiYgIXZhbHVlKSB7XG4gICAgICAgIGRlZmF1bHRTdHIgPSB0aGVtZS5zdHlsZS5kZWZhdWx0QW5zd2VyKGRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIGxldCBlcnJvciA9ICcnO1xuICAgIGlmIChlcnJvck1zZykge1xuICAgICAgICBlcnJvciA9IHRoZW1lLnN0eWxlLmVycm9yKGVycm9yTXNnKTtcbiAgICB9XG4gICAgcmV0dXJuIFtcbiAgICAgICAgW3ByZWZpeCwgbWVzc2FnZSwgZGVmYXVsdFN0ciwgZm9ybWF0dGVkVmFsdWVdXG4gICAgICAgICAgICAuZmlsdGVyKCh2KSA9PiB2ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAuam9pbignICcpLFxuICAgICAgICBlcnJvcixcbiAgICBdO1xufSk7XG4iLCAiaW1wb3J0IHsgY3JlYXRlUHJvbXB0LCB1c2VTdGF0ZSwgdXNlS2V5cHJlc3MsIHVzZVByZWZpeCwgdXNlUGFnaW5hdGlvbiwgdXNlUmVmLCB1c2VNZW1vLCB1c2VFZmZlY3QsIGlzQmFja3NwYWNlS2V5LCBpc0VudGVyS2V5LCBpc1VwS2V5LCBpc0Rvd25LZXksIGlzTnVtYmVyS2V5LCBTZXBhcmF0b3IsIFZhbGlkYXRpb25FcnJvciwgbWFrZVRoZW1lLCB9IGZyb20gJ0BpbnF1aXJlci9jb3JlJztcbmltcG9ydCB7IGN1cnNvckhpZGUgfSBmcm9tICdAaW5xdWlyZXIvYW5zaSc7XG5pbXBvcnQgeyBzdHlsZVRleHQgfSBmcm9tICdub2RlOnV0aWwnO1xuaW1wb3J0IGZpZ3VyZXMgZnJvbSAnQGlucXVpcmVyL2ZpZ3VyZXMnO1xuY29uc3Qgc2VsZWN0VGhlbWUgPSB7XG4gICAgaWNvbjogeyBjdXJzb3I6IGZpZ3VyZXMucG9pbnRlciB9LFxuICAgIHN0eWxlOiB7XG4gICAgICAgIGRpc2FibGVkOiAodGV4dCkgPT4gc3R5bGVUZXh0KCdkaW0nLCB0ZXh0KSxcbiAgICAgICAgZGVzY3JpcHRpb246ICh0ZXh0KSA9PiBzdHlsZVRleHQoJ2N5YW4nLCB0ZXh0KSxcbiAgICAgICAga2V5c0hlbHBUaXA6IChrZXlzKSA9PiBrZXlzXG4gICAgICAgICAgICAubWFwKChba2V5LCBhY3Rpb25dKSA9PiBgJHtzdHlsZVRleHQoJ2JvbGQnLCBrZXkpfSAke3N0eWxlVGV4dCgnZGltJywgYWN0aW9uKX1gKVxuICAgICAgICAgICAgLmpvaW4oc3R5bGVUZXh0KCdkaW0nLCAnIFx1MjAyMiAnKSksXG4gICAgfSxcbiAgICBpMThuOiB7IGRpc2FibGVkRXJyb3I6ICdUaGlzIG9wdGlvbiBpcyBkaXNhYmxlZCBhbmQgY2Fubm90IGJlIHNlbGVjdGVkLicgfSxcbiAgICBpbmRleE1vZGU6ICdoaWRkZW4nLFxuICAgIGtleWJpbmRpbmdzOiBbXSxcbn07XG5mdW5jdGlvbiBpc1NlbGVjdGFibGUoaXRlbSkge1xuICAgIHJldHVybiAhU2VwYXJhdG9yLmlzU2VwYXJhdG9yKGl0ZW0pICYmICFpdGVtLmRpc2FibGVkO1xufVxuZnVuY3Rpb24gaXNOYXZpZ2FibGUoaXRlbSkge1xuICAgIHJldHVybiAhU2VwYXJhdG9yLmlzU2VwYXJhdG9yKGl0ZW0pO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplQ2hvaWNlcyhjaG9pY2VzKSB7XG4gICAgcmV0dXJuIGNob2ljZXMubWFwKChjaG9pY2UpID0+IHtcbiAgICAgICAgaWYgKFNlcGFyYXRvci5pc1NlcGFyYXRvcihjaG9pY2UpKVxuICAgICAgICAgICAgcmV0dXJuIGNob2ljZTtcbiAgICAgICAgaWYgKHR5cGVvZiBjaG9pY2UgIT09ICdvYmplY3QnIHx8IGNob2ljZSA9PT0gbnVsbCB8fCAhKCd2YWx1ZScgaW4gY2hvaWNlKSkge1xuICAgICAgICAgICAgLy8gSXQncyBhIHJhdyB2YWx1ZSAoc3RyaW5nLCBudW1iZXIsIGV0Yy4pXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gU3RyaW5nKGNob2ljZSk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBjaG9pY2UsXG4gICAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgICBzaG9ydDogbmFtZSxcbiAgICAgICAgICAgICAgICBkaXNhYmxlZDogZmFsc2UsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBjaG9pY2UubmFtZSA/PyBTdHJpbmcoY2hvaWNlLnZhbHVlKTtcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZENob2ljZSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBjaG9pY2UudmFsdWUsXG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgc2hvcnQ6IGNob2ljZS5zaG9ydCA/PyBuYW1lLFxuICAgICAgICAgICAgZGlzYWJsZWQ6IGNob2ljZS5kaXNhYmxlZCA/PyBmYWxzZSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGNob2ljZS5kZXNjcmlwdGlvbikge1xuICAgICAgICAgICAgbm9ybWFsaXplZENob2ljZS5kZXNjcmlwdGlvbiA9IGNob2ljZS5kZXNjcmlwdGlvbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9ybWFsaXplZENob2ljZTtcbiAgICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVByb21wdCgoY29uZmlnLCBkb25lKSA9PiB7XG4gICAgY29uc3QgeyBsb29wID0gdHJ1ZSwgcGFnZVNpemUgPSA3IH0gPSBjb25maWc7XG4gICAgY29uc3QgdGhlbWUgPSBtYWtlVGhlbWUoc2VsZWN0VGhlbWUsIGNvbmZpZy50aGVtZSk7XG4gICAgY29uc3QgeyBrZXliaW5kaW5ncyB9ID0gdGhlbWU7XG4gICAgY29uc3QgW3N0YXR1cywgc2V0U3RhdHVzXSA9IHVzZVN0YXRlKCdpZGxlJyk7XG4gICAgY29uc3QgcHJlZml4ID0gdXNlUHJlZml4KHsgc3RhdHVzLCB0aGVtZSB9KTtcbiAgICBjb25zdCBzZWFyY2hUaW1lb3V0UmVmID0gdXNlUmVmKCk7XG4gICAgLy8gVmltIGtleWJpbmRpbmdzIChqL2spIGNvbmZsaWN0IHdpdGggdHlwaW5nIHRob3NlIGxldHRlcnMgaW4gc2VhcmNoLFxuICAgIC8vIHNvIHNlYXJjaCBtdXN0IGJlIGRpc2FibGVkIHdoZW4gdmltIGJpbmRpbmdzIGFyZSBlbmFibGVkXG4gICAgY29uc3Qgc2VhcmNoRW5hYmxlZCA9ICFrZXliaW5kaW5ncy5pbmNsdWRlcygndmltJyk7XG4gICAgY29uc3QgaXRlbXMgPSB1c2VNZW1vKCgpID0+IG5vcm1hbGl6ZUNob2ljZXMoY29uZmlnLmNob2ljZXMpLCBbY29uZmlnLmNob2ljZXNdKTtcbiAgICBjb25zdCBib3VuZHMgPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgY29uc3QgZmlyc3QgPSBpdGVtcy5maW5kSW5kZXgoaXNOYXZpZ2FibGUpO1xuICAgICAgICBjb25zdCBsYXN0ID0gaXRlbXMuZmluZExhc3RJbmRleChpc05hdmlnYWJsZSk7XG4gICAgICAgIGlmIChmaXJzdCA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoJ1tzZWxlY3QgcHJvbXB0XSBObyBzZWxlY3RhYmxlIGNob2ljZXMuIEFsbCBjaG9pY2VzIGFyZSBkaXNhYmxlZC4nKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBmaXJzdCwgbGFzdCB9O1xuICAgIH0sIFtpdGVtc10pO1xuICAgIGNvbnN0IGRlZmF1bHRJdGVtSW5kZXggPSB1c2VNZW1vKCgpID0+IHtcbiAgICAgICAgaWYgKCEoJ2RlZmF1bHQnIGluIGNvbmZpZykpXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIHJldHVybiBpdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IGlzU2VsZWN0YWJsZShpdGVtKSAmJiBpdGVtLnZhbHVlID09PSBjb25maWcuZGVmYXVsdCk7XG4gICAgfSwgW2NvbmZpZy5kZWZhdWx0LCBpdGVtc10pO1xuICAgIGNvbnN0IFthY3RpdmUsIHNldEFjdGl2ZV0gPSB1c2VTdGF0ZShkZWZhdWx0SXRlbUluZGV4ID09PSAtMSA/IGJvdW5kcy5maXJzdCA6IGRlZmF1bHRJdGVtSW5kZXgpO1xuICAgIC8vIFNhZmUgdG8gYXNzdW1lIHRoZSBjdXJzb3IgcG9zaXRpb24gYWx3YXlzIHBvaW50IHRvIGEgQ2hvaWNlLlxuICAgIGNvbnN0IHNlbGVjdGVkQ2hvaWNlID0gaXRlbXNbYWN0aXZlXTtcbiAgICBjb25zdCBbZXJyb3JNc2csIHNldEVycm9yXSA9IHVzZVN0YXRlKCk7XG4gICAgdXNlS2V5cHJlc3MoKGtleSwgcmwpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFRpbWVvdXRSZWYuY3VycmVudCk7XG4gICAgICAgIGlmIChlcnJvck1zZykge1xuICAgICAgICAgICAgc2V0RXJyb3IodW5kZWZpbmVkKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNFbnRlcktleShrZXkpKSB7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRDaG9pY2UuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICBzZXRFcnJvcih0aGVtZS5pMThuLmRpc2FibGVkRXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc2V0U3RhdHVzKCdkb25lJyk7XG4gICAgICAgICAgICAgICAgZG9uZShzZWxlY3RlZENob2ljZS52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaXNVcEtleShrZXksIGtleWJpbmRpbmdzKSB8fCBpc0Rvd25LZXkoa2V5LCBrZXliaW5kaW5ncykpIHtcbiAgICAgICAgICAgIHJsLmNsZWFyTGluZSgwKTtcbiAgICAgICAgICAgIGlmIChsb29wIHx8XG4gICAgICAgICAgICAgICAgKGlzVXBLZXkoa2V5LCBrZXliaW5kaW5ncykgJiYgYWN0aXZlICE9PSBib3VuZHMuZmlyc3QpIHx8XG4gICAgICAgICAgICAgICAgKGlzRG93bktleShrZXksIGtleWJpbmRpbmdzKSAmJiBhY3RpdmUgIT09IGJvdW5kcy5sYXN0KSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IGlzVXBLZXkoa2V5LCBrZXliaW5kaW5ncykgPyAtMSA6IDE7XG4gICAgICAgICAgICAgICAgbGV0IG5leHQgPSBhY3RpdmU7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBuZXh0ID0gKG5leHQgKyBvZmZzZXQgKyBpdGVtcy5sZW5ndGgpICUgaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKCFpc05hdmlnYWJsZShpdGVtc1tuZXh0XSkpO1xuICAgICAgICAgICAgICAgIHNldEFjdGl2ZShuZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc051bWJlcktleShrZXkpICYmICFOdW1iZXIuaXNOYU4oTnVtYmVyKHJsLmxpbmUpKSkge1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0ZWRJbmRleCA9IE51bWJlcihybC5saW5lKSAtIDE7XG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBudGggaXRlbSAoaWdub3Jpbmcgc2VwYXJhdG9ycylcbiAgICAgICAgICAgIGxldCBzZWxlY3RhYmxlSW5kZXggPSAtMTtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gaXRlbXMuZmluZEluZGV4KChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKFNlcGFyYXRvci5pc1NlcGFyYXRvcihpdGVtKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGVjdGFibGVJbmRleCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBzZWxlY3RhYmxlSW5kZXggPT09IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1twb3NpdGlvbl07XG4gICAgICAgICAgICBpZiAoaXRlbSAhPSBudWxsICYmIGlzU2VsZWN0YWJsZShpdGVtKSkge1xuICAgICAgICAgICAgICAgIHNldEFjdGl2ZShwb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWFyY2hUaW1lb3V0UmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBybC5jbGVhckxpbmUoMCk7XG4gICAgICAgICAgICB9LCA3MDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzQmFja3NwYWNlS2V5KGtleSkpIHtcbiAgICAgICAgICAgIHJsLmNsZWFyTGluZSgwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChzZWFyY2hFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hUZXJtID0gcmwubGluZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3QgbWF0Y2hJbmRleCA9IGl0ZW1zLmZpbmRJbmRleCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChTZXBhcmF0b3IuaXNTZXBhcmF0b3IoaXRlbSkgfHwgIWlzU2VsZWN0YWJsZShpdGVtKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLm5hbWUudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKHNlYXJjaFRlcm0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpZiAobWF0Y2hJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICBzZXRBY3RpdmUobWF0Y2hJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzZWFyY2hUaW1lb3V0UmVmLmN1cnJlbnQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBybC5jbGVhckxpbmUoMCk7XG4gICAgICAgICAgICB9LCA3MDApO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgdXNlRWZmZWN0KCgpID0+ICgpID0+IHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHNlYXJjaFRpbWVvdXRSZWYuY3VycmVudCk7XG4gICAgfSwgW10pO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGVtZS5zdHlsZS5tZXNzYWdlKGNvbmZpZy5tZXNzYWdlLCBzdGF0dXMpO1xuICAgIGNvbnN0IGhlbHBMaW5lID0gdGhlbWUuc3R5bGUua2V5c0hlbHBUaXAoW1xuICAgICAgICBbJ1x1MjE5MVx1MjE5MycsICduYXZpZ2F0ZSddLFxuICAgICAgICBbJ1x1MjNDRScsICdzZWxlY3QnXSxcbiAgICBdKTtcbiAgICBsZXQgc2VwYXJhdG9yQ291bnQgPSAwO1xuICAgIGNvbnN0IHBhZ2UgPSB1c2VQYWdpbmF0aW9uKHtcbiAgICAgICAgaXRlbXMsXG4gICAgICAgIGFjdGl2ZSxcbiAgICAgICAgcmVuZGVySXRlbSh7IGl0ZW0sIGlzQWN0aXZlLCBpbmRleCB9KSB7XG4gICAgICAgICAgICBpZiAoU2VwYXJhdG9yLmlzU2VwYXJhdG9yKGl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgc2VwYXJhdG9yQ291bnQrKztcbiAgICAgICAgICAgICAgICByZXR1cm4gYCAke2l0ZW0uc2VwYXJhdG9yfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjdXJzb3IgPSBpc0FjdGl2ZSA/IHRoZW1lLmljb24uY3Vyc29yIDogJyAnO1xuICAgICAgICAgICAgY29uc3QgaW5kZXhMYWJlbCA9IHRoZW1lLmluZGV4TW9kZSA9PT0gJ251bWJlcicgPyBgJHtpbmRleCArIDEgLSBzZXBhcmF0b3JDb3VudH0uIGAgOiAnJztcbiAgICAgICAgICAgIGlmIChpdGVtLmRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRMYWJlbCA9IHR5cGVvZiBpdGVtLmRpc2FibGVkID09PSAnc3RyaW5nJyA/IGl0ZW0uZGlzYWJsZWQgOiAnKGRpc2FibGVkKSc7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzYWJsZWRDdXJzb3IgPSBpc0FjdGl2ZSA/IHRoZW1lLmljb24uY3Vyc29yIDogJy0nO1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGVtZS5zdHlsZS5kaXNhYmxlZChgJHtkaXNhYmxlZEN1cnNvcn0gJHtpbmRleExhYmVsfSR7aXRlbS5uYW1lfSAke2Rpc2FibGVkTGFiZWx9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IGlzQWN0aXZlID8gdGhlbWUuc3R5bGUuaGlnaGxpZ2h0IDogKHgpID0+IHg7XG4gICAgICAgICAgICByZXR1cm4gY29sb3IoYCR7Y3Vyc29yfSAke2luZGV4TGFiZWx9JHtpdGVtLm5hbWV9YCk7XG4gICAgICAgIH0sXG4gICAgICAgIHBhZ2VTaXplLFxuICAgICAgICBsb29wLFxuICAgIH0pO1xuICAgIGlmIChzdGF0dXMgPT09ICdkb25lJykge1xuICAgICAgICByZXR1cm4gW3ByZWZpeCwgbWVzc2FnZSwgdGhlbWUuc3R5bGUuYW5zd2VyKHNlbGVjdGVkQ2hvaWNlLnNob3J0KV1cbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XG4gICAgfVxuICAgIGNvbnN0IHsgZGVzY3JpcHRpb24gfSA9IHNlbGVjdGVkQ2hvaWNlO1xuICAgIGNvbnN0IGxpbmVzID0gW1xuICAgICAgICBbcHJlZml4LCBtZXNzYWdlXS5maWx0ZXIoQm9vbGVhbikuam9pbignICcpLFxuICAgICAgICBwYWdlLFxuICAgICAgICAnICcsXG4gICAgICAgIGRlc2NyaXB0aW9uID8gdGhlbWUuc3R5bGUuZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIDogJycsXG4gICAgICAgIGVycm9yTXNnID8gdGhlbWUuc3R5bGUuZXJyb3IoZXJyb3JNc2cpIDogJycsXG4gICAgICAgIGhlbHBMaW5lLFxuICAgIF1cbiAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAuam9pbignXFxuJylcbiAgICAgICAgLnRyaW1FbmQoKTtcbiAgICByZXR1cm4gYCR7bGluZXN9JHtjdXJzb3JIaWRlfWA7XG59KTtcbmV4cG9ydCB7IFNlcGFyYXRvciB9IGZyb20gJ0BpbnF1aXJlci9jb3JlJztcbiIsICJpbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuXG5leHBvcnQgdHlwZSBGb3JtYXR0ZXIgPSAnZHByaW50JyB8ICdveGZtdCc7XG5leHBvcnQgdHlwZSBGcmFtZXdvcmsgPSAndml0ZScgfCAncmVhY3QnIHwgJ3Z1ZScgfCAnc3ZlbHRlJztcbmV4cG9ydCB0eXBlIEdpdFV0aWwgPSAnY29tbWl0bGludCcgfCAnbGludC1zdGFnZWQnO1xuZXhwb3J0IHR5cGUgTGludGVyID0gJ2VzbGludCcgfCAnb3hsaW50JztcblxuZXhwb3J0IGludGVyZmFjZSBGb3JtYXR0ZXJzIHtcbiAgcmVhZG9ubHkgY3NzOiBGb3JtYXR0ZXIgfCBudWxsO1xuICByZWFkb25seSBodG1sOiBGb3JtYXR0ZXIgfCBudWxsO1xuICByZWFkb25seSByZWFjdDogRm9ybWF0dGVyIHwgbnVsbDtcbiAgcmVhZG9ubHkgc3ZlbHRlOiBGb3JtYXR0ZXIgfCBudWxsO1xuICByZWFkb25seSB0eXBlc2NyaXB0OiBGb3JtYXR0ZXIgfCBudWxsO1xuICByZWFkb25seSB2dWU6IEZvcm1hdHRlciB8IG51bGw7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnIHtcbiAgcmVhZG9ubHkgZm9ybWF0dGVyczogRm9ybWF0dGVycztcbiAgcmVhZG9ubHkgZnJhbWV3b3JrOiBGcmFtZXdvcmsgfCBudWxsO1xuICByZWFkb25seSBnaXRVdGlsOiByZWFkb25seSBHaXRVdGlsW107XG4gIHJlYWRvbmx5IGxpbnRlcjogTGludGVyIHwgbnVsbDtcbiAgcmVhZG9ubHkgbW9ub3JlcG86IGJvb2xlYW47XG4gIHJlYWRvbmx5IHByb2plY3ROYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0Q29uZmlnKGN3ZDogc3RyaW5nKTogQ29uZmlnIHtcbiAgcmV0dXJuIHtcbiAgICBmb3JtYXR0ZXJzOiB7XG4gICAgICBjc3M6ICdkcHJpbnQnLFxuICAgICAgaHRtbDogJ294Zm10JyxcbiAgICAgIHJlYWN0OiAnb3hmbXQnLFxuICAgICAgc3ZlbHRlOiAnb3hmbXQnLFxuICAgICAgdHlwZXNjcmlwdDogJ294Zm10JyxcbiAgICAgIHZ1ZTogJ294Zm10JyxcbiAgICB9LFxuICAgIGZyYW1ld29yazogbnVsbCxcbiAgICBnaXRVdGlsOiBbJ2xpbnQtc3RhZ2VkJ10sXG4gICAgbGludGVyOiAnb3hsaW50JyxcbiAgICBtb25vcmVwbzogZmFsc2UsXG4gICAgcHJvamVjdE5hbWU6IHBhdGguYmFzZW5hbWUoY3dkKSB8fCAnbXktcHJvamVjdCcsXG4gIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVTY2FmZm9sZChcbiAgY3dkOiBzdHJpbmcsXG4gIHsgZm9ybWF0dGVycywgZnJhbWV3b3JrLCBnaXRVdGlsLCBsaW50ZXIsIG1vbm9yZXBvLCBwcm9qZWN0TmFtZSB9OiBDb25maWcsXG4pOiBQcm9taXNlPHZvaWQ+IHt9XG4iLCAiaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gJ0Bjb21tYW5kZXItanMvZXh0cmEtdHlwaW5ncyc7XG5pbXBvcnQgKiBhcyBpbnF1aXJlciBmcm9tICdAaW5xdWlyZXIvcHJvbXB0cyc7XG5pbXBvcnQgdHlwZSB7XG4gIENvbmZpZyxcbiAgRm9ybWF0dGVyLFxuICBGb3JtYXR0ZXJzLFxuICBGcmFtZXdvcmssXG4gIEdpdFV0aWwsXG4gIExpbnRlcixcbn0gZnJvbSAnLi4vLi4vcGFja2FnZXMvY3JlYXRlLXNjYWZmb2xkLnRzJztcbmltcG9ydCB7XG4gIGNyZWF0ZVNjYWZmb2xkLFxuICBnZXREZWZhdWx0Q29uZmlnLFxufSBmcm9tICcuLi8uLi9wYWNrYWdlcy9jcmVhdGUtc2NhZmZvbGQudHMnO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRGb3JtYXR0ZXJQcm9tcHRzKFxuICBmcmFtZXdvcms6IEZyYW1ld29yayB8IG51bGwsXG4gIGRlZmF1bHRDb25maWc6IENvbmZpZyxcbik6IFByb21pc2U8Rm9ybWF0dGVycz4ge1xuICBsZXQgY3NzOiBGb3JtYXR0ZXIgfCBudWxsID0gZGVmYXVsdENvbmZpZy5mb3JtYXR0ZXJzLmNzcztcbiAgbGV0IGh0bWw6IEZvcm1hdHRlciB8IG51bGwgPSBkZWZhdWx0Q29uZmlnLmZvcm1hdHRlcnMuaHRtbDtcbiAgY29uc3QgcmVhY3Q6IEZvcm1hdHRlciB8IG51bGwgPSBkZWZhdWx0Q29uZmlnLmZvcm1hdHRlcnMucmVhY3Q7XG4gIGNvbnN0IHN2ZWx0ZTogRm9ybWF0dGVyIHwgbnVsbCA9IGRlZmF1bHRDb25maWcuZm9ybWF0dGVycy5zdmVsdGU7XG4gIGxldCB0eXBlc2NyaXB0OiBGb3JtYXR0ZXIgfCBudWxsID0gZGVmYXVsdENvbmZpZy5mb3JtYXR0ZXJzLnR5cGVzY3JpcHQ7XG4gIGNvbnN0IHZ1ZTogRm9ybWF0dGVyIHwgbnVsbCA9IGRlZmF1bHRDb25maWcuZm9ybWF0dGVycy52dWU7XG4gIGxldCBmcmFtZXdvcmtOYW1lOiBGcmFtZXdvcmsgfCB1bmRlZmluZWQ7XG4gIGxldCBmcmFtZXdvcmtWYWx1ZTogRm9ybWF0dGVyIHwgbnVsbCA9IG51bGw7XG4gIGNvbnN0IHJldDogRm9ybWF0dGVycyA9IHsgY3NzLCBodG1sLCByZWFjdCwgc3ZlbHRlLCB0eXBlc2NyaXB0LCB2dWUgfTtcblxuICB0eXBlc2NyaXB0ID0gYXdhaXQgaW5xdWlyZXIuc2VsZWN0KHtcbiAgICBjaG9pY2VzOiBbXG4gICAgICB7IHZhbHVlOiAnZHByaW50JyB9LFxuICAgICAgeyB2YWx1ZTogJ294Zm10JyB9LFxuICAgICAgeyBuYW1lOiAnbm9uZScsIHZhbHVlOiBudWxsIH0sXG4gICAgXSxcbiAgICBkZWZhdWx0OiB0eXBlc2NyaXB0LFxuICAgIG1lc3NhZ2U6IGBGb3JtYXR0ZXIgZm9yIFR5cGVTY3JpcHQ/YCxcbiAgfSk7XG4gIHN3aXRjaCAoZnJhbWV3b3JrKSB7XG4gICAgY2FzZSAncmVhY3QnOlxuICAgIGNhc2UgJ3N2ZWx0ZSc6XG4gICAgY2FzZSAndnVlJzoge1xuICAgICAgZnJhbWV3b3JrVmFsdWUgPSBhd2FpdCBpbnF1aXJlci5zZWxlY3Qoe1xuICAgICAgICBjaG9pY2VzOiBbXG4gICAgICAgICAgeyB2YWx1ZTogJ2RwcmludCcgfSxcbiAgICAgICAgICB7IHZhbHVlOiAnb3hmbXQnIH0sXG4gICAgICAgICAgeyBuYW1lOiAnbm9uZScsIHZhbHVlOiBudWxsIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGRlZmF1bHQ6IHJldFtmcmFtZXdvcmtdLFxuICAgICAgICBtZXNzYWdlOiBgRm9ybWF0dGVyIGZvciAke2ZyYW1ld29yay50b1VwcGVyQ2FzZSgpfT9gLFxuICAgICAgfSk7XG4gICAgICBmcmFtZXdvcmtOYW1lID0gZnJhbWV3b3JrO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIGh0bWwgPSBhd2FpdCBpbnF1aXJlci5zZWxlY3Qoe1xuICAgIGNob2ljZXM6IFtcbiAgICAgIHsgdmFsdWU6ICdkcHJpbnQnIH0sXG4gICAgICB7IHZhbHVlOiAnb3hmbXQnIH0sXG4gICAgICB7IG5hbWU6ICdub25lJywgdmFsdWU6IG51bGwgfSxcbiAgICBdLFxuICAgIGRlZmF1bHQ6IGh0bWwsXG4gICAgbWVzc2FnZTogYEZvcm1hdHRlciBmb3IgSFRNTD9gLFxuICB9KTtcbiAgY3NzID0gYXdhaXQgaW5xdWlyZXIuc2VsZWN0KHtcbiAgICBjaG9pY2VzOiBbXG4gICAgICB7IHZhbHVlOiAnZHByaW50JyB9LFxuICAgICAgeyB2YWx1ZTogJ294Zm10JyB9LFxuICAgICAgeyBuYW1lOiAnbm9uZScsIHZhbHVlOiBudWxsIH0sXG4gICAgXSxcbiAgICBkZWZhdWx0OiBjc3MsXG4gICAgbWVzc2FnZTogYEZvcm1hdHRlciBmb3IgQ1NTP2AsXG4gIH0pO1xuICByZXR1cm4gZnJhbWV3b3JrTmFtZSA/IHsgLi4ucmV0LCBbZnJhbWV3b3JrTmFtZV06IGZyYW1ld29ya1ZhbHVlIH0gOiByZXQ7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFByb21wdHMoY3dkOiBzdHJpbmcsIHVzZURlZmF1bHQ6IGJvb2xlYW4pOiBQcm9taXNlPENvbmZpZz4ge1xuICBjb25zdCBkZWZhdWx0Q29uZmlnID0gZ2V0RGVmYXVsdENvbmZpZyhjd2QpO1xuXG4gIGlmICh1c2VEZWZhdWx0KSB7XG4gICAgcmV0dXJuIGRlZmF1bHRDb25maWc7XG4gIH1cbiAgY29uc3QgcHJvamVjdE5hbWUgPSBhd2FpdCBpbnF1aXJlci5pbnB1dCh7XG4gICAgZGVmYXVsdDogZGVmYXVsdENvbmZpZy5wcm9qZWN0TmFtZSxcbiAgICBtZXNzYWdlOiAnUHJvamVjdCBuYW1lPycsXG4gIH0pO1xuICBjb25zdCBmcmFtZXdvcmsgPSBhd2FpdCBpbnF1aXJlci5zZWxlY3Q8RnJhbWV3b3JrIHwgbnVsbD4oe1xuICAgIGNob2ljZXM6IFtcbiAgICAgIHsgZGlzYWJsZWQ6IHRydWUsIHZhbHVlOiAncmVhY3QnIH0sXG4gICAgICB7IGRpc2FibGVkOiB0cnVlLCB2YWx1ZTogJ3Z1ZScgfSxcbiAgICAgIHsgZGlzYWJsZWQ6IHRydWUsIHZhbHVlOiAnc3ZlbHRlJyB9LFxuICAgICAgeyBkaXNhYmxlZDogdHJ1ZSwgdmFsdWU6ICd2aXRlJyB9LFxuICAgICAgeyBuYW1lOiAnbm9uZScsIHZhbHVlOiBudWxsIH0sXG4gICAgXSxcbiAgICBkZWZhdWx0OiBkZWZhdWx0Q29uZmlnLmZyYW1ld29yayxcbiAgICBtZXNzYWdlOiAnRnJhbWV3b3JrPycsXG4gIH0pO1xuICBjb25zdCBtb25vcmVwbyA9IGF3YWl0IGlucXVpcmVyLmNvbmZpcm0oe1xuICAgIGRlZmF1bHQ6IGZyYW1ld29yayA/IHRydWUgOiBkZWZhdWx0Q29uZmlnLm1vbm9yZXBvLFxuICAgIG1lc3NhZ2U6ICdNb25vcmVwbz8nLFxuICB9KTtcbiAgY29uc3QgbGludGVyID0gYXdhaXQgaW5xdWlyZXIuc2VsZWN0PExpbnRlciB8IG51bGw+KHtcbiAgICBjaG9pY2VzOiBbXG4gICAgICB7IHZhbHVlOiAnb3hsaW50JyB9LFxuICAgICAgeyBkaXNhYmxlZDogdHJ1ZSwgbmFtZTogJ2VzbGludCAoZGVwcmVjYXRlZCknLCB2YWx1ZTogJ2VzbGludCcgfSxcbiAgICAgIHsgbmFtZTogJ25vbmUnLCB2YWx1ZTogbnVsbCB9LFxuICAgIF0sXG4gICAgZGVmYXVsdDogZGVmYXVsdENvbmZpZy5saW50ZXIsXG4gICAgbWVzc2FnZTogJ0xpbnRlcj8nLFxuICB9KTtcbiAgY29uc3QgZm9ybWF0dGVycyA9IGF3YWl0IGdldEZvcm1hdHRlclByb21wdHMoZnJhbWV3b3JrLCBkZWZhdWx0Q29uZmlnKTtcbiAgY29uc3QgZ2l0VXRpbCA9IGF3YWl0IGlucXVpcmVyLmNoZWNrYm94PEdpdFV0aWw+KHtcbiAgICBjaG9pY2VzOiBbXG4gICAgICB7XG4gICAgICAgIGNoZWNrZWQ6IGRlZmF1bHRDb25maWcuZ2l0VXRpbC5pbmNsdWRlcygnbGludC1zdGFnZWQnKSxcbiAgICAgICAgdmFsdWU6ICdsaW50LXN0YWdlZCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjaGVja2VkOiBkZWZhdWx0Q29uZmlnLmdpdFV0aWwuaW5jbHVkZXMoJ2NvbW1pdGxpbnQnKSxcbiAgICAgICAgdmFsdWU6ICdjb21taXRsaW50JyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBtZXNzYWdlOiAnVXRpbHMgZm9yIEdpdD8nLFxuICB9KTtcbiAgcmV0dXJuIHsgZm9ybWF0dGVycywgZnJhbWV3b3JrLCBnaXRVdGlsLCBsaW50ZXIsIG1vbm9yZXBvLCBwcm9qZWN0TmFtZSB9O1xufVxuXG5leHBvcnQgY29uc3QgY3JlYXRlID0gbmV3IENvbW1hbmQoJ2NyZWF0ZScpXG4gIC5vcHRpb24oJy1kLCAtLWRpciA8ZGlyPicsICd3b3JraW5nIGRpcmVjdG9yeScsIHByb2Nlc3MuY3dkKCkpXG4gIC5vcHRpb24oJy15LCAtLXllcycsICdleGVjdXRlIHdpdGhvdXQgYW55IHByb21wdHMnLCBmYWxzZSlcbiAgLmFjdGlvbihhc3luYyAoeyBkaXIsIHllczogdXNlRGVmYXVsdCB9KSA9PiB7XG4gICAgYXdhaXQgY3JlYXRlU2NhZmZvbGQoZGlyLCBhd2FpdCBnZXRQcm9tcHRzKGRpciwgdXNlRGVmYXVsdCkpO1xuICB9KTtcbiIsICJpbXBvcnQgeyBwcm9ncmFtIH0gZnJvbSAnQGNvbW1hbmRlci1qcy9leHRyYS10eXBpbmdzJztcbmltcG9ydCBwYWNrYWdlSnNvbiBmcm9tICcuLi8uLi9wYWNrYWdlLmpzb24nIHdpdGggeyB0eXBlOiAnanNvbicgfTtcbmltcG9ydCB7IGNyZWF0ZSB9IGZyb20gJy4vY29tbWFuZHMvY3JlYXRlLnRzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG1haW4oYXJndjogcmVhZG9ubHkgc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgcHJvZ3JhbVxuICAgIC5uYW1lKCdzY2FmZm9sZCcpXG4gICAgLnZlcnNpb24ocGFja2FnZUpzb24udmVyc2lvbilcbiAgICAuYWRkQ29tbWFuZChjcmVhdGUsIHsgaXNEZWZhdWx0OiB0cnVlIH0pO1xuICBhd2FpdCBwcm9ncmFtLnBhcnNlQXN5bmMoYXJndik7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOztreEJBQUEs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QU0sQ0FDMUMsTUFBTVUsR0FBZUQsRUFBSyxNQUFNWCxHQUFXVyxFQUFLVCxDQUFVLENBQUMsQ0FDN0QsQ0FBQyxFQ2hJSCxlQUFzQlcsR0FBS0MsRUFBd0MsQ0FDakVDLEdBQ0csS0FBSyxVQUFVLEVBQ2YsUUFBUUMsR0FBWSxPQUFPLEVBQzNCLFdBQVdDLEdBQVEsQ0FBRSxVQUFXLEVBQUssQ0FBQyxFQUN6QyxNQUFNRixHQUFRLFdBQVdELENBQUksQ0FDL0IsQ2xDUEksUUFBUSxLQUFLLENBQUMsSUFBTSxJQUN0QixRQUFRLElBQUlJLEdBQWEsRUFBRyxPQUFPLENBQUMsRUFFcEMsTUFBTUMsR0FBSyxRQUFRLEtBQUssTUFBTSxDQUFDLENBQUMiLAogICJuYW1lcyI6IFsicmVxdWlyZV9lcnJvciIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiQ29tbWFuZGVyRXJyb3IiLCAiZXhpdENvZGUiLCAiY29kZSIsICJtZXNzYWdlIiwgIkludmFsaWRBcmd1bWVudEVycm9yIiwgInJlcXVpcmVfYXJndW1lbnQiLCAiX19jb21tb25KU01pbiIsICJleHBvcnRzIiwgIkludmFsaWRBcmd1bWVudEVycm9yIiwgIkFyZ3VtZW50IiwgIm5hbWUiLCAiZGVzY3JpcHRpb24iLCAidmFsdWUiLCAicHJldmlvdXMiLCAiZm4iLCAidmFsdWVzIiwgImFyZyIsICJodW1hblJlYWRhYmxlQXJnTmFtZSIsICJuYW1lT3V0cHV0IiwgInJlcXVpcmVfaGVscCIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiaHVtYW5SZWFkYWJsZUFyZ05hbWUiLCAiSGVscCIsICJjb250ZXh0T3B0aW9ucyIsICJjbWQiLCAidmlzaWJsZUNvbW1hbmRzIiwgImhlbHBDb21tYW5kIiwgImEiLCAiYiIsICJnZXRTb3J0S2V5IiwgIm9wdGlvbiIsICJ2aXNpYmxlT3B0aW9ucyIsICJoZWxwT3B0aW9uIiwgInJlbW92ZVNob3J0IiwgInJlbW92ZUxvbmciLCAiZ2xvYmFsT3B0aW9ucyIsICJhbmNlc3RvckNtZCIsICJhcmd1bWVudCIsICJhcmdzIiwgImFyZyIsICJoZWxwZXIiLCAibWF4IiwgImNvbW1hbmQiLCAiY21kTmFtZSIsICJhbmNlc3RvckNtZE5hbWVzIiwgImV4dHJhSW5mbyIsICJjaG9pY2UiLCAiZXh0cmFEZXNjcmlwdGlvbiIsICJoZWFkaW5nIiwgIml0ZW1zIiwgInVuc29ydGVkSXRlbXMiLCAidmlzaWJsZUl0ZW1zIiwgImdldEdyb3VwIiwgInJlc3VsdCIsICJpdGVtIiwgImdyb3VwIiwgInRlcm1XaWR0aCIsICJoZWxwV2lkdGgiLCAiY2FsbEZvcm1hdEl0ZW0iLCAidGVybSIsICJkZXNjcmlwdGlvbiIsICJvdXRwdXQiLCAiY29tbWFuZERlc2NyaXB0aW9uIiwgImFyZ3VtZW50TGlzdCIsICJvcHRpb25zIiwgIm9wdGlvbkxpc3QiLCAiZ2xvYmFsT3B0aW9uTGlzdCIsICJzdWIiLCAiY29tbWFuZHMiLCAiY29tbWFuZExpc3QiLCAic3RyIiwgInN0cmlwQ29sb3IiLCAid29yZCIsICJpdGVtSW5kZW50U3RyIiwgInBhZGRlZFRlcm0iLCAic3BhY2VyV2lkdGgiLCAicmVtYWluaW5nV2lkdGgiLCAiZm9ybWF0dGVkRGVzY3JpcHRpb24iLCAid2lkdGgiLCAicmF3TGluZXMiLCAiY2h1bmtQYXR0ZXJuIiwgIndyYXBwZWRMaW5lcyIsICJsaW5lIiwgImNodW5rcyIsICJzdW1DaHVua3MiLCAic3VtV2lkdGgiLCAiY2h1bmsiLCAidmlzaWJsZVdpZHRoIiwgIm5leHRDaHVuayIsICJzZ3JQYXR0ZXJuIiwgInJlcXVpcmVfb3B0aW9uIiwgIl9fY29tbW9uSlNNaW4iLCAiZXhwb3J0cyIsICJJbnZhbGlkQXJndW1lbnRFcnJvciIsICJPcHRpb24iLCAiZmxhZ3MiLCAiZGVzY3JpcHRpb24iLCAib3B0aW9uRmxhZ3MiLCAic3BsaXRPcHRpb25GbGFncyIsICJ2YWx1ZSIsICJhcmciLCAibmFtZXMiLCAiaW1wbGllZE9wdGlvblZhbHVlcyIsICJuZXdJbXBsaWVkIiwgIm5hbWUiLCAiZm4iLCAibWFuZGF0b3J5IiwgImhpZGUiLCAicHJldmlvdXMiLCAidmFsdWVzIiwgImNhbWVsY2FzZSIsICJoZWFkaW5nIiwgIkR1YWxPcHRpb25zIiwgIm9wdGlvbnMiLCAib3B0aW9uIiwgImtleSIsICJvcHRpb25LZXkiLCAicHJlc2V0IiwgIm5lZ2F0aXZlVmFsdWUiLCAic3RyIiwgIndvcmQiLCAic2hvcnRGbGFnIiwgImxvbmdGbGFnIiwgInNob3J0RmxhZ0V4cCIsICJsb25nRmxhZ0V4cCIsICJmbGFnUGFydHMiLCAidW5zdXBwb3J0ZWRGbGFnIiwgImJhc2VFcnJvciIsICJyZXF1aXJlX3N1Z2dlc3RTaW1pbGFyIiwgIl9fY29tbW9uSlNNaW4iLCAiZXhwb3J0cyIsICJlZGl0RGlzdGFuY2UiLCAiYSIsICJiIiwgImQiLCAiaSIsICJqIiwgImNvc3QiLCAic3VnZ2VzdFNpbWlsYXIiLCAid29yZCIsICJjYW5kaWRhdGVzIiwgInNlYXJjaGluZ09wdGlvbnMiLCAiY2FuZGlkYXRlIiwgInNpbWlsYXIiLCAiYmVzdERpc3RhbmNlIiwgIm1pblNpbWlsYXJpdHkiLCAiZGlzdGFuY2UiLCAibGVuZ3RoIiwgInJlcXVpcmVfY29tbWFuZCIsICJfX2NvbW1vbkpTTWluIiwgImV4cG9ydHMiLCAiRXZlbnRFbWl0dGVyIiwgImNoaWxkUHJvY2VzcyIsICJwYXRoIiwgImZzIiwgInByb2Nlc3MiLCAiQXJndW1lbnQiLCAiaHVtYW5SZWFkYWJsZUFyZ05hbWUiLCAiQ29tbWFuZGVyRXJyb3IiLCAiSGVscCIsICJzdHJpcENvbG9yIiwgIk9wdGlvbiIsICJEdWFsT3B0aW9ucyIsICJzdWdnZXN0U2ltaWxhciIsICJDb21tYW5kIiwgIl9Db21tYW5kIiwgIm5hbWUiLCAic3RyIiwgIndyaXRlIiwgInVzZUNvbG9yIiwgInNvdXJjZUNvbW1hbmQiLCAicmVzdWx0IiwgImNvbW1hbmQiLCAibmFtZUFuZEFyZ3MiLCAiYWN0aW9uT3B0c09yRXhlY0Rlc2MiLCAiZXhlY09wdHMiLCAiZGVzYyIsICJvcHRzIiwgImFyZ3MiLCAiY21kIiwgImNvbmZpZ3VyYXRpb24iLCAiZGlzcGxheUhlbHAiLCAiZGlzcGxheVN1Z2dlc3Rpb24iLCAiZGVzY3JpcHRpb24iLCAicGFyc2VBcmciLCAiZGVmYXVsdFZhbHVlIiwgImFyZ3VtZW50IiwgIm5hbWVzIiwgImRldGFpbCIsICJwcmV2aW91c0FyZ3VtZW50IiwgImVuYWJsZU9yTmFtZUFuZEFyZ3MiLCAiaGVscE5hbWUiLCAiaGVscEFyZ3MiLCAiaGVscERlc2NyaXB0aW9uIiwgImhlbHBDb21tYW5kIiwgImRlcHJlY2F0ZWREZXNjcmlwdGlvbiIsICJldmVudCIsICJsaXN0ZW5lciIsICJhbGxvd2VkVmFsdWVzIiwgImZuIiwgImVyciIsICJleGl0Q29kZSIsICJjb2RlIiwgIm1lc3NhZ2UiLCAiZXhwZWN0ZWRBcmdzQ291bnQiLCAiYWN0aW9uQXJncyIsICJmbGFncyIsICJ0YXJnZXQiLCAidmFsdWUiLCAicHJldmlvdXMiLCAiaW52YWxpZEFyZ3VtZW50TWVzc2FnZSIsICJvcHRpb24iLCAibWF0Y2hpbmdPcHRpb24iLCAibWF0Y2hpbmdGbGFnIiwgImtub3duQnkiLCAiYWxyZWFkeVVzZWQiLCAiZXhpc3RpbmdDbWQiLCAibmV3Q21kIiwgIm9uYW1lIiwgInBvc2l0aXZlTG9uZ0ZsYWciLCAiaGFuZGxlT3B0aW9uVmFsdWUiLCAidmFsIiwgImludmFsaWRWYWx1ZU1lc3NhZ2UiLCAidmFsdWVTb3VyY2UiLCAib2xkVmFsdWUiLCAiY29uZmlnIiwgInJlZ2V4IiwgImRlZiIsICJtIiwgImNvbWJpbmUiLCAiYWxsb3dVbmtub3duIiwgImFsbG93RXhjZXNzIiwgInBvc2l0aW9uYWwiLCAicGFzc1Rocm91Z2giLCAic3RvcmVBc1Byb3BlcnRpZXMiLCAia2V5IiwgInNvdXJjZSIsICJhcmd2IiwgInBhcnNlT3B0aW9ucyIsICJleGVjQXJndiIsICJ1c2VyQXJncyIsICJleGVjdXRhYmxlRmlsZSIsICJleGVjdXRhYmxlRGlyIiwgInN1YmNvbW1hbmROYW1lIiwgImV4ZWN1dGFibGVEaXJNZXNzYWdlIiwgImV4ZWN1dGFibGVNaXNzaW5nIiwgInN1YmNvbW1hbmQiLCAibGF1bmNoV2l0aE5vZGUiLCAic291cmNlRXh0IiwgImZpbmRGaWxlIiwgImJhc2VEaXIiLCAiYmFzZU5hbWUiLCAibG9jYWxCaW4iLCAiZm91bmRFeHQiLCAiZXh0IiwgInJlc29sdmVkU2NyaXB0UGF0aCIsICJsb2NhbEZpbGUiLCAibGVnYWN5TmFtZSIsICJwcm9jIiwgImluY3JlbWVudE5vZGVJbnNwZWN0b3JQb3J0IiwgInNpZ25hbCIsICJleGl0Q2FsbGJhY2siLCAid3JhcHBlZEVycm9yIiwgImNvbW1hbmROYW1lIiwgIm9wZXJhbmRzIiwgInVua25vd24iLCAic3ViQ29tbWFuZCIsICJwcm9taXNlQ2hhaW4iLCAiYXJnIiwgImkiLCAibXlQYXJzZUFyZyIsICJwYXJzZWRWYWx1ZSIsICJwcm9jZXNzZWRBcmdzIiwgImRlY2xhcmVkQXJnIiwgImluZGV4IiwgInByb2Nlc3NlZCIsICJ2IiwgInByb21pc2UiLCAiaG9va3MiLCAiaG9va2VkQ29tbWFuZCIsICJjYWxsYmFjayIsICJob29rRGV0YWlsIiwgImhvb2siLCAicGFyc2VkIiwgImNoZWNrRm9yVW5rbm93bk9wdGlvbnMiLCAiY29tbWFuZEV2ZW50IiwgImFuT3B0aW9uIiwgImRlZmluZWROb25EZWZhdWx0T3B0aW9ucyIsICJvcHRpb25LZXkiLCAiY29uZmxpY3RpbmdBbmREZWZpbmVkIiwgImRlZmluZWQiLCAiZGVzdCIsICJtYXliZU9wdGlvbiIsICJuZWdhdGl2ZU51bWJlckFyZyIsICJvcHQiLCAic2hvcnQiLCAiYWN0aXZlVmFyaWFkaWNPcHRpb24iLCAiYWN0aXZlR3JvdXAiLCAibGVuIiwgImNvbWJpbmVkT3B0aW9ucyIsICJlcnJvck9wdGlvbnMiLCAiZHVhbEhlbHBlciIsICJoYXNDdXN0b21PcHRpb25WYWx1ZSIsICJpbXBsaWVkS2V5IiwgImNvbmZsaWN0aW5nT3B0aW9uIiwgImZpbmRCZXN0T3B0aW9uRnJvbVZhbHVlIiwgIm9wdGlvblZhbHVlIiwgIm5lZ2F0aXZlT3B0aW9uIiwgInBvc2l0aXZlT3B0aW9uIiwgImdldEVycm9yTWVzc2FnZSIsICJiZXN0T3B0aW9uIiwgImZsYWciLCAic3VnZ2VzdGlvbiIsICJjYW5kaWRhdGVGbGFncyIsICJtb3JlRmxhZ3MiLCAicmVjZWl2ZWRBcmdzIiwgImV4cGVjdGVkIiwgInMiLCAidW5rbm93bk5hbWUiLCAiY2FuZGlkYXRlTmFtZXMiLCAidmVyc2lvbk9wdGlvbiIsICJhcmdzRGVzY3JpcHRpb24iLCAiYWxpYXMiLCAibWF0Y2hpbmdDb21tYW5kIiwgImFsaWFzZXMiLCAiaGVhZGluZyIsICJmaWxlbmFtZSIsICJjb250ZXh0T3B0aW9ucyIsICJoZWxwZXIiLCAiY29udGV4dCIsICJ0ZXh0IiwgImVycm9yIiwgImJhc2VXcml0ZSIsICJoYXNDb2xvcnMiLCAiaGVscFdpZHRoIiwgImRlcHJlY2F0ZWRDYWxsYmFjayIsICJvdXRwdXRDb250ZXh0IiwgImV2ZW50Q29udGV4dCIsICJoZWxwSW5mb3JtYXRpb24iLCAicG9zaXRpb24iLCAiaGVscEV2ZW50IiwgImhlbHBTdHIiLCAiaGVscE9wdGlvbiIsICJkZWJ1Z09wdGlvbiIsICJkZWJ1Z0hvc3QiLCAiZGVidWdQb3J0IiwgIm1hdGNoIiwgInJlcXVpcmVfY29tbWFuZGVyIiwgIl9fY29tbW9uSlNNaW4iLCAiZXhwb3J0cyIsICJBcmd1bWVudCIsICJDb21tYW5kIiwgIkNvbW1hbmRlckVycm9yIiwgIkludmFsaWRBcmd1bWVudEVycm9yIiwgIkhlbHAiLCAiT3B0aW9uIiwgIm5hbWUiLCAiZmxhZ3MiLCAiZGVzY3JpcHRpb24iLCAicmVxdWlyZV9leHRyYV90eXBpbmdzIiwgIl9fY29tbW9uSlNNaW4iLCAiZXhwb3J0cyIsICJtb2R1bGUiLCAiY29tbWFuZGVyIiwgIm5hbWUiLCAiZmxhZ3MiLCAiZGVzY3JpcHRpb24iLCAicmVxdWlyZV9jbGlfd2lkdGgiLCAiX19jb21tb25KU01pbiIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJjbGlXaWR0aCIsICJub3JtYWxpemVPcHRzIiwgIm9wdGlvbnMiLCAiZGVmYXVsdE9wdHMiLCAia2V5IiwgIm9wdHMiLCAid2lkdGgiLCAicmVxdWlyZV9saWIiLCAiX19jb21tb25KU01pbiIsICJleHBvcnRzIiwgIm1vZHVsZSIsICJTdHJlYW0iLCAiTXV0ZVN0cmVhbSIsICIjaXNUVFkiLCAib3B0cyIsICIjZGVzdFNyYyIsICJrZXkiLCAiZGVmIiwgIiNwcm94eSIsICJtZXRob2QiLCAiYXJncyIsICJ2YWwiLCAic3JjIiwgImRlc3QiLCAib3B0aW9ucyIsICJjIiwgInJlYWRGaWxlU3luYyIsICJpbXBvcnRfaW5kZXgiLCAicHJvZ3JhbSIsICJjcmVhdGVDb21tYW5kIiwgImNyZWF0ZUFyZ3VtZW50IiwgImNyZWF0ZU9wdGlvbiIsICJDb21tYW5kZXJFcnJvciIsICJJbnZhbGlkQXJndW1lbnRFcnJvciIsICJJbnZhbGlkT3B0aW9uQXJndW1lbnRFcnJvciIsICJDb21tYW5kIiwgIkFyZ3VtZW50IiwgIk9wdGlvbiIsICJIZWxwIiwgImV4dHJhVHlwaW5nc0NvbW1hbmRlciIsICJwYWNrYWdlX2RlZmF1bHQiLCAiaXNVcEtleSIsICJrZXkiLCAia2V5YmluZGluZ3MiLCAiaXNEb3duS2V5IiwgImlzU3BhY2VLZXkiLCAiaXNCYWNrc3BhY2VLZXkiLCAiaXNUYWJLZXkiLCAiaXNOdW1iZXJLZXkiLCAiaXNFbnRlcktleSIsICJBYm9ydFByb21wdEVycm9yIiwgIm9wdGlvbnMiLCAiQ2FuY2VsUHJvbXB0RXJyb3IiLCAiRXhpdFByb21wdEVycm9yIiwgIkhvb2tFcnJvciIsICJWYWxpZGF0aW9uRXJyb3IiLCAiQXN5bmNSZXNvdXJjZSIsICJBc3luY0xvY2FsU3RvcmFnZSIsICJBc3luY1Jlc291cmNlIiwgImhvb2tTdG9yYWdlIiwgIkFzeW5jTG9jYWxTdG9yYWdlIiwgImNyZWF0ZVN0b3JlIiwgInJsIiwgIndpdGhIb29rcyIsICJjYiIsICJzdG9yZSIsICJjeWNsZSIsICJyZW5kZXIiLCAiZ2V0U3RvcmUiLCAiSG9va0Vycm9yIiwgInJlYWRsaW5lIiwgIndpdGhVcGRhdGVzIiwgImZuIiwgIndyYXBwZWQiLCAiYXJncyIsICJzaG91bGRVcGRhdGUiLCAib2xkSGFuZGxlQ2hhbmdlIiwgInJldHVyblZhbHVlIiwgIkFzeW5jUmVzb3VyY2UiLCAid2l0aFBvaW50ZXIiLCAiaW5kZXgiLCAicG9pbnRlciIsICJ2YWx1ZSIsICJoYW5kbGVDaGFuZ2UiLCAiZWZmZWN0U2NoZWR1bGVyIiwgImNsZWFuRm4iLCAiVmFsaWRhdGlvbkVycm9yIiwgImVmZmVjdCIsICJ1c2VTdGF0ZSIsICJkZWZhdWx0VmFsdWUiLCAid2l0aFBvaW50ZXIiLCAicG9pbnRlciIsICJzZXRTdGF0ZSIsICJBc3luY1Jlc291cmNlIiwgIm5ld1ZhbHVlIiwgImhhbmRsZUNoYW5nZSIsICJ2YWx1ZSIsICJ1c2VFZmZlY3QiLCAiY2IiLCAiZGVwQXJyYXkiLCAid2l0aFBvaW50ZXIiLCAicG9pbnRlciIsICJvbGREZXBzIiwgImRlcCIsICJpIiwgImVmZmVjdFNjaGVkdWxlciIsICJzdHlsZVRleHQiLCAicHJvY2VzcyIsICJpc1VuaWNvZGVTdXBwb3J0ZWQiLCAiY29tbW9uIiwgInNwZWNpYWxNYWluU3ltYm9scyIsICJzcGVjaWFsRmFsbGJhY2tTeW1ib2xzIiwgIm1haW5TeW1ib2xzIiwgImZhbGxiYWNrU3ltYm9scyIsICJzaG91bGRVc2VNYWluIiwgImZpZ3VyZXMiLCAiZGlzdF9kZWZhdWx0IiwgInJlcGxhY2VtZW50cyIsICJkZWZhdWx0VGhlbWUiLCAic3R5bGVUZXh0IiwgImRpc3RfZGVmYXVsdCIsICJmcmFtZSIsICJ0ZXh0IiwgImlzUGxhaW5PYmplY3QiLCAidmFsdWUiLCAicHJvdG8iLCAiZGVlcE1lcmdlIiwgIm9iamVjdHMiLCAib3V0cHV0IiwgIm9iaiIsICJrZXkiLCAicHJldlZhbHVlIiwgIm1ha2VUaGVtZSIsICJ0aGVtZXMiLCAidGhlbWVzVG9NZXJnZSIsICJkZWZhdWx0VGhlbWUiLCAidGhlbWUiLCAidXNlUHJlZml4IiwgInN0YXR1cyIsICJ0aGVtZSIsICJzaG93TG9hZGVyIiwgInNldFNob3dMb2FkZXIiLCAidXNlU3RhdGUiLCAidGljayIsICJzZXRUaWNrIiwgInByZWZpeCIsICJzcGlubmVyIiwgIm1ha2VUaGVtZSIsICJ1c2VFZmZlY3QiLCAidGlja0ludGVydmFsIiwgImluYyIsICJkZWxheVRpbWVvdXQiLCAidXNlTWVtbyIsICJmbiIsICJkZXBlbmRlbmNpZXMiLCAid2l0aFBvaW50ZXIiLCAicG9pbnRlciIsICJwcmV2IiwgImRlcCIsICJpIiwgInZhbHVlIiwgInVzZVJlZiIsICJ2YWwiLCAidXNlU3RhdGUiLCAidXNlS2V5cHJlc3MiLCAidXNlckhhbmRsZXIiLCAic2lnbmFsIiwgInVzZVJlZiIsICJ1c2VFZmZlY3QiLCAicmwiLCAiaWdub3JlIiwgImhhbmRsZXIiLCAid2l0aFVwZGF0ZXMiLCAiX2lucHV0IiwgImV2ZW50IiwgImltcG9ydF9jbGlfd2lkdGgiLCAiZ2V0Q29kZVBvaW50c0xlbmd0aCIsICJTVVJST0dBVEVfUEFJUl9SRSIsICJpbnB1dCIsICJzdXJyb2dhdGVQYWlyc05yIiwgImlzRnVsbFdpZHRoIiwgIngiLCAiaXNXaWRlTm90Q0pLVE5vdEVtb2ppIiwgIkFOU0lfUkUiLCAiQ09OVFJPTF9SRSIsICJDSktUX1dJREVfUkUiLCAiVEFCX1JFIiwgIkVNT0pJX1JFIiwgIkxBVElOX1JFIiwgIk1PRElGSUVSX1JFIiwgIk5PX1RSVU5DQVRJT04iLCAiZ2V0U3RyaW5nVHJ1bmNhdGVkV2lkdGgiLCAiaW5wdXQiLCAidHJ1bmNhdGlvbk9wdGlvbnMiLCAid2lkdGhPcHRpb25zIiwgIkxJTUlUIiwgIkVMTElQU0lTIiwgIkVMTElQU0lTX1dJRFRIIiwgIkFOU0lfV0lEVEgiLCAiQ09OVFJPTF9XSURUSCIsICJUQUJfV0lEVEgiLCAiRU1PSklfV0lEVEgiLCAiRlVMTF9XSURUSF9XSURUSCIsICJSRUdVTEFSX1dJRFRIIiwgIldJREVfV0lEVEgiLCAiUEFSU0VfQkxPQ0tTIiwgImluZGV4UHJldiIsICJpbmRleCIsICJsZW5ndGgiLCAibGVuZ3RoRXh0cmEiLCAidHJ1bmNhdGlvbkVuYWJsZWQiLCAidHJ1bmNhdGlvbkluZGV4IiwgInRydW5jYXRpb25MaW1pdCIsICJ1bm1hdGNoZWRTdGFydCIsICJ1bm1hdGNoZWRFbmQiLCAid2lkdGgiLCAid2lkdGhFeHRyYSIsICJvdXRlciIsICJ1bm1hdGNoZWQiLCAiY2hhciIsICJjb2RlUG9pbnQiLCAiaXNGdWxsV2lkdGgiLCAiaXNXaWRlTm90Q0pLVE5vdEVtb2ppIiwgImkiLCAibCIsICJCTE9DS19SRSIsICJCTE9DS19XSURUSCIsICJnZXRDb2RlUG9pbnRzTGVuZ3RoIiwgImRpc3RfZGVmYXVsdCIsICJOT19UUlVOQ0FUSU9OIiwgImZhc3RTdHJpbmdXaWR0aCIsICJpbnB1dCIsICJvcHRpb25zIiwgImRpc3RfZGVmYXVsdCIsICJFU0MiLCAiQ1NJIiwgIkVORF9DT0RFIiwgIkFOU0lfRVNDQVBFX0JFTEwiLCAiQU5TSV9DU0kiLCAiQU5TSV9PU0MiLCAiQU5TSV9TR1JfVEVSTUlOQVRPUiIsICJBTlNJX0VTQ0FQRV9MSU5LIiwgIkdST1VQX1JFR0VYIiwgImdldENsb3NpbmdDb2RlIiwgIm9wZW5pbmdDb2RlIiwgIndyYXBBbnNpQ29kZSIsICJjb2RlIiwgIndyYXBBbnNpSHlwZXJsaW5rIiwgInVybCIsICJ3cmFwV29yZCIsICJyb3dzIiwgIndvcmQiLCAiY29sdW1ucyIsICJjaGFyYWN0ZXJzIiwgImlzSW5zaWRlRXNjYXBlIiwgImlzSW5zaWRlTGlua0VzY2FwZSIsICJsYXN0Um93IiwgInZpc2libGUiLCAiZGlzdF9kZWZhdWx0IiwgImN1cnJlbnRDaGFyYWN0ZXIiLCAibmV4dENoYXJhY3RlciIsICJyYXdDaGFyYWN0ZXJJbmRleCIsICJjaGFyYWN0ZXIiLCAiY2hhcmFjdGVyTGVuZ3RoIiwgInN0cmluZ1Zpc2libGVUcmltU3BhY2VzUmlnaHQiLCAic3RyaW5nIiwgIndvcmRzIiwgImxhc3QiLCAiZXhlYyIsICJvcHRpb25zIiwgInJldHVyblZhbHVlIiwgImVzY2FwZUNvZGUiLCAiZXNjYXBlVXJsIiwgInJvd0xlbmd0aCIsICJpbmRleCIsICJyb3ciLCAidHJpbW1lZCIsICJ3b3JkTGVuZ3RoIiwgInJlbWFpbmluZ0NvbHVtbnMiLCAiYnJlYWtzU3RhcnRpbmdUaGlzTGluZSIsICJwcmVTdHJpbmciLCAiaW5TdXJyb2dhdGUiLCAiaSIsICJncm91cHMiLCAiY2xvc2luZ0NvZGUiLCAiQ1JMRl9PUl9MRiIsICJ3cmFwQW5zaSIsICJsaW5lIiwgImJyZWFrTGluZXMiLCAiY29udGVudCIsICJ3aWR0aCIsICJsaW5lIiwgIndyYXBBbnNpIiwgInN0ciIsICJyZWFkbGluZVdpZHRoIiwgImNsaVdpZHRoIiwgInJlYWRsaW5lIiwgInVzZVBvaW50ZXJQb3NpdGlvbiIsICJhY3RpdmUiLCAicmVuZGVyZWRJdGVtcyIsICJwYWdlU2l6ZSIsICJsb29wIiwgInN0YXRlIiwgInVzZVJlZiIsICJsYXN0UG9pbnRlciIsICJsYXN0QWN0aXZlIiwgIm1pZGRsZSIsICJyZW5kZXJlZExlbmd0aCIsICJhY2MiLCAiaXRlbSIsICJkZWZhdWx0UG9pbnRlclBvc2l0aW9uIiwgInBvaW50ZXIiLCAic3BhY2VVbmRlckFjdGl2ZSIsICJ1c2VQYWdpbmF0aW9uIiwgIml0ZW1zIiwgInJlbmRlckl0ZW0iLCAid2lkdGgiLCAicmVhZGxpbmVXaWR0aCIsICJib3VuZCIsICJudW0iLCAiaW5kZXgiLCAiYnJlYWtMaW5lcyIsICJyZW5kZXJJdGVtQXRJbmRleCIsICJhY3RpdmVJdGVtIiwgImFjdGl2ZUl0ZW1Qb3NpdGlvbiIsICJwYWdlQnVmZmVyIiwgIml0ZW1WaXNpdGVkIiwgImJ1ZmZlclBvaW50ZXIiLCAiaXRlbVBvaW50ZXIiLCAibGluZXNUb0FkZCIsICJsaW5lcyIsICJsaW5lIiwgImltcG9ydF9tdXRlX3N0cmVhbSIsICJyZWFkbGluZSIsICJBc3luY1Jlc291cmNlIiwgInNpZ25hbHMiLCAicHJvY2Vzc09rIiwgInByb2Nlc3MiLCAia0V4aXRFbWl0dGVyIiwgImdsb2JhbCIsICJPYmplY3REZWZpbmVQcm9wZXJ0eSIsICJFbWl0dGVyIiwgImV2IiwgImZuIiwgImxpc3QiLCAiaSIsICJjb2RlIiwgInNpZ25hbCIsICJyZXQiLCAiU2lnbmFsRXhpdEJhc2UiLCAic2lnbmFsRXhpdFdyYXAiLCAiaGFuZGxlciIsICJjYiIsICJvcHRzIiwgIlNpZ25hbEV4aXRGYWxsYmFjayIsICJTaWduYWxFeGl0IiwgIiNodXBTaWciLCAiI2VtaXR0ZXIiLCAiI3Byb2Nlc3MiLCAiI29yaWdpbmFsUHJvY2Vzc0VtaXQiLCAiI29yaWdpbmFsUHJvY2Vzc1JlYWxseUV4aXQiLCAiI3NpZ0xpc3RlbmVycyIsICIjbG9hZGVkIiwgInNpZyIsICJzaWduYWxzIiwgImxpc3RlbmVycyIsICJjb3VudCIsICJwIiwgInMiLCAiYSIsICIjcHJvY2Vzc0VtaXQiLCAiI3Byb2Nlc3NSZWFsbHlFeGl0IiwgImxpc3RlbmVyIiwgImFyZ3MiLCAib2ciLCAib25FeGl0IiwgImxvYWQiLCAidW5sb2FkIiwgInN0cmlwVlRDb250cm9sQ2hhcmFjdGVycyIsICJjdXJzb3JIaWRlIiwgImN1cnNvclNob3ciLCAiY3Vyc29yVXAiLCAicm93cyIsICJjdXJzb3JEb3duIiwgImN1cnNvclRvIiwgIngiLCAieSIsICJlcmFzZUxpbmUiLCAiZXJhc2VMaW5lcyIsICJsaW5lcyIsICJoZWlnaHQiLCAiY29udGVudCIsICJsYXN0TGluZSIsICJTY3JlZW5NYW5hZ2VyIiwgInJsIiwgImJvdHRvbUNvbnRlbnQiLCAicHJvbXB0TGluZSIsICJyYXdQcm9tcHRMaW5lIiwgInN0cmlwVlRDb250cm9sQ2hhcmFjdGVycyIsICJwcm9tcHQiLCAid2lkdGgiLCAicmVhZGxpbmVXaWR0aCIsICJicmVha0xpbmVzIiwgIm91dHB1dCIsICJib3R0b21Db250ZW50SGVpZ2h0IiwgImN1cnNvclVwIiwgImN1cnNvclRvIiwgImN1cnNvckRvd24iLCAiZXJhc2VMaW5lcyIsICJjdXJzb3JQb3MiLCAiY2xlYXJDb250ZW50IiwgImN1cnNvclNob3ciLCAiUHJvbWlzZVBvbHlmaWxsIiwgInJlc29sdmUiLCAicmVqZWN0IiwgInJlcyIsICJyZWoiLCAibmF0aXZlU2V0SW1tZWRpYXRlIiwgImdldENhbGxTaXRlcyIsICJfcHJlcGFyZVN0YWNrVHJhY2UiLCAicmVzdWx0IiwgIl8iLCAiY2FsbFNpdGVzIiwgImNhbGxTaXRlc1dpdGhvdXRDdXJyZW50IiwgImNyZWF0ZVByb21wdCIsICJ2aWV3IiwgImNvbmZpZyIsICJjb250ZXh0IiwgImlucHV0IiwgInNpZ25hbCIsICJjbGVhbnVwcyIsICJvdXRwdXQiLCAiTXV0ZVN0cmVhbSIsICJybCIsICJzY3JlZW4iLCAiU2NyZWVuTWFuYWdlciIsICJwcm9taXNlIiwgInJlc29sdmUiLCAicmVqZWN0IiwgIlByb21pc2VQb2x5ZmlsbCIsICJjYW5jZWwiLCAiQ2FuY2VsUHJvbXB0RXJyb3IiLCAiYWJvcnQiLCAiQWJvcnRQcm9tcHRFcnJvciIsICJvbkV4aXQiLCAiY29kZSIsICJFeGl0UHJvbXB0RXJyb3IiLCAic2lnaW50IiwgIndpdGhIb29rcyIsICJjeWNsZSIsICJob29rc0NsZWFudXAiLCAiQXN5bmNSZXNvdXJjZSIsICJlZmZlY3RTY2hlZHVsZXIiLCAic3RhcnRDeWNsZSIsICJjaGVja0N1cnNvclBvcyIsICJuZXh0VmlldyIsICJ2YWx1ZSIsICJjYWxsZXJGaWxlbmFtZSIsICJjb250ZW50IiwgImJvdHRvbUNvbnRlbnQiLCAiZXJyb3IiLCAiYW5zd2VyIiwgImNsZWFudXAiLCAic3R5bGVUZXh0IiwgIlNlcGFyYXRvciIsICJzdHlsZVRleHQiLCAiZGlzdF9kZWZhdWx0IiwgInNlcGFyYXRvciIsICJjaG9pY2UiLCAic3R5bGVUZXh0IiwgImNoZWNrYm94VGhlbWUiLCAic3R5bGVUZXh0IiwgImRpc3RfZGVmYXVsdCIsICJ0ZXh0IiwgInNlbGVjdGVkQ2hvaWNlcyIsICJjaG9pY2UiLCAia2V5cyIsICJrZXkiLCAiYWN0aW9uIiwgImlzU2VsZWN0YWJsZSIsICJpdGVtIiwgIlNlcGFyYXRvciIsICJpc05hdmlnYWJsZSIsICJpc0NoZWNrZWQiLCAidG9nZ2xlIiwgImNoZWNrIiwgImNoZWNrZWQiLCAibm9ybWFsaXplQ2hvaWNlcyIsICJjaG9pY2VzIiwgIm5hbWUiLCAibm9ybWFsaXplZENob2ljZSIsICJjcmVhdGVQcm9tcHQiLCAiY29uZmlnIiwgImRvbmUiLCAicGFnZVNpemUiLCAibG9vcCIsICJyZXF1aXJlZCIsICJ2YWxpZGF0ZSIsICJzaG9ydGN1dHMiLCAidGhlbWUiLCAibWFrZVRoZW1lIiwgImtleWJpbmRpbmdzIiwgInN0YXR1cyIsICJzZXRTdGF0dXMiLCAidXNlU3RhdGUiLCAicHJlZml4IiwgInVzZVByZWZpeCIsICJpdGVtcyIsICJzZXRJdGVtcyIsICJib3VuZHMiLCAidXNlTWVtbyIsICJmaXJzdCIsICJsYXN0IiwgIlZhbGlkYXRpb25FcnJvciIsICJhY3RpdmUiLCAic2V0QWN0aXZlIiwgImVycm9yTXNnIiwgInNldEVycm9yIiwgInVzZUtleXByZXNzIiwgImlzRW50ZXJLZXkiLCAic2VsZWN0aW9uIiwgImlzVmFsaWQiLCAiaXNVcEtleSIsICJpc0Rvd25LZXkiLCAib2Zmc2V0IiwgIm5leHQiLCAiaXNTcGFjZUtleSIsICJhY3RpdmVJdGVtIiwgImkiLCAic2VsZWN0QWxsIiwgImlzTnVtYmVyS2V5IiwgInNlbGVjdGVkSW5kZXgiLCAic2VsZWN0YWJsZUluZGV4IiwgInBvc2l0aW9uIiwgInNlbGVjdGVkSXRlbSIsICJtZXNzYWdlIiwgImRlc2NyaXB0aW9uIiwgInBhZ2UiLCAidXNlUGFnaW5hdGlvbiIsICJpc0FjdGl2ZSIsICJjdXJzb3IiLCAiZGlzYWJsZWRMYWJlbCIsICJjaGVja2JveCIsICJ4IiwgImFuc3dlciIsICJoZWxwTGluZSIsICJjdXJzb3JIaWRlIiwgImdldEJvb2xlYW5WYWx1ZSIsICJ2YWx1ZSIsICJkZWZhdWx0VmFsdWUiLCAiYW5zd2VyIiwgImJvb2xUb1N0cmluZyIsICJkaXN0X2RlZmF1bHQiLCAiY3JlYXRlUHJvbXB0IiwgImNvbmZpZyIsICJkb25lIiwgInRyYW5zZm9ybWVyIiwgInN0YXR1cyIsICJzZXRTdGF0dXMiLCAidXNlU3RhdGUiLCAic2V0VmFsdWUiLCAidGhlbWUiLCAibWFrZVRoZW1lIiwgInByZWZpeCIsICJ1c2VQcmVmaXgiLCAidXNlS2V5cHJlc3MiLCAia2V5IiwgInJsIiwgImlzRW50ZXJLZXkiLCAiaXNUYWJLZXkiLCAiZm9ybWF0dGVkVmFsdWUiLCAibWVzc2FnZSIsICJpbnB1dFRoZW1lIiwgImRpc3RfZGVmYXVsdCIsICJjcmVhdGVQcm9tcHQiLCAiY29uZmlnIiwgImRvbmUiLCAicHJlZmlsbCIsICJ0aGVtZSIsICJtYWtlVGhlbWUiLCAic3RhdHVzIiwgInNldFN0YXR1cyIsICJ1c2VTdGF0ZSIsICJkZWZhdWx0VmFsdWUiLCAic2V0RGVmYXVsdFZhbHVlIiwgImVycm9yTXNnIiwgInNldEVycm9yIiwgInZhbHVlIiwgInNldFZhbHVlIiwgInByZWZpeCIsICJ1c2VQcmVmaXgiLCAidmFsaWRhdGUiLCAicmVxdWlyZWQiLCAicGF0dGVybiIsICJwYXR0ZXJuRXJyb3IiLCAidXNlS2V5cHJlc3MiLCAia2V5IiwgInJsIiwgImlzRW50ZXJLZXkiLCAiYW5zd2VyIiwgImlzVmFsaWQiLCAiaXNCYWNrc3BhY2VLZXkiLCAiaXNUYWJLZXkiLCAidXNlRWZmZWN0IiwgIm1lc3NhZ2UiLCAiZm9ybWF0dGVkVmFsdWUiLCAiZGVmYXVsdFN0ciIsICJlcnJvciIsICJ2IiwgInN0eWxlVGV4dCIsICJzZWxlY3RUaGVtZSIsICJkaXN0X2RlZmF1bHQiLCAidGV4dCIsICJzdHlsZVRleHQiLCAia2V5cyIsICJrZXkiLCAiYWN0aW9uIiwgImlzU2VsZWN0YWJsZSIsICJpdGVtIiwgIlNlcGFyYXRvciIsICJpc05hdmlnYWJsZSIsICJub3JtYWxpemVDaG9pY2VzIiwgImNob2ljZXMiLCAiY2hvaWNlIiwgIm5hbWUiLCAibm9ybWFsaXplZENob2ljZSIsICJjcmVhdGVQcm9tcHQiLCAiY29uZmlnIiwgImRvbmUiLCAibG9vcCIsICJwYWdlU2l6ZSIsICJ0aGVtZSIsICJtYWtlVGhlbWUiLCAia2V5YmluZGluZ3MiLCAic3RhdHVzIiwgInNldFN0YXR1cyIsICJ1c2VTdGF0ZSIsICJwcmVmaXgiLCAidXNlUHJlZml4IiwgInNlYXJjaFRpbWVvdXRSZWYiLCAidXNlUmVmIiwgInNlYXJjaEVuYWJsZWQiLCAiaXRlbXMiLCAidXNlTWVtbyIsICJib3VuZHMiLCAiZmlyc3QiLCAibGFzdCIsICJWYWxpZGF0aW9uRXJyb3IiLCAiZGVmYXVsdEl0ZW1JbmRleCIsICJhY3RpdmUiLCAic2V0QWN0aXZlIiwgInNlbGVjdGVkQ2hvaWNlIiwgImVycm9yTXNnIiwgInNldEVycm9yIiwgInVzZUtleXByZXNzIiwgInJsIiwgImlzRW50ZXJLZXkiLCAiaXNVcEtleSIsICJpc0Rvd25LZXkiLCAib2Zmc2V0IiwgIm5leHQiLCAiaXNOdW1iZXJLZXkiLCAic2VsZWN0ZWRJbmRleCIsICJzZWxlY3RhYmxlSW5kZXgiLCAicG9zaXRpb24iLCAiaXNCYWNrc3BhY2VLZXkiLCAic2VhcmNoVGVybSIsICJtYXRjaEluZGV4IiwgInVzZUVmZmVjdCIsICJtZXNzYWdlIiwgImhlbHBMaW5lIiwgInNlcGFyYXRvckNvdW50IiwgInBhZ2UiLCAidXNlUGFnaW5hdGlvbiIsICJpc0FjdGl2ZSIsICJpbmRleCIsICJjdXJzb3IiLCAiaW5kZXhMYWJlbCIsICJkaXNhYmxlZExhYmVsIiwgImRpc2FibGVkQ3Vyc29yIiwgIngiLCAiZGVzY3JpcHRpb24iLCAiY3Vyc29ySGlkZSIsICJwYXRoIiwgImdldERlZmF1bHRDb25maWciLCAiY3dkIiwgImNyZWF0ZVNjYWZmb2xkIiwgImZvcm1hdHRlcnMiLCAiZnJhbWV3b3JrIiwgImdpdFV0aWwiLCAibGludGVyIiwgIm1vbm9yZXBvIiwgInByb2plY3ROYW1lIiwgImdldEZvcm1hdHRlclByb21wdHMiLCAiZnJhbWV3b3JrIiwgImRlZmF1bHRDb25maWciLCAiY3NzIiwgImh0bWwiLCAicmVhY3QiLCAic3ZlbHRlIiwgInR5cGVzY3JpcHQiLCAidnVlIiwgImZyYW1ld29ya05hbWUiLCAiZnJhbWV3b3JrVmFsdWUiLCAicmV0IiwgImRpc3RfZGVmYXVsdCIsICJnZXRQcm9tcHRzIiwgImN3ZCIsICJ1c2VEZWZhdWx0IiwgImdldERlZmF1bHRDb25maWciLCAicHJvamVjdE5hbWUiLCAibW9ub3JlcG8iLCAibGludGVyIiwgImZvcm1hdHRlcnMiLCAiZ2l0VXRpbCIsICJjcmVhdGUiLCAiQ29tbWFuZCIsICJkaXIiLCAiY3JlYXRlU2NhZmZvbGQiLCAibWFpbiIsICJhcmd2IiwgInByb2dyYW0iLCAicGFja2FnZV9kZWZhdWx0IiwgImNyZWF0ZSIsICJyZWFkRmlsZVN5bmMiLCAibWFpbiJdCn0K
