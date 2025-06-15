import { useState } from "react";
import { FiX } from "react-icons/fi";

const TagsInput = ({ name, value, onChange }) => {
  const [input, setInput] = useState("");

  const tags = value
    ? value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    : [];

  const updateTags = (newTags) => {
    onChange({
      target: {
        name,
        value: newTags.join(","),
      },
    });
  };

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        updateTags([...tags, newTag]);
        setInput("");
      }
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      e.preventDefault();
      const newTags = tags.slice(0, tags.length - 1);
      updateTags(newTags);
      setInput(tags[tags.length - 1]);
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    updateTags(updatedTags);
  };

  return (
    <div className="w-full border rounded-lg px-3 py-2 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500 transition-colors min-h-[3rem] bg-white border-gray-300">
      {tags.map((tag, index) => (
        <div
          key={`${tag}-${index}`}
          className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="ml-1 focus:outline-none"
            aria-label={`Remove tag ${tag}`}
          >
            <FiX className="text-blue-500" />
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-1 min-w-[120px] focus:outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter or comma"
        aria-label="Tag input"
      />
    </div>
  );
};

export default TagsInput;
