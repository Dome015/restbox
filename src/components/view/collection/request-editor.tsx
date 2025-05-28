import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { methodAllowsRequestBody, PostmanCollectionRequestItem } from "@/lib/collection/PostmanCollection";
import { SelectGroup } from "@radix-ui/react-select";
import Editor from '@monaco-editor/react';
import { useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

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
        <Toggle size="sm" pressed={view === "headers"} onClick={() => setView("headers")}>
          Headers
        </Toggle>
        {methodAllowsRequestBody(requestItem.request.method) && <Toggle size="sm" pressed={view === "body"} onClick={() => setView("body")}>
          Body
        </Toggle>}
      </div>
      {view === "headers" &&
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Header</TableHead>
              <TableHead>Value</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestItem.request.headers.map(header => <TableRow key={header.key}>
              <TableCell><Input type="text" value={header.key} className="w-full" /></TableCell>
              <TableCell><Input type="text" value={header.value} className="w-full" /></TableCell>
              <TableCell><Button variant="ghost" size="icon"><Trash /></Button></TableCell>
            </TableRow>)}
          </TableBody>
          <TableCaption>
            <Button>Add header</Button>
          </TableCaption>
        </Table>
      }
      {methodAllowsRequestBody(requestItem.request.method) && view === "body" &&
        <div className="flex-grow-1">
          <Editor value={requestItem.request.body || ""} theme="vs-dark" height="100%" language="json" />
        </div>
      }
    </div>
  )
}