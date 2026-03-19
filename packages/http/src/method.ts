export type HttpRequestMethod =
  | `CONNECT`
  | `DELETE`
  | `GET`
  | `HEAD`
  | `OPTIONS`
  | `PATCH`
  | `POST`
  | `PUT`
  | `TRACE`;

export function assertHttpMethod(
  value: unknown,
): asserts value is HttpRequestMethod {
  if (typeof value !== `string`) {
    value = String(value);
  }
  value = (value as string).toUpperCase();
  switch (value as HttpRequestMethod) {
    case `CONNECT`:
    case `DELETE`:
    case `GET`:
    case `HEAD`:
    case `OPTIONS`:
    case `PATCH`:
    case `POST`:
    case `PUT`:
    case `TRACE`: {
      break;
    }
    default: {
      throw Error(
        `specified value "${value as string}" is not an http request method`,
      );
    }
  }
}
