import { tauriApi } from "./api"

const API_ROUTES = {
  UPDATE_TITLE: "update_title",
} as const

/**
 * Updates the menu bar title for MacOS via commands.rs
 * @example
 * ```typescript
 * import { updateTitle } from './title';
 * await updateTitle({ title: 'My new title' });
 * ```
 *
 * @param args derived from the update_title function in commands.rs.
 * @return A promise resolving or rejecting to the backend response.
 * */
export async function updateTitle(args: { title: string }) {
  return await tauriApi(API_ROUTES.UPDATE_TITLE, args)
}
