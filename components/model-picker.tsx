"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface ModelPickerProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

export const ModelPicker = ({
  selectedModel,
  setSelectedModel,
}: ModelPickerProps) => {
  const [models, setModels] = useState<{ id: string; name?: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/api/models")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch models");
        const data = await res.json();
        const list: { id: string; name?: string }[] = Array.isArray(data?.data)
          ? data.data.map((m: any) => ({ id: m?.id, name: m?.name }))
          : [];
        if (isMounted) setModels(list);
      })
      .catch((e) => {
        if (isMounted) setError(e?.message ?? "Error loading models");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const options = useMemo(() => {
    const mapped = models
      .filter((m) => typeof m?.id === "string" && m.id.length > 0)
      .map((m) => ({ value: m.id, label: m.name ?? m.id }));
    if (mapped.length === 0) {
      // Provide a minimal fallback option so the UI remains usable
      return [
        { value: "x-ai/grok-4-fast:free", label: "Grok 4 fast" },
      ];
    }
    return mapped;
  }, [models]);

  return (
    <div className="absolute bottom-2 left-2 flex flex-col gap-2">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="">
          <SelectValue placeholder={loading ? "Loading models..." : (error ? "Failed to load models" : "Select a model")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
