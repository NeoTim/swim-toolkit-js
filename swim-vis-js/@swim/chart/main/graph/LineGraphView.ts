// Copyright 2015-2020 SWIM.AI inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {BoxR2} from "@swim/math";
import {AnyLength, Length} from "@swim/length";
import {AnyColor, Color} from "@swim/color";
import {AnyFont} from "@swim/font";
import {CanvasRenderer, CanvasContext} from "@swim/render";
import {MemberAnimator, RenderedViewInit, RenderedView, StrokeViewInit, StrokeView} from "@swim/view";
import {AxisView} from "../axis/AxisView";
import {AnyDatumView, DatumView} from "../data/DatumView";
import {AnyPlotView, PlotView} from "../plot/PlotView";
import {GraphType, AnyGraphView, GraphView} from "./GraphView";
import {GraphViewController} from "./GraphViewController";

export type AnyLineGraphView<X, Y> = LineGraphView<X, Y> | LineGraphViewInit<X, Y>;

export interface LineGraphViewInit<X, Y> extends RenderedViewInit, StrokeViewInit {
  xAxis?: AxisView<X>;
  yAxis?: AxisView<Y>;

  data?: AnyDatumView<X, Y>[];

  hitWidth?: number;

  font?: AnyFont;
  textColor?: AnyColor;
}

export class LineGraphView<X, Y> extends GraphView<X, Y> implements StrokeView {
  /** @hidden */
  _hitWidth: number;

  constructor() {
    super();
    this.stroke.setState(Color.black());
    this.strokeWidth.setState(Length.px(1));
    this._hitWidth = 5;
  }

  get viewController(): GraphViewController<X, Y, LineGraphView<X, Y>> | null {
    return this._viewController;
  }

  get type(): GraphType {
    return "line";
  }

  @MemberAnimator(Color)
  stroke: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Length)
  strokeWidth: MemberAnimator<this, Length, AnyLength>;

  hitWidth(): number;
  hitWidth(hitWidth: number): this;
  hitWidth(hitWidth?: number): number | this {
    if (hitWidth === void 0) {
      return this._hitWidth;
    } else {
      this._hitWidth = hitWidth;
      return this;
    }
  }

  protected renderPlot(context: CanvasContext, frame: BoxR2): void {
    const data = this._data;
    const n = data.size;

    const stroke = this.stroke.value!;
    const strokeWidth = this.strokeWidth.value!.pxValue(Math.min(frame.width, frame.height));
    const gradientStops = this._gradientStops;
    let gradient: CanvasGradient | undefined;

    let x0: number;
    let x1: number;
    let dx: number;
    if (n > 0) {
      const p0 = data.firstValue()!;
      const p1 = data.lastValue()!;
      x0 = p0.xCoord;
      x1 = p1.xCoord;
      dx = x1 - x0;
      if (gradientStops !== 0) {
        gradient = context.createLinearGradient(x0, 0, x1, 0);
      }
    } else {
      x0 = NaN;
      x1 = NaN;
      dx = NaN;
    }

    context.beginPath();
    let i = 0;
    data.forEach(function (x: X, p: DatumView<X, Y>): void {
      const xCoord = p.xCoord;
      const yCoord = p.yCoord;
      if (i === 0) {
        context.moveTo(xCoord, yCoord);
      } else {
        context.lineTo(xCoord, yCoord);
      }
      if (gradient !== void 0 && p.isGradientStop()) {
        let color = p.color.value || stroke;
        const opacity = p.opacity.value;
        if (typeof opacity === "number") {
          color = color.alpha(opacity);
        }
        const offset = (xCoord - x0) / (dx || 1);
        gradient!.addColorStop(offset, color.toString());
      }
      i += 1;
    }, this);

    context.strokeStyle = gradient !== void 0 ? gradient : stroke.toString();
    context.lineWidth = strokeWidth;
    context.stroke();
  }

  protected hitTestGraph(x: number, y: number, renderer: CanvasRenderer): RenderedView | null {
    const context = renderer.context;
    let hitWidth = this._hitWidth;
    const strokeWidth = this.strokeWidth.value;
    if (strokeWidth !== void 0) {
      const frame = this.viewFrame;
      const size = Math.min(frame.width, frame.height);
      hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
    }

    context.beginPath();
    let i = 0;
    this._data.forEach(function (x: X, p: DatumView<X, Y>): void {
      const xCoord = p.xCoord;
      const yCoord = p.yCoord;
      if (i === 0) {
        context.moveTo(xCoord, yCoord);
      } else {
        context.lineTo(xCoord, yCoord);
      }
      i += 1;
    }, this);

    context.lineWidth = hitWidth;
    if (context.isPointInStroke(x, y)) {
      if (this._hitMode === "graph") {
        return this;
      } else if (this._hitMode === "data") {
        return this.hitTestData(x, y, renderer);
      }
    }
    return null;
  }

  static fromAny<X, Y>(graph: AnyLineGraphView<X, Y>): LineGraphView<X, Y>;
  static fromAny<X, Y>(graph: AnyGraphView<X, Y>): GraphView<X, Y>;
  static fromAny<X, Y>(graph: AnyPlotView<X, Y>): PlotView<X, Y>;
  static fromAny<X, Y>(graph: AnyPlotView<X, Y> | LineGraphViewInit<X, Y>): PlotView<X, Y> {
    if (graph instanceof LineGraphView) {
      return graph;
    } else if (graph instanceof GraphView) {
      // error
    } else if (typeof graph === "object" && graph !== null) {
      graph = graph as LineGraphViewInit<X, Y>;
      const view = new LineGraphView<X, Y>();

      if (graph.xAxis !== void 0) {
        view.xAxis(graph.xAxis);
      }
      if (graph.yAxis !== void 0) {
        view.yAxis(graph.yAxis);
      }

      const data = graph.data;
      if (data !== void 0) {
        for (let i = 0, n = data.length; i < n; i += 1) {
          view.insertDatum(data[i]);
        }
      }

      if (graph.stroke !== void 0) {
        view.stroke(graph.stroke);
      }
      if (graph.strokeWidth !== void 0) {
        view.strokeWidth(graph.strokeWidth);
      }

      if (graph.hitWidth !== void 0) {
        view.hitWidth(graph.hitWidth);
      }

      if (graph.font !== void 0) {
        view.font(graph.font);
      }
      if (graph.textColor !== void 0) {
        view.textColor(graph.textColor);
      }

      if (graph.hidden !== void 0) {
        view.setHidden(graph.hidden);
      }
      if (graph.culled !== void 0) {
        view.setCulled(graph.culled);
      }

      return view;
    }
    throw new TypeError("" + graph);
  }
}
PlotView.Line = LineGraphView;
