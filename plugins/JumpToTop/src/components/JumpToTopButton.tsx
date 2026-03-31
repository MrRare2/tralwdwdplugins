import { ReactNative as RN, React } from "@vendetta/metro/common";
import {
    jumpToTopOfCurrentChannel,
    jumpToTopOfDifferentChannel,
} from "../utils";

export default function JumpToTopButton({
    isNotCurrentChannel = false,
    details = {},
    JumpToPresentButton,
}: {
    isNotCurrentChannel: boolean;
    details: { guildId?: string; channelId?: string };
    JumpToPresentButton: React.ReactElement;
}) {
    return (
        // Theres no arrow up icon so we flip the arrow down one.
        <RN.View
            style={{
                transform: [{ scaleY: -1 }],
            }}
        >
            {React.cloneElement(JumpToPresentButton, {
                ...JumpToPresentButton.props,
                onPress: isNotCurrentChannel
                    ? () =>
                          jumpToTopOfDifferentChannel(
                              details.guildId,
                              details.channelId,
                          )
                    : jumpToTopOfCurrentChannel,
            })}
        </RN.View>
    );
}
