import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PostmanCollection } from "@/lib/collection/PostmanCollection";
import CollectionExplorer from "./collection-explorer";
import { useState } from "react";

type CollectionViewProps = {
  activeCollection: PostmanCollection;
}

export default function CollectionView({ activeCollection }: CollectionViewProps) {
  const [selectedPath, setSelectedPath] = useState<number[]>([]);

  return (
    <div className="w-full flex-grow flex flex-col justify-center items-center">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25}>
          <CollectionExplorer activeCollection={activeCollection} onItemSelected={path => setSelectedPath(path)} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>{JSON.stringify(selectedPath)}</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}