// Shared DOMPurify whitelist for generated article HTML — keep the on-page
// render (ArticleContentCard) and the downloadable doc (DownloadDocumentButton)
// in sync with each other and with the backend's allowed-tags contract
// (content-generation.service.ts EDIT_PROMPT / generation prompt).
export const ARTICLE_ALLOWED_TAGS = [
  "h2",
  "h3",
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "a",
  "table",
  "thead",
  "tbody",
  "tr",
  "th",
  "td",
];

export const ARTICLE_ALLOWED_ATTR = ["href"];
