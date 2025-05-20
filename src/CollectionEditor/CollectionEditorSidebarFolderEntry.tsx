import { FaFolder } from "react-icons/fa";
import { PostmanCollectionFolderItem } from "../collection/PostmanCollection";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useState } from "react";
import CollectionEditorSidebar from "./CollectionEditorSidebar";

type CollectionEditorSidebarFolderEntryProps = {
  folderItem: PostmanCollectionFolderItem;
}

export default function CollectionEditorSidebarFolderEntry({ folderItem }: CollectionEditorSidebarFolderEntryProps) {
  const [expanded, setExpanded] = useState(false);

  return <>
    <button className="sidebar-entry-container" onClick={() => setExpanded(e => !e)}>
      <FaFolder />
      <span className="sidebar-entry-name">{folderItem.name}</span>
      {!expanded ? <IoIosArrowDown /> : <IoIosArrowUp />}
    </button>
    {expanded && <div style={{ marginLeft: "1em"}}><CollectionEditorSidebar items={folderItem.items} /></div>}
  </>
}