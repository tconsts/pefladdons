// ==UserScript==
// @name           pefldoverie
// @namespace      pefl
// @description    doverie
// @include        http://*pefl.*/plug.php?p=refl&t=dov&k=*
// @encoding	   windows-1251
// ==/UserScript==

$().ready(function() {
    saveLoadForm = '<table>'
    + '<tr>'
    + '    <td>Сохранить как:</td>'
    + '    <td><input id="inputFileNameToSaveAs"></input></td>'
    + '    <td><button onclick="saveTextAsFile()">Скачать состав</button></td>'
    + '</tr>'
    + '<tr>'
    + '    <td>Выбрать файл:</td>'
    + '    <td><input type="file" id="fileToLoad"></td>'
    + '    <td><button onclick="loadFileAsText()">Загрузить состав из файла</button><td>'
    + '</tr>'
    + ' </table>';

    $('<button class="back2 butt" id="save2" onclick="saveKrab()">Сохранить Краб</button>').insertAfter($('#save'));

	$('#tabs-4').append(saveLoadForm);

}, false);

function saveKrab(){
    console.log('postjson(): start');
	if(!save){
		if(!checkErrors()){
			return false;
		}
		save = true;
		savePrepare();
		$.ajax({
			url: 'jsonsostav.php?' + clubs[curc].uurl,
			type: 'POST',
			dataType : 'json',
			data: 'jsonData=' + JSON.stringify(sData),
			beforeSend: function (xhr){ $('#sres').html('Сохраняем...');	},
			complete: function (xhr,status){	save = false; },
			error: function (xhr,status,error){ $('#sres').html('<font color=red>ОШИБКА!</font> данные не были сохранены!'); },
			success: function (res){
                $('#sres').html((res[0] == 0 || res[0] == 10 ? '<font color=green>СОХРАНЕНО</font>: ' : '<font color=red>ОШИБКА СОХРАНЕНИЯ СОСТАВА</font>:<br>') + res[1]);
                if (res[0] == 0 || res[0] == 10) {
                    saveTextAsFile($('td.topmenu:first td:last').html().substr(7,3)+'-'
                    +$('.cback33:nth-child(2) .dopinfo a').html()+'-'
                    +res[1]+'.json');
                }
			}			
		});
	}
	return false;

}

function saveTextAsFile(fileName)
{
    savePrepare();
    var textToSave = JSON.stringify(data);

    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = fileName == undefined ?inputFileNameToSaveAs.value : fileName;
 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
 
    downloadLink.click();
}
 
function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}
 
function loadFileAsText()
{
    var fileToLoad = document.getElementById("fileToLoad").files[0];
 
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        draw(JSON.parse(textFromFileLoaded), 1);
    };
    fileReader.readAsText(fileToLoad, "UTF-8");
}

//})();