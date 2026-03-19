// dprint-ignore-file
const $ALPHA = '[a-zA-Z]';
const $DIGIT = '[0-9]';
const $HEXDIG = '[0-9a-fA-F]';
const $SUB_DELIMS = '[!$&"()*+,;=]';
// const $GEN_DELIMS       = '[:\\/?#\\[\\]@]';
// const $RESERVED         = '(?:' + $GEN_DELIMS + '|' + $SUB_DELIMS + ')';
const $UNRESERVED = '(?:' + $ALPHA + '|' + $DIGIT + '|[-\\._~])';
const $PCT_ENCODED = '%' + $HEXDIG + '{2}';
const $PCHAR =
  '(?:' + $UNRESERVED + '|' + $PCT_ENCODED + '|' + $SUB_DELIMS + '|[:@])';
const $FRAGMENT = '(?:' + $PCHAR + '|[\\/?])*';
const $QUERY = '(?:' + $PCHAR + '|[\\/?])*';
const $SEGMENT = $PCHAR + '*';
const $SEGMENT_NON_ZERO = $PCHAR + '+';
// const $SEGMENT_NON_ZERO_NO_COLON
//                         = '(?:' + $UNRESERVED + '|' + $PCT_ENCODED + '|' + $SUB_DELIMS + '|@)+';
const $PATH_ABS_EMPTY = '(?:\\/' + $SEGMENT + ')*';
const $PATH_ABS = '\\/(?:' + $SEGMENT_NON_ZERO + '(?:/' + $SEGMENT + ')*)?';
// const $PATH_NOSCHEME    = $SEGMENT_NON_ZERO_NO_COLON + '(?:\\/' + $SEGMENT + ')*';
const $PATH_ROOTLESS = $SEGMENT_NON_ZERO + '(?:\\/' + $SEGMENT + ')*';
const $PATH_EMPTY = '\\.{0}';
// const $PATH             = '(?:' + $PATH_ABS_EMPTY + '|' + $PATH_ABS + '|' + $PATH_NOSCHEME
//                         + '|' + $PATH_ROOTLESS + '|' + $PATH_ROOTLESS + ')';
const $REG_NAME =
  '(?:' + $UNRESERVED + '|' + $PCT_ENCODED + '|' + $SUB_DELIMS + ')*';
const $DECIMAL_OCTET =
  '(?:' +
  $DIGIT + // 0-9
  '|[1-9]' +
  $DIGIT + // 10-99
  '|1' +
  $DIGIT +
  '{2}' + // 100-199
  '|2[0-4]' +
  $DIGIT + // 200-249
  '|25[0-5])'; // 250-255
// TODO: support ipv6 addresses
const $IPV4_ADDRESS =
  $DECIMAL_OCTET +
  '\\.' +
  $DECIMAL_OCTET +
  '\\.' +
  $DECIMAL_OCTET +
  '\\.' +
  $DECIMAL_OCTET;
const $H16 = $HEXDIG + '{1,4}';
const $LS32 = '(?:' + $H16 + ':' + $H16 + '|' + $IPV4_ADDRESS + ')';
const $IPV6_ADDRESS =
  '(?:(?:' +
  $H16 +
  ':){6}' +
  $LS32 +
  '|::(?:' +
  $H16 +
  ':){5}' +
  $LS32 +
  '|(?:' +
  $H16 +
  ')?::(?:' +
  $H16 +
  ':){4}' +
  $LS32 +
  '|(?:(?:' +
  $H16 +
  ':){,1}' +
  $H16 +
  ')?::(?:' +
  $H16 +
  ':){3}' +
  $LS32 +
  '|(?:(?:' +
  $H16 +
  ':){,2}' +
  $H16 +
  ')?::(?:' +
  $H16 +
  ':){2}' +
  $LS32 +
  '|(?:(?:' +
  $H16 +
  ':){,3}' +
  $H16 +
  ')?::' +
  $H16 +
  ':' +
  $LS32 +
  '|(?:(?:' +
  $H16 +
  ':){,4}' +
  $H16 +
  ')?::' +
  $LS32 +
  '|(?:(?:' +
  $H16 +
  ':){,5}' +
  $H16 +
  ')?::' +
  $H16 +
  '|(?:(?:' +
  $H16 +
  ':){,6}' +
  $H16 +
  ')?::)';
const $IP_V_FUTURE =
  'v' +
  $HEXDIG +
  '{1,}\\.' +
  '(?:' +
  $UNRESERVED +
  '|' +
  $SUB_DELIMS +
  '|:){1,}';
const $IP_LITERAL = '\\[(?:' + $IPV6_ADDRESS + '|' + $IP_V_FUTURE + ')\\]';
const $PORT = $DIGIT + '+';
const $HOST = '(?:' + $REG_NAME + '|' + $IPV4_ADDRESS + '|' + $IP_LITERAL + ')';
const $USERINFO =
  '(?:' + $UNRESERVED + '|' + $PCT_ENCODED + '|' + $SUB_DELIMS + '|:){0,}';

const $AUTHORITY =
  '(?:(' +
  $USERINFO +
  ')@)?' + // $2  = UserInfo
  '(' +
  $HOST +
  ')' + // $3  = Host
  '(?::(' +
  $PORT +
  '))?'; // $4  = Port

const $SCHEME =
  '(' +
  $ALPHA +
  '(?:' + // $1  = Scheme
  $ALPHA +
  '|' +
  $DIGIT +
  '|[-+.])*)';
// const $RELATIVE_PART    = '(?://' + $AUTHORITY         // $9  = UserInfo (in AUTHORITY)
//                                                        // $10 = Host     (in AUTHORITY)
//                                                        // $11 = Port     (in AUTHORITY)
//                         + '(' + $PATH_ABS_EMPTY + ')|' // $12 = Absulute empty path
//                         + '(' + $PATH_ABS              // $13 = or Any path
//                         + '|' + $PATH_NOSCHEME
//                         + '|' + $PATH_EMPTY + '))';
// const $RELATIVE_REF     = $RELATIVE_PART
//                         + '(?:\\?(' + $QUERY + '))?'   // $14 = Query    (in relative)
//                         + '(?:#(' + $FRAGMENT + '))?'; // $15 = Fragment (in relative)
const $HIER_PART =
  '(?://' +
  $AUTHORITY +
  '(' +
  $PATH_ABS_EMPTY +
  ')|' + // $5  = Absolute path with authority
  '(' +
  $PATH_ABS + // $6  = Any path without authority
  '|' +
  $PATH_ROOTLESS +
  '|' +
  $PATH_EMPTY +
  '))';
const $URI =
  $SCHEME +
  ':' +
  $HIER_PART +
  '(?:\\?(' +
  $QUERY +
  '))?' + // $7  = Query
  '(?:#(' +
  $FRAGMENT +
  '))?'; // $8  = Fragment

// const $URI_REGEX = '(?:' + $URI + '|' + $RELATIVE_REF + ')';
// const $URI_HOST_REGEX = $HOST;
// const $URI_UNSAFE_CHR_REGEX = '[^A-Za-z0-9!"#\\$%&()*+,\\-\\.\\/:;=?@\\[\\]_~]';

export default $URI;
