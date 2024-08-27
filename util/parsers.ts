// TODO consider moving these metods to Product class?
// TODO change to TypeScript type corresponding to Java's BigDecimal
/**
 * Parses prices from format '$ 123.23' to numeric value
 * Ignores surroinding whitespaces
 * @param priceText 
 * @returns number, NaN if fails to parse
 */
export function parsePrice(priceText: string | null): number {
    return Number.parseFloat(priceText?.match(/\$([0-9.]+)/)?.[1] ?? 'NaN');
}

/**
 * extracts <count> of ratings from string that contains phrase: <count> Review
 * @param text 
 * @returns extracted count of ratings on success, or NaN on failure
 */
export function parseRatingsCount(text: string | null) {
    const stringNumber = text?.match(/(\d+)\s+Review/)?.[1];
    return Number.parseInt(stringNumber ?? 'NaN');
}