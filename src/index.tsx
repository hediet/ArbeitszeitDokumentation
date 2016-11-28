import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import { observable, computed, autorun } from "mobx";
import { observer } from "mobx-react";
import DevTools from 'mobx-react-devtools'; 
import "./style.scss";
import * as $ from "jquery";
import "fullcalendar";
import "jqueryui";
import * as c from "fullcalendar";
import "fullcalendar/dist/fullcalendar.min.css";
import * as moment from 'moment';
import { FormDataViewer, Form } from "./image-form";

class Model {
	public staticEventSource = new StaticEventSource();
}

class StaticEvent {
	@observable title: string;
	@observable private _start: ImmutableMoment;
	@observable private _end: ImmutableMoment;

	public get start(): moment.Moment { return ImmutableMoment.to(this._start); }
	public get end(): moment.Moment { return ImmutableMoment.to(this._end); }
	public set start(val: moment.Moment) { this._start = ImmutableMoment.from(val); }
	public set end(val: moment.Moment) { this._end = ImmutableMoment.from(val); }
}

class StaticEventSource {
	@observable events: StaticEvent[] = [];
}



interface ImmutableMoment {
	_brand: "ImmutableMoment";
}

module ImmutableMoment {
	export function from(m: moment.Moment): ImmutableMoment {
		return m.toJSON() as any;
	}
	export function to(m: ImmutableMoment): moment.Moment {
		return moment(m as any);
	}
}

var model = new Model();

function remove<T>(arr: T[], item: T) {
	for(var i = arr.length; i--;) {
		if(arr[i] === item) {
			arr.splice(i, 1);
		}
	}
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
	return obj[key];
}



@observer
class GUI extends React.Component<{}, {}> {
	private calendar: HTMLDivElement;

	@observable private selectedEvent: StaticEvent|null; 
	@observable private config: { date: string, month: string } = { date: moment().format("DD.MM.YYYY"), month: moment().format("MM") };

	componentDidMount() {


		$('.fc-event').each(function() {
			$(this).draggable({
				zIndex: 999,
				revert: true,
				revertDuration: 0,
				helper: 'clone'
			});
		});

		var c = $(this.calendar);
		
		autorun(() => {
			model.staticEventSource.events.map(e => e.title);
			this.selectedEvent;

			c.fullCalendar("refetchEvents");
		})

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
			
			select: (start, end) => {
				var title = "Allgemeines"; //prompt('Event Title:');
				if (title) {
					const e = new StaticEvent();
					e.start = start;
					e.end = end;
					e.title = title;
					model.staticEventSource.events.push(e);
					this.selectedEvent = e;
				}
				c.fullCalendar('unselect');
			},
			
			eventClick: (e) => {
				var o = (e as any).originalEvent as StaticEvent;
				this.selectedEvent = o;
			},
			eventResize: (e) => { 
				var o = (e as any).originalEvent as StaticEvent;
				o.start = e.start as moment.Moment;
				o.end = e.end as moment.Moment;
				this.selectedEvent = o;
			},
			eventDrop: (e) => {
				var o = (e as any).originalEvent as StaticEvent;
				o.start = e.start as moment.Moment;
				o.end = e.end as moment.Moment;
				this.selectedEvent = o;
			},
			editable: true,
			droppable: true,
			drop: (start) => {
				const e = new StaticEvent();
				e.start = start;
				e.end = start.clone().add(1, "h");
				e.title = "Pause";
				model.staticEventSource.events.push(e);
				model.staticEventSource.events.push();
				this.selectedEvent = e;
			},
			eventSources: [
				{
					events: (start: moment.Moment, end: moment.Moment, timezone: string | boolean, callback: (events: c.EventObject[]) => void) => {
						
						let events: c.EventObject[] = [];
						for (var e of model.staticEventSource.events) {
							var evnt: c.EventObject = { start: e.start, end: e.end, title: e.title };
							(evnt as any).originalEvent = e;
							if (this.selectedEvent === e)
								evnt.className = "selected-event";

							events.push(evnt);
						}
						callback(events);
					},
					editable: true,
				}
			]
		});
	}
	render() {

		class Activity {
			constructor(public start: moment.Moment, public end: moment.Moment, public title: string, public pause: moment.Duration) {

			}

			public get workDuration() {
				return moment.duration(this.end.diff(this.start)).subtract(this.pause);
			}
		}

		const activities: Activity[] = [];
		let events = model.staticEventSource.events.slice(0).sort((a, b) => a.start.diff(b.start));
		let last: StaticEvent|null = null;

		for (let ev of events) {
			if (ev.title == "Pause") {
				if (activities.length > 0) {
					const pauseDuration = moment.duration(ev.end.diff(ev.start));
					activities[activities.length - 1].pause = pauseDuration;
					activities[activities.length - 1].end.add(pauseDuration);
				}
			}
			else {
				activities.push(new Activity(ev.start, ev.end, ev.title, moment.duration(0)));
			}

			last = ev;
		}

		const sum = moment.duration();
		for (var act of activities) {
			sum.add(act.workDuration);
		}

		const data: FormData = {
			"Datum": this.config.date,
			"Monat": this.config.month,
			"Summe": `${Math.floor(sum.asHours())}:${sum.minutes()}`,
			"Taetigkeiten": activities.map(a => {
				return {
					"Taetigkeit": a.title,
					"Datum": a.start.format("DD.MM.YY"),
					"Beginn": a.start.format("HH:mm"),
					"Ende": a.end.format("HH:mm"),
					"Pause": moment.utc(a.pause.asMilliseconds()).format("HH:mm"),
					"Arbeitszeit": moment.utc(a.workDuration.asMilliseconds()).format("HH:mm"),
				};
			})
		}

		let selectedElementUI: JSX.Element|null = null;
		
		if (this.selectedEvent) { 
			selectedElementUI = (
				<div className="selectedElementUi group">
					<h3>Ausgewähltes Element</h3>
					<span className="titleLabel">Titel:</span>
					<input type="text" value={this.selectedEvent.title} onChange={(e) => this.selectedEvent!.title = e.currentTarget.value} />
					<button onClick={() => { remove(model.staticEventSource.events, this.selectedEvent); this.selectedEvent = null; }}>Element löschen</button>
				</div>
			);
		}

		return (
			<div className="gui">
				
				<div ref={d => this.calendar = d} className="calendar">
				</div>

				<div className="templates">
					<div>Vorlagen</div>
					<div className="template">
						<div className='fc-event event-pause'>Pause</div>
					</div>
				</div>

				{selectedElementUI}

				<div className="group">
					<span className="titleLabel">Datum:</span>
					<input type="text" value={this.config.date} onChange={(e) => this.config.date = e.currentTarget.value} />

					<span className="titleLabel">Monat:</span>
					<input type="text" value={this.config.month} onChange={(e) => this.config.month = e.currentTarget.value} />
				</div>

				<br/>

				<FormDataViewer data={data} form={defaultForm} />
			</div>
		);
	}
}


interface Taetigkeit {
	"Taetigkeit": string,
	"Datum": string,
	"Beginn": string,
	"Ende": string,
	"Pause": string,
	"Arbeitszeit": string
}

interface FormData {
	Personalnummer?: string;
	Stundensatz?: string;
	Taetigkeiten: Taetigkeit[];
	Summe: string;
	Datum: string;
	Monat: string;
}

const defaultForm: Form = {
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
			"region": { "x": 1122, "y": 1940, "width": 197, "height":41 }
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

const target = document.createElement("div");
document.body.appendChild(target);
ReactDOM.render(<div><DevTools /><GUI /></div>, target);

