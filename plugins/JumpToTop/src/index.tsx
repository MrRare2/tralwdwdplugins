import { patchActionSheets } from "./patches/actionsheets";
import { patchJumpToPresent } from "./patches/jumptopresent";
import settings from "./components/settings";
import { initStorage, storage } from "./storage";
import { plugins } from "@vendetta/plugins";
import CharCounterWarningModal from "./components/CharCounterWarningModal";
import { findByProps } from "@vendetta/metro";

const patches: (() => void)[] = [];

const { openAlert } = findByProps("openAlert", "dismissAlert");

export default {
    onLoad() {
        initStorage();

        patches.push(patchJumpToPresent());
        patches.push(patchActionSheets());

        if (
            hasEnabledCharCounterPlugin() &&
            !storage.hasSeenCharCounterWarning
        ) {
            openAlert(
                "jumptotop-char-counter-warning",
                <CharCounterWarningModal />,
            );
        }
    },

    onUnload() {
        for (const unpatch of patches) {
            unpatch();
        }
    },

    settings,
};

function hasEnabledCharCounterPlugin() {
    return (
        Object.values(plugins).find((p) => p?.manifest?.name === "Char Counter")
            ?.enabled ?? false
    );
}
