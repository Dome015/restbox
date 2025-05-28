import { Button } from "@/components/ui/button";
import { PostmanCollection, PostmanCollectionFolderItem, PostmanCollectionItem, PostmanCollectionRequestItem } from "@/lib/collection/PostmanCollection";
import { JSX, useState } from "react";
import { Folder, FolderOpen, Braces } from "lucide-react";

type CollectionExplorerProps = { 
  activeCollection: PostmanCollection;
  onItemSelected: (selectionPath: number[]) => void;
}

export default function CollectionExplorer({ activeCollection, onItemSelected }: CollectionExplorerProps) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {activeCollection.items.map((item, index) =>
        <CollectionExplorerEntry
          onItemSelected={path => onItemSelected([index, ...path])}
          key={item.name}
          collectionItem={item} />
      )}
    </div>
  )
}

type CollectionExplorerEntryProps = {
  collectionItem: PostmanCollectionItem;
  onItemSelected: (selectionPath: number[]) => void;
}

function CollectionExplorerEntry({ collectionItem, onItemSelected }: CollectionExplorerEntryProps) {
  let content: JSX.Element = <>Entry</>
  const genericItem = collectionItem as any;
  if (genericItem.request) {
    content = <CollectionExplorerRequestEntry requestItem={collectionItem as PostmanCollectionRequestItem} onItemSelected={() => onItemSelected([])} />;
  } else {
    content = <CollectionExplorerFolderEntry folderItem={collectionItem as PostmanCollectionFolderItem} onItemSelected={path => onItemSelected(path)} />;
  }
  return (
    <div className="w-full p-1 pb-0">
      {content}
    </div>
  )
}

type CollectionExplorerFolderEntryProps = {
  folderItem: PostmanCollectionFolderItem;
  onItemSelected: (selectionPath: number[]) => void;
}

function CollectionExplorerFolderEntry({ folderItem, onItemSelected }: CollectionExplorerFolderEntryProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Button className="w-full justify-start" variant="ghost" onClick={() => setExpanded(e => !e)}>
        {expanded ? <FolderOpen /> : <Folder />}
        <span className="truncate ml-1">{folderItem.name}</span>
      </Button>
      {expanded && <div className="pl-4">
        {folderItem.items.map((item, index) => <CollectionExplorerEntry key={item.name} collectionItem={item} onItemSelected={path => onItemSelected([index, ...path])} />)}
      </div>}
    </>
  )
}

type CollectionExplorerRequestEntryProps = {
  requestItem: PostmanCollectionRequestItem;
  onItemSelected: () => void;
}

function CollectionExplorerRequestEntry({ requestItem, onItemSelected }: CollectionExplorerRequestEntryProps) {
  return (
    <Button className="w-full justify-start" variant="ghost" onClick={onItemSelected}>
      <Braces />
      <span className="truncate ml-1">{requestItem.name}</span>
    </Button>
  )
}