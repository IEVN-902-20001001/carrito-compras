import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  messageOk = null;
  messageErr = null;

  no_disponible = "https://dynamicmediainstitute.org/wp-content/themes/dynamic-media-institute/imagery/default-book.png";


  libros = [{
    id_producto: 0,
    imagen_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    autor_producto: "",
    ano_producto: 0,
    precio_producto: 0.0,
    stock_producto: 0,
    estatus_producto:0
  }
  ]

  constructor(private rest: RestService, private route: Router) { }

  ngOnInit(): void {
    var datos = sessionStorage.getItem('datos_usuario')
    if (datos){
      var usuario = JSON.parse(datos)
      
      if (usuario.tipo_usuario!=1){
        this.route.navigate([""])
      }
    }else{
      this.route.navigate(["login"])
      return
    }
    this.getLibros();
  }

  async getLibros() {
    var res = await this.rest.GetRequest('home').toPromise();
    this.libros = res.productos;
    console.log(this.libros)
  }

  async eliminar(i: any) {
    var libro: any = this.libros[i];
    try {
      var res = await this.rest.DeleteRequest('/eliminarProducto', {id_producto:libro.id_producto}).toPromise();
      this.messageOk = res.message;
      this.getLibros();
    } catch (error: any) {
      this.messageErr = error.error.message;
    }
    console.log(libro)
  }

  editar(i: any) {
    var libro: any = this.libros[i];
    sessionStorage.setItem('id', libro.id_producto);
    this.route.navigate(["libroEdit"]);
  }

  cerrarAlert1() {
    this.messageOk = null;
  }

  cerrarAlert2() {
    this.messageErr = null;
  }
}