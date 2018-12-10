let isSomeoneActive = false;												//czy jest obsługwana jakaś funkcja 
$("#showMedicinesList").on('click',function(){									//po kliknieciu pokaż liste wszystkich lekarzy
	if(isSomeoneActive)														//jesli juz jest cos aktywnego
		deleteContent("showMedicinesList");
	else
		showMedicinesList();													//jesli nie ma nic aktywnego]
	$(this).attr('class','btn btnMenu active-btn');							//ustawiamy ten przycisk aktywny
});

$("#addMedicine").on('click',function(){										//dodanie nowego lekarza
	if(isSomeoneActive)														
		deleteContent("addMedicine");
	else
		addMedicine();												
	$(this).attr('class','btn btnMenu active-btn');
});

function deleteContent(name,val){											//funkcja usuwa aktualny kontant, a paramtert mówi, który przycisk został aktywowany
	$('#doctorSubMenu a').each(function(){									//resetujemy wszystkie przyciski
		$(this).attr('class','btn btnMenu');
	});
	$("#contentTitle").html("");											//czyścimy środek tytułu
	$("#contentDescription").html("");										//to samo dla cotnentu
	switch (name){															//teraz od name zależy co pokażemy
		case "showMedicinesList":
			showMedicinesList();
			break;
		case "addMedicine":
			addMedicine();
			break;
		default:
			console.warn("err");
			break;
	}
}

function showMedicinesList(){
	$.ajax({									
		type:"post",
		url:"medicinesService.php",
		dataType:"json",
		data:{
			accType:"doctor",
			returnVal:"fullData"											//określa czy chcemy całe czy tylko jeden lek
		},
		beforeSend: function(){
			$('body').css('opacity','0.6');
			$('body').css('cursor','progress');
		},
		success: function(json){
			if(json[0]==0 || json==1){													//jesli zero wyników lub błąd połaczenia (1)
				$("#contentTitle").append("<hr>");																//dajemy se kreske 
				$("#contentTitle").append("<h1><i class=\"fas fa-list-ul\"></i> Lista leków</h1>");	//ustawiamy tytuł
				$h3=$("<h3>Brak leków</h3>");
				$h3.css({
					'display':'block',
					'width':'20%',
					'margin':'auto'
				});
				$("#contentDescription").append($h3);															//wstawiamy na strone tabele juz pelną
				if(json==1)
					console.warn("BŁĄD POŁĄCZENIA");
			}
			else{
				$("#contentTitle").append("<hr>");																//dajemy se kreske 
				$("#contentTitle").append("<h1><i class=\"fas fa-list-ul\"></i> Lista leków</h1>");			//ustawiamy tytuł
				let $table=$("<table></table>");																//tworzymy tabele
				$table.attr("id","medicinesList");																//dajemy jej id
				$table.append("<thead><tr><th>Nazwa</th><th>Dawkowanie</th><th>Opis</th><th>Status</th><th>Edytuj</th></tr></thead>");	//wstawiamy do niej thead
				$tbody=$("<tbody></tbody>");
				for(let i=0;i<json.length;i++){
					$tr=$("<tr></tr>");
					$tr.html("<td>"+json[i]['NAME']+"</td><td>"+json[i]['DOSAGE']+"</td><td>"+json[i]['DESCRIPTION']+"</td><td>"+json[i]['STATUS']+"</td>");
					$tdEdit = $("<td><i class=\"fas fa-edit\"></i></td>")			//komórka do klikniecia w celu edycji
					$tdEdit.attr('value',json[i]['MED_ID']);						//zapisujemy id, zeby nie pobierać znowu z bazy
					$tdEdit.on('click',function(){showMedicineDetail(json[$(this).attr('value')-1])});  //-1, bo MED_ID idzie od 1, a json od 0
					$tr.append($tdEdit);
					$tbody.append($tr);
				}
				$table.append($tbody);
				$("#contentDescription").append($table);														//wstawiamy na strone tabele juz pelną
			}
			$('body').css('opacity','1');
			$('body').css('cursor','default');
			isSomeoneActive=true;														// !!!!!!!!!! zmieniać gdy jest wyswietlone, bo potem sie psuje!
		},
		error: function(e){
			console.warn(e);
			$('body').css('opacity','1');
			$('body').css('cursor','default');
		}
	});													// !!!!!!!!!! zmieniać gdy jest wyswietlone, bo potem sie psuje!
}
//pokazuje okienko do edycji leku
function showMedicineDetail(medicine){
	// przezroczysty div na cały ekran
	$container=$('<div></div>');
	$container.prop('id','opacityContainer');
	$container.css({
		'position':'fixed',
		'top':'0px',
		'left':'0px',
		'width':'100%',
		'height':'100%',
		'background':'rgba(255, 255, 255, 0.6)'
	});	
	$('body').append($container);

	// div wyśrodkowany w pionie i poziomie na tytuł i treść
	$editingMedicine = $('<div></div>');
	$editingMedicine.prop('id','editingMedicine');
	$editingMedicine.css({
		'position':'absolute',
		'top':'50%',
		'left':'50%',
		'width':'500px',
		'padding': '20px 50px',
		'background':'#ff850c',
		'margin-left':'-270px',
		'margin-top':'-330px',
		'border-radius': '5px',
		'box-shadow': '0px 0px 5px 0px rgba(0,0,0,0.75)'
	});	
	$container.append($editingMedicine);

	// tytuł modala
	$title = $('<div></div>');
	$title.prop('id','titleDoctorDetail');
	$title.css({
		'width': '440px',
		'float': 'left',
		'padding': '10px 20px 20px 20px',
		'background':'#ff850c',
		'font-size':'1.3rem'
	});
	$title.html("<i class='fas fa-info-circle' style='margin-right: 10px'></i>" + medicine['NAME']);
	$editingMedicine.append($title);

	// przycisk do zamykania modala
	$closeButton = $('<div></div>');
	$closeButton.prop('id','closeModal');
	$closeButton.css({
		'width': '20px',
		'float': 'left',
		'font-size': '1.6rem',
		'background':'#ff850c'
	});
	$closeButton.hover(function(){
		$(this).css(
			"cursor", "pointer"
		);
	});
	$closeButton.html("<i class='fas fa-window-close'></i>");
	$editingMedicine.append($closeButton);

	// div na dane do wyswietlenia
	$message = $('<div></div>');
	$message.prop('id','messageMedicineDetail');
	$message.css({
		'width': '100%',
		'height': '100%',
		'font-size': '1.1rem'
	});
	
	// dane do wyświetlenia
	$div = ('<div style="float:left; font-weight:600;text-align:center; width: 100%; padding: 10px 0px">Nazwa:</div>');
	$div2 = ('<div style="float:left; width: 100%;"><input id="medicineName" class="medicine-edit" style="padding: 10px 0px" type="text" value="'+medicine['NAME']+'"></div>');
	$message.append($div);
	$message.append($div2);
	$div = ('<div style="float:left; font-weight:600;text-align:center; width: 100%; padding: 10px 0px">Dawkowanie:</div>');
	$div2 = ('<div style="float:left; width: 100%;"><input id="medicineDosage" class="medicine-edit" style="padding: 10px 0px" type="text" value="'+medicine['DOSAGE']+'"></div>');
	$message.append($div);
	$message.append($div2);
	$div = ('<div style="float:left; font-weight:600;text-align:center; width: 100%; padding: 10px 0px">Opis:</div>');
	$div2 = ('<div style="float:left; width: 100%;"><textarea id="medicineDescription" class="medicine-edit" rows="6" style="padding: 10px 0px">'+medicine['DESCRIPTION']+'</textarea></div>');
	$message.append($div);
	$message.append($div2);
	let select="";
	if(medicine['STATUS']=="ACTIVE")
		select="<select class=\"select-medicine-edit\" id=\"medicineStatus\"><option value=\"ACTIVE\">Aktywny</option><option value=\"INACTIVE\">Nieaktywny</option></select>";
	else
		select="<select id=\"medicineStatus\"><option value=\"INACTIVE\">Nieaktywny</option><option value=\"ACTIVE\">Aktywny</option></select>";
	$div = ('<div style="float:left; font-weight:600;text-align:center; width: 100%; padding: 10px 0px">Status:</div>');
	$div2 = ('<div style="float:left; width: 100%;">'+select+'</div>');
	$message.append($div);
	$message.append($div2);
	
	// godziny przyjęć do wyświetlenia
	$clear = ('<div class="clear" style="margin-bottom:10px"></div>');
	$message.append($clear);
	
	$editingMedicine.append($message);
	$editButton=$("<span style=\"display:block;text-align:center;margin:auto\" class=\"btnEdit\">Zapisz zmiany</span>");
	$editButton.on('click',function(){											//przycisk edycji 			
		$('#opacityContainer').remove();										//usuway ten kontener
	})
	$editingMedicine.append($editButton);
	// po kliknięciu gdziekolwiek poza content znika modal
	$container.on('click', function(){
		$container.remove();
	}).children().click(function() {
		return false;
	});
	
	$closeButton.on('click', function(){
		$container.remove();
	});
}

function addMedicine(){
	$("#contentTitle").append("<hr>");																//dajemy se kreske 
	$("#contentTitle").append("<h1><i class=\"fas fa-plus\"></i> Dodanie leku</h1>");	//ustawiamy tytuł
	$h3=$("<h3>Brak Leków</h3>");
	isSomeoneActive=true;
}