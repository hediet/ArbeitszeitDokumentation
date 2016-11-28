import * as React from "react";
import * as ReactDOM from "react-dom";
import * as classNames from "classnames";
import { observable, computed, autorun } from "mobx";
import { observer } from "mobx-react";
import * as fileSaver from "file-saver";
import "es6-promise";

export interface FieldSet {
	[name: string]: Field;
}

export interface Form {
	fields: FieldSet;
}

export type Field = TextField | TableField;

export interface Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface TextField {
	type: "text";
	region: Rectangle;
}

export interface TableField {
	type: "table";
	region: Rectangle;
	itemHeight: number;
	itemFields: FieldSet;
}


interface Image {
	url: string;
	width: number;
	height: number;
}

module FormRenderer {
	function createElements(data: any, fields: { [name: string]: Field }, x: number, y: number): JSX.Element[] {
		const elements: JSX.Element[] = [];

		for (var fieldName in fields) {
			const value = data[fieldName];
			const f: TextField|TableField = fields[fieldName] as any;
			if (f.type === "text") {
				elements.push((
					<svg x={f.region.x + x} y={f.region.y + y} width={f.region.width} height={f.region.height}>
						<text x="10" y="50%" className={classNames(fieldName, "text-value")}>
							{value}
						</text>
					</svg>
				));
			}
			if (f.type === "table") {
				let dy = 0;
				if (f.itemHeight === 0) continue;
				let i = 0;
				while (dy + f.itemHeight < f.region.height && i < value.length) {
					elements.push(...createElements(value[i], f.itemFields, f.region.x + x, f.region.y + y + dy));
					dy += f.itemHeight;
					i++;
				}
			}
		}

		return elements;
	}

	export function renderFormDataToSvgContent(data: any, form: Form, templateImage: Image) {
		return (
			<g>
				<image xlinkHref={templateImage.url} width={templateImage.width + "px"} height={templateImage.height + "px"}></image>
				{createElements(data, form.fields, 0, 0)}
			</g>
		);
	}


	function createRegions(fields: { [name: string]: Field }, x: number, y: number): JSX.Element[] {
		const elements: JSX.Element[] = [];

		for (var fieldName in fields) {
			const f: TextField|TableField = fields[fieldName] as any;
			if (f.type === "text") {
				elements.push(<rect x={f.region.x + x} y={f.region.y + y} width={f.region.width} height={f.region.height} fill="black" />);
			}
			if (f.type === "table") {
				elements.push(<rect x={f.region.x + x} y={f.region.y + y} width={f.region.width} height={f.region.height} fill="blue" fillOpacity="0.4" />);
				let dy = 0;
				if (f.itemHeight === 0) continue;
				while (dy + f.itemHeight < f.region.height) {
					elements.push(...createRegions(f.itemFields, f.region.x + x, f.region.y + y + dy));
					dy += f.itemHeight;
				}
			}
		}

		return elements;
	}

	export function renderFormRegionsToSvgContent(form: Form, templateImage: Image) {
		return (
			<g>
				<image x="0" y="0" width={templateImage.width} height={templateImage.height} href={templateImage.url} ></image>
				{createRegions(form.fields, 0, 0)}
			</g>
		);
	}
}




function getSizeOfImage(imageUrl: string): PromiseLike<{ width: number, height: number }> {
	var img = document.createElement('img');
	
	return new Promise<{ width: number, height: number }>((resolve, reject) => {
		img.onload = () => {
			const width = img.width;
			const height = img.height;
			resolve({ width, height });
		}
		img.onerror = (e) => {
			reject(e.error);
		}
		img.src = imageUrl;
	});
}

@observer
export class FormDataViewer extends React.Component<{ data: any, form: Form }, {}> {
	@observable 
	private image: Image|null = null;

	private element: SVGElement;

	private loadTemplateImage(event: React.FormEvent<HTMLInputElement>) {
		const target: { files: FileList } = event.target as any;
		const selectedFile = target.files[0];
		const reader = new FileReader();

		reader.onload = async (event) => {
			const target: { result: string } = event.target as any; 
			var size = await getSizeOfImage(target.result);
			this.image = { url: target.result, width: size.width, height: size.height };
		};

		reader.readAsDataURL(target.files[0]);
	}

	private downloadCompletedImage() {

		if (!this.image) return;

		const height = this.image.height;
		const width = this.image.width;

		let styleText = "";
		for (var i = 0; i <= document.styleSheets.length - 1; i++) {
			var ss = document.styleSheets[i];
			styleText += ss.ownerNode.textContent;
		}

		const rsvg = (
			<svg width={width+"px"} height={height+"px"} viewBox={[0, 0, width, height].join(" ")}>
				<style>
					{styleText}
				</style>
				{FormRenderer.renderFormDataToSvgContent(this.props.data, this.props.form, this.image)}
			</svg>
		);

		const div = document.createElement("div");
		ReactDOM.render(rsvg, div);
		const svg = div.children[0] as SVGElement;

		const svgData = new XMLSerializer().serializeToString(svg);
		const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		const blobUrl = URL.createObjectURL(blob);

		const img = document.createElement("img");
		img.width = width;
		img.height = height;
		img.onload = () => {

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d')!;
			ctx.drawImage(img, 0, 0);

			canvas.toBlob(blob => {
				fileSaver.saveAs(blob!, "image.png", true);
			}, "image/png");
		};
		img.src = blobUrl;
	}


	public render() {
		let svg: JSX.Element;
		if (this.image) {
			svg = (
				<svg className="formViewer" ref={svg => this.element = svg} viewBox={ [0, 0, this.image.width, this.image.height].join(" ") }>
					{FormRenderer.renderFormDataToSvgContent(this.props.data, this.props.form, this.image)}
				</svg>
			);
		}
		else {
			svg = (<div>No template image loaded.</div>);
		}

		return (
			<div>
				<input type="file" onChange={e => this.loadTemplateImage(e)} />
				<button onClick={() => this.downloadCompletedImage()}>Save</button>
				<br />
				{svg}
			</div>
		);
	}
}