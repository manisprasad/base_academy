import React, {useState} from "react";

interface DescriptionProps {
  text: string;
  maxChars?: number;
}

function formatDescription(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline block truncate"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}


const DescriptionWithToggle: React.FC<DescriptionProps> = ({ text, maxChars = 180 }) => {
  const [showMore, setShowMore] = useState(false);
  const isLong = text.length > maxChars;
  const displayedText = showMore ? text : text.slice(0, maxChars);

  return (
    <div className="text-base text-muted-foreground mt-3 space-y-1">
      <div className="whitespace-pre-wrap break-words">
        {formatDescription(displayedText)}
        {isLong && !showMore && "..."}
      </div>

      {isLong && (
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-blue-500 hover:underline"
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default DescriptionWithToggle