"use client";

import {useMemo} from "react";
import PageContext from "../context/PageContext";
import {usePageManagement} from "../hooks/usePageManagement";

export const PageProvider = ({children}) => {
  const pageManagement = usePageManagement();

  const contextValue = useMemo(() => pageManagement, [pageManagement]);

  return (
      <PageContext.Provider value={contextValue}>{children}</PageContext.Provider>
  );
};
