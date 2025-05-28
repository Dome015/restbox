import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { methodAllowsRequestBody, PostmanCollectionRequestItem } from "@/lib/collection/PostmanCollection";
import { SelectGroup } from "@radix-ui/react-select";
import Editor from '@monaco-editor/react';
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";

type RequestEditorProps = {
  requestItem: PostmanCollectionRequestItem;
}

export default function RequestEditor({ requestItem }: RequestEditorProps) {
  const [view, setView] = useState<"body"|"headers">("headers");

  return (
    <div className="p-4 h-full overflow-y-auto flex flex-col gap-y-2">
      <h3>Request</h3>
      <h2 className="text-xl font-semibold">{requestItem.name}</h2>
      {requestItem.description !== undefined && <p>{requestItem.description}</p>}
      <div className="flex gap-x-2">
        <Select value={requestItem.request.method}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="PATCH">PATCH</SelectItem>
              <SelectItem value="HEAD">HEAD</SelectItem>
              <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              <SelectItem value="TRACE">TRACE</SelectItem>
              <SelectItem value="CONNECT">CONNECT</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex-grow-1">
          <Input type="text" value={requestItem.request.url} className="w-full" />
        </div>
      </div>
      <div className="flex gap-x-2">
        <Toggle size="sm" pressed={view === "headers"}>
          Headers
        </Toggle>
        {methodAllowsRequestBody(requestItem.request.method) && <Toggle size="sm" pressed={view === "body"}>
          Body
        </Toggle>}
      </div>
      {methodAllowsRequestBody(requestItem.request.method) &&
      <Editor value={requestItem.request.body || ""} theme="vs-dark" className="flex-grow-1" language="json" />}
    </div>
  )
}