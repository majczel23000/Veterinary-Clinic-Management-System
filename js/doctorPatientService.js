let isSomeoneActive = false;												//czy jest obsługwana jakaś funkcja 
$("#showCustomerList").on('click',function(){								//po kliknieciu "pokaż liste wszystkich klientów
	if(isSomeoneActive)														//jesli juz jest cos aktywnego
		deleteContent("showCustomerList");
	else
		showCustomerList();													//jesli nie ma nic aktywnego]
	$(this).attr('class','btn btnMenu active-btn');							//ustawiamy ten przycisk aktywny
});

$("#showCustomerDetail").on('click',function(){								//po kliknieciu "pokaż liste wszystkich klientów
	if(isSomeoneActive)														//jesli juz jest cos aktywnego
		deleteContent("showCustomerDetail");
	else
		showCustomerDetail();												//jesli nie ma nic aktywnego
	$(this).attr('class','btn btnMenu active-btn');
});

function deleteContent(name, val){											//funkcja usuwa aktualny kontant, a paramtert mówi, który przycisk został aktywowany i na tej pdostawie wywołuje, val pomocna zmienna
	$('#doctorSubMenu a').each(function(){									//resetujemy wszystkie przyciski
		$(this).attr('class','btn btnMenu');
	});
	$("#contentTitle").html("");											//czyścimy środek tytułu
	$("#contentDescription").html("");										//to samo dla cotnentu
	switch (name){															//teraz od name zależy co pokażemy
		case "showCustomerList":
			showCustomerList();
			break;
		case "showCustomerDetail":
			showCustomerDetail(val);
			break;
		default:
			console.warn("err");
			break;
	}
}

function showCustomerList(){												//tutaj funkcja pobierająca dane o klientach
	$.ajax({									
		type:"post",
		url:"getPatientsData.php",
		dataType:"json",
		data:{
			accType:"doctor",
			returnVal:"fullData"											//określa czy chcemy całe czy tylko jednego pacienta
		},
		beforeSend: function(){
			$('body').css('opacity','0.6');
			$('body').css('cursor','progress');
		},
		success: function(json){
			if(json[0]==0 || json==1){													//jesli zero wyników lub błąd połaczenia (1)
				$("#contentTitle").append("<hr>");																//dajemy se kreske 
				$("#contentTitle").append("<h1><i class=\"fas fa-list-ul\"></i> Lista Klientów kliniki</h1>");	//ustawiamy tytuł
				$h3=$("<h3>Brak klientów</h3>");
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
				$("#contentTitle").append("<h1><i class=\"fas fa-list-ul\"></i> Lista Klientów kliniki</h1>");	//ustawiamy tytuł
				let $table=$("<table></table>");																//tworzymy tabele
				$table.attr("id","customerList");																//dajemy jej id
				$table.append("<thead><tr><th>Nazwisko</th><th>Imię</th><th>Email</th><th>Adres</th><th>Numer telefonu</th></tr></thead>");	//wstawiamy do niej thead
				$tbody=$("<tbody></tbody>");
				for(let i=0;i<json.length;i++){
					$tr=$("<tr></tr>");
					$tr.attr("value",json[i]['EMAIL']);			//wpisujemy do value mail, aby potem łatwo było odczytać, w które się kliknęło
					$tr.on('click',function(){sendMailToInputDetail($(this))});	//i na zdarzenie klikniecia ustawiamy funkcje z przekazaniem tego obj
					$tr.html("<td>"+json[i]['LAST_NAME']+"</td><td>"+json[i]['FIRST_NAME']+"</td><td>"+json[i]['EMAIL']+"</td><td>"+json[i]['ADDRESS']+"</td><td>"+json[i]['PHONE_NUMBER']+"</td>");
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
	});
}

function sendMailToInputDetail($obj){									//funkcja przesyłajaca mail klienta do inputa, po kliknieciu na klienta w tabeli
	const mail = $obj.attr("value");					
	deleteContent("showCustomerDetail", mail);
	$("#showCustomerDetail").attr('class','btn btnMenu active-btn');
	getCustomerData();
}

function showCustomerDetail(val){										//val istnieje, gdy przekazujemy maila, którym ma zostac wypełniony input
	$("#contentTitle").append("<hr>");																			//dajemy se kreske 
	$("#contentTitle").append("<h1><i class=\"fas fa-info-circle\"></i> Szczegółowe dane klienta</h1>");		//ustawiamy tytuł
	//$("#contentTitle").fadeOut(1);
	$inputDetail=$("<input class=\"detail-input\" type=\"text\" placeholder=\"Wprowadź adres mailowy klienta, którego dane cię interesują\" >");
	if(val!=null)														//jesli ten val ustnieje, to wypełniamy nim inputa
		$inputDetail.val(val);
	$("#contentDescription").append($inputDetail);							//wstawiamy na strone input
	
	$searchButton=$("<span></span>");
	$searchButton.attr('class','search-button');
	$searchButton.html('<i class="fas fa-search"></i> Pobierz dane tego klienta');	
	$searchButton.on('click',function(){
		getCustomerData();
	});	
	$("#contentDescription").append($searchButton);
	isSomeoneActive=true;
}

function getCustomerData(){
	const mailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/					//regularne dla maila
	if($("#customerDetail").length>0)
		$("#customerDetail").remove();
	if($('.detail-input').val()==''){
		$('.detail-input').css({
			'box-shadow':'3px 3px 5px 6px #ffb3b3'
		});
		$('.detail-input').attr('placeholder','To pole nie może pozostać puste');
	}
	else if(!mailReg.test($('.detail-input').val())){
		$('.detail-input').css({
			'box-shadow':'3px 3px 5px 6px #ffb3b3'
		});
		$('.detail-input').attr('placeholder',' wartość "'+$('.detail-input').val()+'" nie jest adresem mailowym');
		$('.detail-input').val('');
	}
	else{
		$('.detail-input').css({
			'box-shadow':'3px 3px 5px 6px #ccc'
		});
		$('.detail-input').attr('placeholder','Wprowadź adres mailowy klienta, którego dane cię interesują');
		const mail = $('.detail-input').val();
		$.ajax({									
			type:"post",
			url:"getPatientsData.php",
			dataType:"json",
			data:{
				accType:"doctor",
				returnVal:"detail",											//określa czy chcemy całe czy tylko jednego pacienta
				mail:mail
			},
			beforeSend: function(){
				$('body').css('opacity','0.6');
				$('body').css('cursor','progress');
			},
			success: function(json){
				if(json==0 || json==1){															//jesli 0 lub 1(połączenie złe) to znaczy, ze nie ma takiego
					let $table=$("<table></table>");														//tworzymy tabele
					$table.attr("id","customerDetail");														//dajemy jej id
					$table.append("<thead><tr><th colspan=\"2\">Dane klienta: "+mail+"</tr></thead>");		//wstawiamy do niej thead
					$tbody=$("<tbody></tbody>");
					$tbody.append("<tr><td colspan=\"2\">Nie istnieje klient o podanym adresie mailowym.</td></tr>");
					$table.append($tbody);
					$("#contentDescription").append($table);
				}
				else{
					let $table=$("<table></table>");																//tworzymy tabele
					$table.attr("id","customerDetail");																//dajemy jej id
					$table.append("<thead><tr><th colspan=\"2\">Dane klienta: "+json['EMAIL']+"</tr></thead>");		//wstawiamy do niej thead
					$tbody=$("<tbody></tbody>");
					$tbody.append("<tr><td>Imię: </td><td>"+json['FIRST_NAME']+"</td></tr>");					//i poszczególne dane
					$tbody.append("<tr><td>Naziwsko: </td><td>"+json['LAST_NAME']+"</td></tr>");
					$tbody.append("<tr><td>Adres: </td><td>"+json['ADDRESS']+"</td></tr>");
					$tbody.append("<tr><td>Numer telefonu: </td><td>"+json['PHONE_NUMBER']+"</td></tr>");
					$tbody.append("<tr><td>Liczba udanych logowań </td><td>"+json['LOGIN_LAST_A']+"</td></tr>");
					$tbody.append("<tr><td>Liczba nieudanych logowań: </td><td>"+json['LOGIN_LAST_D']+"</td></tr>");
					$tbody.append("<tr><td>Ostatnie udane logowanie: </td><td>"+json['LOGIN_NUM_A']+"</td></tr>");
					$tbody.append("<tr><td>Ostatnie nieudane logowanie: </td><td>"+json['LOGIN_NUM_D']+"</td></tr>");
					$tbody.append("<tr><td>Liczba zwierząt: </td><td>"+json['PET_NUM']+"</td></tr>");
					$tbody.append("<tr><td>Ostatnia wizyta: </td><td>"+json['VISIT_PREV']+"</td></tr>");
					$tbody.append("<tr><td>Następa wizyta: </td><td>"+json['VISIT_NEXT']+"</td></tr>");
					$tbody.append("<tr><td>Liczba wizyt: </td><td>"+json['VISIT_NUM']+"</td></tr>");
					
					$table.append($tbody);
					$("#contentDescription").append($table);														//wstawiamy na strone tabele juz pelną
					
					$('html, body').animate({
						scrollTop: $("#customerDetail").offset().top
					}, 1000);
				}
				$('body').css('opacity','1');
				$('body').css('cursor','default');
			},
			error: function(e){
				console.warn(e);
				$('body').css('opacity','1');
				$('body').css('cursor','default');
			}
		});
	}
}