let timeOut = 0.5;

var map = (f, arr) => arr.map(f);
var compose = (f1, f2) => (x) => f1(f2(x));
var equi = (a, b) => Math.floor(Math.abs(a - b)) == 0;
var getSameRow = (pos, arr) => {
    return map((node) => node && equi(node.y, pos.y) ? node : null, arr)
};
var getSameColumn = (pos, arr) => {
    return map((node) => node && equi(node.x, pos.x) ? node : null, arr)
};
var distance = (p1, p2) => {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    var squre = (x) => x * x;
    return Math.sqrt(squre(dx) + squre(dy));
}
let foodType = require("Const").FOOD_TYPE;
cc.Class({
    extends: cc.Component,

    properties: {
        padding: 0,
        spacing: 0,
        cols: 0,
        brickPrefab: cc.Prefab,
        brick1Prefab: cc.Prefab,
        foodPrefab: cc.Prefab,
        //bricksNumber: 0,
        line: {
            default: null,
            type: cc.Node,
        },
    },
    getCentorPos: function () {
        let pos = cc.p(this.node.width / 2, -this.node.height / 2);
        return this.node.convertToWorldSpaceAR(pos);
    },

    reset: function (ctl) {
        this.node.removeAllChildren();
        let brickNode = cc.instantiate(this.brickPrefab);
        this.nodeWidth = brickNode.width;
        this.nodeHeight = brickNode.height;
        this.bricksNumber = Math.floor((this.node.width - this.padding) / (brickNode.width + this.padding));
        brickNode.destroy();
        brickNode = null;
        this.gameCtl = ctl;
        this.ceng = 0;
        //this.newBrickLayout();
    },
    newBrickLayout: function (repeat) {
        let self = this;
        for (var j = 0; j < repeat; j++) {
            let yoffset = j * (this.spacing + this.nodeHeight);
            let score = window.gameScore + j;
            let ballCnt = 0;
            const ballMax = 3;
            let pleft = (score < 10) ? 0.0 : 0.02;

            let poff = (score < 20) ? 0.05 : 0.0;
            let brickCnt = 0;

            this.ceng += 1;
            let ceng = this.ceng;
            if (ceng == 1) {
                this.map = new Array();
                let total = 2 * this.bricksNumber;
                //@dp 递归层数
                var setHashMap = function (map, key, dp) {
                    if (dp >= total) return;
                    key = key % total;
                    if (!map[key]) map[key] = true;
                    //冲突处理 注意total大小
                    else setHashMap(map, (key + 1) % total, dp + 1);
                }
                var setMap = (r) => setHashMap(this.map, r, 1);
                //第一个块位置
                let random = Math.floor(cc.random0To1() * total) % total;
                setMap(random)
                //第二个块位置
                random = Math.floor(cc.random0To1() * total) % total;
                setMap(random);
            }
            var getBrickLimit = function () {
                if (ceng < 20) return 3;
                if (ceng < 50) return 4;
                if (ceng < 100) return 5;
            }
            var getBrickPrefabNode = function () {
                let rand = cc.random0To1();
                let p1 = 2.0;
                if (rand < p1) return cc.instantiate(self.brickPrefab);
                else {
                    let node = cc.instantiate(self.brick1Prefab);
                    let p = (1.0 - p1) / 4;
                    node.rotation = 90.0 * Math.ceil((rand - p1) / p);
                    return node;
                }
            }
            let hpSetting = [1, 2, 3, 7, 12]
            let idx = Math.floor(score / 30);
            for (let i = 0; i < this.bricksNumber; i++) {

                //if(this.ceng % 10 == 1 || this.ceng % 10 == 2) break;

                let rand = cc.random0To1();

                let rand2 = cc.random0To1();
                let hp = 1;
                if(idx + 1 > hpSetting.length) hp = hpSetting[hpSetting.length - 1];
                else hp = hpSetting[idx] + Math.floor(rand2 * (hpSetting[idx + 1] - hpSetting[idx]));

                //特殊处理 必须出块
                if (ceng <= 2 && this.map[(ceng - 1) * this.bricksNumber + i]) {
                    //出块数量控制
                    if (brickCnt >= getBrickLimit()) {
                        continue;
                    }
                    //let brickNode = cc.instantiate(this.brickPrefab);
                    let brickNode = getBrickPrefabNode();
                    brickNode.getComponent("Brick").init(hp);
                    brickNode.parent = this.node;
                    brickNode.x = this.padding + (i % this.cols) * (this.nodeWidth + this.padding) + this.nodeWidth / 2;
                    brickNode.y = yoffset - this.spacing - this.nodeHeight / 2;
                    brickCnt++;
                    continue;
                }

                if (rand > 0.45 + pleft + poff) {
                    let brickNode;
                    if (rand > 0.8 + pleft) {
                        brickNode = cc.instantiate(this.foodPrefab);
                        //let _type = foodType.TYPE_BALL;
                        let _type = foodType.TYPE_BUFF;
                        if (rand > 0.96) {
                            _type = foodType.TYPE_BOOM;
                        }
                        else if (rand > 0.91) (_type = foodType.TYPE_BALL) && ballCnt++;
                        //else ballCnt++;
                        if (_type == foodType.TYPE_ADDBALLS1 && ballCnt > ballMax) {
                            brickNode.destroy();
                            continue;
                        }
                        brickNode.getComponent("Food").init(_type);
                    }
                    else {
                        //出块数量控制
                        if (brickCnt >= getBrickLimit()) {
                            continue;
                        }
                        //brickNode = cc.instantiate(this.brickPrefab);
                        brickNode = getBrickPrefabNode();
                        brickNode.getComponent("Brick").init(hp);
                        brickCnt++;
                    }
                    brickNode.parent = this.node;
                    brickNode.x = this.padding + (i % this.cols) * (this.nodeWidth + this.padding) + this.nodeWidth / 2;
                    brickNode.y = yoffset - this.spacing - this.nodeHeight / 2;
                }
            }
        }

        let down = repeat;
        let over = false;

        this.node.children.map((node) => {
            let pos = this.node.convertToWorldSpaceAR(node.getPosition());
            let death = this.line.parent.convertToWorldSpaceAR(this.line.getPosition()).y;
            let left = Math.floor((pos.y - death) / (this.nodeHeight + this.spacing) + 0.5);
            down = Math.min(left, down);
            if (left <= repeat) over = true;
        });

        this.node.children.map((node) => {
            let pos = this.node.convertToWorldSpaceAR(node.getPosition());
            let death = this.line.parent.convertToWorldSpaceAR(this.line.getPosition()).y;

            let finished = cc.callFunc(function (obj, target) {

            }, this, this.node.children.length);
            let action = cc.sequence(cc.moveBy(timeOut * down / repeat, cc.p(0, -(this.nodeHeight + this.spacing) * down)), finished);
            node.runAction(action);
        });
        return over;
        //}
    },
    

    //then, fp
    destroyNode: function (node) {
        let brick = node ? node.getComponent("Brick") : null;
        if (brick) brick.broken();
    },

    destroyOneRow: function (pos) {
        var getList = (arr) => getSameRow(pos, arr);
        var destroyList = (arr) => map(this.destroyNode, arr);
        compose(destroyList, getList)(this.node.children);
    },
    destroyOneColumn: function (pos) {
        var getList = (arr) => getSameColumn(pos, arr);
        var destroyList = (arr) => map(this.destroyNode, arr);
        compose(destroyList, getList)(this.node.children);
    },
    destroy4Side: function (pos) {
        {
            let isNear = (p2) => equi(distance(pos, p2), this.nodeWidth + this.padding);
            let getRow = (arr) => getSameRow(pos, arr);
            let getNear = (arr) => map((node) => node && isNear(node) ? node : null, arr);
            let getList = compose(getNear, getRow);
            let destroyList = (arr) => map(this.destroyNode, arr);
            compose(destroyList, getList)(this.node.children);
        }
        {
            let isNear = (p2) => equi(distance(pos, p2), this.nodeHeight + this.spacing);
            let getColumn = (arr) => getSameColumn(pos, arr);
            let getNear = (arr) => map((node) => node && isNear(node) ? node : null, arr);
            let getList = compose(getNear, getColumn);
            let destroyList = (arr) => map(this.destroyNode, arr);
            compose(destroyList, getList)(this.node.children)
        }
    }
});


