let studenti: Student[] = [];
let aktivanStudent: Student = null;

function promeniAktivnog(selekt: HTMLSelectElement){
    //selekt.value nam sadrzi jmbg jednog studenta
    //na osnovu tog jmbga mi filtriramo niz studenti kako bi dobili bas tog studenta koga
    //smo selektovali sa selekt poljem (njegov jmbg)
    //posto nam filter vraca niz a nama treba konkretan objekat iz niza kojeg nam vraca filter
    //taj objekat izdvajamo sa [0] (indeksiramo prvi element niza)
    aktivanStudent = studenti.filter((elem) => elem.jmbg == Number(selekt.value))[0]; 
    aktivanStudent.refreshPredmeti();
}

class Predmet {
    naziv: string;
    ocena: number;
    constructor(naziv: string, ocena: number){
        this.ocena = ocena;
        this.naziv = naziv;
    }
}

class Student {
    private _ime: string;
    private _prezime: string;
    private _jmbg: number;
    private _predmeti: Predmet[]; //Svaki student ima predmete koje je polozio, niz predmeta

    constructor(ime: string, prezime: string, jmbg: number) {
        this._ime = ime;
        this._prezime = prezime;
        this._jmbg = jmbg;
        this._predmeti = []; //Inicajizujemo niz predmeta na prazan niz kako bi kasnije mogli da radimo this._predmeti.push(...)

        
    }

    //Geter i seteri prema tekstu zadatka
    get ime(): string{
        return this._ime;
    }

    set ime(param: string) {
        this._ime = param;
    }

    get prezime(): string{
        return this._prezime;
    }

    set prezime(param: string) {
        this._prezime = param;
    }

    get jmbg(): number{
        return this._jmbg;
    }

    set jmbg(param: number) {
        this._jmbg = param;
    }

    get predmeti(): Predmet[] {
        return this._predmeti;
    }

    dodajPredmet(predmet: Predmet): void {
        this._predmeti.push(predmet); //Novi predmet dodajemo u niz predmeta
        this.refreshPredmeti(); //Pozivamo refresh kako bi osvezili html stranicu
    }

    refreshPredmeti(): void {
        let predmetiOut: HTMLElement = document.getElementById("predmeti"); //U div sa IDjem predmeti upisujemo sve polozene predmete
        let outString: string = "";
        for(let i = 0; i < this._predmeti.length; i++){
            outString += `Predmet: ${this._predmeti[i].naziv} <br/>Ocena: ${this._predmeti[i].ocena} <br/><br/>`;
        }
        predmetiOut.innerHTML = outString;

    }

    getProsek(): number {
        return this._predmeti.reduce((prev, next) => prev + next.ocena, 0) / this._predmeti.length;
    }
    
}

//Sve reakcije na klik dugmica ce se raditi nad aktivnim studentom (studentom koji je trenutno selektovan u select polju)
function wireEvents(): void {
    //Arrow funkcije:
    //Bez parametara zagrade obavezne:  () => telo
    //Sa jednim parametrom zagrade nisu obavezne: x => telo
    //Sa vise parametara zagrade su obavezne: (p1,p2,...,pn) => telo

    //Klik na dugme sa idom dodajPredmet
    document.getElementById("dodajPredmet").addEventListener("click", ()=>{
        let naziv: HTMLInputElement = document.getElementById("naziv") as HTMLInputElement; //Kao u calculatoru preuzimamo input elemente
        let ocena: HTMLInputElement = document.getElementById("ocena") as HTMLInputElement;
        let p: Predmet = new Predmet(naziv.value, Number(ocena.value)); //Pravimo novi objekat tipa Predmet sa vrednostima iz input elemenata
        aktivanStudent.dodajPredmet(p); //Dodajemo novi predmet u niz predmeta
    });

    //Klik na dugme sa idom izracunajProsecnuOcenu
    document.getElementById("izracunajProsecnuOcenu").addEventListener("click", ()=>{
        let prosekOut: HTMLElement = document.getElementById("prosecnaOcena");
        //Ispis prosecne ocene vrsimo u div sa idom prosecnaOcena po format sa slike
        prosekOut.innerHTML = `Prosecna ocena za studenta: ${aktivanStudent.ime} ${aktivanStudent.prezime} je ${aktivanStudent.getProsek()}`;

    });


}

//Kod za inicijalizaciju, sacekamo da se dom ucita i onda popunimo selekt polje sa studentima
window.onload = function() {
    initStudenti.forEach((elem) => {
        let s: Student = new Student(elem.ime, elem.prezime, Number(elem.jmbg));
        elem.predmeti.forEach((elem)=>{
            let p: Predmet = new Predmet(elem.naziv, elem.ocena);
            s.dodajPredmet(p);
        });
        studenti.push(s);
        if(aktivanStudent == null){
            aktivanStudent = s;
        }
    });
    if(QueryString["ime"] != null){
        var student = new Student(QueryString["ime"], QueryString["prezime"], Number(QueryString["jmbg"]));
        studenti.push(student);    
    }
    let selekt: HTMLElement = document.getElementById("student");
    let output: string = "";
    for(let i = 0; i < studenti.length; i++){
        let optionElem = `<option value=${studenti[i].jmbg}>${studenti[i].ime} ${studenti[i].prezime}</option>`;
        output += optionElem;         
    }
    selekt.innerHTML = output;
    aktivanStudent.refreshPredmeti();
    wireEvents();
}


var initStudenti = [
    {
        ime: "Pera",
        prezime: "Peric",
        jmbg: "1123456789000",
        predmeti: [
            {
                naziv: "Predmet1",
                ocena: 10
            },
            {
                naziv: "Predmet2",
                ocena: 8
            },
            {
                naziv: "Predmet3",
                ocena: 9
            },
            {
                naziv: "Predmet4",
                ocena: 9
            }
        ]
    },
    {
        ime: "Mika",
        prezime: "Mikic",
        jmbg: "1123456789001",
        predmeti: [
            {
                naziv: "Predmet1",
                ocena: 7
            },
            {
                naziv: "Predmet2",
                ocena: 10
            },
            {
                naziv: "Predmet3",
                ocena: 8
            }
        ]
    }
]

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
}();

