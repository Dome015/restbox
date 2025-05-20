import { useState } from "react";
import { PostmanCollection, PostmanCollectionRequestItem } from "../collection/PostmanCollection";
import "./CollectionEditor.css";
import CollectionEditorSidebar from "./CollectionEditorSidebar";

type CollectionEditorProps = {
  collection: PostmanCollection;
}

type EditorStatus = EditorCollectionStatus | EditorRequestStatus;

type EditorRequestStatus = {
  type: "request";
  selection: PostmanCollectionRequestItem;
}

type EditorCollectionStatus = {
  type: "collection";
}

export default function CollectionEditor({ collection }: CollectionEditorProps) {
  const [status, setStatus] = useState<EditorStatus>({ type: "collection" });

  return <div className="collection-editor-container">
    <div className="collection-editor-sidebar">
      <CollectionEditorSidebar items={collection.items} />
    </div>
    <div className="collection-editor-body">
      Body
    </div>
  </div>
}