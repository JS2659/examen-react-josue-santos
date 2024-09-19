import { useEffect, useState } from "react";
import axios from "axios";
import { alertaSuccess, alertaError, alertaWarning } from "../funciones";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function CRUD() {
  const [id, setID] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [operation, setOperation] = useState(1);
  const [titleModal, setTitleModal] = useState("");

  const url = "https://api.escuelajs.co/api/v1/categories";

  const getCategoria = async () => {
    const response = await axios.get(url);
    setCategorias(response.data);
  };

  useEffect(() => {
    getCategoria();
  });

  const openModal = (operation, id, name, image) => {
    setID("");
    setName("");
    setImage("");

    if (operation === 1) {
      setTitleModal("Registrar Categoria");
      setOperation(1);
    } else if (operation === 2) {
      setTitleModal("Editar Categoria");
      setOperation(2);
      setID(id);
      setName(name);
      setImage(image);
    }
  };

  const enviarSolicitud = async (url, metodo, parametros = []) => {
    let obj = {
      method: metodo,
      url: url,
      data: parametros,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    await axios(obj)
      .then(() => {
        let mensaje;

        if (metodo === "POST") {
          mensaje = "Se guardo la cateogria con Exito";
        } else if (metodo === "PUT") {
          mensaje = "Se modifico la categoria con Exito";
        } else if (metodo === "DELETE") {
          mensaje = "Se elimino la cateogria con Exito";
        }
        alertaSuccess(mensaje);
        document.getElementById("btnCerrarModal").click();
        getCategoria();
      })
      .catch((error) => {
        alertaError(error.response.data.message);
      });
  };

  const validar = () => {
    let payLoad;
    let metodo;
    let urlAxios;

    if (name === "") {
      alertaWarning("El nombre esta en blanco", "name");
    } else if (image === "") {
      alertaWarning("Es necesario agregar la url de la imagen");
    } else {
      payLoad = {
        name: name,
        image: image,
      };

      if (operation === 1) {
        metodo = "POST";
        urlAxios = "https://api.escuelajs.co/api/v1/categories/";
      } else {
        metodo = "PUT";
        urlAxios = `https://api.escuelajs.co/api/v1/categories/${id}`;
      }

      enviarSolicitud(urlAxios, metodo, payLoad);
    }
  };

  const deleteCategoria = (id) => {
    let urlDelete = `https://api.escuelajs.co/api/v1/categories/${id}`;

    const mySwal = withReactContent(Swal);

    mySwal
      .fire({
        title: "¿Seguro de quere eliminar esta categoria?",
        icon: "question",
        text: "Se borrara de manera definitiva!",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      })
      .then((result) => {
        if (result.isConfirmed) {
          setID(id);
          enviarSolicitud(urlDelete, "DELETE");
        }
      })
      .catch((error) => {
        alertaError(error);
      });
  };

  return (
    <div className="container shadow p-3 mb-5 bg-body-tertiary rounded">
      <div className="row p-1">
        <h2>Categorias</h2>
      </div>
      <div className="row p-1">
        <div className="col-md-4 offset-md-4">
          <div className="d-grid mx-auto">
            <button
              onClick={() => openModal(1)}
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#modalCategoria"
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
      <div className="row align-items-center p-2">
        {categorias.map((categoria, i) => (
          <div className="col-6 col-lg-4">
            <div className="card mx-auto shadow" style={{ width: "18rem"}}>
              <img src={categoria.image} className="img-thumbnail" alt="" />
              <div className="card-body">
                <h5 className="card-title">{categoria.name}</h5>
                <div className="d-grid">
                  <button
                    type="button"
                    className="btn btn-warning m-1"
                    onClick={() =>
                      openModal(
                        2,
                        categoria.id,
                        categoria.name,
                        categoria.image
                      )
                    }
                    data-bs-toggle="modal"
                    data-bs-target="#modalCategoria"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-1"
                    onClick={() => deleteCategoria(categoria.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div id="modalCategoria" className="modal fade" area-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{titleModal}</label>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="close"
                />
              </div>
              <div>
                <div className="modal-body">
                  <input type="hidden" id="id" />
                  <div className="input-group-text">
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="Nombre"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="input-group-text">
                    <input
                      type="text"
                      id="name"
                      className="form-control"
                      placeholder="url imagen"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={() => validar()}>
                    {" "}
                    Guardar
                  </button>
                  <button
                    id="btnCerrarModal"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    {" "}
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CRUD;
