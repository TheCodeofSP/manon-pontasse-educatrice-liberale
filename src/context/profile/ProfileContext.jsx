import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

const ProfileContext = createContext(null);

export const PROFILES = {
  VISITOR: "visitor",
  ACCOMPAGNE: "accompagne",
  ACCOMPAGNANT: "accompagnant",
  PARTENAIRE: "partenaire_social",
};

const STORAGE_KEY = "mp_profile";

function isValidProfile(v) {
  return Object.values(PROFILES).includes(v);
}

function readStoredProfile() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return isValidProfile(v) ? v : PROFILES.VISITOR;
  } catch {
    return PROFILES.VISITOR;
  }
}

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => readStoredProfile());

  const setProfile = useCallback((next) => {
    setProfileState((prev) => {
      const val = isValidProfile(next) ? next : PROFILES.VISITOR;
      return val === prev ? prev : val;
    });
  }, []);

  const resetProfile = useCallback(() => setProfile(PROFILES.VISITOR), [setProfile]);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, profile);
    } catch {
      // ignore
    }
  }, [profile]);

  const value = useMemo(() => {
    return { profile, setProfile, resetProfile };
  }, [profile, setProfile, resetProfile]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile doit être utilisé dans ProfileProvider");
  return context;
}
