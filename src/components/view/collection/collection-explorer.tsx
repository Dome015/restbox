import { Button } from "@/components/ui/button";
import { PostmanCollection } from "@/lib/collection/PostmanCollection";

type CollectionExplorerProps = { 
  activeCollection: PostmanCollection;
}

export default function CollectionExplorer({ activeCollection }: CollectionExplorerProps) {
  return (
    <div className="w-full h-full overflow-y-auto">
      {activeCollection.items.map(item => 
        <div className="w-full p-2 pb-0"><Button className="w-full text-left" variant="ghost">{item.name}</Button></div>)}
    </div>
  )
}