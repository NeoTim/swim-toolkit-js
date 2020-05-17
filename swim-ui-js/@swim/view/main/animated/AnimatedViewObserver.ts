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

import {ViewObserver} from "../ViewObserver";
import {AnimatedViewContext} from "./AnimatedViewContext";
import {AnimatedView} from "./AnimatedView";

export interface AnimatedViewObserver<V extends AnimatedView = AnimatedView> extends ViewObserver<V> {
  viewWillProcess?(viewContext: AnimatedViewContext, view: V): void;

  viewDidProcess?(viewContext: AnimatedViewContext, view: V): void;

  viewWillScroll?(viewContext: AnimatedViewContext, view: V): void;

  viewDidScroll?(viewContext: AnimatedViewContext, view: V): void;

  viewWillDerive?(viewContext: AnimatedViewContext, view: V): void;

  viewDidDerive?(viewContext: AnimatedViewContext, view: V): void;

  viewWillAnimate?(viewContext: AnimatedViewContext, view: V): void;

  viewDidAnimate?(viewContext: AnimatedViewContext, view: V): void;

  viewWillProcessChildViews?(viewContext: AnimatedViewContext, view: V): void;

  viewDidProcessChildViews?(viewContext: AnimatedViewContext, view: V): void;

  viewWillDisplay?(viewContext: AnimatedViewContext, view: V): void;

  viewDidDisplay?(viewContext: AnimatedViewContext, view: V): void;

  viewWillLayout?(viewContext: AnimatedViewContext, view: V): void;

  viewDidLayout?(viewContext: AnimatedViewContext, view: V): void;

  viewWillDisplayChildViews?(viewContext: AnimatedViewContext, view: V): void;

  viewDidDisplayChildViews?(viewContext: AnimatedViewContext, view: V): void;
}
