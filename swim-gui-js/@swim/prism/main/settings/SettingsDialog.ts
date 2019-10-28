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

import {Color} from "@swim/color";
import {BoxShadow} from "@swim/style";
import {PopoverView, PopoverViewController} from "@swim/view";
import {ShellView} from "../shell/ShellView";

export class SettingsDialog extends PopoverView {
  /** @hidden */
  _viewController: PopoverViewController<SettingsDialog> | null;

  constructor(node?: HTMLElement, key: string | null = null) {
    super(node, key);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: HTMLElement) {
    this.addClass("settings-dialog")
        .minWidth(320)
        .height(360)
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .backgroundColor("#2c2d30")
        .zIndex(10);
  }

  get viewController(): PopoverViewController<SettingsDialog> | null {
    return this._viewController;
  }

  protected onMount(): void {
    this.on("click", this.onClick);
    this.onResize();
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
  }

  protected onResize(): void {
    const appView = this.appView;
    if (appView instanceof ShellView) {
      this.placement(["below"])
          .height(appView._node.offsetHeight - appView.beamHeight.value);
    }
  }

  protected didHide(): void {
    super.didHide();
    this.remove();
  }

  protected onClick(event: MouseEvent): void {
    //event.stopPropagation();
  }
}
