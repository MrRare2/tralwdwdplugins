import { patchSearchListRow } from "./patches/searchlistrow";

let patches: (() => void)[] = [];

export default {
    onLoad() {
        patches.push(patchSearchListRow());
    },

    onUnload() {
        for (const unpatch of patches) {
            unpatch();
        }

        patches = [];
    },
};
