import { PostmanCollection } from "@/lib/collection/PostmanCollection"
import { Button } from "../ui/button";

type HeaderProps = {
  activeCollection: PostmanCollection | null;
}

export default function Header({ activeCollection }: HeaderProps) {
  return (
    <div className="w-full p-2 bg-primary text-primary-foreground flex items-center justify-between">
      <div>{activeCollection?.name || "RestBox"}</div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost">Requests</Button>
        <Button variant="ghost">Actions</Button>
      </div>
    </div>
  )
}