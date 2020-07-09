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

import {Feel} from "../feel/Feel";
import {InterpolatedFeel} from "../feel/InterpolatedFeel";
import {BrightnessFeel} from "../feel/BrightnessFeel";

Feel.ambient = new InterpolatedFeel("ambient");
Feel.default = new InterpolatedFeel("default");

Feel.selected = new InterpolatedFeel("selected");
Feel.disabled = new InterpolatedFeel("disabled");
Feel.inactive = new InterpolatedFeel("inactive");
Feel.warning = new InterpolatedFeel("warning");
Feel.alert = new InterpolatedFeel("alert");

Feel.overlay = new InterpolatedFeel("overlay");
Feel.floating = new InterpolatedFeel("floating");
Feel.nested = new BrightnessFeel("nested");

Feel.hovering = new InterpolatedFeel("hovering");