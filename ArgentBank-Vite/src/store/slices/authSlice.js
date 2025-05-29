import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


/* INITIAL STATE OF AUTH SLICE */

const initialState = {

  // Etat de connexion 
  isLoggedIn: false,
  // Données utilisateur
  user: null, 
  // Etat de chargement
  isLoading: false, 
  // Gestion des erreurs
  error: null, 
};


/* THUNKS */

// 1. Login thunk : Connexion + Obtention du token pour 1ere connexion 

export const loginUser = createAsyncThunk(
  'auth/login',

  // email, password = payload d'entrée
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {

      // A requête API avec email et password
      const response = await axios.post('/api/v1/user/login', {
        email,
        password,
      });

      // extrait le token de la réponse
      const { token } = response.data.body;

      if (!token) {
        throw new Error('Token manquant dans la réponse API.');
      }

      // stocke le token dans le localStorage
      localStorage.setItem('token', token);

      // B récupère le profil utilisateur
      const profileResponse = await axios.get('/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

    // payload: { token, user: profileResponse.data.body }
      return { token, user: profileResponse.data.body };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur réseau lors de la connexion');
    }
  }
);


// 2. Fetch user profile thunk : Récupération du profil utilisateur

export const fetchUserProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
             // Récupère le token soit depuis le state Redux, soit depuis le localStorage pour authentifier la requête
             const token = getState().auth.token || localStorage.getItem('token');
             if (!token) {
                 
                 throw new Error("Aucun token d'authentification trouvé.");
             }
           
             const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                 method: 'GET', 
                 headers: {
                     'Authorization': `Bearer ${token}`, 
                     'Content-Type': 'application/json', 
                 },
             });

            const data = await response.json();

             if (!response.ok || data.status !== 200) {
                 const errorMessage = data.message || 'Échec de la récupération du profil';
                  throw new Error(errorMessage);
             }

             // payload: { user: data.body }
             return data.body; 

        } catch (error) {
             return rejectWithValue(error.message || 'Erreur lors de la récupération du profil');
        }
    }
);


// 3. Update user profile thunk

export const updateUserProfile = createAsyncThunk(
    'auth/updateProfile',

    // userName = payload d'entrée
    async ({ userName }, { getState, rejectWithValue }) => { 
        try {
            // Récupère le token soit depuis le state Redux, soit depuis le localStorage pour authentifier la requête
             const token = getState().auth.token || localStorage.getItem('token');
              if (!token) {
                  throw new Error("Aucun token d'authentification trouvé.");
             }

             const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                 method: 'PUT', // Swagger dit PUT
                 headers: {
                     'Authorization': `Bearer ${token}`, 
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({ userName }), 
             });

            const data = await response.json();

             if (!response.ok || data.status !== 200) {
                 const errorMessage = data.message || 'Échec de la mise à jour du profil';
                  throw new Error(errorMessage);
             }

             // payload: { user: data.body } avec le nouveau pseudo
             return data.body; 

        } catch (error) {

             return rejectWithValue(error.message || 'Erreur lors de la mise à jour du profil');
        }
    }
);


// 4. Sign up thunk

export const signupUser = createAsyncThunk(
  'auth/signup',

  // userData = payload d'entrée sous forme d'objet { email, password, userName }
  async (userData, { dispatch, rejectWithValue }) => {
    try {

      // A requête signup API
      const response = await axios.post('/api/v1/user/signup', userData);
      
      // B After successful signup, login the user to get the token
      const loginResponse = await axios.post('/api/v1/user/login', {
        email: userData.email,
        password: userData.password,
      });

      // extrait le token de la réponse
      const { token } = loginResponse.data.body;

      if (!token) {
        throw new Error('Token non reçu dans la réponse API.');
      }

      // stocke le token dans le localStorage
      localStorage.setItem('token', token);


      // C Fetch user profile after successful login
      const profileResponse = await axios.get('/api/v1/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // payload: { token, user: profileResponse.data.body }
      return { token, user: profileResponse.data.body };
      
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error during signup');
    }
  }
);


/* AUTH SLICE DEFINITION */

// A Action auth
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: { 

// B Reducers auth/logout
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.isLoading = false;
     localStorage.removeItem('token');
    },
    // efface le message d'erreur d'authentification affiché à l'utilisateur
     clearAuthError: (state) => { state.error = null; },
  },

// C Extra reducers
  extraReducers: (builder) => {
    builder
    
// 1. loginUser

      // loginUser pending
      .addCase(loginUser.pending, (state) => { // Quand le thunk loginUser démarre
        state.isLoading = true; 
        state.error = null; 
      })

      // loginUser fulfilled
      .addCase(loginUser.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.isLoggedIn = true; 
        state.token = action.payload.token; 
        state.user = action.payload.user;
        state.error = null;
      })

      // loginUser rejected
      .addCase(loginUser.rejected, (state, action) => { 
        state.isLoading = false; 
        state.isLoggedIn = false; 
        state.user = null;
        state.token = null;
        state.error = action.payload || 'Erreur login inconnue';
      })

// 2. fetchUserProfile

      // fetchUserProfile pending
       .addCase(fetchUserProfile.pending, (state) => { 
           state.isLoading = true;
           state.error = null;
       })

       // fetchUserProfile fulfilled
       .addCase(fetchUserProfile.fulfilled, (state, action) => { 
            state.isLoading = false;
            state.user = action.payload;
            state.isLoggedIn = true;
             state.error = null;
       })

       // fetchUserProfile rejected
        .addCase(fetchUserProfile.rejected, (state, action) => { 
            state.isLoading = false;
            state.isLoggedIn = false;
            state.user = null;
             // action.payload = error.message => thunk / action.error.message = error.message.message => Redux Toolkit
            state.error = action.payload || action.error.message || 'Échec récupération profil';
            state.token = null; // Enlève le token s'il n'est plus valide
            localStorage.removeItem('token');
        })

 // 3. updateUserProfile

        // updateUserProfile pending
        .addCase(updateUserProfile.pending, (state) => { 
            state.isLoading = true;
            state.error = null;
        })

        // updateUserProfile fulfilled
         .addCase(updateUserProfile.fulfilled, (state, action) => { 
             state.isLoading = false;
             state.user = { ...state.user, ...action.payload }; // On met à jour l'objet user existant avec les nouvelles données
             state.error = null;
         })

         // updateUserProfile rejected
         .addCase(updateUserProfile.rejected, (state, action) => { 
             state.isLoading = false;
             state.error = action.payload || action.error.message || 'Échec mise à jour profil';
         })

 // 4. signupUser

         // signupUser pending
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      // signupUser fulfilled
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })

      // signupUser rejected
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        // action.payload = error.message => thunk
        state.error = action.payload || 'Signup failed';
      });
  },
});


export const { logout, clearAuthError } = authSlice.actions;


export default authSlice.reducer;
