import { emit } from "@tauri-apps/api/event";
import { Menu } from "@tauri-apps/api/menu";

export async function setAppMenu() {
  const appMenu = await Menu.new({
    items: [
      {
        id: "app",
        text: "SaneJSON",
        items: [
          {
            id: "about",
            text: "About SaneJSON",
            action: () => emit("about"),
          },
          {
            item: "Separator"
          },
          {
            text: "Quit",
            item: "Quit"
          },
        ],
      },
      {
        id: "collection",
        text: "Collection",
        items: [
          {
            id: "open-collection",
            text: "Open Collection",
            accelerator: "CmdOrCtrl+O",
            action: () => emit("open-collection"),
          },
          {
            item: "Separator"
          },
          {
            id: "save",
            text: "Save",
            accelerator: "CmdOrCtrl+S",
            action: () => emit("save"),
          },
          {
            id: "save-as",
            text: "Save As",
            accelerator: "CmdOrCtrl+Shift+S",
            action: () => emit("save-as"),
          },
        ],
      },
    ]
  });

  await appMenu.setAsAppMenu();
}