
function replaceOneChar(s,c,n){
var re = new RegExp('^(.{'+ --n +'}).(.*)$','');
return s.replace(re,'$1'+c+'$2');
};

var tbody = document.getElementsByTagName('tbody').item(0); 
var sum = -1; 
var goals = 0;
var passes = 0;
var IM = 0;
var CP = 0;
var clubs = 0;
var i;
for (i=1; i<tbody.rows.length; i++) 
{ 
	var cols =  tbody.rows[i].cells;
 	if (cols[1].innerHTML.indexOf('Клуб') >= 0 ||
        cols[1].innerHTML.indexOf('Сборная') >= 0) 	
	{
 		if (sum < 0) 
            sum = 0; 		
        continue; 	
	} 
	
    if (sum < 0) 		
		continue; 
	
	
	sum += parseInt(cols[2].innerHTML);
	goals += parseInt(cols[3].innerHTML);
	passes += parseInt(cols[4].innerHTML);
	IM += parseInt(cols[5].innerHTML);
	var sCP = replaceOneChar(cols[6].innerHTML,'.',2);
    var fCP = parseFloat(sCP);
    if (fCP > 1)
    {
        clubs++;
        CP += fCP;
    }
}

var resRow = tbody.insertRow(-1);
resRow = tbody.insertRow(-1);
for( i = 0; i < tbody.rows[0].cells.length; i++)
{
	var newCell = resRow.insertCell(-1);	
	newCell.innerHTML = "<b></b>";
	newCell.className = "back5";
}

resRow.cells[0].innerHTML = "<b>Итого</b>";
resRow.cells[2].innerHTML = "<b>"+sum+"</b>";
resRow.cells[3].innerHTML = "<b>"+goals+"</b>";
resRow.cells[4].innerHTML = "<b>"+passes+"</b>";
resRow.cells[5].innerHTML = "<b>"+IM+"</b>";
resRow.cells[6].innerHTML = "<b>"+(CP/clubs).toFixed(2)+"</b>";