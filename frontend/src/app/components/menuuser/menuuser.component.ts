import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-menuuser',
  templateUrl: './menuuser.component.html',
  styleUrls: ['./menuuser.component.css']
})
export class MenuuserComponent implements OnInit {

  constructor(private rest: RestService, private route: Router) { }

  ngOnInit(): void {
  }

  async cerrarSesion(){
    var datos = sessionStorage.getItem('datos_usuario')
    if (datos){
      var usuario = JSON.parse(datos)
      var res = await this.rest.PostRequest('cerrar_sesion', usuario).toPromise();
      if (res.exito){
        sessionStorage.removeItem('datos_usuario')
        this.route.navigate(['login'])
      }
    }else{
      this.route.navigate(['login'])
    }
    
  }
}