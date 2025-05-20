import { FaCode } from "react-icons/fa";
import { PostmanCollectionRequestItem } from "../collection/PostmanCollection"

type CollectionEditorSidebarRequestEntryProps = {
  requestItem: PostmanCollectionRequestItem;
}

export default function CollectionEditorSidebarRequestEntry({ requestItem }: CollectionEditorSidebarRequestEntryProps) {
  return (
    <button className="sidebar-entry-container">
      <FaCode />
      <span style={{ marginLeft: "0.5em" }}>{requestItem.name}</span>
    </button>
  )
}