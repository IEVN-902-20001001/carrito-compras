import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = {
    id_usuario:0,
    nombre_usuario:"",
    correo_usuario:"",
    contrasena_usuario:"",
    tipo_usuario:0
  }

  constructor(private rest: RestService, private route:Router) { }

  ngOnInit(): void {
    var datos = sessionStorage.getItem('datos_usuario')
    if(datos){
      var usuario = JSON.parse(datos)
      
      if(usuario.tipo_usuario==1){
        this.route.navigate(["libros"])
      }else{
        this.route.navigate([""])
      }
    }else{
      return
    }
  }

  async logIn(){
    var res =await this.rest.PostRequest('iniciar_sesion',this.usuario).toPromise();
    if(res.exito){
      sessionStorage.removeItem('datos_usuario')
      sessionStorage.setItem('datos_usuario',JSON.stringify(res.usuario));
      if(res.usuario.tipo_usuario==1){
        this.route.navigate(["libros"])
      }else{
        this.route.navigate(["libroNuevo"])
      }
    }

    console.log(res);
    console.log(this.usuario)
  }

}
