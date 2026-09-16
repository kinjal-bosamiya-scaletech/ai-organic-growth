import { ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, Search } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * One table system for the whole product.
 *
 * Six tables existed before this, each a hand-rolled CSS grid with its own
 * column string, its own header casing and its own border weight — and none of
 * them were a `<table>`, so none announced row/column relationships to a screen
 * reader. These are thin wrappers over real table elements: the semantics come
 * for free and the styling can only be defined once.
 *
 * Responsiveness: the scroll container keeps a wide table usable on a phone
 * without squashing columns. Individual columns opt out at narrow widths with
 * `className="hidden md:table-cell"` on BOTH the header cell and the body cell.
 */

type Align = "start" | "end";

const ALIGN: Record<Align, string> = {
  start: "text-left",
  end: "text-right",
};

export function DataTable({
  className,
  children,
  ...props
}: Readonly<React.ComponentProps<"table">>) {
  return (
    <div className="scroll-slim w-full overflow-x-auto">
      <table
        className={cn("w-full caption-bottom border-collapse text-sm", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function DataTableHead({ className, ...props }: Readonly<React.ComponentProps<"thead">>) {
  return <thead className={cn("bg-muted/60", className)} {...props} />;
}

export function DataTableBody({ className, ...props }: Readonly<React.ComponentProps<"tbody">>) {
  return <tbody className={className} {...props} />;
}

export function DataTableRow({
  className,
  interactive = false,
  ...props
}: Readonly<React.ComponentProps<"tr"> & { interactive?: boolean }>) {
  return (
    <tr
      className={cn(
        // Horizontal rules only. Vertical borders on a data table add a grid of
        // lines the eye has to read past to reach the numbers.
        "border-b border-border last:border-b-0",
        interactive && "transition-colors hover:bg-muted/50",
        className,
      )}
      {...props}
    />
  );
}

interface DataTableHeaderCellProps extends Omit<React.ComponentProps<"th">, "onClick" | "align"> {
  /** Named `justify`, not `align` — `align` is a (deprecated) native th/td attribute. */
  justify?: Align;
  /** Omit to render a plain, non-interactive header. */
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

export function DataTableHeaderCell({
  className,
  justify = "start",
  sortDirection,
  onSort,
  children,
  ...props
}: Readonly<DataTableHeaderCellProps>) {
  const base = cn(
    "px-4 py-2.5 text-2xs font-semibold tracking-[0.06em] whitespace-nowrap text-muted-foreground uppercase",
    ALIGN[justify],
    className,
  );

  if (!onSort) {
    return (
      <th scope="col" className={base} {...props}>
        {children}
      </th>
    );
  }

  const SortIcon = sortDirection ? ChevronUp : ChevronsUpDown;
  return (
    <th
      scope="col"
      // Announced to assistive tech, so sort state isn't carried by the glyph alone.
      aria-sort={sortDirection === "asc" ? "ascending" : sortDirection === "desc" ? "descending" : "none"}
      className={cn(base, "p-0")}
      {...props}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          "inline-flex w-full cursor-pointer items-center gap-1 px-4 py-2.5 transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          justify === "end" && "justify-end",
        )}
      >
        {children}
        <SortIcon
          className={cn(
            "size-3 shrink-0 transition-transform",
            sortDirection === "desc" && "rotate-180",
            sortDirection ? "text-brand-ink" : "text-border-strong",
          )}
          aria-hidden="true"
        />
      </button>
    </th>
  );
}

export function DataTableCell({
  className,
  justify = "start",
  ...props
}: Readonly<Omit<React.ComponentProps<"td">, "align"> & { justify?: Align }>) {
  // 14px vertical padding gives a 44px row — comfortable without being airy.
  return <td className={cn("px-4 py-3.5 align-middle", ALIGN[justify], className)} {...props} />;
}

/** Full-width message row, for "no results" inside an otherwise-rendered table. */
export function DataTableEmptyRow({
  colSpan,
  children,
}: Readonly<{ colSpan: number; children: ReactNode }>) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

interface TableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Filter selects, segmented controls, export buttons. */
  children?: ReactNode;
  className?: string;
}

/** Search + filter strip that sits above a table, inside the same card. */
export function TableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  children,
  className,
}: Readonly<TableToolbarProps>) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 px-4 py-3", className)}>
      {onSearchChange ? (
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-8 pl-9 text-sm"
          />
        </div>
      ) : null}
      {children}
    </div>
  );
}

interface TablePaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** e.g. "24 keywords". Rendered on the left. */
  summary?: ReactNode;
}

export function TablePagination({
  page,
  pageCount,
  onPageChange,
  summary,
}: Readonly<TablePaginationProps>) {
  if (pageCount <= 1) return summary ? <div className="px-4 py-3 text-xs text-muted-foreground">{summary}</div> : null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3">
      <span className="text-xs text-muted-foreground">{summary}</span>
      <div className="ms-auto flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>
        <span className="tabular px-1 text-xs text-muted-foreground">
          {page} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
