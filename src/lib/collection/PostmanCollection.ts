export type PostmanCollection = {
  name: string;
  description?: string;
  items: PostmanCollectionItem[];
};

export type PostmanCollectionItem =
  | PostmanCollectionRequestItem
  | PostmanCollectionFolderItem;

export type PostmanCollectionFolderItem = {
  name: string;
  description?: string;
  items: PostmanCollectionItem[];
};

export type PostmanCollectionRequestItem = {
  name: string;
  description?: string;
  request: PostmanCollectionRequest;
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

  export function methodAllowsRequestBody(method: HttpMethod): boolean {
    if (["POST", "PUT", "PATCH"].includes(method)) {
      return true;
    }
    return false;
  }
  

export type PostmanHeader = { key: string; value: string };

export type PostmanCollectionRequest = {
  method: HttpMethod;
  url: string;
  body?: string;
  headers: PostmanHeader[];
};

/**
 * Type-guard: true if `item` is a PostmanCollectionRequestItem.
 */
export function isRequestItem(
  item: PostmanCollectionItem
): item is PostmanCollectionRequestItem {
  return "request" in item;
}

/**
 * Parses a Postman Collection v2.1 JSON string into our PostmanCollection.
 * Throws on missing or invalid fields.
 */
export function parsePostmanCollection(
  v21JsonString: string
): PostmanCollection {
  let raw: any;
  try {
    raw = JSON.parse(v21JsonString);
  } catch {
    throw new Error("Invalid JSON");
  }
  if (
    !raw.info ||
    typeof raw.info.name !== "string" ||
    !Array.isArray(raw.item)
  ) {
    throw new Error("Invalid Postman v2.1 collection format");
  }

  const topDesc =
    typeof raw.info.description === "string"
      ? raw.info.description
      : undefined;

  function parseItems(arr: any[]): PostmanCollectionItem[] {
    return arr.map((entry, idx) => {
      const desc =
        typeof entry.description === "string"
          ? entry.description
          : undefined;

      // Folder?
      if (Array.isArray(entry.item)) {
        if (typeof entry.name !== "string") {
          throw new Error(`Invalid folder at index ${idx}`);
        }
        return {
          name: entry.name,
          description: desc,
          items: parseItems(entry.item),
        } as PostmanCollectionFolderItem;
      }

      // Request?
      if (entry.request) {
        if (typeof entry.name !== "string") {
          throw new Error(`Invalid request item at index ${idx}`);
        }
        const req = entry.request;

        // Method
        if (typeof req.method !== "string") {
          throw new Error(
            `Missing or invalid method in request "${entry.name}"`
          );
        }
        const method = req.method.toUpperCase();
        const validMethods = new Set<HttpMethod>([
          "GET",
          "POST",
          "PUT",
          "PATCH",
          "DELETE",
          "HEAD",
          "OPTIONS",
        ]);
        if (!validMethods.has(method as HttpMethod)) {
          throw new Error(
            `Unsupported HTTP method "${req.method}" in "${entry.name}"`
          );
        }

        // URL as plain string
        let urlString: string;
        if (typeof req.url === "string") {
          urlString = req.url;
        } else if (
          typeof req.url === "object" &&
          typeof (req.url as any).raw === "string"
        ) {
          urlString = (req.url as any).raw;
        } else {
          throw new Error(`Invalid URL in request "${entry.name}"`);
        }
        if (urlString.trim() === "") {
          throw new Error(`Empty URL in request "${entry.name}"`);
        }

        // Headers as array
        const headers: PostmanHeader[] = [];
        if (Array.isArray(req.header)) {
          for (const h of req.header) {
            const key = (h as any).key ?? (h as any).name;
            const val = (h as any).value;
            if (typeof key === "string" && typeof val === "string") {
              headers.push({ key, value: val });
            }
          }
        }

        // Body
        let body: string | undefined;
        if (req.body && req.body.mode === "raw") {
          if (typeof req.body.raw === "string") {
            body = req.body.raw;
          } else {
            throw new Error(`Invalid raw body in "${entry.name}"`);
          }
        }

        return {
          name: entry.name,
          description: desc,
          request: {
            method: method as HttpMethod,
            url: urlString,
            headers,
            ...(body !== undefined ? { body } : {}),
          },
        } as PostmanCollectionRequestItem;
      }

      throw new Error(
        `Entry at index ${idx} is neither a folder nor a request`
      );
    });
  }

  return {
    name: raw.info.name,
    description: topDesc,
    items: parseItems(raw.item),
  };
}

/**
 * Serializes our PostmanCollection back into a Postman v2.1 JSON string,
 * preserving all descriptions and using plain-string URLs.
 */
export function serializePostmanCollection(
  collection: PostmanCollection
): string {
  const info: any = {
    name: collection.name,
    schema:
      "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  };
  if (collection.description) {
    info.description = collection.description;
  }

  function serializeItems(
    items: PostmanCollectionItem[]
  ): any[] {
    return items.map((it) => {
      const base: any = { name: it.name };
      if ("description" in it && it.description) {
        base.description = it.description;
      }

      if ("items" in it) {
        // Folder
        return {
          ...base,
          item: serializeItems(it.items),
        };
      }

      // Request
      const req = (it as PostmanCollectionRequestItem).request;
      const headerArr = req.headers.map(({ key, value }) => ({ key, value }));
      const bodyObj =
        req.body !== undefined
          ? {
              mode: "raw",
              raw: req.body,
              options: { raw: { language: "json" } },
            }
          : undefined;

      return {
        ...base,
        request: {
          method: req.method,
          header: headerArr,
          ...(bodyObj ? { body: bodyObj } : {}),
          url: req.url,
        },
      };
    });
  }

  const v21 = {
    info,
    item: serializeItems(collection.items),
  };

  return JSON.stringify(v21, null, 2);
}
