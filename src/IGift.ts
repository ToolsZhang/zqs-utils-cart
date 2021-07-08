export interface IGift {
    name: string;
    available: boolean;
    checked: boolean;
    additionalPrice: number;
    [x: string]: any;
}