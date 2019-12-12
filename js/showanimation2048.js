function shownumberWithAnimation(i,j,number){
	var numberCell = $('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getNumberBackgroundColor(number));
	numberCell.css('color',getNumberColor(number));
	numberCell.text(number);
	// console.log(i,j,number);
	numberCell.animate({
		width:cellSideLength,
		height:cellSideLength,
		top:getPos(i),
		left:getPos(j)
	},50)
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell = $('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPos(tox),
		left:getPos(toy)
	},200);
}

function upDateScore(score){
	$('#score').text(score);
}
function upDateBestScore(best_score){
	$('#best_score').text(best_score);
}