//% block="JSON" color=#0087BD
namespace magicube.json {
    //% block="convert %data to json"
    export function stringify(data: any): string | undefined {
        return convertToJsonValue(data);
    }

    function convertToJsonValue(data: any, undefinedAsNull = false): string | undefined {
        switch (typeof data) {
            case "boolean":
            case "number":
                return `${data}`;
            case "string":
                return quoteString(data);
            case "object":
                if (data === null) {
                    return "null";
                }
                if (Array.isArray(data)) {
                    return `[${(data as any[]).map(v => convertToJsonValue(v, true)).join(",")}]`;
                }
                if (typeof data.toJSON === "function") {
                    return convertToJsonValue(data.toJSON());
                }
                return `{${Object.keys(data).reduce((accumulator: string[], currentValue) => {
                    const v = convertToJsonValue(data[currentValue]);
                    if (v !== undefined) {
                        accumulator.push(`${quoteString(currentValue)}:${v}`);
                    }
                    return accumulator;
                }, []).join(",")}}`;
            default:
                return undefinedAsNull ? "null" : undefined;
        }
    }

    function quoteString(str: string) {
        let output = "\"";
        for (let i = 0; i < str.length; i++) {
            output += escapeChar(str[i]);
        }
        return output + "\"";
    }

    function escapeChar(c: string) {
        switch (c) {
            case "\\":
                return "\\\\";
            case "\"":
                return "\\\"";
            case "\r":
                return "\\r";
            case "\n":
                return "\\n";
            default:
                return c;
        }
    }
}