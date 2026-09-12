type cardProps = {
  label: string;
  value: string;
  subtext: string;
  tone?: string;
};


export function Card({
  label,
  value,
  subtext,
  tone = "text-foreground",
}: cardProps) {
  return (
    <div className="flex min-h-31 flex-col justify-between rounded-xl border border-border/90 bg-card/80 px-4 py-4 text-card-foreground ">
      <p className="text-[10px] tracking-[0.16em] text-muted-foreground">
        {label.toUpperCase()}
      </p>
      <strong className={`font-display text-2xl font-semibold tracking-tight ${tone}`}>
        {value}
      </strong>
      <small className="text-[10px] text-muted-foreground">{subtext}</small>
    </div>
  );
}
