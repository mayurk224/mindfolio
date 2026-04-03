import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Bookmark,
  Calendar,
  Check,
  ExternalLink,
  Globe,
  Link2,
  Plus,
  Share2,
  Sparkles,
  StickyNote,
  Tag,
  Trash2,
  X,
} from "lucide-react";

const TYPE_LABELS = {
  web: "Web App",
  images: "Image",
  videos: "Video",
  documents: "Document",
  articles: "Article",
  notes: "Note",
  youtube: "YouTube",
  quotes: "Quote",
  posts: "Post",
  snippets: "Snippet",
  other: "Saved Item",
};

function getTypeLabel(type) {
  return TYPE_LABELS[type] || "Saved Item";
}

function getDomain(url) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getRelativeDate(dateValue) {
  if (!dateValue) return "Recently added";
  const now = new Date();
  const createdAt = new Date(dateValue);
  const difference = now.getTime() - createdAt.getTime();
  if (Number.isNaN(difference)) return "Recently added";
  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;
  if (difference < hour) {
    const minutes = Math.max(1, Math.floor(difference / minute));
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }
  if (difference < day) {
    const hours = Math.max(1, Math.floor(difference / hour));
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(difference / day);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function Section({ icon: Icon, title, action, children, className }) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          <span>{title}</span>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function MetaPill({ icon: Icon, children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{children}</span>
    </div>
  );
}

function TagPill({ children }) {
  return (
    <Badge
      variant="secondary"
      className="h-auto rounded-full border border-border/70 bg-secondary/70 px-3 py-1 text-xs font-medium text-foreground"
    >
      {children}
    </Badge>
  );
}

export default function ItemDetailModal({ item, isOpen, onClose }) {
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const tagInputRef = useRef(null);

  useEffect(() => {
    if (!item) return;
    setNotes(item.userNotes || "");
    setTags(item.aiTags || []);
    setIsFavorite(Boolean(item.isFavorite));
    setIsPreviewLoading(Boolean(item.url));
    setIsAddingTag(false);
    setNewTag("");
  }, [item]);

  // Auto-focus the tag input whenever it becomes visible
  useEffect(() => {
    if (isAddingTag) {
      // Small timeout lets the element mount before focusing
      setTimeout(() => tagInputRef.current?.focus(), 0);
    }
  }, [isAddingTag]);

  if (!item) return null;

  const hasUrl = Boolean(item.url);
  const domain = getDomain(item.url);
  const typeLabel = getTypeLabel(item.type);
  const summary =
    item.summary ||
    "No AI summary yet. Once processing finishes, this space can hold a quick overview of the saved item.";

  const handleShare = async () => {
    const sharePayload = {
      title: item.title || "Saved item",
      text: item.summary || item.title || "Check out this saved item",
      url: item.url,
    };
    try {
      if (item.url && navigator.share) {
        await navigator.share(sharePayload);
        return;
      }
      const fallbackValue = item.url || item.title || summary;
      if (navigator.clipboard && fallbackValue) {
        await navigator.clipboard.writeText(fallbackValue);
        toast.success(
          item.url
            ? "Link copied to clipboard."
            : "Details copied to clipboard.",
        );
        return;
      }
      toast.error("Sharing is not available in this browser.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Could not share this item right now.");
      }
    }
  };

  const handleAddTag = () => {
    setIsAddingTag(true);
    setNewTag("");
  };

  const handleConfirmTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) {
      setIsAddingTag(false);
      return;
    }
    const alreadyAdded = tags.some(
      (tag) => tag.toLowerCase() === trimmedTag.toLowerCase(),
    );
    if (alreadyAdded) {
      toast("That tag is already in the list.");
      return;
    }
    setTags((currentTags) => [...currentTags, trimmedTag]);
    setNewTag("");
    setIsAddingTag(false);
    toast.success("Tag added.");
  };

  const handleCancelTag = () => {
    setNewTag("");
    setIsAddingTag(false);
  };

  const handleBookmarkToggle = () => {
    setIsFavorite((currentValue) => !currentValue);
  };

  const handleDelete = () => {
    toast("Delete is not wired up yet.");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] overflow-hidden border border-white/10 bg-background/92 p-0 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:max-w-6xl"
      >
        <DialogTitle className="sr-only">
          {item.title || "Item details"}
        </DialogTitle>

        <div className="grid h-full max-h-[92vh] min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1.9fr)_minmax(320px,0.9fr)]">
          {/* LEFT: preview pane */}
          <div className="relative flex min-h-0 flex-col overflow-hidden p-2 sm:p-5">
            <div className="relative flex-1 overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.85)]">
              {hasUrl ? (
                <>
                  {isPreviewLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-slate-950/80 p-5">
                      <Skeleton className="h-8 w-40 rounded-full bg-white/10" />
                      <Skeleton className="h-full w-full rounded-[1.4rem] bg-white/8" />
                    </div>
                  )}
                  <iframe
                    key={item._id}
                    title={item.title || "Item preview"}
                    src={item.url}
                    loading="lazy"
                    onLoad={() => setIsPreviewLoading(false)}
                    className="h-full min-h-72 w-full bg-white"
                  />
                </>
              ) : (
                <div className="flex h-full min-h-72 flex-col items-center justify-center gap-4 px-6 text-center text-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/8">
                    <Globe className="h-6 w-6 text-white/80" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      No live preview available
                    </h3>
                    <p className="mx-auto max-w-md text-sm leading-relaxed text-white/65">
                      {item.textContent ||
                        "This item does not include a URL, so the preview pane stays in placeholder mode."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: detail sidebar */}
          <div className="flex min-h-0 flex-col border-t border-border/70 bg-background/80 lg:border-l lg:border-t-0">
            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar p-5 sm:p-6">
              <div className="flex flex-col gap-5">
                {/* Header */}
                <div className="flex flex-col gap-4">
                  <Badge
                    variant="secondary"
                    className="h-auto w-fit rounded-full border border-border/70 bg-secondary/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    {typeLabel}
                  </Badge>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-[1.5rem]">
                      {item.title || "Untitled item"}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2">
                      <MetaPill icon={Calendar}>
                        {getRelativeDate(item.createdAt)}
                      </MetaPill>

                      {hasUrl && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              item.url,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                          className="h-8 rounded-full border border-border/70 bg-secondary/45 px-3 text-xs font-medium text-foreground hover:bg-secondary/70"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Visit source
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <Section icon={Sparkles} title="Summary">
                  <div className="rounded-[1.4rem] border border-border/70 bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm">
                    {summary}
                  </div>
                </Section>

                {/* Tags */}
                <Section
                  icon={Tag}
                  title="Tags"
                  action={
                    !isAddingTag && (
                      <Button
                        type="button"
                        size="xs"
                        onClick={handleAddTag}
                        className="rounded-full"
                      >
                        <Plus className="h-4 w-4" />
                        Add Tag
                      </Button>
                    )
                  }
                >
                  {/* Inline input — appears above the badges when active */}
                  {isAddingTag && (
                    <div className="flex items-center gap-2">
                      <Input
                        ref={tagInputRef}
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleConfirmTag();
                          if (e.key === "Escape") handleCancelTag();
                        }}
                        placeholder="e.g. design, reference…"
                        className="h-8 flex-1 rounded-full border border-border/80 bg-background/70 px-4 text-sm"
                      />
                      <Button
                        type="button"
                        size="icon"
                        onClick={handleConfirmTag}
                        className="h-8 w-8 shrink-0 rounded-full"
                        aria-label="Confirm tag"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelTag}
                        className="h-8 w-8 shrink-0 rounded-full"
                        aria-label="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <TagPill key={tag}>{tag}</TagPill>
                      ))}
                    </div>
                  ) : (
                    !isAddingTag && (
                      <div className="rounded-[1.25rem] border border-dashed border-border/80 bg-secondary/25 px-4 py-5 text-sm text-muted-foreground">
                        No tags yet. Add a tag to give this item a faster visual
                        label.
                      </div>
                    )
                  )}
                </Section>

                {/* Notes */}
                <Section icon={StickyNote} title="Notes">
                  <div className="space-y-3">
                    <Textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Type here to add a note..."
                      className="min-h-32 rounded-[1.35rem] border border-border/80 bg-background/70 px-4 py-3 shadow-sm"
                    />
                    {!notes.trim() && (
                      <p className="text-sm text-muted-foreground">
                        No notes yet. Capture a takeaway, follow-up, or quick
                        reminder here.
                      </p>
                    )}
                  </div>
                </Section>
              </div>
            </div>

            {/* Action bar — always pinned to the bottom */}
            <div className="shrink-0 flex items-center gap-2 border-t border-border/70 bg-background/95 p-4 sm:p-5 backdrop-blur-sm">
              <Button
                type="button"
                variant={isFavorite ? "default" : "outline"}
                size="icon"
                onClick={handleBookmarkToggle}
                className="rounded-full"
                aria-label={isFavorite ? "Remove bookmark" : "Save item"}
              >
                <Bookmark
                  className={cn("h-4 w-4", isFavorite && "fill-current")}
                />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="rounded-full"
                aria-label="Share item"
              >
                <Share2 className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDelete}
                className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                <Link2 className="h-3.5 w-3.5" />
                <span className="truncate">{domain || "Local note"}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
