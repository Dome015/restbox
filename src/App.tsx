import { open, save } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { useState } from "react";
import "./App.css";
import {
  parsePostmanCollection,
  PostmanCollection,
  serializePostmanCollection,
} from "./collection/PostmanCollection";
import CollectionEditor from "./CollectionEditor/CollectionEditor";
import Footer from "./Footer";

function App() {
  const [activeCollection, setActiveCollection] = useState<PostmanCollection | null>(null);

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

  return (
    <div className="main-container var-def">
      <div className="content-container">
        {activeCollection === null && (
          <button
            className="custom-button normal"
            onClick={onOpenCollection}
          >
            Open Collection
          </button>
        )}
        {activeCollection !== null && <CollectionEditor collection={activeCollection} />}
      </div>
      <div className="border-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;
