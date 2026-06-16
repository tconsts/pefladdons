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

    $('<button class="ui-button team-update" style="width: 110px;" id="save2" onclick="saveKrab()">Сохранить Краб</button>').insertAfter($('#team-update-'));

	$('#tabs-4').append(saveLoadForm);

    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (typeof krabsave!=='undefined' && krabsave=='_' && settings.indexValue!==undefined && settings.indexValue=='team-update-') {
            if (xhr.responseJSON !== undefined && xhr.responseJSON.messages !== undefined) {
		        krabsave = xhr.responseJSON.messages[0][1].replaceAll(':','_');
	        }
            saveTextAsFile($('td.topmenu:first td:last').html().substr(7,3)+'-'+$('.cback33:nth-child(2) .dopinfo a').html()+'-'+krabsave+'.json');
            krabsave='';
        }
    });
}, false);

function saveKrab() {
    krabsave = '_';
	$('#team-update-').click();
    return false;
}

function saveTextAsFile(fileName)
{
    var textToSave = JSON.stringify(savePrepare(data,'team',''));

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
