// Copyright 2015-2019 SWIM.AI inc.
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

import {HtmlViewController} from "@swim/view";
import {RackItem} from "./RackItem";
import {RackView} from "./RackView";
import {RackViewObserver} from "./RackViewObserver";

export class RackViewController<V extends RackView = RackView> extends HtmlViewController<V> implements RackViewObserver<V> {
  rackDidClickItem(item: RackItem, view: V): void {
    // hook
  }
}