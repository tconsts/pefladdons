// ==UserScript==
// @name           new_sostav
// @namespace      pefl
// @description    sostav na match
// @include        https://*pefl.*/plug.php?p=squad*&t=*
// @encoding	   windows-1251
// ==/UserScript==

$().ready(function() {
    saveLoadForm = '<table>'
    + '<tr>'
    + '    <td>��������� ���:</td>'
    + '    <td><input id="inputFileNameToSaveAs"></input></td>'
    + '    <td><button onclick="saveTextAsFile()">������� ������</button></td>'
    + '</tr>'
    + '<tr>'
    + '    <td>������� ����:</td>'
    + '    <td><input type="file" id="fileToLoad"></td>'
    + '    <td><button onclick="loadFileAsText()">��������� ������ �� �����</button><td>'
    + '</tr>'
    + ' </table>';

    $('<button class="back2 butt" id="save2" onclick="saveKrab()">��������� ����</button>').insertAfter($('#save'));

	$('#tabs-4').append(saveLoadForm);

}, false);

function saveKrab(){
    debug('postjson(): start');
	if(!save){
		if(!checkErrors()){
			return false;
		}
		save = true;
		savePrepare();
		$.ajax({
			url: 'jsonsostav4.php?' + clubs[curc].uurl,
			type: 'POST',
			dataType : 'json',
			data: 'jsonData=' + JSON.stringify(sData),
			beforeSend: function (xhr){ $('#sres').html('���������...');	},
			complete: function (xhr,status){	save = false; },
			error: function (xhr,status,error){ $('#sres').html('<font color=red>������!</font> ������ �� ���� ���������!'); },
			success: function (res){
                $('#sres').html((res[0] == 0 || res[0] == 10 ? '<font color=green>���������</font>: ' : '<font color=red>������ ���������� �������</font>:<br>') + res[1]);
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