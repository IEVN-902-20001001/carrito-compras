import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-crear-libro',
  templateUrl: './crear-libro.component.html',
  styleUrls: ['./crear-libro.component.css']
})
export class CrearLibroComponent implements OnInit {

  no_disponible = "https://dynamicmediainstitute.org/wp-content/themes/dynamic-media-institute/imagery/default-book.png";
  imagen: any = null;

  libro = {
    id_producto: 0,
    imagen_producto: "",
    nombre_producto: "",
    descripcion_producto: "",
    autor_producto: "",
    ano_producto: 0,
    precio_producto: 0,
    stock_producto: 0,
    estatus_producto:0
  };

  messageOk = null;
  messageErr = null;

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
  }

  uploadImagen(link: string) {
    this.imagen = link; // Almacena el enlace proporcionado por el usuario
  }
  

  async agregar() {
    // obtener imagen
    this.libro.imagen_producto = this.imagen;
    
    // mostrar datos
    console.log(this.libro.id_producto)
    console.log(this.libro.imagen_producto)
    console.log(this.libro.nombre_producto)
    console.log(this.libro.descripcion_producto)
    console.log(this.libro.autor_producto)
    console.log(this.libro.ano_producto)
    console.log(this.libro.precio_producto)
    console.log(this.libro.stock_producto)
    console.log(this.libro.estatus_producto)

    try {
  
      var res = await this.rest.PostRequest("registrar_producto", this.libro).toPromise();
      console.log(res);
      this.libro.id_producto = 0;
      this.libro.imagen_producto = "";
      this.libro.nombre_producto = "";
      this.libro.descripcion_producto = "";
      this.libro.autor_producto = "";
      this.libro.ano_producto = 0;
      this.libro.precio_producto = 0;
      this.libro.stock_producto = 0;
      this.libro.estatus_producto = 0;
      this.messageOk = res.message;

      // Luego de actualizar, redirige al usuario a la vista de "libros"
      this.route.navigate(["libros"]);

    } catch(error: any) {
      this.messageErr = error.error.message
    }
  }

  cancelar() {
    this.route.navigate(["libros"])
  }

  cerrarAlert1() {
    this.messageOk = null;
  }

  cerrarAlert2() {
    this.messageErr = null;
  }
}