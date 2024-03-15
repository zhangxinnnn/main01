var table;
var squareWidth = 50;//每个小方块的宽度
var boderWidth = 13;//横竖各有多少个小方块
var squareSet = [];//存放小方块
var choose = [];
var timer;
var baseScore = 5;//基础分
var stepScore = 10;//递增分
// var select_score = document.getElementById('selectScore');//几块几分
var nowScore = document.getElementById('nowScore');//当前分数
var totalScore = 0;//总分数
var targetScore = 1500;//目标分数
var flag=true;
var tempSquare = null;//消除过程中如果输入移入其他方块，进行记录


//创建小方块
function createSquare(value, row, col) {
    var temp = document.createElement('div');
    temp.style.width = squareWidth + 'px';
    temp.style.height = squareWidth + 'px';
    temp.style.background = 'white';
    temp.style.display = 'inline-block';//使小方块能够横向排列
    temp.style.position = "absolute";
    temp.style.borderRadius = '12px';
    temp.style.boxSizing = "border-box";
    temp.num = value;//颜色
    temp.row = row;
    temp.col = col;
    return temp;
}
//检查周围相同颜色的小方块
function checkLinked(square, arr) {
    if (square == null) {
        return;
    }
    arr.push(square);
    //向左
    /* 
   1.不能是最左边的
   2.左边得存在一个小块
   3.左边的小方块和当前的小方块颜色相同
   4.左边的小方块没有被收录进数组
   */
    if (square.col > 0 && squareSet[square.row][square.col - 1] && squareSet[square.row][square.col - 1].num == square.num && arr.indexOf(squareSet[square.row][square.col - 1]) == -1) {
        checkLinked(squareSet[square.row][square.col - 1], arr);
    }
    //向右
    if (square.col < boderWidth - 1 && squareSet[square.row][square.col + 1] && squareSet[square.row][square.col + 1].num == square.num && arr.indexOf(squareSet[square.row][square.col + 1]) == -1) {
        checkLinked(squareSet[square.row][square.col + 1], arr);
    }
    //向上
    if (square.row < boderWidth - 1 && squareSet[square.row + 1][square.col] && squareSet[square.row + 1][square.col].num == square.num && arr.indexOf(squareSet[square.row + 1][square.col]) == -1) {
        checkLinked(squareSet[square.row + 1][square.col], arr);
    }
    //向下
    if (square.row > 0 && squareSet[square.row - 1][square.col] && squareSet[square.row - 1][square.col].num == square.num && arr.indexOf(squareSet[square.row - 1][square.col]) == -1) {
        checkLinked(squareSet[square.row - 1][square.col], arr);
    }
}
//方块闪烁
function flicker(arr) {
    var num = 0;
    timer = setInterval(function () {
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.border = "3px solid #BFEFFF";
            arr[i].style.transform = "scale(" + (0.90 + 0.05 * Math.pow(-1, num)) + ")";
        }
        num++;
    }, 300)
}
// 计算分数
// function selectScore() {
//     var score = 0;
//     for (var i = 0; i < choose.length; i++) {
//         score += baseScore + i * stepScore//基础分加上递增分
//     }
//     if (score <= 0) {
//         return;
//     }
//     select_score.innerHTML = choose.length + "块" + score + "分";
//     select_score.style.transition = null;//此处必须还原
//     select_score.style.opacity = 1;//马上显示
//     setTimeout(function () {
//         select_score.style.transition = "opacity 1s";//渐渐消失
//         select_score.style.opacity = 0;
//     }, 1000)
// }
//鼠标移走，小方块恢复大小
function goBack() {
    if (timer != null) {
        clearInterval(timer);
    }
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].style.border = "0px solid #BFEFFF";
            squareSet[i][j].style.transform = "scale(0.95)";
        }
    }
}
//鼠标悬停事件
function mouseOver(obj) {//obj代表的是小方块
    if(!flag){
        tempSquare = obj;
        return;
    }
    goBack();
    choose = [];
    checkLinked(obj, choose);
    //只有两个小方块无法被消灭
    if (choose.length <= 2) {
        choose = [];
        return;
    }
    flicker(choose);
    // console.log(choose);
    // selectScore();//计算分数
}
//小方块渲染
function refresh() {
    for (var i = 0; i < squareSet.length; i++) {
        for (var j = 0; j < squareSet[i].length; j++) {
            if (squareSet[i][j] == null) {
                continue;
            }
            squareSet[i][j].row = i;
            squareSet[i][j].col = j;
            squareSet[i][j].style.transition = "left 0.3s, bottom 0.3s";
            squareSet[i][j].style.left = squareSet[i][j].col * squareWidth + "px";
            squareSet[i][j].style.bottom = squareSet[i][j].row * squareWidth + "px";
            squareSet[i][j].style.backgroundImage = "url('./img/" + squareSet[i][j].num + ".png')";
            squareSet[i][j].style.backgroundSize = "cover";
            squareSet[i][j].style.transform = "scale(0.95)";
        }
    }
}
//小方块往下掉
function move() {
    for (var i = 0; i < boderWidth; i++) {//列
        var pointer = 0;
        for (var j = 0; j < boderWidth; j++) {//行
            if (squareSet[j][i] != null) {
                if (j != pointer) {
                    squareSet[pointer][i] = squareSet[j][i];
                    squareSet[j][i].row = pointer;
                    squareSet[j][i] = null;
                }
                pointer++;
            }
        }
    }
    //横向移动
    for (var i = 0; i < squareSet[0].length; i++) {
        if (squareSet[0][i] == null) {
            for (var j = 0; j < boderWidth; j++) {
                squareSet[j].splice(i, 1);
            }
            continue;
        }
    }
    refresh();
}
//判断是否结束
function isFinish() {
    for(var i=0;i<squareSet.length;i++){
        for(var j=0;j<squareSet[i].length;j++){
            var temp=[];
            checkLinked(squareSet[i][j],temp)
            if(temp.length>1){
                return false;
            }
        }
    }
    return true;    
}

//初始化
function init() {
    table = document.getElementById('pop_star');
    for (var i = 0; i < boderWidth; i++) {
        squareSet[i] = new Array();
        for (var j = 0; j < boderWidth; j++) {
            var square = createSquare(Math.floor(Math.random() * 5), i, j);//创建小方块
            square.onmousemove = function () {//鼠标悬停事件，鼠标放在某个小方块上时触发
                mouseOver(this);
            }
            square.onclick = function () {//鼠标点击事件
                if(!flag||choose.length==0){
                    return;
                }
                flag=false;
                tempSquare = null;
                //加分数
                var score = 0;
                for (var i = 0; i < choose.length; i++) {
                    score += baseScore + i * stepScore;
                }
                totalScore += score;
                nowScore.innerHTML = "当前分数:" + totalScore;
                //消灭星星
                for (var i = 0; i < choose.length; i++) {
                    (function (i) {
                        setTimeout(function () {
                            squareSet[choose[i].row][choose[i].col] = null;
                            table.removeChild(choose[i]);
                        }, i * 100)

                    })(i)
                }
                //移动
                setTimeout(function () {
                    move();
                    //判断是否结束
                    setTimeout(function () {
                        var is = isFinish();
                        if(is){
                            if(totalScore>=targetScore){
                                alert('恭喜获胜');
                            }
                            else{
                                alert('游戏失败')
                            }
                        }
                        else{
                            choose=[];
                            flag=true;
                            mouseOver(tempSquare);
                        }
                    }, 300 + choose.length * 150)
                }, choose.length * 100);
            }
            squareSet[i][j] = square;
            table.appendChild(square);
        }
    }
    refresh();
}

window.onload = function () {
    init();
}
