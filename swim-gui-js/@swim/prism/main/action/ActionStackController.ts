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
import {ActionButton} from "./ActionButton";
import {ActionItem} from "./ActionItem";
import {ActionStackState, ActionStack} from "./ActionStack";
import {ActionStackObserver} from "./ActionStackObserver";

export class ActionStackController<V extends ActionStack = ActionStack> extends HtmlViewController<V> implements ActionStackObserver<V> {
  get stackState(): ActionStackState | null {
    return this._view ? this._view.stackState : null;
  }

  get button(): ActionButton | null {
    return this._view ? this._view.button : null;
  }

  get items(): ReadonlyArray<ActionItem> {
    return this._view ? this._view.items : [];
  }

  removeItems(): void {
    if (this._view) {
      this._view.removeItems();
    }
  }

  actionStackDidPress(view: V): void {
    // hook
  }

  actionStackDidPressHold(view: V): void {
    // hook
  }

  actionStackDidLongPress(view: V): void {
    // hook
  }

  actionStackDidContextPress(view: V): void {
    // hook
  }

  actionStackWillExpand(view: V): void {
    // hook
  }

  actionStackDidExpand(view: V): void {
    // hook
  }

  actionStackWillCollapse(view: V): void {
    // hook
  }

  actionStackDidCollapse(view: V): void {
    // hook
  }

  actionStackWillShow(view: V): void {
    // hook
  }

  actionStackDidShow(view: V): void {
    // hook
  }

  actionStackWillHide(view: V): void {
    // hook
  }

  actionStackDidHide(view: V): void {
    // hook
  }
}
