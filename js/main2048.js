var board = new Array();
// console.log(board);
var score = 0;
var best_score = 0;
var hasConflicted = new Array();

//定义鼠标移入x、y轴位置，y轴方向为向下
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function(){
	prepareForMobile();
	newgame();
});

function prepareForMobile(){
	if(documentWidth>500){
		gridContainerWidth=500;
		cellSpace = 20;
		cellSideLength=100;
	}
	$('.heading').css('width',gridContainerWidth - 2*cellSpace);
	$('.heading').css('height',gridContainerWidth/6);
	$('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
	$('#grid-container').css('padding',cellSpace);
	$('#grid-container').css('border-radius',0.02*gridContainerWidth);
	$('.game-message').css('width',gridContainerWidth - 2*cellSpace);
	$('.game-message').css('height',gridContainerWidth - 2*cellSpace);
	$('.game-message').css('padding',cellSpace);
	$('.game-message').css('border-radius',0.02*gridContainerWidth);
	$('.grid-cell').css('width',cellSideLength);
	$('.grid-cell').css('height',cellSideLength);
	$('.grid-cell').css('border-radius',0.02*gridContainerWidth);
}

function newgame(){
	//初始化棋盘格
	init();
	//在随机两个格子生成数字
	generateOneNumber();
	generateOneNumber();
}

function init(){
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			var gridCell = $("#grid-cell-"+i+"-"+j);
			gridCell.css({top:getPos(i),left:getPos(j)});
		}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i] = new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}
	updateBoardView();
	score = 0;
	// console.log(best_score);
	// best_score = best_score;
}

function JudgeScore(a,b){
	if(a<b){
		upDateScore(a);
		console.log(b);
		b = best_score;
		upDateBestScore(b);
	}else{
		b=a;
		upDateScore(a);
		upDateBestScore(b);
	}
	return;
}

function updateBoardView(){
	$(".number-cell").remove();
	for(var i=0;i<4;i++)
		for(var j=0;j<4;j++){
			// console.log(board[i][j]);
			$("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
			var theNumberCell = $('#number-cell-'+i+'-'+j);
			// console.log(theNumberCell);
			if(board[i][j]==0){
				theNumberCell.css('width','0px');
				theNumberCell.css('height','0px');
				theNumberCell.css('top',getPos(i)+cellSideLength/2);
				theNumberCell.css('left',getPos(j)+cellSideLength/2);
				// console.log(getNumberBackgroundColor(board[i][j]));
				// console.log(getNumberColor(board[i][j]));
			}
			else{
				theNumberCell.css('width',cellSideLength);
				theNumberCell.css('height',cellSideLength);
				theNumberCell.css('top',getPos(i));
				theNumberCell.css('left',getPos(j));
				theNumberCell.css('background-color',getNumberBackgroundColor(board[i][j]));
				theNumberCell.css('color',getNumberColor(board[i][j]));
				theNumberCell.text(board[i][j]);
				// console.log(getNumberBackgroundColor(board[i][j]));
				// console.log(getNumberColor(board[i][j]));
			}
			hasConflicted[i][j]= false;
		}
		$('.number-cell').css('line-height',cellSideLength+'px');
		$('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){
	if(nospace(board))
		return false;
		//随机一个位置
		var randx =parseInt(Math.floor( Math.random()*4));
		var randy =parseInt(Math.floor( Math.random()*4));
		var times = 0;
		while(times < 50){
			if(board[randx][randy]==0)
				break;
			randx =parseInt(Math.floor( Math.random()*4));
			randy =parseInt(Math.floor( Math.random()*4));
			
			times ++;
		}
		//人工找位置
		if(times == 50){
			for(var i=0;i<4;i++)
				for(var j=0;j<4;j++){
					if(board[i][j] == 0){
						randx = i;
						randy = j;
					}
				}
		}
		//随机一个数字
		var randnumber =  Math.random()<0.5?2:4;
		//在随机位置显示随机数
		board[randx][randy]=randnumber;
		shownumberWithAnimation(randx,randy,randnumber);
	return true;
}

$(document).keydown(function(event){
	switch(event.keyCode){
		case 37://left
		event.preventDefault();//阻挡浏览器默认效果
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 38://up
		event.preventDefault();//阻挡浏览器默认效果
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 39://right
		event.preventDefault();//阻挡浏览器默认效果
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
			break;
		case 40://down
		event.preventDefault();//阻挡浏览器默认效果
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
			break;
		default://default
			break;
	}
});

document.addEventListener('touchstart',function(event){
	startx=event.touches[0].pageX;
	starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event){
	endx=event.changedTouches[0].pageX;
	endy=event.changedTouches[0].pageY;
	var deltax = endx-startx;
	var deltay = endy-starty;

	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
	return;
	//x
	if(Math.abs(deltax)>=Math.abs(deltay)){
		if(deltax>0){
			//move right
			if(moveRight()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
		}else{
			//move left
			if(moveLeft()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
		}
	}//y
	else{
		if(deltay>0){
			//move down
			if(moveDown()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
		}else{
			//move up
			if(moveUp()){
				setTimeout("generateOneNumber()",210);
				setTimeout("isgameover()", 300);
			}
		}
	}
});

function isgameover(){
	if(nospace(board) && nomove(board)){
		gameover();
	}
}

function gameover(){
	// alert("It's gameover");
	$(".game-message").css('display','inline');
	if(score>=best_score){
		best_score==score;
		upDateScore(best_score);
	}
	$(".retry-button").click(function(){
		$(".game-message").css('display','none');
	})
	console.log(score,best_score);
}

function moveLeft(){
	if(!canMoveLeft(board))
		return false;
	//MoveLeft
	for(var i=0;i<4;i++)
		for(var j=1;j<4;j++){
			if(board[i][j] != 0){
				for(var k=0;k<j;k++){
					if(board[i][k] == 0 && noBlockHorizontal(i,k,j,board)){
						// console.log(noBlockHorizontal(i,k,j,board));
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						// console.log(board[i][j],board[i][k]);
						continue;
					}
					else if(board[i][k] == board[i][j]&& noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
						// console.log(noBlockHorizontal(i,k,j,board),i,k,j,board);
						//move
						showMoveAnimation(i,j,i,k);
						//add
						board[i][k] += board[i][j];
						board[i][j] = 0;
						//add score
						score += board[i][k];
						JudgeScore(score,best_score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	//等待200毫秒
	setTimeout("updateBoardView()",200);
	return true;
}

function moveUp(){
	if(!canMoveUp(board))
		return false;
	//MoveUp
	for(var j=0;j<4;j++)
		for(var i=1;i<4;i++){
			if(board[i][j] != 0){
				for(var k=0;k<i;k++){
					if(board[k][j] == 0 && noBlockVertical(j,k,i,board)){
						// console.log(noBlockVertical(j,k,i,board));
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						// console.log(board[i][j],board[i][k]);
						continue;
					}
					else if(board[k][j] == board[i][j]&& noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
						// console.log(noBlockVertical(j,i,k,board),j,i,k,board);
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] *=2;
						board[i][j]=0;
						//add score
						score += board[k][j];
						JudgeScore(score,best_score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	//等待200毫秒
	setTimeout("updateBoardView()",200);
	return true;
}
function moveRight(){
		if(!canMoveRight(board))
			return false;
		//MoveRight
		for(var i=0;i<4;i++)
			for(var j=2;j>=0;j--){
				if(board[i][j] != 0){
					for(var k=3;k>j;k--){
						if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){
							// console.log(noBlockHorizontal(i,k,j,board));
							//move
							showMoveAnimation(i,j,i,k);
							board[i][k]=board[i][j];
							board[i][j]=0;
							// console.log(board[i][j],board[i][k]);
							continue;
						}
						else if(board[i][k] == board[i][j]&& noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
							// console.log(noBlockHorizontal(i,k,j,board),i,k,j,board);
							//move
							showMoveAnimation(i,j,i,k);
							//add
							board[i][k] *=2;
							board[i][j] = 0;
						//add score
						score += board[i][k];
						JudgeScore(score,best_score);
						hasConflicted[i][k] = true;
							continue;
						}
					}
				}
			}
		//等待200毫秒
		setTimeout("updateBoardView()",200);
		return true;
}

function moveDown(){
	if(!canMoveDown(board))
		return false;
	//MoveDown
	for(var j=0;j<4;j++)
		for(var i=2;i>=0;i--){
			if(board[i][j] != 0){
				for(var k=3;k>i;k--){
					if(board[k][j] == 0 && noBlockVertical(j,i,k,board)){
						// console.log(noBlockVertical(j,k,i,board));
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						// console.log(board[i][j],board[i][k]);
						continue;
					}
					else if(board[k][j] == board[i][j]&& noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
						// console.log(noBlockVertical(j,i,k,board),j,i,k,board);
						//move
						showMoveAnimation(i,j,k,j);
						//add
						board[k][j] *= 2;
						board[i][j]=0;
						//add score
						score += board[k][j];
						JudgeScore(score,best_score);
						hasConflicted[k][j] = true;
						continue;
					}
				}
			}
		}
	//等待200毫秒
	setTimeout("updateBoardView()",200);
	return true;
}