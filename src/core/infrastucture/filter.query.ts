export type Condition<T> = T | null | { $ne: T };
export type Filter<T> = {
    [P in keyof T]?: Condition<T[P]>;
};

export class FilterQuery<T extends Record<string, any>> {
    constructor(private readonly filter: Filter<T>) {}

    buildWhereClause(): { clause: string; values: any[] } {
        const keys = Object.keys(this.filter) as (keyof T)[];
        const conditions: string[] = [];
        const values: any[] = [];

        let index = 1;

        for (const key of keys) {
            const value = this.filter[key];

            if (value === null) {
                conditions.push(`"${String(key)}" IS NULL`);
                continue;
            }

            if (typeof value === 'object' && value !== null && '$ne' in value) {
                conditions.push(`"${String(key)}" <> $${index}`);
                values.push(value.$ne);
                index++;
                continue;
            }

            if (value !== undefined) {
                conditions.push(`"${String(key)}" = $${index}`);
                values.push(value);
                index++;
            }
        }

        const clause = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';
        return { clause, values };
    }
}