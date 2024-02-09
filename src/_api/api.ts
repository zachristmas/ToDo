import { invoke, InvokeArgs } from '@tauri-apps/api/tauri'

/**
 * Sends a message to the tauri api.
 * @example
 * ```typescript
 * import { tauriApi } from './api';
 * await tauriApi('login', { user: 'tauri', password: 'poiwe3h4r5ip3yrhtew9ty' });
 * ```
 *
 * @param command The command name.
 * @param params The optional arguments to pass to the command.
 * @return A promise resolving or rejecting to the backend response.
 * */
export async function tauriApi<T = any>(command: string, params: InvokeArgs | undefined): Promise<T> {
  try {
    const result = await invoke<T>(command, params);
    return result;
  } catch (err) {
    throw err;
  }
}