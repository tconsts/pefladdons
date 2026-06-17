// ==UserScript==
// @name           new_sostav
// @namespace      pefl
// @description    sostav na match
// @include        https://*pefl.*/plug.php?p=squad*&t=*
// @encoding	   windows-1251
// ==/UserScript==

$().ready(function() {
    let krabsave = '',
        filePrefix = $('td.topmenu:first td:last').text().replace(/.*\((\d+).*/,'$1')+'ИД'
            +'-'+$('.cback33:nth-child(2) .dopinfo a').text().replace('Назначить ',''),
        saveLoadForm = '<tbody>'
        +'<tr style="background-color: inherit;">'
        + '    <td>Сохранить как:</td>'
        + '    <td colspan="2"><input style="width: 100%" id="inputFileNameToSaveAs" value="'+filePrefix+'-'+(new Date()).toLocaleString().replace(/[^0-9]/g,'')+'.json"></input></td>'
        + '    <td colspan="2"><button class="ui-button team-update" onclick="saveTextAsFile()" style="width:100%">Скачать состав</button></td>'
        + '</tr>'
        + '<tr style="background-color: inherit;">'
        + '    <td>Выбрать файл:</td>'
        + '    <td colspan="2"><input type="file" id="fileToLoad"></td>'
        + '    <td colspan="2"><button class="ui-button team-update" onclick="loadFileAsText()" style="width:100%">Загрузить состав из файла</button></td>'
        + '</tr>'
        + ' </tbody>';

    $('<button class="ui-button team-update" style="width: 110px;" id="save2" onclick="saveKrab()">Сохранить Краб</button>').insertAfter($('#team-update-'));

	$('#tbackup tbody').after(saveLoadForm);

    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (typeof krabsave!=='undefined' && krabsave==='_' && settings.indexValue!==undefined && settings.indexValue==='team-update-') {
            if (xhr.responseJSON !== undefined && xhr.responseJSON.messages !== undefined) {
		        krabsave = xhr.responseJSON.messages[0][1].replaceAll(':','_');
	        }
            saveTextAsFile(filePrefix+'-'+krabsave+'.json');
            krabsave='';
        }
    });
    $('a.ui-tabs-anchor:last').on('click',function() {
        $('#inputFileNameToSaveAs').val(
            (filePrefix + '-'
            + (new Date()).toLocaleString().replace(/[^0-9\s]/g, '')
            + '.json').replaceAll(' ','_')
        );
    });
}, false);

function saveKrab() {
    krabsave = '_';
	$('#team-update-').click();
    return false;
}

function saveTextAsFile(fileName)
{
    if (typeof(data) == 'undefined') {
        appendMessage('Нет данных для загрузки!',1);
    }
    let textToSave = JSON.stringify(data),
        textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"}),
        textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob),
        fileNameToSaveAs = fileName === undefined ? inputFileNameToSaveAs.value : fileName;
 
    let downloadLink = document.createElement("a");
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
    let fileToLoad = document.getElementById("fileToLoad").files[0],
        fileReader = new FileReader();
    fileReader.fileName = typeof(fileToLoad)==='undefined' ? "-не выбран-" : fileToLoad.name;
    fileReader.onload = function(fileLoadedEvent) 
    {
        let textFromFileLoaded = fileLoadedEvent.target.result;
        try {
            data = checkReceivedData(JSON.parse(textFromFileLoaded));
            draw(data, 'team');
            appendMessage('Загрузка состава из файла "'+fileLoadedEvent.target.fileName+'"',0)
        } catch (e) {
            appendMessage('Загрузка состава из файла "'+fileLoadedEvent.target.fileName +'": '+e.message,1);
            $('#loading').hide();
            $('#tabs').show();
        }
    };
    if ($('#fileToLoad').val() !== '') {
        appendMessage('');
        $('#tabs').hide();
        $('#loading').html('Загрузка состава из файла...<br>Придётся немного подождать...').show();
        fileReader.readAsText(fileToLoad, "UTF-8");
    } else {
        appendMessage('Необходимо выбрать файл для загрузки!',1,true);
    }
}