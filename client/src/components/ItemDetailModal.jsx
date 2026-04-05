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
  Loader2,
  Plus,
  Share2,
  Sparkles,
  StickyNote,
  Tag,
  Trash2,
  X,
  FolderPlus,
} from "lucide-react";
import InstaEmbed from "./InstaEmbed";
import CollectionSavePopup from "./CollectionSavePopup";
import { softDeleteItem, updateItem } from "@/services/itemService";
import { AnimatePresence, motion } from "framer-motion";

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

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
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

function TagPill({ children, onRemove }) {
  return (
    <Badge
      variant="secondary"
      className="h-auto rounded-full border border-border/70 bg-secondary/70 px-3 py-1 text-xs font-medium text-foreground group"
    >
      <span>{children}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 -mr-1 rounded-full p-0.5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground transition-colors"
          aria-label={`Remove ${children} tag`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}

export default function ItemDetailModal({
  item,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showCollectionPopup, setShowCollectionPopup] = useState(false);
  const tagInputRef = useRef(null);
  const initialValuesRef = useRef({ title: "", textContent: "", notes: "" });

  useEffect(() => {
    if (!item) return;
    setNotes(item.userNotes || "");
    setTags(item.aiTags || []);
    setTitle(item.title || "");
    setTextContent(item.textContent || "");
    setIsFavorite(Boolean(item.isFavorite));
    setIsPreviewLoading(Boolean(item.url));
    setIsAddingTag(false);
    setNewTag("");

    // Initialize ref with fresh values from the item prop
    initialValuesRef.current = {
      title: item.title || "",
      textContent: item.textContent || "",
      notes: item.userNotes || "",
    };
  }, [item]);

  // Debounced auto-save for Title, Text Content, and User Notes
  useEffect(() => {
    if (!item?._id) return;

    const hasChanged =
      title !== initialValuesRef.current.title ||
      textContent !== initialValuesRef.current.textContent ||
      notes !== initialValuesRef.current.notes;

    if (!hasChanged) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      try {
        const updateData = {};
        if (title !== initialValuesRef.current.title) updateData.title = title;
        if (textContent !== initialValuesRef.current.textContent)
          updateData.textContent = textContent;
        if (notes !== initialValuesRef.current.notes)
          updateData.userNotes = notes;

        const response = await updateItem(item._id, updateData);
        if (!response.ok) throw new Error("Update failed");

        const updatedItem = await response.json();
        onUpdate?.(updatedItem);

        // Update ref so we don't trigger again for these same values
        initialValuesRef.current = { title, textContent, notes };
      } catch (error) {
        console.error("Auto-save failed:", error);
        toast.error("Failed to auto-save changes.");
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1-second debounce

    return () => clearTimeout(timeoutId);
  }, [title, textContent, notes, item?._id, onUpdate]);

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
  const isYouTube = item.type === "youtube";
  const isInstagram =
    item.type === "posts" && item.url?.includes("instagram.com");
  const previewUrl = isYouTube ? getYouTubeEmbedUrl(item.url) : item.url;
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

  const handleConfirmTag = async () => {
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

    const updatedTags = [...tags, trimmedTag];

    try {
      const response = await updateItem(item._id, { aiTags: updatedTags });
      if (!response.ok) throw new Error();

      setTags(updatedTags);
      setNewTag("");
      setIsAddingTag(false);
      toast.success("Tag added.");
    } catch {
      toast.error("Failed to add tag. Please try again.");
    }
  };

  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    try {
      const response = await updateItem(item._id, { aiTags: updatedTags });
      if (!response.ok) throw new Error();

      setTags(updatedTags);
      toast.success("Tag removed.");
    } catch {
      toast.error("Failed to remove tag.");
    }
  };

  const handleCancelTag = () => {
    setNewTag("");
    setIsAddingTag(false);
  };

  const handleBookmarkToggle = () => {
    setIsFavorite((currentValue) => !currentValue);
  };

  const handleDelete = async () => {
    try {
      const response = await softDeleteItem(item._id);
      if (!response.ok) {
        toast.error("Could not delete this item. Please try again.");
        return;
      }
      toast.success("Item moved to trash.");
      onClose();
      onDelete?.(item._id);
    } catch {
      toast.error("Something went wrong while deleting.");
    }
  };

  return (
    <>
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
              {item.type === "notes" ? (
                <div className="flex h-full flex-col p-8 sm:p-12 gap-8 overflow-y-auto no-scrollbar">
                  <div className="space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/70 px-1">
                      Note Title
                    </label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter note title..."
                      className="w-full bg-transparent text-3xl sm:text-4xl font-bold text-white outline-none placeholder:text-white/20 px-0"
                    />
                  </div>

                  <div className="flex-1 flex flex-col min-h-0 space-y-4">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/70 px-1">
                      Content
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder="Start writing your thoughts..."
                      className="w-full flex-1 bg-transparent text-lg text-white/80 leading-relaxed outline-none resize-none placeholder:text-white/20 no-scrollbar pb-8 px-0"
                    />
                  </div>
                </div>
              ) : hasUrl ? (
                <>
                  {isPreviewLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col gap-4 bg-slate-950/80 p-5">
                      <Skeleton className="h-8 w-40 rounded-full bg-white/10" />
                      <Skeleton className="h-full w-full rounded-[1.4rem] bg-white/8" />
                    </div>
                  )}
                  {isInstagram ? (
                    <InstaEmbed
                      postUrl={item.url}
                      onLoad={() => setIsPreviewLoading(false)}
                    />
                  ) : ["images", "posts"].includes(item.type) ? (
                    <div className="flex h-full w-full items-center justify-center bg-black/5 p-2 sm:p-4">
                      <img
                        src={item.url}
                        alt={item.title}
                        onLoad={() => setIsPreviewLoading(false)}
                        className="max-h-full max-w-full rounded-2xl object-contain shadow-lg"
                      />
                    </div>
                  ) : (
                    <iframe
                      key={item._id}
                      title={item.title || "Item preview"}
                      src={previewUrl}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setIsPreviewLoading(false)}
                      className={cn(
                        "h-full min-h-72 w-full bg-white",
                        isYouTube && "bg-black",
                      )}
                    />
                  )}
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
                    <h2 className="text-2xl font-bold leading-tight text-foreground sm:text-[1.5rem] line-clamp-2">
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
                  <div className="rounded-[1.4rem] border border-border/70 bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground shadow-sm whitespace-pre-wrap">
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
                        <TagPill
                          key={tag}
                          onRemove={() => handleRemoveTag(tag)}
                        >
                          {tag}
                        </TagPill>
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

                {/* Source Link */}
                {item.sourceLink && (
                  <div className="mt-4 flex justify-center pb-2">
                    <a
                      href={item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Original Post
                    </a>
                  </div>
                )}
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
                variant={showCollectionPopup ? "default" : "outline"}
                size="icon"
                onClick={() => setShowCollectionPopup(true)}
                className="rounded-full"
                aria-label="Save to collection"
              >
                <FolderPlus className="h-4 w-4" />
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

              <div className="ml-auto flex items-center gap-4 text-xs text-muted-foreground">
                {isSaving && (
                  <div className="flex items-center gap-1.5 text-primary/80 animate-in fade-in slide-in-from-right-2 duration-300">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span className="font-medium">Saving...</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Link2 className="h-3.5 w-3.5" />
                  <span className="truncate">{domain || "Local note"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    <AnimatePresence>
      {showCollectionPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowCollectionPopup(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />
          <CollectionSavePopup item={item} onClose={() => setShowCollectionPopup(false)} />
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
