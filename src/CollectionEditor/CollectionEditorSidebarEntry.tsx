import { isRequestItem, PostmanCollectionItem } from "../collection/PostmanCollection";
import CollectionEditorSidebarRequestEntry from "./CollectionEditorSidebarRequestEntry";
import CollectionEditorSidebarFolderEntry from "./CollectionEditorSidebarFolderEntry";

type CollectionEditorSidebarEntryProps = {
  item: PostmanCollectionItem;
}

export default function CollectionEditorSidebarEntry({ item }: CollectionEditorSidebarEntryProps) {
  if (isRequestItem(item)) {
    return <CollectionEditorSidebarRequestEntry requestItem={item} />
  }
  return <CollectionEditorSidebarFolderEntry folderItem={item} />
}