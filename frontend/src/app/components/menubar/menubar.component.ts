import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {

  constructor(private rest: RestService, private route:Router) { }

  usuarioU = {
    id_usuario:0,
    nombre_usuario:"",
    correo_usuario:"",
    contrasena_usuario:"",
    tipo_usuario:0
  }

  check=0;

  ngOnInit(): void {
    var datos = sessionStorage.getItem('datos_usuario')
    if(datos){
      this.usuarioU = JSON.parse(datos)
      this.check = 1;
    }else{
      this.check=0;
      return
    }
  }

  async cerrarSesion(){
    var datos = sessionStorage.getItem('datos_usuario')
    if(datos){
      var usuarioU = JSON.parse(datos)
      var res = await this.rest.PostRequest('cerrrar_sesion', usuarioU).toPromise();
      if(res.exito){
        sessionStorage.removeItem('datos_usuario')
        this.route.navigate(['login'])

      }else{
        this.route.navigate(['login'])
      }
     
      
    }
  }

}
