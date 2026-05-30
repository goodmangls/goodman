type DisplayLinesProps = {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
  id?: string;
};

/**
 * Multi-line display headings without <br /> — each line is a block span
 * so screen readers get proper word boundaries and visual breaks stay intact.
 * Optional `id` enables parent sections to set `aria-labelledby` for landmark semantics.
 */
export default function DisplayLines({
  lines,
  as: Tag = 'h1',
  className,
  id,
}: DisplayLinesProps) {
  return (
    <Tag className={className} id={id}>
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}
