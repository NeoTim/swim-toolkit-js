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

import {ModelContextType, ModelContext} from "../ModelContext";
import {ModelFlags, Model} from "../Model";
import {ModelObserverType, ModelObserver} from "../ModelObserver";
import {ModelControllerType, ModelController} from "../ModelController";
import {ModelService} from "../service/ModelService";
import {ModelScope} from "../scope/ModelScope";

export abstract class GenericModel extends Model {
  /** @hidden */
  _key?: string;
  /** @hidden */
  _parentModel: Model | null;
  /** @hidden */
  _modelController: ModelControllerType<this> | null;
  /** @hidden */
  _modelObservers?: ModelObserverType<this>[];
  /** @hidden */
  _modelFlags: ModelFlags;
  /** @hidden */
  _modelServices?: {[serviceName: string]: ModelService<Model, unknown> | undefined};
  /** @hidden */
  _modelScopes?: {[scopeName: string]: ModelScope<Model, unknown> | undefined};

  constructor() {
    super();
    this._parentModel = null;
    this._modelController = null;
    this._modelFlags = 0;
  }

  get modelController(): ModelController | null {
    return this._modelController;
  }

  setModelController(newModelController: ModelControllerType<this> | null): void {
    const oldModelController = this._modelController;
    if (oldModelController !== newModelController) {
      this.willSetModelController(newModelController);
      if (oldModelController !== null) {
        oldModelController.setModel(null);
      }
      this._modelController = newModelController;
      if (newModelController !== null) {
        newModelController.setModel(this);
      }
      this.onSetModelController(newModelController);
      this.didSetModelController(newModelController);
    }
  }

  get modelObservers(): ReadonlyArray<ModelObserver> {
    let modelObservers = this._modelObservers;
    if (modelObservers === void 0) {
      modelObservers = [];
      this._modelObservers = modelObservers;
    }
    return modelObservers;
  }

  addModelObserver(modelObserver: ModelObserverType<this>): void {
    let modelObservers = this._modelObservers;
    let index: number;
    if (modelObservers === void 0) {
      modelObservers = [];
      this._modelObservers = modelObservers;
      index = -1;
    } else {
      index = modelObservers.indexOf(modelObserver);
    }
    if (index < 0) {
      this.willAddModelObserver(modelObserver);
      modelObservers.push(modelObserver);
      this.onAddModelObserver(modelObserver);
      this.didAddModelObserver(modelObserver);
    }
  }

  removeModelObserver(modelObserver: ModelObserverType<this>): void {
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
      const index = modelObservers.indexOf(modelObserver);
      if (index >= 0) {
        this.willRemoveModelObserver(modelObserver);
        modelObservers.splice(index, 1);
        this.onRemoveModelObserver(modelObserver);
        this.didRemoveModelObserver(modelObserver);
      }
    }
  }

  protected willObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelController = this._modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
      for (let i = 0, n = modelObservers.length; i < n; i += 1) {
        result = callback.call(this, modelObservers[i]);
        if (result !== void 0) {
          return result;
        }
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelObservers = this._modelObservers;
    if (modelObservers !== void 0) {
      for (let i = 0, n = modelObservers.length; i < n; i += 1) {
        result = callback.call(this, modelObservers[i]);
        if (result !== void 0) {
          return result;
        }
      }
    }
    const modelController = this._modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  get key(): string | undefined {
    return this._key;
  }

  /** @hidden */
  setKey(key: string | undefined): void {
    if (key !== void 0) {
      this._key = key;
    } else if (this._key !== void 0) {
      this._key = void 0;
    }
  }

  get parentModel(): Model | null {
    return this._parentModel;
  }

  /** @hidden */
  setParentModel(newParentModel: Model | null, oldParentModel: Model | null) {
    this.willSetParentModel(newParentModel, oldParentModel);
    this._parentModel = newParentModel;
    this.onSetParentModel(newParentModel, oldParentModel);
    this.didSetParentModel(newParentModel, oldParentModel);
  }

  abstract get childModelCount(): number;

  abstract get childModels(): ReadonlyArray<Model>;

  abstract forEachChildModel<T, S = unknown>(callback: (this: S, childModel: Model) => T | void,
                                             thisArg?: S): T | undefined;

  abstract getChildModel(key: string): Model | null;

  abstract setChildModel(key: string, newChildModel: Model | null): Model | null;

  abstract appendChildModel(childModel: Model, key?: string): void;

  abstract prependChildModel(childModel: Model, key?: string): void;

  abstract insertChildModel(childModel: Model, targetModel: Model | null, key?: string): void;

  cascadeInsert(updateFlags?: ModelFlags, modelContext?: ModelContext): void {
    // nop
  }

  abstract removeChildModel(key: string): Model | null;
  abstract removeChildModel(childModel: Model): void;

  abstract removeAll(): void;

  remove(): void {
    const parentModel = this._parentModel;
    if (parentModel !== null) {
      if ((this._modelFlags & Model.TraversingFlag) === 0) {
        parentModel.removeChildModel(this);
      } else {
        this._modelFlags |= Model.RemovingFlag;
      }
    }
  }

  /** @hidden */
  get modelFlags(): ModelFlags {
    return this._modelFlags;
  }

  /** @hidden */
  setModelFlags(modelFlags: ModelFlags): void {
    this._modelFlags = modelFlags;
  }

  mount(): void {
    if (this._parentModel === null) {
      if (!this.isMounted()) {
        this.cascadeMount();
      }
      if (!this.isPowered() && document.visibilityState === "visible") {
        this.cascadePower();
      }
      this.cascadeInsert();
    }
  }

  cascadeMount(): void {
    if ((this._modelFlags & Model.MountedFlag) === 0) {
      this._modelFlags |= Model.MountedFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willMount();
        this.onMount();
        this.doMountChildModels();
        this.didMount();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already mounted");
    }
  }

  protected onMount(): void {
    super.onMount();
    this.mountServices();
    this.mountScopes();
  }

  /** @hidden */
  protected doMountChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeMount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeUnmount(): void {
    if ((this._modelFlags & Model.MountedFlag) !== 0) {
      this._modelFlags &= ~Model.MountedFlag
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willUnmount();
        this.doUnmountChildModels();
        this.onUnmount();
        this.didUnmount();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already unmounted");
    }
  }

  protected onUnmount(): void {
    this.unmountScopes();
    this.unmountServices();
    this._modelFlags &= ~Model.ModelFlagMask | Model.RemovingFlag;
  }

  /** @hidden */
  protected doUnmountChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeUnmount();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadePower(): void {
    if ((this._modelFlags & Model.PoweredFlag) === 0) {
      this._modelFlags |= Model.PoweredFlag;
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willPower();
        this.onPower();
        this.doPowerChildModels();
        this.didPower();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already powered");
    }
  }

  /** @hidden */
  protected doPowerChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadePower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeUnpower(): void {
    if ((this._modelFlags & Model.PoweredFlag) !== 0) {
      this._modelFlags &= ~Model.PoweredFlag
      this._modelFlags |= Model.TraversingFlag;
      try {
        this.willUnpower();
        this.doUnpowerChildModels();
        this.onUnpower();
        this.didUnpower();
      } finally {
        this._modelFlags &= ~Model.TraversingFlag;
      }
    } else {
      throw new Error("already unpowered");
    }
  }

  /** @hidden */
  protected doUnpowerChildModels(): void {
    this.forEachChildModel(function (childModel: Model): void {
      childModel.cascadeUnpower();
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    analyzeFlags |= this._modelFlags & Model.UpdateMask;
    analyzeFlags = this.needsAnalyze(analyzeFlags, extendedModelContext);
    this.doAnalyze(analyzeFlags, extendedModelContext);
  }

  /** @hidden */
  protected doAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = analyzeFlags;
    this._modelFlags |= Model.TraversingFlag | Model.AnalyzingFlag;
    this._modelFlags &= ~Model.NeedsAnalyze;
    try {
      this.willAnalyze(modelContext);
      if (((this._modelFlags | analyzeFlags) & Model.NeedsAggregate) !== 0) {
        this.willAggregate(modelContext);
        cascadeFlags |= Model.NeedsAggregate;
        this._modelFlags &= ~Model.NeedsAggregate;
      }

      this.onAnalyze(modelContext);
      if ((cascadeFlags & Model.NeedsAggregate) !== 0) {
        this.onAggregate(modelContext);
      }

      this.doAnalyzeChildModels(cascadeFlags, modelContext);

      if ((cascadeFlags & Model.NeedsAggregate) !== 0) {
        this.didAggregate(modelContext);
      }
      this.didAnalyze(modelContext);
    } finally {
      this._modelFlags &= ~(Model.TraversingFlag | Model.AnalyzingFlag);
    }
  }

  /** @hidden */
  protected doAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    if ((analyzeFlags & Model.AnalyzeMask) !== 0 && this.childModelCount !== 0) {
      this.willAnalyzeChildModels(analyzeFlags, modelContext);
      this.onAnalyzeChildModels(analyzeFlags, modelContext);
      this.didAnalyzeChildModels(analyzeFlags, modelContext);
    }
  }

  cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void {
    const extendedModelContext = this.extendModelContext(modelContext);
    refreshFlags |= this._modelFlags & Model.UpdateMask;
    refreshFlags = this.needsRefresh(refreshFlags, extendedModelContext);
    this.doRefresh(refreshFlags, extendedModelContext);
  }

  /** @hidden */
  protected doRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    let cascadeFlags = refreshFlags;
    this._modelFlags |= Model.TraversingFlag | Model.RefreshingFlag;
    this._modelFlags &= ~Model.NeedsRefresh;
    try {
      this.willRefresh(modelContext);
      if (((this._modelFlags | refreshFlags) & Model.NeedsFetch) !== 0) {
        this.willFetch(modelContext);
        cascadeFlags |= Model.NeedsFetch;
        this._modelFlags &= ~Model.NeedsFetch;
      }
      if (((this._modelFlags | refreshFlags) & Model.NeedsFlush) !== 0) {
        this.willFlush(modelContext);
        cascadeFlags |= Model.NeedsFlush;
        this._modelFlags &= ~Model.NeedsFlush;
      }

      this.onRefresh(modelContext);
      if ((cascadeFlags & Model.NeedsFetch) !== 0) {
        this.onFetch(modelContext);
      }
      if ((cascadeFlags & Model.NeedsFlush) !== 0) {
        this.onFlush(modelContext);
      }

      this.doRefreshChildModels(cascadeFlags, modelContext);

      if ((cascadeFlags & Model.NeedsFlush) !== 0) {
        this.didFlush(modelContext);
      }
      if ((cascadeFlags & Model.NeedsFetch) !== 0) {
        this.didFetch(modelContext);
      }
      this.didRefresh(modelContext);
    } finally {
      this._modelFlags &= ~(Model.TraversingFlag | Model.RefreshingFlag);
    }
  }

  /** @hidden */
  protected doRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    if ((refreshFlags & Model.RefreshMask) !== 0 && this.childModelCount !== 0) {
      this.willRefreshChildModels(refreshFlags, modelContext);
      this.onRefreshChildModels(refreshFlags, modelContext);
      this.didRefreshChildModels(refreshFlags, modelContext);
    }
  }

  hasModelService(serviceName: string): boolean {
    const modelServices = this._modelServices;
    return modelServices !== void 0 && modelServices[serviceName] !== void 0;
  }

  getModelService(serviceName: string): ModelService<this, unknown> | null {
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      const modelService = modelServices[serviceName];
      if (modelService !== void 0) {
        return modelService as ModelService<this, unknown>;
      }
    }
    return null;
  }

  setModelService(serviceName: string, newModelService: ModelService<this, unknown> | null): void {
    let modelServices = this._modelServices;
    if (modelServices === void 0) {
      modelServices = {};
      this._modelServices = modelServices;
    }
    const oldModelService = modelServices[serviceName];
    if (oldModelService !== void 0 && this.isMounted()) {
      oldModelService.unmount();
    }
    if (newModelService !== null) {
      modelServices[serviceName] = newModelService;
      if (this.isMounted()) {
        newModelService.mount();
      }
    } else {
      delete modelServices[serviceName];
    }
  }

  /** @hidden */
  protected mountServices(): void {
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      for (const serviceName in modelServices) {
        const modelService = modelServices[serviceName]!;
        modelService.mount();
      }
    }
  }

  /** @hidden */
  protected unmountServices(): void {
    const modelServices = this._modelServices;
    if (modelServices !== void 0) {
      for (const serviceName in modelServices) {
        const modelService = modelServices[serviceName]!;
        modelService.unmount();
      }
    }
  }

  hasModelScope(scopeName: string): boolean {
    const modelScopes = this._modelScopes;
    return modelScopes !== void 0 && modelScopes[scopeName] !== void 0;
  }

  getModelScope(scopeName: string): ModelScope<this, unknown> | null {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      const modelScope = modelScopes[scopeName];
      if (modelScope !== void 0) {
        return modelScope as ModelScope<this, unknown>;
      }
    }
    return null;
  }

  setModelScope(scopeName: string, newModelScope: ModelScope<this, unknown> | null): void {
    let modelScopes = this._modelScopes;
    if (modelScopes === void 0) {
      modelScopes = {};
      this._modelScopes = modelScopes;
    }
    const oldModelScope = modelScopes[scopeName];
    if (oldModelScope !== void 0 && this.isMounted()) {
      oldModelScope.unmount();
    }
    if (newModelScope !== null) {
      modelScopes[scopeName] = newModelScope;
      if (this.isMounted()) {
        newModelScope.mount();
      }
    } else {
      delete modelScopes[scopeName];
    }
  }

  /** @hidden */
  protected mountScopes(): void {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      for (const scopeName in modelScopes) {
        const modelScope = modelScopes[scopeName]!;
        modelScope.mount();
      }
    }
  }

  /** @hidden */
  protected unmountScopes(): void {
    const modelScopes = this._modelScopes;
    if (modelScopes !== void 0) {
      for (const scopeName in modelScopes) {
        const modelScope = modelScopes[scopeName]!;
        modelScope.unmount();
      }
    }
  }
}
Model.Generic = GenericModel;
