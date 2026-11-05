/** Renders simple content blocks: "## " lines become h2, everything else a paragraph. */
export function Prose({ body }: { body: string[] }) {
  return (
    <div className="prose-dw max-w-[65ch]">
      {body.map((block, i) =>
        block.startsWith("## ") ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>,
      )}
    </div>
  );
}
