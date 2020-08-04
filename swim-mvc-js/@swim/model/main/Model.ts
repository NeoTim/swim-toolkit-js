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

import {ModelContextType, ModelContext} from "./ModelContext";
import {ModelObserverType, ModelObserver} from "./ModelObserver";
import {ModelControllerType, ModelController} from "./ModelController";
import {ModelManager} from "./manager/ModelManager";
import {RefreshManager} from "./refresh/RefreshManager";
import {ModelServiceDescriptor, ModelServiceConstructor, ModelService} from "./service/ModelService";
import {ModelScopeDescriptor, ModelScopeConstructor, ModelScope} from "./scope/ModelScope";
import {GenericModel} from "./generic/GenericModel";
import {GenericLeafModel} from "./generic/GenericLeafModel";
import {GenericNodeModel} from "./generic/GenericNodeModel";

export type ModelFlags = number;

export interface ModelInit {
  key?: string;
  modelController?: ModelController;
}

export interface ModelClass {
  readonly mountFlags: ModelFlags;

  readonly powerFlags: ModelFlags;

  readonly insertChildFlags: ModelFlags;

  readonly removeChildFlags: ModelFlags;

  /** @hidden */
  _modelServiceDescriptors?: {[serviceName: string]: ModelServiceDescriptor<Model, unknown> | undefined};

  /** @hidden */
  _modelScopeDescriptors?: {[scopeName: string]: ModelScopeDescriptor<Model, unknown> | undefined};
}

export abstract class Model {
  abstract get modelController(): ModelController | null;

  abstract setModelController(modelController: ModelControllerType<this> | null): void;

  protected willSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected onSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  protected didSetModelController(modelController: ModelControllerType<this> | null): void {
    // hook
  }

  abstract get modelObservers(): ReadonlyArray<ModelObserver>;

  abstract addModelObserver(modelObserver: ModelObserverType<this>): void;

  protected willAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didAddModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  abstract removeModelObserver(modelObserver: ModelObserverType<this>): void;

  protected willRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected onRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected didRemoveModelObserver(modelObserver: ModelObserverType<this>): void {
    // hook
  }

  protected willObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    const modelObservers = this.modelObservers;
    for (let i = 0, n = modelObservers.length; i < n; i += 1) {
      result = callback.call(this, modelObservers[i]);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, modelObserver: ModelObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const modelObservers = this.modelObservers;
    for (let i = 0, n = modelObservers.length; i < n; i += 1) {
      result = callback.call(this, modelObservers[i]);
      if (result !== void 0) {
        return result;
      }
    }
    const modelController = this.modelController;
    if (modelController !== null) {
      result = callback.call(this, modelController);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  initModel(init: ModelInit): void {
    if (init.modelController !== void 0) {
      this.setModelController(init.modelController as ModelControllerType<this>);
    }
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentModel(): Model | null;

  /** @hidden */
  abstract setParentModel(newParentModel: Model | null, oldParentModel: Model | null): void;

  protected willSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillSetParentModel !== void 0) {
        modelObserver.modelWillSetParentModel(newParentModel, oldParentModel, this);
      }
    });
  }

  protected onSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    // hook
  }

  protected didSetParentModel(newParentModel: Model | null, oldParentModel: Model | null): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidSetParentModel !== void 0) {
        modelObserver.modelDidSetParentModel(newParentModel, oldParentModel, this);
      }
    });
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

  get insertChildFlags(): ModelFlags {
    return this.modelClass.insertChildFlags;
  }

  protected willInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillInsertChildModel !== void 0) {
        modelObserver.modelWillInsertChildModel(childModel, targetModel, this);
      }
    });
  }

  protected onInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildModel(childModel: Model, targetModel: Model | null | undefined): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidInsertChildModel !== void 0) {
        modelObserver.modelDidInsertChildModel(childModel, targetModel, this);
      }
    });
  }

  abstract cascadeInsert(updateFlags?: ModelFlags, modelContext?: ModelContext): void;

  abstract removeChildModel(key: string): Model | null;
  abstract removeChildModel(childModel: Model): void;

  abstract removeAll(): void;

  abstract remove(): void;

  get removeChildFlags(): ModelFlags {
    return this.modelClass.removeChildFlags;
  }

  protected willRemoveChildModel(childModel: Model): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRemoveChildModel !== void 0) {
        modelObserver.modelWillRemoveChildModel(childModel, this);
      }
    });
  }

  protected onRemoveChildModel(childModel: Model): void {
    this.requireUpdate(this.removeChildFlags);
  }

  protected didRemoveChildModel(childModel: Model): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRemoveChildModel !== void 0) {
        modelObserver.modelDidRemoveChildModel(childModel, this);
      }
    });
  }

  getSuperModel<M extends Model>(modelClass: {new(...args: any[]): M}): M | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else if (parentModel instanceof modelClass) {
      return parentModel;
    } else {
      return parentModel.getSuperModel(modelClass);
    }
  }

  getBaseModel<M extends Model>(modelClass: {new(...args: any[]): M}): M | null {
    const parentModel = this.parentModel;
    if (parentModel === null) {
      return null;
    } else if (parentModel instanceof modelClass) {
      const baseModel = parentModel.getBaseModel(modelClass);
      return baseModel !== null ? baseModel : parentModel;
    } else {
      return parentModel.getBaseModel(modelClass);
    }
  }

  refreshManager: ModelService<this, RefreshManager>; // defined by RefreshManagerService

  get modelClass(): ModelClass {
    return this.constructor as unknown as ModelClass;
  }

  /** @hidden */
  abstract get modelFlags(): ModelFlags;

  /** @hidden */
  abstract setModelFlags(modelFlags: ModelFlags): void;

  isMounted(): boolean {
    return (this.modelFlags & Model.MountedFlag) !== 0;
  }

  abstract cascadeMount(): void;

  get mountFlags(): ModelFlags {
    return this.modelClass.mountFlags;
  }

  protected willMount(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillMount !== void 0) {
        modelObserver.modelWillMount(this);
      }
    });
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidMount !== void 0) {
        modelObserver.modelDidMount(this);
      }
    });
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillUnmount !== void 0) {
        modelObserver.modelWillUnmount(this);
      }
    });
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidUnmount !== void 0) {
        modelObserver.modelDidUnmount(this);
      }
    });
  }

  isPowered(): boolean {
    return (this.modelFlags & Model.PoweredFlag) !== 0;
  }

  abstract cascadePower(): void;

  get powerFlags(): ModelFlags {
    return this.modelClass.powerFlags;
  }

  protected willPower(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillPower !== void 0) {
        modelObserver.modelWillPower(this);
      }
    });
  }

  protected onPower(): void {
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidPower !== void 0) {
        modelObserver.modelDidPower(this);
      }
    });
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillUnpower !== void 0) {
        modelObserver.modelWillUnpower(this);
      }
    });
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidUnpower !== void 0) {
        modelObserver.modelDidUnpower(this);
      }
    });
  }

  requireUpdate(updateFlags: ModelFlags, immediate: boolean = false): void {
    updateFlags &= ~Model.StatusMask;
    if (updateFlags !== 0) {
      this.willRequireUpdate(updateFlags, immediate);
      const oldUpdateFlags = this.modelFlags;
      const newUpdateFlags = oldUpdateFlags | updateFlags;
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags;
      if (deltaUpdateFlags !== 0) {
        this.setModelFlags(newUpdateFlags);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    updateFlags = this.willRequestUpdate(targetModel, updateFlags, immediate);
    const parentModel = this.parentModel;
    if (parentModel !== null) {
      parentModel.requestUpdate(targetModel, updateFlags, immediate);
    } else if (this.isMounted()) {
      const refreshManager = this.refreshManager.state;
      if (refreshManager !== void 0) {
        refreshManager.requestUpdate(targetModel, updateFlags, immediate);
      }
    }
    this.didRequestUpdate(targetModel, updateFlags, immediate);
  }

  protected willRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): ModelFlags {
    let additionalFlags = this.modifyUpdate(targetModel, updateFlags);
    additionalFlags &= ~Model.StatusMask;
    if (additionalFlags !== 0) {
      updateFlags |= additionalFlags;
      this.setModelFlags(this.modelFlags | additionalFlags);
    }
    return updateFlags;
  }

  protected didRequestUpdate(targetModel: Model, updateFlags: ModelFlags, immediate: boolean): void {
    // hook
  }

  protected modifyUpdate(targetModel: Model, updateFlags: ModelFlags): ModelFlags {
    let additionalFlags = 0;
    if ((updateFlags & Model.AnalyzeMask) !== 0) {
      additionalFlags |= Model.NeedsAnalyze;
    }
    if ((updateFlags & Model.RefreshMask) !== 0) {
      additionalFlags |= Model.NeedsRefresh;
    }
    return additionalFlags;
  }

  isTraversing(): boolean {
    return (this.modelFlags & Model.TraversingFlag) !== 0;
  }

  isUpdating(): boolean {
    return (this.modelFlags & Model.UpdatingMask) !== 0;
  }

  isAnalyzing(): boolean {
    return (this.modelFlags & Model.AnalyzingFlag) !== 0;
  }

  needsAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): ModelFlags {
    return analyzeFlags;
  }

  abstract cascadeAnalyze(analyzeFlags: ModelFlags, modelContext: ModelContext): void;

  protected willAnalyze(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAnalyze !== void 0) {
        modelObserver.modelWillAnalyze(modelContext, this);
      }
    });
  }

  protected onAnalyze(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didAnalyze(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAnalyze !== void 0) {
        modelObserver.modelDidAnalyze(modelContext, this);
      }
    });
  }

  protected willAggregate(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAggregate !== void 0) {
        modelObserver.modelWillAggregate(modelContext, this);
      }
    });
  }

  protected onAggregate(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didAggregate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAggregate !== void 0) {
        modelObserver.modelDidAggregate(modelContext, this);
      }
    });
  }

  protected willCorrelate(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillCorrelate !== void 0) {
        modelObserver.modelWillCorrelate(modelContext, this);
      }
    });
  }

  protected onCorrelate(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didCorrelate(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidCorrelate !== void 0) {
        modelObserver.modelDidCorrelate(modelContext, this);
      }
    });
  }

  protected willAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillAnalyzeChildModels !== void 0) {
        modelObserver.modelWillAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
  }

  protected onAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.analyzeChildModels(analyzeFlags, modelContext);
  }

  protected didAnalyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidAnalyzeChildModels !== void 0) {
        modelObserver.modelDidAnalyzeChildModels(analyzeFlags, modelContext, this);
      }
    });
  }

  protected analyzeChildModels(analyzeFlags: ModelFlags, modelContext: ModelContextType<this>,
                               callback?: (this: this, childModel: Model) => void): void {
    this.forEachChildModel(function (childModel: Model): void {
      this.analyzeChildModel(childModel, analyzeFlags, modelContext);
      if (callback !== void 0) {
        callback.call(this, childModel);
      }
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  /** @hidden */
  protected analyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    this.onAnalyzeChildModel(childModel, analyzeFlags, modelContext);
    this.didAnalyzeChildModel(childModel, analyzeFlags, modelContext);
  }

  protected willAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // hook
  }

  protected onAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    childModel.cascadeAnalyze(analyzeFlags, modelContext);
  }

  protected didAnalyzeChildModel(childModel: Model, analyzeFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // hook
  }

  isRefreshing(): boolean {
    return (this.modelFlags & Model.RefreshingFlag) !== 0;
  }

  needsRefresh(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): ModelFlags {
    return refreshFlags;
  }

  abstract cascadeRefresh(refreshFlags: ModelFlags, modelContext: ModelContext): void;

  protected willRefresh(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRefresh !== void 0) {
        modelObserver.modelWillRefresh(modelContext, this);
      }
    });
  }

  protected onRefresh(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didRefresh(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRefresh !== void 0) {
        modelObserver.modelDidRefresh(modelContext, this);
      }
    });
  }

  protected willFetch(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillFetch !== void 0) {
        modelObserver.modelWillFetch(modelContext, this);
      }
    });
  }

  protected onFetch(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didFetch(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidFetch !== void 0) {
        modelObserver.modelDidFetch(modelContext, this);
      }
    });
  }

  protected willFlush(modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillFlush !== void 0) {
        modelObserver.modelWillFlush(modelContext, this);
      }
    });
  }

  protected onFlush(modelContext: ModelContextType<this>): void {
    // hook
  }

  protected didFlush(modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidFlush !== void 0) {
        modelObserver.modelDidFlush(modelContext, this);
      }
    });
  }

  protected willRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelWillRefreshChildModels !== void 0) {
        modelObserver.modelWillRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
  }

  protected onRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.refreshChildModels(refreshFlags, modelContext);
  }

  protected didRefreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.didObserve(function (modelObserver: ModelObserver): void {
      if (modelObserver.modelDidRefreshChildModels !== void 0) {
        modelObserver.modelDidRefreshChildModels(refreshFlags, modelContext, this);
      }
    });
  }

  protected refreshChildModels(refreshFlags: ModelFlags, modelContext: ModelContextType<this>,
                               callback?: (this: this, childModel: Model) => void): void {
    this.forEachChildModel(function (childModel: Model): void {
      this.refreshChildModel(childModel, refreshFlags, modelContext);
      if (callback !== void 0) {
        callback.call(this, childModel);
      }
      if ((childModel.modelFlags & Model.RemovingFlag) !== 0) {
        childModel.setModelFlags(childModel.modelFlags & ~Model.RemovingFlag);
        this.removeChildModel(childModel);
      }
    }, this);
  }

  /** @hidden */
  protected refreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    this.willRefreshChildModel(childModel, refreshFlags, modelContext);
    this.onRefreshChildModel(childModel, refreshFlags, modelContext);
    this.didRefreshChildModel(childModel, refreshFlags, modelContext);
  }

  protected willRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // hook
  }

  protected onRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    childModel.cascadeRefresh(refreshFlags, modelContext);
  }

  protected didRefreshChildModel(childModel: Model, refreshFlags: ModelFlags, modelContext: ModelContextType<this>): void {
    // hook
  }

  abstract hasModelService(serviceName: string): boolean;

  abstract getModelService(serviceName: string): ModelService<this, unknown> | null;

  abstract setModelService(serviceName: string, modelService: ModelService<this, unknown> | null): void;

  /** @hidden */
  getLazyModelService(serviceName: string): ModelService<this, unknown> | null {
    let modelService = this.getModelService(serviceName);
    if (modelService === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const descriptor = Model.getModelServiceDescriptor(serviceName, modelClass);
      if (descriptor !== null && descriptor.serviceType !== void 0) {
        const ModelService = descriptor.serviceType;
        modelService = new ModelService<this>(this, serviceName, descriptor);
        this.setModelService(serviceName, modelService);
      }
    }
    return modelService
  }

  abstract hasModelScope(scopeName: string): boolean;

  abstract getModelScope(scopeName: string): ModelScope<this, unknown> | null;

  abstract setModelScope(scopeName: string, modelScope: ModelScope<this, unknown> | null): void;

  /** @hidden */
  getLazyModelScope(scopeName: string): ModelScope<this, unknown> | null {
    let modelScope = this.getModelScope(scopeName);
    if (modelScope === null) {
      const modelClass = (this as any).__proto__ as ModelClass;
      const descriptor = Model.getModelScopeDescriptor(scopeName, modelClass);
      if (descriptor !== null && descriptor.scopeType !== void 0) {
        const ModelScope = descriptor.scopeType;
        modelScope = new ModelScope<this>(this, scopeName, descriptor);
        this.setModelScope(scopeName, modelScope);
      }
    }
    return modelScope
  }

  /** @hidden */
  modelScopeDidSetAuto<T, U>(modelScope: ModelScope<Model, T, U>, auto: boolean): void {
    // hook
  }

  /** @hidden */
  modelScopeDidSetState<T, U>(modelScope: ModelScope<Model, T, U>, newState: T | undefined, oldState: T | undefined): void {
    // hook
  }

  /** @hidden */
  extendModelContext(modelContext: ModelContext): ModelContextType<this> {
    return modelContext as ModelContextType<this>;
  }

  get superModelContext(): ModelContext {
    let superModelContext: ModelContext;
    const parentModel = this.parentModel;
    if (parentModel !== null) {
      superModelContext = parentModel.modelContext;
    } else if (this.isMounted()) {
      const refreshManager = this.refreshManager.state;
      if (refreshManager !== void 0) {
        superModelContext = refreshManager.modelContext;
      } else {
        superModelContext = ModelContext.default();
      }
    } else {
      superModelContext = ModelContext.default();
    }
    return superModelContext;
  }

  get modelContext(): ModelContext {
    return this.extendModelContext(this.superModelContext);
  }

  /** @hidden */
  static getModelServiceDescriptor<M extends Model>(serviceName: string, modelClass: ModelClass | null = null): ModelServiceDescriptor<M, unknown> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelServiceDescriptors")) {
        const descriptor = modelClass._modelServiceDescriptors![serviceName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelService<M extends Model, T>(ModelService: ModelServiceConstructor<T>,
                                                  descriptor: ModelServiceDescriptor<M, T>,
                                                  modelClass: ModelClass, serviceName: string): void {
    if (!modelClass.hasOwnProperty("_modelServiceDescriptors")) {
      modelClass._modelServiceDescriptors = {};
    }
    modelClass._modelServiceDescriptors![serviceName] = descriptor;
    Object.defineProperty(modelClass, serviceName, {
      get: function (this: M): ModelService<M, T> {
        let modelService = this.getModelService(serviceName) as ModelService<M, T> | null;
        if (modelService === null) {
          modelService = new ModelService<M>(this, serviceName, descriptor);
          this.setModelService(serviceName, modelService);
        }
        return modelService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getModelScopeDescriptor<M extends Model>(scopeName: string, modelClass: ModelClass | null = null): ModelScopeDescriptor<M, unknown> | null {
    if (modelClass === null) {
      modelClass = this.prototype as unknown as ModelClass;
    }
    do {
      if (modelClass.hasOwnProperty("_modelScopeDescriptors")) {
        const descriptor = modelClass._modelScopeDescriptors![scopeName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      modelClass = (modelClass as any).__proto__ as ModelClass | null;
    } while (modelClass !== null);
    return null;
  }

  /** @hidden */
  static decorateModelScope<M extends Model, T, U>(ModelScope: ModelScopeConstructor<T, U>,
                                                   descriptor: ModelScopeDescriptor<M, T, U>,
                                                   modelClass: ModelClass, scopeName: string): void {
    if (!modelClass.hasOwnProperty("_modelScopeDescriptors")) {
      modelClass._modelScopeDescriptors = {};
    }
    modelClass._modelScopeDescriptors![scopeName] = descriptor;
    Object.defineProperty(modelClass, scopeName, {
      get: function (this: M): ModelScope<M, T, U> {
        let modelScope = this.getModelScope(scopeName) as ModelScope<M, T, U> | null;
        if (modelScope === null) {
          modelScope = new ModelScope<M>(this, scopeName, descriptor);
          this.setModelScope(scopeName, modelScope);
        }
        return modelScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: ModelFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: ModelFlags = 1 << 1;
  /** @hidden */
  static readonly TraversingFlag: ModelFlags = 1 << 2;
  /** @hidden */
  static readonly AnalyzingFlag: ModelFlags = 1 << 3;
  /** @hidden */
  static readonly RefreshingFlag: ModelFlags = 1 << 4;
  /** @hidden */
  static readonly RemovingFlag: ModelFlags = 1 << 5;
  /** @hidden */
  static readonly ImmediateFlag: ModelFlags = 1 << 6;
  /** @hidden */
  static readonly UpdatingMask: ModelFlags = Model.AnalyzingFlag
                                           | Model.RefreshingFlag;
  /** @hidden */
  static readonly StatusMask: ModelFlags = Model.MountedFlag
                                         | Model.PoweredFlag
                                         | Model.TraversingFlag
                                         | Model.AnalyzingFlag
                                         | Model.RefreshingFlag
                                         | Model.RemovingFlag
                                         | Model.ImmediateFlag;

  static readonly NeedsAnalyze: ModelFlags = 1 << 7;
  static readonly NeedsAggregate: ModelFlags = 1 << 8;
  static readonly NeedsCorrelate: ModelFlags = 1 << 9;
  /** @hidden */
  static readonly AnalyzeMask: ModelFlags = Model.NeedsAnalyze
                                          | Model.NeedsAggregate
                                          | Model.NeedsCorrelate;

  static readonly NeedsRefresh: ModelFlags = 1 << 10;
  static readonly NeedsFetch: ModelFlags = 1 << 11;
  static readonly NeedsFlush: ModelFlags = 1 << 12;
  /** @hidden */
  static readonly RefreshMask: ModelFlags = Model.NeedsRefresh
                                          | Model.NeedsFetch
                                          | Model.NeedsFlush;

  /** @hidden */
  static readonly UpdateMask: ModelFlags = Model.AnalyzeMask
                                         | Model.RefreshMask;

  /** @hidden */
  static readonly ModelFlagShift: ModelFlags = 24;
  /** @hidden */
  static readonly ModelFlagMask: ModelFlags = (1 << Model.ModelFlagShift) - 1;

  static readonly mountFlags: ModelFlags = 0;
  static readonly powerFlags: ModelFlags = 0;
  static readonly insertChildFlags: ModelFlags = 0;
  static readonly removeChildFlags: ModelFlags = 0;

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ModelManager; // defined by ModelManager
  /** @hidden */
  static Service: typeof ModelService; // defined by ModelService
  /** @hidden */
  static Scope: typeof ModelScope; // defined by ModelScope
  /** @hidden */
  static Generic: typeof GenericModel; // defined by GenericModel
  /** @hidden */
  static GenericLeaf: typeof GenericLeafModel; // defined by GenericLeafModel
  /** @hidden */
  static GenericNode: typeof GenericNodeModel; // defined by GenericNodeModel
}