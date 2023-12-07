import React, { useState, useEffect } from 'react';
import Global from "../Global";
import firebase from 'firebase/compat/app';  // Use 'compat' to enable compatibility mode
import 'firebase/compat/messaging';  // Use 'compat' for messaging as well


const Publicaciones = () => {
  const [busqueda, setBusqueda] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);
  const [idusuario, setIdusuario] = useState(null);

  const [siguiendo, setSiguiendo] = useState(false); // Nuevo estado para indicar si se está siguiendo al usuario
  const [mostrarSeguirModal, setMostrarSeguirModal] = useState(false);
  const [texto, setTexto] = useState("");

  const enviarToken = async (idusuario,token) => {
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 14,
          idusuario: idusuario,
          x1: token,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson !== null && responseJson.respuesta === "ok") {
            console.log("token guardado")
          } else {
            console.error('Error al realizar la comentario:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error de red:', error);
    };
  };

  useEffect(() => {

    // Inicialización de Firebase y registro del Service Worker de Firebase
    const initializeFirebase = async (idusuario) => {
      try {
        console.log("Intentar notificaciones");

        // Configuración de Firebase
        var firebaseConfig = {
          apiKey: "AIzaSyCBx-mjBIk9TK2EAqoHsVNT-YE5zN56Qtk",
          authDomain: "pasteleria-a7b68.firebaseapp.com",
          projectId: "pasteleria-a7b68",
          storageBucket: "pasteleria-a7b68.appspot.com",
          messagingSenderId: "165904097594",
          appId: "1:165904097594:web:47636e887caeea12d63003",
          measurementId: "G-SFL0FSPGL9"
        };

        // Inicializar Firebase
        await firebase.initializeApp(firebaseConfig);
        const messaging = firebase.messaging();

        // Solicitar permisos de notificación
        await Notification.requestPermission();
        const token = await messaging.getToken();
        console.log('Token FCM:', token);

        enviarToken(idusuario,token)
        // Guardar el token en tu servidor si es necesario
      } catch (error) {
        console.error('Error al inicializar Firebase:', error);
      }
    };

   
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    setIdusuario(usuario.idusuario);

    initializeFirebase(usuario.idusuario);
    
    // Intentar obtener publicaciones desde localStorage
    const publicacionesGuardadas = JSON.parse(localStorage.getItem('publicaciones'));

    if (navigator.onLine) {
      // Si no hay publicaciones guardadas, obtenerlas de la API
      obtenerPublicaciones(usuario.idusuario);
      
    } else if (publicacionesGuardadas) {
      console.log("No hay conexion a internet desde publiciones")
      console.log("puiblicaciones guardadas en local: " , publicacionesGuardadas)
      setPublicaciones(publicacionesGuardadas);
    }

  }, []);

  const handleAbrirSeguirMenu = (idseguido) => {
    console.log("verificarSeguimiento : idusuario ",idusuario ,"  idseguido ",idseguido)
    if (idusuario === idseguido){
      return;
    }
    // Actualizar el estado para mostrar el modal específico para esta publicación
    setMostrarSeguirModal((prevState) => ({
      ...prevState,
      [idseguido]: true,
    }));
    // Verificar el estado de seguimiento al abrir el menú
    verificarSeguimiento(idseguido);
  };

  const obtenerPublicaciones = (idusuario) => {
    // Hacer la solicitud a la API
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 3,
          idusuario: idusuario,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("publicacion obtenidas desde internet API",responseJson.publicaciones)
          if (responseJson !== null && responseJson.respuesta === "ok") {
            // Guardar las publicaciones en localStorage
            localStorage.setItem('publicaciones', JSON.stringify(responseJson.publicaciones));
            setPublicaciones(responseJson.publicaciones);
          } else {
            console.error('Error al obtener las publicaciones:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  
  const handleReaccionar = async (idpublicacion,tipoReaccion) => {
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 4,
          idusuario: idusuario,
          x1: idpublicacion,
          x2: tipoReaccion,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson !== null && responseJson.respuesta === "ok") {
            obtenerPublicaciones(idusuario);
          } else {
            console.error('Error al realizar la comentario:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error de red:', error);
    };
  };

 const Reacciones = ({ publicacion }) => {
    //console.log("publicacion en reacciones", publicacion)
/*     const [reaccionActual, setReaccionActual] = useState(publicacion.reaccion || 0); */
    let meencantaicono = "fa fa-heart";
    let meencantacolor = "#A9A9A9";
    let megustaicono = "fa fa-heart";
    let megustacolor = "#A9A9A9";
    let nomegustaicono = "fa fa-heart";
    let nomegustacolor = "#A9A9A9";
    
    if (publicacion.reaccion == null) {
      //console.log("null la publicacion", publicacion.idpublicacion  , " con reaccion: " , publicacion.reaccion)
      meencantaicono = "fa fa-heart";
      meencantacolor = "#A9A9A9";
      megustaicono = "fa fa-thumbs-up";
      megustacolor = "#A9A9A9";
      nomegustaicono = "fa fa-thumbs-down";
      nomegustacolor = "#A9A9A9";
    }else{
      switch (publicacion.reaccion) {
        case "0":
          //console.log("caso cero la publicacion", publicacion.idpublicacion)
          meencantaicono = "fa fa-heart";
          meencantacolor = "#A9A9A9";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#A9A9A9";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "1":
          //console.log("caso me encanta la publicacion", publicacion.idpublicacion)
          meencantaicono = "fa fa-heart";
          meencantacolor = "#fc0307";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#A9A9A9";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "2":
          //console.log("caso me gusta la publicacion", publicacion.idpublicacion)
          meencantaicono = "fa fa-heart";
          meencantacolor = "#A9A9A9";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#1165ed";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "3":
          //console.log("caso no me gusta la publicacion", publicacion.idpublicacion)
          meencantaicono = "fa fa-heart";
          meencantacolor = "#A9A9A9";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#A9A9A9";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#FFDE00";
          break;
        default:
          break;
      }
    }

    const reaccionar = async (idpublicacion,tipoReaccion) => {
      handleReaccionar(idpublicacion,tipoReaccion);
    };

    return (
      <div>
        <button className="btn btn-link" onClick={() => reaccionar(publicacion.idpublicacion, 1)}>
          <i className={`fas ${meencantaicono}`} style={{ color: meencantacolor }}></i> {publicacion.meencanta}
        </button>
        <button className="btn btn-link" onClick={() => reaccionar(publicacion.idpublicacion,2)}>
          <i className={`fas ${megustaicono}`} style={{ color: megustacolor }}></i> {publicacion.megusta}
        </button>
        <button className="btn btn-link" onClick={() => reaccionar(publicacion.idpublicacion,3)}>
          <i className={`fas ${nomegustaicono}`} style={{ color: nomegustacolor }}></i> {publicacion.nomegusta}
        </button>
        <button className="btn btn-link" data-toggle="modal" data-target={`#modalComentarios${publicacion.idpublicacion}`}>
          <i className="fa fa-comments"></i> Comentarios {publicacion.comentarios}
        </button>
      </div>
    );
  };

  const handleRegistrarComentario = async(idpublicacion,nuevoComentario) => {
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 6,
          idusuario: idusuario,
          x1: idpublicacion,
          x2: nuevoComentario,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null && responseJson.respuesta === "ok") {
            
          } else {
            console.error('Error al registrar el comentario:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error de red:', error);
    };
  };

  const ComentariosModal = ({ publicacion }) => {
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');

    const obtenerComentarios = () => {
      try {
        fetch(Global.API, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            t_o: 5,
            x1: publicacion.idpublicacion,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
            if (responseJson !== null && responseJson.respuesta === "ok") {
              setComentarios(responseJson.comentarios);
            } else {
              console.error('Error al obtener los comentarios:', responseJson);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error('Error al realizar la solicitud:', error);
      }
    };

    const comentar = async () => {
      await handleRegistrarComentario(publicacion.idpublicacion,nuevoComentario);

      obtenerComentarios();
      setNuevoComentario('');
    };

    useEffect(() => {
      obtenerComentarios();
    }, []);

    return (
      <div className="modal fade" id={`modalComentarios${publicacion.idpublicacion}`} tabIndex="-1" role="dialog" aria-labelledby="modalComentariosLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalComentariosLabel">Comentarios</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <img src={Global.IMAGES + 'publicaciones/' + publicacion.imagen_publicacion} className="card-img-top" alt={`Publicación de ${publicacion.titulo}`} />
            <div className="modal-body">
              {/* Mostrar los comentarios */}
              {comentarios.map((comentario, index) => (
                <div key={index} className="d-flex align-items-start">
                  
                  {comentario.imagen_usuario != null ? (
                    <img src={Global.IMAGES + 'usuarios/' + comentario.imagen_usuario} alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px', marginRight: '10px' }} />
                  ) : (
                    <img src="images/cocinero.png" alt="Foto de Usuario" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px', marginRight: '10px' }} />
                  )}
                  <div>
                    
                    <p>{comentario.nombre_usuario}</p><strong> {comentario.comentario}</strong>
                    <hr />
                  </div>
                </div>
              ))}
              {/* Agregar un nuevo comentario */}
              <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Añadir comentario" value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} />
                <div className="input-group-append">
                  <button className="btn btn-outline-secondary" type="button" onClick={() => comentar ()}>Comentar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Función para verificar el estado de seguimiento al hacer clic en la imagen del usuario
  const verificarSeguimiento = (idseguido) => {
  
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 7,
          x1: idseguido,
          idusuario: idusuario,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null && responseJson.respuesta === "ok") {
            console.log("responseJson ",responseJson)
           
            if(responseJson.estatus == '0'){
              console.log("aun no lo sigues")
              setSiguiendo(false);
              setTexto("");
            }else{
              console.log("Siguiendo")
              setSiguiendo(true);
              setTexto("Siguiendo");
            }

          } else {
            console.error('Error al verificar el estado de seguimiento:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };


 // Función para verificar el estado de seguimiento al hacer clic en la imagen del usuario
 const handleSeguir = (idseguido) => {
  try {
    fetch(Global.API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_o: 8,
        x1: idseguido,
        idusuario: idusuario,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null && responseJson.respuesta === "ok") {
          /* obtenerPublicaciones(idusuario); */

          console.log("respuesta de api notifcacion seguimiento : ",responseJson)
          if(responseJson.estatus == '0'){
            console.log("ahora ya no lo sigues")
            setSiguiendo(false);
            setTexto("");
            // Actualizar el estado del modal para cerrarlo
            setMostrarSeguirModal((prevState) => ({
              ...prevState,
              [idseguido]: true,
            }));
          }else{
            console.log("ahora ya lo sigues")
            setSiguiendo(true);
            setTexto("Siguiendo");
            // Actualizar el estado del modal para cerrarlo
            setMostrarSeguirModal((prevState) => ({
              ...prevState,
              [idseguido]: true,
            }));
          }

          
        } else {
          console.error('Error al seguir/dejar de seguir:', responseJson);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};

 

  return (
    <div className="container mt-5">
      <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por título o nombre de usuario"
        aria-label="Buscar"
        aria-describedby="basic-addon2"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
    </div>

      {publicaciones.filter((publicacion) => {
      // Filtrar por título o nombre de usuario
      return (
        publicacion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        publicacion.nombre_completo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }).map((publicacion) => (
        <div className="card mb-4" key={publicacion.idpublicacion}>
          <div className="card-header d-flex justify-content-between align-items-center">
            <div style={{ width: '70%' }}>
              <h5 className="card-title">{publicacion.titulo}</h5>
              
            </div>
            
            <div className="d-flex align-items-center">
              <p className="card-subtitle text-muted">{publicacion.nombre_completo.split(' ')[0]}</p>
              {publicacion.imagen_perfil != null ? (
                <img src={Global.IMAGES + 'usuarios/' + publicacion.imagen_perfil} alt="Foto de Usuario" style={{ cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} 
                onClick={() => handleAbrirSeguirMenu(publicacion.idusuario)}
                data-toggle="modal"
                  data-target={`#modalSeguir${publicacion.idusuario}`}
                                />
                              ) : (
                                <img src="images/cocinero.png" alt="Foto de Usuario" style={{ cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} 
                                onClick={() => handleAbrirSeguirMenu(publicacion.idusuario)}
                                data-toggle="modal"
                  data-target={`#modalSeguir${publicacion.idusuario}`}
                                />
                              )}
                {mostrarSeguirModal[publicacion.idusuario] && (
                  <div className="modal fade" id={`modalSeguir${publicacion.idusuario}`} tabIndex="-1" role="dialog" aria-labelledby={`modalSeguirLabel${publicacion.idusuario}`} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id={`modalSeguirLabel${publicacion.idusuario}`}>Seguimiento de usuarios</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {/* Contenido del modal (botones seguir/dejar de seguir) */}
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {publicacion.imagen_perfil != null ? (
                              <img src={Global.IMAGES + 'usuarios/' + publicacion.imagen_perfil} alt="Foto de Usuario" style={{ marginBottom: '10px', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                            ) : (
                              <img src="images/cocinero.png" alt="Foto de Usuario" style={{ marginBottom: '10px', cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} />
                            )}
                            <h4 style={{ color: 'black', marginLeft: '10px' }}>{publicacion.nombre_completo}</h4>
                            <h5 style={{ color: 'green', marginLeft: '10px' }}>{texto}</h5>
                          </div>

                          {siguiendo ? (
                            <button className="btn btn-primary" onClick={() => handleSeguir(publicacion.idusuario)}>
                              Dejar de seguir
                            </button>
                          ) : (
                            <button className="btn btn-primary" onClick={() => handleSeguir(publicacion.idusuario)}>
                              Seguir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
          <img src={Global.IMAGES + 'publicaciones/' + publicacion.imagen_publicacion} className="card-img-top" alt={`Publicación de ${publicacion.titulo}`} 
          style={{ maxWidth: '50%', maxHeight: '500px', height: 'auto',alignSelf:'center' }}/>
          <div className="card-body">
            <p className="card-text">{publicacion.descripcion}</p>
            <Reacciones publicacion={publicacion} />
          </div>
          {/* Modal de Comentarios */}
          <ComentariosModal publicacion={publicacion} />
        </div>
      ))}
    </div>
  );
};

export default Publicaciones;
