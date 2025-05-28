import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { PostmanCollection } from "@/lib/collection/PostmanCollection"
import CollectionExplorer from "./collection-explorer";

type CollectionViewProps = {
  activeCollection: PostmanCollection;
}

export default function CollectionView({ activeCollection }: CollectionViewProps) {
  return (
    <div className="w-full flex-grow flex flex-col justify-center items-center">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <CollectionExplorer activeCollection={activeCollection} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Request view</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}