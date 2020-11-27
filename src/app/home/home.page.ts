import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import * as ca  from './functions/calculadoraArribadas';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  transectoInicial:number;
  transectoFinal:number;
  horaInicial:number;
  horaFinal:number;
  numeroTortugas:number;
  mensaje:string;

  headerString;

  constructor(public alertController : AlertController) { }

  async basicAlert() {
    
    this.getValues(this.transectoInicial,
                    this.transectoFinal,
                    this.horaInicial,
                    this.horaFinal,
                    this.numeroTortugas);

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.headerString,
      message: this.mensaje,
      buttons: ['Entendido']
    });
    await alert.present();
  }

  closeApp() { 
    navigator['app'].exitApp();
  }

  getValues(transectoInicial,transectoFinal,horaInicial,horaFinal,numeroTortugas) {

    if (transectoFinal <= transectoInicial) {
      this.headerString = "¡ALERTA!";
      this.mensaje = "EL TRANSECTO INICIAL NO PUEDE SER MAYOR AL FINAL.";
    }
    else if (ca.getValueByIndex(ca.hours,horaInicial) >= ca.getValueByIndex(ca.hours,horaFinal)) {
      this.headerString = "¡ALERTA!";
      this.mensaje = "LA HORA INICIAL NO PUEDE SER POSTERIOR A LA FINAL.";
    }
    else if ( (ca.getValueByIndex(ca.hours,horaFinal) - ca.getValueByIndex(ca.hours,horaInicial)) % 2 != 0) {
      this.headerString = "¡ALERTA!";
      this.mensaje = "LOS MUESTREOS DEBEN SER CADA 2 HORAS.";
    }
    else {      
      this.headerString = "Resultados estimados";
      ca.main(
        this.transectoInicial,
        this.transectoFinal,
        this.horaInicial,
        this.horaFinal,
        this.numeroTortugas);

        if(Number.isNaN(ca.getAreaAnidacion())) {
          this.headerString = "¡ALERTA!";
          this.mensaje = "DATOS NO VÁLIDOS.";
        }
        else {

      this.mensaje = 
      
        "<li>"+
          "Área anidación: "+ca.getAreaAnidacion()+" m&#178"+
        "</li>"+
        "<li>"+
          "Duración arribada: "+ca.getDuracionArribada()+" min."+
        "</li>"+
        "<li>"+
          "Periodos muestreo: "+ca.getPeriodosMuestreo()+
        "</li>"+
        "<li>"+
          "Periodos muestreo: "+ca.getSumaLongitudes()+"m"+
        "</li>"+
        "<li>"+
          "Total tortugas: "+ca.getTotalTortugas()+
        "</li>";
        }
    }

  }


}
