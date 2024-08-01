export interface SeoMetaTags {
    title: string;
    description?: string;
    image?: string;
    route: string;
    author?: string;
    type?: 'article' | 'profile' | 'website';
}
