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

import {ComponentContextType, ComponentContext} from "./ComponentContext";
import {ComponentObserverType, ComponentObserver} from "./ComponentObserver";
import {ComponentManager} from "./manager/ComponentManager";
import {ExecuteManager} from "./execute/ExecuteManager";
import {
  ComponentServiceDescriptor,
  ComponentServiceConstructor,
  ComponentService,
} from "./service/ComponentService";
import {
  ComponentScopeDescriptor,
  ComponentScopeConstructor,
  ComponentScope,
} from "./scope/ComponentScope";
import {GenericComponent} from "./generic/GenericComponent";
import {GenericLeafComponent} from "./generic/GenericLeafComponent";
import {GenericNodeComponent} from "./generic/GenericNodeComponent";

export type ComponentFlags = number;

export interface ComponentInit {
  key?: string;
}

export interface ComponentClass {
  readonly mountFlags: ComponentFlags;

  readonly powerFlags: ComponentFlags;

  readonly insertChildFlags: ComponentFlags;

  readonly removeChildFlags: ComponentFlags;

  /** @hidden */
  _componentServiceDescriptors?: {[serviceName: string]: ComponentServiceDescriptor<Component, unknown> | undefined};

  /** @hidden */
  _componentScopeDescriptors?: {[scopeName: string]: ComponentScopeDescriptor<Component, unknown> | undefined};
}

export abstract class Component {
  abstract get componentObservers(): ReadonlyArray<ComponentObserver>;

  abstract addComponentObserver(componentObserver: ComponentObserverType<this>): void;

  protected willAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected onAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected didAddComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  abstract removeComponentObserver(componentObserver: ComponentObserverType<this>): void;

  protected willRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected onRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected didRemoveComponentObserver(componentObserver: ComponentObserverType<this>): void {
    // hook
  }

  protected willObserve<T>(callback: (this: this, componentObserver: ComponentObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      result = callback.call(this, componentObservers[i]);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  protected didObserve<T>(callback: (this: this, componentObserver: ComponentObserverType<this>) => T | void): T | undefined {
    let result: T | undefined;
    const componentObservers = this.componentObservers;
    for (let i = 0, n = componentObservers.length; i < n; i += 1) {
      result = callback.call(this, componentObservers[i]);
      if (result !== void 0) {
        return result;
      }
    }
    return result;
  }

  initComponent(init: ComponentInit): void {
    // hook
  }

  abstract get key(): string | undefined;

  /** @hidden */
  abstract setKey(key: string | undefined): void;

  abstract get parentComponent(): Component | null;

  /** @hidden */
  abstract setParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void;

  protected willSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillSetParentComponent !== void 0) {
        componentObserver.componentWillSetParentComponent(newParentComponent, oldParentComponent, this);
      }
    });
  }

  protected onSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    // hook
  }

  protected didSetParentComponent(newParentComponent: Component | null, oldParentComponent: Component | null): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidSetParentComponent !== void 0) {
        componentObserver.componentDidSetParentComponent(newParentComponent, oldParentComponent, this);
      }
    });
  }

  abstract get childComponentCount(): number;

  abstract get childComponents(): ReadonlyArray<Component>;

  abstract forEachChildComponent<T, S = unknown>(callback: (this: S, childComponent: Component) => T | void,
                                                 thisArg?: S): T | undefined;

  abstract getChildComponent(key: string): Component | null;

  abstract setChildComponent(key: string, newChildComponent: Component | null): Component | null;

  abstract appendChildComponent(childComponent: Component, key?: string): void;

  abstract prependChildComponent(childComponent: Component, key?: string): void;

  abstract insertChildComponent(childComponent: Component, targetComponent: Component | null, key?: string): void;

  get insertChildFlags(): ComponentFlags {
    return this.componentClass.insertChildFlags;
  }

  protected willInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillInsertChildComponent !== void 0) {
        componentObserver.componentWillInsertChildComponent(childComponent, targetComponent, this);
      }
    });
  }

  protected onInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    this.requireUpdate(this.insertChildFlags);
  }

  protected didInsertChildComponent(childComponent: Component, targetComponent: Component | null | undefined): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidInsertChildComponent !== void 0) {
        componentObserver.componentDidInsertChildComponent(childComponent, targetComponent, this);
      }
    });
  }

  abstract cascadeInsert(updateFlags?: ComponentFlags, componentContext?: ComponentContext): void;

  abstract removeChildComponent(key: string): Component | null;
  abstract removeChildComponent(childComponent: Component): void;

  abstract removeAll(): void;

  abstract remove(): void;

  get removeChildFlags(): ComponentFlags {
    return this.componentClass.removeChildFlags;
  }

  protected willRemoveChildComponent(childComponent: Component): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillRemoveChildComponent !== void 0) {
        componentObserver.componentWillRemoveChildComponent(childComponent, this);
      }
    });
  }

  protected onRemoveChildComponent(childComponent: Component): void {
    this.requireUpdate(this.removeChildFlags);
  }

  protected didRemoveChildComponent(childComponent: Component): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidRemoveChildComponent !== void 0) {
        componentObserver.componentDidRemoveChildComponent(childComponent, this);
      }
    });
  }

  getSuperComponent<C extends Component>(componentClass: {new(...args: any[]): C}): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else if (parentComponent instanceof componentClass) {
      return parentComponent;
    } else {
      return parentComponent.getSuperComponent(componentClass);
    }
  }

  getBaseComponent<C extends Component>(componentClass: {new(...args: any[]): C}): C | null {
    const parentComponent = this.parentComponent;
    if (parentComponent === null) {
      return null;
    } else if (parentComponent instanceof componentClass) {
      const baseComponent = parentComponent.getBaseComponent(componentClass);
      return baseComponent !== null ? baseComponent : parentComponent;
    } else {
      return parentComponent.getBaseComponent(componentClass);
    }
  }

  executeManager: ComponentService<this, ExecuteManager>; // defined by ExecuteManagerService

  get componentClass(): ComponentClass {
    return this.constructor as unknown as ComponentClass;
  }

  /** @hidden */
  abstract get componentFlags(): ComponentFlags;

  /** @hidden */
  abstract setComponentFlags(componentFlags: ComponentFlags): void;

  isMounted(): boolean {
    return (this.componentFlags & Component.MountedFlag) !== 0;
  }

  abstract cascadeMount(): void;

  get mountFlags(): ComponentFlags {
    return this.componentClass.mountFlags;
  }

  protected willMount(): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillMount !== void 0) {
        componentObserver.componentWillMount(this);
      }
    });
  }

  protected onMount(): void {
    this.requireUpdate(this.mountFlags);
  }

  protected didMount(): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidMount !== void 0) {
        componentObserver.componentDidMount(this);
      }
    });
  }

  abstract cascadeUnmount(): void;

  protected willUnmount(): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillUnmount !== void 0) {
        componentObserver.componentWillUnmount(this);
      }
    });
  }

  protected onUnmount(): void {
    // hook
  }

  protected didUnmount(): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidUnmount !== void 0) {
        componentObserver.componentDidUnmount(this);
      }
    });
  }

  isPowered(): boolean {
    return (this.componentFlags & Component.PoweredFlag) !== 0;
  }

  abstract cascadePower(): void;

  get powerFlags(): ComponentFlags {
    return this.componentClass.powerFlags;
  }

  protected willPower(): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillPower !== void 0) {
        componentObserver.componentWillPower(this);
      }
    });
  }

  protected onPower(): void {
    this.requireUpdate(this.powerFlags);
  }

  protected didPower(): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidPower !== void 0) {
        componentObserver.componentDidPower(this);
      }
    });
  }

  abstract cascadeUnpower(): void;

  protected willUnpower(): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillUnpower !== void 0) {
        componentObserver.componentWillUnpower(this);
      }
    });
  }

  protected onUnpower(): void {
    // hook
  }

  protected didUnpower(): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidUnpower !== void 0) {
        componentObserver.componentDidUnpower(this);
      }
    });
  }

  requireUpdate(updateFlags: ComponentFlags, immediate: boolean = false): void {
    updateFlags &= ~Component.StatusMask;
    if (updateFlags !== 0) {
      this.willRequireUpdate(updateFlags, immediate);
      const oldUpdateFlags = this.componentFlags;
      const newUpdateFlags = oldUpdateFlags | updateFlags;
      const deltaUpdateFlags = newUpdateFlags & ~oldUpdateFlags;
      if (deltaUpdateFlags !== 0) {
        this.setComponentFlags(newUpdateFlags);
        this.requestUpdate(this, deltaUpdateFlags, immediate);
      }
      this.didRequireUpdate(updateFlags, immediate);
    }
  }

  protected willRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected didRequireUpdate(updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  requestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    updateFlags = this.willRequestUpdate(targetComponent, updateFlags, immediate);
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      parentComponent.requestUpdate(targetComponent, updateFlags, immediate);
    } else if (this.isMounted()) {
      const executeManager = this.executeManager.state;
      if (executeManager !== void 0) {
        executeManager.requestUpdate(targetComponent, updateFlags, immediate);
      }
    }
    this.didRequestUpdate(targetComponent, updateFlags, immediate);
  }

  protected willRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): ComponentFlags {
    let additionalFlags = this.modifyUpdate(targetComponent, updateFlags);
    additionalFlags &= ~Component.StatusMask;
    if (additionalFlags !== 0) {
      updateFlags |= additionalFlags;
      this.setComponentFlags(this.componentFlags | additionalFlags);
    }
    return updateFlags;
  }

  protected didRequestUpdate(targetComponent: Component, updateFlags: ComponentFlags, immediate: boolean): void {
    // hook
  }

  protected modifyUpdate(targetComponent: Component, updateFlags: ComponentFlags): ComponentFlags {
    let additionalFlags = 0;
    if ((updateFlags & Component.CompileMask) !== 0) {
      additionalFlags |= Component.NeedsCompile;
    }
    if ((updateFlags & Component.ExecuteMask) !== 0) {
      additionalFlags |= Component.ExecuteMask;
    }
    return additionalFlags;
  }

  isTraversing(): boolean {
    return (this.componentFlags & Component.TraversingFlag) !== 0;
  }

  isUpdating(): boolean {
    return (this.componentFlags & Component.UpdatingMask) !== 0;
  }

  isCompiling(): boolean {
    return (this.componentFlags & Component.CompilingFlag) !== 0;
  }

  needsCompile(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): ComponentFlags {
    return compileFlags;
  }

  abstract cascadeCompile(compileFlags: ComponentFlags, componentContext: ComponentContext): void;

  protected willCompile(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillCompile !== void 0) {
        componentObserver.componentWillCompile(componentContext, this);
      }
    });
  }

  protected onCompile(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didCompile(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidCompile !== void 0) {
        componentObserver.componentDidCompile(componentContext, this);
      }
    });
  }

  protected willResolve(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillResolve !== void 0) {
        componentObserver.componentWillResolve(componentContext, this);
      }
    });
  }

  protected onResolve(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didResolve(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidResolve !== void 0) {
        componentObserver.componentDidResolve(componentContext, this);
      }
    });
  }

  protected willGenerate(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillGenerate !== void 0) {
        componentObserver.componentWillGenerate(componentContext, this);
      }
    });
  }

  protected onGenerate(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didGenerate(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidGenerate !== void 0) {
        componentObserver.componentDidGenerate(componentContext, this);
      }
    });
  }

  protected willAssemble(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillAssemble !== void 0) {
        componentObserver.componentWillAssemble(componentContext, this);
      }
    });
  }

  protected onAssemble(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didAssemble(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidAssemble !== void 0) {
        componentObserver.componentDidAssemble(componentContext, this);
      }
    });
  }

  protected willCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillCompileChildComponents !== void 0) {
        componentObserver.componentWillCompileChildComponents(compileFlags, componentContext, this);
      }
    });
  }

  protected onCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.compileChildComponents(compileFlags, componentContext);
  }

  protected didCompileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidCompileChildComponents !== void 0) {
        componentObserver.componentDidCompileChildComponents(compileFlags, componentContext, this);
      }
    });
  }

  protected compileChildComponents(compileFlags: ComponentFlags, componentContext: ComponentContextType<this>,
                                   callback?: (this: this, childComponent: Component) => void): void {
    this.forEachChildComponent(function (childComponent: Component): void {
      this.compileChildComponent(childComponent, compileFlags, componentContext);
      if (callback !== void 0) {
        callback.call(this, childComponent);
      }
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }, this);
  }

  /** @hidden */
  protected compileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willCompileChildComponent(childComponent, compileFlags, componentContext);
    this.onCompileChildComponent(childComponent, compileFlags, componentContext);
    this.didCompileChildComponent(childComponent, compileFlags, componentContext);
  }

  protected willCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    childComponent.cascadeCompile(compileFlags, componentContext);
  }

  protected didCompileChildComponent(childComponent: Component, compileFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  isExecuting(): boolean {
    return (this.componentFlags & Component.ExecutingFlag) !== 0;
  }

  needsExecute(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): ComponentFlags {
    return executeFlags;
  }

  abstract cascadeExecute(executeFlags: ComponentFlags, componentContext: ComponentContext): void;

  protected willExecute(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillExecute !== void 0) {
        componentObserver.componentWillExecute(componentContext, this);
      }
    });
  }

  protected onExecute(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didExecute(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidExecute !== void 0) {
        componentObserver.componentDidExecute(componentContext, this);
      }
    });
  }

  protected willNavigate(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillNavigate !== void 0) {
        componentObserver.componentWillNavigate(componentContext, this);
      }
    });
  }

  protected onNavigate(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didNavigate(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidNavigate !== void 0) {
        componentObserver.componentDidNavigate(componentContext, this);
      }
    });
  }

  protected willCompute(componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillCompute !== void 0) {
        componentObserver.componentWillCompute(componentContext, this);
      }
    });
  }

  protected onCompute(componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected didCompute(componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidCompute !== void 0) {
        componentObserver.componentDidCompute(componentContext, this);
      }
    });
  }

  protected willExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentWillExecuteChildComponents !== void 0) {
        componentObserver.componentWillExecuteChildComponents(executeFlags, componentContext, this);
      }
    });
  }

  protected onExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.executeChildComponents(executeFlags, componentContext);
  }

  protected didExecuteChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.didObserve(function (componentObserver: ComponentObserver): void {
      if (componentObserver.componentDidExecuteChildComponents !== void 0) {
        componentObserver.componentDidExecuteChildComponents(executeFlags, componentContext, this);
      }
    });
  }

  protected executeChildComponents(executeFlags: ComponentFlags, componentContext: ComponentContextType<this>,
                                   callback?: (this: this, childComponent: Component) => void): void {
    this.forEachChildComponent(function (childComponent: Component): void {
      this.executeChildComponent(childComponent, executeFlags, componentContext);
      if (callback !== void 0) {
        callback.call(this, childComponent);
      }
      if ((childComponent.componentFlags & Component.RemovingFlag) !== 0) {
        childComponent.setComponentFlags(childComponent.componentFlags & ~Component.RemovingFlag);
        this.removeChildComponent(childComponent);
      }
    }, this);
  }

  /** @hidden */
  protected executeChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    this.willExecuteChildComponent(childComponent, executeFlags, componentContext);
    this.onExecuteChildComponent(childComponent, executeFlags, componentContext);
    this.didExecuteChildComponent(childComponent, executeFlags, componentContext);
  }

  protected willExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  protected onExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    childComponent.cascadeExecute(executeFlags, componentContext);
  }

  protected didExecuteChildComponent(childComponent: Component, executeFlags: ComponentFlags, componentContext: ComponentContextType<this>): void {
    // hook
  }

  abstract hasComponentService(serviceName: string): boolean;

  abstract getComponentService(serviceName: string): ComponentService<this, unknown> | null;

  abstract setComponentService(serviceName: string, componentService: ComponentService<this, unknown> | null): void;

  /** @hidden */
  getLazyComponentService(serviceName: string): ComponentService<this, unknown> | null {
    let componentService = this.getComponentService(serviceName);
    if (componentService === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const descriptor = Component.getComponentServiceDescriptor(serviceName, componentClass);
      if (descriptor !== null && descriptor.serviceType !== void 0) {
        const ComponentService = descriptor.serviceType;
        componentService = new ComponentService<this>(this, serviceName, descriptor);
        this.setComponentService(serviceName, componentService);
      }
    }
    return componentService
  }

  abstract hasComponentScope(scopeName: string): boolean;

  abstract getComponentScope(scopeName: string): ComponentScope<this, unknown> | null;

  abstract setComponentScope(scopeName: string, componentScope: ComponentScope<this, unknown> | null): void;

  /** @hidden */
  getLazyComponentScope(scopeName: string): ComponentScope<this, unknown> | null {
    let componentScope = this.getComponentScope(scopeName);
    if (componentScope === null) {
      const componentClass = (this as any).__proto__ as ComponentClass;
      const descriptor = Component.getComponentScopeDescriptor(scopeName, componentClass);
      if (descriptor !== null && descriptor.scopeType !== void 0) {
        const ComponentScope = descriptor.scopeType;
        componentScope = new ComponentScope<this>(this, scopeName, descriptor);
        this.setComponentScope(scopeName, componentScope);
      }
    }
    return componentScope
  }

  /** @hidden */
  componentScopeDidSetAuto<T, U>(componentScope: ComponentScope<Component, T, U>, auto: boolean): void {
    // hook
  }

  /** @hidden */
  componentScopeDidSetState<T, U>(componentScope: ComponentScope<Component, T, U>, newState: T | undefined, oldState: T | undefined): void {
    // hook
  }

  /** @hidden */
  extendComponentContext(componentContext: ComponentContext): ComponentContextType<this> {
    return componentContext as ComponentContextType<this>;
  }

  get superComponentContext(): ComponentContext {
    let superComponentContext: ComponentContext;
    const parentComponent = this.parentComponent;
    if (parentComponent !== null) {
      superComponentContext = parentComponent.componentContext;
    } else if (this.isMounted()) {
      const executeManager = this.executeManager.state;
      if (executeManager !== void 0) {
        superComponentContext = executeManager.componentContext;
      } else {
        superComponentContext = ComponentContext.default();
      }
    } else {
      superComponentContext = ComponentContext.default();
    }
    return superComponentContext;
  }

  get componentContext(): ComponentContext {
    return this.extendComponentContext(this.superComponentContext);
  }

  /** @hidden */
  static getComponentServiceDescriptor<C extends Component>(serviceName: string, componentClass: ComponentClass | null = null): ComponentServiceDescriptor<C, unknown> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentServiceDescriptors")) {
        const descriptor = componentClass._componentServiceDescriptors![serviceName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentService<C extends Component, T>(ComponentService: ComponentServiceConstructor<T>,
                                                          descriptor: ComponentServiceDescriptor<C, T>,
                                                          componentClass: ComponentClass, serviceName: string): void {
    if (!componentClass.hasOwnProperty("_componentServiceDescriptors")) {
      componentClass._componentServiceDescriptors = {};
    }
    componentClass._componentServiceDescriptors![serviceName] = descriptor;
    Object.defineProperty(componentClass, serviceName, {
      get: function (this: C): ComponentService<C, T> {
        let componentService = this.getComponentService(serviceName) as ComponentService<C, T> | null;
        if (componentService === null) {
          componentService = new ComponentService<C>(this, serviceName, descriptor);
          this.setComponentService(serviceName, componentService);
        }
        return componentService;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static getComponentScopeDescriptor<C extends Component>(scopeName: string, componentClass: ComponentClass | null = null): ComponentScopeDescriptor<C, unknown> | null {
    if (componentClass === null) {
      componentClass = this.prototype as unknown as ComponentClass;
    }
    do {
      if (componentClass.hasOwnProperty("_componentScopeDescriptors")) {
        const descriptor = componentClass._componentScopeDescriptors![scopeName];
        if (descriptor !== void 0) {
          return descriptor;
        }
      }
      componentClass = (componentClass as any).__proto__ as ComponentClass | null;
    } while (componentClass !== null);
    return null;
  }

  /** @hidden */
  static decorateComponentScope<C extends Component, T, U>(ComponentScope: ComponentScopeConstructor<T, U>,
                                                           descriptor: ComponentScopeDescriptor<C, T, U>,
                                                           componentClass: ComponentClass, scopeName: string): void {
    if (!componentClass.hasOwnProperty("_componentScopeDescriptors")) {
      componentClass._componentScopeDescriptors = {};
    }
    componentClass._componentScopeDescriptors![scopeName] = descriptor;
    Object.defineProperty(componentClass, scopeName, {
      get: function (this: C): ComponentScope<C, T, U> {
        let componentScope = this.getComponentScope(scopeName) as ComponentScope<C, T, U> | null;
        if (componentScope === null) {
          componentScope = new ComponentScope<C>(this, scopeName, descriptor);
          this.setComponentScope(scopeName, componentScope);
        }
        return componentScope;
      },
      configurable: true,
      enumerable: true,
    });
  }

  /** @hidden */
  static readonly MountedFlag: ComponentFlags = 1 << 0;
  /** @hidden */
  static readonly PoweredFlag: ComponentFlags = 1 << 1;
  /** @hidden */
  static readonly TraversingFlag: ComponentFlags = 1 << 2;
  /** @hidden */
  static readonly CompilingFlag: ComponentFlags = 1 << 3;
  /** @hidden */
  static readonly ExecutingFlag: ComponentFlags = 1 << 4;
  /** @hidden */
  static readonly RemovingFlag: ComponentFlags = 1 << 5;
  /** @hidden */
  static readonly ImmediateFlag: ComponentFlags = 1 << 6;
  /** @hidden */
  static readonly UpdatingMask: ComponentFlags = Component.CompilingFlag
                                               | Component.ExecutingFlag;
  /** @hidden */
  static readonly StatusMask: ComponentFlags = Component.MountedFlag
                                             | Component.PoweredFlag
                                             | Component.TraversingFlag
                                             | Component.CompilingFlag
                                             | Component.ExecutingFlag
                                             | Component.RemovingFlag
                                             | Component.ImmediateFlag;

  static readonly NeedsCompile: ComponentFlags = 1 << 7;
  static readonly NeedsResolve: ComponentFlags = 1 << 8;
  static readonly NeedsGenerate: ComponentFlags = 1 << 9;
  static readonly NeedsAssemble: ComponentFlags = 1 << 10;
  /** @hidden */
  static readonly CompileMask: ComponentFlags = Component.NeedsCompile
                                              | Component.NeedsResolve
                                              | Component.NeedsGenerate
                                              | Component.NeedsAssemble;

  static readonly NeedsExecute: ComponentFlags = 1 << 11;
  static readonly NeedsNavigate: ComponentFlags = 1 << 12;
  static readonly NeedsCompute: ComponentFlags = 1 << 13;
  /** @hidden */
  static readonly ExecuteMask: ComponentFlags = Component.NeedsExecute
                                              | Component.NeedsNavigate
                                              | Component.NeedsCompute;

  /** @hidden */
  static readonly UpdateMask: ComponentFlags = Component.CompileMask
                                             | Component.ExecuteMask;

  /** @hidden */
  static readonly ComponentFlagShift: ComponentFlags = 24;
  /** @hidden */
  static readonly ComponentFlagMask: ComponentFlags = (1 << Component.ComponentFlagShift) - 1;

  static readonly mountFlags: ComponentFlags = 0;
  static readonly powerFlags: ComponentFlags = 0;
  static readonly insertChildFlags: ComponentFlags = 0;
  static readonly removeChildFlags: ComponentFlags = 0;

  // Forward type declarations
  /** @hidden */
  static Manager: typeof ComponentManager; // defined by ComponentManager
  /** @hidden */
  static Service: typeof ComponentService; // defined by ComponentService
  /** @hidden */
  static Scope: typeof ComponentScope; // defined by ComponentScope
  /** @hidden */
  static Generic: typeof GenericComponent; // defined by GenericComponent
  /** @hidden */
  static GenericLeaf: typeof GenericLeafComponent; // defined by GenericLeafComponent
  /** @hidden */
  static GenericNode: typeof GenericNodeComponent; // defined by GenericNodeComponent
}