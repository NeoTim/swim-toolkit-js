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

import {Tween, Transition} from "@swim/transition";
import {View, ViewNodeType, SvgView, HtmlView} from "@swim/view";
import {PositionGestureDelegate} from "@swim/gesture";
import {
  Look,
  Feel,
  MoodVector,
  ThemeMatrix,
  ThemedHtmlViewObserver,
  ThemedHtmlViewController,
} from "@swim/theme";
import {ButtonObserver} from "./ButtonObserver";
import {ButtonMorph} from "./ButtonMorph";
import {ButtonMembrane} from "./ButtonMembrane";

export class IconButton extends ButtonMembrane implements PositionGestureDelegate {
  constructor(node: HTMLElement) {
    super(node);
    this.onClick = this.onClick.bind(this);
  }

  protected initNode(node: ViewNodeType<this>): void {
    super.initNode(node);
    this.addClass("icon-button");
    this.position.setAutoState("relative");
    this.width.setAutoState(44);
    this.height.setAutoState(44);
    this.display.setAutoState("flex");
    this.justifyContent.setAutoState("center");
    this.alignItems.setAutoState("center");
    this.borderTopLeftRadius.setAutoState(4);
    this.borderTopRightRadius.setAutoState(4);
    this.borderBottomLeftRadius.setAutoState(4);
    this.borderBottomRightRadius.setAutoState(4);
    this.overflowX.setAutoState("hidden");
    this.overflowY.setAutoState("hidden");
    this.userSelect.setAutoState("none");
    this.cursor.setAutoState("pointer");
  }

  readonly viewController: ThemedHtmlViewController & ButtonObserver | null;

  readonly viewObservers: ReadonlyArray<ThemedHtmlViewObserver & ButtonObserver>;

  get morph(): ButtonMorph | null {
    const childView = this.getChildView("morph");
    return childView instanceof ButtonMorph ? childView : null;
  }

  get icon(): SvgView | HtmlView | null {
    const morph = this.morph;
    return morph !== null ? morph.icon : null;
  }

  setIcon(icon: SvgView | HtmlView | null, tween?: Tween<any>, ccw: boolean = false): void {
    let morph = this.morph;
    if (morph === null) {
      morph = this.append(ButtonMorph, "morph");
    }
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      const iconLook = this._gesture._hoverCount !== 0 ? Look.color : Look.mutedColor;
      icon.fill.setAutoState(this.getLook(iconLook), tween);
    }
    morph.setIcon(icon, tween, ccw);
  }

  protected onApplyTheme(theme: ThemeMatrix, mood: MoodVector,
                         transition: Transition<any> | null): void {
    super.onApplyTheme(theme, mood, transition);

    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(theme.inner(mood, Look.backgroundColor), transition);
    }

    const icon = this.icon;
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      const iconLook = this._gesture._hoverCount !== 0 ? Look.color : Look.mutedColor;
      icon.fill.setAutoState(theme.inner(mood, iconLook), transition);
    }
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    super.onUnmount();
  }

  protected onInsertChildView(childView: View, targetView: View | null | undefined): void {
    super.onInsertChildView(childView, targetView);
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof ButtonMorph) {
      this.onInsertMorph(childView);
    }
  }

  protected onRemoveChildView(childView: View): void {
    const childKey = childView.key;
    if (childKey === "morph" && childView instanceof ButtonMorph) {
      this.onRemoveMorph(childView);
    }
    super.onRemoveChildView(childView);
  }

  protected onInsertMorph(morph: ButtonMorph): void {
    // hook
  }

  protected onRemoveMorph(morph: ButtonMorph): void {
    // hook
  }

  get hovers(): boolean {
    return true;
  }

  setHovers(hovers: boolean): void {
    if (this.hovers !== hovers) {
      Object.defineProperty(this, "hovers", {
        value: hovers,
        configurable: true,
        enumerable: true,
      });
    }
  }

  didStartHovering(): void {
    if (this.hovers) {
      this.modifyMood(Feel.default, [Feel.hovering, 1]);
      const transition = this.getLook(Look.transition);
      if (this.backgroundColor.isAuto()) {
        this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), transition);
      }
      const icon = this.icon;
      if (icon instanceof SvgView && icon.fill.isAuto()) {
        icon.fill.setAutoState(this.getLook(Look.color), transition);
      }
    }
  }

  didStopHovering(): void {
    this.modifyMood(Feel.default, [Feel.hovering, void 0]);
    const transition = this.getLook(Look.transition);
    if (this.backgroundColor.isAuto()) {
      this.backgroundColor.setAutoState(this.getLook(Look.backgroundColor), transition);
    }
    const icon = this.icon;
    if (icon instanceof SvgView && icon.fill.isAuto()) {
      icon.fill.setAutoState(this.getLook(Look.mutedColor), transition);
    }
  }

  protected onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.didObserve(function (viewObserver: ButtonObserver): void {
      if (viewObserver.buttonDidPress !== void 0) {
        viewObserver.buttonDidPress(this);
      }
    });
  }
}
