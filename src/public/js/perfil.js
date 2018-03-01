var productos = [];
var xhr = new wrapperXml();
var idU;

//iniciar();
verificar();

function verificar(){
    console.log("VERIFICAR");
    xhr.get('/value',null, function(data){
        if(data.session){
            console.log(data.session);
            idU = data.session.user.id_usuario;
            $('logout').style.display = "block";
            iniciar();
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

function iniciar(){
    var catalago = [];
    xhr.get('/consultaProd', null, function(data){
        var Tbody = create('tbody');
        productos = data.data;
        console.log(productos);
        console.log(data);
        console.log("Tamaño: " + data.data.length);
        var ctlghead = create('tr');
        ctlghead.innerHTML += '<th>'+"PRECIO"+'</th>';
        ctlghead.innerHTML += '<th>'+"DESCRIPCION"+'</th>';
        ctlghead.innerHTML += '<th>'+"NOMBRE"+'</th>';
        ctlghead.innerHTML += '<th>'+"DISPONIBLE"+'</th>';

        for(var i = 0; i < data.data.length; i++){

            var hilera = create('tr');
            var celda = create('td');
            var textocelda = document.createTextNode(data.data[i].precio_prod + "$");
            celda.appendChild(textocelda);
            hilera.appendChild(celda);

            var celda = create('td');
            var textocelda = document.createTextNode(data.data[i].descripcion_prod);
            celda.appendChild(textocelda);
            hilera.appendChild(celda);

            var celda = create('td');
            var textocelda = document.createTextNode(data.data[i].nombre_prod);
            celda.appendChild(textocelda);
            hilera.appendChild(celda);

            var celda = create('td');
            var textocelda = document.createTextNode(data.data[i].cantidad_prod);
            celda.appendChild(textocelda);
            hilera.appendChild(celda);

           var celda = create('td');
            console.log(productos[i].id_prod);
            //celda.innerHTML ="<button onclick='seleccionar("+productos[i].id_prod+")'>Seleccionar</button>";
            celda.innerHTML = "<li><a onclick = 'add("+productos[i].id_prod+")'>Update</a></li>"
            hilera.appendChild(celda);

            var celda = create('td');
            console.log(productos[i].id_prod);
            //celda.innerHTML ="<button onclick='seleccionar("+productos[i].id_prod+")'>Seleccionar</button>";
            celda.innerHTML = "<li><a onclick = 'dlt("+productos[i].id_prod+")'>Delete</a></li>"
            hilera.appendChild(celda);

            Tbody.appendChild(hilera);
        }
        $('ctlg').appendChild(ctlghead);
        $('ctlg').appendChild(Tbody);
        //$('ctlg').setAttribute("border", "3");
    });
};

function seleccionar(id){
        console.log(id);
        $('cuadro').style.display ="block";
        $('botones').style.display ="block";
        let name, desc, precio, disp;

        for(let i = 0; i < productos.length; i++){
            if(productos[i].id_prod == id){
                $('id').value = id;
                $('nombre').value = productos[i].nombre_prod;
                $('descripcion').value = productos[i].descripcion_prod;
                $('precio').value = productos[i].precio_prod;
                $('cantidad').value = productos[i].cantidad_prod;
            }
        }
};


function add(id){
    console.log(id);
    $('cuadro').style.display ="block";
    $('botones').style.display ="block";
    let name, desc, precio, disp;

    for(let i = 0; i < productos.length; i++){
        if(productos[i].id_prod == id){
            $('id').value = id;
            $('nombre').value = productos[i].nombre_prod;
            $('descripcion').value = productos[i].descripcion_prod;
            $('precio').value = productos[i].precio_prod;
            $('cantidad').value = productos[i].cantidad_prod;
        }
    }
}


function send(){
    let n = $('nombre').value.trim();
    console.log("nombre:" + n);
    var json = {
        id: $('id').value.trim(),
        nombre: $('nombre').value.trim(),
        descripcion: $('descripcion').value.trim(),
        precio: $('precio').value.trim(),
        cantidad: $('cantidad').value.trim()
    }
    console.log(json);
    if($('id').value != ""){
        xhr.post('/UpdateProd', json, function(data){
            if(data.status == "200"){
                alert("Producto Actualizado");
                console.log(data);
                location.reload();
            }else{
                alert("Error al Actualizar");
                console.log(data);
                //location.reload();
            }
        });
    }else if($('id').value == ""){
        console.log("Inserto: " + $('id').value)
        xhr.post('/InsertProd', json, function(data){
            if(data.status == "200"){
                alert("Producto Agregado");
                console.log(data);
                location.reload();
            }else{
                alert("Error al Agregar");
                console.log(data);
                //location.reload();
            }
        });
    }
    /*
    */
}

function dlt(id){
    var json = {
        id: id
    }
    xhr.post('/DeleteProd', json, function(data){
        if(data.status == "200"){
            alert("Producto Eliminado");
            console.log(data);
            location.reload();
        }else{
            alert("Error al Eliminar");
            console.log(data);
            //location.reload();
        }
    });
}

function inicio(){
    document.location.href = "/";
}

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

function car(){
    document.location.href="/carrito";
}