import { findByName, findByProps } from "@vendetta/metro";
import { ReactNative as RN } from "@vendetta/metro/common";
import { after } from "@lib/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { findInReactTree } from "@vendetta/utils";
import {
    ChannelType,
    jumpToTopOfDifferentChannel,
    jumpToTopOfForum,
} from "../utils";
import { storage } from "../storage";

const { ActionSheetRow } = findByProps("ActionSheetRow");

const ForumPostLongPressActionSheet = findByName(
    "ForumPostLongPressActionSheet",
    false,
);

const ChannelLongPressActionSheet = findByName(
    "ChannelLongPressActionSheet",
    false,
);

const SYM_PATCHED = Symbol.for("Patched by JumpToTop");

function findActionGroups(tree: any) {
    return findInReactTree(
        tree,
        (node) => node?.[0]?.type?.name === "ActionSheetRowGroup",
    );
}

function buildJumpToTopRow(onPress: () => void) {
    return (
        <ActionSheetRow.Group>
            <ActionSheetRow
                label="Jump To Top"
                icon={
                    <RN.View style={{ transform: [{ scaleY: -1 }] }}>
                        <ActionSheetRow.Icon
                            source={getAssetIDByName("ArrowLargeDownIcon")}
                        />
                    </RN.View>
                }
                onPress={onPress}
            />
        </ActionSheetRow.Group>
    );
}

const allowedChannelTypes = [
    ChannelType.GUILD_TEXT,
    ChannelType.DM,
    ChannelType.GUILD_VOICE,
    ChannelType.GROUP_DM,
    ChannelType.GUILD_NEWS,
    ChannelType.GUILD_STORE,
    ChannelType.NEWS_THREAD,
    ChannelType.PUBLIC_THREAD,
    ChannelType.PRIVATE_THREAD,
];

export function patchActionSheets() {
    const patches: (() => void)[] = [];

    patches.push(
        after("default", ForumPostLongPressActionSheet, ([{ thread }], ret) => {
            if (!storage.actionSheets || ret[SYM_PATCHED]) return;

            const actions = findActionGroups(ret);
            if (!actions) return;

            actions.unshift(
                buildJumpToTopRow(() =>
                    jumpToTopOfForum(thread.guild_id, thread.id),
                ),
            );

            ret[SYM_PATCHED] = true;
        }),
    );

    patches.push(
        after("default", ChannelLongPressActionSheet, (_, ret) => {
            if (!storage.actionSheets || ret?.[SYM_PATCHED]) return;

            const channel = ret?.props?.channel;
            if (!channel) return;

            if (!allowedChannelTypes.includes(channel.type)) return;

            patches.push(
                after("type", ret, (_, component) => {
                    const actions = findActionGroups(component);
                    if (!actions) return;

                    actions.unshift(
                        buildJumpToTopRow(() =>
                            jumpToTopOfDifferentChannel(
                                channel.guild_id ?? "@me",
                                channel.id,
                            ),
                        ),
                    );
                }),
            );

            ret[SYM_PATCHED] = true;
        }),
    );

    return () => {
        for (const unpatch of patches) unpatch();
    };
}
