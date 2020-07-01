export function format(text: string, ...args: any[]): string {
    let result = text;
    for (let index in args) {
        result = result.replace(`{${index}}`, args[index])
    }
    return result;
}