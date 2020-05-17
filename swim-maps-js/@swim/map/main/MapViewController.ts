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

import {View, RenderedViewController} from "@swim/view";
import {MapViewContext} from "./MapViewContext";
import {MapView} from "./MapView";
import {MapViewObserver} from "./MapViewObserver";

export interface MapViewController<V extends MapView = MapView> extends RenderedViewController<V>, MapViewObserver<V> {
  readonly view: V | null;

  setView(view: V | null): void;

  viewWillSetParentView(newParentView: View | null, oldParentView: View | null, view: V): void;

  viewDidSetParentView(newParentView: View | null, oldParentView: View | null, view: V): void;

  viewWillInsertChildView(childView: View, targetView: View | null | undefined, view: V): void;

  viewDidInsertChildView(childView: View, targetView: View | null | undefined, view: V): void;

  viewWillRemoveChildView(childView: View, view: V): void;

  viewDidRemoveChildView(childView: View, view: V): void;

  viewWillMount(view: V): void;

  viewDidMount(view: V): void;

  viewWillUnmount(view: V): void;

  viewDidUnmount(view: V): void;

  viewWillPower(view: V): void;

  viewDidPower(view: V): void;

  viewWillUnpower(view: V): void;

  viewDidUnpower(view: V): void;

  viewWillProcess(viewContext: MapViewContext, view: V): void;

  viewDidProcess(viewContext: MapViewContext, view: V): void;

  viewWillScroll(viewContext: MapViewContext, view: V): void;

  viewDidScroll(viewContext: MapViewContext, view: V): void;

  viewWillDerive(viewContext: MapViewContext, view: V): void;

  viewDidDerive(viewContext: MapViewContext, view: V): void;

  viewWillAnimate(viewContext: MapViewContext, view: V): void;

  viewDidAnimate(viewContext: MapViewContext, view: V): void;

  viewWillProject(viewContext: MapViewContext, view: V): void;

  viewDidProject(viewContext: MapViewContext, view: V): void;

  viewWillProcessChildViews(viewContext: MapViewContext, view: V): void;

  viewDidProcessChildViews(viewContext: MapViewContext, view: V): void;

  viewWillDisplay(viewContext: MapViewContext, view: V): void;

  viewDidDisplay(viewContext: MapViewContext, view: V): void;

  viewWillLayout(viewContext: MapViewContext, view: V): void;

  viewDidLayout(viewContext: MapViewContext, view: V): void;

  viewWillRender(viewContext: MapViewContext, view: V): void;

  viewDidRender(viewContext: MapViewContext, view: V): void;

  viewWillDisplayChildViews(viewContext: MapViewContext, view: V): void;

  viewDidDisplayChildViews(viewContext: MapViewContext, view: V): void;

  viewWillSetHidden(hidden: boolean, view: V): boolean | void;

  viewDidSetHidden(hidden: boolean, view: V): void;

  viewWillSetCulled(culled: boolean, view: V): boolean | void;

  viewDidSetCulled(culled: boolean, view: V): void;
}
