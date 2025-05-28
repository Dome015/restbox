import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PostmanCollection, PostmanCollectionFolderItem, PostmanCollectionItem, PostmanCollectionRequestItem } from "@/lib/collection/PostmanCollection";
import { useMemo, useState } from "react";
import CollectionExplorer from "./collection-explorer";
import RequestEditor from "./request-editor";
import { showError } from "@/lib/error-handling";

type CollectionViewProps = {
  activeCollection: PostmanCollection;
}

export default function CollectionView({ activeCollection }: CollectionViewProps) {
  const [selectedPath, setSelectedPath] = useState<number[]>([]);

  const selectedRequestItem = useMemo(() => {
    if (selectedPath.length > 0) {
      try {
        let currentItem: PostmanCollectionItem | null = null;
        for (const index of selectedPath) {
          if (!currentItem) {
            currentItem = activeCollection.items[index];
          } else {
            currentItem = (currentItem as PostmanCollectionFolderItem).items[index];
          }
        }
        return currentItem as PostmanCollectionRequestItem;
      } catch (error) {
        showError(error);
        return null;
      }
    }
    return null;
  }, [selectedPath, activeCollection]);

  return (
    <div className="w-full h-full flex-grow flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={25} className="overflow-y-auto">
          <CollectionExplorer activeCollection={activeCollection} onItemSelected={path => setSelectedPath(path)} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          {selectedRequestItem !== null && <RequestEditor requestItem={selectedRequestItem} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}