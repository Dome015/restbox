import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import "./index.css";
import {
  parsePostmanCollection,
  PostmanCollection,
  serializePostmanCollection,
} from "./lib/collection/PostmanCollection";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/theme-prodiver";
import CollectionView from "./components/view/collection/collection-view";
import Header from "./components/layout/header";

function App() {
  const [activeCollection, setActiveCollection] = useState<PostmanCollection | null>(null);
  const [view, setView] = useState<"collection" | "request">("collection");

  async function onOpenCollection() {
    try {
      const filePath = await open({
        multiple: false,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (!filePath) {
        return;
      }
      const fileContent = await readTextFile(filePath);
      const collection = parsePostmanCollection(fileContent);
      console.log(collection);
      setActiveCollection(collection);
    } catch (error) {
      console.error("Failed to load collection", error);
    }
  }

  async function onSaveCollection() {
    if (!activeCollection) return;
    try {
      const json = serializePostmanCollection(activeCollection);
      const savePath = await save({
        defaultPath: `${activeCollection.name || "collection"}.json`,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (!savePath) {
        return;
      }
      await writeTextFile(savePath, json);
    } catch (e) {
      console.error("Failed to save collection:", e);
    }
  }

  return <ThemeProvider>
    <Header activeCollection={activeCollection} />
    {activeCollection !== null && <CollectionView activeCollection={activeCollection} />}
    {activeCollection === null && <div className="flex flex-col items-center justify-center min-h-svh">
      <Button onClick={onOpenCollection}>Click me</Button>
      {activeCollection !== null && <>{JSON.stringify(activeCollection)}</>}
    </div>}
  </ThemeProvider>
}

export default App;
