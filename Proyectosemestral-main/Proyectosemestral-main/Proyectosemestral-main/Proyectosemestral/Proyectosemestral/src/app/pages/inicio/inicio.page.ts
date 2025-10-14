import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {

  //declarar un modelo para validar [diccionario (key, value)]
  usuario: any ={
    nombre:"",
    email:""
  }
  //defino una variable global para guardar el nombre (key) del campo no ingresado
  field: string="";

  constructor(private toastController: ToastController, private router: Router) { }

  ngOnInit() {
  }

  navegar(){
    if (this.validateModel(this.usuario)) {
      //si tengo los datos navego hacia la siguiente página
      //agrego la creación de state extras para paso de parámetros
      let navigationExtras :  NavigationExtras = {
        state: {usuario: this.usuario}
      };
      //invocar el llamado a la siguiente page
      this.router.navigate(['/home'], navigationExtras);      
    }else{
      this.presentToast("middle", "Error: Falta " + this.field,5000);
    }
    
  }

  /**
     * validateModel sirve para validar que se ingrese algo en los
     * campos del html mediante su modelo
  */
  validateModel(model: any){
    //Recorro modelo 'usuario' revisando las entradas del object
    for(var [key,value] of Object.entries(model)){
      //si el value es "" retorno falso y guardo el nombre del campo vacío (key)
      if (value == "") {
        this.field = key;
        return false;
      }
    }
    //están TODOS los campos requeridos
    return true;
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', msg:string, duration?:number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration?duration:2500,
      position: position,
    });

    await toast.present();
  }
}
