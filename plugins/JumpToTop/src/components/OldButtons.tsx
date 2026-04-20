import { getAssetIDByName } from "@vendetta/ui/assets";
import { jumpToTop } from "../utils";
import { findByProps } from "@vendetta/metro";
import { UpsideDown } from "./UpsideDown";

const Design = findByProps("Stack", "Button", "Text");
const { IconButton } = Design;

const commonProps = {
    variant: "secondary",
    icon: getAssetIDByName("ArrowLargeDownIcon"),
};

export function OldButtons({
    isNotCurrentChannel = false,
    details = {},
    JumpToPresentButton,
}: {
    isNotCurrentChannel: boolean;
    details: { guildId?: string; channelId?: string };
    JumpToPresentButton: React.ReactElement;
}) {
    const jumpToPresent = JumpToPresentButton.props?.onPress;

    return (
        <>
            <UpsideDown>
                <IconButton
                    onPress={jumpToTop(isNotCurrentChannel, details)}
                    {...commonProps}
                />
            </UpsideDown>
            <IconButton onPress={jumpToPresent} {...commonProps} />
        </>
    );
}
