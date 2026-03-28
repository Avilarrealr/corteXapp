export const initialStore = () => {
  return {
    user: null,    // Aquí guardaremos los datos de Antonio (full_name, email, etc.)
    token: null,   // Podemos guardar el token también en memoria si quieres
    message: null, // Útil para mostrar notificaciones
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'login_user':
      return {
        ...store,
        user: action.payload // Guardamos el objeto del usuario que viene del backend
      };

    case 'logout_user':
      return {
        ...store,
        user: null,
        token: null
      };

    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    // Cambiamos el 'throw Error' por 'return store' para evitar pantallas blancas
    default:
      return store;
  }
}