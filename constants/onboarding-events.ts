export const ONBOARDING_OPEN_PROFILE_MENU_EVENT = "onboarding:open-profile-menu";
export const ONBOARDING_CLOSE_PROFILE_MENU_EVENT = "onboarding:close-profile-menu";

export function dispatchOpenProfileMenuEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ONBOARDING_OPEN_PROFILE_MENU_EVENT));
}

export function dispatchCloseProfileMenuEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ONBOARDING_CLOSE_PROFILE_MENU_EVENT));
}

function waitForElement(selector: string, timeoutMs = 3000): Promise<void> {
  return new Promise((resolve) => {
    const startedAt = Date.now();

    const check = () => {
      if (document.querySelector(selector)) {
        resolve();
        return;
      }

      if (Date.now() - startedAt >= timeoutMs) {
        resolve();
        return;
      }

      window.requestAnimationFrame(check);
    };

    check();
  });
}

/** Opens the navbar profile dropdown and waits until Account Settings is mounted. */
export async function ensureProfileMenuOpenForTour() {
  dispatchOpenProfileMenuEvent();
  await waitForElement('[data-tour="nav-account"]');
}
