import React, { useState, useEffect } from 'react';
import { useAuth } from "../AuthContext";
import Global from "../Global";
import axios from 'axios';

const Perfil = () => {
  const { usuarioAutenticado,setUsuarioAutenticado } = useAuth();
  const [busqueda, setBusqueda] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);
  const [idusuario, setIdusuario] = useState(null);
  const [usuario, setUsuario] = useState({});

  const [idUsuarioSeguir, setIdUsuarioSeguir] = useState(null);
  const [siguiendo, setSiguiendo] = useState(false); // Nuevo estado para indicar si se está siguiendo al usuario
  const [mostrarSeguirModal, setMostrarSeguirModal] = useState(false);
  const [texto, setTexto] = useState("");

  const [privacidad, setPrivacidad] = useState(null);

  const [mostrarModalEditarPerfil, setMostrarModalEditarPerfil] = useState(false);

  const [imagenTemporal, setImagenTemporal] = useState(null);

  const [imagen, setImagen] = useState(null);

  const [modalAbierto, setModalAbierto] = useState(false);

  const [perfilEditado, setPerfilEditado] = useState({
    nombre_completo: '',
    correo: '',
    nueva_contrasena: '',
    telefono: '',
    imagen_perfil: null, // Puedes inicializarlo con el valor actual del usuario
  });
  
  const [nuevaPublicacion, setNuevaPublicacion] = useState({
    imagen_publicacion: null,
    previewURL: null,
    titulo: '',
    descripcion: '',
    privacidad: '1',
  });
  
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    setIdusuario(usuario.idusuario);
    // Llamar a la API para obtener las publicaciones
    obtenerInformacionUsuario(usuario.idusuario);

    // Intentar obtener publicaciones desde localStorage
    const mispublicacionesGuardadas = JSON.parse(localStorage.getItem('mispublicaciones'));

    if (navigator.onLine) {
      // Si no hay publicaciones guardadas, obtenerlas de la API
      obtenerPublicaciones(usuario.idusuario);
    } else {
      console.log("No hay conexion a internet desde mi perfil")
      if (mispublicacionesGuardadas){
        console.log("mis puiblicaciones guardadas del perfil en local: " , mispublicacionesGuardadas)
        setPublicaciones(mispublicacionesGuardadas);
      }
     
      setPerfilEditado({
        nombre_completo: usuarioAutenticado.nombre_completo,
        correo: usuarioAutenticado.correo,
        nueva_contrasena: '', // Puedes ajustar esto según tu lógica
        telefono: usuarioAutenticado.telefono,
        imagen_perfil: usuarioAutenticado.imagen_perfil || null, // Si la imagen es null, puedes asignar null
      }); 
      
    }

  }, []);

  const handleCerrarModal = () => {
    setImagenTemporal(null);
    setImagen(null);
    setMostrarModalEditarPerfil(false)
  }

  const cerrarModalpublicacion = () => {
    setImagen(null);
    setNuevaPublicacion((prevPublicacion) => ({
      ...prevPublicacion,
      imagen_publicacion: null,
      previewURL: null,
      titulo: '',
      descripcion: '',
      privacidad: '1',
    }));
    setModalAbierto(false)
  }

  const obtenerInformacionUsuario = (idusuario) => {
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 9, 
          idusuario: idusuario,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson !== null && responseJson.respuesta === "ok") {
            console.log(responseJson.usuario)
            setUsuario(responseJson.usuario);
            setUsuarioAutenticado(responseJson.usuario);

            setPerfilEditado({
              nombre_completo: responseJson.usuario.nombre_completo,
              correo: responseJson.usuario.correo,
              nueva_contrasena: '', // Puedes ajustar esto según tu lógica
              telefono: responseJson.usuario.telefono,
              imagen_perfil: responseJson.usuario.imagen_perfil || null, // Si la imagen es null, puedes asignar null
            }); 
          } else {
            console.error('Error al obtener la información del usuario:', responseJson);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  };

  const handleAbrirSeguirMenu = (idpublicacion,privacidad) => {
    console.log("modal abrir : privacidad ",privacidad , " en publicacion: " ,idpublicacion)

    setPrivacidad(privacidad)
    setMostrarSeguirModal((prevState) => ({
      ...prevState,
      [idpublicacion]: true,
    }));

  };

  const obtenerPublicaciones = (idusuario) => {
    try {
      fetch(Global.API, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          t_o: 10,
          idusuario: idusuario,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log("mis publicacion obtenidas en perfil esde internet API",responseJson.publicaciones)
          if (responseJson !== null && responseJson.respuesta === "ok") {
            // Guardar las publicaciones en localStorage
            localStorage.setItem('mispublicaciones', JSON.stringify(responseJson.publicaciones));
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
    let meencantaicono = "fa fa-heart";
    let meencantacolor = "#A9A9A9";
    let megustaicono = "fa fa-heart";
    let megustacolor = "#A9A9A9";
    let nomegustaicono = "fa fa-heart";
    let nomegustacolor = "#A9A9A9";
    
    if (publicacion.reaccion == null) {
      meencantaicono = "fa fa-heart";
      meencantacolor = "#A9A9A9";
      megustaicono = "fa fa-thumbs-up";
      megustacolor = "#A9A9A9";
      nomegustaicono = "fa fa-thumbs-down";
      nomegustacolor = "#A9A9A9";
    }else{
      switch (publicacion.reaccion) {
        case "0":
          meencantaicono = "fa fa-heart";
          meencantacolor = "#A9A9A9";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#A9A9A9";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "1":
          meencantaicono = "fa fa-heart";
          meencantacolor = "#fc0307";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#A9A9A9";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "2":
          meencantaicono = "fa fa-heart";
          meencantacolor = "#A9A9A9";
          megustaicono = "fa fa-thumbs-up";
          megustacolor = "#1165ed";
          nomegustaicono = "fa fa-thumbs-down";
          nomegustacolor = "#A9A9A9";
          break;
        case "3":
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


 const handlePrivacidad = (idpublicacion) => {
  try {
    fetch(Global.API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_o: 11,
        x1: idpublicacion,
        x2: privacidad,
      }),
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null && responseJson.respuesta === "ok") {

            console.log("actualizado a: ", privacidad)
            // Actualizar el estado del modal para cerrarlo
            setMostrarSeguirModal((prevState) => ({
              ...prevState,
              [idpublicacion]: true,
            }));

            obtenerPublicaciones(idusuario);
        } else {
          console.error('Error al actualizar:', responseJson);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};
// Función para manejar la selección de imágenes
const handleImageChange = (event) => {
  const file = event.target.files[0];

  if (file) {
    console.log('Imagen seleccionada:', file);
    setImagen(file)
    if (file.type.startsWith('image/')) {
    
      setPerfilEditado((prevImagen) => ({
        ...prevImagen,
        imagen_perfil: file.name,
      }));
    
      console.log('Vista previa URL:', URL.createObjectURL(file));
    } else {
      console.error('El archivo seleccionado no es una imagen.');
    }
  }
};

// Función para manejar el guardado del perfil
const handleGuardarPerfil = async () => {
  try {
    console.log("perfilEditado: ", perfilEditado)
    // Aquí puedes enviar los datos del perfil al servidor, incluyendo la imagen si es necesario
    const response = await fetch(Global.API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_o: 12, // Puedes ajustar el tipo de operación según tu lógica
        idusuario: idusuario,
        ...perfilEditado,
      }),
    });

    const result = await response.json();

    if (result.respuesta === 'ok') {
      console.log('Perfil actualizado con éxito');
      obtenerInformacionUsuario(idusuario)
      handleCerrarModal()
      setImagen(null)
      // Puedes añadir lógica adicional aquí, como mostrar un mensaje de éxito al usuario
    } else {
      console.error('Error al actualizar el perfil. Detalles:', result);
      // Puedes manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};

const handleSubirImagen = async (tipo) => {
/*   console.log("perfilEditado:",perfilEditado)
  console.log("nuevaPublicacion:",nuevaPublicacion) */
  try {

      if (tipo == 'perfil' && imagen == null){
        handleGuardarPerfil();
      }else{
        const formData = new FormData();
        formData.append('imagen', imagen);
        formData.append('tipo', tipo);

        console.log('formData ', formData)

        const response = await fetch(Global.UPLOAD_IMAGES, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.status === 1) {
            console.log('Imagen subida con éxito');

            if (tipo === 'perfil') {
                        
              handleGuardarPerfil();
            }else if(tipo == 'publicacion'){

              handleGuardarPublicacion()
            }
            // Puedes realizar acciones adicionales si la subida es exitosa
        } else {
            console.error('Error al subir la imagen. Detalles:', result.error);
            // Puedes manejar el error aquí
        }
      }

      
  } catch (error) {
      console.error('Error al realizar la solicitud:', error);
  }
};

// Función para manejar el guardado del perfil
const handleGuardarPublicacion = async () => {
  try {
    console.log("nuevaPublicacion: ", nuevaPublicacion)
    // Aquí puedes enviar los datos del perfil al servidor, incluyendo la imagen si es necesario
    const response = await fetch(Global.API, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        t_o: 13, // Puedes ajustar el tipo de operación según tu lógica
        idusuario: idusuario,
        ...nuevaPublicacion,
      }),
    });

    const result = await response.json();

    if (result.respuesta === 'ok') {
      console.log('publicacion subida correctamente');

      setNuevaPublicacion((prevPublicacion) => ({
        ...prevPublicacion,
        imagen_publicacion: null,
        previewURL: null,
        titulo: '',
        descripcion: '',
        privacidad: '1',
      }));

      obtenerPublicaciones(idusuario)
      setModalAbierto(false);
      setImagen(null)
      // Puedes añadir lógica adicional aquí, como mostrar un mensaje de éxito al usuario
    } else {
      console.error('Error al subir Detalles:', result);
      // Puedes manejar el error aquí, por ejemplo, mostrar un mensaje de error al usuario
    }
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
};


const cambioImagen = (event) => {
  console.log("Evento de cambio disparado");
  const file = event.target.files[0];
  if (file) {

      setNuevaPublicacion((prevPublicacion) => ({
        ...prevPublicacion,
        imagen_publicacion: file.name,
        previewURL: URL.createObjectURL(file),
      }));

      console.log("Si es file");
      setImagen(file)
  } else {
      console.log("No es file");
  }
};

  const imagenPerfil =
    imagen ||
    (usuarioAutenticado.imagen_perfil
      ? Global.IMAGES + 'usuarios/' + usuarioAutenticado.imagen_perfil
      : 'images/cocinero.png');

  return (
    <div className="container mt-5">
      {/* Sección de información del usuario */}
    <div className="d-flex align-items-center">
      <div className="mr-4">
        {usuarioAutenticado.imagen_perfil != null ? (
          <img
            src={Global.IMAGES + 'usuarios/' + usuarioAutenticado.imagen_perfil}
            alt="Foto de Usuario"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        ) : (
          <img
            src='images/cocinero.png'
            alt="Foto de Usuario"
            style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          />
        )}
      </div>

      <div>
        <h2>{usuarioAutenticado.nombre_completo} </h2>
        {usuarioAutenticado.seguidores > 0 && (
          <h3 style={{ color: 'green', marginLeft: '10px' }}> {usuarioAutenticado.seguidores} {usuarioAutenticado.seguidores == 1 ? 'Seguidor' : 'Seguidores'}</h3>
        )}
      </div>
    </div>

    {/* Sección para editar perfil y subir nuevas publicaciones */}
    <div className="d-flex justify-content-between mt-3">
      <button className="btn btn-primary" onClick={() => setMostrarModalEditarPerfil(true)}>
        Editar Perfil
      </button>

      <div className={`modal fade ${mostrarModalEditarPerfil ? 'show d-block' : ''}`} id="modalEditarPerfil" tabIndex="-1" role="dialog" aria-labelledby="modalEditarPerfilLabel" aria-hidden={!mostrarModalEditarPerfil}>
      <div className="modal-dialog modal-dialog-scrollable" role="document">
      <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="modalEditarPerfilLabel">Editar Perfil</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body overflow-auto">
        {/* Formulario para editar perfil */}

        <div className="text-center" style={{ marginBottom: '15px' }}>
        <img
      src={
        typeof imagenPerfil === 'string'
          ? imagenPerfil
          : URL.createObjectURL(imagenPerfil)
      }
      alt="Foto de Usuario"
      style={{ width: '100px', height: '100px', borderRadius: '50%' }}
    />
         <button type="button" className="btn btn-link mt-2" onClick={() => document.getElementById('inputImagenPerfil').click()}>
            <i className="fa fa-camera"></i> Cambiar Imagen
         </button>
         <input
            type="file"
            id="inputImagenPerfil"
            style={{ display: 'none' }}
            onChange={handleImageChange}
         />
      </div>

        <div className="form-group">
          <label htmlFor="nombreCompletoInput">Nombre Completo:</label>
          <input
            type="text"
            className="form-control"
            id="nombreCompletoInput"
            value={perfilEditado.nombre_completo}
            onChange={(e) => setPerfilEditado({ ...perfilEditado, nombre_completo: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefonoInput">Teléfono:</label>
          <input
            type="text"
            className="form-control"
            id="telefonoInput"
            value={perfilEditado.telefono}
            onChange={(e) => setPerfilEditado({ ...perfilEditado, telefono: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="correoInput">Correo:</label>
          <input
            type="email"
            className="form-control"
            id="correoInput"
            value={perfilEditado.correo}
            onChange={(e) => setPerfilEditado({ ...perfilEditado, correo: e.target.value })}
            readOnly // Agregar el atributo readonly aquí
          />
        </div>
       

        <div className="form-group">
          <label htmlFor="contrasenaInput">Nueva Contraseña:</label>
          
          <p >(opcional)</p>
          <input
            type="password"
            className="form-control"
            id="contrasenaInput"
            value={perfilEditado.nueva_contrasena}
            onChange={(e) => setPerfilEditado({ ...perfilEditado, nueva_contrasena: e.target.value })}
          />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => handleCerrarModal()}>Cerrar</button>
        <button type="button" className="btn btn-primary" onClick={() => handleSubirImagen('perfil')}>Guardar</button>
      </div>

      </div>
    </div>

      </div>

      <button className="btn btn-success" onClick={() => setModalAbierto(true)}>
    Nueva Publicación
  </button>


   {/* Modal de Nueva Publicación */}
   <div className={`modal fade ${modalAbierto ? 'show d-block' : ''}`} id="modalNuevaPublicacion" tabIndex="-1" role="dialog" aria-labelledby="modalNuevaPublicacionLabel" aria-hidden={!modalAbierto}>
   <div className="modal-dialog modal-dialog-scrollable" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="modalNuevaPublicacionLabel">Nueva Publicación</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body overflow-auto">
          {/* Formulario para crear una nueva publicación */}
          <div className="form-group">
            <label htmlFor="inputImagenPublicacion">Imagen de la Publicación:</label>
            <input
              type="file"
              id="inputImagenPublicacion"
              name="imagen_publicacion" 
              onChange={(e) => {
                console.log('Evento de cambio disparado');
                cambioImagen(e);
              }}
              accept="image/*"
              style={{ marginBottom: '15px' }}
            />
            {nuevaPublicacion.previewURL && (
              <img
                src={nuevaPublicacion.previewURL}
                alt="Vista previa de la imagen"
                style={{ width: '100%', height: '50%', borderRadius: '8px' }}
              />
            )}

          </div>
          <div className="form-group">
            <label htmlFor="tituloInput">Título:</label>
            <input
              type="text"
              className="form-control"
              id="tituloInput"
              value={nuevaPublicacion.titulo}
              onChange={(e) => setNuevaPublicacion({ ...nuevaPublicacion, titulo: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcionInput">Descripción:</label>
            <textarea
              className="form-control"
              id="descripcionInput"
              value={nuevaPublicacion.descripcion}
              onChange={(e) => setNuevaPublicacion({ ...nuevaPublicacion, descripcion: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="privacidadSelect">Privacidad:</label>
            <select
              className="form-control"
              id="privacidadSelect"
              value={nuevaPublicacion.privacidad}
              onChange={(e) => setNuevaPublicacion({ ...nuevaPublicacion, privacidad: e.target.value })}
            >
              <option value="1">Todo público</option>
              <option value="2">Solo seguidores</option>
              <option value="3">Solo yo</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal"  onClick={() => cerrarModalpublicacion()}>Cerrar</button>
          <button type="button" className="btn btn-primary" onClick={() => handleSubirImagen('publicacion')}>Guardar</button>
        </div>
      </div>
    </div>
  </div>


    </div>
    <hr className="mb-4" />

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

      <div style={{ marginTop: '15px' }}>
      {publicaciones.filter((publicacion) => {
      // Filtrar por título o nombre de usuario
      return (
        publicacion.titulo.toLowerCase().includes(busqueda.toLowerCase())
      );
    }).map((publicacion) => (
        <div className="card mb-4" key={publicacion.idpublicacion}>
          <div className="card-header d-flex justify-content-between align-items-center" >
            <div style={{ width: '70%' }}>
              <h5 className="card-title">{publicacion.titulo}</h5>
              
            </div>
            
            <div className="d-flex align-items-center">
                {publicacion.privacidad == 1 && 
                  <p className="card-subtitle text-muted">Publico</p>
                }
                {publicacion.privacidad == 2 && 
                  <p className="card-subtitle text-muted">Seguidores</p>
                }
                {publicacion.privacidad == 3 && 
                  <p className="card-subtitle text-muted">Solo yo</p>
                }
             
                  <img src="images/candado.png" alt="Foto de Usuario" style={{ cursor: 'pointer', width: '30px', height: '30px', borderRadius: '50%', marginLeft: '10px' }} 
                  onClick={() => handleAbrirSeguirMenu(publicacion.idpublicacion,publicacion.privacidad)}
                  data-toggle="modal"
                  data-target={`#modalSeguir${publicacion.idpublicacion}`}
                  />
                              
                {mostrarSeguirModal[publicacion.idpublicacion] && (
                  <div className="modal fade" id={`modalSeguir${publicacion.idpublicacion}`} tabIndex="-1" role="dialog" aria-labelledby={`modalSeguirLabel${publicacion.idpublicacion}`} aria-hidden="true">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id={`modalSeguirLabel${publicacion.idpublicacion}`}>Configuiracion de privacidad</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          {/* Formulario de configuración de privacidad */}
                            <div className="form-group">
                              <label htmlFor="privacidadSelect">Selecciona quien puede ver la publicacion:</label>
                              <select
                                className="form-control"
                                id="privacidadSelect"
                                value={privacidad || ''}
                                onChange={(e) => setPrivacidad(e.target.value)}
                              >
                                <option value="1">Todo público</option>
                                <option value="2">Solo seguidores</option>
                                <option value="3">Solo yo</option>
                              </select>
                            </div>

                            {/* Botón de guardar */}
                            <button className="btn btn-primary" onClick={() => handlePrivacidad(publicacion.idpublicacion)}>
                              Guardar
                            </button>
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
    </div>
  );
};

export default Perfil;
