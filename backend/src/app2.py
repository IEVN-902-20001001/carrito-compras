from flask import Flask, request, json, jsonify, session
from flask_cors import CORS
from flask_mysqldb import MySQL
from config import config
import MySQLdb.cursors
import MySQLdb.cursors,re, hashlib

app = Flask(__name__)
CORS(app)

con=MySQL(app)

@app.route('/home', methods=['GET'])
def listar_productos_cliente():
    try:
        cursor=con.connection.cursor()
        sql='select * from productos'
        cursor.execute(sql)
        datos=cursor.fetchall()
        productos=[]
        for fila in datos:
            #print(fila)
            producto={'id_producto':fila[0],'imagen_producto':fila[1],'nombre_producto':fila[2], 
                      'descripcion_producto':fila[3], 'autor_producto': fila[4],'ano_producto':fila[5],
                      'precio_producto':fila[6], 'stock_producto':fila[7], 'estatus_producto':fila[8]}
            productos.append(producto)
        print(len(productos))
        print(type(productos))
        return jsonify({'productos':productos, 'mensaje':'Lista de Productos','exito':True})


    except Exception as ex:
        return jsonify({'mensaje': 'error {}'.format(ex), 'exito':False})
    
    
@app.route('/listarProductos/<id_producto>',methods=['GET'])
def listar_productos(id_producto):
    try:
        cursor=con.connection.cursor()
        sql='select * from productos WHERE id_producto={0}'.format(id_producto)
        cursor.execute(sql)
        datos=cursor.fetchall()
        print(datos)
        producto={'id_producto':datos[0],'imagen_producto':datos[1],'nombre_producto':datos[2],
                      'descripcion_producto':datos[3],'autor_producto':datos[4],'ano_producto':datos[5],
                      'precio_producto':datos[6],'stock_producto':datos[7],'estatus_producto':datos[8]}
        print(len(producto))
        print(type(producto))
        return jsonify({'producto':producto, 'mensaje':'Productos','exito':True})
    except Exception as ex:
        return jsonify({'mensaje':'error{}.format(ex)','exito':False})
    
@app.route('/registrar_producto',methods=['POST'])
def registrar_producto():
    try:
        producto = leer_producto_db(request.json['id_producto'])

        if producto != None:
            return jsonify({'mensaje': 'Producto ya existe', 'exito':False})
        else:
            cursor=con.connection.cursor()
            sql="""INSERT INTO productos(id_producto,imagen_producto,nombre_producto,descripcion_producto,autor_producto,ano_producto,precio_producto,
            stock_producto,estatus_producto) 
            VALUES({0},'{1}','{2}','{3}','{4}',{5},{6},{7},{8})""".format(request.json['id_producto'],request.json['imagen_producto'],
            request.json['nombre_producto'],request.json['descripcion_producto'],request.json['autor_producto'],request.json['ano_producto'],request.json['precio_producto'],
            request.json['stock_producto'], request.json['estatus_producto'])
            print(sql)
            cursor.execute(sql)
            con.connection.commit()
        return jsonify({'mensaje':'Producto agregado con éxito','exito':True})


    except Exception as ex:
        return jsonify({'mensaje': 'error {}'.format(ex), 'exito':False})
    
def leer_producto_db(id_producto):
    try:
        cursor=con.connection.cursor()
        sql='select * from productos where id_producto= {0}'.format(id_producto)
        cursor.execute(sql)
        datos=cursor.fetchone()
        if datos != None:
            producto={'id_producto':datos[0],'imagen_producto':datos[1],'nombre_producto':datos[2],'descripcion_producto':datos[3],
                    'autor_producto':datos[4],'ano_producto':datos[5],'precio_producto':datos[6],'stock_producto':datos[7],'estatus_producto':datos[8]}
            return producto
        else:
            return None


    except Exception as ex:
        return ex
    
@app.route('/eliminarProducto', methods=['POST'])
def eliminar_producto():
    try:
        producto = leer_producto_db(request.json['id_producto'])

        if producto == None:
            return jsonify({'mensaje': 'Producto no existe', 'exito':False})
        else:
            cursor=con.connection.cursor()
            sql="""DELETE FROM productos WHERE id_producto = {0}""".format(request.json['id_producto'])
            cursor.execute(sql)
            con.connection.commit()
        return jsonify({'mensaje':'Producto agregado con éxito','exito':True})

    except Exception as ex:
        return ex

    
@app.route('/editarProducto', methods=['POST'])
def editar_producto():
    try:
        producto_id = request.json['id_producto']
        producto = leer_producto_db(producto_id)

        if producto is None:
            return jsonify({'mensaje': 'El producto no existe', 'exito': False})

        # Actualiza los campos del producto con los nuevos valores
        for key in request.json:
            if key != 'id_producto':
                producto[key] = request.json[key]

        cursor = con.connection.cursor()
        # Utiliza una consulta preparada para actualizar los datos del producto
        sql = """
            UPDATE productos 
            SET  imagen_producto='{1}',nombre_producto='{2}',descripcion_producto='{3}',
            autor_producto='{4}',ano_producto={5},precio_producto={6},
            stock_producto={7},estatus_producto={8}
            WHERE id_producto={0}
        """.format(
            producto['id_producto'], producto['imagen_producto'],
            producto['nombre_producto'], producto['descripcion_producto'],
            producto['autor_producto'], producto['ano_producto'],
            producto['precio_producto'], producto['stock_producto'],
            producto['estatus_producto']
        )
        cursor.execute(sql)
        con.connection.commit()
        
        return jsonify({'mensaje': 'Producto modificado con éxito', 'exito': True})

    except Exception as ex:
        return jsonify({'mensaje': 'Error: {}'.format(ex), 'exito': False})

    
    
@app.route('/iniciar_sesion',methods=['POST'])
def iniciar_sesion():
    try:
        print(request.json)
        usuario  = leer_usuario(request.json['nombre_usuario'],request.json['contrasena_usuario'])
        print(usuario)

        if usuario != None:
            return jsonify({'usuario':usuario,'mensaje':'Iniciaste sesión', 'exito':True})
        else:
            return jsonify ({'mensaje':'El usuario no existe','exito':False})

    except Exception as ex:
       return jsonify({'mensaje':'error{}'.format(ex),'exito':False})
    
def leer_usuario(nombre_usuario, contrasena_usuario):
    try:
        cursor=con.connection.cursor()
        sql="""select * from usuarios where nombre_usuario= '{0}' AND contrasena_usuario= '{1}'""".format(nombre_usuario, contrasena_usuario)
        print(sql)
        cursor.execute(sql)
        datos=cursor.fetchone()
        print(datos)
        if datos != None:
            usuario={'id_usuario':datos[0],'nombre_usuario':datos[1],'correo_usuario':datos[2],
                     'tipo_usuario':datos[4]}
            return usuario
        else:
            return None
    except Exception as ex:
        print(ex)
        return ex
    
@app.route('/cerrar_sesion', methods=['POST'])
def cerrar_sesion():
    try:
        print(request.json)
        usuario = leer_usuario_bddos(request.json['id_usuario'])
        print(usuario)
        if usuario != None:
            

            return jsonify({'usuario': usuario,'mensaje': 'Cierre de sesión exitoso', 'exito':True})
        else:
            return jsonify({'mensaje':'El usuario ingresado no existe','exito':False})

    except Exception as ex:
        return jsonify({'mensaje': 'error {}'.format(ex), 'exito':False})
    
def leer_usuario_bddos(id_usuario):
    try:
        cursor=con.connection.cursor()
        sql="""select * from usuarios where id_usuario= {0}""".format(id_usuario)
        print(sql)
        cursor.execute(sql)
        datos=cursor.fetchone()
        print(datos)
        if datos != None:
            usuario={'id_usuario':datos[0],'nombre_usuario':datos[1],'correo_usuario':datos[2],
                    'tipo_usuario':datos[4]}
            return usuario
        else:
            return None

    except Exception as ex:
        print(ex)
        return ex
    
@app.route('/registrar_usuario',methods=['POST'])
def registrar_usuario():
    try:
        usuario = leer_usuario_tres(request.json['nombre_usuario'])
        if usuario!=None:
            return jsonify({'mensaje':'Este usuario ya existe', 'exito':False})
        else:
            cursor=con.connection.cursor()
            sql="""INSERT INTO usuarios(id_usuario,nombre_usuario,correo_usuario,contrasena_usuario,tipo_usuario) VALUES({0},'{1}','{2}','{3}',2)""".format(request.json['id_usuario'],request.json['nombre_usuario'],request.json['correo_usuario'],request.json['contrasena_usuario'],request.json['tipo_usuario'])
            print(sql)
            cursor.execute(sql)
            con.connection.commit()
            return jsonify({'mensaje':'Usuario registradi','exito':True})
    except Exception as ex:
        return jsonify({'mensaje':'error{}'.format(ex),'exito':False})
    
def leer_usuario_tres(nombre_usuario):
    try:
        cursor=con.connection.cursor()
        sql="""select * from usuarios where nombre_usuario = '{0}'""".format(nombre_usuario)
        print(sql)
        cursor.execute(sql)
        datos=cursor.fetchone()
        print(datos)
        if datos != None:
            usuario={'id_usuario':datos[0],'nombre_usuario':datos[1],'correo_usuario':datos[2],'tipo_usuario':datos[4]}
            return usuario
        else:
            return None
    except Exception as ex:
        print(ex)
        return ex
    
if __name__ == "__main__":
    app.config.from_object(config['development'])
    app.run(debug=True)



        



    
        
    
            

