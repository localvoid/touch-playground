import { $h } from "ivi";

export function $EventDetailsField(key: string, value: string | number) {
    return $h("div", "EventDetailsField").children(
        $h("span", "EventDetailsKey").children(key),
        $h("span", "EventDetailsValue").children(value),
    );
}
