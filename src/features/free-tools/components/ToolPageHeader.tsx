interface ToolPageHeaderProps {
  title: string;
  description: string;
}

/**
 * Page heading for a tool page.
 *
 * The "Back to Free Tools" link is gone: the Topbar now renders real
 * breadcrumbs (Tools › Page Audit), so a second back-affordance on the page
 * was duplicate navigation on all eight tool pages.
 */
export function ToolPageHeader({ title, description }: Readonly<ToolPageHeaderProps>) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-md text-muted-foreground">{description}</p>
    </div>
  );
}
