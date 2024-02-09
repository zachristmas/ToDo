// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod constants;
mod errors;
mod migrations;

use tauri::{
    AppHandle, CustomMenuItem, GlobalWindowEvent, Manager, SystemTray, SystemTrayEvent,
    SystemTrayMenu,
};
use tauri_plugin_positioner::{Position, WindowExt};

fn main() {
    let migrations = migrations::get_migrations();

    tauri::Builder::default()
        // plugins
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:todo.db", migrations)
                .build(),
        )
        .plugin(tauri_plugin_positioner::init())
        .on_system_tray_event(|app, event| handle_system_tray_event(app, &event))
        .on_window_event(|event| handle_window_event(&event))
        // handlers
        .invoke_handler(tauri::generate_handler![commands::update_title])
        //run
        .setup(|app| {
            SystemTray::new()
                .with_menu(
                    SystemTrayMenu::new()
                        .add_item(CustomMenuItem::new(constants::MENU_QUIT, constants::MENU_QUIT_LABEL))
                        .add_item(CustomMenuItem::new(constants::MENU_OPEN, constants::MENU_OPEN_LABEL)),
                )
                .build(app)?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn handle_system_tray_event(app: &AppHandle, event: &SystemTrayEvent) {
    tauri_plugin_positioner::on_tray_event(app, event);
    match event {
        SystemTrayEvent::LeftClick {
            tray_id: _,
            position: _,
            size: _,
            ..
        } => {
            let window = app.get_window(constants::MAIN_WINDOW).unwrap();
            let _ = window.move_window(Position::TrayBottomCenter);

            if window.is_visible().unwrap() {
                window.hide().unwrap();
            } else {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            constants::MENU_QUIT => {
                std::process::exit(0);
            }
            constants::MENU_OPEN => {
                // toggle between a system tray window and a normal window
                let window = app.get_window(constants::MAIN_WINDOW).unwrap();
                if window.is_visible().unwrap() {
                    // window.hide().unwrap();
                } else {
                    window.show().unwrap();
                    window.set_focus().unwrap();
                }
            }
            constants::MENU_HIDE => {
                let window = app.get_window(constants::MAIN_WINDOW).unwrap();
                window.hide().unwrap();
            }
            _ => {}
        },
        _ => {}
    }
}

fn handle_window_event(event: &GlobalWindowEvent) {
    match event.event() {
        tauri::WindowEvent::Focused(is_focused) => {
            if !is_focused {
                let window = event.window();
                let _ = window.hide();
            }
        }
        _ => {}
    }
}
