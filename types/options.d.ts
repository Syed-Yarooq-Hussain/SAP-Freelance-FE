export interface IOption{
    value: string;
    label: string | number;
    options?: IOption[]
}