import { type FormEvent, useState } from "react";

interface SearchFormProps {
  buttonLabel?: string;
  initialValue?: string;
  inputLabel?: string;
  placeholder?: string;
  tone?: "light" | "dark";
  suggestions?: string[];
  onSubmit: (username: string) => void;
}

export function SearchForm({
  buttonLabel = "View profile",
  initialValue = "",
  inputLabel = "GitHub username",
  placeholder = "Rahoz2",
  tone = "light",
  suggestions = [],
  onSubmit,
}: SearchFormProps) {
  const [username, setUsername] = useState(initialValue);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedUsername = username.trim();

    if (trimmedUsername) {
      onSubmit(trimmedUsername);
    }
  }

  const inputClass =
    tone === "dark"
      ? "focus-ring min-h-12 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-zinc-500"
      : "input-field";

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="min-w-0 flex-1">
        <span className="sr-only">{inputLabel}</span>
        <input
          className={inputClass}
          list={suggestions.length > 0 ? "recent-usernames" : undefined}
          placeholder={placeholder}
          aria-label={inputLabel}
          value={username}
          required
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => setUsername(event.target.value)}
        />
        {suggestions.length > 0 ? (
          <datalist id="recent-usernames">
            {suggestions.map((suggestion) => (
              <option key={suggestion} value={suggestion} />
            ))}
          </datalist>
        ) : null}
      </label>
      <button className="btn-primary sm:w-auto" type="submit">
        {buttonLabel}
      </button>
    </form>
  );
}
