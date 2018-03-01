//import { json } from "../../../../../Users/AnangelaJ/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/express";

var productos = [];
var xhr = new wrapperXml();
var idU;

verificar();

function verificar(){
    console.log("VERIFICAR");
    xhr.get('/value',null, function(data){
        if(data.session){
            console.log(data.session);
            idU = data.session.user.id_usuario;
            $('logout').style.display = "block";
            prod();
        }else{
            alert("Debe Iniciar Sesion");
            document.location.href ="/";
        }
    });
}

function $(id){
    return document.getElementById(id);
}

function create(id){
    return document.createElement(id);
}

function prod(){
    xhr.get('/consultaProd', null, function(data){
        if(data.status == 200){
            productos = data.data;
            console.log(productos[0].precio_prod);
            iniciar();
        }else{
            alert("Catalago Vacio");
        }

    });
}

function iniciar(){
    var catalago = [];
    var json = {
        idUser: idU
    }
    xhr.post('/consultaCarrito', json, function(data){
        if(data.status == 200 && data.data.length > 0){
            console.log("ENTRO");
            catalago = data.data;
            console.log("Tamaño: "+catalago.length);
            var ctlghead = create('tr');
            ctlghead.innerHTML += '<th>'+"PRECIO"+'</th>';
            ctlghead.innerHTML += '<th>'+"DESCRIPCION"+'</th>';
            ctlghead.innerHTML += '<th>'+"NOMBRE"+'</th>';
            ctlghead.innerHTML += '<th>'+"COMPRA"+'</th>';
            $('ctlg').appendChild(ctlghead);
            for(let i = 0; i < catalago.length;  i++){
                for(let j = 0; j < productos.length; j++){
                    let idCompra = catalago[i].id_compra;
                    let precio = productos[j].precio_prod;
                    let nombre = productos[j].nombre_prod;
                    let descripcion = productos[j].descripcion_prod;
                    if(catalago[i].id_prod == productos[j].id_prod){
                            var Tbody = create('tbody');
                            var hilera = create('tr');
                            var celda = create('td');
                            var textocelda = document.createTextNode(precio + "$");
                            celda.appendChild(textocelda);
                            hilera.appendChild(celda);

                            var celda = create('td');
                            var textocelda = document.createTextNode(descripcion);
                            celda.appendChild(textocelda);
                            hilera.appendChild(celda);

                            var celda = create('td');
                            var textocelda = document.createTextNode(nombre);
                            celda.appendChild(textocelda);
                            hilera.appendChild(celda);

                            var celda = create('td');
                            var textocelda = document.createTextNode(idCompra);
                            celda.appendChild(textocelda);
                            hilera.appendChild(celda);

                            Tbody.appendChild(hilera);
                        $('ctlg').appendChild(Tbody);
                    }
                }
            }
        }else{
            alert("Usted no tiene carritos activos");
        }
        

    });
};

function logout(){
    xhr.get('/logout', null, function(data){
        if(data.status == 200){
            alert(data.msg);
            location.reload();
        }else{
            alert("Error al cerrar sesion");
        }
    });
}

function inicio(){
    document.location.href = "/";
}

function perfil(){
    document.location.href="/perfil";
}