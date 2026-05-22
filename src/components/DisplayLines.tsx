type DisplayLinesProps = {
  lines: string[];
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  className?: string;
};

/**
 * Multi-line display headings without <br /> — each line is a block span
 * so screen readers get proper word boundaries and visual breaks stay intact.
 */
export default function DisplayLines({
  lines,
  as: Tag = 'h1',
  className,
}: DisplayLinesProps) {
  return (
    <Tag className={className}>
      {lines.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </Tag>
  );
}
