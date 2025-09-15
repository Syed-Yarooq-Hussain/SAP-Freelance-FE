export interface IPageProps {
    params: Params;
    searchParams?: SearchParams;
}
type SearchParams = Promise<{ [key: string]: string | undefined }>
type Params = Promise<{ slug: string }>