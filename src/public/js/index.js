var xhr = new wrapperXml();
var btn = [];
var k= 0;
const sel = [];
var flag = false;
var productos = [];
var carro;
var montoT = 0;
var idUser;


verificar();

function $(id){
    return document.getElementById(id);
}

function create(id){
    return document.createElement(id);
}

function verificar(){
    xhr.get('/value',null, function(data){
        console.log(data.status);
        if(data.session){
            console.log(data.session);
            console.log("IdUser: "+data.id);
            flag = true;
            idUser = data.session.user.id_usuario;
            $('LogReg').style.display = "none";
            $('logout').style.display = "block";
            //location.reload();
        }
        iniciar();
    });
}

function login(){
    var email = $('email').value;
    console.log("Email: " + email);
    var contrasena = $('password').value;
    console.log("Contraseña: " + contrasena);

    var json;

    if(email == "" || contrasena == ""){
        alert("Llene todos los campos");
        location.reload();
    }else{
        json = {
            "username": email.trim(),
            "password": contrasena.trim()
        }
    
        console.log(json);
        xhr.post('/login', json, function(data){
            if(data.status == "200"){
                alert("Inicio de Sesion Exitoso");
                //document.location.href="/views/perfil.ejs";
                var reg = $('register');
                reg.style.display="none";

                var lin = $('LogIn');
                lin.style.display="none";

                carro = $('carrito');
                carro.style.display="block";
                $('logout').style.display = "block";
                flag = true;
                verificar();
            }else{
                alert("Error al iniciar sesion");
                //location.reload();
            }
        });

        /*var reg = $('register');
        reg.style.display="none";

        var lin = $('LogIn');
        lin.style.display="none";

        var carro = $('carrito');
        carro.style.display="block";*/
    }
}

function register(){
    var reg = $('register');
    var json;
    var name = $('name').value;
    var email = $('emailr').value;
    var pass = $('passwordr').value;
    var pass2 = $('password2').value;

    if(pass != pass2){
        alert("Las contraseñas deben coincidir");
        $('passwordr').value="";
        $('password2').value="";
    }else if(name=="" || email=="" || pass=="" || pass2==""){
        alert("Debe Llenar todos los campos");
    }else{
        json={
            "name" : name.trim(),
            "email": email.trim(),
            "passwordR": pass.trim()
        }
        console.log(json);
    }

    xhr.post('/signup', json, function(data){
        if(data.status == "200"){
            alert("Usuario registrado");
            console.log(data);
            reg.style.display="none";
        }else{
            alert("Error al Registrar");
            console.log(data);
            //location.reload();
        }
    });
}

function perfil(){
    document.location.href="/perfil";
}

function iniciar(){
    var catalago = [];
    $('comprar').style.display = "none";
    $('ctlg').innerHTML = "";
    $('home').style.display = "none";
    xhr.get('/consultaProd', null, function(data){
        var Tbody = create('tbody');
        productos = data.data;
        console.log(productos);
        console.log(data);
        console.log("Tamaño: " + data.data.length);
        var ctlghead = document.createElement('tr');
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
            //Aplicar otra forma   
            celda.innerHTML ="<button onclick='add("+data.data[i].id_prod+")'>Add</button>";
            hilera.appendChild(celda);

            Tbody.appendChild(hilera);
        }
        $('ctlg').appendChild(ctlghead);
        $('ctlg').appendChild(Tbody);
        $('ctlg').setAttribute("border", "3");
    })
}

function add(id){
    var tmñ=0;
    if(flag ){
        for(let l=0; l < sel.length; l++){
            if(sel[l] == id){
                tmñ++;
            }
        }
        console.log("Tamaño: " + tmñ);
        for(var i = 0; i < productos.length; i++){
            if(productos[i].id_prod == id && productos[i].cantidad_prod > 0 && tmñ <productos[i].cantidad_prod){
                $('prod').innerHTML += productos[i].nombre_prod + "</br>";
                sel[k] = id;
                k++;
            }
        }
        console.log(sel);
    }else{
        alert("Debe iniciar Sesion");
    }
}

function carrito(){
    console.log(sel);
   // document.location.href="/carrito";
    $('home').style.display = "block";
    $('ctlg').innerHTML = "";
    $('comprar').style.display = "block";
    var Tbody = create('tbody');
    var ctlghead = document.createElement('tr');
    ctlghead.innerHTML += '<th>'+"PRECIO"+'</th>';
    ctlghead.innerHTML += '<th>'+"DESCRIPCION"+'</th>';
    ctlghead.innerHTML += '<th>'+"NOMBRE"+'</th>';
    ctlghead.innerHTML += '<th>'+"DISPONIBLE"+'</th>';

    let nombre, descripcion, precio, cantidad;
    for(var i = 0; i < sel.length; i++){
        for(let j = 0; j < productos.length; j ++){
            if(sel[i] == productos[j].id_prod){
                nombre = productos[j].nombre_prod;
                descripcion = productos[j].descripcion_prod;
                precio = productos[j].precio_prod;
                cantidad = productos[j].cantidad_prod;
            }
        }

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
        var textocelda = document.createTextNode(cantidad);
        celda.appendChild(textocelda);
        hilera.appendChild(celda);

        var celda = create('td');            
        celda.innerHTML ="<button onclick='dlt("+sel[i]+")'>Eliminar</button>";
        hilera.appendChild(celda);

        Tbody.appendChild(hilera);
    }
    $('ctlg').appendChild(ctlghead);
    $('ctlg').appendChild(Tbody);
    $('ctlg').setAttribute("border", "3");
}

function seleccionados(){
    console.log(sel);
    this.retorna = sel;
}
function dlt(id){
    let index;
    for(let i = 0; i < sel.length; i++){
        console.log("I: " + i);
        console.log("comp: " + sel[i] + ", " + id);
        if(sel[i] == id){
            console.log("index: " + i);
            sel.splice(i, 1);
            console.log(sel);
            break;
        }
    }

    $('prod').innerHTML ="";
    for(let k =0; k < sel.length; k++){
        for(let j=0; j<productos.length; j++){
            if(sel[k] == productos[j].id_prod){
                $('prod').innerHTML +=  productos[j].nombre_prod + "</br>";
            }
        }
    }
  
    carrito();
}

function LogReg(){
    $('LogIn').style.display = "block";
    $('register').style.display = "block";
    $('LogReg').style.display = "none";
}

function comprar(){
    $('monto').style.display="block";
    $('comprar').style.display = "none";
    $('aceptar').style.display = "block";

    for(let i = 0; i < sel.length; i++){
        for(let j = 0; j < productos.length; j++){
            if(sel[i] == productos[j].id_prod){
                montoT += parseInt(productos[j].precio_prod);
            }
        }
    }
    $('monto').innerHTML += " " + montoT + "$";
}

function compra(){
    
    var json = {
        idU: idUser,
        monto: montoT,
        tam: sel.length,
        prod: sel
    }
    console.log(json);
    xhr.post('/compra', json, function(data){
        if(data.status != "200"){
            alert("Error al comprar");
            console.log(data);
        }else{
            alert("Compra Realizada");
            console.log(data);
            //location.reload();
        }
    });
    for(let i = 0; i < sel.length; i++){
        let id = sel[i], n, d, p, c;
        for(let j = 0; j < productos.length; j++){
            if(sel[i] == productos[j].id_prod){
                n = productos[j].nombre_prod;
                d = productos[j].descripcion_prod;
                p = productos[j].precio_prod;
                c = productos[j].cantidad_prod-1;
                productos[j].cantidad_prod--;
                break;
            }
        }
        var jsonU = {
            id: id,
            nombre: n,
            descripcion: d,
            precio: p,
            cantidad: c
        }

        console.log(json);
        xhr.post('/UpdateProd', jsonU, function(data){
            if(data.status == "200"){
                console.log(data);
            }else{
                alert("Error");
                console.log(data);
                //location.reload();
            }
        });
    }
    location.reload();
}

function buscar(){
    let name = $('buscar').value;
    console.log(name);
    var json = {
        name: name
    }
    xhr.post('/buscar', json, function(data){
        if(data.status != "200"){
            alert("Error al buscar");
            console.log(data);
        }else{
            console.log(data);
            $('ctlg').innerHTML = "";
            var Tbody = create('tbody');
            var ctlghead = document.createElement('tr');
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
                celda.innerHTML ="<button onclick='add("+data.data[i].id_prod+")'>Add</button>";
                hilera.appendChild(celda);
    
                Tbody.appendChild(hilera);
            }
            $('ctlg').appendChild(ctlghead);
            $('ctlg').appendChild(Tbody);
            $('ctlg').setAttribute("border", "3");
            //location.reload();
        }
    });
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