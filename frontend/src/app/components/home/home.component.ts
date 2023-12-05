import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

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
  }];

  constructor(private rest: RestService, private route: Router) { }

  ngOnInit(): void {
    this.getLibros();
  }

  async getLibros() {
    try {
      var res = await this.rest.GetRequest('home').toPromise();
      this.libros = res.productos;
    } catch (error: any) {
      console.error(error);
    }
  }

  async agregarAlCarrito(libro: any) {
    try {
      // Lógica para agregar al carrito
      // ...

      // Redirigir a la vista de home
      this.route.navigate(['home']);
    } catch (error: any) {
      console.error(error);
    }
  }

  cerrarAlert1() {
    this.messageOk = null;
  }

  cerrarAlert2() {
    this.messageErr = null;
  }
}
