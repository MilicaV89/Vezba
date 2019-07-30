var upozorenje = {
	poruka: "Grad mora biti velikim slovima"
}

function proveraForme(forma) {
	if(forma.ime.value == ""){
		return false;
	}

	if(forma.prezime.value == ""){
		return false;
	}

	//JMBG nije validan ukoliko nije unesen ILI ukoliko nema 13 cifara ILI ukoliko nije broj: funkcija isNaN vraca true ukoliko nesto nije broj
	if(forma.jmbg.value == "" || forma.jmbg.value.length != 13 || isNaN(forma.jmbg.value)){
		return false;
	}

	if(forma.grad.value == "" || forma.grad.value.toUpperCase() != forma.grad.value){
		//1. Poziv funkcije kojoj prosledjujemo obejat upozorenja i ispisiPoruku kao callback funkciju
		callAlertFunction(upozorenje, ispisiPoruku);
		return false;
	}

	return true;
}

function callAlertFunction(parametar, callback) {
	//2. parametar je objekat upozorenje iz koraka 1, callback je funkcija ispisiPoruku iz koraka 1.
	callback(parametar); //Ovo poziva ispisiPoruku(upozorenje)
}

function ispisiPoruku(param) {
	//3. param je objekat upozorenje/odnosno parametar iz koraka 2
	alert(param.poruka);
}

function proveraJMBG(input) {
	//parametar ove funkcije ce biti konkretno input polje
	//vrednost input polja dobijamo sa .value:
	var val = input.value;
	var submitBtn = document.getElementById("submitBtn");
	if (val.length != 13 || isNaN(val)) {
		document.getElementById("jmbg_label").setAttribute("class", "redText")
		submitBtn.disabled = true; //Drugi nacin za disablovanje buttona je u zadatku 9
	} else {
		document.getElementById("jmbg_label").setAttribute("class", "");
		submitBtn.disabled = false; 
	}
}

function proveraGrad(input){
	if(input.value == "" || input.value.toUpperCase() != input.value){
		document.getElementById("grad_label").setAttribute("class", "redText")
	}else{
		document.getElementById("grad_label").setAttribute("class", "")
	}
}