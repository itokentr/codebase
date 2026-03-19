export interface HeaderFieldStringKind<T extends string> {
  readonly kind: T;
}

export class HeaderFieldCommentString extends String
  implements HeaderFieldStringKind<'comment'> {
  readonly kind = 'comment';
}

export class HeaderFieldQuotedString extends String
  implements HeaderFieldStringKind<'queted'> {
  readonly kind = 'queted';
}

export class HeaderFieldRawString extends String
  implements HeaderFieldStringKind<'raw'> {
  readonly kind = 'raw';
}

export type HeaderFieldString =
  | HeaderFieldCommentString
  | HeaderFieldQuotedString
  | HeaderFieldRawString;
export type HeaderFieldParam = Map<string, HeaderFieldString[]>;
export type HeaderFieldValue = HeaderFieldString[] | HeaderFieldParam;
/** Subgroup of field values, delimited by ";" for example */
export type HeaderFieldValueDelimited = HeaderFieldValue[];
/** Group of field values, delimited by "," for example */
export type HeaderFieldValueList = HeaderFieldValueDelimited[];
