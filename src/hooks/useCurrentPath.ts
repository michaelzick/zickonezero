import { createContext, useContext } from 'react';

/**
 * The page route being viewed, normalized (see normalizeRoutePath). Provided by
 * pages/_app.tsx so shared components can mark the active link without
 * useRouter(), which throws outside a mounted Next router (as in tests).
 */
export const CurrentPathContext = createContext<string | null>(null);

/** The normalized page route, or null when no app router provides one. */
const useCurrentPath = (): string | null => useContext(CurrentPathContext);

export default useCurrentPath;
