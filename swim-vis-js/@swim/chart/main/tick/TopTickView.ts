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

import {PointR2, BoxR2} from "@swim/math";
import {CanvasContext} from "@swim/render";
import {RenderedView, TypesetView} from "@swim/view";
import {TickOrientation, TickView} from "./TickView";

export class TopTickView<D> extends TickView<D> {
  constructor(value: D) {
    super(value);
  }

  get orientation(): TickOrientation {
    return "top";
  }

  protected layoutTickLabel(tickLabel: RenderedView, frame: BoxR2): void {
    const origin = this.origin.value!;
    const x = Math.round(origin.x);
    const y0 = Math.round(origin.y);
    const y1 = y0 - this.tickMarkLength.value!;
    const y2 = y1 - this.tickLabelPadding.value!;

    if (TypesetView.is(tickLabel)) {
      tickLabel.textAlign.setAutoState("center");
      tickLabel.textBaseline.setAutoState("bottom");
      tickLabel.textOrigin.setAutoState(new PointR2(x, y2));
    }
  }

  protected renderTick(context: CanvasContext, frame: BoxR2): void {
    const origin = this.origin.value!;
    const x = Math.round(origin.x);
    const y0 = Math.round(origin.y);
    const y1 = y0 - this.tickMarkLength.value!;

    context.beginPath();
    context.strokeStyle = this.tickMarkColor.value!.toString();
    context.lineWidth = this.tickMarkWidth.value!;
    context.moveTo(x, y0);
    context.lineTo(x, y1);
    context.stroke();

    const gridLineWidth = this.gridLineWidth.value!;
    if (gridLineWidth !== 0 && frame.xMin < x && x < frame.xMax) {
      context.beginPath();
      context.strokeStyle = this.gridLineColor.value!.toString();
      context.lineWidth = gridLineWidth;
      context.moveTo(x, y0);
      context.lineTo(x, frame.yMax);
      context.stroke();
    }
  }
}
TickView.Top = TopTickView;
