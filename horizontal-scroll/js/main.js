/**
 * 
 * @param {HTMLElement} el 滚动元素
 * @param {Number} toPos 滚动目标
 * @param {Boolean} isHorizontal 是否是水平滚动
 * @param {Number} rate 滚动速率
 * @param {Function} cb 滚动完成时的回调函数
 * @returns void
 */
function scrollTo(el, toPos, isHorizontal = true, rate = 2, cb) {
    const direction = isHorizontal ? 'scrollLeft' : 'scrollTop';
    // 根据滚动方向取出用来赋值的key

    const boxLimitKey = isHorizontal ? 'scrollWidth' : 'scrollHeight';
    // 根据滚动方向取出用来获取最大滚动范围的key

    const windowLimitKey = isHorizontal ? 'innerWidth' : 'innerHeight';
    // 根据滚动方向取出用来获取最大滚动范围的key

    const limitSize = el[boxLimitKey] - window[windowLimitKey];

    let pos = el[direction];

    const isIncrease = toPos > pos;
    if (isIncrease && toPos > limitSize) {
        toPos = limitSize;
    } else if (!isIncrease && toPos < 0) {
        toPos = 0;
    }

    if (toPos === pos) return cb && cb();
    // 如果当前位置已经是要滚到的地方，直接return


    function step() {
        pos = pos + (toPos - pos) / rate;
        if (isIncrease && toPos - pos <= 1 || !isIncrease && pos - toPos <= 1) {
            el[direction] = toPos;
            cb && cb();
        } else {
            el[direction] = pos;
            requestAnimationFrame(step);
        }
    }

    step();
}


if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = fn => {
        setTimeout(fn, 17);
        // 模拟屏幕每帧的刷新时间
        // 17 ≈ 1s = 1000ms / 屏幕刷新率(60hz)
    };
}

const menus = [
    {
        id: 1,
        name: "首页"
    },
    {
        id: 2,
        name: "生活日用"
    },
    {
        id: 3,
        name: "床上用品"
    },
    {
        id: 4,
        name: "五谷杂粮"
    },
    {
        id: 5,
        name: "洗浴用品"
    },
    {
        id: 6,
        name: "美容护肤"
    },
    {
        id: 7,
        name: "卫浴用品"
    },
    {
        id: 8,
        name: "营养食品"
    }
];

window.app = new Vue({
    el: "#root",
    data() {
        return {
            menus,
            activeNavIdx: 0,
            pointerX: -100,
            pointerWidth: 12,
        };
    },
    computed: {
        pointerStyle() {
            return {
                '--pointer-x': this.pointerX,
                '--pointer-width': this.pointerWidth
            }
        }
    },
    mounted() {
        this.handleUpdatePointerPos();
    },
    methods: {
        handleNavClick({ target }) {
            const { idx } = target.dataset;
            if (!idx || idx == this.activeNavIdx) return;
            this.activeNavIdx = idx;
            this.handleScrollNavToCenter();
        },
        handleScrollNavToCenter() {
            const dom = this.$refs.navs[this.activeNavIdx];
            // 当前元素

            const nav_box = this.$refs.nav_box;
            // 滚动容器

            // dom.scrollIntoView({
            //     behavior: "smooth",
            //     block: "center",
            //     inline: "center"
            // });

            const { scrollLeft, scrollWidth } = nav_box;
            // 当前容器的滚动位置
            // 当前容器的宽度

            const limitScroll = scrollWidth - window.innerWidth;
            // 当前容器可滚动最大值

            const halfScreenWidth = window.innerWidth / 2;
            // 屏幕一半的宽度

            const domPosX = dom.offsetLeft;
            // 当前item相对于滚动容器的x轴位置

            const width = dom.offsetWidth;
            // width 元素宽度

            const centerAbsPosX = scrollLeft + halfScreenWidth;
            // 当前屏幕x轴中心相对于滚动容器的绝对位置

            const domAbsPosX = domPosX + width / 2;
            // 当前元素x轴中心点相对于滚动容器的x轴绝对位置


            let toPos = scrollLeft + (domAbsPosX - centerAbsPosX);
            // 要滚动到的位置

            this.scrollTo(nav_box, toPos);
            // 滚动相应元素

            let v = toPos > 0 && toPos < limitScroll ? toPos + halfScreenWidth : null;
            // 计算滚动完成后元素相对于滚动容器的x轴位置

            this.handleUpdatePointerPos(v);


        },
        handleUpdatePointerPos(v) {
            const dom = this.$refs.navs[this.activeNavIdx];
            this.pointerX = (v ? v : (dom.offsetLeft + dom.offsetWidth / 2)) - this.pointerWidth / 2;
        },
        scrollTo,
    }
});