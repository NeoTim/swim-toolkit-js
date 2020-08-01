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
import {ViewManagerObserver} from "../manager/ViewManagerObserver";
import {ModalOptions, Modal} from "./Modal";
import {ModalManager} from "./ModalManager";

export interface ModalObserver<V extends View = View, M extends ModalManager<V> = ModalManager<V>> extends ViewManagerObserver<V, M> {
  managerWillPresentModal?(modal: Modal, options: ModalOptions, manager: M): void;

  managerDidPresentModal?(modal: Modal, options: ModalOptions, manager: M): void;

  managerWillDismissModal?(modal: Modal, manager: M): void;

  managerDidDismissModal?(modal: Modal, manager: M): void;

  managerWillUpdateModality?(newModality: number, oldModality: number, manager: M): void;

  managerDidUpdateModality?(newModality: number, oldModality: number, manager: M): void;

  managerWillDisruptModals?(event: Event | null, manager: M): void | boolean;

  managerDidDisruptModals?(event: Event | null, manager: M): void;
}