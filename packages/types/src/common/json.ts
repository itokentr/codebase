export type JsonValue = string | number | boolean | null;
export type JsonObject = {
  [index: string]: JsonValue | JsonObject | JsonArray;
};
export type JsonArray = (JsonValue | JsonObject | JsonArray)[];
export type JsonLike = JsonObject | JsonArray | null;
