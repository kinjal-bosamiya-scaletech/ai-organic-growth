import DOMPurify from "dompurify";
import { FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GeneratedContent } from "@/types/contentGeneration";
import { ARTICLE_ALLOWED_ATTR, ARTICLE_ALLOWED_TAGS } from "@/features/content-generation/articleHtmlSanitizer";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Builds a .doc file (Word's HTML-import format) so the whole generated package opens directly in Word/Google Docs. */
function buildDocument(content: GeneratedContent): string {
  const safeArticleHtml = DOMPurify.sanitize(content.contentHtml, {
    ALLOWED_TAGS: ARTICLE_ALLOWED_TAGS,
    ALLOWED_ATTR: ARTICLE_ALLOWED_ATTR,
  });

  const faqsHtml = content.faqs.length
    ? `<h2>FAQs</h2>${content.faqs
        .map((faq) => `<p><strong>${escapeHtml(faq.question)}</strong><br/>${escapeHtml(faq.answer)}</p>`)
        .join("")}`
    : "";

  return `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(content.blogTitle)}</title>
</head>
<body>
  <h1>${escapeHtml(content.blogTitle)}</h1>
  <p><strong>URL slug:</strong> ${escapeHtml(content.slug)}</p>
  <p><strong>Meta title:</strong> ${escapeHtml(content.metaTitle)}</p>
  <p><strong>Meta description:</strong> ${escapeHtml(content.metaDescription)}</p>
  <p><strong>Focus keyword:</strong> ${escapeHtml(content.focusKeyword)}</p>
  <p><strong>Tags:</strong> ${escapeHtml(content.tags.join(", "))}</p>
  <p><strong>Excerpt:</strong> ${escapeHtml(content.excerpt)}</p>
  <hr/>
  ${safeArticleHtml}
  ${faqsHtml}
</body>
</html>`;
}

export function DownloadDocumentButton({ content }: { content: GeneratedContent }) {
  const handleDownload = () => {
    const html = buildDocument(content);
    const blob = new Blob(["﻿", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${content.slug || "generated-article"}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleDownload}>
      <FileDown />
      Download Document
    </Button>
  );
}
