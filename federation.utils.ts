/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
type Scope = unknown;
type Factory = () => any;

type Container = {
  init(shareScope: Scope): Promise<void>;
  get(module: string): Promise<Factory>;
};

declare const __webpack_init_sharing__: (shareScope: string) => Promise<void>;
declare const __webpack_share_scopes__: { default: Scope };

enum ModuleEntryStatus {
  Failed,
  Available,
  Loading,
}

interface ModuleEntry {
  status: ModuleEntryStatus;
  script?: HTMLScriptElement;
}

const moduleMap = {} as Record<string, ModuleEntry>;

export function loadRemoteEntry(remoteEntry: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (moduleMap[remoteEntry]?.status === ModuleEntryStatus.Available) {
      resolve();
      return;
    }

    if (!moduleMap[remoteEntry]) {
      moduleMap[remoteEntry] = {
        status: ModuleEntryStatus.Loading,
      };
    }

    if (moduleMap[remoteEntry].status === ModuleEntryStatus.Failed) {
      moduleMap[remoteEntry].script?.remove();
    }

    const script = document.createElement('script');
    script.src = remoteEntry;

    script.onerror = (e) => {
      moduleMap[remoteEntry].status = ModuleEntryStatus.Failed;
      reject(e);
    };

    script.onload = () => {
      moduleMap[remoteEntry].status = ModuleEntryStatus.Available;
      resolve();
    };

    moduleMap[remoteEntry].script = script;

    document.body.append(script);
  });
}

async function lookupExposedModule<T>(
  remoteName: string,
  exposedModule: string
): Promise<T> {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__('default');

  const container = window[remoteName as any] as unknown as Container; // or get the container somewhere else
  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(exposedModule);
  const Module = factory();
  return Module as T;
}

export type LoadRemoteModuleOptions = {
  remoteEntry: string;
  remoteName: string;
  exposedModule: string;
};

export async function loadRemoteModule(
  options: LoadRemoteModuleOptions
): Promise<any> {
  await loadRemoteEntry(options.remoteEntry);
  return lookupExposedModule<any>(options.remoteName, options.exposedModule);
}
