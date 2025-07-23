import ReactMarkdown from "react-markdown";

interface MarkdownTextProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export const MarkdownText = ({ children, className = "", inline = false }: MarkdownTextProps) => {
  if (inline) {
    // For inline markdown (like descriptions/excerpts), remove paragraph tags
    return (
      <span className={className}>
        <ReactMarkdown
          components={{
            p: ({ children }) => <>{children}</>,
            strong: ({ children }) => (
              <strong className="font-bold text-primary">{children}</strong>
            ),
            em: ({ children }) => (
              <em className="italic">{children}</em>
            ),
            code: ({ children }) => (
              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">
                {children}
              </code>
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </span>
    );
  }

  // For full markdown content
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mb-6 last:mb-0">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-primary">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          code: ({ children }) => (
            <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h1 className="text-3xl font-heading font-bold mb-4 mt-8 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-heading font-bold mb-3 mt-6">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-heading font-semibold mb-2 mt-4">
              {children}
            </h3>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
