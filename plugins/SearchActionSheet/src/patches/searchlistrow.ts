import { after } from "@lib/patcher";
import { findByProps, findByStoreName } from "@vendetta/metro";

const SearchListRow = findByProps("SearchListRow").SearchListRow;
const LongPressMessageActions = findByProps("showLongPressMessageActionSheet");
const UserStore = findByStoreName("UserStore");

export function patchSearchListRow() {
    return after("type", SearchListRow, ([props], ret) => {
        // extract data from label props
        const { message, channel } = props.label.props;
        const user = UserStore.getUser(message.author.id);

        const actionSheetConfig = {
            canAddNewReactions: true,
            channel,
            message,
            user,
        };

        ret.props.onLongPress = () => {
            LongPressMessageActions.showLongPressMessageActionSheet(
                actionSheetConfig,
            );
        };
    });
}
