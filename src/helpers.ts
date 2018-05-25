
export function getContextFromText(text: string, index: number, length: number): string {
    const start = index < 50 ? 0 : index - 50;
    return text.substring(start, index + length + 50);
}
