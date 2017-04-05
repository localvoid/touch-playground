import { render, Component, $c, $h, Events } from "ivi";
import { TraceLogViewer } from "./log";
import { PointerEventsMonitor } from "./pointer";
import { MouseEventsMonitor } from "./mouse";
import { TouchEventsMonitor } from "./touch";
import { GesturePointerEventsMonitor } from "./gesture_pointer";
import { GestureEventsMonitor } from "./gesture";

class Main extends Component {
    private location: string = "pointer";

    private gotoPointer = Events.onClick((ev) => {
        ev.preventDefault();
        this.location = "pointer";
        this.invalidate();
    });

    private gotoMouse = Events.onClick((ev) => {
        ev.preventDefault();
        this.location = "mouse";
        this.invalidate();
    });

    private gotoTouch = Events.onClick((ev) => {
        ev.preventDefault();
        this.location = "touch";
        this.invalidate();
    });

    private gotoGesturePointer = Events.onClick((ev) => {
        ev.preventDefault();
        this.location = "gesture-pointer";
        this.invalidate();
    });

    private gotoGesture = Events.onClick((ev) => {
        ev.preventDefault();
        this.location = "gesture";
        this.invalidate();
    });

    render() {
        const location = this.location;
        let c;
        if (location === "pointer") {
            c = $c(PointerEventsMonitor);
        } else if (location === "mouse") {
            c = $c(MouseEventsMonitor);
        } else if (location === "touch") {
            c = $c(TouchEventsMonitor);
        } else if (location === "gesture-pointer") {
            c = $c(GesturePointerEventsMonitor);
        } else {
            c = $c(GestureEventsMonitor);
        }

        return $h("div").children(
            $h("div", "Links").children(
                $h("a", location === "pointer" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoPointer).children("pointer events"),
                $h("a", location === "mouse" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoMouse).children("mouse events"),
                $h("a", location === "touch" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoTouch).children("touch events"),
                $h("a", location === "gesture-pointer" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoGesturePointer).children("gesture-pointer events"),
                $h("a", location === "gesture" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoGesture).children("gesture events"),
            ),
            c,
            $c(TraceLogViewer),
        );
    }
}

render($c(Main), document.getElementById("app")!);
