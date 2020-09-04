// Copyright 2015-2020 Swim inc.
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

import {ThemedHtmlViewObserver} from "@swim/theme";
import {PinView} from "./PinView";

export interface PinViewObserver<V extends PinView = PinView> extends ThemedHtmlViewObserver<V> {
  pinWillExpand?(view: V): void;

  pinDidExpand?(view: V): void;

  pinWillCollapse?(view: V): void;

  pinDidCollapse?(view: V): void;

  pinDidPressHead?(view: V): void;

  pinDidPressBody?(view: V): void;

  pinDidPressFoot?(view: V): void;
}
