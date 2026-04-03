import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar, Tag, FileText } from "lucide-react";

export default function ItemDetailModal({ item, isOpen, onClose }) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl rounded-3xl border-white/10 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary mb-2">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {item.type}
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight">
            {item.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-4">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                View Original
              </a>
            )}
          </div>

          {/* AI Summary */}
          {item.summary && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                AI Summary
              </h4>
              <p className="text-muted-foreground leading-relaxed text-sm p-4 rounded-2xl bg-secondary/20 border border-white/5">
                {item.summary}
              </p>
            </div>
          )}

          {/* AI Tags */}
          {item.aiTags && item.aiTags.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Topics & Keywords
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.aiTags.map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="rounded-full px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
