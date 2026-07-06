type Props = {
  width: number;
  height: number;
  label?: string;
  className?: string;
};

export function ImagePlaceholder({ width, height, label, className }: Props) {
  return (
    <div
      style={{ width, height }}
      className={`flex items-center justify-center bg-muted text-muted-foreground text-sm rounded-md ${className ?? ""}`}
    >
      {label ?? `${width}×${height}`}
    </div>
  );
}
