export interface BestKeywordItem {
  keyword: string;
  volume: number;
}

export interface BestKeywordCategory {
  id: string;
  title: string;
  items: BestKeywordItem[];
}

export interface BestKeywordsResult {
  url: string;
  domain: string;
  topic: string;
  categories: BestKeywordCategory[];
}
