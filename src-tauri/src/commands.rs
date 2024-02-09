use crate::errors::Error;

#[tauri::command]
pub async fn update_title(title: String, app_handle: tauri::AppHandle) -> Result<String, Error> {
    let _ = app_handle.tray_handle().set_title(&title);
    Ok(title.into())
}
