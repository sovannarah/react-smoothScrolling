import React from 'react';
import GSAP from "gsap";

interface Props {
    children: JSX.Element[] | JSX.Element,
}

class SmoothScrolling extends React.Component<Props> {
    private contentWrapper: HTMLDivElement | null;
    private scroll: {
        current: number, target: number, last: number, limit: number,
    };
    private observer: MutationObserver;

    constructor(props: any) {
        super(props);
        this.scroll = {
            current: 0, target: 0, last: 0, limit: 0
        }
        this.contentWrapper = null;
        this.observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    this.onResize()
                }
            }
        });
    }

    componentDidMount() {
        this.update();
        this.onResize();
        this.observeDomChange()

    }

    observeDomChange = () => {
        const config = {childList: true, subtree: true};
        if (this.contentWrapper) {
            this.observer.observe(this.contentWrapper, config);
        }

    }

    componentWillUnmount() {
        this.observer.disconnect();
    }

    onMouseWheel = (e: any) => {
        const {deltaY} = e;
        this.scroll.target += deltaY;
    }


    onResize = () => {
        if (this.contentWrapper) {
            this.scroll.limit = this.contentWrapper.clientHeight - window.innerHeight;
        }
    }

    update = () => {
        this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target);
        this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1);
        if (this.scroll.current < 0.01) {
            this.scroll.current = 0;
        }
        if (this.contentWrapper) {
            this.contentWrapper.style.transform = `translateY(-${this.scroll.current}px)`;
        }
        window.requestAnimationFrame(this.update)
    }


    render() {
        const {children} = this.props;
        return (
            <div id={'content__wrapper'} className={'content__wrapper'} onWheel={this.onMouseWheel}
                 ref={wrapper => this.contentWrapper = wrapper}>
                {children}
            </div>);
    }
}

export default SmoothScrolling;