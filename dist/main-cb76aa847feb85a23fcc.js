webpackJsonp([0,2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(32);
	var mobx_1 = __webpack_require__(179);
	var mobx_react_1 = __webpack_require__(180);
	var mobx_react_devtools_1 = __webpack_require__(181);
	__webpack_require__(182);
	var $ = __webpack_require__(186);
	__webpack_require__(187);
	__webpack_require__(300);
	__webpack_require__(301);
	var moment = __webpack_require__(188);
	var image_form_1 = __webpack_require__(303);
	var Model = (function () {
	    function Model() {
	        this.staticEventSource = new StaticEventSource();
	    }
	    return Model;
	}());
	var StaticEvent = (function () {
	    function StaticEvent() {
	    }
	    Object.defineProperty(StaticEvent.prototype, "start", {
	        get: function () { return ImmutableMoment.to(this._start); },
	        set: function (val) { this._start = ImmutableMoment.from(val); },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(StaticEvent.prototype, "end", {
	        get: function () { return ImmutableMoment.to(this._end); },
	        set: function (val) { this._end = ImmutableMoment.from(val); },
	        enumerable: true,
	        configurable: true
	    });
	    return StaticEvent;
	}());
	__decorate([
	    mobx_1.observable
	], StaticEvent.prototype, "title", void 0);
	__decorate([
	    mobx_1.observable
	], StaticEvent.prototype, "_start", void 0);
	__decorate([
	    mobx_1.observable
	], StaticEvent.prototype, "_end", void 0);
	var StaticEventSource = (function () {
	    function StaticEventSource() {
	        this.events = [];
	    }
	    return StaticEventSource;
	}());
	__decorate([
	    mobx_1.observable
	], StaticEventSource.prototype, "events", void 0);
	var ImmutableMoment;
	(function (ImmutableMoment) {
	    function from(m) {
	        return m.toJSON();
	    }
	    ImmutableMoment.from = from;
	    function to(m) {
	        return moment(m);
	    }
	    ImmutableMoment.to = to;
	})(ImmutableMoment || (ImmutableMoment = {}));
	var model = new Model();
	function remove(arr, item) {
	    for (var i = arr.length; i--;) {
	        if (arr[i] === item) {
	            arr.splice(i, 1);
	        }
	    }
	}
	function getProperty(obj, key) {
	    return obj[key];
	}
	var GUI = (function (_super) {
	    __extends(GUI, _super);
	    function GUI() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.config = { date: moment().format("DD.MM.YYYY"), month: moment().format("MM") };
	        return _this;
	    }
	    GUI.prototype.componentDidMount = function () {
	        var _this = this;
	        $('.fc-event').each(function () {
	            $(this).draggable({
	                zIndex: 999,
	                revert: true,
	                revertDuration: 0,
	                helper: 'clone'
	            });
	        });
	        var c = $(this.calendar);
	        mobx_1.autorun(function () {
	            model.staticEventSource.events.map(function (e) { return e.title; });
	            _this.selectedEvent;
	            c.fullCalendar("refetchEvents");
	        });
	        c.fullCalendar({
	            header: {
	                left: 'prev,next today',
	                center: 'title',
	                right: 'month,agendaWeek,agendaDay'
	            },
	            defaultDate: moment(),
	            defaultView: "agendaWeek",
	            selectable: true,
	            selectHelper: true,
	            timeFormat: 'H:mm',
	            slotLabelFormat: "H:mm",
	            snapDuration: moment.duration(15, "minutes"),
	            select: function (start, end) {
	                var title = "Allgemeines"; //prompt('Event Title:');
	                if (title) {
	                    var e = new StaticEvent();
	                    e.start = start;
	                    e.end = end;
	                    e.title = title;
	                    model.staticEventSource.events.push(e);
	                    _this.selectedEvent = e;
	                }
	                c.fullCalendar('unselect');
	            },
	            eventClick: function (e) {
	                var o = e.originalEvent;
	                _this.selectedEvent = o;
	            },
	            eventResize: function (e) {
	                var o = e.originalEvent;
	                o.start = e.start;
	                o.end = e.end;
	                _this.selectedEvent = o;
	            },
	            eventDrop: function (e) {
	                var o = e.originalEvent;
	                o.start = e.start;
	                o.end = e.end;
	                _this.selectedEvent = o;
	            },
	            editable: true,
	            droppable: true,
	            drop: function (start) {
	                var e = new StaticEvent();
	                e.start = start;
	                e.end = start.clone().add(1, "h");
	                e.title = "Pause";
	                model.staticEventSource.events.push(e);
	                model.staticEventSource.events.push();
	                _this.selectedEvent = e;
	            },
	            eventSources: [
	                {
	                    events: function (start, end, timezone, callback) {
	                        var events = [];
	                        for (var _i = 0, _a = model.staticEventSource.events; _i < _a.length; _i++) {
	                            var e = _a[_i];
	                            var evnt = { start: e.start, end: e.end, title: e.title };
	                            evnt.originalEvent = e;
	                            if (_this.selectedEvent === e)
	                                evnt.className = "selected-event";
	                            events.push(evnt);
	                        }
	                        callback(events);
	                    },
	                    editable: true,
	                }
	            ]
	        });
	    };
	    GUI.prototype.render = function () {
	        var _this = this;
	        var Activity = (function () {
	            function Activity(start, end, title, pause) {
	                this.start = start;
	                this.end = end;
	                this.title = title;
	                this.pause = pause;
	            }
	            Object.defineProperty(Activity.prototype, "workDuration", {
	                get: function () {
	                    return moment.duration(this.end.diff(this.start)).subtract(this.pause);
	                },
	                enumerable: true,
	                configurable: true
	            });
	            return Activity;
	        }());
	        var activities = [];
	        var events = model.staticEventSource.events.slice(0).sort(function (a, b) { return a.start.diff(b.start); });
	        var last = null;
	        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
	            var ev = events_1[_i];
	            if (ev.title == "Pause") {
	                if (activities.length > 0) {
	                    var pauseDuration = moment.duration(ev.end.diff(ev.start));
	                    activities[activities.length - 1].pause = pauseDuration;
	                    activities[activities.length - 1].end.add(pauseDuration);
	                }
	            }
	            else {
	                activities.push(new Activity(ev.start, ev.end, ev.title, moment.duration(0)));
	            }
	            last = ev;
	        }
	        var sum = moment.duration();
	        for (var _a = 0, activities_1 = activities; _a < activities_1.length; _a++) {
	            var act = activities_1[_a];
	            sum.add(act.workDuration);
	        }
	        var data = {
	            "Datum": this.config.date,
	            "Monat": this.config.month,
	            "Summe": Math.floor(sum.asHours()) + ":" + sum.minutes(),
	            "Taetigkeiten": activities.map(function (a) {
	                return {
	                    "Taetigkeit": a.title,
	                    "Datum": a.start.format("DD.MM.YY"),
	                    "Beginn": a.start.format("HH:mm"),
	                    "Ende": a.end.format("HH:mm"),
	                    "Pause": moment.utc(a.pause.asMilliseconds()).format("HH:mm"),
	                    "Arbeitszeit": moment.utc(a.workDuration.asMilliseconds()).format("HH:mm"),
	                };
	            })
	        };
	        var selectedElementUI = null;
	        if (this.selectedEvent) {
	            selectedElementUI = (React.createElement("div", { className: "selectedElementUi group" },
	                React.createElement("h3", null, "Ausgew\u00E4hltes Element"),
	                React.createElement("span", { className: "titleLabel" }, "Titel:"),
	                React.createElement("input", { type: "text", value: this.selectedEvent.title, onChange: function (e) { return _this.selectedEvent.title = e.currentTarget.value; } }),
	                React.createElement("button", { onClick: function () { remove(model.staticEventSource.events, _this.selectedEvent); _this.selectedEvent = null; } }, "Element l\u00F6schen")));
	        }
	        return (React.createElement("div", { className: "gui" },
	            React.createElement("div", { ref: function (d) { return _this.calendar = d; }, className: "calendar" }),
	            React.createElement("div", { className: "templates" },
	                React.createElement("div", null, "Vorlagen"),
	                React.createElement("div", { className: "template" },
	                    React.createElement("div", { className: 'fc-event event-pause' }, "Pause"))),
	            selectedElementUI,
	            React.createElement("div", { className: "group" },
	                React.createElement("span", { className: "titleLabel" }, "Datum:"),
	                React.createElement("input", { type: "text", value: this.config.date, onChange: function (e) { return _this.config.date = e.currentTarget.value; } }),
	                React.createElement("span", { className: "titleLabel" }, "Monat:"),
	                React.createElement("input", { type: "text", value: this.config.month, onChange: function (e) { return _this.config.month = e.currentTarget.value; } })),
	            React.createElement("br", null),
	            React.createElement(image_form_1.FormDataViewer, { data: data, form: defaultForm })));
	    };
	    return GUI;
	}(React.Component));
	__decorate([
	    mobx_1.observable
	], GUI.prototype, "selectedEvent", void 0);
	__decorate([
	    mobx_1.observable
	], GUI.prototype, "config", void 0);
	GUI = __decorate([
	    mobx_react_1.observer
	], GUI);
	var defaultForm = {
	    "fields": {
	        "Monat": {
	            "type": "text",
	            "region": { "x": 1218, "y": 248, "width": 135, "height": 48 }
	        },
	        "Personalnummer": {
	            "type": "text",
	            "region": { "x": 815, "y": 390, "width": 300, "height": 50 }
	        },
	        "Stundensatz": {
	            "type": "text",
	            "region": { "x": 1350, "y": 518, "width": 150, "height": 50 }
	        },
	        "Summe": {
	            "type": "text",
	            "region": { "x": 1401, "y": 1779, "width": 176, "height": 38 }
	        },
	        "Datum": {
	            "type": "text",
	            "region": { "x": 1122, "y": 1940, "width": 197, "height": 41 }
	        },
	        "Taetigkeiten": {
	            "type": "table",
	            "region": { "x": 140, "y": 726, "width": 1440, "height": 1013 },
	            "itemFields": {
	                "Taetigkeit": {
	                    "type": "text",
	                    "region": { "x": 30, "y": 0, "width": 350, "height": 40 }
	                },
	                "Datum": {
	                    "type": "text",
	                    "region": { "x": 429, "y": 0, "width": 190, "height": 40 }
	                },
	                "Beginn": {
	                    "type": "text",
	                    "region": { "x": 640, "y": 0, "width": 190, "height": 40 }
	                },
	                "Ende": {
	                    "type": "text",
	                    "region": { "x": 840, "y": 0, "width": 190, "height": 40 }
	                },
	                "Pause": {
	                    "type": "text",
	                    "region": { "x": 1060, "y": 0, "width": 180, "height": 40 }
	                },
	                "Arbeitszeit": {
	                    "type": "text",
	                    "region": { "x": 1270, "y": 0, "width": 160, "height": 40 }
	                }
	            },
	            "itemHeight": 40.5
	        }
	    }
	};
	var target = document.createElement("div");
	document.body.appendChild(target);
	ReactDOM.render(React.createElement("div", null,
	    React.createElement(mobx_react_devtools_1.default, null),
	    React.createElement(GUI, null)), target);


/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(183);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(185)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 183:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(184)();
	// imports
	
	
	// module
	exports.push([module.id, "body {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }\n\n.gui {\n  margin: auto;\n  max-width: 800px;\n  width: 50%; }\n\n.templates > div {\n  float: left;\n  margin: 10px; }\n\n.template > div {\n  width: 100px;\n  height: 40px;\n  text-align: center; }\n\n.templates {\n  overflow: auto; }\n\n.text-value {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  font-size: 28px;\n  dominant-baseline: central; }\n\n.Personalnummer {\n  font-size: 35px; }\n\n.formViewer {\n  width: 100%; }\n\n.selected-event {\n  background-color: blue !important; }\n\n.titleLabel {\n  margin-right: 10px; }\n\n.group {\n  border: black 1px solid;\n  padding: 10px; }\n", ""]);
	
	// exports


/***/ },

/***/ 190:
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./af": 191,
		"./af.js": 191,
		"./ar": 192,
		"./ar-dz": 193,
		"./ar-dz.js": 193,
		"./ar-ly": 194,
		"./ar-ly.js": 194,
		"./ar-ma": 195,
		"./ar-ma.js": 195,
		"./ar-sa": 196,
		"./ar-sa.js": 196,
		"./ar-tn": 197,
		"./ar-tn.js": 197,
		"./ar.js": 192,
		"./az": 198,
		"./az.js": 198,
		"./be": 199,
		"./be.js": 199,
		"./bg": 200,
		"./bg-x": 201,
		"./bg-x.js": 201,
		"./bg.js": 200,
		"./bn": 202,
		"./bn.js": 202,
		"./bo": 203,
		"./bo.js": 203,
		"./br": 204,
		"./br.js": 204,
		"./bs": 205,
		"./bs.js": 205,
		"./ca": 206,
		"./ca.js": 206,
		"./cs": 207,
		"./cs.js": 207,
		"./cv": 208,
		"./cv.js": 208,
		"./cy": 209,
		"./cy.js": 209,
		"./da": 210,
		"./da.js": 210,
		"./de": 211,
		"./de-at": 212,
		"./de-at.js": 212,
		"./de.js": 211,
		"./dv": 213,
		"./dv.js": 213,
		"./el": 214,
		"./el.js": 214,
		"./en-au": 215,
		"./en-au.js": 215,
		"./en-ca": 216,
		"./en-ca.js": 216,
		"./en-gb": 217,
		"./en-gb.js": 217,
		"./en-ie": 218,
		"./en-ie.js": 218,
		"./en-nz": 219,
		"./en-nz.js": 219,
		"./eo": 220,
		"./eo.js": 220,
		"./es": 221,
		"./es-do": 222,
		"./es-do.js": 222,
		"./es.js": 221,
		"./et": 223,
		"./et.js": 223,
		"./eu": 224,
		"./eu.js": 224,
		"./fa": 225,
		"./fa.js": 225,
		"./fi": 226,
		"./fi.js": 226,
		"./fo": 227,
		"./fo.js": 227,
		"./fr": 228,
		"./fr-ca": 229,
		"./fr-ca.js": 229,
		"./fr-ch": 230,
		"./fr-ch.js": 230,
		"./fr.js": 228,
		"./fy": 231,
		"./fy.js": 231,
		"./gd": 232,
		"./gd.js": 232,
		"./gl": 233,
		"./gl.js": 233,
		"./he": 234,
		"./he.js": 234,
		"./hi": 235,
		"./hi.js": 235,
		"./hr": 236,
		"./hr.js": 236,
		"./hu": 237,
		"./hu.js": 237,
		"./hy-am": 238,
		"./hy-am.js": 238,
		"./id": 239,
		"./id.js": 239,
		"./is": 240,
		"./is.js": 240,
		"./it": 241,
		"./it.js": 241,
		"./ja": 242,
		"./ja.js": 242,
		"./jv": 243,
		"./jv.js": 243,
		"./ka": 244,
		"./ka.js": 244,
		"./kk": 245,
		"./kk.js": 245,
		"./km": 246,
		"./km.js": 246,
		"./ko": 247,
		"./ko.js": 247,
		"./ky": 248,
		"./ky.js": 248,
		"./lb": 249,
		"./lb.js": 249,
		"./lo": 250,
		"./lo.js": 250,
		"./lt": 251,
		"./lt.js": 251,
		"./lv": 252,
		"./lv.js": 252,
		"./me": 253,
		"./me.js": 253,
		"./mi": 254,
		"./mi.js": 254,
		"./mk": 255,
		"./mk.js": 255,
		"./ml": 256,
		"./ml.js": 256,
		"./mr": 257,
		"./mr.js": 257,
		"./ms": 258,
		"./ms-my": 259,
		"./ms-my.js": 259,
		"./ms.js": 258,
		"./my": 260,
		"./my.js": 260,
		"./nb": 261,
		"./nb.js": 261,
		"./ne": 262,
		"./ne.js": 262,
		"./nl": 263,
		"./nl-be": 264,
		"./nl-be.js": 264,
		"./nl.js": 263,
		"./nn": 265,
		"./nn.js": 265,
		"./pa-in": 266,
		"./pa-in.js": 266,
		"./pl": 267,
		"./pl.js": 267,
		"./pt": 268,
		"./pt-br": 269,
		"./pt-br.js": 269,
		"./pt.js": 268,
		"./ro": 270,
		"./ro.js": 270,
		"./ru": 271,
		"./ru.js": 271,
		"./se": 272,
		"./se.js": 272,
		"./si": 273,
		"./si.js": 273,
		"./sk": 274,
		"./sk.js": 274,
		"./sl": 275,
		"./sl.js": 275,
		"./sq": 276,
		"./sq.js": 276,
		"./sr": 277,
		"./sr-cyrl": 278,
		"./sr-cyrl.js": 278,
		"./sr.js": 277,
		"./ss": 279,
		"./ss.js": 279,
		"./sv": 280,
		"./sv.js": 280,
		"./sw": 281,
		"./sw.js": 281,
		"./ta": 282,
		"./ta.js": 282,
		"./te": 283,
		"./te.js": 283,
		"./tet": 284,
		"./tet.js": 284,
		"./th": 285,
		"./th.js": 285,
		"./tl-ph": 286,
		"./tl-ph.js": 286,
		"./tlh": 287,
		"./tlh.js": 287,
		"./tr": 288,
		"./tr.js": 288,
		"./tzl": 289,
		"./tzl.js": 289,
		"./tzm": 290,
		"./tzm-latn": 291,
		"./tzm-latn.js": 291,
		"./tzm.js": 290,
		"./uk": 292,
		"./uk.js": 292,
		"./uz": 293,
		"./uz.js": 293,
		"./vi": 294,
		"./vi.js": 294,
		"./x-pseudo": 295,
		"./x-pseudo.js": 295,
		"./yo": 296,
		"./yo.js": 296,
		"./zh-cn": 297,
		"./zh-cn.js": 297,
		"./zh-hk": 298,
		"./zh-hk.js": 298,
		"./zh-tw": 299,
		"./zh-tw.js": 299
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 190;


/***/ },

/***/ 303:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments)).next());
	    });
	};
	var __generator = (this && this.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
	    return { next: verb(0), "throw": verb(1), "return": verb(2) };
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [0, t.value];
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
	var React = __webpack_require__(1);
	var ReactDOM = __webpack_require__(32);
	var classNames = __webpack_require__(304);
	var mobx_1 = __webpack_require__(179);
	var mobx_react_1 = __webpack_require__(180);
	var fileSaver = __webpack_require__(305);
	__webpack_require__(308);
	var FormRenderer;
	(function (FormRenderer) {
	    function createElements(data, fields, x, y) {
	        var elements = [];
	        for (var fieldName in fields) {
	            var value = data[fieldName];
	            var f = fields[fieldName];
	            if (f.type === "text") {
	                elements.push((React.createElement("svg", { x: f.region.x + x, y: f.region.y + y, width: f.region.width, height: f.region.height },
	                    React.createElement("text", { x: "10", y: "50%", className: classNames(fieldName, "text-value") }, value))));
	            }
	            if (f.type === "table") {
	                var dy = 0;
	                if (f.itemHeight === 0)
	                    continue;
	                var i = 0;
	                while (dy + f.itemHeight < f.region.height && i < value.length) {
	                    elements.push.apply(elements, createElements(value[i], f.itemFields, f.region.x + x, f.region.y + y + dy));
	                    dy += f.itemHeight;
	                    i++;
	                }
	            }
	        }
	        return elements;
	    }
	    function renderFormDataToSvgContent(data, form, templateImage) {
	        return (React.createElement("g", null,
	            React.createElement("image", { xlinkHref: templateImage.url, width: templateImage.width + "px", height: templateImage.height + "px" }),
	            createElements(data, form.fields, 0, 0)));
	    }
	    FormRenderer.renderFormDataToSvgContent = renderFormDataToSvgContent;
	    function createRegions(fields, x, y) {
	        var elements = [];
	        for (var fieldName in fields) {
	            var f = fields[fieldName];
	            if (f.type === "text") {
	                elements.push(React.createElement("rect", { x: f.region.x + x, y: f.region.y + y, width: f.region.width, height: f.region.height, fill: "black" }));
	            }
	            if (f.type === "table") {
	                elements.push(React.createElement("rect", { x: f.region.x + x, y: f.region.y + y, width: f.region.width, height: f.region.height, fill: "blue", fillOpacity: "0.4" }));
	                var dy = 0;
	                if (f.itemHeight === 0)
	                    continue;
	                while (dy + f.itemHeight < f.region.height) {
	                    elements.push.apply(elements, createRegions(f.itemFields, f.region.x + x, f.region.y + y + dy));
	                    dy += f.itemHeight;
	                }
	            }
	        }
	        return elements;
	    }
	    function renderFormRegionsToSvgContent(form, templateImage) {
	        return (React.createElement("g", null,
	            React.createElement("image", { x: "0", y: "0", width: templateImage.width, height: templateImage.height, href: templateImage.url }),
	            createRegions(form.fields, 0, 0)));
	    }
	    FormRenderer.renderFormRegionsToSvgContent = renderFormRegionsToSvgContent;
	})(FormRenderer || (FormRenderer = {}));
	function getSizeOfImage(imageUrl) {
	    var img = document.createElement('img');
	    return new Promise(function (resolve, reject) {
	        img.onload = function () {
	            var width = img.width;
	            var height = img.height;
	            resolve({ width: width, height: height });
	        };
	        img.onerror = function (e) {
	            reject(e.error);
	        };
	        img.src = imageUrl;
	    });
	}
	var FormDataViewer = (function (_super) {
	    __extends(FormDataViewer, _super);
	    function FormDataViewer() {
	        var _this = _super.apply(this, arguments) || this;
	        _this.image = null;
	        return _this;
	    }
	    FormDataViewer.prototype.loadTemplateImage = function (event) {
	        var _this = this;
	        var target = event.target;
	        var selectedFile = target.files[0];
	        var reader = new FileReader();
	        reader.onload = function (event) { return __awaiter(_this, void 0, void 0, function () {
	            var target, size;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        target = event.target;
	                        return [4 /*yield*/, getSizeOfImage(target.result)];
	                    case 1:
	                        size = _a.sent();
	                        this.image = { url: target.result, width: size.width, height: size.height };
	                        return [2 /*return*/];
	                }
	            });
	        }); };
	        reader.readAsDataURL(target.files[0]);
	    };
	    FormDataViewer.prototype.downloadCompletedImage = function () {
	        if (!this.image)
	            return;
	        var height = this.image.height;
	        var width = this.image.width;
	        var styleText = "";
	        for (var i = 0; i <= document.styleSheets.length - 1; i++) {
	            var ss = document.styleSheets[i];
	            styleText += ss.ownerNode.textContent;
	        }
	        var rsvg = (React.createElement("svg", { width: width + "px", height: height + "px", viewBox: [0, 0, width, height].join(" ") },
	            React.createElement("style", null, styleText),
	            FormRenderer.renderFormDataToSvgContent(this.props.data, this.props.form, this.image)));
	        var div = document.createElement("div");
	        ReactDOM.render(rsvg, div);
	        var svg = div.children[0];
	        var svgData = new XMLSerializer().serializeToString(svg);
	        var blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
	        var blobUrl = URL.createObjectURL(blob);
	        var img = document.createElement("img");
	        img.width = width;
	        img.height = height;
	        img.onload = function () {
	            var canvas = document.createElement('canvas');
	            canvas.width = width;
	            canvas.height = height;
	            var ctx = canvas.getContext('2d');
	            ctx.drawImage(img, 0, 0);
	            canvas.toBlob(function (blob) {
	                fileSaver.saveAs(blob, "image.png", true);
	            }, "image/png");
	        };
	        img.src = blobUrl;
	    };
	    FormDataViewer.prototype.render = function () {
	        var _this = this;
	        var svg;
	        if (this.image) {
	            svg = (React.createElement("svg", { className: "formViewer", ref: function (svg) { return _this.element = svg; }, viewBox: [0, 0, this.image.width, this.image.height].join(" ") }, FormRenderer.renderFormDataToSvgContent(this.props.data, this.props.form, this.image)));
	        }
	        else {
	            svg = (React.createElement("div", null, "No template image loaded."));
	        }
	        return (React.createElement("div", null,
	            React.createElement("input", { type: "file", onChange: function (e) { return _this.loadTemplateImage(e); } }),
	            React.createElement("button", { onClick: function () { return _this.downloadCompletedImage(); } }, "Save"),
	            React.createElement("br", null),
	            svg));
	    };
	    return FormDataViewer;
	}(React.Component));
	__decorate([
	    mobx_1.observable
	], FormDataViewer.prototype, "image", void 0);
	FormDataViewer = __decorate([
	    mobx_react_1.observer
	], FormDataViewer);
	exports.FormDataViewer = FormDataViewer;


/***/ },

/***/ 309:
/***/ function(module, exports) {

	/* (ignored) */

/***/ }

});
//# sourceMappingURL=main-cb76aa847feb85a23fcc.js.map