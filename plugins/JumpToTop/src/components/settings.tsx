import { findByProps } from "@vendetta/metro";
import { storage } from "../storage";
import { useProxy } from "@vendetta/storage";

const Design = findByProps("Stack", "Button");
const { Stack, TableRowGroup, TableSwitchRow } = Design;

export default function Settings() {
    useProxy(storage);

    return (
        <Stack
            style={{ paddingVertical: 24, paddingHorizontal: 12 }}
            spacing={24}
        >
            <TableRowGroup title={"Settings"}>
                <TableSwitchRow
                    label={"Add button to chats"}
                    subLabel={
                        "Add the JumpToTop button above the Jump to Present button in chats."
                    }
                    value={storage.jumpToPresent}
                    onValueChange={(result) => (storage.jumpToPresent = result)}
                />
                <TableSwitchRow
                    label={"Add button to action sheets"}
                    subLabel={
                        "Add the JumpToTop button to channel and forum action sheets."
                    }
                    value={storage.actionSheets}
                    onValueChange={(result) => (storage.actionSheets = result)}
                />
                <TableSwitchRow
                    label={"Switch back to the old colors"}
                    subLabel={
                        "Switch back to old Jump To Present button color in dark mode (grey)."
                    }
                    value={storage.oldButton}
                    onValueChange={(result) => (storage.oldButton = result)}
                />
            </TableRowGroup>
        </Stack>
    );
}
