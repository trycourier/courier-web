/**
 * Helpers for safely embedding dynamic values into inline GraphQL documents.
 *
 * The clients build GraphQL queries as template strings. Any caller- or
 * server-supplied value (message ids, topic ids, tenant/account ids, filter
 * tags, `from` cursors, etc.) that is interpolated into a query must be
 * escaped, otherwise a value containing a `"` could break out of its string
 * literal and inject arbitrary GraphQL (GraphQL injection).
 */

const CONTROL_AND_QUOTE = /[\u0000-\u001F\\"]/g;

/**
 * Escapes a string for safe interpolation inside a GraphQL double-quoted
 * string literal (i.e. between the quotes of `"..."`).
 *
 * Follows the StringValue grammar from the GraphQL spec: backslash and double
 * quote are escaped, control characters use their named escape where one
 * exists and `\uXXXX` otherwise.
 *
 * @see https://spec.graphql.org/draft/#sec-String-Value
 */
export function escapeGraphQLString(value: string): string {
  return String(value).replace(CONTROL_AND_QUOTE, (ch) => {
    switch (ch) {
      case '\\': return '\\\\';
      case '"': return '\\"';
      case '\b': return '\\b';
      case '\f': return '\\f';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      default:
        return '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    }
  });
}

/**
 * Validates a value used in an *unquoted* GraphQL position (enum value, field
 * name, etc.) where {@link escapeGraphQLString} cannot help because there are
 * no surrounding quotes to contain it. Only GraphQL Name characters are
 * allowed; anything else throws rather than risk injecting query structure.
 *
 * @see https://spec.graphql.org/draft/#sec-Names
 */
export function assertSafeGraphQLEnumValue(value: string, label = 'value'): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new Error(`Invalid GraphQL ${label}: ${JSON.stringify(value)}`);
  }
  return value;
}
