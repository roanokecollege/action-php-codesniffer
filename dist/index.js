module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(198);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, __unusedexports, __webpack_require__) {

const { requestLog } = __webpack_require__(916);
const {
  restEndpointMethods
} = __webpack_require__(842);

const Core = __webpack_require__(529);

const CORE_PLUGINS = [
  __webpack_require__(190),
  __webpack_require__(19), // deprecated: remove in v17
  requestLog,
  __webpack_require__(148),
  restEndpointMethods,
  __webpack_require__(430),

  __webpack_require__(850) // deprecated: remove in v17
];

const OctokitRest = Core.plugin(CORE_PLUGINS);

function DeprecatedOctokit(options) {
  const warn =
    options && options.log && options.log.warn
      ? options.log.warn
      : console.warn;
  warn(
    '[@octokit/rest] `const Octokit = require("@octokit/rest")` is deprecated. Use `const { Octokit } = require("@octokit/rest")` instead'
  );
  return new OctokitRest(options);
}

const Octokit = Object.assign(DeprecatedOctokit, {
  Octokit: OctokitRest
});

Object.keys(OctokitRest).forEach(key => {
  /* istanbul ignore else */
  if (OctokitRest.hasOwnProperty(key)) {
    Octokit[key] = OctokitRest[key];
  }
});

module.exports = Octokit;


/***/ }),

/***/ 2:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const macosRelease = __webpack_require__(118);
const winRelease = __webpack_require__(49);

const osName = (platform, release) => {
	if (!platform && release) {
		throw new Error('You can\'t specify a `release` without specifying `platform`');
	}

	platform = platform || os.platform();

	let id;

	if (platform === 'darwin') {
		if (!release && os.platform() === 'darwin') {
			release = os.release();
		}

		const prefix = release ? (Number(release.split('.')[0]) > 15 ? 'macOS' : 'OS X') : 'macOS';
		id = release ? macosRelease(release).name : '';
		return prefix + (id ? ' ' + id : '');
	}

	if (platform === 'linux') {
		if (!release && os.platform() === 'linux') {
			release = os.release();
		}

		id = release ? release.replace(/^(\d+\.\d+).*/, '$1') : '';
		return 'Linux' + (id ? ' ' + id : '');
	}

	if (platform === 'win32') {
		if (!release && os.platform() === 'win32') {
			release = os.release();
		}

		id = release ? winRelease(release) : '';
		return 'Windows' + (id ? ' ' + id : '');
	}

	return platform;
};

module.exports = osName;


/***/ }),

/***/ 5:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Spawns git blame and parses results into JSON, via stream (so, no problem on huge files)
 */
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(129);
const readline_1 = __webpack_require__(58);
const camel_case_1 = __webpack_require__(947);
async function blame(filename, options = {}, gitPath = 'git') {
    var _a, _b, _c, _d;
    /**
     * @see {@link https://git-scm.com/docs/git-blame#_options}
     */
    const args = ['--no-pager', 'blame', '--line-porcelain'];
    if (typeof options.workTree === 'string') {
        args.unshift(`--work-tree=${options.workTree}`);
    }
    if (typeof options.gitDir === 'string') {
        args.unshift(`--git-dir=${options.gitDir}`);
    }
    if (typeof options.ignoreWhitespace === 'boolean') {
        args.push('-w');
    }
    if (typeof options.range === 'string') {
        args.push(`-L${options.range}`);
    }
    if (typeof options.rev === 'string') {
        args.push(options.rev);
    }
    const git = child_process_1.spawn(gitPath, [...args, '--', filename], {
        windowsHide: true,
    });
    const readline = readline_1.createInterface({ input: git.stdout });
    let currentLine;
    const linesMap = new Map();
    for await (const line of readline) {
        // https://git-scm.com/docs/git-blame#_the_porcelain_format
        // Each blame entry always starts with a line of:
        // <40-byte hex sha1> <sourceline> <resultline> <num_lines>
        // like: 49790775624c422f67057f7bb936f35df920e391 94 120 3
        const parsedLine = /^(?<hash>[a-f0-9]{40,40})\s(?<sourceline>\d+)\s(?<resultLine>\d+)\s(?<numLines>\d+)$/.exec(line);
        if ((_a = parsedLine) === null || _a === void 0 ? void 0 : _a.groups) {
            // this is a new line info
            const sourceLine = parseInt(parsedLine.groups.sourceline, 10);
            const resultLine = parseInt((_b = parsedLine) === null || _b === void 0 ? void 0 : _b.groups.resultLine, 10);
            const numberOfLines = parseInt((_c = parsedLine) === null || _c === void 0 ? void 0 : _c.groups.numLines, 10);
            currentLine = {
                hash: parsedLine.groups.hash,
                sourceLine,
                resultLine,
                numberOfLines,
            };
            // set for all lines
            for (let i = resultLine; i < resultLine + numberOfLines; i++)
                linesMap.set(i, currentLine);
        }
        else {
            if (currentLine) {
                const commitInfo = /^(?<token>[a-z]+(-(?<subtoken>[a-z]+))?)\s(?<data>.+)$/.exec(line);
                if ((_d = commitInfo) === null || _d === void 0 ? void 0 : _d.groups) {
                    const property = camel_case_1.camelCase(commitInfo.groups.token);
                    let value = commitInfo.groups.data;
                    switch (commitInfo.groups.subtoken) {
                        case 'mail':
                            // remove <> from email
                            value = value.slice(1, -1);
                            break;
                        case 'time':
                            // parse datestamp into number
                            value = parseInt(value, 10);
                            break;
                    }
                    currentLine[property] = value;
                }
            }
        }
    }
    return linesMap;
}
exports.blame = blame;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 16:
/***/ (function(module) {

module.exports = require("tls");

/***/ }),

/***/ 18:
/***/ (function(module) {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 19:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

const authenticate = __webpack_require__(674);
const beforeRequest = __webpack_require__(471);
const requestError = __webpack_require__(349);

function authenticationPlugin(octokit, options) {
  if (options.auth) {
    octokit.authenticate = () => {
      deprecateAuthenticate(
        octokit.log,
        new Deprecation(
          '[@octokit/rest] octokit.authenticate() is deprecated and has no effect when "auth" option is set on Octokit constructor'
        )
      );
    };
    return;
  }
  const state = {
    octokit,
    auth: false
  };
  octokit.authenticate = authenticate.bind(null, state);
  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 20:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const cp = __webpack_require__(129);
const parse = __webpack_require__(568);
const enoent = __webpack_require__(881);

function spawn(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);

    // Hook into child process "exit" event to emit an error if the command
    // does not exists, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    enoent.hookChildProcess(spawned, parsed);

    return spawned;
}

function spawnSync(command, args, options) {
    // Parse the arguments
    const parsed = parse(command, args, options);

    // Spawn the child process
    const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);

    // Analyze if the command does not exist, see: https://github.com/IndigoUnited/node-cross-spawn/issues/16
    result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);

    return result;
}

module.exports = spawn;
module.exports.spawn = spawn;
module.exports.sync = spawnSync;

module.exports._parse = parse;
module.exports._enoent = enoent;


/***/ }),

/***/ 34:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 39:
/***/ (function(module) {

"use strict";

module.exports = opts => {
	opts = opts || {};

	const env = opts.env || process.env;
	const platform = opts.platform || process.platform;

	if (platform !== 'win32') {
		return 'PATH';
	}

	return Object.keys(env).find(x => x.toUpperCase() === 'PATH') || 'Path';
};


/***/ }),

/***/ 47:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = factory;

const Octokit = __webpack_require__(402);
const registerPlugin = __webpack_require__(855);

function factory(plugins) {
  const Api = Octokit.bind(null, plugins || []);
  Api.plugin = registerPlugin.bind(null, plugins || []);
  return Api;
}


/***/ }),

/***/ 48:
/***/ (function(module, exports) {

exports = module.exports = SemVer

var debug
/* istanbul ignore next */
if (typeof process === 'object' &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)) {
  debug = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    args.unshift('SEMVER')
    console.log.apply(console, args)
  }
} else {
  debug = function () {}
}

// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
exports.SEMVER_SPEC_VERSION = '2.0.0'

var MAX_LENGTH = 256
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER ||
  /* istanbul ignore next */ 9007199254740991

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

// The actual regexps go on exports.re
var re = exports.re = []
var src = exports.src = []
var R = 0

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'

// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'

// ## Main Version
// Three dot-separated numeric identifiers.

var MAINVERSION = R++
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')'

var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')'

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')'

var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')'

// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

var PRERELEASE = R++
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))'

var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))'

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

var BUILD = R++
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'

// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

var FULL = R++
var FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?'

src[FULL] = '^' + FULLPLAIN + '$'

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?'

var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'

var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'

var XRANGEPLAIN = R++
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?'

var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?'

var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'

// Coercion.
// Extract anything that could conceivably be a part of a valid semver
var COERCE = R++
src[COERCE] = '(?:^|[^\\d])' +
              '(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '})' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:\\.(\\d{1,' + MAX_SAFE_COMPONENT_LENGTH + '}))?' +
              '(?:$|[^\\d])'

// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'

var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
var tildeTrimReplace = '$1~'

var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'

// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'

var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
var caretTrimReplace = '$1^'

var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'

// A simple gt/lt/eq thing, or just "" to indicate "any version"
var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'

// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
var COMPARATORTRIM = R++
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
var comparatorTrimReplace = '$1$2$3'

// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
var HYPHENRANGE = R++
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$'

var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$'

// Star ranges basically just allow anything at all.
var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}

exports.parse = parse
function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  if (version.length > MAX_LENGTH) {
    return null
  }

  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }

  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}

exports.valid = valid
function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}

exports.clean = clean
function clean (version, options) {
  var s = parse(version.trim().replace(/^[=v]+/, ''), options)
  return s ? s.version : null
}

exports.SemVer = SemVer

function SemVer (version, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }
  if (version instanceof SemVer) {
    if (version.loose === options.loose) {
      return version
    } else {
      version = version.version
    }
  } else if (typeof version !== 'string') {
    throw new TypeError('Invalid Version: ' + version)
  }

  if (version.length > MAX_LENGTH) {
    throw new TypeError('version is longer than ' + MAX_LENGTH + ' characters')
  }

  if (!(this instanceof SemVer)) {
    return new SemVer(version, options)
  }

  debug('SemVer', version, options)
  this.options = options
  this.loose = !!options.loose

  var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])

  if (!m) {
    throw new TypeError('Invalid Version: ' + version)
  }

  this.raw = version

  // these are actually numbers
  this.major = +m[1]
  this.minor = +m[2]
  this.patch = +m[3]

  if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
    throw new TypeError('Invalid major version')
  }

  if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
    throw new TypeError('Invalid minor version')
  }

  if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
    throw new TypeError('Invalid patch version')
  }

  // numberify any prerelease numeric ids
  if (!m[4]) {
    this.prerelease = []
  } else {
    this.prerelease = m[4].split('.').map(function (id) {
      if (/^[0-9]+$/.test(id)) {
        var num = +id
        if (num >= 0 && num < MAX_SAFE_INTEGER) {
          return num
        }
      }
      return id
    })
  }

  this.build = m[5] ? m[5].split('.') : []
  this.format()
}

SemVer.prototype.format = function () {
  this.version = this.major + '.' + this.minor + '.' + this.patch
  if (this.prerelease.length) {
    this.version += '-' + this.prerelease.join('.')
  }
  return this.version
}

SemVer.prototype.toString = function () {
  return this.version
}

SemVer.prototype.compare = function (other) {
  debug('SemVer.compare', this.version, this.options, other)
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return this.compareMain(other) || this.comparePre(other)
}

SemVer.prototype.compareMain = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  return compareIdentifiers(this.major, other.major) ||
         compareIdentifiers(this.minor, other.minor) ||
         compareIdentifiers(this.patch, other.patch)
}

SemVer.prototype.comparePre = function (other) {
  if (!(other instanceof SemVer)) {
    other = new SemVer(other, this.options)
  }

  // NOT having a prerelease is > having one
  if (this.prerelease.length && !other.prerelease.length) {
    return -1
  } else if (!this.prerelease.length && other.prerelease.length) {
    return 1
  } else if (!this.prerelease.length && !other.prerelease.length) {
    return 0
  }

  var i = 0
  do {
    var a = this.prerelease[i]
    var b = other.prerelease[i]
    debug('prerelease compare', i, a, b)
    if (a === undefined && b === undefined) {
      return 0
    } else if (b === undefined) {
      return 1
    } else if (a === undefined) {
      return -1
    } else if (a === b) {
      continue
    } else {
      return compareIdentifiers(a, b)
    }
  } while (++i)
}

// preminor will bump the version up to the next minor release, and immediately
// down to pre-release. premajor and prepatch work the same way.
SemVer.prototype.inc = function (release, identifier) {
  switch (release) {
    case 'premajor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor = 0
      this.major++
      this.inc('pre', identifier)
      break
    case 'preminor':
      this.prerelease.length = 0
      this.patch = 0
      this.minor++
      this.inc('pre', identifier)
      break
    case 'prepatch':
      // If this is already a prerelease, it will bump to the next version
      // drop any prereleases that might already exist, since they are not
      // relevant at this point.
      this.prerelease.length = 0
      this.inc('patch', identifier)
      this.inc('pre', identifier)
      break
    // If the input is a non-prerelease version, this acts the same as
    // prepatch.
    case 'prerelease':
      if (this.prerelease.length === 0) {
        this.inc('patch', identifier)
      }
      this.inc('pre', identifier)
      break

    case 'major':
      // If this is a pre-major version, bump up to the same major version.
      // Otherwise increment major.
      // 1.0.0-5 bumps to 1.0.0
      // 1.1.0 bumps to 2.0.0
      if (this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0) {
        this.major++
      }
      this.minor = 0
      this.patch = 0
      this.prerelease = []
      break
    case 'minor':
      // If this is a pre-minor version, bump up to the same minor version.
      // Otherwise increment minor.
      // 1.2.0-5 bumps to 1.2.0
      // 1.2.1 bumps to 1.3.0
      if (this.patch !== 0 || this.prerelease.length === 0) {
        this.minor++
      }
      this.patch = 0
      this.prerelease = []
      break
    case 'patch':
      // If this is not a pre-release version, it will increment the patch.
      // If it is a pre-release it will bump up to the same patch version.
      // 1.2.0-5 patches to 1.2.0
      // 1.2.0 patches to 1.2.1
      if (this.prerelease.length === 0) {
        this.patch++
      }
      this.prerelease = []
      break
    // This probably shouldn't be used publicly.
    // 1.0.0 "pre" would become 1.0.0-0 which is the wrong direction.
    case 'pre':
      if (this.prerelease.length === 0) {
        this.prerelease = [0]
      } else {
        var i = this.prerelease.length
        while (--i >= 0) {
          if (typeof this.prerelease[i] === 'number') {
            this.prerelease[i]++
            i = -2
          }
        }
        if (i === -1) {
          // didn't increment anything
          this.prerelease.push(0)
        }
      }
      if (identifier) {
        // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
        // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
        if (this.prerelease[0] === identifier) {
          if (isNaN(this.prerelease[1])) {
            this.prerelease = [identifier, 0]
          }
        } else {
          this.prerelease = [identifier, 0]
        }
      }
      break

    default:
      throw new Error('invalid increment argument: ' + release)
  }
  this.format()
  this.raw = this.version
  return this
}

exports.inc = inc
function inc (version, release, loose, identifier) {
  if (typeof (loose) === 'string') {
    identifier = loose
    loose = undefined
  }

  try {
    return new SemVer(version, loose).inc(release, identifier).version
  } catch (er) {
    return null
  }
}

exports.diff = diff
function diff (version1, version2) {
  if (eq(version1, version2)) {
    return null
  } else {
    var v1 = parse(version1)
    var v2 = parse(version2)
    var prefix = ''
    if (v1.prerelease.length || v2.prerelease.length) {
      prefix = 'pre'
      var defaultResult = 'prerelease'
    }
    for (var key in v1) {
      if (key === 'major' || key === 'minor' || key === 'patch') {
        if (v1[key] !== v2[key]) {
          return prefix + key
        }
      }
    }
    return defaultResult // may be undefined
  }
}

exports.compareIdentifiers = compareIdentifiers

var numeric = /^[0-9]+$/
function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)

  if (anum && bnum) {
    a = +a
    b = +b
  }

  return a === b ? 0
    : (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
    : a < b ? -1
    : 1
}

exports.rcompareIdentifiers = rcompareIdentifiers
function rcompareIdentifiers (a, b) {
  return compareIdentifiers(b, a)
}

exports.major = major
function major (a, loose) {
  return new SemVer(a, loose).major
}

exports.minor = minor
function minor (a, loose) {
  return new SemVer(a, loose).minor
}

exports.patch = patch
function patch (a, loose) {
  return new SemVer(a, loose).patch
}

exports.compare = compare
function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}

exports.compareLoose = compareLoose
function compareLoose (a, b) {
  return compare(a, b, true)
}

exports.rcompare = rcompare
function rcompare (a, b, loose) {
  return compare(b, a, loose)
}

exports.sort = sort
function sort (list, loose) {
  return list.sort(function (a, b) {
    return exports.compare(a, b, loose)
  })
}

exports.rsort = rsort
function rsort (list, loose) {
  return list.sort(function (a, b) {
    return exports.rcompare(a, b, loose)
  })
}

exports.gt = gt
function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}

exports.lt = lt
function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}

exports.eq = eq
function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}

exports.neq = neq
function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}

exports.gte = gte
function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}

exports.lte = lte
function lte (a, b, loose) {
  return compare(a, b, loose) <= 0
}

exports.cmp = cmp
function cmp (a, op, b, loose) {
  switch (op) {
    case '===':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a === b

    case '!==':
      if (typeof a === 'object')
        a = a.version
      if (typeof b === 'object')
        b = b.version
      return a !== b

    case '':
    case '=':
    case '==':
      return eq(a, b, loose)

    case '!=':
      return neq(a, b, loose)

    case '>':
      return gt(a, b, loose)

    case '>=':
      return gte(a, b, loose)

    case '<':
      return lt(a, b, loose)

    case '<=':
      return lte(a, b, loose)

    default:
      throw new TypeError('Invalid operator: ' + op)
  }
}

exports.Comparator = Comparator
function Comparator (comp, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (comp instanceof Comparator) {
    if (comp.loose === !!options.loose) {
      return comp
    } else {
      comp = comp.value
    }
  }

  if (!(this instanceof Comparator)) {
    return new Comparator(comp, options)
  }

  debug('comparator', comp, options)
  this.options = options
  this.loose = !!options.loose
  this.parse(comp)

  if (this.semver === ANY) {
    this.value = ''
  } else {
    this.value = this.operator + this.semver.version
  }

  debug('comp', this)
}

var ANY = {}
Comparator.prototype.parse = function (comp) {
  var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var m = comp.match(r)

  if (!m) {
    throw new TypeError('Invalid comparator: ' + comp)
  }

  this.operator = m[1]
  if (this.operator === '=') {
    this.operator = ''
  }

  // if it literally is just '>' or '' then allow anything.
  if (!m[2]) {
    this.semver = ANY
  } else {
    this.semver = new SemVer(m[2], this.options.loose)
  }
}

Comparator.prototype.toString = function () {
  return this.value
}

Comparator.prototype.test = function (version) {
  debug('Comparator.test', version, this.options.loose)

  if (this.semver === ANY) {
    return true
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  return cmp(version, this.operator, this.semver, this.options)
}

Comparator.prototype.intersects = function (comp, options) {
  if (!(comp instanceof Comparator)) {
    throw new TypeError('a Comparator is required')
  }

  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  var rangeTmp

  if (this.operator === '') {
    rangeTmp = new Range(comp.value, options)
    return satisfies(this.value, rangeTmp, options)
  } else if (comp.operator === '') {
    rangeTmp = new Range(this.value, options)
    return satisfies(comp.semver, rangeTmp, options)
  }

  var sameDirectionIncreasing =
    (this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '>=' || comp.operator === '>')
  var sameDirectionDecreasing =
    (this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '<=' || comp.operator === '<')
  var sameSemVer = this.semver.version === comp.semver.version
  var differentDirectionsInclusive =
    (this.operator === '>=' || this.operator === '<=') &&
    (comp.operator === '>=' || comp.operator === '<=')
  var oppositeDirectionsLessThan =
    cmp(this.semver, '<', comp.semver, options) &&
    ((this.operator === '>=' || this.operator === '>') &&
    (comp.operator === '<=' || comp.operator === '<'))
  var oppositeDirectionsGreaterThan =
    cmp(this.semver, '>', comp.semver, options) &&
    ((this.operator === '<=' || this.operator === '<') &&
    (comp.operator === '>=' || comp.operator === '>'))

  return sameDirectionIncreasing || sameDirectionDecreasing ||
    (sameSemVer && differentDirectionsInclusive) ||
    oppositeDirectionsLessThan || oppositeDirectionsGreaterThan
}

exports.Range = Range
function Range (range, options) {
  if (!options || typeof options !== 'object') {
    options = {
      loose: !!options,
      includePrerelease: false
    }
  }

  if (range instanceof Range) {
    if (range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease) {
      return range
    } else {
      return new Range(range.raw, options)
    }
  }

  if (range instanceof Comparator) {
    return new Range(range.value, options)
  }

  if (!(this instanceof Range)) {
    return new Range(range, options)
  }

  this.options = options
  this.loose = !!options.loose
  this.includePrerelease = !!options.includePrerelease

  // First, split based on boolean or ||
  this.raw = range
  this.set = range.split(/\s*\|\|\s*/).map(function (range) {
    return this.parseRange(range.trim())
  }, this).filter(function (c) {
    // throw out any that are not relevant for whatever reason
    return c.length
  })

  if (!this.set.length) {
    throw new TypeError('Invalid SemVer Range: ' + range)
  }

  this.format()
}

Range.prototype.format = function () {
  this.range = this.set.map(function (comps) {
    return comps.join(' ').trim()
  }).join('||').trim()
  return this.range
}

Range.prototype.toString = function () {
  return this.range
}

Range.prototype.parseRange = function (range) {
  var loose = this.options.loose
  range = range.trim()
  // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
  var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
  range = range.replace(hr, hyphenReplace)
  debug('hyphen replace', range)
  // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
  range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
  debug('comparator trim', range, re[COMPARATORTRIM])

  // `~ 1.2.3` => `~1.2.3`
  range = range.replace(re[TILDETRIM], tildeTrimReplace)

  // `^ 1.2.3` => `^1.2.3`
  range = range.replace(re[CARETTRIM], caretTrimReplace)

  // normalize spaces
  range = range.split(/\s+/).join(' ')

  // At this point, the range is completely trimmed and
  // ready to be split into comparators.

  var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
  var set = range.split(' ').map(function (comp) {
    return parseComparator(comp, this.options)
  }, this).join(' ').split(/\s+/)
  if (this.options.loose) {
    // in loose mode, throw out any that are not valid comparators
    set = set.filter(function (comp) {
      return !!comp.match(compRe)
    })
  }
  set = set.map(function (comp) {
    return new Comparator(comp, this.options)
  }, this)

  return set
}

Range.prototype.intersects = function (range, options) {
  if (!(range instanceof Range)) {
    throw new TypeError('a Range is required')
  }

  return this.set.some(function (thisComparators) {
    return thisComparators.every(function (thisComparator) {
      return range.set.some(function (rangeComparators) {
        return rangeComparators.every(function (rangeComparator) {
          return thisComparator.intersects(rangeComparator, options)
        })
      })
    })
  })
}

// Mostly just for testing and legacy API reasons
exports.toComparators = toComparators
function toComparators (range, options) {
  return new Range(range, options).set.map(function (comp) {
    return comp.map(function (c) {
      return c.value
    }).join(' ').trim().split(' ')
  })
}

// comprised of xranges, tildes, stars, and gtlt's at this point.
// already replaced the hyphen ranges
// turn into a set of JUST comparators.
function parseComparator (comp, options) {
  debug('comp', comp, options)
  comp = replaceCarets(comp, options)
  debug('caret', comp)
  comp = replaceTildes(comp, options)
  debug('tildes', comp)
  comp = replaceXRanges(comp, options)
  debug('xrange', comp)
  comp = replaceStars(comp, options)
  debug('stars', comp)
  return comp
}

function isX (id) {
  return !id || id.toLowerCase() === 'x' || id === '*'
}

// ~, ~> --> * (any, kinda silly)
// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0
// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0
// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0
// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0
// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0
function replaceTildes (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceTilde(comp, options)
  }).join(' ')
}

function replaceTilde (comp, options) {
  var r = options.loose ? re[TILDELOOSE] : re[TILDE]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('tilde', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      // ~1.2 == >=1.2.0 <1.3.0
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    } else if (pr) {
      debug('replaceTilde pr', pr)
      ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
            ' <' + M + '.' + (+m + 1) + '.0'
    } else {
      // ~1.2.3 == >=1.2.3 <1.3.0
      ret = '>=' + M + '.' + m + '.' + p +
            ' <' + M + '.' + (+m + 1) + '.0'
    }

    debug('tilde return', ret)
    return ret
  })
}

// ^ --> * (any, kinda silly)
// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0
// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0
// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0
// ^1.2.3 --> >=1.2.3 <2.0.0
// ^1.2.0 --> >=1.2.0 <2.0.0
function replaceCarets (comp, options) {
  return comp.trim().split(/\s+/).map(function (comp) {
    return replaceCaret(comp, options)
  }).join(' ')
}

function replaceCaret (comp, options) {
  debug('caret', comp, options)
  var r = options.loose ? re[CARETLOOSE] : re[CARET]
  return comp.replace(r, function (_, M, m, p, pr) {
    debug('caret', comp, _, M, m, p, pr)
    var ret

    if (isX(M)) {
      ret = ''
    } else if (isX(m)) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (isX(p)) {
      if (M === '0') {
        ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
      } else {
        ret = '>=' + M + '.' + m + '.0 <' + (+M + 1) + '.0.0'
      }
    } else if (pr) {
      debug('replaceCaret pr', pr)
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p + '-' + pr +
              ' <' + (+M + 1) + '.0.0'
      }
    } else {
      debug('no pr')
      if (M === '0') {
        if (m === '0') {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + m + '.' + (+p + 1)
        } else {
          ret = '>=' + M + '.' + m + '.' + p +
                ' <' + M + '.' + (+m + 1) + '.0'
        }
      } else {
        ret = '>=' + M + '.' + m + '.' + p +
              ' <' + (+M + 1) + '.0.0'
      }
    }

    debug('caret return', ret)
    return ret
  })
}

function replaceXRanges (comp, options) {
  debug('replaceXRanges', comp, options)
  return comp.split(/\s+/).map(function (comp) {
    return replaceXRange(comp, options)
  }).join(' ')
}

function replaceXRange (comp, options) {
  comp = comp.trim()
  var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
  return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
    debug('xRange', comp, ret, gtlt, M, m, p, pr)
    var xM = isX(M)
    var xm = xM || isX(m)
    var xp = xm || isX(p)
    var anyX = xp

    if (gtlt === '=' && anyX) {
      gtlt = ''
    }

    if (xM) {
      if (gtlt === '>' || gtlt === '<') {
        // nothing is allowed
        ret = '<0.0.0'
      } else {
        // nothing is forbidden
        ret = '*'
      }
    } else if (gtlt && anyX) {
      // we know patch is an x, because we have any x at all.
      // replace X with 0
      if (xm) {
        m = 0
      }
      p = 0

      if (gtlt === '>') {
        // >1 => >=2.0.0
        // >1.2 => >=1.3.0
        // >1.2.3 => >= 1.2.4
        gtlt = '>='
        if (xm) {
          M = +M + 1
          m = 0
          p = 0
        } else {
          m = +m + 1
          p = 0
        }
      } else if (gtlt === '<=') {
        // <=0.7.x is actually <0.8.0, since any 0.7.x should
        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
        gtlt = '<'
        if (xm) {
          M = +M + 1
        } else {
          m = +m + 1
        }
      }

      ret = gtlt + M + '.' + m + '.' + p
    } else if (xm) {
      ret = '>=' + M + '.0.0 <' + (+M + 1) + '.0.0'
    } else if (xp) {
      ret = '>=' + M + '.' + m + '.0 <' + M + '.' + (+m + 1) + '.0'
    }

    debug('xRange return', ret)

    return ret
  })
}

// Because * is AND-ed with everything else in the comparator,
// and '' means "any version", just remove the *s entirely.
function replaceStars (comp, options) {
  debug('replaceStars', comp, options)
  // Looseness is ignored here.  star is always as loose as it gets!
  return comp.trim().replace(re[STAR], '')
}

// This function is passed to string.replace(re[HYPHENRANGE])
// M, m, patch, prerelease, build
// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
// 1.2.3 - 3.4 => >=1.2.0 <3.5.0 Any 3.4.x will do
// 1.2 - 3.4 => >=1.2.0 <3.5.0
function hyphenReplace ($0,
  from, fM, fm, fp, fpr, fb,
  to, tM, tm, tp, tpr, tb) {
  if (isX(fM)) {
    from = ''
  } else if (isX(fm)) {
    from = '>=' + fM + '.0.0'
  } else if (isX(fp)) {
    from = '>=' + fM + '.' + fm + '.0'
  } else {
    from = '>=' + from
  }

  if (isX(tM)) {
    to = ''
  } else if (isX(tm)) {
    to = '<' + (+tM + 1) + '.0.0'
  } else if (isX(tp)) {
    to = '<' + tM + '.' + (+tm + 1) + '.0'
  } else if (tpr) {
    to = '<=' + tM + '.' + tm + '.' + tp + '-' + tpr
  } else {
    to = '<=' + to
  }

  return (from + ' ' + to).trim()
}

// if ANY of the sets match ALL of its comparators, then pass
Range.prototype.test = function (version) {
  if (!version) {
    return false
  }

  if (typeof version === 'string') {
    version = new SemVer(version, this.options)
  }

  for (var i = 0; i < this.set.length; i++) {
    if (testSet(this.set[i], version, this.options)) {
      return true
    }
  }
  return false
}

function testSet (set, version, options) {
  for (var i = 0; i < set.length; i++) {
    if (!set[i].test(version)) {
      return false
    }
  }

  if (version.prerelease.length && !options.includePrerelease) {
    // Find the set of versions that are allowed to have prereleases
    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
    // That should allow `1.2.3-pr.2` to pass.
    // However, `1.2.4-alpha.notready` should NOT be allowed,
    // even though it's within the range set by the comparators.
    for (i = 0; i < set.length; i++) {
      debug(set[i].semver)
      if (set[i].semver === ANY) {
        continue
      }

      if (set[i].semver.prerelease.length > 0) {
        var allowed = set[i].semver
        if (allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch) {
          return true
        }
      }
    }

    // Version has a -pre, but it's not one of the ones we like.
    return false
  }

  return true
}

exports.satisfies = satisfies
function satisfies (version, range, options) {
  try {
    range = new Range(range, options)
  } catch (er) {
    return false
  }
  return range.test(version)
}

exports.maxSatisfying = maxSatisfying
function maxSatisfying (versions, range, options) {
  var max = null
  var maxSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!max || maxSV.compare(v) === -1) {
        // compare(max, v, true)
        max = v
        maxSV = new SemVer(max, options)
      }
    }
  })
  return max
}

exports.minSatisfying = minSatisfying
function minSatisfying (versions, range, options) {
  var min = null
  var minSV = null
  try {
    var rangeObj = new Range(range, options)
  } catch (er) {
    return null
  }
  versions.forEach(function (v) {
    if (rangeObj.test(v)) {
      // satisfies(v, range, options)
      if (!min || minSV.compare(v) === 1) {
        // compare(min, v, true)
        min = v
        minSV = new SemVer(min, options)
      }
    }
  })
  return min
}

exports.minVersion = minVersion
function minVersion (range, loose) {
  range = new Range(range, loose)

  var minver = new SemVer('0.0.0')
  if (range.test(minver)) {
    return minver
  }

  minver = new SemVer('0.0.0-0')
  if (range.test(minver)) {
    return minver
  }

  minver = null
  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    comparators.forEach(function (comparator) {
      // Clone to avoid manipulating the comparator's semver object.
      var compver = new SemVer(comparator.semver.version)
      switch (comparator.operator) {
        case '>':
          if (compver.prerelease.length === 0) {
            compver.patch++
          } else {
            compver.prerelease.push(0)
          }
          compver.raw = compver.format()
          /* fallthrough */
        case '':
        case '>=':
          if (!minver || gt(minver, compver)) {
            minver = compver
          }
          break
        case '<':
        case '<=':
          /* Ignore maximum versions */
          break
        /* istanbul ignore next */
        default:
          throw new Error('Unexpected operation: ' + comparator.operator)
      }
    })
  }

  if (minver && range.test(minver)) {
    return minver
  }

  return null
}

exports.validRange = validRange
function validRange (range, options) {
  try {
    // Return '*' instead of '' so that truthiness works.
    // This will throw if it's invalid anyway
    return new Range(range, options).range || '*'
  } catch (er) {
    return null
  }
}

// Determine if version is less than all the versions possible in the range
exports.ltr = ltr
function ltr (version, range, options) {
  return outside(version, range, '<', options)
}

// Determine if version is greater than all the versions possible in the range.
exports.gtr = gtr
function gtr (version, range, options) {
  return outside(version, range, '>', options)
}

exports.outside = outside
function outside (version, range, hilo, options) {
  version = new SemVer(version, options)
  range = new Range(range, options)

  var gtfn, ltefn, ltfn, comp, ecomp
  switch (hilo) {
    case '>':
      gtfn = gt
      ltefn = lte
      ltfn = lt
      comp = '>'
      ecomp = '>='
      break
    case '<':
      gtfn = lt
      ltefn = gte
      ltfn = gt
      comp = '<'
      ecomp = '<='
      break
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"')
  }

  // If it satisifes the range it is not outside
  if (satisfies(version, range, options)) {
    return false
  }

  // From now on, variable terms are as if we're in "gtr" mode.
  // but note that everything is flipped for the "ltr" function.

  for (var i = 0; i < range.set.length; ++i) {
    var comparators = range.set[i]

    var high = null
    var low = null

    comparators.forEach(function (comparator) {
      if (comparator.semver === ANY) {
        comparator = new Comparator('>=0.0.0')
      }
      high = high || comparator
      low = low || comparator
      if (gtfn(comparator.semver, high.semver, options)) {
        high = comparator
      } else if (ltfn(comparator.semver, low.semver, options)) {
        low = comparator
      }
    })

    // If the edge version comparator has a operator then our version
    // isn't outside it
    if (high.operator === comp || high.operator === ecomp) {
      return false
    }

    // If the lowest version comparator has an operator and our version
    // is less than it then it isn't higher than the range
    if ((!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)) {
      return false
    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
      return false
    }
  }
  return true
}

exports.prerelease = prerelease
function prerelease (version, options) {
  var parsed = parse(version, options)
  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
}

exports.intersects = intersects
function intersects (r1, r2, options) {
  r1 = new Range(r1, options)
  r2 = new Range(r2, options)
  return r1.intersects(r2)
}

exports.coerce = coerce
function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }

  if (typeof version !== 'string') {
    return null
  }

  var match = version.match(re[COERCE])

  if (match == null) {
    return null
  }

  return parse(match[1] +
    '.' + (match[2] || '0') +
    '.' + (match[3] || '0'))
}


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);
const execa = __webpack_require__(955);

// Reference: https://www.gaijin.at/en/lstwinver.php
const names = new Map([
	['10.0', '10'],
	['6.3', '8.1'],
	['6.2', '8'],
	['6.1', '7'],
	['6.0', 'Vista'],
	['5.2', 'Server 2003'],
	['5.1', 'XP'],
	['5.0', '2000'],
	['4.9', 'ME'],
	['4.1', '98'],
	['4.0', '95']
]);

const windowsRelease = release => {
	const version = /\d+\.\d/.exec(release || os.release());

	if (release && !version) {
		throw new Error('`release` argument doesn\'t match `n.n`');
	}

	const ver = (version || [])[0];

	// Server 2008, 2012, 2016, and 2019 versions are ambiguous with desktop versions and must be detected at runtime.
	// If `release` is omitted or we're on a Windows system, and the version number is an ambiguous version
	// then use `wmic` to get the OS caption: https://msdn.microsoft.com/en-us/library/aa394531(v=vs.85).aspx
	// If `wmic` is obsoloete (later versions of Windows 10), use PowerShell instead.
	// If the resulting caption contains the year 2008, 2012, 2016 or 2019, it is a server version, so return a server OS name.
	if ((!release || release === os.release()) && ['6.1', '6.2', '6.3', '10.0'].includes(ver)) {
		let stdout;
		try {
			stdout = execa.sync('powershell', ['(Get-CimInstance -ClassName Win32_OperatingSystem).caption']).stdout || '';
		} catch (_) {
			stdout = execa.sync('wmic', ['os', 'get', 'Caption']).stdout || '';
		}

		const year = (stdout.match(/2008|2012|2016|2019/) || [])[0];

		if (year) {
			return `Server ${year}`;
		}
	}

	return names.get(ver);
};

module.exports = windowsRelease;


/***/ }),

/***/ 58:
/***/ (function(module) {

module.exports = require("readline");

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 118:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const os = __webpack_require__(87);

const nameMap = new Map([
	[19, 'Catalina'],
	[18, 'Mojave'],
	[17, 'High Sierra'],
	[16, 'Sierra'],
	[15, 'El Capitan'],
	[14, 'Yosemite'],
	[13, 'Mavericks'],
	[12, 'Mountain Lion'],
	[11, 'Lion'],
	[10, 'Snow Leopard'],
	[9, 'Leopard'],
	[8, 'Tiger'],
	[7, 'Panther'],
	[6, 'Jaguar'],
	[5, 'Puma']
]);

const macosRelease = release => {
	release = Number((release || os.release()).split('.')[0]);
	return {
		name: nameMap.get(release),
		version: '10.' + (release - 4)
	};
};

module.exports = macosRelease;
// TODO: remove this in the next major version
module.exports.default = macosRelease;


/***/ }),

/***/ 126:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    Set = getNative(root, 'Set'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each
 * element is kept.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */
function uniq(array) {
  return (array && array.length)
    ? baseUniq(array)
    : [];
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = uniq;


/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 141:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(631);
var tls = __webpack_require__(16);
var http = __webpack_require__(605);
var https = __webpack_require__(34);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 143:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = withAuthorizationPrefix;

const atob = __webpack_require__(368);

const REGEX_IS_BASIC_AUTH = /^[\w-]+:/;

function withAuthorizationPrefix(authorization) {
  if (/^(basic|bearer|token) /i.test(authorization)) {
    return authorization;
  }

  try {
    if (REGEX_IS_BASIC_AUTH.test(atob(authorization))) {
      return `basic ${authorization}`;
    }
  } catch (error) {}

  if (authorization.split(/\./).length === 3) {
    return `bearer ${authorization}`;
  }

  return `token ${authorization}`;
}


/***/ }),

/***/ 145:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(966);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = Object.assign({maxBuffer: Infinity}, options);

	const {maxBuffer} = options;

	let stream;
	return new Promise((resolve, reject) => {
		const rejectPromise = error => {
			if (error) { // A null check
				error.bufferedData = stream.getBufferedValue();
			}
			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	}).then(() => stream.getBufferedValue());
}

module.exports = getStream;
module.exports.buffer = (stream, options) => getStream(stream, Object.assign({}, options, {encoding: 'buffer'}));
module.exports.array = (stream, options) => getStream(stream, Object.assign({}, options, {array: true}));
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 148:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginatePlugin;

const { paginateRest } = __webpack_require__(299);

function paginatePlugin(octokit) {
  Object.assign(octokit, paginateRest(octokit));
}


/***/ }),

/***/ 160:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

/**
 * Launches phpCs and returns results as JSON
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(__webpack_require__(622));
const util_1 = __webpack_require__(669);
const child_process_1 = __webpack_require__(129);
const assert = __importStar(__webpack_require__(357));
const execAsync = util_1.promisify(child_process_1.exec);
const EXECUTABLE_VERSIONS = new Map();
const DEFAULT_EXECUTABLE_PATH = path.resolve(__dirname, '../node_modules/php_codesniffer_master/bin/phpcs');
const DEFAULT_OPTIONS = {
    encoding: 'UTF-8',
    standard: 'phpcs.xml',
};
/**
 * Launches phpCs and returns current version
 */
async function version(executablePath = DEFAULT_EXECUTABLE_PATH) {
    var _a, _b;
    if (EXECUTABLE_VERSIONS.has(executablePath))
        return EXECUTABLE_VERSIONS.get(executablePath);
    const { stdout } = await execAsync(`${executablePath} --version`, {
        windowsHide: true,
        timeout: 5000,
    });
    const ver = (_b = (_a = /^PHP_CodeSniffer version (?<ver>\d+\.\d+\.\d+)/i.exec(stdout.trim())) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.ver;
    if (!ver)
        throw new ReferenceError(`Unknown version or invalid executable of phpcs, returned: "${stdout}"`);
    EXECUTABLE_VERSIONS.set(executablePath, ver);
    return ver;
}
exports.version = version;
async function lint(filenames, executablePath = DEFAULT_EXECUTABLE_PATH, options = DEFAULT_OPTIONS) {
    var _a, _b;
    try {
        const ver = await version(executablePath);
        assert.ok(ver >= '2.6', `This library requires phpcs version 2.6 or later, received ${ver}`);
        // we use promisified version, so, should not set exit code or it will throw
        const args = [
            '--report=json',
            '-q',
            `--encoding=${options.encoding}`,
            `--standard=${options.standard}`,
            '--runtime-set ignore_errors_on_exit 1',
            '--runtime-set ignore_warnings_on_exit 1',
        ];
        const { stdout } = await execAsync(`${executablePath} ${args.join(' ')} ${Array.isArray(filenames) ? filenames.join(' ') : filenames}`, {
            windowsHide: true,
            timeout: 15000,
        });
        return JSON.parse(stdout);
    }
    catch (err) {
        if ('stdout' in err) {
            // Determine whether we have an error in stdout.
            const error = (_b = (_a = /^ERROR:\s?(?<error>.*)/i.exec(err.stdout)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.error;
            if (error)
                throw new Error(error.trim());
        }
        throw err;
    }
}
exports.lint = lint;
//# sourceMappingURL=linter.js.map

/***/ }),

/***/ 168:
/***/ (function(module) {

"use strict";

const alias = ['stdin', 'stdout', 'stderr'];

const hasAlias = opts => alias.some(x => Boolean(opts[x]));

module.exports = opts => {
	if (!opts) {
		return null;
	}

	if (opts.stdio && hasAlias(opts)) {
		throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${alias.map(x => `\`${x}\``).join(', ')}`);
	}

	if (typeof opts.stdio === 'string') {
		return opts.stdio;
	}

	const stdio = opts.stdio || [];

	if (!Array.isArray(stdio)) {
		throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
	}

	const result = [];
	const len = Math.max(stdio.length, alias.length);

	for (let i = 0; i < len; i++) {
		let value = null;

		if (stdio[i] !== undefined) {
			value = stdio[i];
		} else if (opts[alias[i]] !== undefined) {
			value = opts[alias[i]];
		}

		result[i] = value;
	}

	return result;
};


/***/ }),

/***/ 175:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 */
var SUPPORTED_LOCALE = {
    tr: {
        regexp: /\u0130|\u0049|\u0049\u0307/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069"
        }
    },
    az: {
        regexp: /\u0130/g,
        map: {
            İ: "\u0069",
            I: "\u0131",
            İ: "\u0069"
        }
    },
    lt: {
        regexp: /\u0049|\u004A|\u012E|\u00CC|\u00CD|\u0128/g,
        map: {
            I: "\u0069\u0307",
            J: "\u006A\u0307",
            Į: "\u012F\u0307",
            Ì: "\u0069\u0307\u0300",
            Í: "\u0069\u0307\u0301",
            Ĩ: "\u0069\u0307\u0303"
        }
    }
};
/**
 * Localized lower case.
 */
function localeLowerCase(str, locale) {
    var lang = SUPPORTED_LOCALE[locale.toLowerCase()];
    if (lang)
        return lowerCase(str.replace(lang.regexp, function (m) { return lang.map[m]; }));
    return lowerCase(str);
}
exports.localeLowerCase = localeLowerCase;
/**
 * Lower case as a function.
 */
function lowerCase(str) {
    return str.toLowerCase();
}
exports.lowerCase = lowerCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 190:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationPlugin;

const { createTokenAuth } = __webpack_require__(813);
const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const beforeRequest = __webpack_require__(863);
const requestError = __webpack_require__(293);
const validate = __webpack_require__(954);
const withAuthorizationPrefix = __webpack_require__(143);

const deprecateAuthBasic = once((log, deprecation) => log.warn(deprecation));
const deprecateAuthObject = once((log, deprecation) => log.warn(deprecation));

function authenticationPlugin(octokit, options) {
  // If `options.authStrategy` is set then use it and pass in `options.auth`
  if (options.authStrategy) {
    const auth = options.authStrategy(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
  // is unauthenticated. The `octokit.auth()` method is a no-op and no request hook is registred.
  if (!options.auth) {
    octokit.auth = () =>
      Promise.resolve({
        type: "unauthenticated"
      });
    return;
  }

  const isBasicAuthString =
    typeof options.auth === "string" &&
    /^basic/.test(withAuthorizationPrefix(options.auth));

  // If only `options.auth` is set to a string, use the default token authentication strategy.
  if (typeof options.auth === "string" && !isBasicAuthString) {
    const auth = createTokenAuth(options.auth);
    octokit.hook.wrap("request", auth.hook);
    octokit.auth = auth;
    return;
  }

  // Otherwise log a deprecation message
  const [deprecationMethod, deprecationMessapge] = isBasicAuthString
    ? [
        deprecateAuthBasic,
        'Setting the "new Octokit({ auth })" option to a Basic Auth string is deprecated. Use https://github.com/octokit/auth-basic.js instead. See (https://octokit.github.io/rest.js/#authentication)'
      ]
    : [
        deprecateAuthObject,
        'Setting the "new Octokit({ auth })" option to an object without also setting the "authStrategy" option is deprecated and will be removed in v17. See (https://octokit.github.io/rest.js/#authentication)'
      ];
  deprecationMethod(
    octokit.log,
    new Deprecation("[@octokit/rest] " + deprecationMessapge)
  );

  octokit.auth = () =>
    Promise.resolve({
      type: "deprecated",
      message: deprecationMessapge
    });

  validate(options.auth);

  const state = {
    octokit,
    auth: options.auth
  };

  octokit.hook.before("request", beforeRequest.bind(null, state));
  octokit.hook.error("request", requestError.bind(null, state));
}


/***/ }),

/***/ 197:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), options)
}

function checkStat (stat, options) {
  return stat.isFile() && checkMode(stat, options)
}

function checkMode (stat, options) {
  var mod = stat.mode
  var uid = stat.uid
  var gid = stat.gid

  var myUid = options.uid !== undefined ?
    options.uid : process.getuid && process.getuid()
  var myGid = options.gid !== undefined ?
    options.gid : process.getgid && process.getgid()

  var u = parseInt('100', 8)
  var g = parseInt('010', 8)
  var o = parseInt('001', 8)
  var ug = u | g

  var ret = (mod & o) ||
    (mod & g) && gid === myGid ||
    (mod & u) && uid === myUid ||
    (mod & ug) && myUid === 0

  return ret
}


/***/ }),

/***/ 198:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(__webpack_require__(622));
const core = __importStar(__webpack_require__(470));
const get_changed_file_1 = __webpack_require__(942);
const run_on_files_1 = __webpack_require__(303);
const run_on_blame_1 = __webpack_require__(400);
async function run() {
    try {
        const files = await get_changed_file_1.getChangedFiles();
        core.info(JSON.stringify(files, null, 2));
        if (!files.added.length && !files.modified.length) {
            core.warning('No files to check, exiting...');
            return;
        }
        /**
         * Adding problem matcher to annotate files without token
         * @see {@link https://github.com/actions/setup-node/blob/a47b2f66c61e623b503818d97a63ce0fe087f700/src/setup-node.ts#L36}
         */
        const matchersPath = path.join(__dirname, '..', '.github');
        console.log(`##[add-matcher]${path.join(matchersPath, 'phpcs-matcher.json')}`);
        // run on complete files when they added or scope=files
        const scope = core.getInput('scope', { required: true });
        if (files.added.length || scope === 'files')
            run_on_files_1.runOnCompleteFiles(scope === 'files' ? [...files.added, ...files.modified] : files.added);
        else if (files.modified.length && scope === 'blame') {
            // run on blame
            await run_on_blame_1.runOnBlame(files.modified);
        }
    }
    catch (error) {
        core.setFailed(error);
    }
}
run();


/***/ }),

/***/ 199:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 211:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 215:
/***/ (function(module) {

module.exports = {"_from":"@octokit/rest@^16.43.1","_id":"@octokit/rest@16.43.1","_inBundle":false,"_integrity":"sha512-gfFKwRT/wFxq5qlNjnW2dh+qh74XgTQ2B179UX5K1HYCluioWj8Ndbgqw2PVqa1NnVJkGHp2ovMpVn/DImlmkw==","_location":"/@octokit/rest","_phantomChildren":{"@octokit/types":"2.12.2","deprecation":"2.3.1","once":"1.4.0"},"_requested":{"type":"range","registry":true,"raw":"@octokit/rest@^16.43.1","name":"@octokit/rest","escapedName":"@octokit%2frest","scope":"@octokit","rawSpec":"^16.43.1","saveSpec":null,"fetchSpec":"^16.43.1"},"_requiredBy":["/@actions/github"],"_resolved":"https://registry.npmjs.org/@octokit/rest/-/rest-16.43.1.tgz","_shasum":"3b11e7d1b1ac2bbeeb23b08a17df0b20947eda6b","_spec":"@octokit/rest@^16.43.1","_where":"/Users/tino/Repos/action-php-codesniffer/node_modules/@actions/github","author":{"name":"Gregor Martynus","url":"https://github.com/gr2m"},"bugs":{"url":"https://github.com/octokit/rest.js/issues"},"bundleDependencies":false,"bundlesize":[{"path":"./dist/octokit-rest.min.js.gz","maxSize":"33 kB"}],"contributors":[{"name":"Mike de Boer","email":"info@mikedeboer.nl"},{"name":"Fabian Jakobs","email":"fabian@c9.io"},{"name":"Joe Gallo","email":"joe@brassafrax.com"},{"name":"Gregor Martynus","url":"https://github.com/gr2m"}],"dependencies":{"@octokit/auth-token":"^2.4.0","@octokit/plugin-paginate-rest":"^1.1.1","@octokit/plugin-request-log":"^1.0.0","@octokit/plugin-rest-endpoint-methods":"2.4.0","@octokit/request":"^5.2.0","@octokit/request-error":"^1.0.2","atob-lite":"^2.0.0","before-after-hook":"^2.0.0","btoa-lite":"^1.0.0","deprecation":"^2.0.0","lodash.get":"^4.4.2","lodash.set":"^4.3.2","lodash.uniq":"^4.5.0","octokit-pagination-methods":"^1.1.0","once":"^1.4.0","universal-user-agent":"^4.0.0"},"deprecated":false,"description":"GitHub REST API client for Node.js","devDependencies":{"@gimenete/type-writer":"^0.1.3","@octokit/auth":"^1.1.1","@octokit/fixtures-server":"^5.0.6","@octokit/graphql":"^4.2.0","@types/node":"^13.1.0","bundlesize":"^0.18.0","chai":"^4.1.2","compression-webpack-plugin":"^3.1.0","cypress":"^3.0.0","glob":"^7.1.2","http-proxy-agent":"^4.0.0","lodash.camelcase":"^4.3.0","lodash.merge":"^4.6.1","lodash.upperfirst":"^4.3.1","lolex":"^5.1.2","mkdirp":"^1.0.0","mocha":"^7.0.1","mustache":"^4.0.0","nock":"^11.3.3","npm-run-all":"^4.1.2","nyc":"^15.0.0","prettier":"^1.14.2","proxy":"^1.0.0","semantic-release":"^17.0.0","sinon":"^8.0.0","sinon-chai":"^3.0.0","sort-keys":"^4.0.0","string-to-arraybuffer":"^1.0.0","string-to-jsdoc-comment":"^1.0.0","typescript":"^3.3.1","webpack":"^4.0.0","webpack-bundle-analyzer":"^3.0.0","webpack-cli":"^3.0.0"},"files":["index.js","index.d.ts","lib","plugins"],"homepage":"https://github.com/octokit/rest.js#readme","keywords":["octokit","github","rest","api-client"],"license":"MIT","name":"@octokit/rest","nyc":{"ignore":["test"]},"publishConfig":{"access":"public"},"release":{"publish":["@semantic-release/npm",{"path":"@semantic-release/github","assets":["dist/*","!dist/*.map.gz"]}]},"repository":{"type":"git","url":"git+https://github.com/octokit/rest.js.git"},"scripts":{"build":"npm-run-all build:*","build:browser":"npm-run-all build:browser:*","build:browser:development":"webpack --mode development --entry . --output-library=Octokit --output=./dist/octokit-rest.js --profile --json > dist/bundle-stats.json","build:browser:production":"webpack --mode production --entry . --plugin=compression-webpack-plugin --output-library=Octokit --output-path=./dist --output-filename=octokit-rest.min.js --devtool source-map","build:ts":"npm run -s update-endpoints:typescript","coverage":"nyc report --reporter=html && open coverage/index.html","generate-bundle-report":"webpack-bundle-analyzer dist/bundle-stats.json --mode=static --no-open --report dist/bundle-report.html","lint":"prettier --check '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","lint:fix":"prettier --write '{lib,plugins,scripts,test}/**/*.{js,json,ts}' 'docs/*.{js,json}' 'docs/src/**/*' index.js README.md package.json","postvalidate:ts":"tsc --noEmit --target es6 test/typescript-validate.ts","prebuild:browser":"mkdirp dist/","pretest":"npm run -s lint","prevalidate:ts":"npm run -s build:ts","start-fixtures-server":"octokit-fixtures-server","test":"nyc mocha test/mocha-node-setup.js \"test/*/**/*-test.js\"","test:browser":"cypress run --browser chrome","update-endpoints":"npm-run-all update-endpoints:*","update-endpoints:fetch-json":"node scripts/update-endpoints/fetch-json","update-endpoints:typescript":"node scripts/update-endpoints/typescript","validate:ts":"tsc --target es6 --noImplicitAny index.d.ts"},"types":"index.d.ts","version":"16.43.1"};

/***/ }),

/***/ 224:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __webpack_require__(199);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ 260:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Note: since nyc uses this module to output coverage, any lines
// that are in the direct sync flow of nyc's outputCoverage are
// ignored, since we can never get coverage for them.
var assert = __webpack_require__(357)
var signals = __webpack_require__(654)
var isWin = /^win/i.test(process.platform)

var EE = __webpack_require__(614)
/* istanbul ignore if */
if (typeof EE !== 'function') {
  EE = EE.EventEmitter
}

var emitter
if (process.__signal_exit_emitter__) {
  emitter = process.__signal_exit_emitter__
} else {
  emitter = process.__signal_exit_emitter__ = new EE()
  emitter.count = 0
  emitter.emitted = {}
}

// Because this emitter is a global, we have to check to see if a
// previous version of this library failed to enable infinite listeners.
// I know what you're about to say.  But literally everything about
// signal-exit is a compromise with evil.  Get used to it.
if (!emitter.infinite) {
  emitter.setMaxListeners(Infinity)
  emitter.infinite = true
}

module.exports = function (cb, opts) {
  assert.equal(typeof cb, 'function', 'a callback must be provided for exit handler')

  if (loaded === false) {
    load()
  }

  var ev = 'exit'
  if (opts && opts.alwaysLast) {
    ev = 'afterexit'
  }

  var remove = function () {
    emitter.removeListener(ev, cb)
    if (emitter.listeners('exit').length === 0 &&
        emitter.listeners('afterexit').length === 0) {
      unload()
    }
  }
  emitter.on(ev, cb)

  return remove
}

module.exports.unload = unload
function unload () {
  if (!loaded) {
    return
  }
  loaded = false

  signals.forEach(function (sig) {
    try {
      process.removeListener(sig, sigListeners[sig])
    } catch (er) {}
  })
  process.emit = originalProcessEmit
  process.reallyExit = originalProcessReallyExit
  emitter.count -= 1
}

function emit (event, code, signal) {
  if (emitter.emitted[event]) {
    return
  }
  emitter.emitted[event] = true
  emitter.emit(event, code, signal)
}

// { <signal>: <listener fn>, ... }
var sigListeners = {}
signals.forEach(function (sig) {
  sigListeners[sig] = function listener () {
    // If there are no other listeners, an exit is coming!
    // Simplest way: remove us and then re-send the signal.
    // We know that this will kill the process, so we can
    // safely emit now.
    var listeners = process.listeners(sig)
    if (listeners.length === emitter.count) {
      unload()
      emit('exit', null, sig)
      /* istanbul ignore next */
      emit('afterexit', null, sig)
      /* istanbul ignore next */
      if (isWin && sig === 'SIGHUP') {
        // "SIGHUP" throws an `ENOSYS` error on Windows,
        // so use a supported signal instead
        sig = 'SIGINT'
      }
      process.kill(process.pid, sig)
    }
  }
})

module.exports.signals = function () {
  return signals
}

module.exports.load = load

var loaded = false

function load () {
  if (loaded) {
    return
  }
  loaded = true

  // This is the number of onSignalExit's that are in play.
  // It's important so that we can count the correct number of
  // listeners on signals, and don't wait for the other one to
  // handle it instead of us.
  emitter.count += 1

  signals = signals.filter(function (sig) {
    try {
      process.on(sig, sigListeners[sig])
      return true
    } catch (er) {
      return false
    }
  })

  process.emit = processEmit
  process.reallyExit = processReallyExit
}

var originalProcessReallyExit = process.reallyExit
function processReallyExit (code) {
  process.exitCode = code || 0
  emit('exit', process.exitCode, null)
  /* istanbul ignore next */
  emit('afterexit', process.exitCode, null)
  /* istanbul ignore next */
  originalProcessReallyExit.call(process, process.exitCode)
}

var originalProcessEmit = process.emit
function processEmit (ev, arg) {
  if (ev === 'exit') {
    if (arg !== undefined) {
      process.exitCode = arg
    }
    var ret = originalProcessEmit.apply(this, arguments)
    emit('exit', process.exitCode, null)
    /* istanbul ignore next */
    emit('afterexit', process.exitCode, null)
    return ret
  } else {
    return originalProcessEmit.apply(this, arguments)
  }
}


/***/ }),

/***/ 262:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 265:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)
const HttpError = __webpack_require__(297)

function getPage (octokit, link, which, headers) {
  deprecate(`octokit.get${which.charAt(0).toUpperCase() + which.slice(1)}Page() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  const url = getPageLinks(link)[which]

  if (!url) {
    const urlError = new HttpError(`No ${which} page found`, 404)
    return Promise.reject(urlError)
  }

  const requestOptions = {
    url,
    headers: applyAcceptHeader(link, headers)
  }

  const promise = octokit.request(requestOptions)

  return promise
}

function applyAcceptHeader (res, headers) {
  const previous = res.headers && res.headers['x-github-media-type']

  if (!previous || (headers && headers.accept)) {
    return headers
  }
  headers = headers || {}
  headers.accept = 'application/vnd.' + previous
    .replace('; param=', '.')
    .replace('; format=', '+')

  return headers
}


/***/ }),

/***/ 280:
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 293:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(497);

function authenticationRequestError(state, error, options) {
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    if (state.otp) {
      delete state.otp; // no longer valid, request again
    } else {
      throw new RequestError(
        "Invalid one-time password for two-factor authentication",
        401,
        {
          headers: error.headers,
          request: options
        }
      );
    }
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(options.headers, {
          "x-github-otp": oneTimePassword
        })
      });
      return state.octokit.request(newOptions).then(response => {
        // If OTP still valid, then persist it for following requests
        state.otp = oneTimePassword;
        return response;
      });
    });
}


/***/ }),

/***/ 294:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = parseOptions;

const { Deprecation } = __webpack_require__(692);
const { getUserAgent } = __webpack_require__(796);
const once = __webpack_require__(969);

const pkg = __webpack_require__(215);

const deprecateOptionsTimeout = once((log, deprecation) =>
  log.warn(deprecation)
);
const deprecateOptionsAgent = once((log, deprecation) => log.warn(deprecation));
const deprecateOptionsHeaders = once((log, deprecation) =>
  log.warn(deprecation)
);

function parseOptions(options, log, hook) {
  if (options.headers) {
    options.headers = Object.keys(options.headers).reduce((newObj, key) => {
      newObj[key.toLowerCase()] = options.headers[key];
      return newObj;
    }, {});
  }

  const clientDefaults = {
    headers: options.headers || {},
    request: options.request || {},
    mediaType: {
      previews: [],
      format: ""
    }
  };

  if (options.baseUrl) {
    clientDefaults.baseUrl = options.baseUrl;
  }

  if (options.userAgent) {
    clientDefaults.headers["user-agent"] = options.userAgent;
  }

  if (options.previews) {
    clientDefaults.mediaType.previews = options.previews;
  }

  if (options.timeZone) {
    clientDefaults.headers["time-zone"] = options.timeZone;
  }

  if (options.timeout) {
    deprecateOptionsTimeout(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({timeout}) is deprecated. Use {request: {timeout}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.timeout = options.timeout;
  }

  if (options.agent) {
    deprecateOptionsAgent(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({agent}) is deprecated. Use {request: {agent}} instead. See https://github.com/octokit/request.js#request"
      )
    );
    clientDefaults.request.agent = options.agent;
  }

  if (options.headers) {
    deprecateOptionsHeaders(
      log,
      new Deprecation(
        "[@octokit/rest] new Octokit({headers}) is deprecated. Use {userAgent, previews} instead. See https://github.com/octokit/request.js#request"
      )
    );
  }

  const userAgentOption = clientDefaults.headers["user-agent"];
  const defaultUserAgent = `octokit.js/${pkg.version} ${getUserAgent()}`;

  clientDefaults.headers["user-agent"] = [userAgentOption, defaultUserAgent]
    .filter(Boolean)
    .join(" ");

  clientDefaults.request.hook = hook.bind(null, "request");

  return clientDefaults;
}


/***/ }),

/***/ 297:
/***/ (function(module) {

module.exports = class HttpError extends Error {
  constructor (message, code, headers) {
    super(message)

    // Maintains proper stack trace (only available on V8)
    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }

    this.name = 'HttpError'
    this.code = code
    this.headers = headers
  }
}


/***/ }),

/***/ 299:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.1.2";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint:
 *
 * - https://developer.github.com/v3/search/#example (key `items`)
 * - https://developer.github.com/v3/checks/runs/#response-3 (key: `check_runs`)
 * - https://developer.github.com/v3/checks/suites/#response-1 (key: `check_suites`)
 * - https://developer.github.com/v3/apps/installations/#list-repositories (key: `repositories`)
 * - https://developer.github.com/v3/apps/installations/#list-installations-for-a-user (key `installations`)
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not. For the exceptions with the namespace, a fallback check for the route
 * paths has to be added in order to normalize the response. We cannot check for the total_count
 * property because it also exists in the response of Get the combined status for a specific ref.
 */
const REGEX = [/^\/search\//, /^\/repos\/[^/]+\/[^/]+\/commits\/[^/]+\/(check-runs|check-suites)([^/]|$)/, /^\/installation\/repositories([^/]|$)/, /^\/user\/installations([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/secrets([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/workflows(\/[^/]+\/runs)?([^/]|$)/, /^\/repos\/[^/]+\/[^/]+\/actions\/runs(\/[^/]+\/(artifacts|jobs))?([^/]|$)/];
function normalizePaginatedListResponse(octokit, url, response) {
  const path = url.replace(octokit.request.endpoint.DEFAULTS.baseUrl, "");
  const responseNeedsNormalization = REGEX.find(regex => regex.test(path));
  if (!responseNeedsNormalization) return; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  Object.defineProperty(response.data, namespaceKey, {
    get() {
      octokit.log.warn(`[@octokit/paginate-rest] "response.data.${namespaceKey}" is deprecated for "GET ${path}". Get the results directly from "response.data"`);
      return Array.from(data);
    }

  });
}

function iterator(octokit, route, parameters) {
  const options = octokit.request.endpoint(route, parameters);
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return octokit.request({
          method,
          url,
          headers
        }).then(response => {
          normalizePaginatedListResponse(octokit, url, response); // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set

          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 303:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(129);
const core = __importStar(__webpack_require__(470));
/**
 * Executes phpcs on whole files and let's errors to be picked by problem matcher
 * @param files
 */
function runOnCompleteFiles(files) {
    const phpcs = core.getInput('phpcs_path', { required: true });
    const args = ['--report=checkstyle'];
    const standard = core.getInput('standard');
    if (standard)
        args.push(`--standard=${standard}`);
    const failOnWarning = core.getInput('fail_on_warnings');
    if (failOnWarning == 'false' || failOnWarning === 'off') {
        args.push('--runtime-set ignore_warnings_on_exit 1');
    }
    try {
        child_process_1.execSync(`${phpcs} ${args.join(' ')} ${files.join(' ')}`, {
            stdio: 'inherit',
            timeout: 20000,
        });
        return 0;
    }
    catch (err) {
        core.debug(err);
        core.setFailed(err);
        return 1;
    }
}
exports.runOnCompleteFiles = runOnCompleteFiles;


/***/ }),

/***/ 323:
/***/ (function(module) {

"use strict";


var isStream = module.exports = function (stream) {
	return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
};

isStream.writable = function (stream) {
	return isStream(stream) && stream.writable !== false && typeof stream._write === 'function' && typeof stream._writableState === 'object';
};

isStream.readable = function (stream) {
	return isStream(stream) && stream.readable !== false && typeof stream._read === 'function' && typeof stream._readableState === 'object';
};

isStream.duplex = function (stream) {
	return isStream.writable(stream) && isStream.readable(stream);
};

isStream.transform = function (stream) {
	return isStream.duplex(stream) && typeof stream._transform === 'function' && typeof stream._transformState === 'object';
};


/***/ }),

/***/ 336:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasLastPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasLastPage (link) {
  deprecate(`octokit.hasLastPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).last
}


/***/ }),

/***/ 348:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = validate;

const { RequestError } = __webpack_require__(497);
const get = __webpack_require__(854);
const set = __webpack_require__(883);

function validate(octokit, options) {
  if (!options.request.validate) {
    return;
  }
  const { validate: params } = options.request;

  Object.keys(params).forEach(parameterName => {
    const parameter = get(params, parameterName);

    const expectedType = parameter.type;
    let parentParameterName;
    let parentValue;
    let parentParamIsPresent = true;
    let parentParameterIsArray = false;

    if (/\./.test(parameterName)) {
      parentParameterName = parameterName.replace(/\.[^.]+$/, "");
      parentParameterIsArray = parentParameterName.slice(-2) === "[]";
      if (parentParameterIsArray) {
        parentParameterName = parentParameterName.slice(0, -2);
      }
      parentValue = get(options, parentParameterName);
      parentParamIsPresent =
        parentParameterName === "headers" ||
        (typeof parentValue === "object" && parentValue !== null);
    }

    const values = parentParameterIsArray
      ? (get(options, parentParameterName) || []).map(
          value => value[parameterName.split(/\./).pop()]
        )
      : [get(options, parameterName)];

    values.forEach((value, i) => {
      const valueIsPresent = typeof value !== "undefined";
      const valueIsNull = value === null;
      const currentParameterName = parentParameterIsArray
        ? parameterName.replace(/\[\]/, `[${i}]`)
        : parameterName;

      if (!parameter.required && !valueIsPresent) {
        return;
      }

      // if the parent parameter is of type object but allows null
      // then the child parameters can be ignored
      if (!parentParamIsPresent) {
        return;
      }

      if (parameter.allowNull && valueIsNull) {
        return;
      }

      if (!parameter.allowNull && valueIsNull) {
        throw new RequestError(
          `'${currentParameterName}' cannot be null`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.required && !valueIsPresent) {
        throw new RequestError(
          `Empty value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      // parse to integer before checking for enum
      // so that string "1" will match enum with number 1
      if (expectedType === "integer") {
        const unparsedValue = value;
        value = parseInt(value, 10);
        if (isNaN(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              unparsedValue
            )} is NaN`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (parameter.enum && parameter.enum.indexOf(String(value)) === -1) {
        throw new RequestError(
          `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
            value
          )}`,
          400,
          {
            request: options
          }
        );
      }

      if (parameter.validation) {
        const regex = new RegExp(parameter.validation);
        if (!regex.test(value)) {
          throw new RequestError(
            `Invalid value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      if (expectedType === "object" && typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch (exception) {
          throw new RequestError(
            `JSON parse error of value for parameter '${currentParameterName}': ${JSON.stringify(
              value
            )}`,
            400,
            {
              request: options
            }
          );
        }
      }

      set(options, parameter.mapTo || currentParameterName, value);
    });
  });

  return options;
}


/***/ }),

/***/ 349:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationRequestError;

const { RequestError } = __webpack_require__(497);

function authenticationRequestError(state, error, options) {
  /* istanbul ignore next */
  if (!error.headers) throw error;

  const otpRequired = /required/.test(error.headers["x-github-otp"] || "");
  // handle "2FA required" error only
  if (error.status !== 401 || !otpRequired) {
    throw error;
  }

  if (
    error.status === 401 &&
    otpRequired &&
    error.request &&
    error.request.headers["x-github-otp"]
  ) {
    throw new RequestError(
      "Invalid one-time password for two-factor authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  if (typeof state.auth.on2fa !== "function") {
    throw new RequestError(
      "2FA required, but options.on2fa is not a function. See https://github.com/octokit/rest.js#authentication",
      401,
      {
        headers: error.headers,
        request: options
      }
    );
  }

  return Promise.resolve()
    .then(() => {
      return state.auth.on2fa();
    })
    .then(oneTimePassword => {
      const newOptions = Object.assign(options, {
        headers: Object.assign(
          { "x-github-otp": oneTimePassword },
          options.headers
        )
      });
      return state.octokit.request(newOptions);
    });
}


/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 366:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const scan = __webpack_require__(537);
const parse = __webpack_require__(806);
const utils = __webpack_require__(224);
const constants = __webpack_require__(199);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return parsed.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${parsed.output})${append}`;
  if (parsed && parsed.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = parsed;
  }

  return regex;
};

picomatch.makeRe = (input, options, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  const opts = options || {};
  let parsed = { negated: false, fastpaths: true };
  let prefix = '';
  let output;

  if (input.startsWith('./')) {
    input = input.slice(2);
    prefix = parsed.prefix = './';
  }

  if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    output = parse.fastpaths(input, options);
  }

  if (output === undefined) {
    parsed = parse(input, options);
    parsed.prefix = prefix + (parsed.prefix || '');
  } else {
    parsed.output = output;
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 368:
/***/ (function(module) {

module.exports = function atob(str) {
  return Buffer.from(str, 'base64').toString('binary')
}


/***/ }),

/***/ 370:
/***/ (function(module) {

module.exports = deprecate

const loggedMessages = {}

function deprecate (message) {
  if (loggedMessages[message]) {
    return
  }

  console.warn(`DEPRECATED (@octokit/rest): ${message}`)
  loggedMessages[message] = 1
}


/***/ }),

/***/ 385:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(626));
var universalUserAgent = __webpack_require__(562);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.1";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 389:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const fs = __webpack_require__(747);
const shebangCommand = __webpack_require__(866);

function readShebang(command) {
    // Read the first 150 bytes from the file
    const size = 150;
    let buffer;

    if (Buffer.alloc) {
        // Node.js v4.5+ / v5.10+
        buffer = Buffer.alloc(size);
    } else {
        // Old Node.js API
        buffer = new Buffer(size);
        buffer.fill(0); // zero-fill
    }

    let fd;

    try {
        fd = fs.openSync(command, 'r');
        fs.readSync(fd, buffer, 0, size, 0);
        fs.closeSync(fd);
    } catch (e) { /* Empty */ }

    // Attempt to extract shebang (null is returned if not a shebang)
    return shebangCommand(buffer.toString());
}

module.exports = readShebang;


/***/ }),

/***/ 400:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const php_codesniffer_1 = __webpack_require__(160);
const child_process_1 = __webpack_require__(129);
const git_blame_json_1 = __webpack_require__(5);
const path = __importStar(__webpack_require__(622));
const core = __importStar(__webpack_require__(470));
const github = __importStar(__webpack_require__(469));
async function runOnBlame(files) {
    var _a;
    try {
        const options = {};
        const standard = core.getInput('standard');
        if (standard)
            options.standard = standard;
        const lintResults = await php_codesniffer_1.lint(files, core.getInput('phpcs_path', { required: true }));
        const dontFailOnWarning = core.getInput('fail_on_warnings') == 'false' ||
            core.getInput('fail_on_warnings') === 'off';
        if (!lintResults.totals.errors) {
            if (dontFailOnWarning)
                return;
            if (!lintResults.totals.warnings)
                return;
        }
        // blame files and output relevant errors
        const payload = github.context
            .payload;
        // get email of author of first commit in PR
        const authorEmail = child_process_1.execFileSync('git', ['--no-pager', 'log', '--format=%ae', `${github.context.sha}^!`], { encoding: 'utf8', windowsHide: true, timeout: 5000 }).trim();
        console.log('PR author email: %s', authorEmail);
        for (const [file, results] of Object.entries(lintResults.files)) {
            const blameMap = await git_blame_json_1.blame(file);
            let headerPrinted = false;
            for (const message of results.messages) {
                if (((_a = blameMap.get(message.line)) === null || _a === void 0 ? void 0 : _a.authorMail) === authorEmail) {
                    // that's our line
                    // we simulate checkstyle output to be picked up by problem matched
                    if (!headerPrinted) {
                        console.log(`<file name="${path.relative(process.cwd(), file)}">`);
                        headerPrinted = true;
                    }
                    // output the problem
                    console.log('<error line="%d" column="%d" severity="%s" message="%s" source="%s"/>', message.line, message.column, message.type.toLowerCase(), message.message, message.source);
                    // fail
                    if (message.type === 'WARNING' && !dontFailOnWarning)
                        core.setFailed(message.message);
                    else if (message.type === 'ERROR')
                        core.setFailed(message.message);
                }
            }
        }
    }
    catch (err) {
        core.debug(err);
        core.setFailed(err);
    }
}
exports.runOnBlame = runOnBlame;


/***/ }),

/***/ 402:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = Octokit;

const { request } = __webpack_require__(753);
const Hook = __webpack_require__(523);

const parseClientOptions = __webpack_require__(294);

function Octokit(plugins, options) {
  options = options || {};
  const hook = new Hook.Collection();
  const log = Object.assign(
    {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    options && options.log
  );
  const api = {
    hook,
    log,
    request: request.defaults(parseClientOptions(options, log, hook))
  };

  plugins.forEach(pluginFunction => pluginFunction(api, options));

  return api;
}


/***/ }),

/***/ 413:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 422:
/***/ (function(module) {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

    __extends = function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function (m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    };

    __values = function (o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result["default"] = mod;
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
});


/***/ }),

/***/ 427:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// Older verions of Node.js might not have `util.getSystemErrorName()`.
// In that case, fall back to a deprecated internal.
const util = __webpack_require__(669);

let uv;

if (typeof util.getSystemErrorName === 'function') {
	module.exports = util.getSystemErrorName;
} else {
	try {
		uv = process.binding('uv');

		if (typeof uv.errname !== 'function') {
			throw new TypeError('uv.errname is not a function');
		}
	} catch (err) {
		console.error('execa/lib/errname: unable to establish process.binding(\'uv\')', err);
		uv = null;
	}

	module.exports = code => errname(uv, code);
}

// Used for testing the fallback behavior
module.exports.__test__ = errname;

function errname(uv, code) {
	if (uv) {
		return uv.errname(code);
	}

	if (!(code < 0)) {
		throw new Error('err >= 0');
	}

	return `Unknown system error ${code}`;
}



/***/ }),

/***/ 430:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = octokitValidate;

const validate = __webpack_require__(348);

function octokitValidate(octokit) {
  octokit.hook.before("request", validate.bind(null, octokit));
}


/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
function escapeData(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(969)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(413));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(34));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(18).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 462:
/***/ (function(module) {

"use strict";


// See http://www.robvanderwoude.com/escapechars.php
const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
    // Convert to string
    arg = `${arg}`;

    // Algorithm below is based on https://qntm.org/cmd

    // Sequence of backslashes followed by a double quote:
    // double up all the backslashes and escape the double quote
    arg = arg.replace(/(\\*)"/g, '$1$1\\"');

    // Sequence of backslashes followed by the end of the string
    // (which will become a double quote later):
    // double up all the backslashes
    arg = arg.replace(/(\\*)$/, '$1$1');

    // All other backslashes occur literally

    // Quote the whole thing:
    arg = `"${arg}"`;

    // Escape meta chars
    arg = arg.replace(metaCharsRegExp, '^$1');

    // Double escape meta chars if necessary
    if (doubleEscapeMetaChars) {
        arg = arg.replace(metaCharsRegExp, '^$1');
    }

    return arg;
}

module.exports.command = escapeCommand;
module.exports.argument = escapeArgument;


/***/ }),

/***/ 463:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 469:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// Originally pulled from https://github.com/JasonEtco/actions-toolkit/blob/master/src/github.ts
const graphql_1 = __webpack_require__(898);
const rest_1 = __webpack_require__(0);
const Context = __importStar(__webpack_require__(262));
const httpClient = __importStar(__webpack_require__(539));
// We need this in order to extend Octokit
rest_1.Octokit.prototype = new rest_1.Octokit();
exports.context = new Context.Context();
class GitHub extends rest_1.Octokit {
    constructor(token, opts) {
        super(GitHub.getOctokitOptions(GitHub.disambiguate(token, opts)));
        this.graphql = GitHub.getGraphQL(GitHub.disambiguate(token, opts));
    }
    /**
     * Disambiguates the constructor overload parameters
     */
    static disambiguate(token, opts) {
        return [
            typeof token === 'string' ? token : '',
            typeof token === 'object' ? token : opts || {}
        ];
    }
    static getOctokitOptions(args) {
        const token = args[0];
        const options = Object.assign({}, args[1]); // Shallow clone - don't mutate the object provided by the caller
        // Auth
        const auth = GitHub.getAuthString(token, options);
        if (auth) {
            options.auth = auth;
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            // Shallow clone - don't mutate the object provided by the caller
            options.request = options.request ? Object.assign({}, options.request) : {};
            // Set the agent
            options.request.agent = agent;
        }
        return options;
    }
    static getGraphQL(args) {
        const defaults = {};
        const token = args[0];
        const options = args[1];
        // Authorization
        const auth = this.getAuthString(token, options);
        if (auth) {
            defaults.headers = {
                authorization: auth
            };
        }
        // Proxy
        const agent = GitHub.getProxyAgent(options);
        if (agent) {
            defaults.request = { agent };
        }
        return graphql_1.graphql.defaults(defaults);
    }
    static getAuthString(token, options) {
        // Validate args
        if (!token && !options.auth) {
            throw new Error('Parameter token or opts.auth is required');
        }
        else if (token && options.auth) {
            throw new Error('Parameters token and opts.auth may not both be specified');
        }
        return typeof options.auth === 'string' ? options.auth : `token ${token}`;
    }
    static getProxyAgent(options) {
        var _a;
        if (!((_a = options.request) === null || _a === void 0 ? void 0 : _a.agent)) {
            const serverUrl = 'https://api.github.com';
            if (httpClient.getProxyUrl(serverUrl)) {
                const hc = new httpClient.HttpClient();
                return hc.getAgent(serverUrl);
            }
        }
        return undefined;
    }
}
exports.GitHub = GitHub;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = command_1.toCommandValue(val);
    process.env[name] = convertedVal;
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    command_1.issueCommand('add-path', {}, inputPath);
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 471:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);
const uniq = __webpack_require__(126);

function authenticationBeforeRequest(state, options) {
  if (!state.auth.type) {
    return;
  }

  if (state.auth.type === "basic") {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    return;
  }

  if (state.auth.type === "token") {
    options.headers.authorization = `token ${state.auth.token}`;
    return;
  }

  if (state.auth.type === "app") {
    options.headers.authorization = `Bearer ${state.auth.token}`;
    const acceptHeaders = options.headers.accept
      .split(",")
      .concat("application/vnd.github.machine-man-preview+json");
    options.headers.accept = uniq(acceptHeaders)
      .filter(Boolean)
      .join(",");
    return;
  }

  options.url += options.url.indexOf("?") === -1 ? "?" : "&";

  if (state.auth.token) {
    options.url += `access_token=${encodeURIComponent(state.auth.token)}`;
    return;
  }

  const key = encodeURIComponent(state.auth.key);
  const secret = encodeURIComponent(state.auth.secret);
  options.url += `client_id=${key}&client_secret=${secret}`;
}


/***/ }),

/***/ 489:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const which = __webpack_require__(814);
const pathKey = __webpack_require__(39)();

function resolveCommandAttempt(parsed, withoutPathExt) {
    const cwd = process.cwd();
    const hasCustomCwd = parsed.options.cwd != null;

    // If a custom `cwd` was specified, we need to change the process cwd
    // because `which` will do stat calls but does not support a custom cwd
    if (hasCustomCwd) {
        try {
            process.chdir(parsed.options.cwd);
        } catch (err) {
            /* Empty */
        }
    }

    let resolved;

    try {
        resolved = which.sync(parsed.command, {
            path: (parsed.options.env || process.env)[pathKey],
            pathExt: withoutPathExt ? path.delimiter : undefined,
        });
    } catch (e) {
        /* Empty */
    } finally {
        process.chdir(cwd);
    }

    // If we successfully resolved, ensure that an absolute path is returned
    // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
    if (resolved) {
        resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
    }

    return resolved;
}

function resolveCommand(parsed) {
    return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

module.exports = resolveCommand;


/***/ }),

/***/ 497:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(969));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 510:
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 523:
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(280)
var addHook = __webpack_require__(510)
var removeHook = __webpack_require__(763)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 529:
/***/ (function(module, __unusedexports, __webpack_require__) {

const factory = __webpack_require__(47);

module.exports = factory();


/***/ }),

/***/ 536:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasFirstPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasFirstPage (link) {
  deprecate(`octokit.hasFirstPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).first
}


/***/ }),

/***/ 537:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const utils = __webpack_require__(224);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __webpack_require__(199);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }
      }
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 539:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
const http = __webpack_require__(605);
const https = __webpack_require__(34);
const pm = __webpack_require__(950);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(856);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 548:
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 550:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getNextPage

const getPage = __webpack_require__(265)

function getNextPage (octokit, link, headers) {
  return getPage(octokit, link, 'next', headers)
}


/***/ }),

/***/ 555:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var lower_case_1 = __webpack_require__(175);
// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
var DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];
// Remove all non-word characters.
var DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;
/**
 * Normalize the string into something other libraries can manipulate easier.
 */
function noCase(input, options) {
    if (options === void 0) { options = {}; }
    var _a = options.splitRegexp, splitRegexp = _a === void 0 ? DEFAULT_SPLIT_REGEXP : _a, _b = options.stripRegexp, stripRegexp = _b === void 0 ? DEFAULT_STRIP_REGEXP : _b, _c = options.transform, transform = _c === void 0 ? lower_case_1.lowerCase : _c, _d = options.delimiter, delimiter = _d === void 0 ? " " : _d;
    var result = replace(replace(input, splitRegexp, "$1\0$2"), stripRegexp, "\0");
    var start = 0;
    var end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === "\0")
        start++;
    while (result.charAt(end - 1) === "\0")
        end--;
    // Transform each token independently.
    return result
        .slice(start, end)
        .split("\0")
        .map(transform)
        .join(delimiter);
}
exports.noCase = noCase;
/**
 * Replace `re` in the input string with the replacement value.
 */
function replace(input, re, value) {
    if (re instanceof RegExp)
        return input.replace(re, value);
    return re.reduce(function (input, re) { return input.replace(re, value); }, input);
}
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 558:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasPreviousPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasPreviousPage (link) {
  deprecate(`octokit.hasPreviousPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).prev
}


/***/ }),

/***/ 562:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    return "<environment undetectable>";
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 563:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getPreviousPage

const getPage = __webpack_require__(265)

function getPreviousPage (octokit, link, headers) {
  return getPage(octokit, link, 'prev', headers)
}


/***/ }),

/***/ 568:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const path = __webpack_require__(622);
const niceTry = __webpack_require__(948);
const resolveCommand = __webpack_require__(489);
const escape = __webpack_require__(462);
const readShebang = __webpack_require__(389);
const semver = __webpack_require__(48);

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

// `options.shell` is supported in Node ^4.8.0, ^5.7.0 and >= 6.0.0
const supportsShellOption = niceTry(() => semver.satisfies(process.version, '^4.8.0 || ^5.7.0 || >= 6.0.0', true)) || false;

function detectShebang(parsed) {
    parsed.file = resolveCommand(parsed);

    const shebang = parsed.file && readShebang(parsed.file);

    if (shebang) {
        parsed.args.unshift(parsed.file);
        parsed.command = shebang;

        return resolveCommand(parsed);
    }

    return parsed.file;
}

function parseNonShell(parsed) {
    if (!isWin) {
        return parsed;
    }

    // Detect & add support for shebangs
    const commandFile = detectShebang(parsed);

    // We don't need a shell if the command filename is an executable
    const needsShell = !isExecutableRegExp.test(commandFile);

    // If a shell is required, use cmd.exe and take care of escaping everything correctly
    // Note that `forceShell` is an hidden option used only in tests
    if (parsed.options.forceShell || needsShell) {
        // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
        // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
        // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
        // we need to double escape them
        const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

        // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
        // This is necessary otherwise it will always fail with ENOENT in those cases
        parsed.command = path.normalize(parsed.command);

        // Escape command & arguments
        parsed.command = escape.command(parsed.command);
        parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));

        const shellCommand = [parsed.command].concat(parsed.args).join(' ');

        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.command = process.env.comspec || 'cmd.exe';
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    }

    return parsed;
}

function parseShell(parsed) {
    // If node supports the shell option, there's no need to mimic its behavior
    if (supportsShellOption) {
        return parsed;
    }

    // Mimic node shell option
    // See https://github.com/nodejs/node/blob/b9f6a2dc059a1062776133f3d4fd848c4da7d150/lib/child_process.js#L335
    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    if (isWin) {
        parsed.command = typeof parsed.options.shell === 'string' ? parsed.options.shell : process.env.comspec || 'cmd.exe';
        parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
        parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
    } else {
        if (typeof parsed.options.shell === 'string') {
            parsed.command = parsed.options.shell;
        } else if (process.platform === 'android') {
            parsed.command = '/system/bin/sh';
        } else {
            parsed.command = '/bin/sh';
        }

        parsed.args = ['-c', shellCommand];
    }

    return parsed;
}

function parse(command, args, options) {
    // Normalize arguments, similar to nodejs
    if (args && !Array.isArray(args)) {
        options = args;
        args = null;
    }

    args = args ? args.slice(0) : []; // Clone array to avoid changing the original
    options = Object.assign({}, options); // Clone object to avoid changing the original

    // Build our parsed object
    const parsed = {
        command,
        args,
        options,
        file: undefined,
        original: {
            command,
            args,
        },
    };

    // Delegate further parsing to shell or non-shell
    return options.shell ? parseShell(parsed) : parseNonShell(parsed);
}

module.exports = parse;


/***/ }),

/***/ 577:
/***/ (function(module) {

module.exports = getPageLinks

function getPageLinks (link) {
  link = link.link || link.headers.link || ''

  const links = {}

  // link format:
  // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
  link.replace(/<([^>]*)>;\s*rel="([\w]*)"/g, (m, uri, type) => {
    links[type] = uri
  })

  return links
}


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 621:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const pathKey = __webpack_require__(39);

module.exports = opts => {
	opts = Object.assign({
		cwd: process.cwd(),
		path: process.env[pathKey()]
	}, opts);

	let prev;
	let pth = path.resolve(opts.cwd);
	const ret = [];

	while (prev !== pth) {
		ret.push(path.join(pth, 'node_modules/.bin'));
		prev = pth;
		pth = path.resolve(pth, '..');
	}

	// ensure the running `node` binary is used
	ret.push(path.dirname(process.execPath));

	return ret.concat(opts.path).join(path.delimiter);
};

module.exports.env = opts => {
	opts = Object.assign({
		env: process.env
	}, opts);

	const env = Object.assign({}, opts.env);
	const path = pathKey({env});

	opts.path = env[path];
	env[path] = module.exports(opts);

	return env;
};


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 626:
/***/ (function(module) {

"use strict";


/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 631:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 649:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getLastPage

const getPage = __webpack_require__(265)

function getLastPage (octokit, link, headers) {
  return getPage(octokit, link, 'last', headers)
}


/***/ }),

/***/ 654:
/***/ (function(module) {

// This is not the set of all possible signals.
//
// It IS, however, the set of all signals that trigger
// an exit on either Linux or BSD systems.  Linux is a
// superset of the signal names supported on BSD, and
// the unknown signals just fail to register, so we can
// catch that easily enough.
//
// Don't bother with SIGKILL.  It's uncatchable, which
// means that we can't fire any callbacks anyway.
//
// If a user does happen to register a handler on a non-
// fatal signal like SIGWINCH or something, and then
// exit, it'll end up firing `process.emit('exit')`, so
// the handler will be fired anyway.
//
// SIGBUS, SIGFPE, SIGSEGV and SIGILL, when not raised
// artificially, inherently leave the process in a
// state from which it is not safe to try and enter JS
// listeners.
module.exports = [
  'SIGABRT',
  'SIGALRM',
  'SIGHUP',
  'SIGINT',
  'SIGTERM'
]

if (process.platform !== 'win32') {
  module.exports.push(
    'SIGVTALRM',
    'SIGXCPU',
    'SIGXFSZ',
    'SIGUSR2',
    'SIGTRAP',
    'SIGSYS',
    'SIGQUIT',
    'SIGIOT'
    // should detect profiler and enable/disable accordingly.
    // see #21
    // 'SIGPROF'
  )
}

if (process.platform === 'linux') {
  module.exports.push(
    'SIGIO',
    'SIGPOLL',
    'SIGPWR',
    'SIGSTKFLT',
    'SIGUNUSED'
  )
}


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 674:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticate;

const { Deprecation } = __webpack_require__(692);
const once = __webpack_require__(969);

const deprecateAuthenticate = once((log, deprecation) => log.warn(deprecation));

function authenticate(state, options) {
  deprecateAuthenticate(
    state.octokit.log,
    new Deprecation(
      '[@octokit/rest] octokit.authenticate() is deprecated. Use "auth" constructor option instead.'
    )
  );

  if (!options) {
    state.auth = false;
    return;
  }

  switch (options.type) {
    case "basic":
      if (!options.username || !options.password) {
        throw new Error(
          "Basic authentication requires both a username and password to be set"
        );
      }
      break;

    case "oauth":
      if (!options.token && !(options.key && options.secret)) {
        throw new Error(
          "OAuth2 authentication requires a token or key & secret to be set"
        );
      }
      break;

    case "token":
    case "app":
      if (!options.token) {
        throw new Error("Token authentication requires a token to be set");
      }
      break;

    default:
      throw new Error(
        "Invalid authentication type, must be 'basic', 'oauth', 'token' or 'app'"
      );
  }

  state.auth = options;
}


/***/ }),

/***/ 675:
/***/ (function(module) {

module.exports = function btoa(str) {
  return new Buffer(str).toString('base64')
}


/***/ }),

/***/ 692:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 697:
/***/ (function(module) {

"use strict";

module.exports = (promise, onFinally) => {
	onFinally = onFinally || (() => {});

	return promise.then(
		val => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => val),
		err => new Promise(resolve => {
			resolve(onFinally());
		}).then(() => {
			throw err;
		})
	);
};


/***/ }),

/***/ 742:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747)
var core
if (process.platform === 'win32' || global.TESTING_WINDOWS) {
  core = __webpack_require__(818)
} else {
  core = __webpack_require__(197)
}

module.exports = isexe
isexe.sync = sync

function isexe (path, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }

  if (!cb) {
    if (typeof Promise !== 'function') {
      throw new TypeError('callback not provided')
    }

    return new Promise(function (resolve, reject) {
      isexe(path, options || {}, function (er, is) {
        if (er) {
          reject(er)
        } else {
          resolve(is)
        }
      })
    })
  }

  core(path, options || {}, function (er, is) {
    // ignore EACCES because that just means we aren't allowed to run it
    if (er) {
      if (er.code === 'EACCES' || options && options.ignoreErrors) {
        er = null
        is = false
      }
    }
    cb(er, is)
  })
}

function sync (path, options) {
  // my kingdom for a filtered catch
  try {
    return core.sync(path, options || {})
  } catch (er) {
    if (options && options.ignoreErrors || er.code === 'EACCES') {
      return false
    } else {
      throw er
    }
  }
}


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 753:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(385);
var universalUserAgent = __webpack_require__(211);
var isPlainObject = _interopDefault(__webpack_require__(548));
var nodeFetch = _interopDefault(__webpack_require__(454));
var requestError = __webpack_require__(463);

const VERSION = "5.4.2";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 763:
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 768:
/***/ (function(module) {

"use strict";

module.exports = function (x) {
	var lf = typeof x === 'string' ? '\n' : '\n'.charCodeAt();
	var cr = typeof x === 'string' ? '\r' : '\r'.charCodeAt();

	if (x[x.length - 1] === lf) {
		x = x.slice(0, x.length - 1);
	}

	if (x[x.length - 1] === cr) {
		x = x.slice(0, x.length - 1);
	}

	return x;
};


/***/ }),

/***/ 777:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = getFirstPage

const getPage = __webpack_require__(265)

function getFirstPage (octokit, link, headers) {
  return getPage(octokit, link, 'first', headers)
}


/***/ }),

/***/ 796:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var osName = _interopDefault(__webpack_require__(2));

function getUserAgent() {
  try {
    return `Node.js/${process.version.substr(1)} (${osName()}; ${process.arch})`;
  } catch (error) {
    if (/wmic os get Caption/.test(error.message)) {
      return "Windows <version undetectable>";
    }

    throw error;
  }
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 806:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const constants = __webpack_require__(199);
const utils = __webpack_require__(224);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = (opts) => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index];
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };
  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.prev.type === 'bos' && eos()) {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance() || '';
      } else {
        value += advance() || '';
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = (opts) => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 813:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 814:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = which
which.sync = whichSync

var isWindows = process.platform === 'win32' ||
    process.env.OSTYPE === 'cygwin' ||
    process.env.OSTYPE === 'msys'

var path = __webpack_require__(622)
var COLON = isWindows ? ';' : ':'
var isexe = __webpack_require__(742)

function getNotFoundError (cmd) {
  var er = new Error('not found: ' + cmd)
  er.code = 'ENOENT'

  return er
}

function getPathInfo (cmd, opt) {
  var colon = opt.colon || COLON
  var pathEnv = opt.path || process.env.PATH || ''
  var pathExt = ['']

  pathEnv = pathEnv.split(colon)

  var pathExtExe = ''
  if (isWindows) {
    pathEnv.unshift(process.cwd())
    pathExtExe = (opt.pathExt || process.env.PATHEXT || '.EXE;.CMD;.BAT;.COM')
    pathExt = pathExtExe.split(colon)


    // Always test the cmd itself first.  isexe will check to make sure
    // it's found in the pathExt set.
    if (cmd.indexOf('.') !== -1 && pathExt[0] !== '')
      pathExt.unshift('')
  }

  // If it has a slash, then we don't bother searching the pathenv.
  // just check the file itself, and that's it.
  if (cmd.match(/\//) || isWindows && cmd.match(/\\/))
    pathEnv = ['']

  return {
    env: pathEnv,
    ext: pathExt,
    extExe: pathExtExe
  }
}

function which (cmd, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  ;(function F (i, l) {
    if (i === l) {
      if (opt.all && found.length)
        return cb(null, found)
      else
        return cb(getNotFoundError(cmd))
    }

    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && (/^\.[\\\/]/).test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    ;(function E (ii, ll) {
      if (ii === ll) return F(i + 1, l)
      var ext = pathExt[ii]
      isexe(p + ext, { pathExt: pathExtExe }, function (er, is) {
        if (!er && is) {
          if (opt.all)
            found.push(p + ext)
          else
            return cb(null, p + ext)
        }
        return E(ii + 1, ll)
      })
    })(0, pathExt.length)
  })(0, pathEnv.length)
}

function whichSync (cmd, opt) {
  opt = opt || {}

  var info = getPathInfo(cmd, opt)
  var pathEnv = info.env
  var pathExt = info.ext
  var pathExtExe = info.extExe
  var found = []

  for (var i = 0, l = pathEnv.length; i < l; i ++) {
    var pathPart = pathEnv[i]
    if (pathPart.charAt(0) === '"' && pathPart.slice(-1) === '"')
      pathPart = pathPart.slice(1, -1)

    var p = path.join(pathPart, cmd)
    if (!pathPart && /^\.[\\\/]/.test(cmd)) {
      p = cmd.slice(0, 2) + p
    }
    for (var j = 0, ll = pathExt.length; j < ll; j ++) {
      var cur = p + pathExt[j]
      var is
      try {
        is = isexe.sync(cur, { pathExt: pathExtExe })
        if (is) {
          if (opt.all)
            found.push(cur)
          else
            return cur
        }
      } catch (ex) {}
    }
  }

  if (opt.all && found.length)
    return found

  if (opt.nothrow)
    return null

  throw getNotFoundError(cmd)
}


/***/ }),

/***/ 816:
/***/ (function(module) {

"use strict";

module.exports = /^#!.*/;


/***/ }),

/***/ 818:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = isexe
isexe.sync = sync

var fs = __webpack_require__(747)

function checkPathExt (path, options) {
  var pathext = options.pathExt !== undefined ?
    options.pathExt : process.env.PATHEXT

  if (!pathext) {
    return true
  }

  pathext = pathext.split(';')
  if (pathext.indexOf('') !== -1) {
    return true
  }
  for (var i = 0; i < pathext.length; i++) {
    var p = pathext[i].toLowerCase()
    if (p && path.substr(-p.length).toLowerCase() === p) {
      return true
    }
  }
  return false
}

function checkStat (stat, path, options) {
  if (!stat.isSymbolicLink() && !stat.isFile()) {
    return false
  }
  return checkPathExt(path, options)
}

function isexe (path, options, cb) {
  fs.stat(path, function (er, stat) {
    cb(er, er ? false : checkStat(stat, path, options))
  })
}

function sync (path, options) {
  return checkStat(fs.statSync(path), path, options)
}


/***/ }),

/***/ 827:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(366);


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 842:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var deprecation = __webpack_require__(692);

var endpointsByScope = {
  actions: {
    cancelWorkflowRun: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/cancel"
    },
    createOrUpdateSecretForRepo: {
      method: "PUT",
      params: {
        encrypted_value: {
          type: "string"
        },
        key_id: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    createRegistrationToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/registration-token"
    },
    createRemoveToken: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/remove-token"
    },
    deleteArtifact: {
      method: "DELETE",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    deleteSecretFromRepo: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    downloadArtifact: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id/:archive_format"
    },
    getArtifact: {
      method: "GET",
      params: {
        artifact_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/artifacts/:artifact_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/public-key"
    },
    getSecret: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets/:name"
    },
    getSelfHostedRunner: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    },
    getWorkflow: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id"
    },
    getWorkflowJob: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id"
    },
    getWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id"
    },
    listDownloadsForSelfHostedRunnerApplication: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/downloads"
    },
    listJobsForWorkflowRun: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/jobs"
    },
    listRepoWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runs"
    },
    listRepoWorkflows: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows"
    },
    listSecretsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/secrets"
    },
    listSelfHostedRunnersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/runners"
    },
    listWorkflowJobLogs: {
      method: "GET",
      params: {
        job_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/actions/jobs/:job_id/logs"
    },
    listWorkflowRunArtifacts: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/artifacts"
    },
    listWorkflowRunLogs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/logs"
    },
    listWorkflowRuns: {
      method: "GET",
      params: {
        actor: {
          type: "string"
        },
        branch: {
          type: "string"
        },
        event: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["completed", "status", "conclusion"],
          type: "string"
        },
        workflow_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/workflows/:workflow_id/runs"
    },
    reRunWorkflow: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        run_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runs/:run_id/rerun"
    },
    removeSelfHostedRunner: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        runner_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/actions/runners/:runner_id"
    }
  },
  activity: {
    checkStarringRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    deleteRepoSubscription: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    deleteThreadSubscription: {
      method: "DELETE",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    getRepoSubscription: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    getThread: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    getThreadSubscription: {
      method: "GET",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    listEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/orgs/:org"
    },
    listEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events"
    },
    listFeeds: {
      method: "GET",
      params: {},
      url: "/feeds"
    },
    listNotifications: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    listNotificationsForRepo: {
      method: "GET",
      params: {
        all: {
          type: "boolean"
        },
        before: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        participating: {
          type: "boolean"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    listPublicEvents: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/events"
    },
    listPublicEventsForOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/events"
    },
    listPublicEventsForRepoNetwork: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/networks/:owner/:repo/events"
    },
    listPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/events/public"
    },
    listReceivedEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events"
    },
    listReceivedPublicEventsForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/received_events/public"
    },
    listRepoEvents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/events"
    },
    listReposStarredByAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/user/starred"
    },
    listReposStarredByUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/starred"
    },
    listReposWatchedByUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/subscriptions"
    },
    listStargazersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stargazers"
    },
    listWatchedReposForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/subscriptions"
    },
    listWatchersForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/subscribers"
    },
    markAsRead: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        }
      },
      url: "/notifications"
    },
    markNotificationsAsReadForRepo: {
      method: "PUT",
      params: {
        last_read_at: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/notifications"
    },
    markThreadAsRead: {
      method: "PATCH",
      params: {
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id"
    },
    setRepoSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        subscribed: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/subscription"
    },
    setThreadSubscription: {
      method: "PUT",
      params: {
        ignored: {
          type: "boolean"
        },
        thread_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/notifications/threads/:thread_id/subscription"
    },
    starRepo: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    },
    unstarRepo: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/user/starred/:owner/:repo"
    }
  },
  apps: {
    addRepoToInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "PUT",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    checkAccountIsAssociatedWithAny: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/accounts/:account_id"
    },
    checkAccountIsAssociatedWithAnyStubbed: {
      method: "GET",
      params: {
        account_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/accounts/:account_id"
    },
    checkAuthorization: {
      deprecated: "octokit.apps.checkAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#check-an-authorization",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    checkToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "POST",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    createContentAttachment: {
      headers: {
        accept: "application/vnd.github.corsair-preview+json"
      },
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        content_reference_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/content_references/:content_reference_id/attachments"
    },
    createFromManifest: {
      headers: {
        accept: "application/vnd.github.fury-preview+json"
      },
      method: "POST",
      params: {
        code: {
          required: true,
          type: "string"
        }
      },
      url: "/app-manifests/:code/conversions"
    },
    createInstallationToken: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "POST",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        permissions: {
          type: "object"
        },
        repository_ids: {
          type: "integer[]"
        }
      },
      url: "/app/installations/:installation_id/access_tokens"
    },
    deleteAuthorization: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grant"
    },
    deleteInstallation: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json,application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    deleteToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "DELETE",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    findOrgInstallation: {
      deprecated: "octokit.apps.findOrgInstallation() has been renamed to octokit.apps.getOrgInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    findRepoInstallation: {
      deprecated: "octokit.apps.findRepoInstallation() has been renamed to octokit.apps.getRepoInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    findUserInstallation: {
      deprecated: "octokit.apps.findUserInstallation() has been renamed to octokit.apps.getUserInstallation() (2019-04-10)",
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    getAuthenticated: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {},
      url: "/app"
    },
    getBySlug: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        app_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/apps/:app_slug"
    },
    getInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/app/installations/:installation_id"
    },
    getOrgInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/installation"
    },
    getRepoInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/installation"
    },
    getUserInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/installation"
    },
    listAccountsUserOrOrgOnPlan: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/plans/:plan_id/accounts"
    },
    listAccountsUserOrOrgOnPlanStubbed: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        plan_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/marketplace_listing/stubbed/plans/:plan_id/accounts"
    },
    listInstallationReposForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/app/installations"
    },
    listInstallationsForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/installations"
    },
    listMarketplacePurchasesForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases"
    },
    listMarketplacePurchasesForAuthenticatedUserStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/marketplace_purchases/stubbed"
    },
    listPlans: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/plans"
    },
    listPlansStubbed: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/marketplace_listing/stubbed/plans"
    },
    listRepos: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/installation/repositories"
    },
    removeRepoFromInstallation: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "DELETE",
      params: {
        installation_id: {
          required: true,
          type: "integer"
        },
        repository_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/installations/:installation_id/repositories/:repository_id"
    },
    resetAuthorization: {
      deprecated: "octokit.apps.resetAuthorization() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#reset-an-authorization",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    resetToken: {
      headers: {
        accept: "application/vnd.github.doctor-strange-preview+json"
      },
      method: "PATCH",
      params: {
        access_token: {
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.apps.revokeAuthorizationForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-an-authorization-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.apps.revokeGrantForApplication() is deprecated, see https://developer.github.com/v3/apps/oauth_applications/#revoke-a-grant-for-an-application",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    revokeInstallationToken: {
      headers: {
        accept: "application/vnd.github.gambit-preview+json"
      },
      method: "DELETE",
      params: {},
      url: "/installation/token"
    }
  },
  checks: {
    create: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        head_sha: {
          required: true,
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs"
    },
    createSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        head_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites"
    },
    get: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    },
    getSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id"
    },
    listAnnotations: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_run_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id/annotations"
    },
    listForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-runs"
    },
    listForSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        check_name: {
          type: "string"
        },
        check_suite_id: {
          required: true,
          type: "integer"
        },
        filter: {
          enum: ["latest", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/check-runs"
    },
    listSuitesForRef: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "GET",
      params: {
        app_id: {
          type: "integer"
        },
        check_name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/check-suites"
    },
    rerequestSuite: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "POST",
      params: {
        check_suite_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/:check_suite_id/rerequest"
    },
    setSuitesPreferences: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        auto_trigger_checks: {
          type: "object[]"
        },
        "auto_trigger_checks[].app_id": {
          required: true,
          type: "integer"
        },
        "auto_trigger_checks[].setting": {
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-suites/preferences"
    },
    update: {
      headers: {
        accept: "application/vnd.github.antiope-preview+json"
      },
      method: "PATCH",
      params: {
        actions: {
          type: "object[]"
        },
        "actions[].description": {
          required: true,
          type: "string"
        },
        "actions[].identifier": {
          required: true,
          type: "string"
        },
        "actions[].label": {
          required: true,
          type: "string"
        },
        check_run_id: {
          required: true,
          type: "integer"
        },
        completed_at: {
          type: "string"
        },
        conclusion: {
          enum: ["success", "failure", "neutral", "cancelled", "timed_out", "action_required"],
          type: "string"
        },
        details_url: {
          type: "string"
        },
        external_id: {
          type: "string"
        },
        name: {
          type: "string"
        },
        output: {
          type: "object"
        },
        "output.annotations": {
          type: "object[]"
        },
        "output.annotations[].annotation_level": {
          enum: ["notice", "warning", "failure"],
          required: true,
          type: "string"
        },
        "output.annotations[].end_column": {
          type: "integer"
        },
        "output.annotations[].end_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].message": {
          required: true,
          type: "string"
        },
        "output.annotations[].path": {
          required: true,
          type: "string"
        },
        "output.annotations[].raw_details": {
          type: "string"
        },
        "output.annotations[].start_column": {
          type: "integer"
        },
        "output.annotations[].start_line": {
          required: true,
          type: "integer"
        },
        "output.annotations[].title": {
          type: "string"
        },
        "output.images": {
          type: "object[]"
        },
        "output.images[].alt": {
          required: true,
          type: "string"
        },
        "output.images[].caption": {
          type: "string"
        },
        "output.images[].image_url": {
          required: true,
          type: "string"
        },
        "output.summary": {
          required: true,
          type: "string"
        },
        "output.text": {
          type: "string"
        },
        "output.title": {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        started_at: {
          type: "string"
        },
        status: {
          enum: ["queued", "in_progress", "completed"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/check-runs/:check_run_id"
    }
  },
  codesOfConduct: {
    getConductCode: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        key: {
          required: true,
          type: "string"
        }
      },
      url: "/codes_of_conduct/:key"
    },
    getForRepo: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/code_of_conduct"
    },
    listConductCodes: {
      headers: {
        accept: "application/vnd.github.scarlet-witch-preview+json"
      },
      method: "GET",
      params: {},
      url: "/codes_of_conduct"
    }
  },
  emojis: {
    get: {
      method: "GET",
      params: {},
      url: "/emojis"
    }
  },
  gists: {
    checkIsStarred: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        files: {
          required: true,
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        public: {
          type: "boolean"
        }
      },
      url: "/gists"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    delete: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    fork: {
      method: "POST",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    get: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    },
    getRevision: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/:sha"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists"
    },
    listComments: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/commits"
    },
    listForks: {
      method: "GET",
      params: {
        gist_id: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/gists/:gist_id/forks"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/public"
    },
    listPublicForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gists"
    },
    listStarred: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/gists/starred"
    },
    star: {
      method: "PUT",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    unstar: {
      method: "DELETE",
      params: {
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/star"
    },
    update: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        files: {
          type: "object"
        },
        "files.content": {
          type: "string"
        },
        "files.filename": {
          type: "string"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        gist_id: {
          required: true,
          type: "string"
        }
      },
      url: "/gists/:gist_id/comments/:comment_id"
    }
  },
  git: {
    createBlob: {
      method: "POST",
      params: {
        content: {
          required: true,
          type: "string"
        },
        encoding: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs"
    },
    createCommit: {
      method: "POST",
      params: {
        author: {
          type: "object"
        },
        "author.date": {
          type: "string"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.date": {
          type: "string"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        parents: {
          required: true,
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        },
        signature: {
          type: "string"
        },
        tree: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits"
    },
    createRef: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs"
    },
    createTag: {
      method: "POST",
      params: {
        message: {
          required: true,
          type: "string"
        },
        object: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        },
        tagger: {
          type: "object"
        },
        "tagger.date": {
          type: "string"
        },
        "tagger.email": {
          type: "string"
        },
        "tagger.name": {
          type: "string"
        },
        type: {
          enum: ["commit", "tree", "blob"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags"
    },
    createTree: {
      method: "POST",
      params: {
        base_tree: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree: {
          required: true,
          type: "object[]"
        },
        "tree[].content": {
          type: "string"
        },
        "tree[].mode": {
          enum: ["100644", "100755", "040000", "160000", "120000"],
          type: "string"
        },
        "tree[].path": {
          type: "string"
        },
        "tree[].sha": {
          allowNull: true,
          type: "string"
        },
        "tree[].type": {
          enum: ["blob", "tree", "commit"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees"
    },
    deleteRef: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    },
    getBlob: {
      method: "GET",
      params: {
        file_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/blobs/:file_sha"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/commits/:commit_sha"
    },
    getRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/ref/:ref"
    },
    getTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/tags/:tag_sha"
    },
    getTree: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        recursive: {
          enum: ["1"],
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tree_sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/trees/:tree_sha"
    },
    listMatchingRefs: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/matching-refs/:ref"
    },
    listRefs: {
      method: "GET",
      params: {
        namespace: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:namespace"
    },
    updateRef: {
      method: "PATCH",
      params: {
        force: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/git/refs/:ref"
    }
  },
  gitignore: {
    getTemplate: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/gitignore/templates/:name"
    },
    listTemplates: {
      method: "GET",
      params: {},
      url: "/gitignore/templates"
    }
  },
  interactions: {
    addOrUpdateRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    addOrUpdateRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "PUT",
      params: {
        limit: {
          enum: ["existing_users", "contributors_only", "collaborators_only"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    getRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    getRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    },
    removeRestrictionsForOrg: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/interaction-limits"
    },
    removeRestrictionsForRepo: {
      headers: {
        accept: "application/vnd.github.sombra-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/interaction-limits"
    }
  },
  issues: {
    addAssignees: {
      method: "POST",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    addLabels: {
      method: "POST",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          required: true,
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    checkAssignee: {
      method: "GET",
      params: {
        assignee: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees/:assignee"
    },
    create: {
      method: "POST",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    createLabel: {
      method: "POST",
      params: {
        color: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    createMilestone: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    deleteLabel: {
      method: "DELETE",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    deleteMilestone: {
      method: "DELETE",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    get: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    getEvent: {
      method: "GET",
      params: {
        event_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events/:event_id"
    },
    getLabel: {
      method: "GET",
      params: {
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:name"
    },
    getMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    },
    list: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/issues"
    },
    listAssignees: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/assignees"
    },
    listComments: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments"
    },
    listEvents: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/events"
    },
    listEventsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/events"
    },
    listEventsForTimeline: {
      headers: {
        accept: "application/vnd.github.mockingbird-preview+json"
      },
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/timeline"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/user/issues"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        filter: {
          enum: ["assigned", "created", "mentioned", "subscribed", "all"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/issues"
    },
    listForRepo: {
      method: "GET",
      params: {
        assignee: {
          type: "string"
        },
        creator: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        labels: {
          type: "string"
        },
        mentioned: {
          type: "string"
        },
        milestone: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "comments"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues"
    },
    listLabelsForMilestone: {
      method: "GET",
      params: {
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number/labels"
    },
    listLabelsForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels"
    },
    listLabelsOnIssue: {
      method: "GET",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    listMilestonesForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["due_on", "completeness"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones"
    },
    lock: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        lock_reason: {
          enum: ["off-topic", "too heated", "resolved", "spam"],
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    removeAssignees: {
      method: "DELETE",
      params: {
        assignees: {
          type: "string[]"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/assignees"
    },
    removeLabel: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels/:name"
    },
    removeLabels: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    replaceLabels: {
      method: "PUT",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/labels"
    },
    unlock: {
      method: "DELETE",
      params: {
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/lock"
    },
    update: {
      method: "PATCH",
      params: {
        assignee: {
          type: "string"
        },
        assignees: {
          type: "string[]"
        },
        body: {
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        labels: {
          type: "string[]"
        },
        milestone: {
          allowNull: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id"
    },
    updateLabel: {
      method: "PATCH",
      params: {
        color: {
          type: "string"
        },
        current_name: {
          required: true,
          type: "string"
        },
        description: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/labels/:current_name"
    },
    updateMilestone: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        due_on: {
          type: "string"
        },
        milestone_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "milestone_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/milestones/:milestone_number"
    }
  },
  licenses: {
    get: {
      method: "GET",
      params: {
        license: {
          required: true,
          type: "string"
        }
      },
      url: "/licenses/:license"
    },
    getForRepo: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/license"
    },
    list: {
      deprecated: "octokit.licenses.list() has been renamed to octokit.licenses.listCommonlyUsed() (2019-03-05)",
      method: "GET",
      params: {},
      url: "/licenses"
    },
    listCommonlyUsed: {
      method: "GET",
      params: {},
      url: "/licenses"
    }
  },
  markdown: {
    render: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        mode: {
          enum: ["markdown", "gfm"],
          type: "string"
        },
        text: {
          required: true,
          type: "string"
        }
      },
      url: "/markdown"
    },
    renderRaw: {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      },
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string"
        }
      },
      url: "/markdown/raw"
    }
  },
  meta: {
    get: {
      method: "GET",
      params: {},
      url: "/meta"
    }
  },
  migrations: {
    cancelImport: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    deleteArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    deleteArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    downloadArchiveForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getArchiveForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id/archive"
    },
    getArchiveForOrg: {
      deprecated: "octokit.migrations.getArchiveForOrg() has been renamed to octokit.migrations.downloadArchiveForOrg() (2020-01-27)",
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/archive"
    },
    getCommitAuthors: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors"
    },
    getImportProgress: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    getLargeFiles: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/large_files"
    },
    getStatusForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/migrations/:migration_id"
    },
    getStatusForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id"
    },
    listForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/migrations"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations"
    },
    listReposForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repositories"
    },
    listReposForUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "GET",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/:migration_id/repositories"
    },
    mapCommitAuthor: {
      method: "PATCH",
      params: {
        author_id: {
          required: true,
          type: "integer"
        },
        email: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/authors/:author_id"
    },
    setLfsPreference: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        use_lfs: {
          enum: ["opt_in", "opt_out"],
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import/lfs"
    },
    startForAuthenticatedUser: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/migrations"
    },
    startForOrg: {
      method: "POST",
      params: {
        exclude_attachments: {
          type: "boolean"
        },
        lock_repositories: {
          type: "boolean"
        },
        org: {
          required: true,
          type: "string"
        },
        repositories: {
          required: true,
          type: "string[]"
        }
      },
      url: "/orgs/:org/migrations"
    },
    startImport: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tfvc_project: {
          type: "string"
        },
        vcs: {
          enum: ["subversion", "git", "mercurial", "tfvc"],
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_url: {
          required: true,
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    },
    unlockRepoForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/migrations/:migration_id/repos/:repo_name/lock"
    },
    unlockRepoForOrg: {
      headers: {
        accept: "application/vnd.github.wyandotte-preview+json"
      },
      method: "DELETE",
      params: {
        migration_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        repo_name: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/migrations/:migration_id/repos/:repo_name/lock"
    },
    updateImport: {
      method: "PATCH",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        vcs_password: {
          type: "string"
        },
        vcs_username: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/import"
    }
  },
  oauthAuthorizations: {
    checkAuthorization: {
      deprecated: "octokit.oauthAuthorizations.checkAuthorization() has been renamed to octokit.apps.checkAuthorization() (2019-11-05)",
      method: "GET",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    createAuthorization: {
      deprecated: "octokit.oauthAuthorizations.createAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization",
      method: "POST",
      params: {
        client_id: {
          type: "string"
        },
        client_secret: {
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          required: true,
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations"
    },
    deleteAuthorization: {
      deprecated: "octokit.oauthAuthorizations.deleteAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-an-authorization",
      method: "DELETE",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    deleteGrant: {
      deprecated: "octokit.oauthAuthorizations.deleteGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#delete-a-grant",
      method: "DELETE",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getAuthorization: {
      deprecated: "octokit.oauthAuthorizations.getAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-authorization",
      method: "GET",
      params: {
        authorization_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/authorizations/:authorization_id"
    },
    getGrant: {
      deprecated: "octokit.oauthAuthorizations.getGrant() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-a-single-grant",
      method: "GET",
      params: {
        grant_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/applications/grants/:grant_id"
    },
    getOrCreateAuthorizationForApp: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForApp() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id"
    },
    getOrCreateAuthorizationForAppAndFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#get-or-create-an-authorization-for-a-specific-app-and-fingerprint",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    getOrCreateAuthorizationForAppFingerprint: {
      deprecated: "octokit.oauthAuthorizations.getOrCreateAuthorizationForAppFingerprint() has been renamed to octokit.oauthAuthorizations.getOrCreateAuthorizationForAppAndFingerprint() (2018-12-27)",
      method: "PUT",
      params: {
        client_id: {
          required: true,
          type: "string"
        },
        client_secret: {
          required: true,
          type: "string"
        },
        fingerprint: {
          required: true,
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/clients/:client_id/:fingerprint"
    },
    listAuthorizations: {
      deprecated: "octokit.oauthAuthorizations.listAuthorizations() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-authorizations",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/authorizations"
    },
    listGrants: {
      deprecated: "octokit.oauthAuthorizations.listGrants() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#list-your-grants",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/applications/grants"
    },
    resetAuthorization: {
      deprecated: "octokit.oauthAuthorizations.resetAuthorization() has been renamed to octokit.apps.resetAuthorization() (2019-11-05)",
      method: "POST",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeAuthorizationForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeAuthorizationForApplication() has been renamed to octokit.apps.revokeAuthorizationForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/tokens/:access_token"
    },
    revokeGrantForApplication: {
      deprecated: "octokit.oauthAuthorizations.revokeGrantForApplication() has been renamed to octokit.apps.revokeGrantForApplication() (2019-11-05)",
      method: "DELETE",
      params: {
        access_token: {
          required: true,
          type: "string"
        },
        client_id: {
          required: true,
          type: "string"
        }
      },
      url: "/applications/:client_id/grants/:access_token"
    },
    updateAuthorization: {
      deprecated: "octokit.oauthAuthorizations.updateAuthorization() is deprecated, see https://developer.github.com/v3/oauth_authorizations/#update-an-existing-authorization",
      method: "PATCH",
      params: {
        add_scopes: {
          type: "string[]"
        },
        authorization_id: {
          required: true,
          type: "integer"
        },
        fingerprint: {
          type: "string"
        },
        note: {
          type: "string"
        },
        note_url: {
          type: "string"
        },
        remove_scopes: {
          type: "string[]"
        },
        scopes: {
          type: "string[]"
        }
      },
      url: "/authorizations/:authorization_id"
    }
  },
  orgs: {
    addOrUpdateMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    blockUser: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkBlockedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    checkMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    checkPublicMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    concealMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    convertMemberToOutsideCollaborator: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks"
    },
    createInvitation: {
      method: "POST",
      params: {
        email: {
          type: "string"
        },
        invitee_id: {
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["admin", "direct_member", "billing_manager"],
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/orgs/:org/invitations"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    get: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    getMembership: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    getMembershipForAuthenticatedUser: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/organizations"
    },
    listBlockedUsers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/orgs"
    },
    listForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/orgs"
    },
    listHooks: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/hooks"
    },
    listInstallations: {
      headers: {
        accept: "application/vnd.github.machine-man-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/installations"
    },
    listInvitationTeams: {
      method: "GET",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations/:invitation_id/teams"
    },
    listMembers: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["all", "admin", "member"],
          type: "string"
        }
      },
      url: "/orgs/:org/members"
    },
    listMemberships: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["active", "pending"],
          type: "string"
        }
      },
      url: "/user/memberships/orgs"
    },
    listOutsideCollaborators: {
      method: "GET",
      params: {
        filter: {
          enum: ["2fa_disabled", "all"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/outside_collaborators"
    },
    listPendingInvitations: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/invitations"
    },
    listPublicMembers: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/public_members"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id/pings"
    },
    publicizeMembership: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/public_members/:username"
    },
    removeMember: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/members/:username"
    },
    removeMembership: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/memberships/:username"
    },
    removeOutsideCollaborator: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/outside_collaborators/:username"
    },
    unblockUser: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/blocks/:username"
    },
    update: {
      method: "PATCH",
      params: {
        billing_email: {
          type: "string"
        },
        company: {
          type: "string"
        },
        default_repository_permission: {
          enum: ["read", "write", "admin", "none"],
          type: "string"
        },
        description: {
          type: "string"
        },
        email: {
          type: "string"
        },
        has_organization_projects: {
          type: "boolean"
        },
        has_repository_projects: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        members_allowed_repository_creation_type: {
          enum: ["all", "private", "none"],
          type: "string"
        },
        members_can_create_internal_repositories: {
          type: "boolean"
        },
        members_can_create_private_repositories: {
          type: "boolean"
        },
        members_can_create_public_repositories: {
          type: "boolean"
        },
        members_can_create_repositories: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/hooks/:hook_id"
    },
    updateMembership: {
      method: "PATCH",
      params: {
        org: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["active"],
          required: true,
          type: "string"
        }
      },
      url: "/user/memberships/orgs/:org"
    }
  },
  projects: {
    addCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    createCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        content_id: {
          type: "integer"
        },
        content_type: {
          type: "string"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    createColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        name: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    createForAuthenticatedUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/user/projects"
    },
    createForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    createForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    deleteCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    deleteColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    get: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id"
    },
    getCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        card_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    getColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        column_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id"
    },
    listCards: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        archived_state: {
          enum: ["all", "archived", "not_archived"],
          type: "string"
        },
        column_id: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/projects/columns/:column_id/cards"
    },
    listCollaborators: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/collaborators"
    },
    listColumns: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        project_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/projects/:project_id/columns"
    },
    listForOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/orgs/:org/projects"
    },
    listForRepo: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/projects"
    },
    listForUser: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/projects"
    },
    moveCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        card_id: {
          required: true,
          type: "integer"
        },
        column_id: {
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(top|bottom|after:\\d+)$"
        }
      },
      url: "/projects/columns/cards/:card_id/moves"
    },
    moveColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "POST",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        position: {
          required: true,
          type: "string",
          validation: "^(first|last|after:\\d+)$"
        }
      },
      url: "/projects/columns/:column_id/moves"
    },
    removeCollaborator: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username"
    },
    reviewUserPermissionLevel: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/:project_id/collaborators/:username/permission"
    },
    update: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        name: {
          type: "string"
        },
        organization_permission: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        }
      },
      url: "/projects/:project_id"
    },
    updateCard: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        archived: {
          type: "boolean"
        },
        card_id: {
          required: true,
          type: "integer"
        },
        note: {
          type: "string"
        }
      },
      url: "/projects/columns/cards/:card_id"
    },
    updateColumn: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PATCH",
      params: {
        column_id: {
          required: true,
          type: "integer"
        },
        name: {
          required: true,
          type: "string"
        }
      },
      url: "/projects/columns/:column_id"
    }
  },
  pulls: {
    checkIfMerged: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    create: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createCommentReply: {
      deprecated: "octokit.pulls.createCommentReply() has been renamed to octokit.pulls.createComment() (2019-09-09)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_id: {
          required: true,
          type: "string"
        },
        in_reply_to: {
          deprecated: true,
          description: "The comment ID to reply to. **Note**: This must be the ID of a top-level comment, not a reply to that comment. Replies to replies are not supported.",
          type: "integer"
        },
        line: {
          type: "integer"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        position: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        side: {
          enum: ["LEFT", "RIGHT"],
          type: "string"
        },
        start_line: {
          type: "integer"
        },
        start_side: {
          enum: ["LEFT", "RIGHT", "side"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    createFromIssue: {
      deprecated: "octokit.pulls.createFromIssue() is deprecated, see https://developer.github.com/v3/pulls/#create-a-pull-request",
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        head: {
          required: true,
          type: "string"
        },
        issue: {
          required: true,
          type: "integer"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    createReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        comments: {
          type: "object[]"
        },
        "comments[].body": {
          required: true,
          type: "string"
        },
        "comments[].path": {
          required: true,
          type: "string"
        },
        "comments[].position": {
          required: true,
          type: "integer"
        },
        commit_id: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    createReviewCommentReply: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments/:comment_id/replies"
    },
    createReviewRequest: {
      method: "POST",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    deleteComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    deletePendingReview: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    deleteReviewRequest: {
      method: "DELETE",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        reviewers: {
          type: "string[]"
        },
        team_reviewers: {
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    dismissReview: {
      method: "PUT",
      params: {
        message: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/dismissals"
    },
    get: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    getComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    getCommentsForReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/comments"
    },
    getReview: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    },
    list: {
      method: "GET",
      params: {
        base: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        head: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["created", "updated", "popularity", "long-running"],
          type: "string"
        },
        state: {
          enum: ["open", "closed", "all"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls"
    },
    listComments: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/comments"
    },
    listCommentsForRepo: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        since: {
          type: "string"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/commits"
    },
    listFiles: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/files"
    },
    listReviewRequests: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/requested_reviewers"
    },
    listReviews: {
      method: "GET",
      params: {
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews"
    },
    merge: {
      method: "PUT",
      params: {
        commit_message: {
          type: "string"
        },
        commit_title: {
          type: "string"
        },
        merge_method: {
          enum: ["merge", "squash", "rebase"],
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/merge"
    },
    submitReview: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        event: {
          enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id/events"
    },
    update: {
      method: "PATCH",
      params: {
        base: {
          type: "string"
        },
        body: {
          type: "string"
        },
        maintainer_can_modify: {
          type: "boolean"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["open", "closed"],
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number"
    },
    updateBranch: {
      headers: {
        accept: "application/vnd.github.lydian-preview+json"
      },
      method: "PUT",
      params: {
        expected_head_sha: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/update-branch"
    },
    updateComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id"
    },
    updateReview: {
      method: "PUT",
      params: {
        body: {
          required: true,
          type: "string"
        },
        number: {
          alias: "pull_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        pull_number: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        review_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/pulls/:pull_number/reviews/:review_id"
    }
  },
  rateLimit: {
    get: {
      method: "GET",
      params: {},
      url: "/rate_limit"
    }
  },
  reactions: {
    createForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    createForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    createForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    createForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    createForTeamDiscussion: {
      deprecated: "octokit.reactions.createForTeamDiscussion() has been renamed to octokit.reactions.createForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionComment: {
      deprecated: "octokit.reactions.createForTeamDiscussionComment() has been renamed to octokit.reactions.createForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    createForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    createForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.createForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#create-reaction-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "POST",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    delete: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "DELETE",
      params: {
        reaction_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/reactions/:reaction_id"
    },
    listForCommitComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id/reactions"
    },
    listForIssue: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        issue_number: {
          required: true,
          type: "integer"
        },
        number: {
          alias: "issue_number",
          deprecated: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/:issue_number/reactions"
    },
    listForIssueComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/issues/comments/:comment_id/reactions"
    },
    listForPullRequestReviewComment: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pulls/comments/:comment_id/reactions"
    },
    listForTeamDiscussion: {
      deprecated: "octokit.reactions.listForTeamDiscussion() has been renamed to octokit.reactions.listForTeamDiscussionLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionComment: {
      deprecated: "octokit.reactions.listForTeamDiscussionComment() has been renamed to octokit.reactions.listForTeamDiscussionCommentLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionCommentLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-comment-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number/reactions"
    },
    listForTeamDiscussionInOrg: {
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/reactions"
    },
    listForTeamDiscussionLegacy: {
      deprecated: "octokit.reactions.listForTeamDiscussionLegacy() is deprecated, see https://developer.github.com/v3/reactions/#list-reactions-for-a-team-discussion-legacy",
      headers: {
        accept: "application/vnd.github.squirrel-girl-preview+json"
      },
      method: "GET",
      params: {
        content: {
          enum: ["+1", "-1", "laugh", "confused", "heart", "hooray", "rocket", "eyes"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/reactions"
    }
  },
  repos: {
    acceptInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    addCollaborator: {
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    addDeployKey: {
      method: "POST",
      params: {
        key: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        read_only: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    addProtectedBranchAdminEnforcement: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    addProtectedBranchAppRestrictions: {
      method: "POST",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    addProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    addProtectedBranchRequiredStatusChecksContexts: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    addProtectedBranchTeamRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    addProtectedBranchUserRestrictions: {
      method: "POST",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    checkCollaborator: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    checkVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    compareCommits: {
      method: "GET",
      params: {
        base: {
          required: true,
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/compare/:base...:head"
    },
    createCommitComment: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        commit_sha: {
          required: true,
          type: "string"
        },
        line: {
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          type: "string"
        },
        position: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    createDeployment: {
      method: "POST",
      params: {
        auto_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        payload: {
          type: "string"
        },
        production_environment: {
          type: "boolean"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_contexts: {
          type: "string[]"
        },
        task: {
          type: "string"
        },
        transient_environment: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    createDeploymentStatus: {
      method: "POST",
      params: {
        auto_inactive: {
          type: "boolean"
        },
        deployment_id: {
          required: true,
          type: "integer"
        },
        description: {
          type: "string"
        },
        environment: {
          enum: ["production", "staging", "qa"],
          type: "string"
        },
        environment_url: {
          type: "string"
        },
        log_url: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "inactive", "in_progress", "queued", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    createDispatchEvent: {
      method: "POST",
      params: {
        client_payload: {
          type: "object"
        },
        event_type: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/dispatches"
    },
    createFile: {
      deprecated: "octokit.repos.createFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createForAuthenticatedUser: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    createFork: {
      method: "POST",
      params: {
        organization: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    createHook: {
      method: "POST",
      params: {
        active: {
          type: "boolean"
        },
        config: {
          required: true,
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    createInOrg: {
      method: "POST",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        auto_init: {
          type: "boolean"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        gitignore_template: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        license_template: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          type: "integer"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    createOrUpdateFile: {
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    createRelease: {
      method: "POST",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          required: true,
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    createStatus: {
      method: "POST",
      params: {
        context: {
          type: "string"
        },
        description: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        },
        state: {
          enum: ["error", "failure", "pending", "success"],
          required: true,
          type: "string"
        },
        target_url: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/statuses/:sha"
    },
    createUsingTemplate: {
      headers: {
        accept: "application/vnd.github.baptiste-preview+json"
      },
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        owner: {
          type: "string"
        },
        private: {
          type: "boolean"
        },
        template_owner: {
          required: true,
          type: "string"
        },
        template_repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:template_owner/:template_repo/generate"
    },
    declineInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/repository_invitations/:invitation_id"
    },
    delete: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    deleteCommitComment: {
      method: "DELETE",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    deleteDownload: {
      method: "DELETE",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    deleteFile: {
      method: "DELETE",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          type: "string"
        },
        "author.name": {
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          type: "string"
        },
        "committer.name": {
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    deleteHook: {
      method: "DELETE",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    deleteInvitation: {
      method: "DELETE",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    deleteRelease: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    deleteReleaseAsset: {
      method: "DELETE",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    disableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    disablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    disableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    enableAutomatedSecurityFixes: {
      headers: {
        accept: "application/vnd.github.london-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/automated-security-fixes"
    },
    enablePagesSite: {
      headers: {
        accept: "application/vnd.github.switcheroo-preview+json"
      },
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          type: "object"
        },
        "source.branch": {
          enum: ["master", "gh-pages"],
          type: "string"
        },
        "source.path": {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    enableVulnerabilityAlerts: {
      headers: {
        accept: "application/vnd.github.dorian-preview+json"
      },
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/vulnerability-alerts"
    },
    get: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    getAppsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    getArchiveLink: {
      method: "GET",
      params: {
        archive_format: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/:archive_format/:ref"
    },
    getBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch"
    },
    getBranchProtection: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    getClones: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/clones"
    },
    getCodeFrequencyStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/code_frequency"
    },
    getCollaboratorPermissionLevel: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username/permission"
    },
    getCombinedStatusForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/status"
    },
    getCommit: {
      method: "GET",
      params: {
        commit_sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          alias: "ref",
          deprecated: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getCommitActivityStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/commit_activity"
    },
    getCommitComment: {
      method: "GET",
      params: {
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    getCommitRefSha: {
      deprecated: "octokit.repos.getCommitRefSha() is deprecated, see https://developer.github.com/v3/repos/commits/#get-a-single-commit",
      headers: {
        accept: "application/vnd.github.v3.sha"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref"
    },
    getContents: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    getContributorsStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/contributors"
    },
    getDeployKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    getDeployment: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id"
    },
    getDeploymentStatus: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        status_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses/:status_id"
    },
    getDownload: {
      method: "GET",
      params: {
        download_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads/:download_id"
    },
    getHook: {
      method: "GET",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    getLatestPagesBuild: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/latest"
    },
    getLatestRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/latest"
    },
    getPages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    getPagesBuild: {
      method: "GET",
      params: {
        build_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds/:build_id"
    },
    getParticipationStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/participation"
    },
    getProtectedBranchAdminEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    getProtectedBranchPullRequestReviewEnforcement: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    getProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    getProtectedBranchRequiredStatusChecks: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    getProtectedBranchRestrictions: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    getPunchCardStats: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/stats/punch_card"
    },
    getReadme: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/readme"
    },
    getRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    getReleaseAsset: {
      method: "GET",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    getReleaseByTag: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/tags/:tag"
    },
    getTeamsWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    getTopPaths: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/paths"
    },
    getTopReferrers: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/popular/referrers"
    },
    getUsersWithAccessToProtectedBranch: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    getViews: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        per: {
          enum: ["day", "week"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/traffic/views"
    },
    list: {
      method: "GET",
      params: {
        affiliation: {
          type: "string"
        },
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "public", "private", "member"],
          type: "string"
        },
        visibility: {
          enum: ["all", "public", "private"],
          type: "string"
        }
      },
      url: "/user/repos"
    },
    listAppsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listAppsWithAccessToProtectedBranch() has been renamed to octokit.repos.getAppsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    listAssetsForRelease: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id/assets"
    },
    listBranches: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        protected: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches"
    },
    listBranchesForHeadCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/branches-where-head"
    },
    listCollaborators: {
      method: "GET",
      params: {
        affiliation: {
          enum: ["outside", "direct", "all"],
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators"
    },
    listCommentsForCommit: {
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          alias: "commit_sha",
          deprecated: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/comments"
    },
    listCommitComments: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments"
    },
    listCommits: {
      method: "GET",
      params: {
        author: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        path: {
          type: "string"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        since: {
          type: "string"
        },
        until: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits"
    },
    listContributors: {
      method: "GET",
      params: {
        anon: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contributors"
    },
    listDeployKeys: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys"
    },
    listDeploymentStatuses: {
      method: "GET",
      params: {
        deployment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments/:deployment_id/statuses"
    },
    listDeployments: {
      method: "GET",
      params: {
        environment: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        },
        task: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/deployments"
    },
    listDownloads: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/downloads"
    },
    listForOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "public", "private", "forks", "sources", "member", "internal"],
          type: "string"
        }
      },
      url: "/orgs/:org/repos"
    },
    listForUser: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        sort: {
          enum: ["created", "updated", "pushed", "full_name"],
          type: "string"
        },
        type: {
          enum: ["all", "owner", "member"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/repos"
    },
    listForks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["newest", "oldest", "stargazers"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/forks"
    },
    listHooks: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks"
    },
    listInvitations: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations"
    },
    listInvitationsForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/repository_invitations"
    },
    listLanguages: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/languages"
    },
    listPagesBuilds: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    listProtectedBranchRequiredStatusChecksContexts: {
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    listProtectedBranchTeamRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchTeamRestrictions() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listProtectedBranchUserRestrictions: {
      deprecated: "octokit.repos.listProtectedBranchUserRestrictions() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-09)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    listPublic: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "integer"
        }
      },
      url: "/repositories"
    },
    listPullRequestsAssociatedWithCommit: {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      },
      method: "GET",
      params: {
        commit_sha: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:commit_sha/pulls"
    },
    listReleases: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases"
    },
    listStatusesForRef: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        ref: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/commits/:ref/statuses"
    },
    listTags: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/tags"
    },
    listTeams: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/teams"
    },
    listTeamsWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listTeamsWithAccessToProtectedBranch() has been renamed to octokit.repos.getTeamsWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    listTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    listUsersWithAccessToProtectedBranch: {
      deprecated: "octokit.repos.listUsersWithAccessToProtectedBranch() has been renamed to octokit.repos.getUsersWithAccessToProtectedBranch() (2019-09-13)",
      method: "GET",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    merge: {
      method: "POST",
      params: {
        base: {
          required: true,
          type: "string"
        },
        commit_message: {
          type: "string"
        },
        head: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/merges"
    },
    pingHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/pings"
    },
    removeBranchProtection: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    removeCollaborator: {
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/collaborators/:username"
    },
    removeDeployKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/keys/:key_id"
    },
    removeProtectedBranchAdminEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/enforce_admins"
    },
    removeProtectedBranchAppRestrictions: {
      method: "DELETE",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    removeProtectedBranchPullRequestReviewEnforcement: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    removeProtectedBranchRequiredSignatures: {
      headers: {
        accept: "application/vnd.github.zzzax-preview+json"
      },
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_signatures"
    },
    removeProtectedBranchRequiredStatusChecks: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    removeProtectedBranchRequiredStatusChecksContexts: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    removeProtectedBranchRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions"
    },
    removeProtectedBranchTeamRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    removeProtectedBranchUserRestrictions: {
      method: "DELETE",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceProtectedBranchAppRestrictions: {
      method: "PUT",
      params: {
        apps: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/apps"
    },
    replaceProtectedBranchRequiredStatusChecksContexts: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          mapTo: "data",
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks/contexts"
    },
    replaceProtectedBranchTeamRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        teams: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/teams"
    },
    replaceProtectedBranchUserRestrictions: {
      method: "PUT",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        users: {
          mapTo: "data",
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/restrictions/users"
    },
    replaceTopics: {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"
      },
      method: "PUT",
      params: {
        names: {
          required: true,
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/topics"
    },
    requestPageBuild: {
      method: "POST",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages/builds"
    },
    retrieveCommunityProfileMetrics: {
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/community/profile"
    },
    testPushHook: {
      method: "POST",
      params: {
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id/tests"
    },
    transfer: {
      method: "POST",
      params: {
        new_owner: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_ids: {
          type: "integer[]"
        }
      },
      url: "/repos/:owner/:repo/transfer"
    },
    update: {
      method: "PATCH",
      params: {
        allow_merge_commit: {
          type: "boolean"
        },
        allow_rebase_merge: {
          type: "boolean"
        },
        allow_squash_merge: {
          type: "boolean"
        },
        archived: {
          type: "boolean"
        },
        default_branch: {
          type: "string"
        },
        delete_branch_on_merge: {
          type: "boolean"
        },
        description: {
          type: "string"
        },
        has_issues: {
          type: "boolean"
        },
        has_projects: {
          type: "boolean"
        },
        has_wiki: {
          type: "boolean"
        },
        homepage: {
          type: "string"
        },
        is_template: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        repo: {
          required: true,
          type: "string"
        },
        visibility: {
          enum: ["public", "private", "visibility", "internal"],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo"
    },
    updateBranchProtection: {
      method: "PUT",
      params: {
        allow_deletions: {
          type: "boolean"
        },
        allow_force_pushes: {
          allowNull: true,
          type: "boolean"
        },
        branch: {
          required: true,
          type: "string"
        },
        enforce_admins: {
          allowNull: true,
          required: true,
          type: "boolean"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        required_linear_history: {
          type: "boolean"
        },
        required_pull_request_reviews: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_pull_request_reviews.dismiss_stale_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.dismissal_restrictions": {
          type: "object"
        },
        "required_pull_request_reviews.dismissal_restrictions.teams": {
          type: "string[]"
        },
        "required_pull_request_reviews.dismissal_restrictions.users": {
          type: "string[]"
        },
        "required_pull_request_reviews.require_code_owner_reviews": {
          type: "boolean"
        },
        "required_pull_request_reviews.required_approving_review_count": {
          type: "integer"
        },
        required_status_checks: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "required_status_checks.contexts": {
          required: true,
          type: "string[]"
        },
        "required_status_checks.strict": {
          required: true,
          type: "boolean"
        },
        restrictions: {
          allowNull: true,
          required: true,
          type: "object"
        },
        "restrictions.apps": {
          type: "string[]"
        },
        "restrictions.teams": {
          required: true,
          type: "string[]"
        },
        "restrictions.users": {
          required: true,
          type: "string[]"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection"
    },
    updateCommitComment: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/comments/:comment_id"
    },
    updateFile: {
      deprecated: "octokit.repos.updateFile() has been renamed to octokit.repos.createOrUpdateFile() (2019-06-07)",
      method: "PUT",
      params: {
        author: {
          type: "object"
        },
        "author.email": {
          required: true,
          type: "string"
        },
        "author.name": {
          required: true,
          type: "string"
        },
        branch: {
          type: "string"
        },
        committer: {
          type: "object"
        },
        "committer.email": {
          required: true,
          type: "string"
        },
        "committer.name": {
          required: true,
          type: "string"
        },
        content: {
          required: true,
          type: "string"
        },
        message: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        path: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        sha: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/contents/:path"
    },
    updateHook: {
      method: "PATCH",
      params: {
        active: {
          type: "boolean"
        },
        add_events: {
          type: "string[]"
        },
        config: {
          type: "object"
        },
        "config.content_type": {
          type: "string"
        },
        "config.insecure_ssl": {
          type: "string"
        },
        "config.secret": {
          type: "string"
        },
        "config.url": {
          required: true,
          type: "string"
        },
        events: {
          type: "string[]"
        },
        hook_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        remove_events: {
          type: "string[]"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/hooks/:hook_id"
    },
    updateInformationAboutPagesSite: {
      method: "PUT",
      params: {
        cname: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        source: {
          enum: ['"gh-pages"', '"master"', '"master /docs"'],
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/pages"
    },
    updateInvitation: {
      method: "PATCH",
      params: {
        invitation_id: {
          required: true,
          type: "integer"
        },
        owner: {
          required: true,
          type: "string"
        },
        permissions: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/invitations/:invitation_id"
    },
    updateProtectedBranchPullRequestReviewEnforcement: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        dismiss_stale_reviews: {
          type: "boolean"
        },
        dismissal_restrictions: {
          type: "object"
        },
        "dismissal_restrictions.teams": {
          type: "string[]"
        },
        "dismissal_restrictions.users": {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        require_code_owner_reviews: {
          type: "boolean"
        },
        required_approving_review_count: {
          type: "integer"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_pull_request_reviews"
    },
    updateProtectedBranchRequiredStatusChecks: {
      method: "PATCH",
      params: {
        branch: {
          required: true,
          type: "string"
        },
        contexts: {
          type: "string[]"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        strict: {
          type: "boolean"
        }
      },
      url: "/repos/:owner/:repo/branches/:branch/protection/required_status_checks"
    },
    updateRelease: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        draft: {
          type: "boolean"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        prerelease: {
          type: "boolean"
        },
        release_id: {
          required: true,
          type: "integer"
        },
        repo: {
          required: true,
          type: "string"
        },
        tag_name: {
          type: "string"
        },
        target_commitish: {
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/:release_id"
    },
    updateReleaseAsset: {
      method: "PATCH",
      params: {
        asset_id: {
          required: true,
          type: "integer"
        },
        label: {
          type: "string"
        },
        name: {
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        }
      },
      url: "/repos/:owner/:repo/releases/assets/:asset_id"
    },
    uploadReleaseAsset: {
      method: "POST",
      params: {
        data: {
          mapTo: "data",
          required: true,
          type: "string | object"
        },
        file: {
          alias: "data",
          deprecated: true,
          type: "string | object"
        },
        headers: {
          required: true,
          type: "object"
        },
        "headers.content-length": {
          required: true,
          type: "integer"
        },
        "headers.content-type": {
          required: true,
          type: "string"
        },
        label: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        url: {
          required: true,
          type: "string"
        }
      },
      url: ":url"
    }
  },
  search: {
    code: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["indexed"],
          type: "string"
        }
      },
      url: "/search/code"
    },
    commits: {
      headers: {
        accept: "application/vnd.github.cloak-preview+json"
      },
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["author-date", "committer-date"],
          type: "string"
        }
      },
      url: "/search/commits"
    },
    issues: {
      deprecated: "octokit.search.issues() has been renamed to octokit.search.issuesAndPullRequests() (2018-12-27)",
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    issuesAndPullRequests: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
          type: "string"
        }
      },
      url: "/search/issues"
    },
    labels: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        q: {
          required: true,
          type: "string"
        },
        repository_id: {
          required: true,
          type: "integer"
        },
        sort: {
          enum: ["created", "updated"],
          type: "string"
        }
      },
      url: "/search/labels"
    },
    repos: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["stars", "forks", "help-wanted-issues", "updated"],
          type: "string"
        }
      },
      url: "/search/repositories"
    },
    topics: {
      method: "GET",
      params: {
        q: {
          required: true,
          type: "string"
        }
      },
      url: "/search/topics"
    },
    users: {
      method: "GET",
      params: {
        order: {
          enum: ["desc", "asc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        q: {
          required: true,
          type: "string"
        },
        sort: {
          enum: ["followers", "repositories", "joined"],
          type: "string"
        }
      },
      url: "/search/users"
    }
  },
  teams: {
    addMember: {
      deprecated: "octokit.teams.addMember() has been renamed to octokit.teams.addMemberLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addMemberLegacy: {
      deprecated: "octokit.teams.addMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-team-member-legacy",
      method: "PUT",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    addOrUpdateMembership: {
      deprecated: "octokit.teams.addOrUpdateMembership() has been renamed to octokit.teams.addOrUpdateMembershipLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateMembershipInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    addOrUpdateMembershipLegacy: {
      deprecated: "octokit.teams.addOrUpdateMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#add-or-update-team-membership-legacy",
      method: "PUT",
      params: {
        role: {
          enum: ["member", "maintainer"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    addOrUpdateProject: {
      deprecated: "octokit.teams.addOrUpdateProject() has been renamed to octokit.teams.addOrUpdateProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    addOrUpdateProjectLegacy: {
      deprecated: "octokit.teams.addOrUpdateProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "PUT",
      params: {
        permission: {
          enum: ["read", "write", "admin"],
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    addOrUpdateRepo: {
      deprecated: "octokit.teams.addOrUpdateRepo() has been renamed to octokit.teams.addOrUpdateRepoLegacy() (2020-01-16)",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    addOrUpdateRepoInOrg: {
      method: "PUT",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    addOrUpdateRepoLegacy: {
      deprecated: "octokit.teams.addOrUpdateRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#add-or-update-team-repository-legacy",
      method: "PUT",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepo: {
      deprecated: "octokit.teams.checkManagesRepo() has been renamed to octokit.teams.checkManagesRepoLegacy() (2020-01-16)",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    checkManagesRepoInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    checkManagesRepoLegacy: {
      deprecated: "octokit.teams.checkManagesRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#check-if-a-team-manages-a-repository-legacy",
      method: "GET",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    create: {
      method: "POST",
      params: {
        description: {
          type: "string"
        },
        maintainers: {
          type: "string[]"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        repo_names: {
          type: "string[]"
        }
      },
      url: "/orgs/:org/teams"
    },
    createDiscussion: {
      deprecated: "octokit.teams.createDiscussion() has been renamed to octokit.teams.createDiscussionLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    createDiscussionComment: {
      deprecated: "octokit.teams.createDiscussionComment() has been renamed to octokit.teams.createDiscussionCommentLegacy() (2020-01-16)",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionCommentInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    createDiscussionCommentLegacy: {
      deprecated: "octokit.teams.createDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#create-a-comment-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    createDiscussionInOrg: {
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    createDiscussionLegacy: {
      deprecated: "octokit.teams.createDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#create-a-discussion-legacy",
      method: "POST",
      params: {
        body: {
          required: true,
          type: "string"
        },
        private: {
          type: "boolean"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    delete: {
      deprecated: "octokit.teams.delete() has been renamed to octokit.teams.deleteLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    deleteDiscussion: {
      deprecated: "octokit.teams.deleteDiscussion() has been renamed to octokit.teams.deleteDiscussionLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteDiscussionComment: {
      deprecated: "octokit.teams.deleteDiscussionComment() has been renamed to octokit.teams.deleteDiscussionCommentLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentInOrg: {
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionCommentLegacy: {
      deprecated: "octokit.teams.deleteDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#delete-a-comment-legacy",
      method: "DELETE",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    deleteDiscussionInOrg: {
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    deleteDiscussionLegacy: {
      deprecated: "octokit.teams.deleteDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#delete-a-discussion-legacy",
      method: "DELETE",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    deleteInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    deleteLegacy: {
      deprecated: "octokit.teams.deleteLegacy() is deprecated, see https://developer.github.com/v3/teams/#delete-team-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    get: {
      deprecated: "octokit.teams.get() has been renamed to octokit.teams.getLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getByName: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    getDiscussion: {
      deprecated: "octokit.teams.getDiscussion() has been renamed to octokit.teams.getDiscussionLegacy() (2020-01-16)",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getDiscussionComment: {
      deprecated: "octokit.teams.getDiscussionComment() has been renamed to octokit.teams.getDiscussionCommentLegacy() (2020-01-16)",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentInOrg: {
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionCommentLegacy: {
      deprecated: "octokit.teams.getDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#get-a-single-comment-legacy",
      method: "GET",
      params: {
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    getDiscussionInOrg: {
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    getDiscussionLegacy: {
      deprecated: "octokit.teams.getDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#get-a-single-discussion-legacy",
      method: "GET",
      params: {
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    getLegacy: {
      deprecated: "octokit.teams.getLegacy() is deprecated, see https://developer.github.com/v3/teams/#get-team-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    getMember: {
      deprecated: "octokit.teams.getMember() has been renamed to octokit.teams.getMemberLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMemberLegacy: {
      deprecated: "octokit.teams.getMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-member-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    getMembership: {
      deprecated: "octokit.teams.getMembership() has been renamed to octokit.teams.getMembershipLegacy() (2020-01-16)",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    getMembershipInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    getMembershipLegacy: {
      deprecated: "octokit.teams.getMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#get-team-membership-legacy",
      method: "GET",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    list: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/orgs/:org/teams"
    },
    listChild: {
      deprecated: "octokit.teams.listChild() has been renamed to octokit.teams.listChildLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listChildInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/teams"
    },
    listChildLegacy: {
      deprecated: "octokit.teams.listChildLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-child-teams-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/teams"
    },
    listDiscussionComments: {
      deprecated: "octokit.teams.listDiscussionComments() has been renamed to octokit.teams.listDiscussionCommentsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments"
    },
    listDiscussionCommentsLegacy: {
      deprecated: "octokit.teams.listDiscussionCommentsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#list-comments-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments"
    },
    listDiscussions: {
      deprecated: "octokit.teams.listDiscussions() has been renamed to octokit.teams.listDiscussionsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listDiscussionsInOrg: {
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions"
    },
    listDiscussionsLegacy: {
      deprecated: "octokit.teams.listDiscussionsLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#list-discussions-legacy",
      method: "GET",
      params: {
        direction: {
          enum: ["asc", "desc"],
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions"
    },
    listForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/teams"
    },
    listMembers: {
      deprecated: "octokit.teams.listMembers() has been renamed to octokit.teams.listMembersLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listMembersInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/members"
    },
    listMembersLegacy: {
      deprecated: "octokit.teams.listMembersLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-team-members-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        role: {
          enum: ["member", "maintainer", "all"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/members"
    },
    listPendingInvitations: {
      deprecated: "octokit.teams.listPendingInvitations() has been renamed to octokit.teams.listPendingInvitationsLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listPendingInvitationsInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/invitations"
    },
    listPendingInvitationsLegacy: {
      deprecated: "octokit.teams.listPendingInvitationsLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#list-pending-team-invitations-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/invitations"
    },
    listProjects: {
      deprecated: "octokit.teams.listProjects() has been renamed to octokit.teams.listProjectsLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listProjectsInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects"
    },
    listProjectsLegacy: {
      deprecated: "octokit.teams.listProjectsLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-projects-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects"
    },
    listRepos: {
      deprecated: "octokit.teams.listRepos() has been renamed to octokit.teams.listReposLegacy() (2020-01-16)",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    listReposInOrg: {
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos"
    },
    listReposLegacy: {
      deprecated: "octokit.teams.listReposLegacy() is deprecated, see https://developer.github.com/v3/teams/#list-team-repos-legacy",
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos"
    },
    removeMember: {
      deprecated: "octokit.teams.removeMember() has been renamed to octokit.teams.removeMemberLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMemberLegacy: {
      deprecated: "octokit.teams.removeMemberLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-member-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/members/:username"
    },
    removeMembership: {
      deprecated: "octokit.teams.removeMembership() has been renamed to octokit.teams.removeMembershipLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeMembershipInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/memberships/:username"
    },
    removeMembershipLegacy: {
      deprecated: "octokit.teams.removeMembershipLegacy() is deprecated, see https://developer.github.com/v3/teams/members/#remove-team-membership-legacy",
      method: "DELETE",
      params: {
        team_id: {
          required: true,
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/teams/:team_id/memberships/:username"
    },
    removeProject: {
      deprecated: "octokit.teams.removeProject() has been renamed to octokit.teams.removeProjectLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeProjectInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    removeProjectLegacy: {
      deprecated: "octokit.teams.removeProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-project-legacy",
      method: "DELETE",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    removeRepo: {
      deprecated: "octokit.teams.removeRepo() has been renamed to octokit.teams.removeRepoLegacy() (2020-01-16)",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    removeRepoInOrg: {
      method: "DELETE",
      params: {
        org: {
          required: true,
          type: "string"
        },
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/repos/:owner/:repo"
    },
    removeRepoLegacy: {
      deprecated: "octokit.teams.removeRepoLegacy() is deprecated, see https://developer.github.com/v3/teams/#remove-team-repository-legacy",
      method: "DELETE",
      params: {
        owner: {
          required: true,
          type: "string"
        },
        repo: {
          required: true,
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/repos/:owner/:repo"
    },
    reviewProject: {
      deprecated: "octokit.teams.reviewProject() has been renamed to octokit.teams.reviewProjectLegacy() (2020-01-16)",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    reviewProjectInOrg: {
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        org: {
          required: true,
          type: "string"
        },
        project_id: {
          required: true,
          type: "integer"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/projects/:project_id"
    },
    reviewProjectLegacy: {
      deprecated: "octokit.teams.reviewProjectLegacy() is deprecated, see https://developer.github.com/v3/teams/#review-a-team-project-legacy",
      headers: {
        accept: "application/vnd.github.inertia-preview+json"
      },
      method: "GET",
      params: {
        project_id: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/projects/:project_id"
    },
    update: {
      deprecated: "octokit.teams.update() has been renamed to octokit.teams.updateLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    },
    updateDiscussion: {
      deprecated: "octokit.teams.updateDiscussion() has been renamed to octokit.teams.updateDiscussionLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateDiscussionComment: {
      deprecated: "octokit.teams.updateDiscussionComment() has been renamed to octokit.teams.updateDiscussionCommentLegacy() (2020-01-16)",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentInOrg: {
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionCommentLegacy: {
      deprecated: "octokit.teams.updateDiscussionCommentLegacy() is deprecated, see https://developer.github.com/v3/teams/discussion_comments/#edit-a-comment-legacy",
      method: "PATCH",
      params: {
        body: {
          required: true,
          type: "string"
        },
        comment_number: {
          required: true,
          type: "integer"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number/comments/:comment_number"
    },
    updateDiscussionInOrg: {
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        org: {
          required: true,
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug/discussions/:discussion_number"
    },
    updateDiscussionLegacy: {
      deprecated: "octokit.teams.updateDiscussionLegacy() is deprecated, see https://developer.github.com/v3/teams/discussions/#edit-a-discussion-legacy",
      method: "PATCH",
      params: {
        body: {
          type: "string"
        },
        discussion_number: {
          required: true,
          type: "integer"
        },
        team_id: {
          required: true,
          type: "integer"
        },
        title: {
          type: "string"
        }
      },
      url: "/teams/:team_id/discussions/:discussion_number"
    },
    updateInOrg: {
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        org: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_slug: {
          required: true,
          type: "string"
        }
      },
      url: "/orgs/:org/teams/:team_slug"
    },
    updateLegacy: {
      deprecated: "octokit.teams.updateLegacy() is deprecated, see https://developer.github.com/v3/teams/#edit-team-legacy",
      method: "PATCH",
      params: {
        description: {
          type: "string"
        },
        name: {
          required: true,
          type: "string"
        },
        parent_team_id: {
          type: "integer"
        },
        permission: {
          enum: ["pull", "push", "admin"],
          type: "string"
        },
        privacy: {
          enum: ["secret", "closed"],
          type: "string"
        },
        team_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/teams/:team_id"
    }
  },
  users: {
    addEmails: {
      method: "POST",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    block: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkBlocked: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    checkFollowing: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    checkFollowingForUser: {
      method: "GET",
      params: {
        target_user: {
          required: true,
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following/:target_user"
    },
    createGpgKey: {
      method: "POST",
      params: {
        armored_public_key: {
          type: "string"
        }
      },
      url: "/user/gpg_keys"
    },
    createPublicKey: {
      method: "POST",
      params: {
        key: {
          type: "string"
        },
        title: {
          type: "string"
        }
      },
      url: "/user/keys"
    },
    deleteEmails: {
      method: "DELETE",
      params: {
        emails: {
          required: true,
          type: "string[]"
        }
      },
      url: "/user/emails"
    },
    deleteGpgKey: {
      method: "DELETE",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    deletePublicKey: {
      method: "DELETE",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    follow: {
      method: "PUT",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    getAuthenticated: {
      method: "GET",
      params: {},
      url: "/user"
    },
    getByUsername: {
      method: "GET",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username"
    },
    getContextForUser: {
      method: "GET",
      params: {
        subject_id: {
          type: "string"
        },
        subject_type: {
          enum: ["organization", "repository", "issue", "pull_request"],
          type: "string"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/hovercard"
    },
    getGpgKey: {
      method: "GET",
      params: {
        gpg_key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/gpg_keys/:gpg_key_id"
    },
    getPublicKey: {
      method: "GET",
      params: {
        key_id: {
          required: true,
          type: "integer"
        }
      },
      url: "/user/keys/:key_id"
    },
    list: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        since: {
          type: "string"
        }
      },
      url: "/users"
    },
    listBlocked: {
      method: "GET",
      params: {},
      url: "/user/blocks"
    },
    listEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/emails"
    },
    listFollowersForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/followers"
    },
    listFollowersForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/followers"
    },
    listFollowingForAuthenticatedUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/following"
    },
    listFollowingForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/following"
    },
    listGpgKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/gpg_keys"
    },
    listGpgKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/gpg_keys"
    },
    listPublicEmails: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/public_emails"
    },
    listPublicKeys: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        }
      },
      url: "/user/keys"
    },
    listPublicKeysForUser: {
      method: "GET",
      params: {
        page: {
          type: "integer"
        },
        per_page: {
          type: "integer"
        },
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/users/:username/keys"
    },
    togglePrimaryEmailVisibility: {
      method: "PATCH",
      params: {
        email: {
          required: true,
          type: "string"
        },
        visibility: {
          required: true,
          type: "string"
        }
      },
      url: "/user/email/visibility"
    },
    unblock: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/blocks/:username"
    },
    unfollow: {
      method: "DELETE",
      params: {
        username: {
          required: true,
          type: "string"
        }
      },
      url: "/user/following/:username"
    },
    updateAuthenticated: {
      method: "PATCH",
      params: {
        bio: {
          type: "string"
        },
        blog: {
          type: "string"
        },
        company: {
          type: "string"
        },
        email: {
          type: "string"
        },
        hireable: {
          type: "boolean"
        },
        location: {
          type: "string"
        },
        name: {
          type: "string"
        }
      },
      url: "/user"
    }
  }
};

const VERSION = "2.4.0";

function registerEndpoints(octokit, routes) {
  Object.keys(routes).forEach(namespaceName => {
    if (!octokit[namespaceName]) {
      octokit[namespaceName] = {};
    }

    Object.keys(routes[namespaceName]).forEach(apiName => {
      const apiOptions = routes[namespaceName][apiName];
      const endpointDefaults = ["method", "url", "headers"].reduce((map, key) => {
        if (typeof apiOptions[key] !== "undefined") {
          map[key] = apiOptions[key];
        }

        return map;
      }, {});
      endpointDefaults.request = {
        validate: apiOptions.params
      };
      let request = octokit.request.defaults(endpointDefaults); // patch request & endpoint methods to support deprecated parameters.
      // Not the most elegant solution, but we don’t want to move deprecation
      // logic into octokit/endpoint.js as it’s out of scope

      const hasDeprecatedParam = Object.keys(apiOptions.params || {}).find(key => apiOptions.params[key].deprecated);

      if (hasDeprecatedParam) {
        const patch = patchForDeprecation.bind(null, octokit, apiOptions);
        request = patch(octokit.request.defaults(endpointDefaults), `.${namespaceName}.${apiName}()`);
        request.endpoint = patch(request.endpoint, `.${namespaceName}.${apiName}.endpoint()`);
        request.endpoint.merge = patch(request.endpoint.merge, `.${namespaceName}.${apiName}.endpoint.merge()`);
      }

      if (apiOptions.deprecated) {
        octokit[namespaceName][apiName] = Object.assign(function deprecatedEndpointMethod() {
          octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] ${apiOptions.deprecated}`));
          octokit[namespaceName][apiName] = request;
          return request.apply(null, arguments);
        }, request);
        return;
      }

      octokit[namespaceName][apiName] = request;
    });
  });
}

function patchForDeprecation(octokit, apiOptions, method, methodName) {
  const patchedMethod = options => {
    options = Object.assign({}, options);
    Object.keys(options).forEach(key => {
      if (apiOptions.params[key] && apiOptions.params[key].deprecated) {
        const aliasKey = apiOptions.params[key].alias;
        octokit.log.warn(new deprecation.Deprecation(`[@octokit/rest] "${key}" parameter is deprecated for "${methodName}". Use "${aliasKey}" instead`));

        if (!(aliasKey in options)) {
          options[aliasKey] = options[key];
        }

        delete options[key];
      }
    });
    return method(options);
  };

  Object.keys(method).forEach(key => {
    patchedMethod[key] = method[key];
  });
  return patchedMethod;
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  // @ts-ignore
  octokit.registerEndpoints = registerEndpoints.bind(null, octokit);
  registerEndpoints(octokit, endpointsByScope); // Aliasing scopes for backward compatibility
  // See https://github.com/octokit/rest.js/pull/1134

  [["gitdata", "git"], ["authorization", "oauthAuthorizations"], ["pullRequests", "pulls"]].forEach(([deprecatedScope, scope]) => {
    Object.defineProperty(octokit, deprecatedScope, {
      get() {
        octokit.log.warn( // @ts-ignore
        new deprecation.Deprecation(`[@octokit/plugin-rest-endpoint-methods] "octokit.${deprecatedScope}.*" methods are deprecated, use "octokit.${scope}.*" instead`)); // @ts-ignore

        return octokit[scope];
      }

    });
  });
  return {};
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 850:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = paginationMethodsPlugin

function paginationMethodsPlugin (octokit) {
  octokit.getFirstPage = __webpack_require__(777).bind(null, octokit)
  octokit.getLastPage = __webpack_require__(649).bind(null, octokit)
  octokit.getNextPage = __webpack_require__(550).bind(null, octokit)
  octokit.getPreviousPage = __webpack_require__(563).bind(null, octokit)
  octokit.hasFirstPage = __webpack_require__(536)
  octokit.hasLastPage = __webpack_require__(336)
  octokit.hasNextPage = __webpack_require__(929)
  octokit.hasPreviousPage = __webpack_require__(558)
}


/***/ }),

/***/ 854:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),

/***/ 855:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = registerPlugin;

const factory = __webpack_require__(47);

function registerPlugin(plugins, pluginFunction) {
  return factory(
    plugins.includes(pluginFunction) ? plugins : plugins.concat(pluginFunction)
  );
}


/***/ }),

/***/ 856:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(141);


/***/ }),

/***/ 857:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(422);
var no_case_1 = __webpack_require__(555);
function pascalCaseTransform(input, index) {
    var firstChar = input.charAt(0);
    var lowerChars = input.substr(1).toLowerCase();
    if (index > 0 && firstChar >= "0" && firstChar <= "9") {
        return "_" + firstChar + lowerChars;
    }
    return "" + firstChar.toUpperCase() + lowerChars;
}
exports.pascalCaseTransform = pascalCaseTransform;
function pascalCaseTransformMerge(input) {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}
exports.pascalCaseTransformMerge = pascalCaseTransformMerge;
function pascalCase(input, options) {
    if (options === void 0) { options = {}; }
    return no_case_1.noCase(input, tslib_1.__assign({ delimiter: "", transform: pascalCaseTransform }, options));
}
exports.pascalCase = pascalCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 863:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = authenticationBeforeRequest;

const btoa = __webpack_require__(675);

const withAuthorizationPrefix = __webpack_require__(143);

function authenticationBeforeRequest(state, options) {
  if (typeof state.auth === "string") {
    options.headers.authorization = withAuthorizationPrefix(state.auth);
    return;
  }

  if (state.auth.username) {
    const hash = btoa(`${state.auth.username}:${state.auth.password}`);
    options.headers.authorization = `Basic ${hash}`;
    if (state.otp) {
      options.headers["x-github-otp"] = state.otp;
    }
    return;
  }

  if (state.auth.clientId) {
    // There is a special case for OAuth applications, when `clientId` and `clientSecret` is passed as
    // Basic Authorization instead of query parameters. The only routes where that applies share the same
    // URL though: `/applications/:client_id/tokens/:access_token`.
    //
    //  1. [Check an authorization](https://developer.github.com/v3/oauth_authorizations/#check-an-authorization)
    //  2. [Reset an authorization](https://developer.github.com/v3/oauth_authorizations/#reset-an-authorization)
    //  3. [Revoke an authorization for an application](https://developer.github.com/v3/oauth_authorizations/#revoke-an-authorization-for-an-application)
    //
    // We identify by checking the URL. It must merge both "/applications/:client_id/tokens/:access_token"
    // as well as "/applications/123/tokens/token456"
    if (/\/applications\/:?[\w_]+\/tokens\/:?[\w_]+($|\?)/.test(options.url)) {
      const hash = btoa(`${state.auth.clientId}:${state.auth.clientSecret}`);
      options.headers.authorization = `Basic ${hash}`;
      return;
    }

    options.url += options.url.indexOf("?") === -1 ? "?" : "&";
    options.url += `client_id=${state.auth.clientId}&client_secret=${state.auth.clientSecret}`;
    return;
  }

  return Promise.resolve()

    .then(() => {
      return state.auth();
    })

    .then(authorization => {
      options.headers.authorization = withAuthorizationPrefix(authorization);
    });
}


/***/ }),

/***/ 866:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

var shebangRegex = __webpack_require__(816);

module.exports = function (str) {
	var match = str.match(shebangRegex);

	if (!match) {
		return null;
	}

	var arr = match[0].replace(/#! ?/, '').split(' ');
	var bin = arr[0].split('/').pop();
	var arg = arr[1];

	return (bin === 'env' ?
		arg :
		bin + (arg ? ' ' + arg : '')
	);
};


/***/ }),

/***/ 881:
/***/ (function(module) {

"use strict";


const isWin = process.platform === 'win32';

function notFoundError(original, syscall) {
    return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
        code: 'ENOENT',
        errno: 'ENOENT',
        syscall: `${syscall} ${original.command}`,
        path: original.command,
        spawnargs: original.args,
    });
}

function hookChildProcess(cp, parsed) {
    if (!isWin) {
        return;
    }

    const originalEmit = cp.emit;

    cp.emit = function (name, arg1) {
        // If emitting "exit" event and exit code is 1, we need to check if
        // the command exists and emit an "error" instead
        // See https://github.com/IndigoUnited/node-cross-spawn/issues/16
        if (name === 'exit') {
            const err = verifyENOENT(arg1, parsed, 'spawn');

            if (err) {
                return originalEmit.call(cp, 'error', err);
            }
        }

        return originalEmit.apply(cp, arguments); // eslint-disable-line prefer-rest-params
    };
}

function verifyENOENT(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawn');
    }

    return null;
}

function verifyENOENTSync(status, parsed) {
    if (isWin && status === 1 && !parsed.file) {
        return notFoundError(parsed.original, 'spawnSync');
    }

    return null;
}

module.exports = {
    hookChildProcess,
    verifyENOENT,
    verifyENOENTSync,
    notFoundError,
};


/***/ }),

/***/ 883:
/***/ (function(module) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(753);
var universalUserAgent = __webpack_require__(796);

const VERSION = "4.3.1";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      throw new GraphqlError(requestOptions, {
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 916:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "1.0.0";

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function requestLog(octokit) {
  octokit.hook.wrap("request", (request, options) => {
    octokit.log.debug("request", options);
    const start = Date.now();
    const requestOptions = octokit.request.endpoint.parse(options);
    const path = requestOptions.url.replace(options.baseUrl, "");
    return request(options).then(response => {
      octokit.log.info(`${requestOptions.method} ${path} - ${response.status} in ${Date.now() - start}ms`);
      return response;
    }).catch(error => {
      octokit.log.info(`${requestOptions.method} ${path} - ${error.status} in ${Date.now() - start}ms`);
      throw error;
    });
  });
}
requestLog.VERSION = VERSION;

exports.requestLog = requestLog;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 929:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = hasNextPage

const deprecate = __webpack_require__(370)
const getPageLinks = __webpack_require__(577)

function hasNextPage (link) {
  deprecate(`octokit.hasNextPage() – You can use octokit.paginate or async iterators instead: https://github.com/octokit/rest.js#pagination.`)
  return getPageLinks(link).next
}


/***/ }),

/***/ 942:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = __webpack_require__(129);
const readline_1 = __webpack_require__(58);
const fs_1 = __webpack_require__(747);
const core = __importStar(__webpack_require__(470));
const github = __importStar(__webpack_require__(469));
const picomatch_1 = __importDefault(__webpack_require__(827));
async function getChangedFiles() {
    const pattern = core.getInput('files', {
        required: false,
    });
    const globs = pattern.length ? pattern.split(',') : ['**.php'];
    const isMatch = picomatch_1.default(globs);
    console.log('Filter patterns:', globs, isMatch('src/test.php'));
    const payload = github.context.payload;
    /*
      getting them from Git
      git diff-tree --no-commit-id --name-status --diff-filter=d -r ${{ github.event.pull_request.base.sha }}..${{ github.event.after }}
    */
    try {
        const git = child_process_1.spawn('git', [
            '--no-pager',
            'diff-tree',
            '--no-commit-id',
            '--name-status',
            '--diff-filter=d',
            '-r',
            `${payload.pull_request.base.sha}..`,
        ], {
            windowsHide: true,
            timeout: 5000,
        });
        const readline = readline_1.createInterface({
            input: git.stdout,
        });
        const result = {
            added: [],
            modified: [],
        };
        for await (const line of readline) {
            const parsed = /^(?<status>[ACMR])[\s\t]+(?<file>\S+)$/.exec(line);
            if (parsed === null || parsed === void 0 ? void 0 : parsed.groups) {
                const { status, file } = parsed.groups;
                // ensure file exists
                if (isMatch(file) && fs_1.existsSync(file)) {
                    switch (status) {
                        case 'A':
                        case 'C':
                        case 'R':
                            result.added.push(file);
                            break;
                        case 'M':
                            result.modified.push(file);
                    }
                }
            }
        }
        return result;
    }
    catch (err) {
        console.error(err);
        return {
            added: [],
            modified: [],
        };
    }
}
exports.getChangedFiles = getChangedFiles;


/***/ }),

/***/ 947:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(422);
var pascal_case_1 = __webpack_require__(857);
function camelCaseTransform(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascal_case_1.pascalCaseTransform(input, index);
}
exports.camelCaseTransform = camelCaseTransform;
function camelCaseTransformMerge(input, index) {
    if (index === 0)
        return input.toLowerCase();
    return pascal_case_1.pascalCaseTransformMerge(input);
}
exports.camelCaseTransformMerge = camelCaseTransformMerge;
function camelCase(input, options) {
    if (options === void 0) { options = {}; }
    return pascal_case_1.pascalCase(input, tslib_1.__assign({ transform: camelCaseTransform }, options));
}
exports.camelCase = camelCase;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 948:
/***/ (function(module) {

"use strict";


/**
 * Tries to execute a function and discards any error that occurs.
 * @param {Function} fn - Function that might or might not throw an error.
 * @returns {?*} Return-value of the function when no error occurred.
 */
module.exports = function(fn) {

	try { return fn() } catch (e) {}

}

/***/ }),

/***/ 950:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 954:
/***/ (function(module) {

module.exports = validateAuth;

function validateAuth(auth) {
  if (typeof auth === "string") {
    return;
  }

  if (typeof auth === "function") {
    return;
  }

  if (auth.username && auth.password) {
    return;
  }

  if (auth.clientId && auth.clientSecret) {
    return;
  }

  throw new Error(`Invalid "auth" option: ${JSON.stringify(auth)}`);
}


/***/ }),

/***/ 955:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const path = __webpack_require__(622);
const childProcess = __webpack_require__(129);
const crossSpawn = __webpack_require__(20);
const stripEof = __webpack_require__(768);
const npmRunPath = __webpack_require__(621);
const isStream = __webpack_require__(323);
const _getStream = __webpack_require__(145);
const pFinally = __webpack_require__(697);
const onExit = __webpack_require__(260);
const errname = __webpack_require__(427);
const stdio = __webpack_require__(168);

const TEN_MEGABYTES = 1000 * 1000 * 10;

function handleArgs(cmd, args, opts) {
	let parsed;

	opts = Object.assign({
		extendEnv: true,
		env: {}
	}, opts);

	if (opts.extendEnv) {
		opts.env = Object.assign({}, process.env, opts.env);
	}

	if (opts.__winShell === true) {
		delete opts.__winShell;
		parsed = {
			command: cmd,
			args,
			options: opts,
			file: cmd,
			original: {
				cmd,
				args
			}
		};
	} else {
		parsed = crossSpawn._parse(cmd, args, opts);
	}

	opts = Object.assign({
		maxBuffer: TEN_MEGABYTES,
		buffer: true,
		stripEof: true,
		preferLocal: true,
		localDir: parsed.options.cwd || process.cwd(),
		encoding: 'utf8',
		reject: true,
		cleanup: true
	}, parsed.options);

	opts.stdio = stdio(opts);

	if (opts.preferLocal) {
		opts.env = npmRunPath.env(Object.assign({}, opts, {cwd: opts.localDir}));
	}

	if (opts.detached) {
		// #115
		opts.cleanup = false;
	}

	if (process.platform === 'win32' && path.basename(parsed.command) === 'cmd.exe') {
		// #116
		parsed.args.unshift('/q');
	}

	return {
		cmd: parsed.command,
		args: parsed.args,
		opts,
		parsed
	};
}

function handleInput(spawned, input) {
	if (input === null || input === undefined) {
		return;
	}

	if (isStream(input)) {
		input.pipe(spawned.stdin);
	} else {
		spawned.stdin.end(input);
	}
}

function handleOutput(opts, val) {
	if (val && opts.stripEof) {
		val = stripEof(val);
	}

	return val;
}

function handleShell(fn, cmd, opts) {
	let file = '/bin/sh';
	let args = ['-c', cmd];

	opts = Object.assign({}, opts);

	if (process.platform === 'win32') {
		opts.__winShell = true;
		file = process.env.comspec || 'cmd.exe';
		args = ['/s', '/c', `"${cmd}"`];
		opts.windowsVerbatimArguments = true;
	}

	if (opts.shell) {
		file = opts.shell;
		delete opts.shell;
	}

	return fn(file, args, opts);
}

function getStream(process, stream, {encoding, buffer, maxBuffer}) {
	if (!process[stream]) {
		return null;
	}

	let ret;

	if (!buffer) {
		// TODO: Use `ret = util.promisify(stream.finished)(process[stream]);` when targeting Node.js 10
		ret = new Promise((resolve, reject) => {
			process[stream]
				.once('end', resolve)
				.once('error', reject);
		});
	} else if (encoding) {
		ret = _getStream(process[stream], {
			encoding,
			maxBuffer
		});
	} else {
		ret = _getStream.buffer(process[stream], {maxBuffer});
	}

	return ret.catch(err => {
		err.stream = stream;
		err.message = `${stream} ${err.message}`;
		throw err;
	});
}

function makeError(result, options) {
	const {stdout, stderr} = result;

	let err = result.error;
	const {code, signal} = result;

	const {parsed, joinedCmd} = options;
	const timedOut = options.timedOut || false;

	if (!err) {
		let output = '';

		if (Array.isArray(parsed.opts.stdio)) {
			if (parsed.opts.stdio[2] !== 'inherit') {
				output += output.length > 0 ? stderr : `\n${stderr}`;
			}

			if (parsed.opts.stdio[1] !== 'inherit') {
				output += `\n${stdout}`;
			}
		} else if (parsed.opts.stdio !== 'inherit') {
			output = `\n${stderr}${stdout}`;
		}

		err = new Error(`Command failed: ${joinedCmd}${output}`);
		err.code = code < 0 ? errname(code) : code;
	}

	err.stdout = stdout;
	err.stderr = stderr;
	err.failed = true;
	err.signal = signal || null;
	err.cmd = joinedCmd;
	err.timedOut = timedOut;

	return err;
}

function joinCmd(cmd, args) {
	let joinedCmd = cmd;

	if (Array.isArray(args) && args.length > 0) {
		joinedCmd += ' ' + args.join(' ');
	}

	return joinedCmd;
}

module.exports = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const {encoding, buffer, maxBuffer} = parsed.opts;
	const joinedCmd = joinCmd(cmd, args);

	let spawned;
	try {
		spawned = childProcess.spawn(parsed.cmd, parsed.args, parsed.opts);
	} catch (err) {
		return Promise.reject(err);
	}

	let removeExitHandler;
	if (parsed.opts.cleanup) {
		removeExitHandler = onExit(() => {
			spawned.kill();
		});
	}

	let timeoutId = null;
	let timedOut = false;

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}

		if (removeExitHandler) {
			removeExitHandler();
		}
	};

	if (parsed.opts.timeout > 0) {
		timeoutId = setTimeout(() => {
			timeoutId = null;
			timedOut = true;
			spawned.kill(parsed.opts.killSignal);
		}, parsed.opts.timeout);
	}

	const processDone = new Promise(resolve => {
		spawned.on('exit', (code, signal) => {
			cleanup();
			resolve({code, signal});
		});

		spawned.on('error', err => {
			cleanup();
			resolve({error: err});
		});

		if (spawned.stdin) {
			spawned.stdin.on('error', err => {
				cleanup();
				resolve({error: err});
			});
		}
	});

	function destroy() {
		if (spawned.stdout) {
			spawned.stdout.destroy();
		}

		if (spawned.stderr) {
			spawned.stderr.destroy();
		}
	}

	const handlePromise = () => pFinally(Promise.all([
		processDone,
		getStream(spawned, 'stdout', {encoding, buffer, maxBuffer}),
		getStream(spawned, 'stderr', {encoding, buffer, maxBuffer})
	]).then(arr => {
		const result = arr[0];
		result.stdout = arr[1];
		result.stderr = arr[2];

		if (result.error || result.code !== 0 || result.signal !== null) {
			const err = makeError(result, {
				joinedCmd,
				parsed,
				timedOut
			});

			// TODO: missing some timeout logic for killed
			// https://github.com/nodejs/node/blob/master/lib/child_process.js#L203
			// err.killed = spawned.killed || killed;
			err.killed = err.killed || spawned.killed;

			if (!parsed.opts.reject) {
				return err;
			}

			throw err;
		}

		return {
			stdout: handleOutput(parsed.opts, result.stdout),
			stderr: handleOutput(parsed.opts, result.stderr),
			code: 0,
			failed: false,
			killed: false,
			signal: null,
			cmd: joinedCmd,
			timedOut: false
		};
	}), destroy);

	crossSpawn._enoent.hookChildProcess(spawned, parsed.parsed);

	handleInput(spawned, parsed.opts.input);

	spawned.then = (onfulfilled, onrejected) => handlePromise().then(onfulfilled, onrejected);
	spawned.catch = onrejected => handlePromise().catch(onrejected);

	return spawned;
};

// TODO: set `stderr: 'ignore'` when that option is implemented
module.exports.stdout = (...args) => module.exports(...args).then(x => x.stdout);

// TODO: set `stdout: 'ignore'` when that option is implemented
module.exports.stderr = (...args) => module.exports(...args).then(x => x.stderr);

module.exports.shell = (cmd, opts) => handleShell(module.exports, cmd, opts);

module.exports.sync = (cmd, args, opts) => {
	const parsed = handleArgs(cmd, args, opts);
	const joinedCmd = joinCmd(cmd, args);

	if (isStream(parsed.opts.input)) {
		throw new TypeError('The `input` option cannot be a stream in sync mode');
	}

	const result = childProcess.spawnSync(parsed.cmd, parsed.args, parsed.opts);
	result.code = result.status;

	if (result.error || result.status !== 0 || result.signal !== null) {
		const err = makeError(result, {
			joinedCmd,
			parsed
		});

		if (!parsed.opts.reject) {
			return err;
		}

		throw err;
	}

	return {
		stdout: handleOutput(parsed.opts, result.stdout),
		stderr: handleOutput(parsed.opts, result.stderr),
		code: 0,
		failed: false,
		signal: null,
		cmd: joinedCmd,
		timedOut: false
	};
};

module.exports.shellSync = (cmd, opts) => handleShell(module.exports.sync, cmd, opts);


/***/ }),

/***/ 966:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough} = __webpack_require__(413);

module.exports = options => {
	options = Object.assign({}, options);

	const {array} = options;
	let {encoding} = options;
	const buffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || buffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (buffer) {
		encoding = null;
	}

	let len = 0;
	const ret = [];
	const stream = new PassThrough({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	stream.on('data', chunk => {
		ret.push(chunk);

		if (objectMode) {
			len = ret.length;
		} else {
			len += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return ret;
		}

		return buffer ? Buffer.concat(ret, len) : ret.join('');
	};

	stream.getBufferedLength = () => len;

	return stream;
};


/***/ }),

/***/ 969:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ })

/******/ });
