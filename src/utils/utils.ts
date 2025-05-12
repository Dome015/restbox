import { readTextFile } from "@tauri-apps/plugin-fs";
import { Body, Collection, CollectionFolder, CollectionItem, CollectionRequest, Header, HttpMethod } from "../types/Collection";

export async function parseCollection(filePath: string): Promise<Collection> {
  const collectionString = await readTextFile(filePath);
  const collectionObject = JSON.parse(collectionString);
  const info = collectionObject["info"];
  if (!info || !info["name"] || !collectionObject["item"]) {
    throw Error("Unexpected collection format");
  }
  const collection: Collection = {
    name: info["name"],
    path: filePath,
    items: []
  };
  for (const item of collectionObject["item"]) {
    if (!item["name"] || (!item["item"] && !item["request"])) {
      throw Error("Unexpected collection item format")
    }
    collection.items.push(parseCollectionItem(item));
  }
  return collection;
}

function parseCollectionItem(collectionItem: any): CollectionItem {
  if (!collectionItem["name"] || (!collectionItem["item"] && !collectionItem["request"])) {
    throw Error("Unexpected collection item format");
  }
  if ("item" in collectionItem) {
    // Folder
    const folder: CollectionFolder = {
      name: collectionItem["name"],
      items: []
    };
    for (const item of collectionItem["item"]) {
      folder.items.push(parseCollectionItem(item));
    }
    return folder;
  }
  // Request
  return parseCollectionRequest(collectionItem);
}

function parseCollectionRequest(collectionRequest: any): CollectionRequest {
  if (!collectionRequest["name"] || !collectionRequest["request"]) {
    throw Error("Unexpected collection request format");
  }
  const requestData = collectionRequest["request"];
  if (!requestData["method"] || !requestData.url?.raw || !requestData["header"]) {
    throw Error("Unexpected collection request data format");
  }
  // we only support text-type headers
  const headers: Header[] = requestData["header"]
    .filter((h: any) => h.type === "text")
    .map((h: any) => ({ key: h.key, value: h.value }));
  const request: CollectionRequest = {
    name: collectionRequest["name"],
    url: new URL(requestData.url.raw),
    method: requestData["method"] as HttpMethod,
    headers,
    body: null
  };
  if (requestData["method"] === "POST" || requestData["method"] === "PUT" || requestData["method"] === "PATCH") {
    if (requestData.body?.mode !== "raw" || !requestData.body.raw) {
      throw Error("Request with unsupported body mode found");
    }
    request.body = JSON.parse(requestData.body.raw) as Body;
  }
  return request;
}