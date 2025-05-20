import { PostmanCollectionItem } from "../collection/PostmanCollection"
import CollectionEditorSidebarEntry from "./CollectionEditorSidebarEntry";
import "./CollectionEditorSidebar.css";

type CollectionEditorSidebarProps = {
  items: PostmanCollectionItem[];
}

export default function CollectionEditorSidebar({ items }: CollectionEditorSidebarProps) {
  return <>
    {items.map(item => <CollectionEditorSidebarEntry item={item} />)}
  </>
}