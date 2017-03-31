import { render, Component, $c, $h, Events } from "ivi";
import { PointerEventsMonitor } from "./pointer";
import { MouseEventsMonitor } from "./mouse";
import { TouchEventsMonitor } from "./touch";

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

    render() {
        const location = this.location;
        let c;
        if (location === "pointer") {
            c = $c(PointerEventsMonitor);
        } else if (location === "mouse") {
            c = $c(MouseEventsMonitor);
        } else {
            c = $c(TouchEventsMonitor);
        }

        return $h("div").children(
            $h("div", "Links").children(
                $h("a", location === "pointer" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoPointer).children("pointer events"),
                $h("a", location === "mouse" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoMouse).children("mouse events"),
                $h("a", location === "touch" ? "active" : "")
                    .props({ href: "#" }).events(this.gotoTouch).children("touch events"),
            ),
            c,
        );
    }
}

render($c(Main), document.getElementById("app")!);
