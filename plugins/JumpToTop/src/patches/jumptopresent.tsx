import { findByName, findByProps, findByStoreName } from "@vendetta/metro";
import { after } from "@lib/patcher";
import { React } from "@vendetta/metro/common";
import JumpToTopButton from "../components/JumpToTopButton";
import { storage } from "../storage";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { OldButtons } from "../components/OldButtons";
import { ChannelType } from "../utils";

const JumpToPresentModule = findByName("JumpToPresentButton", false);
const Design = findByProps("Stack", "Button", "Text");
const { Stack } = Design;

const ChannelStore = findByStoreName("ChannelStore");

const SYM_PATCHED = Symbol.for("Patched by JumpToTop");

export function patchJumpToPresent() {
    return after(
        "default",
        JumpToPresentModule,
        ([{ channelId }], original: React.ReactElement) => {
            if (!storage.jumpToPresent) return;
            if (original == null || original[SYM_PATCHED]) return;

            const JumpToPresentButton = original.props?.children;

            /*
             * Voice chat text channel uses the JumpToPresentButton
             * to show the "X" icon when not scrolled up, so we have to
             * make sure it is actually the JumpToPresentButton.
             */
            if (!isJumpToPresentButton(JumpToPresentButton)) return;

            original[SYM_PATCHED] = true;

            const { type: channelType, guild_id: guildId } =
                ChannelStore.getChannel(channelId);

            // Voice channel text counts as different channel
            const isNotCurrentChannel = channelType === ChannelType.GUILD_VOICE;

            original.props.children = (
                <Stack>
                    {!storage.oldButton ? (
                        <>
                            <JumpToTopButton
                                isNotCurrentChannel={isNotCurrentChannel}
                                details={{ channelId, guildId }}
                                JumpToPresentButton={JumpToPresentButton}
                            />
                            {JumpToPresentButton}
                        </>
                    ) : (
                        <OldButtons
                            isNotCurrentChannel={channelType === 2}
                            details={{ channelId, guildId }}
                            JumpToPresentButton={JumpToPresentButton}
                        />
                    )}
                </Stack>
            );
        },
    );
}

function isJumpToPresentButton(button: React.ReactElement) {
    const ArrowIconId = getAssetIDByName("ArrowLargeDownIcon");

    return button.props?.icon === ArrowIconId;
}
