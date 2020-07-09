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

import {Length} from "@swim/length";
import {Color} from "@swim/color";
import {Font} from "@swim/font";
import {BoxShadow} from "@swim/shadow";
import {Ease, Transition} from "@swim/transition";
import {Look} from "../look/Look";
import {Feel} from "../feel/Feel";
import {FeelVector} from "../feel/FeelVector";
import {Theme} from "../theme/Theme";
import {ThemeMatrix} from "../theme/ThemeMatrix";

const LightFont = Font.parse("14px -apple-system, system-ui, sans-serif");

const LightColor = Color.parse("#4a4a4a");
const LightMutedColor = Color.parse("#989898");
const LightNeutralColor = Color.parse("#808080");
const LightPrimaryColor = Color.parse("#49cbad");
const LightSecondaryColor = Color.parse("#00a6ed");
const LightHighlightColor = Color.black(0.05);

const LightBackgroundColor = Color.white();
const LightBorderColor = LightBackgroundColor.darker(1 / 2);

const LightOverlayColor = Color.parse("#efefef");
const LightSelectedColor = LightOverlayColor.darker(1 / 2);
const LightDisabledColor = Color.parse("#7b7c7d");
const LightInactiveColor = Color.parse("#7b7c7d");
const LightWarningColor = Color.parse("#d3ca46");
const LightAlertColor = Color.parse("#f6511d");

const LightSpacing = Length.px(10);
const LightTransition = Transition.duration(250, Ease.cubicOut);

const LightAmbient = FeelVector.of(
  [Look.font, LightFont],

  [Look.color, LightColor],
  [Look.mutedColor, LightMutedColor],
  [Look.neutralColor, LightNeutralColor],
  [Look.primaryColor, LightPrimaryColor],
  [Look.secondaryColor, LightSecondaryColor],
  [Look.highlightColor, LightHighlightColor],

  [Look.backgroundColor, LightBackgroundColor],
  [Look.borderColor, LightBorderColor],

  [Look.spacing, LightSpacing],
  [Look.transition, Transition.duration(1000, Ease.linear)],
);

const LightOrdinary = FeelVector.of(
  [Look.font, LightFont],

  [Look.color, LightColor],
  [Look.mutedColor, LightMutedColor],
  [Look.neutralColor, LightNeutralColor],
  [Look.primaryColor, LightPrimaryColor],
  [Look.secondaryColor, LightSecondaryColor],
  [Look.highlightColor, LightHighlightColor],

  [Look.backgroundColor, LightBackgroundColor],
  [Look.borderColor, LightBorderColor],

  [Look.spacing, LightSpacing],
  [Look.transition, LightTransition],
);

const LightSelected = FeelVector.of(
  [Look.backgroundColor, LightSelectedColor],
);

const LightDisabled = FeelVector.of(
  [Look.color, LightDisabledColor],
  [Look.primaryColor, LightDisabledColor],
  [Look.secondaryColor, LightDisabledColor],
);

const LightInactive = FeelVector.of(
  [Look.primaryColor, LightInactiveColor],
  [Look.secondaryColor, LightInactiveColor],
);

const LightWarning = FeelVector.of(
  [Look.primaryColor, LightWarningColor],
  [Look.secondaryColor, LightWarningColor],
);

const LightAlert = FeelVector.of(
  [Look.primaryColor, LightAlertColor],
  [Look.secondaryColor, LightAlertColor],
);

const LightOverlay = FeelVector.of(
  [Look.mutedColor, LightMutedColor.darker(1 / 3)],
  [Look.neutralColor, LightNeutralColor.darker(1 / 3)],

  [Look.backgroundColor, LightOverlayColor],
);

const LightFloating = FeelVector.of(
  [Look.shadow, BoxShadow.of(0, 2, 4, 0, Color.black(0.5))],
);

const LightNested = FeelVector.of(
  [Look.primaryColor, Color.black(1 / 16)],
  [Look.secondaryColor, Color.black(1 / 16)],

  [Look.backgroundColor, Color.black(1 / 16)],
  [Look.borderColor, Color.black(1 / 16)],
);

const LightHovering = FeelVector.of(
  [Look.primaryColor, LightPrimaryColor.darker(1 / 3)],
  [Look.secondaryColor, LightSecondaryColor.darker(1 / 3)],

  [Look.backgroundColor, LightBackgroundColor.darker(1 / 3)],
);

const LightTheme = ThemeMatrix.forCols(
  [Feel.ambient, LightAmbient],
  [Feel.default, LightOrdinary],

  [Feel.selected, LightSelected],
  [Feel.disabled, LightDisabled],
  [Feel.inactive, LightInactive],
  [Feel.warning, LightWarning],
  [Feel.alert, LightAlert],

  [Feel.overlay, LightOverlay],
  [Feel.floating, LightFloating],
  [Feel.nested, LightNested],

  [Feel.hovering, LightHovering],
);

Theme.light = LightTheme;