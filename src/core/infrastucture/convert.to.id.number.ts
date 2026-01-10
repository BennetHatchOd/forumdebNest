export function convertToIdNumber(id: string): null| number   {
    const numericId = Number(id);
    if (Number.isNaN(numericId) || !Number.isInteger(numericId) || numericId < 1)
        return null;
    return numericId;
}