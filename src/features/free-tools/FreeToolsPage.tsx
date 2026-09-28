import { Callout } from '@/components/common/Callout';
import { ToolCard } from '@/features/free-tools/components/ToolCard';
import { useActiveProject } from '@/hooks/useActiveProject';

export function FreeToolsPage() {
  const project = useActiveProject();

  const TOOLS = [
    {
      id: 'link-gap',
      name: 'Link Gap',
      icon: '🔗',
      // to: `/app/${project.id}/free-tools/link-gap`,
    },
    {
      id: 'page-audit',
      name: 'Page Audit',
      icon: '🔎',
      to: `/app/${project.id}/free-tools/page-audit`,
    },
    {
      id: 'core-web-vitals',
      name: 'Page Speed Insights',
      icon: '⚡',
      to: `/app/${project.id}/free-tools/core-web-vitals`,
    },
    {
      id: 'built-with',
      name: 'Built With',
      icon: '🧩',
      to: `/app/${project.id}/free-tools/built-with`,
    },
    {
      id: 'uppercase-lowercase',
      name: 'Case Converter',
      icon: 'Tr',
      to: `/app/${project.id}/free-tools/case-converter`,
    },
    {
      id: 'small-text-generator',
      name: 'Small Text Generator',
      icon: 'T',
      to: `/app/${project.id}/free-tools/small-text-generator`,
    },
    {
      id: 'article-title-generator',
      name: 'Title Generator',
      icon: '📝',
      to: `/app/${project.id}/free-tools/article-title-generator`,
    },
    {
      id: 'best-keywords',
      name: 'Your Best Keywords',
      icon: '🎯',
      to: `/app/${project.id}/free-tools/best-keywords`,
    },

    { id: 'plagiarism-checker', name: 'Plagiarism Checker', icon: '📋' },
    // { id: 'article-rewriter', name: 'Article Rewriter', icon: '✏️' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Callout title="More tools coming soon">
        Link Gap, Page Audit, Core Web Vitals, Case Converter, Small Text Generator, Article/Blog Title
        Generator, and Built With are live now — look for the "Live" badge below. The rest are under
        development for {project.domain}.
      </Callout>

      <div>
        <h1 className="text-2xl font-semibold mb-2">SEO Tools</h1>
        <p className="text-muted-foreground">
          A complete set of tools to help with content analysis, writing, and optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            name={tool.name}
            icon={tool.icon}
            to={tool.to}
            comingSoon={!tool.to}
          />
        ))}
      </div>
    </div>
  );
}
