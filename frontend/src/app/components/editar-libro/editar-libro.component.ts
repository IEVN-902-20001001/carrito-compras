import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/service/rest.service';

@Component({
  selector: 'app-editar-libro',
  templateUrl: './editar-libro.component.html',
  styleUrls: ['./editar-libro.component.css']
})
export class EditarLibroComponent implements OnInit {

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
    this.cargarLibro();
  }

  async cargarLibro() {
    try {
      var id = sessionStorage.getItem('id');
      console.log(id)
      var res = await this.rest.GetRequest('listarProductos/' + id).toPromise();
      console.log(res)
  
      if (res && res.producto) {
        this.libro.id_producto = res.producto.id_producto;
        this.libro.imagen_producto = res.producto.imagen_producto;
        this.libro.nombre_producto = res.producto.nombre_producto;
        this.libro.descripcion_producto = res.producto.descripcion_producto;
        this.libro.autor_producto = res.producto.artista_producto;
        this.libro.ano_producto = res.producto.ano_producto;
        this.libro.precio_producto = res.producto.precio_producto;
        this.libro.stock_producto = res.producto.stock_producto;
        this.libro.estatus_producto = res.producto.estatus_producto;
        this.imagen = this.libro.imagen_producto;
      } else {
        console.error('No se recibieron datos del producto.');
        // Puedes agregar lógica adicional aquí según tus necesidades.
      }
    } catch (error) {
      console.error('Error al cargar el producto:', error);
      // Puedes agregar lógica adicional aquí según tus necesidades.
    }
  }

  async actualizar() {
    try {
      // Asigna la URL de la imagen al campo correspondiente en el objeto this.libro
      this.libro.imagen_producto = this.imagen;
      
      var res = await this.rest.PostRequest('/editarProducto', this.libro).toPromise();
      this.messageOk = res.message;

      // Luego de actualizar, redirige al usuario a la vista de "libros"
      this.route.navigate(["libros"]);
    } catch (error: any) {
      this.messageErr = error.error.message;
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