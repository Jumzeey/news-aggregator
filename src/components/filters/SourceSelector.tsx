import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SOURCE_OPTIONS } from "@/types/article";

interface SourceSelectorProps {
  selected: string[];
  onChange: (sources: string[]) => void;
}

export function SourceSelector({ selected, onChange }: SourceSelectorProps) {
  const handleToggle = (sourceId: string, checked: boolean) => {
    if (checked) {
      onChange([...selected, sourceId]);
    } else {
      onChange(selected.filter((s) => s !== sourceId));
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Sources</p>
      <div className="space-y-2">
        {SOURCE_OPTIONS.map((source) => (
          <div key={source.id} className="flex items-center gap-2">
            <Checkbox
              id={`source-${source.id}`}
              checked={selected.includes(source.id)}
              onCheckedChange={(checked) =>
                handleToggle(source.id, checked === true)
              }
            />
            <Label
              htmlFor={`source-${source.id}`}
              className="cursor-pointer text-sm font-normal"
            >
              {source.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
