/**
 * Opens a print-only popup scoped to `element` and triggers the browser's print
 * dialog, where the user picks "Save as PDF". Rendering happens in the real
 * browser engine (not a JS canvas snapshot), so modern CSS — oklch/oklab
 * color-mix, container queries, etc. — always renders correctly.
 */
export function printElementAsPdf(element: HTMLElement, title: string) {
  const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (!printWindow) {
    throw new Error(
      "Pop-up blocked — allow pop-ups for this site to download a PDF.",
    );
  }

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join("\n");
      } catch {
        return sheet.href ? `@import url("${sheet.href}");` : "";
      }
    })
    .join("\n");

  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>${styles}</style>
    <style>
      body { margin: 0; padding: 24px; background: #fff; }
      @page { margin: 16px; }
    </style>
  </head>
  <body>${element.outerHTML}</body>
</html>`);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}

/**
 * Word's HTML renderer ignores Tailwind classes, flexbox/grid, and most of the
 * <style> block wholesale, so cloning the live styled DOM collapses into plain
 * stacked text. Instead we build a small, semantic document (headings, tables,
 * lists) using only the inline CSS properties Word actually understands.
 */
export function downloadHtmlAsDoc(
  bodyHtml: string,
  filename: string,
  title: string,
) {
  const html = `<!doctype html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
  </head>
  <body style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1a1a1a;">
    ${bodyHtml}
  </body>
</html>`;

  const blob = new Blob(["﻿", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const H1 = 'style="font-size:18pt;font-weight:bold;margin:0 0 12pt;"';
const H2 =
  'style="font-size:13pt;font-weight:bold;margin:18pt 0 6pt;border-bottom:1pt solid #ccc;padding-bottom:4pt;"';
const H3 = 'style="font-size:11pt;font-weight:bold;margin:10pt 0 4pt;"';
const P = 'style="margin:0 0 8pt;line-height:1.4;"';
const MUTED = 'style="margin:0 0 8pt;line-height:1.4;color:#555;"';
const CODE =
  'style="font-family:Consolas,monospace;background:#f2f2f2;padding:6pt;display:block;white-space:pre-wrap;"';
const TABLE = 'style="border-collapse:collapse;width:100%;margin:0 0 10pt;"';
const TD = 'style="border:1pt solid #ddd;padding:5pt 8pt;text-align:left;"';
const TH =
  'style="border:1pt solid #ddd;padding:5pt 8pt;text-align:left;background:#f5f5f5;font-weight:bold;"';

function esc(text: string | null | undefined) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function list(items: string[]) {
  if (items.length === 0) return "";
  return `<ul style="margin:0 0 8pt;padding-left:18pt;">${items
    .map(
      (item) =>
        `<li style="margin-bottom:3pt;line-height:1.4;">${esc(item)}</li>`,
    )
    .join("")}</ul>`;
}

type PageAnalysisSuggestions = {
  focusKeyword: string;
  keywordVerificationNote: string;
  candidateKeywords: string[];
  currentMetaTitle: string | null;
  titleAssessment: string;
  titleNeedsChange: boolean;
  metaTitle: string;
  currentMetaDescription: string | null;
  descriptionAssessment: string;
  descriptionNeedsChange: boolean;
  metaDescription: string;
  currentH1: string | null;
  h1Suggestion: string | null;
  complianceNote: string | null;
  complianceFlags: string[];
  contentTips: string[];
  keywordIdeas: string[];
};

type PageAnalysisPerformance = {
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
  topQueries: { query: string; position: string }[];
};

type PageAnalysisCompetitorComparison = {
  competitorUrl: string;
  gapAnalysis: string;
  suggestedUpdates: string[];
};

export type PageAnalysisDocInput = {
  url: string;
  indexed: boolean;
  lastCrawlTime?: string | null;
  indexingReason?: string;
  indexingExplanation?: string;
  fixSnippetLabel?: string;
  fixSnippet?: string;
  fixSteps?: string[];
  reindexSteps?: string[];
  indexingCheckFailed?: boolean;
  performance?: PageAnalysisPerformance;
  suggestions?: PageAnalysisSuggestions;
  competitorComparison?: PageAnalysisCompetitorComparison;
};

function metaFieldSection(
  label: string,
  current: string | null,
  assessment: string,
  needsChange: boolean,
  suggested: string,
) {
  return `
    <h3 ${H3}>${esc(label)}</h3>
    <p ${MUTED}>${esc(assessment)}</p>
    ${needsChange && current ? `<p ${P}><s>${esc(current)}</s></p>` : ""}
    <p ${P}><b>${esc(needsChange ? suggested : (current ?? suggested))}</b></p>
  `;
}

function competitorComparisonSection(
  comparison: PageAnalysisCompetitorComparison,
) {
  return `
    <h2 ${H2}>VS ${esc(comparison.competitorUrl)}</h2>
    <p ${P}>${esc(comparison.gapAnalysis)}</p>
    <h3 ${H3}>Updates to beat this competitor</h3>
    ${list(comparison.suggestedUpdates)}
  `;
}

export function buildPageAnalysisDoc(analysis: PageAnalysisDocInput): string {
  const sections: string[] = [
    `<h1 ${H1}>Page Analysis — ${esc(analysis.url)}</h1>`,
  ];

  if (analysis.indexed) {
    sections.push(`<p ${P}><b>${"This page is indexed by Google."}</b></p>`);

    if (analysis.performance) {
      const p = analysis.performance;
      sections.push(`
        <h2 ${H2}>Current search performance · last 28 days</h2>
        <table ${TABLE}>
          <tr><th ${TH}>Clicks</th><th ${TH}>Impressions</th><th ${TH}>CTR</th><th ${TH}>Avg. position</th></tr>
          <tr><td ${TD}>${p.clicks}</td><td ${TD}>${p.impressions}</td><td ${TD}>${esc(p.ctr)}</td><td ${TD}>${esc(p.position)}</td></tr>
        </table>
        ${
          p.topQueries.length > 0
            ? `<h3 ${H3}>Top queries this page ranks for</h3>${list(p.topQueries.map((q) => `${q.query} · pos ${q.position}`))}`
            : ""
        }
      `);
    }

    if (analysis.suggestions) {
      const s = analysis.suggestions;
      sections.push(`
        <h2 ${H2}>Copy-paste improvements</h2>
        <h3 ${H3}>Focus keyword</h3>
        <p ${P}><b>${esc(s.focusKeyword)}</b></p>
        <p ${MUTED}>${esc(s.keywordVerificationNote)}</p>
        ${s.complianceNote ? `<p ${MUTED}><b>Regulated product — compliance note:</b> ${esc(s.complianceNote)}</p>` : ""}
        ${metaFieldSection("Meta title", s.currentMetaTitle, s.titleAssessment, s.titleNeedsChange, s.metaTitle)}
        ${metaFieldSection(
          "Meta description",
          s.currentMetaDescription,
          s.descriptionAssessment,
          s.descriptionNeedsChange,
          s.metaDescription,
        )}
        ${
          s.h1Suggestion
            ? `<h3 ${H3}>H1 suggestion</h3>${s.currentH1 ? `<p ${P}><s>${esc(s.currentH1)}</s></p>` : ""}<p ${P}><b>${esc(s.h1Suggestion)}</b></p>`
            : ""
        }
        ${s.complianceFlags.length > 0 ? `<h3 ${H3}>Flag for legal/regulatory review</h3>${list(s.complianceFlags)}` : ""}
        <h3 ${H3}>Content tips</h3>
        ${list(s.contentTips)}
        <h3 ${H3}>Keyword ideas</h3>
        ${list(s.keywordIdeas)}
      `);
    }
  } else {
    sections.push(
      `<p ${P}><b>${analysis.indexingCheckFailed ? "We couldn't verify this page's indexing status with Google." : "This page is not indexed by Google."}</b></p>`,
    );
    if (analysis.indexingExplanation) {
      sections.push(
        `<h2 ${H2}>Why this page isn't indexed</h2><p ${P}>${esc(analysis.indexingExplanation)}</p>`,
      );
    } else if (analysis.indexingReason) {
      sections.push(
        `<p ${MUTED}>Google's reason: ${esc(analysis.indexingReason)}</p>`,
      );
    }
    if (analysis.fixSteps && analysis.fixSteps.length > 0) {
      sections.push(
        `<h2 ${H2}>What to do</h2><ol>${analysis.fixSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`,
      );
    }
    if (analysis.fixSnippet) {
      sections.push(
        `<h3 ${H3}>${esc(analysis.fixSnippetLabel ?? "Suggested fix")}</h3><pre ${CODE}>${esc(analysis.fixSnippet)}</pre>`,
      );
    }
    if (analysis.reindexSteps && analysis.reindexSteps.length > 0) {
      sections.push(
        `<h2 ${H2}>After you've fixed it — how to resubmit</h2><ol>${analysis.reindexSteps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`,
      );
    }
  }

  if (analysis.competitorComparison) {
    sections.push(competitorComparisonSection(analysis.competitorComparison));
  }

  return sections.join("\n");
}

export type PageAuditCompetitorComparisonDocInput = {
  competitorUrl: string;
  yourScore: number;
  competitorScore: number;
  gapPct: number;
  yourCategoryScores: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  competitorCategoryScores: {
    metadata: number;
    content: number;
    headings: number;
    keywords: number;
  };
  yourOccurrences: number;
  yourOccurrencesPct: number;
  competitorOccurrences: number;
  competitorOccurrencesPct: number;
  checklist: { label: string; you: boolean; competitor: boolean }[];
};

export function buildCompetitorComparisonDoc(
  comparison: PageAuditCompetitorComparisonDocInput,
): string {
  const categoryRow = (
    label: string,
    key: keyof PageAuditCompetitorComparisonDocInput["yourCategoryScores"],
  ) =>
    `<tr><td ${TD}>${esc(label)}</td><td ${TD}>${comparison.yourCategoryScores[key]}%</td><td ${TD}>${comparison.competitorCategoryScores[key]}%</td></tr>`;

  return `
    <h1 ${H1}>Competitor Analysis — vs ${esc(comparison.competitorUrl)}</h1>

    <h2 ${H2}>Competitor SEO score</h2>
    <table ${TABLE}>
      <tr><th ${TH}></th><th ${TH}>You</th><th ${TH}>Competitor</th></tr>
      <tr><td ${TD}><b>Overall score</b></td><td ${TD}><b>${comparison.yourScore}%</b></td><td ${TD}><b>${comparison.competitorScore}%</b></td></tr>
      ${categoryRow("Metadata", "metadata")}
      ${categoryRow("Content", "content")}
      ${categoryRow("Headings", "headings")}
      ${categoryRow("Keywords", "keywords")}
    </table>

    <h2 ${H2}>Ranking potential</h2>
    <p ${P}><b>${comparison.gapPct >= 0 ? "Your page is in better shape compared to your competitor's page" : "Your page is in worse shape compared to your competitor's page"}</b> (${comparison.gapPct >= 0 ? "+" : ""}${comparison.gapPct}% gap)</p>

    <h3 ${H3}>Keyword usage</h3>
    <table ${TABLE}>
      <tr><th ${TH}></th><th ${TH}>Occurrences</th></tr>
      <tr><td ${TD}>You</td><td ${TD}>${comparison.yourOccurrences} (${comparison.yourOccurrencesPct}%)</td></tr>
      <tr><td ${TD}>Competitor</td><td ${TD}>${comparison.competitorOccurrences} (${comparison.competitorOccurrencesPct}%)</td></tr>
    </table>

    <h3 ${H3}>You vs Competitor checklist</h3>
    <table ${TABLE}>
      <tr><th ${TH}>Item</th><th ${TH}>You</th><th ${TH}>Competitor</th></tr>
      ${comparison.checklist
        .map(
          (item) =>
            `<tr><td ${TD}>${esc(item.label)}</td><td ${TD}>${item.you ? "✓" : "✗"}</td><td ${TD}>${item.competitor ? "✓" : "✗"}</td></tr>`,
        )
        .join("")}
    </table>
  `;
}
