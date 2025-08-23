"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

const NavigationLoaderContext = createContext(null);

const LOADER_TYPES = {
  NAVIGATION: "navigation",
  FORM_SUBMISSION: "form-submission",
  DATA_FETCHING: "data-fetching",
  CUSTOM: "custom",
};

export function NavigationLoaderProvider({ children }) {
  const [loaders, setLoaders] = useState({});
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loaders[`${LOADER_TYPES.NAVIGATION}-default`]) {
      // Small delay to allow for smooth transitions
      const timer = setTimeout(() => {
        setLoaders((prev) => ({
          ...prev,
          [`${LOADER_TYPES.NAVIGATION}-default`]: false,
        }));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, loaders]);

  // Start a loader
  const startLoader = useCallback(
    (type = LOADER_TYPES.CUSTOM, id = "default") => {
      const loaderId = `${type}-${id}`;
      setLoaders((prev) => ({
        ...prev,
        [loaderId]: true,
      }));
      return loaderId;
    },
    [],
  );

  // End a loader
  const endLoader = useCallback((loaderId) => {
    setLoaders((prev) => ({
      ...prev,
      [loaderId]: false,
    }));
  }, []);

  // Convenience methods for common loader types
  const startNavigation = useCallback(() => {
    return startLoader(LOADER_TYPES.NAVIGATION);
  }, [startLoader]);

  const endNavigation = useCallback(
    (loaderId) => {
      endLoader(loaderId || `${LOADER_TYPES.NAVIGATION}-default`);
    },
    [endLoader],
  );

  const startFormSubmission = useCallback(
    (formId = "default") => {
      return startLoader(LOADER_TYPES.FORM_SUBMISSION, formId);
    },
    [startLoader],
  );

  const endFormSubmission = useCallback(
    (loaderId) => {
      endLoader(loaderId);
    },
    [endLoader],
  );

  const startDataFetching = useCallback(
    (fetchId = "default") => {
      return startLoader(LOADER_TYPES.DATA_FETCHING, fetchId);
    },
    [startLoader],
  );

  const endDataFetching = useCallback(
    (loaderId) => {
      endLoader(loaderId);
    },
    [endLoader],
  );

  // Check if any loader is active
  const isLoading = Object.values(loaders).some(Boolean);

  // Check if a specific type of loader is active
  const isNavigating = Boolean(loaders[`${LOADER_TYPES.NAVIGATION}-default`]);
  const isSubmittingForm = (formId = "default") =>
    Boolean(loaders[`${LOADER_TYPES.FORM_SUBMISSION}-${formId}`]);
  const isFetchingData = (fetchId = "default") =>
    Boolean(loaders[`${LOADER_TYPES.DATA_FETCHING}-${fetchId}`]);

  // Value to be provided by the context
  const value = {
    isLoading,
    isNavigating,
    isSubmittingForm,
    isFetchingData,
    startLoader,
    endLoader,
    startNavigation,
    endNavigation,
    startFormSubmission,
    endFormSubmission,
    startDataFetching,
    endDataFetching,
    LOADER_TYPES,
  };

  return (
    <NavigationLoaderContext.Provider value={value}>
      {children}

      {/* Full-screen navigation loader */}
      {isNavigating && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </NavigationLoaderContext.Provider>
  );
}

export const useNavigationLoader = () => {
  const context = useContext(NavigationLoaderContext);
  if (!context) {
    throw new Error(
      "useNavigationLoader must be used within a NavigationLoaderProvider",
    );
  }
  return context;
};
