import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";
import siteContent from "../content/siteContent.json";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const value = useMemo(
    () => ({
      content: siteContent,
      isLoading: false,
      error: null,
      reload: () => undefined,
    }),
    [],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

ContentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useRawContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useRawContent doit être utilisé dans ContentProvider");
  return ctx;
}
