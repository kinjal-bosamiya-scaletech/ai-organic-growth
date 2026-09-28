import * as React from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onBlur?: () => void;
  suggestions: string[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
}

/** Free-text input with a filtered dropdown of suggestions; typing anything not in the list is still accepted. */
export function AutocompleteInput({
  value,
  onChange,
  onSubmit,
  onBlur,
  suggestions,
  isLoading,
  placeholder,
  className,
  disabled,
  "aria-invalid": ariaInvalid,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return suggestions.slice(0, 10);
    return suggestions.filter((s) => s.toLowerCase().includes(query));
  }, [value, suggestions]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filtered.length === 0) {
      if (e.key === "Enter") onSubmit?.();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
        e.preventDefault();
        selectSuggestion(filtered[highlightedIndex]);
      } else {
        setIsOpen(false);
        onSubmit?.();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        autoComplete="off"
      />
      {isOpen && (isLoading || filtered.length > 0) ? (
        <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border bg-popover p-1 text-sm shadow-md">
          {isLoading ? (
            <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Loading saved pages…
            </div>
          ) : (
            filtered.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(suggestion)}
                className={cn(
                  "block w-full truncate rounded-md px-2 py-1.5 text-left text-foreground hover:bg-muted",
                  index === highlightedIndex && "bg-muted"
                )}
              >
                {suggestion}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
