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

import {View} from "../View";
import {LayoutManager} from "../layout/LayoutManager";
import {LayoutManagerObserver} from "../layout/LayoutManagerObserver";
import {ViewService} from "./ViewService";

/** @hidden */
export abstract class LayoutManagerService<V extends View> extends ViewService<V, LayoutManager> {
  /** @hidden */
  observer?: boolean;

  mount(): void {
    super.mount();
    const state = this._state;
    if (state !== void 0) {
      state.insertRootView(this._view);
      if (this.observer === true) {
        state.addViewManagerObserver(this as LayoutManagerObserver<V>);
      }
    }
  }

  unmount(): void {
    const state = this._state;
    if (state !== void 0) {
      if (this.observer === true) {
        state.removeViewManagerObserver(this as LayoutManagerObserver<V>);
      }
      state.removeRootView(this._view);
    }
    super.unmount();
  }

  init(): LayoutManager | undefined {
    return LayoutManager.global();
  }
}
ViewService.Layout = LayoutManagerService;

ViewService({type: LayoutManager})(View.prototype, "layoutManager");
